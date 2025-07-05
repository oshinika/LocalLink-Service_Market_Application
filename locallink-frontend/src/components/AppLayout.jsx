








// import { useNavigate, Outlet, useLocation } from "react-router-dom";
// import { useAuthContext } from "@asgardeo/auth-react";
// import { useEffect, useState } from "react";
// import { 
//   FiChevronLeft, 
//   FiChevronRight,
//   FiHome,
//   FiSettings,
//   FiUser,
//   FiShield,
//   FiLogOut,
//   FiMenu,
//   FiBell,
//   FiSearch
// } from "react-icons/fi";

// const AppLayout = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { signOut, getDecodedIDToken, state } = useAuthContext();
//   const [roles, setRoles] = useState([]);
//   const [collapsed, setCollapsed] = useState(true);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   useEffect(() => {
//     const fetchRoles = async () => {
//       try {
//         const token = await getDecodedIDToken();
//         let roleClaims = [];

//         const possibleClaims = [
//           "roles",
//           "role",
//           "http://wso2.org/claims/role",
//           "groups",
//           "http://wso2.org/claims/groups",
//         ];

//         for (const claim of possibleClaims) {
//           if (token?.[claim]) {
//             roleClaims = Array.isArray(token[claim])
//               ? token[claim]
//               : [token[claim]];
//             break;
//           }
//         }

//         setRoles(roleClaims.map((r) => r.toLowerCase()));
//       } catch (err) {
//         console.error("Failed to load roles:", err);
//       }
//     };

//     if (state.isAuthenticated) fetchRoles();
//   }, [state.isAuthenticated, getDecodedIDToken]);

//   const isAdmin = roles.includes("admin");

//   const getHeaderTitle = () => {
//     if (location.pathname.includes("/services")) return "Services Management";
//     if (location.pathname.includes("/profile")) return "User Profile";
//     if (location.pathname.includes("/admin")) return "Admin Dashboard";
//     return "Overview Dashboard";
//   };

//   const handleNavigation = (path) => {
//     navigate(path);
//     setMobileOpen(false);
//   };

//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setMobileOpen(true)}
//         className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md text-gray-600"
//       >
//         <FiMenu size={20} />
//       </button>

//       {/* Compact Sidebar */}
//       <aside
//         className={`${collapsed ? "w-16" : "w-48"} ${
//           mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//         } fixed md:relative z-40 h-full bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-200 ease-in-out shadow-sm`}
//       >
//         <div>
//           {/* Sidebar Header */}
//           <div className={`flex ${collapsed ? "justify-center" : "justify-between items-center"} p-3 border-b border-gray-100`}>
//             {!collapsed && (
//               <div className="text-sm font-semibold text-blue-600 truncate">LocalLink</div>
//             )}
//             <button
//               onClick={() => setCollapsed(!collapsed)}
//               className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
//               aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//             >
//               {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
//             </button>
//           </div>

//           {/* Navigation Menu - Now using buttons */}
//           <nav className="flex flex-col p-2 gap-1 mt-2">
//             <button
//               onClick={() => handleNavigation("/home")}
//               className={`flex items-center gap-2 p-2 rounded-lg transition-all w-full text-left ${
//                 location.pathname.includes("/home") 
//                   ? "bg-blue-50 text-blue-600" 
//                   : "text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               <FiHome size={18} className="flex-shrink-0" />
//               {!collapsed && <span className="text-xs font-medium">Dashboard</span>}
//             </button>
            
//             <button
//               onClick={() => handleNavigation("/services")}
//               className={`flex items-center gap-2 p-2 rounded-lg transition-all w-full text-left ${
//                 location.pathname.includes("/services") 
//                   ? "bg-blue-50 text-blue-600" 
//                   : "text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               <FiSettings size={18} className="flex-shrink-0" />
//               {!collapsed && <span className="text-xs font-medium">Services</span>}
//             </button>
            
//             <button
//               onClick={() => handleNavigation("/profile")}
//               className={`flex items-center gap-2 p-2 rounded-lg transition-all w-full text-left ${
//                 location.pathname.includes("/profile") 
//                   ? "bg-blue-50 text-blue-600" 
//                   : "text-gray-600 hover:bg-gray-100"
//               }`}
//             >
//               <FiUser size={18} className="flex-shrink-0" />
//               {!collapsed && <span className="text-xs font-medium">Profile</span>}
//             </button>
            
//             {isAdmin && (
//               <button
//                 onClick={() => handleNavigation("/admin/users")}
//                 className={`flex items-center gap-2 p-2 rounded-lg transition-all w-full text-left ${
//                   location.pathname.includes("/admin") 
//                     ? "bg-blue-50 text-blue-600" 
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 <FiShield size={18} className="flex-shrink-0" />
//                 {!collapsed && <span className="text-xs font-medium">Admin</span>}
//               </button>
//             )}
//           </nav>
//         </div>

