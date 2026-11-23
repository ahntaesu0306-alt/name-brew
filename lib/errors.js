// 오류 코드표 — docs/05-error-handling.md 1.1 표와 글자 그대로 일치해야 함
export const ERRORS = {
  EMPTY_SURNAME: { status: 400, message: '성을 입력해 주세요.' },
  INVALID_SURNAME: { status: 400, message: '한글로 된 성 1~2글자만 입력할 수 있어요.' },
  INVALID_REQUEST: { status: 400, message: '요청 형식이 올바르지 않아요. 페이지를 새로고침한 뒤 다시 시도해 주세요.' },
  METHOD_NOT_ALLOWED: { status: 405, message: '지원하지 않는 요청 방식이에요.' },
  RATE_LIMITED: { status: 429, message: '요청이 많아 잠시 쉬어 가는 중이에요. 30초 뒤 다시 시도해 주세요.' },
  QUOTA_EXCEEDED: { status: 503, message: '지금은 이름 짓기 서비스를 이용할 수 없어요. 관리자에게 문의해 주세요.' },
  SERVER_CONFIG: { status: 500, message: '서비스 설정에 문제가 있어요. 관리자에게 문의해 주세요.' },
  TIMEOUT: { status: 504, message: '이름을 짓는 데 너무 오래 걸렸어요. 잠시 뒤 다시 시도해 주세요.' },
  AI_UNAVAILABLE: { status: 502, message: 'AI 서비스에 연결할 수 없어요. 잠시 뒤 다시 시도해 주세요.' },
  AI_INVALID_RESPONSE: { status: 502, message: '알맞은 이름을 찾지 못했어요. 한 번 더 눌러 주세요.' },
  UNKNOWN: { status: 500, message: '알 수 없는 오류가 발생했어요. 잠시 뒤 다시 시도해 주세요.' },
};

export class AppError extends Error {
  constructor(code) {
    super(code);
    this.code = code;
    this.status = ERRORS[code]?.status ?? 500;
  }
}
