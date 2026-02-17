import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/header";
import Footer from "../components/footer";
import defaultAvatar from "../assets/img4.jpg";
import noImage from "../assets/noImage.jpg";

const AdminUsers = () => {
  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/api";
  const [users, setUsers] = useState(() => {
    const cache = localStorage.getItem("admin_users_cache");
    return cache ? JSON.parse(cache) : [];
  });

  const [loading, setLoading] = useState(users.length === 0);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const fetchedUsers = Array.isArray(data) ? data : data.data || [];

      setUsers(fetchedUsers);
      localStorage.setItem("admin_users_cache", JSON.stringify(fetchedUsers));
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const rolLimpio = String(user.rol || "")
        .toLowerCase()
        .trim();
      const isNotAdmin = rolLimpio !== "admin" && rolLimpio !== "administrador";
      const matchesSearch =
        user.nombre_completo
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return isNotAdmin && matchesSearch;
    });
  }, [users, searchTerm]);

  const SkeletonCard = () => (
    <div className="bg-white rounded-[2.5rem] p-4 w-full max-w-[360px] border border-slate-100 animate-pulse">
      <div className="h-56 bg-slate-200 rounded-[2rem] mb-6"></div>
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-4 ml-6"></div>
      <div className="h-4 bg-slate-100 rounded w-1/2 mb-6 ml-6"></div>
      <div className="flex justify-between px-6 pb-4">
        <div className="h-8 bg-slate-100 rounded w-20"></div>
        <div className="h-10 bg-slate-200 rounded-xl w-28"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center w-full">
      <Header />
      <main className="w-full flex flex-col items-center flex-grow pt-20">
        <div
          className="w-full h-[300px] bg-cover bg-center relative flex items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80")`,
          }}
        >
          <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-white uppercase text-center">
            Gestión de <span className="text-[#20A217]">Usuarios</span>
          </h2>
        </div>

        <div className="w-full max-w-7xl px-6 flex justify-center pt-10">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 w-full max-w-4xl -mt-16 relative z-10">
            <input
              type="text"
              className="w-full bg-slate-100 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-[#20A217] outline-none transition-all"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {loading ? (
              <>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id || index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col w-full max-w-[360px] p-4 hover:p-0 pb-6 hover:pb-6"
                  >
                    <div className="h-56 overflow-hidden relative rounded-[2rem] group-hover:rounded-none transition-all duration-500">
                      <img
                        src={user.avatar_url || noImage}
                        loading="eager"
                        className="w-full h-full object-cover brightness-[0.9] group-hover:brightness-100 group-hover:scale-110 transition-transform duration-700"
                        alt={user.nombre_completo}
                        onError={(e) => (e.target.src = noImage)}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-black text-slate-800 uppercase group-hover:text-[#20A217] transition-colors truncate">
                        {user.nombre_completo}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4 italic truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "N/A"}
                        </span>
                        <button
                          onClick={() => navigate(`/admin/usuarios/${user.id}`)}
                          className="bg-[#20A217] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1a8212] active:scale-95 transition-all shadow-md cursor-pointer"
                        >
                          GESTIONAR
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {!loading && filteredUsers.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-slate-400 py-20 uppercase font-bold tracking-widest"
            >
              No se encontraron usuarios
            </motion.p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminUsers;
