



// src/services/roleService.js
export const assignRole = async (role, accessToken) => {
  const res = await fetch("http://localhost:5000/api/roles/assign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Failed to assign role");
  }

  return res.json();
};
