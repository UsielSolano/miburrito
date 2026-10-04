import { useState } from 'react';
import { CarritoProvider } from './context/CarritoContext';
import Hero from './components/Hero/Hero';
import Especialidades from './components/Especialidades/Especialidades';
import MenuBurritos from './components/MenuBurritos/MenuBurritos';
import Footer from './components/Footer/Footer';
import CarritoModal from './components/CarritoModal/CarritoModal';
import './App.css';

function App() {
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  return (
    <CarritoProvider>
      <div className="app">
        <Hero />
        <Especialidades />
        <MenuBurritos onAbrirCarrito={() => setCarritoAbierto(true)} />
        <Footer />
        {carritoAbierto && <CarritoModal onCerrar={() => setCarritoAbierto(false)} />}
      </div>
    </CarritoProvider>
  );
}

export default App;
