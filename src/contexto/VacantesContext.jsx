import { createContext, useContext, useEffect, useReducer } from 'react';
import { leerStorage, guardarStorage, tieneVersion, guardarVersion } from '../datos/storage';
import {
  vacantesIniciales,
  postulacionesIniciales,
  calificacionesIniciales,
  SEED_VERSION,
} from '../datos/datosIniciales';

const CLAVE_VACANTES = 'workhoy_vacantes';
const CLAVE_POSTULACIONES = 'workhoy_postulaciones';
const CLAVE_CALIFICACIONES = 'workhoy_calificaciones';

function estadoInicial() {
  const versionActual = tieneVersion(SEED_VERSION);
  return {
    vacantes: versionActual
      ? leerStorage(CLAVE_VACANTES, vacantesIniciales)
      : vacantesIniciales,
    postulaciones: versionActual
      ? leerStorage(CLAVE_POSTULACIONES, postulacionesIniciales)
      : postulacionesIniciales,
    calificaciones: versionActual
      ? leerStorage(CLAVE_CALIFICACIONES, calificacionesIniciales)
      : calificacionesIniciales,
  };
}

function reducer(estado, accion) {
  switch (accion.tipo) {
    case 'PUBLICAR_VACANTE':
      return { ...estado, vacantes: [accion.vacante, ...estado.vacantes] };
    case 'CERRAR_VACANTE':
      return {
        ...estado,
        vacantes: estado.vacantes.map((v) =>
          v.id === accion.id ? { ...v, estado: 'cerrada' } : v
        ),
      };
    case 'EDITAR_VACANTE':
      return {
        ...estado,
        vacantes: estado.vacantes.map((v) =>
          v.id === accion.id ? { ...v, ...accion.datos } : v
        ),
      };
    case 'POSTULAR': {
      const yaExiste = estado.postulaciones.some(
        (p) => p.vacanteId === accion.postulacion.vacanteId && p.trabajadorId === accion.postulacion.trabajadorId
      );
      if (yaExiste) return estado;
      return { ...estado, postulaciones: [accion.postulacion, ...estado.postulaciones] };
    }
    case 'ACTUALIZAR_ESTADO_POSTULACION':
      return {
        ...estado,
        postulaciones: estado.postulaciones.map((p) =>
          p.id === accion.id ? { ...p, estado: accion.nuevoEstado } : p
        ),
      };
    case 'ELIMINAR_POSTULACION':
      return {
        ...estado,
        postulaciones: estado.postulaciones.filter((p) => p.id !== accion.id),
      };
    case 'CALIFICAR':
      return { ...estado, calificaciones: [accion.calificacion, ...estado.calificaciones] };
    default:
      return estado;
  }
}

const VacantesContext = createContext(null);

export function VacantesProvider({ children }) {

  const [estado, dispatch] = useReducer(reducer, undefined, estadoInicial);

  useEffect(() => {
    guardarStorage(CLAVE_VACANTES, estado.vacantes);
    guardarVersion(SEED_VERSION);
  }, [estado.vacantes]);
  useEffect(() => {
    guardarStorage(CLAVE_POSTULACIONES, estado.postulaciones);
  }, [estado.postulaciones]);
  useEffect(() => {
    guardarStorage(CLAVE_CALIFICACIONES, estado.calificaciones);
  }, [estado.calificaciones]);

  function publicarVacante(datos) {
    const vacante = {
      ...datos,
      id: 'v' + Date.now(),
      estado: 'activa',
      fechaPublicacion: new Date().toISOString(),
    };
    dispatch({ tipo: 'PUBLICAR_VACANTE', vacante });
  }

  function cerrarVacante(id) {
    dispatch({ tipo: 'CERRAR_VACANTE', id });
  }

  function editarVacante(id, datos) {
    dispatch({ tipo: 'EDITAR_VACANTE', id, datos });
  }

  function postular(vacanteId, trabajadorId) {
    const postulacion = {
      id: 'p' + Date.now(),
      vacanteId,
      trabajadorId,
      estado: 'pendiente',
      fechaPostulacion: new Date().toISOString(),
    };
    dispatch({ tipo: 'POSTULAR', postulacion });
  }

  function actualizarEstadoPostulacion(id, nuevoEstado) {
    dispatch({ tipo: 'ACTUALIZAR_ESTADO_POSTULACION', id, nuevoEstado });
  }

  function eliminarPostulacion(id) {
    dispatch({ tipo: 'ELIMINAR_POSTULACION', id });
  }

  function calificar(deUsuarioId, trabajadorId, puntaje, comentario) {
    const calificacion = {
      id: 'c' + Date.now(),
      deUsuarioId,
      aUsuarioId: trabajadorId,
      puntaje,
      comentario,
      fecha: new Date().toISOString(),
    };
    dispatch({ tipo: 'CALIFICAR', calificacion });
  }

  function promedioCalificaciones(trabajadorId) {
    const notas = estado.calificaciones.filter((c) => c.aUsuarioId === trabajadorId);
    if (notas.length === 0) return 0;
    const suma = notas.reduce((total, c) => total + c.puntaje, 0);

    return Math.round((suma / notas.length) * 10) / 10;
  }

  const valor = {
    vacantes: estado.vacantes,
    postulaciones: estado.postulaciones,
    calificaciones: estado.calificaciones,
    publicarVacante,
    cerrarVacante,
    editarVacante,
    postular,
    actualizarEstadoPostulacion,
    eliminarPostulacion,
    calificar,
    promedioCalificaciones,
  };

  return <VacantesContext.Provider value={valor}>{children}</VacantesContext.Provider>;
}

export function useVacantes() {
  return useContext(VacantesContext);
}