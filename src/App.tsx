import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Draft from "./pages/Draft";
import { Players } from "./pages/Players";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/draft" element={<Draft />} />
      <Route path="/players" element={<Players />} />
    </Routes>
  );
}

export default App;
