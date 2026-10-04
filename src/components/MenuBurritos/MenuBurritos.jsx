import BurritoCard from '../BurritoCard/BurritoCard';
import { useCarrito } from '../../context/CarritoContext';
import './MenuBurritos.css';

const burritos = [
  { nombre: 'Pollo', precio: 65 },
  { nombre: 'Arrachera', precio: 85 },
  { nombre: 'Picadillo', precio: 60 },
  { nombre: 'Huevo', precio: 50 },
  { nombre: 'Atún', precio: 55 },
  { nombre: 'Natural', precio: 45 },
  { nombre: 'Chorizo', precio: 60 },
  { nombre: 'Bistec', precio: 70 },
];

const MenuBurritos = ({ onAbrirCarrito }) => {
  const { carrito } = useCarrito();

  return (
    <section className="menu-section" id="menu">
      <h2>Menú de Burritos</h2>
      <p className="menu-nota">
        Todos incluyen: arroz, frijol y lechuga · Jitomate y cebolla opcional (sin costo)
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
