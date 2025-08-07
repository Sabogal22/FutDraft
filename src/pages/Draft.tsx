import { useState, useEffect } from "react";
import FormationSelector from "../components/FormationOption";
import CaptainPicker from "../components/CaptainPicker";
import Pitch from "../components/Pitch";
import { formationLayouts } from "../data/formations";
import playersData from "../data/players.json";
import FinalTeam from "../components/FinalTeam";

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

export default function Draft() {
  const [formation, setFormation] = useState<string | null>(null);
  const [captain, setCaptain] = useState<Player | null>(null);
  const [manager, setManager] = useState<Player | null>(null);
  const [assignedPlayers, setAssignedPlayers] = useState<
    Record<string, Player | null>
  >({});
  const suplenteSlots = [
    "SUB1",
    "SUB2",
    "SUB3",
    "SUB4",
    "SUB5",
    "SUB6",
    "SUB7",
  ];
  const reservaSlots = ["RES1", "RES2", "RES3", "RES4", "RES5"];

  const handleFormationConfirm = (selectedFormation: string) => {
    setFormation(selectedFormation);
  };

  const handleCaptainSelect = (player: Player) => {
    setCaptain(player);
  };

  const [selectingPosition, setSelectingPosition] = useState<string | null>(
    null
  );
  const [candidates, setCandidates] = useState<Player[]>([]);

  const handlePositionClick = (position: string) => {
    if (assignedPlayers[position]) return;

    const basePosition = position.replace(/\d+$/, "");

    const alreadyUsedIds = new Set(
      Object.values(assignedPlayers)
        .filter((p): p is Player => p !== null)
        .map((p) => p.id)
    );

    const seenIds = new Set<number>();

    let matching: Player[] = [];

    if (position.startsWith("SUB") || position.startsWith("RES")) {
      // Para suplentes y reservas, seleccionamos 5 aleatorios sin importar la posición
      matching = (playersData as Player[]).filter((p) => {
        const isNotUsed = !alreadyUsedIds.has(p.id);
        const isUnique = !seenIds.has(p.id);

        if (isNotUsed && isUnique) {
          seenIds.add(p.id);
          return true;
        }
        return false;
      });
    } else {
      // Para titulares, seleccionamos por posición
      matching = (playersData as Player[]).filter((p) => {
        const mainMatch = p.position === basePosition;
        const altMatch = p.position_alternatives?.includes(basePosition);
        const isNotUsed = !alreadyUsedIds.has(p.id);
        const isUnique = !seenIds.has(p.id);

        if ((mainMatch || altMatch) && isNotUsed && isUnique) {
          seenIds.add(p.id);
          return true;
        }
        return false;
      });
    }

    const shuffled = [...matching].sort(() => Math.random() - 0.5);
    const randomFive = shuffled.slice(0, 5);

    setCandidates(randomFive);
    setSelectingPosition(position);
  };

  useEffect(() => {
    if (formation && captain) {
      const layout = formationLayouts[formation];
      if (!layout) return;

      const targetPos = layout.find((pos) => {
        const base = pos.replace(/\d+$/, "");
        return (
          base === captain.position ||
          captain.position_alternatives?.includes(base)
        );
      });

      if (!targetPos) return;

      setAssignedPlayers((prev) => {
        const alreadyAssigned = prev[targetPos]?.id === captain.id;
        if (alreadyAssigned) return prev;

        return {
          ...prev,
          [targetPos]: captain,
        };
      });
    }
  }, [formation, captain]);

  const getTeamStats = (players: Record<string, Player | null>) => {
    const selected = Object.values(players).filter(
      (p): p is Player => p !== null
    );

    const rating =
      selected.length > 0
        ? Math.round(
            selected.reduce((acc, player) => acc + player.rating, 0) /
              selected.length
          )
        : 0;

    const chemistry =
      selected.length > 1
        ? Math.round(
            (selected.filter((p) => p.club === selected[0].club).length /
              selected.length) *
              100
          )
        : 100;

    return { rating, chemistry };
  };

  const handlePlayerAssign = (player: Player) => {
    const isAlreadyAssigned = Object.values(assignedPlayers).some(
      (p) => p?.id === player.id
    );

    if (isAlreadyAssigned) {
      alert("Este jugador ya está asignado a otra posición.");
      return;
    }

    if (selectingPosition === "DT") {
      setManager(player);
      setAssignedPlayers((prev) => ({
        ...prev,
        DT: player,
      }));
    }

    setSelectingPosition(null);
    setCandidates([]);
  };

  const { rating, chemistry } = getTeamStats(assignedPlayers);

  const isDraftComplete =
    formation &&
    formationLayouts[formation].every((pos) => assignedPlayers[pos]) &&
    suplenteSlots.every((slot) => assignedPlayers[slot]) &&
    reservaSlots.every((slot) => assignedPlayers[slot]) &&
    manager !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 text-white px-6 py-10">
      {!formation ? (
        <FormationSelector onConfirm={handleFormationConfirm} />
      ) : !captain ? (
        <CaptainPicker
          onSelect={handleCaptainSelect}
          availablePositions={formationLayouts[formation]}
        />
      ) : isDraftComplete ? (
        <FinalTeam
          assignedPlayers={assignedPlayers}
          rating={rating}
          chemistry={chemistry}
          onReset={() => {
            setFormation(null);
            setCaptain(null);
            setManager(null);
            setAssignedPlayers({});
          }}
        />
      ) : (
        <>
          <Pitch
            formation={formation}
            assignedPlayers={assignedPlayers}
            onPositionClick={handlePositionClick}
          />

          {selectingPosition && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white text-black rounded-lg p-6 max-w-4xl w-full mx-4 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-center">
                  Selecciona un jugador para:{" "}
                  <span className="text-yellow-500">{selectingPosition}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {candidates.map((player) => (
                    <div
                      key={player.id}
                      onClick={() => handlePlayerAssign(player)}
                      className="relative cursor-pointer transition-transform hover:scale-105 aspect-[2/3] rounded-xl overflow-hidden shadow-md"
                    >
                      {/* Fondo de carta */}
                      <img
                        src={player.backup_image}
                        alt="carta"
                        className="absolute inset-0 w-full h-full object-cover z-0"
                      />

                      {/* Imagen del jugador */}
                      <img
                        src={player.image}
                        alt={player.name}
                        className="absolute inset-0 w-full h-full object-contain p-3 z-10"
                      />

                      {/* Rating y posición (arriba a la izquierda) */}
                      <div className="absolute top-13 left-5 z-20 text-white drop-shadow font-bold text-sm sm:text-base">
                        <div className="text-lg sm:text-xl">
                          {player.rating}
                        </div>
                        <div className="uppercase text-xs">
                          {player.position}
                        </div>
                      </div>

                      {/* Nombre del jugador (más arriba del borde inferior) */}
                      <div className="absolute bottom-12 w-full text-center z-20 text-white font-semibold text-sm sm:text-base drop-shadow">
                        <p className="font-bold leading-tight">{player.name}</p>
                        <p className="text-xs">{player.nationality}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
