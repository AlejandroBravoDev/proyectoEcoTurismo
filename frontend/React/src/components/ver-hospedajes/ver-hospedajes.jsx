import React, { useState } from "react";
import styles from "./VerHospedaje.module.css";
// Asegúrate de que estas rutas de importación sean correctas
import Header from "../header";
import Footer from "../footer";
import imgMeerkat from "../../assets/img4.jpg";
import imgLion from "../../assets/img6.jpg";
import imgParrot from "../../assets/img1.jpg";
import {
  FaMapMarkerAlt,
  FaRegHeart,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";

function VerHospedaje() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [opinions, setOpinions] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ➤ NUEVO: Favoritos
  const [isFavorite, setIsFavorite] = useState(false);

  // ➤ NUEVO: Imagen seleccionada
  const [_selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ➤ NUEVO: Tipo de visita
  const [visitType, setVisitType] = useState("");
  const visitOptions = ["Familia", "Amigos", "Turistas", "Trabajo", "Vacaciones"];

  const images = [
    { src: imgMeerkat, alt: "Suricata" },
    { src: imgLion, alt: "Leona" },
    { src: imgParrot, alt: "Loro" },
  ];
  const totalSlides = images.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // ➤ NUEVO: leer imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (comment.trim() === "") return;

    const newOpinion = {
      comment,
      rating,
      visitType,
      imagePreview,
    };

    setOpinions([...opinions, newOpinion]);
    setComment("");
    setRating(0);
    setVisitType("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <main className={styles.mainContent}>
          <section className={styles.titleSection}>
            <h1>Casa Luz Hospedaje Campestre</h1>
            <div className={styles.actionButtons}>
              {/* ➤ FAVORITOS */}
              <button
                className={styles.btnFilled}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
                {" "}Favoritas
              </button>
            </div>
          </section>

          {/* ❗SE MANTIENE LA GALERÍA ORIGNAL */}
          <section className={styles.gallery}>
            <div className={styles.mainImage}>
              <img src={images[0].src} alt={images[0].alt} />
            </div>
            <div className={styles.sideImages}>
              <img src={images[1].src} alt={images[1].alt} />
              <img src={images[2].src} alt={images[2].alt} />
            </div>
          </section>

          {/* ❗SLIDER ORIGINAL */}
          <section className={styles.mobileSlider}>
            <div
              className={styles.sliderTrack}
              style={{ transform: `translateX(-${currentSlide * 33.3333}%)` }}
            >
              {images.map((image, index) => (
                <div key={index} className={styles.sliderItem}>
                  <img src={image.src} alt={image.alt} />
                </div>
              ))}
            </div>
            <button
              className={`${styles.sliderControl} ${styles.prev}`}
              onClick={prevSlide}
            >
              <FaChevronLeft size={24} />
            </button>
            <button
              className={`${styles.sliderControl} ${styles.next}`}
              onClick={nextSlide}
            >
              <FaChevronRight size={24} />
            </button>

            <div className={styles.sliderDots}>
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`${styles.dot} ${
                    index === currentSlide ? styles.activeDot : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </section>

          <div className={styles.mobileActionButtons}>
            <button className={styles.btnOutline}>Opinión</button>
            <button className={styles.btnFilled}>
              <FaRegHeart /> Favoritas
            </button>
          </div>

          {/* ❗SECCIÓN ORIGINAL */}
          <section className={styles.infoSection}>
            <h3>Acerca de</h3>
            <p>
              El Bioparque Ukumarí es un parque de flora y fauna con enfoque en
              conservación. Sus hábitats inmersivos permiten que los animales
              vivan en condiciones similares a su entorno natural. Ideal para
              aprender sobre biodiversidad y disfrutar la naturaleza.
            </p>

            <div className={styles.location}>
              <FaMapMarkerAlt className={styles.locationIcon} />
              <div className={styles.locationText}>
                <h3>Ubicado en</h3>
                <p>
                  Kilómetro 14 vía Pereira - Cerritos, entrada por la Estación
                  de Servicio Santa Bárbara, Pereira, Risaralda, Colombia
                </p>
              </div>
            </div>

            <h3>Cercano a</h3>
            <p>Este hospedaje es cercano al Bioparque Ukumarí.</p>
          </section>

          {/* ===========================================================
              ➤ FORMULARIO DE OPINIÓN → SOLO SE AGREGA LO NECESARIO
              =========================================================== */}
          <section className={styles.reviewSection}>
            <h2>¡Cuéntanos cómo fue tu experiencia!</h2>

            <div className={styles.reviewForm}>
              <textarea
                placeholder="Cuéntanos aquí"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className={styles.reviewActions}>

                {/* ➤ INPUT DE IMAGEN REAL SIN BORRAR TU BOTÓN */}
                <label className={styles.btnOutline}>
                  <MdAddPhotoAlternate /> Adjuntar una imagen
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageUpload}
                  />
                </label>

                {/* ➤ SELECTOR TIPO DE VISITA */}
                <select
                  className={styles.btnOutline}
                  value={visitType}
                  onChange={(e) => setVisitType(e.target.value)}
                >
                  <option value="">Familia ❯</option>
                  {visitOptions.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* ➤ VISTA PREVIA */}
              {imagePreview && (
                <div className={styles.previewContainer}>
                  <p>Esta es la imagen seleccionada:</p>
                  <img src={imagePreview} className={styles.previewImage} />
                </div>
              )}
            </div>

            {/* CALIFICACIÓN ORIGINAL */}
            <h3>¿Cómo calificarías tu experiencia?</h3>
            <div className={styles.heartRating}>
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                      style={{ display: "none" }}
                    />
                    <FaHeart
                      className={styles.heartIcon}
                      color={
                        ratingValue <= (hover || rating) ? "#4b8236" : "#e4e5e9"
                      }
                      size={40}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    />
                  </label>
                );
              })}
            </div>

            <button className={styles.btnFilled} onClick={handleSubmit}>
              Enviar opinión
            </button>
          </section>

          {/* ===========================================================
              ➤ OPINIONES → SOLO SE AGREGA MOSTRAR IMAGEN + VISITA
              =========================================================== */}
          <section className={styles.opinionsSection}>
            <h2>Opiniones</h2>
            {opinions.length === 0 ? (
              <p>Aún no has hecho ningún comentario.</p>
            ) : (
              opinions.map((op, i) => (
                <div key={i} className={styles.opinionCard}>

                  {/* imagen */}
                  {op.imagePreview && (
                    <img src={op.imagePreview} className={styles.opinionImage} />
                  )}

                  {/* tipo de visita */}
                  {op.visitType && (
                    <p><strong>Tipo de visita:</strong> {op.visitType}</p>
                  )}

                  <p>{op.comment}</p>

                  <div className={styles.opinionRating}>
                    {[...Array(op.rating)].map((_, idx) => (
                      <FaHeart key={idx} color="#4b8236" />
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

export default VerHospedaje;
