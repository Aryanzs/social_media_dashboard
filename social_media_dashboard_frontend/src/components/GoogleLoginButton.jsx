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
    <div className="space-y-2">
      <button
        onClick={signIn}
        disabled={loading}
        className={`flex items-center justify-center w-full py-2 font-medium rounded-md transition
          ${loading ? "bg-red-300" : "bg-red-500 hover:bg-red-600"} text-white`}
      >
        {loading ? "Signing in..." : "Continue with Google"}
      </button>
      {err && <p className="text-xs text-red-500 text-center">{err}</p>}
    </div>
  );
};

export default GoogleLoginButton;
