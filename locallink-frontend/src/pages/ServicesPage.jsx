// import { useEffect, useState } from "react";
// import { useAuthContext } from "@asgardeo/auth-react";
// import AddServiceForm from "../components/AddServiceForm";
// import Footer from "../components/Footer";

// function ServicesPage() {
//   const { getDecodedIDToken, getAccessToken, state } = useAuthContext();

//   const [profile, setProfile] = useState({});
//   const [roles, setRoles] = useState([]);
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingService, setEditingService] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const token = await getDecodedIDToken();
//         setProfile({
//           email: token?.email || token?.username || "Not Set",
//           username: token?.username || token?.email?.split("@")[0] || "Provider",
//         });

//         const possibleRoleClaims = ["roles", "groups"];
//         let fetchedRoles = [];

//         for (const claim of possibleRoleClaims) {
//           if (token?.[claim]) {
//             fetchedRoles = Array.isArray(token[claim]) ? token[claim] : [token[claim]];
//             break;
//           }
//         }

//         setRoles(fetchedRoles.map((r) => r.toLowerCase()));
//       } catch (err) {
//         console.error("Error fetching user:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (state.isAuthenticated) fetchUser();
//   }, [state.isAuthenticated, getDecodedIDToken]);

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const accessToken = await getAccessToken();
//         const response = await fetch("http://localhost:5000/services", {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });
//         const data = await response.json();
//         setServices(data);
//       } catch (err) {
//         console.error("Error fetching services:", err);
//       }
//     };

//     if (state.isAuthenticated) fetchServices();
//   }, [state.isAuthenticated, getAccessToken]);

//   const isServiceProvider = roles.includes("serviceprovider");

//   const handleFormSubmit = async ({ id, title, description, photo }) => {
//     try {
//       const accessToken = await getAccessToken();
//       const formData = new FormData();

//       formData.append("title", title);
//       formData.append("description", description);
//       formData.append("provider_user_id", profile.email);
//       formData.append("provider_username", profile.username);

//       if (photo && typeof photo !== "string") {
//         formData.append("photo", photo);
//       }

//       const url = id
//         ? `http://localhost:5000/services/${id}`
//         : "http://localhost:5000/services";

//       const response = await fetch(url, {
//         method: id ? "PUT" : "POST",
//         headers: { Authorization: `Bearer ${accessToken}` },
//         body: formData,
//       });

//       if (!response.ok) throw new Error("Failed to save service");

//       const data = await response.json();

//       setServices((prev) =>
//         id ? prev.map((s) => (s._id === id ? data : s)) : [...prev, data]
//       );

//       setShowForm(false);
//       setEditingService(null);
//     } catch (err) {
//       console.error("Error:", err);
//       alert(err.message);
//     }
//   };

//   const handleDeleteService = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this service?")) return;

//     try {
//       const accessToken = await getAccessToken();
//       const response = await fetch(`http://localhost:5000/services/${id}`, {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify({ provider_user_id: profile.email }),
//       });

//       if (!response.ok) throw new Error("Failed to delete service");

