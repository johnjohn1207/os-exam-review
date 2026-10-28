/**
 * OS Master - 作業系統期中考互動複習系統 主應用邏輯 (app.js)
 */

// 顏色調色盤（供甘特圖各行程使用）
const PROCESS_COLORS = [
  '#0284c7', '#0d9488', '#d97706', '#e11d48', '#7c3aed',
  '#2563eb', '#059669', '#ca8a04', '#db2777', '#4f46e5'
];

class OSMasterApp {
  constructor() {
    this.storageKey = 'OS_MASTER_DATA_V6';
    this.progressKey = 'OS_MASTER_PROGRESS_V1';
    this.data = this.loadData();
    this.progress = this.loadProgress();

    this.currentChapterId = this.data.chapters[0]?.id || 'ch1';
    this.currentFlashcardIdx = 0;
    this.flashcardIsFlipped = false;
    this.currentQuizFilter = 'all';
    this.currentQuizCategoryFilter = 'all'; // 'all' | 'calc' | 'concept'
    this.currentEssayChapterFilter = 'all';
    this.currentEssayCategoryFilter = 'all'; // 'all' | 'calc' | 'concept' | 'design'
    this.currentEssaySearch = '';
    this.allEssayAnswersExpanded = false;
    this.currentPyramidMode = 'study'; // 'study' | 'quiz2' | 'quizAll'
    this.pyramidUserAnswers = {};

    this.initElements();
    this.initEvents();
    this.renderAll();
  }

  // ==========================================
  // 資料載入與持久化 (Local Storage)
  // ==========================================
  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        let updated = false;

        // 同步預設章節內容（CH1 ~ CH5），同時保留使用者自訂新增章節
        const defMap = new Map(OS_DEFAULT_DATA.chapters.map(c => [c.id, c]));
        const mergedChapters = [];
        const seenIds = new Set();

        // 依 OS_DEFAULT_DATA 順序優先加入預設章節（確保 ch1~ch5 順序正確）
        OS_DEFAULT_DATA.chapters.forEach(defCh => {
          mergedChapters.push(JSON.parse(JSON.stringify(defCh)));
          seenIds.add(defCh.id);
        });

        // 加入使用者自訂章節（若有）
        (parsed.chapters || []).forEach(userCh => {
          if (!seenIds.has(userCh.id)) {
            mergedChapters.push(userCh);
            seenIds.add(userCh.id);
            updated = true;
          }
        });
        parsed.chapters = mergedChapters;

        // 同步更新抽認卡
        const existingFcIds = new Set((parsed.flashcards || []).map(f => f.id));
        OS_DEFAULT_DATA.flashcards.forEach(defFc => {
          if (!existingFcIds.has(defFc.id)) {
            parsed.flashcards.push(defFc);
            updated = true;
          }
        });

        // 同步更新題庫
        const existingQIds = new Set((parsed.quizQuestions || []).map(q => q.id));
        OS_DEFAULT_DATA.quizQuestions.forEach(defQ => {
          if (!existingQIds.has(defQ.id)) {
            parsed.quizQuestions.push(defQ);
            updated = true;
          }
        });

        // 同步更新非選題 (essayQuestions) - 確保預設題庫保持最新並保留使用者自訂非選題
        const essayMap = new Map((parsed.essayQuestions || []).map(e => [e.id, e]));
        const mergedEssays = [];
        (OS_DEFAULT_DATA.essayQuestions || []).forEach(defE => {
          mergedEssays.push(JSON.parse(JSON.stringify(defE)));
          essayMap.delete(defE.id);
        });
        essayMap.forEach(customE => {
          mergedEssays.push(customE);
          updated = true;
        });
        parsed.essayQuestions = mergedEssays;

