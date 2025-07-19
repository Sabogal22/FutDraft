import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFutbol,
  faTrophy,
  faShirt,
  faPlay,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const icons = [faFutbol, faTrophy, faShirt];
const getRandomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

function BackgroundIcons({ count = 20 }) {
  const items = Array.from({ length: count }, (_, i) => {
    const top = getRandomInt(0, 100);
    const left = getRandomInt(0, 100);
    const size = getRandomInt(30, 60);
    const rotate = getRandomInt(0, 360);
    const opacity = Math.random() * 0.15 + 0.05;
    const icon = icons[Math.floor(Math.random() * icons.length)];
    return (
      <FontAwesomeIcon
        key={i}
        icon={icon}
        className="text-white absolute pointer-events-none select-none"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          fontSize: `${size}px`,
          opacity,
          transform: `rotate(${rotate}deg)`,
        }}
      />
    );
  });
  return <div className="absolute inset-0 z-0">{items}</div>;
}

function App() {
  const Navigate = useNavigate();
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-700 to-green-900 text-white flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Fondo de íconos */}
      <BackgroundIcons count={50} />

      {/* Contenido principal */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">FUT Draft</h1>
        <h3 className="text-2xl font-semibold mb-2">
          Crea el mejor equipo de fútbol
        </h3>
        <p className="max-w-md text-lg text-gray-200 mb-6">
          Selecciona tus jugadores favoritos y compite en el modo Draft de FIFA
          Ultimate Team.
        </p>
        <p className="max-w-md text-base text-gray-300 mb-8">
          ¡Comienza tu aventura futbolística ahora!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            className="bg-white hover:bg-gray-100 text-green-900 font-bold py-3 px-6 rounded-xl shadow-md transition"
            onClick={() => Navigate("/draft")}
          >
            <FontAwesomeIcon icon={faPlay} className="mr-2" />
            Comenzar
          </button>
          <button className="bg-white hover:bg-gray-100 text-green-900 font-bold py-3 px-6 rounded-xl shadow-md transition" onClick={() => Navigate("/players")}>
            <FontAwesomeIcon icon={faLayerGroup} className="mr-2" />
            Todas los jugadores
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
