import { useAuthContext } from "@asgardeo/auth-react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const { signIn, state } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Login error:", error);
    }
  };
   
  if (state.isAuthenticated) {
    navigate("/");
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 p-4">
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md overflow-hidden">
        
        {/* Header with Branding */}
        <div className="bg-blue-800 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome to LocalLink</h1>
          <p className="text-blue-100 mt-2">Secure access to your account</p>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Simplified Arrow Icon */}
          <div className="flex justify-center mb-6">
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-500"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path 
                d="M12 8L16 12L12 16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <path 
                d="M8 12H16" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Login Button */}
          <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-blue font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
          <span>Continue</span>
  
          </button>
          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default LoginPage;