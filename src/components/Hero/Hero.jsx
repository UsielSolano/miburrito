import Horario from '../Horario/Horario';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
         <Horario variante="badge" />
        <h1>BÜRRITÜS</h1>
        <em>"El que te comas te va gustar"</em>
      </div>
    </section>
  );
};

export default Hero;
