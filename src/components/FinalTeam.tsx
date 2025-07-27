import React from "react";

interface FinalTeamProps {
  assignedPlayers: Record<string, Player | null>;
  rating: number;
  chemistry: number;
  onReset: () => void;
}

export interface Player {
  id: number;
  real_name: string;
  name: string;
  rating: number;
  position: string;
  position_alternatives?: string[];
  nationality: string;
  club: string;
  league: string;
  backup_image: string;
  image: string;
}

const isGoalkeeper = (pos: string) => pos === "GK";

const isDefender = (pos: string) =>
  ["CB", "LB", "RB", "LCB", "RCB", "LWB", "RWB"].includes(pos);

const isMidfielder = (pos: string) =>
  ["CDM", "CM", "CAM", "LM", "RM", "LWM", "RWM"].includes(pos);

const isAttacker = (pos: string) =>
  ["ST", "CF", "LW", "RW", "LF", "RF"].includes(pos);

export default function FinalTeam({
  assignedPlayers,
  rating,
  chemistry,
  onReset,
}: FinalTeamProps) {
  const players = Object.values(assignedPlayers).filter(Boolean) as Player[];

  const bestGK = players.find((p) => isGoalkeeper(p.position)) || null;

  const bestDef = players
    .filter((p) => isDefender(p.position))
    .sort((a, b) => b.rating - a.rating)[0];

  const bestMid = players
    .filter((p) => isMidfielder(p.position))
    .sort((a, b) => b.rating - a.rating)[0];

  const bestAtt = players
    .filter((p) => isAttacker(p.position))
    .sort((a, b) => b.rating - a.rating)[0];

  return (
    <div className="mt-20 text-center">
      <h2 className="text-3xl font-bold mb-6 text-green-300">
        ¡Tu equipo esta listo!
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {[bestGK, bestDef, bestMid, bestAtt].map(
          (player, i) =>
            player && (
              <div
                key={i}
                className="relative w-40 aspect-[2/3] rounded-xl overflow-hidden shadow-lg"
              >
                {/* Fondo de carta */}
                <img
                  src={player.backup_image}
                  alt="fondo"
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
                {/* Imagen del jugador */}
                <img
                  src={player.image}
                  alt={player.name}
                  className="absolute inset-0 w-full h-full object-contain p-3 z-10"
                />
                {/* Rating y posición */}
                <div className="absolute top-13 left-5 z-20 text-white drop-shadow font-bold text-sm sm:text-base">
                  <div className="text-lg sm:text-xl">{player.rating}</div>
                  <div className="uppercase text-xs">{player.position}</div>
                </div>
                {/* Nombre del jugador */}
                <div className="absolute bottom-11 w-full text-center z-20 text-white font-semibold text-sm sm:text-base drop-shadow">
                  <p className="font-bold leading-tight">{player.name}</p>
                  <p className="text-xs">{player.nationality}</p>
                </div>
              </div>
            )
        )}
      </div>

      <div className="mt-10 text-center space-y-6">
        {/* Valoración con estrellas */}
        <div>
          <p className="text-white text-lg mb-1">Valoración final</p>
          <div className="flex justify-center items-center gap-2">
            <div className="flex gap-1 text-yellow-400 text-2xl">
              {Array.from({ length: 5 }, (_, i) => {
                const starValue = (rating / 100) * 5;
                if (i + 1 <= starValue) return <span key={i}>★</span>;
                else if (i + 0.5 <= starValue)
                  return <span key={i}>☆</span>; // opcional para media estrella
                else return <span key={i}>☆</span>;
              })}
            </div>
            <span className="text-white text-lg">({rating})</span>
          </div>
        </div>

        {/* Química como barra de carga */}
        <div>
          <p className="text-white text-lg mb-1">Química final</p>
          <div className="w-64 h-5 bg-gray-700 rounded-full overflow-hidden mx-auto">
            <div
              className={`h-full transition-all duration-500 ${
                chemistry < 12
                  ? "bg-red-500"
                  : chemistry < 23
                  ? "bg-yellow-400"
                  : "bg-green-400"
              }`}
              style={{ width: `${(chemistry / 33) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-white mt-1">{chemistry}/33</p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-8 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
      >
        Reiniciar Draft
      </button>
    </div>
  );
}
