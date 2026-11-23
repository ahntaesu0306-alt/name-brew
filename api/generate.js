import { AppError, ERRORS } from '../lib/errors.js';
import { validateSurname, normalizeExclude } from '../lib/validate.js';
import { createClient, generateNames } from '../lib/naming.js';

const DEFAULT_MODEL = 'gpt-5.4-mini';

function send(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).send(JSON.stringify(body));
}

function readBody(req) {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      throw new AppError('INVALID_REQUEST');
    }
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new AppError('INVALID_REQUEST');
  }
  return body;
}

// OpenAI SDK 오류를 우리 오류 코드로 바꿈. 시간 초과가 연결 오류의 한 종류라 먼저 검사
export function toAppError(err) {
  if (err instanceof AppError) return err;
  const name = err?.constructor?.name;
  if (name === 'APIConnectionTimeoutError') return new AppError('TIMEOUT');
  if (name === 'APIConnectionError') return new AppError('AI_UNAVAILABLE');
  const status = err?.status;
  if (status === 401) return new AppError('SERVER_CONFIG');
  if (status === 429 && err.code === 'insufficient_quota') return new AppError('QUOTA_EXCEEDED');
  if (status === 429) return new AppError('RATE_LIMITED');
  if (status === 404 || status === 400) return new AppError('SERVER_CONFIG');
  if (typeof status === 'number' && status >= 500) return new AppError('AI_UNAVAILABLE');
  return new AppError('UNKNOWN');
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      throw new AppError('METHOD_NOT_ALLOWED');
    }
    const body = readBody(req);
    const surname = validateSurname(body.surname);
    const exclude = normalizeExclude(body.exclude);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new AppError('SERVER_CONFIG');

    const client = await createClient(apiKey);
    const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
    const names = await generateNames(surname, exclude, { client, model });

    send(res, 200, { ok: true, data: { surname, names } });
  } catch (err) {
    const appError = toAppError(err);
    // 사용자 입력·결과는 남기지 않고 코드와 상태 번호만 기록
    const upstreamStatus = err instanceof AppError ? undefined : err?.status;
    console.error('[generate]', appError.code, { upstreamStatus });
    send(res, appError.status, {
      ok: false,
      error: { code: appError.code, message: ERRORS[appError.code].message },
    });
  }
}
