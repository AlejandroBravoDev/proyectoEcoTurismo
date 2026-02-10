import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./verLugares.module.css";
import Header from "../header";
import Footer from "../footer";
import imgMeerkat from "../../assets/img4.jpg";
import imgLion from "../../assets/img6.jpg";
import imgParrot from "../../assets/img1.jpg";
import Mapa from "../mapa/map.jsx";
import ScrollToTop from "../ScrollToTop.jsx";
import Filter from "../../utils/profanity.js";
import Swal from "sweetalert2";
import {
  FaMapMarkerAlt,
  FaRegStar,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisH,
  FaThumbsUp,
  FaRegThumbsUp,
} from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";

const API = "http://localhost:8000";
const defaultImageUrls = [imgMeerkat, imgLion, imgParrot];

// --- BLOQUE DE ACCIONES DE COMENTARIO ---
const CommentActionsBlock = ({
  commentId,
  isOwner,
  onDelete,
  onReport,
  isMenuOpen,
  setMenuOpen,
}) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className={styles.commentActionsBlock}>
      <div className={styles.likeContainer}>
        <div className={styles.likeButton} onClick={handleLikeToggle}>
          {isLiked ? (
            <FaThumbsUp color="#666" />
          ) : (
            <FaRegThumbsUp color="#666" />
          )}
        </div>
        <span className={styles.likeCount}>{likes}</span>
      </div>

      <div className={styles.menuIcon}>
        <FaEllipsisH
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(isMenuOpen ? null : commentId);
          }}
        />

        {isMenuOpen && (
          <div className={styles.sideOptionsMenu}>
            {isOwner ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(commentId);
                }}
                className={`${styles.sideOptionItem} ${styles.delete}`}
              >
                Eliminar opinión
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReport(commentId);
                }}
                className={`${styles.sideOptionItem} ${styles.report}`}
              >
                Denunciar opinión
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
function VerLugares() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ESTADOS
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [opinions, setOpinions] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lugar, setLugar] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Familia");
  const [menuOpen, setMenuOpen] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [position, setPosition] = useState([
    4.81415861127678, -75.71023222513418,
  ]);
  const categories = ["Familia", "Amigos", "Trabajo", "Vacaciones", "Turista"];

  // --- LÓGICA DE CALIFICACIÓN ---
  const calificacionComentarios = () => {
    if (rating === 5) return "Excelente";
    if (rating === 4) return "Buena";
    if (rating === 3) return "Promedio";
    if (rating === 2) return "Mala";
    if (rating === 1) return "Muy mala";
    return "Selecciona una nota";
  };

  // --- IMÁGENES ---
  const imageSources =
    lugar?.todas_las_imagenes && lugar.todas_las_imagenes.length > 0
      ? lugar.todas_las_imagenes
      : defaultImageUrls;

  const totalSlides = imageSources.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // --- FETCH DATA ---
  const fetchCurrentUser = async (token) => {
    try {
      const res = await axios.get(`${API}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser({
        id: res.data.id,
        name: res.data.nombre_completo,
        avatar: res.data.avatar_url,
      });
      setUserId(res.data.id);
    } catch (err) {
      console.error("Error al cargar el usuario logueado:", err);
    }
  };

  const fetchLugar = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/lugares/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLugar(res.data);
      setOpinions(res.data.comentarios || []);
      console.log(lugar)
      if (res.data.coordenadas) {
        setPosition(res.data.coordenadas.split(",").map(Number));
      }
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? "El lugar no fue encontrado."
          : "No se pudo cargar el lugar.",
      );
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(`${API}/api/favoritos/check/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(response.data.isFavorite);
      } catch (err) {
        console.error("Error al verificar favorito:", err);
      }
    }
  };

  // --- ACCIONES ---
  const handleSubmit = async () => {
    if (!comment || comment.trim() === "") {
      Swal.fire({
        title: "no se puede publicar tú comentario",
        text: "El comentario está vacio",
        icon: "error",
      });
      return;
    }

    if (Filter.check(comment)) {
      Swal.fire({
        title: "no se puede publicar tú comentario",
        text: "Tú comentario tiene lenguaje inapropiado",
        icon: "error",
      });
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (rating === 0) {
      Swal.fire({
        title: "no se puede publicar tú comentario",
        text: "Tienes que darle una calificación al lugar",
        icon: "error"
      })
      return;
    }

    try {
      const formData = new FormData();
      formData.append("lugar_id", id);
      formData.append("contenido", comment);
      formData.append("rating", rating);
      formData.append("category", selectedCategory);
      if (selectedImage) formData.append("image", selectedImage);

      const response = await axios.post(`${API}/api/comentarios`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newOpinion = {
        ...response.data.comentario,
        user: currentUser,
        usuario_id: currentUser.id,
      };

      setOpinions([newOpinion, ...opinions]);
      setComment("");
      setRating(0);
      setSelectedImage(null);
      setSelectedCategory("Familia");
    } catch (err) {
      alert("Error al enviar el comentario.");
    }
  };

  const handleFavoriteToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      if (isFavorite) {
        await axios.delete(`${API}/api/favoritos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavorite(false);
      } else {
        await axios.post(
          `${API}/api/favoritos`,
          { lugar_id: id },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setIsFavorite(true);
      }
    } catch (err) {
      alert("Error al actualizar favoritos.");
    }
  };

  const deleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta opinión?"))
      return;
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.delete(`${API}/api/comentarios/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpinions(opinions.filter((op) => op.id !== commentId));
      setMenuOpen(null);
      alert("Opinión eliminada.");
    } catch (err) {
      alert("Error al eliminar.");
    }
  };

  const reportComment = async (commentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API}/api/comentarios/${commentId}/report`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Opinión denunciada.");
      setMenuOpen(null);
    } catch (err) {
      alert("Error al denunciar.");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const token = localStorage.getItem("token");
      if (token) await fetchCurrentUser(token);
      await fetchLugar();
      await checkFavorite();
    };
    loadData();
    const handleClickOutside = () => setMenuOpen(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [id]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    } else {
      alert("Selecciona una imagen válida.");
    }
  };

  const getDayAndMonth = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long", day: "numeric", month: "long" };
    let UpperDate = date
      .toLocaleDateString("es-ES", options)
      .replace(/de /g, "")
      .toLowerCase();
    return UpperDate.charAt(0).toUpperCase() + UpperDate.slice(1);
  };

  if (loading)
    return (
      <>
        <Header />
        <main className={styles.mainContent}>
          <p className={styles.textWait}>Cargando sitio...</p>
        </main>
        <Footer />
      </>
    );

  return (
    <>
      <ScrollToTop />
      <ScrollToTop />
      <Header />
      <main className={styles.mainContent}>
        <section className={styles.titleSection}>
          <h1>{lugar?.nombre || "Lugar Ecoturístico"}</h1>
          <div className={styles.actionButtons}>
            <button
              className={`${styles.btnFilled} ${isFavorite ? styles.active : ""}`}
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? <FaStar /> : <FaRegStar />} Favoritas
            </button>
          </div>
        </section>

        {/* GALERÍA DESKTOP */}
        <section className={styles.gallery}>
          <div className={styles.mainImage}>
            <img
              src={imageSources[0]}
              alt="Principal"
              onError={(e) => (e.target.src = defaultImageUrls[0])}
            />
          </div>
          <div className={styles.sideImages}>
            <img
              src={imageSources[1] || defaultImageUrls[1]}
              alt="Lateral 1"
              onError={(e) => (e.target.src = defaultImageUrls[1])}
            />
            <img
              src={imageSources[2] || defaultImageUrls[2]}
              alt="Lateral 2"
              onError={(e) => (e.target.src = defaultImageUrls[2])}
            />
          </div>
        </section>

        {/* SLIDER MÓVIL */}
        <section className={styles.mobileSlider}>
          <div
            className={styles.sliderTrack}
            style={{
              transform: `translateX(-${currentSlide * (100 / totalSlides)}%)`,
            }}
          >
            {imageSources.map((imgSrc, index) => (
              <div key={index} className={styles.sliderItem}>
                <img
                  src={imgSrc}
                  alt="Slide"
                  onError={(e) => (e.target.src = defaultImageUrls[index % 3])}
                />
              </div>
            ))}
          </div>
          <button
            className={`${styles.sliderControl} ${styles.prev}`}
            onClick={prevSlide}
          >
            <FaChevronLeft />
          </button>
          <button
            className={`${styles.sliderControl} ${styles.next}`}
            onClick={nextSlide}
          >
            <FaChevronRight />
          </button>
          <div className={styles.sliderDots}>
            {imageSources.map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </section>

        <section className={styles.infoSection}>
          <div className="w-full sm:w-[65%]">
            <h3 className="font-bold font-xl">Acerca de</h3>
            <p>{lugar?.descripcion || "Descripción no disponible"}</p>
          </div>
          <div className={styles.location}>
            <FaMapMarkerAlt className={styles.locationIcon} />
            <div className={styles.locationText}>
              <h3>Ubicado en</h3>
              <p>
                {lugar?.ubicacion
                  ? lugar.ubicacion
                  : "Aun no contamos con la ubicacion exacta de este sitio ecoturistico."}
              </p>
            </div>
          </div>
        </section>

        <section className={styles.reviewSection}>
          <Mapa positions={position} />
          <div className="w-full sm:w-full  md:w-[35%]  rounded-2xl bg-white p-8 ">
            <h2>¡Cuéntanos cómo fue tu experiencia!</h2>
            <div className={styles.reviewFormContainer}>
              <div className={styles.reviewForm}>
                <textarea
                  placeholder="Cuentanos aquí"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  cols={20}
                />
                <div className={styles.reviewActions}>
                  <label htmlFor="imageUpload" className={styles.btnOutline}>
                    <MdAddPhotoAlternate /> Adjunta una imagen
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <div className={styles.categorySelectContainer}>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={styles.categorySelect}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <FaChevronRight className={styles.categoryArrow} />
                  </div>
                </div>
              </div>
            </div>

            {selectedImage && (
              <div className={styles.imagePreview}>
                <p>Imagen seleccionada: {selectedImage.name}</p>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Vista previa"
                  className="w-50 h-50 rounded-xl"
                />
              </div>
            )}

            <div className={styles.ratingAndButton}>
              <div className={styles.ratingGroup}>
                <h3>¿Cómo calificarías tu experiencia?</h3>
                <div className={styles.heartRating}>
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    const isFilled = ratingValue <= (hover || rating);
                    const Icon = isFilled ? FaStar : FaRegStar;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          value={ratingValue}
                          onClick={() => setRating(ratingValue)}
                          style={{ display: "none" }}
                        />
                        <Icon
                          className={styles.heartIcon}
                          color={isFilled ? "#ffde21" : "#ffde21"}
                          size={40}
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(0)}
                        />
                      </label>
                    );
                  })}
                </div>
                <span className={styles.ratingText}>
                  {calificacionComentarios()}
                </span>
              </div>
              <button className={styles.btnFilled} onClick={handleSubmit}>
                Enviar opinión
              </button>
            </div>
          </div>
        </section>

        {/* LISTADO DE OPINIONES */}
        <section className={styles.opinionsSection}>
          <h2>Opiniones</h2>
          {opinions.length === 0 ? (
            <p className={styles.noComments}>No hay comentarios aún.</p>
          ) : (
            opinions.map((op) => (
              <div key={op.id} className={styles.opinionCard}>
                <div className={styles.opinionContent}>
                  <div className={styles.opinionHeader}>
                    <img
                      src={op.user?.avatar || "https://via.placeholder.com/50"}
                      alt="Avatar"
                      className={styles.userAvatar}
                    />
                    <div className={styles.userInfo}>
                      <h4>{op.user?.name || "Usuario Anónimo"}</h4>
                      <div className={styles.opinionRating}>
                        {[...Array(5)].map((_, idx) =>
                          idx < op.rating ? (
                            <FaStar key={idx} color="#4b8236" size={14} />
                          ) : (
                            <FaRegStar key={idx} color="#999" size={14} />
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                  <p className={styles.opinionCategoryDate}>
                    {getDayAndMonth(op.created_at)} • {op.category}
                  </p>
                  <p className={styles.opinionText}>{op.contenido}</p>
                  {op.image_path && (
                    <img
                      src={op.image_url || `${API}/storage/${op.image_path}`}
                      alt="Review"
                      className={styles.opinionImage}
                    />
                  )}
                </div>
                <CommentActionsBlock
                  commentId={op.id}
                  isOwner={userId === op.usuario_id}
                  onDelete={deleteComment}
                  onReport={reportComment}
                  isMenuOpen={menuOpen === op.id}
                  setMenuOpen={setMenuOpen}
                />
              </div>
            ))
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default VerLugares;
