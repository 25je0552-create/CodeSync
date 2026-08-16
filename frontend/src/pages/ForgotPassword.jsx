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
      toast.loading("Sending reset link...", {
        id: "forgot",
      });

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      toast.success(res.data.message, {
        id: "forgot",
      });

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send email",
        {
          id: "forgot",
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center">

      <div className="bg-white w-[450px] rounded-3xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center">
          Forgot Password
        </h1>

        <p className="text-slate-500 text-center mt-2">
          Enter your email to receive a password reset link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4"
        >

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border border-slate-300 rounded-xl p-4 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-semibold"
          >
            Send Reset Link
          </button>

        </form>

        <Link
          to="/login"
          className="block text-center mt-6 text-blue-600"
        >
          Back to Login
        </Link>

      </div>

    </div>
  );
}

export default ForgotPassword;