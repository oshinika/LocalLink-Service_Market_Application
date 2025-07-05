




import { useAuthContext } from "@asgardeo/auth-react";
import { useState } from "react";
import { assignRole } from "./services/roleService"; // ✅ Update path if needed

function SelectRolePage() {
  const { getAccessToken, signOut } = useAuthContext();
  const [selectedRole, setSelectedRole] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRoleSelect = async () => {
    if (!selectedRole) return alert("Please select a role!");

    try {
      setSubmitting(true);

      const accessToken = await getAccessToken();
      await assignRole(selectedRole, accessToken);

      alert("✅ Role assigned successfully. Please log in again to continue.");
      
      // 🔁 Force logout → will redirect to login page
      await signOut();

    } catch (err) {
      console.error("❌ Failed to assign role:", err);
      alert("Failed to assign role. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Select Your Role</h2>
        <div className="space-y-4">
          <label className="block">
            <input
              type="radio"
              value="customer"
              checked={selectedRole === "customer"}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mr-2"
            />
            Customer
          </label>
          <label className="block">
            <input
              type="radio"
              value="serviceprovider"
              checked={selectedRole === "serviceprovider"}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mr-2"
            />
            Service Provider
          </label>
        </div>
        <button
          onClick={handleRoleSelect}
          disabled={submitting}
          className="mt-6 w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-600"
        >
          {submitting ? "Submitting..." : "Assign Role & Continue"}
        </button>
      </div>
    </div>
  );
}

export default SelectRolePage;
