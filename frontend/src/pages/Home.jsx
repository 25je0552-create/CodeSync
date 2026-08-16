import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function Home() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const storedUser =
  localStorage.getItem("username");

  // Which screen is showing: the "choose your experience" landing,
  // or the existing join/create workspace UI. Purely a UI-layer switch —
  // none of the room/auth logic below was touched.
  const [view, setView] = useState("select"); // "select" | "workspace"

  const createRoom = async () => {
    const newRoomId = Math.random()
      .toString(36)
      .substring(2, 8);

    setRoomId(newRoomId);

    await navigator.clipboard.writeText(
      newRoomId
    );

    toast.success(
      "Room ID copied to clipboard!"
    );
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error(
        "Enter username and room ID"
      );
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
      {
        withCredentials: true,
      }
    );

    localStorage.removeItem(
      "username"
    );

    toast.success(
      "Logged out successfully"
    );

    navigate("/login");

  } catch (error) {

    toast.error(
      "Logout failed"
    );

  }
};


  return (
    <div className="min-h-screen bg-[#F6F8FB]">

      {/* Navbar */}
      <nav className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-10">

        <div className="flex items-center gap-3">
          {view === "workspace" && (
            <button
              onClick={() => setView("select")}
              className="
              flex
              items-center
              gap-1
              text-slate-400
              hover:text-slate-700
              transition
              text-sm
              font-medium
              mr-2
              "
            >
              <span aria-hidden>←</span> Back
            </button>
          )}

          <h1 className="text-3xl font-bold leading-none">
            <span className="text-slate-900">
              Code
            </span>
            <span className="text-blue-600">
              Sync
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">

          <span className="hidden lg:inline text-sm text-slate-500 mr-2">
            Realtime Collaborative Development
          </span>

          <div className="hidden sm:block w-px h-6 bg-slate-200" />

          <div
            className="
            flex
            items-center
            gap-2
            bg-slate-100
            px-4
            py-2
            rounded-xl
            font-medium
            text-sm
            "
          >
            <span aria-hidden>👤</span> {storedUser}
          </div>

          <button
            onClick={logoutUser}
            className="
            bg-red-500
            hover:bg-red-600
            text-white
            px-5
            py-2
            rounded-xl
            font-medium
            text-sm
            transition
            "
          >
            Logout
          </button>

        </div>

      </nav>

      {view === "select" ? (

        /* Choose Your Coding Experience */
        <div className="min-h-[calc(100vh-5rem)] flex items-center">
          <div className="max-w-5xl w-full mx-auto px-6 sm:px-10 py-16">

            <div className="text-center mb-12 sm:mb-14 max-w-2xl mx-auto">

              <div
                className="
                inline-flex
                items-center
                gap-2
                bg-blue-50
                text-blue-700
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                mb-6
                "
              >
                🚀 Build Together
              </div>

              <h1
                className="
                text-4xl
                sm:text-5xl
                font-bold
                leading-tight
                text-slate-900
                "
              >
                Choose Your Coding Experience
              </h1>

              <p className="mt-4 text-lg text-slate-600">
                Collaborate on real projects, or test your skills head-to-head.
              </p>

            </div>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">

            {/* Collaboration Workspace */}
            <button
              onClick={() => setView("workspace")}
              className="
              group
              flex
              flex-col
              items-start
              text-left
              h-full
              bg-white
              border
              border-slate-200
              rounded-3xl
              p-8
              shadow-sm
              hover:border-blue-400
              hover:shadow-md
              transition
              "
            >
              <div
                className="
                w-14
                h-14
                shrink-0
                rounded-2xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
                text-2xl
                mb-6
                "
              >
                👥
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Collaboration Workspace
              </h2>

              <p className="text-slate-600 mb-8">
                Build projects together in real time. Share code instantly
                with teammates.
              </p>

              <span
                className="
                mt-auto
                inline-flex
                items-center
                gap-2
                text-blue-600
                font-semibold
                group-hover:gap-3
                transition-all
                "
              >
                Enter Workspace <span aria-hidden>→</span>
              </span>
            </button>

            {/* Battle Arena */}
            <button
              onClick={() => navigate("/battle")}
              className="
              group
              flex
              flex-col
              items-start
              text-left
              h-full
              bg-white
              border
              border-slate-200
              rounded-3xl
              p-8
              shadow-sm
              hover:border-slate-900
              hover:shadow-md
              transition
              "
            >
              <div
                className="
                w-14
                h-14
                shrink-0
                rounded-2xl
                bg-slate-100
                text-slate-900
                flex
                items-center
                justify-center
                text-2xl
                mb-6
                "
              >
                ⚔️
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Battle Arena
              </h2>

              <p className="text-slate-600 mb-8">
                Compete in coding duels. Live leaderboard, AI review.
              </p>

              <span
                className="
                mt-auto
                inline-flex
                items-center
                gap-2
                text-slate-900
                font-semibold
                group-hover:gap-3
                transition-all
                "
              >
                Start Battle <span aria-hidden>→</span>
              </span>
            </button>

            </div>

          </div>
        </div>

      ) : (

        /* Hero Section — existing join/create room UI, unchanged */
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-20">

          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left Side */}
            <div>

              <div
                className="
                inline-flex
                items-center
                gap-2
                bg-blue-50
                text-blue-700
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                mb-6
                "
              >
                🚀 Build Together
              </div>

              <h1
                className="
                text-6xl
                font-bold
                leading-tight
                text-slate-900
                "
              >
                Collaborative
                <br />
                Coding Made
                <br />
                Simple.
              </h1>

              <p
                className="
                mt-6
                text-xl
                text-slate-600
                max-w-xl
                "
              >
                Create rooms, invite
                teammates, write code
                together in real-time
                and execute instantly.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">

                <div
                  className="
                  flex-1
                  min-w-[9.5rem]
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  px-5
                  py-4
                  text-center
                  font-medium
                  text-slate-700
                  "
                >
                  ⚡ Realtime Sync
                </div>

                <div
                  className="
                  flex-1
                  min-w-[9.5rem]
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  px-5
                  py-4
                  text-center
                  font-medium
                  text-slate-700
                  "
                >
                  👥 Team Rooms
                </div>

                <div
                  className="
                  flex-1
                  min-w-[9.5rem]
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  px-5
                  py-4
                  text-center
                  font-medium
                  text-slate-700
                  "
                >
                  ▶ Code Runner
                </div>

              </div>

            </div>

            {/* Right Side */}
            <div>

              <div
                className="
                bg-white
                rounded-3xl
                border
                border-slate-200
                p-8
                shadow-sm
                "
              >

                <h2
                  className="
                  text-2xl
                  font-bold
                  text-slate-900
                  mb-6
                  "
                >
                  Join Workspace
                </h2>

                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                  className="
                  w-full
                  mb-4
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  px-4
                  py-4
                  outline-none
                  focus:border-blue-500
                  "
                />

                <input
                  type="text"
                  placeholder="Room ID"
                  value={roomId}
                  onChange={(e) =>
                    setRoomId(
                      e.target.value
                    )
                  }
                  className="
                  w-full
                  mb-6
                  bg-slate-50
                  border
                  border-slate-200
                  rounded-xl
                  px-4
                  py-4
                  outline-none
                  focus:border-blue-500
                  "
                />

                <div className="grid grid-cols-2 gap-4">

                  <button
                    onClick={createRoom}
                    className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    py-4
                    rounded-xl
                    font-medium
                    transition
                    "
                  >
                    Create Room
                  </button>

                  <button
                    onClick={joinRoom}
                    className="
                    bg-slate-900
                    hover:bg-slate-800
                    text-white
                    py-4
                    rounded-xl
                    font-medium
                    transition
                    "
                  >
                    Join Room
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Home;
