import { createContext, useContext, useEffect, useReducer } from 'react';
import { leerStorage, guardarStorage, tieneVersion, guardarVersion } from '../datos/storage';
import { usuariosIniciales, SEED_VERSION } from '../datos/datosIniciales';

const CLAVE_USUARIOS = 'workhoy_usuarios';
const CLAVE_SESION = 'workhoy_sesion_id';

function estadoInicial() {
  const semillaNueva = !tieneVersion(SEED_VERSION);
  const usuarios = semillaNueva
    ? usuariosIniciales
    : leerStorage(CLAVE_USUARIOS, usuariosIniciales);
  const sesionId = localStorage.getItem(CLAVE_SESION);

  return { usuarios, sesion: usuarios.find((u) => u.id === sesionId) || null };

}

function reducer(estado, accion) {
  switch (accion.tipo) {
    case 'REGISTRAR': {
      const usuario = { ...accion.datos, id: 'u' + Date.now() };
      return { usuarios: [usuario, ...estado.usuarios], sesion: usuario };
    }
    case 'INICIAR_SESION':
      return { ...estado, sesion: accion.usuario };
    case 'CERRAR_SESION':
      return { ...estado, sesion: null };
    case 'ACTUALIZAR_PERFIL': {
      const usuarios = estado.usuarios.map((u) =>
        u.id === estado.sesion.id ? { ...u, ...accion.datos } : u
      );
      return { usuarios, sesion: usuarios.find((u) => u.id === estado.sesion.id) };
    }
    default:
      return estado;
  }
}

const UsuarioContext = createContext(null);

export function UsuarioProvider({ children }) {

  const [estado, dispatch] = useReducer(reducer, undefined, estadoInicial);

  useEffect(() => {
    guardarStorage(CLAVE_USUARIOS, estado.usuarios);
    guardarVersion(SEED_VERSION);
  }, [estado.usuarios]);

  useEffect(() => {
    if (estado.sesion) localStorage.setItem(CLAVE_SESION, estado.sesion.id);
    else localStorage.removeItem(CLAVE_SESION);
  }, [estado.sesion]);

  function iniciarSesion(email, password) {
    const usuario = estado.usuarios.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!usuario) return null;
    dispatch({ tipo: 'INICIAR_SESION', usuario });
    return usuario;
  }

  function registrar(datos) {
    if (estado.usuarios.some((u) => u.email.toLowerCase() === datos.email.trim().toLowerCase())) {
      return false;
    }
    dispatch({ tipo: 'REGISTRAR', datos });
    return true;
  }

  function cerrarSesion() {
    dispatch({ tipo: 'CERRAR_SESION' });
  }

  function actualizarPerfil(datos) {
    dispatch({ tipo: 'ACTUALIZAR_PERFIL', datos });
  }

  const valor = {
    usuarios: estado.usuarios,
    sesion: estado.sesion,
    iniciarSesion,
    registrar,
    cerrarSesion,
    actualizarPerfil,
  };

  return <UsuarioContext.Provider value={valor}>{children}</UsuarioContext.Provider>;
}

export function useUsuario() {
  return useContext(UsuarioContext);
}
