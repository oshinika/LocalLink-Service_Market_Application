import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";

function EditProfile() {
  const { httpRequest } = useAuthContext();

  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await httpRequest({
          url: `${import.meta.env.VITE_ASGARDEO_BASE_URL}/scim2/Me`,
          method: "GET",
          headers: {
            Accept: "application/scim+json",
          },
        });

        setUser({
          firstName: res.data.name?.givenName || "",
          lastName: res.data.name?.familyName || "",
          phone: res.data.phoneNumbers?.[0]?.value || "",
        });
        setUserId(res.data.id);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await httpRequest({
        url: `${import.meta.env.VITE_ASGARDEO_BASE_URL}/scim2/Users/${userId}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/scim+json",
        },
        data: {
          Operations: [
            {
              op: "replace",
              value: {
                name: {
                  givenName: user.firstName,
                  familyName: user.lastName,
                },
                phoneNumbers: [
                  {
                    type: "mobile",
                    value: user.phone,
                  },
                ],
              },
            },
          ],
          schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed.");
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">First Name</label>
          <input
            type="text"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Last Name</label>
          <input
            type="text"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600">Phone</label>
          <input
            type="text"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
