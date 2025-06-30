import { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiLoader, FiAlertCircle, FiShield } from "react-icons/fi";

export default function AdminUsersPage() {
  const { 
    getDecodedIDToken, 
    getAccessToken, 
    state, 
    httpRequest,
    getBasicUserInfo
  } = useAuthContext();
  
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current admin user info
  useEffect(() => {
    if (state.isAuthenticated) {
      getBasicUserInfo()
        .then((response) => {
          setCurrentUser(response);
        })
        .catch((error) => {
          console.error("Error fetching admin info:", error);
        });
    }
  }, [state.isAuthenticated]);

  // Extract roles from token
  const extractRoles = (token) => {
    if (!token) return [];
    
    return [
      ...(token.roles || []),
      ...(token.groups || []),
      ...(token['http://wso2.org/claims/role'] || []),
      ...(token['http://wso2.org/claims/roles'] || []),
      ...(token['http://wso2.org/claims/groups'] || [])
    ].flat();
  };

  const isAdmin = (roles) => {
    return roles.some(role => 
      String(role).toLowerCase() === "admin" ||
      String(role?.display || role?.value || role).toLowerCase() === "admin"
    );
  };

  // Fetch ALL users from SCIM endpoint
  const fetchAllUsers = async (accessToken) => {
    let allUsers = [];
    let startIndex = 1;
    const itemsPerPage = 100; // Max items per request
    
    while (true) {
      try {
        const response = await httpRequest({
          url: `${process.env.REACT_APP_ASGARDEO_BASE_URL}/scim2/Users`,
          method: "GET",
          headers: {
            "Accept": "application/scim+json",
            "Authorization": `Bearer ${accessToken}`
          },
          params: {
            attributes: "userName,name,givenName,familyName,emails,phoneNumbers,groups",
            startIndex: startIndex,
            count: itemsPerPage
          }
        });

        if (!response.data?.Resources || response.data.Resources.length === 0) {
          break;
        }

        allUsers = [...allUsers, ...response.data.Resources];
        
        // Check if we've fetched all users
        if (response.data.itemsPerPage + response.data.startIndex > response.data.totalResults) {
          break;
        }

        startIndex += itemsPerPage;
      } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
      }
    }

    return allUsers;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verify admin status
        const token = await getDecodedIDToken();
        const roles = extractRoles(token);
        
        if (!isAdmin(roles)) {
          navigate("/unauthorized");
          return;
        }

        // Fetch access token and then all users
        const accessToken = await getAccessToken();
        const userList = await fetchAllUsers(accessToken);

        setUsers(userList.map(user => ({
          id: user.id,
          email: user.userName,
          firstName: user.name?.givenName || "N/A",
          lastName: user.name?.familyName || "N/A",
          phone: user.phoneNumbers?.[0]?.value || "N/A",
          groups: user.groups?.map(g => g.display).join(", ") || "No groups",
          active: user.active !== false
        })));

      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (state.isAuthenticated) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [state.isAuthenticated, navigate]);

  // Loading and error states remain the same as previous example...

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <FiShield className="text-2xl text-blue-500 mr-3" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                User Management
              </h1>
              {currentUser && (
                <p className="text-sm text-gray-600">
                  Admin: {currentUser.username || currentUser.email}
                </p>
              )}
            </div>
          </div>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {users.length} {users.length === 1 ? 'User' : 'Users'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Groups
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.groups}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {loading ? 'Loading users...' : 'No users found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}