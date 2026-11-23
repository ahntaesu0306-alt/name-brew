import { AppError } from './errors.js';

// 한글 완성형 1~2글자 (예: 안, 남궁)
export const HANGUL_1_2 = /^[가-힣]{1,2}$/;
const MAX_EXCLUDE = 30;

export function validateSurname(input) {
  if (typeof input !== 'string') throw new AppError('INVALID_REQUEST');
  const surname = input.trim();
  if (surname.length === 0) throw new AppError('EMPTY_SURNAME');
  if (!HANGUL_1_2.test(surname)) throw new AppError('INVALID_SURNAME');
  return surname;
}

// 제외 목록은 부가 정보라 잘못된 값이 와도 오류 대신 조용히 걸러냄
export function normalizeExclude(input) {
  if (!Array.isArray(input)) return [];
  const valid = input
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => HANGUL_1_2.test(item));
  const unique = [...new Set(valid)];
  return unique.slice(-MAX_EXCLUDE);
}
