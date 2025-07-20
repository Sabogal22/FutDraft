import { formationLayouts } from "../data/formations";
import CanchaImg from "../assets/cancha.jpg";

export interface Player {
  id: number;
  name: string;
  position: string;
  rating: number;
  nationality: string;
  club: string;
  image: string;
  backup_image: string;
}

interface Props {
  formation: string;
  assignedPlayers: Record<string, Player | null>;
  onPositionClick: (position: string) => void;
}

const defaultCoordinates: Record<string, { top: string; left: string }> = {
  GK: { top: "90%", left: "50%" },
  LB: { top: "75%", left: "15%" },
  CB1: { top: "75%", left: "35%" },
  CB2: { top: "75%", left: "65%" },
  CB3: { top: "75%", left: "50%" },
  RB: { top: "75%", left: "85%" },
  LWB: { top: "70%", left: "20%" },
  RWB: { top: "70%", left: "80%" },

  CDM: { top: "60%", left: "50%" },
  CDM1: { top: "60%", left: "40%" },
  CDM2: { top: "60%", left: "60%" },

  CM1: { top: "50%", left: "35%" },
  CM2: { top: "50%", left: "65%" },
  CM3: { top: "50%", left: "50%" },

  CAM: { top: "40%", left: "50%" },
  CAM1: { top: "40%", left: "35%" },
  CAM2: { top: "40%", left: "50%" },
  CAM3: { top: "40%", left: "65%" },

  LM: { top: "55%", left: "20%" },
  RM: { top: "55%", left: "80%" },

  LW: { top: "25%", left: "20%" },
  RW: { top: "25%", left: "80%" },

  ST: { top: "20%", left: "50%" },
  ST1: { top: "20%", left: "35%" },
  ST2: { top: "20%", left: "65%" },
};

export default function Pitch({
  formation,
  assignedPlayers,
  onPositionClick,
}: Props) {
  const positions = formationLayouts[formation] || [];

  return (
    <div
      className="relative w-full max-w-3xl aspect-[2/3] mx-auto bg-cover bg-center border-2 border-white rounded-xl"
      style={{ backgroundImage: `url(${CanchaImg})` }}
    >
      {positions.map((pos) => {
        const coords = defaultCoordinates[pos] || { top: "50%", left: "50%" };
        const player = assignedPlayers[pos];

        return (
          <div
            key={pos}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ top: coords.top, left: coords.left }}
            onClick={() => onPositionClick(pos)}
          >
            {player ? (
              <div
                className="w-25 h-40 bg-cover bg-center shadow-lg flex flex-col items-center justify-start px-1 py-2 text-white text-center hover:scale-105 transition relative"
                style={{
                  backgroundImage: `url(${player.backup_image})`,
                }}
              >
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-30 h-auto object-contain mb-0"
                  style={{ marginBottom: "-37px" }}
                />
                <p className="text-[9px] font-bold leading-tight drop-shadow-md">
                  {player.name}
                </p>
                <p className="text-[9px] drop-shadow-sm">{player.position}</p>
                <span className="text-xs font-bold mt-1 bg-black/60 px-1 rounded text-yellow-300 drop-shadow-md">
                  {player.rating}
                </span>
              </div>
            ) : (
              <div className="w-16 h-16 bg-white/30 rounded-full border-2 border-yellow-400 flex items-center justify-center text-xs text-white group-hover:bg-yellow-400 group-hover:text-black transition text-center px-1">
                {pos}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
