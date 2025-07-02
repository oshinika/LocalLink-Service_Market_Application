import React, { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";

function AdminUserPage() {
  const { getDecodedIDToken, getAccessToken, state } = useAuthContext();
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  // Check if roles or groups contain admin (case insensitive)
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

        // Use full backend URL here:
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin User Page</h1>

      {loadingUsers && <p>Loading users...</p>}

      {!loadingUsers && users.length === 0 && <p>No users found.</p>}

      {!loadingUsers && users.length > 0 && (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Username</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">First Name</th>
              <th className="border px-4 py-2">Last Name</th>
              <th className="border px-4 py-2">Roles</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Country</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id || user.userId || user.email}>
                <td className="border px-4 py-2">{user.id || user.userId || "-"}</td>
                <td className="border px-4 py-2">{user.username || "-"}</td>
                <td className="border px-4 py-2">{user.email || "-"}</td>
                <td className="border px-4 py-2">{user.firstName || "-"}</td>
                <td className="border px-4 py-2">{user.lastName || "-"}</td>
                <td className="border px-4 py-2">
                  {(user.roles && user.roles.length > 0)
                    ? user.roles.join(", ")
                    : "-"}
                </td>
                <td className="border px-4 py-2">{user.phone || "-"}</td>
                <td className="border px-4 py-2">{user.country || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminUserPage;
