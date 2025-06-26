import Footer from "../components/Footer";
import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";

function WelcomePage() {
  const { getDecodedIDToken, state, signOut, httpRequest } = useAuthContext();
  const [profile, setProfile] = useState({});
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getDecodedIDToken();
        
        // First try to get roles from standard claims
        let roles = [];
        const possibleRoleClaims = [
          'roles',
          'role',
          'http://wso2.org/claims/role',
          'groups',
          'http://wso2.org/claims/groups'
        ];

        // Check all possible claim locations
        for (const claim of possibleRoleClaims) {
          if (token?.[claim]) {
            roles = Array.isArray(token[claim]) ? token[claim] : [token[claim]];
            break;
          }
        }

        // If no roles found, try SCIM2 API as fallback
        if (roles.length === 0) {
          try {
            const response = await httpRequest({
              url: `${import.meta.env.VITE_ASGARDEO_BASE_URL}/scim2/Me`,
              method: "GET",
              headers: {
                "Accept": "application/scim+json"
              }
            });
            roles = response.data.roles?.map(role => role.display || role.value) || [];
          } catch (apiError) {
            console.warn("SCIM2 API fallback failed:", apiError);
          }
        }

        // Normalize role names to lowercase for consistent comparison
        const normalizedRoles = roles.map(role => role.toLowerCase());

        setProfile({
          first_name: token?.given_name || "Not Set",
          last_name: token?.family_name || "Not Set",
          email: token?.email || "Not Set",
          contact: token?.["http://wso2.org/claims/mobile"] || "Not Set",
          bio: token?.["http://wso2.org/claims/organization"] || "Not Set"
        });
        setRoles(normalizedRoles);

      } catch (err) {
        console.error("Error fetching token:", err);
      } finally {
        setLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchUser();
    }
  }, [state.isAuthenticated]);

  // Role checks (using lowercase comparison)
  const isCustomer = roles.includes("customer");
  const isServiceProvider = roles.includes("serviceprovider");
  const isAdmin = roles.includes("admin");

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow p-10 bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-10 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
          <h2 className="text-3xl font-bold mb-6">
            Welcome, {profile.first_name}!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Your Profile</h3>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{profile.first_name} {profile.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{profile.contact}</p>
              </div>
            </div>

            {/* Roles */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Your Roles</h3>
              <div className="flex flex-wrap gap-2">
                {roles.length > 0 ? (
                  roles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No roles assigned</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">Bio</p>
                <p className="font-medium">{profile.bio}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {isCustomer && (
                <button className="bg-green-100 text-green-800 p-4 rounded-lg hover:bg-green-200 transition">
                  Browse Services
                </button>
              )}
              {isServiceProvider && (
                <button className="bg-purple-100 text-purple-800 p-4 rounded-lg hover:bg-purple-200 transition">
                  Manage Services
                </button>
              )}
              {isAdmin && (
                <button 
                  onClick={() => window.location.href = `${import.meta.env.VITE_ASGARDEO_BASE_URL}/admin`}
                  className="bg-red-100 text-red-800 p-4 rounded-lg hover:bg-red-200 transition"
                >
                  Admin Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default WelcomePage;