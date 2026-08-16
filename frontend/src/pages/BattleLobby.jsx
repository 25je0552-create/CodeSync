import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import BattleInfo from "../components/battle/BattleInfo";
import PlayerList from "../components/battle/PlayerList";
import LobbyControls from "../components/battle/LobbyControls";

import battleSocket from "../socket/battleSocket";

function BattleLobby() {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [battle, setBattle] = useState(null);

  const isHost = battle?.host === username;

  useEffect(() => {
    const fetchBattle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/battle/${battleId}`
        );
        setBattle(response.data.battle);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBattle();
  }, [battleId]);

  useEffect(() => {
    if (!battleId || !username) return;

    battleSocket.emit("joinBattle", {
      battleId,
      username,
    });

    battleSocket.on("battleUpdated", (updatedBattle) => {
      console.log("Battle Updated");
      setBattle(updatedBattle);
    });

    battleSocket.on("battleStarted", (battle) => {
      toast.success("Battle Started!");
      navigate(`/battle/play/${battle.battleId}`);
    });

    return () => {
      battleSocket.off("battleUpdated");
      battleSocket.off("battleStarted");
    };
  }, [battleId, username, navigate]);

  if (!battle) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center font-bugatti-mono text-[#999999] text-xs uppercase tracking-[2.5px]">
        LOADING ARENA LOBBY...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      <header className="h-16 border-b border-[#262626] flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/home")}
            className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#999999] hover:text-white transition-colors cursor-pointer"
          >
            ← LEAVE LOBBY
          </button>
          <div className="bugatti-wordmark">CODESYNC</div>
        </div>
        <div className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666]">
          ARENA LOBBY
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto py-12 px-8 flex-1">
        <BattleInfo battle={battle} />

        <div className="mt-8 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <PlayerList players={battle.players} />
          </div>

          <div className="lg:col-span-4">
            <LobbyControls
              battle={battle}
              battleId={battle.battleId}
              isHost={isHost}
            />
          </div>
        </div>
      </main>

      <footer className="h-16 border-t border-[#262626] flex items-center justify-between px-8 text-[#666666] font-bugatti-mono text-[11px] tracking-[2px] uppercase">
        <div>© CODESYNC AUTOMOTIVE LUXURY UI</div>
        <div>ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
}

export default BattleLobby;