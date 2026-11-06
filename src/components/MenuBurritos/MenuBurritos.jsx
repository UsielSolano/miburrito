import BurritoCard from '../BurritoCard/BurritoCard';
import { useCarrito } from '../../context/CarritoContext';
import './MenuBurritos.css';

const burritos = [
  { nombre: 'Pollo', precio: 95 },
  { nombre: 'Arrachera', precio: 105 },
  { nombre: 'Vegetariano', precio: 95 },
  { nombre: 'Adobada', precio: 105 },
];

const burritosLowCarb = [
  { nombre: 'Pollo ', precio: 90 },
  { nombre: 'Arrachera ', precio: 100 },
  { nombre: 'Vegetariano ', precio: 90 },
  { nombre: 'Adobada ', precio: 100 },
];

const MenuBurritos = ({ onAbrirCarrito }) => {
  const { carrito } = useCarrito();

  return (
    <section className="menu-section" id="menu">
      <h2>Menú de Burritos</h2>
      <p className="menu-nota">
        Todos incluyen: arroz rojo, frijol y lechuga · Jitomate y cebolla opcional (sin costo)
      </p>
      <div className="menu-grid">
        {burritos.map((b, i) => (
          <BurritoCard key={`normal-${i}`} burrito={b} />
        ))}
      </div>

      {/* ───── LÍNEA LOW CARB ───── */}
      <div className="lowcarb-seccion">
        <div className="lowcarb-header">
          <h2>Línea Low Carb </h2>
          <p className="menu-nota">
            Sin tortilla · Lechuga, arroz rojo, frijol y jitomate · Jitomate y cebolla opcional (sin costo)
          </p>
        </div>
        <div className="menu-grid">
          {burritosLowCarb.map((b, i) => (
            <BurritoCard key={`lowcarb-${i}`} burrito={b} esLowCarb />
          ))}
        </div>
      </div>

      <button className="btn-carrito-flotante" onClick={onAbrirCarrito}>
        🛒 Ver Carrito ({carrito.length})
      </button>
    </section>
  );
};

export default MenuBurritos;
