import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <h1 className="text-xl font-bold text-teal-700">All-Social Dashboard</h1>
      <button
        onClick={logout}
        className="py-1.5 px-4 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition"
      >
        Logout
      </button>
    </header>
  );
};

export default TopBar;
