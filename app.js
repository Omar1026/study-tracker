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
  const authMessage = document.querySelector("#auth-message");
  const authPanel = document.querySelector("#auth-panel");
  const recoveryPanel = document.querySelector("#recovery-panel");
  const recoveryForm = document.querySelector("#recovery-form");
  const recoveryMessage = document.querySelector("#recovery-message");
  const studentArea = document.querySelector("#student-area");
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
  let currentSection = "sessions";
  let timerStart = null;
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

  // ترجمة رسائل أخطاء المصادقة الشائعة إلى عربية واضحة.
  function friendlyAuthError(error) {
    const raw = error?.message || "";
    const map = [
      ["Invalid login credentials", "البريد الإلكتروني أو كلمة المرور غير صحيحة."],
      ["Email not confirmed", "الرجاء تأكيد بريدك الإلكتروني أولًا عبر الرسالة التي وصلك."],
      ["User already registered", "هذا البريد مسجّل بالفعل. سجّل الدخول أو استعد كلمة المرور."],
      ["Password should be at least", "كلمة المرور يجب ألا تقل عن ٦ أحرف."],
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
    document.querySelector("#auth-password").autocomplete = signUp ? "new-password" : "current-password";
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

  function renderList() {
    const today = dateKey();
    const items = viewSessions();
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
    const [title, hint] = EMPTY_TEXT[currentView];
    emptyTitle.textContent = title;
    emptyHint.textContent = hint;
  }

  function render() {
    renderStats();
    renderList();
    renderChart();
  }

  async function loadSessions(silent = false) {
    if (!silent) showMessage(cloudMessage, "جارٍ تحميل جلساتك...");
    const { start } = viewRange("week");
    const monthStart = dateKey(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const from = start < monthStart ? start : monthStart;
    const { data, error } = await supabaseClient
      .from("study_sessions")
      .select("id, subject, duration, note, study_date, created_at")
      .eq("user_id", currentUser.id)
      .gte("study_date", from)
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
    const email = document.querySelector("#auth-email").value.trim();
    const password = document.querySelector("#auth-password").value;
    const submit = document.querySelector("#auth-submit");
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
    dailyGoal = Number(user?.user_metadata?.daily_goal) || DEFAULT_GOAL;
    goalInput.value = dailyGoal;
    authPanel.classList.add("hidden");
    recoveryPanel.classList.add("hidden");
    studentArea.classList.remove("hidden");
    signOutButton.classList.remove("hidden");
    await loadSessions();
    await Promise.all([loadTasks(), loadPlan()]);
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

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    const elapsedMs = timerStart ? Date.now() - timerStart : 0;
    timerStart = null;
    timerDisplay.textContent = "٠٠:٠٠:٠٠";
    timerToggle.textContent = "ابدأ المؤقت";
    timerToggle.classList.remove("is-running");
    return elapsedMs;
  }

  function toggleTimer() {
    if (timerStart) {
      const elapsedMs = stopTimer();
      const minutes = Math.max(1, Math.round(elapsedMs / 60000));
      durationInput.value = minutes;
      showMessage(message, `تمت إدخال مدة المؤقت (${arabicNumber(minutes)} دقيقة) في حقل المدة.`, true);
      subjectInput.focus();
      return;
    }
    timerStart = Date.now();
    timerToggle.textContent = "إيقاف المؤقت";
    timerToggle.classList.add("is-running");
    const tick = () => {
      const totalSeconds = Math.floor((Date.now() - timerStart) / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const seconds = totalSeconds % 60;
      timerDisplay.textContent = `${toArabicDigits(hours)}:${toArabicDigits(minutes)}:${toArabicDigits(seconds)}`;
    };
    tick();
    timerInterval = setInterval(tick, 1000);
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
  // ===== التنقل بين الأقسام =====
  document.querySelectorAll(".section-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      currentSection = tab.dataset.section;
      document.querySelectorAll(".section-tab").forEach((other) => {
        const active = other === tab;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-selected", String(active));
      });
      document.querySelectorAll(".section-view").forEach((view) => {
        view.classList.toggle("hidden", view.id !== `${currentSection}-section`);
      });
      if (currentSection === "planner") renderCalendar();
    });
  });

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

  cancelButton.addEventListener("click", () => { resetForm(); showMessage(message, ""); });
  document.querySelector("#auth-switch").addEventListener("click", () => setAuthMode(!isSignUp));
  document.querySelector("#auth-forgot").addEventListener("click", handleForgotPassword);
  authForm.addEventListener("submit", handleAuth);
  recoveryForm.addEventListener("submit", handleRecovery);
  goalSaveButton.addEventListener("click", saveGoal);
  timerToggle.addEventListener("click", toggleTimer);
  document.querySelector("#export-csv").addEventListener("click", exportCsv);
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

  document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("ar-SA", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
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
