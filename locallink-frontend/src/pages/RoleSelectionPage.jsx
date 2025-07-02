import { useAuthContext } from "@asgardeo/auth-react";
import { useState } from "react";

function RoleSelectionPage() {
  const { getAccessToken } = useAuthContext();
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const handleAssign = async () => {
    try {
      const accessToken = await getAccessToken();

      const res = await fetch("http://localhost:5000/api/assign-role", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);
      setStatus("✅ Role assigned successfully!");
    } catch (err) {
      setStatus("❌ " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-blue-800">Select Your Role</h2>
      <select
        className="w-full border px-3 py-2 rounded mb-4"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">-- Choose Role --</option>
        <option value="Student">Student</option>
        <option value="Instructor">Instructor</option>
      </select>
      <button
        onClick={handleAssign}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Assign Role
      </button>
      {status && <p className="mt-4 text-sm">{status}</p>}
    </div>
  );
}

export default RoleSelectionPage;
