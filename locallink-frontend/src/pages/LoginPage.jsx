







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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header with Service Professionals Image */}
        <div className="h-48 bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center flex items-end">
          <div className="w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
            <h1 className="text-3xl font-bold text-white">Welcome to LocalLink</h1>
            <p className="text-blue-200 mt-2">Find trusted local service professionals</p>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full -mt-16 shadow-lg border-4 border-white">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 text-blue-600" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Your Account</h2>
            <p className="text-gray-600">Connect with local professionals in your area</p>
          </div>

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                clipRule="evenodd" 
              />
            </svg>
            <span>Sign In Securely</span>
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Connecting communities with trusted professionals since 2023
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
