// Daily Task Tracker - Advanced Feature Packed (Vanilla JS)

const STORAGE_KEYS = {
  TODOS: 'daily_task_tracker_todos_v2',
  THEME: 'daily_task_theme',
  STREAK: 'daily_task_streak_v1',
  ARCHIVE: 'daily_task_archive_v1',
  AUTO_CLASSIFY: 'daily_task_auto_classify_v1'
};

// Keyword mapping for automatic category detection
const CATEGORY_KEYWORDS = {
  work: [
    // 한국어 업무/회사 키워드
    '회의', '미팅', '보고', '보고서', '프로젝트', '기획', '개발', '배포', '코드리뷰', '업무',
    '발표', '슬랙', '메일', '이메일', '고객', '제안서', '이슈', '버그', '스프린트', '일정',
    '협업', '문서', '계약', '마케팅', '디자인', '스케줄', '스크럼', '점검', '모니터링', '인터뷰',
    '출근', '퇴근', '납기', '마감', '기획서', '정산', '견적', '품의', '발주', '서류', '결재',
    '운영', '요구사항', '클라이언트', '미팅록', '피드백', '발주서', '파트너', '출장',
    // 영문 업무 키워드
    'meeting', 'project', 'work', 'client', 'review', 'deploy', 'refactor', 'doc',
    'pr', 'pull request', 'jira', 'issue', 'bug', 'sprint', 'scrum', 'release', 'qa'
  ],
  personal: [
    // 한국어 개인/일상/건강 키워드
    '운동', '헬스', '산책', '장보기', '마트', '쇼핑', '청소', '빨래', '병원', '약', '진료',
    '식사', '요리', '점심', '저녁', '아침', '은행', '송금', '약속', '영화', '휴식', '취미',
    '쓰레기', '분리수거', '가족', '친구', '여행', '외식', '건강', '세탁', '정리', '샤워', '수면',
    '카페', '커피', '데이트', '부모님', '생일', '선물', '치과', '안과', '미용실', '이발', '목욕',
    '통장', '적금', '보험', '방청소', '설거지', '요가', '필라테스', '러닝', '조깅', '헬스장',
    // 영문 개인/일상 키워드
    'workout', 'gym', 'clean', 'buy', 'cook', 'personal', 'shopping', 'dinner',
    'lunch', 'breakfast', 'health', 'hospital', 'movie', 'rest', 'walk', 'run', 'yoga'
  ],
  study: [
    // 한국어 공부/학습 키워드
    '공부', '스터디', '책', '독서', '강의', '인강', '복습', '예습', '시험', '자격증',
    '문제', '문제풀이', '영어', '단어', '학습', '알고리즘', '세미나', '논문', '과제', '숙제',
    '수업', '코딩테스트', '코테', '자바스크립트', '파이썬', '리액트', '개념', '정독', '실습', '필기',
    '암기', '독후감', '수강', '튜토리얼', '자료구조', '토익', '오픽', '모의고사', '자습', '교재',
    '강좌', '교과서', '단어장', '문법', '청해', '독해', '테스트공부', '기출문제',
    // 영문 공부/학습 키워드
    'study', 'book', 'exam', 'learn', 'lecture', 'reading', 'homework', 'tutorial',
    'algorithm', 'course', 'english', 'test', 'review study', 'practice', 'quiz'
  ]
};

// Initial sample data
const DEFAULT_TODOS = [
  {
    id: 'task_1',
    text: '주간 업무 보고서 작성 및 공유',
    category: 'work',
    completed: false,
    starred: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_2',
    text: '자바스크립트 최신 비동기 문법 복습',
    category: 'study',
    completed: true,
    starred: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task_3',
    text: '저녁 유산소 운동 30분',
    category: 'personal',
    completed: false,
    starred: true,
    createdAt: new Date().toISOString()
  }
];

class TodoApp {
  constructor() {
    this.todos = this.loadTodos();
    this.categoryFilter = 'all';
    this.statusFilter = 'all';
    this.searchQuery = '';
    this.editingId = null;
    this.isInputStarred = false;
    this.draggedIndex = null;
    this.hasCelebrated = false;

    // Auto category classification states
    this.isAutoClassifyEnabled = this.loadAutoClassifySetting();
    this.userManuallySelectedCategory = false;

    this.cacheDom();
    this.initTheme();
    this.initDate();
    this.initStreak();
    this.initAutoClassify();
    this.bindEvents();
    this.render();
  }

