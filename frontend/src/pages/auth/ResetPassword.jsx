import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axiosApi";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordPage() {

  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [showpassword, setshowpassword] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirmpassword !== password) {
      setConfirmpassword("");
      setPassword("");
      return alert("Both passwords should be same")
    }
    try {
      setloading(true)
      const res = await instance.post(
        `/auth/resetpassword/${token}`,
        { password }
      );

      alert(res.data.message);
      navigate("/login");

    } catch (error) {
      alert(error.response?.data?.message);
    } finally {
      setloading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Reset Password
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Enter your new password below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type={showpassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
  
          <button
            type="button"
            className="fixed top-98 right-147 -translate-y-1/2 curosr-pointer text-gray-400"
            onClick={() => setshowpassword(!showpassword)}>
            {showpassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

          <input
            type={showpassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Update Password
          </button>

        </form>

        {/* Back to login */}
        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-blue-600 text-sm hover:underline"
          >
            Back to Login
          </a>
        </div>

      </div>

    </div>
  );
}

export default ResetPasswordPage;