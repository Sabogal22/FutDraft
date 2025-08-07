import { useEffect, useState } from "react";
import { allManager } from "../data/manager";

type Manager = {
  id: number;
  nombre: string;
  imagen: string;
  nacionalidad: string;
  backup_image: string;
};

interface Props {
  onSelect: (dt: Manager) => void;
}

const getRandomManagers = (count: number): Manager[] => {
  const shuffled = [...allManager].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export default function SelectManager({ onSelect }: Props) {
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    setManagers(getRandomManagers(5));
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-black rounded-lg p-6 max-w-4xl w-full mx-4 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
          Selecciona tu Director Técnico
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {managers.map((manager) => (
            <div
              key={manager.id}
              onClick={() => onSelect(manager)}
              className="relative cursor-pointer transition-transform hover:scale-105 aspect-[2/3] rounded-xl overflow-hidden shadow-md group"
              role="button"
              aria-label={`Seleccionar ${manager.nombre}`}
            >
              {/* Fondo de carta */}
              <img
                src={manager.backup_image}
                alt="Carta de fondo"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Imagen del DT */}
              <img
                src={manager.imagen}
                alt={`Imagen de ${manager.nombre}`}
                className="absolute inset-0 w-full h-full object-contain p-3 z-10"
              />

              {/* Información inferior */}
              <div className="absolute bottom-12 w-full text-center z-20 text-white font-semibold text-sm sm:text-base drop-shadow">
                <p className="font-bold leading-tight">{manager.nombre}</p>
                <p className="text-xs">{manager.nacionalidad}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
