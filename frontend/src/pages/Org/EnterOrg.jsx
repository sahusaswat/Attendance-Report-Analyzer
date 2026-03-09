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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">

      <div className="bg-white shadow-lg rounded-lg p-10 w-[450px]">

        <h1 className="text-3xl font-bold text-gray-700 text-center mb-8">
          Select Organization
        </h1>

        {orgs.length === 0 ? (

          <p className="text-center text-gray-500">
            You are not part of any organization yet
          </p>

        ) : (

          <div className="flex flex-col gap-4">

            {orgs.map((org) => (

              <button
                key={org.orgId._id}
                onClick={() => handleEnterOrg(org.orgId._id)}
                className="border p-4 rounded-lg flex justify-between items-center hover:bg-gray-100 transition"
              >

                <span className="font-semibold text-lg">
                  {org.orgId.name}
                </span>

                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded capitalize">
                  {org.role}
                </span>

              </button>

            ))}

          </div>

        )}
        <Link
          to="/dashboardredirect"
          className="block text-center text-purple-600 font-medium hover:underline"
        >
          Go to Dashboard
        </Link>

      </div>

    </div>
  );
};

export default EnterOrg;