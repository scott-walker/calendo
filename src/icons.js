function svg(inner, size = 14) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

export const sunIcon = (size) => svg(`
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
`, size);

export const moonIcon = (size) => svg(`
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
`, size);

export const bedIcon = (size) => svg(`
  <path d="M2 17V7"/>
  <path d="M2 12h20"/>
  <path d="M22 17V12"/>
  <path d="M6 8.5a2.5 2.5 0 1 0 0 3h0"/>
  <path d="M2 17h20"/>
  <path d="M22 12a5 5 0 0 0-5-5H9"/>
`, size);

export const lotusIcon = (size) => svg(`
  <circle cx="12" cy="4.5" r="2.5"/>
  <path d="M12 7v4"/>
  <path d="M8 14h8"/>
  <path d="M12 11c-3 0-5 2-6 3"/>
  <path d="M12 11c3 0 5 2 6 3"/>
  <path d="M8 14c-1.5 1.5-3 2-4 2"/>
  <path d="M16 14c1.5 1.5 3 2 4 2"/>
  <path d="M9 18l3 3 3-3"/>
`, size);
