import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

const GoogleLoginButton = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const signIn = async () => {
    setErr("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const { data } = await axios.post("http://localhost:5000/api/auth/google-login", { idToken });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (e) {
      setErr("Google login failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="space-y-4">
    <button
      onClick={signIn}
      disabled={loading}
      className={`group relative flex items-center justify-center w-full py-4 px-6 rounded-2xl border-2 transition-all duration-300 transform font-semibold text-lg shadow-lg hover:shadow-xl ${
        loading 
          ? "bg-gray-100 border-gray-300 cursor-not-allowed" 
          : "bg-white border-gray-200 hover:border-blue-300 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 active:translate-y-0"
      }`}
    >
      {/* Google Icon */}
      <div className={`absolute left-6 transition-all duration-300 ${loading ? "opacity-50" : "opacity-100"}`}>
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute left-6">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Button Text */}
      <span className={`ml-8 transition-all duration-300 ${
        loading 
          ? "text-gray-500" 
          : "text-gray-700 group-hover:text-blue-700"
      }`}>
        {loading ? "Signing you in..." : "Continue with Google"}
      </span>

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300"></div>
    </button>

    {/* Enhanced Error Display */}
    {err && (
      <div className="flex items-center justify-center p-3 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium text-red-700">{err}</p>
        </div>
      </div>
    )}
  </div>
);
};

export default GoogleLoginButton;
