import { useState } from 'react';
import { useCarrito } from '../../context/CarritoContext';
import './BurritoCard.css';

const EXTRAS_PROTEINA = [
  'Pollo',
  'Arrachera',
  'Adobada'
];
const SALSAS = ['Roja', 'Verde'];
const ADEREZOS = ['Ranch', 'Chipotle'];
const COSTO_EXTRA = 10;

const BurritoCard = ({ burrito, esLowCarb = false }) => {
  const { agregarAlCarrito } = useCarrito();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [extraProteina, setExtraProteina] = useState('');

  const [salsas, setSalsas] = useState({ Roja: 0, Verde: 0 });
  const [aderezos, setAderezos] = useState({ Ranch: 0, Chipotle: 0 });
  const [picoDeGallo, setPicoDeGallo] = useState(0);

  // ── Cálculo de costos ──
  const totalSalsas = salsas.Roja + salsas.Verde;
  const totalAderezos = aderezos.Ranch + aderezos.Chipotle;

  const salsasDeMas = Math.max(0, totalSalsas - 1);
  const aderezosDeMas = Math.max(0, totalAderezos - 1);
  const picoDeMas = Math.max(0, picoDeGallo - 1);

  const costoExtraSalsas = salsasDeMas * COSTO_EXTRA;
  const costoExtraAderezos = aderezosDeMas * COSTO_EXTRA;
  const costoExtraPico = picoDeMas * COSTO_EXTRA;
  const costoExtraProteina = extraProteina ? COSTO_EXTRA : 0;

  const costoExtrasPorUnidad =
    costoExtraSalsas + costoExtraAderezos + costoExtraPico + costoExtraProteina;

  const precioUnitario = burrito.precio + costoExtrasPorUnidad;
  const precioTotal = precioUnitario * cantidad;

  // ── Handlers ──
  const cambiarSalsa = (tipo, delta) => {
    setSalsas((prev) => ({ ...prev, [tipo]: Math.max(0, prev[tipo] + delta) }));
  };

  const cambiarAderezo = (tipo, delta) => {
    setAderezos((prev) => ({ ...prev, [tipo]: Math.max(0, prev[tipo] + delta) }));
  };

  const cambiarPico = (delta) => {
    setPicoDeGallo((prev) => Math.max(0, prev + delta));
  };

  const resetModal = () => {
    setCantidad(1);
    setExtraProteina('');
    setSalsas({ Roja: 0, Verde: 0 });
    setAderezos({ Ranch: 0, Chipotle: 0 });
    setPicoDeGallo(0);
  };

  const handleAgregar = () => {
    if (totalSalsas === 0) {
      alert('Elige al menos 1 salsa');
      return;
    }
    if (totalAderezos === 0) {
      alert('Elige al menos 1 aderezo');
      return;
    }

    const item = {
      id: `${Date.now()}-${Math.random()}`,
      nombre: burrito.nombre,
      precioBase: burrito.precio,
      esLowCarb,
      extraProteina: extraProteina || null,
      salsas: { ...salsas },
      aderezos: { ...aderezos },
      picoDeGallo,
      costoExtrasPorUnidad,
      cantidad,
      precioTotal,
    };
    agregarAlCarrito(item);
    resetModal();
    setModalAbierto(false);
  };

  const incrementar = () => {
    if (cantidad < 5) setCantidad(cantidad + 1);
  };
  const decrementar = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  return (
    <>
      <div className={`burrito-card ${esLowCarb ? 'lowcarb' : ''}`}>
        {esLowCarb && <span className="badge-lowcarb">LOW CARB </span>}
        <h3>Burrito {burrito.nombre}</h3>
        <p className="ingredientes">
          {esLowCarb
            ? 'Lechuga · Arroz rojo · Frijol · Queso'
            : 'Arroz rojo · Frijol · Lechuga · Queso'}
        </p>
        <p className="precio">${burrito.precio}</p>
        <button onClick={() => setModalAbierto(true)}>Personalizar</button>
      </div>

      {modalAbierto && (
        <div className="modal-overlay" onClick={() => setModalAbierto(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Burrito {burrito.nombre}</h3>
            {esLowCarb && <p className="nota-lowcarb">Versión sin tortilla · LOW CARB 🥗</p>}

            {/* SALSAS */}
            <div className="opcion-grupo">
              <p className="opcion-titulo">
                Salsas <small>(1 gratis · cada extra +${COSTO_EXTRA})</small>
              </p>
              {SALSAS.map((s) => (
                <div key={s} className="opcion-fila">
                  <span>{s}</span>
                  <div className="contador">
                    <button onClick={() => cambiarSalsa(s, -1)}>−</button>
                    <span>{salsas[s]}</span>
                    <button onClick={() => cambiarSalsa(s, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* ADEREZOS */}
            <div className="opcion-grupo">
              <p className="opcion-titulo">
                Aderezos <small>(1 gratis · cada extra +${COSTO_EXTRA})</small>
              </p>
              {ADEREZOS.map((a) => (
                <div key={a} className="opcion-fila">
                  <span>{a}</span>
                  <div className="contador">
                    <button onClick={() => cambiarAderezo(a, -1)}>−</button>
                    <span>{aderezos[a]}</span>
                    <button onClick={() => cambiarAderezo(a, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            {/* PICO DE GALLO */}
            <div className="opcion-grupo">
              <p className="opcion-titulo">
                Pico de gallo <small>(1 gratis · cada extra +${COSTO_EXTRA})</small>
              </p>
              <div className="opcion-fila">
                <span>Porción</span>
                <div className="contador">
                  <button onClick={() => cambiarPico(-1)}>−</button>
                  <span>{picoDeGallo}</span>
                  <button onClick={() => cambiarPico(1)}>+</button>
                </div>
              </div>
            </div>

            {/* EXTRA PROTEÍNA (incluye el mismo sabor) */}
            <div className="extra-select">
              <label>Ingrediente extra (+${COSTO_EXTRA}):</label>
              <select value={extraProteina} onChange={(e) => setExtraProteina(e.target.value)}>
                <option value="">Sin extra</option>
                {EXTRAS_PROTEINA.map((e) => (
                  <option key={e} value={e}>
                    {e}
                    {burrito.nombre.includes(e) ? ' (doble)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* CANTIDAD */}
            <div className="cantidad-control">
              <button onClick={decrementar}>−</button>
              <span>{cantidad}</span>
              <button onClick={incrementar}>+</button>
              <small>(máx 5)</small>
            </div>

            {/* DESGLOSE */}
            <div className="desglose-modal">
              <p>Precio base: ${burrito.precio}</p>
              {costoExtraSalsas > 0 && <p>Salsas extra: +${costoExtraSalsas}</p>}
              {costoExtraAderezos > 0 && <p>Aderezos extra: +${costoExtraAderezos}</p>}
              {costoExtraPico > 0 && <p>Pico de gallo extra: +${costoExtraPico}</p>}
              {costoExtraProteina > 0 && <p>Extra {extraProteina}: +${costoExtraProteina}</p>}
              <p>Cantidad: {cantidad}</p>
              <p className="total-modal">Total: ${precioTotal}</p>
            </div>

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
