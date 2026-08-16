import { useState } from "react";
import toast from "react-hot-toast";
import battleSocket from "../../socket/battleSocket";

function LobbyControls({
  battleId,
  battle,
  isHost,
}) {
  const username = localStorage.getItem("username");

  const [loading, setLoading] = useState(false);

  const currentPlayer = battle?.players.find(
    (player) => player.username === username
  );

  const everyoneReady = battle.players.every(
    (player) => player.ready
  );

  const enoughPlayers =
    battle.players.length >= 2;

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

  // Presentational only — used to explain why Start Battle is disabled.
  const startBlockedReason = !enoughPlayers
    ? "Waiting for at least 2 players"
    : !everyoneReady
    ? "Waiting for everyone to be ready"
    : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">

      {/* Battle ID */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Battle ID
        </p>

        <button
          onClick={() => {
            navigator.clipboard.writeText(battleId);
            toast.success("Battle ID copied!");
          }}
          className="
            w-full
            flex
            items-center
            justify-between
            gap-3
            bg-slate-50
            hover:bg-slate-100
            border
            border-slate-200
            rounded-xl
            px-4
            py-3
            transition
            group
          "
        >
          <span className="font-mono text-sm text-slate-700 truncate">
            {battleId}
          </span>
          <span
            className="
              flex
              items-center
              gap-1.5
              text-blue-600
              text-sm
              font-semibold
              shrink-0
            "
          >
            📋 Copy
          </span>
        </button>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Your Status */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Your Status
        </p>

        <button
          onClick={handleReady}
          disabled={loading}
          className={`
            w-full
            py-3
            rounded-xl
            font-semibold
            text-white
            transition
            flex
            items-center
            justify-center
            gap-2

            ${
              currentPlayer?.ready
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-600 hover:bg-green-700"
            }

            ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : ""
            }
          `}
        >
          {loading
            ? "⏳ Updating..."
            : currentPlayer?.ready
            ? "❌ Not Ready"
            : "✅ Ready"}
        </button>

        <button
          className="
            mt-3
            w-full
            bg-white
            hover:bg-red-50
            text-red-600
            border
            border-red-200
            rounded-xl
            py-3
            font-semibold
            transition
          "
        >
          🚪 Leave Battle
        </button>
      </div>

      {/* Host Controls */}
      {isHost && (
        <>
          <div className="h-px bg-slate-100" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Host Controls
            </p>

            <button
              onClick={handleStartBattle}
              disabled={
                !everyoneReady ||
                !enoughPlayers
              }
              className={`
                w-full
                py-3
                rounded-xl
                font-semibold
                text-white
                transition

                ${
                  everyoneReady && enoughPlayers
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-slate-300 cursor-not-allowed"
                }
              `}
            >
              🚀 Start Battle
            </button>

            {startBlockedReason && (
              <p className="mt-2 text-xs text-slate-400 text-center">
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