        localStorage.setItem(this.storageKey, JSON.stringify(parsed));
        return parsed;
      }
    } catch (e) {
      console.warn('載入自訂資料失敗，採用預設值', e);
    }
    return JSON.parse(JSON.stringify(OS_DEFAULT_DATA));
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error('儲存資料至 LocalStorage 失敗', e);
    }
  }

  loadProgress() {
    try {
      const stored = localStorage.getItem(this.progressKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.masteredEssayIds) parsed.masteredEssayIds = [];
        return parsed;
      }
    } catch (e) {
      console.warn('載入學習進度失敗', e);
    }
    return {
      answeredCount: 0,
      correctCount: 0,
      mistakeIds: [],
      masteredFlashcardIds: [],
      masteredEssayIds: []
    };
  }

  saveProgress() {
    try {
      localStorage.setItem(this.progressKey, JSON.stringify(this.progress));
      this.updateStatsBanner();
    } catch (e) {
      console.error('儲存學習進度失敗', e);
    }
  }

  resetData() {
    if (confirm('確定要將系統資料重設為原始預設版本嗎？此動作將清除自訂新增的章節與題目。')) {
      localStorage.removeItem(this.storageKey);
      this.data = JSON.parse(JSON.stringify(OS_DEFAULT_DATA));
      this.renderAll();
      alert('已成功恢復預設教材資料！');
    }
  }

  // ==========================================
  // DOM 元素初始化
  // ==========================================
  initElements() {
    // 導覽標籤按鈕
    this.navBtns = document.querySelectorAll('.nav-btn');
    this.tabContents = document.querySelectorAll('.tab-content');

    // 統計橫條
    this.statQuizAccuracy = document.getElementById('stat-quiz-accuracy');
    this.statQuizAnswered = document.getElementById('stat-quiz-answered');
    this.statMistakes = document.getElementById('stat-mistakes');
    this.statFlashcards = document.getElementById('stat-flashcards');
    this.statProgressFill = document.getElementById('stat-progress-fill');

    // 筆記區
    this.chapterNavContainer = document.getElementById('chapter-nav-container');
    this.chapterContentContainer = document.getElementById('chapter-content-container');
    this.noteSearchInput = document.getElementById('note-search-input');

    // 記憶體金字塔區
    this.pyramidDisplay = document.getElementById('pyramid-display');
    this.btnPyramidStudy = document.getElementById('btn-pyramid-study');
    this.btnPyramidQuiz2 = document.getElementById('btn-pyramid-quiz2');
    this.btnPyramidQuiz34 = document.getElementById('btn-pyramid-quiz34');
    this.btnPyramidQuizAll = document.getElementById('btn-pyramid-quizall');
    this.btnPyramidCheck = document.getElementById('btn-pyramid-check');
    this.pyramidFeedback = document.getElementById('pyramid-feedback');

    // 考點六死結動態挑戰器
    this.btnDeadlockModeBanker = document.getElementById('btn-deadlock-mode-banker');
    this.btnDeadlockModeDetect = document.getElementById('btn-deadlock-mode-detect');
    this.btnGenRandomDeadlock = document.getElementById('btn-gen-random-deadlock');
    this.dynamicDeadlockQuestionArea = document.getElementById('dynamic-deadlock-question-area');
    this.dynamicDeadlockInteractionArea = document.getElementById('dynamic-deadlock-interaction-area');
    this.btnChoiceSafe = document.getElementById('btn-choice-safe');
    this.btnChoiceUnsafe = document.getElementById('btn-choice-unsafe');
    this.btnToggleNeedHelper = document.getElementById('btn-toggle-need-helper');
    this.btnSubmitDeadlockVerdict = document.getElementById('btn-submit-deadlock-verdict');
    this.deadlockVerificationResult = document.getElementById('deadlock-verification-result');
    this.deadlockQuestionPrompt = document.getElementById('deadlock-question-prompt');

    // 考點七數值實驗室
    this.btnCalcCatNum = document.getElementById('btn-calc-cat-num');
    this.btnCalcCatGraph = document.getElementById('btn-calc-cat-graph');
    this.calcNavGroupNum = document.getElementById('calc-nav-group-num');
    this.calcNavGroupGraph = document.getElementById('calc-nav-group-graph');

    this.btnCalcTabDeadlock = document.getElementById('btn-calc-tab-deadlock');
    this.btnCalcTabSemaphore = document.getElementById('btn-calc-tab-semaphore');
    this.btnCalcTabBuffer = document.getElementById('btn-calc-tab-buffer');
    this.btnCalcTabExp = document.getElementById('btn-calc-tab-exp');
    this.btnCalcTabQuantum = document.getElementById('btn-calc-tab-quantum');
    this.btnCalcTabAmdahl = document.getElementById('btn-calc-tab-amdahl');
    this.btnCalcTabRAG = document.getElementById('btn-calc-tab-rag');
    this.btnCalcTabFork = document.getElementById('btn-calc-tab-fork');
    this.btnCalcTabCS = document.getElementById('btn-calc-tab-cs');

    this.calcPanelDeadlock = document.getElementById('calc-panel-deadlock');
    this.calcPanelSemaphore = document.getElementById('calc-panel-semaphore');
    this.calcPanelBuffer = document.getElementById('calc-panel-buffer');
    this.calcPanelExp = document.getElementById('calc-panel-exp');
    this.calcPanelQuantum = document.getElementById('calc-panel-quantum');
    this.calcPanelRAG = document.getElementById('calc-panel-rag');
    this.calcPanelFork = document.getElementById('calc-panel-fork');
    this.calcPanelCS = document.getElementById('calc-panel-cs');

    // 模組 1：死結最少資源數
    this.btnGenCalcDeadlock = document.getElementById('btn-gen-calc-deadlock');
    this.calcQDeadlockText = document.getElementById('calc-q-deadlock-text');
    this.calcDeadlockInput = document.getElementById('calc-deadlock-input');
    this.calcDeadlockInputLabel = document.getElementById('calc-deadlock-input-label');
    this.btnSubmitCalcDeadlock = document.getElementById('btn-submit-calc-deadlock');
    this.calcFeedbackDeadlock = document.getElementById('calc-feedback-deadlock');

    // 模組 2：信號量推算
    this.btnGenCalcSemaphore = document.getElementById('btn-gen-calc-semaphore');
    this.calcQSemaphoreText = document.getElementById('calc-q-semaphore-text');
    this.calcSemaphoreInputVal = document.getElementById('calc-semaphore-input-val');
    this.calcSemaphoreInputBlocked = document.getElementById('calc-semaphore-input-blocked');
    this.btnSubmitCalcSemaphore = document.getElementById('btn-submit-calc-semaphore');
    this.calcFeedbackSemaphore = document.getElementById('calc-feedback-semaphore');

    // 模組 3：環狀緩衝區
    this.btnGenCalcBuffer = document.getElementById('btn-gen-calc-buffer');
    this.calcQBufferText = document.getElementById('calc-q-buffer-text');
    this.calcBufferInputCount = document.getElementById('calc-buffer-input-count');
    this.calcBufferInputFree = document.getElementById('calc-buffer-input-free');
    this.calcBufferSelectStatus = document.getElementById('calc-buffer-select-status');
    this.btnSubmitCalcBuffer = document.getElementById('btn-submit-calc-buffer');
    this.calcFeedbackBuffer = document.getElementById('calc-feedback-buffer');

    // 模組 4：指數平滑法
    this.btnGenCalcExp = document.getElementById('btn-gen-calc-exp');
    this.calcQExpText = document.getElementById('calc-q-exp-text');
    this.calcExpInput = document.getElementById('calc-exp-input');
    this.btnSubmitCalcExp = document.getElementById('btn-submit-calc-exp');
    this.calcFeedbackExp = document.getElementById('calc-feedback-exp');

    // 模組 5：時間量子開銷
    this.btnGenCalcQuantum = document.getElementById('btn-gen-calc-quantum');
    this.calcQQuantumText = document.getElementById('calc-q-quantum-text');
    this.calcQuantumInputCs = document.getElementById('calc-quantum-input-cs');
    this.calcQuantumInputTotal = document.getElementById('calc-quantum-input-total');
    this.calcQuantumInputUtil = document.getElementById('calc-quantum-input-util');
    this.btnSubmitCalcQuantum = document.getElementById('btn-submit-calc-quantum');
    this.calcFeedbackQuantum = document.getElementById('calc-feedback-quantum');

    this.calcPanelAmdahl = document.getElementById('calc-panel-amdahl');
    this.btnGenCalcAmdahl = document.getElementById('btn-gen-calc-amdahl');
    this.calcQAmdahlText = document.getElementById('calc-q-amdahl-text');
    this.calcAmdahlInput = document.getElementById('calc-amdahl-input');
    this.btnVerifyCalcAmdahl = document.getElementById('btn-verify-calc-amdahl');
    this.calcFeedbackAmdahl = document.getElementById('calc-feedback-amdahl');

    // 模組 6：資源配置圖 RAG
    this.btnGenCalcRAG = document.getElementById('btn-gen-calc-rag');
    this.calcQRagText = document.getElementById('calc-q-rag-text');
    this.calcRagSvgContainer = document.getElementById('calc-rag-svg-container');
    this.btnRagCycleYes = document.getElementById('btn-rag-cycle-yes');
    this.btnRagCycleNo = document.getElementById('btn-rag-cycle-no');
    this.btnRagDeadlockYes = document.getElementById('btn-rag-deadlock-yes');
    this.btnRagDeadlockNo = document.getElementById('btn-rag-deadlock-no');
    this.btnSubmitCalcRAG = document.getElementById('btn-submit-calc-rag');
    this.calcFeedbackRAG = document.getElementById('calc-feedback-rag');

    // 模組 7：fork() 行程樹
    this.btnGenCalcFork = document.getElementById('btn-gen-calc-fork');
    this.calcQForkText = document.getElementById('calc-q-fork-text');
    this.calcForkInputContainer = document.getElementById('calc-fork-input-container');
    this.calcFeedbackFork = document.getElementById('calc-feedback-fork');

    // 模組 8：臨界區間除錯
    this.btnGenCalcCS = document.getElementById('btn-gen-calc-cs');
    this.calcQCsText = document.getElementById('calc-q-cs-text');
    this.calcCsCodeBox = document.getElementById('calc-cs-code-box');
    this.btnCsOptMutex = document.getElementById('btn-cs-opt-mutex');
    this.btnCsOptProgress = document.getElementById('btn-cs-opt-progress');
    this.btnCsOptBounded = document.getElementById('btn-cs-opt-bounded');
    this.btnCsOptCorrect = document.getElementById('btn-cs-opt-correct');
    this.btnSubmitCalcCS = document.getElementById('btn-submit-calc-cs');
    this.calcFeedbackCS = document.getElementById('calc-feedback-cs');

    // 甘特圖排程器區
    this.btnSchedModeDemo = document.getElementById('btn-sched-mode-demo');
    this.btnSchedModePractice = document.getElementById('btn-sched-mode-practice');
    this.schedPanelDemo = document.getElementById('sched-panel-demo');
    this.schedPanelPractice = document.getElementById('sched-panel-practice');
    this.schedPracticeAlgoSelect = document.getElementById('sched-practice-algo-select');
    this.schedPracticeCountSelect = document.getElementById('sched-practice-count-select');
    this.btnSchedPracticeGen = document.getElementById('btn-sched-practice-gen');
    this.schedPracticeQHeader = document.getElementById('sched-practice-q-header');
    this.schedPracticeQDesc = document.getElementById('sched-practice-q-desc');
    this.schedPracticeThPriority = document.getElementById('sched-practice-th-priority');
    this.schedPracticeGivenTbody = document.getElementById('sched-practice-given-tbody');
    this.schedPracticeInputTbody = document.getElementById('sched-practice-input-tbody');
    this.schedPracticeInputAwt = document.getElementById('sched-practice-input-awt');
    this.schedPracticeInputAtat = document.getElementById('sched-practice-input-atat');
    this.btnSchedPracticeVerify = document.getElementById('btn-sched-practice-verify');
    this.btnSchedPracticeReveal = document.getElementById('btn-sched-practice-reveal');
    this.btnSchedPracticeNext = document.getElementById('btn-sched-practice-next');
    this.schedPracticeFeedback = document.getElementById('sched-practice-feedback');

    this.simPresetSelect = document.getElementById('sim-preset-select');
    this.simAlgoSelect = document.getElementById('sim-algo-select');
    this.simQuantumWrap = document.getElementById('sim-quantum-wrap');
    this.simQuantumInput = document.getElementById('sim-quantum-input');
    this.processTableBody = document.getElementById('process-table-body');
    this.btnAddProcess = document.getElementById('btn-add-process');
    this.btnRunSim = document.getElementById('btn-run-sim');
    this.btnResetSim = document.getElementById('btn-reset-sim');
    this.ganttChartArea = document.getElementById('gantt-chart-area');
    this.ganttStatsSummary = document.getElementById('gantt-stats-summary');
    this.ganttTableBody = document.getElementById('gantt-table-body');

    // 題庫區
    this.quizChapterSelect = document.getElementById('quiz-chapter-select');
    this.quizListContainer = document.getElementById('quiz-list-container');
    this.btnResetQuiz = document.getElementById('btn-reset-quiz');
    this.quizCategoryPills = document.querySelectorAll('#quiz-category-pills .filter-pill');
    this.countQuizAll = document.getElementById('count-quiz-all');
    this.countQuizCalc = document.getElementById('count-quiz-calc');
    this.countQuizConcept = document.getElementById('count-quiz-concept');
    this.countQuizMistakes = document.getElementById('count-quiz-mistakes');

    // 期中非選問答庫區
    this.statEssays = document.getElementById('stat-essays');
    this.essayChapterSelect = document.getElementById('essay-chapter-select');
    this.essayCategoryPills = document.querySelectorAll('#essay-category-pills .filter-pill');
    this.essaySearchInput = document.getElementById('essay-search-input');
    this.essayListContainer = document.getElementById('essay-list-container');
    this.btnToggleAllEssayAnswers = document.getElementById('btn-toggle-all-essay-answers');
    this.countEssayAll = document.getElementById('count-essay-all');
    this.countEssayCalc = document.getElementById('count-essay-calc');
    this.countEssayConcept = document.getElementById('count-essay-concept');
    this.countEssayDesign = document.getElementById('count-essay-design');

    // 錯題本區
    this.mistakesContainer = document.getElementById('mistakes-container');
    this.btnClearMistakes = document.getElementById('btn-clear-mistakes');

    // 抽認卡區
    this.flashcardElement = document.getElementById('flashcard');
    this.flashcardChapter = document.getElementById('flashcard-chapter');
    this.flashcardIndicator = document.getElementById('flashcard-indicator');
    this.flashcardContent = document.getElementById('flashcard-content');
    this.btnFcPrev = document.getElementById('btn-fc-prev');
    this.btnFcNext = document.getElementById('btn-fc-next');
    this.btnFcToggleMaster = document.getElementById('btn-fc-toggle-master');

    // 擴充管理中心
    this.jsonExportArea = document.getElementById('json-export-area');
    this.btnExportJson = document.getElementById('btn-export-json');
    this.btnCopyJson = document.getElementById('btn-copy-json');
    this.btnImportJson = document.getElementById('btn-import-json');
    this.btnResetAll = document.getElementById('btn-reset-all');

    // 新增章節表單
    this.formAddChapter = document.getElementById('form-add-chapter');
    // 新增題目表單
    this.formAddQuestion = document.getElementById('form-add-question');
  }

  // ==========================================
  // 事件繫結
  // ==========================================
  initEvents() {
    // 導覽分頁切換
    this.navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });

    // 筆記搜尋
    if (this.noteSearchInput) {
      this.noteSearchInput.addEventListener('input', () => {
        this.renderChapterNotes();
      });
    }

    // 記憶體階層圖按鈕
    this.btnPyramidStudy?.addEventListener('click', () => this.setPyramidMode('study'));
    this.btnPyramidQuiz2?.addEventListener('click', () => this.setPyramidMode('quiz2'));
    this.btnPyramidQuiz34?.addEventListener('click', () => this.setPyramidMode('quiz34'));
    this.btnPyramidQuizAll?.addEventListener('click', () => this.setPyramidMode('quizAll'));
    this.btnPyramidCheck?.addEventListener('click', () => this.checkPyramidAnswers());

    // 考點六死結動態挑戰器事件
    this.btnDeadlockModeBanker?.addEventListener('click', () => this.setDeadlockChallengeMode('banker'));
    this.btnDeadlockModeDetect?.addEventListener('click', () => this.setDeadlockChallengeMode('detect'));
    this.btnGenRandomDeadlock?.addEventListener('click', () => this.generateRandomDeadlockProblem());
    this.btnChoiceSafe?.addEventListener('click', () => this.handleDeadlockChoice('safe'));
    this.btnChoiceUnsafe?.addEventListener('click', () => this.handleDeadlockChoice('unsafe'));
    this.btnToggleNeedHelper?.addEventListener('click', () => this.toggleNeedHelper());
    this.btnSubmitDeadlockVerdict?.addEventListener('click', () => this.verifyDeadlockAnswer());

    // 考點七數值實驗室事件
    this.btnCalcCatNum?.addEventListener('click', () => this.switchCalcCategory('num'));
    this.btnCalcCatGraph?.addEventListener('click', () => this.switchCalcCategory('graph'));

    this.btnCalcTabDeadlock?.addEventListener('click', () => this.switchCalcLabTab('deadlock'));
    this.btnCalcTabSemaphore?.addEventListener('click', () => this.switchCalcLabTab('semaphore'));
    this.btnCalcTabBuffer?.addEventListener('click', () => this.switchCalcLabTab('buffer'));
    this.btnCalcTabExp?.addEventListener('click', () => this.switchCalcLabTab('exp'));
    this.btnCalcTabQuantum?.addEventListener('click', () => this.switchCalcLabTab('quantum'));
    this.btnCalcTabAmdahl?.addEventListener('click', () => this.switchCalcLabTab('amdahl'));
    this.btnGenCalcAmdahl?.addEventListener('click', () => this.generateCalcAmdahl());
    this.btnVerifyCalcAmdahl?.addEventListener('click', () => this.verifyCalcAmdahl());
    this.btnCalcTabRAG?.addEventListener('click', () => this.switchCalcLabTab('rag'));
    this.btnCalcTabFork?.addEventListener('click', () => this.switchCalcLabTab('fork'));
    this.btnCalcTabCS?.addEventListener('click', () => this.switchCalcLabTab('cs'));

    this.btnGenCalcDeadlock?.addEventListener('click', () => this.generateCalcDeadlock());
    this.btnSubmitCalcDeadlock?.addEventListener('click', () => this.verifyCalcDeadlock());
    this.calcDeadlockInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.verifyCalcDeadlock(); });

    this.btnGenCalcSemaphore?.addEventListener('click', () => this.generateCalcSemaphore());
    this.btnSubmitCalcSemaphore?.addEventListener('click', () => this.verifyCalcSemaphore());
    this.calcSemaphoreInputVal?.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.verifyCalcSemaphore(); });
    this.calcSemaphoreInputBlocked?.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.verifyCalcSemaphore(); });

    this.btnGenCalcBuffer?.addEventListener('click', () => this.generateCalcBuffer());
    this.btnSubmitCalcBuffer?.addEventListener('click', () => this.verifyCalcBuffer());
    this.calcBufferInputCount?.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.verifyCalcBuffer(); });
    this.calcBufferInputFree?.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.verifyCalcBuffer(); });

    this.btnGenCalcExp?.addEventListener('click', () => this.generateCalcExp());
    this.btnSubmitCalcExp?.addEventListener('click', () => this.verifyCalcExp());
    this.calcExpInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.verifyCalcExp(); });

    this.btnGenCalcQuantum?.addEventListener('click', () => this.generateCalcQuantum());
    this.btnSubmitCalcQuantum?.addEventListener('click', () => this.verifyCalcQuantum());

    this.btnGenCalcRAG?.addEventListener('click', () => this.generateCalcRAG());
    this.btnGenCalcFork?.addEventListener('click', () => this.generateCalcFork());
    this.btnGenCalcCS?.addEventListener('click', () => this.generateCalcCS());

    // 圖形與逐步演練驗證監聽
    this.btnRagCycleYes?.addEventListener('click', () => this.selectRagChoice('cycle', true));
    this.btnRagCycleNo?.addEventListener('click', () => this.selectRagChoice('cycle', false));
    this.btnRagDeadlockYes?.addEventListener('click', () => this.selectRagChoice('deadlock', true));
    this.btnRagDeadlockNo?.addEventListener('click', () => this.selectRagChoice('deadlock', false));
    this.btnSubmitCalcRAG?.addEventListener('click', () => this.verifyCalcRAG());

    this.btnCsOptMutex?.addEventListener('click', () => this.selectCsChoice('mutex'));
    this.btnCsOptProgress?.addEventListener('click', () => this.selectCsChoice('progress'));
    this.btnCsOptBounded?.addEventListener('click', () => this.selectCsChoice('bounded'));
    this.btnCsOptCorrect?.addEventListener('click', () => this.selectCsChoice('correct'));
    this.btnSubmitCalcCS?.addEventListener('click', () => this.verifyCalcCS());

    this.calcAmdahlInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.verifyCalcAmdahl(); });

    // 甘特圖排程器
    this.btnSchedModeDemo?.addEventListener('click', () => this.switchSchedulerMode('demo'));
    this.btnSchedModePractice?.addEventListener('click', () => this.switchSchedulerMode('practice'));
    this.btnSchedPracticeGen?.addEventListener('click', () => this.generateSchedulerPractice());
    this.btnSchedPracticeNext?.addEventListener('click', () => this.generateSchedulerPractice());
    this.btnSchedPracticeVerify?.addEventListener('click', () => this.verifySchedulerPractice());
    this.btnSchedPracticeReveal?.addEventListener('click', () => this.revealSchedulerPracticeSolution());
    this.schedPracticeAlgoSelect?.addEventListener('change', () => this.generateSchedulerPractice());
    this.schedPracticeCountSelect?.addEventListener('change', () => this.generateSchedulerPractice());

    this.simPresetSelect?.addEventListener('change', (e) => this.loadPreset(e.target.value));
    this.simAlgoSelect?.addEventListener('change', (e) => {
      const isRR = e.target.value === 'RR';
      if (this.simQuantumWrap) {
        this.simQuantumWrap.style.display = isRR ? 'flex' : 'none';
      }
    });
    this.btnAddProcess?.addEventListener('click', () => this.addProcessRow());
    this.btnRunSim?.addEventListener('click', () => this.executeSimulation());
    this.btnResetSim?.addEventListener('click', () => this.loadPreset(this.simPresetSelect.value));

    // 題庫篩選
    this.quizChapterSelect?.addEventListener('change', (e) => {
      this.currentQuizFilter = e.target.value;
      this.renderQuiz();
    });
    this.btnResetQuiz?.addEventListener('click', () => {
      this.progress.answeredCount = 0;
      this.progress.correctCount = 0;
      this.saveProgress();
      this.renderQuiz();
    });

    // 題庫題型分類膠囊
    this.quizCategoryPills?.forEach(pill => {
      pill.addEventListener('click', () => {
        this.quizCategoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentQuizCategoryFilter = pill.getAttribute('data-cat') || 'all';
        this.renderQuiz();
      });
    });

    // 非選題章節篩選
    this.essayChapterSelect?.addEventListener('change', (e) => {
      this.currentEssayChapterFilter = e.target.value;
      this.renderEssayQuestions();
    });

    // 非選題類型膠囊
    this.essayCategoryPills?.forEach(pill => {
      pill.addEventListener('click', () => {
        this.essayCategoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.currentEssayCategoryFilter = pill.getAttribute('data-cat') || 'all';
        this.renderEssayQuestions();
      });
    });

    // 非選題關鍵字即時搜尋
    this.essaySearchInput?.addEventListener('input', (e) => {
      this.currentEssaySearch = e.target.value.trim().toLowerCase();
      this.renderEssayQuestions();
    });

    // 一鍵切換所有非選題解答展開/收合
    this.btnToggleAllEssayAnswers?.addEventListener('click', () => {
      this.toggleAllEssayAnswers();
    });

    // 錯題本
    this.btnClearMistakes?.addEventListener('click', () => {
      if (confirm('確定要清空所有錯題紀錄嗎？')) {
        this.progress.mistakeIds = [];
        this.saveProgress();
        this.updateStatsBanner();
        this.renderMistakes();
        if (this.currentQuizCategoryFilter === 'mistakes') {
          this.renderQuiz();
        }
      }
    });

    // 抽認卡
    this.flashcardElement?.addEventListener('click', () => this.flipFlashcard());
    this.btnFcPrev?.addEventListener('click', () => this.navigateFlashcard(-1));
    this.btnFcNext?.addEventListener('click', () => this.navigateFlashcard(1));
    this.btnFcToggleMaster?.addEventListener('click', () => this.toggleMasterFlashcard());

    // 擴充中心
    this.btnExportJson?.addEventListener('click', () => this.exportCurrentData());
    this.btnCopyJson?.addEventListener('click', () => this.copyJsonToClipboard());
    this.btnImportJson?.addEventListener('click', () => this.importCustomJson());
    this.btnResetAll?.addEventListener('click', () => this.resetData());

    // 新增章節表單送出
    this.formAddChapter?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddNewChapter();
    });

    // 新增題目表單送出
    this.formAddQuestion?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleAddNewQuestion();
    });
  }

  // ==========================================
  // 分頁切換邏輯
  // ==========================================
  switchTab(tabId) {
    this.navBtns.forEach(b => {
      if (b.getAttribute('data-tab') === tabId) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    this.tabContents.forEach(content => {
      if (content.id === `tab-${tabId}`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    // 切換時個別觸發渲染或刷新
    if (tabId === 'mistakes') {
      this.renderMistakes();
    } else if (tabId === 'flashcards') {
      this.renderFlashcard();
    } else if (tabId === 'quiz') {
      this.renderQuiz();
    } else if (tabId === 'essay') {
      this.renderEssayQuestions();
    } else if (tabId === 'simulator') {
      this.executeSimulation();
    } else if (tabId === 'extensions') {
      this.exportCurrentData();
    }
    const activePanel = document.getElementById(`tab-${tabId}`);
    if (activePanel) {
      this.renderMath(activePanel);
    }
  }

  // ==========================================
  // 總體指標橫條渲染
  // ==========================================
  updateStatsBanner() {
    const totalQ = this.data.quizQuestions.length;
    const answered = this.progress.answeredCount || 0;
    const correct = this.progress.correctCount || 0;
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    const mistakes = this.progress.mistakeIds ? this.progress.mistakeIds.length : 0;
    const masteredFc = this.progress.masteredFlashcardIds ? this.progress.masteredFlashcardIds.length : 0;
    const totalFc = this.data.flashcards.length;

    if (this.statQuizAccuracy) this.statQuizAccuracy.textContent = `${accuracy}%`;
    if (this.statQuizAnswered) this.statQuizAnswered.textContent = `${answered} / ${totalQ} 題`;
    if (this.statMistakes) this.statMistakes.textContent = `${mistakes} 題待複習`;
    if (this.statFlashcards) this.statFlashcards.textContent = `${masteredFc} / ${totalFc} 張已掌握`;

    // 非選題掌握統計
    const totalEssays = (this.data.essayQuestions || []).length;
    const masteredEssays = (this.progress.masteredEssayIds || []).length;
    if (this.statEssays) {
      this.statEssays.textContent = `${masteredEssays} / ${totalEssays} 題已掌握`;
    }

    // 統計選擇題各類別數量
    const allQuiz = this.data.quizQuestions || [];
    const quizCalcs = allQuiz.filter(q => q.category === 'calc').length;
    const quizConcepts = allQuiz.filter(q => q.category === 'concept' || !q.category).length;
    if (this.countQuizAll) this.countQuizAll.textContent = allQuiz.length;
    if (this.countQuizCalc) this.countQuizCalc.textContent = quizCalcs;
    if (this.countQuizConcept) this.countQuizConcept.textContent = quizConcepts;
    if (this.countQuizMistakes) this.countQuizMistakes.textContent = (this.progress.mistakeIds || []).length;

    // 統計非選題各類別數量
    const allEssays = this.data.essayQuestions || [];
    const essayCalcs = allEssays.filter(e => e.category === 'calc').length;
    const essayConcepts = allEssays.filter(e => e.category === 'concept').length;
    const essayDesigns = allEssays.filter(e => e.category === 'design').length;
    if (this.countEssayAll) this.countEssayAll.textContent = allEssays.length;
    if (this.countEssayCalc) this.countEssayCalc.textContent = essayCalcs;
    if (this.countEssayConcept) this.countEssayConcept.textContent = essayConcepts;
    if (this.countEssayDesign) this.countEssayDesign.textContent = essayDesigns;

    const progressPct = Math.min(100, Math.round(((answered + masteredFc + masteredEssays) / (totalQ + totalFc + totalEssays || 1)) * 100));
    if (this.statProgressFill) {
      this.statProgressFill.style.width = `${progressPct}%`;
    }
  }

  // ==========================================
  // Tab 1: 章節筆記核心導讀
  // ==========================================
  renderChapterNav() {
    if (!this.chapterNavContainer) return;
    this.chapterNavContainer.innerHTML = '';

    this.data.chapters.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = `chapter-btn ${ch.id === this.currentChapterId ? 'active' : ''}`;
      btn.textContent = ch.title.split(' ')[0] + ' ' + (ch.title.split(' ')[1] || '');
      btn.title = ch.title;
      btn.addEventListener('click', () => {
        this.currentChapterId = ch.id;
        this.renderChapterNav();
        this.renderChapterNotes();
      });
      this.chapterNavContainer.appendChild(btn);
    });

    // 同步更新測驗章節選單
    if (this.quizChapterSelect) {
      const currentVal = this.quizChapterSelect.value;
      this.quizChapterSelect.innerHTML = '<option value="all">全章節期中考題庫（綜合模擬）</option>';
      this.data.chapters.forEach(ch => {
        const opt = document.createElement('option');
        opt.value = ch.id;
        opt.textContent = ch.title;
        this.quizChapterSelect.appendChild(opt);
      });
      this.quizChapterSelect.value = currentVal || 'all';
    }

    // 同步更新新增題目下拉選單
    const targetSelect = document.getElementById('new-q-chapter');
    if (targetSelect) {
      targetSelect.innerHTML = '';
      this.data.chapters.forEach(ch => {
        const opt = document.createElement('option');
        opt.value = ch.id;
        opt.textContent = ch.title;
        targetSelect.appendChild(opt);
      });
    }
  }

  renderChapterNotes() {
    if (!this.chapterContentContainer) return;
    const currentChapter = this.data.chapters.find(c => c.id === this.currentChapterId);
    if (!currentChapter) {
      this.chapterContentContainer.innerHTML = '<p class="text-muted">查無章節資料。</p>';
      return;
    }

    const keyword = this.noteSearchInput ? this.noteSearchInput.value.trim().toLowerCase() : '';

    let html = `
      <div class="card">
        <div class="card-title">
          <span>${currentChapter.title}</span>
          <span class="badge badge-ch">章節焦點</span>
        </div>
        <div class="alert-box">
          <strong>期中考特別提醒：</strong> ${currentChapter.examTips || '掌握各核心演算法與機制。'}
        </div>
      </div>
    `;

    currentChapter.sections.forEach((sec, sIdx) => {
      let filteredItems = sec.items || [];
      if (keyword) {
        filteredItems = filteredItems.filter(item =>
          item.term.toLowerCase().includes(keyword) ||
          item.desc.toLowerCase().includes(keyword) ||
          sec.title.toLowerCase().includes(keyword)
        );
      }

      if (keyword && filteredItems.length === 0 && !sec.title.toLowerCase().includes(keyword)) {
        return; // 不符合關鍵字跳過
      }

      html += `
        <div class="section-card">
          <div class="section-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
            <span>${sec.title}</span>
            <span style="font-size:0.85rem; color:var(--text-muted); font-weight:normal;">點擊展開/收合</span>
          </div>
          <div class="section-body">
            <p style="color:var(--text-muted); margin-bottom:1rem; font-size:0.92rem;">${sec.summary || ''}</p>
            ${filteredItems.map(item => `
              <div class="term-group">
                <div class="term-name">${item.term}</div>
                <div class="term-desc">${this.formatDescription(item.desc)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    this.chapterContentContainer.innerHTML = html;
    this.renderMath(this.chapterContentContainer);
  }

  formatMath(text) {
    // 保留原始 LaTeX 標記（$$ 與 $），交由 KaTeX 官方向量排版引擎渲染
    return text || '';
  }

  formatDescription(text) {
    if (!text) return '';
    // 將純文字換行轉換為 <br/>，完整保留 LaTeX 公式標記
    return text.replace(/\n/g, '<br/>');
  }

  // ==========================================
  // Tab 2: 記憶體金字塔與排程器考點實戰
  // ==========================================
  setPyramidMode(mode) {
    this.currentPyramidMode = mode;
    this.pyramidUserAnswers = {};
    if (this.pyramidFeedback) {
      this.pyramidFeedback.style.display = 'none';
      this.pyramidFeedback.innerHTML = '';
    }

    [this.btnPyramidStudy, this.btnPyramidQuiz2, this.btnPyramidQuiz34, this.btnPyramidQuizAll].forEach(btn => {
      btn?.classList.remove('active');
    });

    if (mode === 'study') this.btnPyramidStudy?.classList.add('active');
    if (mode === 'quiz2') this.btnPyramidQuiz2?.classList.add('active');
    if (mode === 'quiz34') this.btnPyramidQuiz34?.classList.add('active');
    if (mode === 'quizAll') this.btnPyramidQuizAll?.classList.add('active');

    this.renderMemoryPyramid();
  }

  renderMemoryPyramid() {
    if (!this.pyramidDisplay) return;
    const levels = this.data.memoryHierarchy;
    const total = levels.length;

    // 決定要挖空的 index
    let blankIndices = new Set();
    if (this.currentPyramidMode === 'quiz2') {
      // 隨機挑選 2 個 level 挖空（符合考題「抓掉兩項填寫」）
      while (blankIndices.size < 2) {
        const rand = Math.floor(Math.random() * total);
        blankIndices.add(rand);
      }
    } else if (this.currentPyramidMode === 'quiz34') {
      // 隨機挑選 3 或 4 個 level 挖空
      const targetCount = Math.floor(Math.random() * 2) + 3;
      while (blankIndices.size < targetCount) {
        const rand = Math.floor(Math.random() * total);
        blankIndices.add(rand);
      }
    } else if (this.currentPyramidMode === 'quizAll') {
      for (let i = 0; i < total; i++) blankIndices.add(i);
    }

    this.currentBlankIndices = blankIndices;

    let html = `
      <div style="text-align:center; margin-bottom:1rem; font-size:0.85rem; color:var(--text-muted);">
        <strong>速度由快至慢、單位成本由高至低、容量由小至大 ↓</strong>
      </div>
      <div class="pyramid-container">
    `;

    // 寬度隨層級漸增
    const baseWidth = 52; // %
    const stepWidth = 7;

    levels.forEach((lvl, idx) => {
      const isBlank = blankIndices.has(idx);
      const widthPct = baseWidth + idx * stepWidth;

      html += `
        <div class="pyramid-level ${isBlank ? 'active-test' : ''}" style="width: ${widthPct}%;">
          <div class="pyramid-info">
            <span class="pyramid-badge">階層 ${lvl.level}</span>
            ${isBlank ? `
              <select class="pyramid-input-select" data-level="${lvl.level}">
                <option value="">-- 請選擇正確儲存體名稱 --</option>
                ${levels.map(opt => `
                  <option value="${opt.name}">${opt.name}（${opt.zhName}）</option>
                `).join('')}
              </select>
            ` : `
              <span class="pyramid-name">${lvl.name} <span style="color:var(--text-muted); font-size:0.85rem;">(${lvl.zhName})</span></span>
            `}
          </div>
          <div class="pyramid-meta">
            <span>存取速度：${lvl.speed}</span>
            <span>${lvl.volatile ? '<span style="color:#f43f5e;">揮發性 (Volatile)</span>' : '<span style="color:#10b981;">非揮發性</span>'}</span>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    this.pyramidDisplay.innerHTML = html;

    // 控制「送出核對」按鈕顯示
    if (this.btnPyramidCheck) {
      this.btnPyramidCheck.style.display = this.currentPyramidMode === 'study' ? 'none' : 'inline-block';
    }
  }

  checkPyramidAnswers() {
    if (this.currentPyramidMode === 'study') return;
    const selects = this.pyramidDisplay.querySelectorAll('.pyramid-input-select');
    let totalQuestions = selects.length;
    let correctCount = 0;
    let details = [];

    selects.forEach(sel => {
      const targetLevel = Number(sel.getAttribute('data-level'));
      const expected = this.data.memoryHierarchy.find(l => l.level === targetLevel);
      if (!expected) return;
      const userVal = sel.value;

      if (userVal === expected.name) {
        correctCount++;
        sel.style.borderColor = 'var(--accent-emerald)';
        sel.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
        details.push(`<p style="color:var(--accent-emerald);">階層 ${targetLevel} 正確：${expected.name}（${expected.zhName}）</p>`);
      } else {
        sel.style.borderColor = 'var(--accent-rose)';
        sel.style.backgroundColor = 'rgba(244, 63, 94, 0.2)';
        details.push(`<p style="color:var(--accent-rose);">階層 ${targetLevel} 錯誤：你的回答為「${userVal || '未填寫'}」，正解為「${expected.name}（${expected.zhName}）」。</p>`);
      }
    });

    if (this.pyramidFeedback) {
      this.pyramidFeedback.style.display = 'block';
      this.pyramidFeedback.innerHTML = `
        <div style="font-weight:700; margin-bottom:0.5rem; font-size:1.1rem; color:${correctCount === totalQuestions ? 'var(--accent-emerald)' : 'var(--accent-amber)'};">
          測驗結果：答對 ${correctCount} / ${totalQuestions} 項
        </div>
        ${details.join('')}
      `;
    }
  }

  // ==========================================
  // 考點六：動態隨機考題實戰演練器（死結判定）
  // ==========================================
  initDeadlockChallenge() {
    this.currentDeadlockMode = 'banker'; // 'banker' | 'detect'
    this.currentDeadlockProblem = null;
    this.currentDeadlockUserChoice = null;
    this.showNeedHelper = true;

    this.generateRandomDeadlockProblem();
  }

  setDeadlockChallengeMode(mode) {
    this.currentDeadlockMode = mode;
    this.btnDeadlockModeBanker?.classList.toggle('active', mode === 'banker');
    this.btnDeadlockModeDetect?.classList.toggle('active', mode === 'detect');
    if (this.btnToggleNeedHelper) {
      this.btnToggleNeedHelper.style.display = mode === 'banker' ? 'inline-block' : 'none';
    }
    this.generateRandomDeadlockProblem();
  }

  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  solveBanker(n, m, Available, Allocation, Need) {
    let Work = [...Available];
    let Finish = new Array(n).fill(false);
    let safeSequence = [];
    let steps = [];

    while (true) {
      let found = false;
      for (let i = 0; i < n; i++) {
        if (!Finish[i]) {
          let canAllocate = true;
          for (let j = 0; j < m; j++) {
            if (Need[i][j] > Work[j]) {
              canAllocate = false;
              break;
            }
          }
          if (canAllocate) {
            let oldWork = [...Work];
            for (let j = 0; j < m; j++) {
              Work[j] += Allocation[i][j];
            }
            Finish[i] = true;
            safeSequence.push(`P${i}`);
            steps.push({
              proc: `P${i}`,
              need: [...Need[i]],
              oldWork: oldWork,
              alloc: [...Allocation[i]],
              newWork: [...Work]
            });
            found = true;
            break;
          }
        }
      }
      if (!found) break;
    }

    const isSafe = Finish.every(Boolean);
    const deadlockedProcs = [];
    for (let i = 0; i < n; i++) {
      if (!Finish[i]) deadlockedProcs.push(`P${i}`);
    }

    return { isSafe, safeSequence, steps, deadlockedProcs, finalWork: Work };
  }

  solveDetection(n, m, Available, Allocation, Request) {
    let Work = [...Available];
    let Finish = new Array(n).fill(false);
    for (let i = 0; i < n; i++) {
      let hasAlloc = Allocation[i].some(v => v > 0);
      if (!hasAlloc) Finish[i] = true;
    }

    let executionSequence = [];
    let steps = [];

    while (true) {
      let found = false;
      for (let i = 0; i < n; i++) {
        if (!Finish[i]) {
          let canSatisfy = true;
          for (let j = 0; j < m; j++) {
            if (Request[i][j] > Work[j]) {
              canSatisfy = false;
              break;
            }
          }
          if (canSatisfy) {
            let oldWork = [...Work];
            for (let j = 0; j < m; j++) {
              Work[j] += Allocation[i][j];
            }
            Finish[i] = true;
            executionSequence.push(`P${i}`);
            steps.push({
              proc: `P${i}`,
              req: [...Request[i]],
              oldWork: oldWork,
              alloc: [...Allocation[i]],
              newWork: [...Work]
            });
            found = true;
            break;
          }
        }
      }
      if (!found) break;
    }

    const isDeadlocked = Finish.some(f => f === false);
    const deadlockedProcs = [];
    for (let i = 0; i < n; i++) {
      if (!Finish[i]) deadlockedProcs.push(`P${i}`);
    }

    return { isDeadlocked, executionSequence, steps, deadlockedProcs, finalWork: Work };
  }

  generateRandomDeadlockProblem() {
    const n = 4;
    const m = 3;
    const wantSafeOrNoDeadlock = Math.random() < 0.5;

    if (this.currentDeadlockMode === 'banker') {
      let selectedProblem = null;
      for (let attempt = 0; attempt < 500; attempt++) {
        const Allocation = [];
        const Need = [];
        const Max = [];
        for (let i = 0; i < n; i++) {
          const a = [this.randInt(0, 3), this.randInt(0, 2), this.randInt(0, 3)];
          const nd = [this.randInt(0, 4), this.randInt(0, 3), this.randInt(0, 3)];
          Allocation.push(a);
          Need.push(nd);
          Max.push([a[0] + nd[0], a[1] + nd[1], a[2] + nd[2]]);
        }
        const Available = [this.randInt(0, 4), this.randInt(0, 3), this.randInt(0, 3)];
        const sol = this.solveBanker(n, m, Available, Allocation, Need);
        if (sol.isSafe === wantSafeOrNoDeadlock) {
          selectedProblem = { mode: 'banker', n, m, Available, Allocation, Need, Max, sol };
          break;
        }
      }
      this.currentDeadlockProblem = selectedProblem;
    } else {
      let selectedProblem = null;
      for (let attempt = 0; attempt < 500; attempt++) {
        const Allocation = [];
        const Request = [];
        for (let i = 0; i < n; i++) {
          Allocation.push([this.randInt(0, 3), this.randInt(0, 2), this.randInt(0, 2)]);
          Request.push([this.randInt(0, 3), this.randInt(0, 2), this.randInt(0, 2)]);
        }
        if (!Allocation.some(row => row.some(v => v > 0))) continue;
        const Available = [this.randInt(0, 3), this.randInt(0, 2), this.randInt(0, 2)];
        const sol = this.solveDetection(n, m, Available, Allocation, Request);
        if (sol.isDeadlocked !== wantSafeOrNoDeadlock) {
          selectedProblem = { mode: 'detect', n, m, Available, Allocation, Request, sol };
          break;
        }
      }
      this.currentDeadlockProblem = selectedProblem;
    }

    this.currentDeadlockUserChoice = null;
    this.btnChoiceSafe?.classList.remove('active');
    this.btnChoiceUnsafe?.classList.remove('active');
    if (this.btnSubmitDeadlockVerdict) {
      this.btnSubmitDeadlockVerdict.disabled = true;
    }
    if (this.deadlockVerificationResult) {
      this.deadlockVerificationResult.style.display = 'none';
      this.deadlockVerificationResult.innerHTML = '';
    }

    this.renderDynamicDeadlockQuestion();
  }

  renderDynamicDeadlockQuestion() {
    if (!this.dynamicDeadlockQuestionArea || !this.currentDeadlockProblem) return;
    const p = this.currentDeadlockProblem;

    if (this.btnToggleNeedHelper) {
      this.btnToggleNeedHelper.style.display = p.mode === 'banker' ? 'inline-block' : 'none';
    }

    let html = '';
    if (p.mode === 'banker') {
      html += `
        <div style="margin-bottom:0.75rem; font-size:0.92rem; color:var(--text-light);">
          <strong>【題目情境】</strong> 系統中有 <strong>4 個行程（P0、P1、P2、P3）</strong> 與 <strong>3 種資源（A、B、C）</strong>。目前時間點 $T_0$ 的隨機配置矩陣如下。請動筆計算 $Need = Max - Allocation$，並判定此系統<strong>是否處於安全狀態（Safe State）？會不會引發死結？</strong>
        </div>
        <div style="overflow-x:auto;">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>行程</th>
                <th>已分配 Allocation (A B C)</th>
                <th>最大需求 Max (A B C)</th>
                <th>可用資源 Available (A B C)</th>
                ${this.showNeedHelper ? '<th>尚需資源 Need = Max - Allocation</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${p.Allocation.map((alloc, idx) => `
                <tr>
                  <td><strong>P${idx}</strong></td>
                  <td>${alloc.join(' ')}</td>
                  <td>${p.Max[idx].join(' ')}</td>
                  ${idx === 0 ? `<td rowspan="${p.n}" style="vertical-align:middle; text-align:center; font-weight:700; color:var(--accent-amber); font-size:1.05rem;">(${p.Available.join(', ')})</td>` : ''}
                  ${this.showNeedHelper ? `<td style="color:var(--primary); font-weight:600;">(${p.Need[idx].join(', ')})</td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      if (this.deadlockQuestionPrompt) {
        this.deadlockQuestionPrompt.textContent = '請選擇你的判斷：';
      }
      if (this.btnChoiceSafe) this.btnChoiceSafe.textContent = '安全狀態（絕不死結）';
      if (this.btnChoiceUnsafe) this.btnChoiceUnsafe.textContent = '不安全狀態（可能死結）';
    } else {
      html += `
        <div style="margin-bottom:0.75rem; font-size:0.92rem; color:var(--text-light);">
          <strong>【題目情境】</strong> 系統中有 <strong>4 個行程（P0、P1、P2、P3）</strong> 與 <strong>3 種資源（A、B、C）</strong>。目前分配與實際請求矩陣如下。請使用<strong>多實例死結偵測演算法</strong>，判定系統<strong>此時是否已經陷入死結（Deadlock）？</strong>
        </div>
        <div style="overflow-x:auto;">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>行程</th>
                <th>已分配 Allocation (A B C)</th>
                <th>當前請求 Request (A B C)</th>
                <th>可用資源 Available (A B C)</th>
              </tr>
            </thead>
            <tbody>
              ${p.Allocation.map((alloc, idx) => `
                <tr>
                  <td><strong>P${idx}</strong></td>
                  <td>${alloc.join(' ')}</td>
                  <td>${p.Request[idx].join(' ')}</td>
                  ${idx === 0 ? `<td rowspan="${p.n}" style="vertical-align:middle; text-align:center; font-weight:700; color:var(--accent-rose); font-size:1.05rem;">(${p.Available.join(', ')})</td>` : ''}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      if (this.deadlockQuestionPrompt) {
        this.deadlockQuestionPrompt.textContent = '請選擇你的判斷：';
      }
      if (this.btnChoiceSafe) this.btnChoiceSafe.textContent = '未發生死結（全部可完成）';
      if (this.btnChoiceUnsafe) this.btnChoiceUnsafe.textContent = '已陷入死結（存在死結環）';
    }

    this.dynamicDeadlockQuestionArea.innerHTML = html;
    this.renderMath(this.dynamicDeadlockQuestionArea);
  }

  handleDeadlockChoice(choice) {
    this.currentDeadlockUserChoice = choice;
    this.btnChoiceSafe?.classList.toggle('active', choice === 'safe');
    this.btnChoiceUnsafe?.classList.toggle('active', choice === 'unsafe');
    if (this.btnSubmitDeadlockVerdict) {
      this.btnSubmitDeadlockVerdict.disabled = false;
    }
  }

  toggleNeedHelper() {
    this.showNeedHelper = !this.showNeedHelper;
    this.renderDynamicDeadlockQuestion();
  }

  verifyDeadlockAnswer() {
    if (!this.currentDeadlockProblem || !this.currentDeadlockUserChoice) return;
    const p = this.currentDeadlockProblem;
    const choice = this.currentDeadlockUserChoice;
    const resultBox = this.deadlockVerificationResult;
    if (!resultBox) return;

    let isCorrect = false;
    let actualStatusText = '';

    if (p.mode === 'banker') {
      const isActuallySafe = p.sol.isSafe;
      isCorrect = (choice === 'safe' && isActuallySafe) || (choice === 'unsafe' && !isActuallySafe);
      actualStatusText = isActuallySafe ? '【安全狀態（Safe State，保證絕不死結）】' : '【不安全狀態（Unsafe State，可能/已引發死結）】';
    } else {
      const isActuallyDeadlocked = p.sol.isDeadlocked;
      isCorrect = (choice === 'safe' && !isActuallyDeadlocked) || (choice === 'unsafe' && isActuallyDeadlocked);
      actualStatusText = isActuallyDeadlocked ? '【已陷入死結（Deadlock Detected）】' : '【未發生死結（所有行程皆可順利完成）】';
    }

    let detailHtml = '';
    if (p.mode === 'banker') {
      detailHtml += `
        <div style="margin-top:0.75rem; font-size:0.9rem; line-height:1.7;">
          <h4 style="color:var(--primary); margin-bottom:0.5rem;">推導演算完整步驟（安全演算法）：</h4>
          <p>初始工作向量：<code>Work = Available = (${p.Available.join(', ')})</code></p>
          <ol style="margin-left:1.5rem; margin-top:0.35rem;">
            ${p.sol.steps.map((st, i) => `
              <li>步驟 ${i + 1}：檢查 <strong>${st.proc}</strong>，其 Need(${st.need.join(', ')}) ≤ Work(${st.oldWork.join(', ')}) 滿足！執行完畢釋放 Allocation(${st.alloc.join(', ')}) ⇒ 新 <code>Work = (${st.newWork.join(', ')})</code></li>
            `).join('')}
          </ol>
          ${p.sol.isSafe ? `
            <div style="margin-top:0.5rem; color:var(--accent-emerald); font-weight:700;">
              【推導結論】所有行程之 Finish 皆為 true。系統處於安全狀態，一組合法安全序列為：⟨${p.sol.safeSequence.join(', ')}⟩。
            </div>
          ` : `
            <div style="margin-top:0.5rem; color:var(--accent-rose); font-weight:700;">
              【推導結論】演算法中途終止。在 Work = (${p.sol.finalWork.join(', ')}) 時，無法滿足任何剩餘未完成行程（${p.sol.deadlockedProcs.join(', ')}）的 Need 需求，因此系統處於不安全狀態。
            </div>
          `}
        </div>
      `;
    } else {
      detailHtml += `
        <div style="margin-top:0.75rem; font-size:0.9rem; line-height:1.7;">
          <h4 style="color:var(--primary); margin-bottom:0.5rem;">推導演算完整步驟（死結偵測演算法）：</h4>
          <p>初始工作向量：<code>Work = Available = (${p.Available.join(', ')})</code></p>
          <ol style="margin-left:1.5rem; margin-top:0.35rem;">
            ${p.sol.steps.map((st, i) => `
              <li>步驟 ${i + 1}：檢查 <strong>${st.proc}</strong>，其 Request(${st.req.join(', ')}) ≤ Work(${st.oldWork.join(', ')}) 滿足！順利執行回收 Allocation(${st.alloc.join(', ')}) ⇒ 新 <code>Work = (${st.newWork.join(', ')})</code></li>
            `).join('')}
          </ol>
          ${!p.sol.isDeadlocked ? `
            <div style="margin-top:0.5rem; color:var(--accent-emerald); font-weight:700;">
              【推導結論】所有行程之 Finish[i] 皆為 true。系統未發生死結，執行完畢序列為：⟨${p.sol.executionSequence.join(', ')}⟩。
            </div>
          ` : `
            <div style="margin-top:0.5rem; color:var(--accent-rose); font-weight:700;">
              【推導結論】偵測演算法終止。當前 Work = (${p.sol.finalWork.join(', ')}) 無法滿足剩餘行程之請求，系統陷入死結狀態，陷入死結的行程集合為：{${p.sol.deadlockedProcs.join(', ')}}。
            </div>
          `}
        </div>
      `;
    }

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div class="alert-box ${isCorrect ? 'success' : ''}" style="${!isCorrect ? 'background-color:rgba(244,63,94,0.15); border-color:var(--accent-rose);' : ''}">
        <div style="font-size:1.05rem; font-weight:700; color:${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
          ${isCorrect ? '【判定正確】你的判定結論與演算法演算結果完全吻合！' : '【判定錯誤】你的判定結論與系統推導不符，請核對推導步驟：'}
        </div>
        <p style="margin-top:0.25rem;">此題組實際狀態為：<strong>${actualStatusText}</strong></p>
        ${detailHtml}
      </div>
    `;
    this.renderMath(resultBox);
  }

  // ==========================================
  // 考點七：期中高頻數值計算實戰實驗室
  // ==========================================
  initCalcLab() {
    this.currentCalcCategory = 'num';
    this.currentCalcTab = 'deadlock';
    this.generateCalcDeadlock();
    this.generateCalcSemaphore();
    this.generateCalcBuffer();
    this.generateCalcExp();
    this.generateCalcQuantum();
    this.generateCalcAmdahl();
    this.generateCalcRAG();
    this.generateCalcFork();
    this.generateCalcCS();
  }

  switchCalcCategory(category) {
    this.currentCalcCategory = category;
    if (category === 'num') {
      this.btnCalcCatNum?.classList.add('active');
      this.btnCalcCatGraph?.classList.remove('active');
      if (this.calcNavGroupNum) this.calcNavGroupNum.style.display = 'flex';
      if (this.calcNavGroupGraph) this.calcNavGroupGraph.style.display = 'none';

      const numTabs = ['deadlock', 'semaphore', 'buffer', 'exp', 'quantum', 'amdahl'];
      if (!numTabs.includes(this.currentCalcTab)) {
        this.switchCalcLabTab('deadlock');
      } else {
        this.switchCalcLabTab(this.currentCalcTab);
      }
    } else {
      this.btnCalcCatGraph?.classList.add('active');
      this.btnCalcCatNum?.classList.remove('active');
      if (this.calcNavGroupGraph) this.calcNavGroupGraph.style.display = 'flex';
      if (this.calcNavGroupNum) this.calcNavGroupNum.style.display = 'none';

      const graphTabs = ['rag', 'fork', 'cs'];
      if (!graphTabs.includes(this.currentCalcTab)) {
        this.switchCalcLabTab('rag');
      } else {
        this.switchCalcLabTab(this.currentCalcTab);
      }
    }
  }

  switchCalcLabTab(tab) {
    this.currentCalcTab = tab;
    const tabBtns = [
      { id: 'deadlock', btn: this.btnCalcTabDeadlock, panel: this.calcPanelDeadlock },
      { id: 'semaphore', btn: this.btnCalcTabSemaphore, panel: this.calcPanelSemaphore },
      { id: 'buffer', btn: this.btnCalcTabBuffer, panel: this.calcPanelBuffer },
      { id: 'exp', btn: this.btnCalcTabExp, panel: this.calcPanelExp },
      { id: 'quantum', btn: this.btnCalcTabQuantum, panel: this.calcPanelQuantum },
      { id: 'amdahl', btn: this.btnCalcTabAmdahl, panel: this.calcPanelAmdahl },
      { id: 'rag', btn: this.btnCalcTabRAG, panel: this.calcPanelRAG },
      { id: 'fork', btn: this.btnCalcTabFork, panel: this.calcPanelFork },
      { id: 'cs', btn: this.btnCalcTabCS, panel: this.calcPanelCS }
    ];

    tabBtns.forEach(t => {
      if (t.id === tab) {
        t.btn?.classList.add('active');
        if (t.panel) t.panel.style.display = 'block';
      } else {
        t.btn?.classList.remove('active');
        if (t.panel) t.panel.style.display = 'none';
      }
    });

    const activePanel = document.getElementById(`calc-panel-${tab}`);
    if (activePanel) {
      this.renderMath(activePanel);
    }
  }

  // 題型一：死結臨界最少資源數
  generateCalcDeadlock() {
    if (!this.calcQDeadlockText) return;
    const mode = this.randInt(0, 2);
    let problem = null;

    if (mode === 0) {
      const n = this.randInt(3, 6);
      const m = this.randInt(3, 5);
      const answer = n * (m - 1) + 1;
      const questionText = `系統中有 <strong>${n} 個獨立行程</strong> 同時競爭同一類不可搶佔之資源（例如磁帶機）。已知每個行程在其執行週期中，<strong>最多可能需要 ${m} 台</strong> 該資源。為保證系統在任何動態分配排程下<strong>「絕對不會發生死結（Free of Deadlock）」</strong>，作業系統最少必須配置幾台該資源？`;
      problem = {
        type: 'minM',
        n,
        m,
        answer,
        questionText,
        inputLabel: '最少資源總數 $M$：',
        explanation: `
          <p><strong>1. 最差死結危險狀態分析（Worst-case allocation without deadlock）：</strong></p>
          <p>假設系統處於極端惡劣狀態，每個行程都已經成功獲配了 $(m - 1) = ${m - 1}$ 台資源，且都在等待最後 1 台資源以完成工作。</p>
          <p>此時系統中已被佔有且陷入卡死邊緣的資源總數為：$n \\times (m - 1) = ${n} \\times ${m - 1} = ${n * (m - 1)}$ 台。</p>
          <p><strong>2. 破除死結之臨界條件（鴿籠原理應用）：</strong></p>
          <p>只要系統在此時額外再多提供 <strong>1 台</strong> 資源（即 $M = ${n * (m - 1)} + 1 = ${answer}$），必定有至少 1 個行程能夠取得最後所需資源，達到最大需求 ${m} 台並順利執行完畢。該行程結束後歸還全部持有的 ${m} 台資源，其他等待中的行程即可依序完成，徹底杜絕循環等待。</p>
          <p style="color:var(--accent-emerald); font-weight:700; margin-top:0.35rem;">核心通用公式：$M \\ge n(m - 1) + 1 \\implies M \\ge ${n}(${m} - 1) + 1 = ${answer}$ 台。</p>
        `
      };
    } else if (mode === 1) {
      const m = this.randInt(3, 5);
      const nAns = this.randInt(3, 6);
      const extra = this.randInt(0, m - 2);
      const M = nAns * (m - 1) + 1 + extra;
      const answer = nAns;
      const questionText = `作業系統總共配置有 <strong>${M} 台相同型號的印表機</strong>。已知每個行程在其工作流程中，最多需要申請 <strong>${m} 台</strong> 印表機才能順利印出報告。為保證系統<strong>絕對不會因為資源爭奪而陷入死結</strong>，系統<strong>最多可允許同時並行執行多少個行程</strong>？`;
      problem = {
        type: 'maxN',
        M,
        m,
        answer,
        questionText,
        inputLabel: '最多行程數 $n$：',
        explanation: `
          <p><strong>1. 公式推導代入：</strong></p>
          <p>無死結條件公式為：$M \\ge n(m - 1) + 1$。</p>
          <p>移項求解 $n$：$n(m - 1) \\le M - 1 \\implies n \\le \\left\\lfloor \\frac{M - 1}{m - 1} \\right\\rfloor$。</p>
          <p><strong>2. 數值代入：</strong></p>
          <p>$n \\le \\left\\lfloor \\frac{${M} - 1}{${m} - 1} \\right\\rfloor = \\left\\lfloor \\frac{${M - 1}}{${m - 1}} \\right\\rfloor = ${answer}$ 個行程。</p>
          <p style="color:var(--accent-emerald); font-weight:700; margin-top:0.35rem;">結論：最多允許 ${answer} 個行程同時並行。若增加至 ${answer + 1} 個行程，在最差狀況下可能出現卡死循環。</p>
        `
      };
    } else {
      const count = this.randInt(3, 4);
      const Max = [];
      for (let i = 0; i < count; i++) {
        Max.push(this.randInt(2, 5));
      }
      const sumHold = Max.reduce((acc, v) => acc + (v - 1), 0);
      const answer = sumHold + 1;
      const procDesc = Max.map((d, i) => `$P_${i}$ 最大需求為 ${d}`).join('、');
      const questionText = `系統中有 <strong>${count} 個行程</strong>（${Max.map((_, i) => `$P_${i}$`).join(', ')}）競爭同一類資源，各行程之最大宣告需求如下：${procDesc}。若要保證系統在任何排程執行狀態下<strong>絕對不會陷入死結</strong>，作業系統最少必須配置幾個單位之資源？`;
      problem = {
        type: 'asymmetric',
        Max,
        answer,
        questionText,
        inputLabel: '最少資源總數 $M$：',
        explanation: `
          <p><strong>1. 非對稱需求之最差卡死狀態：</strong></p>
          <p>每個行程 $P_i$ 各自持有了其最大需求減 1 的資源量：${Max.map((d, i) => `$P_${i}$ 持有 $${d} - 1 = ${d - 1}$`).join('、')}。</p>
          <p>此時所有行程合計持有的死結邊緣資源量為：$\\sum (Max_i - 1) = ${Max.map(d => `${d - 1}`).join(' + ')} = ${sumHold}$ 個資源。</p>
          <p><strong>2. 破局條件：</strong></p>
          <p>只要系統總資源量達到 $\\sum (Max_i - 1) + 1 = ${sumHold} + 1 = ${answer}$ 個，必定至少有一個行程可以取得最後所需的 1 個資源完成工作並歸還。</p>
          <p style="color:var(--accent-emerald); font-weight:700; margin-top:0.35rem;">通用公式：$M \\ge \\sum_{i=0}^{n-1} (Max_i - 1) + 1 = ${answer}$ 個。</p>
        `
      };
    }

    this.currentCalcDeadlock = problem;
    this.calcQDeadlockText.innerHTML = problem.questionText;
    if (this.calcDeadlockInputLabel) {
      this.calcDeadlockInputLabel.innerHTML = this.formatMath(problem.inputLabel);
    }
    if (this.calcDeadlockInput) {
      this.calcDeadlockInput.value = '';
    }
    if (this.calcFeedbackDeadlock) {
      this.calcFeedbackDeadlock.style.display = 'none';
      this.calcFeedbackDeadlock.className = 'calc-feedback';
      this.calcFeedbackDeadlock.innerHTML = '';
    }
    this.renderMath(this.calcPanelDeadlock);
  }

  verifyCalcDeadlock() {
    if (!this.currentCalcDeadlock || !this.calcFeedbackDeadlock || !this.calcDeadlockInput) return;
    const userVal = parseInt(this.calcDeadlockInput.value, 10);
    const expected = this.currentCalcDeadlock.answer;

    if (isNaN(userVal)) {
      alert('請先輸入推算之整數答案！');
      return;
    }

    const isCorrect = userVal === expected;
    this.calcFeedbackDeadlock.className = `calc-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    this.calcFeedbackDeadlock.style.display = 'block';
    this.calcFeedbackDeadlock.innerHTML = `
      <div style="font-weight:700; font-size:1.05rem; color:${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom:0.5rem;">
        ${isCorrect ? '【推算正確】你的答案完全正確！' : `【推算錯誤】你的回答為 ${userVal}，標準正解為 ${expected}。`}
      </div>
      <div style="font-size:0.92rem; line-height:1.7; color:var(--text-light);">
        ${this.currentCalcDeadlock.explanation}
      </div>
    `;
    this.renderMath(this.calcFeedbackDeadlock);
  }

  // 題型二：信號量（Counting Semaphore）計數值與阻塞佇列推算
  generateCalcSemaphore() {
    if (!this.calcQSemaphoreText) return;
    const mode = this.randInt(0, 1);
    let problem = null;

    if (mode === 0) {
      const s0 = this.randInt(3, 8);
      const w = this.randInt(5, 12);
      const v = this.randInt(1, 6);
      const finalS = s0 - w + v;
      const blocked = finalS < 0 ? Math.abs(finalS) : 0;
      const freeRes = finalS >= 0 ? finalS : 0;

      problem = {
        s0,
        w,
        v,
        finalS,
        blocked,
        freeRes,
        explanation: `
          <p><strong>1. 信號量計數核心定理：</strong></p>
          <p>信號量之值每次執行 <code>wait()</code>（即 P 運算）皆會遞減 $1$；每次執行 <code>signal()</code>（即 V 運算）皆會遞增 $1$。</p>
          <p>最終信號量數值公式：$S = S_0 - W + V = ${s0} - ${w} + ${v} = \\mathbf{${finalS}}$。</p>
          <p><strong>2. 物理語意與阻塞佇列分析：</strong></p>
          ${finalS < 0
            ? `<p>當 $S < 0$ 時，代表系統中所有資源已被分配殆盡（可用資源為 $0$）。其絕對值 $|S| = |${finalS}| = \\mathbf{${blocked}}$ 代表<strong>目前被阻塞在該信號量等待佇列（Waiting Queue）中的行程總數</strong>。</p>`
            : `<p>當 $S \\ge 0$ 時，代表系統中仍有可用資源，當前尚有 $\\mathbf{${freeRes}}$ 個資源可供申請，因此<strong>沒有任何行程處於阻塞等待狀態</strong>（阻塞數為 $\\mathbf{0}$）。</p>`
          }
        `
      };

      this.calcQSemaphoreText.innerHTML = `
        某作業系統管理一組共享硬體資源池，初始配置計數信號量（Counting Semaphore）數值為 <strong>$S = ${s0}$</strong>。<br/>
        隨後，系統中並行運行的各行程陸續執行了 <strong>${w} 次 <code>wait()</code> 運算</strong>（P 運算）與 <strong>${v} 次 <code>signal()</code> 運算</strong>（V 運算）。<br/>
        假定所有操作皆為不可分割的原子操作（Atomic Operations），請推算：
        <ol style="margin-left:1.5rem; margin-top:0.35rem;">
          <li>此時該信號量之最終數值 $S$ 為何？</li>
          <li>目前有多少個行程處於阻塞（Blocked / Waiting）狀態？</li>
        </ol>
      `;
    } else {
      const s0 = this.randInt(1, 3);
      const nProcs = this.randInt(5, 10);
      const completedProcs = this.randInt(1, 3);
      const w = nProcs;
      const v = completedProcs;
      const finalS = s0 - w + v;
      const blocked = finalS < 0 ? Math.abs(finalS) : 0;

      problem = {
        s0,
        w,
        v,
        finalS,
        blocked,
        explanation: `
          <p><strong>1. 併發行程申請與離開推算：</strong></p>
          <p>初始信號量為 $S_0 = ${s0}$。共有 $${nProcs}$ 個行程嘗試進入臨界區間（呼叫了 $${w}$ 次 wait()），其中有 $${completedProcs}$ 個行程已完成執行並釋放（呼叫了 $${v}$ 次 signal()）。</p>
          <p>最終信號量公式：$S = S_0 - W + V = ${s0} - ${w} + ${v} = \\mathbf{${finalS}}$。</p>
          <p><strong>2. 阻塞狀態判定：</strong></p>
          <p>因 $S = ${finalS} < 0$，代表臨界區滿載，處於阻塞佇列之行程數為 $|S| = |${finalS}| = \\mathbf{${blocked}}$ 個。</p>
        `
      };

      this.calcQSemaphoreText.innerHTML = `
        某系統有 <strong>${nProcs} 個並發行程</strong> 競爭進入特定受保護區間，保護該區間之信號量初始值為 <strong>$S = ${s0}$</strong>。<br/>
        若這 ${nProcs} 個行程皆已先後呼叫 <code>wait(S)</code> 申請進入，且截至目前為止已有 <strong>${completedProcs} 個行程順利執行完畢並呼叫 <code>signal(S)</code> 離開</strong>，請推算：
        <ol style="margin-left:1.5rem; margin-top:0.35rem;">
          <li>此時信號量之數值 $S$ 為何？</li>
          <li>目前仍在等待佇列中被阻塞之行程數量為何？</li>
        </ol>
      `;
    }

    this.currentCalcSemaphore = problem;
    if (this.calcSemaphoreInputVal) this.calcSemaphoreInputVal.value = '';
    if (this.calcSemaphoreInputBlocked) this.calcSemaphoreInputBlocked.value = '';

    if (this.calcFeedbackSemaphore) {
      this.calcFeedbackSemaphore.style.display = 'none';
      this.calcFeedbackSemaphore.className = 'calc-feedback';
      this.calcFeedbackSemaphore.innerHTML = '';
    }
    this.renderMath(this.calcPanelSemaphore);
  }

  verifyCalcSemaphore() {
    if (!this.currentCalcSemaphore || !this.calcFeedbackSemaphore) return;
    const p = this.currentCalcSemaphore;
    const userVal = parseInt(this.calcSemaphoreInputVal?.value, 10);
    const userBlocked = parseInt(this.calcSemaphoreInputBlocked?.value, 10);

    if (isNaN(userVal) || isNaN(userBlocked)) {
      alert('請先填寫全部答案欄位！');
      return;
    }

    const valCorrect = userVal === p.finalS;
    const blockedCorrect = userBlocked === p.blocked;
    const allCorrect = valCorrect && blockedCorrect;

    this.calcFeedbackSemaphore.className = `calc-feedback ${allCorrect ? 'correct' : 'incorrect'}`;
    this.calcFeedbackSemaphore.style.display = 'block';
    this.calcFeedbackSemaphore.innerHTML = `
      <div style="font-weight:700; font-size:1.05rem; color:${allCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom:0.5rem;">
        ${allCorrect ? '【推算正確】信號量數值與阻塞佇列推導完全正確！' : `【推算錯誤】核對結果：最終信號量 $S = ${p.finalS}$，阻塞行程數為 ${p.blocked} 個。`}
      </div>
      <div style="font-size:0.92rem; line-height:1.7; color:var(--text-light);">
        ${p.explanation}
      </div>
    `;
    this.renderMath(this.calcFeedbackSemaphore);
  }

  // 題型三：環狀有界限緩衝區（Bounded-Buffer）指標與儲存容量推算
  generateCalcBuffer() {
    if (!this.calcQBufferText) return;
    const N = this.randInt(6, 12);
    const stateType = this.randInt(0, 2);
    let inIdx = 0;
    let outIdx = 0;
    let expectedStatus = 'normal';

    if (stateType === 0) {
      inIdx = this.randInt(0, N - 1);
      outIdx = inIdx;
      expectedStatus = 'empty';
    } else if (stateType === 1) {
      inIdx = this.randInt(0, N - 1);
      outIdx = (inIdx + 1) % N;
      expectedStatus = 'full';
    } else {
      const count = this.randInt(1, N - 2);
      inIdx = this.randInt(0, N - 1);
      outIdx = (inIdx - count + N) % N;
      expectedStatus = 'normal';
    }

    const count = (inIdx - outIdx + N) % N;
    const maxCapacity = N - 1;
    const free = maxCapacity - count;

    const problem = {
      N,
      inIdx,
      outIdx,
      count,
      free,
      expectedStatus,
      explanation: `
        <p><strong>1. 環狀緩衝區設計規範與容量上限：</strong></p>
        <p>在經典教科書的有界限緩衝區演算法中，陣列大小為 $BUFFER\\_SIZE = ${N}$。為了以純變數 $(in, out)$ 區分「全空」與「全滿」，必須<strong>保留一個空位不予存放</strong>，因此系統最多僅能同時存放 $BUFFER\\_SIZE - 1 = ${N} - 1 = \\mathbf{${maxCapacity}}$ 個項目。</p>
        <p><strong>2. 有效項目與空位推導：</strong></p>
        <p>目前存放項目數量公式：$Count = (in - out + BUFFER\\_SIZE) \\bmod BUFFER\\_SIZE = (${inIdx} - ${outIdx} + ${N}) \\bmod ${N} = \\mathbf{${count}}$ 個。</p>
        <p>剩餘可連續寫入之空位：$Free = (BUFFER\\_SIZE - 1) - Count = ${maxCapacity} - ${count} = \\mathbf{${free}}$ 個。</p>
        <p><strong>3. 狀態判定依據：</strong></p>
        ${expectedStatus === 'empty'
          ? `<p>因 $in == out$（兩者皆為 ${inIdx}），此時緩衝區為<strong>【全空狀態】</strong>。</p>`
          : (expectedStatus === 'full'
            ? `<p>因 $(in + 1) \\bmod ${N} = (${inIdx} + 1) \\bmod ${N} = ${outIdx} == out$，達到滿載防護條件，此時緩衝區為<strong>【全滿狀態】</strong>。</p>`
            : `<p>當前 $Count = ${count}$ 且既非全空亦非全滿，處於<strong>【正常存放狀態】</strong>。</p>`
          )
        }
      `
    };

    this.currentCalcBuffer = problem;
    this.calcQBufferText.innerHTML = `
      某作業系統採用經典環狀陣列實作生產者與消費者問題的有界限緩衝區（Bounded-Buffer），陣列定義為：
      <div style="background-color:rgba(0,0,0,0.25); padding:0.5rem 0.75rem; border-radius:4px; font-family:monospace; margin:0.35rem 0; font-size:0.9rem;">
        #define BUFFER_SIZE ${N}<br/>
        item buffer[BUFFER_SIZE];<br/>
        int in = ${inIdx};<br/>
        int out = ${outIdx};
      </div>
      已知系統採用保留一格之防重疊機制（以區隔全空與全滿）。當前執行狀態下，指標數值如上所示。請推算：
      <ol style="margin-left:1.5rem; margin-top:0.35rem;">
        <li>此時緩衝區內實際存放了多少個有效項目（Items）？</li>
        <li>生產者在未引起緩衝區溢位的前提下，最多還能連續寫入幾個項目？</li>
        <li>依據指標關係，當前緩衝區之狀態判定為何？</li>
      </ol>
    `;

    if (this.calcBufferInputCount) this.calcBufferInputCount.value = '';
    if (this.calcBufferInputFree) this.calcBufferInputFree.value = '';
    if (this.calcBufferSelectStatus) this.calcBufferSelectStatus.value = 'normal';

    if (this.calcFeedbackBuffer) {
      this.calcFeedbackBuffer.style.display = 'none';
      this.calcFeedbackBuffer.className = 'calc-feedback';
      this.calcFeedbackBuffer.innerHTML = '';
    }
    this.renderMath(this.calcPanelBuffer);
  }

  verifyCalcBuffer() {
    if (!this.currentCalcBuffer || !this.calcFeedbackBuffer) return;
    const p = this.currentCalcBuffer;
    const userCount = parseInt(this.calcBufferInputCount?.value, 10);
    const userFree = parseInt(this.calcBufferInputFree?.value, 10);
    const userStatus = this.calcBufferSelectStatus?.value;

    if (isNaN(userCount) || isNaN(userFree)) {
      alert('請先填寫數值答案！');
      return;
    }

    const countCorrect = userCount === p.count;
    const freeCorrect = userFree === p.free;
    const statusCorrect = userStatus === p.expectedStatus;
    const allCorrect = countCorrect && freeCorrect && statusCorrect;

    this.calcFeedbackBuffer.className = `calc-feedback ${allCorrect ? 'correct' : 'incorrect'}`;
    this.calcFeedbackBuffer.style.display = 'block';
    this.calcFeedbackBuffer.innerHTML = `
      <div style="font-weight:700; font-size:1.05rem; color:${allCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom:0.5rem;">
        ${allCorrect ? '【推算正確】環狀緩衝區指標與容量推演完全吻合！' : `【推算錯誤】核對結果：有效項目為 ${p.count} 個，剩餘空位為 ${p.free} 個，狀態為 ${p.expectedStatus === 'empty' ? '全空' : (p.expectedStatus === 'full' ? '全滿' : '正常存放')}。`}
      </div>
      <div style="font-size:0.92rem; line-height:1.7; color:var(--text-light);">
        ${p.explanation}
      </div>
    `;
    this.renderMath(this.calcFeedbackBuffer);
  }

  // 題型七：fork() 行程樹計算
  generateCalcFork() {
    if (!this.calcQForkText || !this.calcForkInputContainer) return;
    const mode = this.randInt(0, 2);
    let problem = null;

    if (mode === 0) {
      const k = this.randInt(2, 4);
      const forkLines = Array(k).fill('    fork();').join('\n');
      const totalProc = Math.pow(2, k);
      const childProc = totalProc - 1;
      const code = `#include <stdio.h>\n#include <unistd.h>\n\nint main() {\n${forkLines}\n    return 0;\n}`;
      problem = {
        type: 'sequential',
        k,
        totalProc,
        childProc,
        code,
        inputs: [
          { id: 'fork-in-total', label: '1. 程式執行後，系統中總共存在的行程數（含初始父行程）：', expected: totalProc },
          { id: 'fork-in-child', label: '2. 由此程式新建立的子行程（Child Processes）數量：', expected: childProc }
        ],
        explanation: `
          <p><strong>1. 行程樹演化分析：</strong></p>
          <p>每一次 <code>fork()</code> 呼叫，都會複製當前所有已存在的行程：</p>
          <ul style="margin-left:1.5rem;">
            <li>初始狀態：1 個父行程（$2^0 = 1$）。</li>
            ${Array.from({ length: k }, (_, i) => `<li>第 ${i + 1} 次 fork() 後：現存行程數倍增為 $2^{${i + 1}} = ${Math.pow(2, i + 1)}$ 個。</li>`).join('')}
          </ul>
          <p><strong>2. 核心結論與考試陷阱提醒：</strong></p>
          <p>全系統<strong>總行程數</strong>為 $2^k = 2^${k} = ${totalProc}$ 個。</p>
          <p style="color:var(--accent-rose);">常考陷阱：題目若問「新建立的子行程數（Child Processes Created）」，必須扣除一開始的父行程本身，因此為 $2^k - 1 = ${totalProc} - 1 = ${childProc}$ 個。</p>
        `
      };
    } else if (mode === 1) {
      const N = this.randInt(2, 4);
      const totalProc = Math.pow(2, N);
      const childProc = totalProc - 1;
      const code = `#include <stdio.h>\n#include <unistd.h>\n\nint main() {\n    for (int i = 0; i < ${N}; i++) {\n        fork();\n    }\n    return 0;\n}`;
      problem = {
        type: 'loop',
        N,
        totalProc,
        childProc,
        code,
        inputs: [
          { id: 'fork-in-total', label: `1. 迴圈執行 ${N} 次後，系統中總共存在的行程數：`, expected: totalProc },
          { id: 'fork-in-child', label: '2. 新建立之子行程總數：', expected: childProc }
        ],
        explanation: `
          <p><strong>1. 迴圈展開演化：</strong></p>
          <p>迴圈每迭代一次，系統中所有的父行程與子行程均會平行執行下一輪 <code>fork()</code>：</p>
          <p>總行程數公式為 $2^N = 2^${N} = ${totalProc}$ 個；新建立之子行程為 $2^N - 1 = ${totalProc} - 1 = ${childProc}$ 個。</p>
        `
      };
    } else {
      const N = this.randInt(2, 3);
      const code = `#include <stdio.h>\n#include <unistd.h>\n\nint main() {\n    for (int i = 0; i < ${N}; i++) {\n        fork();\n        printf("OS\\n");\n    }\n    return 0;\n}`;
      const totalPrinted = Math.pow(2, N + 1) - 2;
      problem = {
        type: 'print',
        N,
        totalPrinted,
        code,
        inputs: [
          { id: 'fork-in-print', label: '請問螢幕上總共會印出幾次 "OS" 字串？', expected: totalPrinted }
        ],
        explanation: `
          <p><strong>1. 各迭代輪次印出次數剖析：</strong></p>
          <ul style="margin-left:1.5rem;">
            ${Array.from({ length: N }, (_, i) => {
              const currentProcs = Math.pow(2, i + 1);
              return `<li>$i = ${i}$：原先有的 $2^${i}$ 個行程各自呼叫 fork()，使得此時存在 $2^${i + 1} = ${currentProcs}$ 個行程，每個行程各印 1 次，共印出 <strong>${currentProcs} 次</strong>。</li>`;
            }).join('')}
          </ul>
          <p><strong>2. 總印出次數累加：</strong></p>
          <p>總印出次數為等比級數：$2^1 + 2^2 + \\dots + 2^${N} = 2^{${N + 1}} - 2 = ${Math.pow(2, N + 1)} - 2 = ${totalPrinted}$ 次。</p>
        `
      };
    }

    this.currentCalcFork = problem;
    this.calcQForkText.innerHTML = `
      <div>請觀察以下 C 語言程式碼片段，並推算行程樹生成與執行結果：</div>
      <div class="calc-code-box">${problem.code}</div>
    `;

    let inputsHtml = '';
    problem.inputs.forEach(inp => {
      inputsHtml += `
        <div style="width:100%; margin-bottom:0.5rem;">
          <label style="font-weight:600; display:block; margin-bottom:0.25rem;">${inp.label}</label>
          <input type="number" class="calc-input" id="${inp.id}" placeholder="請輸入整數">
        </div>
      `;
    });
    inputsHtml += `<button class="btn btn-primary" id="btn-submit-calc-fork" style="margin-top:0.5rem;" onclick="app.verifyCalcFork()">送出核對</button>`;

    this.calcForkInputContainer.innerHTML = inputsHtml;

    if (this.calcFeedbackFork) {
      this.calcFeedbackFork.style.display = 'none';
      this.calcFeedbackFork.className = 'calc-feedback';
      this.calcFeedbackFork.innerHTML = '';
    }
    this.renderMath(this.calcPanelFork);
  }

  verifyCalcFork() {
    if (!this.currentCalcFork || !this.calcFeedbackFork) return;
    const problem = this.currentCalcFork;
    let allCorrect = true;
    let details = [];

    problem.inputs.forEach(inp => {
      const el = document.getElementById(inp.id);
      const val = parseInt(el?.value, 10);
      if (isNaN(val)) {
        allCorrect = false;
        details.push(`未填寫完整（正解：${inp.expected}）`);
      } else if (val === inp.expected) {
        details.push(`回答 ${val}（正確）`);
      } else {
        allCorrect = false;
        details.push(`回答 ${val}（錯誤，正解為 ${inp.expected}）`);
      }
    });

    this.calcFeedbackFork.className = `calc-feedback ${allCorrect ? 'correct' : 'incorrect'}`;
    this.calcFeedbackFork.style.display = 'block';
    this.calcFeedbackFork.innerHTML = `
      <div style="font-weight:700; font-size:1.05rem; color:${allCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom:0.5rem;">
        ${allCorrect ? '【推算正確】行程樹數量計算完全正確！' : `【推算錯誤】核對結果：${details.join('； ')}。`}
      </div>
      <div style="font-size:0.92rem; line-height:1.7; color:var(--text-light);">
        ${problem.explanation}
      </div>
    `;
    this.renderMath(this.calcFeedbackFork);
  }

  // 題型三：指數平滑法 CPU 預測
  generateCalcExp() {
    if (!this.calcQExpText) return;
    const alphaList = [0.5, 0.6, 0.8];
    const alpha = alphaList[this.randInt(0, alphaList.length - 1)];
    const tau1 = this.randInt(8, 12);
    const t1 = this.randInt(4, 14);
    const t2 = this.randInt(4, 14);
    const t3 = this.randInt(4, 14);

    const tau2 = Number((alpha * t1 + (1 - alpha) * tau1).toFixed(3));
    const tau3 = Number((alpha * t2 + (1 - alpha) * tau2).toFixed(3));
    const tau4 = Number((alpha * t3 + (1 - alpha) * tau3).toFixed(2));

    const problem = {
      alpha,
      tau1,
      t1,
      t2,
      t3,
      tau2,
      tau3,
      tau4,
      explanation: `
        <p><strong>1. 指數平滑法（Exponential Smoothing）核心公式：</strong></p>
        <p>$\\tau_{n+1} = \\alpha t_n + (1 - \\alpha)\\tau_n$（其中 $\\alpha = ${alpha}$，近期實際觀測權重為 $\\alpha$，歷史預測權重為 $1 - \\alpha = ${(1 - alpha).toFixed(1)}$）。</p>
        <p><strong>2. 逐步遞推計算歷程：</strong></p>
        <ul style="margin-left:1.5rem;">
          <li>計算 $\\tau_2$：$\\tau_2 = ${alpha} \\times t_1 + (1 - ${alpha}) \\times \\tau_1 = ${alpha} \\times ${t1} + ${(1 - alpha).toFixed(1)} \\times ${tau1} = ${(alpha * t1).toFixed(2)} + ${((1 - alpha) * tau1).toFixed(2)} = \\mathbf{${tau2}}$ ms</li>
          <li>計算 $\\tau_3$：$\\tau_3 = ${alpha} \\times t_2 + (1 - ${alpha}) \\times \\tau_2 = ${alpha} \\times ${t2} + ${(1 - alpha).toFixed(1)} \\times ${tau2} = ${(alpha * t2).toFixed(2)} + ${((1 - alpha) * tau2).toFixed(3)} = \\mathbf{${tau3}}$ ms</li>
          <li>計算 $\\tau_4$：$\\tau_4 = ${alpha} \\times t_3 + (1 - ${alpha}) \\times \\tau_3 = ${alpha} \\times ${t3} + ${(1 - alpha).toFixed(1)} \\times ${tau3} = ${(alpha * t3).toFixed(2)} + ${((1 - alpha) * tau3).toFixed(3)} = \\mathbf{${tau4}}$ ms</li>
        </ul>
        <p style="color:var(--accent-emerald); font-weight:700; margin-top:0.35rem;">最終第 4 次 CPU 區間預測長度為：$\\tau_4 = ${tau4}$ ms。</p>
      `
    };

    this.currentCalcExp = problem;
    this.calcQExpText.innerHTML = `
      在最短工作優先（SJF）排程中，系統採用<strong>指數平滑法（Exponential Average）</strong>預測下一個 CPU 區間長度。已知：
      <ul style="margin-left:1.5rem; margin-top:0.35rem;">
        <li>平滑參數：$\\alpha = ${alpha}$</li>
        <li>初始第 1 次 CPU 預估長度：$\\tau_1 = ${tau1}$ ms</li>
        <li>隨後連續 3 次實際觀測到的 CPU 執行區間為：$t_1 = ${t1}$ ms、$t_2 = ${t2}$ ms、$t_3 = ${t3}$ ms</li>
      </ul>
      請依公式推算<strong>第 4 次的 CPU 預估長度 $\\tau_4$</strong> 為何？（取至小數點後兩位）
    `;

    if (this.calcExpInput) {
      this.calcExpInput.value = '';
    }
    if (this.calcFeedbackExp) {
      this.calcFeedbackExp.style.display = 'none';
      this.calcFeedbackExp.className = 'calc-feedback';
      this.calcFeedbackExp.innerHTML = '';
    }
    this.renderMath(this.calcPanelExp);
  }

  verifyCalcExp() {
    if (!this.currentCalcExp || !this.calcFeedbackExp || !this.calcExpInput) return;
    const userVal = parseFloat(this.calcExpInput.value);
    const expected = this.currentCalcExp.tau4;

    if (isNaN(userVal)) {
      alert('請先輸入預測值數值！');
      return;
    }

    const diff = Math.abs(userVal - expected);
    const isCorrect = diff <= 0.06;

    this.calcFeedbackExp.className = `calc-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    this.calcFeedbackExp.style.display = 'block';
    this.calcFeedbackExp.innerHTML = `
      <div style="font-weight:700; font-size:1.05rem; color:${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom:0.5rem;">
        ${isCorrect ? '【推算正確】指數平滑數值計算完全吻合！' : `【推算錯誤】你的答案為 ${userVal}，標準正解為 ${expected} ms。`}
      </div>
      <div style="font-size:0.92rem; line-height:1.7; color:var(--text-light);">
        ${this.currentCalcExp.explanation}
      </div>
    `;
    this.renderMath(this.calcFeedbackExp);
  }

  // 題型四：時間量子與 Context Switch 開銷
  generateCalcQuantum() {
    if (!this.calcQQuantumText) return;
    const q = this.randInt(8, 15);
    const multiplier = this.randInt(2, 4);
    const remainder = this.randInt(1, q - 1);
    const B = multiplier * q + remainder;
    const CS = this.randInt(1, 2);

    const csCount = Math.ceil(B / q) - 1;
    const totalTime = B + csCount * CS;
    const util = Number(((B / totalTime) * 100).toFixed(1));

    const problem = {
      B,
      q,
      CS,
      csCount,
      totalTime,
      util,
      explanation: `
        <p><strong>1. 上下文切換次數公式：</strong></p>
        <p>切換次數 $= \\lceil B / q \\rceil - 1 = \\lceil ${B} / ${q} \\rceil - 1 = ${Math.ceil(B / q)} - 1 = \\mathbf{${csCount}}$ 次。</p>
        <p>說明：行程共需要 $\\lceil ${B} / ${q} \\rceil = ${Math.ceil(B / q)}$ 個時間配額。最後一個配額執行結束即離開系統，不計入切換開銷。</p>
        <p><strong>2. 總耗費時間計算：</strong></p>
        <p>總耗時 $= \\text{CPU 實際執行時間} + (\\text{切換次數} \\times CS) = ${B} + (${csCount} \\times ${CS}) = ${B} + ${csCount * CS} = \\mathbf{${totalTime}}$ ms。</p>
        <p><strong>3. 有效 CPU 使用率：</strong></p>
        <p>有效利用率 $= \\frac{B}{\\text{總耗時}} \\times 100\\% = \\frac{${B}}{${totalTime}} \\times 100\\% \\approx \\mathbf{${util}\\%}$。</p>
      `
    };

    this.currentCalcQuantum = problem;
    this.calcQQuantumText.innerHTML = `
      某單一行程之 CPU Burst 長度為 <strong>${B} ms</strong>。作業系統採用輪轉排程（Round Robin, RR），設定時間量子（Time Quantum）為 <strong>$q = ${q}$ ms</strong>。每次上下文切換（Context Switch）之系統額外開銷為 <strong>$CS = ${CS}$ ms</strong>。
      <br/>假設 Ready Queue 中暫時無其他競爭行程，請計算：
      <ol style="margin-left:1.5rem; margin-top:0.35rem;">
        <li>該行程執行完畢前共經歷幾次上下文切換？</li>
        <li>從開始執行至徹底完成，總共耗費多少時間（毫秒）？</li>
        <li>此期間 CPU 的「有效運算時間比例（利用率）」為何（%）？</li>
      </ol>
    `;

    if (this.calcQuantumInputCs) this.calcQuantumInputCs.value = '';
    if (this.calcQuantumInputTotal) this.calcQuantumInputTotal.value = '';
    if (this.calcQuantumInputUtil) this.calcQuantumInputUtil.value = '';

    if (this.calcFeedbackQuantum) {
      this.calcFeedbackQuantum.style.display = 'none';
      this.calcFeedbackQuantum.className = 'calc-feedback';
      this.calcFeedbackQuantum.innerHTML = '';
    }
    this.renderMath(this.calcPanelQuantum);
  }

  verifyCalcQuantum() {
    if (!this.currentCalcQuantum || !this.calcFeedbackQuantum) return;
    const p = this.currentCalcQuantum;
    const userCs = parseInt(this.calcQuantumInputCs?.value, 10);
    const userTotal = parseInt(this.calcQuantumInputTotal?.value, 10);
    const userUtil = parseFloat(this.calcQuantumInputUtil?.value);

    if (isNaN(userCs) || isNaN(userTotal) || isNaN(userUtil)) {
      alert('請先填寫全部 3 項答案欄位！');
      return;
    }

    const csCorrect = userCs === p.csCount;
    const totalCorrect = userTotal === p.totalTime;
    const utilCorrect = Math.abs(userUtil - p.util) <= 0.3;
    const allCorrect = csCorrect && totalCorrect && utilCorrect;

    this.calcFeedbackQuantum.className = `calc-feedback ${allCorrect ? 'correct' : 'incorrect'}`;
    this.calcFeedbackQuantum.style.display = 'block';
    this.calcFeedbackQuantum.innerHTML = `
      <div style="font-weight:700; font-size:1.05rem; color:${allCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom:0.5rem;">
        ${allCorrect ? '【推算正確】時間量子與開銷全數計算正確！' : `【推算錯誤】核對結果：切換次數為 ${p.csCount} 次，總耗時為 ${p.totalTime} ms，有效率為 ${p.util}%。`}
      </div>
      <div style="font-size:0.92rem; line-height:1.7; color:var(--text-light);">
        ${p.explanation}
      </div>
    `;
    this.renderMath(this.calcFeedbackQuantum);
  }

  // ==========================================
  // 題型六：阿姆達爾定律（Amdahl's Law）多核心加速比推導
  // ==========================================
  generateCalcAmdahl() {
    if (!this.calcQAmdahlText) return;
    const presets = [
      { sPercent: 25, S: 0.25, cores: 2 },
      { sPercent: 25, S: 0.25, cores: 4 },
      { sPercent: 25, S: 0.25, cores: 8 },
      { sPercent: 20, S: 0.20, cores: 4 },
      { sPercent: 20, S: 0.20, cores: 8 },
      { sPercent: 10, S: 0.10, cores: 4 },
      { sPercent: 10, S: 0.10, cores: 8 },
      { sPercent: 40, S: 0.40, cores: 4 },
      { sPercent: 50, S: 0.50, cores: 2 },
      { sPercent: 50, S: 0.50, cores: 4 }
    ];
    const item = presets[this.randInt(0, presets.length - 1)];
    const pPercent = 100 - item.sPercent;
    const P = 1 - item.S;
    const N = item.cores;

    const denom = item.S + (P / N);
    const speedup = Number((1 / denom).toFixed(2));
    const maxSpeedup = Number((1 / item.S).toFixed(2));

    const problem = {
      sPercent: item.sPercent,
      pPercent,
      S: item.S,
      P,
      N,
      denom: Number(denom.toFixed(4)),
      speedup,
      maxSpeedup,
      explanation: `
        <p><strong>1. 阿姆達爾定律（Amdahl's Law）加速比公式：</strong></p>
        <p>$$\\text{Speedup} \\le \\frac{1}{S + \\frac{1 - S}{N}}$$</p>
        <p>其中：</p>
        <ul style="margin-left: 1.5rem;">
          <li>循序執行比例 $S = ${item.sPercent}\\% = ${item.S}$</li>
          <li>可平行化比例 $1 - S = ${pPercent}\\% = ${P.toFixed(2)}$</li>
          <li>處理器核心數 $N = ${N}$</li>
        </ul>
        <p><strong>2. 逐步推導演算：</strong></p>
        <p>$$\\text{分母} = S + \\frac{1 - S}{N} = ${item.S} + \\frac{${P.toFixed(2)}}{${N}} = ${item.S} + ${(P / N).toFixed(4)} = ${denom.toFixed(4)}$$</p>
        <p>$$\\text{Speedup} = \\frac{1}{${denom.toFixed(4)}} \\approx \\mathbf{${speedup}}\\text{ 倍}$$</p>
        <p><strong>3. 理論加速比極限（核心數 $N \\to \\infty$ 時）：</strong></p>
        <p>$$\\lim_{N \\to \\infty} \\text{Speedup} = \\frac{1}{S} = \\frac{1}{${item.S}} = \\mathbf{${maxSpeedup}}\\text{ 倍}$$</p>
        <p style="color: var(--accent-emerald); font-weight: 700; margin-top: 0.35rem;">結論：在 ${N} 核心下的理論加速比為 <strong>${speedup} 倍</strong>；無論硬體核心如何無限增加，極限加速比不超過 <strong>${maxSpeedup} 倍</strong>。</p>
      `
    };

    this.currentCalcAmdahl = problem;
    this.calcQAmdahlText.innerHTML = `
      某應用程式經過效能分析，其中 <strong>${item.pPercent}%</strong> 的運算具備完全資料獨立性可平行化處理，另外 <strong>${item.sPercent}%</strong> 的程式碼必須嚴格循序執行（$S = ${item.S}$）。<br/>
      若系統由單核心處理器升級至 <strong>${N} 核心處理器（$N = ${N}$）</strong>：<br/>
      請根據<strong>阿姆達爾定律（Amdahl's Law）</strong>推算該應用程式所能獲得的<strong>加速比（Speedup）</strong>為多少倍？（請四捨五入至小數點後兩位）
    `;

    if (this.calcAmdahlInput) this.calcAmdahlInput.value = '';
    if (this.calcFeedbackAmdahl) {
      this.calcFeedbackAmdahl.style.display = 'none';
      this.calcFeedbackAmdahl.className = 'calc-feedback';
      this.calcFeedbackAmdahl.innerHTML = '';
    }
    this.renderMath(this.calcPanelAmdahl);
  }

  verifyCalcAmdahl() {
    if (!this.currentCalcAmdahl || !this.calcFeedbackAmdahl || !this.calcAmdahlInput) return;
    const userVal = parseFloat(this.calcAmdahlInput.value);
    const expected = this.currentCalcAmdahl.speedup;

    if (isNaN(userVal)) {
      alert('請先輸入計算所得之加速比數值！');
      return;
    }

    const diff = Math.abs(userVal - expected);
    const isCorrect = diff <= 0.05;

    this.calcFeedbackAmdahl.className = `calc-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    this.calcFeedbackAmdahl.style.display = 'block';
    this.calcFeedbackAmdahl.innerHTML = `
      <div style="font-weight: 700; font-size: 1.05rem; color: ${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom: 0.5rem;">
        ${isCorrect ? '【判定正確】阿姆達爾定律加速比數值推導完全精確！' : `【判定有誤】您的計算結果為 ${userVal} 倍，標準答案約為 ${expected} 倍。`}
      </div>
      <div style="font-size: 0.92rem; line-height: 1.7; color: var(--text-light);">
        ${this.currentCalcAmdahl.explanation}
      </div>
    `;
    this.renderMath(this.calcFeedbackAmdahl);
  }


  // ==========================================
  // 題型六：資源配置圖（RAG）死結判定
  // ==========================================
  generateCalcRAG() {
    if (!this.calcQRagText || !this.calcRagSvgContainer) return;
    this.selectedRagCycle = null;
    this.selectedRagDeadlock = null;

    // 重設按鈕樣式
    [this.btnRagCycleYes, this.btnRagCycleNo, this.btnRagDeadlockYes, this.btnRagDeadlockNo].forEach(btn => {
      btn?.classList.remove('selected');
    });

    const problems = [
      {
        id: 'rag-single-cycle',
        title: '單一資源實例拓撲圖（Single-Instance RAG）',
        hasCycle: true,
        isDeadlock: true,
        desc: '系統中有行程 $P_1$、$P_2$ 與資源 $R_1$、$R_2$。每個資源種類均僅包含 <strong>1 個實例（Single Instance）</strong>。請依據下方拓撲圖分析是否有環路，並判定系統是否發生死結。',
        explanation: `
          <p><strong>1. 圖形環路搜尋（Cycle Detection）：</strong></p>
          <p>循有向邊追蹤：$P_1 \\to R_1 \\to P_2 \\to R_2 \\to P_1$，路徑形成一個封閉有向環。因此<strong>【存在環路】</strong>。</p>
          <p><strong>2. 死結定理判定（Deadlock Criteria）：</strong></p>
          <p>作業系統重要定理：若系統中<strong>所有資源種類皆只有單一實例（Single Instance per Resource Type）</strong>，則「資源配置圖中存在環路」為「系統陷入死結」的<strong>充分且必要條件（If and only if）</strong>。</p>
          <p style="color:var(--accent-rose); font-weight:700;">結論：此圖存在環路，且資源皆為單一實例，因此系統【已陷入死結】！</p>
        `,
        graphData: {
          nodes: [
            { id: 'P1', type: 'proc', name: 'P1', x: 150, y: 80 },
            { id: 'P2', type: 'proc', name: 'P2', x: 450, y: 200 },
            { id: 'R1', type: 'res', name: 'R1', x: 450, y: 80, instances: 1 },
            { id: 'R2', type: 'res', name: 'R2', x: 150, y: 200, instances: 1 }
          ],
          edges: [
            { from: 'P1', to: 'R1', type: 'req', label: '請求 R1' },
            { from: 'R1', to: 'P2', type: 'alloc', label: '分配給 P2' },
            { from: 'P2', to: 'R2', type: 'req', label: '請求 R2' },
            { from: 'R2', to: 'P1', type: 'alloc', label: '分配給 P1' }
          ]
        }
      },
      {
        id: 'rag-multi-cycle-nodeadlock',
        title: '多重資源實例與環外破局拓撲圖',
        hasCycle: true,
        isDeadlock: false,
        desc: '系統中有行程 $P_1$、$P_2$、$P_3$、$P_4$ 與資源 $R_1$、$R_2$。資源 $R_1$ 與 $R_2$ 各自擁有 <strong>2 個實例（Multiple Instances）</strong>。請觀察拓撲關係並判定死結狀態。',
        explanation: `
          <p><strong>1. 圖形環路搜尋（Cycle Detection）：</strong></p>
          <p>追蹤有向路徑：$P_1 \\to R_1 \\to P_2 \\to R_2 \\to P_1$，此子圖中明顯<strong>【存在環路】</strong>。</p>
          <p><strong>2. 死結定理判定（破除環路機制）：</strong></p>
          <p>在<strong>多重資源實例（Multiple Instances）</strong>系統中，「存在環路」僅為死結之<strong>必要條件而非充分條件</strong>。</p>
          <p>觀察環外行程狀態：</p>
          <ul style="margin-left:1.5rem;">
            <li>$P_3$ 獲配 $R_1$ 的 1 個實例，但未請求任何後續資源。$P_3$ 執行結束後必歸還 $R_1$。</li>
            <li>$P_4$ 獲配 $R_2$ 的 1 個實例，亦未請求任何後續資源。$P_4$ 執行結束後必歸還 $R_2$。</li>
          </ul>
          <p>當 $P_3$ 與 $P_4$ 釋放資源後，系統騰出之可用實例足以完全滿足 $P_1$ 與 $P_2$ 之請求，環路即被安全打破。</p>
          <p style="color:var(--accent-emerald); font-weight:700;">結論：此圖【存在環路】，但系統【未發生死結】！</p>
        `,
        graphData: {
          nodes: [
            { id: 'P1', type: 'proc', name: 'P1', x: 140, y: 70 },
            { id: 'P2', type: 'proc', name: 'P2', x: 460, y: 70 },
            { id: 'P3', type: 'proc', name: 'P3', x: 460, y: 220 },
            { id: 'P4', type: 'proc', name: 'P4', x: 140, y: 220 },
            { id: 'R1', type: 'res', name: 'R1', x: 300, y: 70, instances: 2 },
            { id: 'R2', type: 'res', name: 'R2', x: 300, y: 220, instances: 2 }
          ],
          edges: [
            { from: 'P1', to: 'R1', type: 'req' },
            { from: 'R1', to: 'P2', type: 'alloc' },
            { from: 'P2', to: 'R2', type: 'req' },
            { from: 'R2', to: 'P1', type: 'alloc' },
            { from: 'R1', to: 'P3', type: 'alloc' },
            { from: 'R2', to: 'P4', type: 'alloc' }
          ]
        }
      },
      {
        id: 'rag-multi-cycle-deadlock',
        title: '多重資源實例且全員死鎖拓撲圖',
        hasCycle: true,
        isDeadlock: true,
        desc: '系統中有行程 $P_1$、$P_2$、$P_3$ 與資源 $R_1$、$R_2$。資源 $R_1$ 與 $R_2$ 各有 <strong>2 個實例</strong>，所有實例均已被配置完畢。請分析系統是否陷入死結。',
        explanation: `
          <p><strong>1. 環路分析：</strong></p>
          <p>圖中存在循環等待路徑：$P_1 \\to R_2 \\to P_3 \\to R_1 \\to P_1$ 以及 $P_2 \\to R_1$ 相關之交疊環路，因此<strong>【存在環路】</strong>。</p>
          <p><strong>2. 死結判定：</strong></p>
          <p>所有持有資源的行程（$P_1$、$P_2$、$P_3$）皆各自在等待其他被佔據的資源，全系統無任何行程能夠在不依賴他人的情況下率先完成並歸還資源。</p>
          <p style="color:var(--accent-rose); font-weight:700;">結論：資源完全耗盡且所有持有者互相卡死，系統【已陷入死結】！</p>
        `,
        graphData: {
          nodes: [
            { id: 'P1', type: 'proc', name: 'P1', x: 120, y: 190 },
            { id: 'P2', type: 'proc', name: 'P2', x: 300, y: 190 },
            { id: 'P3', type: 'proc', name: 'P3', x: 480, y: 190 },
            { id: 'R1', type: 'res', name: 'R1', x: 210, y: 70, instances: 2 },
            { id: 'R2', type: 'res', name: 'R2', x: 390, y: 70, instances: 2 }
          ],
          edges: [
            { from: 'R1', to: 'P1', type: 'alloc' },
            { from: 'R1', to: 'P2', type: 'alloc' },
            { from: 'P1', to: 'R2', type: 'req' },
            { from: 'R2', to: 'P2', type: 'alloc' },
            { from: 'R2', to: 'P3', type: 'alloc' },
            { from: 'P3', to: 'R1', type: 'req' }
          ]
        }
      },
      {
        id: 'rag-acyclic',
        title: '非循環等待拓撲圖（Acyclic RAG）',
        hasCycle: false,
        isDeadlock: false,
        desc: '系統中有行程 $P_1$、$P_2$、$P_3$ 與資源 $R_1$、$R_2$。資源 $R_1$ 與 $R_2$ 各有 <strong>1 個實例</strong>。請依據有向邊箭頭分析是否存在環路與死結。',
        explanation: `
          <p><strong>1. 環路搜尋：</strong></p>
          <p>有向拓撲路徑為線性延伸：$P_1 \\to R_1 \\to P_2 \\to R_2 \\to P_3$。路徑最終指向 $P_3$，並無任何回指向 $P_1$ 或 $P_2$ 的邊，圖中<strong>【不存在環路】</strong>。</p>
          <p><strong>2. 死結判定：</strong></p>
          <p>基本定律：若資源配置圖中<strong>不存在任何環路（No Cycle）</strong>，則系統<strong>【絕不發生死結】</strong>。</p>
          <p>拓撲順序：$P_3$ 無需等待任何資源可率先執行完成並歸還 $R_2$，隨後 $P_2$ 獲得 $R_2$ 執行完成並歸還 $R_1$，最後 $P_1$ 獲配 $R_1$ 順利結束。</p>
          <p style="color:var(--accent-emerald); font-weight:700;">結論：無環路且【未發生死結】！</p>
        `,
        graphData: {
          nodes: [
            { id: 'P1', type: 'proc', name: 'P1', x: 120, y: 180 },
            { id: 'P2', type: 'proc', name: 'P2', x: 300, y: 180 },
            { id: 'P3', type: 'proc', name: 'P3', x: 480, y: 180 },
            { id: 'R1', type: 'res', name: 'R1', x: 210, y: 70, instances: 1 },
            { id: 'R2', type: 'res', name: 'R2', x: 390, y: 70, instances: 1 }
          ],
          edges: [
            { from: 'P1', to: 'R1', type: 'req' },
            { from: 'R1', to: 'P2', type: 'alloc' },
            { from: 'P2', to: 'R2', type: 'req' },
            { from: 'R2', to: 'P3', type: 'alloc' }
          ]
        }
      }
    ];

    const idx = this.randInt(0, problems.length - 1);
    const problem = problems[idx];
    this.currentCalcRAG = problem;

    this.calcQRagText.innerHTML = `
      <div style="font-weight:700; color:var(--accent-cyan); margin-bottom:0.35rem;">拓撲題目：${problem.title}</div>
      <div>${problem.desc}</div>
      <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">
        圖例指引：<strong>圓形節點</strong>為行程（Process），<strong>矩形節點</strong>為資源（Resource，內部圓點代表實例個數）。<br/>
        <span style="color:#f59e0b;">橘黃色虛線箭頭</span>代表<strong>申請資源（Request Edge, $P \\to R$）</strong>；<span style="color:#10b981;">綠色實線箭頭</span>代表<strong>已配置資源（Assignment Edge, $R \\to P$）</strong>。
      </div>
    `;

    this.renderRagSVG(problem.graphData);

    if (this.calcFeedbackRAG) {
      this.calcFeedbackRAG.style.display = 'none';
      this.calcFeedbackRAG.className = 'calc-feedback';
      this.calcFeedbackRAG.innerHTML = '';
    }
    this.renderMath(this.calcPanelRAG);
  }

  selectRagChoice(type, val) {
    if (type === 'cycle') {
      this.selectedRagCycle = val;
      if (val) {
        this.btnRagCycleYes?.classList.add('selected');
        this.btnRagCycleNo?.classList.remove('selected');
      } else {
        this.btnRagCycleNo?.classList.add('selected');
        this.btnRagCycleYes?.classList.remove('selected');
      }
    } else if (type === 'deadlock') {
      this.selectedRagDeadlock = val;
      if (val) {
        this.btnRagDeadlockYes?.classList.add('selected');
        this.btnRagDeadlockNo?.classList.remove('selected');
      } else {
        this.btnRagDeadlockNo?.classList.add('selected');
        this.btnRagDeadlockYes?.classList.remove('selected');
      }
    }
  }

  verifyCalcRAG() {
    if (!this.currentCalcRAG || !this.calcFeedbackRAG) return;
    const p = this.currentCalcRAG;

    if (this.selectedRagCycle === null || this.selectedRagDeadlock === null) {
      alert('請先針對「是否存在環路」與「是否發生死結」兩個問題完成選擇！');
      return;
    }

    const cycleCorrect = this.selectedRagCycle === p.hasCycle;
    const deadlockCorrect = this.selectedRagDeadlock === p.isDeadlock;
    const allCorrect = cycleCorrect && deadlockCorrect;

    this.calcFeedbackRAG.className = `calc-feedback ${allCorrect ? 'correct' : 'incorrect'}`;
    this.calcFeedbackRAG.style.display = 'block';
    this.calcFeedbackRAG.innerHTML = `
      <div style="font-weight:700; font-size:1.05rem; color:${allCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom:0.5rem;">
        ${allCorrect ? '【判定正確】你的圖形拓撲分析與死結結論完全精準！' : '【判定錯誤】你的選項與作業系統定理推導不符，請核對詳細解析：'}
      </div>
      <div style="font-size:0.92rem; line-height:1.7; color:var(--text-light);">
        <p>正解：<strong>環路狀態：${p.hasCycle ? '存在環路' : '不存在環路'}</strong>；<strong>死結狀態：${p.isDeadlock ? '已陷入死結' : '未發生死結'}</strong>。</p>
        ${p.explanation}
      </div>
    `;
    this.renderMath(this.calcFeedbackRAG);
  }

  renderRagSVG(graphData) {
    if (!this.calcRagSvgContainer) return;
    const { nodes, edges } = graphData;

    let svgHtml = `
      <svg viewBox="0 0 600 280" width="100%" height="280" style="display:block; margin:0 auto; user-select:none;">
        <defs>
          <marker id="rag-arrow-req" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
          </marker>
          <marker id="rag-arrow-alloc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
          </marker>
        </defs>
    `;

    // 繪製連線邊
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      const isReq = edge.type === 'req';
      const strokeColor = isReq ? '#f59e0b' : '#10b981';
      const markerId = isReq ? 'rag-arrow-req' : 'rag-arrow-alloc';
      const strokeDash = isReq ? '5,4' : 'none';

      // 計算向心位移避免遮擋圓形或矩形
      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const unitX = dist === 0 ? 0 : dx / dist;
      const unitY = dist === 0 ? 0 : dy / dist;

      // 起點與終點邊界偏移
      const startOffset = fromNode.type === 'proc' ? 24 : 26;
      const endOffset = toNode.type === 'proc' ? 26 : 28;

      const x1 = fromNode.x + unitX * startOffset;
      const y1 = fromNode.y + unitY * startOffset;
      const x2 = toNode.x - unitX * endOffset;
      const y2 = toNode.y - unitY * endOffset;

      svgHtml += `
        <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" 
              stroke="${strokeColor}" stroke-width="2.2" stroke-dasharray="${strokeDash}" 
              marker-end="url(#${markerId})" />
      `;
    });

    // 繪製節點
    nodes.forEach(node => {
      if (node.type === 'proc') {
        // 行程節點（圓形）
        svgHtml += `
          <g>
            <circle cx="${node.x}" cy="${node.y}" r="24" fill="#0f172a" stroke="#818cf8" stroke-width="2.5" />
            <text x="${node.x}" y="${node.y + 5}" fill="#f8fafc" font-size="14" font-weight="700" text-anchor="middle" font-family="system-ui, sans-serif">${node.name}</text>
          </g>
        `;
      } else if (node.type === 'res') {
        // 資源節點（圓角矩形）
        const w = 64;
        const h = 56;
        svgHtml += `
          <g>
            <rect x="${node.x - w / 2}" y="${node.y - h / 2}" width="${w}" height="${h}" rx="8" fill="#0f172a" stroke="#0ea5e9" stroke-width="2.5" />
            <text x="${node.x}" y="${node.y - 8}" fill="#38bdf8" font-size="13" font-weight="700" text-anchor="middle" font-family="system-ui, sans-serif">${node.name}</text>
        `;
        if (node.instances === 1) {
          svgHtml += `<circle cx="${node.x}" cy="${node.y + 12}" r="4.5" fill="#38bdf8" />`;
        } else if (node.instances === 2) {
          svgHtml += `
            <circle cx="${node.x - 12}" cy="${node.y + 12}" r="4.5" fill="#38bdf8" />
            <circle cx="${node.x + 12}" cy="${node.y + 12}" r="4.5" fill="#38bdf8" />
          `;
        }
        svgHtml += `</g>`;
      }
    });

    svgHtml += `</svg>`;
    this.calcRagSvgContainer.innerHTML = svgHtml;
  }

  // ==========================================
  // 題型八：臨界區間問題（Critical Section）三準則除錯
  // ==========================================
  generateCalcCS() {
    if (!this.calcQCsText || !this.calcCsCodeBox) return;
    this.selectedCsChoice = null;

    // 重設選項按鈕狀態
    [this.btnCsOptMutex, this.btnCsOptProgress, this.btnCsOptBounded, this.btnCsOptCorrect].forEach(btn => {
      btn?.classList.remove('selected');
    });

    const problems = [
      {
        id: 'cs-turn',
        title: '演算法一：嚴格輪流法（Strict Alternation）',
        correctChoice: 'progress',
        code: `/* 行程 Pi (i 代表自身 0 或 1，對手為 j = 1 - i) */
do {
    while (turn != i); /* 忙碌等待 (Busy Waiting) */

    /* ===== Critical Section (臨界區間) ===== */

    turn = j;          /* 離開後將入場權限交給對手 */

    /* ===== Remainder Section (其餘區間) ===== */
} while (true);`,
        desc: '以下為雙行程軟體同步嘗試方案，使用單一共享整數變數 <code>int turn</code>（初始值為 0）。請分析其是否滿足臨界區間三大準則：',
        explanation: `
          <p><strong>1. 滿足互斥（Mutual Exclusion）：</strong> 因 <code>turn</code> 數值在任一瞬間非 0 即 1，絕無可能兩行程同時通過 <code>while (turn != i)</code> 進入臨界區間。</p>
          <p><strong>2. 違反前進準則（Progress）：</strong></p>
          <p>前進準則的嚴格定義為：當沒有行程在臨界區間內時，只有「不在 Remainder Section 的行程」才有資格參與決定下一個由誰進入，且選拔過程不得被無限期推遲。</p>
          <p>假設情境：$P_0$ 離開臨界區將 <code>turn = 1</code>，隨後 $P_0$ 進入了漫長的 Remainder Section 且暫時不想再進臨界區。此時 $P_1$ 進入臨界區執行完畢退出，將 <code>turn = 0</code>。若 $P_1$ 隨後又想立即再次進入臨界區，卻會因為此時 <code>turn == 0</code> 而被卡死在 <code>while</code> 迴圈！此時 $P_0$ 明明在 Remainder Section，卻實質阻礙了 $P_1$ 的進入，嚴重違反<strong>前進準則（Progress）</strong>。</p>
        `
      },
      {
        id: 'cs-flags-deadlock',
        title: '演算法二：意願旗標陣列（Boolean Flag Array）',
        correctChoice: 'progress',
        code: `/* 共享布林陣列 boolean flag[2] 初始皆為 false */
/* 行程 Pi (i = 0 或 1，對手為 j = 1 - i) */
do {
    flag[i] = true;    /* 宣告自己有進入臨界區之意願 */
    while (flag[j]);   /* 只要對手也有意願，就忙碌等待對手離開 */

    /* ===== Critical Section (臨界區間) ===== */

    flag[i] = false;   /* 離開臨界區，重置意願 */

    /* ===== Remainder Section (其餘區間) ===== */
} while (true);`,
        desc: '以下設計試圖避免嚴格交替，使用 <code>flag[2]</code> 記錄各行程之進入意願。請除錯分析其潛在致命缺陷：',
        explanation: `
          <p><strong>1. 互斥滿足評估：</strong> 表面上只要有一方 <code>flag</code> 為 true，另一方就必須在 <code>while</code> 迴圈等待，互斥可被維持。</p>
          <p><strong>2. 違反前進準則（引發系統死結 Deadlock）：</strong></p>
          <p>考慮極端時序（Interleaving Execution）：</p>
          <ul style="margin-left:1.5rem;">
            <li>$P_0$ 執行 <code>flag[0] = true;</code></li>
            <li>作業系統在此時發生 Context Switch 切換至 $P_1$。</li>
            <li>$P_1$ 亦執行 <code>flag[1] = true;</code></li>
            <li>隨後 $P_0$ 測試 <code>while(flag[1])</code> 陷入無窮迴圈；$P_1$ 測試 <code>while(flag[0])</code> 亦陷入無窮迴圈！</li>
          </ul>
          <p>雙方互相等待對方讓步，系統進展徹底停擺，雙雙卡死，嚴重違反<strong>前進準則（Progress）</strong>。</p>
        `
      },
      {
        id: 'cs-check-before-set',
        title: '先檢測再設旗標的錯誤互斥設計',
        correctChoice: 'mutex',
        code: `/* 行程 Pi (i = 0 或 1，對手為 j = 1 - i) */
do {
    while (flag[j]);   /* 1. 先檢驗對手是否正在臨界區 */
    flag[i] = true;    /* 2. 通過後再宣告自己進入 */

    /* ===== Critical Section (臨界區間) ===== */

    flag[i] = false;   /* 離開臨界區 */

    /* ===== Remainder Section ===== */
} while (true);`,
        desc: '以下同步演算法顛倒了設置順序：先在迴圈中等待對手旗標降下，通過後才將自己的旗標升起。請評析其主要缺陷：',
        explanation: `
          <p><strong>1. 嚴重違反互斥（Mutual Exclusion）：</strong></p>
          <p>此程式碼存在致命的<strong>檢查時至使用時競態條件（Check-then-Act Race Condition）</strong>：</p>
          <ul style="margin-left:1.5rem;">
            <li>初始時 <code>flag[0] == false</code> 且 <code>flag[1] == false</code>。</li>
            <li>$P_0$ 執行第 1 行 <code>while (flag[1]);</code>，條件為 false 通過迴圈。</li>
            <li>恰在此刻（尚未執行第 2 行 <code>flag[0] = true</code> 前），系統發生上下文切換至 $P_1$。</li>
            <li>$P_1$ 執行第 1 行 <code>while (flag[0]);</code>，因 $P_0$ 尚未賦值，條件同樣為 false 順利通過！</li>
            <li>隨後 $P_0$ 與 $P_1$ 陸續執行 <code>flag = true</code> 並<strong>同時跨入臨界區間</strong>！</li>
          </ul>
          <p style="color:var(--accent-rose); font-weight:700;">結論：此演算法徹底破壞了「同一時間至多僅能有 1 個行程處於臨界區」之互斥準則（Mutual Exclusion）！</p>
        `
      },
      {
        id: 'cs-peterson',
        title: '彼得森演算法（Peterson\'s Algorithm）正解分析',
        correctChoice: 'correct',
        code: `/* 共享變數：boolean flag[2]; int turn; */
/* 行程 Pi (i = 0 或 1，對手為 j = 1 - i) */
do {
    flag[i] = true;                 /* 1. 宣告自身進入意願 */
    turn = j;                       /* 2. 謙讓優先權予對手 */
    while (flag[j] && turn == j);   /* 3. 唯有對手有意願且優先權在對手時才等待 */

    /* ===== Critical Section (臨界區間) ===== */

    flag[i] = false;                /* 4. 離開臨界區，釋放意願 */

    /* ===== Remainder Section ===== */
} while (true);`,
        desc: '請評析經典的雙行程彼得森演算法（Peterson\'s Algorithm），判斷其是否同時符合所有規範：',
        explanation: `
          <p><strong>1. 滿足互斥（Mutual Exclusion）：</strong> 即使雙方同時將 <code>flag</code> 設為 true，由於 <code>turn</code> 賦值操作為純量寫入，後寫入者必定覆蓋先寫入者，使得 <code>turn</code> 最終僅等於 $0$ 或 $1$ 其中之一，因此必定只有一方能離開 <code>while</code> 迴圈進入臨界區。</p>
          <p><strong>2. 滿足前進（Progress）：</strong> 若對手沒有意願（<code>flag[j] == false</code>），行程能直接跳過等待進入臨界區；若雙方皆有意願，則由最後決定謙讓對象之 <code>turn</code> 決定誰先進，選拔程序在有限步內必定完成，無死結可能。</p>
          <p><strong>3. 滿足有限等待（Bounded Waiting）：</strong> 任何行程最多只需等待對手執行 1 次臨界區後，對手退出時重設 <code>flag[j]=false</code>，等待者便可保證進入，絕不產生飢餓（Starvation）。</p>
          <p style="color:var(--accent-emerald); font-weight:700;">結論：此為標準經典正解，完全且同時滿足臨界區間三大準則！</p>
        `
      }
    ];

    const idx = this.randInt(0, problems.length - 1);
    const problem = problems[idx];
    this.currentCalcCS = problem;

    this.calcQCsText.innerHTML = `
      <div style="font-weight:700; color:var(--accent-cyan); margin-bottom:0.35rem;">分析題目：${problem.title}</div>
      <div>${problem.desc}</div>
    `;

    this.calcCsCodeBox.textContent = problem.code;

    if (this.calcFeedbackCS) {
      this.calcFeedbackCS.style.display = 'none';
      this.calcFeedbackCS.className = 'calc-feedback';
      this.calcFeedbackCS.innerHTML = '';
    }
    this.renderMath(this.calcPanelCS);
  }

  selectCsChoice(choice) {
    this.selectedCsChoice = choice;
    const btnMap = {
      mutex: this.btnCsOptMutex,
      progress: this.btnCsOptProgress,
      bounded: this.btnCsOptBounded,
      correct: this.btnCsOptCorrect
    };

    Object.keys(btnMap).forEach(key => {
      if (key === choice) {
        btnMap[key]?.classList.add('selected');
      } else {
        btnMap[key]?.classList.remove('selected');
      }
    });
  }

  verifyCalcCS() {
    if (!this.currentCalcCS || !this.calcFeedbackCS) return;
    const p = this.currentCalcCS;

    if (!this.selectedCsChoice) {
      alert('請先點選下方按鈕選擇你的除錯判斷！');
      return;
    }

    const isCorrect = this.selectedCsChoice === p.correctChoice;
    const choiceNames = {
      mutex: '違反互斥（Mutual Exclusion）',
      progress: '違反前進（Progress）',
      bounded: '違反有限等待（Bounded Waiting）',
      correct: '完全正確，滿足三大準則'
    };

    this.calcFeedbackCS.className = `calc-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    this.calcFeedbackCS.style.display = 'block';
    this.calcFeedbackCS.innerHTML = `
      <div style="font-weight:700; font-size:1.05rem; color:${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom:0.5rem;">
        ${isCorrect ? '【除錯精準】你的準則判斷與教科書完全吻合！' : `【除錯錯誤】你的選擇為「${choiceNames[this.selectedCsChoice]}」，標準正解為「${choiceNames[p.correctChoice]}」。`}
      </div>
      <div style="font-size:0.92rem; line-height:1.7; color:var(--text-light);">
        ${p.explanation}
      </div>
    `;
    this.renderMath(this.calcFeedbackCS);
  }

  // ==========================================
  // 全域公式渲染處理 (KaTeX + 離線回退)
  // ==========================================
  renderMath(root = document.body) {
    if (!root) return;
    if (window.renderMathInElement) {
      try {
        window.renderMathInElement(root, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
          throwOnError: false
        });
        return;
      } catch (e) {
        console.warn('KaTeX render error:', e);
      }
    }
    // 僅在完全無 KaTeX 時才進行安全純文字回退替換
    this.fallbackMathRender(root);
  }

  fallbackMathRender(element) {
    if (!element) return;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const nodesToReplace = [];
    let node;
    while (node = walker.nextNode()) {
      if (node.nodeValue && node.nodeValue.includes('$')) {
        const parentTag = node.parentElement?.tagName?.toLowerCase();
        if (parentTag !== 'script' && parentTag !== 'style' && parentTag !== 'textarea') {
          nodesToReplace.push(node);
        }
      }
    }
    nodesToReplace.forEach(textNode => {
      const parent = textNode.parentNode;
      if (!parent) return;
      const html = this.formatMath(textNode.nodeValue);
      if (html !== textNode.nodeValue) {
        const span = document.createElement('span');
        span.innerHTML = html;
        parent.replaceChild(span, textNode);
      }
    });
  }
  initSimulatorPresets() {
    if (!this.simPresetSelect) return;
    this.simPresetSelect.innerHTML = '';
    this.data.ganttPresets.forEach(preset => {
      const opt = document.createElement('option');
      opt.value = preset.id;
      opt.textContent = preset.title;
      this.simPresetSelect.appendChild(opt);
    });

    if (this.data.ganttPresets.length > 0) {
      this.loadPreset(this.data.ganttPresets[0].id);
    }
  }

  loadPreset(presetId) {
    const preset = this.data.ganttPresets.find(p => p.id === presetId);
    if (!preset) return;

    if (this.simAlgoSelect) this.simAlgoSelect.value = preset.algorithm;
    if (this.simQuantumInput) this.simQuantumInput.value = preset.quantum || 2;
    if (this.simQuantumWrap) {
      this.simQuantumWrap.style.display = preset.algorithm === 'RR' ? 'flex' : 'none';
    }

    if (!this.processTableBody) return;
    this.processTableBody.innerHTML = '';

    preset.processes.forEach(p => {
      this.addProcessRow(p.id, p.arrival, p.burst, p.priority);
    });

    this.executeSimulation();
  }

  addProcessRow(id = '', arrival = 0, burst = 4, priority = 1) {
    if (!this.processTableBody) return;
    const rowCount = this.processTableBody.querySelectorAll('tr').length;
    const procId = id || `P${rowCount + 1}`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="proc-id" value="${procId}" /></td>
      <td><input type="number" class="proc-arr" value="${arrival}" min="0" /></td>
      <td><input type="number" class="proc-burst" value="${burst}" min="1" /></td>
      <td><input type="number" class="proc-prio" value="${priority}" min="1" /></td>
      <td>
        <button class="btn btn-danger" style="padding:0.2rem 0.5rem; font-size:0.75rem;" onclick="this.closest('tr').remove()">刪除</button>
      </td>
    `;
    this.processTableBody.appendChild(tr);
  }

  getProcessesFromTable() {
    const rows = this.processTableBody.querySelectorAll('tr');
    const procs = [];
    rows.forEach(r => {
      const id = r.querySelector('.proc-id').value.trim();
      const arrival = Number(r.querySelector('.proc-arr').value) || 0;
      const burst = Number(r.querySelector('.proc-burst').value) || 1;
      const priority = Number(r.querySelector('.proc-prio').value) || 1;
      if (id) {
        procs.push({ id, arrival, burst, priority });
      }
    });
    return procs;
  }

  executeSimulation() {
    const procs = this.getProcessesFromTable();
    if (procs.length === 0) {
      alert('請至少加入一個行程！');
      return;
    }

    const algo = this.simAlgoSelect.value;
    const quantum = Number(this.simQuantumInput.value) || 2;

    const result = OSScheduler.simulate(procs, algo, quantum);
    this.renderGanttChart(result, procs);
  }

  renderGanttChart(result, procs) {
    if (!this.ganttChartArea) return;
    const { timeline, processStats, avgWaiting, avgTurnaround, avgResponse, cpuUtilization, totalTime } = result;

    if (timeline.length === 0 || totalTime === 0) {
      this.ganttChartArea.innerHTML = '<p class="text-muted">尚無甘特圖資料。</p>';
      return;
    }

    // 分配行程顏色對應
    const colorMap = { 'IDLE': '#334155' };
    const uniqueIds = [...new Set(procs.map(p => p.id))];
    uniqueIds.forEach((id, idx) => {
      colorMap[id] = PROCESS_COLORS[idx % PROCESS_COLORS.length];
    });

    // 繪製甘特圖長條
    let barHtml = '<div class="gantt-bar-wrapper">';
    timeline.forEach(seg => {
      const duration = seg.end - seg.start;
      const pct = (duration / totalTime) * 100;
      const isIdle = seg.id === 'IDLE';
      barHtml += `
        <div class="gantt-block ${isIdle ? 'idle' : ''}" style="width: ${pct}%; background-color: ${colorMap[seg.id] || '#475569'};" title="${seg.id} [${seg.start} -> ${seg.end}]">
          ${seg.id} (${duration})
        </div>
      `;
    });
    barHtml += '</div>';

    // 繪製時間刻度
    let scaleHtml = '<div class="gantt-scale">';
    // 起點
    scaleHtml += `<div class="gantt-scale-mark" style="left: 0%;">0</div>`;
    timeline.forEach(seg => {
      const posPct = (seg.end / totalTime) * 100;
      scaleHtml += `<div class="gantt-scale-mark" style="left: ${posPct}%;">${seg.end}</div>`;
    });
    scaleHtml += '</div>';

    this.ganttChartArea.innerHTML = barHtml + scaleHtml;

    // 渲染統計指標卡片
    if (this.ganttStatsSummary) {
      this.ganttStatsSummary.innerHTML = `
        <div class="stat-box">
          <div class="title">平均等待時間 (Avg WT)</div>
          <div class="val" style="color:var(--accent-amber);">${avgWaiting} ms</div>
        </div>
        <div class="stat-box">
          <div class="title">平均轉向時間 (Avg TAT)</div>
          <div class="val">${avgTurnaround} ms</div>
        </div>
        <div class="stat-box">
          <div class="title">平均回應時間 (Avg RT)</div>
          <div class="val">${avgResponse} ms</div>
        </div>
        <div class="stat-box">
          <div class="title">CPU 利用率</div>
          <div class="val" style="color:var(--accent-emerald);">${cpuUtilization}%</div>
        </div>
        <div class="stat-box">
          <div class="title">總執行時間</div>
          <div class="val">${totalTime} ms</div>
        </div>
      `;
    }

    // 渲染各行程指標表格
    if (this.ganttTableBody) {
      this.ganttTableBody.innerHTML = '';
      processStats.forEach(stat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong style="color:${colorMap[stat.id] || 'inherit'};">${stat.id}</strong></td>
          <td>${stat.arrival}</td>
          <td>${stat.burst}</td>
          <td>${stat.completion}</td>
          <td><strong>${stat.turnaround}</strong> (${stat.completion} - ${stat.arrival})</td>
          <td style="color:var(--accent-amber); font-weight:700;">${stat.waiting}</td>
          <td>${stat.response}</td>
        `;
        this.ganttTableBody.appendChild(tr);
      });
    }
  }

  // ==========================================
  // 期中甘特圖與數值手算實戰考場核心邏輯
  // ==========================================
  switchSchedulerMode(mode) {
    this.currentSchedMode = mode;
    if (mode === 'demo') {
      this.btnSchedModeDemo?.classList.add('active');
      this.btnSchedModePractice?.classList.remove('active');
      if (this.schedPanelDemo) this.schedPanelDemo.style.display = 'block';
      if (this.schedPanelPractice) this.schedPanelPractice.style.display = 'none';
    } else {
      this.btnSchedModePractice?.classList.add('active');
      this.btnSchedModeDemo?.classList.remove('active');
      if (this.schedPanelPractice) this.schedPanelPractice.style.display = 'block';
      if (this.schedPanelDemo) this.schedPanelDemo.style.display = 'none';
      if (!this.currentSchedPractice) {
        this.generateSchedulerPractice();
      }
    }
  }

  generateSchedulerPractice() {
    if (!this.schedPracticeGivenTbody || !this.schedPracticeInputTbody) return;

    let selectedAlgo = this.schedPracticeAlgoSelect?.value || 'RANDOM';
    const algoList = ['FCFS', 'SJF', 'SRTF', 'RR', 'Priority', 'Priority_Preempt'];
    if (selectedAlgo === 'RANDOM') {
      selectedAlgo = algoList[this.randInt(0, algoList.length - 1)];
    }

    const count = parseInt(this.schedPracticeCountSelect?.value, 10) || 4;
    const isPriority = selectedAlgo === 'Priority' || selectedAlgo === 'Priority_Preempt';
    const isRR = selectedAlgo === 'RR';
    const quantum = isRR ? this.randInt(2, 4) : 2;

    const algoNames = {
      FCFS: '先來先服務（FCFS, 非搶占式）',
      SJF: '最短工作優先（SJF, 非搶占式）',
      SRTF: '最短剩餘時間優先（SRTF, 搶占式 SJF）',
      RR: `輪轉排程（Round Robin, 時間量子 q = ${quantum}）`,
      Priority: '優先權排程（Priority, 非搶占式，數字越小優先權越高）',
      Priority_Preempt: '優先權排程（Priority, 搶占式，數字越小優先權越高）'
    };

    const procs = [];
    let curArr = 0;
    for (let i = 1; i <= count; i++) {
      if (i > 1) {
        curArr += this.randInt(1, 3);
      }
      procs.push({
        id: `P${i}`,
        arrival: curArr,
        burst: this.randInt(2, 7),
        priority: this.randInt(1, 4)
      });
    }

    const simResult = OSScheduler.simulate(procs, selectedAlgo, quantum);

    this.currentSchedPractice = {
      algo: selectedAlgo,
      algoName: algoNames[selectedAlgo],
      quantum,
      isPriority,
      procs,
      simResult
    };

    if (this.schedPracticeQHeader) {
      this.schedPracticeQHeader.textContent = `當前考題排程演算法：${algoNames[selectedAlgo]}`;
    }

    if (this.schedPracticeQDesc) {
      this.schedPracticeQDesc.innerHTML = `
        系統已隨機產生 <strong>${count} 個行程</strong> 之排程參數。請根據 <strong>${algoNames[selectedAlgo]}</strong> 原則，在計算紙上畫出甘特圖，並推算各行程之完成時間（Completion Time $C_i$）、迴轉時間（Turnaround Time $TAT_i$）、等待時間（Waiting Time $WT_i$），以及全系統之平均等待時間與平均迴轉時間。
      `;
    }

    if (this.schedPracticeThPriority) {
      this.schedPracticeThPriority.style.display = isPriority ? '' : 'none';
    }

    let givenHtml = '';
    procs.forEach(p => {
      givenHtml += `
        <tr>
          <td><strong style="color:var(--primary);">${p.id}</strong></td>
          <td>${p.arrival}</td>
          <td>${p.burst}</td>
          ${isPriority ? `<td style="color:var(--accent-amber); font-weight:700;">${p.priority}</td>` : ''}
        </tr>
      `;
    });
    this.schedPracticeGivenTbody.innerHTML = givenHtml;

    let inputHtml = '';
    procs.forEach(p => {
      inputHtml += `
        <tr id="sched-practice-row-${p.id}">
          <td><strong style="color:var(--primary);">${p.id}</strong></td>
          <td>${p.arrival}</td>
          <td>${p.burst}</td>
          <td>
            <input type="number" class="sched-practice-input" id="sched-in-c-${p.id}" placeholder="整數" />
            <span class="sched-sol-hint" id="sched-sol-c-${p.id}" style="display:none;"></span>
          </td>
          <td>
            <input type="number" class="sched-practice-input" id="sched-in-tat-${p.id}" placeholder="整數" />
            <span class="sched-sol-hint" id="sched-sol-tat-${p.id}" style="display:none;"></span>
          </td>
          <td>
            <input type="number" class="sched-practice-input" id="sched-in-wt-${p.id}" placeholder="整數" />
            <span class="sched-sol-hint" id="sched-sol-wt-${p.id}" style="display:none;"></span>
          </td>
        </tr>
      `;
    });
    this.schedPracticeInputTbody.innerHTML = inputHtml;

    if (this.schedPracticeInputAwt) this.schedPracticeInputAwt.value = '';
    if (this.schedPracticeInputAtat) this.schedPracticeInputAtat.value = '';
    if (this.schedPracticeFeedback) {
      this.schedPracticeFeedback.style.display = 'none';
      this.schedPracticeFeedback.innerHTML = '';
    }

    procs.forEach(p => {
      ['c', 'tat', 'wt'].forEach(f => {
        const inp = document.getElementById(`sched-in-${f}-${p.id}`);
        inp?.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') this.verifySchedulerPractice();
        });
      });
    });

    this.renderMath(this.schedPanelPractice);
  }

  verifySchedulerPractice() {
    if (!this.currentSchedPractice || !this.schedPracticeFeedback) return;
    const { procs, simResult } = this.currentSchedPractice;
    const { processStats, avgWaiting, avgTurnaround, timeline, totalTime } = simResult;

    let totalFields = procs.length * 3 + 2;
    let correctCount = 0;

    procs.forEach(p => {
      const stat = processStats.find(s => s.id === p.id);
      if (!stat) return;

      const inC = document.getElementById(`sched-in-c-${p.id}`);
      const inTAT = document.getElementById(`sched-in-tat-${p.id}`);
      const inWT = document.getElementById(`sched-in-wt-${p.id}`);

      const solC = document.getElementById(`sched-sol-c-${p.id}`);
      const solTAT = document.getElementById(`sched-sol-tat-${p.id}`);
      const solWT = document.getElementById(`sched-sol-wt-${p.id}`);

      const checkField = (inputEl, solEl, expectedVal) => {
        const userVal = parseInt(inputEl?.value, 10);
        if (isNaN(userVal)) {
          inputEl?.classList.remove('correct');
          inputEl?.classList.add('incorrect');
          if (solEl) {
            solEl.style.display = 'block';
            solEl.textContent = `正解: ${expectedVal}`;
          }
        } else if (userVal === expectedVal) {
          correctCount++;
          inputEl?.classList.remove('incorrect');
          inputEl?.classList.add('correct');
          if (solEl) solEl.style.display = 'none';
        } else {
          inputEl?.classList.remove('correct');
          inputEl?.classList.add('incorrect');
          if (solEl) {
            solEl.style.display = 'block';
            solEl.textContent = `正解: ${expectedVal}`;
          }
        }
      };

      checkField(inC, solC, stat.completion);
      checkField(inTAT, solTAT, stat.turnaround);
      checkField(inWT, solWT, stat.waiting);
    });

    const userAwt = parseFloat(this.schedPracticeInputAwt?.value);
    const userAtat = parseFloat(this.schedPracticeInputAtat?.value);

    const awtCorrect = !isNaN(userAwt) && Math.abs(userAwt - avgWaiting) <= 0.06;
    const atatCorrect = !isNaN(userAtat) && Math.abs(userAtat - avgTurnaround) <= 0.06;

    if (this.schedPracticeInputAwt) {
      if (awtCorrect) {
        correctCount++;
        this.schedPracticeInputAwt.style.borderColor = 'var(--accent-emerald)';
      } else {
        this.schedPracticeInputAwt.style.borderColor = 'var(--accent-rose)';
      }
    }

    if (this.schedPracticeInputAtat) {
      if (atatCorrect) {
        correctCount++;
        this.schedPracticeInputAtat.style.borderColor = 'var(--accent-emerald)';
      } else {
        this.schedPracticeInputAtat.style.borderColor = 'var(--accent-rose)';
      }
    }

    const isAllCorrect = correctCount === totalFields;

    const colorMap = { 'IDLE': '#334155' };
    const uniqueIds = procs.map(p => p.id);
    uniqueIds.forEach((id, idx) => {
      colorMap[id] = PROCESS_COLORS[idx % PROCESS_COLORS.length];
    });

    let barHtml = '<div class="gantt-bar-wrapper" style="min-width:480px;">';
    timeline.forEach(seg => {
      const duration = seg.end - seg.start;
      const pct = (duration / totalTime) * 100;
      const isIdle = seg.id === 'IDLE';
      barHtml += `
        <div class="gantt-block ${isIdle ? 'idle' : ''}" style="width: ${pct}%; background-color: ${colorMap[seg.id] || '#475569'};" title="${seg.id} [${seg.start} -> ${seg.end}]">
          ${seg.id} (${duration})
        </div>
      `;
    });
    barHtml += '</div>';

    let scaleHtml = '<div class="gantt-scale" style="min-width:480px;">';
    scaleHtml += `<div class="gantt-scale-mark" style="left: 0%;">0</div>`;
    timeline.forEach(seg => {
      const posPct = (seg.end / totalTime) * 100;
      scaleHtml += `<div class="gantt-scale-mark" style="left: ${posPct}%;">${seg.end}</div>`;
    });
    scaleHtml += '</div>';

    let stepsHtml = timeline.map(seg => {
      const duration = seg.end - seg.start;
      if (seg.id === 'IDLE') {
        return `<li>時段 $[${seg.start} \\to ${seg.end}]$（長度 ${duration}）：CPU 處於閒置狀態（IDLE），等待後續行程抵達。</li>`;
      }
      return `<li>時段 $[${seg.start} \\to ${seg.end}]$（長度 ${duration}）：調度執行 <strong>${seg.id}</strong>。</li>`;
    }).join('');

    let formulasHtml = processStats.map(s => {
      return `
        <li>
          <strong>${s.id}</strong>：完成時間 $C = ${s.completion}$；迴轉時間 $TAT = C - A = ${s.completion} - ${s.arrival} = \\mathbf{${s.turnaround}}$；等待時間 $WT = TAT - B = ${s.turnaround} - ${s.burst} = \\mathbf{${s.waiting}}$。
        </li>
      `;
    }).join('');

    this.schedPracticeFeedback.style.display = 'block';
    this.schedPracticeFeedback.className = `calc-feedback ${isAllCorrect ? 'correct' : 'incorrect'}`;
    this.schedPracticeFeedback.innerHTML = `
      <div style="font-weight:700; font-size:1.1rem; color:${isAllCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'}; margin-bottom:0.75rem;">
        ${isAllCorrect
          ? '【全數推算正確】太厲害了！你的甘特圖排程推導與各項數值計算 100% 正確！'
          : `【核對完成】本次作答答對 ${correctCount} / ${totalFields} 格。請對照下方甘特圖與標準詳解修正錯誤欄位：`
        }
      </div>

      <div style="background-color:rgba(0,0,0,0.25); border-radius:var(--radius-sm); padding:1rem; margin-bottom:1rem; border:1px solid rgba(255,255,255,0.06);">
        <h4 style="color:var(--accent-cyan); font-size:0.95rem; margin-bottom:0.5rem;">標準甘特圖（Gantt Chart）：</h4>
        <div class="gantt-chart-container" style="margin:0.5rem 0 1rem 0;">
          ${barHtml + scaleHtml}
        </div>

        <h4 style="color:var(--accent-amber); font-size:0.95rem; margin-top:1rem; margin-bottom:0.35rem;">甘特圖執行區間拆解時序：</h4>
        <ul style="margin-left:1.5rem; font-size:0.9rem; line-height:1.7; color:var(--text-light);">
          ${stepsHtml}
        </ul>

        <h4 style="color:var(--accent-emerald); font-size:0.95rem; margin-top:1rem; margin-bottom:0.35rem;">各行程數值逐步推導：</h4>
        <ul style="margin-left:1.5rem; font-size:0.9rem; line-height:1.7; color:var(--text-light);">
          ${formulasHtml}
        </ul>

        <p style="margin-top:0.75rem; font-weight:700; color:var(--text-main);">
          全系統平均等待時間 $AWT = \\frac{\\sum WT}{${procs.length}} = \\mathbf{${avgWaiting}}$ ms ｜ 全系統平均迴轉時間 $ATAT = \\frac{\\sum TAT}{${procs.length}} = \\mathbf{${avgTurnaround}}$ ms
        </p>
      </div>
    `;

    this.renderMath(this.schedPracticeFeedback);
  }

  revealSchedulerPracticeSolution() {
    if (!this.currentSchedPractice) return;
    const { procs, simResult } = this.currentSchedPractice;
    const { processStats, avgWaiting, avgTurnaround } = simResult;

    procs.forEach(p => {
      const stat = processStats.find(s => s.id === p.id);
      if (!stat) return;
      const inC = document.getElementById(`sched-in-c-${p.id}`);
      const inTAT = document.getElementById(`sched-in-tat-${p.id}`);
      const inWT = document.getElementById(`sched-in-wt-${p.id}`);
      if (inC) inC.value = stat.completion;
      if (inTAT) inTAT.value = stat.turnaround;
      if (inWT) inWT.value = stat.waiting;
    });

    if (this.schedPracticeInputAwt) this.schedPracticeInputAwt.value = avgWaiting;
    if (this.schedPracticeInputAtat) this.schedPracticeInputAtat.value = avgTurnaround;

    this.verifySchedulerPractice();
  }

  // ==========================================
  // Tab 4: 期中考反覆刷題庫 (Quiz Engine)
  // ==========================================
  renderQuiz() {
    if (!this.quizListContainer) return;
    let questions = this.data.quizQuestions;

    if (this.currentQuizFilter !== 'all') {
      questions = questions.filter(q => q.chapter === this.currentQuizFilter);
    }

    if (this.currentQuizCategoryFilter !== 'all') {
      if (this.currentQuizCategoryFilter === 'calc') {
        questions = questions.filter(q => q.category === 'calc');
      } else if (this.currentQuizCategoryFilter === 'concept') {
        questions = questions.filter(q => q.category === 'concept' || !q.category);
      } else if (this.currentQuizCategoryFilter === 'mistakes') {
        const mistakeSet = new Set(this.progress.mistakeIds || []);
        questions = questions.filter(q => mistakeSet.has(q.id));
      }
    }

    if (questions.length === 0) {
      if (this.currentQuizCategoryFilter === 'mistakes') {
        this.quizListContainer.innerHTML = `
          <div class="alert-box success" style="text-align:center; padding: 2.5rem 1.5rem; margin-top: 1rem;">
            <div style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem; color:var(--accent-emerald);">太棒了！目前題庫中沒有待複習的錯題</div>
            <p style="color:var(--text-muted); font-size:0.92rem; margin:0;">若在下方其他題型測驗中答錯，系統會自動歸納記錄至此，方便考前專注衝刺突破。</p>
          </div>
        `;
      } else {
        this.quizListContainer.innerHTML = '<p class="text-muted" style="text-align:center; padding: 2rem;">尚無符合條件的題目。</p>';
      }
      return;
    }

    let html = '';
    questions.forEach((q, qIdx) => {
      const isMistake = this.progress.mistakeIds?.includes(q.id);
      const chName = q.chapter.toUpperCase();
      const catBadge = q.category === 'calc'
        ? '<span class="badge badge-calc" style="font-size:0.75rem;">計算推導</span>'
        : '<span class="badge badge-concept" style="font-size:0.75rem;">觀念題</span>';

      html += `
        <div class="quiz-card" id="quiz-card-${q.id}">
          <div class="quiz-meta">
            <span class="badge badge-ch">${chName}</span>
            ${catBadge}
            <span class="badge badge-tag">單選測驗</span>
            ${isMistake ? '<span class="badge" style="background-color:rgba(244,63,94,0.2); color:var(--accent-rose);">曾答錯</span>' : ''}
          </div>
          <div class="quiz-question-text">Q${qIdx + 1}. ${this.formatMath(q.question)}</div>
          <div class="quiz-options">
            ${q.options.map((opt, optIdx) => `
              <button class="option-btn" data-qid="${q.id}" data-opt="${optIdx}" onclick="app.handleAnswerQuiz('${q.id}', ${optIdx})">
                <span style="font-weight:700; width:20px;">${String.fromCharCode(65 + optIdx)}.</span>
                <span>${this.formatMath(opt)}</span>
              </button>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="feedback-${q.id}"></div>
        </div>
      `;
    });

    this.quizListContainer.innerHTML = html;
    this.renderMath(this.quizListContainer);
  }

  handleAnswerQuiz(questionId, selectedIdx) {
    const q = this.data.quizQuestions.find(item => item.id === questionId);
    if (!q) return;

    const card = document.getElementById(`quiz-card-${questionId}`);
    if (!card) return;

    const optButtons = card.querySelectorAll('.option-btn');
    const feedbackEl = document.getElementById(`feedback-${questionId}`);

    // 禁用選項防止重複點擊
    optButtons.forEach(btn => {
      btn.disabled = true;
      const optVal = Number(btn.getAttribute('data-opt'));
      if (optVal === q.answer) {
        btn.classList.add('correct');
      } else if (optVal === selectedIdx) {
        btn.classList.add('incorrect');
      }
    });

    const isCorrect = selectedIdx === q.answer;

    // 統計更新
    this.progress.answeredCount = (this.progress.answeredCount || 0) + 1;
    if (isCorrect) {
      this.progress.correctCount = (this.progress.correctCount || 0) + 1;
    } else {
      if (!this.progress.mistakeIds.includes(questionId)) {
        this.progress.mistakeIds.push(questionId);
      }
    }
    this.saveProgress();

    // 顯示詳細解析
    if (feedbackEl) {
      feedbackEl.classList.add('visible');
      feedbackEl.innerHTML = `
        <div class="status-header" style="color: ${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
          ${isCorrect ? '回答正確！' : '回答錯誤！'} 正確答案為：(${String.fromCharCode(65 + q.answer)})
        </div>
        <div style="color:var(--text-light); line-height:1.6;">
          <strong>題解與觀念剖析：</strong><br/>
          ${this.formatMath(q.explanation).replace(/\n/g, '<br/>')}
        </div>
      `;
      this.renderMath(feedbackEl);
    }
  }

  // ==========================================
  // Tab 5: 錯題專攻筆記本 (Mistakes Review)
  // ==========================================
  renderMistakes() {
    if (!this.mistakesContainer) return;
    const mistakeIds = this.progress.mistakeIds || [];

    if (mistakeIds.length === 0) {
      this.mistakesContainer.innerHTML = `
        <div class="card" style="text-align:center; padding:3rem 1rem;">
          <h3 style="color:var(--accent-emerald); margin-bottom:0.5rem;">太棒了！目前沒有累積任何錯題</h3>
          <p class="text-muted">你可以前往「期中考反覆刷題庫」進行測驗，若有錯題將會自動收錄於此。</p>
        </div>
      `;
      return;
    }

    const mistakeQuestions = this.data.quizQuestions.filter(q => mistakeIds.includes(q.id));

    let html = `
      <div class="alert-box" style="margin-bottom:1.25rem;">
        <strong>錯題專攻模式：</strong> 以下共收錄 ${mistakeQuestions.length} 道曾經答錯的題目。建議反覆演練直到完全掌握觀念。
      </div>
    `;

    mistakeQuestions.forEach((q, idx) => {
      html += `
        <div class="quiz-card" id="mistake-card-${q.id}">
          <div class="quiz-meta">
            <span class="badge badge-ch">${q.chapter.toUpperCase()}</span>
            <span class="badge" style="background-color:rgba(244,63,94,0.2); color:var(--accent-rose);">待複習錯題</span>
            <button class="btn btn-success" style="padding:0.15rem 0.6rem; font-size:0.75rem; margin-left:auto;" onclick="app.removeMistake('${q.id}')">標記為已掌握 (移除)</button>
          </div>
          <div class="quiz-question-text">${idx + 1}. ${this.formatMath(q.question)}</div>
          <div class="quiz-options">
            ${q.options.map((opt, optIdx) => `
              <button class="option-btn" data-qid="${q.id}" data-opt="${optIdx}" onclick="app.handleAnswerMistake('${q.id}', ${optIdx})">
                <span style="font-weight:700; width:20px;">${String.fromCharCode(65 + optIdx)}.</span>
                <span>${this.formatMath(opt)}</span>
              </button>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="mistake-feedback-${q.id}"></div>
        </div>
      `;
    });

    this.mistakesContainer.innerHTML = html;
    this.renderMath(this.mistakesContainer);
  }

  handleAnswerMistake(questionId, selectedIdx) {
    const q = this.data.quizQuestions.find(item => item.id === questionId);
    if (!q) return;

    const card = document.getElementById(`mistake-card-${questionId}`);
    if (!card) return;

    const optButtons = card.querySelectorAll('.option-btn');
    const feedbackEl = document.getElementById(`mistake-feedback-${questionId}`);

    optButtons.forEach(btn => {
      btn.disabled = true;
      const optVal = Number(btn.getAttribute('data-opt'));
      if (optVal === q.answer) {
        btn.classList.add('correct');
      } else if (optVal === selectedIdx) {
        btn.classList.add('incorrect');
      }
    });

    const isCorrect = selectedIdx === q.answer;
    if (feedbackEl) {
      feedbackEl.classList.add('visible');
      feedbackEl.innerHTML = `
        <div class="status-header" style="color: ${isCorrect ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
          ${isCorrect ? '重測正確！已徹底釐清該考點！' : '依然答錯，請仔細閱讀下方解析並背誦！'} 正確答案為：(${String.fromCharCode(65 + q.answer)})
        </div>
        <div style="color:var(--text-light); line-height:1.6;">
          <strong>題解與觀念剖析：</strong><br/>
          ${this.formatMath(q.explanation).replace(/\n/g, '<br/>')}
        </div>
      `;
      this.renderMath(feedbackEl);
    }
  }

  removeMistake(questionId) {
    this.progress.mistakeIds = this.progress.mistakeIds.filter(id => id !== questionId);
    this.saveProgress();
    this.updateStatsBanner();
    this.renderMistakes();
    if (this.currentQuizCategoryFilter === 'mistakes') {
      this.renderQuiz();
    }
  }

  // ==========================================
  // Tab 6: 觀念抽認卡 (Flashcards)
  // ==========================================
  renderFlashcard() {
    const list = this.data.flashcards;
    if (!list || list.length === 0) {
      if (this.flashcardContent) this.flashcardContent.textContent = '暫無抽認卡。';
      return;
    }

    if (this.currentFlashcardIdx >= list.length) {
      this.currentFlashcardIdx = 0;
    }

    const fc = list[this.currentFlashcardIdx];
    this.flashcardIsFlipped = false;

    if (this.flashcardChapter) {
      this.flashcardChapter.textContent = fc.chapter.toUpperCase();
    }

    if (this.flashcardIndicator) {
      this.flashcardIndicator.textContent = `${this.currentFlashcardIdx + 1} / ${list.length}`;
    }

    const isMastered = this.progress.masteredFlashcardIds?.includes(fc.id);
    if (this.btnFcToggleMaster) {
      this.btnFcToggleMaster.textContent = isMastered ? '已掌握（點擊取消）' : '標記為已掌握';
      this.btnFcToggleMaster.className = `btn ${isMastered ? 'btn-success' : ''}`;
    }

    if (this.flashcardContent) {
      this.flashcardContent.className = 'flashcard-content';
      this.flashcardContent.innerHTML = this.formatDescription(fc.front);
      this.renderMath(this.flashcardContent);
    }
  }

  flipFlashcard() {
    const list = this.data.flashcards;
    if (!list || list.length === 0) return;
    const fc = list[this.currentFlashcardIdx];

    this.flashcardIsFlipped = !this.flashcardIsFlipped;

    if (this.flashcardContent) {
      if (this.flashcardIsFlipped) {
        this.flashcardContent.className = 'flashcard-content back';
        this.flashcardContent.innerHTML = this.formatDescription(fc.back);
      } else {
        this.flashcardContent.className = 'flashcard-content';
        this.flashcardContent.innerHTML = this.formatDescription(fc.front);
      }
      this.renderMath(this.flashcardContent);
    }
  }

  navigateFlashcard(offset) {
    const list = this.data.flashcards;
    if (!list || list.length === 0) return;
    this.currentFlashcardIdx = (this.currentFlashcardIdx + offset + list.length) % list.length;
    this.renderFlashcard();
  }

  toggleMasterFlashcard() {
    const list = this.data.flashcards;
    if (!list || list.length === 0) return;
    const fc = list[this.currentFlashcardIdx];

    if (!this.progress.masteredFlashcardIds) {
      this.progress.masteredFlashcardIds = [];
    }

    const idx = this.progress.masteredFlashcardIds.indexOf(fc.id);
    if (idx > -1) {
      this.progress.masteredFlashcardIds.splice(idx, 1);
    } else {
      this.progress.masteredFlashcardIds.push(fc.id);
    }

    this.saveProgress();
    this.renderFlashcard();
  }

  // ==========================================
  // Tab 7: 擴充管理中心 (新增、匯出、匯入)
  // ==========================================
  exportCurrentData() {
    if (!this.jsonExportArea) return;
    this.jsonExportArea.value = JSON.stringify(this.data, null, 2);
  }

  copyJsonToClipboard() {
    if (!this.jsonExportArea) return;
    navigator.clipboard.writeText(this.jsonExportArea.value).then(() => {
      alert('已成功複製全部題庫與章節 JSON 資料至剪貼簿！');
    }).catch(err => {
      this.jsonExportArea.select();
      document.execCommand('copy');
      alert('已選取並複製！');
    });
  }

  importCustomJson() {
    if (!this.jsonExportArea) return;
    try {
      const parsed = JSON.parse(this.jsonExportArea.value.trim());
      if (!parsed.chapters || !parsed.quizQuestions) {
        throw new Error('JSON 格式缺少 chapters 或 quizQuestions 必要陣列欄位');
      }
      this.data = parsed;
      this.saveData();
      this.renderAll();
      alert('資料匯入成功！已更新所有章節與題庫。');
    } catch (err) {
      alert('匯入失敗：' + err.message);
    }
  }

  handleAddNewChapter() {
    const title = document.getElementById('new-ch-title')?.value.trim();
    const tips = document.getElementById('new-ch-tips')?.value.trim();
    const secTitle = document.getElementById('new-sec-title')?.value.trim();
    const secSummary = document.getElementById('new-sec-summary')?.value.trim();
    const termName = document.getElementById('new-term-name')?.value.trim();
    const termDesc = document.getElementById('new-term-desc')?.value.trim();

    if (!title || !secTitle || !termName) {
      alert('請填寫完整章節標題、子單元名稱與重點名詞！');
      return;
    }

    const newId = `ch${this.data.chapters.length + 1}_${Date.now()}`;
    const newChapter = {
      id: newId,
      title: title,
      examTips: tips || '期中考高頻考點',
      sections: [
        {
          id: `${newId}-1`,
          title: secTitle,
          summary: secSummary,
          items: [
            {
              term: termName,
              desc: termDesc
            }
          ]
        }
      ]
    };

    this.data.chapters.push(newChapter);
    this.saveData();
    this.renderChapterNav();
    this.currentChapterId = newId;
    this.renderChapterNotes();
    this.exportCurrentData();

    this.formAddChapter.reset();
    alert(`章節「${title}」已成功新增！已同步更新至側邊欄與題庫選單。`);
  }

  handleAddNewQuestion() {
    const chId = document.getElementById('new-q-chapter')?.value;
    const question = document.getElementById('new-q-text')?.value.trim();
    const opt0 = document.getElementById('new-q-opt0')?.value.trim();
    const opt1 = document.getElementById('new-q-opt1')?.value.trim();
    const opt2 = document.getElementById('new-q-opt2')?.value.trim();
    const opt3 = document.getElementById('new-q-opt3')?.value.trim();
    const answer = Number(document.getElementById('new-q-ans')?.value) || 0;
    const explanation = document.getElementById('new-q-exp')?.value.trim();

    if (!question || !opt0 || !opt1 || !opt2 || !opt3) {
      alert('請填寫完整題目與 4 個選項！');
      return;
    }

    const newQ = {
      id: `custom_q_${Date.now()}`,
      chapter: chId,
      type: 'single',
      question: question,
      options: [opt0, opt1, opt2, opt3],
      answer: answer,
      explanation: explanation || '觀念請參照該單元筆記說明。'
    };

    this.data.quizQuestions.push(newQ);
    this.saveData();
    this.renderQuiz();
    this.exportCurrentData();
    this.updateStatsBanner();

    this.formAddQuestion.reset();
    alert('新測驗題目已成功加入題庫！');
  }


  // ==========================================
  // Tab: 期中非選問答庫 (Essay & Deductive Problems)
  // ==========================================
  updateEssayChapterSelect() {
    if (!this.essayChapterSelect) return;
    const currentVal = this.essayChapterSelect.value;
    this.essayChapterSelect.innerHTML = '<option value="all">全部章節 (CH1 ~ CH5 綜合大題)</option>';
    this.data.chapters.forEach(ch => {
      const opt = document.createElement('option');
      opt.value = ch.id;
      opt.textContent = ch.subtitle ? `${ch.title} (${ch.subtitle})` : ch.title;
      this.essayChapterSelect.appendChild(opt);
    });
    this.essayChapterSelect.value = currentVal || 'all';
  }

  renderEssayQuestions() {
    if (!this.essayListContainer) return;
    let questions = this.data.essayQuestions || [];

    // 章節過濾
    if (this.currentEssayChapterFilter !== 'all') {
      questions = questions.filter(q => q.chapter === this.currentEssayChapterFilter);
    }

    // 題型過濾
    if (this.currentEssayCategoryFilter !== 'all') {
      questions = questions.filter(q => q.category === this.currentEssayCategoryFilter);
    }

    // 關鍵字搜尋
    if (this.currentEssaySearch) {
      const kw = this.currentEssaySearch.toLowerCase();
      questions = questions.filter(q => {
        const titleMatch = (q.title || '').toLowerCase().includes(kw);
        const qMatch = (q.question || '').toLowerCase().includes(kw);
        const tagMatch = (q.tags || []).some(t => t.toLowerCase().includes(kw));
        const hintMatch = (q.hint || '').toLowerCase().includes(kw);
        return titleMatch || qMatch || tagMatch || hintMatch;
      });
    }

    if (questions.length === 0) {
      this.essayListContainer.innerHTML = '<p class="text-muted" style="text-align:center; padding: 2rem;">查無符合條件的非選問答題目。</p>';
      return;
    }

    let html = '';
    questions.forEach((q, idx) => {
      const isMastered = (this.progress.masteredEssayIds || []).includes(q.id);
      const chUpper = (q.chapter || '').toUpperCase();
      const pointsLabel = typeof q.points === 'string' && q.points.includes('分') ? q.points : `${q.points || 10} 分`;

      let catBadgeHtml = '';
      if (q.category === 'calc') {
        catBadgeHtml = '<span class="badge badge-calc">綜合計算推導</span>';
      } else if (q.category === 'concept') {
        catBadgeHtml = '<span class="badge badge-concept">名詞解釋與核心觀念</span>';
      } else {
        catBadgeHtml = '<span class="badge badge-design">架構設計與申論問答</span>';
      }

      const tagsHtml = (q.tags || []).map(t => `<span class="badge badge-tag">${t}</span>`).join(' ');

      html += `
        <div class="essay-card ${isMastered ? 'mastered' : ''}" id="essay-card-${q.id}">
          <div class="essay-card-header">
            <div class="essay-meta">
              <span class="badge badge-ch">${chUpper}</span>
              ${catBadgeHtml}
              <span class="badge badge-score">${pointsLabel}</span>
              ${tagsHtml}
            </div>
            <div>
              <button class="essay-master-btn ${isMastered ? 'mastered' : ''}" onclick="app.toggleEssayMastered('${q.id}')">
                ${isMastered ? '✓ 已掌握' : '標記為已掌握'}
              </button>
            </div>
          </div>

          <div class="essay-question-title">${q.title}</div>
          <div class="essay-question-body">${this.formatMath(q.question).replace(/\n/g, '<br/>')}</div>

          ${q.hint ? `
            <div class="essay-hint-box">
              <strong>破題關鍵思考：</strong> ${this.formatMath(q.hint)}
            </div>
          ` : ''}

          <div class="essay-actions-row">
            <button class="essay-toggle-btn" id="btn-toggle-ans-${q.id}" onclick="app.toggleEssayAnswer('${q.id}')">
              ${this.allEssayAnswersExpanded ? '收合解答與推導' : '展開完整標準解答與演算'}
            </button>
            <span style="font-size: 0.82rem; color: var(--text-muted);">題號編號：${q.id}</span>
          </div>

          <div class="essay-answer-panel ${this.allEssayAnswersExpanded ? 'show' : ''}" id="essay-ans-${q.id}">
            <div class="essay-answer-header">
              <span>標準解答與逐步推導剖析</span>
            </div>
            <div style="color: var(--text-light); line-height: 1.7; font-size: 0.93rem;">
              ${this.formatMath(q.answer).replace(/\n/g, '<br/>')}
            </div>

            ${q.rubric ? `
              <div class="essay-rubric-box">
                <div class="essay-rubric-header">考試評分標準（Rubric）</div>
                <div style="line-height: 1.6;">
                  ${Array.isArray(q.rubric)
                    ? `<ul class="essay-rubric-list" style="margin: 0.35rem 0 0 1.25rem; padding: 0; line-height: 1.7;">${q.rubric.map(r => `<li>${this.formatMath(r)}</li>`).join('')}</ul>`
                    : this.formatMath(String(q.rubric)).replace(/\n/g, '<br/>')
                  }
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });

    this.essayListContainer.innerHTML = html;
    this.renderMath(this.essayListContainer);
  }

  toggleEssayAnswer(id) {
    const panel = document.getElementById(`essay-ans-${id}`);
    const btn = document.getElementById(`btn-toggle-ans-${id}`);
    if (!panel) return;
    const isShowing = panel.classList.toggle('show');
    if (btn) {
      btn.textContent = isShowing ? '收合解答與推導' : '展開完整標準解答與演算';
    }
    if (isShowing) {
      this.renderMath(panel);
    }
  }

  toggleEssayMastered(id) {
    if (!this.progress.masteredEssayIds) {
      this.progress.masteredEssayIds = [];
    }
    const idx = this.progress.masteredEssayIds.indexOf(id);
    if (idx > -1) {
      this.progress.masteredEssayIds.splice(idx, 1);
    } else {
      this.progress.masteredEssayIds.push(id);
    }
    this.saveProgress();
    this.renderEssayQuestions();
  }

  toggleAllEssayAnswers() {
    this.allEssayAnswersExpanded = !this.allEssayAnswersExpanded;
    if (this.btnToggleAllEssayAnswers) {
      this.btnToggleAllEssayAnswers.textContent = this.allEssayAnswersExpanded ? '收合所有解答' : '展開所有解答';
    }
    const panels = this.essayListContainer?.querySelectorAll('.essay-answer-panel');
    const btns = this.essayListContainer?.querySelectorAll('.essay-toggle-btn');
    panels?.forEach(p => {
      if (this.allEssayAnswersExpanded) {
        p.classList.add('show');
        this.renderMath(p);
      } else {
        p.classList.remove('show');
      }
    });
    btns?.forEach(b => {
      b.textContent = this.allEssayAnswersExpanded ? '收合解答與推導' : '展開完整標準解答與演算';
    });
  }

  // ==========================================
  // 總體渲染入口
  // ==========================================
  renderAll() {
    this.updateStatsBanner();
    this.renderChapterNav();
    this.renderChapterNotes();
    this.renderMemoryPyramid();
    try { this.initSimulatorPresets(); } catch (e) { console.warn('Simulator init warning:', e); }
    try { this.generateSchedulerPractice(); } catch (e) { console.warn('Scheduler practice warning:', e); }
    try { this.renderQuiz(); } catch (e) { console.warn('Quiz render warning:', e); }
    try { this.updateEssayChapterSelect(); } catch (e) { console.warn('Essay chapter select warning:', e); }
    try { this.renderEssayQuestions(); } catch (e) { console.warn('Essay render warning:', e); }
    try { this.renderFlashcard(); } catch (e) { console.warn('Flashcard render warning:', e); }
    try { this.initDeadlockChallenge(); } catch (e) { console.warn('Deadlock init warning:', e); }
    try { this.initCalcLab(); } catch (e) { console.warn('Calc lab init warning:', e); }
    try { this.exportCurrentData(); } catch (e) { console.warn('Export current data warning:', e); }
    try { this.renderMath(document.body); } catch (e) { console.warn('Math render warning:', e); }
  }
}

// 實例化全域應用程式物件
var app;
document.addEventListener('DOMContentLoaded', () => {
  try {
    app = new OSMasterApp();
    window.app = app;
  } catch (err) {
    console.error('OS Master 初始化失敗:', err);
  }
});
window.addEventListener('load', () => {
  if (window.app && window.renderMathInElement) {
    window.app.renderMath(document.body);
  }
});
