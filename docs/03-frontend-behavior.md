# 03. 기능 구현 지침 — 화면 동작 (프론트엔드)

> `public/index.html`과 `public/app.js`가 **어떻게 움직여야 하는지** 정합니다.
> 디자인 값은 `02-ui-design.md`, 서버 형식은 `04-backend-api.md`를 따릅니다.

---

## 1. 화면 상태 (State)

> **쉽게 말하면:** 화면은 항상 아래 4가지 상태 중 **딱 하나**입니다.

| 상태 | 이름 | 입력창 | 주 버튼 | 다른 이름 보기 | 오류 안내 | 결과 영역 |
|---|---|---|---|---|---|---|
| 대기 | `idle` | 사용 가능 | 입력 검사에 따라 | 숨김 | 숨김 | 숨김 |
| 짓는 중 | `loading` | `readonly` | 비활성 | 비활성 | 숨김 | 이전 결과가 있으면 그대로 보임 |
| 성공 | `success` | 사용 가능 | 입력 검사에 따라 | 활성 | 숨김 | **보임** |
| 실패 | `error` | 사용 가능 | 입력 검사에 따라 | 이전 결과가 있으면 활성 | **보임** | 이전 결과가 있으면 그대로 보임 |

상태 변화:
```
idle ──(이름 지어 주세요)──▶ loading
success ──(다른 이름 보기 / 이름 지어 주세요)──▶ loading
loading ──(성공)──▶ success   (결과를 새 5개로 교체)
loading ──(오류)──▶ error     (이전 결과는 유지)
error ──(입력 수정)──▶ 오류 안내만 숨김 (결과가 있으면 success, 없으면 idle)
```

- 상태는 `app.js`의 변수 하나(`let state = 'idle'`)로 관리하고, 화면 갱신은 `render()` 함수 하나에서만 합니다.

### 1.1 함께 관리하는 값

| 변수 | 타입 | 의미 |
|---|---|---|
| `currentSurname` | string | 마지막으로 이름을 지은 성 |
| `shownNames` | string[] | 이 성으로 지금까지 화면에 나온 **이름 부분**(성 제외, 예: `희영`). 최대 30개, 넘으면 오래된 것부터 버림 |
| `names` | object[] | 지금 화면에 보이는 5개 |

- 입력한 성이 `currentSurname`과 **다르면** 요청 전에 `shownNames`를 빈 배열로 초기화합니다.

---

## 2. HTML 요소 ID (이 이름 그대로)

| ID | 요소 | 용도 |
|---|---|---|
| `surname-input` | `<input>` | 성 입력 |
| `surname-hint` | `<p>` | 입력 안내 / 잘못된 입력 안내 |
| `generate-btn` | `<button>` | 이름 지어 주세요 |
| `error-box` | `<div role="alert">` | 오류 안내 상자 |
| `error-message` | `<p>` (error-box 안) | 오류 문장 |
| `results` | `<section aria-live="polite">` | 결과 영역 |
| `name-list` | `<ul>` | 이름 카드 목록 |
| `regenerate-btn` | `<button>` | 다른 이름 보기 |

- 숨김은 `hidden` 속성으로 처리합니다.
- `<script type="module" src="app.js"></script>`를 `</body>` 바로 앞에 둡니다.

---

## 3. 화면 문구 (글자 그대로)

| 위치 | 문구 |
|---|---|
| `<title>` | `네임 브루 · AI 이름 짓기` |
| 주 버튼 (기본) | `이름 지어 주세요` |
| 다른 이름 보기 (기본) | `다른 이름 보기` |
| 로딩 중인 버튼 | `이름 짓는 중...` |
| 입력 안내 (기본) | `한글 성 1~2글자를 입력해 주세요 (예: 안, 남궁)` |
| 입력 안내 (잘못된 입력) | `한글로 된 성 1~2글자만 입력할 수 있어요.` |

---

## 4. 동작 상세

### 4.1 입력 검사 (F1)
- `input` 이벤트마다 `value.trim()`을 정규식 `/^[가-힣]{1,2}$/`로 검사합니다.
- 통과 → 주 버튼 활성, 안내 문구 기본, `.is-invalid` 제거.
- 빈칸 → 주 버튼 비활성, 안내 문구 기본 (빨간색 아님).
- 그 외(영어, 숫자, 자음만, 3글자 이상) → 주 버튼 비활성, `.is-invalid` + 잘못된 입력 문구.
- 한글 입력기(IME)로 글자를 조합하는 중(`event.isComposing === true`)에는 잘못된 입력 안내를 띄우지 않습니다. 조합이 끝난 뒤(`compositionend`) 다시 검사합니다.
- 상태가 `error`이면 입력할 때 오류 안내를 숨깁니다.

