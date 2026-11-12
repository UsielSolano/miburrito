import { useState } from 'react';
import { useCarrito } from '../../context/useCarrito';
import { buscarZona } from '../../utils/calcularEnvio';
import './CarritoModal.css';

const WHATSAPP_NUMERO = '523121508470';
const DIRECCION_PICKUP = 'Calle Castilla #1383, Montellano 2';

const DATOS_TRANSFERENCIA = {
  clabe: '722969010600748236',
  beneficiario: 'Usiel Sebastian Solano Silva',
  institucion: 'Mercado Pago W',
};

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
  const [tipoEntrega, setTipoEntrega] = useState('');
  const [formEnvio, setFormEnvio] = useState({
    cp: '',
    colonia: '',
    calle: '',
    numero: '',
  });
  const [errores, setErrores] = useState({});
  const [copiado, setCopiado] = useState(false);
  const [pagoCon, setPagoCon] = useState('');

  const esEnvio = tipoEntrega === 'envio';

  // 🔥 Cálculo dinámico de envío basado en CP + Colonia
  const zonaInfo = buscarZona(formEnvio.cp, formEnvio.colonia);
  const costoEnvio = esEnvio ? zonaInfo?.costo ?? null : 0;
  const envioValido = !esEnvio || costoEnvio !== null;
  const totalConEnvio = total + (envioValido ? costoEnvio || 0 : 0);

  // 💵 Cambio para pago en efectivo
  const montoPagoCon = parseFloat(pagoCon) || 0;
  const cambio = montoPagoCon > 0 ? montoPagoCon - totalConEnvio : 0;
  const cambioValido = montoPagoCon >= totalConEnvio;

  const handleChangeForm = (campo, valor) => {
    setFormEnvio((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: '' }));
    }
  };

  const copiarClabe = async () => {
    try {
      await navigator.clipboard.writeText(DATOS_TRANSFERENCIA.clabe);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Fallback por si el navegador bloquea clipboard
      const input = document.createElement('input');
      input.value = DATOS_TRANSFERENCIA.clabe;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formEnvio.cp.trim()) nuevosErrores.cp = 'CP requerido';
    if (!formEnvio.colonia.trim()) nuevosErrores.colonia = 'Colonia requerida';
    if (!formEnvio.calle.trim()) nuevosErrores.calle = 'Calle requerida';
    if (!formEnvio.numero.trim()) nuevosErrores.numero = 'Número requerido';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const hacerPedido = () => {
    if (!tipoEntrega) {
      alert('Por favor selecciona Envío a domicilio o Pick Up');
      return;
    }
    if (!tipoPago) {
      alert('Por favor selecciona un tipo de pago');
      return;
    }
    if (carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    if (esEnvio) {
      if (!validarFormulario()) {
        alert('Completa todos los campos de la dirección de envío');
        return;
      }
      if (costoEnvio === null) {
        alert(
          'No tenemos cobertura para ese CP/Colonia. Revisa los datos o contáctanos por WhatsApp.'
        );
        return;
      }
    }
    if (tipoPago === 'efectivo') {
      if (!pagoCon.trim()) {
        alert('Indica con cuánto pagarás para que el repartidor lleve cambio');
        return;
      }
      if (!cambioValido) {
        alert('El monto con el que pagas debe ser mayor o igual al total');
        return;
      }
    }

    let mensaje = '* PEDIDO - BÜRRITÜS *\n\n';

    // Método de entrega
    if (esEnvio) {
      mensaje += `* Entrega a domicilio*\n`;
      mensaje += `   Dirección: Calle ${formEnvio.calle} #${formEnvio.numero}\n`;
      mensaje += `   Colonia: ${formEnvio.colonia}\n`;
      mensaje += `   CP: ${formEnvio.cp}\n`;
      if (zonaInfo) {
        mensaje += `   Zona: ${zonaInfo.zona} (${zonaInfo.distancia} km)\n`;
      }
      mensaje += `\n`;
    } else {
      mensaje += `*🏪 Pick Up*\n`;
      mensaje += `   Recoger en: ${DIRECCION_PICKUP}\n\n`;
    }

    // Items
    carrito.forEach((item, i) => {
      mensaje += `*${i + 1}. Burrito de ${item.nombre}* (x${item.cantidad})\n`;
      mensaje += item.esLowCarb
        ? `   🌿 Low Carb (sin tortilla)\n`
        : `   Base: arroz rojo, frijol, lechuga\n`;

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

    // Totales
    mensaje += `*Subtotal:* $${total}\n`;
    if (esEnvio) {
      mensaje += `*Envío:* $${costoEnvio}\n`;
      mensaje += `*TOTAL A PAGAR:* $${totalConEnvio}\n\n`;
    } else {
      mensaje += `*TOTAL A PAGAR:* $${total} (Pick Up)\n\n`;
    }

    // Método de pago + detalles
    if (tipoPago === 'transferencia') {
      mensaje += `*Método de pago:* Transferencia\n`;
      mensaje += `   CLABE: ${DATOS_TRANSFERENCIA.clabe}\n`;
      mensaje += `   Beneficiario: ${DATOS_TRANSFERENCIA.beneficiario}\n`;
      mensaje += `   Institución: ${DATOS_TRANSFERENCIA.institucion}\n`;
      mensaje += `   (Enviar comprobante por este mismo chat)`;
    } else {
      mensaje += `*Método de pago:* Efectivo\n`;
      mensaje += `   Paga con: $${montoPagoCon.toFixed(2)}\n`;
      mensaje += `   Cambio: $${cambio.toFixed(2)}`;
    }

    const url = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    vaciarCarrito();
    onCerrar();
  };

  return (
    <div className="carrito-overlay" onClick={onCerrar}>
      <div className="carrito-modal" onClick={(e) => e.stopPropagation()}>
        <div className="carrito-header">
          <h2>🛒 Tu Pedido</h2>
          <button className="btn-cerrar" onClick={onCerrar}>
            ✕
          </button>
        </div>

        {carrito.length === 0 ? (
          <p className="carrito-vacio">Tu carrito está vacío</p>
        ) : (
          <>
            {/* ITEMS */}
            <div className="carrito-items">
              {carrito.map((item) => (
                <div key={item.id} className="carrito-item">
                  <div>
                    <strong>
                      Burrito de {item.nombre} (x{item.cantidad})
                    </strong>
                    <p className="item-detalle">
                      {item.esLowCarb
                        ? 'Low Carb (sin tortilla)'
                        : 'Arroz rojo · Frijol · Lechuga'}
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

            {/* MÉTODO DE ENTREGA */}
            <div className="pago-seccion">
              <h3>Método de entrega</h3>
              <div className="pago-opciones">
                <label className={tipoEntrega === 'envio' ? 'activo' : ''}>
                  <input
                    type="radio"
                    name="entrega"
                    value="envio"
                    checked={tipoEntrega === 'envio'}
                    onChange={(e) => setTipoEntrega(e.target.value)}
                  />
                  🚚 Envío a domicilio
                </label>
                <label className={tipoEntrega === 'pickup' ? 'activo' : ''}>
                  <input
                    type="radio"
                    name="entrega"
                    value="pickup"
                    checked={tipoEntrega === 'pickup'}
                    onChange={(e) => setTipoEntrega(e.target.value)}
                  />
                  🏪 Pick Up
                </label>
              </div>
            </div>

            {/* FORMULARIO DE ENVÍO */}
            {esEnvio && (
              <div className="form-envio">
                <p className="form-envio-info">
                  📍 También puedes recoger en: <strong>{DIRECCION_PICKUP}</strong>
                </p>

                <div className="form-grupo">
                  <label>CP *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formEnvio.cp}
                    onChange={(e) =>
                      handleChangeForm('cp', e.target.value.replace(/\D/g, ''))
                    }
                    placeholder="Ej. 28989"
                    maxLength={5}
                    className={errores.cp ? 'error' : ''}
                  />
                  {errores.cp && <span className="error-msg">{errores.cp}</span>}
                </div>

                <div className="form-grupo">
                  <label>Colonia *</label>
                  <input
                    type="text"
                    value={formEnvio.colonia}
                    onChange={(e) => handleChangeForm('colonia', e.target.value)}
                    placeholder="Ej. Montellano"
                    className={errores.colonia ? 'error' : ''}
                  />
                  {errores.colonia && (
                    <span className="error-msg">{errores.colonia}</span>
                  )}
                </div>

                <div className="form-fila">
                  <div className="form-grupo">
                    <label>Calle *</label>
                    <input
                      type="text"
                      value={formEnvio.calle}
                      onChange={(e) => handleChangeForm('calle', e.target.value)}
                      placeholder="Ej. Castilla"
                      className={errores.calle ? 'error' : ''}
                    />
                    {errores.calle && (
                      <span className="error-msg">{errores.calle}</span>
                    )}
                  </div>

                  <div className="form-grupo">
                    <label>Número *</label>
                    <input
                      type="text"
                      value={formEnvio.numero}
                      onChange={(e) => handleChangeForm('numero', e.target.value)}
                      placeholder="Ej. 1383"
                      className={errores.numero ? 'error' : ''}
                    />
                    {errores.numero && (
                      <span className="error-msg">{errores.numero}</span>
                    )}
                  </div>
                </div>

                {/* INFO DINÁMICA DE ENVÍO */}
                {formEnvio.cp.length === 5 && formEnvio.colonia.trim() && (
                  <div
                    className={`envio-calculado ${
                      costoEnvio === null ? 'envio-error' : ''
                    }`}
                  >
                    {costoEnvio !== null ? (
                      <>
                        <p>
                          ✅ Cobertura confirmada · <strong>{zonaInfo.zona}</strong>
                        </p>
                        <p>
                          Costo de envío: <strong>${costoEnvio}</strong>
                        </p>
                      </>
                    ) : (
                      <p>
                        ❌ No tenemos cobertura para ese CP/Colonia. Contáctanos
                        por WhatsApp.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PICKUP INFO */}
            {tipoEntrega === 'pickup' && (
              <div className="pickup-info">
                <p>🏪 Recoge tu pedido en:</p>
                <strong>{DIRECCION_PICKUP}</strong>
              </div>
            )}

            {/* RESUMEN */}
            <div className="carrito-resumen">
              <div className="resumen-linea">
                <span>Subtotal:</span>
                <span>${total}</span>
              </div>
              {esEnvio && (
                <div className="resumen-linea">
                  <span>Costo de envío:</span>
                  <span>
                    {costoEnvio !== null ? `$${costoEnvio}` : 'No disponible'}
                  </span>
                </div>
              )}
              <div className="resumen-linea total">
                <span>Total:</span>
                <span>${totalConEnvio}</span>
              </div>
            </div>

            {/* MÉTODO DE PAGO */}
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

              {/* DATOS DE TRANSFERENCIA */}
              {tipoPago === 'transferencia' && (
                <div className="pago-detalle pago-transferencia">
                  <p className="pago-detalle-titulo">
                    Transfiere a la siguiente cuenta:
                  </p>

                  <div className="clabe-fila">
                    <div>
                      <span className="clabe-label">CLABE</span>
                      <p className="clabe-valor">{DATOS_TRANSFERENCIA.clabe}</p>
                    </div>
                    <button
                      type="button"
                      className="btn-copiar"
                      onClick={copiarClabe}
                      title="Copiar CLABE"
                    >
                      {copiado ? '✓ Copiado' : '📋 Copiar'}
                    </button>
                  </div>

                  <p className="pago-dato">
                    <strong>Beneficiario:</strong>{' '}
                    {DATOS_TRANSFERENCIA.beneficiario}
                  </p>
                  <p className="pago-dato">
                    <strong>Institución:</strong>{' '}
                    {DATOS_TRANSFERENCIA.institucion}
                  </p>

                  <p className="pago-aviso">
                    📌 Envía tu comprobante por WhatsApp al confirmar el pedido.
                  </p>
                </div>
              )}

              {/* EFECTIVO: ¿CON CUÁNTO PAGAS? */}
              {tipoPago === 'efectivo' && (
                <div className="pago-detalle pago-efectivo">
                  <label className="efectivo-label">
                    ¿Con cuánto vas a pagar? *
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    value={pagoCon}
                    onChange={(e) => setPagoCon(e.target.value)}
                    placeholder={`Ej. ${Math.ceil(totalConEnvio / 50) * 50}`}
                    className="efectivo-input"
                  />

                  {montoPagoCon > 0 && (
                    <div
                      className={`cambio-info ${
                        cambioValido ? '' : 'cambio-error'
                      }`}
                    >
                      {cambioValido ? (
                        <p>
                          💰 Cambio que llevará el repartidor:{' '}
                          <strong>${cambio.toFixed(2)}</strong>
                        </p>
                      ) : (
                        <p>
                          ⚠️ El monto debe ser mayor o igual al total ($
                          {totalConEnvio})
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
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
