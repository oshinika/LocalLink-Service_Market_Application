// import { Link, Outlet, useLocation } from "react-router-dom";

// const AppLayout = () => {
//   const location = useLocation();

//   // Map routes to header titles
//   const getHeaderTitle = () => {
//     if (location.pathname.includes("/services")) return "Services";
//     if (location.pathname.includes("/profile")) return "Profile";
//     return "Dashboard"; // default is Home
//   };

//   return (
//     <div className="flex h-screen w-screen overflow-hidden">
//       {/* Sidebar */}
//       <aside className="w-64 bg-blue-900 text-white flex flex-col justify-between">
//         <div>
//           <div className="text-center py-6 font-bold text-xl border-b border-blue-700">
//             LocalLink
//           </div>
//           <nav className="flex flex-col p-4 gap-4">
//             <Link to="/home" className="hover:text-blue-300">🏠 Home</Link>
//             <Link to="/services" className="hover:text-blue-300">🛠 Services</Link>
//             <Link to="/profile" className="hover:text-blue-300">👤 Profile</Link>
//           </nav>
//         </div>
//         <div className="p-4 text-center text-sm text-blue-400">
//           © 2025 LocalLink. All rights reserved.
//         </div>
//       </aside>

//       {/* Main area */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         {/* Dynamic Header */}
//         <header className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
//           <h1 className="text-lg font-bold">{getHeaderTitle()}</h1>
//         </header>

//         {/* Main content */}
//         <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AppLayout;



import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react"; // 👈 Import auth context

const AppLayout = () => {
  const location = useLocation();
  const { signOut } = useAuthContext(); // 👈 Get signOut method

  // Map routes to header titles
  const getHeaderTitle = () => {
    if (location.pathname.includes("/services")) return "Services";
    if (location.pathname.includes("/profile")) return "Profile";
    return "Dashboard"; // default is Home
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col justify-between">
        <div>
          <div className="text-center py-6 font-bold text-xl border-b border-blue-700">
            LocalLink
          </div>
          <nav className="flex flex-col p-4 gap-4">
            <Link to="/home" className="hover:text-blue-300">🏠 Home</Link>
            <Link to="/services" className="hover:text-blue-300">🛠 Services</Link>
            <Link to="/profile" className="hover:text-blue-300">👤 Profile</Link>
          </nav>
        </div>
        <div className="p-4 text-center text-sm text-blue-400">
          © 2025 LocalLink. All rights reserved.
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header with Logout */}
        <header className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <h1 className="text-lg font-bold">{getHeaderTitle()}</h1>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </header>

        {/* Main content */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
