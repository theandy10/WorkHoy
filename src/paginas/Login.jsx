import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsuario } from '../contexto/UsuarioContext';
import Boton from '../componentes/Boton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { iniciarSesion } = useUsuario();
  const navigate = useNavigate();

  function manejarSubmit(e) {
    e.preventDefault();
    const usuario = iniciarSesion(email, password);
    if (!usuario) {
      setError('Correo o contraseña incorrectos.');
      return;
    }

    navigate(usuario.rol === 'empresa' ? '/empresa/dashboard' : '/trabajador/buscar');
  }

  return (
    <div className="pagina-auth">
      <div className="tarjeta-auth">
        <h1 className="auth-titulo">Iniciar sesión</h1>
        <form onSubmit={manejarSubmit} className="formulario">
          <div className="campo">
            <label className="campo-label" htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@correo.com"
              required
            />
          </div>
          <div className="campo">
            <label className="campo-label" htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>
          {error && <p className="alerta alerta-error">{error}</p>}
          <Boton tipo="primario" tipoBoton="submit">
            Ingresar
          </Boton>
        </form>
        <p className="auth-enlace">
          ¿No tienes cuenta? <Link to="/registro">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
}