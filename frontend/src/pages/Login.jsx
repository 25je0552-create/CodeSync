import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      toast.loading("Logging in...", {
        id: "login",
      });

      const res = await axios.post(
  "http://localhost:5000/api/auth/login",
  {
    email,
    password,
  },
  {
    withCredentials: true,
  }
);

localStorage.setItem(
  "userId",
  res.data.user.id
);

localStorage.setItem(
  "username",
  res.data.user.username
);

toast.success(
  "Login successful",
  {
    id: "login",
  }
);

navigate("/home");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Login failed",
        {
          id: "login",
        }
      );
    }
  };

  const handleGoogleLogin = () => {
  window.location.href =
    "http://localhost:5000/api/auth/google";
};

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">

          {/* Left Side */}

          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium mb-6">
              🚀 Welcome Back
            </div>

            <h1 className="text-6xl font-bold text-slate-900 leading-tight">
              Collaborative
              <br />
              Coding Made
              <br />
              Simple.
            </h1>

            <p className="mt-6 text-xl text-slate-600">
              Create rooms, invite teammates,
              write code together in real-time
              and execute instantly.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <div className="bg-white border px-5 py-3 rounded-xl">
                ⚡ Realtime Sync
              </div>

              <div className="bg-white border px-5 py-3 rounded-xl">
                👥 Team Rooms
              </div>

              <div className="bg-white border px-5 py-3 rounded-xl">
                ▶️ Code Runner
              </div>
            </div>
          </div>

          {/* Right Side */}

          <div className="flex justify-center">

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

              <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold">
                  <span className="text-slate-900">
                    Code
                  </span>

                  <span className="text-blue-600">
                    Sync
                  </span>
                </h1>

                <p className="text-slate-500 mt-2">
                  Welcome Back
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full border border-slate-300 rounded-xl p-4"
                />

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    className="w-full border border-slate-300 rounded-xl p-4"
                  />

                  <button
                    type="button"
                    className="absolute right-4 top-5 text-slate-500"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-semibold"
                >
                  Login
                </button>
              </form>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t"></div>

                <span className="px-3 text-slate-400 text-sm">
                  OR CONTINUE WITH
                </span>

                <div className="flex-1 border-t"></div>
              </div>

              <button
  type="button"
  onClick={() => {
    window.location.href =
      "http://localhost:5000/api/auth/google";
  }}
  className="w-full border border-slate-300 rounded-xl py-4 font-medium hover:bg-slate-50"
>
  Continue with Google
</button>

              <Link
                to="/forgot-password"
                className="block text-center mt-5 text-blue-600"
              >
                Forgot Password?
              </Link>

              <p className="text-center mt-5 text-slate-500">
                Don't have an account?

                <Link
                  to="/signup"
                  className="ml-2 text-blue-600 font-semibold"
                >
                  Sign Up
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;