import { useState } from "react";
import { MailIcon, LockClosedIcon, UserIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = type === "login" ? "login" : "register";
      const { data } = await axios.post(
        `http://localhost:5000/api/auth/${endpoint}`,
        formData
      );
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Background decorative elements */}
      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 rounded-3xl blur opacity-20 animate-pulse"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 rounded-3xl opacity-15"></div>
      
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md space-y-6 border border-white/20 overflow-hidden"
      >
        {/* Header section */}
        <div className="text-center mb-10">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                {type === "login" ? (
                  <LockClosedIcon className="w-6 h-6 text-white" />
                ) : (
                  <UserIcon className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-teal-700 to-slate-600 bg-clip-text text-transparent">
            {type === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            {type === "login" 
              ? "Sign in to access your dashboard" 
              : "Join us and start your journey"
            }
          </p>
        </div>

        {/* Form fields */}
        <div className="space-y-6">
          {type === "register" && (
            <Field
              icon={UserIcon}
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          )}

          <Field
            icon={MailIcon}
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />

          <Field
            icon={LockClosedIcon}
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete={
              type === "login" ? "current-password" : "new-password"
            }
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="relative mt-6">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 to-pink-400/10 rounded-xl blur"></div>
            <div className="relative bg-red-50/70 backdrop-blur border border-red-200/40 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100/80 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit button */}
        <button
          disabled={loading}
          className={`relative w-full py-4 mt-8 text-lg font-semibold text-white rounded-2xl transition-all duration-300 group overflow-hidden
            ${loading 
              ? "opacity-70 cursor-not-allowed" 
              : "hover:shadow-2xl hover:-translate-y-1 active:scale-98"
            }`}
        >
          {/* Button background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 transition-all duration-300 group-hover:from-teal-700 group-hover:via-blue-700 group-hover:to-indigo-700"></div>
          
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          
          {/* Button content */}
          <div className="relative flex items-center justify-center space-x-2">
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>
              {loading 
                ? "Processing..." 
                : type === "login" 
                  ? "Sign In" 
                  : "Create Account"
              }
            </span>
            {!loading && (
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </div>
        </button>

        {/* Footer text */}
        <div className="text-center pt-6">
          <p className="text-slate-500 text-sm">
            {type === "login" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-200 hover:underline"
              onClick={() => navigate(type === "login" ? "/register" : "/login")}
            >
              {type === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/8 to-blue-400/8 rounded-full blur-2xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/8 to-teal-400/8 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
      </form>
    </div>
  );
};

export default AuthForm;

/* ——— Enhanced Field sub-component ——— */
const Field = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  autoComplete,
}) => (
  <div className="relative group">
    {/* Input field */}
    <div className="relative">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
        className="w-full pl-14 pr-4 py-4 bg-slate-50/60 backdrop-blur border border-slate-200/60 rounded-2xl
                   focus:outline-none focus:ring-3 focus:ring-teal-400/30 focus:border-teal-400
                   transition-all duration-300 text-slate-800 placeholder-transparent
                   group-hover:bg-slate-50/80 group-hover:border-slate-300/60"
        placeholder={label}
      />
      
      {/* Floating label */}
      <label
        htmlFor={name}
        className={`absolute left-14 transition-all duration-300 pointer-events-none select-none
          ${value 
            ? "top-2 text-xs text-teal-600 font-medium transform -translate-y-0" 
            : "top-4 text-slate-500 text-base"
          }`}
      >
        {label}
      </label>
      
      {/* Icon container */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <div className="w-8 h-8 bg-gradient-to-br from-teal-100/80 to-blue-100/80 rounded-xl flex items-center justify-center">
          <Icon className="w-4 h-4 text-teal-600" />
        </div>
      </div>
      
      {/* Focus ring effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/0 via-blue-500/0 to-indigo-500/0 
                      group-focus-within:from-teal-500/5 group-focus-within:via-blue-500/5 group-focus-within:to-indigo-500/5 
                      transition-all duration-300 -z-10 blur-sm"></div>
    </div>
  </div>
);