//       setServices((prev) => prev.filter((s) => s._id !== id));
//       if (editingService?._id === id) {
//         setShowForm(false);
//         setEditingService(null);
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert(err.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col min-h-screen">
//         <main className="flex-grow container mx-auto px-4 py-8">
//           <p>Loading...</p>
//         </main>
//         <Footer />
//       </div>
//     );
//   }

//   const blueButtonClass =
//     "bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow";

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <main className="flex-grow container mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800">
//             {isServiceProvider ? "Your Services" : "Available Services"}
//           </h1>

//           {isServiceProvider && !showForm && (
//             <button
//               onClick={() => setShowForm(true)}
//               className={blueButtonClass}
//             >
//               Add Service
//             </button>
//           )}
//         </div>

//         {showForm && (
//           <div className="mb-8 bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
//             <AddServiceForm
//               initialData={editingService}
//               onCancel={() => {
//                 setShowForm(false);
//                 setEditingService(null);
//               }}
//               onSubmit={handleFormSubmit}
//               onDelete={handleDeleteService}
//             />
//           </div>
//         )}

//         {services.length === 0 ? (
//           <div className="text-center py-12">
//             <h3 className="mt-4 text-lg font-medium text-gray-900">No services found</h3>
//             <p className="mt-1 text-gray-500">
//               {isServiceProvider
//                 ? "You haven't added any services yet."
//                 : "There are no services available at the moment."}
//             </p>
//             {isServiceProvider && (
//               <button
//                 onClick={() => setShowForm(true)}
//                 className={`mt-6 ${blueButtonClass}`}
//               >
//                 Add Your First Service
//               </button>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {services.map((service) => (
//               <div
//                 key={service._id}
//                 className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
//               >
//                 <div className="relative h-48 overflow-hidden">
//                   {service.photo ? (
//                     <img
//                       src={`http://localhost:5000${service.photo}`}
//                       alt={service.title}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                       <span className="text-gray-400">No Image</span>
//                     </div>
//                   )}
//                 </div>
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                     {service.title}
//                   </h3>
//                   <p className="text-gray-600 mb-4">{service.description}</p>
//                   <div className="text-sm text-gray-700 mb-4">
//                     Provider:{" "}
//                     {service.provider_username ||
//                       service.provider_user_id?.split("@")[0] ||
//                       "Unknown"}
//                   </div>

//                   {isServiceProvider &&
//                     service.provider_user_id === profile.email && (
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => {
//                             setEditingService(service);
//                             setShowForm(true);
//                           }}
//                           className={blueButtonClass}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteService(service._id)}
//                           className={blueButtonClass}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default ServicesPage;


import { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import AddServiceForm from "../components/AddServiceForm";
import Footer from "../components/Footer";

function ServicesPage() {
  const { getDecodedIDToken, getAccessToken, state } = useAuthContext();

  const [profile, setProfile] = useState({});
  const [roles, setRoles] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getDecodedIDToken();
        setProfile({
          email: token?.email || token?.username || "Not Set",
          username: token?.username || token?.email?.split("@")[0] || "Provider",
        });

        const possibleRoleClaims = ["roles", "groups"];
        let fetchedRoles = [];

        for (const claim of possibleRoleClaims) {
          if (token?.[claim]) {
            fetchedRoles = Array.isArray(token[claim]) ? token[claim] : [token[claim]];
            break;
          }
        }

        setRoles(fetchedRoles.map((r) => r.toLowerCase()));
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (state.isAuthenticated) fetchUser();
  }, [state.isAuthenticated, getDecodedIDToken]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch("http://localhost:5000/services", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    if (state.isAuthenticated) fetchServices();
  }, [state.isAuthenticated, getAccessToken]);

  const isServiceProvider = roles.includes("serviceprovider");

  const handleFormSubmit = async ({ id, title, description, photo }) => {
    try {
      const accessToken = await getAccessToken();
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("provider_user_id", profile.email);
      formData.append("provider_username", profile.username);

      if (photo && typeof photo !== "string") {
        formData.append("photo", photo);
      }

      const url = id
        ? `http://localhost:5000/services/${id}`
        : "http://localhost:5000/services";

      const response = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save service");

      const data = await response.json();

      setServices((prev) =>
        id ? prev.map((s) => (s._id === id ? data : s)) : [...prev, data]
      );

      setShowForm(false);
      setEditingService(null);
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const accessToken = await getAccessToken();
      const response = await fetch(`http://localhost:5000/services/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ provider_user_id: profile.email }),
      });

      if (!response.ok) throw new Error("Failed to delete service");

      setServices((prev) => prev.filter((s) => s._id !== id));
      if (editingService?._id === id) {
        setShowForm(false);
        setEditingService(null);
      }
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto px-4 py-8">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const blueButtonClass = {
  backgroundColor: "#1D4ED8", // Tailwind blue-600
  color: "white",
  fontWeight: "600",
  padding: "8px 16px",
  borderRadius: "0.5rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  border: "none",
  cursor: "pointer",
};



  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {isServiceProvider ? "Your Services" : "Available Services"}
          </h1>

          {isServiceProvider && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              style={blueButtonClass}
            >
              Add Service
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
            <AddServiceForm
              initialData={editingService}
              onCancel={() => {
                setShowForm(false);
                setEditingService(null);
              }}
              onSubmit={handleFormSubmit}
              onDelete={handleDeleteService}
            />
          </div>
        )}

        {services.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-4 text-lg font-medium text-gray-900">No services found</h3>
            <p className="mt-1 text-gray-500">
              {isServiceProvider
                ? "You haven't added any services yet."
                : "There are no services available at the moment."}
            </p>
            {isServiceProvider && (
              <button
                onClick={() => setShowForm(true)}
                className={`mt-6 ${blueButtonClass}`}
              >
                Add Your First Service
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  {service.photo ? (
                    <img
                      src={`http://localhost:5000${service.photo}`}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="text-sm text-gray-700 mb-4">
                    Provider:{" "}
                    {service.provider_username ||
                      service.provider_user_id?.split("@")[0] ||
                      "Unknown"}
                  </div>

                  {isServiceProvider &&
                    service.provider_user_id === profile.email && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setShowForm(true);
                          }}
                          style={blueButtonClass}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteService(service._id)}
                          style={blueButtonClass}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default ServicesPage;
