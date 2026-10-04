import { useState } from 'react';
import { useCarrito } from '../../context/CarritoContext';
import './BurritoCard.css';

const EXTRAS = ['Pollo', 'Arrachera', 'Picadillo', 'Huevo', 'Atún', 'Natural', 'Chorizo', 'Bistec'];
const COSTO_EXTRA = 10;

const BurritoCard = ({ burrito }) => {
  const { agregarAlCarrito } = useCarrito();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [conJitomateCebolla, setConJitomateCebolla] = useState(false);
  const [extra, setExtra] = useState('');

  const precioTotal =
    (burrito.precio + (extra ? COSTO_EXTRA : 0)) * cantidad;

  const handleAgregar = () => {
    const item = {
      id: `${Date.now()}-${Math.random()}`,
      nombre: burrito.nombre,
      precioBase: burrito.precio,
      conJitomateCebolla,
      extra: extra || null,
      cantidad,
      precioTotal,
    };
    agregarAlCarrito(item);
    // reset
    setModalAbierto(false);
    setCantidad(1);
    setConJitomateCebolla(false);
    setExtra('');
  };

  const incrementar = () => {
    if (cantidad < 5) setCantidad(cantidad + 1);
  };
  const decrementar = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  return (
    <>
      <div className="burrito-card">
        <h3>Burrito de {burrito.nombre}</h3>
        <p className="ingredientes">Arroz · Frijol · Lechuga</p>
        <p className="precio">${burrito.precio}</p>
        <button onClick={() => setModalAbierto(true)}>Personalizar</button>
      </div>

      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Burrito de {burrito.nombre}</h3>

            <label className="check-opcion">
              <input
                type="checkbox"
                checked={conJitomateCebolla}
                onChange={(e) => setConJitomateCebolla(e.target.checked)}
              />
              Agregar jitomate y cebolla (sin costo)
            </label>

            <div className="extra-select">
              <label>Ingrediente extra (+${COSTO_EXTRA}):</label>
              <select value={extra} onChange={(e) => setExtra(e.target.value)}>
                <option value="">Sin extra</option>
                {EXTRAS.filter((e) => e !== burrito.nombre).map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div className="cantidad-control">
              <button onClick={decrementar}>−</button>
              <span>{cantidad}</span>
              <button onClick={incrementar}>+</button>
              <small>(máx 5)</small>
            </div>

            <p className="total-modal">Total: ${precioTotal}</p>

            <div className="modal-botones">
              <button className="btn-cancelar" onClick={() => setModalAbierto(false)}>
                Cancelar
              </button>
              <button className="btn-agregar" onClick={handleAgregar}>
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BurritoCard;
