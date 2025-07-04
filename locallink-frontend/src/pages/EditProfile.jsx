
// import { useAuthContext } from "@asgardeo/auth-react";
// import { useEffect, useState } from "react";

// function EditProfilePage() {
//   const { getAccessToken, getDecodedIDToken, state } = useAuthContext();
//   const [form, setForm] = useState({
//     givenName: "",
//     familyName: "",
//     contactNumber: "",
//   });
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = await getDecodedIDToken();
//       setForm({
//         givenName: token?.given_name || "",
//         familyName: token?.family_name || "",
//         contactNumber: token?.phone_number || "",
//       });
//     };

//     if (state.isAuthenticated) {
//       fetchProfile();
//     }
//   }, [state.isAuthenticated]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       const accessToken = await getAccessToken();

//       const res = await fetch("http://localhost:5000/api/profile/update", {
//         method: "PATCH",
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(form),
//       });

//       if (!res.ok) throw new Error("Profile update failed");

//       alert("✅ Profile updated successfully");
//     } catch (err) {
//       console.error("❌ Error updating profile:", err);
//       alert("Update failed. See console for details.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
//       <h2 className="text-2xl font-bold mb-4">Edit Your Profile</h2>
//       <form onSubmit={handleSubmit}>
//         {["givenName", "familyName"].map((field) => (
//           <div key={field} className="mb-4">
//             <label className="block mb-1 capitalize">{field}</label>
//             <input
//               type="text"
//               value={form[field]}
//               onChange={(e) => setForm({ ...form, [field]: e.target.value })}
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>
//         ))}
//         <button
//           type="submit"
//           disabled={saving}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           {saving ? "Saving..." : "Update Profile"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default EditProfilePage;



import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";

function EditProfilePage() {
  const { getAccessToken, getDecodedIDToken, state } = useAuthContext();
  const [form, setForm] = useState({
    givenName: "",
    familyName: "",
    contactNumber: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getDecodedIDToken();
      setForm({
        givenName: token?.given_name || "",
        familyName: token?.family_name || "",
        contactNumber: token?.phone_number || "",
      });
    };

    if (state.isAuthenticated) {
      fetchProfile();
    }
  }, [state.isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

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

      if (!res.ok) throw new Error("Profile update failed");

      alert("✅ Profile updated successfully");
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("Update failed. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        {["givenName", "familyName", "contactNumber"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type="text"
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              placeholder={field === "contactNumber" ? "+94712345678" : ""}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

export default EditProfilePage;

