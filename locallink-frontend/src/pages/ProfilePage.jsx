import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";

function ProfilePage() {
  const { state, getDecodedIDToken } = useAuthContext();
  const [profile, setProfile] = useState({});
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getDecodedIDToken();

      setProfile({
        first_name: token?.given_name || "Not Available",
        last_name: token?.family_name || "Not Available",
        email: token?.email || "Not Available",
        nickname: token?.nickname || token?.username || "Not Available",
        contact_number: token?.["http://wso2.org/claims/mobile"] || "Not Available",
        profile_picture: token?.picture || "https://via.placeholder.com/150",
      });

      const possibleRoles = [
        "roles", "http://wso2.org/claims/role", "groups", "http://wso2.org/claims/groups"
      ];
      for (const claim of possibleRoles) {
        if (token?.[claim]) {
          const r = Array.isArray(token[claim]) ? token[claim] : [token[claim]];
          setRoles(r.map(role => role.toLowerCase()));
          break;
        }
      }

      setLoading(false);
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
        
        {/* Header */}
        <h2 className="text-3xl font-bold text-blue-800 mb-6">User Profile</h2>

        {/* Profile Image and Role */}
        <div className="flex items-center gap-6 mb-6">
          <img
            src={profile.profile_picture}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-blue-400 shadow-sm object-cover"
          />
          <div>
            <p className="text-lg text-gray-700">
              <span className="font-medium">Logged in as: </span>
              <span className="capitalize text-blue-600">{roles[0] || "User"}</span>
            </p>
          </div>
        </div>

        <hr className="mb-6 border-gray-200" />

        {/* Profile Info */}
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
            <span className="font-medium inline-block w-36">Nickname:</span>
            {profile.nickname}
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

        {/* Edit Profile */}
        <div className="mt-8 text-center">
          <a
            href="/edit-profile"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
          >
            Edit Your Profile
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
