import BurritoCard from '../BurritoCard/BurritoCard';
import { useCarrito } from '../../context/useCarrito';
import './MenuBurritos.css';

const burritos = [
  { nombre: 'Pollo', precio: 145 },
  { nombre: 'Arrachera', precio: 165 },
  { nombre: 'Vegetariano', precio: 115 },
  { nombre: 'Adobada', precio: 145 },
];

const burritosLowCarb = [
  { nombre: 'Pollo Low Carb', precio: 145 },
  { nombre: 'Arrachera Low Carb', precio: 165 },
  { nombre: 'Vegetariano Low Carb', precio: 115 },
  { nombre: 'Adobada Low Carb', precio: 145 },
];

const MenuBurritos = ({ onAbrirCarrito }) => {
  const { carrito } = useCarrito();

  return (
    <section className="menu-section" id="menu">
      <h2>Menú de Burritos</h2>
      <p className="menu-nota">
        Todos incluyen: arroz rojo, frijol, lechuga y queso · Salsas, aderezos y pico de gallo (1 de cada uno gratis)
      </p>
      <div className="menu-grid">
        {burritos.map((b, i) => (
          <BurritoCard key={`normal-${i}`} burrito={b} />
        ))}
      </div>

      <div className="lowcarb-seccion">
        <div className="lowcarb-header">
          <h2>Línea Low Carb </h2>
          <p className="menu-nota">
            Sin tortilla · Lechuga, arroz rojo, frijol y queso · Salsas, aderezos y pico de gallo (1 de cada uno gratis)
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
