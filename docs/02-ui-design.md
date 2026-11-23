# 02. UI 구현 지침

> 첨부된 디자인 시스템(따뜻한 카페 분위기)을 **네임 브루**에 맞게 정리한 문서입니다.
> 분위기만 참고하며, 스타벅스 이름·로고·상표는 쓰지 않습니다.
> **여기 적힌 값만 사용합니다.** 새로운 색상, 글꼴, 그림자 값을 만들지 않습니다.

---

## 1. 디자인 분위기 한 줄 정리

**"깨끗한 카페 메뉴판"** — 따뜻한 크림색 바탕, 차분한 초록색, 동글동글한 알약 모양 버튼, 아주 은은한 그림자. 화려하지 않고 읽기 편해야 합니다.

| 원칙 | 의미 |
|---|---|
| 흰색 대신 크림색 바탕 | 페이지 배경은 `#f2f0eb`. 순수 흰색은 카드에만 |
| 초록은 역할별로 4단계 | 제목·버튼·띠·장식에 각각 정해진 초록만 사용 |
| 버튼은 전부 알약 모양 | `border-radius: 50px`, 예외 없음 |
| 그림자는 얇게 여러 겹 | 진한 그림자 1개 대신 연한 그림자 2~3개 |
| 그라데이션 금지 | 모든 면은 단색 |
| 금색(골드) 사용 금지 | 원본에서 금색은 특수 용도 전용이므로 이 서비스에서는 쓰지 않음 |

---

## 2. 글꼴

### 2.1 선택한 글꼴: **Pretendard Variable**

- 원본 디자인의 전용 글꼴(SoDoSans)은 공개되지 않아 쓸 수 없습니다.
- 원본 문서가 대체 글꼴로 추천한 **Inter**를 바탕으로 만든 한국어 글꼴이 **Pretendard**입니다. 영어는 Inter와 같은 단정한 모양, 한글은 깔끔하고 친근한 고딕이라 카페 메뉴판 같은 느낌과 잘 맞습니다.
- 무료(SIL Open Font License)이며 상업적 사용이 가능합니다.

### 2.2 불러오는 방법 (`index.html`의 `<head>`에 그대로)

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
```

### 2.3 글꼴 지정 (`styles.css`)

```css
--font-sans: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont,
  'Apple SD Gothic Neo', 'Malgun Gothic', 'Helvetica Neue', Arial, sans-serif;
```

- 다른 글꼴(세리프, 손글씨체 등)은 쓰지 않습니다. 원본도 "한 화면에 한 글꼴"이 원칙입니다.
- 글자 사이 간격은 전체적으로 `letter-spacing: -0.01em` (살짝 좁게)을 적용합니다.

---

## 3. 디자인 토큰 (`styles.css` 맨 위 `:root`에 그대로)

> **토큰**은 디자인 값에 붙인 이름표입니다. 코드에서는 `#00754A` 대신 `var(--color-green-accent)`처럼 이름으로만 씁니다.

