import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import BattlePlayHeader from "../components/battlePlay/BattlePlayHeader";
import ProblemPanel from "../components/battlePlay/ProblemPanel";
import Leaderboard from "../components/battlePlay/Leaderboard";
import BattleEditor from "../components/battlePlay/BattleEditor";
import BattleTerminal from "../components/battlePlay/BattleTerminal";
import BottomToolbar from "../components/battlePlay/BottomToolbar";

function BattlePlay() {
  const { battleId } = useParams();
  const navigate = useNavigate();

  const [battle, setBattle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!battleId) return;

    let cancelled = false;

    const fetchBattle = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://localhost:5000/api/battle/${battleId}`
        );

        if (!cancelled) {
          setBattle(response.data.battle);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          toast.error(
            error.response?.data?.message || "Failed to load battle."
          );

          navigate("/battle/join");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBattle();

    return () => {
      cancelled = true;
    };
  }, [battleId, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#000000] font-bugatti-mono text-[#999999] text-xs uppercase tracking-[2.5px]">
        LOADING ARENA SESSION...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      {/* NAVBAR */}
      <header className="h-16 border-b border-[#262626] flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/battle")}
            className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#999999] hover:text-white transition-colors cursor-pointer"
          >
            ← EXIT ARENA
          </button>
          <div className="bugatti-wordmark">CODESYNC</div>
        </div>
        <div className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666]">
          LIVE MATCH SESSION
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-8 py-8 space-y-6 flex-1">
        {/* Header */}
        <BattlePlayHeader battleId={battleId} />

        {/* Problem + Leaderboard */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <ProblemPanel />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <Leaderboard />
          </div>
        </div>

        {/* Editor */}
        <BattleEditor
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          allowedLanguages={battle?.languages}
        />

        {/* Terminal */}
        <BattleTerminal
          output={output}
          running={running}
          input={input}
          setInput={setInput}
          setOutput={setOutput}
        />

        {/* Toolbar */}
        <BottomToolbar
          code={code}
          language={language}
          input={input}
          setOutput={setOutput}
          running={running}
          setRunning={setRunning}
        />
      </main>

      <footer className="h-16 border-t border-[#262626] flex items-center justify-between px-8 text-[#666666] font-bugatti-mono text-[11px] tracking-[2px] uppercase">
        <div>© CODESYNC AUTOMOTIVE LUXURY UI</div>
        <div>ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
}

export default BattlePlay;
