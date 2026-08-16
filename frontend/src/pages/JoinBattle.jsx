import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function JoinBattle() {
  const navigate = useNavigate();
  const [battleId, setBattleId] = useState("");
  const username = localStorage.getItem("username");

  const joinBattle = async () => {
    if (!battleId.trim()) {
      toast.error("Enter Battle ID");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/battle/join", {
        battleId,
        username,
      });

      toast.success("Joined Battle!");
      navigate(`/battle/lobby/${battleId}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to join battle."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      <header className="h-16 border-b border-[#262626] flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/battle")}
            className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#999999] hover:text-white transition-colors cursor-pointer"
          >
            ← BACK
          </button>
          <div className="bugatti-wordmark">CODESYNC</div>
        </div>
        <div className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666]">
          ARENA ACCESS
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-[#141414] border border-[#262626] rounded-none p-8 sm:p-10 w-full max-w-md shadow-2xl">
          <div className="inline-block border border-[#262626] bg-[#0d0d0d] px-3 py-1 font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#cccccc] mb-4">
            ENTRANCE PORTAL
          </div>

          <h1 className="font-bugatti-display text-3xl tracking-[3px] text-white uppercase">
            JOIN ARENA
          </h1>

          <p className="font-bugatti-serif text-lg text-[#cccccc] mt-3">
            Enter the unique Battle ID code provided by the arena host.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666] block mb-1">
                BATTLE ID KEY
              </label>
              <input
                value={battleId}
                onChange={(e) => setBattleId(e.target.value.toUpperCase())}
                placeholder="e.g. BATTLE-8821"
                className="bugatti-input tracking-[2px] uppercase font-bugatti-mono text-sm"
              />
            </div>

            <button onClick={joinBattle} className="bugatti-button-primary w-full text-center">
              ENTER BATTLE ARENA
            </button>
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

export default JoinBattle;