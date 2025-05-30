import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";

const RegisterPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
    <h1 className="text-3xl font-bold text-teal-700 mb-8">Create Account</h1>
    <AuthForm type="register" />
    <p className="mt-6 text-sm">
      Already have an account?{" "}
      <Link to="/login" className="text-teal-600 hover:underline">
        Login
      </Link>
    </p>
  </div>
);

export default RegisterPage;
