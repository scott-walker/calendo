import './style.css';
import { renderCalendar } from './calendar.js';
import { init as initHaptic } from './haptic.js';

initHaptic();

let currentYear, currentMonth;

function rerender() {
  renderCalendar(currentYear, currentMonth, rerender);
}

function goToToday() {
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth();
  rerender();
  const todayEl = document.querySelector('.day.today');
  if (todayEl) {
    todayEl.classList.remove('pulse');
    void todayEl.offsetWidth;
    todayEl.classList.add('pulse');
  }
}

document.getElementById('prev').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  rerender();
});

document.getElementById('next').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  rerender();
});

document.getElementById('todayBtn').addEventListener('click', goToToday);

goToToday();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
