import { useState } from "react";

const faqs = [
  {
    question: "¿Qué tipo de actividades de ecoturismo ofrecen?",
    answer:
      "Ofrecemos senderismo ecológico, avistamiento de aves, recorridos guiados por la naturaleza, experiencias culturales y espacios de descanso en entornos naturales.",
  },
  {
    question: "¿Es necesario tener experiencia previa para participar?",
    answer:
      "No, nuestras actividades están pensadas tanto para principiantes como para personas con experiencia. Siempre indicamos el nivel de dificultad.",
  },
  {
    question: "¿Las actividades son seguras?",
    answer:
      "Sí, todas las actividades cumplen normas de seguridad y son guiadas por personal capacitado.",
  },
  {
    question: "¿Qué debo llevar para mi visita?",
    answer:
      "Ropa cómoda, calzado adecuado, bloqueador solar, gorra, agua y una cámara si deseas tomar fotos.",
  },
  {
    question: "¿Puedo visitar el lugar con niños o adultos mayores?",
    answer:
      "Sí, contamos con actividades familiares y de bajo esfuerzo físico. Recomendamos revisar la descripción de cada actividad.",
  },
  {
    question: "¿Cuál es la mejor época del año para visitar este destino ecoturístico?",
    answer:
      "La mejor época para visitarnos es durante las temporadas de clima estable, cuando los senderos están en mejores condiciones y se pueden disfrutar plenamente los paisajes y la biodiversidad del lugar.",
  },
  {
    question: "¿Qué medidas toman para cuidar el medio ambiente?",
    answer:
      "Promovemos el turismo responsable, limitamos visitantes, reducimos plásticos y cuidamos la flora y fauna.",
  },
  {
    question: "¿Qué tipo de clima se presenta en la zona?",
    answer:
      "El clima es generalmente templado y húmedo, propio de zonas naturales, por lo que se recomienda consultar el pronóstico y venir preparado para cambios de temperatura y lluvias ocasionales.",
  },
  {
    question: "¿Dónde están ubicados y cómo llegar?",
    answer:
      "En la sección 'Cómo llegar' encontrarás nuestra ubicación y las rutas recomendadas.",
  },
  {
    question: "¿Puedo dejar comentarios o calificaciones?",
    answer:
      "Sí, los comentarios y calificaciones ayudan a mejorar el servicio y orientar a otros visitantes.",
  },
];

export default function FaqEcoturismo() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full mx-auto p-40 flex flex-col gap-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
        Preguntas Frecuentes
      </h2>

      <div className="flex flex-col gap-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-green-200 rounded-xl shadow-sm"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-4 text-left font-medium text-green-800 hover:bg-green-50 transition"
            >
              <span>{faq.question}</span>
              <span
                className={`text-xl transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              >
                +
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out px-4 ${
                activeIndex === index
                  ? "max-h-40 opacity-100 pb-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
