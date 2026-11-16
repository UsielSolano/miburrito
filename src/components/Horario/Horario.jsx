import { useEffect, useState } from 'react';
import './Horario.css';


const DIAS_ABIERTOS = [4, 5, 6]; 
const HORA_APERTURA = { h: 17, m: 0 }; 
const HORA_CIERRE = { h: 20, m: 30 }; 

const getFechaColima = () => {
  const ahora = new Date();
  return new Date(
    ahora.toLocaleString('en-US', { timeZone: 'America/Mexico_City' })
  );
};

const estaAbierto = () => {
  const fecha = getFechaColima();
  const dia = fecha.getDay();
  if (!DIAS_ABIERTOS.includes(dia)) return false;

  const minutos = fecha.getHours() * 60 + fecha.getMinutes();
  const apertura = HORA_APERTURA.h * 60 + HORA_APERTURA.m;
  const cierre = HORA_CIERRE.h * 60 + HORA_CIERRE.m;

  return minutos >= apertura && minutos < cierre;
};

const Horario = ({ variante = 'inline' }) => {
  const [abierto, setAbierto] = useState(estaAbierto());

  // Recalcula cada 30 s para mantener el estado actualizado
  useEffect(() => {
    const id = setInterval(() => setAbierto(estaAbierto()), 30000);
    return () => clearInterval(id);
  }, []);

  if (variante === 'badge') {
    return (
      <div className={`horario-badge ${abierto ? 'abierto' : 'cerrado'}`}>
        <span className="horario-dot" />
        <span className="horario-estado">{abierto ? 'ABIERTO' : 'CERRADO'}</span>
        <span className="horario-horario">Jue · Vie · Sáb · 17:00 – 20:30</span>
      </div>
    );
  }

  return (
    <div className={`horario-card ${abierto ? 'abierto' : 'cerrado'}`}>
      <div className="horario-header">
        <span className="horario-dot" />
        <h3>{abierto ? '¡Estamos abiertos!' : 'Estamos cerrados'}</h3>
      </div>
      <p className="horario-texto">
        {abierto
          ? 'Puedes hacer tu pedido ahora mismo 🌯'
          : 'Vuelve en nuestro horario de atención:'}
      </p>
      <ul className="horario-lista">
        <li>
          <strong>Jueves</strong> · 17:00 – 20:30
        </li>
        <li>
          <strong>Viernes</strong> · 17:00 – 20:30
        </li>
        <li>
          <strong>Sábado</strong> · 17:00 – 20:30
        </li>
      </ul>
    </div>
  );
};

export default Horario;
