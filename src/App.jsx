import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Component } from 'react';
import { UsuarioProvider, useUsuario } from './contexto/UsuarioContext';
import { VacantesProvider } from './contexto/VacantesContext';
import Navbar from './componentes/Navbar';
import Sidebar from './componentes/Sidebar';
import Footer from './componentes/Footer';
import RutaProtegida from './componentes/RutaProtegida';
import Landing from './paginas/Landing';
import Login from './paginas/Login';
import Registro from './paginas/Registro';
import Perfil from './paginas/Perfil';
import DashboardEmpresa from './paginas/empresa/DashboardEmpresa';
import PublicarVacante from './paginas/empresa/PublicarVacante';
import MisVacantes from './paginas/empresa/MisVacantes';
import DetalleVacanteEmpresa from './paginas/empresa/DetalleVacanteEmpresa';
import BuscarVacantes from './paginas/trabajador/BuscarVacantes';
import DetalleVacante from './paginas/trabajador/DetalleVacante';
import MisPostulaciones from './paginas/trabajador/MisPostulaciones';

class ErrorLimite extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'sans-serif', maxWidth: 800 }}>
          <h2>Algo salió mal</h2>
          <p style={{ color: '#b00020', fontWeight: 600 }}>{String(this.state.error.message || this.state.error)}</p>
          <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', background: '#f2f2f2', padding: 12, borderRadius: 8 }}>
            {this.state.error.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 18px', cursor: 'pointer' }}>
            Recargar página
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route
        path="/perfil"
        element={
          <RutaProtegida>
            <Perfil />
          </RutaProtegida>
        }
      />

      <Route
        path="/empresa/dashboard"
        element={
          <RutaProtegida rolPermitido="empresa">
            <DashboardEmpresa />
          </RutaProtegida>
        }
      />
      <Route
        path="/empresa/publicar"
        element={
          <RutaProtegida rolPermitido="empresa">
            <PublicarVacante />
          </RutaProtegida>
        }
      />
      <Route
        path="/empresa/vacantes"
        element={
          <RutaProtegida rolPermitido="empresa">
            <MisVacantes />
          </RutaProtegida>
        }
      />
      <Route
        path="/empresa/vacantes/:id"
        element={
          <RutaProtegida rolPermitido="empresa">
            <DetalleVacanteEmpresa />
          </RutaProtegida>
        }
      />
      <Route
        path="/empresa/editar/:id"
        element={
          <RutaProtegida rolPermitido="empresa">
            <PublicarVacante />
          </RutaProtegida>
        }
      />

      <Route path="/trabajador/buscar" element={<BuscarVacantes />} />
      <Route path="/trabajador/vacantes/:id" element={<DetalleVacante />} />
      <Route
        path="/trabajador/postulaciones"
        element={
          <RutaProtegida rolPermitido="trabajador">
            <MisPostulaciones />
          </RutaProtegida>
        }
      />

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

function Estructura() {
  const { sesion } = useUsuario();

  if (sesion) {
    return (
      <div className="layout-app">
        <Sidebar />
        <div className="contenido-app">
          <main>
            <ErrorLimite>
              <Rutas />
            </ErrorLimite>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="app-publico">
      <Navbar />
      <main className="app-contenido">
        <ErrorLimite>
          <Rutas />
        </ErrorLimite>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <UsuarioProvider>
        <VacantesProvider>
          <Estructura />
        </VacantesProvider>
      </UsuarioProvider>
    </BrowserRouter>
  );
}