  // --- Storage Operations ---
  loadTodos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TODOS);
      if (stored) {
        return JSON.parse(stored);
      }
      // Migrate from v1 if present
      const v1 = localStorage.getItem('daily_task_tracker_todos_v1');
      if (v1) {
        const parsed = JSON.parse(v1);
        return parsed.map(t => ({ ...t, starred: t.starred || false }));
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return [...DEFAULT_TODOS];
  }

  saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(this.todos));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }

  loadAutoClassifySetting() {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTO_CLASSIFY);
    return saved === null ? true : saved === 'true';
  }

  saveAutoClassifySetting() {
    localStorage.setItem(STORAGE_KEYS.AUTO_CLASSIFY, this.isAutoClassifyEnabled);
  }

  // --- DOM Elements Cache ---
  cacheDom() {
    this.currentDateEl = document.getElementById('currentDate');
    this.streakBadgeEl = document.getElementById('streakBadge');
    this.themeToggleBtn = document.getElementById('themeToggleBtn');
    this.celebrationBadgeEl = document.getElementById('celebrationBadge');
    this.confettiCanvas = document.getElementById('confettiCanvas');

    this.progressPercentEl = document.getElementById('progressPercent');
    this.progressBarFillEl = document.getElementById('progressBarFill');
    this.totalCountEl = document.getElementById('totalCount');
    this.activeCountEl = document.getElementById('activeCount');
    this.completedCountEl = document.getElementById('completedCount');
    this.starredCountEl = document.getElementById('starredCount');

    this.newDayBtn = document.getElementById('newDayBtn');
    this.todoForm = document.getElementById('todoForm');
    this.todoInput = document.getElementById('todoInput');
    this.starInputToggle = document.getElementById('starInputToggle');
    this.categoryRadios = document.querySelectorAll('input[name="inputCategory"]');
    this.autoClassifyToggle = document.getElementById('autoClassifyToggle');
    this.autoClassifyHint = document.getElementById('autoClassifyHint');
    this.autoHintText = document.getElementById('autoHintText');

    this.searchInput = document.getElementById('searchInput');
    this.clearSearchBtn = document.getElementById('clearSearchBtn');

    this.categoryFilterTabs = document.getElementById('categoryFilterTabs');
    this.statusFilterTabs = document.getElementById('statusFilterTabs');
    this.todoListEl = document.getElementById('todoList');
    this.emptyStateEl = document.getElementById('emptyState');

    this.exportBackupBtn = document.getElementById('exportBackupBtn');
    this.importBackupBtn = document.getElementById('importBackupBtn');
    this.backupFileInput = document.getElementById('backupFileInput');
    this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
  }

  initAutoClassify() {
    if (this.autoClassifyToggle) {
      this.autoClassifyToggle.checked = this.isAutoClassifyEnabled;
    }
  }

  // --- Theme Management ---
  initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(savedTheme);
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  // --- Date & Streak Routine ---
  initDate() {
    const now = new Date();
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const formatted = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, '0')}. ${String(now.getDate()).padStart(2, '0')} (${days[now.getDay()]})`;
    this.currentDateEl.textContent = formatted;
  }

  initStreak() {
    const streakData = this.getStreakData();
    this.streakBadgeEl.textContent = `🔥 ${streakData.count}일 연속`;
  }

  getStreakData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    return { count: 0, lastAchievedDate: null };
  }

  checkStreakOnCompletion() {
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;

    if (total > 0 && total === completed) {
      const todayStr = new Date().toISOString().split('T')[0];
      let streak = this.getStreakData();

      if (streak.lastAchievedDate !== todayStr) {
        // Check if last achievement was yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (streak.lastAchievedDate === yesterdayStr) {
          streak.count += 1;
        } else {
          streak.count = 1;
        }
        streak.lastAchievedDate = todayStr;
        localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
        this.streakBadgeEl.textContent = `🔥 ${streak.count}일 연속`;
      }
    }
  }

  // Routine: Start New Day
  startNewDay() {
    const completedTasks = this.todos.filter(t => t.completed);
    if (completedTasks.length === 0) {
      alert('완료된 할 일이 없어 아카이브할 항목이 없습니다. 활기찬 하루 보내세요!');
      return;
    }

    if (confirm(`완료된 ${completedTasks.length}개의 할 일을 아카이브에 저장하고, 새로운 하루를 시작하시겠습니까?`)) {
      // Archive completed tasks
      try {
        const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.ARCHIVE) || '[]');
        history.push({
          date: new Date().toISOString().split('T')[0],
          archivedTasks: completedTasks
        });
        localStorage.setItem(STORAGE_KEYS.ARCHIVE, JSON.stringify(history));
      } catch (e) {
        console.error('Failed to archive', e);
      }

      // Keep only incomplete tasks
      this.todos = this.todos.filter(t => !t.completed);
      this.hasCelebrated = false;
      this.saveTodos();
      this.render();
      alert('새로운 하루가 시작되었습니다! 미완료된 할 일에 집중해보세요. ☀️');
    }
  }

  // --- Event Bindings ---
  bindEvents() {
    // Theme toggle
    this.themeToggleBtn.addEventListener('click', () => this.toggleTheme());

    // New day routine
    this.newDayBtn.addEventListener('click', () => this.startNewDay());

    // Star toggle in input row
    this.starInputToggle.addEventListener('click', () => {
      this.isInputStarred = !this.isInputStarred;
      this.starInputToggle.classList.toggle('active', this.isInputStarred);
    });

    // Form submission
    this.todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.addTodo();
    });

    // Auto-classification toggle
    if (this.autoClassifyToggle) {
      this.autoClassifyToggle.addEventListener('change', (e) => {
        this.isAutoClassifyEnabled = e.target.checked;
        this.saveAutoClassifySetting();
        if (!this.isAutoClassifyEnabled) {
          this.hideAutoClassifyHint();
        } else {
          this.userManuallySelectedCategory = false;
          this.handleAutoClassify(this.todoInput.value.trim());
        }
      });
    }

    // Real-time keyword auto-classification on input
    this.todoInput.addEventListener('input', (e) => {
      const text = e.target.value.trim();
      if (!text) {
        this.userManuallySelectedCategory = false;
        this.hideAutoClassifyHint();
        return;
      }
      this.handleAutoClassify(text);
    });

    // Manual category radio selection tracking
    this.categoryRadios.forEach(radio => {
      radio.addEventListener('click', () => {
        this.userManuallySelectedCategory = true;
        this.hideAutoClassifyHint();
      });
    });

    // Search input
    this.searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.clearSearchBtn.style.display = this.searchQuery ? 'block' : 'none';
      this.render();
    });

    this.clearSearchBtn.addEventListener('click', () => {
      this.searchInput.value = '';
      this.searchQuery = '';
      this.clearSearchBtn.style.display = 'none';
      this.searchInput.focus();
      this.render();
    });

    // Category Filter tabs
    this.categoryFilterTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.filter-tab');
      if (!tab) return;
      this.categoryFilterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      this.categoryFilter = tab.dataset.category;
      this.render();
    });

    // Status Filter tabs
    this.statusFilterTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.status-tab');
      if (!tab) return;
      this.statusFilterTabs.querySelectorAll('.status-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      this.statusFilter = tab.dataset.status;
      this.render();
    });

    // Clear completed tasks
    this.clearCompletedBtn.addEventListener('click', () => {
      const completedExist = this.todos.some(t => t.completed);
      if (!completedExist) {
        alert('완료된 할 일이 없습니다.');
        return;
      }
      if (confirm('완료된 모든 할 일을 목록에서 완전히 삭제하시겠습니까?')) {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
      }
    });

    // Backup Export
    this.exportBackupBtn.addEventListener('click', () => this.exportBackup());

    // Backup Import
    this.importBackupBtn.addEventListener('click', () => this.backupFileInput.click());
    this.backupFileInput.addEventListener('change', (e) => this.importBackup(e));
  }

  // --- Auto-Classification Methods ---
  classifyText(text) {
    if (!text || !text.trim()) return null;
    const lower = text.toLowerCase();

    let bestCategory = null;
    let maxScore = 0;
    let bestKeyword = null;

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      let catScore = 0;
      let topKw = null;
      let topKwLen = 0;

      for (const kw of keywords) {
        const kwLower = kw.toLowerCase();
        if (lower.includes(kwLower)) {
          const score = kwLower.length * 2;
          catScore += score;
          if (kwLower.length > topKwLen) {
            topKwLen = kwLower.length;
            topKw = kw;
          }
        }
      }

      if (catScore > maxScore) {
        maxScore = catScore;
        bestCategory = category;
        bestKeyword = topKw;
      }
    }

    if (bestCategory && maxScore > 0) {
      return { category: bestCategory, keyword: bestKeyword };
    }
    return null;
  }

  handleAutoClassify(text) {
    if (!this.isAutoClassifyEnabled || this.userManuallySelectedCategory) {
      return;
    }

    const match = this.classifyText(text);
    if (match) {
      this.setSelectedCategory(match.category);
      this.showAutoClassifyHint(match.keyword, match.category);
    } else {
      this.hideAutoClassifyHint();
    }
  }

  setSelectedCategory(category) {
    this.categoryRadios.forEach(radio => {
      if (radio.value === category) {
        if (!radio.checked) {
          radio.checked = true;
          const chip = radio.parentElement.querySelector('.chip');
          if (chip) {
            chip.classList.remove('auto-pulse');
            void chip.offsetWidth;
            chip.classList.add('auto-pulse');
            setTimeout(() => chip.classList.remove('auto-pulse'), 500);
          }
        }
      } else {
        radio.checked = false;
      }
    });
  }

  showAutoClassifyHint(keyword, category) {
    if (!this.autoClassifyHint || !this.autoHintText) return;
    const catInfo = this.getCategoryLabel(category);
    this.autoHintText.innerHTML = `키워드 <strong>'${this.escapeHtml(keyword)}'</strong> 감지됨 → <strong class="${catInfo.class}">${catInfo.name}</strong> 카테고리로 자동 선택되었습니다.`;
    this.autoClassifyHint.style.display = 'flex';
  }

  hideAutoClassifyHint() {
    if (this.autoClassifyHint) {
      this.autoClassifyHint.style.display = 'none';
    }
  }

  cycleTodoCategory(id) {
    const order = ['work', 'personal', 'study'];
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      const curIdx = order.indexOf(todo.category);
      const nextIdx = curIdx === -1 ? 0 : (curIdx + 1) % order.length;
      todo.category = order[nextIdx];
      this.saveTodos();
      this.render();
    }
  }

  // --- Data Backup & Restore ---
  exportBackup() {
    const backupData = {
      version: 2,
      exportedAt: new Date().toISOString(),
      todos: this.todos,
      streak: this.getStreakData()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `daily_task_backup_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data.todos)) {
          throw new Error('올바르지 않은 백업 파일 형식입니다.');
        }
        if (confirm(`백업 파일에서 ${data.todos.length}개의 할 일을 복원하시겠습니까? 기존 데이터는 대체됩니다.`)) {
          this.todos = data.todos;
          if (data.streak) {
            localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(data.streak));
            this.initStreak();
          }
          this.saveTodos();
          this.render();
          alert('데이터 복원이 성공적으로 완료되었습니다! 🎉');
        }
      } catch (err) {
        alert('파일을 불러오는 데 실패했습니다: ' + err.message);
      } finally {
        this.backupFileInput.value = '';
      }
    };
    reader.readAsText(file);
  }

  // --- CRUD Operations ---
  getSelectedCategory() {
    for (const radio of this.categoryRadios) {
      if (radio.checked) return radio.value;
    }
    return 'work';
  }

  addTodo() {
    const text = this.todoInput.value.trim();
    if (!text) return;

    let category = this.getSelectedCategory();
    if (this.isAutoClassifyEnabled && !this.userManuallySelectedCategory) {
      const match = this.classifyText(text);
      if (match) {
        category = match.category;
      }
    }

    const newTodo = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      text: text,
      category: category,
      completed: false,
      starred: this.isInputStarred,
      createdAt: new Date().toISOString()
    };

    this.todos.unshift(newTodo);
    this.saveTodos();
    this.todoInput.value = '';
    this.isInputStarred = false;
    this.userManuallySelectedCategory = false;
    this.hideAutoClassifyHint();
    this.starInputToggle.classList.remove('active');
    this.todoInput.focus();
    this.render();
  }

  toggleComplete(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveTodos();
      this.checkStreakOnCompletion();
      this.render();
    }
  }

  toggleStar(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.starred = !todo.starred;
      this.saveTodos();
      this.render();
    }
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.saveTodos();
    this.render();
  }

  startEditing(id) {
    this.editingId = id;
    this.render();
  }

  saveEdit(id, newText) {
    const trimmed = newText.trim();
    if (trimmed) {
      const todo = this.todos.find(t => t.id === id);
      if (todo) {
        todo.text = trimmed;
      }
    }
    this.editingId = null;
    this.saveTodos();
    this.render();
  }

  cancelEdit() {
    this.editingId = null;
    this.render();
  }

  // --- Drag & Drop Reordering ---
  setupDragAndDrop(itemEl, index) {
    itemEl.setAttribute('draggable', 'true');

    itemEl.addEventListener('dragstart', (e) => {
      this.draggedIndex = index;
      e.dataTransfer.effectAllowed = 'move';
      itemEl.classList.add('dragging');
    });

    itemEl.addEventListener('dragend', () => {
      itemEl.classList.remove('dragging');
      this.todoListEl.querySelectorAll('.todo-item').forEach(el => el.classList.remove('drag-over'));
      this.draggedIndex = null;
    });

    itemEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      itemEl.classList.add('drag-over');
    });

    itemEl.addEventListener('dragleave', () => {
      itemEl.classList.remove('drag-over');
    });

    itemEl.addEventListener('drop', (e) => {
      e.preventDefault();
      itemEl.classList.remove('drag-over');
      if (this.draggedIndex !== null && this.draggedIndex !== index) {
        const movedItem = this.todos.splice(this.draggedIndex, 1)[0];
        this.todos.splice(index, 0, movedItem);
        this.saveTodos();
        this.render();
      }
    });
  }

  // --- Progress & Celebration Confetti ---
  updateProgress() {
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const active = total - completed;
    const starred = this.todos.filter(t => t.starred).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    this.totalCountEl.textContent = total;
    this.activeCountEl.textContent = active;
    this.completedCountEl.textContent = completed;
    this.starredCountEl.textContent = starred;
    this.progressPercentEl.textContent = `${percent}%`;
    this.progressBarFillEl.style.width = `${percent}%`;

    // 100% Achievement Celebration
    if (total > 0 && percent === 100) {
      this.celebrationBadgeEl.style.display = 'inline-block';
      if (!this.hasCelebrated) {
        this.fireConfetti();
        this.hasCelebrated = true;
      }
    } else {
      this.celebrationBadgeEl.style.display = 'none';
      if (percent < 100) {
        this.hasCelebrated = false;
      }
    }
  }

  // Lightweight Pure JS Confetti Effect
  fireConfetti() {
    const canvas = this.confettiCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const count = 75;
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'];

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 4 + 3,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 10 - 5
      });
    }

    let animationId;
    let frames = 0;

    const renderFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frames++;
      if (frames < 180) {
        animationId = requestAnimationFrame(renderFrame);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
      }
    };

    renderFrame();
  }

  // --- Filtering & Sorting ---
  getFilteredTodos() {
    return this.todos.filter(todo => {
      // 1. Category Filter
      const matchCategory = (this.categoryFilter === 'all') || (todo.category === this.categoryFilter);

      // 2. Status Filter
      let matchStatus = true;
      if (this.statusFilter === 'active') matchStatus = !todo.completed;
      else if (this.statusFilter === 'completed') matchStatus = todo.completed;
      else if (this.statusFilter === 'starred') matchStatus = !!todo.starred;

      // 3. Search Query Filter
      const matchSearch = !this.searchQuery || todo.text.toLowerCase().includes(this.searchQuery);

      return matchCategory && matchStatus && matchSearch;
    });
  }

  getCategoryLabel(category) {
    switch (category) {
      case 'work': return { name: '업무', class: 'work' };
      case 'personal': return { name: '개인', class: 'personal' };
      case 'study': return { name: '공부', class: 'study' };
      default: return { name: '일반', class: 'work' };
    }
  }

  // --- Rendering ---
  render() {
    this.updateProgress();

    const filtered = this.getFilteredTodos();
    this.todoListEl.innerHTML = '';

    if (filtered.length === 0) {
      this.emptyStateEl.style.display = 'block';
    } else {
      this.emptyStateEl.style.display = 'none';

      filtered.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        const catInfo = this.getCategoryLabel(todo.category);
        const isEditing = this.editingId === todo.id;

        if (isEditing) {
          // Editing mode
          li.innerHTML = `
            <div class="todo-item-left">
              <span class="category-badge ${catInfo.class}" title="클릭하여 카테고리 변경">${catInfo.name}</span>
              <input type="text" class="edit-input" value="${this.escapeHtml(todo.text)}" />
            </div>
            <div class="todo-actions">
              <button class="action-btn save-btn" title="저장">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>
              <button class="action-btn cancel-btn" title="취소">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          `;

          const editInput = li.querySelector('.edit-input');
          const saveBtn = li.querySelector('.save-btn');
          const cancelBtn = li.querySelector('.cancel-btn');
          const catBadge = li.querySelector('.category-badge');

          if (catBadge) {
            catBadge.addEventListener('click', (e) => {
              e.stopPropagation();
              this.cycleTodoCategory(todo.id);
            });
          }

          setTimeout(() => {
            editInput.focus();
            editInput.setSelectionRange(editInput.value.length, editInput.value.length);
          }, 0);

          saveBtn.addEventListener('click', () => this.saveEdit(todo.id, editInput.value));
          cancelBtn.addEventListener('click', () => this.cancelEdit());

          editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              this.saveEdit(todo.id, editInput.value);
            } else if (e.key === 'Escape') {
              this.cancelEdit();
            }
          });

        } else {
          // Normal display mode
          li.innerHTML = `
            <div class="todo-item-left">
              <span class="drag-handle" title="드래그하여 순서 변경">⋮⋮</span>
              <label class="custom-checkbox">
                <input type="checkbox" ${todo.completed ? 'checked' : ''} />
                <span class="checkmark"></span>
              </label>
              <button class="item-star-btn ${todo.starred ? 'starred' : ''}" title="중요 표시 토글">⭐</button>
              <span class="category-badge ${catInfo.class}" title="클릭하여 카테고리 변경 (${catInfo.name})">${catInfo.name}</span>
              <span class="todo-text" title="더블 클릭하여 수정">${this.escapeHtml(todo.text)}</span>
            </div>
            <div class="todo-actions">
              <button class="action-btn edit-btn" title="수정">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
              <button class="action-btn delete-btn" title="삭제">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          `;

          // Setup drag and drop for this item
          this.setupDragAndDrop(li, index);

          // Category badge click to cycle
          const catBadge = li.querySelector('.category-badge');
          if (catBadge) {
            catBadge.addEventListener('click', (e) => {
              e.stopPropagation();
              this.cycleTodoCategory(todo.id);
            });
          }

          // Checkbox complete toggle
          const checkbox = li.querySelector('input[type="checkbox"]');
          checkbox.addEventListener('change', () => this.toggleComplete(todo.id));

          // Star toggle
          const starBtn = li.querySelector('.item-star-btn');
          starBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStar(todo.id);
          });

          // Text double click to edit
          const textEl = li.querySelector('.todo-text');
          textEl.addEventListener('dblclick', () => this.startEditing(todo.id));

          // Edit action button
          const editBtn = li.querySelector('.edit-btn');
          editBtn.addEventListener('click', () => this.startEditing(todo.id));

          // Delete action button
          const deleteBtn = li.querySelector('.delete-btn');
          deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));
        }

        this.todoListEl.appendChild(li);
      });
    }
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});
