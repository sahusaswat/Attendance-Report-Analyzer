import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axiosApi.js";
import React from "react";

const EnterOrg = () => {
console.log("ENTER ORG PAGE LOADED");
  const [orgs, setOrgs] = useState([]);
  const navigate = useNavigate();

  // Fetch all organizations user belongs to
  useEffect(() => {
    const fetchMyOrgs = async () => {
      try {
        const res = await instance.get("/org/my-org");
        console.log("ORG API RESPONSE:", res.data);
        setOrgs(res.data.orgs);
      } catch (err) {
        console.log("Error fetching orgs", err);
      }
    };

    fetchMyOrgs();
  }, []);

  // When user selects an organization
  const handleEnterOrg = async (orgId) => {
    try {
      const res = await instance.post("/org/enter-org", { orgId });

      const workspaceToken = res.data.token;

      // Save workspace token
      localStorage.setItem("workspaceToken", workspaceToken);

      // Decode role from token
      const payload = JSON.parse(atob(workspaceToken.split(".")[1]));
      const role = payload.role;

      // Redirect based on role
      if (role === "admin") navigate("/admin");
      else if (role === "manager") navigate("/manager");
      else navigate("/member");

    } catch (err) {
      console.log("Error entering org", err);
    }
  };

  return (
    <div>
      <h2>Select Organization</h2>

      {orgs.map((org) => (
        <div key={org.orgId._id}>
          <button onClick={() => handleEnterOrg(org.orgId._id)}>
            {org.orgId.name} ({org.role})
          </button>
        </div>
      ))}

    </div>
  );
};

export default EnterOrg;