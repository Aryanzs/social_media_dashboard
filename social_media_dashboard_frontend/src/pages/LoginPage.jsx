import AuthForm from "../components/AuthForm";
import GoogleLoginButton from "../components/GoogleLoginButton";
import { Link } from "react-router-dom";

const LoginPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center ">
    {/* Main Container Card */}
    <div className="w-full max-w-md  p-8 space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      {/* Auth Form */}
      <div className="space-y-6">
        <AuthForm type="login" />
        
        {/* Divider */}
        <div className="relative flex items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 px-4 text-sm text-gray-500 bg-white rounded-full">
            or continue with
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        
        {/* Google Login */}
        <GoogleLoginButton />
      </div>
    </div>

    {/* Register Link */}
    <div className=" text-center">
      <p className="text-gray-600">
        Don't have an account?{" "}
        <Link 
          to="/register" 
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline decoration-2 underline-offset-2"
        >
          Create one now
        </Link>
      </p>
    </div>
  </div>
);

export default LoginPage;
