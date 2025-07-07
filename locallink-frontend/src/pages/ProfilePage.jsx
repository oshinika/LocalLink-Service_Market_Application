


import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";

function ProfilePage() {
  const { state, getAccessToken } = useAuthContext();
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_number: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = await getAccessToken();
        console.log("Raw Token:", accessToken);
        const res = await fetch("http://localhost:5000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const user = await res.json();

        const userProfile = {
          first_name: user.name?.givenName || "",
          last_name: user.name?.familyName || "",
          email: user.emails || "",
          contact_number: user.phoneNumbers?.[0]?.value || "",
        };

        setProfile(userProfile);
        setForm({
          givenName: userProfile.first_name,
          familyName: userProfile.last_name,
          contactNumber: userProfile.contact_number,
        });

        const roleData = user.roles || [];
        const displayRoles = roleData.map((r) => r.display?.toLowerCase() || r?.toLowerCase());
        setRoles(displayRoles);
      } catch (err) {
        console.error("❌ Failed to load profil:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (state.isAuthenticated) fetchProfile();
  }, [state.isAuthenticated]);

  const handleUpdate = async () => {
    try {
      const accessToken = await getAccessToken();

      const res = await fetch("http://localhost:5000/api/profile/update", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update");

      // Update UI
      setProfile({
        ...profile,
        first_name: form.givenName,
        last_name: form.familyName,
        contact_number: form.contactNumber,
      });

      alert("✅ Profile updated successfully");
      setEditing(false);
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const blueButtonClass = {
    backgroundColor: "#006400",
    color: "white",
    fontWeight: "600",
    padding: "8px 16px",
    borderRadius: "0.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    border: "none",
    cursor: "pointer",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">User Profile</h2>

        <div className="text-gray-700 mb-6">
          <span className="font-medium">Logged in as: </span>
          <span className="capitalize text-blue-600">{roles[0] || "User"}</span>
        </div>

        <hr className="mb-6 border-gray-200" />

        <div className="space-y-4 text-base">
          {/* First Name */}
          <div>
            <span className="font-medium inline-block w-36">First Name:</span>
            {editing ? (
              <input
                value={form.givenName}
                onChange={(e) => setForm({ ...form, givenName: e.target.value })}
                className="border px-2 py-1 rounded"
              />
            ) : (
              profile.first_name
            )}
          </div>

          {/* Last Name */}
          <div>
            <span className="font-medium inline-block w-36">Last Name:</span>
            {editing ? (
              <input
                value={form.familyName}
                onChange={(e) => setForm({ ...form, familyName: e.target.value })}
                className="border px-2 py-1 rounded"
              />
            ) : (
              profile.last_name
            )}
          </div>

          {/* Email (readonly) */}
          <div>
            <span className="font-medium inline-block w-36">Email:</span>
            {profile.email}
          </div>

          {/* Contact */}
          <div>
            <span className="font-medium inline-block w-36">Contact:</span>
            {editing ? (
              <input
                value={form.contactNumber}
                onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
                className="border px-2 py-1 rounded"
              />
            ) : (
              profile.contact_number
            )}
          </div>

          {/* Roles */}
          <div>
            <span className="font-medium inline-block w-36">Roles:</span>
            {roles.join(", ")}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-x-4">
          {editing ? (
            <>
              <button
                onClick={handleUpdate}
                style = {blueButtonClass}
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditing(false)}
                style = {blueButtonClass}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              style = {blueButtonClass}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;


