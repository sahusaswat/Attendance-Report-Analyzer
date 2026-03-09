import React from 'react'
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import instance from "../../api/axiosApi.js"

function VerifyCode() {

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;
    const [code, setCode] = useState("");
    const [timer, setTimer] = useState(15);
    const [canResend, setCanResend] = useState(false);

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

            alert(res.data.message);

            setTimer(15);
            setCanResend(false);

        } catch (error) {

            alert(error.response?.data?.message || "Failed to resend code");

        }

    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await instance.post("/auth/verify-email", {
                email,
                code
            });
            console.log(email, code);
            alert(res.data.message)
            navigate("/verified")
        } catch (error) {
            alert(error.response?.data?.message || "Verification Failed!")
        }
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">

                    <h2 className="text-2xl font-bold mb-4">
                        Verify Your Email
                    </h2>

                    <p className="text-gray-500 mb-6">
                        Enter the verification code sent to your email
                    </p>

                    <form onSubmit={handleVerify} className="space-y-4">

                        <input
                            type="text"
                            placeholder="Enter verification code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full p-3 border rounded-lg text-center text-lg tracking-widest"
                            required
                        />

                        <button
                            type="submit"
                            className="w-full cursor-pointer bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                        >
                            Verify Email
                        </button>

                        <div className="text-center mt-4">

                    {canResend ? (

                        <button
                            onClick={handleResend}
                            className="text-blue-600 hover:underline cursor-pointer"
                        >
                            Resend Code
                        </button>

                    ) : (

                        <p className="text-gray-500">
                            Resend available in {timer}s
                        </p>

                    )}

                </div>

                    </form>

                </div>

            </div>
        </>
    )
}

export default VerifyCode
