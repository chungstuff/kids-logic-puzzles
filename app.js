import { ICONS } from './icons.js';
import { createCompletionsStore } from './completions-store.js';

// ---------- Helpers ----------

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function iconSvg(key, size = 28) {
  const inner = ICONS[key];
  if (!inner) {
    console.warn(`[icons] missing icon key: ${key}`);
    return `<svg viewBox="0 0 40 40" width="${size}" height="${size}"></svg>`;
  }
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}">${inner}</svg>`;
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null) continue;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

// ---------- App state ----------

const state = {
  kid: null,               // 'hana' | 'perry'
  date: null,               // 'YYYY-MM-DD'
  index: null,               // parsed puzzle-index.json
  puzzle: null,               // currently loaded puzzle JSON
  docId: null,               // completions doc id for current kid+date
  cellState: new Map(),      // `${gridIdx}:${charId}:${colId}` -> 'check' | 'cross'
  attempts: 0,
  completed: false,
  store: null,               // completions store (local or Firestore)
  hintStep: 0
};

const root = document.getElementById('app');

// ---------- Boot ----------

async function boot() {
  state.store = await createCompletionsStore();

  const res = await fetch('puzzle-index.json');
  state.index = await res.json();

  // Always ask who's playing on a fresh open -- two kids share this app,
  // so auto-resuming the last player is more often wrong than convenient.
  renderKidPicker();
}

function renderKidPicker() {
  root.innerHTML = '';

  const wrap = el('div', { class: 'kid-picker' }, [
    el('div', { class: 'kid-picker-glow' }),
    el('h1', {}, "Who's playing?"),
    el('p', { class: 'kid-picker-sub' }, "Tap your picture to start today's puzzle!"),
    el('div', { class: 'kid-picker-row' }, [
      el('button', { class: 'kid-btn', 'data-kid': 'hana' }, [
        el('div', { class: 'kid-badge' }, [
          el('div', { class: 'kid-btn-icon', html: iconSvg('panda', 48) })
        ]),
        el('span', {}, 'Hana')
      ]),
      el('button', { class: 'kid-btn', 'data-kid': 'perry' }, [
        el('div', { class: 'kid-badge' }, [
          el('div', { class: 'kid-btn-icon', html: iconSvg('cat-whiskers', 48) })
        ]),
        el('span', {}, 'Perry')
      ])
    ])
  ]);
  root.appendChild(wrap);
  wrap.querySelectorAll('.kid-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      state.kid = btn.dataset.kid;
      await startApp();
    });
  });
}

async function startApp() {
  document.documentElement.setAttribute('data-kid', state.kid);
  const availableDates = Object.keys(state.index)
    .filter(d => d !== '_note' && d <= todayISO())
    .sort((a, b) => b.localeCompare(a)); // most recent first

  // "Home" date: today's puzzle if it exists yet, otherwise the most recent
  // available one. This is what the app opens to by default, and what the
  // date picker treats as "back to normal" -- everything else (any older
  // date) is a deliberate, secondary look-back.
  state.defaultDate = availableDates.includes(todayISO()) ? todayISO() : (availableDates[0] || null);
  state.date = state.defaultDate;
  state.availableDates = availableDates;
  renderShell();
  if (state.date) await loadPuzzleForDate(state.date);
}

// ---------- Shell chrome (header, kid switch, date picker, status pill) ----------

