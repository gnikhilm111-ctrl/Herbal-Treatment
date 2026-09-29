// ============================================================
//  reminders.js — Remedy Reminder Notifications
// ============================================================

const Reminders = (() => {
  const db = firebase.firestore();

  // ── Request notification permission ─────────────────────────
  async function requestPermission() {
    if (!('Notification' in window)) {
      showToast('Your browser does not support notifications.', 'error');
      return false;
    }
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') {
      showToast('Notifications are blocked. Please enable them in your browser settings.', 'warning', 5000);
      return false;
    }
    const result = await Notification.requestPermission();
    return result === 'granted';
  }

  // ── Save a reminder to Firestore ────────────────────────────
  async function save(uid, reminder) {
    const ref = db.collection('users').doc(uid);
    const doc = await ref.get();
    const existing = doc.data()?.reminders || [];
    await ref.update({ reminders: [...existing, reminder] });
  }

  // ── Get all active (non-expired) reminders ──────────────────
  async function getActive(uid) {
    const doc = await db.collection('users').doc(uid).get();
    const today = todayStr();
    return (doc.data()?.reminders || []).filter(r => r.active && r.endDate >= today);
  }

  // ── Cancel a reminder ───────────────────────────────────────
  async function cancel(uid, reminderId) {
    const ref = db.collection('users').doc(uid);
    const doc = await ref.get();
    const reminders = (doc.data()?.reminders || []).map(r =>
      r.id === reminderId ? { ...r, active: false } : r
    );
    await ref.update({ reminders });
  }

  // ── Schedule today's notifications via setTimeout ───────────
  function scheduleToday(reminders) {
    if (Notification.permission !== 'granted') return;
    const now  = new Date();
    const today = todayStr();

    reminders.forEach(r => {
      if (!r.active || today > r.endDate) return;

      const startDate = new Date(r.startDate + 'T00:00:00');
      const todayDate = new Date(today    + 'T00:00:00');
      const dayNum    = Math.round((todayDate - startDate) / 86400000) + 1;

      r.times.forEach(time => {
        const [h, m] = time.split(':').map(Number);
        const fireAt  = new Date();
        fireAt.setHours(h, m, 0, 0);
        const delay = fireAt - now;
        if (delay > 0 && delay < 86400000) {
          setTimeout(() => {
            new Notification('🌿 VanaOshadhi Reminder', {
              body: `Time to take your ${r.remedyName}. ${r.dosage}. Day ${dayNum} of ${r.daysTotal}.`,
              tag:  r.id + '-' + time,
            });
          }, delay);
        }
      });
    });
  }

  // ── Parse "5-7 days" or "2 weeks" → number of days ─────────
  function parseDays(durationStr) {
    if (!durationStr) return 7;
    const match = durationStr.match(/(\d+)(?:-(\d+))?\s*(day|week)/i);
    if (!match) return 7;
    const max = parseInt(match[2] || match[1]);
    return match[3].toLowerCase().startsWith('w') ? max * 7 : max;
  }

  // ── Calculate end date given start + days ───────────────────
  function endDate(startStr, days) {
    const d = new Date(startStr + 'T00:00:00');
    d.setDate(d.getDate() + days - 1);
    return d.toISOString().split('T')[0];
  }

  // ── Today as YYYY-MM-DD ──────────────────────────────────────
  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  // ── Unique ID for each reminder ─────────────────────────────
  function makeId() {
    return 'rem_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  }

  // ── Format YYYY-MM-DD to readable string ────────────────────
  function formatDate(str) {
    return new Date(str + 'T00:00:00').toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
  }

  return { requestPermission, save, getActive, cancel, scheduleToday, parseDays, endDate, todayStr, makeId, formatDate };
})();
