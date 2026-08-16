import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function Home() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const storedUser = localStorage.getItem("username");

  const [view, setView] = useState("select"); // "select" | "workspace"

  const createRoom = async () => {
    const newRoomId = Math.random().toString(36).substring(2, 8);
    setRoomId(newRoomId);
    await navigator.clipboard.writeText(newRoomId);
    toast.success("Room ID copied to clipboard!");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Enter username and room ID");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const logoutUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("username");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      {/* NAVBAR */}
      <nav className="h-16 bg-[#000000] border-b border-[#262626] flex items-center justify-between px-6 sm:px-10">
        <div className="flex items-center gap-6">
          {view === "workspace" && (
            <button
              onClick={() => setView("select")}
              className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#999999] hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              ← BACK
            </button>
          )}
          <div className="bugatti-wordmark">CODESYNC</div>
        </div>

        <div className="flex items-center gap-6">
          <span className="hidden lg:inline font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#666666]">
            REALTIME COLLABORATIVE PLATFORM
          </span>

          <div className="hidden sm:block w-px h-4 bg-[#262626]" />

          <div className="font-bugatti-mono text-xs uppercase tracking-[1.5px] text-[#e6e6e6] bg-[#141414] border border-[#262626] px-3.5 py-1.5 rounded-none">
            USER // {storedUser || "GUEST"}
          </div>

          <button
            onClick={logoutUser}
            className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#999999] hover:text-white border border-[#262626] hover:border-white px-4 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            LOGOUT
          </button>
        </div>
      </nav>

      {/* BODY CONTENT */}
      {view === "select" ? (
        <main className="flex-1 flex items-center justify-center py-16 px-6 sm:px-10">
          <div className="max-w-5xl w-full mx-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
              <div className="inline-block border border-[#262626] bg-[#0d0d0d] px-4 py-1.5 font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#cccccc]">
                SELECT ARCHITECTURE MODE
              </div>

              <h1 className="font-bugatti-display text-4xl sm:text-6xl tracking-[3px] text-white uppercase">
                CHOOSE YOUR EXPERIENCE
              </h1>

              <p className="font-bugatti-serif text-xl text-[#cccccc]">
                Collaborate on live synchronised codebases or compete head-to-head in the arena.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {/* Card 1: Collaboration Workspace */}
              <button
                onClick={() => setView("workspace")}
                className="group text-left bg-[#141414] border border-[#262626] hover:border-white p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between cursor-pointer rounded-none"
              >
                <div>
                  <div className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#666666] mb-6">
                    MODE 01 // SYNCHRONIZED
                  </div>
                  <h2 className="font-bugatti-display text-3xl tracking-[2px] text-white uppercase mb-4">
                    COLLABORATION WORKSPACE
                  </h2>
                  <p className="font-bugatti-serif text-lg text-[#cccccc] leading-relaxed mb-8">
                    Build projects together in real time with shared state, live Monaco editing, and execution terminal.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#262626] group-hover:border-white/40 flex items-center justify-between font-bugatti-mono text-xs uppercase tracking-[2.5px] text-white transition-colors">
                  <span>ENTER WORKSPACE</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>

              {/* Card 2: Battle Arena */}
              <button
                onClick={() => navigate("/battle")}
                className="group text-left bg-[#141414] border border-[#262626] hover:border-white p-8 sm:p-10 transition-all duration-300 flex flex-col justify-between cursor-pointer rounded-none"
              >
                <div>
                  <div className="font-bugatti-mono text-xs uppercase tracking-[2px] text-[#666666] mb-6">
                    MODE 02 // ARENA
                  </div>
                  <h2 className="font-bugatti-display text-3xl tracking-[2px] text-white uppercase mb-4">
                    BATTLE ARENA
                  </h2>
                  <p className="font-bugatti-serif text-lg text-[#cccccc] leading-relaxed mb-8">
                    Compete in structured algorithmic duels with live scoreboards, custom timers, and multi-language support.
                  </p>
                </div>

                <div className="pt-6 border-t border-[#262626] group-hover:border-white/40 flex items-center justify-between font-bugatti-mono text-xs uppercase tracking-[2.5px] text-white transition-colors">
                  <span>START BATTLE</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 flex items-center justify-center py-16 px-6 sm:px-10">
          <div className="max-w-7xl w-full mx-auto">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              {/* Left Side */}
              <div className="lg:col-span-7 space-y-8">
                <div className="inline-block border border-[#262626] bg-[#0d0d0d] px-4 py-1.5 font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#cccccc]">
                  COLLABORATIVE ENGINE
                </div>

                <h1 className="font-bugatti-display text-5xl sm:text-7xl font-normal leading-[1.05] tracking-[3px] text-white uppercase">
                  COLLABORATIVE
                  <br />
                  CODING MADE
                  <br />
                  SIMPLE.
                </h1>

                <p className="font-bugatti-serif text-xl sm:text-2xl text-[#cccccc] max-w-xl leading-relaxed">
                  Create room keys, invite teammates, co-edit code instantly, and execute program output within the unified interface.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg">
                  <div className="bg-[#141414] border border-[#262626] p-4 rounded-none">
                    <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">CAPABILITY</span>
                    <span className="font-bugatti-mono text-xs uppercase tracking-[1.5px] text-white">REALTIME SYNC</span>
                  </div>
                  <div className="bg-[#141414] border border-[#262626] p-4 rounded-none">
                    <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">CAPABILITY</span>
                    <span className="font-bugatti-mono text-xs uppercase tracking-[1.5px] text-white">TEAM ROOMS</span>
                  </div>
                  <div className="bg-[#141414] border border-[#262626] p-4 rounded-none">
                    <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">CAPABILITY</span>
                    <span className="font-bugatti-mono text-xs uppercase tracking-[1.5px] text-white">RUNNER ENGINE</span>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="lg:col-span-5">
                <div className="bg-[#141414] border border-[#262626] p-8 sm:p-10 rounded-none shadow-2xl">
                  <div className="mb-8 border-b border-[#262626] pb-6">
                    <h2 className="font-bugatti-display text-3xl tracking-[3px] text-white uppercase">
                      JOIN WORKSPACE
                    </h2>
                    <p className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#999999] mt-2">
                      SPECIFY USERNAME AND ROOM KEY
                    </p>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">
                        USERNAME
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. alex"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bugatti-input"
                      />
                    </div>

                    <div>
                      <label className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">
                        ROOM ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. room-123"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="bugatti-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={createRoom} className="bugatti-button-secondary text-center">
                      CREATE ROOM
                    </button>
                    <button onClick={joinRoom} className="bugatti-button-primary text-center">
                      JOIN ROOM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* FOOTER */}
      <footer className="h-16 border-t border-[#262626] flex items-center justify-between px-8 text-[#666666] font-bugatti-mono text-[11px] tracking-[2px] uppercase">
        <div>© CODESYNC AUTOMOTIVE LUXURY UI</div>
        <div>ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
}

export default Home;
