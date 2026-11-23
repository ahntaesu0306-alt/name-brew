// 네임 브루 — 화면 동작 (docs/03-frontend-behavior.md)

const HANGUL_1_2 = /^[가-힣]{1,2}$/;
const MAX_SHOWN = 30;
const CLIENT_TIMEOUT_MS = 20000;

// docs/05-error-handling.md 와 글자 그대로 일치 (14개)
const ERROR_MESSAGES = {
  EMPTY_SURNAME: '성을 입력해 주세요.',
  INVALID_SURNAME: '한글로 된 성 1~2글자만 입력할 수 있어요.',
  INVALID_REQUEST: '요청 형식이 올바르지 않아요. 페이지를 새로고침한 뒤 다시 시도해 주세요.',
  METHOD_NOT_ALLOWED: '지원하지 않는 요청 방식이에요.',
  RATE_LIMITED: '요청이 많아 잠시 쉬어 가는 중이에요. 30초 뒤 다시 시도해 주세요.',
  QUOTA_EXCEEDED: '지금은 이름 짓기 서비스를 이용할 수 없어요. 관리자에게 문의해 주세요.',
  SERVER_CONFIG: '서비스 설정에 문제가 있어요. 관리자에게 문의해 주세요.',
  TIMEOUT: '이름을 짓는 데 너무 오래 걸렸어요. 잠시 뒤 다시 시도해 주세요.',
  AI_UNAVAILABLE: 'AI 서비스에 연결할 수 없어요. 잠시 뒤 다시 시도해 주세요.',
  AI_INVALID_RESPONSE: '알맞은 이름을 찾지 못했어요. 한 번 더 눌러 주세요.',
  UNKNOWN: '알 수 없는 오류가 발생했어요. 잠시 뒤 다시 시도해 주세요.',
  NETWORK_ERROR: '인터넷 연결을 확인한 뒤 다시 시도해 주세요.',
  CLIENT_TIMEOUT: '응답이 너무 늦어요. 잠시 뒤 다시 시도해 주세요.',
  INVALID_RESPONSE: '결과를 읽을 수 없어요. 잠시 뒤 다시 시도해 주세요.',
};

const TEXT = {
  generate: '이름 지어 주세요',
  regenerate: '다른 이름 보기',
  loading: '이름 짓는 중...',
  hintDefault: '한글 성 1~2글자를 입력해 주세요 (예: 안, 남궁)',
  hintInvalid: '한글로 된 성 1~2글자만 입력할 수 있어요.',
};

const el = {
  input: document.getElementById('surname-input'),
  hint: document.getElementById('surname-hint'),
  generateBtn: document.getElementById('generate-btn'),
  errorBox: document.getElementById('error-box'),
  errorMessage: document.getElementById('error-message'),
  results: document.getElementById('results'),
  nameList: document.getElementById('name-list'),
  regenerateBtn: document.getElementById('regenerate-btn'),
  genderInputs: document.querySelectorAll('input[name="gender"]'),
};

let state = 'idle'; // idle | loading | success | error
let currentSurname = '';
let currentGender = 'any';
let shownNames = [];
let names = [];
let errorCode = '';
let loadingButton = null;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 입력값이 empty / invalid / valid 중 무엇인지
function checkInput() {
  const value = el.input.value.trim();
  if (value.length === 0) return 'empty';
  return HANGUL_1_2.test(value) ? 'valid' : 'invalid';
}

function setButton(button, label, isLoading) {
  button.querySelector('.btn-label').textContent = label;
  button.classList.toggle('is-loading', isLoading);
}

// 화면 갱신은 이 함수에서만
function render({ composing = false } = {}) {
  const isLoading = state === 'loading';
  const inputStatus = checkInput();
  const showInvalid = inputStatus === 'invalid' && !composing;

  el.input.readOnly = isLoading;
  el.genderInputs.forEach((radio) => { radio.disabled = isLoading; });
  el.hint.textContent = showInvalid ? TEXT.hintInvalid : TEXT.hintDefault;
  el.hint.classList.toggle('is-invalid', showInvalid);

  el.generateBtn.disabled = isLoading || inputStatus !== 'valid';
  el.regenerateBtn.disabled = isLoading;
  setButton(el.generateBtn, isLoading && loadingButton === el.generateBtn ? TEXT.loading : TEXT.generate, isLoading && loadingButton === el.generateBtn);
  setButton(el.regenerateBtn, isLoading && loadingButton === el.regenerateBtn ? TEXT.loading : TEXT.regenerate, isLoading && loadingButton === el.regenerateBtn);

  el.errorBox.hidden = state !== 'error';
  if (state === 'error') el.errorMessage.textContent = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.UNKNOWN;

  el.results.hidden = names.length === 0;
}

