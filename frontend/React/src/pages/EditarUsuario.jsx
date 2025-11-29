import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import styles from '../components/PerfilUser/PerfilUser.module.css';
import defaultAvatar from '../assets/img4.jpg';
// Importa una imagen de banner por defecto si tu API no la proporciona
import defaultBanner from '../assets/fondo-hospedajes.jpeg'; 

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
    // NUEVOS ESTADOS PARA EL BANNER/PORTADA
    const [newBanner, setNewBanner] = useState(null);
    const [previewBanner, setPreviewBanner] = useState(null); 

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
                // Asegurar valores por defecto si no existen
                setPreviewAvatar(data.data.avatar_url || defaultAvatar);
                setPreviewBanner(data.data.banner_url || defaultBanner); 
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

    // NUEVA FUNCIÓN PARA CAMBIAR EL BANNER
    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewBanner(file);
            setPreviewBanner(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
    try {
        const form = new FormData();
        form.append('_method', 'PUT'); 
        form.append('nombre_completo', formData.nombre_completo);
        form.append('email', formData.email);

        if (newAvatar) {
            form.append('avatar', newAvatar);
        }
        if (newBanner) {
            form.append('banner', newBanner); 
        }

        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'POST', 
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: form
        });

        // PASO DE DEPURACIÓN: Comprobar el estado HTTP
        if (!response.ok) {
            const errorData = await response.json();
            
            // 422 es típico de errores de validación (email ya existe, campo vacío)
            if (response.status === 422 && errorData.errors) {
                let errorMsg = 'Error de validación: \n';
                // Recorrer los errores devueltos por Laravel
                for (const key in errorData.errors) {
                    errorMsg += `- ${errorData.errors[key].join(', ')}\n`;
                }
                alert(errorMsg);
            } else {
                // Otro error HTTP (401, 403, 500)
                alert(`Error al actualizar usuario (Código ${response.status}): ${errorData.message || 'Error desconocido'}`);
            }
            console.error('API Error Response:', errorData);
            return;
        }

        const data = await response.json();

        if (data.success) {
            alert('Usuario actualizado correctamente');
            setEditing(false);
            fetchUser();
        } else {
            // Si HTTP 200 pero success: false (menos común)
            alert('Error al actualizar usuario: ' + (data.message || 'La API devolvió un éxito falso.'));
        }

    } catch (error) {
        console.error('Error al guardar:', error);
        alert('Error de conexión o configuración al guardar los cambios.');
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
        // Restablecer a los valores originales
        setPreviewAvatar(user.avatar_url || defaultAvatar);
        setPreviewBanner(user.banner_url || defaultBanner);
        setNewAvatar(null);
        setNewBanner(null);
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

            {/* Contenedor principal para el fondo gris y la tarjeta flotante */}
            <div className={styles.pageBackground}>
                {/* Botón Volver (lo posicionamos fuera de la tarjeta para visibilidad de admin) */}
                {/* <button
                    onClick={() => navigate('/adminUsuarios')}
                    className={styles.backButton}
                >
                    ← Volver a Usuarios
                </button> */}
                
                {/* Banner de portada */}
                <div className={styles.coverImage} style={{ backgroundImage: `url(${previewBanner})` }}>
                    {/* Botón para cambiar el banner, visible solo en modo edición */}
                    {editing && (
                        <label className={styles.changeCoverButton}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBannerChange}
                                style={{ display: 'none' }}
                            />
                            ➕ Cambiar Foto de Portada
                        </label>
                    )}
                </div>

                {/* Tarjeta flotante central (simulando la Imagen 2) */}
                <div className={styles.profileCard}>

                    {/* Sección de Avatar, Nombre, ID */}
                    <div className={styles.profileHeader}>
                        {/* Avatar con Wrapper para el efecto flotante */}
                        <div className={styles.avatarWrapper}>
                            <img
                                src={previewAvatar}
                                alt={user.nombre_completo}
                                onError={(e) => e.target.src = defaultAvatar}
                                className={styles.profileAvatar}
                            />
                            {/* Overlay de Edición de Avatar */}
                            {editing && (
                                <label className={styles.changeAvatarOverlay}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        style={{ display: 'none' }}
                                    />
                                    ➕ Cambiar Avatar
                                </label>
                            )}
                        </div>

                        <div className={styles.nameAndId}>
                            <h2 className={styles.profileName}>{user.nombre_completo}</h2>
                            <p className={styles.profileUsername}>@{user.id}</p>
                        </div>
                        
                        {/* Botón "Editar perfil" en la cabecera (solo en modo no edición) */}
                        {/* {!editing && (
                            <button
                                onClick={() => setEditing(true)}
                                className={styles.editButtonHeader}
                            >
                                Editar perfil
                            </button>
                        )} */}
                    </div>

                    {/* Fila de Estadísticas y Navegación */}
                    <div className={styles.navStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>1</span>
                            <span className={styles.statLabel}>Opiniones</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statNumber}>1</span>
                            <span className={styles.statLabel}>Favoritos</span>
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* Sección de Edición de Perfil (Formulario) */}
                    <div className={styles.editSection}>
                        <h3 className={styles.editTitle}>{editing ? 'Editar Usuario' : 'Información'}</h3>

                        {/* Campo Nombre Completo */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Nombre Completo</label>
                            <input
                                type="text"
                                name="nombre_completo"
                                value={formData.nombre_completo}
                                onChange={handleInputChange}
                                className={styles.formInput}
                                disabled={!editing}
                            />
                        </div>

                        {/* Campo Email */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Correo</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={styles.formInput}
                                disabled={!editing}
                            />
                        </div>
                        
                        {/* Campo ID y Fecha de Registro (no editables) */}
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>ID</label>
                            <input
                                type="text"
                                value={user.id}
                                disabled
                                className={styles.formInput}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Fecha de Registro</label>
                            <input
                                type="text"
                                value={new Date(user.created_at).toLocaleDateString()}
                                disabled
                                className={styles.formInput}
                            />
                        </div>
                        
                        {/* Botones de acción */}
                        <div className={styles.actionButtons}>
                            {editing ? (
                                <>
                                    <button onClick={handleSave} className={styles.saveButton}>
                                        Guardar Cambios
                                    </button>
                                    <button onClick={handleCancel} className={styles.cancelButton}>
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                // Botones de administrador para Editar/Eliminar (si no está editando)
                                <>
                                    <button onClick={() => setEditing(true)} className={styles.editButton}>
                                        Editar Usuario
                                    </button>
                                    <button onClick={handleDelete} className={styles.deleteButton}>
                                        Eliminar Usuario
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