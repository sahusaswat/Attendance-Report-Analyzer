import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import instance from "../../api/axiosApi.js";
import { useAuth } from "../../context/AuthContext.jsx";
import React from "react";

const EnterOrg = () => {

  const [orgs, setOrgs] = useState([]);
  const navigate = useNavigate();
  const { setuser } = useAuth();

  useEffect(() => {

    const fetchMyOrgs = async () => {
      try {

        const res = await instance.get("/org/my-org");
        setOrgs(res.data.orgs);

      } catch (err) {

        console.log("Error fetching orgs", err);

      }
    };

    fetchMyOrgs();

  }, []);

  const handleEnterOrg = async (orgId) => {

    try {

      await instance.post("/org/enter-org", { orgId });

      const res = await instance.get("/auth/me");

      setuser({
        ...res.data.user,
        orgId: res.data.orgId,
        role: res.data.role
      });

      navigate("/dashboardredirect");

    } catch (err) {

      console.log("Error entering org", err);

    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center px-4">

      {/* SaaS Logo */}

      <div className="flex items-center gap-3 mb-6 sm:mb-8">

        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
          A
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            AttendPro
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Attendance Management SaaS
          </p>
        </div>

      </div>

      {/* Card */}

      <div className="bg-white shadow-xl rounded-xl p-6 sm:p-8 w-full max-w-md">

        <h1 className="text-xl sm:text-2xl font-bold text-gray-700 text-center mb-6">
          Select Organization
        </h1>

        {orgs.length === 0 ? (

          <p className="text-center text-gray-500 text-sm sm:text-base">
            You are not part of any organization yet
          </p>

        ) : (

          <div className="flex flex-col gap-3 sm:gap-4">

            {orgs.map((org) => (

              <button
                key={org.orgId._id}
                onClick={() => handleEnterOrg(org.orgId._id)}
                className="border p-3 sm:p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 transition"
              >

                <span className="font-semibold text-base sm:text-lg">
                  {org.orgId.name}
                </span>

                <span className="text-xs sm:text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded capitalize">
                  {org.role}
                </span>

              </button>

            ))}

          </div>

        )}

        {/* Divider */}

        <div className="my-6 border-t"></div>

        <Link
          to="/dashboard"
          className="block text-center text-purple-600 font-medium text-sm sm:text-base hover:underline"
        >
          Go to Dashboard
        </Link>

      </div>

    </div>
  );
};

export default EnterOrg;