const CALENDAR_ICON = '<svg viewBox="0 0 24 24" width="19" height="19"><rect x="3.5" y="5" width="17" height="15" rx="3" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 9.5h17" stroke="currentColor" stroke-width="1.7"/><path d="M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
const CHEVRON_ICON = '<svg viewBox="0 0 24 24" width="13" height="13"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHECK_ICON_SMALL = '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M5 12.5 L10 17.5 L19 6.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function renderShell() {
  root.innerHTML = '';

  const kidName = state.kid === 'hana' ? 'Hana' : 'Perry';
  const kidIcon = state.kid === 'hana' ? 'panda' : 'cat-whiskers';
  const hasHistory = state.availableDates.length > 1;

  // Right side of the header is a small cluster, not one control: the status
  // pill (always present once a puzzle's loaded -- see buildStatusPillEl)
  // sits next to the calendar-icon button (only present once there's a past
  // date to browse to -- same hasHistory gate as before this change). The
  // date itself no longer lives in the header at all; it's a plain-text
  // eyebrow above the puzzle title instead (see renderPuzzle) -- never a tap
  // target there, per Chris's 2026-10-17 clarification.
  const headerRight = el('div', { class: 'header-right' }, [
    el('div', { id: 'statusPillSlot' }),
    hasHistory
      ? el('button', { class: 'calendar-btn', id: 'historyBtn', 'aria-label': 'See past puzzles', html: CALENDAR_ICON })
      : null
  ]);

  const header = el('div', { class: 'app-header' }, [
    el('button', { class: 'avatar-switch', id: 'kidSwitch', 'aria-label': `Playing as ${kidName} -- tap to switch` }, [
      el('span', { class: 'avatar-switch-badge', html: iconSvg(kidIcon, 24) }),
      el('span', { class: 'avatar-switch-name' }, kidName),
      el('span', { class: 'avatar-switch-chevron', html: CHEVRON_ICON })
    ]),
    headerRight
  ]);

  const puzzleHost = el('div', { id: 'puzzleHost' });

  root.appendChild(header);
  root.appendChild(puzzleHost);

  document.getElementById('kidSwitch').addEventListener('click', () => {
    document.documentElement.removeAttribute('data-kid');
    renderKidPicker();
  });

  const historyBtn = document.getElementById('historyBtn');
  if (historyBtn) {
    historyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDatePanel(header);
    });
  }

  refreshStatusPill();
}

let datePanelEl = null;

function closeDatePanel() {
  if (datePanelEl) { datePanelEl.remove(); datePanelEl = null; }
  document.removeEventListener('click', closeDatePanel);
  document.removeEventListener('keydown', onDatePanelKey);
}

function onDatePanelKey(e) {
  if (e.key === 'Escape') closeDatePanel();
}

function toggleDatePanel(header) {
  if (datePanelEl) { closeDatePanel(); return; }

  const panel = el('div', { class: 'date-panel' }, [
    el('p', { class: 'date-panel-title' }, 'Past puzzles'),
    el('div', { class: 'date-panel-list' }, state.availableDates.map(d => {
      const isToday = d === todayISO();
      const isActive = d === state.date;
      return el('button', {
        class: 'date-panel-row' + (isActive ? ' active' : ''),
        'data-date': d
      }, [
        el('span', { class: 'date-panel-label' }, isToday ? `Today — ${formatDateLabel(d)}` : formatDateLabel(d)),
        isActive ? el('span', { class: 'date-panel-check', html: CHECK_ICON_SMALL }) : null
      ]);
    }))
  ]);

  panel.querySelectorAll('.date-panel-row').forEach(row => {
    row.addEventListener('click', async (e) => {
      e.stopPropagation();
      state.date = row.dataset.date;
      closeDatePanel();
      await loadPuzzleForDate(state.date);
    });
  });

  header.appendChild(panel);
  datePanelEl = panel;
  // Defer listener registration so the click that opened the panel doesn't also close it.
  setTimeout(() => {
    document.addEventListener('click', closeDatePanel);
    document.addEventListener('keydown', onDatePanelKey);
  }, 0);
}

