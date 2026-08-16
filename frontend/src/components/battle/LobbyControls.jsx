import { useState } from "react";
import toast from "react-hot-toast";
import battleSocket from "../../socket/battleSocket";

function LobbyControls({ battleId, battle, isHost }) {
  const username = localStorage.getItem("username");
  const [loading, setLoading] = useState(false);

  const currentPlayer = battle?.players.find(
    (player) => player.username === username
  );

  const everyoneReady = battle.players.every((player) => player.ready);
  const enoughPlayers = battle.players.length >= 2;

  const handleReady = () => {
    if (loading) return;
    setLoading(true);

    battleSocket.emit("toggleReady", {
      battleId,
      username,
    });

    toast.success("Ready status updated!");

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleStartBattle = () => {
    battleSocket.emit("startBattle", {
      battleId,
      username,
    });

    toast.success("Starting Battle...");
  };

  const startBlockedReason = !enoughPlayers
    ? "Waiting for at least 2 players"
    : !everyoneReady
    ? "Waiting for everyone to be ready"
    : null;

  return (
    <div className="bg-[#141414] border border-[#262626] p-6 space-y-6 rounded-none">
      {/* Battle ID */}
      <div>
        <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666] mb-2">
          BATTLE ID KEY
        </p>

        <button
          onClick={() => {
            navigator.clipboard.writeText(battleId);
            toast.success("Battle ID copied!");
          }}
          className="w-full flex items-center justify-between bg-[#000000] border border-[#262626] hover:border-white px-4 py-3 font-bugatti-mono text-xs uppercase tracking-[1.5px] text-white transition-colors cursor-pointer"
        >
          <span className="truncate">{battleId}</span>
          <span className="text-[#c3d9f3] shrink-0">COPY</span>
        </button>
      </div>

      <div className="h-px bg-[#262626]" />

      {/* Your Status */}
      <div>
        <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666] mb-2">
          PLAYER STATUS
        </p>

        <button
          onClick={handleReady}
          disabled={loading}
          className={`
            w-full
            py-3
            font-bugatti-mono
            text-xs
            uppercase
            tracking-[2.5px]
            border
            rounded-full
            transition-all
            cursor-pointer
            ${
              currentPlayer?.ready
                ? "bg-transparent text-[#d4a017] border-[#d4a017] hover:bg-[#d4a017]/10"
                : "bg-transparent text-[#5fa657] border-[#5fa657] hover:bg-[#5fa657]/10"
            }
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {loading
            ? "UPDATING..."
            : currentPlayer?.ready
            ? "MARK NOT READY"
            : "MARK READY"}
        </button>

        <button className="mt-3 w-full bugatti-button-secondary py-2.5 text-xs text-center">
          LEAVE ARENA
        </button>
      </div>

      {/* Host Controls */}
      {isHost && (
        <>
          <div className="h-px bg-[#262626]" />

          <div>
            <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666] mb-2">
              HOST CONTROLS
            </p>

            <button
              onClick={handleStartBattle}
              disabled={!everyoneReady || !enoughPlayers}
              className={`
                w-full
                py-3
                font-bugatti-mono
                text-xs
                uppercase
                tracking-[2.5px]
                border
                rounded-full
                transition-all
                cursor-pointer
                ${
                  everyoneReady && enoughPlayers
                    ? "bg-white text-black border-white hover:bg-white/90"
                    : "bg-transparent text-[#666666] border-[#262626] cursor-not-allowed"
                }
              `}
            >
              START BATTLE
            </button>

            {startBlockedReason && (
              <p className="mt-3 font-bugatti-mono text-[10px] uppercase tracking-[1.5px] text-[#666666] text-center">
                {startBlockedReason}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default LobbyControls;
