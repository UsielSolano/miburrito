import './Especialidades.css';

const Especialidades = () => {
  const especialidades = [
    {
      nombre: 'Burrito de Arrachera',
      descripcion: 'Jugosa arrachera a la parrilla con todos los ingredientes',
      img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    },
    {
      nombre: 'Burrito de Pollo',
      descripcion: 'Pollo sazonado con nuestra receta secreta',
      img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    },
  ];

  return (
    <section className="especialidades">
      <h2>Nuestras Especialidades</h2>
      <div className="especialidades-grid">
        {especialidades.map((esp, i) => (
          <div key={i} className="especialidad-card">
            <img src={esp.img} alt={esp.nombre} />
            <h3>{esp.nombre}</h3>
            <p>{esp.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Especialidades;
