import {
  useEffect,
  useState,
} from "react";

import Editor from "@monaco-editor/react";
// import { requiresInput } from "../utils/detectInput";
import axios from "axios";
import Terminal from "../components/Terminal";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";
import socket from "../socket";

function EditorPage() {
  const { roomId } = useParams();

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  const [members, setMembers] =
    useState([]);

    const [programInput, setProgramInput] = useState("");

const [output, setOutput] = useState("");

const [runInfo, setRunInfo] = useState(null);

const [running, setRunning] = useState(false);

   

  const [
    showLeaveModal,
    setShowLeaveModal,
  ] = useState(false);

  const [language, setLanguage] =
    useState("javascript");

  const [code, setCode] =
    useState("");

//   const [history, setHistory] = useState([
//   {
//     type: "system",
//     text: "Welcome to CodeSync Terminal",
//   },
// ]);

// const [currentInput, setCurrentInput] = useState("");

// const [stdinBuffer, setStdinBuffer] = useState("");

// const [terminalMode, setTerminalMode] = useState("idle");
// idle | stdin | running
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

//     const handleTerminalEnter = async () => {

//     if (terminalMode === "running") {
//         return;
//     }

//     const input = currentInput.trim();

//     if (!input) return;

//     // Always save the typed line
//     setHistory(prev => [
//     ...prev,
//     {
//         type: "input",
//         text: input,
//     },
// ]);

//     setCurrentInput("");

//     if (terminalMode === "idle") {
//         return;
//     }

//     if (terminalMode === "stdin") {
//     setTerminalMode("running");
//     await executeCode(input);
// }
// };

  

 useEffect(() => {
  const verifyUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/verify",
        {
          withCredentials: true,
        }
      );

      setCurrentUser(res.data.user);
      setIsAuthenticated(true);

    } catch {
      navigate("/login");
    }
  };

  verifyUser();
}, [navigate]);

 

  useEffect(() => {
  console.log("JOIN EFFECT");

  console.log("isAuthenticated =", isAuthenticated);
  console.log("currentUser =", currentUser);

  if (!isAuthenticated || !currentUser) {
    console.log("RETURNING");
    return;
  }

  console.log("EMITTING JOIN");

  socket.emit("join-room", {
    roomId,
    userId: currentUser._id || currentUser.id,
    username: currentUser.username,
  });

}, [
  isAuthenticated,
  currentUser,
  roomId,
]);
  

  useEffect(() => {
    const handleRoomState = (
      roomState
    ) => {
      setCode(roomState.code);

      setLanguage(
        roomState.language
      );
    };

    const handleReceiveCode = (
      incomingCode
    ) => {
      setCode(incomingCode);
    };
    const handleReceiveLanguage = (incomingLanguage) => {
  setLanguage(incomingLanguage);
};

    const handleRoomMembers = (
      users
    ) => {
      setMembers(users);
    };

    


socket.on(
    "receive-language",
    handleReceiveLanguage
);

    socket.on(
      "room-state",
      handleRoomState
    );

    socket.on(
      "receive-code",
      handleReceiveCode
    );

    socket.on(
      "room-members",
      handleRoomMembers
    );

    return () => {
      socket.off(
        "room-state",
        handleRoomState
      );

      socket.off(
        "receive-code",
        handleReceiveCode
      );

      socket.off(
        "room-members",
        handleRoomMembers
      );
      socket.off(
    "receive-language",
    handleReceiveLanguage
);
    };
  }, []);

  

  const executeCode = async () => {
//     setHistory(prev => [
//     ...prev,
//     {
//         type: "running",
//         text: "⚡ Running...",
//     },
// ]);
  // setTerminalMode("running");

  try {
    setRunning(true);

const response = await axios.post(
  "http://localhost:5000/execute",
  {
    code,
    language,
    input: programInput,
  }
);
    

   setOutput(response.data.output);
   setProgramInput("");

setRunInfo({
    time: response.data.time,
    memory: response.data.memory,
});
  } catch (error) {
    setOutput(
        error.response?.data?.output ||
        "❌ Execution Failed."
    );

    setProgramInput("");
}

 setRunning(false);
};
const handleRun = () => {
    executeCode();
};

  

  const leaveRoom = () => {
    socket.emit("leave-room");

    toast.success(
      "Left room successfully"
    );

    navigate("/home");
  };


  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F6F8FB]">
        <p className="text-slate-600">
          Loading workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F6F8FB] flex flex-col">

      {/* NAVBAR */}

      <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-slate-900">
              Code
            </span>

            <span className="text-blue-600">
              Sync
            </span>
          </h1>

          <p className="text-sm text-slate-500">
            Realtime Collaborative Development Platform
          </p>
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
            className="bg-white text-slate-700 px-4 py-2 rounded-xl border border-slate-300 outline-none"
          >
            <option value="javascript">
              JavaScript
            </option>

            <option value="python">
              Python
            </option>

            <option value="cpp">
              C++
            </option>

            <option value="java">
              Java
            </option>

            <option value="typescript">
              TypeScript
            </option>
          </select>

          <button
            
  onClick={handleRun}

            className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5 rounded-xl font-medium text-white transition shadow-sm"
          >
            ▶ Run Code
          </button>

        </div>
      </div>

      {/* MAIN AREA */}

      <div className="flex-1 flex overflow-hidden">

        {/* SIDEBAR */}

        <div className="w-72 bg-white border-r border-slate-200 p-5 overflow-y-auto">

          <div className="mb-8">

            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
              Team Members
            </h3>

            <div className="space-y-3">

              {members.map(
                (member) => (
                  <div
                    key={
                      member.userId
                    }
                    className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3"
                  >

                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">

                      {member.username
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                    <div>

                      <p className="text-slate-800 font-medium">
                        {
                          member.username
                        }
                      </p>

                      <p className="text-xs text-green-600">
                        Online
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>
          </div>

          {/* ROOM CARD */}

          <div>

            <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
              Room
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">

              <p className="text-xs text-slate-500">
                Room ID
              </p>

              <p className="text-lg font-semibold text-slate-800 mt-1">
                {roomId}
              </p>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    roomId
                  );

                  toast.success(
                    "Room ID copied!"
                  );
                }}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-medium transition"
              >
                Copy Room ID
              </button>

            </div>
          </div>
        </div>

        {/* WORKSPACE */}

        <div className="flex-1 flex flex-col bg-[#F6F8FB]">

          <div className="h-16 bg-white border-b flex items-center justify-between px-6">

            <h1 className="font-bold text-xl">
              CodeSync
            </h1>

            <div className="flex gap-3">

              <div className="bg-slate-100 px-4 py-2 rounded-lg">
                👤 {currentUser?.username}
              </div>

              <button
                onClick={() =>
                  setShowLeaveModal(
                    true
                  )
                }
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Leave Room
              </button>

            </div>
          </div>

          {/* EDITOR */}

          <div className="flex-1 p-6 overflow-hidden">

            <div className="h-full rounded-2xl overflow-hidden border border-slate-300 shadow-sm">

              <Editor
                height="100%"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => {
                  const newCode =
                    value || "";

                  setCode(newCode);

                  socket.emit(
                    "code-change",
                    {
                      roomId,
                      code: newCode,
                    }
                  );
                }}
                options={{
                  fontSize: 18,
                  lineHeight: 28,

                  minimap: {
                    enabled: false,
                  },

                  fontFamily:
                    "'Cascadia Code', Consolas, monospace",

                  automaticLayout: true,

                  cursorBlinking:
                    "blink",

                  padding: {
                    top: 20,
                  },
                }}
              />

            </div>
          </div>

          {/* TERMINAL */}

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
        </div>
      </div>

      {/* LEAVE MODAL */}

      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-[420px] rounded-3xl shadow-2xl p-8">

            <h2 className="text-2xl font-bold text-slate-900">
              Leave Room?
            </h2>

            <p className="mt-3 text-slate-600">
              You will leave the current collaborative session.
            </p>

            <div className="flex gap-4 mt-8">

              <button
                onClick={() =>
                  setShowLeaveModal(
                    false
                  )
                }
                className="flex-1 border border-slate-300 py-3 rounded-xl font-medium"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowLeaveModal(
                    false
                  );

                  leaveRoom();
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium"
              >
                Leave
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default EditorPage;