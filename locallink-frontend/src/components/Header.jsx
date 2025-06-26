import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Header({ profile, roles }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-green-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">LocalLink</h1>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="focus:outline-none"
          aria-label="Toggle Profile Menu"
        >
          <FaUserCircle size={28} />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded shadow-lg z-10 p-4 text-sm">
            <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role(s):</strong> {roles.length ? roles.join(", ") : "Not Set"}</p>
            <p><strong>Contact:</strong> {profile.contact_number || "Not Set"}</p>
            <p><strong>Bio:</strong> {profile.bio || "Not Set"}</p>

            <button
              onClick={() => navigate("/edit-profile")}
              className="mt-3 w-full bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
