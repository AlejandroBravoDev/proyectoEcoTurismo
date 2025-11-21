import "../panelAdmin/tailwind.css";

function confirmarEliminar({ message, onConfirm, onCancel }) {
  //   if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center justify-around bg-white rounded-xl p-6 w-xl h-72 shadow-xl">
        <svg
          width="100px"
          height="100px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M12 7V13"
              stroke="#60a244"
              stroke-width="1.5"
              stroke-linecap="round"
            ></path>{" "}
            <circle cx="12" cy="16" r="1" fill="#60a244"></circle>{" "}
            <path
              d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
              stroke="#60a244"
              stroke-width="1.5"
              stroke-linecap="round"
            ></path>{" "}
          </g>
        </svg>
        <p className="text-center text-lg font-medium">{message}</p>

        <div className="flex gap-10 mt-6">
          <button
            className="px-4 py-2 bg-[#60a244] text-white rounded-lg hover:bg-[#4b8035] transition"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default confirmarEliminar;
