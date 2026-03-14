import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../api/axiosApi.js";

function VerifyCode() {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {

    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  const handleResend = async () => {

    try {

      const res = await instance.post("/auth/resend-code", { email });

      setMessage(res.data.message);

      setTimer(15);
      setCanResend(false);

    } catch (error) {

      setMessage(error.response?.data?.message || "Failed to resend code");

    }

  };

  const handleVerify = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setMessage("");

      const res = await instance.post("/auth/verify-email", {
        email,
        code
      });

      navigate("/verified");

    } catch (error) {

      setMessage(error.response?.data?.message || "Verification failed");

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6">

      <div className="w-full max-w-md text-center">

        {/* Branding */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold text-blue-600">
            AttendPro
          </h1>

          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Smart Attendance & Workforce Insights
          </p>

        </div>

        {/* Card */}
        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8">

          <h2 className="text-2xl font-semibold mb-2">
            Verify Your Email
          </h2>

          <p className="text-gray-500 text-sm sm:text-base mb-6">
            Enter the verification code sent to your email.
          </p>

          <form onSubmit={handleVerify} className="space-y-4">

            {/* Code Input */}
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-3 border rounded-lg text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Message */}
            {message && (
              <p className="text-sm text-red-500 text-center">
                {message}
              </p>
            )}

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-medium transition
              ${loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

          </form>

          {/* Resend */}
          <div className="mt-6">

            {canResend ? (

              <button
                onClick={handleResend}
                className="text-blue-600 hover:underline text-sm sm:text-base"
              >
                Resend Code
              </button>

            ) : (

              <p className="text-gray-500 text-sm">
                Resend available in {timer}s
              </p>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default VerifyCode;