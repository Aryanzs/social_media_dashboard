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
    <form
      onSubmit={handleSubmit}
      className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-md space-y-8 border border-teal-100"
    >
      {type === "register" && (
        <Field
          icon={UserIcon}
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          autoComplete="name"
        />
      )}

      <Field
        icon={MailIcon}
        label="Email"
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

      {error && (
        <p className="text-sm text-red-500 border border-red-200 rounded-lg p-2 bg-red-50">
          {error}
        </p>
      )}

      <button
        disabled={loading}
        className={`w-full py-3 text-lg font-semibold text-white rounded-xl transition
          bg-gradient-to-r from-teal-600 to-teal-500 hover:to-teal-600 focus:ring-4 focus:ring-teal-300
          active:scale-95 ${loading && "opacity-60 cursor-not-allowed"}`}
      >
        {loading ? "Please wait…" : type === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
};

export default AuthForm;

/* ——— sub-component to keep main file tidy ——— */
const Field = ({
  icon: Icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  autoComplete,
}) => (
  <div className="relative">
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required
      placeholder=" "
      className="peer input-modern"
    />
    <label
      htmlFor={name}
      className="label-modern peer-placeholder-shown:translate-y-3 peer-placeholder-shown:text-base
                 peer-focus:-translate-y-0 peer-focus:text-sm"
    >
      {label}
    </label>
    <Icon className="w-5 h-5 absolute left-3 top-3 text-gray-400 pointer-events-none" />
  </div>
);
