import { useNavigate } from "react-router-dom";
import { LogOut, Play } from "lucide-react";
import ScriptSeoTrigger from "./ScriptSeoTrigger";

const TopBar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="relative px-6 py-4 bg-white border-b shadow-sm overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(20,184,166,0.05)_0%,_transparent_50%)] pointer-events-none z-0" />

      {/* Center-aligned main content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Logo + Text */}
        <div className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-teal-500 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
            <div className="relative bg-gradient-to-br from-red-500 via-red-600 p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <h1 className="text-3xl font-black bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 bg-clip-text text-transparent tracking-tight">
              Youlytics
            </h1>
            <span className="text-lg font-semibold text-slate-600 tracking-wide">
              Studio
            </span>
          </div>
        </div>

        {/* ScriptSeoTrigger Button */}
        <div className="relative">
          <ScriptSeoTrigger />
        </div>
      </div>

      {/* Logout button absolutely placed at top-right */}
      <div className="absolute top-4 right-6 z-20">
        <button
          onClick={logout}
          className="group relative flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
          {/* Icon + Text */}
          <div className="relative flex items-center gap-2">
            <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
            <span>Logout</span>
          </div>
          {/* Shine */}
          <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
        </button>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-30 z-10" />
    </header>
  );
};

export default TopBar;
