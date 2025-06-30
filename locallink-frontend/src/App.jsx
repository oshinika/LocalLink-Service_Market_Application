// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuthContext } from "@asgardeo/auth-react";
// import WelcomePage from "./pages/WelcomePage";
// import ServicesPage from "./pages/ServicesPage";
// import ProfilePage from "./pages/ProfilePage";
// import LoginPage from "./pages/LoginPage";
// import AppLayout from "./components/AppLayout";

// function App() {
//   const { state } = useAuthContext();

//   return (
//     <Routes>
//       {!state.isAuthenticated ? (
//         // Unauthenticated routes
//         <>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         </>
//       ) : (
//         // Authenticated routes (wrapped in AppLayout)
//         <Route element={<AppLayout />}>
//           <Route path="/" element={<Navigate to="/home" replace />} />
//           <Route path="/home" element={<WelcomePage />} />
//           <Route path="/services" element={<ServicesPage />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="*" element={<Navigate to="/home" replace />} />
          
//         </Route>
        
//       )}
//     </Routes>
//   );
// }

// export default App;


import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";
import WelcomePage from "./pages/WelcomePage";
import ServicesPage from "./pages/ServicesPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import AppLayout from "./components/AppLayout";
import AdminUsersPage from "./pages/AdminUsersPage";
import EditProfile from "./pages/EditProfile";


function App() {
  const { state, getDecodedIDToken, httpRequest } = useAuthContext();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = await getDecodedIDToken();

        // Possible claim keys where roles might exist
        const possibleRoleClaims = [
          "roles",
          "role",
          "http://wso2.org/claims/role",
          "groups",
          "http://wso2.org/claims/groups"
        ];

        let foundRoles = [];

        // Try to find roles in token
        for (const claim of possibleRoleClaims) {
          if (token?.[claim]) {
            foundRoles = Array.isArray(token[claim])
              ? token[claim]
              : [token[claim]];
            break;
          }
        }

        // If not found, try SCIM2 fallback
        if (foundRoles.length === 0) {
          try {
            const response = await httpRequest({
              url: `${import.meta.env.VITE_ASGARDEO_BASE_URL}/scim2/Me`,
              method: "GET",
              headers: {
                Accept: "application/scim+json"
              }
            });
            foundRoles = response.data.roles?.map(
              (r) => r.display || r.value
            ) || [];
          } catch (err) {
            console.warn("SCIM2 API fallback failed:", err);
          }
        }

        setRoles(foundRoles.map((r) => r.toLowerCase()));
      } catch (err) {
        console.error("Failed to get roles:", err);
      }
    };

    if (state.isAuthenticated) {
      fetchRoles();
    }
  }, [state.isAuthenticated]);

  return (
    <Routes>
      {!state.isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<WelcomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          
          {/* Only Admins can access this route */}
          <Route
            path="/admin/users"
            element={
              roles.includes("admin") ? (
                <AdminUsersPage />
              ) : (
                <Navigate to="/home" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default App;
