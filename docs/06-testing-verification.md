# 06. 테스트·검증 지침

> **테스트**는 "코드가 약속대로 움직이는지" 자동으로 확인하는 작은 프로그램입니다.
> Node.js 내장 `node --test`만 사용합니다 (추가 설치 없음). OpenAI는 실제로 부르지 않으므로 비용 0원입니다.

---

## 1. 자동 테스트 (`npm test`)

### 1.1 `tests/validate.test.js`

**`validateSurname`**
| # | 입력 | 기대 |
|---|---|---|
| V1 | `'안'` | `'안'` |
| V2 | `'  안 '` | `'안'` (공백 제거) |
| V3 | `'남궁'` | `'남궁'` |
| V4 | `''` | `EMPTY_SURNAME` |
| V5 | `'   '` | `EMPTY_SURNAME` |
| V6 | `'ahn'` | `INVALID_SURNAME` |
| V7 | `'안1'` | `INVALID_SURNAME` |
| V8 | `'ㅇ'` | `INVALID_SURNAME` |
| V9 | `'안태수'` | `INVALID_SURNAME` |
| V10 | `undefined` | `INVALID_REQUEST` |
| V11 | `123` | `INVALID_REQUEST` |

**`normalizeExclude`**
| # | 입력 | 기대 |
|---|---|---|
| E1 | `undefined` | `[]` |
| E2 | `'희영'` (배열 아님) | `[]` |
| E3 | `['희영', 'abc', 3, '안태수', ' 세영 ']` | `['희영', '세영']` |
| E4 | `['희영', '희영']` | `['희영']` |
| E5 | 서로 다른 유효 이름 35개 | 마지막 30개 |

**`normalizeGender`**
| # | 입력 | 기대 |
|---|---|---|
| G1 | `undefined` | `'any'` |
| G2 | `'male'`, `'female'`, `'any'` | 그대로 |
| G3 | `'남자'`, `1` | `INVALID_REQUEST` |

### 1.2 `tests/naming.test.js`

**`parseModelOutput(raw, surname, exclude)`** — 테스트용 후보 8개를 만드는 도우미 함수를 파일 안에 둡니다.

| # | 상황 | 기대 |
|---|---|---|
| P1 | 정상 후보 8개 | 앞 5개 반환, `fullName`이 `'안' + givenName` |
| P2 | 후보 중 `'안희영'`(3글자), `'Hee'` 포함 + 정상 6개 | 잘못된 것 빼고 5개 |
| P3 | 후보에 `exclude`의 `'희영'` 포함 | `'희영'` 없음 |
| P4 | 같은 이름 2번 포함 | 1번만 |
| P5 | 정상 후보가 4개뿐 | `AI_INVALID_RESPONSE` |
| P6 | `vibe`가 `'   '`인 후보 | 그 후보 제외 |
| P7 | `vibe`가 40자 | 31자 (30자 + `…`) |
| P8 | `'not json'` | `AI_INVALID_RESPONSE` |
| P9 | `''` | `AI_INVALID_RESPONSE` |
| P10 | `'{"names":"x"}'` | `AI_INVALID_RESPONSE` |
| P11 | 성 `'남궁'` + 정상 후보 | `fullName`이 `'남궁'`으로 시작 |

**`pickMoods(rng)`**
| # | 상황 | 기대 |
|---|---|---|
| R1 | `pickMoods()` 100번 | 매번 길이 2, 서로 다른 값, 모두 `MOOD_WORDS` 안의 값 |
| R2 | `rng`로 항상 `0`을 주는 함수 | 무한 반복 없이 길이 2 반환 |

**`buildUserMessage`**
| # | 입력 | 기대 (줄바꿈 `\n`) |
|---|---|---|
| B1 | `('안', 'any', [], ['밝은','차분한'])` | `성: 안` / `성별: 상관없음` / `제외할 이름: 없음` / `이번 분위기 키워드: 밝은, 차분한` |
| B2 | `('안', 'any', ['희영','세영'], ['맑은','우아한'])` | 셋째 줄이 `제외할 이름: 희영, 세영` |
| B3 | 성별 `'male'` / `'female'` | 둘째 줄이 `성별: 남자` / `성별: 여자` |

