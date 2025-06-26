

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Welcome to LocalLink</h2>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Login with Asgardeo
        </button>

        <p className="mt-4 text-gray-600 text-sm">
          Don't have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => navigate("/register")}
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;


