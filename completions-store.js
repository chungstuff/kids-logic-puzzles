// Abstraction over where "who solved what" lives.
//
// Until real Firebase keys are added to firebase-config.js, this falls back
// to localStorage -- fully functional for testing on one device, just not
// synced across devices yet. Once real keys land, it switches to Firestore
// automatically, no other code needs to change.
//
// Interface (both implementations):
//   get(docId)    -> { completed, completedAt, attempts } | null
//   set(docId, data) -> void
//   delete(docId) -> void

import { firebaseConfig, isPlaceholder } from './firebase-config.js';

class LocalCompletionsStore {
  _key(docId) { return `completion:${docId}`; }
  async get(docId) {
    try {
      const raw = localStorage.getItem(this._key(docId));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  async set(docId, data) {
    try { localStorage.setItem(this._key(docId), JSON.stringify(data)); } catch (e) { /* best-effort */ }
  }
  async delete(docId) {
    try { localStorage.removeItem(this._key(docId)); } catch (e) { /* best-effort */ }
  }
}

class FirestoreCompletionsStore {
  constructor(db, doc, getDoc, setDoc, deleteDoc) {
    this.db = db; this.doc = doc; this.getDoc = getDoc; this.setDoc = setDoc; this.deleteDoc = deleteDoc;
  }
  async get(docId) {
    const ref = this.doc(this.db, 'completions', docId);
    const snap = await this.getDoc(ref);
    return snap.exists() ? snap.data() : null;
  }
  async set(docId, data) {
    const ref = this.doc(this.db, 'completions', docId);
    await this.setDoc(ref, data);
  }
  async delete(docId) {
    const ref = this.doc(this.db, 'completions', docId);
    await this.deleteDoc(ref);
  }
}

export async function createCompletionsStore() {
  if (isPlaceholder) {
    console.warn(
      '[completions-store] No Firebase config yet -- using a localStorage fallback. ' +
      'Completions work on this device/browser but will NOT sync across devices until ' +
      'real keys are pasted into firebase-config.js.'
    );
    return new LocalCompletionsStore();
  }
  // If the Firestore SDK can't load (flaky wifi, a restrictive network, Firebase
  // hiccup, etc.) the whole app must still boot -- fall back to localStorage
  // rather than leaving the kid staring at a blank screen.
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js');
    const { getFirestore, doc, getDoc, setDoc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    return new FirestoreCompletionsStore(db, doc, getDoc, setDoc, deleteDoc);
  } catch (e) {
    console.warn('[completions-store] Firestore failed to load, falling back to localStorage for this session:', e);
    return new LocalCompletionsStore();
  }
}