### 4.2 이름 요청 (F2, F4)

`generate()` 함수 하나로 두 버튼을 모두 처리합니다.

- **주 버튼 클릭** 또는 입력창에서 `Enter`(조합 중이 아닐 때) → `generate()`
- **다른 이름 보기 클릭** → `generate()` (성은 `currentSurname` 사용)

순서:
1. `state === 'loading'`이면 아무것도 하지 않음 (중복 방지).
2. 성 검사. 실패하면 서버에 보내지 않고 `INVALID_SURNAME` 오류 표시.
3. 성이 `currentSurname`과 다르면 `shownNames = []`, `currentSurname = 새 성`.
4. 상태 `loading`.
5. 요청:
   ```js
   const controller = new AbortController();
   const timer = setTimeout(() => controller.abort(), 20000); // 20초

   const res = await fetch('/api/generate', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ surname, exclude: shownNames }),
     signal: controller.signal,
   });
   ```
6. 응답 처리:
   - JSON 읽기 실패 → `INVALID_RESPONSE`
   - `body.ok === true` → 4.3 검사 후 `success`
   - `body.ok === false` → `body.error.code`의 문구 표시 (모르는 코드면 `UNKNOWN`)
7. 예외: `AbortError` → `CLIENT_TIMEOUT`, 그 외 fetch 실패 → `NETWORK_ERROR`
8. `clearTimeout(timer)`

### 4.3 결과 표시 (F3)

서버의 `data.names`를 넣기 전에 확인합니다.

| 조건 | 어기면 |
|---|---|
| 배열이고 길이가 정확히 5 | `INVALID_RESPONSE` |
| 각 항목의 `fullName`이 `currentSurname`으로 시작 | `INVALID_RESPONSE` |
| 각 항목의 `givenName`, `vibe`가 빈 문자열 아님 | `INVALID_RESPONSE` |

표시:
- `#name-list`의 기존 내용을 모두 지우고(`replaceChildren()`) 5개 `<li class="name-card">`를 새로 만듭니다.
- 요소는 `document.createElement`로 만들고 글자는 **`textContent`로만** 넣습니다. `innerHTML` 금지.
- 카드 i번째(0부터)에 `style.animationDelay = (i * 0.06) + 's'`.
- 받은 `givenName` 5개를 `shownNames` 뒤에 추가하고, 30개를 넘으면 앞에서부터 잘라냅니다.
- 처음 결과가 나타날 때만 결과 영역으로 스크롤합니다 (`scrollIntoView({ behavior: 'smooth', block: 'nearest' })`, 움직임 줄이기 설정이면 `'auto'`).

### 4.4 오류 표시 (F5)
- `#error-message.textContent = ERROR_MESSAGES[code]`, `#error-box.hidden = false`.
- 입력한 성과 이전 결과는 **지우지 않습니다.**
- `ERROR_MESSAGES`는 `05-error-handling.md` 표와 같은 객체로 `app.js` 안에 둡니다. 서버 `message`보다 이 객체 문구를 우선합니다.

---

## 5. 하지 말 것
- `localStorage`/`sessionStorage`/쿠키 사용
- 입력하는 동안 자동으로 이름 짓기
- `alert()`, `confirm()` 팝업
- 외부 JS 라이브러리
- 이름 복사·공유·저장 버튼 추가

---

## 6. 완료 기준
- [ ] 2번 표의 ID가 `index.html`에 모두 있고 철자가 같다.
- [ ] 로딩 중 버튼을 연타해도 요청은 1번만 간다.
- [ ] 잘못된 성(`ahn`, `안1`, `안태수`)은 서버에 요청하지 않는다.
- [ ] "다른 이름 보기"를 3번 눌러도 화면에 나온 이름이 겹치지 않는다.
- [ ] 성을 바꾸면 제외 목록이 초기화된다 (Network 탭에서 `exclude: []` 확인).
- [ ] 오류가 나도 이전 이름 카드와 입력한 성이 남아 있다.
- [ ] `public/app.js`에 `innerHTML`이 없다.

## 7. 검증 방법
```bash
grep -n "innerHTML" public/app.js       # 결과 없음
grep -n "localStorage" public/app.js    # 결과 없음
```
- 개발자도구 → **Network** → `generate` 요청 클릭 → **Payload**에서 `surname`, `exclude` 값 확인.
- 개발자도구 → **Network** → `Offline` → 다른 이름 보기 → `NETWORK_ERROR` 문구 + 이전 결과 유지 확인.
