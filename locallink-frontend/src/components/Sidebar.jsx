import { NavLink } from "react-router-dom";
import { useAuthContext } from "@asgardeo/auth-react";

export default function Sidebar() {
  const { signOut } = useAuthContext();

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">LocalLink</h2>
      <nav className="space-y-2">
        <NavLink 
          to="/home"
          className={({ isActive }) => 
            `block px-4 py-2 rounded-md ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/services"
          className={({ isActive }) => 
            `block px-4 py-2 rounded-md ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
          }
        >
          Services
        </NavLink>
        <NavLink 
          to="/profile"
          className={({ isActive }) => 
            `block px-4 py-2 rounded-md ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
          }
        >
          Profile
        </NavLink>
      </nav>
      <button
        onClick={() => signOut()}
        className="mt-8 w-full text-left px-4 py-2 rounded-md hover:bg-gray-700"
      >
        Logout
      </button>
    </div>
  );
}