### 1.3 작성 형식 (예시)
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateSurname } from '../lib/validate.js';

test('V6: 영어 성은 INVALID_SURNAME', () => {
  assert.throws(() => validateSurname('ahn'), { code: 'INVALID_SURNAME' });
});
```
- 테스트 이름 앞에 표 번호를 붙입니다. **V1~V11, E1~E5, G1~G3, P1~P11, R1~R2, B1~B3 총 35개**를 모두 작성합니다.

---

## 2. 정적 점검 (결과가 없어야 통과)

```bash
grep -rn "sk-" public/ api/ lib/          # API 키
grep -rn "openai" public/                 # 프론트에서 OpenAI 직접 호출
grep -rn "innerHTML" public/              # 보안
grep -rni "starbucks\|스타벅스" public/ api/ lib/   # 상표
```

---

## 3. 수동 검증 체크리스트 (`npm run dev` 후 브라우저에서)

### 기능
- [ ] M1. `안` → `안`으로 시작하는 이름 카드 5개, 각각 느낌 한 줄
- [ ] M2. `김` → `김`으로 시작하는 이름 5개
- [ ] M3. `남궁` → `남궁`으로 시작하는 이름 5개
- [ ] M4. `안`에서 "다른 이름 보기" 3번 → 지금까지 나온 15~20개 이름이 서로 겹치지 않음
- [ ] M5. 성을 `안` → `김`으로 바꿔 요청 → Network Payload의 `exclude`가 `[]`
- [ ] M6. 입력창에서 `Enter`로 요청됨 (한글 조합 중 Enter로 두 번 요청되지 않음)
- [ ] M7. 성별 '상관없음'이면 남자·여자·중성적인 이름이 섞여 나옴
- [ ] M7-1. 성별 '여자' → 5개 모두 여자 이름 / '남자' → 5개 모두 남자 이름
- [ ] M7-2. 결과가 나온 뒤 성별을 바꾸고 '다른 이름 보기' → 바뀐 성별로 나오고 Payload `exclude`가 `[]`

### 입력·오류
- [ ] M8. 빈칸 → 버튼 비활성, 안내 문구 기본색
- [ ] M9. `ahn`, `안1`, `안태수` → 버튼 비활성, 빨간 안내 문구, 요청 없음
- [ ] M10. 로딩 중 버튼 연타 → Network에 요청 1개
- [ ] M11. 결과가 나온 뒤 Offline → 다른 이름 보기 → `인터넷 연결을 확인한 뒤 다시 시도해 주세요.` + 이전 카드 유지
- [ ] M12. `docs/05-error-handling.md` 4번 표의 오류 만들기 모두 문구 일치

### 디자인·반응형
- [ ] M13. 360px: 가로 스크롤 없음, 입력 줄 세로, 카드 1열
- [ ] M14. 768px: 카드 2열 / 1440px: 카드 3열, 본문 720px 이내
- [ ] M15. 글꼴 Pretendard
- [ ] M16. 버튼이 알약 모양, 누를 때 살짝 작아짐
- [ ] M17. Tab 키만으로 입력 → 이름 짓기 → 다른 이름 보기까지 가능, 포커스 테두리 보임

---

## 4. 완료 기준
- [ ] `npm test` → 35개 통과, 실패 0개
- [ ] 2번 정적 점검 4개 모두 결과 없음
- [ ] 3번 M1~M17 모두 통과
- [ ] 배포 주소에서 M1, M3, M4, M11 다시 통과

> 이름 품질이 기대와 다르면 코드를 고치기 전에 `SYSTEM_PROMPT`가 04 문서와 글자 그대로인지 먼저 확인합니다. 지시문을 임의로 바꾸지 말고 작업 보고에 적습니다.
