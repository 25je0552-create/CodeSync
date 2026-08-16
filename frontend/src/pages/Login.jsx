import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      toast.loading("Logging in...", { id: "login" });

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("username", res.data.user.username);

      toast.success("Login successful", { id: "login" });
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        id: "login",
      });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      {/* TOP WORDMARK NAV */}
      <header className="h-14 border-b border-[#262626] flex items-center justify-between px-8">
        <div className="bugatti-wordmark">CODESYNC</div>
        <div className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#999999]">
          01 // ACCESS
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl w-full mx-auto px-8 py-12 flex-1 flex items-center">
        <div className="grid lg:grid-cols-12 gap-16 items-center w-full">
          {/* Left Side — Bugatti Editorial Hero */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-block border border-[#262626] bg-[#0d0d0d] px-4 py-1.5 font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#cccccc]">
              REFINED REALTIME PLATFORM
            </div>

            <h1 className="font-bugatti-display text-5xl sm:text-7xl font-normal leading-[1.05] tracking-[3px] text-white uppercase">
              ARCHITECTURAL
              <br />
              COLLABORATION
              <br />
              ENGINEERED.
            </h1>

            <p className="font-bugatti-serif text-xl sm:text-2xl text-[#cccccc] max-w-xl leading-relaxed">
              Create synchronized rooms, invite peers, inspect execution, and craft software within a hyper-minimalist European interface.
            </p>

            {/* Feature Tokens */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg">
              <div className="bg-[#141414] border border-[#262626] p-4 rounded-none">
                <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">01 / CAPABILITY</span>
                <span className="font-bugatti-mono text-xs uppercase tracking-[1.5px] text-white">REALTIME SYNC</span>
              </div>
              <div className="bg-[#141414] border border-[#262626] p-4 rounded-none">
                <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">02 / WORKSPACE</span>
                <span className="font-bugatti-mono text-xs uppercase tracking-[1.5px] text-white">TEAM ROOMS</span>
              </div>
              <div className="bg-[#141414] border border-[#262626] p-4 rounded-none">
                <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">03 / ENGINE</span>
                <span className="font-bugatti-mono text-xs uppercase tracking-[1.5px] text-white">CODE RUNNER</span>
              </div>
            </div>
          </div>

          {/* Right Side — Bugatti Card Form */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-[#141414] border border-[#262626] rounded-none p-8 sm:p-10 shadow-2xl">
              <div className="mb-8 text-center border-b border-[#262626] pb-6">
                <h2 className="font-bugatti-display text-3xl tracking-[4px] text-white uppercase">
                  CODESYNC
                </h2>
                <p className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#999999] mt-2">
                  AUTHENTICATION PORTAL
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bugatti-input"
                  />
                </div>

                <div className="relative">
                  <label className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">
                    PASSWORD
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bugatti-input pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-0 bottom-3 text-[#666666] hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button type="submit" className="bugatti-button-primary w-full mt-4">
                  LOGIN
                </button>
              </form>

              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-[#262626]"></div>
                <span className="px-4 font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#666666]">
                  OR
                </span>
                <div className="flex-1 border-t border-[#262626]"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="bugatti-button-secondary w-full"
              >
                CONTINUE WITH GOOGLE
              </button>

              <div className="mt-8 pt-6 border-t border-[#262626] flex items-center justify-between text-xs">
                <Link to="/forgot-password" className="bugatti-link">
                  FORGOT PASSWORD?
                </Link>
                <Link to="/signup" className="bugatti-link">
                  CREATE ACCOUNT →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="h-16 border-t border-[#262626] flex items-center justify-between px-8 text-[#666666] font-bugatti-mono text-[11px] tracking-[2px] uppercase">
        <div>© CODESYNC AUTOMOTIVE LUXURY UI</div>
        <div>ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
}

export default Login;