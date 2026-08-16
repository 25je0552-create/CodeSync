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

  // Single source of truth for the battle workspace — BattleEditor,
  // BattleTerminal, and BottomToolbar all read/write these via props
  // instead of each keeping their own separate copy.
  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  // Fetch battle details (host, difficulty, allowed languages, players, etc.)
  // via GET /api/battle/:battleId — same endpoint battleController.getBattle
  // exposes, and the same shape createBattle already returns on creation.
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
            error.response?.data?.message ||
              "Failed to load battle."
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
      <div className="h-screen flex items-center justify-center bg-[#F6F8FB]">
        <p className="text-slate-600">
          Loading battle...
        </p>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#F6F8FB]">

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">

        {/* Header */}

        <BattlePlayHeader
    battleId={battleId}
/>

        {/* Problem + Leaderboard */}

        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-8">

            <ProblemPanel />

          </div>

          <div className="col-span-4">

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

      </div>

    </div>

  );

}

export default BattlePlay;
