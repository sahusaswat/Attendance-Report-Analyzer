import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import instance from "../../api/axiosApi";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordPage() {

  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {

      setLoading(true);
      setError("");

      const res = await instance.post(
        `/auth/resetpassword/${token}`,
        { password }
      );

      navigate("/login");

    } catch (err) {

      setError(err.response?.data?.message || "Reset failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6">

      <div className="w-full max-w-md">

        {/* Branding */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-600">
            AttendPro
          </h1>

          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Reset your password securely
          </p>

        </div>

        {/* Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8">

          <h2 className="text-2xl font-semibold text-center mb-6">
            Create a new password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* New Password */}
            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 text-sm sm:text-base"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>

            {/* Confirm Password */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-medium transition
              ${loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>

          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">

            <Link
              to="/login"
              className="text-blue-600 text-sm sm:text-base hover:underline"
            >
              Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ResetPasswordPage;