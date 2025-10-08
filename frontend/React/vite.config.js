import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false,
    },
    watch: {
      ignored: ["**/src/components/mapa/mapaRisaralda.jsx"],
    },
    proxy: {
      // Si la ruta comienza con /api, redirige la petición a Laravel
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true, // Importante para que el Host se cambie a 127.0.0.1:8000
        rewrite: (path) => path.replace(/^\/api/, "/api"), // Mantiene la ruta /api
      },
    },
  },
});
