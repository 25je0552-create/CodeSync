import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      toast.loading("Sending reset link...", { id: "forgot" });

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      toast.success(res.data.message, { id: "forgot" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send email",
        { id: "forgot" }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      <header className="h-14 border-b border-[#262626] flex items-center justify-between px-8">
        <div className="bugatti-wordmark">CODESYNC</div>
        <div className="font-bugatti-mono text-[11px] uppercase tracking-[2px] text-[#999999]">
          RECOVERY
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-[#141414] border border-[#262626] rounded-none p-8 sm:p-10 w-full max-w-md">
          <h1 className="font-bugatti-display text-3xl tracking-[3px] text-center text-white uppercase">
            RECOVER ACCESS
          </h1>
          <p className="font-bugatti-serif text-[#cccccc] text-center mt-3 text-lg">
            Enter your registered email address to receive password recovery instructions.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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

            <button type="submit" className="bugatti-button-primary w-full">
              SEND RESET LINK
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#262626] text-center">
            <Link to="/login" className="bugatti-link">
              ← RETURN TO LOGIN
            </Link>
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

export default ForgotPassword;