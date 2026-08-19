

export default function Boton({ children, tipo = 'primario', onClick, disabled, tipoBoton }) {
  return (
    <button
      type={tipoBoton || 'button'}
      className={'boton boton-' + tipo}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}