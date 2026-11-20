import BurritoCard from '../BurritoCard/BurritoCard';
import { useCarrito } from '../../context/useCarrito';
import './MenuBurritos.css';

const burritos = [
  { nombre: 'Pollo', precio: 95 },
  { nombre: 'Arrachera', precio: 105 },
  { nombre: 'Vegetariano', precio: 85 },
  { nombre: 'Bistec', precio: 105 },
];

const burritosLowCarb = [
  { nombre: 'Pollo Low Carb', precio: 105 },
  { nombre: 'Arrachera Low Carb', precio: 115 },
  { nombre: 'Vegetariano Low Carb', precio: 95 },
  { nombre: 'Bistec Low Carb', precio: 115 },
];

const papas = [{ nombre: 'Papas Gajo 300g', precio: 75 }];

const MenuBurritos = ({ onAbrirCarrito }) => {
  const { carrito } = useCarrito();

  return (
    <section className="menu-section" id="menu">
      <h2>Menú de Burritos</h2>
      <p className="menu-nota">
        Todos incluyen: arroz rojo, frijol y lechuga · Salsas, aderezos y pico de gallo (1 de cada uno gratis)
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
            Sin tortilla · Lechuga, arroz rojo, frijol y jitomate · Salsas, aderezos y pico de gallo (1 de cada uno gratis)
          </p>
        </div>
        <div className="menu-grid">
          {burritosLowCarb.map((b, i) => (
            <BurritoCard key={`lowcarb-${i}`} burrito={b} esLowCarb />
          ))}
        </div>
      </div>

      {/* ───── PAPAS GAJO ───── */}
      <div className="papas-seccion">
        <div className="papas-header">
          <h2>Papas Gajo </h2>
          <p className="menu-nota">
            Papas gajo de 300 g · Puedes agregar proteína extra (+$10)
          </p>
        </div>
        <div className="menu-grid">
          {papas.map((p, i) => (
            <BurritoCard key={`papas-${i}`} burrito={p} esPapas />
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
