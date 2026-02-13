import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";

function SearchBar({
  municipios,
  onSearchSubmit,
  onMunicipioChange,
  currentMunicipioId,
}) {
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    onSearchSubmit(e.target.value);
  };

  const selectedMunicipioLabel =
    municipios?.data?.find(
      (m) => m.id.toString() === currentMunicipioId?.toString(),
    )?.nombre || "Todos los Municipios";

  return (
    <div className="bg-white p-3 md:p-4 rounded-[30px] md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-3 w-full max-w-5xl border border-gray-100 transition-all hover:shadow-[#20A217]/10 relative z-50">
      <div className="relative flex-grow w-full">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          className="w-full pl-14 pr-4 py-4 rounded-full bg-gray-50 border-none focus:ring-2 focus:ring-[#20A217] outline-none text-gray-700 font-medium transition-all"
          value={searchText}
          onChange={handleInputChange}
        />
      </div>

      <div className="relative w-full md:w-72" ref={dropdownRef}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-full pl-12 pr-10 py-4 rounded-full bg-gray-50 border-none cursor-pointer flex items-center transition-all ${
            isOpen ? "ring-2 ring-[#20A217] bg-white shadow-sm" : ""
          }`}
        >
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#20A217]">
            <MapPin size={20} />
          </div>

          <span
            className={`text-gray-700 font-bold truncate ${!currentMunicipioId ? "text-gray-400 font-medium" : ""}`}
          >
            {selectedMunicipioLabel}
          </span>

          <div
            className={`absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown size={18} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              <div
                onClick={() => {
                  onMunicipioChange("");
                  setIsOpen(false);
                }}
                className="px-6 py-3 hover:bg-[#20A217]/5 cursor-pointer text-gray-600 font-medium transition-colors border-b border-gray-50"
              >
                Todos los Municipios
              </div>

              {Array.isArray(municipios?.data) &&
                municipios.data.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onMunicipioChange(m.id);
                      setIsOpen(false);
                    }}
                    className={`px-6 py-3 hover:bg-[#20A217]/10 cursor-pointer transition-colors flex items-center justify-between ${
                      currentMunicipioId?.toString() === m.id.toString()
                        ? "bg-[#20A217]/5 text-[#20A217] font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {m.nombre}
                    {currentMunicipioId?.toString() === m.id.toString() && (
                      <div className="w-2 h-2 rounded-full bg-[#20A217]"></div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #20A217;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1a8212;
        }
      `}</style>
    </div>
  );
}

export default SearchBar;
