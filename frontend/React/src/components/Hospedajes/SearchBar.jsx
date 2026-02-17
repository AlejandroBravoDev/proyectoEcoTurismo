import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";

const SearchBar = React.memo(
  ({
    municipios = [],
    onSearchSubmit,
    onMunicipioChange,
    currentMunicipioId,
  }) => {
    const [searchText, setSearchText] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = useCallback(
      (e) => {
        const value = e.target.value;
        setSearchText(value);
        onSearchSubmit(value);
      },
      [onSearchSubmit],
    );

    const selectedMunicipioLabel = useMemo(() => {
      if (!currentMunicipioId || !Array.isArray(municipios))
        return "Todos los Municipios";
      return (
        municipios.find((m) => m.id === currentMunicipioId)?.nombre ||
        "Todos los Municipios"
      );
    }, [municipios, currentMunicipioId]);

    return (
      <div className="bg-white p-3 md:p-4 rounded-[30px] md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-3 w-full max-w-5xl border border-gray-100 transition-all hover:shadow-[#20A217]/10 relative z-50">
        <div className="relative flex-grow w-full">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="¿En dónde deseas hospedarte?..."
            className="w-full pl-14 pr-4 py-4 rounded-full bg-gray-50 border-none focus:ring-2 focus:ring-[#20A217] outline-none text-gray-700 font-medium transition-all"
            value={searchText}
            onChange={handleInputChange}
          />
        </div>

        <div className="relative w-full md:w-72" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`relative w-full pl-12 pr-10 py-4 rounded-full bg-gray-50 border-none cursor-pointer flex items-center transition-all outline-none ${
              isOpen ? "ring-2 ring-[#20A217] bg-white shadow-sm" : ""
            }`}
          >
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#20A217]">
              <MapPin size={20} />
            </div>
            <span className="text-gray-700 font-bold truncate">
              {selectedMunicipioLabel}
            </span>
            <div
              className={`absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            >
              <ChevronDown size={18} />
            </div>
          </button>

          {isOpen && (
            <div className="absolute top-[115%] left-0 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[60]">
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    onMunicipioChange(0);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-6 py-3 hover:bg-[#20A217]/5 text-gray-600 border-b border-gray-50"
                >
                  Todos los Municipios
                </button>
                {Array.isArray(municipios) &&
                  municipios.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onMunicipioChange(m.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-6 py-3 hover:bg-[#20A217]/10 flex items-center justify-between ${
                        currentMunicipioId === m.id
                          ? "text-[#20A217] font-bold"
                          : "text-gray-600"
                      }`}
                    >
                      {m.nombre}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
        <style>{`.custom-scrollbar::-webkit-scrollbar { width: 5px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #20A217; border-radius: 10px; }`}</style>
      </div>
    );
  },
);

export default SearchBar;
