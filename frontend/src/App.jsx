import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditorPage from "./pages/EditorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BattleSettings from "./pages/BattleSettings";
import BattleLobby from "./pages/BattleLobby";
import JoinBattle from "./pages/JoinBattle";
import BattlePlay from "./pages/BattlePlay";

function App() {
  return (
    <BrowserRouter>
      <Routes>

       <Route path="/" element={<Login />} />
       <Route path="/login" element={<Login />} />

       <Route path="/signup" element={<Signup />} />

       <Route
  path="/home"
  element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  }
/>

<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>

<Route
    path="/battle"
    element={
      <ProtectedRoute>
        <BattleSettings />
      </ProtectedRoute>
    }
/>

<Route
  path="/battle/lobby/:battleId"
  element={
    <ProtectedRoute>
      <BattleLobby />
    </ProtectedRoute>
  }
/>

        <Route
  path="/editor/:roomId"
  element={
    <ProtectedRoute>
      <EditorPage />
    </ProtectedRoute>
  }
/>

<Route
    path="/battle/join"
    element={
        <ProtectedRoute>
            <JoinBattle />
        </ProtectedRoute>
    }
/>

<Route
  path="/battle/play/:battleId"
  element={
    <ProtectedRoute>
      <BattlePlay />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;