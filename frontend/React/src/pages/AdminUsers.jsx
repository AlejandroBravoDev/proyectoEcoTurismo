import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from '../components/Hospedajes/admin.module.css';
import defaultAvatar from '../assets/img4.jpg';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const API_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/usuarios`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/admin/usuarios/${userId}`);
  };

  const filteredUsers = users.filter(user =>
    user.nombre_completo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />

      <div className={styles.mainContainer}>
        
        {/* HERO */}
        <div 
          className={styles.heroSection}
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80")`
          }}
        />

        {/* CAJA BLANCA FLOTANTE */}
        <div className={styles.searchContainer}>
          <h2>¿En dónde deseas hospedarte?</h2>
          <p>¡Filtra los usuarios registrados o encuéntralos rápidamente!</p>

          {/* BARRA DE BÚSQUEDA */}
          <div className={styles.searchInput}>
            <input
              type="text"
              placeholder="Buscar por nombre o correo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>

        {/* CARDS DE USUARIOS */}
        <div className={styles.cardsSection}>
          {loading ? (
            <div className={styles.loading}>Cargando usuarios...</div>
          ) : filteredUsers.length === 0 ? (
            <div className={styles.noResults}>
              {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
            </div>
          ) : (
            <div className={styles.cardsContainer}>
              {filteredUsers.map((user) => (
                <div key={user.id} className={styles.card}>
                  
                  {/* IMAGEN RECTANGULAR COMO EN LA MAQUETA */}
                  <img 
                    src={user.avatar_url || defaultAvatar}
                    alt={user.nombre_completo}
                    onError={(e) => (e.target.src = defaultAvatar)}
                  />

                  <div className={styles.cardContent}>
                    <h3>{user.nombre_completo}</h3>

                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>

                    <p className={styles.date}>
                      Registrado: {new Date(user.created_at).toLocaleDateString()}
                    </p>

                    <button
                      className={styles.detailsButton}
                      onClick={() => handleViewProfile(user.id)}
                    >
                      Ver Perfil
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <Footer />
    </>
  );
};

export default AdminUsers;
