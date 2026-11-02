(() => {
  const form = document.querySelector("#session-form");
  const subjectInput = document.querySelector("#subject");
  const durationInput = document.querySelector("#duration");
  const noteInput = document.querySelector("#note");
  const studyDateInput = document.querySelector("#study-date");
  const message = document.querySelector("#form-message");
  const submitButton = document.querySelector("#submit-button");
  const cancelButton = document.querySelector("#cancel-edit");
  const sessionList = document.querySelector("#session-list");
  const emptyState = document.querySelector("#empty-state");
  const emptyTitle = document.querySelector("#empty-title");
  const emptyHint = document.querySelector("#empty-hint");
  const authForm = document.querySelector("#auth-form");
  const authEmailInput = document.querySelector("#auth-email");
  const authPasswordInput = document.querySelector("#auth-password");
  const authConfirmRow = document.querySelector("#auth-confirm-row");
  const authConfirmInput = document.querySelector("#auth-confirm");
  const authMessage = document.querySelector("#auth-message");
  const authPanel = document.querySelector("#auth-panel");
  const recoveryPanel = document.querySelector("#recovery-panel");
  const recoveryForm = document.querySelector("#recovery-form");
  const recoveryMessage = document.querySelector("#recovery-message");
  const studentArea = document.querySelector("#student-area");
  const fontSelect = document.querySelector("#font-select");
  const themeSwitch = document.querySelector("#theme-switch");
  const fontSizeValue = document.querySelector("#font-size-value");
  const settingsMessage = document.querySelector("#settings-message");
  const signOutButton = document.querySelector("#sign-out");
  const cloudMessage = document.querySelector("#cloud-message");
  const sessionBadge = document.querySelector("#session-badge");
  const chartElement = document.querySelector("#chart");
  const chartTotal = document.querySelector("#chart-total");
  const goalInput = document.querySelector("#goal-input");
  const goalSaveButton = document.querySelector("#goal-save");
  const goalMessage = document.querySelector("#goal-message");
  const timerDisplay = document.querySelector("#timer-display");
  const timerToggle = document.querySelector("#timer-toggle");
  const timerAccept = document.querySelector("#timer-accept");
  const timerReset = document.querySelector("#timer-reset");
  const sessionSearch = document.querySelector("#session-search");
  const exportAccountDataButton = document.querySelector("#export-account-data");
  const importAccountDataButton = document.querySelector("#import-account-data");
  const importFileInput = document.querySelector("#import-file");
  const notifyToggle = document.querySelector("#notify-toggle");
  const notifyStatus = document.querySelector("#notify-status");
  const weeklyReportButton = document.querySelector("#weekly-report-btn");
  const subjectSuggestions = document.querySelector("#subject-suggestions");
  const quickStartButton = document.querySelector("#quick-start-btn");

  // مؤقت بومودورو
  const pomodoroPanel = document.querySelector("#pomodoro-panel");
  const pomodoroTime = document.querySelector("#pomodoro-time");
  const pomodoroModeLabel = document.querySelector("#pomodoro-mode");
  const pomodoroRing = document.querySelector("#pomodoro-ring");
  const pomodoroToggle = document.querySelector("#pomodoro-toggle");
  const pomodoroReset = document.querySelector("#pomodoro-reset");
  const pomodoroLog = document.querySelector("#pomodoro-log");
  const pomodoroRounds = document.querySelector("#pomodoro-rounds");
  const pomodoroHint = document.querySelector("#pomodoro-hint");
  const pomodoroSubjectInput = document.querySelector("#pomodoro-subject");
  const pomodoroNotify = document.querySelector("#pomodoro-notify");
  const pomodoroPresets = document.querySelectorAll(".pomodoro-preset");

  // الشريط العلوي
  const themeToggle = document.querySelector("#theme-toggle");
  const settingsTopButton = document.querySelector("#settings-top");
  // الإعدادات
  const installSettingsBtn = document.querySelector("#install-settings-btn");
  const privacyOpenBtn = document.querySelector("#privacy-open-btn");
  const privacyOpenFooter = document.querySelector("#privacy-open-footer");
  const privacyModal = document.querySelector("#privacy-modal");
  const privacyClose = document.querySelector("#privacy-close");

  // شاشة الترحيب
  const privacyOpenFromForm = document.querySelector("#privacy-open-from-form");
  const onboardingModal = document.querySelector("#onboarding-modal");
  const onboardingClose = document.querySelector("#onboarding-close");
  const onboardingPrev = document.querySelector("#onboarding-prev");
  const onboardingNext = document.querySelector("#onboarding-next");
  const onboardingSkip = document.querySelector("#onboarding-skip");
  const onboardingPages = document.querySelectorAll(".onboarding-page");
  const onboardingSteps = document.querySelectorAll(".step");
  const homeTodayMinutes = document.querySelector("#home-today-minutes");
  const homeTodayGoal = document.querySelector("#home-today-goal");
  const homeTodaySessions = document.querySelector("#home-today-sessions");
  const homeTodayStreak = document.querySelector("#home-today-streak");
  const homeTodayHint = document.querySelector("#home-today-hint");
  const todayRing = document.querySelector("#today-ring");
  const demoBanner = document.querySelector("#demo-banner");
  const demoStartButton = document.querySelector("#demo-start");
  const demoExitButton = document.querySelector("#demo-exit");
  const demoSignupButton = document.querySelector("#demo-signup");

  let onboardingIndex = 0;

  // المهام
  const taskForm = document.querySelector("#task-form");
  const taskTitleInput = document.querySelector("#task-title");
  const taskDueInput = document.querySelector("#task-due");
  const taskPriorityInput = document.querySelector("#task-priority");
  const taskRepeatInput = document.querySelector("#task-repeat");
  const taskList = document.querySelector("#task-list");
  const taskBadge = document.querySelector("#task-badge");
  const taskMessage = document.querySelector("#task-message");
  const taskEmpty = document.querySelector("#task-empty");

  // التخطيط
  const planForm = document.querySelector("#plan-form");
  const planTitleInput = document.querySelector("#plan-title");
  const planDayInput = document.querySelector("#plan-day");
  const planTimeInput = document.querySelector("#plan-time");
  const planMessage = document.querySelector("#plan-message");
  const weekPlan = document.querySelector("#week-plan");
  const calendarElement = document.querySelector("#calendar");
  const calLabel = document.querySelector("#cal-label");
  const calPrev = document.querySelector("#cal-prev");
  const calNext = document.querySelector("#cal-next");

  let supabaseClient = null;
  let currentUser = null;
  let initializedUserId = null;
  let initializingUserId = null;
  let initializationPromise = null;
  let sessions = [];
  let tasks = [];
  let tasksHaveExtras = true;
  let planItems = [];
  let editingId = null;
  let isSignUp = false;
  let dailyGoal = 120;
  let currentView = "today";
  let currentPage = "home";
  let timerStart = null;
  let timerElapsedMs = 0;
  let timerInterval = null;
  let calCursor = new Date();

  // ===== وضع المعاينة (بيانات وهمية محلية بالكامل) =====
  const DEMO_FLAG = "study-tracker-demo";
  let demoMode = false;
  let demoGoal = 120;
  let demoSeq = 0;

  // حالة مؤقت بومودورو
  const POMODORO_KEY = "study-tracker-pomodoro";
  let pomodoroInterval = null;
  let pomodoroAudioCtx = null;
  let pomodoroState = {
    mode: "focus",
    focusMinutes: 25,
    breakMinutes: 5,
    rounds: 0,
    roundDate: "",
    remainingMs: 25 * 60000,
    endAt: null,
    running: false,
    finishedFocus: false,
    subject: "",
    notify: true,
  };

  const DEFAULT_GOAL = 120;
  const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5]; // السبت ثم الأحد..الجمعة
  const WEEK_NAMES = { 0: "الأحد", 1: "الاثنين", 2: "الثلاثاء", 3: "الأربعاء", 4: "الخميس", 5: "الجمعة", 6: "السبت" };
  const TASK_PRIORITY_WEIGHT = { high: 0, normal: 1, low: 2 };
  const TASK_PRIORITY_LABEL = { high: "أولوية عالية", normal: "أولوية عادية", low: "أولوية منخفضة" };
  const TASK_REPEAT_LABEL = { none: "", daily: "كل يوم", weekly: "كل أسبوع", monthly: "كل شهر" };
  const EMPTY_TEXT = {
    today: ["مساحتك جاهزة لأول إنجاز", "أضف جلسة دراستك الأولى، وستظهر هنا."],
    yesterday: ["لا توجد جلسات أمس", "يمكنك إضافة جلسة بأمس التاريخ من النموذج."],
    week: ["لا توجد جلسات في آخر ٧ أيام", "أضف جلسة جديدة أو استعرض جلسات الشهر."],
    month: ["لا توجد جلسات هذا الشهر", "ابدأ اليوم وستجد ملخصك هنا."],
  };
  const ARABIC_FONTS = {
    ibm: '"IBM Plex Sans Arabic", "Segoe UI", Tahoma, sans-serif',
    cairo: '"Cairo", Tahoma, sans-serif',
    tajawal: '"Tajawal", Tahoma, sans-serif',
    "noto-sans": '"Noto Sans Arabic", Tahoma, sans-serif',
    "noto-naskh": '"Noto Naskh Arabic", "Traditional Arabic", serif',
    system: 'system-ui, "Segoe UI", Tahoma, sans-serif',
  };
  const FONT_SCALES = [0.9, 1, 1.1, 1.2];
  let appearance = { font: "ibm", fontScale: 1, theme: "day" };

  const pad2 = (value) => String(value).padStart(2, "0");
  const toArabicDigits = (value) => pad2(value).replace(/\d/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[digit]);
  const dateKey = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const addDays = (date, days) => {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  };
  const arabicNumber = (value) => new Intl.NumberFormat("ar-SA").format(value);
  const weekdayShort = (date) => new Intl.DateTimeFormat("ar-SA", { weekday: "short" }).format(date);
  const dateShort = (key) => new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "short" }).format(new Date(`${key}T00:00:00`));

  // ===== الطبقة دون اتصال: ذاكرة محلية + طابور مزامنة تلقائي =====
  const CACHE_KEYS = {
    sessions: "study-tracker-cache-sessions",
    tasks: "study-tracker-cache-tasks",
    plan: "study-tracker-cache-plan",
    goal: "study-tracker-cache-goal",
    queue: "study-tracker-pending-ops",
  };
  let pendingOps = [];
  try { pendingOps = JSON.parse(localStorage.getItem(CACHE_KEYS.queue) || "[]"); } catch { pendingOps = []; }
  let offlineTempSeq = 0;
  const readCache = (key) => {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) ? parsed : parsed;
    } catch { return null; }
  };
  const writeCache = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { console.warn("تعذر حفظ الذاكرة المحلية."); }
  };
  const clearAppCache = () => {
    [CACHE_KEYS.sessions, CACHE_KEYS.tasks, CACHE_KEYS.plan, CACHE_KEYS.goal].forEach((key) => {
      try { localStorage.removeItem(key); } catch { /* ignore */ }
    });
  };
  const tempId = () => `local-${Date.now().toString(36)}-${++offlineTempSeq}`;
  const isNetworkError = (error) => {
    const text = String(error?.message || error || "").toLowerCase();
    return /failed to fetch|networkerror|network error|load failed|timed?\s?out|err_network/.test(text);
  };
  function persistQueue() {
    writeCache(CACHE_KEYS.queue, pendingOps);
  }
  function cacheAll() {
    if (demoMode) return;
    writeCache(CACHE_KEYS.sessions, sessions);
    writeCache(CACHE_KEYS.tasks, tasks);
    writeCache(CACHE_KEYS.plan, planItems);
    writeCache(CACHE_KEYS.goal, dailyGoal);
  }
  function saveSessionsLocal() {
    sessions.sort((a, b) => (b.study_date === a.study_date ? new Date(b.created_at) - new Date(a.created_at) : b.study_date.localeCompare(a.study_date)));
    render();
    cacheAll();
  }

  // تطبيق العملية على الحالة المحلية فورًا (تعمل الواجهة حتى دون إنترنت).
  function applyOpLocally(op) {
    switch (op.type) {
      case "session.save":
        sessions.unshift({ id: op.localId, ...op.payload });
        saveSessionsLocal();
        break;
      case "session.update":
        sessions = sessions.map((session) => (session.id === op.id ? { ...session, ...op.payload } : session));
        saveSessionsLocal();
        break;
      case "session.delete":
        sessions = sessions.filter((session) => session.id !== op.id);
        if (editingId === op.id) resetForm();
        saveSessionsLocal();
        break;
      case "task.save":
        tasks.unshift(normalizeTask({ id: op.localId, done: false, created_at: new Date().toISOString(), ...op.payload }));
        sortTasks();
        renderTasks();
        renderCalendar();
        cacheAll();
        break;
      case "task.update":
        tasks = tasks.map((entry) => (entry.id === op.id ? { ...entry, ...op.patch } : entry));
        sortTasks();
        renderTasks();
        renderCalendar();
        cacheAll();
        break;
      case "task.delete":
        tasks = tasks.filter((entry) => entry.id !== op.id);
        renderTasks();
        renderCalendar();
        cacheAll();
        break;
      case "plan.save":
        planItems.push({ id: op.localId, created_at: new Date().toISOString(), ...op.payload });
        planItems.sort((a, b) => (a.weekday === b.weekday ? String(a.start_time || "99").localeCompare(String(b.start_time || "99")) : a.weekday - b.weekday));
        renderPlan();
        renderCalendar();
        cacheAll();
        break;
      case "plan.delete":
        planItems = planItems.filter((entry) => entry.id !== op.id);
        renderPlan();
        renderCalendar();
        cacheAll();
        break;
      case "goal":
        dailyGoal = op.value;
        if (goalInput) goalInput.value = op.value;
        render();
        cacheAll();
        break;
      default:
        break;
    }
  }
  function queueOfflineOp(op, offlineMessage) {
    pendingOps.push(op);
    persistQueue();
    applyOpLocally(op);
    if (offlineMessage) showMessage(offlineMessage.target, offlineMessage.text, true);
  }
  async function flushPendingOps() {
    if (demoMode || !currentUser || !supabaseClient || !pendingOps.length) return;
    let index = 0;
    while (index < pendingOps.length) {
      const op = pendingOps[index];
      try {
        if (op.type === "session.save") {
          const { data, error } = await supabaseClient.from("study_sessions").insert({ ...op.payload, user_id: currentUser.id }).select().single();
          if (error) throw error;
          sessions = sessions.map((entry) => (entry.id === op.localId ? data : entry));
        } else if (op.type === "session.update") {
          const { error } = await supabaseClient.from("study_sessions").update(op.payload).eq("id", op.id).eq("user_id", currentUser.id);
          if (error) throw error;
        } else if (op.type === "session.delete") {
          const { error } = await supabaseClient.from("study_sessions").delete().eq("id", op.id).eq("user_id", currentUser.id);
          if (error) throw error;
        } else if (op.type === "task.save") {
          const { priority, recurrence, ...basePayload } = { ...op.payload, user_id: currentUser.id };
          const sendPayload = op.extras ? { ...basePayload, priority, recurrence } : basePayload;
          const { data, error } = await supabaseClient.from("tasks").insert(sendPayload).select().single();
          if (op.extras && error && /42703|column/i.test(String(error.message || ""))) {
            const { data: fallbackData, error: fallbackError } = await supabaseClient.from("tasks").insert(basePayload).select().single();
            if (fallbackError) throw fallbackError;
            tasks = tasks.map((entry) => (entry.id === op.localId ? normalizeTask(fallbackData) : entry));
          } else if (error) {
            throw error;
          } else {
            tasks = tasks.map((entry) => (entry.id === op.localId ? normalizeTask(data) : entry));
          }
        } else if (op.type === "task.update") {
          const { error } = await supabaseClient.from("tasks").update(op.patch).eq("id", op.id).eq("user_id", currentUser.id);
          if (error) throw error;
        } else if (op.type === "task.delete") {
          const { error } = await supabaseClient.from("tasks").delete().eq("id", op.id).eq("user_id", currentUser.id);
          if (error) throw error;
        } else if (op.type === "plan.save") {
          const { data, error } = await supabaseClient.from("plan_items").insert({ ...op.payload, user_id: currentUser.id }).select().single();
          if (error) throw error;
          planItems = planItems.map((entry) => (entry.id === op.localId ? data : entry));
        } else if (op.type === "plan.delete") {
          const { error } = await supabaseClient.from("plan_items").delete().eq("id", op.id).eq("user_id", currentUser.id);
          if (error) throw error;
        } else if (op.type === "goal") {
          const { error } = await supabaseClient.auth.updateUser({ data: { daily_goal: op.value } });
          if (error) throw error;
        }
        pendingOps.splice(index, 1);
        persistQueue();
        if (op.type === "task.save") sortTasks();
        if (op.type.startsWith("session")) { saveSessionsLocal(); }
        if (op.type.startsWith("task")) { sortTasks(); renderTasks(); renderCalendar(); }
        if (op.type.startsWith("plan")) { renderPlan(); renderCalendar(); }
      } catch (error) {
        if (isNetworkError(error)) { console.warn("تعذر المزامنة الآن — سيُعاد لاحقًا.", error); return; }
        console.warn("فشلت عملية مزامنة نهائيًا وحُذفت من الطابور.", op, error);
        pendingOps.splice(index, 1);
        persistQueue();
      }
    }
    render();
  }
  function setOfflineTag(active) {
    const tag = document.getElementById("offline-tag");
    if (tag) tag.classList.toggle("hidden", !active);
  }
  window.addEventListener("online", () => {
    setOfflineTag(false);
    flushPendingOps();
  });
  window.addEventListener("offline", () => setOfflineTag(true));
  setOfflineTag(navigator.onLine === false);

  // جمل تحفيزية يومية: تتبدّل تلقائيًا كل يوم تقويمي.
  const MILESTONE_QUOTES = [
    "كل دقيقة تركيز تصنع فرقًا ✦",
    "جلساتك... لها أثر يبقى 👣",
    "كل دقيقة... تقرّبك إلى هدفك 🎯",
    "قوة العزيمة... وقود النجاح 🎉",
    "الصبر... مفتاح الفلاح 🌟",
    "عشرون دقيقة الآن... تستحق ساعة الغد 💡",
    "النقط الصغيرة... تجتمع لتصنع العظمة ✨",
    "من يواصل يصل 🛤️",
  ];

  function renderHeroClock() {
    const clockElement = document.querySelector("#hero-clock-time");
    if (!clockElement) return;
    clockElement.textContent = new Intl.DateTimeFormat("ar-SA", {
      hour: "numeric", minute: "2-digit", hour12: true,
    }).format(new Date());
  }

  function updateMilestoneQuote() {
    const quoteElement = document.querySelector("#milestone-quote");
    if (!quoteElement) return;
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const quote = MILESTONE_QUOTES[dayOfYear % MILESTONE_QUOTES.length];
    quoteElement.textContent = quote;
  }

  function updateTodayLabel() {
    const now = new Date();
    const gregorianDate = new Intl.DateTimeFormat("ar-SA", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    }).format(now);
    let hijriDate;
    try {
      hijriDate = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
        day: "numeric", month: "long", year: "numeric",
      }).format(now);
    } catch (error) {
      hijriDate = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
        day: "numeric", month: "long", year: "numeric",
      }).format(now);
    }
    const gregorianSpan = document.querySelector("#hero-date-gregorian");
    const hijriSpan = document.querySelector("#hero-date-hijri");
    if (gregorianSpan) gregorianSpan.textContent = gregorianDate;
    if (hijriSpan) hijriSpan.textContent = `${hijriDate} هجريًا`;
    renderHeroClock();
    updateMilestoneQuote();
    // حقل التاريخ لا يقبل تواريخ مستقبلية؛ نحدّث الحد الأقصى عند تغيّر اليوم.
    if (studyDateInput) studyDateInput.max = dateKey(now);
  }
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const timeLabel = (value) => {
    if (!value) return "";
    const [h, m] = value.split(":").map(Number);
    const period = h < 12 ? "ص" : "م";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${toArabicDigits(hour12)}:${toArabicDigits(m)} ${period}`;
  };

  function showMessage(element, text, success = false) {
    if (!element) return;
    element.textContent = text;
    element.classList.toggle("success", success);
  }

  function loadAppearance() {
    try {
      const saved = JSON.parse(localStorage.getItem("study-tracker-appearance") || "{}");
      appearance = {
        font: ARABIC_FONTS[saved.font] ? saved.font : "ibm",
        fontScale: FONT_SCALES.includes(saved.fontScale) ? saved.fontScale : 1,
        theme: saved.theme === "night" ? "night" : "day",
      };
    } catch (error) {
      console.warn("تعذر قراءة تفضيلات المظهر المحفوظة.", error);
    }
  }

  function applyAppearance() {
    const root = document.documentElement;
    root.style.setProperty("--font-ui", ARABIC_FONTS[appearance.font] || ARABIC_FONTS.ibm);
    root.style.setProperty("--root-font-size", (16 * appearance.fontScale) + "px");
    document.body.dataset.theme = appearance.theme;
    themeToggle.setAttribute("aria-pressed", String(appearance.theme === "night"));
    themeToggle.title = appearance.theme === "night" ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي";
    document.querySelector("#theme-color-meta").content = appearance.theme === "night" ? "#12170f" : "#1c5d46";
    fontSelect.value = appearance.font;
    themeSwitch.checked = appearance.theme === "night";
    const scaleIndex = FONT_SCALES.indexOf(appearance.fontScale);
    fontSizeValue.textContent = ["صغير", "متوسط", "كبير", "كبير جدًا"][scaleIndex] || "متوسط";
    document.querySelector("#font-decrease").disabled = scaleIndex === 0;
    document.querySelector("#font-increase").disabled = scaleIndex === FONT_SCALES.length - 1;
  }

  function saveAppearance() {
    applyAppearance();
    try {
      localStorage.setItem("study-tracker-appearance", JSON.stringify(appearance));
      showMessage(settingsMessage, "تم حفظ تفضيلات المظهر على هذا الجهاز.", true);
    } catch (error) {
      showMessage(settingsMessage, "تعذر حفظ التفضيلات في هذا المتصفح.");
      console.error(error);
    }
  }

  function navigateToPage(page, updateHistory = true) {
    const validPages = ["home", "sessions", "progress", "tasks", "planner", "settings"];
    if (!validPages.includes(page)) page = "home";
    const pageTitles = { home: "الرئيسية", sessions: "الجلسات", progress: "تقدمي", tasks: "المهام", planner: "التخطيط", settings: "الإعدادات" };
    currentPage = page;
    document.title = pageTitles[page] + " — اجتماع النقط";
    document.querySelectorAll(".app-page").forEach((view) => {
      view.classList.toggle("hidden", view.id !== (page + "-page"));
    });
    document.querySelectorAll(".main-navigation [data-page]").forEach((button) => {
      const active = button.dataset.page === page;
      button.classList.toggle("is-active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    if (page === "planner") renderCalendar();
    if (page === "progress") render();

    // إعادة تشغيل رسوم الدخول عند العودة للرئيسية
    if (page === "home") {
      document.querySelectorAll(".animate-in, .home-top, .poem-card, .home-tools").forEach((el) => {
        el.classList.remove("animate-in");
        void el.offsetHeight; // إعادة التدفق
        el.classList.add("animate-in");
      });
    }

    if (updateHistory && window.location.hash !== ("#" + page)) {
      try {
        window.history.pushState({ page }, "", "#" + page);
      } catch (error) {
        window.location.hash = page;
      }
    }
  }

  // ترجمة رسائل أخطاء المصادقة الشائعة إلى عربية واضحة.
  function friendlyAuthError(error) {
    const raw = error?.message || "";
    if (error?.code === "auth_timeout") return "تأخر الاتصال بخدمة تسجيل الدخول. تحقق من الإنترنت وحاول مجددًا.";
    const map = [
      ["Invalid login credentials", "البريد الإلكتروني أو كلمة المرور غير صحيحة."],
      ["Email not confirmed", "الرجاء تأكيد بريدك الإلكتروني أولًا عبر الرسالة التي وصلك."],
      ["User already registered", "هذا البريد مسجّل بالفعل. سجّل الدخول أو استعد كلمة المرور."],
      ["Password should be at least", "كلمة المرور يجب ألا تقل عن ٨ أحرف."],
      ["should be different", "كلمة المرور الجديدة يجب أن تختلف عن السابقة."],
      ["could not be found", "لا يوجد حساب بهذا البريد، أو انتهت صلاحية الرابط."],
      ["no user", "لا يوجد حساب بهذا البريد، أو انتهت صلاحية الرابط."],
      ["Rate limit", "محاولات كثيرة جدًا. انتظر قليلًا ثم حاول مجددًا."],
      ["For security purposes", "لأسباب أمنية، انتظر قليلًا قبل إعادة المحاولة."],
      ["Signup is disabled", "التسجيل معطّل حاليًا. راجع إعدادات المشروع."],
      ["Email address", "هذا البريد الإلكتروني غير صالح أو لا يمكنه استقبال الرسائل. جرّب بريدًا آخر."],
      ["Database error", "خطأ في قاعدة بيانات المصادقة. حاول لاحقًا."],
    ];
    for (const [needle, text] of map) if (raw.includes(needle)) return text;
    if (/fetch|network|load failed/i.test(raw)) return "تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.";
    return "تعذّر إكمال الطلب. تحقق من البيانات وحاول مجددًا.";
  }

  // ترجمة رسائل أخطاء قاعدة البيانات (PostgREST) إلى إرشادات عملية.
  function friendlyDbError(error) {
    const raw = error?.message || "";
    const code = error?.code || "";
    if (code === "42703" || /column .* does not exist/i.test(raw)) return "مخطط قاعدة البيانات قديم. شغّل ملف setup_supabase.sql المحدّث في Supabase.";
    if (code === "42501" || /permission denied/i.test(raw)) return "صلاحيات الوصول مرفوضة. تأكد من تشغيل ملف setup_supabase.sql كاملًا.";
    if (code === "23514") return "القيم المُدخلة خارج النطاق المسموح. راجع القيم وأعد المحاولة.";
    if (code === "23505") return "هذا العنصر موجود بالفعل.";
    if (code === "42P01" || /does not exist/i.test(raw)) return "أحد الجداول غير موجود. شغّل ملف setup_supabase.sql في Supabase.";
    if (code === "PGRST301" || /JWT expired/i.test(raw)) return "انتهت صلاحية الجلسة. سجّل الدخول من جديد.";
    if (/Failed to fetch|NetworkError/i.test(raw)) return "تعذّر الاتصال بقاعدة البيانات. تحقق من إعداد supabase-config.js والإنترنت.";
    return "تعذّر إتمام العملية. حاول مجددًا.";
  }

  // حارس ضد الإرسال المزدوج: يُقفل النموذج حتى ينتهي الطلب الجاري.
  const busyForms = new WeakSet();
  function beginSubmit(targetForm) {
    if (busyForms.has(targetForm)) return false;
    busyForms.add(targetForm);
    return true;
  }
  function endSubmit(targetForm) {
    busyForms.delete(targetForm);
  }

  // رسالة عربية عند فتح رابط تأكيد/استعادة منتهي الصلاحية.
  function describeUrlError(code) {
    if (code === "otp_expired") return "انتهت صلاحية رابط التأكيد. اطلب رابطًا جديدًا من صفحة تسجيل الدخول.";
    if (code === "access_denied") return "تم رفض الوصول. جرّب طلب رابطًا جديدًا.";
    return "حدث خطأ أثناء معالجة الرابط. حاول تسجيل الدخول مباشرة.";
  }

  function setAuthMode(signUp) {
    isSignUp = signUp;
    document.querySelector("#auth-heading").textContent = signUp ? "إنشاء حساب طالب" : "تسجيل الدخول";
    document.querySelector("#auth-description").textContent = signUp ? "أنشئ حسابًا لتُحفظ جلساتك وتجدها عند عودتك." : "سجّل الدخول لمتابعة جلساتك المحفوظة في حسابك.";
    document.querySelector("#auth-submit").innerHTML = signUp ? 'إنشاء الحساب <span aria-hidden="true">←</span>' : 'دخول <span aria-hidden="true">←</span>';
    document.querySelector("#auth-switch-row").firstChild.textContent = signUp ? "لديك حساب بالفعل؟ " : "ليس لديك حساب؟ ";
    document.querySelector("#auth-switch").textContent = signUp ? "تسجيل الدخول" : "إنشاء حساب جديد";
    authPasswordInput.autocomplete = signUp ? "new-password" : "current-password";
    authConfirmRow.classList.toggle("hidden", !signUp);
    authConfirmInput.disabled = !signUp;
    authConfirmInput.required = signUp;
    authConfirmInput.value = "";
    document.querySelector("#forgot-row").classList.toggle("hidden", signUp);
    showMessage(authMessage, "");
  }

  function viewRange(view) {
    const today = new Date();
    if (view === "today") return { start: dateKey(today), end: dateKey(today) };
    if (view === "yesterday") return { start: dateKey(addDays(today, -1)), end: dateKey(addDays(today, -1)) };
    if (view === "week") return { start: dateKey(addDays(today, -6)), end: dateKey(today) };
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return { start: dateKey(monthStart), end: dateKey(today) };
  }

  function viewSessions() {
    const { start, end } = viewRange(currentView);
    return sessions.filter((session) => session.study_date >= start && session.study_date <= end);
  }

  function renderStats() {
    const today = dateKey();
    const todaySessions = sessions.filter((session) => session.study_date === today);
    const totalMinutes = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    const percent = Math.min(100, Math.round((totalMinutes / dailyGoal) * 100));

    // عناصر لوحة الإحصاءات (قد لا تكون موجودة في الصفحة الرئيسية المختصرة)
    const todayHours = document.querySelector("#today-hours");
    if (todayHours) {
      todayHours.textContent = arabicNumber(Math.floor(totalMinutes / 60));
      document.querySelector("#today-minutes").textContent = `${arabicNumber(totalMinutes)} دقيقة إجمالًا`;
      document.querySelector("#today-count").textContent = arabicNumber(todaySessions.length);
      const progressFill = document.querySelector("#goal-progress-fill");
      progressFill.style.width = `${totalMinutes > 0 ? Math.max(percent, 3) : 0}%`;
      progressFill.classList.toggle("goal-met", totalMinutes >= dailyGoal);
      document.querySelector("#goal-progress-text").textContent = totalMinutes >= dailyGoal
        ? "أحسنت! حققت هدف اليوم ✦"
        : `حققت ${arabicNumber(percent)}٪ من هدف ${arabicNumber(dailyGoal)} دقيقة`;
    }

    const studiedDays = new Set(sessions.map((session) => session.study_date));
    let streakCursor = new Date();
    if (!studiedDays.has(dateKey(streakCursor))) streakCursor = addDays(streakCursor, -1);
    let streak = 0;
    while (studiedDays.has(dateKey(streakCursor))) {
      streak += 1;
      streakCursor = addDays(streakCursor, -1);
    }
    const streakElement = document.querySelector("#study-streak");
    if (streakElement) {
      streakElement.textContent = arabicNumber(streak);
      document.querySelector("#study-streak-hint").textContent = streak ? "تقدّم جميل، واصل بإيقاع يناسبك." : "ابدأ بخطوة اليوم، والراحة جزء من الطريق.";
    }

    // ملخص اليوم في الصفحة الرئيسية
    if (homeTodayMinutes) {
      homeTodayMinutes.textContent = arabicNumber(totalMinutes);
      if (homeTodaySessions) homeTodaySessions.textContent = arabicNumber(todaySessions.length);
      if (homeTodayStreak) homeTodayStreak.textContent = arabicNumber(streak);
      if (homeTodayGoal) {
        homeTodayGoal.textContent = totalMinutes >= dailyGoal
          ? "أتممت هدف اليوم ✦"
          : `من هدف ${arabicNumber(dailyGoal)} دقيقة`;
      }
      if (homeTodayHint) {
        homeTodayHint.textContent = totalMinutes >= dailyGoal
          ? "أحسنت! واصل بهذا الإيقاع."
          : totalMinutes > 0
            ? `بقيت ${arabicNumber(Math.max(0, dailyGoal - totalMinutes))} دقيقة لهدف اليوم.`
            : "ابدأ جلستك الأولى اليوم.";
      }
      if (todayRing) {
        const ringPercent = totalMinutes > 0 ? Math.max(2, percent) : 0;
        todayRing.style.setProperty("--today-progress", `${ringPercent}%`);
        todayRing.classList.toggle("is-complete", totalMinutes >= dailyGoal);
        todayRing.setAttribute("aria-label", `أنجزت ${arabicNumber(percent)}٪ من هدف اليوم`);
      }
    }
  }

  function renderChart() {
    if (!chartElement || !chartTotal) return;
    const days = [];
    for (let i = 6; i >= 0; i--) days.push(addDays(new Date(), -i));
    const totals = days.map((day) => sessions
      .filter((session) => session.study_date === dateKey(day))
      .reduce((sum, session) => sum + session.duration, 0));
    const max = Math.max(...totals, dailyGoal, 30);
    const weekTotal = totals.reduce((sum, value) => sum + value, 0);
    chartTotal.textContent = `${arabicNumber(weekTotal)} دقيقة`;
    chartElement.innerHTML = days.map((day, index) => {
      const value = totals[index];
      const height = value > 0 ? Math.max(6, Math.round((value / max) * 100)) : 0;
      const isToday = dateKey(day) === dateKey();
      return `<div class="chart-col${isToday ? " is-today" : ""}">
        <span class="chart-value">${value ? arabicNumber(value) : ""}</span>
        <div class="chart-track"><div class="chart-bar${value >= dailyGoal ? " goal-met" : ""}" style="height:${height}%"></div></div>
        <span class="chart-day">${escapeHtml(weekdayShort(day))}</span>
      </div>`;
    }).join("");
  }

  function renderMonthSummary() {
    const monthMinutes = document.querySelector("#month-minutes");
    if (!monthMinutes) return;
    const today = new Date();
    const start = dateKey(new Date(today.getFullYear(), today.getMonth(), 1));
    const monthSessions = sessions.filter((session) => session.study_date >= start && session.study_date <= dateKey(today));
    const minutes = monthSessions.reduce((sum, session) => sum + Number(session.duration || 0), 0);
    const studyDays = new Set(monthSessions.map((session) => session.study_date)).size;
    const subjectTotals = new Map();
    monthSessions.forEach((session) => subjectTotals.set(session.subject, (subjectTotals.get(session.subject) || 0) + Number(session.duration || 0)));
    const topSubject = [...subjectTotals.entries()].sort((a, b) => b[1] - a[1])[0];
    document.querySelector("#month-minutes").textContent = `${arabicNumber(minutes)} دقيقة`;
    document.querySelector("#month-days").textContent = `${arabicNumber(studyDays)} ${studyDays === 1 ? "يوم" : "أيام"}`;
    document.querySelector("#month-top-subject").textContent = topSubject ? `${topSubject[0]} · ${arabicNumber(topSubject[1])} د` : "—";
    document.querySelector("#month-report-hint").textContent = monthSessions.length
      ? `سجّلت ${arabicNumber(monthSessions.length)} جلسة هذا الشهر. استمر بوتيرتك المناسبة.`
      : "ابدأ بتسجيل جلساتك ليظهر ملخص الشهر.";
  }

  function renderList() {
    const today = dateKey();
    const query = sessionSearch.value.trim().toLocaleLowerCase("ar");
    const items = viewSessions().filter((session) => !query || `${session.subject} ${session.note || ""}`.toLocaleLowerCase("ar").includes(query));
    sessionBadge.textContent = `${arabicNumber(items.length)} جلسات`;
    sessionList.innerHTML = items.map((session) => {
      const timeLabelValue = session.study_date === today
        ? new Intl.DateTimeFormat("ar-SA", { hour: "numeric", minute: "2-digit" }).format(new Date(session.created_at))
        : `${dateShort(session.study_date)}، ${new Intl.DateTimeFormat("ar-SA", { hour: "numeric", minute: "2-digit" }).format(new Date(session.created_at))}`;
      return `
      <article class="session-item" data-id="${escapeHtml(session.id)}">
        <div class="session-main"><h3 class="session-title">${escapeHtml(session.subject)}</h3><p class="session-time">${timeLabelValue}</p></div>
        <span class="session-duration">${arabicNumber(session.duration)} دقيقة</span>
        ${session.note ? `<p class="session-note">${escapeHtml(session.note)}</p>` : ""}
        <div class="session-actions"><button class="text-action edit-action" type="button">تعديل</button><button class="text-action delete delete-action" type="button">حذف</button></div>
      </article>`;
    }).join("");
    emptyState.classList.toggle("hidden", items.length > 0);
    const [title, hint] = query ? ["لا توجد نتائج مطابقة", "جرّب كلمة أخرى أو امسح البحث لعرض الجلسات."] : EMPTY_TEXT[currentView];
    emptyTitle.textContent = title;
    emptyHint.textContent = hint;
  }

  function updateSubjectSuggestions() {
    if (!subjectSuggestions) return;
    const subjects = [...new Set(sessions.map((session) => (session.subject || "").trim()).filter(Boolean))];
    subjectSuggestions.innerHTML = subjects
      .slice(0, 40)
      .map((subject) => `<option value="${escapeHtml(subject)}"></option>`)
      .join("");
  }

  function render() {
    renderStats();
    renderList();
    renderChart();
    renderMonthSummary();
    updateSubjectSuggestions();
  }

  // ===== وضع المعاينة =====
  function readDemoFlag() {
    try {
      return sessionStorage.getItem(DEMO_FLAG) === "1";
    } catch (error) {
      return false;
    }
  }

  function writeDemoFlag(active) {
    try {
      if (active) sessionStorage.setItem(DEMO_FLAG, "1");
      else sessionStorage.removeItem(DEMO_FLAG);
    } catch (error) {
      console.warn("تعذر حفظ حالة المعاينة.", error);
    }
  }

  function buildDemoData() {
    const subjects = ["الرياضيات", "الفيزياء", "الكيمياء", "الأحياء", "اللغة العربية", "الإنجليزية", "التاريخ", "الفقه"];
    const notes = [
      "مراجعة سريعة قبل الاختبار.",
      "حل تمارين الفصل الثالث.",
      "تلخيص المفاهيم الأساسية.",
      "",
      "قراءة إضافية من المرجع.",
      "تدريب على الأسئلة السابقة.",
    ];
    const durations = [25, 30, 40, 45, 50, 60, 75, 90];
    const sessions = [];
    const now = new Date();
    let count = 0;
    for (let i = 0; i < 30; i += 1) {
      if (i === 4 || i === 12 || i === 20) continue;
      const day = addDays(new Date(), -i);
      const perDay = i === 0 ? 3 : i % 6 === 0 ? 2 : 1;
      for (let j = 0; j < perDay; j += 1) {
        count += 1;
        const created = new Date(day);
        const hour = i === 0 ? Math.max(6, now.getHours() - 1 - j * 2) : 9 + j * 3;
        created.setHours(hour, (i * 11 + j * 7) % 60, 0, 0);
        sessions.push({
          id: `demo-session-${count}`,
          subject: subjects[(i * 2 + j * 3) % subjects.length],
          duration: durations[(i + j * 2) % durations.length],
          note: notes[(i + j) % notes.length],
          study_date: dateKey(day),
          created_at: created.toISOString(),
        });
      }
    }
    sessions.sort((a, b) => (b.study_date === a.study_date
      ? new Date(b.created_at) - new Date(a.created_at)
      : b.study_date.localeCompare(a.study_date)));

    const today = dateKey();
    const tasks = [
      { id: "demo-task-1", title: "مراجعة الفصل الرابع في الرياضيات", due_date: today, done: false, priority: "high", recurrence: "none" },
      { id: "demo-task-2", title: "حل تمارين الفيزياء (١–١٢)", due_date: dateKey(addDays(new Date(), 1)), done: false, priority: "normal", recurrence: "none" },
      { id: "demo-task-3", title: "تلخيص درس الأحياء", due_date: dateKey(addDays(new Date(), -1)), done: false, priority: "high", recurrence: "none" },
      { id: "demo-task-4", title: "قراءة ٢٠ صفحة من كتاب التاريخ", due_date: today, done: true, priority: "low", recurrence: "none" },
      { id: "demo-task-5", title: "حفظ عشرة أبيات من الشعر", due_date: today, done: false, priority: "normal", recurrence: "daily" },
      { id: "demo-task-6", title: "مراجعة كلمات الإنجليزية", due_date: dateKey(addDays(new Date(), 1)), done: false, priority: "low", recurrence: "weekly" },
    ].map((task, index) => ({ ...task, created_at: new Date(Date.now() - index * 3_600_000).toISOString() }));

    const planItems = [
      { id: "demo-plan-1", title: "مراجعة الرياضيات", weekday: 6, start_time: "09:00" },
      { id: "demo-plan-2", title: "تمارين الفيزياء", weekday: 6, start_time: "11:30" },
      { id: "demo-plan-3", title: "قراءة الأحياء", weekday: 0, start_time: "10:00" },
      { id: "demo-plan-4", title: "حصة اللغة العربية", weekday: 1, start_time: "08:30" },
      { id: "demo-plan-5", title: "مراجعة الكيمياء", weekday: 2, start_time: "17:00" },
      { id: "demo-plan-6", title: "كلمات الإنجليزية", weekday: 3, start_time: "19:00" },
      { id: "demo-plan-7", title: "تلخيص التاريخ", weekday: 4, start_time: "16:00" },
      { id: "demo-plan-8", title: "مراجعة عامة", weekday: 5, start_time: "09:30" },
    ].map((item) => ({ ...item, created_at: new Date().toISOString() }));

    return { sessions, tasks, planItems };
  }

  function startDemo(options = {}) {
    const resume = options.resume === true;
    demoMode = true;
    writeDemoFlag(true);
    demoGoal = DEFAULT_GOAL;
    dailyGoal = demoGoal;
    currentUser = { id: "demo-user", email: null, user_metadata: { daily_goal: demoGoal } };
    initializedUserId = "demo-user";
    initializingUserId = null;
    initializationPromise = null;
    editingId = null;
    resetForm();
    if (goalInput) goalInput.value = demoGoal;
    authPanel.classList.add("hidden");
    recoveryPanel.classList.add("hidden");
    studentArea.classList.remove("hidden");
    demoBanner.classList.remove("hidden");
    document.body.classList.add("app-mode", "is-demo");
    signOutButton.classList.add("hidden");
    themeToggle.classList.remove("hidden");
    settingsTopButton.classList.remove("hidden");
    const data = buildDemoData();
    sessions = data.sessions;
    tasks = data.tasks;
    planItems = data.planItems;
    sortTasks();
    render();
    renderTasks();
    renderPlan();
    renderCalendar();
    const hashPage = window.location.hash.slice(1);
    navigateToPage(resume && hashPage ? hashPage : "home", false);
    if (!resume && window.location.hash !== "#home") {
      try {
        window.history.replaceState({ page: "home" }, "", "#home");
      } catch (error) {
        // تجاهل فشل تحديث الرابط؛ العرض نفسه صحيح.
      }
    }
    showMessage(cloudMessage, "أنت الآن في وضع المعاينة: كل ما تضيفه أو تعدّله يبقى في هذه الجلسة فقط.", true);
    const settingsEmail = document.querySelector("#settings-email");
    if (settingsEmail) settingsEmail.textContent = "وضع المعاينة — دون حساب";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function exitDemo(options = {}) {
    demoMode = false;
    writeDemoFlag(false);
    document.body.classList.remove("is-demo");
    demoBanner.classList.add("hidden");
    showSignedOut();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (options.goToSignup) {
      setAuthMode(true);
      showMessage(authMessage, "أنشئ حسابك الآن لحفظ جلساتك ومهامك وخطتك في كل أجهزتك.");
      window.setTimeout(() => authEmailInput.focus(), 60);
    } else {
      showMessage(authMessage, "انتهت المعاينة. سجّل الدخول أو أنشئ حسابًا لحفظ بياناتك.");
    }
  }

  async function loadSessions(silent = false) {
    if (demoMode) return;
    const { data, error } = await supabaseClient
      .from("study_sessions")
      .select("id, subject, duration, note, study_date, created_at")
      .eq("user_id", currentUser.id)
      .gte("study_date", dateKey(addDays(new Date(), -364)))
      .lte("study_date", dateKey())
      .order("study_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      const cached = readCache(CACHE_KEYS.sessions);
      if (isNetworkError(error) && cached?.length) {
        sessions = cached;
        showMessage(cloudMessage, "أنت دون اتصال — تُعرض بياناتك المحلية الأخيرة.");
        render();
        return;
      }
      showMessage(cloudMessage, `تعذّر تحميل الجلسات. ${friendlyDbError(error)}`);
      return;
    }
    sessions = data || [];
    cacheAll();
    render();
  }
  async function handleAuth(event) {
    event.preventDefault();
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value;
    const submit = document.querySelector("#auth-submit");
    if (!email) return showMessage(authMessage, "اكتب بريدك الإلكتروني أولًا.");
    if (authEmailInput.validity.typeMismatch) return showMessage(authMessage, "تحقق من كتابة البريد الإلكتروني بشكل صحيح.");
    if (password.length < 8) return showMessage(authMessage, "كلمة المرور يجب ألا تقل عن ٨ أحرف.");
    if (isSignUp && password !== authConfirmInput.value) return showMessage(authMessage, "كلمتا المرور غير متطابقتين.");
    submit.disabled = true;
    authForm.setAttribute("aria-busy", "true");
    showMessage(authMessage, isSignUp ? "جارٍ إنشاء الحساب..." : "جارٍ تسجيل الدخول...");
    let timeoutId;
    try {
      const authRequest = isSignUp
        ? supabaseClient.auth.signUp({ email, password })
        : supabaseClient.auth.signInWithPassword({ email, password });
      const result = await Promise.race([
        authRequest,
        new Promise((_, reject) => {
          timeoutId = window.setTimeout(() => reject(Object.assign(new Error("auth_timeout"), { code: "auth_timeout" })), 20000);
        }),
      ]);
      if (result.error) {
        showMessage(authMessage, friendlyAuthError(result.error));
        console.error(result.error);
        return;
      }
      if (isSignUp && !result.data.session) {
        showMessage(authMessage, "تم إنشاء الحساب. افتح رسالة التأكيد التي وصلت إلى بريدك، ثم سجّل الدخول.", true);
        authForm.reset();
        return;
      }
      if (result.data.user) {
        showMessage(authMessage, "تم تسجيل الدخول بنجاح ✦", true);
        await setUser(result.data.user);
      }
    } catch (error) {
      console.error(error);
      showMessage(authMessage, friendlyAuthError(error));
    } finally {
      window.clearTimeout(timeoutId);
      submit.disabled = false;
      authForm.removeAttribute("aria-busy");
    }
  }

  async function handleForgotPassword() {
    const email = document.querySelector("#auth-email").value.trim();
    if (!email) return showMessage(authMessage, "اكتب بريدك الإلكتروني أولًا حتى نرسل رابط الاستعادة.");
    const button = document.querySelector("#auth-forgot");
    button.disabled = true;
    showMessage(authMessage, "جارٍ إرسال رابط إعادة التعيين...");
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
      });
      if (error) {
        showMessage(authMessage, friendlyAuthError(error));
        console.error(error);
        return;
      }
      showMessage(authMessage, "أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك. تحقق من صندوق الوارد.", true);
    } catch (error) {
      console.error(error);
      showMessage(authMessage, friendlyAuthError(error));
    } finally {
      button.disabled = false;
    }
  }

  function showRecoveryPanel(user) {
    currentUser = user;
    authPanel.classList.add("hidden");
    studentArea.classList.add("hidden");
    recoveryPanel.classList.remove("hidden");
    signOutButton.classList.remove("hidden");
    themeToggle.classList.add("hidden");
    settingsTopButton.classList.add("hidden");
    document.querySelector("#recovery-password").focus();
  }

  async function handleRecovery(event) {
    event.preventDefault();
    const password = document.querySelector("#recovery-password").value;
    const confirm = document.querySelector("#recovery-confirm").value;
    const submit = document.querySelector("#recovery-submit");
    if (password.length < 8) return showMessage(recoveryMessage, "كلمة المرور يجب ألا تقل عن ٨ أحرف.");
    if (password !== confirm) return showMessage(recoveryMessage, "كلمتا المرور غير متطابقتين.");
    submit.disabled = true;
    showMessage(recoveryMessage, "جارٍ حفظ كلمة المرور الجديدة...");
    try {
      const { data, error } = await supabaseClient.auth.updateUser({ password });
      if (error) {
        showMessage(recoveryMessage, friendlyAuthError(error));
        console.error(error);
        return;
      }
      showMessage(recoveryMessage, "تم حفظ كلمة المرور الجديدة. أهلًا بعودتك!", true);
      await setUser(data.user);
      recoveryPanel.classList.add("hidden");
      recoveryForm.reset();
    } catch (error) {
      console.error(error);
      showMessage(recoveryMessage, friendlyAuthError(error));
    } finally {
      submit.disabled = false;
    }
  }

  async function saveGoal() {
    if (!goalInput) return;
    const value = Number(goalInput.value);
    if (!Number.isInteger(value) || value < 5 || value > 1440) {
      return showMessage(goalMessage, "أدخل هدفًا بين ٥ و١٤٤٠ دقيقة.");
    }
    if (demoMode) {
      demoGoal = value;
      dailyGoal = value;
      currentUser.user_metadata = { ...(currentUser.user_metadata || {}), daily_goal: value };
      showMessage(goalMessage, "تم تحديث هدفك في المعاينة (لن يُحفظ بعد إنهائها).", true);
      render();
      return;
    }
    if (goalSaveButton) goalSaveButton.disabled = true;
    try {
      const { data, error } = await supabaseClient.auth.updateUser({ data: { daily_goal: value } });
      if (error) throw error;
      currentUser = data.user;
      dailyGoal = value;
      showMessage(goalMessage, "تم حفظ هدفك اليومي.", true);
      render();
      cacheAll();
      return;
    } catch (error) {
      if (isNetworkError(error)) {
        queueOfflineOp({ type: "goal", value });
        showMessage(goalMessage, "أنت دون اتصال — سعّرنا هدفك محليًا وسيُزامن مع حسابك تلقائيًا.", true);
        return;
      }
      showMessage(goalMessage, friendlyAuthError(error));
      console.error(error);
    } finally {
      if (goalSaveButton) goalSaveButton.disabled = false;
    }
  }

  async function setUser(user) {
    if (demoMode) return;
    if (!user?.id) return;
    if (initializedUserId === user.id) return;
    if (initializingUserId === user.id && initializationPromise) return initializationPromise;
    currentUser = user;
    initializingUserId = user.id;
    document.body.classList.add("app-mode");
    dailyGoal = Number(user?.user_metadata?.daily_goal) || DEFAULT_GOAL;
    if (goalInput) goalInput.value = dailyGoal;
    authPanel.classList.add("hidden");
    recoveryPanel.classList.add("hidden");
    studentArea.classList.remove("hidden");
    signOutButton.classList.remove("hidden");
    themeToggle.classList.remove("hidden");
    settingsTopButton.classList.remove("hidden");
    const settingsEmail = document.querySelector("#settings-email");
    if (settingsEmail) settingsEmail.textContent = user.email || "—";
    const hashPage = window.location.hash.slice(1);
    navigateToPage(hashPage || "home", false);
    initializationPromise = (async () => {
      await loadSessions();
      await Promise.all([loadTasks(), loadPlan()]);
      initializedUserId = user.id;
      // إكمال أي عمليات مؤجلة من زيارة دون اتصال قبل عرض البيانات.
      flushPendingOps();
      // شاشة التعريف الأولى لا تظهر إلا بعد تسجيل الدخول.
      try {
        const alreadyOnboarded = localStorage.getItem("study-tracker-onboarded") === "true";
        if (!alreadyOnboarded) {
          onboardingModal.classList.remove("hidden");
          showOnboardingPage(0);
        }
      } catch (error) {
        console.warn("تعذر قراءة حالة الترحيب.", error);
      }
    })();
    try {
      await initializationPromise;
    } catch (error) {
      console.error("تعذر تجهيز مساحة الطالب.", error);
      showMessage(cloudMessage, "تم تسجيل الدخول، لكن تعذر تحميل بعض بياناتك. تحقق من الاتصال ثم حدّث الصفحة.");
    } finally {
      if (initializingUserId === user.id) {
        initializingUserId = null;
        initializationPromise = null;
      }
    }
  }

  function resetForm() {
    form.reset();
    editingId = null;
    studyDateInput.value = dateKey();
    submitButton.innerHTML = 'حفظ الجلسة <span aria-hidden="true">←</span>';
    cancelButton.classList.add("hidden");
    document.querySelector("#form-heading").textContent = "أضف جلسة دراسة";
  }

  function showSignedOut() {
    demoMode = false;
    document.title = "اجتماع النقط — رفيقك في رحلة العلم";
    document.body.classList.remove("is-demo");
    if (demoBanner) demoBanner.classList.add("hidden");
    currentUser = null;
    initializedUserId = null;
    initializingUserId = null;
    initializationPromise = null;
    sessions = [];
    tasks = [];
    planItems = [];
    studentArea.classList.add("hidden");
    document.body.classList.remove("app-mode");
    signOutButton.classList.add("hidden");
    themeToggle.classList.add("hidden");
    settingsTopButton.classList.add("hidden");
    recoveryPanel.classList.add("hidden");
    authPanel.classList.remove("hidden");
    authForm.reset();
    recoveryForm.reset();
    resetForm();
    setAuthMode(false);
    const queueSnapshot = pendingOps.length;
    clearAppCache();
    if (!queueSnapshot) { pendingOps = []; persistQueue(); }
  }

  function exportCsv() {
    const items = viewSessions();
    if (!items.length) {
      return showMessage(cloudMessage, "لا توجد جلسات في هذا العرض لتصديرها.", false);
    }
    const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const header = ["المادة", "المدة (دقائق)", "الملاحظة", "تاريخ الدراسة", "وقت الإنشاء"];
    const rows = items.map((session) => [
      session.subject,
      session.duration,
      session.note || "",
      session.study_date,
      new Date(session.created_at).toLocaleString("sv-SE"),
    ]);
    const csv = [header, ...rows].map((row) => row.map(quote).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `study-sessions-${dateKey()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showMessage(cloudMessage, `تم تصدير ${arabicNumber(items.length)} جلسة إلى ملف CSV.`, true);
  }

  async function exportAccountData() {
    if (!currentUser || (!demoMode && !supabaseClient)) return;
    exportAccountDataButton.disabled = true;
    showMessage(settingsMessage, "جارٍ تجهيز نسخة بياناتك...");
    const exportedSessions = [];
    const pageSize = 500;
    let offset = 0;
    try {
      if (demoMode) {
        exportedSessions.push(...sessions);
      } else {
        while (true) {
          const { data, error } = await supabaseClient
            .from("study_sessions")
            .select("id, subject, duration, note, study_date, created_at")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: true })
            .order("id", { ascending: true })
            .range(offset, offset + pageSize - 1);
          if (error) throw error;
          exportedSessions.push(...(data || []));
          if (!data || data.length < pageSize) break;
          offset += pageSize;
        }
      }
      const backup = {
        format: "study-tracker-backup-v1",
        exportedAt: new Date().toISOString(),
        account: { email: currentUser.email || null },
        demo: demoMode,
        dailyGoalMinutes: dailyGoal,
        sessions: exportedSessions,
        tasks: tasks.map(({ id, title, due_date, done, priority, recurrence, created_at }) => ({
          id, title, due_date, done, priority: priority || "normal", recurrence: recurrence || "none", created_at,
        })),
        weeklyPlan: planItems.map(({ id, title, weekday, start_time, created_at }) => ({ id, title, weekday, start_time, created_at })),
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `study-tracker-backup-${dateKey()}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showMessage(settingsMessage, demoMode ? "نزّلت بيانات المعاينة الوهمية كملف تجريبي." : "تم تنزيل نسخة بياناتك على هذا الجهاز.", true);
    } catch (error) {
      console.error(error);
      showMessage(settingsMessage, `تعذّر تجهيز النسخة. ${friendlyDbError(error)}`);
    } finally {
      exportAccountDataButton.disabled = false;
    }
  }

  // ===== استيراد نسخة بيانات (JSON) =====
  async function importAccountData(file) {
    if (demoMode) return showMessage(settingsMessage, "الاستيراد متاح بعد تسجيل الدخول (خارج وضع المعاينة).");
    if (!currentUser || !supabaseClient) return showMessage(settingsMessage, "سجّل الدخول أولًا لاستعادة نسخة بياناتك.");
    let backup = null;
    try {
      backup = JSON.parse(await file.text());
    } catch (error) {
      return showMessage(settingsMessage, "الملف ليس نسخة JSON صحيحة. تأكد أنه الملف الذي نزّلته من التطبيق.");
    }
    if (!backup || backup.format !== "study-tracker-backup-v1") {
      return showMessage(settingsMessage, "صيغة الملف غير معروفة — الاستيراد يعمل مع النسخ المنزّلة من هذا التطبيق.");
    }
    const backupSessions = Array.isArray(backup.sessions) ? backup.sessions.filter((item) => item && item.subject && item.duration) : [];
    const backupTasks = Array.isArray(backup.tasks) ? backup.tasks.filter((item) => item && item.title) : [];
    const backupPlan = Array.isArray(backup.weeklyPlan) ? backup.weeklyPlan.filter((item) => item && item.title) : [];
    if (!backupSessions.length && !backupTasks.length && !backupPlan.length) {
      return showMessage(settingsMessage, "الملف لا يحتوي بيانات قابلة للاستيراد.");
    }
    const totalItems = backupSessions.length + backupTasks.length + backupPlan.length;
    const confirmed = window.confirm(`سيُضاف محتوى الملف إلى بياناتك الحالية دون حذف ما لديك:\n· ${backupSessions.length} جلسة\n· ${backupTasks.length} مهمة\n· ${backupPlan.length} بند خطة\n\nمتابعة؟`);
    if (!confirmed) return;
    importAccountDataButton.disabled = true;
    showMessage(settingsMessage, "جارٍ استعادة بياناتك...");
    const dupKey = (parts) => parts.map((part) => String(part ?? "").trim()).join("|");
    const knownSessionKeys = new Set(sessions.map((item) => dupKey([item.subject, item.duration, item.study_date, item.created_at])));
    const knownTaskKeys = new Set(tasks.map((item) => dupKey([item.title, item.due_date, item.created_at, item.done])));
    const knownPlanKeys = new Set(planItems.map((item) => dupKey([item.weekday, item.title, item.start_time])));
    let added = { sessions: 0, tasks: 0, plan: 0 };
    try {
      const freshSessions = backupSessions.filter((item) => !knownSessionKeys.has(dupKey([item.subject, item.duration, item.study_date, item.created_at])));
      for (let i = 0; i < freshSessions.length; i += 100) {
        const chunk = freshSessions.slice(i, i + 100).map((item) => ({
          user_id: currentUser.id,
          subject: String(item.subject).slice(0, 60),
          duration: Math.min(1440, Math.max(1, Number(item.duration) || 1)),
          note: item.note ? String(item.note).slice(0, 240) : null,
          study_date: item.study_date || dateKey(),
          created_at: item.created_at || new Date().toISOString(),
        }));
        const { error } = await supabaseClient.from("study_sessions").insert(chunk);
        if (error) throw error;
        added.sessions += chunk.length;
      }
      const freshTasks = backupTasks.filter((item) => !knownTaskKeys.has(dupKey([item.title, item.due_date, item.created_at, item.done])));
      if (freshTasks.length) {
        const mapped = freshTasks.slice(0, 500).map((item) => {
          const entry = {
            user_id: currentUser.id,
            title: String(item.title).slice(0, 120),
            due_date: item.due_date || null,
            done: Boolean(item.done),
            created_at: item.created_at || new Date().toISOString(),
          };
          if (tasksHaveExtras) {
            entry.priority = item.priority || "normal";
            entry.recurrence = item.recurrence || "none";
          }
          return entry;
        });
        try {
          const { error } = await supabaseClient.from("tasks").insert(mapped);
          if (error) throw error;
          added.tasks += mapped.length;
        } catch (insertError) {
          if (/42703|column/i.test(String(insertError.message || ""))) {
            const { error } = await supabaseClient.from("tasks").insert(mapped.map(({ priority, recurrence, ...rest }) => rest));
            if (error) throw error;
            added.tasks += mapped.length;
          } else {
            throw insertError;
          }
        }
      }
      const freshPlan = backupPlan.filter((item) => !knownPlanKeys.has(dupKey([item.weekday, item.title, item.start_time])));
      if (freshPlan.length) {
        const mapped = freshPlan.slice(0, 300).map((item) => ({
          user_id: currentUser.id,
          title: String(item.title).slice(0, 120),
          weekday: Math.min(6, Math.max(0, Number(item.weekday))),
          start_time: item.start_time || null,
          created_at: item.created_at || new Date().toISOString(),
        }));
        const { error } = await supabaseClient.from("plan_items").insert(mapped);
        if (error) throw error;
        added.plan += mapped.length;
      }
      const backupGoal = Number(backup.dailyGoalMinutes);
      if (Number.isInteger(backupGoal) && backupGoal >= 5 && backupGoal <= 1440 && backupGoal !== dailyGoal) {
        await supabaseClient.auth.updateUser({ data: { daily_goal: backupGoal } });
        dailyGoal = backupGoal;
        if (goalInput) goalInput.value = backupGoal;
      }
      await loadSessions(true);
      await Promise.all([loadTasks(), loadPlan()]);
      const summary = [];
      if (added.sessions) summary.push(`${arabicNumber(added.sessions)} جلسة`);
      if (added.tasks) summary.push(`${arabicNumber(added.tasks)} مهمة`);
      if (added.plan) summary.push(`${arabicNumber(added.plan)} بند خطة`);
      showMessage(settingsMessage, summary.length
        ? `تمت استعادة بياناتك وإضافتها إلى حسابك: ${summary.join(" و")}.`
        : "كل بيانات الملف موجودة في حسابك أصلًا — لم يُضف شيء مكرر.", true);
    } catch (error) {
      console.error(error);
      showMessage(settingsMessage, `تعذّر إكمال الاستيراد. ${friendlyDbError(error)}`);
      await loadSessions(true).catch(() => {});
    } finally {
      importAccountDataButton.disabled = false;
    }
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    const elapsedMs = timerElapsedMs + (timerStart ? Date.now() - timerStart : 0);
    timerStart = null;
    timerElapsedMs = 0;
    timerDisplay.textContent = "٠٠:٠٠:٠٠";
    timerToggle.textContent = "ابدأ المؤقت";
    timerToggle.classList.remove("is-running");
    timerAccept.disabled = true;
    timerReset.disabled = true;
    return elapsedMs;
  }

  function toggleTimer() {
    if (timerStart) {
      timerElapsedMs += Date.now() - timerStart;
      timerStart = null;
      clearInterval(timerInterval);
      timerInterval = null;
      timerToggle.textContent = "استئناف المؤقت";
      timerToggle.classList.remove("is-running");
      showMessage(message, "أُوقف المؤقت مؤقتًا. يمكنك استئنافه أو اعتماد مدته.", true);
      return;
    }
    timerStart = Date.now();
    timerToggle.textContent = "إيقاف مؤقت";
    timerToggle.classList.add("is-running");
    timerAccept.disabled = false;
    timerReset.disabled = false;
    const tick = () => {
      const totalSeconds = Math.floor((timerElapsedMs + Date.now() - timerStart) / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const seconds = totalSeconds % 60;
      timerDisplay.textContent = `${toArabicDigits(hours)}:${toArabicDigits(minutes)}:${toArabicDigits(seconds)}`;
    };
    tick();
    timerInterval = setInterval(tick, 1000);
  }
  timerAccept.addEventListener("click", () => {
    const elapsedMs = stopTimer();
    if (!elapsedMs) return showMessage(message, "ابدأ المؤقت قبل اعتماد مدته.");
    const minutes = Math.max(1, Math.round(elapsedMs / 60000));
    durationInput.value = minutes;
    showMessage(message, `أُضيفت مدة المؤقت (${arabicNumber(minutes)} دقيقة) إلى حقل المدة. احفظ الجلسة لإضافتها إلى سجلك.`, true);
    subjectInput.focus();
  });
  timerReset.addEventListener("click", () => {
    if (!window.confirm("هل تريد تصفير المؤقت وإلغاء مدته؟")) return;
    stopTimer();
    showMessage(message, "تم تصفير المؤقت.", true);
  });
  // ===== مؤقت بومودورو =====
  function pomodoroModeMinutes(mode = pomodoroState.mode) {
    return (mode === "focus" ? pomodoroState.focusMinutes : pomodoroState.breakMinutes) * 60000;
  }

  function savePomodoroState() {
    try {
      localStorage.setItem(POMODORO_KEY, JSON.stringify({ ...pomodoroState }));
    } catch (error) {
      console.warn("تعذّر حفظ حالة مؤقت التركيز.", error);
    }
  }

  function setPomodoroHint(text, done = false) {
    if (!pomodoroHint) return;
    pomodoroHint.textContent = text;
    pomodoroHint.classList.toggle("is-done", done);
  }

  function defaultPomodoroHint() {
    return `ركّز ${arabicNumber(pomodoroState.focusMinutes)} دقيقة، ثم خذ راحة ${arabicNumber(pomodoroState.breakMinutes)} دقائق. يعمل المؤقت حتى لو غادرت الصفحة.`;
  }

  function renderPomodoro() {
    if (!pomodoroPanel) return;
    const total = Math.max(1000, pomodoroModeMinutes());
    const remaining = Math.max(0, pomodoroState.remainingMs);
    const totalSeconds = Math.ceil(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const label = `${toArabicDigits(minutes)}:${toArabicDigits(seconds)}`;
    pomodoroTime.textContent = label;
    pomodoroTime.setAttribute("aria-label", `الوقت المتبقي ${arabicNumber(minutes)} دقيقة و${arabicNumber(seconds)} ثانية`);
    const progress = Math.min(100, Math.max(0, ((total - remaining) / total) * 100));
    pomodoroRing.style.setProperty("--pomodoro-progress", `${progress.toFixed(2)}%`);
    pomodoroRing.classList.toggle("is-break", pomodoroState.mode === "break");
    pomodoroPanel.classList.toggle("is-running", pomodoroState.running);
    pomodoroModeLabel.textContent = pomodoroState.mode === "focus" ? "وقت التركيز" : "وقت الراحة";
    if (pomodoroState.running) pomodoroToggle.textContent = "إيقاف مؤقت";
    else if (remaining < total - 500) pomodoroToggle.textContent = "استئناف";
    else pomodoroToggle.textContent = pomodoroState.mode === "focus" ? "ابدأ التركيز" : "ابدأ الراحة";
    const count = pomodoroState.rounds;
    pomodoroRounds.textContent = count === 1 ? "جلسة واحدة مكتملة" : `${arabicNumber(count)} جلسات مكتملة`;
    pomodoroLog.classList.toggle("hidden", !pomodoroState.finishedFocus);
    pomodoroLog.textContent = `سجّل ${arabicNumber(pomodoroState.focusMinutes)} دقيقة`;
    if (pomodoroState.running) {
      document.title = `${label} · ${pomodoroState.mode === "focus" ? "تركيز" : "راحة"} — اجتماع النقط`;
    }
  }

  function stopPomodoroInterval() {
    if (pomodoroInterval) clearInterval(pomodoroInterval);
    pomodoroInterval = null;
  }

  function notifyPomodoro(title, body) {
    if (!pomodoroState.notify) return;
    try {
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      const options = { body, icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: "pomodoro" };
      navigator.serviceWorker?.getRegistration()
        .then((registration) => {
          if (registration?.showNotification) return registration.showNotification(title, options);
          new Notification(title, options);
          return undefined;
        })
        .catch(() => {
          try { new Notification(title, options); } catch (error) { console.warn(error); }
        });
    } catch (error) {
      console.warn("تعذّر إظهار إشعار المؤقت.", error);
    }
  }

  function playPomodoroChime() {
    if (!pomodoroState.notify) return;
    try {
      const ctx = ensurePomodoroAudio();
      if (!ctx) return;
      [0, 0.28, 0.56].forEach((offset, index) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = index === 2 ? 880 : 660;
        const at = ctx.currentTime + offset;
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(0.22, at + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.24);
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start(at);
        oscillator.stop(at + 0.26);
      });
    } catch (error) {
      console.warn("تعذّر تشغيل تنبيه المؤقت.", error);
    }
  }

  function requestPomodoroPermission() {
    try {
      if (!("Notification" in window)) return;
      if (Notification.permission === "default") Notification.requestPermission().catch(() => {});
    } catch (error) {
      console.warn("تعذّر طلب إذن الإشعارات.", error);
    }
  }

  function ensurePomodoroAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!pomodoroAudioCtx) pomodoroAudioCtx = new AudioCtx();
      if (pomodoroAudioCtx.state === "suspended") pomodoroAudioCtx.resume().catch(() => {});
      return pomodoroAudioCtx;
    } catch (error) {
      console.warn("تعذّر تهيئة صوت المؤقت.", error);
      return null;
    }
  }

  function completePomodoro() {
    stopPomodoroInterval();
    const finishedFocus = pomodoroState.mode === "focus";
    pomodoroState.running = false;
    pomodoroState.endAt = null;
    pomodoroState.remainingMs = 0;
    if (finishedFocus) {
      const today = dateKey();
      if (pomodoroState.roundDate !== today) {
        pomodoroState.roundDate = today;
        pomodoroState.rounds = 0;
      }
      pomodoroState.rounds += 1;
      pomodoroState.finishedFocus = true;
    }
    const nextMode = finishedFocus ? "break" : "focus";
    pomodoroState.mode = nextMode;
    pomodoroState.remainingMs = pomodoroModeMinutes(nextMode);
    savePomodoroState();
    renderPomodoro();
    if (finishedFocus) {
      setPomodoroHint(`انتهت جلسة التركيز! خذ راحة ${arabicNumber(pomodoroState.breakMinutes)} دقائق، ثم سجّل جلستك.`, true);
      notifyPomodoro("انتهى وقت التركيز ✦", `أنجزت ${arabicNumber(pomodoroState.focusMinutes)} دقيقة تركيز. حان وقت الراحة ${arabicNumber(pomodoroState.breakMinutes)} دقائق.`);
    } else {
      setPomodoroHint("انتهت الراحة. لنعد إلى التركيز.", true);
      notifyPomodoro("انتهت الراحة ✦", "حان وقت العودة إلى التركيز.");
    }
    playPomodoroChime();
    navigateToPage(currentPage, false);
  }

  function tickPomodoro() {
    if (!pomodoroState.running || !pomodoroState.endAt) return;
    const left = pomodoroState.endAt - Date.now();
    if (left <= 0) {
      completePomodoro();
      return;
    }
    pomodoroState.remainingMs = left;
    renderPomodoro();
  }

  function startPomodoroInterval() {
    stopPomodoroInterval();
    pomodoroInterval = setInterval(tickPomodoro, 1000);
    tickPomodoro();
  }

  function togglePomodoro() {
    if (!pomodoroPanel) return;
    if (pomodoroState.running) {
      pomodoroState.remainingMs = Math.max(0, (pomodoroState.endAt || Date.now()) - Date.now());
      pomodoroState.endAt = null;
      pomodoroState.running = false;
      stopPomodoroInterval();
      savePomodoroState();
      renderPomodoro();
      setPomodoroHint("أُوقف المؤقت مؤقتًا. اضغط «استئناف» لمتابعة العدّ.");
      navigateToPage(currentPage, false);
      return;
    }
    if (pomodoroState.remainingMs <= 500) pomodoroState.remainingMs = pomodoroModeMinutes();
    requestPomodoroPermission();
    ensurePomodoroAudio();
    pomodoroState.endAt = Date.now() + pomodoroState.remainingMs;
    pomodoroState.running = true;
    savePomodoroState();
    setPomodoroHint(defaultPomodoroHint());
    startPomodoroInterval();
    renderPomodoro();
  }

  function resetPomodoro() {
    stopPomodoroInterval();
    pomodoroState.running = false;
    pomodoroState.endAt = null;
    pomodoroState.mode = "focus";
    pomodoroState.finishedFocus = false;
    pomodoroState.remainingMs = pomodoroModeMinutes("focus");
    savePomodoroState();
    renderPomodoro();
    setPomodoroHint(defaultPomodoroHint());
    navigateToPage(currentPage, false);
  }

  function logPomodoroSession() {
    if (!pomodoroState.finishedFocus) return;
    if (durationInput) durationInput.value = pomodoroState.focusMinutes;
    if (studyDateInput) studyDateInput.value = dateKey();
    const subject = (pomodoroState.subject || "").trim();
    if (subject && subjectInput) subjectInput.value = subject;
    showMessage(message, `أُضيفت مدة التركيز (${arabicNumber(pomodoroState.focusMinutes)} دقيقة) إلى حقل المدة. احفظ الجلسة لإضافتها إلى سجلك.`, true);
    if (subjectInput) {
      subjectInput.focus({ preventScroll: true });
      form.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    pomodoroState.finishedFocus = false;
    savePomodoroState();
    renderPomodoro();
  }

  function restorePomodoro() {
    let restoreCompleted = false;
    try {
      const saved = JSON.parse(localStorage.getItem(POMODORO_KEY) || "null");
      if (!saved || typeof saved !== "object") return restoreCompleted;
      const focusOptions = [15, 25, 50];
      const breakOptions = [3, 5, 10];
      const focusMinutes = focusOptions.includes(Number(saved.focusMinutes)) ? Number(saved.focusMinutes) : 25;
      const breakMinutes = breakOptions.includes(Number(saved.breakMinutes)) ? Number(saved.breakMinutes) : 5;
      const maxMs = Math.max(focusMinutes, breakMinutes) * 60000;
      const remaining = Number(saved.remainingMs);
      pomodoroState = {
        mode: saved.mode === "break" ? "break" : "focus",
        focusMinutes,
        breakMinutes,
        rounds: Number.isInteger(saved.rounds) && saved.rounds >= 0 ? saved.rounds : 0,
        roundDate: typeof saved.roundDate === "string" ? saved.roundDate : dateKey(),
        remainingMs: Number.isFinite(remaining) ? Math.max(0, Math.min(remaining, maxMs)) : focusMinutes * 60000,
        endAt: Number(saved.endAt) || null,
        running: Boolean(saved.running) && Boolean(Number(saved.endAt)),
        finishedFocus: Boolean(saved.finishedFocus),
        subject: typeof saved.subject === "string" ? saved.subject.slice(0, 60) : "",
        notify: saved.notify !== false,
      };
      if (pomodoroState.running) {
        const left = pomodoroState.endAt - Date.now();
        if (left > 0) pomodoroState.remainingMs = left;
        else restoreCompleted = true;
      }
    } catch (error) {
      console.warn("تعذّر استعادة حالة مؤقت التركيز.", error);
    }
    return restoreCompleted;
  }

  function initPomodoro() {
    if (!pomodoroPanel) return;
    const restoreCompleted = restorePomodoro();
    if (pomodoroState.roundDate !== dateKey()) {
      pomodoroState.rounds = 0;
      pomodoroState.roundDate = dateKey();
    }
    if (pomodoroSubjectInput) pomodoroSubjectInput.value = pomodoroState.subject;
    if (pomodoroNotify) pomodoroNotify.checked = pomodoroState.notify;
    pomodoroPresets.forEach((preset) => {
      const active = Number(preset.dataset.focus) === pomodoroState.focusMinutes
        && Number(preset.dataset.break) === pomodoroState.breakMinutes;
      preset.classList.toggle("is-active", active);
      preset.setAttribute("aria-pressed", String(active));
    });
    pomodoroToggle.addEventListener("click", togglePomodoro);
    pomodoroReset.addEventListener("click", resetPomodoro);
    pomodoroLog.addEventListener("click", logPomodoroSession);
    pomodoroPresets.forEach((preset) => {
      preset.addEventListener("click", () => {
        const focusMinutes = Number(preset.dataset.focus);
        const breakMinutes = Number(preset.dataset.break);
        if (!focusMinutes || !breakMinutes) return;
        stopPomodoroInterval();
        pomodoroState.focusMinutes = focusMinutes;
        pomodoroState.breakMinutes = breakMinutes;
        pomodoroState.mode = "focus";
        pomodoroState.running = false;
        pomodoroState.endAt = null;
        pomodoroState.finishedFocus = false;
        pomodoroState.remainingMs = pomodoroModeMinutes("focus");
        pomodoroPresets.forEach((item) => {
          const active = item === preset;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        savePomodoroState();
        renderPomodoro();
        setPomodoroHint(defaultPomodoroHint());
        navigateToPage(currentPage, false);
      });
    });
    if (pomodoroSubjectInput) {
      pomodoroSubjectInput.addEventListener("input", () => {
        pomodoroState.subject = pomodoroSubjectInput.value.slice(0, 60);
      });
      pomodoroSubjectInput.addEventListener("change", savePomodoroState);
    }
    if (pomodoroNotify) {
      pomodoroNotify.addEventListener("change", () => {
        pomodoroState.notify = pomodoroNotify.checked;
        savePomodoroState();
        if (pomodoroState.notify) requestPomodoroPermission();
      });
    }
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && pomodoroState.running) tickPomodoro();
    });
    if (restoreCompleted) {
      pomodoroState.running = true;
      completePomodoro();
    }
    if (pomodoroState.running) {
      startPomodoroInterval();
      setPomodoroHint(defaultPomodoroHint());
    } else if (pomodoroState.finishedFocus) {
      setPomodoroHint(`انتهت جلسة التركيز! خذ راحة ${arabicNumber(pomodoroState.breakMinutes)} دقائق، ثم سجّل جلستك.`, true);
    } else {
      setPomodoroHint(defaultPomodoroHint());
    }
    renderPomodoro();
    savePomodoroState();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const subject = subjectInput.value.trim();
    const duration = Number(durationInput.value);
    const note = noteInput.value.trim();
    const studyDate = studyDateInput.value || dateKey();
    if (studyDate > dateKey()) return showMessage(message, "لا يمكن تسجيل جلسة في تاريخ مستقبلي.");
    if (!subject) return showMessage(message, "اكتب اسم المادة أولًا.");
    if (!Number.isInteger(duration) || duration < 1 || duration > 1440) return showMessage(message, "أدخل مدة صحيحة بين دقيقة و٢٤ ساعة.");
    if (demoMode) {
      const existing = editingId ? sessions.find((entry) => entry.id === editingId) : null;
      const entry = {
        id: existing ? existing.id : `demo-session-new-${++demoSeq}`,
        subject,
        duration,
        note,
        study_date: studyDate,
        created_at: existing ? existing.created_at : new Date().toISOString(),
      };
      if (existing) sessions = sessions.map((item) => (item.id === entry.id ? entry : item));
      else sessions.unshift(entry);
      sessions.sort((a, b) => (b.study_date === a.study_date
        ? new Date(b.created_at) - new Date(a.created_at)
        : b.study_date.localeCompare(a.study_date)));
      render();
      resetForm();
      showMessage(message, existing ? "تم حفظ التعديل في المعاينة." : "تمت إضافة الجلسة إلى المعاينة.", true);
      return;
    }
    if (!beginSubmit(form)) return;
    submitButton.disabled = true;
    showMessage(message, editingId ? "جارٍ حفظ التعديلات..." : "جارٍ حفظ الجلسة...");
    try {
      const payload = { subject, duration, note, study_date: studyDate };
      const request = editingId
        ? supabaseClient.from("study_sessions").update(payload).eq("id", editingId).eq("user_id", currentUser.id).select().single()
        : supabaseClient.from("study_sessions").insert({ ...payload, user_id: currentUser.id }).select().single();
      const { data, error } = await request;
      if (error) {
        if (isNetworkError(error)) {
          const base = { subject, duration, note, study_date: studyDate };
          if (editingId) queueOfflineOp({ type: "session.update", id: editingId, payload: base });
          else queueOfflineOp({ type: "session.save", payload: { ...base, created_at: new Date().toISOString() }, localId: tempId() });
          resetForm();
          showMessage(message, "أنت دون اتصال الآن — حُفظت الجلسة على جهازك وستُزامن تلقائيًا عند عودة الإنترنت.", true);
          return;
        }
        showMessage(message, `تعذّر حفظ الجلسة. ${friendlyDbError(error)}`);
        console.error(error);
        return;
      }
      const wasEditing = Boolean(editingId);
      if (wasEditing) sessions = sessions.map((session) => (session.id === editingId ? data : session));
      else sessions.unshift(data);
      sessions.sort((a, b) => (b.study_date === a.study_date ? new Date(b.created_at) - new Date(a.created_at) : b.study_date.localeCompare(a.study_date)));
      render();
      resetForm();
      showMessage(message, wasEditing ? "تم حفظ التعديلات في حسابك." : "تم حفظ الجلسة في حسابك.", true);
    } catch (error) {
      if (!demoMode && isNetworkError(error)) {
        const wasEditing = Boolean(editingId);
        const base = { subject, duration, note, study_date: studyDate };
        if (wasEditing) {
          queueOfflineOp({ type: "session.update", id: editingId, payload: base });
        } else {
          const localId = tempId();
          queueOfflineOp({ type: "session.save", payload: { ...base, created_at: new Date().toISOString() }, localId });
        }
        resetForm();
        showMessage(message, "أنت دون اتصال الآن — حُفظت الجلسة على جهازك وستُزامن تلقائيًا عند عودة الإنترنت.", true);
        return;
      }
      showMessage(message, "تعذّر الاتصال بالخادم. تحقق من الإنترنت وحاول مجددًا.");
      console.error(error);
    } finally {
      submitButton.disabled = false;
      endSubmit(form);
    }
  });

  sessionList.addEventListener("click", async (event) => {
    const item = event.target.closest(".session-item");
    if (!item) return;
    const id = item.dataset.id;
    if (event.target.closest(".edit-action")) {
      const session = sessions.find((entry) => entry.id === id);
      if (!session) return;
      editingId = id;
      studyDateInput.value = session.study_date;
      subjectInput.value = session.subject;
      durationInput.value = session.duration;
      noteInput.value = session.note || "";
      submitButton.innerHTML = 'حفظ التعديل <span aria-hidden="true">←</span>';
      cancelButton.classList.remove("hidden");
      document.querySelector("#form-heading").textContent = "تعديل جلسة الدراسة";
      showMessage(message, "عدّل الحقول ثم احفظ التغييرات.");
      subjectInput.focus();
    }
    if (event.target.closest(".delete-action")) {
      if (!window.confirm("هل تريد حذف هذه الجلسة؟")) return;
      if (demoMode) {
        sessions = sessions.filter((entry) => entry.id !== id);
        if (editingId === id) resetForm();
        render();
        showMessage(message, "تم حذف الجلسة من المعاينة.", true);
        return;
      }
      try {
        const { error } = await supabaseClient.from("study_sessions").delete().eq("id", id).eq("user_id", currentUser.id);
        if (error) throw error;
        sessions = sessions.filter((entry) => entry.id !== id);
        if (editingId === id) resetForm();
        render();
        showMessage(message, "تم حذف الجلسة من حسابك.", true);
      } catch (error) {
        if (isNetworkError(error)) {
          queueOfflineOp({ type: "session.delete", id });
          showMessage(message, "أنت دون اتصال — حُذفت الجلسة محليًا وسيُنفَّذ الحذف من حسابك عند عودة الإنترنت.", true);
          return;
        }
        showMessage(message, `تعذّر حذف الجلسة. ${friendlyDbError(error)}`);
        console.error(error);
      }
    }
  });

  // ===== المهام =====
  const TASK_FIELDS = "id, title, due_date, done, created_at";
  const TASK_FIELDS_EXTENDED = `${TASK_FIELDS}, priority, recurrence`;

  function normalizeTask(task) {
    return {
      ...task,
      priority: TASK_PRIORITY_WEIGHT[task.priority] !== undefined ? task.priority : "normal",
      recurrence: TASK_REPEAT_LABEL[task.recurrence] !== undefined ? task.recurrence : "none",
    };
  }

  function sortTasks() {
    tasks.sort((a, b) => {
      if (Boolean(a.done) !== Boolean(b.done)) return Number(Boolean(a.done)) - Number(Boolean(b.done));
      const weightDiff = (TASK_PRIORITY_WEIGHT[a.priority] ?? 1) - (TASK_PRIORITY_WEIGHT[b.priority] ?? 1);
      if (weightDiff !== 0) return weightDiff;
      const dueA = a.due_date || "9999-12-31";
      const dueB = b.due_date || "9999-12-31";
      if (dueA !== dueB) return dueA.localeCompare(dueB);
      return String(b.created_at || "").localeCompare(String(a.created_at || ""));
    });
  }

  function nextRecurringDate(dueDate, recurrence) {
    const base = new Date(`${dueDate || dateKey()}T00:00:00`);
    if (Number.isNaN(base.getTime())) return dateKey();
    if (recurrence === "daily") base.setDate(base.getDate() + 1);
    else if (recurrence === "weekly") base.setDate(base.getDate() + 7);
    else if (recurrence === "monthly") {
      const day = base.getDate();
      base.setDate(1);
      base.setMonth(base.getMonth() + 1);
      const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
      base.setDate(Math.min(day, daysInMonth));
    }
    return dateKey(base);
  }

  // المهمة المتكررة لا تُغلق أبدًا: تتقدم لموعدها التالي بدل أن تختفي في المنجزات.
  function rollRecurringTask(task) {
    const today = dateKey();
    let next = nextRecurringDate(task.due_date, task.recurrence);
    let guard = 0;
    while (next <= today && guard < 400) {
      next = nextRecurringDate(next, task.recurrence);
      guard += 1;
    }
    return next;
  }

  async function loadTasks() {
    if (demoMode) return;
    const query = (fields) => supabaseClient
      .from("tasks")
      .select(fields)
      .eq("user_id", currentUser.id)
      .order("done", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    let { data, error } = await query(TASK_FIELDS_EXTENDED);
    if (error) {
      // قاعدة بيانات بلا أعمدة الأولوية والتكرار: نكمل بالوضع الأساسي بدل تعطّل الصفحة.
      if (error.code !== "42703") console.warn(error);
      tasksHaveExtras = false;
      ({ data, error } = await query(TASK_FIELDS));
    } else {
      tasksHaveExtras = true;
    }
    if (error) {
      console.error(error);
      const cached = readCache(CACHE_KEYS.tasks);
      if (isNetworkError(error) && cached) {
        tasks = cached.map(normalizeTask);
        sortTasks();
        renderTasks();
        showMessage(taskMessage, "أنت دون اتصال — تُعرض نسختك المحلية الأخيرة من المهام.");
        return;
      }
      showMessage(taskMessage, `تعذّر تحميل المهام. ${friendlyDbError(error)}`);
      return;
    }
    tasks = (data || []).map(normalizeTask);
    sortTasks();
    renderTasks();
    cacheAll();
    if (!tasksHaveExtras) {
      showMessage(taskMessage, "لتفعيل الأولويات والتكرار: نفّذ تحديث الأعمدة في setup_supabase.sql.");
    }
  }

  function renderTasks() {
    const today = dateKey();
    const openCount = tasks.filter((task) => !task.done).length;
    taskBadge.textContent = `${arabicNumber(openCount)} من ${arabicNumber(tasks.length)}`;
    taskList.innerHTML = tasks.map((task) => {
      const priority = task.priority || "normal";
      const repeatLabel = TASK_REPEAT_LABEL[task.recurrence] || "";
      const tags = [];
      if (priority === "high") tags.push('<span class="task-tag is-high"><span aria-hidden="true">⚡</span> عالية</span>');
      if (priority === "low") tags.push('<span class="task-tag is-low">منخفضة</span>');
      if (repeatLabel && !task.done) tags.push(`<span class="task-tag is-repeat"><span aria-hidden="true">🔁</span> ${escapeHtml(repeatLabel)}</span>`);
      let dueHtml = "";
      if (task.due_date) {
        let cls = "";
        let text = `مستحقة · ${dateShort(task.due_date)}`;
        if (!task.done) {
          if (task.due_date < today) { cls = " is-overdue"; text = `متأخرة · ${dateShort(task.due_date)}`; }
          else if (task.due_date === today) { cls = " is-today"; text = "مستحقة اليوم"; }
        }
        dueHtml = `<span class="task-due${cls}">${escapeHtml(text)}</span>`;
      }
      if (task.done) tags.push('<span class="task-tag is-finished">منجزة</span>');
      const meta = (tags.length || dueHtml) ? `<div class="task-meta">${tags.join("")}${dueHtml}</div>` : "";
      const doneLabel = task.done ? "إرجاع المهمة إلى قيد العمل" : repeatLabel ? "إنجاز هذه المرة" : "إنجاز المهمة";
      return `<li class="task-item priority-${escapeHtml(priority)}${task.done ? " done" : ""}" data-id="${escapeHtml(task.id)}">
        <button class="task-check" type="button" aria-label="${doneLabel}" aria-pressed="${task.done}">✓</button>
        <div class="task-body"><p class="task-title">${escapeHtml(task.title)}</p>${meta}</div>
        <button class="text-action delete task-delete" type="button">حذف</button>
      </li>`;
    }).join("");
    taskEmpty.classList.toggle("hidden", tasks.length > 0);
  }

  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = taskTitleInput.value.trim();
    const priority = TASK_PRIORITY_WEIGHT[taskPriorityInput.value] !== undefined ? taskPriorityInput.value : "normal";
    const recurrence = TASK_REPEAT_LABEL[taskRepeatInput.value] !== undefined ? taskRepeatInput.value : "none";
    let due = taskDueInput.value || null;
    if (!title) return showMessage(taskMessage, "اكتب عنوان المهمة أولًا.");
    if (!due && recurrence !== "none") due = dateKey();
    if (demoMode) {
      const entry = normalizeTask({
        id: `demo-task-new-${++demoSeq}`,
        title,
        due_date: due,
        done: false,
        priority,
        recurrence,
        created_at: new Date().toISOString(),
      });
      tasks.unshift(entry);
      sortTasks();
      renderTasks();
      renderCalendar();
      taskForm.reset();
      taskPriorityInput.value = "normal";
      taskRepeatInput.value = "none";
      showMessage(taskMessage, recurrence !== "none"
        ? `أُضيفت المهمة إلى المعاينة، وستتكرر ${TASK_REPEAT_LABEL[recurrence]}.`
        : "تمت إضافة المهمة إلى المعاينة.", true);
      return;
    }
    if (!beginSubmit(taskForm)) return;
    const extrasSaved = tasksHaveExtras;
    const payload = { user_id: currentUser.id, title, due_date: due };
    if (extrasSaved) {
      payload.priority = priority;
      payload.recurrence = recurrence;
    }
    try {
      const { data, error } = await supabaseClient
        .from("tasks")
        .insert(payload)
        .select()
        .single();
      if (error) {
        if (isNetworkError(error)) {
          const localId = tempId();
          queueOfflineOp({ type: "task.save", payload, localId, extras: extrasSaved });
          taskForm.reset();
          taskPriorityInput.value = "normal";
          taskRepeatInput.value = "none";
          showMessage(taskMessage, "أنت دون اتصال — حُفظت المهمة على جهازك وستُزامن تلقائيًا.", true);
          return;
        }
        showMessage(taskMessage, `تعذّر إضافة المهمة. ${friendlyDbError(error)}`);
        console.error(error);
        return;
      }
      tasks.unshift(normalizeTask(data));
      sortTasks();
      renderTasks();
      renderCalendar();
      taskForm.reset();
      taskPriorityInput.value = "normal";
      taskRepeatInput.value = "none";
      if (!extrasSaved) {
        showMessage(taskMessage, "أُضيفت المهمة (بالوضع الأساسي). الأولويات والتكرار يحتاجان تحديث قاعدة البيانات.", true);
      } else if (recurrence !== "none") {
        showMessage(taskMessage, `أُضيفت المهمة، وستتكرر ${TASK_REPEAT_LABEL[recurrence]}.`, true);
      } else {
        showMessage(taskMessage, "تمت إضافة المهمة إلى قائمتك.", true);
      }
    } catch (error) {
      if (isNetworkError(error)) {
        const localId = tempId();
        const payload = { title, due_date: due };
        if (extrasSaved) { payload.priority = priority; payload.recurrence = recurrence; }
        queueOfflineOp({ type: "task.save", payload, localId, extras: extrasSaved });
        taskForm.reset();
        taskPriorityInput.value = "normal";
        taskRepeatInput.value = "none";
        showMessage(taskMessage, "أنت دون اتصال — حُفظت المهمة على جهازك وستُزامن تلقائيًا.", true);
        return;
      }
      showMessage(taskMessage, "تعذّر الاتصال بالخادم. تحقق من الإنترنت وحاول مجددًا.");
      console.error(error);
    } finally {
      endSubmit(taskForm);
    }
  });

  taskList.addEventListener("click", async (event) => {
    const item = event.target.closest(".task-item");
    if (!item) return;
    const id = item.dataset.id;
    const task = tasks.find((entry) => entry.id === id);
    if (!task) return;
    if (demoMode) {
      if (event.target.closest(".task-check")) {
        const repeatLabel = TASK_REPEAT_LABEL[task.recurrence] || "";
        if (repeatLabel && !task.done) {
          const nextDue = rollRecurringTask(task);
          task.due_date = nextDue;
          task.done = false;
          sortTasks();
          renderTasks();
          renderCalendar();
          showMessage(taskMessage, `أُنجزت هذه المرة ✦ التكرار القادم: ${dateShort(nextDue)}.`, true);
          return;
        }
        task.done = !task.done;
        sortTasks();
        renderTasks();
        renderCalendar();
        showMessage(taskMessage, task.done ? "أحسنت! أنجزت مهمة جديدة ✦" : "أُعيدت المهمة إلى قيد العمل.", true);
        return;
      }
      if (event.target.closest(".task-delete")) {
        if (!window.confirm("هل تريد حذف هذه المهمة؟")) return;
        tasks = tasks.filter((entry) => entry.id !== id);
        renderTasks();
        renderCalendar();
        showMessage(taskMessage, "تم حذف المهمة من المعاينة.", true);
      }
      return;
    }
    if (event.target.closest(".task-check")) {
      const repeatLabel = TASK_REPEAT_LABEL[task.recurrence] || "";
      if (tasksHaveExtras && repeatLabel && !task.done) {
        const nextDue = rollRecurringTask(task);
        try {
          const { data, error } = await supabaseClient
            .from("tasks")
            .update({ due_date: nextDue, done: false })
            .eq("id", id)
            .eq("user_id", currentUser.id)
            .select()
            .single();
          if (error) throw error;
          tasks = tasks.map((entry) => (entry.id === id ? normalizeTask(data) : entry));
        } catch (error) {
          if (isNetworkError(error)) {
            queueOfflineOp({ type: "task.update", id, patch: { due_date: nextDue, done: false } });
            showMessage(taskMessage, `أنت دون اتصال — سُجّل الإنجاز والتكرار القادم ${dateShort(nextDue)} محليًا وستُزامن تلقائيًا.`, true);
            return;
          }
          showMessage(taskMessage, `تعذّر تحديث المهمة. ${friendlyDbError(error)}`);
          console.error(error);
          return;
        }
        sortTasks();
        renderTasks();
        renderCalendar();
        showMessage(taskMessage, `أُنجزت هذه المرة ✦ التكرار القادم: ${dateShort(nextDue)}.`, true);
        return;
      }
      try {
        const { data, error } = await supabaseClient
          .from("tasks")
          .update({ done: !task.done })
          .eq("id", id)
          .eq("user_id", currentUser.id)
          .select()
          .single();
        if (error) throw error;
        tasks = tasks.map((entry) => (entry.id === id ? normalizeTask(data) : entry));
      } catch (error) {
        if (isNetworkError(error)) {
          queueOfflineOp({ type: "task.update", id, patch: { done: !task.done } });
          showMessage(taskMessage, "أنت دون اتصال — سُجّل الإنجاز محليًا وستُزامن تلقائيًا.", true);
          return;
        }
        showMessage(taskMessage, `تعذّر تحديث المهمة. ${friendlyDbError(error)}`);
        console.error(error);
        return;
      }
      sortTasks();
      renderTasks();
      renderCalendar();
      showMessage(taskMessage, data.done ? "أحسنت! أنجزت مهمة جديدة ✦" : "أُعيدت المهمة إلى قيد العمل.", true);
    }
    if (event.target.closest(".task-delete")) {
      if (!window.confirm("هل تريد حذف هذه المهمة؟")) return;
      try {
        const { error } = await supabaseClient.from("tasks").delete().eq("id", id).eq("user_id", currentUser.id);
        if (error) throw error;
      } catch (error) {
        if (isNetworkError(error)) {
          queueOfflineOp({ type: "task.delete", id });
          showMessage(taskMessage, "أنت دون اتصال — حُذفت المهمة محليًا وستُزامن تلقائيًا.", true);
          return;
        }
        showMessage(taskMessage, `تعذّر حذف المهمة. ${friendlyDbError(error)}`);
        console.error(error);
        return;
      }
      tasks = tasks.filter((entry) => entry.id !== id);
      renderTasks();
      renderCalendar();
      showMessage(taskMessage, "تم حذف المهمة.", true);
    }
  });
  // ===== التخطيط الأسبوعي =====
  async function loadPlan() {
    if (demoMode) return;
    const { data, error } = await supabaseClient
      .from("plan_items")
      .select("id, title, weekday, start_time, created_at")
      .eq("user_id", currentUser.id)
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true, nullsFirst: false });
    if (error) {
      console.error(error);
      const cached = isNetworkError(error) ? readCache(CACHE_KEYS.plan) : readCache(CACHE_KEYS.plan);
      if (isNetworkError(error) && cached) {
        planItems = cached;
        showMessage(planMessage, "أنت دون اتصال — تُعرض نسختك المحلية الأخيرة من الخطة.");
        renderPlan();
        renderCalendar();
        return;
      }
      showMessage(planMessage, `تعذّر تحميل الخطة. ${friendlyDbError(error)}`);
      return;
    }
    planItems = data || [];
    renderPlan();
    renderCalendar();
    cacheAll();
  }

  function renderPlan() {
    const todayWeekday = new Date().getDay();
    weekPlan.innerHTML = WEEK_ORDER.map((weekday) => {
      const items = planItems.filter((item) => item.weekday === weekday);
      const body = items.length
        ? items.map((item) => `<li class="plan-item" data-id="${escapeHtml(item.id)}">
            ${item.start_time ? `<span class="plan-time">${escapeHtml(timeLabel(item.start_time))}</span>` : ""}
            <span class="plan-title">${escapeHtml(item.title)}</span>
            <button class="plan-remove" type="button" aria-label="حذف البند">×</button>
          </li>`).join("")
        : '<li class="week-empty">لا بنود</li>';
      return `<div class="week-day${weekday === todayWeekday ? " is-today" : ""}" data-weekday="${weekday}">
        <div class="week-day-head"><span class="week-day-name">${WEEK_NAMES[weekday]}</span><button class="week-add" type="button" aria-label="إضافة بند إلى ${WEEK_NAMES[weekday]}">＋</button></div>
        <ul class="week-items">${body}</ul>
      </div>`;
    }).join("");
  }

  planForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = planTitleInput.value.trim();
    const weekday = Number(planDayInput.value);
    const startTime = planTimeInput.value || null;
    if (!title) return showMessage(planMessage, "اكتب عنوان البند أولًا.");
    if (demoMode) {
      planItems.push({
        id: `demo-plan-new-${++demoSeq}`,
        title,
        weekday,
        start_time: startTime,
        created_at: new Date().toISOString(),
      });
      planItems.sort((a, b) => (a.weekday === b.weekday
        ? String(a.start_time || "99").localeCompare(String(b.start_time || "99"))
        : a.weekday - b.weekday));
      renderPlan();
      renderCalendar();
      planForm.reset();
      showMessage(planMessage, `تمت إضافة البند إلى ${WEEK_NAMES[weekday]} في المعاينة.`, true);
      return;
    }
    if (!beginSubmit(planForm)) return;
    try {
      const { data, error } = await supabaseClient
        .from("plan_items")
        .insert({ user_id: currentUser.id, title, weekday, start_time: startTime })
        .select()
        .single();
      if (error) {
        if (isNetworkError(error)) {
          queueOfflineOp({ type: "plan.save", payload: { title, weekday, start_time: startTime }, localId: tempId() });
          planForm.reset();
          showMessage(planMessage, `أنت دون اتصال — أُضيف البند إلى ${WEEK_NAMES[weekday]} محليًا وستُزامن تلقائيًا.`, true);
          return;
        }
        showMessage(planMessage, `تعذّر إضافة البند. ${friendlyDbError(error)}`);
        console.error(error);
        return;
      }
      planItems.push(data);
      planItems.sort((a, b) => (a.weekday === b.weekday ? String(a.start_time || "99").localeCompare(String(b.start_time || "99")) : a.weekday - b.weekday));
      renderPlan();
      planForm.reset();
      showMessage(planMessage, `تمت إضافة البند إلى ${WEEK_NAMES[weekday]}.`, true);
    } catch (error) {
      if (!demoMode && isNetworkError(error)) {
        const localId = tempId();
        queueOfflineOp({ type: "plan.save", payload: { title, weekday, start_time: startTime }, localId });
        planForm.reset();
        showMessage(planMessage, `أنت دون اتصال — أُضيف البند إلى ${WEEK_NAMES[weekday]} محليًا وستُزامن تلقائيًا.`, true);
        return;
      }
      showMessage(planMessage, "تعذّر الاتصال بالخادم. تحقق من الإنترنت وحاول مجددًا.");
      console.error(error);
    } finally {
      endSubmit(planForm);
    }
  });

  weekPlan.addEventListener("click", async (event) => {
    const add = event.target.closest(".week-add");
    if (add) {
      planDayInput.value = add.closest(".week-day").dataset.weekday;
      planTitleInput.focus();
      return;
    }
    const remove = event.target.closest(".plan-remove");
    if (!remove) return;
    const item = remove.closest(".plan-item");
    if (demoMode) {
      planItems = planItems.filter((entry) => entry.id !== item.dataset.id);
      renderPlan();
      renderCalendar();
      showMessage(planMessage, "تم حذف البند من خطة المعاينة.", true);
      return;
    }
    try {
      const { error } = await supabaseClient.from("plan_items").delete().eq("id", item.dataset.id).eq("user_id", currentUser.id);
      if (error) throw error;
      planItems = planItems.filter((entry) => entry.id !== item.dataset.id);
      renderPlan();
      showMessage(planMessage, "تم حذف البند من خطتك.", true);
    } catch (error) {
      if (isNetworkError(error)) {
        queueOfflineOp({ type: "plan.delete", id: item.dataset.id });
        showMessage(planMessage, "أنت دون اتصال — حُذف البند محليًا وستُزامن تلقائيًا.", true);
        return;
      }
      showMessage(planMessage, `تعذّر تحديث البند. ${friendlyDbError(error)}`);
      console.error(error);
    }
  });

  // ===== التقويم الشهري =====
  function minutesForDate(key) {
    return sessions.filter((session) => session.study_date === key).reduce((sum, session) => sum + session.duration, 0);
  }

  function renderCalendar() {
    const year = calCursor.getFullYear();
    const month = calCursor.getMonth();
    calLabel.textContent = new Intl.DateTimeFormat("ar-SA", { month: "long", year: "numeric" }).format(calCursor);
    const first = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = dateKey();
    const dayNames = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
    let html = dayNames.map((name) => `<div class="cal-head">${name}</div>`).join("");
    for (let i = 0; i < first.getDay(); i++) html += '<div class="cal-cell pad"></div>';
    for (let day = 1; day <= daysInMonth; day++) {
      const key = dateKey(new Date(year, month, day));
      const minutes = minutesForDate(key);
      const hasTask = tasks.some((task) => task.due_date === key);
      const heat = minutes === 0 ? "" : minutes < 30 ? " heat-1" : minutes < 90 ? " heat-2" : " heat-3";
      html += `<div class="cal-cell${heat}${key === today ? " is-today" : ""}" title="${minutes ? `${arabicNumber(minutes)} دقيقة دراسة` : ""}">
        <span class="cal-daynum">${arabicNumber(day)}</span>
        <span class="cal-mins">${minutes ? `${arabicNumber(minutes)} د` : ""}</span>
        ${hasTask ? '<span class="cal-task-dot" aria-label="يوم فيه مهام"></span>' : ""}
      </div>`;
    }
    calendarElement.innerHTML = html;
  }

  calPrev.addEventListener("click", () => {
    calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth() - 1, 1);
    renderCalendar();
  });
  calNext.addEventListener("click", () => {
    calCursor = new Date(calCursor.getFullYear(), calCursor.getMonth() + 1, 1);
    renderCalendar();
  });
  // ===== التنقل بين صفحات التطبيق =====
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => navigateToPage(button.dataset.page));
  });
  window.addEventListener("popstate", () => navigateToPage(window.location.hash.slice(1), false));
  window.addEventListener("hashchange", () => navigateToPage(window.location.hash.slice(1), false));

  document.querySelectorAll(".view-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      currentView = tab.dataset.view;
      document.querySelectorAll(".view-tab").forEach((other) => {
        const active = other === tab;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-selected", String(active));
      });
      renderList();
    });
  });
  sessionSearch.addEventListener("input", renderList);

  cancelButton.addEventListener("click", () => { resetForm(); showMessage(message, ""); });
  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.getAttribute("aria-controls"));
      const visible = input.type === "password";
      input.type = visible ? "text" : "password";
      button.textContent = visible ? "إخفاء" : "إظهار";
      button.setAttribute("aria-pressed", String(visible));
      button.setAttribute("aria-label", `${visible ? "إخفاء" : "إظهار"} كلمة المرور`);
    });
  });
  document.querySelector("#auth-switch").addEventListener("click", () => setAuthMode(!isSignUp));
  fontSelect.addEventListener("change", () => {
    appearance.font = fontSelect.value;
    saveAppearance();
  });
  themeSwitch.addEventListener("change", () => {
    appearance.theme = themeSwitch.checked ? "night" : "day";
    saveAppearance();
  });
  document.querySelector("#font-decrease").addEventListener("click", () => {
    const index = FONT_SCALES.indexOf(appearance.fontScale);
    if (index > 0) {
      appearance.fontScale = FONT_SCALES[index - 1];
      saveAppearance();
    }
  });
  document.querySelector("#font-increase").addEventListener("click", () => {
    const index = FONT_SCALES.indexOf(appearance.fontScale);
    if (index < FONT_SCALES.length - 1) {
      appearance.fontScale = FONT_SCALES[index + 1];
      saveAppearance();
    }
  });
  loadAppearance();
  applyAppearance();
  initPomodoro();
  document.querySelector("#auth-forgot").addEventListener("click", handleForgotPassword);
  authForm.addEventListener("submit", handleAuth);
  recoveryForm.addEventListener("submit", handleRecovery);

  // زر البدء السريع: ينقل لتسجيل الجلسة ويركّز على حقل المادة
  if (quickStartButton) {
    quickStartButton.addEventListener("click", () => {
      navigateToPage("sessions");
      window.setTimeout(() => {
        if (!subjectInput) return;
        subjectInput.focus({ preventScroll: true });
        subjectInput.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    });
  }
  if (goalSaveButton) goalSaveButton.addEventListener("click", saveGoal);
  timerToggle.addEventListener("click", toggleTimer);
  exportAccountDataButton.addEventListener("click", exportAccountData);
  if (importAccountDataButton && importFileInput) {
    importAccountDataButton.addEventListener("click", () => importFileInput.click());
    importFileInput.addEventListener("change", () => {
      const file = importFileInput.files?.[0];
      if (file) importAccountData(file);
      importFileInput.value = "";
    });
  }
  syncNotifyUi();
  document.querySelector("#export-csv").addEventListener("click", exportCsv);

  // التبديل السريع بين الوضع النهاري والليلي من الشريط العلوي
  themeToggle.addEventListener("click", () => {
    appearance.theme = appearance.theme === "night" ? "day" : "night";
    themeSwitch.checked = appearance.theme === "night";
    saveAppearance();
  });

  // فتح وإغلاق نافذة بيان الخصوصية
  privacyOpenBtn.addEventListener("click", () => {
    privacyModal.classList.remove("hidden");
    privacyClose.focus();
  });
  privacyOpenFooter.addEventListener("click", () => {
    privacyModal.classList.remove("hidden");
    privacyClose.focus();
  });
  privacyOpenFromForm.addEventListener("click", () => {
    privacyModal.classList.remove("hidden");
    privacyClose.focus();
  });
  privacyClose.addEventListener("click", () => {
    privacyModal.classList.add("hidden");
  });
  privacyModal.addEventListener("click", (event) => {
    if (event.target === privacyModal) privacyModal.classList.add("hidden");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !privacyModal.classList.contains("hidden")) privacyModal.classList.add("hidden");
  });

  // ===== شاشة الترحيب (Onboarding) =====
  function showOnboardingPage(index) {
    onboardingIndex = Math.max(0, Math.min(index, onboardingPages.length - 1));
    onboardingPages.forEach((page, i) => {
      page.classList.toggle("active", i === onboardingIndex);
    });
    onboardingSteps.forEach((step, i) => {
      step.classList.toggle("active", i === onboardingIndex);
    });
    onboardingPrev.classList.toggle("hidden", onboardingIndex === 0);
    const isLast = onboardingIndex === onboardingPages.length - 1;
    onboardingNext.innerHTML = isLast
      ? 'ابدأ الاستخدام <span aria-hidden="true">→</span>'
      : 'التالي <span aria-hidden="true">→</span>';
    onboardingSkip.classList.toggle("hidden", isLast);
  }

  function finishOnboarding() {
    try {
      localStorage.setItem("study-tracker-onboarded", "true");
    } catch (error) {
      console.warn("تعذر حفظ حالة الترحيب.", error);
    }
    onboardingModal.classList.add("hidden");
  }

  onboardingClose.addEventListener("click", finishOnboarding);
  onboardingSkip.addEventListener("click", finishOnboarding);
  onboardingNext.addEventListener("click", () => {
    if (onboardingIndex === onboardingPages.length - 1) {
      finishOnboarding();
    } else {
      showOnboardingPage(onboardingIndex + 1);
    }
  });
  onboardingPrev.addEventListener("click", () => {
    showOnboardingPage(onboardingIndex - 1);
  });
  onboardingModal.addEventListener("click", (event) => {
    if (event.target === onboardingModal) finishOnboarding();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !onboardingModal.classList.contains("hidden")) finishOnboarding();
  });

  // ===== تنبيهات المهام ومواقيت الخطة (اختيارية) =====
  const NOTIFY_PREF_KEY = "study-tracker-notify";
  function notifyPrefsEnabled() {
    try { return localStorage.getItem(NOTIFY_PREF_KEY) === "on"; } catch { return false; }
  }
  function setNotifyPref(on) {
    try {
      if (on) localStorage.setItem(NOTIFY_PREF_KEY, "on");
      else localStorage.removeItem(NOTIFY_PREF_KEY);
    } catch { /* ignore */ }
    syncNotifyUi();
  }
  function showAppNotification(title, body, tag) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const options = { body, icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: tag || `iitimaal-${Date.now()}` };
    if (navigator.serviceWorker?.getRegistration) {
      navigator.serviceWorker.getRegistration()
        .then((registration) => {
          if (registration?.showNotification) return registration.showNotification(title, options);
          try { new Notification(title, options); } catch (error) { console.warn(error); }
          return undefined;
        })
        .catch(() => {
          try { new Notification(title, options); } catch (error) { console.warn(error); }
        });
    } else {
      try { new Notification(title, options); } catch (error) { console.warn(error); }
    }
  }
  function syncNotifyUi() {
    if (!notifyToggle) return;
    const supported = "Notification" in window;
    if (!supported) {
      notifyToggle.disabled = true;
      if (notifyStatus) notifyStatus.textContent = "متصفحك لا يدعم تنبيهات الويب إن كان قديمًا جدًا — التطبيق يعمل دونها.";
      return;
    }
    const permission = Notification.permission;
    const enabled = notifyPrefsEnabled() && permission === "granted";
    notifyToggle.disabled = permission === "denied";
    if (!notifyToggle.disabled && !enabled) notifyToggle.disabled = false;
    notifyToggle.checked = enabled;
    if (notifyStatus) {
      if (permission === "denied") notifyStatus.textContent = "خيار التنبيه محظور من إعدادات المتصفح لهذا الموقع.";
      else if (enabled) notifyStatus.textContent = "التنبيهات مفعّلة: مهام اليوم وأوقات خطتك ✦";
      else if (permission === "granted") notifyStatus.textContent = "الإذن ممنوح — فعّل زر التنبيهات للتذكير.";
      else notifyStatus.textContent = "سيطلب المتصفح إذنك عند التفعيل.";
    }
  }
  if (notifyToggle) {
    notifyToggle.addEventListener("change", async () => {
      if (!("Notification" in window)) { notifyToggle.checked = false; return syncNotifyUi(); }
      const permission = Notification.permission;
      if (permission === "denied") { notifyToggle.checked = false; return syncNotifyUi(); }
      if (!notifyToggle.checked) {
        setNotifyPref(false);
        return;
      }
      try {
        const result = permission === "granted" ? "granted" : await Notification.requestPermission();
        if (result === "granted") {
          setNotifyPref(true);
          showAppNotification("اجتماع النقط", "تم تفعيل التنبيهات — سنذكّرك بمهامك وأوقات خطتك ✦", "iitimaal-welcome");
        } else {
          notifyToggle.checked = false;
          syncNotifyUi();
        }
      } catch (error) {
        console.warn("تعذر طلب إذن التنبيهات.", error);
        syncNotifyUi();
      }
    });
  }
  function checkReminders() {
    if (!notifyPrefsEnabled() || !("Notification" in window) || Notification.permission !== "granted") return;
    if (!currentUser || demoMode) return;
    const now = new Date();
    const today = dateKey(now);
    // ملخص مهام اليوم: مرة واحدة يوميًا بعد الفجر.
    if (now.getHours() >= 5) {
      let digestKey = null;
      try { digestKey = localStorage.getItem("study-tracker-notify-digest"); } catch { /* ignore */ }
      if (digestKey !== today) {
        const dueToday = tasks.filter((task) => !task.done && task.due_date === today).length;
        const overdue = tasks.filter((task) => !task.done && task.due_date && task.due_date < today).length;
        const planToday = planItems.filter((item) => item.weekday === now.getDay());
        const parts = [];
        if (dueToday) parts.push(`${arabicNumber(dueToday)} ${dueToday === 1 ? "مهمة مستحقة اليوم" : "مهام مستحقة اليوم"}`);
        if (overdue) parts.push(`${arabicNumber(overdue)} ${overdue === 1 ? "مهمة متأخرة" : "مهام متأخرة"}`);
        if (planToday.length) parts.push(`${arabicNumber(planToday.length)} ${planToday.length === 1 ? "بند خطة لهذا اليوم" : "بنود خطة لهذا اليوم"}`);
        showAppNotification("مهام اليوم في اجتماع النقط", parts.length ? parts.join(" · ") : "لا مهام اليوم — إجازة محققة أو بداية جديدة ✦", "iitimaal-digest");
        try { localStorage.setItem("study-tracker-notify-digest", today); } catch { /* ignore */ }
      }
    }
    // مواقيت الخطة: تنبيه خلال ١٥ دقيقة من وقت البند.
    planItems.filter((item) => item.weekday === now.getDay() && item.start_time).forEach((item) => {
      const fireKey = `study-tracker-notify-plan-${today}-${item.id}`;
      let fired = false;
      try { fired = localStorage.getItem(fireKey) === "1"; } catch { /* ignore */ }
      if (fired) return;
      const [hours, minutes] = String(item.start_time).split(":").map(Number);
      const due = new Date(now);
      due.setHours(hours, minutes, 0, 0);
      const diffMinutes = (now - due) / 60000;
      if (diffMinutes >= 0 && diffMinutes <= 15) {
        showAppNotification("وقت بند الخطة ⏰", `${item.title} — ${WEEK_NAMES[item.weekday]} ${item.start_time}`, "iitimaal-plan");
        try { localStorage.setItem(fireKey, "1"); } catch { /* ignore */ }
      }
    });
  }
  setInterval(checkReminders, 60_000);

  // ===== تقرير الأسبوع: توليد صورة للمشاركة =====
  function computeStreak(allSessions) {
    const studiedDays = new Set(allSessions.map((session) => session.study_date));
    let cursor = new Date();
    if (!studiedDays.has(dateKey(cursor))) cursor = addDays(cursor, -1);
    let streak = 0;
    while (studiedDays.has(dateKey(cursor))) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }
  async function generateWeeklyReport() {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const day = addDays(today, -i);
      days.push({ key: dateKey(day), label: weekdayShort(day), minutes: minutesForDate(dateKey(day)), isToday: i === 0 });
    }
    const totalMinutes = days.reduce((sum, day) => sum + day.minutes, 0);
    const weekKeys = new Set(days.map((day) => day.key));
    const weekSessions = sessions.filter((session) => weekKeys.has(session.study_date));
    const subjectTotals = new Map();
    weekSessions.forEach((session) => subjectTotals.set(session.subject, (subjectTotals.get(session.subject) || 0) + Number(session.duration || 0)));
    const topSubject = [...subjectTotals.entries()].sort((a, b) => b[1] - a[1])[0];
    const streak = computeStreak(sessions);
    showMessage(cloudMessage, "جارٍ رسم صورة ملخص الأسبوع...");

    const width = 1080;
    const height = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if ("direction" in ctx) ctx.direction = "rtl";
    try {
      await Promise.all([
        document.fonts?.load("700 64px 'Aref Ruqaa'"),
        document.fonts?.load("700 52px 'IBM Plex Sans Arabic'"),
        document.fonts?.load("400 34px 'IBM Plex Sans Arabic'"),
      ]);
    } catch { /* الخطوط الاحتياطية تكفي */ }

    const background = ctx.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, "#0b534a");
    background.addColorStop(0.55, "#0e5c54");
    background.addColorStop(1, "#083c36");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(185, 138, 47, 0.55)";
    ctx.lineWidth = 3;
    ctx.strokeRect(38, 38, width - 76, height - 76);
    ctx.fillStyle = "rgba(185, 138, 47, 0.14)";
    ctx.fillRect(38, 38, width - 76, height - 76);

    ctx.textAlign = "center";
    ctx.fillStyle = "#e8c469";
    ctx.font = "700 92px 'Aref Ruqaa', 'IBM Plex Sans Arabic', serif";
    ctx.fillText("اجتماع النقط", width / 2, 178);
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "400 38px 'IBM Plex Sans Arabic', sans-serif";
    ctx.fillText(`ملخص أسبوعي للانضباط الدراسي · ${dateShort(days[0].key)} — ${dateShort(days[6].key)}`, width / 2, 246);

    const cards = [
      { label: "دقائق الدراسة", value: arabicNumber(totalMinutes) },
      { label: "جلسات الأسبوع", value: arabicNumber(weekSessions.length) },
      { label: "أيام متتابعة", value: arabicNumber(streak) },
      { label: "أكثر مادة", value: topSubject ? topSubject[0] : "—" },
    ];
    const cardWidth = (width - 76 - 60) / 4;
    cards.forEach((card, index) => {
      const cardX = width - 38 - 52 - index * (cardWidth + 20) - cardWidth + 26;
      const cardCenter = cardX + cardWidth / 2;
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      const radius = 22;
      const y = 320;
      const h = 190;
      ctx.beginPath();
      ctx.moveTo(cardX + radius, y);
      ctx.lineTo(cardX + cardWidth - radius, y);
      ctx.quadraticCurveTo(cardX + cardWidth, y, cardX + cardWidth, y + radius);
      ctx.lineTo(cardX + cardWidth, y + h - radius);
      ctx.quadraticCurveTo(cardX + cardWidth, y + h, cardX + cardWidth - radius, y + h);
      ctx.lineTo(cardX + radius, y + h);
      ctx.quadraticCurveTo(cardX, y + h, cardX, y + h - radius);
      ctx.lineTo(cardX, y + radius);
      ctx.quadraticCurveTo(cardX, y, cardX + radius, y);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "400 30px 'IBM Plex Sans Arabic', sans-serif";
      ctx.fillText(card.label, cardCenter, y + 62);
      ctx.fillStyle = "#f4d98f";
      ctx.font = "700 46px 'IBM Plex Sans Arabic', sans-serif";
      const valueText = card.value.length > 10 ? `${card.value.slice(0, 9)}…` : card.value;
      ctx.fillText(valueText, cardCenter, y + 128);
    });

    const chartLeft = width - 38 - 60;
    const chartRight = 38 + 60;
    const chartWidth = chartLeft - chartRight;
    const chartTop = 590;
    const chartBottom = 1020;
    const maxMinutes = Math.max(60, ...days.map((day) => day.minutes));
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "700 40px 'IBM Plex Sans Arabic', sans-serif";
    ctx.fillText("دقائق الدراسة في الأسبوع", width / 2, 540);
    days.forEach((day, index) => {
      const slot = chartWidth / 7;
      const barWidth = Math.min(72, slot * 0.56);
      const barCenter = chartRight + slot * (6.5 - index);
      const barHeight = day.minutes ? Math.max(14, ((day.minutes / maxMinutes) * (chartBottom - chartTop))) : 10;
      ctx.fillStyle = day.minutes ? (day.isToday ? "#f4d98f" : "rgba(255, 255, 255, 0.65)") : "rgba(255, 255, 255, 0.16)";
      const barX = barCenter - barWidth / 2;
      const barY = chartBottom - barHeight;
      const r = 10;
      ctx.beginPath();
      ctx.moveTo(barX + r, barY);
      ctx.lineTo(barX + barWidth - r, barY);
      ctx.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + Math.min(r, barHeight / 2));
      ctx.lineTo(barX + barWidth, chartBottom);
      ctx.lineTo(barX, chartBottom);
      ctx.lineTo(barX, barY + Math.min(r, barHeight / 2));
      ctx.quadraticCurveTo(barX, barY, barX + r, barY);
      ctx.fill();
      if (day.minutes) {
        ctx.fillStyle = "#f4d98f";
        ctx.font = "700 28px 'IBM Plex Sans Arabic', sans-serif";
        ctx.fillText(arabicNumber(day.minutes), barCenter, barY - 14);
      }
      ctx.fillStyle = day.isToday ? "#f4d98f" : "rgba(255, 255, 255, 0.8)";
      ctx.font = "400 30px 'IBM Plex Sans Arabic', sans-serif";
      ctx.fillText(day.label, barCenter, chartBottom + 48);
    });

    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.font = "400 30px 'IBM Plex Sans Arabic', sans-serif";
    ctx.fillText("اجتماع النقط — تطوير: أبو عمر الأثري", width / 2, 1264);

    canvas.toBlob(async (blob) => {
      if (!blob) return showMessage(cloudMessage, "تعذّر توليد الصورة على هذا المتصفح.");
      const fileName = `iitimaal-week-${dateKey()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      try {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: "اجتماع النقط — ملخص أسبوعي" });
          showMessage(cloudMessage, "تم تجهيز الصورة وفتح خيار المشاركة.", true);
          return;
        }
      } catch (error) {
        console.warn("تعذّر فتح المشاركة، سننزّل الصورة بدلًا منها.", error);
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showMessage(cloudMessage, "تم تنزيل صورة ملخص الأسبوع على هذا الجهاز.", true);
    }, "image/png");

    if (weeklyReportButton) weeklyReportButton.disabled = false;
  }
  if (weeklyReportButton) weeklyReportButton.addEventListener("click", generateWeeklyReport);

  // فحص التنبيهات عند بدء الجلسة أول مرة
  setTimeout(checkReminders, 20_000);

  signOutButton.addEventListener("click", async () => {
    if (demoMode) {
      exitDemo();
      return;
    }
    signOutButton.disabled = true;
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) {
        // جلسة منتهية أو حساب محذوف: نمسح الجلسة محليًا حتى لا يعلق المستخدم.
        console.warn("تعذّر إبطال الجلسة على الخادم، وسنمسحها محليًا.", error);
        await supabaseClient.auth.signOut({ scope: "local" }).catch(() => {});
      }
    } catch (error) {
      console.warn("تعذّر إنهاء الجلسة، وسنمسحها محليًا.", error);
      await supabaseClient.auth.signOut({ scope: "local" }).catch(() => {});
    } finally {
      signOutButton.disabled = false;
      showSignedOut();
    }
  });

  // ===== حذف الحساب والبيانات ذاتيًا من الإعدادات (دون مراسلة المطوّر) =====
  const deleteAccountButton = document.querySelector("#delete-account-btn");
  const deleteAccountMessage = document.querySelector("#delete-account-message");

  deleteAccountButton.addEventListener("click", async () => {
    if (demoMode) {
      return showMessage(deleteAccountMessage, "أنت في وضع المعاينة، ولا توجد بيانات حقيقية لحذفها. أنشئ حسابك أولًا ثم استخدم هذا الزر.");
    }
    if (!supabaseClient || !currentUser?.id) return;
    if (!window.confirm("سيُحذف حسابك نهائيًا مع كل جلساتك ومهامك وخطتك وهدفك اليومي. هل تريد المتابعة؟")) return;
    if (!window.confirm("تأكيد أخير: هذا الإجراء نهائي ولا يمكن التراجع عنه. هل أنت متأكد تمامًا؟")) return;
    deleteAccountButton.disabled = true;
    showMessage(deleteAccountMessage, "جارٍ حذف حسابك وبياناتك نهائيًا...");
    try {
      // 1) حذف كل السجلات المرتبطة بالحساب (لكل مستخدم حق حذف سجلاته فقط).
      const [sessionsResult, tasksResult, planResult] = await Promise.all([
        supabaseClient.from("study_sessions").delete().eq("user_id", currentUser.id),
        supabaseClient.from("tasks").delete().eq("user_id", currentUser.id),
        supabaseClient.from("plan_items").delete().eq("user_id", currentUser.id),
      ]);
      const dataError = sessionsResult.error || tasksResult.error || planResult.error;
      if (dataError) throw dataError;
      // 2) تسوية طابور المزامنة والذاكرة المحلية، ثم حذف الحساب هو نفسه.
      pendingOps = [];
      persistQueue();
      clearAppCache();
      const { error: accountError } = await supabaseClient.rpc("delete_own_account");
      await supabaseClient.auth.signOut({ scope: "local" }).catch(() => {});
      if (accountError) {
        const notFound = /PGRST202|42883|function .* does not exist/i.test(`${accountError.code || ""} ${accountError.message || ""}`);
        console.error(accountError);
        showSignedOut();
        if (notFound) {
          showMessage(authMessage, "حُذفت كل بياناتك (الجلسات والمهام والخطة) من حسابك. لإكمال حذف الحساب نفسه، شغّل النسخة المحدثة من setup_supabase.sql في Supabase مرة واحدة، أو راسل المطوّر.");
        } else {
          showMessage(authMessage, `حُذفت بياناتك الدراسية، وتعذر حذف الحساب نفسه. ${friendlyDbError(accountError)}`);
        }
        return;
      }
      showSignedOut();
      showMessage(authMessage, "تم حذف حسابك وكل بياناته نهائيًا. يمكنك إنشاء حساب جديد في أي وقت ✦", true);
    } catch (error) {
      console.error(error);
      if (isNetworkError(error)) {
        showMessage(deleteAccountMessage, "تعذّر الاتصال بالخادم. تحقق من الإنترنت وحاول مجددًا.");
      } else {
        showMessage(deleteAccountMessage, `تعذّر حذف بياناتك الآن. ${friendlyDbError(error)}`);
      }
    } finally {
      deleteAccountButton.disabled = false;
    }
  });

  // تحديث تلقائي عند العودة للتبويب (يفتح فجوة منتصف الليل أو تعدد الأجهزة).
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible" || !currentUser || !supabaseClient || demoMode) return;
    loadSessions(true);
    loadTasks();
    loadPlan();
  });

  // أزرار المعاينة
  if (demoStartButton) demoStartButton.addEventListener("click", () => startDemo());
  if (demoExitButton) demoExitButton.addEventListener("click", () => exitDemo());
  if (demoSignupButton) demoSignupButton.addEventListener("click", () => exitDemo({ goToSignup: true }));

  // ===== زر تثبيت التطبيق (PWA) =====
  const installButton = document.querySelector("#install-settings-btn");
  const installHomeButton = document.querySelector("#install-home");
  const installModal = document.querySelector("#install-modal");
  const installClose = document.querySelector("#install-close");
  const installNow = document.querySelector("#install-now");
  const installSteps = document.querySelector("#install-steps");
  let deferredInstallPrompt = null;

  const installButtons = [installButton, installHomeButton].filter(Boolean);
  const isInstalledApp = () => window.matchMedia?.("(display-mode: standalone)")?.matches === true
    || navigator.standalone === true;
  let installCompleted = isInstalledApp();

  function setInstallVisible(visible) {
    installButtons.forEach((button) => button.classList.toggle("hidden", !visible));
    document.body.classList.toggle("is-installed-app", !visible);
  }

  if (installCompleted) {
    try {
      localStorage.setItem("study-tracker-installed", "true");
    } catch (error) {
      console.warn("تعذر حفظ حالة التثبيت.", error);
    }
  }
  setInstallVisible(!installCompleted);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    if (installCompleted) return;
    deferredInstallPrompt = event;
    setInstallVisible(true);
    installButtons.forEach((button) => button.classList.add("can-install"));
  });

  window.addEventListener("appinstalled", () => {
    installCompleted = true;
    deferredInstallPrompt = null;
    setInstallVisible(false);
    installButtons.forEach((button) => button.classList.remove("can-install"));
    installModal.classList.add("hidden");
    try {
      localStorage.setItem("study-tracker-installed", "true");
    } catch (error) {
      console.warn("تعذر حفظ حالة التثبيت.", error);
    }
  });

  function detectPlatform() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
    if (/Android/i.test(ua)) return "android";
    return "desktop";
  }

  const INSTALL_STEPS = {
    android: [
      "افتح الموقع في متصفح <b>Chrome</b>.",
      "اضغط قائمة <b>⋮</b> في الأعلى.",
      "اختر <b>«تثبيت التطبيق»</b>.",
      "اضغط <b>تثبيت</b> — ستظهر أيقونة «ن» في تطبيقاتك.",
    ],
    ios: [
      "افتح الموقع في متصفح <b>Safari</b> (لا يمكن من Chrome).",
      "اضغط زر <b>المشاركة 📤</b> في الشريط السفلي.",
      "اختر <b>«إضافة إلى الشاشة الرئيسية»</b>.",
      "اضغط <b>«إضافة»</b> في الأعلى.",
    ],
    desktop: [
      "افتح الموقع في <b>Chrome</b> أو <b>Edge</b>.",
      "اضغط أيقونة <b>التثبيت ⤓</b> في شريط العنوان.",
      "أو افتح القائمة <b>⋮</b> واختر <b>«تثبيت اجتماع النقط»</b>.",
      "ستفتح له نافذة مستقلة مع أيقونة في قائمة ابدأ.",
    ],
  };

  function openInstallModal() {
    installSteps.innerHTML = INSTALL_STEPS[detectPlatform()]
      .map((step) => `<li>${step}</li>`).join("");
    installNow.classList.toggle("hidden", !deferredInstallPrompt);
    installModal.classList.remove("hidden");
    installClose.focus();
  }

  function closeInstallModal() {
    installModal.classList.add("hidden");
  }

  installButton.addEventListener("click", openInstallModal);
  installHomeButton?.addEventListener("click", openInstallModal);
  installClose.addEventListener("click", closeInstallModal);
  installModal.addEventListener("click", (event) => {
    if (event.target === installModal) closeInstallModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !installModal.classList.contains("hidden")) closeInstallModal();
  });

  installNow.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    installNow.disabled = true;
    const installPrompt = deferredInstallPrompt;
    installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice?.outcome === "accepted") {
      installCompleted = true;
      setInstallVisible(false);
      try {
        localStorage.setItem("study-tracker-installed", "true");
      } catch (error) {
        console.warn("تعذر حفظ حالة التثبيت.", error);
      }
    }
    deferredInstallPrompt = null;
    installNow.disabled = false;
    installButtons.forEach((button) => button.classList.remove("can-install"));
    closeInstallModal();
  });

  updateTodayLabel();
  window.setInterval(updateTodayLabel, 60_000);
  window.setInterval(renderHeroClock, 1000);
  studyDateInput.value = dateKey();
  studyDateInput.max = dateKey();

  // معالجة أخطاء روابط التأكيد/الاستعادة (#error=... بدل صمتٍ مربك).
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const urlErrorCode = hashParams.get("error_code") || hashParams.get("error");

  const config = window.STUDY_TRACKER_CONFIG || {};
  const configured = config.supabaseUrl && config.publishableKey && !config.supabaseUrl.includes("ضع-") && !config.publishableKey.includes("ضع-");
  const demoResume = readDemoFlag();
  if (!configured || !window.supabase?.createClient) {
    const setupNote = document.querySelector("#setup-note");
    setupNote.textContent = !window.supabase?.createClient
      ? "تعذر تحميل خدمة تسجيل الدخول. تحقق من اتصال الإنترنت ثم أعد تحميل الصفحة."
      : "إعدادات Supabase غير مكتملة. تحقق من رابط المشروع والمفتاح العام في supabase-config.js.";
    setupNote.classList.remove("hidden");
    document.querySelector("#auth-submit").disabled = true;
    document.querySelector("#auth-switch").disabled = true;
    document.querySelector("#auth-forgot").disabled = true;
  } else {
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.publishableKey);
    if (urlErrorCode && !demoResume && !/type=recovery/.test(window.location.hash)) {
      showMessage(authMessage, describeUrlError(urlErrorCode));
    }
    supabaseClient.auth.onAuthStateChange((event, session) => {
      // لا تستدعِ طلبات Supabase داخل callback؛ قد يؤدي ذلك إلى تعليق العميل.
      window.setTimeout(() => {
        if (demoMode) return;
        if (event === "PASSWORD_RECOVERY" && session?.user) {
          showRecoveryPanel(session.user);
        } else if (session?.user && currentUser?.id !== session.user.id) {
          setUser(session.user).catch((error) => {
            console.error("تعذر فتح مساحة الطالب بعد الدخول.", error);
            showMessage(cloudMessage, "تم تسجيل الدخول، لكن تعذر تحميل بيانات التطبيق. حدّث الصفحة أو تحقق من الاتصال.");
          });
        } else if (event === "SIGNED_OUT") {
          showSignedOut();
        }
      }, 0);
    });
    if (!demoResume) {
      supabaseClient.auth.getSession().then(({ data, error }) => {
        if (error) {
          console.error(error);
          authPanel.classList.remove("hidden");
          showMessage(authMessage, friendlyAuthError(error));
          return;
        }
        const user = data?.session?.user;
        const recovering = /type=recovery/.test(window.location.hash);
        if (user && recovering) showRecoveryPanel(user);
        else if (user) return setUser(user);
        else authPanel.classList.remove("hidden");
      }).catch((error) => {
        console.error("تعذر استعادة جلسة الدخول المحفوظة.", error);
        authPanel.classList.remove("hidden");
        showMessage(authMessage, "تعذر الاتصال بخدمة الدخول الآن. تحقق من الإنترنت وحاول مجددًا.");
      });
    }

    // PWA: تسجيل عامل الخدمة للعمل دون اتصال (فقط عبر HTTPS).
    if ("serviceWorker" in navigator && window.location.protocol === "https:") {
      window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(console.error));
    }
  }

  // استعادة وضع المعاينة بعد إعادة تحميل الصفحة.
  if (demoResume) startDemo({ resume: true });
})();
