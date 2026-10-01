/**
 * 정보처리기사 기출 퀴즈 게임 애플리케이션 로직 (app.js)
 * 순수 Vanilla JavaScript (Zero Dependency)
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. 상수 및 초기 기본 데이터
  // ==========================================================================
  const QUIZ_CONFIG = {
    QUESTIONS_PER_ROUND: 10,
    PASSING_SCORE: 6, // 10문제 중 6문제 이상 맞추면 60점 이상으로 합격
    STORAGE_KEY_LEADERBOARD: 'cbt_quiz_leaderboard_v2',
    STORAGE_KEY_THEME: 'cbt_quiz_theme',
    STORAGE_KEY_SOUND: 'cbt_quiz_sound'
  };

  // ==========================================================================
  // 2. 사운드 시스템 (Web Audio API 기반 무외부파일 합성)
  // ==========================================================================
  class SoundController {
    constructor() {
      this.enabled = localStorage.getItem(QUIZ_CONFIG.STORAGE_KEY_SOUND) !== 'false';
      this.audioCtx = null;
    }

    init() {
      if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem(QUIZ_CONFIG.STORAGE_KEY_SOUND, this.enabled);
      return this.enabled;
    }

    playCorrect() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // 상쾌한 2화음 딩동 (F5 -> A5)
      this._playTone(698.46, now, 0.12, 'sine', 0.15);
      this._playTone(880.00, now + 0.12, 0.25, 'sine', 0.15);
    }

    playIncorrect() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      // 낮은 단호한 버저음 (220Hz -> 180Hz)
      this._playTone(220, now, 0.15, 'sawtooth', 0.12);
      this._playTone(180, now + 0.15, 0.25, 'sawtooth', 0.12);
    }

    playFanfare() {
      if (!this.enabled) return;
      this.init();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        this._playTone(freq, now + idx * 0.11, 0.2, 'triangle', 0.18);
      });
    }

    _playTone(freq, startTime, duration, type = 'sine', volume = 0.15) {
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      } catch (e) {
        // 오디오 미지원 환경 예외 무시
      }
    }
  }

  // ==========================================================================
  // 3. Canvas Confetti 효과 (폭죽 애니메이션)
  // ==========================================================================
  class ConfettiEffect {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.animationId = null;
      this.colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
    }

    start() {
      this.stop();
      this.canvas.width = this.canvas.offsetWidth;
      this.canvas.height = this.canvas.offsetHeight;
      this.particles = [];

      for (let i = 0; i < 90; i++) {
        this.particles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.7) * 16,
          size: Math.random() * 8 + 4,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          gravity: 0.35,
          opacity: 1
        });
      }

      this._animate();
    }

    stop() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    _animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let aliveCount = 0;

      for (const p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.008;

        if (p.opacity > 0) {
          aliveCount++;
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.globalAlpha = Math.max(0, p.opacity);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          this.ctx.restore();
        }
      }

      if (aliveCount > 0) {
        this.animationId = requestAnimationFrame(() => this._animate());
      }
    }
  }

  // ==========================================================================
  // 4. 앱 메인 컨트롤러 (App State & DOM Elements)
  // ==========================================================================
  const soundCtrl = new SoundController();
  let confetti = null;

  // DOM 요소 캐싱
  const DOM = {
    // Screens
    introScreen: document.getElementById('introScreen'),
    gameScreen: document.getElementById('gameScreen'),
    resultScreen: document.getElementById('resultScreen'),

    // Top Controls
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    soundIcon: document.getElementById('soundIcon'),

    // Intro Screen Elements
    startQuizBtn: document.getElementById('startQuizBtn'),
    introTop5List: document.getElementById('introTop5List'),
    openLeaderboardFromIntro: document.getElementById('openLeaderboardFromIntro'),

    // In-game Elements
    currentQuestionNum: document.getElementById('currentQuestionNum'),
    currentSubject: document.getElementById('currentSubject'),
    timerText: document.getElementById('timerText'),
    progressBarFill: document.getElementById('progressBarFill'),
    quitQuizBtn: document.getElementById('quitQuizBtn'),
    questionText: document.getElementById('questionText'),
    optionsContainer: document.getElementById('optionsContainer'),

    // In-game Feedback Panel
    feedbackPanel: document.getElementById('feedbackPanel'),
    feedbackHeader: document.getElementById('feedbackHeader'),
    feedbackIcon: document.getElementById('feedbackIcon'),
    feedbackTitle: document.getElementById('feedbackTitle'),
    explanationText: document.getElementById('explanationText'),
    nextQuestionBtn: document.getElementById('nextQuestionBtn'),
    nextBtnText: document.getElementById('nextBtnText'),

    // Result Screen Elements
    confettiCanvas: document.getElementById('confettiCanvas'),
    resultMedalIcon: document.getElementById('resultMedalIcon'),
    resultStatusTitle: document.getElementById('resultStatusTitle'),
    resultSubText: document.getElementById('resultSubText'),
    resultScore: document.getElementById('resultScore'),
    resultPercentage: document.getElementById('resultPercentage'),
    resultElapsedTime: document.getElementById('resultElapsedTime'),
    resultAvgTime: document.getElementById('resultAvgTime'),
    rankRegisterCard: document.getElementById('rankRegisterCard'),
    nicknameInput: document.getElementById('nicknameInput'),
    submitScoreBtn: document.getElementById('submitScoreBtn'),
    registerFeedback: document.getElementById('registerFeedback'),
    viewLeaderboardBtn: document.getElementById('viewLeaderboardBtn'),
    restartQuizBtn: document.getElementById('restartQuizBtn'),

    // Leaderboard Modal
    leaderboardModal: document.getElementById('leaderboardModal'),
    leaderboardTableBody: document.getElementById('leaderboardTableBody'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    closeModalBtn2: document.getElementById('closeModalBtn2'),
    clearLeaderboardBtn: document.getElementById('clearLeaderboardBtn')
  };

  // 게임 런타임 상태
  const state = {
    questions: [],
    currentIndex: 0,
    score: 0,
    isAnswered: false,
    startTime: 0,
    elapsedSeconds: 0,
    timerIntervalId: null,
    hasRegisteredScore: false
  };

  // ==========================================================================
  // 5. 랭킹 데이터 관리 로직
  // ==========================================================================
  function getLeaderboard() {
    try {
      // 구버전 더미 데이터 키가 남아있다면 정리
      if (localStorage.getItem('cbt_quiz_leaderboard_v1')) {
        localStorage.removeItem('cbt_quiz_leaderboard_v1');
      }

      const data = localStorage.getItem(QUIZ_CONFIG.STORAGE_KEY_LEADERBOARD);
      if (!data) {
        return [];
      }
      const list = JSON.parse(data);
      return Array.isArray(list) ? list.filter(item => item && item.id && !item.id.startsWith('seed_')) : [];
    } catch (e) {
      return [];
    }
  }

  function saveLeaderboard(list) {
    try {
      localStorage.setItem(QUIZ_CONFIG.STORAGE_KEY_LEADERBOARD, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save leaderboard', e);
    }
  }

  function addLeaderboardEntry(name, score, elapsedTime) {
    const list = getLeaderboard();
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: 'rank_' + Date.now(),
      name: name.trim(),
      score: score,
      total: QUIZ_CONFIG.QUESTIONS_PER_ROUND,
      elapsedTime: elapsedTime,
      date: today
    };

    list.push(newEntry);

    // 정렬 규칙: 1) 점수 내림차순 -> 2) 소요 시간 오름차순 (짧을수록 상위)
    list.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.elapsedTime - b.elapsedTime;
    });

    saveLeaderboard(list);
    return list;
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  function formatTimeKorean(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    if (m === 0) {
      return `${s}초`;
    }
    return `${m}분 ${s}초`;
  }

  // ==========================================================================
  // 6. UI 렌더링 헬퍼
  // ==========================================================================
  function showScreen(screenEl) {
    [DOM.introScreen, DOM.gameScreen, DOM.resultScreen].forEach((el) => {
      el.classList.remove('active');
    });
    screenEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderIntroTop5() {
    const list = getLeaderboard().slice(0, 5);
    DOM.introTop5List.innerHTML = '';

    if (list.length === 0) {
      DOM.introTop5List.innerHTML = '<div class="empty-leaderboard">아직 등록된 랭킹 기록이 없습니다. 첫 번째 주인공이 되어보세요!</div>';
      return;
    }

    list.forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'top5-row';

      let medal = `${idx + 1}`;
      if (idx === 0) medal = '🥇';
      else if (idx === 1) medal = '🥈';
      else if (idx === 2) medal = '🥉';

      row.innerHTML = `
        <span class="rank-badge">${medal}</span>
        <span class="rank-user">${escapeHtml(item.name)}</span>
        <span class="rank-stat">${item.score}/10점 (${formatTime(item.elapsedTime)})</span>
      `;
      DOM.introTop5List.appendChild(row);
    });
  }

  function renderLeaderboardModal() {
    const list = getLeaderboard();
    DOM.leaderboardTableBody.innerHTML = '';

    if (list.length === 0) {
      DOM.leaderboardTableBody.innerHTML = `
        <tr>
          <td colspan="4" style="padding: 24px; color: var(--text-muted);">
            등록된 기록이 없습니다.
          </td>
        </tr>
      `;
      return;
    }

    list.forEach((item, idx) => {
      const tr = document.createElement('tr');
      let rankText = `${idx + 1}위`;
      let rankClass = '';

      if (idx === 0) { rankText = '🥇 1위'; rankClass = 'rank-top1'; }
      else if (idx === 1) { rankText = '🥈 2위'; rankClass = 'rank-top2'; }
      else if (idx === 2) { rankText = '🥉 3위'; rankClass = 'rank-top3'; }

      tr.innerHTML = `
        <td class="${rankClass}">${rankText}</td>
        <td style="font-weight: 600;">${escapeHtml(item.name)}</td>
        <td><strong style="color: var(--primary);">${item.score}</strong> / 10</td>
        <td>${formatTime(item.elapsedTime)}</td>
      `;
      DOM.leaderboardTableBody.appendChild(tr);
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // 7. 게임 로직 (퀴즈 진행 및 정답 판정)
  // ==========================================================================
  function pickRandomQuestions(bank, count) {
    // Fisher-Yates 셔플 복사본 생성
    const array = [...bank];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.slice(0, count);
  }

  function startQuiz() {
    if (typeof QUESTION_BANK === 'undefined' || QUESTION_BANK.length === 0) {
      alert('문제 데이터를 불러올 수 없습니다. questions.js 파일을 확인해주세요.');
      return;
    }

    // 10문제 무작위 추출
    state.questions = pickRandomQuestions(QUESTION_BANK, QUIZ_CONFIG.QUESTIONS_PER_ROUND);
    state.currentIndex = 0;
    state.score = 0;
    state.isAnswered = false;
    state.hasRegisteredScore = false;
    state.startTime = Date.now();
    state.elapsedSeconds = 0;

    // 타이머 가동
    if (state.timerIntervalId) clearInterval(state.timerIntervalId);
    DOM.timerText.textContent = '00:00';
    state.timerIntervalId = setInterval(() => {
      state.elapsedSeconds = Math.floor((Date.now() - state.startTime) / 1000);
      DOM.timerText.textContent = formatTime(state.elapsedSeconds);
    }, 1000);

    // 사운드 초기화 (첫 인터랙션 처리)
    soundCtrl.init();

    // 첫 문제 표시 및 화면 전환
    renderCurrentQuestion();
    showScreen(DOM.gameScreen);
  }

  function renderCurrentQuestion() {
    state.isAnswered = false;
    const q = state.questions[state.currentIndex];
    const total = state.questions.length;
    const currentNum = state.currentIndex + 1;

    // 1. 상태 바 및 프로그레스 바
    DOM.currentQuestionNum.textContent = `문제 ${currentNum} / ${total}`;
    DOM.currentSubject.textContent = q.subject || '정보처리기사';
    const progressPercent = (currentNum / total) * 100;
    DOM.progressBarFill.style.width = `${progressPercent}%`;

    // 2. 문제 텍스트
    DOM.questionText.textContent = q.question;

    // 3. 보기 4개 버튼 생성
    DOM.optionsContainer.innerHTML = '';
    const optionLabels = ['①', '②', '③', '④'];

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.index = idx;
      btn.innerHTML = `
        <span class="option-badge">${idx + 1}</span>
        <span class="option-text">${escapeHtml(optText)}</span>
      `;
      btn.addEventListener('click', () => handleOptionSelect(idx));
      DOM.optionsContainer.appendChild(btn);
    });

    // 4. 피드백 패널 숨김
    DOM.feedbackPanel.classList.remove('visible');

    // 5. 다음 버튼 텍스트 설정
    if (currentNum === total) {
      DOM.nextBtnText.textContent = '🏁 최종 결과 확인하기';
    } else {
      DOM.nextBtnText.textContent = '다음 문제 ➔';
    }
  }

  function handleOptionSelect(selectedIndex) {
    if (state.isAnswered) return;
    state.isAnswered = true;

    const q = state.questions[state.currentIndex];
    const isCorrect = selectedIndex === q.answer_index;
    const optionButtons = DOM.optionsContainer.querySelectorAll('.option-btn');

    // 모든 버튼 비활성화 (추가 클릭 방지)
    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.answer_index) {
        // 실제 정답 버튼 항상 초록색 강조
        btn.classList.add('correct');
      }
    });

    if (isCorrect) {
      state.score++;
      soundCtrl.playCorrect();

      DOM.feedbackHeader.className = 'feedback-header is-correct';
      DOM.feedbackIcon.textContent = '✅';
      DOM.feedbackTitle.textContent = '정답입니다!';
    } else {
      // 선택한 오답 버튼 빨간색 표시
      optionButtons[selectedIndex].classList.add('incorrect');
      soundCtrl.playIncorrect();

      DOM.feedbackHeader.className = 'feedback-header is-incorrect';
      DOM.feedbackIcon.textContent = '❌';
      DOM.feedbackTitle.textContent = '오답입니다!';
    }

    // 상세 해설 렌더링
    DOM.explanationText.textContent = q.explanation || '해설이 준비되어 있지 않습니다.';

    // 피드백 패널 슬라이드 노출
    DOM.feedbackPanel.classList.add('visible');

    // 다음 버튼으로 포커스 안내
    setTimeout(() => {
      DOM.nextQuestionBtn.focus();
    }, 50);
  }

  function goToNextQuestion() {
    if (!state.isAnswered) return;

    if (state.currentIndex + 1 < state.questions.length) {
      state.currentIndex++;
      renderCurrentQuestion();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    // 타이머 정지
    clearInterval(state.timerIntervalId);
    state.elapsedSeconds = Math.max(1, Math.floor((Date.now() - state.startTime) / 1000));

    // 결과 통계 산출
    const total = state.questions.length;
    const score = state.score;
    const percent = Math.round((score / total) * 100);
    const isPassed = score >= QUIZ_CONFIG.PASSING_SCORE;

    // DOM 업데이트
    DOM.resultScore.textContent = score;
    DOM.resultPercentage.textContent = `정답률 ${percent}% (${percent}점)`;
    DOM.resultElapsedTime.textContent = formatTimeKorean(state.elapsedSeconds);
    const avgSec = (state.elapsedSeconds / total).toFixed(1);
    DOM.resultAvgTime.textContent = `${avgSec}초`;

    // 합격/불합격 판정 연출
    if (isPassed) {
      DOM.resultMedalIcon.textContent = '🏅';
      DOM.resultStatusTitle.textContent = '축하합니다! 가상 합격권입니다!';
      DOM.resultSubText.textContent = `합격 기준인 60점 이상을 달성하셨습니다. (총 ${score}문제 정답)`;
      soundCtrl.playFanfare();
      if (confetti) confetti.start();
    } else {
      DOM.resultMedalIcon.textContent = '📖';
      DOM.resultStatusTitle.textContent = '아쉽습니다! 조금만 더 도전해보세요!';
      DOM.resultSubText.textContent = `합격 기준은 6문제(60점) 이상입니다. 오답을 복습하고 재도전해보세요!`;
      if (confetti) confetti.stop();
    }

    // 닉네임 입력 폼 리셋
    DOM.nicknameInput.value = '';
    DOM.nicknameInput.disabled = false;
    DOM.submitScoreBtn.disabled = false;
    DOM.registerFeedback.textContent = '';
    DOM.registerFeedback.className = 'register-msg';

    showScreen(DOM.resultScreen);
  }

  function registerScore() {
    if (state.hasRegisteredScore) return;

    const nickname = DOM.nicknameInput.value.trim();
    if (!nickname) {
      DOM.registerFeedback.textContent = '닉네임을 입력해주세요.';
      DOM.registerFeedback.className = 'register-msg error';
      DOM.nicknameInput.focus();
      return;
    }

    if (nickname.length < 2 || nickname.length > 10) {
      DOM.registerFeedback.textContent = '닉네임은 2자 이상 10자 이하여야 합니다.';
      DOM.registerFeedback.className = 'register-msg error';
      DOM.nicknameInput.focus();
      return;
    }

    addLeaderboardEntry(nickname, state.score, state.elapsedSeconds);
    state.hasRegisteredScore = true;

    DOM.nicknameInput.disabled = true;
    DOM.submitScoreBtn.disabled = true;
    DOM.registerFeedback.textContent = `🎉 [${nickname}] 님의 점수가 순위표에 성공적으로 등록되었습니다!`;
    DOM.registerFeedback.className = 'register-msg success';

    renderIntroTop5();
  }

  // ==========================================================================
  // 8. 테마 및 사운드 설정 관리
  // ==========================================================================
  function initTheme() {
    const savedTheme = localStorage.getItem(QUIZ_CONFIG.STORAGE_KEY_THEME);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    applyTheme(isDark);
  }

  function applyTheme(isDark) {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      DOM.themeIcon.textContent = '☀️';
    } else {
      document.documentElement.removeAttribute('data-theme');
      DOM.themeIcon.textContent = '🌙';
    }
  }

  function toggleTheme() {
    const isDarkNow = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextDark = !isDarkNow;
    applyTheme(nextDark);
    localStorage.setItem(QUIZ_CONFIG.STORAGE_KEY_THEME, nextDark ? 'dark' : 'light');
  }

  function initSoundButton() {
    DOM.soundIcon.textContent = soundCtrl.enabled ? '🔊' : '🔇';
  }

  function toggleSound() {
    const isEnabled = soundCtrl.toggle();
    DOM.soundIcon.textContent = isEnabled ? '🔊' : '🔇';
  }

  // ==========================================================================
  // 9. 모달 및 이벤트 바인딩
  // ==========================================================================
  function openLeaderboard() {
    renderLeaderboardModal();
    DOM.leaderboardModal.classList.add('active');
  }

  function closeLeaderboard() {
    DOM.leaderboardModal.classList.remove('active');
  }

  function clearLeaderboard() {
    if (confirm('모든 랭킹 기록을 초기화하시겠습니까?')) {
      localStorage.removeItem(QUIZ_CONFIG.STORAGE_KEY_LEADERBOARD);
      renderLeaderboardModal();
      renderIntroTop5();
    }
  }

  function bindEvents() {
    // 헤더 버튼
    DOM.themeToggleBtn.addEventListener('click', toggleTheme);
    DOM.soundToggleBtn.addEventListener('click', toggleSound);

    // 인트로 버튼
    DOM.startQuizBtn.addEventListener('click', startQuiz);
    DOM.openLeaderboardFromIntro.addEventListener('click', openLeaderboard);

    // 인게임 버튼
    DOM.nextQuestionBtn.addEventListener('click', goToNextQuestion);
    DOM.quitQuizBtn.addEventListener('click', () => {
      if (confirm('현재 진행 중인 퀴즈를 포기하고 메인으로 돌아가시겠습니까?')) {
        clearInterval(state.timerIntervalId);
        showScreen(DOM.introScreen);
      }
    });

    // 결과 화면 버튼
    DOM.submitScoreBtn.addEventListener('click', registerScore);
    DOM.nicknameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        registerScore();
      }
    });
    DOM.viewLeaderboardBtn.addEventListener('click', openLeaderboard);
    DOM.restartQuizBtn.addEventListener('click', () => {
      if (confetti) confetti.stop();
      startQuiz();
    });

    // 모달 버튼
    DOM.closeModalBtn.addEventListener('click', closeLeaderboard);
    DOM.closeModalBtn2.addEventListener('click', closeLeaderboard);
    DOM.clearLeaderboardBtn.addEventListener('click', clearLeaderboard);
    DOM.leaderboardModal.addEventListener('click', (e) => {
      if (e.target === DOM.leaderboardModal) {
        closeLeaderboard();
      }
    });

    // 키보드 단축키 지원 (1, 2, 3, 4 키로 보기 선택, Enter/Space로 다음 문제)
    window.addEventListener('keydown', (e) => {
      // 모달 열려있을 때 ESC로 닫기
      if (e.key === 'Escape' && DOM.leaderboardModal.classList.contains('active')) {
        closeLeaderboard();
        return;
      }

      // 게임 진행 화면에서만 단축키 동작
      if (!DOM.gameScreen.classList.contains('active')) return;

      if (!state.isAnswered) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const index = parseInt(e.key, 10) - 1;
          handleOptionSelect(index);
        }
      } else {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          goToNextQuestion();
        }
      }
    });
  }

  // ==========================================================================
  // 10. 초기화 (App Init)
  // ==========================================================================
  function init() {
    initTheme();
    initSoundButton();
    renderIntroTop5();
    bindEvents();

    if (DOM.confettiCanvas) {
      confetti = new ConfettiEffect(DOM.confettiCanvas);
    }
  }

  // DOM 로드 완료 후 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
