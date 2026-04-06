const tapSound = new Audio('/tap.mp3');
tapSound.volume = 0.4;

export function tap(ms = 12) {
  if (navigator.vibrate) {
    navigator.vibrate(ms);
  }
  tapSound.currentTime = 0;
  tapSound.play().catch(() => {});
}

export function init() {
  document.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('button, .day:not(.empty)');
    if (el) tap();
  });
}
