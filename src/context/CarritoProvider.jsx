import { useState } from 'react';
import { CarritoContext } from './CarritoContext';

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (item) => {
    setCarrito((prev) => [...prev, item]);
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => setCarrito([]);

  const total = carrito.reduce((acc, item) => acc + item.precioTotal, 0);

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, total }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
