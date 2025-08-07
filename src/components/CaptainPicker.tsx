import allPlayers from "../data/players.json";
import { Players } from "../pages/Players";

export interface Player {
  id: number;
  name: string;
  position: string;
  position_alternatives?: string[];
  rating: number;
  nationality: string;
  club: string;
  image: string;
  backup_image: string;
}

interface Props {
  onSelect: (player: any) => void;
  availablePositions: string[];
}

export default function CaptainPicker({ onSelect, availablePositions }: Props) {
  const filteredPlayers = allPlayers.filter(
    (player) =>
      availablePositions.includes(player.position) ||
      player.position_alternatives?.some((alt) =>
        availablePositions.includes(alt)
      )
  );

  const randomCaptains = filteredPlayers
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-8">Elige tu Capitán</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-center">
        {randomCaptains.map((player) => (
          <div
            key={player.id}
            className="relative w-44 h-64 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition transform cursor-pointer bg-cover bg-center"
            style={{
              backgroundImage: `url(${player.backup_image})`,
            }}
            onClick={() => onSelect(player)}
          >
            {/* Media y posición */}
            <div className="absolute top-13 z-30 left-5 text-white text-sm font-bold px-2 py-1 rounded">
              <p>{player.rating}</p>
              <p>{player.position}</p>
            </div>

            {/* Imagen del jugador */}
            <div className="absolute top-[4%] left-1/2 transform -translate-x-1/2 w-44 h-54">
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info abajo */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full text-center text-white px-2">
              <p className="text-sm font-bold leading-tight">{player.name}</p>
              <p className="text-xs">{player.nationality}</p>
              <p className="text-xs">{player.club}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
