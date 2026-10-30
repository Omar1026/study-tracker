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
  const demoArea = document.querySelector("#demo-area");
  const demoOpenButton = document.querySelector("#demo-open");
  const demoCloseButton = document.querySelector("#demo-close");
  const fontSelect = document.querySelector("#font-select");
  const themeSelect = document.querySelector("#theme-select");
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

  // الشريط العلوي
  const themeToggle = document.querySelector("#theme-toggle");
  // الإعدادات
  const installSettingsBtn = document.querySelector("#install-settings-btn");
  const privacyOpenBtn = document.querySelector("#privacy-open-btn");
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
  const quickTodayMinutes = document.querySelector("#quick-today-minutes");
  const quickTodayHint = document.querySelector("#quick-today-hint");

  let onboardingIndex = 0;

  // المهام
  const taskForm = document.querySelector("#task-form");
  const taskTitleInput = document.querySelector("#task-title");
  const taskDueInput = document.querySelector("#task-due");
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
  let sessions = [];
  let tasks = [];
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

  const DEFAULT_GOAL = 120;
  const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5]; // السبت ثم الأحد..الجمعة
  const WEEK_NAMES = { 0: "الأحد", 1: "الاثنين", 2: "الثلاثاء", 3: "الأربعاء", 4: "الخميس", 5: "الجمعة", 6: "السبت" };
  const EMPTY_TEXT = {
    today: ["مساحتك جاهزة لأول إنجاز", "أضف جلسة دراستك الأولى، وستظهر هنا."],
    yesterday: ["لا توجد جلسات أمس", "يمكنك إضافة جلسة بأمس التاريخ من النموذج."],
    week: ["لا توجد جلسات في آخر ٧ أيام", "أضف جلسة جديدة أو استعرض جلسات الشهر."],
    month: ["لا توجد جلسات هذا الشهر", "ابدأ اليوم وستجد ملخصك هنا."],
  };
  const PALETTES = {
    teal: { main: "#0e5c54", soft: "#e4f0ec", night: "#57c5b8" },
    blue: { main: "#2459a6", soft: "#e5edf8", night: "#87b5ff" },
    purple: { main: "#7040a0", soft: "#eee7f5", night: "#c8a0f2" },
    green: { main: "#267343", soft: "#e6f1e9", night: "#80d99a" },
    gold: { main: "#916400", soft: "#fff2cc", night: "#ffd166" },
    orange: { main: "#b7610b", soft: "#f7ecdf", night: "#ffc078" },
    indigo: { main: "#4338a8", soft: "#ecebff", night: "#aaa5ff" },
    sky: { main: "#076b8c", soft: "#e2f4f8", night: "#70d4ed" },
    rose: { main: "#a23b72", soft: "#fae8f1", night: "#f09ac3" },
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
  let appearance = { accent: "teal", font: "ibm", fontScale: 1, theme: "day" };

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
    const currentTime = new Intl.DateTimeFormat("ar-SA", {
      hour: "numeric", minute: "2-digit", hour12: true,
    }).format(now);
    const label = document.querySelector("#today-label");
    label.textContent = `الميلادي: ${gregorianDate} · الهجري: ${hijriDate} · الوقت: ${currentTime}`;
    label.dateTime = now.toISOString();
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
    element.textContent = text;
    element.classList.toggle("success", success);
  }

  function loadAppearance() {
    try {
      const saved = JSON.parse(localStorage.getItem("study-tracker-appearance") || "{}");
      appearance = {
        accent: PALETTES[saved.accent] ? saved.accent : "teal",
        font: ARABIC_FONTS[saved.font] ? saved.font : "ibm",
        fontScale: FONT_SCALES.includes(saved.fontScale) ? saved.fontScale : 1,
        theme: saved.theme === "night" ? "night" : "day",
      };
    } catch (error) {
      console.warn("تعذر قراءة تفضيلات المظهر المحفوظة.", error);
    }
  }

  function applyAppearance() {
    const palette = PALETTES[appearance.accent] || PALETTES.teal;
    const root = document.documentElement;
    root.style.setProperty("--teal", palette.main);
    root.style.setProperty("--teal-dark", appearance.theme === "night" ? palette.night : palette.main);
    root.style.setProperty("--teal-soft", palette.soft);
    root.style.setProperty("--font-ui", ARABIC_FONTS[appearance.font] || ARABIC_FONTS.ibm);
    root.style.setProperty("--root-font-size", (16 * appearance.fontScale) + "px");
    document.body.dataset.theme = appearance.theme;
    document.body.classList.add("solid-colors");
    document.querySelector("#theme-color-meta").content = appearance.theme === "night" ? "#111b17" : palette.main;
    fontSelect.value = appearance.font;
    themeSelect.value = appearance.theme;
    document.querySelectorAll(".color-swatch").forEach((swatch) => {
      swatch.setAttribute("aria-pressed", String(swatch.dataset.accent === appearance.accent));
    });
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
    const validPages = ["home", "sessions", "tasks", "planner", "settings"];
    if (!validPages.includes(page)) page = "home";
    const pageTitles = { home: "الرئيسية", sessions: "الجلسات", tasks: "المهام", planner: "التخطيط", settings: "الإعدادات" };
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

    // إعادة تشغيل رسوم الدخول عند العودة للرئيسية
    if (page === "home") {
      document.querySelectorAll(".animate-in, .home-hero, .poem-card, .home-grid, .home-quick").forEach((el) => {
        el.classList.remove("animate-in");
        void el.offsetHeight; // إعادةfluss
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
    if (code === "42501" || /permission denied/i.test(raw)) return "صلاحيات الوصول مرفوضة. تأكد من تشغيل ملف setup_supabase.sql كاملًا.";
    if (code === "23514") return "القيم المُدخلة خارج النطاق المسموح. راجع القيم وأعد المحاولة.";
    if (code === "42P01" || /does not exist/i.test(raw)) return "أحد الجداول غير موجود. شغّل ملف setup_supabase.sql في Supabase.";
    if (/Failed to fetch|NetworkError/i.test(raw)) return "تعذّر الاتصال بقاعدة البيانات. تحقق من إعداد supabase-config.js والإنترنت.";
    return "تعذّر إتمام العملية. حاول مجددًا.";
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
    document.querySelector("#today-hours").textContent = arabicNumber(Math.floor(totalMinutes / 60));
    document.querySelector("#today-minutes").textContent = `${arabicNumber(totalMinutes)} دقيقة إجمالًا`;
    document.querySelector("#today-count").textContent = arabicNumber(todaySessions.length);
    const percent = Math.min(100, Math.round((totalMinutes / dailyGoal) * 100));
    document.querySelector("#goal-progress-fill").style.width = `${totalMinutes > 0 ? Math.max(percent, 3) : 0}%`;
    document.querySelector("#goal-progress-fill").classList.toggle("goal-met", totalMinutes >= dailyGoal);
    document.querySelector("#goal-progress-text").textContent = totalMinutes >= dailyGoal
      ? "أحسنت! حققت هدف اليوم ✦"
      : `حققت ${arabicNumber(percent)}٪ من هدف ${arabicNumber(dailyGoal)} دقيقة`;
    const studiedDays = new Set(sessions.map((session) => session.study_date));
    let streakCursor = new Date();
    if (!studiedDays.has(dateKey(streakCursor))) streakCursor = addDays(streakCursor, -1);
    let streak = 0;
    while (studiedDays.has(dateKey(streakCursor))) {
      streak += 1;
      streakCursor = addDays(streakCursor, -1);
    }
    document.querySelector("#study-streak").textContent = arabicNumber(streak);
    document.querySelector("#study-streak-hint").textContent = streak ? "تقدّم جميل، واصل بإيقاع يناسبك." : "ابدأ بخطوة اليوم، والراحة جزء من الطريق.";

    // الملخص السريع في الصفحة الرئيسية
    if (quickTodayMinutes) {
      quickTodayMinutes.textContent = totalMinutes > 0
        ? `${arabicNumber(totalMinutes)} دقيقة`
        : "٠ دقيقة";
      quickTodayHint.textContent = totalMinutes > 0
        ? `حققت ${arabicNumber(Math.min(100, Math.round((totalMinutes / dailyGoal) * 100)))}٪ من هدفك اليومي.`
        : "ابدأ جلستك الأولى لتظهر هنا.";
    }
  }

  function renderChart() {
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

  function render() {
    renderStats();
    renderList();
    renderChart();
    renderMonthSummary();
  }

  async function loadSessions(silent = false) {
    if (!silent) showMessage(cloudMessage, "جارٍ تحميل جلساتك...");
    const { data, error } = await supabaseClient
      .from("study_sessions")
      .select("id, subject, duration, note, study_date, created_at")
      .eq("user_id", currentUser.id)
      .gte("study_date", dateKey(addDays(new Date(), -364)))
      .lte("study_date", dateKey())
      .order("study_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      showMessage(cloudMessage, `تعذّر تحميل الجلسات. ${friendlyDbError(error)}`);
      console.error(error);
      return;
    }
    sessions = data || [];
    if (!silent) showMessage(cloudMessage, "تم تحميل جلساتك من حسابك.", true);
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
    showMessage(authMessage, isSignUp ? "جارٍ إنشاء الحساب..." : "جارٍ تسجيل الدخول...");
    const result = isSignUp
      ? await supabaseClient.auth.signUp({ email, password })
      : await supabaseClient.auth.signInWithPassword({ email, password });
    submit.disabled = false;
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
    if (result.data.user) await setUser(result.data.user);
  }

  async function handleForgotPassword() {
    const email = document.querySelector("#auth-email").value.trim();
    if (!email) return showMessage(authMessage, "اكتب بريدك الإلكتروني أولًا حتى نرسل رابط الاستعادة.");
    const button = document.querySelector("#auth-forgot");
    button.disabled = true;
    showMessage(authMessage, "جارٍ إرسال رابط إعادة التعيين...");
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${window.location.pathname}`,
    });
    button.disabled = false;
    if (error) {
      showMessage(authMessage, friendlyAuthError(error));
      console.error(error);
      return;
    }
    showMessage(authMessage, "أرسلنا رابط إعادة تعيين كلمة المرور إلى بريدك. تحقق من صندوق الوارد.", true);
  }

  function showRecoveryPanel(user) {
    currentUser = user;
    authPanel.classList.add("hidden");
    studentArea.classList.add("hidden");
    recoveryPanel.classList.remove("hidden");
    signOutButton.classList.remove("hidden");
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
    const { data, error } = await supabaseClient.auth.updateUser({ password });
    submit.disabled = false;
    if (error) {
      showMessage(recoveryMessage, friendlyAuthError(error));
      console.error(error);
      return;
    }
    showMessage(recoveryMessage, "تم حفظ كلمة المرور الجديدة. أهلًا بعودتك!", true);
    await setUser(data.user);
    recoveryPanel.classList.add("hidden");
    recoveryForm.reset();
  }

  async function saveGoal() {
    const value = Number(goalInput.value);
    if (!Number.isInteger(value) || value < 5 || value > 1440) {
      return showMessage(goalMessage, "أدخل هدفًا بين ٥ و١٤٤٠ دقيقة.");
    }
    goalSaveButton.disabled = true;
    const { data, error } = await supabaseClient.auth.updateUser({ data: { daily_goal: value } });
    goalSaveButton.disabled = false;
    if (error) {
      showMessage(goalMessage, friendlyAuthError(error));
      console.error(error);
      return;
    }
    currentUser = data.user;
    dailyGoal = value;
    showMessage(goalMessage, "تم حفظ هدفك اليومي.", true);
    render();
  }

  async function setUser(user) {
    currentUser = user;
    demoArea.classList.add("hidden");
    document.body.classList.add("app-mode");
    dailyGoal = Number(user?.user_metadata?.daily_goal) || DEFAULT_GOAL;
    goalInput.value = dailyGoal;
    authPanel.classList.add("hidden");
    recoveryPanel.classList.add("hidden");
    studentArea.classList.remove("hidden");
    signOutButton.classList.remove("hidden");
    const hashPage = window.location.hash.slice(1);
    navigateToPage(hashPage || "home", false);
    await loadSessions();
    await Promise.all([loadTasks(), loadPlan()]);

    // عرض شاشة الترحيب للمستخدم الجديد بعد تسجيل الدخول
    try {
      const alreadyOnboarded = localStorage.getItem("study-tracker-onboarded") === "true";
      if (!alreadyOnboarded) {
        onboardingModal.classList.remove("hidden");
        showOnboardingPage(0);
      }
    } catch (error) {
      console.warn("تعذر قراءة حالة الترحيب.", error);
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
    currentUser = null;
    sessions = [];
    tasks = [];
    planItems = [];
    studentArea.classList.add("hidden");
    document.body.classList.remove("app-mode");
    signOutButton.classList.add("hidden");
    recoveryPanel.classList.add("hidden");
    authPanel.classList.remove("hidden");
    authForm.reset();
    recoveryForm.reset();
    resetForm();
    setAuthMode(false);
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
    if (!currentUser || !supabaseClient) return;
    exportAccountDataButton.disabled = true;
    showMessage(settingsMessage, "جارٍ تجهيز نسخة بياناتك...");
    const exportedSessions = [];
    const pageSize = 500;
    let offset = 0;
    try {
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
      const backup = {
        format: "study-tracker-backup-v1",
        exportedAt: new Date().toISOString(),
        account: { email: currentUser.email || null },
        dailyGoalMinutes: dailyGoal,
        sessions: exportedSessions,
        tasks: tasks.map(({ id, title, due_date, done, created_at }) => ({ id, title, due_date, done, created_at })),
        weeklyPlan: planItems.map(({ id, title, weekday, start_time, created_at }) => ({ id, title, weekday, start_time, created_at })),
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `study-tracker-backup-${dateKey()}.json`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showMessage(settingsMessage, "تم تنزيل نسخة بياناتك على هذا الجهاز.", true);
    } catch (error) {
      console.error(error);
      showMessage(settingsMessage, `تعذّر تجهيز النسخة. ${friendlyDbError(error)}`);
    } finally {
      exportAccountDataButton.disabled = false;
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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const subject = subjectInput.value.trim();
    const duration = Number(durationInput.value);
    const note = noteInput.value.trim();
    const studyDate = studyDateInput.value || dateKey();
    if (studyDate > dateKey()) return showMessage(message, "لا يمكن تسجيل جلسة في تاريخ مستقبلي.");
    if (!subject) return showMessage(message, "اكتب اسم المادة أولًا.");
    if (!Number.isInteger(duration) || duration < 1 || duration > 1440) return showMessage(message, "أدخل مدة صحيحة بين دقيقة و٢٤ ساعة.");
    submitButton.disabled = true;
    showMessage(message, editingId ? "جارٍ حفظ التعديلات..." : "جارٍ حفظ الجلسة...");
    const payload = { subject, duration, note, study_date: studyDate };
    const request = editingId
      ? supabaseClient.from("study_sessions").update(payload).eq("id", editingId).eq("user_id", currentUser.id).select().single()
      : supabaseClient.from("study_sessions").insert({ ...payload, user_id: currentUser.id }).select().single();
    const { data, error } = await request;
    submitButton.disabled = false;
    if (error) {
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
      const { error } = await supabaseClient.from("study_sessions").delete().eq("id", id).eq("user_id", currentUser.id);
      if (error) {
        showMessage(message, `تعذّر حذف الجلسة. ${friendlyDbError(error)}`);
        console.error(error);
        return;
      }
      sessions = sessions.filter((entry) => entry.id !== id);
      if (editingId === id) resetForm();
      render();
      showMessage(message, "تم حذف الجلسة من حسابك.", true);
    }
  });

  // ===== المهام =====
  async function loadTasks() {
    const { data, error } = await supabaseClient
      .from("tasks")
      .select("id, title, due_date, done, created_at")
      .eq("user_id", currentUser.id)
      .order("done", { ascending: true })
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      showMessage(taskMessage, `تعذّر تحميل المهام. ${friendlyDbError(error)}`);
      return;
    }
    tasks = data || [];
    renderTasks();
  }

  function renderTasks() {
    const today = dateKey();
    const openCount = tasks.filter((task) => !task.done).length;
    taskBadge.textContent = `${arabicNumber(openCount)} من ${arabicNumber(tasks.length)}`;
    taskList.innerHTML = tasks.map((task) => {
      let dueHtml = "";
      if (task.due_date) {
        const cls = task.due_date < today && !task.done ? " is-overdue" : task.due_date === today && !task.done ? " is-today" : "";
        dueHtml = `<p class="task-due${cls}">مستحقة: ${escapeHtml(dateShort(task.due_date))}</p>`;
      }
      return `<li class="task-item${task.done ? " done" : ""}" data-id="${escapeHtml(task.id)}">
        <button class="task-check" type="button" aria-label="${task.done ? "إرجاع المهمة إلى قيد العمل" : "إنجاز المهمة"}" aria-pressed="${task.done}">✓</button>
        <div class="task-body"><p class="task-title">${escapeHtml(task.title)}</p>${dueHtml}</div>
        <button class="text-action delete task-delete" type="button">حذف</button>
      </li>`;
    }).join("");
    taskEmpty.classList.toggle("hidden", tasks.length > 0);
  }

  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = taskTitleInput.value.trim();
    const due = taskDueInput.value || null;
    if (!title) return showMessage(taskMessage, "اكتب عنوان المهمة أولًا.");
    const { data, error } = await supabaseClient
      .from("tasks")
      .insert({ user_id: currentUser.id, title, due_date: due })
      .select()
      .single();
    if (error) {
      showMessage(taskMessage, `تعذّر إضافة المهمة. ${friendlyDbError(error)}`);
      console.error(error);
      return;
    }
    tasks.unshift(data);
    renderTasks();
    renderCalendar();
    taskForm.reset();
    showMessage(taskMessage, "تمت إضافة المهمة إلى قائمتك.", true);
  });

  taskList.addEventListener("click", async (event) => {
    const item = event.target.closest(".task-item");
    if (!item) return;
    const id = item.dataset.id;
    const task = tasks.find((entry) => entry.id === id);
    if (!task) return;
    if (event.target.closest(".task-check")) {
      const { data, error } = await supabaseClient
        .from("tasks")
        .update({ done: !task.done })
        .eq("id", id)
        .eq("user_id", currentUser.id)
        .select()
        .single();
      if (error) {
        showMessage(taskMessage, `تعذّر تحديث المهمة. ${friendlyDbError(error)}`);
        console.error(error);
        return;
      }
      tasks = tasks.map((entry) => (entry.id === id ? data : entry));
      tasks.sort((a, b) => (a.done === b.done ? String(a.due_date || "9").localeCompare(String(b.due_date || "9")) : Number(a.done) - Number(b.done)));
      renderTasks();
      renderCalendar();
      showMessage(taskMessage, data.done ? "أحسنت! أنجزت مهمة جديدة ✦" : "أُعيدت المهمة إلى قيد العمل.", true);
    }
    if (event.target.closest(".task-delete")) {
      if (!window.confirm("هل تريد حذف هذه المهمة؟")) return;
      const { error } = await supabaseClient.from("tasks").delete().eq("id", id).eq("user_id", currentUser.id);
      if (error) {
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
    const { data, error } = await supabaseClient
      .from("plan_items")
      .select("id, title, weekday, start_time, created_at")
      .eq("user_id", currentUser.id)
      .order("weekday", { ascending: true })
      .order("start_time", { ascending: true, nullsFirst: false });
    if (error) {
      console.error(error);
      showMessage(planMessage, `تعذّر تحميل الخطة. ${friendlyDbError(error)}`);
      return;
    }
    planItems = data || [];
    renderPlan();
    renderCalendar();
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
    const { data, error } = await supabaseClient
      .from("plan_items")
      .insert({ user_id: currentUser.id, title, weekday, start_time: startTime })
      .select()
      .single();
    if (error) {
      showMessage(planMessage, `تعذّر إضافة البند. ${friendlyDbError(error)}`);
      console.error(error);
      return;
    }
    planItems.push(data);
    planItems.sort((a, b) => (a.weekday === b.weekday ? String(a.start_time || "99").localeCompare(String(b.start_time || "99")) : a.weekday - b.weekday));
    renderPlan();
    planForm.reset();
    showMessage(planMessage, `تمت إضافة البند إلى ${WEEK_NAMES[weekday]}.`, true);
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
    const { error } = await supabaseClient.from("plan_items").delete().eq("id", item.dataset.id).eq("user_id", currentUser.id);
    if (error) {
      showMessage(planMessage, `تعذّر حذف البند. ${friendlyDbError(error)}`);
      console.error(error);
      return;
    }
    planItems = planItems.filter((entry) => entry.id !== item.dataset.id);
    renderPlan();
    showMessage(planMessage, "تم حذف البند من خطتك.", true);
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
  document.querySelectorAll(".color-swatch").forEach((swatch) => {
    swatch.addEventListener("click", () => {
      appearance.accent = swatch.dataset.accent;
      saveAppearance();
    });
  });
  fontSelect.addEventListener("change", () => {
    appearance.font = fontSelect.value;
    saveAppearance();
  });
  themeSelect.addEventListener("change", () => {
    appearance.theme = themeSelect.value;
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
  themeToggle.textContent = appearance.theme === "night" ? "🌙" : "☀️";
  demoOpenButton.addEventListener("click", () => {
    authPanel.classList.add("hidden");
    recoveryPanel.classList.add("hidden");
    demoArea.classList.remove("hidden");
    demoArea.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  demoCloseButton.addEventListener("click", () => {
    demoArea.classList.add("hidden");
    authPanel.classList.remove("hidden");
    authPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  document.querySelector("#auth-forgot").addEventListener("click", handleForgotPassword);
  authForm.addEventListener("submit", handleAuth);
  recoveryForm.addEventListener("submit", handleRecovery);
  goalSaveButton.addEventListener("click", saveGoal);
  timerToggle.addEventListener("click", toggleTimer);
  exportAccountDataButton.addEventListener("click", exportAccountData);
  document.querySelector("#export-csv").addEventListener("click", exportCsv);

  // التبديل السريع بين الوضع النهاري والليلي من الشريط العلوي
  themeToggle.addEventListener("click", () => {
    appearance.theme = appearance.theme === "night" ? "day" : "night";
    themeSelect.value = appearance.theme;
    saveAppearance();
    themeToggle.textContent = appearance.theme === "night" ? "🌙" : "☀️";
  });

  // فتح وإغلاق نافذة بيان الخصوصية
  privacyOpenBtn.addEventListener("click", () => {
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

  signOutButton.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      showMessage(cloudMessage, "تعذّر تسجيل الخروج.");
      console.error(error);
      return;
    }
    showSignedOut();
  });

  // تحديث تلقائي عند العودة للتبويب (يفتح فجوة منتصف الليل أو تعدد الأجهزة).
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && currentUser) loadSessions(true);
  });

  // ===== زر تثبيت التطبيق (PWA) =====
  const installButton = document.querySelector("#install-settings-btn");
  const installModal = document.querySelector("#install-modal");
  const installClose = document.querySelector("#install-close");
  const installNow = document.querySelector("#install-now");
  const installSteps = document.querySelector("#install-steps");
  let deferredInstallPrompt = null;

  const isInstalledApp = () => window.matchMedia?.("(display-mode: standalone)")?.matches === true
    || navigator.standalone === true;
  let installCompleted = isInstalledApp();
  try {
    installCompleted = installCompleted || localStorage.getItem("study-tracker-installed") === "true";
  } catch (error) {
    console.warn("تعذر قراءة حالة التثبيت المحفوظة.", error);
  }
  if (installCompleted) {
    installButton.classList.add("hidden");
    if (isInstalledApp()) {
      try {
        localStorage.setItem("study-tracker-installed", "true");
      } catch (error) {
        console.warn("تعذر حفظ حالة التثبيت.", error);
      }
    }
  }
  else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) installButton.classList.remove("hidden");

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    if (installCompleted) return;
    deferredInstallPrompt = event;
    installButton.classList.remove("hidden");
    installButton.classList.add("can-install");
  });

  window.addEventListener("appinstalled", () => {
    installCompleted = true;
    deferredInstallPrompt = null;
    installButton.classList.add("hidden");
    installButton.classList.remove("can-install");
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
      installButton.classList.add("hidden");
      try {
        localStorage.setItem("study-tracker-installed", "true");
      } catch (error) {
        console.warn("تعذر حفظ حالة التثبيت.", error);
      }
    }
    deferredInstallPrompt = null;
    installNow.disabled = false;
    installButton.classList.remove("can-install");
    closeInstallModal();
  });

  updateTodayLabel();
  window.setInterval(updateTodayLabel, 60_000);
  studyDateInput.value = dateKey();
  studyDateInput.max = dateKey();

  // معالجة أخطاء روابط التأكيد/الاستعادة (#error=... بدل صمتٍ مربك).
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const urlErrorCode = hashParams.get("error_code") || hashParams.get("error");

  const config = window.STUDY_TRACKER_CONFIG || {};
  const configured = config.supabaseUrl && config.publishableKey && !config.supabaseUrl.includes("ضع-") && !config.publishableKey.includes("ضع-");
  if (!configured || !window.supabase?.createClient) {
    document.querySelector("#setup-note").classList.remove("hidden");
    document.querySelector("#auth-submit").disabled = true;
    document.querySelector("#auth-switch").disabled = true;
    document.querySelector("#auth-forgot").disabled = true;
  } else {
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.publishableKey);
    if (urlErrorCode && !/type=recovery/.test(window.location.hash)) {
      showMessage(authMessage, describeUrlError(urlErrorCode));
    }
    supabaseClient.auth.getSession().then(({ data, error }) => {
      if (error) console.error(error);
      const user = data?.session?.user;
      const recovering = /type=recovery/.test(window.location.hash);
      if (user && recovering) showRecoveryPanel(user);
      else if (user) setUser(user);
      else authPanel.classList.remove("hidden");
    });
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session?.user) showRecoveryPanel(session.user);
      else if (session?.user && !currentUser) setUser(session.user);
    });

    // PWA: تسجيل عامل الخدمة للعمل دون اتصال (فقط عبر HTTPS).
    if ("serviceWorker" in navigator && window.location.protocol === "https:") {
      window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(console.error));
    }
  }
})();
