import { useState } from "react";
import { useNavigate } from "react-router-dom";
import playersData from "../data/players.json";

const ITEMS_PER_PAGE = 20;

export const Players = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(playersData.length / ITEMS_PER_PAGE);

  const paginatedPlayers = playersData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">
        Todos los Jugadores
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
        {paginatedPlayers.map((player) => (
          <div
            key={player.id}
            className="relative w-44 h-64 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition transform bg-cover bg-center"
            style={{
              backgroundImage: `url(${player.backup_image})`,
            }}
          >
            {/* Posición y media */}
            <div className="absolute top-13 left-5 text-white text-sm font-bold bg-black/40 px-2 py-1 rounded-md leading-tight">
              <p>{player.rating}</p>
              <p>{player.position}</p>
            </div>

            {/* Imagen del jugador encima de la carta */}
            <div className="absolute top-[4%] left-1/2 transform -translate-x-1/2 w-44 h-54">
              <img
                src={player.image}
                alt={player.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Nombre y datos */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full text-center text-white px-2">
              <p className="text-sm font-bold leading-tight">{player.name}</p>
              <p className="text-xs">{player.nationality}</p>
              <p className="text-xs">{player.club}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-center items-center mt-10 gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="bg-yellow-400 text-black px-4 py-2 rounded-md font-bold disabled:opacity-50"
        >
          ⬅ Anterior
        </button>
        <span className="text-lg">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-yellow-400 text-black px-4 py-2 rounded-md font-bold disabled:opacity-50"
        >
          Siguiente ➡
        </button>
      </div>

      {/* Botón de volver al Home */}
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
};
