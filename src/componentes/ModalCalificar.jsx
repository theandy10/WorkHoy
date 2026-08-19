import { useEffect, useState } from 'react';
import Boton from './Boton';

export default function ModalCalificar({ abierto, trabajador, onEnviar, onCerrar, titulo = 'Calificar al postulante', placeholder = 'Escribe tus comentarios sobre el desempeño del postulante...' }) {
  const [puntaje, setPuntaje] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (abierto) {
      setPuntaje(0);
      setComentario('');
      setEnviado(false);
    }
  }, [abierto]);

  if (!abierto) return null;

  function manejarEnviar(e) {
    e.preventDefault();
    if (puntaje === 0) return;
    onEnviar(puntaje, comentario.trim());
    setEnviado(true);
  }

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <form className="modal modal-calificar" onSubmit={manejarEnviar} onClick={(e) => e.stopPropagation()}>
        <div className="modal-calificar-avatar">
          {trabajador && trabajador.avatar ? (
            <img src={trabajador.avatar} alt={trabajador.nombre} className="avatar-img" />
          ) : trabajador && trabajador.nombre ? (
            trabajador.nombre.charAt(0).toUpperCase()
          ) : (
            '?'
          )}
        </div>
        <h3 className="modal-calificar-nombre">{trabajador ? trabajador.nombre : 'Postulante'}</h3>
        <h2 className="modal-calificar-titulo">{titulo}</h2>

        <div className="selector-estrellas selector-estrellas-grandes">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={'estrella' + (n <= puntaje ? ' estrella-activa' : '')}
              onClick={() => setPuntaje(n)}
              aria-label={n + ' estrellas'}
            >
              &#9733;
            </button>
          ))}
        </div>

        {enviado ? (
          <>
            <p className="alerta alerta-exito">Calificación enviada. ¡Gracias!</p>
            <div className="modal-botones">
              <Boton tipo="primario" onClick={onCerrar}>
                Listo
              </Boton>
            </div>
          </>
        ) : (
          <>
            <textarea
              className="input textarea"
              rows="4"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder={placeholder}
            />
            <div className="modal-botones">
              <Boton tipo="primario" tipoBoton="submit" disabled={puntaje === 0}>
                Enviar calificación
              </Boton>
              <Boton tipo="secundario" onClick={onCerrar}>
                Cancelar
              </Boton>
            </div>
          </>
        )}
      </form>
    </div>
  );
}