// ============================================================
//  auth.js — Firebase Authentication + Cloud Firestore
// ============================================================

const Auth = (() => {
  const auth = firebase.auth();
  const db   = firebase.firestore();

  // Map Firebase error codes to friendly messages
  const ERROR_MESSAGES = {
    'auth/email-already-in-use':  'An account with this email already exists.',
    'auth/wrong-password':        'Incorrect password.',
    'auth/user-not-found':        'No account found with this email.',
    'auth/invalid-credential':    'Invalid email or password.',
    'auth/weak-password':         'Password should be at least 6 characters.',
    'auth/invalid-email':         'Please enter a valid email address.',
    'auth/too-many-requests':     'Too many failed attempts. Please try again later.',
    'auth/requires-recent-login': 'Please sign out and sign in again before doing this.',
    'auth/network-request-failed':'Network error. Check your internet connection.',
  };

  function friendlyError(err) {
    return ERROR_MESSAGES[err.code] || err.message || 'An unexpected error occurred.';
  }

  // ── Register ────────────────────────────────────────────────
  async function register({ name, email, password, age, gender, conditions }) {
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection('users').doc(cred.user.uid).set({
        name,
        email,
        age:        parseInt(age),
        gender:     gender || '',
        conditions: conditions || [],
        joinedAt:   new Date().toISOString(),
        history:    [],
        feedback:   [],
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, msg: friendlyError(err) };
    }
  }

  // ── Login ───────────────────────────────────────────────────
  async function login(email, password) {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      return { ok: true };
    } catch (err) {
      return { ok: false, msg: friendlyError(err) };
    }
  }

  // ── Logout ──────────────────────────────────────────────────
  async function logout() {
    await auth.signOut();
    window.location.href = 'login.html';
  }

  // ── Get user profile from Firestore ─────────────────────────
  async function getUserProfile(uid) {
    try {
      const doc = await db.collection('users').doc(uid).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (err) {
      return null;
    }
  }

  // ── Update profile fields ───────────────────────────────────
  async function updateUser(data) {
    const user = auth.currentUser;
    if (!user) return;
    await db.collection('users').doc(user.uid).update(data);
  }

  // ── Add a history entry (max 50 kept) ──────────────────────
  async function addHistory(entry) {
    const user = auth.currentUser;
    if (!user) return;
    const ref = db.collection('users').doc(user.uid);
    const doc = await ref.get();
    const history = [entry, ...(doc.data()?.history || [])].slice(0, 50);
    await ref.update({ history });
  }

  // ── Add a feedback entry ────────────────────────────────────
  async function addFeedback(entry) {
    const user = auth.currentUser;
    if (!user) return;
    const ref = db.collection('users').doc(user.uid);
    const doc = await ref.get();
    const feedback = [...(doc.data()?.feedback || []), entry];
    await ref.update({ feedback });
  }

  // ── Send password reset email ───────────────────────────────
  async function sendPasswordReset(email) {
    try {
      await auth.sendPasswordResetEmail(email);
      return { ok: true };
    } catch (err) {
      return { ok: false, msg: friendlyError(err) };
    }
  }

  // ── Delete current user account and Firestore data ─────────
  async function deleteCurrentUser() {
    const user = auth.currentUser;
    if (!user) return { ok: false, msg: 'Not logged in.' };
    try {
      await db.collection('users').doc(user.uid).delete();
      await user.delete();
      window.location.href = 'index.html';
      return { ok: true };
    } catch (err) {
      return { ok: false, msg: friendlyError(err) };
    }
  }

  // ── Auth state listener ─────────────────────────────────────
  function onAuthStateChanged(cb) {
    return auth.onAuthStateChanged(cb);
  }

  // ── Get current Firebase user (sync, may be null on load) ───
  function getCurrentFirebaseUser() {
    return auth.currentUser;
  }

  return {
    register,
    login,
    logout,
    getUserProfile,
    updateUser,
    addHistory,
    addFeedback,
    sendPasswordReset,
    deleteCurrentUser,
    onAuthStateChanged,
    getCurrentFirebaseUser,
  };
})();
