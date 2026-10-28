(() => {
  const form = document.querySelector("#session-form");
  const subjectInput = document.querySelector("#subject");
  const durationInput = document.querySelector("#duration");
  const noteInput = document.querySelector("#note");
  const message = document.querySelector("#form-message");
  const submitButton = document.querySelector("#submit-button");
  const cancelButton = document.querySelector("#cancel-edit");
  const sessionList = document.querySelector("#session-list");
  const emptyState = document.querySelector("#empty-state");
  const authForm = document.querySelector("#auth-form");
  const authMessage = document.querySelector("#auth-message");
  const authPanel = document.querySelector("#auth-panel");
  const studentArea = document.querySelector("#student-area");
  const signOutButton = document.querySelector("#sign-out");
  let supabaseClient = null;
  let currentUser = null;
  let sessions = [];
  let editingId = null;
  let isSignUp = false;

  const dateKey = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const arabicNumber = (value) => new Intl.NumberFormat("ar-SA").format(value);
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  function showMessage(element, text, success = false) {
    element.textContent = text;
    element.classList.toggle("success", success);
  }

  function setAuthMode(signUp) {
    isSignUp = signUp;
    document.querySelector("#auth-heading").textContent = signUp ? "إنشاء حساب طالب" : "تسجيل الدخول";
    document.querySelector("#auth-description").textContent = signUp ? "أنشئ حسابًا لتُحفظ جلساتك وتجدها عند عودتك." : "سجّل الدخول لمتابعة جلساتك المحفوظة في حسابك.";
    document.querySelector("#auth-submit").innerHTML = signUp ? 'إنشاء الحساب <span aria-hidden="true">←</span>' : 'دخول <span aria-hidden="true">←</span>';
    document.querySelector("#auth-switch-row").firstChild.textContent = signUp ? "لديك حساب بالفعل؟ " : "ليس لديك حساب؟ ";
    document.querySelector("#auth-switch").textContent = signUp ? "تسجيل الدخول" : "إنشاء حساب جديد";
    document.querySelector("#auth-password").autocomplete = signUp ? "new-password" : "current-password";
    showMessage(authMessage, "");
  }

  function render() {
    const today = dateKey();
    const todaySessions = sessions.filter((session) => session.study_date === today).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const totalMinutes = todaySessions.reduce((sum, session) => sum + session.duration, 0);
    document.querySelector("#today-hours").textContent = arabicNumber(Math.floor(totalMinutes / 60));
    document.querySelector("#today-minutes").textContent = `${arabicNumber(totalMinutes)} دقيقة إجمالًا`;
    document.querySelector("#today-count").textContent = arabicNumber(todaySessions.length);
    document.querySelector("#session-badge").textContent = `${arabicNumber(todaySessions.length)} جلسات`;
    sessionList.innerHTML = todaySessions.map((session) => `
      <article class="session-item" data-id="${escapeHtml(session.id)}">
        <div class="session-main"><h3 class="session-title">${escapeHtml(session.subject)}</h3><p class="session-time">${new Intl.DateTimeFormat("ar-SA", { hour: "numeric", minute: "2-digit" }).format(new Date(session.created_at))}</p></div>
        <span class="session-duration">${arabicNumber(session.duration)} دقيقة</span>
        ${session.note ? `<p class="session-note">${escapeHtml(session.note)}</p>` : ""}
        <div class="session-actions"><button class="text-action edit-action" type="button">تعديل</button><button class="text-action delete delete-action" type="button">حذف</button></div>
      </article>`).join("");
    emptyState.classList.toggle("hidden", todaySessions.length > 0);
  }

  async function loadSessions() {
    showMessage(document.querySelector("#cloud-message"), "جارٍ تحميل جلساتك...");
    const { data, error } = await supabaseClient.from("study_sessions").select("id, subject, duration, note, study_date, created_at").eq("user_id", currentUser.id).eq("study_date", dateKey()).order("created_at", { ascending: false });
    if (error) {
      showMessage(document.querySelector("#cloud-message"), "تعذّر تحميل الجلسات. تحقق من إعداد جدول Supabase وسياسات الوصول.");
      console.error(error);
      return;
    }
    sessions = data || [];
    showMessage(document.querySelector("#cloud-message"), "تم تحميل جلساتك من حسابك.", true);
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
      showMessage(authMessage, result.error.message === "Invalid login credentials" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : "تعذّر إكمال الطلب. تحقق من البيانات وإعدادات تسجيل الدخول.");
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

  async function setUser(user) {
    currentUser = user;
    authPanel.classList.add("hidden");
    studentArea.classList.remove("hidden");
    signOutButton.classList.remove("hidden");
    await loadSessions();
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const subject = subjectInput.value.trim();
    const duration = Number(durationInput.value);
    const note = noteInput.value.trim();
    if (!subject) return showMessage(message, "اكتب اسم المادة أولًا.");
    if (!Number.isInteger(duration) || duration < 1 || duration > 1440) return showMessage(message, "أدخل مدة صحيحة بين دقيقة و٢٤ ساعة.");
    submitButton.disabled = true;
    showMessage(message, editingId ? "جارٍ حفظ التعديلات..." : "جارٍ حفظ الجلسة...");
    const payload = { subject, duration, note, study_date: dateKey() };
    const request = editingId
      ? supabaseClient.from("study_sessions").update(payload).eq("id", editingId).eq("user_id", currentUser.id).select().single()
      : supabaseClient.from("study_sessions").insert({ ...payload, user_id: currentUser.id }).select().single();
    const { data, error } = await request;
    submitButton.disabled = false;
    if (error) {
      showMessage(message, "تعذّر حفظ الجلسة في قاعدة البيانات. حاول مجددًا.");
      console.error(error);
      return;
    }
    const wasEditing = Boolean(editingId);
    if (wasEditing) sessions = sessions.map((session) => session.id === editingId ? data : session);
    else sessions.push(data);
    render();
    resetForm();
    showMessage(message, wasEditing ? "تم حفظ التعديلات في حسابك." : "تم حفظ الجلسة في حسابك.", true);
  });

  function resetForm() {
    form.reset();
    editingId = null;
    submitButton.innerHTML = 'حفظ الجلسة <span aria-hidden="true">←</span>';
    cancelButton.classList.add("hidden");
    document.querySelector("#form-heading").textContent = "أضف جلسة دراسة";
  }

  sessionList.addEventListener("click", async (event) => {
    const item = event.target.closest(".session-item");
    if (!item) return;
    const id = item.dataset.id;
    if (event.target.closest(".edit-action")) {
      const session = sessions.find((entry) => entry.id === id);
      if (!session) return;
      editingId = id;
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
        showMessage(message, "تعذّر حذف الجلسة من قاعدة البيانات.");
        console.error(error);
        return;
      }
      sessions = sessions.filter((entry) => entry.id !== id);
      if (editingId === id) resetForm();
      render();
      showMessage(message, "تم حذف الجلسة من حسابك.", true);
    }
  });

  cancelButton.addEventListener("click", () => { resetForm(); showMessage(message, ""); });
  document.querySelector("#auth-switch").addEventListener("click", () => setAuthMode(!isSignUp));
  authForm.addEventListener("submit", handleAuth);
  signOutButton.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) return showMessage(document.querySelector("#cloud-message"), "تعذّر تسجيل الخروج.");
    currentUser = null;
    sessions = [];
    studentArea.classList.add("hidden");
    signOutButton.classList.add("hidden");
    authPanel.classList.remove("hidden");
    authForm.reset();
    resetForm();
    setAuthMode(false);
  });

  document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("ar-SA", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  const config = window.STUDY_TRACKER_CONFIG || {};
  const configured = config.supabaseUrl && config.publishableKey && !config.supabaseUrl.includes("ضع-") && !config.publishableKey.includes("ضع-");
  if (!configured || !window.supabase?.createClient) {
    document.querySelector("#setup-note").classList.remove("hidden");
    document.querySelector("#auth-submit").disabled = true;
    document.querySelector("#auth-switch").disabled = true;
  } else {
    supabaseClient = window.supabase.createClient(config.supabaseUrl, config.publishableKey);
    supabaseClient.auth.getSession().then(({ data, error }) => {
      if (error) console.error(error);
      if (data?.session?.user) return setUser(data.session.user);
      authPanel.classList.remove("hidden");
    });
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user && !currentUser) setUser(session.user);
    });
  }
})();
