import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUsuario } from '../contexto/UsuarioContext';
import { DISTRITOS } from '../datos/datosIniciales';
import Boton from '../componentes/Boton';

export default function Registro() {
  const [params] = useSearchParams();
  const rolInicial = params.get('rol') === 'empresa' ? 'empresa' : 'trabajador';
  const navigate = useNavigate();
  const { registrar, usuarios } = useUsuario();

  const [rol, setRol] = useState(rolInicial);
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    password: '',
    distrito: '',
    telefono: '',
  });
  const [error, setError] = useState('');

  const emailRegistrado = datos.email.trim()
    ? usuarios.some(
        (u) => u.email.toLowerCase() === datos.email.trim().toLowerCase()
      )
    : false;
  const contrasenaCorta = datos.password.length > 0 && datos.password.length < 6;

  function manejarCambio(campo, valor) {
    setDatos({ ...datos, [campo]: valor });
  }

  function manejarSubmit(e) {
    e.preventDefault();
    if (datos.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    const ok = registrar({ ...datos, rol });
    if (!ok) {
      setError('Ya existe una cuenta con ese correo.');
      return;
    }
    navigate(rol === 'empresa' ? '/empresa/dashboard' : '/trabajador/buscar');
  }

  const etiquetaRol = rol === 'empresa' ? 'Empresa' : 'Trabajador';

  return (
    <div className="pagina-auth">
      <div className="tarjeta-auth">
        <h1 className="auth-titulo">Crear cuenta</h1>

        <div className="selector-rol-registro">
          <button
            type="button"
            className={'selector-rol-opcion' + (rol === 'trabajador' ? ' selector-rol-activa' : '')}
            onClick={() => setRol('trabajador')}
          >
            <span className="selector-rol-icono">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5" />
              </svg>
            </span>
            <span>Trabajador</span>
          </button>
          <button
            type="button"
            className={'selector-rol-opcion' + (rol === 'empresa' ? ' selector-rol-activa' : '')}
            onClick={() => setRol('empresa')}
          >
            <span className="selector-rol-icono">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="8" width="18" height="12" rx="2" />
                <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
              </svg>
            </span>
            <span>Empresa</span>
          </button>
        </div>

        <p className="auth-rol">Registro como <strong>{etiquetaRol}</strong></p>

        <form onSubmit={manejarSubmit} className="formulario">
          <div className="campo">
            <label className="campo-label" htmlFor="registro-nombre">Nombre completo</label>
            <input
              id="registro-nombre"
              className="input"
              value={datos.nombre}
              onChange={(e) => manejarCambio('nombre', e.target.value)}
              placeholder={rol === 'empresa' ? 'Razón social o nombre del negocio' : 'Tu nombre completo'}
              required
            />
          </div>
          <div className="campo">
            <label className="campo-label" htmlFor="registro-email">Correo electrónico</label>
            <input
              id="registro-email"
              className="input"
              type="email"
              value={datos.email}
              onChange={(e) => manejarCambio('email', e.target.value)}
              placeholder="tucorreo@correo.com"
              required
            />
            {emailRegistrado && (
              <p className="alerta alerta-error campo-ayuda">Este correo ya está registrado.</p>
            )}
          </div>
          <div className="campo">
            <label className="campo-label" htmlFor="registro-password">Contraseña</label>
            <input
              id="registro-password"
              className="input"
              type="password"
              value={datos.password}
              onChange={(e) => manejarCambio('password', e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
            {contrasenaCorta && (
              <p className="alerta alerta-error campo-ayuda">La contraseña debe tener al menos 6 caracteres.</p>
            )}
          </div>
          <div className="campo">
            <label className="campo-label" htmlFor="registro-distrito">Distrito</label>
            <select
              id="registro-distrito"
              className="input"
              value={datos.distrito}
              onChange={(e) => manejarCambio('distrito', e.target.value)}
              required
            >
              <option value="">Selecciona tu distrito</option>
              {DISTRITOS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label className="campo-label" htmlFor="registro-telefono">Teléfono</label>
            <input
              id="registro-telefono"
              className="input"
              type="tel"
              value={datos.telefono}
              onChange={(e) => manejarCambio('telefono', e.target.value)}
              placeholder="999 999 999"
              required
            />
          </div>
          {error && <p className="alerta alerta-error">{error}</p>}
          <Boton tipo="primario" tipoBoton="submit">
            Crear cuenta
          </Boton>
        </form>
        <p className="auth-enlace">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}