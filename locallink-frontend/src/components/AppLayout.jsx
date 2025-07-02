


import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";
import { 
  FiChevronLeft, 
  FiChevronRight,
  FiHome,
  FiSettings,
  FiUser,
  FiShield,
  FiLogOut
} from "react-icons/fi";

const AppLayout = () => {
  const location = useLocation();
  const { signOut, getDecodedIDToken, state } = useAuthContext();

  const [roles, setRoles] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = await getDecodedIDToken();
        let roleClaims = [];

        const possibleClaims = [
          "roles",
          "role",
          "http://wso2.org/claims/role",
          "groups",
          "http://wso2.org/claims/groups",
        ];

        for (const claim of possibleClaims) {
          if (token?.[claim]) {
            roleClaims = Array.isArray(token[claim])
              ? token[claim]
              : [token[claim]];
            break;
          }
        }

        setRoles(roleClaims.map((r) => r.toLowerCase()));
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    };

    if (state.isAuthenticated) fetchRoles();
  }, [state.isAuthenticated, getDecodedIDToken]);

  const isAdmin = roles.includes("admin");

  const getHeaderTitle = () => {
    if (location.pathname.includes("/services")) return "Services";
    if (location.pathname.includes("/profile")) return "Profile";
    if (location.pathname.includes("/admin")) return "Admin Panel";
    return "Dashboard";
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      
      <aside
        className={`${
          collapsed ? "w-16" : "w-56"
        } bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-300 shadow-sm`}
      >
        <div>
          
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            {!collapsed && (
              <div className="text-lg font-semibold text-blue-600">LocalLink</div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
            >
              {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
            </button>
          </div>

          
          <nav className="flex flex-col p-2 gap-1">
            <Link 
              to="/home" 
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                location.pathname.includes("/home") ? "bg-blue-50 text-blue-600" : "text-gray-600"
              }`}
            >
              <FiHome size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm">Dashboard</span>}
            </Link>
            
            <Link 
              to="/services" 
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                location.pathname.includes("/services") ? "bg-blue-50 text-blue-600" : "text-gray-600"
              }`}
            >
              <FiSettings size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm">Services</span>}
            </Link>
            
            <Link 
              to="/profile" 
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                location.pathname.includes("/profile") ? "bg-blue-50 text-blue-600" : "text-gray-600"
              }`}
            >
              <FiUser size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm">Profile</span>}
            </Link>
            
            {isAdmin && (
              <Link 
                to="/admin/users" 
                className={`flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 ${
                  location.pathname.includes("/admin") ? "bg-blue-50 text-blue-600" : "text-gray-600"
                }`}
              >
                <FiShield size={18} className="flex-shrink-0" />
                {!collapsed && <span className="text-sm">Admin</span>}
              </Link>
            )}
          </nav>
        </div>

        
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => signOut()}
            className={`flex items-center gap-3 w-full p-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-red-600`}
          >
            <FiLogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm">Logout</span>}
          </button>
          {!collapsed && (
            <div className="text-xs text-gray-400 text-center mt-2">
              v1.0.0
            </div>
          )}
        </div>
      </aside>

      
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-800">{getHeaderTitle()}</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {state.username || "User"}
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;