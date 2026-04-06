import { saveAnchor } from './storage.js';
import { getPhase, PHASES } from './schedule.js';
import { sunIcon, moonIcon, bedIcon, lotusIcon } from './icons.js';

const phaseIcons = { sun: sunIcon, moon: moonIcon, bed: bedIcon, lotus: lotusIcon };

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

let editMode = false;
let rerenderRef = null;

export function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isConfigured() {
  return getPhase('2000-01-01') !== null;
}

// -- Bottom Sheet --

function showBottomSheet(content, { onClose } = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'sheet-overlay';

  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  sheet.innerHTML = content;
  overlay.appendChild(sheet);
  document.body.appendChild(overlay);

  // trigger animation
  requestAnimationFrame(() => {
    overlay.classList.add('open');
  });

  function close() {
    overlay.classList.remove('open');
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
    if (onClose) onClose();
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  return { overlay, sheet, close };
}

// -- Confirm edit mode --

function askConfirmEdit() {
  const { sheet, close } = showBottomSheet(`
    <div class="sheet-handle"></div>
    <h2 class="sheet-title">Изменить график?</h2>
    <p class="sheet-text">Выберите любой день и укажите, какая это смена. Весь график пересчитается автоматически.</p>
    <button class="sheet-btn sheet-btn-primary" data-action="confirm">Настроить график</button>
    <button class="sheet-btn sheet-btn-secondary" data-action="cancel">Отмена</button>
  `);

  sheet.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    close();
    enterEditMode();
  });
  sheet.querySelector('[data-action="cancel"]').addEventListener('click', close);
}

function enterEditMode() {
  editMode = true;
  document.body.classList.add('edit-mode');
  if (rerenderRef) rerenderRef();
}

function exitEditMode() {
  editMode = false;
  document.body.classList.remove('edit-mode');
  if (rerenderRef) rerenderRef();
}

// -- Phase picker --

function showPhasePicker(key) {
  let btns = '';
  for (const p of PHASES) {
    const icon = p.icon ? phaseIcons[p.icon](18) : '';
    btns += `<button class="sheet-btn phase-pick ${p.class}" data-phase="${p.id}">${icon}<span>${p.name}</span></button>`;
  }

  const { sheet, close } = showBottomSheet(`
    <div class="sheet-handle"></div>
    <h2 class="sheet-title">Какая это смена?</h2>
    <p class="sheet-text">${formatDateRu(key)}</p>
    <div class="phase-grid">${btns}</div>
    <button class="sheet-btn sheet-btn-secondary" data-action="cancel">Отмена</button>
  `);

  for (const btn of sheet.querySelectorAll('[data-phase]')) {
    btn.addEventListener('click', () => {
      saveAnchor(key, Number(btn.dataset.phase));
      close();
      exitEditMode();
    });
  }
  sheet.querySelector('[data-action="cancel"]').addEventListener('click', () => {
    close();
    exitEditMode();
  });
}

function formatDateRu(key) {
  const [y, m, d] = key.split('-').map(Number);
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

// -- Render --

export function renderCalendar(year, month, rerender) {
  rerenderRef = rerender;
  const now = new Date();
  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());
  const configured = isConfigured();

  document.getElementById('monthTitle').textContent =
    `${MONTHS[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const container = document.getElementById('days');
  container.innerHTML = '';

  for (let i = 0; i < startDow; i++) {
    const el = document.createElement('div');
    el.className = 'day empty';
    container.appendChild(el);
  }

  let workCount = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(year, month, d);
    const phase = configured ? getPhase(key) : null;
    const isToday = key === todayKey;

    const isWorking = phase && (phase.id === 0 || phase.id === 1);
    if (isWorking) workCount++;

    const dow = new Date(year, month, d).getDay();
    const isWeekend = dow === 0 || dow === 6;

    const el = document.createElement('div');
    el.className = 'day'
      + (phase ? ` ${phase.class}` : '')
      + (isToday ? ' today' : '')
      + (isWeekend ? ' weekend' : '');

    const num = document.createElement('span');
    num.className = 'day-num';
    num.textContent = d;
    el.appendChild(num);

    if (phase) {
      const lbl = document.createElement('span');
      lbl.className = 'day-label';
      if (phase.icon) {
        lbl.innerHTML = phaseIcons[phase.icon](12);
      } else if (phase.label) {
        lbl.textContent = phase.label;
      }
      el.appendChild(lbl);
    }

    el.addEventListener('click', () => {
      if (editMode) {
        showPhasePicker(key);
      }
    });

    container.appendChild(el);
  }

  // Stats
  const statsEl = document.getElementById('stats');
  if (editMode) {
    statsEl.textContent = 'Выберите день';
  } else if (configured) {
    statsEl.innerHTML = `Рабочих смен <span class="badge">${workCount}</span> из <span class="badge">${daysInMonth}</span>`;
  } else {
    statsEl.textContent = '';
  }

  // Setup button
  renderSetupButton(configured);
}

function renderSetupButton(configured) {
  let btn = document.getElementById('setupBtn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'setupBtn';
    const todayBtn = document.getElementById('todayBtn');
    todayBtn.parentNode.insertBefore(btn, todayBtn);
  }

  if (editMode) {
    btn.textContent = 'Отменить настройку';
    btn.className = 'action-btn action-btn-cancel';
    btn.onclick = () => exitEditMode();
  } else {
    btn.textContent = configured ? 'Изменить график' : 'Настроить график';
    btn.className = 'action-btn action-btn-setup';
    btn.onclick = () => {
      if (configured) {
        askConfirmEdit();
      } else {
        enterEditMode();
      }
    };
  }
}
