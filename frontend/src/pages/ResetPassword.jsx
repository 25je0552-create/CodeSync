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
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      toast.loading("Updating password...", {
        id: "reset",
      });

      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          password: formData.password,
        }
      );

      toast.success(res.data.message, {
        id: "reset",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Reset failed",
        {
          id: "reset",
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
              🔐 Secure Account
            </div>

            <h1 className="text-6xl font-bold text-slate-900 leading-tight">
              Create a
              <br />
              New Password
            </h1>

            <p className="mt-6 text-xl text-slate-600">
              Your new password should be
              strong and different from the
              one you used previously.
            </p>

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
                  Reset Password
                </p>

              </div>

              <form
                onSubmit={handleReset}
                className="space-y-4"
              >

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={handleChange}
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
                  className="w-full border border-slate-300 rounded-xl p-4"
                />

                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-semibold"
                >
                  Reset Password
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ResetPassword;