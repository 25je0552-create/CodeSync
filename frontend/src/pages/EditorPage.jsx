import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Terminal from "../components/terminal";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import socket from "../socket";

function EditorPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [programInput, setProgramInput] = useState("");
  const [output, setOutput] = useState("");
  const [runInfo, setRunInfo] = useState(null);
  const [running, setRunning] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/verify", {
          withCredentials: true,
        });
        setCurrentUser(res.data.user);
        setIsAuthenticated(true);
      } catch {
        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      return;
    }

    socket.emit("join-room", {
      roomId,
      userId: currentUser._id || currentUser.id,
      username: currentUser.username,
    });
  }, [isAuthenticated, currentUser, roomId]);

  useEffect(() => {
    const handleRoomState = (roomState) => {
      setCode(roomState.code);
      setLanguage(roomState.language);
    };

    const handleReceiveCode = (incomingCode) => {
      setCode(incomingCode);
    };

    const handleReceiveLanguage = (incomingLanguage) => {
      setLanguage(incomingLanguage);
    };

    const handleRoomMembers = (users) => {
      setMembers(users);
    };

    socket.on("receive-language", handleReceiveLanguage);
    socket.on("room-state", handleRoomState);
    socket.on("receive-code", handleReceiveCode);
    socket.on("room-members", handleRoomMembers);

    return () => {
      socket.off("room-state", handleRoomState);
      socket.off("receive-code", handleReceiveCode);
      socket.off("room-members", handleRoomMembers);
      socket.off("receive-language", handleReceiveLanguage);
    };
  }, []);

  const executeCode = async () => {
    try {
      setRunning(true);

      const response = await axios.post("http://localhost:5000/execute", {
        code,
        language,
        input: programInput,
      });

      setOutput(response.data.output);
      setProgramInput("");
      setRunInfo({
        time: response.data.time,
        memory: response.data.memory,
      });
    } catch (error) {
      setOutput(error.response?.data?.output || "❌ Execution Failed.");
      setProgramInput("");
    }

    setRunning(false);
  };

  const handleRun = () => {
    executeCode();
  };

  const leaveRoom = () => {
    socket.emit("leave-room");
    toast.success("Left room successfully");
    navigate("/home");
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#000000] font-bugatti-mono text-[#999999] text-xs uppercase tracking-[2.5px]">
        LOADING WORKSPACE...
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#000000] text-white flex flex-col selection:bg-white selection:text-black">
      {/* NAVBAR */}
      <header className="h-16 bg-[#000000] border-b border-[#262626] flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="bugatti-wordmark">CODESYNC</div>
          <span className="hidden sm:inline font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666]">
            SYNCHRONIZED EDITOR
          </span>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={language}
            onChange={(e) => {
              const newLanguage = e.target.value;
              setLanguage(newLanguage);
              socket.emit("language-change", {
                roomId,
                language: newLanguage,
              });
            }}
            className="bg-[#141414] text-white font-bugatti-mono text-xs uppercase tracking-[1.5px] px-4 py-2 border border-[#262626] focus:border-white outline-none rounded-none cursor-pointer"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="typescript">TypeScript</option>
          </select>

          <button onClick={handleRun} className="bugatti-button-primary py-2 px-6 text-xs">
            ▶ RUN CODE
          </button>

          <button
            onClick={() => setShowLeaveModal(true)}
            className="bugatti-button-secondary py-2 px-4 text-xs"
          >
            LEAVE
          </button>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-72 bg-[#0d0d0d] border-r border-[#262626] p-5 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-8">
            {/* MEMBERS SECTION */}
            <div>
              <h3 className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666] mb-4">
                TEAM MEMBERS ({members.length})
              </h3>

              <div className="space-y-2.5">
                {members.map((member) => (
                  <div
                    key={member.userId}
                    className="bg-[#141414] border border-[#262626] p-3 rounded-none flex items-center gap-3"
                  >
                    <div className="w-7 h-7 bg-[#000000] border border-[#262626] text-white font-bugatti-mono text-xs flex items-center justify-center">
                      {member.username?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bugatti-mono text-xs text-white uppercase tracking-[1px] truncate">
                        {member.username}
                      </p>
                      <p className="font-bugatti-mono text-[10px] text-[#5fa657] uppercase tracking-[1px]">
                        ONLINE
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROOM CARD */}
            <div>
              <h3 className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666] mb-4">
                ROOM DETAILS
              </h3>

              <div className="bg-[#141414] border border-[#262626] p-4 rounded-none">
                <p className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
                  ROOM KEY
                </p>
                <p className="font-bugatti-display text-2xl tracking-[2px] text-white mt-1">
                  {roomId}
                </p>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(roomId);
                    toast.success("Room ID copied!");
                  }}
                  className="mt-4 w-full bugatti-button-secondary py-2 text-xs text-center"
                >
                  COPY KEY
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#262626] font-bugatti-mono text-[10px] uppercase tracking-[1.5px] text-[#666666]">
            USER // {currentUser?.username}
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <main className="flex-1 flex flex-col bg-[#000000] overflow-hidden">
          {/* EDITOR WRAPPER */}
          <div className="flex-1 p-4 overflow-hidden bg-[#000000]">
            <div className="h-full rounded-none border border-[#262626] overflow-hidden">
              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => {
                  const newCode = value || "";
                  setCode(newCode);
                  socket.emit("code-change", {
                    roomId,
                    code: newCode,
                  });
                }}
                options={{
                  fontSize: 16,
                  lineHeight: 26,
                  minimap: { enabled: false },
                  fontFamily: "'JetBrains Mono', monospace",
                  automaticLayout: true,
                  cursorBlinking: "blink",
                  padding: { top: 16 },
                }}
              />
            </div>
          </div>

          {/* TERMINAL COMPONENT */}
          <Terminal
            programInput={programInput}
            setProgramInput={setProgramInput}
            output={output}
            runInfo={runInfo}
            running={running}
            onClear={() => {
              setOutput("");
              setRunInfo(null);
            }}
          />
        </main>
      </div>

      {/* LEAVE MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#141414] border border-[#262626] w-full max-w-md p-8 rounded-none">
            <h2 className="font-bugatti-display text-2xl tracking-[3px] text-white uppercase">
              LEAVE WORKSPACE?
            </h2>
            <p className="font-bugatti-serif text-lg text-[#cccccc] mt-3">
              You will disconnect from the live collaborative session.
            </p>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 bugatti-button-secondary py-3 text-xs"
              >
                CANCEL
              </button>

              <button
                onClick={() => {
                  setShowLeaveModal(false);
                  leaveRoom();
                }}
                className="flex-1 bugatti-button-primary py-3 text-xs text-[#ff5f57] border-[#ff5f57] hover:bg-[#ff5f57]/10"
              >
                LEAVE SESSION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditorPage;