import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateSurname, normalizeExclude } from '../lib/validate.js';

// ── validateSurname ──
test('V1: 한 글자 성', () => {
  assert.equal(validateSurname('안'), '안');
});

test('V2: 앞뒤 공백 제거', () => {
  assert.equal(validateSurname('  안 '), '안');
});

test('V3: 두 글자 성', () => {
  assert.equal(validateSurname('남궁'), '남궁');
});

test('V4: 빈 문자열은 EMPTY_SURNAME', () => {
  assert.throws(() => validateSurname(''), { code: 'EMPTY_SURNAME' });
});

test('V5: 공백만 있으면 EMPTY_SURNAME', () => {
  assert.throws(() => validateSurname('   '), { code: 'EMPTY_SURNAME' });
});

test('V6: 영어 성은 INVALID_SURNAME', () => {
  assert.throws(() => validateSurname('ahn'), { code: 'INVALID_SURNAME' });
});

test('V7: 숫자 섞이면 INVALID_SURNAME', () => {
  assert.throws(() => validateSurname('안1'), { code: 'INVALID_SURNAME' });
});

test('V8: 자음만 있으면 INVALID_SURNAME', () => {
  assert.throws(() => validateSurname('ㅇ'), { code: 'INVALID_SURNAME' });
});

test('V9: 세 글자는 INVALID_SURNAME', () => {
  assert.throws(() => validateSurname('안태수'), { code: 'INVALID_SURNAME' });
});

test('V10: undefined는 INVALID_REQUEST', () => {
  assert.throws(() => validateSurname(undefined), { code: 'INVALID_REQUEST' });
});

test('V11: 숫자는 INVALID_REQUEST', () => {
  assert.throws(() => validateSurname(123), { code: 'INVALID_REQUEST' });
});

// ── normalizeExclude ──
test('E1: undefined는 빈 배열', () => {
  assert.deepEqual(normalizeExclude(undefined), []);
});

test('E2: 배열이 아니면 빈 배열', () => {
  assert.deepEqual(normalizeExclude('희영'), []);
});

test('E3: 잘못된 항목은 버리고 공백은 제거', () => {
  assert.deepEqual(normalizeExclude(['희영', 'abc', 3, '안태수', ' 세영 ']), ['희영', '세영']);
});

test('E4: 중복 제거', () => {
  assert.deepEqual(normalizeExclude(['희영', '희영']), ['희영']);
});

test('E5: 35개면 마지막 30개만', () => {
  // 서로 다른 유효 이름 35개 만들기 (가윤, 나윤, ...)
  const syllables = '가나다라마바사아자차카타파하거너더러머버서어저처커터퍼허고노도로모보소오조';
  const input = [...syllables].slice(0, 35).map((s) => s + '윤');
  assert.equal(input.length, 35);
  const result = normalizeExclude(input);
  assert.equal(result.length, 30);
  assert.deepEqual(result, input.slice(-30));
});
