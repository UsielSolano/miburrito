import BurritoCard from '../BurritoCard/BurritoCard';
import { useCarrito } from '../../context/CarritoContext';
import './MenuBurritos.css';

const burritos = [
  { nombre: 'Pollo', precio: 95 },
  { nombre: 'Arrachera', precio: 105 },
  { nombre: 'Vegetariano', precio: 85 },
  { nombre: 'Bistec', precio: 105 }
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
          <BurritoCard key={i} burrito={b} />
        ))}
      </div>

      <button className="btn-carrito-flotante" onClick={onAbrirCarrito}>
        🛒 Ver Carrito ({carrito.length})
      </button>
    </section>
  );
};

export default MenuBurritos;
