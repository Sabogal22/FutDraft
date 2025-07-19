import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { allFormations } from "../data/formations";

export interface Formation {
  id: string;
  name: string;
  description: string;
  image: string;
}

function getRandomFormations(count: number): Formation[] {
  const shuffled = [...allFormations].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

interface Props {
  onConfirm: (formationId: string) => void;
}

export default function FormationOption({ onConfirm }: Props) {
  const [selectedFormation, setSelectedFormation] = useState<string | null>(
    null
  );
  const [formations] = useState<Formation[]>(() => getRandomFormations(5));

  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8">
        Elige tu formación
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {formations.map((formation) => (
          <div
            key={formation.id}
            onClick={() => setSelectedFormation(formation.id)}
            className={`cursor-pointer border-2 rounded-xl p-4 text-center transition hover:scale-105 hover:bg-green-700 ${
              selectedFormation === formation.id
                ? "border-yellow-400 bg-green-700"
                : "border-white/20"
            }`}
          >
            <img
              src={formation.image}
              alt={formation.name}
              className="w-full h-40 object-contain mb-3"
            />
            <h3 className="text-xl font-semibold mb-2">{formation.name}</h3>
            <p className="text-gray-300 text-sm">{formation.description}</p>
          </div>
        ))}
      </div>

      {selectedFormation && (
        <div className="mt-10 text-center">
          <p className="text-lg mb-2">
            Has elegido:{" "}
            <strong className="text-yellow-400">{selectedFormation}</strong>
          </p>
          <button
            className="bg-yellow-400 text-green-900 font-bold py-2 px-6 rounded-xl shadow-md transition hover:bg-yellow-500"
            onClick={() => onConfirm(selectedFormation)}
          >
            Confirmar formación
          </button>
        </div>
      )}

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate("/")}
          className="text-sm underline text-gray-300 hover:text-white"
        >
          ⬅ Volver al inicio
        </button>
      </div>
    </div>
  );
}
