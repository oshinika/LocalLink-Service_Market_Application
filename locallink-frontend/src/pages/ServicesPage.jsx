import { useEffect, useState } from "react";
import { useAuthContext } from "@asgardeo/auth-react";
import AddServiceForm from "../components/AddServiceForm";
import Footer from "../components/Footer";

function ServicesPage() {
  const { getDecodedIDToken, getAccessToken, state, httpRequest } = useAuthContext();

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
        });

        const possibleRoleClaims = ["roles", "groups"];
        let fetchedRoles = [];
        
        for (const claim of possibleRoleClaims) {
          if (token?.[claim]) {
            fetchedRoles = Array.isArray(token[claim]) ? token[claim] : [token[claim]];
            break;
          }
        }

        setRoles(fetchedRoles.map(r => r.toLowerCase()));
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
      
      if (photo && typeof photo !== 'string') {
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
      
      setServices(prev => id
        ? prev.map(s => s._id === id ? data : s)
        : [...prev, data]
      );

      setShowForm(false);
      setEditingService(null);
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    
    try {
      const accessToken = await getAccessToken();
      const response = await fetch(`http://localhost:5000/services/${id}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}` 
        },
        body: JSON.stringify({ provider_user_id: profile.email })
      });

      if (!response.ok) throw new Error("Failed to delete");
      
      setServices(prev => prev.filter(s => s._id !== id));
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {isServiceProvider && !showForm && (
        <div className="max-w-4xl mx-auto mb-6 text-right">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Service
          </button>
        </div>
      )}

      {showForm && (
        <AddServiceForm
          initialData={editingService}
          onCancel={() => {
            setShowForm(false);
            setEditingService(null);
          }}
          onSubmit={handleFormSubmit}
          onDelete={handleDeleteService}
        />
      )}

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          {isServiceProvider ? "Your Services" : "Services"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.filter(s => !isServiceProvider || s.provider_user_id === profile.email).map(service => (
            <div key={service._id} className="bg-white p-4 rounded shadow">
              {service.photo && (
                <img 
                  src={`http://localhost:5000${service.photo}`} 
                  alt={service.title}
                  className="w-full h-48 object-cover mb-3 rounded"
                />
              )}
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
              
              {isServiceProvider && service.provider_user_id === profile.email && (
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setShowForm(true);
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ServicesPage;