//         {/* Sidebar Footer */}
//         <div className="p-2 border-t border-gray-100">
//           <button
//             onClick={() => signOut()}
//             className={`flex items-center gap-2 w-full p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all`}
//           >
//             <FiLogOut size={18} className="flex-shrink-0" />
//             {!collapsed && <span className="text-xs font-medium">Sign Out</span>}
//           </button>
//           {!collapsed && (
//             <div className="text-[10px] text-gray-400 text-center mt-1 px-1">
//               {state.username || "User"} • v1.0.0
//             </div>
//           )}
//         </div>
//       </aside>

//       {/* Overlay for mobile */}
//       {mobileOpen && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* Main Content Area */}
//       <div className="flex flex-col flex-1 overflow-hidden md:ml-16 transition-all duration-200">
//         <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
//           <h1 className="text-lg font-semibold text-gray-800">{getHeaderTitle()}</h1>
//           <div className="flex items-center gap-3">
//             <button 
//               className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
//               aria-label="Notifications"
//             >
//               <FiBell size={18} />
//             </button>
//             <button 
//               className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
//               aria-label="Search"
//             >
//               <FiSearch size={18} />
//             </button>
//             <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
//               <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs">
//                 {state.username?.charAt(0).toUpperCase() || "U"}
//               </div>
//               <span className="text-xs font-medium text-gray-700">{state.username || "User"}</span>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">
//           <div className="max-w-7xl mx-auto">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//               <Outlet />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AppLayout;











import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";
import { 
  FiChevronLeft, 
  FiChevronRight,
  FiHome,
  FiSettings,
  FiUser,
  FiShield,
  FiLogOut,
  FiMenu,
  FiBell,
  FiSearch
} from "react-icons/fi";

const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, getDecodedIDToken, state } = useAuthContext();
  const [roles, setRoles] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    if (location.pathname.includes("/admin")) return "Admin";
    return "Overview Dashboard";
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md text-gray-600"
      >
        <FiMenu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-16" : "w-48"} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:relative z-40 h-full bg-white border-r border-gray-200 flex flex-col justify-between transition-all duration-200 ease-in-out shadow-sm`}
      >
        <div>
          {/* Sidebar Header */}
          <div className={`flex ${collapsed ? "justify-center" : "justify-between items-center"} p-3 border-b border-gray-100`}>
            {!collapsed && (
              <div className="text-sm font-semibold text-blue-600 truncate">LocalLink</div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col p-2 gap-1 mt-2">
            <button
              onClick={() => handleNavigation("/home")}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all w-full text-left ${
                location.pathname.includes("/home") 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiHome size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-xs font-medium">Dashboard</span>}
            </button>
            
            <button
              onClick={() => handleNavigation("/services")}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all w-full text-left ${
                location.pathname.includes("/services") 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiSettings size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-xs font-medium">Services</span>}
            </button>
            
            <button
              onClick={() => handleNavigation("/profile")}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all w-full text-left ${
                location.pathname.includes("/profile") 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiUser size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-xs font-medium">Profile</span>}
            </button>
            
            {isAdmin && (
              <button
                onClick={() => handleNavigation("/admin/users")}
                className={`flex items-center gap-2 p-2 rounded-lg transition-all w-full text-left ${
                  location.pathname.includes("/admin") 
                    ? "bg-blue-50 text-blue-600" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiShield size={18} className="flex-shrink-0" />
                {!collapsed && <span className="text-xs font-medium">Admin</span>}
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar Footer with Colorful Sign Out Button */}
        <div className="p-2 border-t border-gray-100">
          <button
            onClick={() => signOut()}
            className={`flex items-center justify-center gap-2 w-full p-2 rounded-lg transition-all ${
              collapsed ? "text-red-500 hover:bg-red-50" : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md"
            }`}
          >
            <FiLogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-xs font-medium">Sign Out</span>}
          </button>
          {!collapsed && (
            <div className="text-[10px] text-gray-400 text-center mt-1 px-1">
              {state.username || "User"} • v1.0.0
            </div>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden md:ml-16 transition-all duration-200">
        {/* Simplified Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/home" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
              <FiChevronRight className="text-gray-400" size={14} />
              <span className="font-medium text-gray-800">
                {getHeaderTitle()}
              </span>
              {location.pathname.includes("/admin") && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-2">
                  ADMIN
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full relative">
                <FiBell size={18} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 bg-gray-100 px-2.5 py-1 rounded-full">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-medium">
                  {state.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-xs font-medium text-gray-700 hidden md:inline">
                  {state.username || "User"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;