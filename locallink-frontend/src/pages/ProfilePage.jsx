


import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";

function ProfilePage() {
  const { state, getAccessToken } = useAuthContext();
  const [profile, setProfile] = useState({});
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const accessToken = await getAccessToken();
        console.log("Access Token:", accessToken);

        const res = await fetch("http://localhost:5000/api/profile/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const user = await res.json();

        setProfile({
          first_name: user.name?.givenName || "Not Available",
          last_name: user.name?.familyName || "Not Available",
          email: user.emails || "Not Available",

          
          contact_number:
            user.phoneNumbers?.[0]?.value || "Not Available",
          profile_picture: "https://via.placeholder.com/150",
        });

        const roleData = user.roles || [];
        const displayRoles = roleData.map(r =>
          r.display?.toLowerCase() || r?.toLowerCase()
        );
        setRoles(displayRoles);

      } catch (err) {
        console.error("❌ Failed to load profile:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchProfile();
    }
  }, [state.isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">User Profile</h2>

        <div className="flex items-center gap-6 mb-6">
          <div>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Logged in as: </span>
              <span className="capitalize text-blue-600">
                {roles[0] || "User"}
              </span>
            </p>
          </div>
        </div>

        <hr className="mb-6 border-gray-200" />

        <div className="space-y-4 text-gray-800 text-base">
          <div>
            <span className="font-medium inline-block w-36">First Name:</span>
            {profile.first_name}
          </div>
          <div>
            <span className="font-medium inline-block w-36">Last Name:</span>
            {profile.last_name}
          </div>
          <div>
            <span className="font-medium inline-block w-36">Email:</span>
            {profile.email}
          </div>
          
          <div>
            <span className="font-medium inline-block w-36">Contact:</span>
            {profile.contact_number}
          </div>
          <div>
            <span className="font-medium inline-block w-36">Roles:</span>
            {roles.join(", ")}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/edit-profile"
            className="inline-block bg-blue-800 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Edit Your Profile
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;


