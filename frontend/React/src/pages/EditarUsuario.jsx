import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from '../components/PerfilUser/PerfilUser.module.css';
import defaultAvatar from '../assets/img4.jpg';

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
  });
  const [newAvatar, setNewAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const API_URL = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.data);
        setFormData({
          nombre_completo: data.data.nombre_completo,
          email: data.data.email,
        });
        setPreviewAvatar(data.data.avatar_url);
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append('nombre_completo', formData.nombre_completo);
      form.append('email', formData.email);
      
      if (newAvatar) {
        form.append('avatar', newAvatar);
      }

      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: form
      });

      const data = await response.json();

      if (data.success) {
        alert('Usuario actualizado correctamente');
        setEditing(false);
        fetchUser();
      } else {
        alert('Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar los cambios');
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('Usuario eliminado correctamente');
        navigate('/adminUsuarios');
      } else {
        alert('Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar el usuario');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      nombre_completo: user.nombre_completo,
      email: user.email,
    });
    setPreviewAvatar(user.avatar_url);
    setNewAvatar(null);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ padding: '50px', textAlign: 'center' }}>
          Cargando información del usuario...
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div style={{ padding: '50px', textAlign: 'center' }}>
          Usuario no encontrado
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className={styles.perfilContainer}>
        <div className={styles.perfilContent}>
          <button 
            onClick={() => navigate('/adminUsuarios')}
            style={{
              background: '#666',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            ← Volver a Usuarios
          </button>

          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
            {editing ? 'Editar Usuario' : 'Perfil de Usuario'}
          </h1>

          <div className={styles.perfilSection}>
            <div className={styles.avatarSection}>
              <img 
                src={previewAvatar || defaultAvatar} 
                alt={user.nombre_completo}
                onError={(e) => e.target.src = defaultAvatar}
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto',
                  display: 'block'
                }}
              />
              
              {editing && (
                <label style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '15px',
                  cursor: 'pointer',
                  color: '#4b8236'
                }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  Cambiar foto de perfil
                </label>
              )}
            </div>

            <div className={styles.infoSection} style={{ marginTop: '30px' }}>
              <div className={styles.infoGroup}>
                <label>Nombre Completo:</label>
                {editing ? (
                  <input 
                    type="text"
                    name="nombre_completo"
                    value={formData.nombre_completo}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                ) : (
                  <p>{user.nombre_completo}</p>
                )}
              </div>

              <div className={styles.infoGroup}>
                <label>Email:</label>
                {editing ? (
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                ) : (
                  <p>{user.email}</p>
                )}
              </div>

              <div className={styles.infoGroup}>
                <label>Fecha de Registro:</label>
                <p>{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div style={{ 
              marginTop: '30px', 
              display: 'flex', 
              gap: '15px', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {!editing ? (
                <>
                  <button 
                    onClick={() => setEditing(true)}
                    style={{
                      background: '#4b8236',
                      color: 'white',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Editar Usuario
                  </button>
                  <button 
                    onClick={handleDelete}
                    style={{
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Eliminar Usuario
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleSave}
                    style={{
                      background: '#4b8236',
                      color: 'white',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Guardar Cambios
                  </button>
                  <button 
                    onClick={handleCancel}
                    style={{
                      background: '#95a5a6',
                      color: 'white',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EditarUsuario;