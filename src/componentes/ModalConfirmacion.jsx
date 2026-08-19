import Boton from './Boton';

export default function ModalConfirmacion({
  abierto,
  titulo = '¿Estás seguro?',
  mensaje,
  textoConfirmar = 'Confirmar',
  tipo = 'primario',
  onConfirmar,
  onCancelar,
}) {
  if (!abierto) return null;

  return (
    <div className="modal-fondo" onClick={onCancelar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-titulo">{titulo}</h3>
        {mensaje && <p className="modal-mensaje">{mensaje}</p>}
        <div className="modal-botones">
          <Boton tipo={tipo} onClick={onConfirmar}>
            {textoConfirmar}
          </Boton>
          <Boton tipo="secundario" onClick={onCancelar}>
            Cancelar
          </Boton>
        </div>
      </div>
    </div>
  );
}