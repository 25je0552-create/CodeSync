import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] =
    useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error(
        "Username is required"
      );
      return;
    }

    if (!formData.email.trim()) {
      toast.error(
        "Email is required"
      );
      return;
    }

    if (
      !formData.email.includes("@")
    ) {
      toast.error(
        "Enter a valid email"
      );
      return;
    }

    if (!formData.password.trim()) {
      toast.error(
        "Password is required"
      );
      return;
    }

    if (
      !formData.confirmPassword.trim()
    ) {
      toast.error(
        "Confirm your password"
      );
      return;
    }

    if (
      formData.password.length < 6
    ) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    try {
      toast.loading(
        "Creating account...",
        {
          id: "signup",
        }
      );

      await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          username:
            formData.username,
          email: formData.email,
          password:
            formData.password,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        "Account created successfully",
        {
          id: "signup",
        }
      );

      navigate("/login");

    } catch (error) {

      toast.error(
        error.response?.data
          ?.message ||
          "Signup failed",
        {
          id: "signup",
        }
      );
    }
  };

  return (
  <div className="min-h-screen bg-[#f8fafc]">
    <div className="max-w-7xl mx-auto px-6">

      <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">

        {/* Left Side */}

        <div>

          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium mb-6">
            🚀 Join CodeSync
          </div>

          <h1 className="text-6xl font-bold text-slate-900 leading-tight">
            Start Coding
            <br />
            Together
            <br />
            Today.
          </h1>

          <p className="mt-6 text-xl text-slate-600">
            Create rooms, collaborate in
            real-time, execute code instantly,
            and build amazing projects with
            your team.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">

            <div className="bg-white border px-5 py-3 rounded-xl">
              ⚡ Realtime Sync
            </div>

            <div className="bg-white border px-5 py-3 rounded-xl">
              👥 Team Collaboration
            </div>

            <div className="bg-white border px-5 py-3 rounded-xl">
              ▶️ Code Execution
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
                Create Account
              </p>

            </div>

            <form
              onSubmit={handleSignup}
              className="space-y-4"
            >

              <input
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-4 outline-none focus:border-blue-500"
              />

              <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-4 outline-none focus:border-blue-500"
              />

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-4 outline-none focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-5 text-slate-500"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>

              </div>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={
                  formData.confirmPassword
                }
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl p-4 outline-none focus:border-blue-500"
              />

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-semibold transition"
              >
                Create Account
              </button>

            </form>

            

            <p className="text-center mt-8 text-slate-500">

              Already have an account?

              <Link
                to="/login"
                className="ml-2 text-blue-600 font-semibold"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  </div>
);
}

export default Signup;