```css
:root {
  /* ── 초록 4단계 + 연한 초록 ── */
  --color-green-brand: #006241;   /* 큰 제목(h1), 로고 글자 */
  --color-green-accent: #00754A;  /* 주 버튼 배경, 포커스 테두리, 이름 카드 윗줄 */
  --color-green-house: #1E3932;   /* 상단 히어로 띠, 하단 바 배경 */
  --color-green-uplift: #2b5148;  /* 장식용 (이번 범위에서는 거의 사용 안 함) */
  --color-green-light: #d4e9e2;   /* 이름 카드에 마우스를 올렸을 때 배경 */

  /* ── 바탕 ── */
  --color-canvas: #f2f0eb;        /* 페이지 배경 (크림) */
  --color-ceramic: #edebe9;       /* 구분 영역 */
  --color-white: #ffffff;         /* 카드 배경 */

  /* ── 글자 ── */
  --color-text: rgba(0, 0, 0, 0.87);       /* 기본 글자 (순수 검정 금지) */
  --color-text-soft: rgba(0, 0, 0, 0.58);  /* 보조 글자 */
  --color-text-on-dark: #ffffff;           /* 진한 초록 위 글자 */
  --color-text-on-dark-soft: rgba(255, 255, 255, 0.70);

  /* ── 상태 ── */
  --color-red: #c82014;                    /* 오류, 잘못된 입력 안내 */
  --color-red-tint: rgba(200, 32, 20, 0.06); /* 오류 배경 */
  --color-border: #d6dbde;                 /* 입력창 테두리 */

  /* ── 글꼴 ── */
  --font-sans: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont,
    'Apple SD Gothic Neo', 'Malgun Gothic', 'Helvetica Neue', Arial, sans-serif;
  --tracking: -0.01em;

  /* ── 여백 (4px 단위) ── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;   /* 기본 여백 */
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 40px;
  --space-7: 48px;
  --space-9: 64px;

  /* ── 모서리 ── */
  --radius-card: 12px;
  --radius-pill: 50px;
  --radius-input: 4px;

  /* ── 그림자 (얇게 여러 겹) ── */
  --shadow-card: 0 0 0.5px rgba(0, 0, 0, 0.14), 0 1px 1px rgba(0, 0, 0, 0.24);
  --shadow-nav: 0 1px 3px rgba(0, 0, 0, 0.1), 0 2px 2px rgba(0, 0, 0, 0.06), 0 0 2px rgba(0, 0, 0, 0.07);

  /* ── 움직임 ── */
  --transition-fast: all 0.2s ease;
  --press-scale: scale(0.95);

  /* ── 최대 너비 ── */
  --content-max: 720px;
}
```

---

## 4. 글자 크기 규칙

| 용도 | 크기 | 굵기 | 줄 간격 | 색 |
|---|---|---|---|---|
| 히어로 제목 | 32px (모바일 24px) | 600 | 1.3 | `--color-text-on-dark` |
| 히어로 부제 | 17px (모바일 15px) | 400 | 1.6 | `--color-text-on-dark-soft` |
| 카드 제목 (h2) | 20px | 600 | 1.4 | `--color-green-brand` |
| 결과 이름 ("안희영") | 26px | 700 | 1.2 | `--color-green-brand` |
| 결과 느낌 한 줄 | 14px | 400 | 1.5 | `--color-text-soft` |
| 본문 | 16px | 400 | 1.6 | `--color-text` |
| 보조 글 (글자 수, 안내) | 14px | 400 | 1.5 | `--color-text-soft` |
| 버튼 글자 | 16px | 600 | 1.2 | 버튼별 지정 |

- 제목끼리는 **크기보다 굵기와 색으로** 구분합니다 (원본 원칙).
- `body`에 `font-family: var(--font-sans); letter-spacing: var(--tracking); color: var(--color-text); background: var(--color-canvas);`를 지정합니다.

---

## 5. 페이지 레이아웃 (위에서 아래 순서)

원본의 **"크림 → 흰 카드 → 진한 초록 띠"** 리듬을 따릅니다.

| 순서 | 영역 | 요소 | 배경 | 내용 |
|---|---|---|---|---|
| 1 | 상단 바 | `<header class="topbar">` | `--color-white` + `--shadow-nav` | 왼쪽: `☕ 네임 브루` (20px, 700, `--color-green-brand`). 높이 64px |
| 2 | 히어로 | `<section class="hero">` | `--color-green-house` | 제목 `성만 알려 주세요, 이름은 제가 내릴게요` / 부제 `성을 입력하면 AI가 어울리는 이름 5개를 지어 드려요.` 위아래 여백 `--space-9` |
| 3 | 본문 | `<main class="container">` | `--color-canvas` | 최대 너비 `--content-max`, 가운데 정렬, 좌우 여백 `--space-3` (PC는 `--space-6`) |
| 3-1 | 입력 카드 | `<section class="card input-card">` | `--color-white` | 6.2 참고. 히어로와 겹치도록 `margin-top: -32px` |
| 3-2 | 오류 안내 | `<div class="alert" role="alert">` | `--color-red-tint` | 6.5 참고. 평소 숨김 |
| 3-3 | 결과 영역 | `<section class="results" aria-live="polite">` | 투명 | 6.4 참고. 평소 숨김 |
| 4 | 하단 바 | `<footer class="footer">` | `--color-green-house` | 문구 `AI가 지어 준 이름은 재미와 참고용이에요. 실제 작명은 전문가와 상의하세요.` 14px, `--color-text-on-dark-soft`, 가운데 정렬, 위아래 여백 `--space-5` |