function formatDateLabel(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

// ---------- Status pill (final: one fixed-size capsule, fill-based) ----------

// Deliberately NOT the same definition onCheck() uses. An earlier version
// counted a row as "filled" the moment it had any single checked cell --
// which meant a kid could tap exactly one box per row (no elimination, no
// thought) and see the pill claim 100%. Caught in real use on 2026-10-18:
// a row with two conflicting checks and two still-blank cells still read
// as "done."
//
// This version is a plain box-filler: every cell the kid has marked at all
// (check OR cross) counts, divided by every cell in the puzzle (across all
// grids). It never looks at grid.solution, so it can't leak correctness the
// way a solved-based percent would -- but it also can't be faked by a
// handful of careless taps, since reaching a high percent means having
// actually gone through the grid, not just picked one answer per row.
function computeProgress() {
  const puzzle = state.puzzle;
  if (!puzzle) return { status: 'new', percent: 0 };
  if (state.completed) return { status: 'completed', percent: 100 };

  const totalBoxes = puzzle.grids.reduce((sum, grid) => sum + puzzle.characters.length * grid.cols.length, 0);
  const filled = state.cellState.size; // every marked cell, check or cross -- blank cells are never stored in the map
  const percent = totalBoxes ? Math.round((filled / totalBoxes) * 100) : 0;
  return { status: filled > 0 ? 'in-progress' : 'new', percent };
}

const CHECK_SVG_WHITE = '<svg viewBox="0 0 24 24" width="12" height="12"><path d="M5 12.5 L10 17.5 L19 6.5" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// One fixed-size capsule (same bounding box always -- see .status-capsule in
// styles.css) for all three states. A fill bar grows left-to-right inside it
// as a real, physical proportion of totalNeeded; the capsule itself never
// changes shape or size, only how much of it is colored in.
//
// Label text/icon is rendered TWICE, stacked exactly on top of itself: a
// base copy colored for legibility against the neutral empty track, and an
// identical white copy clipped (via clip-path) to only the filled portion.
// Wherever the fill has passed underneath, the white copy covers the base
// copy pixel-for-pixel, so the number (or "New"/"Solved") reads cleanly
// whether it's sitting on bare track, on the colored fill, or straddling
// the boundary between them -- verified at 6%, ~44%, 94% and 100% below.
function buildStatusCapsule({ status, percent }) {
  const pct = status === 'completed' ? 100 : percent;
  const isCompleted = status === 'completed';
  const label = isCompleted ? 'Solved' : (status === 'new' ? 'New' : `${percent}%`);
  const ariaLabel = isCompleted ? 'Puzzle solved' : (status === 'new' ? 'Not started yet' : `${percent}% filled in`);
  const checkIcon = isCompleted ? el('span', { class: 'capsule-check', html: CHECK_SVG_WHITE }) : null;

  return el('div', {
    class: 'status-pill status-capsule' + (isCompleted ? ' is-completed' : status === 'new' ? ' is-new' : ' is-progress'),
    'aria-label': ariaLabel
  }, [
    el('div', { class: 'capsule-fill', style: `width:${pct}%` }),
    el('span', { class: 'capsule-text capsule-text-base' }, [label]),
    el('span', { class: 'capsule-text capsule-text-over', style: `clip-path: inset(0 ${100 - pct}% 0 0)` }, [
      checkIcon,
      label
    ].filter(Boolean))
  ]);
}

function buildStatusPillEl() {
  return buildStatusCapsule(computeProgress());
}

function refreshStatusPill() {
  const slot = document.getElementById('statusPillSlot');
  if (!slot) return;
  slot.innerHTML = '';
  slot.appendChild(buildStatusPillEl());
}

// ---------- Puzzle loading ----------

async function loadPuzzleForDate(date) {
  const entry = state.index[date];
  const puzzleHost = document.getElementById('puzzleHost');
  if (!entry || !entry[state.kid]) {
    puzzleHost.innerHTML = '';
    puzzleHost.appendChild(el('p', { class: 'muted' }, 'No puzzle for this date yet.'));
    state.puzzle = null;
    refreshStatusPill();
    return;
  }

  const res = await fetch(entry[state.kid]);
  state.puzzle = await res.json();
  state.cellState = new Map();
  state.hintStep = 0;
  state.attempts = 0;
  state.docId = `${state.kid}-${date}`;

  const record = await state.store.get(state.docId);
  state.completed = !!(record && record.completed);
  state.attempts = (record && record.attempts) || 0;

  renderPuzzle();
  refreshStatusPill();
}

// ---------- Puzzle rendering ----------

function renderPuzzle() {
  const host = document.getElementById('puzzleHost');
  host.innerHTML = '';

  const puzzle = state.puzzle;

  const heroIcon = (puzzle.characters && puzzle.characters[0] && puzzle.characters[0].icon) || 'stargazing';
  const heroTitle = puzzle.title || puzzle.theme || 'Today\'s Puzzle';

  if (state.date !== state.defaultDate) {
    host.appendChild(el('div', { class: 'viewing-past-banner' }, [
      el('span', {}, `📅 Viewing ${formatDateLabel(state.date)}`),
      el('button', { class: 'back-to-today-btn', id: 'backToTodayBtn' }, 'Back to today')
    ]));
  }

  host.appendChild(el('div', { class: 'mystery' }, [
    el('div', { class: 'puzzle-hero' }, [
      el('div', { class: 'puzzle-hero-badge', html: iconSvg(heroIcon, 32) }),
      el('div', { class: 'puzzle-hero-text' }, [
        // Plain static eyebrow -- never a tap target. The calendar-icon
        // button in the header is still how you get to past puzzles.
        el('p', { class: 'puzzle-date-eyebrow' }, formatDateLabel(state.date).toUpperCase()),
        el('h2', {}, heroTitle),
        puzzle.intro ? el('p', { class: 'muted' }, puzzle.intro) : null
      ])
    ]),
    state.completed ? el('div', { class: 'solved-banner' }, '✅ Already solved — tap Reset to play again.') : null,
    el('div', { class: 'clue-list' }, puzzle.clues.map((clue, i) =>
      el('div', { class: 'clue' }, [
        el('div', { class: 'badge' }, String(i + 1)),
        el('p', {}, clue)
      ])
    ))
  ]));

  puzzle.grids.forEach((grid, gridIdx) => {
    host.appendChild(renderGrid(puzzle, grid, gridIdx));
  });

  host.appendChild(el('div', { class: 'legend' }, [
    el('span', {}, '👆 tap once: ✓'),
    el('span', {}, 'tap twice: ✗'),
    el('span', {}, 'tap again: clear')
  ]));

  host.appendChild(el('div', { class: 'controls' }, [
    el('button', { class: 'btn-ghost', id: 'hintBtn' }, '💡 Give me a hint'),
    el('button', { class: 'btn-primary', id: 'checkBtn' }, 'Check my answer'),
    el('button', { class: 'btn-reset', id: 'resetBtn' }, 'Reset')
  ]));

  host.appendChild(el('div', { class: 'hint-box', id: 'hintBox' }));
  host.appendChild(el('div', { class: 'feedback neutral', id: 'feedback' }));

  document.getElementById('hintBtn').addEventListener('click', onHint);
  document.getElementById('checkBtn').addEventListener('click', onCheck);
  document.getElementById('resetBtn').addEventListener('click', showResetConfirm);
  const backBtn = document.getElementById('backToTodayBtn');
  if (backBtn) {
    backBtn.addEventListener('click', async () => {
      state.date = state.defaultDate;
      await loadPuzzleForDate(state.date);
    });
  }
}

function renderGrid(puzzle, grid, gridIdx) {
  const wrap = el('div', { class: 'grid-section' });
  wrap.appendChild(el('h3', {}, grid.colCategory.charAt(0).toUpperCase() + grid.colCategory.slice(1)));

  const gridWrap = el('div', { class: 'grid-wrap' });
  const table = el('table', { class: 'puzzle-grid' });

  const thead = el('thead');
  const headRow = el('tr', {}, [
    el('th'),
    ...grid.cols.map(col => el('th', {}, el('div', { class: 'col-head' }, [
      el('div', { html: iconSvg(col.icon) }),
      el('span', {}, col.label)
    ])))
  ]);
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = el('tbody');
  puzzle.characters.forEach(ch => {
    const tr = el('tr');
    tr.appendChild(el('th', { class: 'row-label' }, el('div', { class: 'row-head' }, [
      el('span', {}, ch.label),
      el('div', { html: iconSvg(ch.icon) })
    ])));
    grid.cols.forEach(col => {
      const key = `${gridIdx}:${ch.id}:${col.id}`;
      const td = el('td', { class: 'cell', 'data-key': key });
      applyCellVisual(td, state.cellState.get(key));
      td.addEventListener('click', () => {
        const current = state.cellState.get(key);
        const next = current === undefined ? 'check' : current === 'check' ? 'cross' : undefined;
        if (next === undefined) state.cellState.delete(key); else state.cellState.set(key, next);
        applyCellVisual(td, next);
        clearFeedback();
        refreshStatusPill();
      });
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  gridWrap.appendChild(table);
  wrap.appendChild(gridWrap);
  return wrap;
}

const CHECK_MARK_SVG = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 12.5 L10 17.5 L19 6.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CROSS_MARK_SVG = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';

function applyCellVisual(td, cellState) {
  td.dataset.state = cellState || 'blank';
  td.innerHTML = cellState === 'check' ? CHECK_MARK_SVG : cellState === 'cross' ? CROSS_MARK_SVG : '';
  td.classList.remove('pop');
  if (cellState === 'check' || cellState === 'cross') {
    // restart the pop animation even if the same state is reapplied
    void td.offsetWidth;
    td.classList.add('pop');
  }
}

function clearFeedback() {
  const fb = document.getElementById('feedback');
  if (fb) { fb.textContent = ''; fb.className = 'feedback neutral'; }
}

// ---------- Hint / Check / Reset ----------

function onHint() {
  const hints = state.puzzle.hints;
  const box = document.getElementById('hintBox');
  box.textContent = hints[state.hintStep % hints.length];
  box.classList.add('show');
  state.hintStep++;
}

async function onCheck() {
  const puzzle = state.puzzle;
  let correct = 0, wrong = 0, total = 0;
  const totalNeeded = puzzle.characters.length * puzzle.grids.length;

  puzzle.grids.forEach((grid, gridIdx) => {
    puzzle.characters.forEach(ch => {
      const key = `${gridIdx}:${ch.id}`;
      // find any 'check' cell in this row for this grid
      for (const col of grid.cols) {
        const cellKey = `${gridIdx}:${ch.id}:${col.id}`;
        if (state.cellState.get(cellKey) === 'check') {
          total++;
          if (grid.solution[ch.id] === col.id) correct++; else wrong++;
        }
      }
    });
  });

  state.attempts++;
  const feedback = document.getElementById('feedback');

  if (total < totalNeeded) {
    feedback.textContent = `You've matched ${correct} so far — keep going!`;
    feedback.className = 'feedback neutral';
  } else if (correct === totalNeeded && wrong === 0) {
    feedback.innerHTML = '🎉 You solved it!';
    feedback.className = 'feedback good';
    state.completed = true;
    await state.store.set(state.docId, {
      completed: true,
      completedAt: new Date().toISOString(),
      attempts: state.attempts
    });
    showCelebration();
  } else {
    feedback.innerHTML = `Not quite yet — ${correct} of ${totalNeeded} are right. Keep trying!`;
    feedback.className = 'feedback bad';
    await state.store.set(state.docId, {
      completed: false,
      attempts: state.attempts
    });
  }
  refreshStatusPill();
}

async function onReset() {
  state.cellState = new Map();
  state.hintStep = 0;
  state.attempts = 0;
  state.completed = false;
  await state.store.delete(state.docId);
  const entry = state.index[state.date];
  renderPuzzle(entry.theme);
  refreshStatusPill();
}

// Added 2026-10-19: Reset used to wipe progress on a single tap, no
// confirmation at all -- real risk of an accidental tap erasing real
// progress. This is a cute, non-scary confirm step (see .confirm-card in
// styles.css for why it reuses the celebrate overlay's visual language
// instead of a native confirm()), not a warning dialog -- Reset has never
// been styled as alarming here and this doesn't change that.
function showResetConfirm() {
  const overlay = el('div', {
    class: 'confirm-overlay', id: 'resetConfirmOverlay',
    role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Clear the board?'
  }, [
    el('div', { class: 'confirm-card' }, [
      el('div', { class: 'confirm-icon' }, '🧹'),
      el('h2', {}, 'Clear the board?'),
      el('p', {}, "Poof! All your checks and crosses will disappear and you'll start fresh."),
      el('div', { class: 'confirm-actions' }, [
        el('button', { class: 'btn-ghost', id: 'resetCancelBtn' }, 'Never mind!'),
        el('button', { class: 'btn-primary', id: 'resetConfirmBtn' }, 'Yes, clear it!')
      ])
    ])
  ]);
  document.body.appendChild(overlay);

  const close = () => {
    overlay.remove();
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);

  document.getElementById('resetCancelBtn').addEventListener('click', close);
  document.getElementById('resetConfirmBtn').addEventListener('click', async () => {
    close();
    await onReset();
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}

function launchConfetti(count = 44) {
  const colors = ['#2E8C7F', '#E8923C', '#4F9BD9', '#8E4C6B'];
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = (2 + Math.random() * 1.5) + 's';
    piece.style.animationDelay = (Math.random() * 0.4) + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

function showCelebration() {
  const kidName = state.kid === 'hana' ? 'Hana' : 'Perry';
  const kidIcon = state.kid === 'hana' ? 'panda' : 'cat-whiskers';

  const overlay = el('div', { class: 'celebrate-overlay', id: 'celebrateOverlay' }, [
    el('div', { class: 'celebrate-card' }, [
      el('div', { class: 'celebrate-badge', html: iconSvg(kidIcon, 54) }),
      el('h2', {}, 'You solved it!'),
      el('p', {}, `Great job, ${kidName}! 🎉`),
      el('button', { class: 'btn-primary celebrate-close', id: 'celebrateClose' }, 'Awesome!')
    ])
  ]);
  document.body.appendChild(overlay);
  launchConfetti(70);

  const close = () => overlay.remove();
  document.getElementById('celebrateClose').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
}

boot();