function renderNames() {
  const items = names.map((name, index) => {
    const li = document.createElement('li');
    li.className = 'name-card';
    li.style.animationDelay = `${index * 0.06}s`;

    const full = document.createElement('p');
    full.className = 'name-full';
    full.textContent = name.fullName;

    const vibe = document.createElement('p');
    vibe.className = 'name-vibe';
    vibe.textContent = name.vibe;

    li.append(full, vibe);
    return li;
  });
  el.nameList.replaceChildren(...items);
}

function isValidResult(data, surname) {
  if (!data || !Array.isArray(data.names) || data.names.length !== 5) return false;
  return data.names.every((n) => n
    && typeof n.fullName === 'string' && n.fullName.startsWith(surname)
    && typeof n.givenName === 'string' && n.givenName.trim().length > 0
    && typeof n.vibe === 'string' && n.vibe.trim().length > 0);
}

function showError(code) {
  errorCode = code;
  state = 'error';
  render();
}

function selectedGender() {
  return document.querySelector('input[name="gender"]:checked')?.value ?? 'any';
}

async function requestNames(surname, gender, exclude) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surname, gender, exclude }),
      signal: controller.signal,
    });
    let body;
    try {
      body = await res.json();
    } catch {
      return { error: 'INVALID_RESPONSE' };
    }
    if (body && body.ok === true) {
      return isValidResult(body.data, surname) ? { data: body.data } : { error: 'INVALID_RESPONSE' };
    }
    const code = body?.error?.code;
    return { error: ERROR_MESSAGES[code] ? code : 'UNKNOWN' };
  } catch (err) {
    return { error: err.name === 'AbortError' ? 'CLIENT_TIMEOUT' : 'NETWORK_ERROR' };
  } finally {
    clearTimeout(timer);
  }
}

async function generate(button) {
  if (state === 'loading') return;

  // 다른 이름 보기는 마지막으로 지은 성을 쓰고, 성별은 지금 선택된 값을 씀
  const isRegenerate = button === el.regenerateBtn && currentSurname;
  const surname = isRegenerate ? currentSurname : el.input.value.trim();
  const gender = selectedGender();

  if (!HANGUL_1_2.test(surname)) {
    showError(surname.length === 0 ? 'EMPTY_SURNAME' : 'INVALID_SURNAME');
    return;
  }

  // 성이나 성별이 바뀌면 이전 이름 목록은 의미가 없으므로 비움
  if (surname !== currentSurname || gender !== currentGender) {
    shownNames = [];
    currentSurname = surname;
    currentGender = gender;
  }

  const isFirstResult = names.length === 0;
  loadingButton = button;
  state = 'loading';
  render();

  const result = await requestNames(surname, gender, shownNames);
  loadingButton = null;

  if (result.error) {
    showError(result.error);
    return;
  }

  names = result.data.names;
  shownNames = [...shownNames, ...names.map((n) => n.givenName)].slice(-MAX_SHOWN);
  state = 'success';
  renderNames();
  render();

  if (isFirstResult) {
    el.results.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
  }
}

// ── 이벤트 ──
el.input.addEventListener('input', (event) => {
  if (state === 'error') state = names.length > 0 ? 'success' : 'idle';
  render({ composing: event.isComposing });
});

el.input.addEventListener('compositionend', () => render());

el.input.addEventListener('keydown', (event) => {
  // 한글 조합 중 Enter는 글자 확정용이라 무시 (두 번 요청 방지)
  if (event.key !== 'Enter' || event.isComposing || event.keyCode === 229) return;
  event.preventDefault();
  if (!el.generateBtn.disabled) generate(el.generateBtn);
});

el.generateBtn.addEventListener('click', () => generate(el.generateBtn));
el.regenerateBtn.addEventListener('click', () => generate(el.regenerateBtn));

render();
