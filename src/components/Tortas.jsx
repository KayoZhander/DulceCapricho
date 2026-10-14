// import Logo from "/assets/logo.webp";

export const TortaItem = ({ torta, onAgregar }) => {
  return (
    <div className="tarjeta-producto">
      <img src={torta.imagen} alt={torta.nombre} className="imagen-producto" />
      <div className="contenido-producto">
        <span className="badge-categoria">{torta.categoria}</span>
        <h3>{torta.nombre}</h3>
        <p>{torta.descripcion}</p>
        <div className="footer-producto">
          <span className="precio">${torta.precio.toLocaleString('es-CL')}</span>
          <button className="btn-agregar" onClick={() => onAgregar(torta)}>
            Añadir al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default TortaItem;
