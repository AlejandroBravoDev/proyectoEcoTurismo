import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from '../components/Hospedajes/Hospedajes.module.css';
import defaultAvatar from '../assets/img4.jpg'; // Imagen por defecto

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
        <div className={styles.heroSection} style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          height: '300px'
        }}>
          <div className={styles.searchContainer} style={{ padding: '40px 60px' }}>
            <h2>Administrar Usuarios</h2>
            <p>Gestiona los usuarios registrados en la plataforma</p>
            
            <div className={styles.searchFilters}>
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
          </div>
        </div>

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
                  <img 
                    src={user.avatar_url || defaultAvatar} 
                    alt={user.nombre_completo}
                    onError={(e) => e.target.src = defaultAvatar}
                    style={{ borderRadius: '50%', width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  <div className={styles.cardContent}>
                    <h3>{user.nombre_completo}</h3>
                    <p style={{ minHeight: 'auto', marginBottom: '10px' }}>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p style={{ minHeight: 'auto', fontSize: '0.85rem', color: '#999' }}>
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