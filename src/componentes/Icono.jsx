const BASE = {
  width: 14,
  height: 14,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export default function Icono({ tipo }) {
  if (tipo === 'pin') {
    return (
      <svg {...BASE}>
        <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
        <path d="M4 22h16" opacity="0.35" />
      </svg>
    );
  }
  if (tipo === 'moneda') {
    return (
      <svg {...BASE}>
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 14.5c.7 1.4 2 2 3.7 2 2.2 0 3.5-1.1 3.5-2.7 0-4.3-7.2-1.8-7.2-6 0-1.5 1.2-2.6 3.3-2.6 1.5 0 2.8.6 3.5 1.6" />
        <path d="M12 6.5V18" />
        <path d="M6.5 6l.8 1.5 1.5.8-1.5.8-.8 1.5-.8-1.5-1.5-.8 1.5-.8z" fill="currentColor" stroke="none" opacity="0.5" />
      </svg>
    );
  }
  if (tipo === 'reloj') {
    return (
      <svg {...BASE}>
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15.5 14" />
        <path d="M12 4.5V6M18 12h-1.5M12 18v-1.5" opacity="0.5" />
      </svg>
    );
  }
  if (tipo === 'calendario') {
    return (
      <svg {...BASE}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="3" x2="8" y2="7" />
        <line x1="16" y1="3" x2="16" y2="7" />
        <circle cx="12" cy="15" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (tipo === 'usuario') {
    return (
      <svg {...BASE}>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
        <path d="M10.4 8.4c.5.4 1 .6 1.6.6s1.1-.2 1.6-.6" opacity="0.6" />
      </svg>
    );
  }
  if (tipo === 'empresa') {
    return (
      <svg {...BASE}>
        <rect x="4" y="5" width="16" height="14" rx="1.5" />
        <path d="M9 19v-4h6v4" />
        <line x1="9" y1="9" x2="15" y2="9" />
        <path d="M9 12.5h.01M15 12.5h.01M9 15.5h.01M15 15.5h.01" strokeWidth="2.6" />
      </svg>
    );
  }
  return null;
}