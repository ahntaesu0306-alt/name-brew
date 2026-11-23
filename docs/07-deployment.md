# 07. 배포 지침 (Vercel)

> **배포**는 내 컴퓨터에서만 돌던 사이트를 인터넷 주소로 누구나 볼 수 있게 올리는 일입니다.
> Vercel은 `public/` 폴더는 웹페이지로, `api/` 폴더는 서버 함수로 자동 인식합니다.

---

## 1. 배포 전 확인

- [ ] `docs/06-testing-verification.md` 완료 기준 통과
- [ ] `.env` 파일이 Git에 올라가지 않음 (`git status`에 `.env`가 보이지 않음)
- [ ] `package.json`의 `engines.node`가 `>=20`

---

## 2. 방법 A — GitHub 연결 (권장, 비전공자용)

1. GitHub에 새 저장소(repository)를 만들고 프로젝트를 올립니다.
   ```bash
   git init
   git add .
   git commit -m "네임 브루 첫 버전"
   git branch -M main
   git remote add origin https://github.com/<내아이디>/name-brew.git
   git push -u origin main
   ```
2. https://vercel.com 로그인 → **Add New… → Project** → 방금 만든 저장소 **Import**.
3. 설정 화면에서:
   - **Framework Preset**: `Other`
   - **Build Command**: 비워 둠
   - **Output Directory**: 비워 둠 (Vercel이 `public/`을 자동 사용)
4. **Environment Variables**에 추가:
   | Name | Value |
   |---|---|
   | `OPENAI_API_KEY` | 내 OpenAI 키 |
   | `OPENAI_MODEL` | (선택) 비우면 `gpt-5.4-mini` |
5. **Deploy** 클릭 → 1~2분 뒤 `https://name-brew-xxxx.vercel.app` 같은 주소가 생깁니다.
6. 이후에는 `git push`할 때마다 자동으로 다시 배포됩니다.

## 3. 방법 B — 터미널로 바로 배포

```bash
npx vercel login
npx vercel env add OPENAI_API_KEY production   # 키 붙여넣기
npx vercel --prod
```

---

## 4. 환경변수를 바꿨을 때

Vercel 대시보드 → 프로젝트 → **Settings → Environment Variables**에서 바꾼 뒤, **Deployments → 최신 배포 → ⋯ → Redeploy**를 눌러야 적용됩니다. (바꾸기만 하면 적용 안 됨)

---

## 5. 배포 후 검증

- [ ] D1. 배포 주소 접속 시 화면이 정상으로 열린다
- [ ] D2. M1~M3 예시(성 입력)가 정상적으로 이름 5개를 보여준다
- [ ] D3. Offline 테스트(M13) 문구가 나온다
- [ ] D4. 브라우저 개발자도구 → **Sources**에서 `app.js`를 열어 `sk-`를 검색 → 없음
- [ ] D5. `https://<배포주소>/api/generate`를 브라우저로 열면 `METHOD_NOT_ALLOWED` JSON이 보인다
- [ ] D6. Vercel 대시보드 → **Logs**에 사용자 문장이 찍히지 않는다

## 6. 문제 해결

| 증상 | 확인할 것 |
|---|---|
| 모든 분석이 `SERVER_CONFIG` | Vercel에 `OPENAI_API_KEY` 등록 + Redeploy 했는지, 모델 이름 철자 |
| 모든 분석이 `QUOTA_EXCEEDED` | OpenAI 대시보드 **Billing**에서 크레딧 충전 |
| 페이지가 404 | 파일이 `public/index.html` 위치에 있는지 |
| `/api/generate`가 404 | 파일이 `api/generate.js` 위치에 있는지, `export default`인지 |

## 7. 비용 안내
- Vercel 개인(Hobby) 요금제는 무료로 시작할 수 있습니다.
- OpenAI API는 **사용한 만큼 요금**이 나갑니다. OpenAI 대시보드 → **Limits**에서 월 사용 한도를 꼭 설정하세요.
- 배포 주소를 아무 곳에나 공개하면 다른 사람이 써서 요금이 나갈 수 있습니다 (이번 범위에는 사용량 제한 기능이 없습니다).

## 8. 완료 기준
- [ ] 배포 주소가 있고 D1~D6 모두 통과
- [ ] 작업 보고의 "사람이 직접 해야 하는 일"에 환경변수 등록·사용 한도 설정이 적혀 있다
