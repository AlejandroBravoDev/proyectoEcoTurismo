import styles from "./slider.module.css";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
import img4 from "../../assets/img4.jpg";
import img5 from "../../assets/img5.jpg";

// ✨ DATOS DEL SLIDER (Asegúrate de que tus descripciones estén en este formato)
const sliderData = [
  {
    id: 1,
    src: img1,
    title: "Termales de Santa Rosa de Cabal",
    desc: "Aguas termales y cascadas imponentes para una relajación total.",
  },
  {
    id: 2,
    src: img2,
    title: "Bioparque Ukumarí",
    desc: "El centro de conservación de fauna más grande de América Latina.",
  },
  {
    id: 3,
    src: img3,
    title: "Santuario Otún Quimbaya",
    desc: "Reserva de fauna y flora clave para el avistamiento de aves.",
  },
  {
    id: 4,
    src: img4,
    title: "Rutas del Café",
    desc: "Descubre el proceso del café en las fincas tradicionales de Risaralda.",
  },
  {
    id: 5,
    src: img5,
    title: "PNN Los Nevados",
    desc: "Ecosistemas de páramo y alta montaña, hogar de la Laguna del Otún.",
  },
];

function Slider() {
  const handleDetailClick = (title) => {
    // Puedes implementar aquí la lógica para navegar a una página de detalles
    // o mostrar una modal (usando React Router, por ejemplo).
    console.log(`Ver detalles para: ${title}`);
    alert(`Preparando navegación para ${title}...`);
  };

  return (
    <div>
      <h2 className={styles.titleSegundasection}>
        SITIOS <span>ECO TURISTICOS </span>MAS VISITADOS
      </h2>

      <section className={styles.containerSegundasection}>
        {sliderData.map((item) => (
          // 1. Contenedor principal que maneja el hover (expansión y opacidad)
          <div key={item.id} className={styles.sliderItem}>
            <img src={item.src} alt={item.title} />

            {/* 2. Capa de superposición con el texto y el botón */}
            <div className={styles.overlay}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>

              <button
                className={styles.detailButton}
                onClick={() => handleDetailClick(item.title)}
              >
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Slider;
