import { Navigate } from 'react-router-dom';
import { useUsuario } from '../contexto/UsuarioContext';

export default function RutaProtegida({ children, rolPermitido }) {

  const { sesion } = useUsuario();

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  if (rolPermitido && sesion.rol !== rolPermitido) {
    return <Navigate to="/" replace />;
  }

  return children;
}