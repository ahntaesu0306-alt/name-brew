import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseModelOutput, pickMoods, buildUserMessage, MOOD_WORDS,
} from '../lib/naming.js';

// 테스트용 AI 응답 만들기 도우미
const GOOD = ['희영', '세영', '태훈', '다온', '지후', '서윤', '민재', '하람'];
function makeRaw(givenNames, vibe = '밝고 부드러운 인상') {
  return JSON.stringify({ names: givenNames.map((g) => ({ given_name: g, vibe })) });
}

// ── parseModelOutput ──
test('P1: 정상 후보 8개면 앞 5개, fullName은 성+이름', () => {
  const result = parseModelOutput(makeRaw(GOOD), '안', []);
  assert.equal(result.length, 5);
  assert.deepEqual(result.map((n) => n.givenName), GOOD.slice(0, 5));
  result.forEach((n) => assert.equal(n.fullName, '안' + n.givenName));
});

test('P2: 3글자·영어 후보는 제외', () => {
  const raw = makeRaw(['안희영', 'Hee', '세영', '태훈', '다온', '지후', '서윤', '민재']);
  const result = parseModelOutput(raw, '안', []);
  assert.deepEqual(result.map((n) => n.givenName), ['세영', '태훈', '다온', '지후', '서윤']);
});

test('P3: 제외 목록에 있는 이름은 빠짐', () => {
  const result = parseModelOutput(makeRaw(GOOD), '안', ['희영']);
  assert.ok(!result.some((n) => n.givenName === '희영'));
  assert.equal(result.length, 5);
});

test('P4: 중복 이름은 한 번만', () => {
  const raw = makeRaw(['희영', '희영', '세영', '태훈', '다온', '지후', '서윤', '민재']);
  const result = parseModelOutput(raw, '안', []);
  assert.equal(result.filter((n) => n.givenName === '희영').length, 1);
  assert.equal(result.length, 5);
});

test('P5: 쓸 수 있는 후보가 4개뿐이면 AI_INVALID_RESPONSE', () => {
  const raw = makeRaw(['희영', '세영', '태훈', '다온', 'A', 'B', '안태수다', '1']);
  assert.throws(() => parseModelOutput(raw, '안', []), { code: 'AI_INVALID_RESPONSE' });
});

test('P6: vibe가 공백뿐인 후보는 제외', () => {
  const raw = JSON.stringify({
    names: [{ given_name: '희영', vibe: '   ' }, ...GOOD.slice(1).map((g) => ({ given_name: g, vibe: '맑은 느낌' }))],
  });
  const result = parseModelOutput(raw, '안', []);
  assert.ok(!result.some((n) => n.givenName === '희영'));
});

test('P7: vibe 40자는 30자 + … 로 자름', () => {
  const result = parseModelOutput(makeRaw(GOOD, '가'.repeat(40)), '안', []);
  assert.equal(result[0].vibe.length, 31);
  assert.ok(result[0].vibe.endsWith('…'));
});

test('P8: JSON이 아니면 AI_INVALID_RESPONSE', () => {
  assert.throws(() => parseModelOutput('not json', '안', []), { code: 'AI_INVALID_RESPONSE' });
});

test('P9: 빈 문자열이면 AI_INVALID_RESPONSE', () => {
  assert.throws(() => parseModelOutput('', '안', []), { code: 'AI_INVALID_RESPONSE' });
});

test('P10: names가 배열이 아니면 AI_INVALID_RESPONSE', () => {
  assert.throws(() => parseModelOutput('{"names":"x"}', '안', []), { code: 'AI_INVALID_RESPONSE' });
});

test('P11: 두 글자 성도 fullName 앞에 붙음', () => {
  const result = parseModelOutput(makeRaw(GOOD), '남궁', []);
  result.forEach((n) => assert.ok(n.fullName.startsWith('남궁')));
});

// ── pickMoods ──
test('R1: 100번 뽑아도 항상 서로 다른 키워드 2개', () => {
  for (let i = 0; i < 100; i += 1) {
    const moods = pickMoods();
    assert.equal(moods.length, 2);
    assert.notEqual(moods[0], moods[1]);
    moods.forEach((m) => assert.ok(MOOD_WORDS.includes(m)));
  }
});

test('R2: rng가 항상 0이어도 무한 반복 없이 2개', () => {
  const moods = pickMoods(() => 0);
  assert.equal(moods.length, 2);
  assert.notEqual(moods[0], moods[1]);
});

// ── buildUserMessage ──
test('B1: 제외 목록이 없으면 "없음", 성별 any는 "상관없음"', () => {
  assert.equal(
    buildUserMessage('안', 'any', [], ['밝은', '차분한']),
    '성: 안\n성별: 상관없음\n제외할 이름: 없음\n이번 분위기 키워드: 밝은, 차분한',
  );
});

test('B2: 제외 목록은 쉼표로 연결', () => {
  const lines = buildUserMessage('안', 'any', ['희영', '세영'], ['맑은', '우아한']).split('\n');
  assert.equal(lines[2], '제외할 이름: 희영, 세영');
});

test('B3: male은 "남자", female은 "여자"', () => {
  assert.equal(buildUserMessage('안', 'male', [], ['밝은', '맑은']).split('\n')[1], '성별: 남자');
  assert.equal(buildUserMessage('안', 'female', [], ['밝은', '맑은']).split('\n')[1], '성별: 여자');
});
