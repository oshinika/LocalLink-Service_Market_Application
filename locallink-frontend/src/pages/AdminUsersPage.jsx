
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

function AdminUserPage() {
  const { getDecodedIDToken, getAccessToken, state } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  function checkAdminRole(token) {
    if (!token) return false;
    const roles = token.roles || [];
    const groups = token.groups || [];
    const allRoles = [
      ...(Array.isArray(roles) ? roles : [roles]),
      ...(Array.isArray(groups) ? groups : [groups]),
    ].map((r) => r.toLowerCase());
    return allRoles.includes("admin");
  }

  useEffect(() => {
    async function fetchAndCheck() {
      if (!state.isAuthenticated) {
        setHasAdminAccess(false);
        setError("Please login");
        return;
      }

      try {
        const decodedToken = await getDecodedIDToken();
        const isAdmin = checkAdminRole(decodedToken);
        setHasAdminAccess(isAdmin);

        if (!isAdmin) {
          setError("Access denied - Admins only");
          return;
        }

        setLoadingUsers(true);
        const accessToken = await getAccessToken();

        const response = await fetch("http://localhost:5000/api/admin/asgardeo-users", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("API Error response:", text);
          throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUsers(false);
      }
    }

    fetchAndCheck();
  }, [state.isAuthenticated, getDecodedIDToken, getAccessToken]);

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Access denied - Admins only
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
          Admin - User Management
        </h1>

        {loadingUsers ? (
          <div className="text-center text-gray-600">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-600">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-sm text-left">
              <thead className="bg-blue-50 text-blue-800">
                <tr>
                  <th className="px-4 py-2 border">Username</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">First Name</th>
                  <th className="px-4 py-2 border">Last Name</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Roles</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-700">
                {users.map((user, index) => (
                  <tr
                    key={user.username || index}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 border">{user.username || "-"}</td>
                    <td className="px-4 py-2 border">{user.email || "-"}</td>
                    <td className="px-4 py-2 border">{user.firstName || "-"}</td>
                    <td className="px-4 py-2 border">{user.lastName || "-"}</td>
                    <td className="px-4 py-2 border">{user.phone || "-"}</td>
                    <td className="px-4 py-2 border">
                      {(user.roles && user.roles.length > 0)
                        ? user.roles.join(", ")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUserPage;
