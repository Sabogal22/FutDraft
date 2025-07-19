import { useState, useEffect } from "react";
import FormationSelector from "../components/FormationOption";
import CaptainPicker from "../components/CaptainPicker";
import Pitch from "../components/Pitch";
import { formationLayouts } from "../data/formations";
import playersData from "../data/players.json";

export interface Player {
  id: number;
  name: string;
  position: string;
  rating: number;
  nationality: string;
  club: string;
  image: string;
}

export default function Draft() {
  const [formation, setFormation] = useState<string | null>(null);
  const [captain, setCaptain] = useState<Player | null>(null);
  const [assignedPlayers, setAssignedPlayers] = useState<
    Record<string, Player | null>
  >({});

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
    const matching = playersData.filter(
      (p) =>
        p.position === basePosition &&
        !alreadyUsedIds.has(p.id) &&
        !seenIds.has(p.id) &&
        seenIds.add(p.id)
    );

    const shuffled = [...matching].sort(() => Math.random() - 0.5);
    const randomFive = shuffled.slice(0, 5);

    setCandidates(randomFive);
    setSelectingPosition(position);
  };

  useEffect(() => {
    if (formation && captain) {
      const layout = formationLayouts[formation];
      if (!layout) return;

      const assigned: Record<string, Player | null> = {};

      // Encuentra la primera posición compatible
      const targetPos = layout.find((pos) => pos.startsWith(captain.position));

      if (targetPos) {
        assigned[targetPos] = captain;
      }

      setAssignedPlayers(assigned);
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

    setAssignedPlayers((prev) => ({
      ...prev,
      [selectingPosition!]: player,
    }));

    setSelectingPosition(null);
    setCandidates([]);
  };

  const { rating, chemistry } = getTeamStats(assignedPlayers);

  const isDraftComplete = formation
    ? formationLayouts[formation].every((pos) => assignedPlayers[pos])
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 to-green-900 text-white px-6 py-10">
      {!formation ? (
        <FormationSelector onConfirm={handleFormationConfirm} />
      ) : !captain ? (
        <CaptainPicker onSelect={handleCaptainSelect} />
      ) : isDraftComplete ? (
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6 text-green-300">
            ¡Tu equipo está listo!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
            {Object.entries(assignedPlayers).map(([pos, player]) => (
              <div
                key={pos}
                className="bg-white text-black p-4 rounded-xl shadow-md w-60"
              >
                <p className="text-xs text-gray-500 mb-1">{pos}</p>
                {player ? (
                  <>
                    <img
                      src={player.image}
                      alt={player.name}
                      className="h-28 object-contain mx-auto mb-2"
                    />
                    <h4 className="font-bold">{player.name}</h4>
                    <p className="text-sm text-gray-600">
                      {player.position} - {player.rating}
                    </p>
                    <p className="text-xs text-gray-500">{player.club}</p>
                  </>
                ) : (
                  <p>Sin asignar</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-lg">
            <p>
              Valoración final:{" "}
              <span className="text-yellow-400 font-bold">{rating}</span>
            </p>
            <p>
              Química final:{" "}
              <span className="text-yellow-400 font-bold">{chemistry}</span>
            </p>
          </div>

          <button
            onClick={() => {
              setFormation(null);
              setCaptain(null);
              setAssignedPlayers({});
            }}
            className="mt-8 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            Reiniciar Draft
          </button>
        </div>
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
                      className="bg-yellow-100 hover:bg-yellow-200 rounded-xl p-3 cursor-pointer shadow-md hover:scale-105 transition text-center"
                    >
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-full h-28 object-contain mb-2 rounded"
                      />
                      <h4 className="font-bold text-sm">{player.name}</h4>
                      <p className="text-sm text-gray-700">
                        {player.position} - {player.rating}
                      </p>
                      <p className="text-xs text-gray-500">{player.club}</p>
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
