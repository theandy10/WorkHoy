import { CATEGORIAS, DISTRITOS } from '../datos/datosIniciales';

export default function FiltroBusqueda({ filtros, onCambiar, onLimpiar }) {
  return (
    <div className="filtros">
      <div className="filtro-campo filtro-busqueda-texto">
        <label htmlFor="filtro-texto">Buscar</label>
        <input
          id="filtro-texto"
          className="input"
          type="text"
          value={filtros.texto}
          onChange={(e) => onCambiar('texto', e.target.value)}
          placeholder="Buscar empleo, empresa o palabra clave"
        />
      </div>
      <div className="filtro-campo">
        <label htmlFor="filtro-categoria">Categoría</label>
        <select id="filtro-categoria" className="input" value={filtros.categoria} onChange={(e) => onCambiar('categoria', e.target.value)}>
          <option value="">Todas</option>
          {CATEGORIAS.map((c) => (
            <option key={c.valor} value={c.valor}>{c.etiqueta}</option>
          ))}
        </select>
      </div>
      <div className="filtro-campo">
        <label htmlFor="filtro-distrito">Distrito</label>
        <select id="filtro-distrito" className="input" value={filtros.distrito} onChange={(e) => onCambiar('distrito', e.target.value)}>
          <option value="">Todos</option>
          {DISTRITOS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <div className="filtro-campo">
        <label htmlFor="filtro-orden">Ordenar por</label>
        <select id="filtro-orden" className="input" value={filtros.orden} onChange={(e) => onCambiar('orden', e.target.value)}>
          <option value="">Todas</option>
          <option value="recientes">Más recientes</option>
          <option value="sueldoAsc">Menor sueldo</option>
          <option value="sueldoDesc">Mayor sueldo</option>
        </select>
      </div>
      <button className="boton boton-secundario" onClick={onLimpiar}>
        Limpiar filtros
      </button>
    </div>
  );
}