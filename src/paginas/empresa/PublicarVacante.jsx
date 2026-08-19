import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUsuario } from '../../contexto/UsuarioContext';
import { useVacantes } from '../../contexto/VacantesContext';
import { CATEGORIAS, DISTRITOS } from '../../datos/datosIniciales';
import Boton from '../../componentes/Boton';

const TIPOS_CONTRATO = ['Tiempo completo', 'Medio tiempo', 'Por turnos', 'Fin de semana'];
const NIVELES_EXPERIENCIA = ['Sin experiencia', 'Básica', 'Intermedia', 'Avanzada'];

export default function PublicarVacante({ vacanteId }) {
  const { sesion } = useUsuario();
  const { publicarVacante, editarVacante, vacantes } = useVacantes();
  const navigate = useNavigate();
  const paramId = useParams()?.id;
  const id = vacanteId || paramId;
  const vacanteEditable = id && vacantes.find((v) => v.id === id);
  const esEdicion = Boolean(vacanteEditable);
  const editorRef = useRef(null);

  const [datos, setDatos] = useState({
    titulo: '',
    tipoContrato: '',
    categoria: '',
    nivelExperiencia: '',
    distrito: '',
    idiomas: '',
    sueldo: '',
    pagoPorHora: '',
    vacantesDisponibles: '',
    horario: '',
    requisitos: '',
    uniformidad: '',
    descripcion: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!vacanteEditable) return;
    const v = vacanteEditable;
    setDatos({
      titulo: v.titulo,
      tipoContrato: v.tipoContrato,
      categoria: v.categoria,
      nivelExperiencia: v.nivelExperiencia || '',
      distrito: v.distrito,
      idiomas: v.idiomas || '',
      sueldo: v.sueldo || '',
      pagoPorHora: v.pagoPorHora ?? '',
      vacantesDisponibles: v.vacantesDisponibles,
      horario: v.horario || '',
      requisitos: (v.requisitos || []).join('\n'),
      uniformidad: (v.uniformidad || []).join('\n'),
      descripcion: v.descripcion || '',
    });
  }, [vacanteEditable]);

  useEffect(() => {
    if (esEdicion && editorRef.current) {
      editorRef.current.innerHTML = vacanteEditable.descripcion || '';
    }

  }, [esEdicion]);

  function manejarCambio(campo, valor) {
    setDatos({ ...datos, [campo]: valor });
  }

  function ejecutarComando(comando) {
    document.execCommand(comando);
    editorRef.current?.focus();
  }

  function manejarEditor() {
    if (editorRef.current) {
      setDatos({ ...datos, descripcion: editorRef.current.innerHTML });
    }
  }

  function manejarSubmit(e) {
    e.preventDefault();
    if (datos.sueldo !== '' && Number(datos.sueldo) <= 0) {
      setError('El sueldo debe ser mayor a 0.');
      return;
    }
    if (datos.pagoPorHora !== '' && Number(datos.pagoPorHora) <= 0) {
      setError('El pago por hora debe ser mayor a 0.');
      return;
    }
    if (Number(datos.vacantesDisponibles) <= 0) {
      setError('Indica cuántas vacantes disponibles hay.');
      return;
    }
    const requisitos = datos.requisitos
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);
    const uniformidad = datos.uniformidad
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    const datosNuevos = {
      titulo: datos.titulo,
      tipoContrato: datos.tipoContrato,
      categoria: datos.categoria,
      nivelExperiencia: datos.nivelExperiencia,
      distrito: datos.distrito,
      idiomas: datos.idiomas,
      sueldo: Number(datos.sueldo) || 0,
      pagoPorHora: datos.pagoPorHora ? Number(datos.pagoPorHora) : null,
      vacantesDisponibles: Number(datos.vacantesDisponibles),
      horario: datos.horario,
      requisitos,
      uniformidad,
      descripcion: datos.descripcion,
      empresaId: sesion.id,
    };

    if (esEdicion) {
      editarVacante(vacanteEditable.id, datosNuevos);
    } else {
      publicarVacante(datosNuevos);
    }
    navigate('/empresa/vacantes');
  }

  return (
    <div className="pagina">
      <h1 className="titulo-pagina">
        {esEdicion ? `Editar vacante: ${vacanteEditable.titulo}` : 'Publicar nueva vacante'}
      </h1>
      <form onSubmit={manejarSubmit} className="tarjeta-formulario publicar-grid">
        <div className="campo">
          <label className="campo-label" htmlFor="publicar-titulo">Título del empleo</label>
          <input
            id="publicar-titulo"
            className="input"
            value={datos.titulo}
            onChange={(e) => manejarCambio('titulo', e.target.value)}
            placeholder="Ej: Reponedor de tienda"
            required
          />
        </div>
        <div className="campo">
          <label className="campo-label" htmlFor="publicar-contrato">Tipo de contrato</label>
          <select id="publicar-contrato" className="input" value={datos.tipoContrato} onChange={(e) => manejarCambio('tipoContrato', e.target.value)}>
            {TIPOS_CONTRATO.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label className="campo-label" htmlFor="publicar-categoria">Categoría</label>
          <select id="publicar-categoria" className="input" value={datos.categoria} onChange={(e) => manejarCambio('categoria', e.target.value)} required>
            <option value="">Selecciona una categoría</option>
            {CATEGORIAS.map((c) => (
              <option key={c.valor} value={c.valor}>{c.etiqueta}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label className="campo-label" htmlFor="publicar-experiencia">Nivel de experiencia</label>
          <select id="publicar-experiencia" className="input" value={datos.nivelExperiencia} onChange={(e) => manejarCambio('nivelExperiencia', e.target.value)}>
            {NIVELES_EXPERIENCIA.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label className="campo-label" htmlFor="publicar-distrito">Distrito</label>
          <select id="publicar-distrito" className="input" value={datos.distrito} onChange={(e) => manejarCambio('distrito', e.target.value)} required>
            <option value="">Selecciona un distrito</option>
            {DISTRITOS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label className="campo-label" htmlFor="publicar-idiomas">Idiomas requeridos</label>
          <input
            id="publicar-idiomas"
            className="input"
            value={datos.idiomas}
            onChange={(e) => manejarCambio('idiomas', e.target.value)}
            placeholder="Ej: Español (nativo)"
          />
        </div>
        <div className="campo">
          <label className="campo-label" htmlFor="publicar-sueldo">Pago por turno o día (S/)</label>
          <input
            id="publicar-sueldo"
            className="input"
            type="number"
            min="0"
            value={datos.sueldo}
            onChange={(e) => manejarCambio('sueldo', e.target.value)}
            placeholder="Ej: 72 (dejar vacío si es a convenir)"
          />
        </div>
        <div className="campo">
          <label className="campo-label" htmlFor="publicar-pagoHora">Pago por hora (S/, opcional)</label>
          <input
            id="publicar-pagoHora"
            className="input"
            type="number"
            min="0"
            value={datos.pagoPorHora}
            onChange={(e) => manejarCambio('pagoPorHora', e.target.value)}
            placeholder="Ej: 9"
          />
        </div>
        <div className="campo">
          <label className="campo-label" htmlFor="publicar-vacantes">Vacantes disponibles</label>
          <input
            id="publicar-vacantes"
            className="input"
            type="number"
            min="1"
            value={datos.vacantesDisponibles}
            onChange={(e) => manejarCambio('vacantesDisponibles', e.target.value)}
            placeholder="Ej: 2"
            required
          />
        </div>
        <div className="campo publicar-campo-ancho">
          <label className="campo-label" htmlFor="publicar-horario">Horario laboral</label>
          <input
            id="publicar-horario"
            className="input"
            value={datos.horario}
            onChange={(e) => manejarCambio('horario', e.target.value)}
            placeholder="Ej: Lun a Vie 8am - 5pm"
            required
          />
        </div>
        <div className="campo publicar-campo-ancho">
          <label className="campo-label" htmlFor="publicar-requisitos">Requisitos (uno por línea)</label>
          <textarea
            id="publicar-requisitos"
            className="input textarea"
            rows="3"
            value={datos.requisitos}
            onChange={(e) => manejarCambio('requisitos', e.target.value)}
            placeholder={'Ej:\nContar con RUC para emitir recibos\nCuenta bancaria BBVA'}
          />
        </div>
        <div className="campo publicar-campo-ancho">
          <label className="campo-label" htmlFor="publicar-uniformidad">Uniformidad (uno por línea, opcional)</label>
          <textarea
            id="publicar-uniformidad"
            className="input textarea"
            rows="3"
            value={datos.uniformidad}
            onChange={(e) => manejarCambio('uniformidad', e.target.value)}
            placeholder={'Ej:\nCasco, chaleco reflectivo y botas punta de acero\nPolo negro manga larga y jean azul o negro'}
          />
        </div>
        <div className="campo publicar-campo-ancho">
          <label className="campo-label">Descripción del empleo</label>
          <div className="editor-herramientas">
            <button type="button" className="editor-boton" onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutarComando('bold')} title="Negrita">
              <strong>B</strong>
            </button>
            <button type="button" className="editor-boton" onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutarComando('italic')} title="Cursiva">
              <em>I</em>
            </button>
            <button type="button" className="editor-boton" onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutarComando('underline')} title="Subrayado">
              <u>U</u>
            </button>
            <span className="editor-divisor" />
            <button type="button" className="editor-boton" onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutarComando('insertUnorderedList')} title="Lista con viñetas">
              • Lista
            </button>
            <button type="button" className="editor-boton" onMouseDown={(e) => e.preventDefault()} onClick={() => ejecutarComando('insertOrderedList')} title="Lista numerada">
              1. Lista
            </button>
          </div>
          <div
            ref={editorRef}
            className="editor-contenido"
            contentEditable
            onInput={manejarEditor}
            data-placeholder="Detalla las responsabilidades, requisitos y cultura de la empresa..."
          />
        </div>
        {error && <p className="alerta alerta-error publicar-campo-ancho">{error}</p>}
        <div className="publicar-botones publicar-campo-ancho">
          <Boton tipo="primario" tipoBoton="submit">
            {esEdicion ? 'Guardar cambios' : 'Publicar vacante'}
          </Boton>
        </div>
      </form>
    </div>
  );
}