- 영역 사이 간격은 `--space-4`입니다.
- 구분선(`<hr>`)을 쓰지 않고 **여백으로** 영역을 나눕니다.
- 하단 바는 화면 맨 아래에 붙습니다 (`body`를 `min-height: 100vh` 세로 flex, `main`에 `flex: 1`).

---

## 6. 컴포넌트

### 6.1 카드 (공통)
```css
.card {
  background: var(--color-white);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--space-4);   /* 모바일은 var(--space-3) */
}
```

### 6.2 입력 카드
| 요소 | 규칙 |
|---|---|
| 제목 | `<h2>` `성을 입력해 주세요` |
| 라벨 | `<label for="surname-input" class="sr-only">성 입력</label>` |
| 입력창 | `<input id="surname-input" type="text" maxlength="4" autocomplete="off" placeholder="예) 안">` |
| 입력창 스타일 | 흰 배경, `1px solid var(--color-border)`, `--radius-input`, 높이 48px, 안쪽 여백 `0 16px`, 글자 20px·600, 가운데 정렬, 너비 120px |
| 포커스 | `outline: 2px solid var(--color-green-accent)` |
| 배치 | 입력창과 버튼을 한 줄에 `display:flex; gap: var(--space-3); align-items:center;` |
| 안내 문구 | 입력 줄 아래 `<p id="surname-hint">` 14px 보조색: `한글 성 1~2글자를 입력해 주세요 (예: 안, 남궁)` |
| 안내 문구 (잘못된 입력) | 같은 요소에 `.is-invalid` → 색 `--color-red`, 문구 `한글로 된 성 1~2글자만 입력할 수 있어요.` |

> `maxlength`를 4로 두는 이유: 3글자 이상을 입력했을 때 잘리지 않고 "잘못된 입력" 안내를 보여주기 위함입니다.

### 6.3 버튼

**주 버튼 (이름 지어 주세요)**
```css
.btn-primary {
  background: var(--color-green-accent);
  color: #ffffff;
  border: 1px solid var(--color-green-accent);
  border-radius: var(--radius-pill);
  padding: 12px 28px;
  font: 600 16px/1.2 var(--font-sans);
  letter-spacing: var(--tracking);
  min-height: 48px;
  cursor: pointer;
  transition: var(--transition-fast);
}
.btn-primary:active { transform: var(--press-scale); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
.btn-primary:focus-visible { outline: 2px solid var(--color-green-house); outline-offset: 2px; }
```

**보조 버튼 (다른 이름 보기)** — 테두리만 있는 알약
- 배경 투명, 글자·테두리 `--color-green-accent`, 나머지는 주 버튼과 동일.
- 결과 목록 아래 가운데 정렬, 위 여백 `--space-4`.

**모바일(480px 미만)** 에서는 입력 줄이 세로로 바뀌고(입력창 위, 버튼 아래) 입력창·버튼 모두 `width: 100%`.

### 6.4 결과 영역 — 이름 카드 5개

```html
<section id="results" class="results" aria-live="polite" hidden>
  <h2 class="sr-only">지어 준 이름</h2>
  <ul id="name-list" class="name-list"></ul>
  <button id="regenerate-btn" type="button" class="btn-secondary">다른 이름 보기</button>
</section>
```

이름 카드 1개(`<li class="name-card">`)의 구조:
```html
<li class="name-card">
  <p class="name-full">안희영</p>
  <p class="name-vibe">밝고 부드러운 인상</p>
</li>
```

| 항목 | 규칙 |
|---|---|
| 목록 | `list-style: none; padding: 0; display: grid; gap: var(--space-3);` |
| 열 개수 | 모바일 1열, 태블릿 2열, PC 3열 (`grid-template-columns: repeat(N, 1fr)`) |
| 카드 | 6.1 카드 스타일 + `border-top: 4px solid var(--color-green-accent)`, 가운데 정렬 |
| 전체 이름 | 26px, 700, `--color-green-brand`, 글자 사이 `0.05em` (이름은 살짝 넓게 읽히도록 예외 허용) |
| 느낌 한 줄 | 14px, 400, `--color-text-soft`, 위 여백 `--space-1` |
| 나타날 때 | 카드마다 `opacity 0→1`, `translateY(8px→0)`, 0.3s, 카드 순서대로 0.06s씩 지연 (`style.animationDelay`) |
| 움직임 줄이기 | `prefers-reduced-motion: reduce`이면 애니메이션 없음 |

