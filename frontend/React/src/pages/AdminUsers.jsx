// frontend/React/src/pages/AdminUsers.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Supongo que tienes un componente de diseño o layout para el Admin
// Reemplaza 'AdminLayout' con el nombre de tu componente de layout si es diferente (ej. PanelAdmin)
import AdminLayout from '../components/admin/Admin.jsx'; // O el componente que uses para la estructura base del admin

// Supongo que tienes un componente de tarjeta que puedes reutilizar
import AdminCard from '../components/admin/AdminCard.jsx'; // O el nombre del componente de tarjeta para Hospedajes/Lugares

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            // Asegúrate de usar la URL correcta de tu backend Laravel
            const response = await axios.get('http://localhost:8000/api/users', {
                // Aquí podrías necesitar enviar el token de autenticación (Sanctum)
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Asegúrate de que tu token esté guardado aquí
                }
            });
            setUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            setLoading(false);
            // Manejo de errores: por ejemplo, redirigir al login si no está autorizado
        }
    };

    const handleNavigateToEdit = (userId) => {
        // Esta ruta la definiremos más tarde
        navigate(`/admin/users/edit/${userId}`);
    };

    if (loading) {
        return <AdminLayout>Cargando usuarios...</AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="admin-content">
                <h2>Administración de Usuarios</h2>
                <div className="card-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                    {users.length > 0 ? (
                        users.map((user) => (
                            // **Aquí reutilizamos el componente de tarjeta existente**
                            <AdminCard 
                                key={user.id}
                                title={user.name}
                                description={user.email}
                                imageUrl={user.profile_photo_url || '/default-profile.png'} // Usa la URL de la foto de perfil o una por defecto
                                buttonText="Ver Perfil"
                                onButtonClick={() => handleNavigateToEdit(user.id)}
                            />
                        ))
                    ) : (
                        <p>No hay usuarios registrados.</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;