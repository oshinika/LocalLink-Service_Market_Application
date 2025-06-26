import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
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

      const extractedProfile = {
        email: token?.email || "Not Available",
        first_name: token?.given_name || "Not Available",
        last_name: token?.family_name || "Not Available",
        contact_number: token?.["http://wso2.org/claims/mobile"] || "Not Available",
        bio: token?.["http://wso2.org/claims/organization"] || "Not Available",
        profile_picture: token?.picture || "/default-profile.png", // fallback image
      };

      const possibleRoles = [
        "roles", "role", "groups", "http://wso2.org/claims/role", "http://wso2.org/claims/groups",
      ];

      let userRoles = [];
      for (const claim of possibleRoles) {
        if (token?.[claim]) {
          userRoles = Array.isArray(token[claim]) ? token[claim] : [token[claim]];
          break;
        }
      }

      setProfile(extractedProfile);
      setRoles(userRoles.map((r) => r.toLowerCase()));
      setLoading(false);
    };

    if (state.isAuthenticated) {
      fetchProfile();
    }
  }, [state.isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
     

      <main className="flex-grow p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-10 space-y-8">
          {/* Header Section */}
          <div className="flex items-center gap-6">
            <img
              src={profile.profile_picture}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-blue-100 shadow"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Contact Number</p>
              <p className="text-lg text-gray-800">{profile.contact_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bio / Organization</p>
              <p className="text-lg text-gray-800">{profile.bio}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Assigned Roles</p>
              {roles.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {roles.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm italic">No roles assigned</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
