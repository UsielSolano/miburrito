import { useState } from 'react';
import { useCarrito } from '../../context/CarritoContext';
import './CarritoModal.css';

const COSTO_ENVIO = 40;
const WHATSAPP_NUMERO = '521234567890'; // ← cambia por tu número

const formatearOpciones = (item) => {
  const partes = [];

  if (item.extraProteina) partes.push(`Extra ${item.extraProteina}`);

  const salsas = Object.entries(item.salsas || {})
    .filter(([, n]) => n > 0)
    .map(([s, n]) => (n > 1 ? `${s} x${n}` : s));
  if (salsas.length) partes.push(`Salsa: ${salsas.join(', ')}`);

  const aderezos = Object.entries(item.aderezos || {})
    .filter(([, n]) => n > 0)
    .map(([a, n]) => (n > 1 ? `${a} x${n}` : a));
  if (aderezos.length) partes.push(`Aderezo: ${aderezos.join(', ')}`);

  if (item.picoDeGallo > 0) partes.push(`Pico de gallo x${item.picoDeGallo}`);

  return partes.join(' · ');
};

const CarritoModal = ({ onCerrar }) => {
  const { carrito, eliminarDelCarrito, vaciarCarrito, total } = useCarrito();
  const [tipoPago, setTipoPago] = useState('');

  const totalConEnvio = total + (carrito.length > 0 ? COSTO_ENVIO : 0);

  const hacerPedido = () => {
    if (!tipoPago) {
      alert('Por favor selecciona un tipo de pago');
      return;
    }
    if (carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    let mensaje = '*🌯 PEDIDO - BÜRRITÜS🌯*\n\n';
    carrito.forEach((item, i) => {
      mensaje += `*${i + 1}. Burrito ${item.nombre}* (x${item.cantidad})\n`;
      mensaje += item.esLowCarb
        ? `   Low Carb (sin tortilla)\n`
        : `   Base: arroz rojo, frijol, lechuga, queso\n`;

      const salsas = Object.entries(item.salsas || {})
        .filter(([, n]) => n > 0)
        .map(([s, n]) => (n > 1 ? `${s} x${n}` : s))
        .join(', ');
      if (salsas) mensaje += `   + Salsa: ${salsas}\n`;

      const aderezos = Object.entries(item.aderezos || {})
        .filter(([, n]) => n > 0)
        .map(([a, n]) => (n > 1 ? `${a} x${n}` : a))
        .join(', ');
      if (aderezos) mensaje += `   + Aderezo: ${aderezos}\n`;

      if (item.picoDeGallo > 0) mensaje += `   + Pico de gallo x${item.picoDeGallo}\n`;
      if (item.extraProteina) mensaje += `   + Extra: ${item.extraProteina} (+$10)\n`;

      mensaje += `   Subtotal: $${item.precioTotal}\n\n`;
    });

    mensaje += `*Subtotal:* $${total}\n`;
    mensaje += `*Envío:* $${COSTO_ENVIO}\n`;
    mensaje += `*TOTAL A PAGAR:* $${totalConEnvio}\n\n`;
    mensaje += `*Método de pago:* ${
      tipoPago === 'transferencia' ? 'Transferencia' : 'Efectivo'
    }`;

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    vaciarCarrito();
    onCerrar();
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="carrito-modal" onClick={(e) => e.stopPropagation()}>
        <div className="carrito-header">
          <h2> 🛒 Tu Pedido</h2>
          <button className="btn-cerrar" onClick={onCerrar}>
            ✕
          </button>
        </div>

        {carrito.length === 0 ? (
          <p className="carrito-vacio">Tu carrito está vacío</p>
        ) : (
          <>
            <div className="carrito-items">
              {carrito.map((item) => (
                <div key={item.id} className="carrito-item">
                  <div>
                    <strong>
                      Burrito {item.nombre} (x{item.cantidad})
                    </strong>
                    <p className="item-detalle">
                      {item.esLowCarb
                        ? 'Low Carb (sin tortilla)'
                        : 'Arroz rojo · Frijol · Lechuga · Queso'}
                    </p>
                    <p className="item-detalle">{formatearOpciones(item)}</p>
                  </div>
                  <div className="item-precio">
                    <span>${item.precioTotal}</span>
                    <button onClick={() => eliminarDelCarrito(item.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="carrito-resumen">
              <div className="resumen-linea">
                <span>Subtotal:</span>
                <span>${total}</span>
              </div>
              <div className="resumen-linea">
                <span>Costo de envío:</span>
                <span>${COSTO_ENVIO}</span>
              </div>
              <div className="resumen-linea total">
                <span>Total:</span>
                <span>${totalConEnvio}</span>
              </div>
            </div>

            <div className="pago-seccion">
              <h3>Método de pago</h3>
              <div className="pago-opciones">
                <label className={tipoPago === 'transferencia' ? 'activo' : ''}>
                  <input
                    type="radio"
                    name="pago"
                    value="transferencia"
                    checked={tipoPago === 'transferencia'}
                    onChange={(e) => setTipoPago(e.target.value)}
                  />
                  💳 Transferencia
                </label>
                <label className={tipoPago === 'efectivo' ? 'activo' : ''}>
                  <input
                    type="radio"
                    name="pago"
                    value="efectivo"
                    checked={tipoPago === 'efectivo'}
                    onChange={(e) => setTipoPago(e.target.value)}
                  />
                  💵 Efectivo
                </label>
              </div>
            </div>

            <button className="btn-hacer-pedido" onClick={hacerPedido}>
              Hacer Pedido por WhatsApp
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CarritoModal;
