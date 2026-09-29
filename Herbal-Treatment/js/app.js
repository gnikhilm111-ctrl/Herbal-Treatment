// ============================================================
//  app.js — Shared Utilities: Dark Mode, Nav, Language, Toast
// ============================================================

/* ── Dark Mode ───────────────────────────────────────────── */
const Theme = (() => {
  function get()  { return localStorage.getItem('vo_theme') || 'light'; }
  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('vo_theme', t);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.innerHTML = t === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }
  function toggle() { apply(get() === 'dark' ? 'light' : 'dark'); }
  function init()   { apply(get()); }
  return { init, toggle, get };
})();

/* ── Language (English only) ─────────────────────────────── */
const Lang = (() => {
  function get()  { return 'en'; }
  function t(key) { return key; }
  function init() {}
  return { init, get, t };
})();

/* ── Toast Notifications ─────────────────────────────────── */
function showToast(msg, type = 'success', duration = 3000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('toast-show'), 10);
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ── Nav Active State ────────────────────────────────────── */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path);
  });
}

/* ── On DOM Ready ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  Lang.init();
  setActiveNav();

  // Populate nav avatar based on Firebase auth state
  if (typeof Auth !== 'undefined') {
    Auth.onAuthStateChanged(async (fbUser) => {
      const avatarEl  = document.getElementById('navAvatar');
      const logoutBtn = document.getElementById('logoutBtn');
      const signInBtn = document.getElementById('navSignIn');

      if (fbUser) {
        const profile = await Auth.getUserProfile(fbUser.uid);
        if (avatarEl && profile) {
          avatarEl.textContent = profile.name.charAt(0).toUpperCase();
          avatarEl.style.display = '';
        }
        if (logoutBtn) logoutBtn.style.display = '';
        if (signInBtn) signInBtn.style.display = 'none';
      } else {
        if (avatarEl)  avatarEl.style.display  = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (signInBtn) signInBtn.style.display = '';
      }
    });
  }

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', Theme.toggle);

const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => Auth.logout());

  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
    });
  }
});

/* ── Utility Helpers ─────────────────────────────────────── */
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
// ! open /Users/varma11/Downloads/Herbal-Treatment/index.htmlclr