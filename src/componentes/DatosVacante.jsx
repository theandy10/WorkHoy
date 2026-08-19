import { CATEGORIAS } from '../datos/datosIniciales';

function Icono({ tipo }) {
  const base = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  if (tipo === 'tag') {
    return (
      <svg {...base}>
        <circle cx="8" cy="8" r="2" />
        <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-7 7-9-9z" />
      </svg>
    );
  }
  if (tipo === 'reloj') {
    return (
      <svg {...base}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    );
  }
  if (tipo === 'moneda') {
    return (
      <svg {...base}>
        <circle cx="12" cy="12" r="9" />
        <line x1="9" y1="14" x2="15" y2="9" />
        <circle cx="12" cy="12" r="0.6" fill="currentColor" />
      </svg>
    );
  }
  if (tipo === 'nivel') {
    return (
      <svg {...base}>
        <line x1="4" y1="20" x2="20" y2="20" />
        <rect x="6" y="12" width="3" height="8" />
        <rect x="11" y="7" width="3" height="13" />
        <rect x="16" y="15" width="3" height="5" />
      </svg>
    );
  }
  if (tipo === 'grupo') {
    return (
      <svg {...base}>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 19c0-3.2 2.5-5 6-5s6 1.8 6 5" />
        <path d="M17 5.5A3 3 0 0 1 17 12.7M21 19c0-2.2-1.4-3.6-3.4-4.4" />
      </svg>
    );
  }
  if (tipo === 'idioma') {
    return (
      <svg {...base}>
        <circle cx="12" cy="12" r="9" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <path d="M12 3c2.6 2.6 3.9 5.7 3.9 9S14.6 18.4 12 21c-2.6-2.6-3.9-5.7-3.9-9S9.4 5.6 12 3z" />
      </svg>
    );
  }
  if (tipo === 'direccion') {
    return (
      <svg {...base}>
        <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  return null;
}

export default function DatosVacante({ vacante }) {
  const categoria = CATEGORIAS.find((c) => c.valor === vacante.categoria);
  const etiquetaCategoria = categoria ? categoria.etiqueta : vacante.categoria || 'Sin categoría';

  const idiomas = Array.isArray(vacante.idiomas)
    ? vacante.idiomas.join(', ')
    : typeof vacante.idiomas === 'string' && vacante.idiomas.trim()
      ? vacante.idiomas
      : 'Español';

  const sueldo = vacante.pagoPorHora
    ? 'S/ ' + vacante.pagoPorHora + ' por hora · S/ ' + (vacante.sueldo || 0) + ' por turno'
    : vacante.sueldo
      ? 'S/ ' + vacante.sueldo + '/día'
      : 'A convenir';

  const horarios =
    Array.isArray(vacante.horarios) && vacante.horarios.length > 0
      ? vacante.horarios.join(' y ')
      : vacante.horario || 'No especificado';

  const datos = [
    { etiqueta: 'Categoría', valor: etiquetaCategoria, icono: 'tag' },
    { etiqueta: 'Horarios', valor: horarios, icono: 'reloj' },
    { etiqueta: 'Pago', valor: sueldo, icono: 'moneda' },
    {
      etiqueta: 'Nivel de experiencia',
      valor: vacante.nivelExperiencia || 'No especificado',
      icono: 'nivel',
    },
    {
      etiqueta: 'Vacantes disponibles',
      valor: String(vacante.vacantesDisponibles || 1),
      icono: 'grupo',
    },
    { etiqueta: 'Idiomas', valor: idiomas, icono: 'idioma' },
  ];

  if (vacante.ubicacion) {
    datos.push({ etiqueta: 'Dirección', valor: vacante.ubicacion, icono: 'direccion' });
  }

  return (
    <div className="detalle-datos">
      {datos.map((dato) => (
        <div key={dato.etiqueta} className="detalle-dato">
          <span className="detalle-dato-icono">
            <Icono tipo={dato.icono} />
          </span>
          <div className="detalle-dato-texto">
            <span className="detalle-dato-label">{dato.etiqueta}</span>
            <span className="detalle-dato-valor">{dato.valor}</span>
          </div>
        </div>
      ))}
    </div>
  );
}