import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!formData.password.trim()) {
      toast.error("Password is required");
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
      toast.loading("Updating password...", { id: "reset" });

      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password: formData.password }
      );

      toast.success(res.data.message, { id: "reset" });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed", {
        id: "reset",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      <header className="h-14 border-b border-[#262626] flex items-center justify-between px-8">
        <div className="bugatti-wordmark">CODESYNC</div>
        <div className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#999999]">
          SECURITY RESET
        </div>
      </header>

      <main className="max-w-7xl w-full mx-auto px-8 py-12 flex-1 flex items-center">
        <div className="grid lg:grid-cols-12 gap-16 items-center w-full">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-block border border-[#262626] bg-[#0d0d0d] px-4 py-1.5 font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#cccccc]">
              CREDENTIAL UPDATE
            </div>

            <h1 className="font-bugatti-display text-5xl sm:text-7xl font-normal leading-[1.05] tracking-[3px] text-white uppercase">
              ESTABLISH NEW
              <br />
              CREDENTIALS.
            </h1>

            <p className="font-bugatti-serif text-xl sm:text-2xl text-[#cccccc] max-w-xl leading-relaxed">
              Your new password should be strong, unique, and stored securely.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-[#141414] border border-[#262626] rounded-none p-8 sm:p-10 shadow-2xl">
              <div className="mb-8 text-center border-b border-[#262626] pb-6">
                <h2 className="font-bugatti-display text-3xl tracking-[4px] text-white uppercase">
                  CODESYNC
                </h2>
                <p className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#999999] mt-2">
                  RESET PASSWORD
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-6">
                <div className="relative">
                  <label className="font-bugatti-mono text-[10px] uppercase tracking-[2px] text-[#999999] block mb-1">
                    NEW PASSWORD
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
                    className="absolute right-0 bottom-3 text-[#666666] hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
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

                <button type="submit" className="bugatti-button-primary w-full">
                  RESET PASSWORD
                </button>
              </form>
            </div>
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

export default ResetPassword;