import AuthForm from "../components/AuthForm";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { Link } from "react-router-dom";

const LoginPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
    <h1 className="text-3xl font-bold text-teal-700 mb-8">Welcome Back</h1>
    <AuthForm type="login" />
    <GoogleLoginButton />
    <p className="mt-6 text-sm">
      No account?{" "}
      <Link to="/register" className="text-teal-600 hover:underline">
        Register
      </Link>
    </p>
  </div>
);

export default LoginPage;
