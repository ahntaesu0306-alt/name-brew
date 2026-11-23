# 01. 프로젝트 생성 지침

> 이 문서는 **프로젝트 뼈대(폴더, 설정 파일, 실행 방법)** 를 정합니다.
> 여기 적힌 파일 외에는 만들지 않습니다.

---

## 1. 준비물 (사람이 먼저 설치)

| 준비물 | 버전 | 확인 방법 (터미널에 입력) |
|---|---|---|
| Node.js | 20 이상 | `node -v` → `v20.x.x` 이상 |
| npm | Node.js와 함께 설치됨 | `npm -v` |
| OpenAI API 키 | — | https://platform.openai.com/api-keys 에서 발급 |
| Vercel 계정 | — | https://vercel.com 가입 (GitHub 계정 연결 권장) |

> **쉽게 말하면:** Node.js는 서버 코드를 돌리는 프로그램, npm은 부품(패키지)을 설치하는 도구, API 키는 OpenAI를 쓰기 위한 비밀번호입니다.

---

## 2. 폴더 구조 (이대로만 만듭니다)

```
name-brew/
├── AGENTS.md                  # AI 작업 규칙 (이미 있음)
├── PRD.md                     # 제품 요구사항 (이미 있음)
├── docs/                      # 세부 구현 문서 (이미 있음)
├── public/                    # 브라우저에 보이는 파일 (프론트엔드)
│   ├── index.html             # 화면 구조
│   ├── styles.css             # 디자인
│   └── app.js                 # 화면 동작
├── api/
│   └── generate.js            # 서버 함수: POST /api/generate
├── lib/
│   ├── validate.js            # 입력 검사 함수 (서버·테스트 공용)
│   ├── errors.js              # 오류 코드·메시지 목록
│   └── naming.js              # OpenAI 호출 + 결과 검사
├── tests/
│   ├── validate.test.js       # 입력 검사 테스트
│   └── naming.test.js         # 결과 검사 테스트
├── .env.example               # 환경변수 예시 (값 비움)
├── .gitignore
├── package.json
└── vercel.json
```

**규칙**
- `public/` 안의 파일은 브라우저에 그대로 공개됩니다. 비밀 정보 금지.
- `api/` 폴더의 파일 1개 = 서버 주소 1개입니다. `api/generate.js` → `/api/generate`.
- `lib/`는 서버에서만 쓰는 공용 함수입니다. `public/`에서 `lib/`를 불러오지 않습니다.
- 이미지 파일은 만들지 않습니다. 아이콘은 이모지(☕ 😊 😞 😐)만 씁니다.

---

## 3. 파일 내용 (그대로 작성)

### 3.1 `package.json`

```json
{
  "name": "name-brew",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "dev": "vercel dev",
    "test": "node --test tests/*.test.js"
  },
  "dependencies": {
    "openai": "^6.0.0"
  },
  "devDependencies": {
    "vercel": "latest"
  }
}
```

- `openai` 메이저 버전이 설치 시점에 다르면 설치된 최신 메이저를 쓰고, 작업 보고 "가정한 내용"에 버전을 적습니다.
- 테스트는 Node.js 내장 기능(`node --test`)만 씁니다. Jest, Mocha 등 설치 금지.

### 3.2 `vercel.json`

```json
{
  "functions": {
    "api/generate.js": {
      "maxDuration": 30
    }
  }
}
```

- 정적 파일은 Vercel이 `public/` 폴더를 자동으로 사이트 루트(`/`)로 제공합니다. 별도 라우팅 설정을 추가하지 않습니다.

### 3.3 `.env.example`

```
# OpenAI API 키 (https://platform.openai.com/api-keys)
OPENAI_API_KEY=

# 사용할 모델 이름 (비우면 gpt-5.4-mini 사용)
OPENAI_MODEL=
```

### 3.4 `.gitignore`

```
node_modules/
.env
.env.local
.vercel/
.DS_Store
```

---

## 4. 환경변수

| 이름 | 필수 | 설명 | 기본값 |
|---|---|---|---|
| `OPENAI_API_KEY` | 필수 | OpenAI 비밀 키 | 없음 (없으면 `SERVER_CONFIG` 오류) |
| `OPENAI_MODEL` | 선택 | 사용할 모델 이름 | `gpt-5.4-mini` |

> **모델 참고:** 기본값 `gpt-5.4-mini`는 분류 같은 단순 작업용 소형 모델입니다. OpenAI가 모델을 종료하면 `OPENAI_MODEL` 값만 새 모델 이름으로 바꾸면 됩니다. 코드는 바꾸지 않습니다. 사용할 수 있는 모델은 https://platform.openai.com/docs/models 에서 확인합니다.

---

## 5. 처음 실행하는 순서 (사람용)

```bash
# 1) 부품 설치
npm install

# 2) 환경변수 파일 만들기
cp .env.example .env
# .env 파일을 열어 OPENAI_API_KEY= 뒤에 키를 붙여넣기

# 3) Vercel 로그인 (처음 1번만)
npx vercel login

# 4) 내 컴퓨터에서 실행
npm run dev
# → 터미널에 나온 주소(보통 http://localhost:3000)를 브라우저로 열기

# 5) 테스트
npm test
```

- `npm run dev`를 처음 실행하면 Vercel이 몇 가지 질문을 합니다. "Set up and develop?" → **Y**, 프로젝트 이름 → **name-brew**, 나머지는 **Enter**(기본값)입니다.
- 로컬 실행은 `vercel dev` 한 가지 방법만 씁니다. 별도 Express 서버나 `server.js`를 만들지 않습니다.

---

## 6. 완료 기준

- [ ] 2번 폴더 구조와 실제 폴더가 **정확히 같다** (파일 추가·누락 없음).
- [ ] `npm install`이 오류 없이 끝난다.
- [ ] `npm run dev` 실행 후 `http://localhost:3000`에서 `index.html`이 열린다.
- [ ] `.env`가 `.gitignore`에 포함되어 있다.
- [ ] `package.json`의 `dependencies`에 `openai` 하나만, `devDependencies`에 `vercel` 하나만 있다.

## 7. 검증 방법

```bash
node -v                      # v20 이상인지
npm ls --depth=0             # openai, vercel 두 개만 보이는지
git check-ignore .env        # ".env" 가 출력되면 무시 설정 정상
```
