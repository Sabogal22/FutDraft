import { useEffect, useState } from "react";

type Manager = {
  id: number;
  nombre: string;
  imagen: string;
  nacionalidad: string;
  backup_image: string;
};

type Props = {
  onSelect: (dt: Manager) => void;
};

const mockDTs: Manager[] = [
  {
    id: 1,
    nombre: "Pep Guardiola",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Pep_Guardiola_2019.jpg/220px-Pep_Guardiola_2019.jpg",
    nacionalidad: "España",
    backup_image: "/imgs/cards/manager-card.png",
  },
  {
    id: 2,
    nombre: "Jürgen Klopp",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/J%C3%BCrgen_Klopp_2019.jpg/220px-J%C3%BCrgen_Klopp_2019.jpg",
    nacionalidad: "Alemania",
    backup_image: "/imgs/cards/manager-card.png",
  },
  {
    id: 3,
    nombre: "Carlo Ancelotti",
    imagen:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Carlo_Ancelotti_2015.jpg/220px-Carlo_Ancelotti_2015.jpg",
    nacionalidad: "Italia",
    backup_image: "/imgs/cards/manager-card.png",
  },
];

export default function SelectManager({ onSelect }: Props) {
  const [dts, setDts] = useState<Manager[]>([]);

  useEffect(() => {
    // Podrías hacer fetch si fuese una API real
    setDts(mockDTs);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg p-6 max-w-4xl w-full mx-4 shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-center">
          Selecciona tu Director Técnico
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dts.map((dt) => (
            <div
              key={dt.id}
              onClick={() => onSelect(dt)}
              className="relative cursor-pointer transition-transform hover:scale-105 aspect-[2/3] rounded-xl overflow-hidden shadow-md"
            >
              {/* Fondo de carta */}
              <img
                src={dt.backup_image}
                alt="carta"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Imagen del DT */}
              <img
                src={dt.imagen}
                alt={dt.nombre}
                className="absolute inset-0 w-full h-full object-contain p-3 z-10"
              />

              {/* Info abajo */}
              <div className="absolute bottom-12 w-full text-center z-20 text-white font-semibold text-sm sm:text-base drop-shadow">
                <p className="font-bold leading-tight">{dt.nombre}</p>
                <p className="text-xs">{dt.nacionalidad}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
