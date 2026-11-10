import { useContext } from 'react';
import { CarritoContext } from './CarritoContext';

export const useCarrito = () => useContext(CarritoContext);
