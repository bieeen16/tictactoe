import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Game from "./components/Game";
import Dashboard from "./components/Dashboard";
import MatchHistoryPage from "./components/MatchHistoryPage";
import GameAI from "./components/GameAI";
import GameRoom from "./components/GameRoom";

function App() {
  return (
    <div className="container mx-auto p-4">
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/match" element={<Game />} />
          <Route path="/match-history/:gameId" element={<MatchHistoryPage />} />
          <Route path="/match-ai" element={<GameAI />} />
          <Route path="/room/:roomId" element={<GameRoom />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