### 6.5 오류 안내
- `<div id="error-box" class="alert" role="alert" hidden>` 안에 `<p id="error-message">`
- 배경 `--color-red-tint`, 왼쪽 띠 `4px solid var(--color-red)`, 모서리 `--radius-card`, 안쪽 여백 `--space-3`.
- 앞에 `⚠️`(aria-hidden) + 오류 문장(16px, `--color-text`).

### 6.6 로딩 상태
- 요청을 보낸 버튼(주 버튼 또는 보조 버튼)의 글자가 `이름 짓는 중...`으로 바뀌고, 왼쪽에 지름 16px 원형 스피너(CSS, 0.8s 회전).
- 두 버튼 모두 비활성화됩니다.
- 스피너는 `prefers-reduced-motion: reduce`일 때 회전하지 않습니다.

---

## 7. 반응형 (화면 크기별)

| 구간 | 너비 | 변경 사항 |
|---|---|---|
| 모바일 | 480px 미만 | 입력 줄 세로 배치, 입력창·버튼 100% 너비, 카드 안쪽 여백 `--space-3`, 히어로 제목 24px, 이름 카드 1열 |
| 태블릿 | 480 ~ 1023px | 이름 카드 2열 |
| PC | 1024px 이상 | 이름 카드 3열, 본문 좌우 여백 `--space-6`, 히어로 제목 32px |

- 기준 너비 360px에서 가로 스크롤이 생기면 안 됩니다.

---

## 8. 접근성

- 모든 버튼은 `<button type="button">`을 씁니다 (`<div>` 버튼 금지).
- 이모지는 `aria-hidden="true"`로 숨기고 글자로 의미를 전달합니다.
- 결과 영역은 `aria-live="polite"`, 오류 안내는 `role="alert"`.
- 글자와 배경 대비는 WCAG AA(4.5:1) 이상. 위 토큰 조합은 이미 충족하므로 다른 조합을 만들지 않습니다.
- `.sr-only` 클래스(화면에는 안 보이고 화면낭독기만 읽음)를 CSS에 정의합니다.

---

## 9. 금지 사항

- 그라데이션, 금색, 순수 검정(`#000`) 글자, 각진 버튼
- 이미지·SVG 파일 추가, 아이콘 라이브러리
- 스타벅스 이름·로고·사이렌 모양·컵 그림
- 위 토큰에 없는 색상 값 사용 (단, 버튼 글자 `#ffffff`와 `transparent`는 허용)
- 애니메이션 라이브러리, 스크롤 효과

---

## 10. 완료 기준

- [ ] `styles.css` 첫 부분에 3번 토큰이 그대로 있다.
- [ ] `styles.css`에서 `:root` 밖의 `#` 색상 값은 `#ffffff`만 존재한다.
- [ ] 페이지 배경은 크림색(`#f2f0eb`), 카드는 흰색이다.
- [ ] 모든 버튼의 모서리가 50px 알약 모양이고, 누르면 살짝 작아진다(`scale(0.95)`).
- [ ] 글꼴이 Pretendard로 표시된다.
- [ ] 360px / 768px / 1440px 너비에서 깨짐·가로 스크롤이 없다.
- [ ] 이름 카드 5개가 모바일 1열 / 태블릿 2열 / PC 3열로 표시된다.

## 11. 검증 방법

- 브라우저 개발자도구(F12) → **Elements**에서 `body`의 Computed `font-family`가 `Pretendard Variable`인지 확인.
- 개발자도구 → 기기 모드(Ctrl+Shift+M)에서 너비 360, 768, 1440으로 바꿔 보기.
- 터미널에서 토큰 밖 색상 검사:
  ```bash
  grep -n "#[0-9a-fA-F]\{3,6\}" public/styles.css
  ```
  → `:root` 블록 안의 줄과 `#ffffff`만 나오면 통과.
