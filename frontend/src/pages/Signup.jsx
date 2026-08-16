import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (!formData.confirmPassword.trim()) {
      toast.error("Confirm your password");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      toast.loading("Creating account...", { id: "signup" });

      await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      toast.success("Account created successfully", { id: "signup" });
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed", {
        id: "signup",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      {/* TOP NAV */}
      <header className="h-14 border-b border-[#262626] flex items-center justify-between px-8">
        <div className="bugatti-wordmark">CODESYNC</div>
        <div className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#999999]">
          02 // REGISTRATION
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl w-full mx-auto px-8 py-12 flex-1 flex items-center">
        <div className="grid lg:grid-cols-12 gap-16 items-center w-full">
          {/* Left Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-block border border-[#262626] bg-[#0d0d0d] px-4 py-1.5 font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#cccccc]">
              ENTER THE ARCHITECTURE
            </div>

            <h1 className="font-bugatti-display text-5xl sm:text-7xl font-normal leading-[1.05] tracking-[3px] text-white uppercase">
              JOIN THE
              <br />
              ENGINEERED
              <br />
              COLLECTIVE.
            </h1>

            <p className="font-bugatti-serif text-xl sm:text-2xl text-[#cccccc] max-w-xl leading-relaxed">
              Create your account to unlock real-time synchronized workspaces, high-speed execution, and competitive coding arenas.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 max-w-lg">
              <div className="bg-[#141414] border border-[#262626] p-4 rounded-none">
                <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">SPEC 01</span>
                <span className="font-bugatti-mono text-xs uppercase tracking-[1.5px] text-white">LOW LATENCY</span>
              </div>
              <div className="bg-[#141414] border border-[#262626] p-4 rounded-none">
                <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">SPEC 02</span>
                <span className="font-bugatti-mono text-xs uppercase tracking-[1.5px] text-white">UNLIMITED ROOMS</span>
              </div>
              <div className="bg-[#141414] border border-[#262626] p-4 rounded-none">
                <span className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">SPEC 03</span>
                <span className="font-bugatti-mono text-xs uppercase tracking-[1.5px] text-white">DUEL ARENA</span>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-[#141414] border border-[#262626] rounded-none p-8 sm:p-10 shadow-2xl">
              <div className="mb-8 text-center border-b border-[#262626] pb-6">
                <h2 className="font-bugatti-display text-3xl tracking-[4px] text-white uppercase">
                  CODESYNC
                </h2>
                <p className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#999999] mt-2">
                  NEW ACCOUNT CREATION
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">
                    USERNAME
                  </label>
                  <input
                    name="username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    className="bugatti-input"
                  />
                </div>

                <div>
                  <label className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bugatti-input"
                  />
                </div>

                <div className="relative">
                  <label className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">
                    PASSWORD
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="bugatti-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-3 text-[#666666] hover:text-white transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div>
                  <label className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bugatti-input"
                  />
                </div>

                <button type="submit" className="bugatti-button-primary w-full mt-4">
                  CREATE ACCOUNT
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#262626] text-center">
                <p className="font-bugatti-mono text-xs text-[#999999]">
                  ALREADY REGISTERED?{" "}
                  <Link to="/login" className="bugatti-link ml-2">
                    LOGIN HERE →
                  </Link>
                </p>
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

export default Signup;