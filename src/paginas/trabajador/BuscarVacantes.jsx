import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUsuario } from '../../contexto/UsuarioContext';
import { useVacantes } from '../../contexto/VacantesContext';
import TarjetaVacante from '../../componentes/TarjetaVacante';
import FiltroBusqueda from '../../componentes/FiltroBusqueda';
import EstadoVacio from '../../componentes/EstadoVacio';
import ModalConfirmacion from '../../componentes/ModalConfirmacion';

const filtrosVacios = {
  texto: '',
  categoria: '',
  distrito: '',
  orden: '',
};

export default function BuscarVacantes() {
  const { sesion, usuarios } = useUsuario();
  const { vacantes, postulaciones, postular } = useVacantes();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [filtros, setFiltros] = useState({
    ...filtrosVacios,
    texto: params.get('texto') || '',
    distrito: params.get('distrito') || '',
  });
  const [vacanteApostular, setVacanteApostular] = useState(null);
  const [postuladoOk, setPostuladoOk] = useState('');

  function manejarCambio(campo, valor) {

    setFiltros({ ...filtros, [campo]: valor });
  }

  function limpiarFiltros() {
    setFiltros(filtrosVacios);
  }

  const nombreEmpresa = (empresaId) => {
    const empresa = usuarios.find((u) => u.id === empresaId);
    return empresa ? empresa.nombre : '';
  };

  const avatarEmpresa = (empresaId) => {
    const empresa = usuarios.find((u) => u.id === empresaId);
    return empresa ? empresa.avatar : '';
  };

  const yaPostulo = (vacanteId) =>
    Boolean(sesion) &&
    postulaciones.some((p) => p.vacanteId === vacanteId && p.trabajadorId === sesion.id);

  const sueldoEquivalente = (v) => {
    if (v.pagoPorHora) return (Number(v.pagoPorHora) || 0) * 8;
    return Number(v.sueldo) || 0;
  };

  const resultados = vacantes
    .filter((v) => {
      if (v.estado !== 'activa') return false;
      if (filtros.texto) {
        const t = filtros.texto.toLowerCase();
        const coincide =
          (v.titulo || '').toLowerCase().includes(t) ||
          (v.descripcion || '').toLowerCase().includes(t) ||
          (nombreEmpresa(v.empresaId) || '').toLowerCase().includes(t);
        if (!coincide) return false;
      }
      if (filtros.categoria && v.categoria !== filtros.categoria) return false;
      if (filtros.distrito && v.distrito !== filtros.distrito) return false;
      return true;
    })
    .sort((a, b) => {
      if (filtros.orden === 'sueldoAsc') return sueldoEquivalente(a) - sueldoEquivalente(b);
      if (filtros.orden === 'sueldoDesc') return sueldoEquivalente(b) - sueldoEquivalente(a);
      if (filtros.orden === 'recientes') return new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion);
      return 0;
    });

  function confirmarPostulacion() {
    postular(vacanteApostular.id, sesion.id);
    setPostuladoOk(vacanteApostular.titulo);
    setVacanteApostular(null);
  }

  return (
    <div className="pagina pagina-buscar">
      <h1 className="titulo-pagina">Buscar vacantes</h1>

      <FiltroBusqueda filtros={filtros} onCambiar={manejarCambio} onLimpiar={limpiarFiltros} />

      <p className="resultados-conteo">
        {resultados.length} vacante{resultados.length === 1 ? '' : 's'} encontrada
        {resultados.length === 1 ? '' : 's'}
      </p>

      {postuladoOk && <p className="alerta alerta-exito">Postulaste a "{postuladoOk}". ¡Suerte!</p>}

      {resultados.length === 0 ? (
        <EstadoVacio mensaje="No hay vacantes activas que coincidan con tus filtros." />
      ) : (
        <div className="grid-vacantes">
          {resultados.map((v) => (
            <TarjetaVacante
              key={v.id}
              vacante={v}
              empresaNombre={nombreEmpresa(v.empresaId)}
              empresaAvatar={avatarEmpresa(v.empresaId)}
              yaPostulo={yaPostulo(v.id)}
              onVer={(vacante) => navigate('/trabajador/vacantes/' + vacante.id)}
              onPostular={(vacante) =>
                sesion ? setVacanteApostular(vacante) : navigate('/login')
              }
            />
          ))}
        </div>
      )}

      <ModalConfirmacion
        abierto={Boolean(vacanteApostular)}
        titulo="Confirmar postulación"
        mensaje={`¿Quieres postular a "${vacanteApostular ? vacanteApostular.titulo : ''}" en ${vacanteApostular ? vacanteApostular.distrito : ''}?`}
        textoConfirmar="Sí, postular"
        onConfirmar={confirmarPostulacion}
        onCancelar={() => setVacanteApostular(null)}
      />
    </div>
  );
}