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

  // Check if current user is the host
  const isHost = battle?.host === username;

  // ----------------------------
  // Fetch Battle
  // ----------------------------

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

  // ----------------------------
  // Socket Events
  // ----------------------------

  useEffect(() => {
    if (!battleId || !username) return;

    battleSocket.emit("joinBattle", {
      battleId,
      username,
    });

    battleSocket.on(
      "battleUpdated",
      (updatedBattle) => {
        console.log("Battle Updated");

        setBattle(updatedBattle);
      }
    );

    battleSocket.on(
  "battleStarted",
  (battle) => {

    toast.success("Battle Started!");

    navigate(
      `/battle/play/${battle.battleId}`
    );

  }
);

    return () => {
  battleSocket.off("battleUpdated");
  battleSocket.off("battleStarted");
};
  }, [battleId, username]);

  // ----------------------------
  // Loading Screen
  // ----------------------------

  if (!battle) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Loading Battle...
      </div>
    );
  }

  // ----------------------------
  // UI
  // ----------------------------

  return (
    <div className="min-h-screen bg-[#F6F8FB]">
      <div className="max-w-6xl mx-auto py-10 px-8">

        <BattleInfo battle={battle} />

        <div className="mt-8 grid grid-cols-3 gap-8">

          <div className="col-span-2">
            <PlayerList
              players={battle.players}
            />
          </div>

          <div>
            <LobbyControls
              battle={battle}
              battleId={battle.battleId}
              isHost={isHost}
            />
          </div>

        </div>

      </div>
    </div>
  );
}

export default BattleLobby;