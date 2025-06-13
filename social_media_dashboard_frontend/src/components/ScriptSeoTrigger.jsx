import React from "react";
import { Sparkles, Zap, Bot } from "lucide-react"; // Modern AI-focused icons
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";

const ScriptSeoTrigger = () => {
  const handleOpenPopup = () => {
    const width = 550;
    const height = 620;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    window.open(
      "https://seemaz.app.n8n.cloud/form/b602f90d-37a6-477e-8dd4-ef4d5dc16562",
      "ytScriptSeoForm",
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return (
    <div className="flex justify-center">
      <motion.button
        onClick={handleOpenPopup}
        data-tooltip-id="yt-tooltip"
        data-tooltip-content="✨ Generate Script + SEO by AI"
        whileHover={{ 
          scale: 1.08,
          y: -2
        }}
        whileTap={{ scale: 0.95 }}
        className="group relative overflow-hidden px-6 py-3 rounded-2xl shadow-lg bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-600 text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-teal-500/25"
      >
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [-20, -40, -20],
              x: [0, 10, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1 left-2 w-1 h-1 bg-white/40 rounded-full"
          />
          <motion.div
            animate={{
              y: [-15, -35, -15],
              x: [0, -8, 0],
              rotate: [0, -180, -360]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute top-2 right-3 w-1.5 h-1.5 bg-white/30 rounded-full"
          />
        </div>

        {/* Button content */}
        <div className="relative flex items-center gap-3">
          {/* Main AI icon with subtle animation */}
          <motion.div
            whileHover={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6 }}
          >
            <Bot className="w-5 h-5" />
          </motion.div>

          {/* Sparkle icon with continuous animation */}
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="ml-1"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
        
        {/* Border highlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </motion.button>

      <Tooltip
        id="yt-tooltip"
        place="right-end"
        style={{ 
          backgroundColor: "#0f766e", 
          color: "white", 
          padding: "8px 16px", 
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 8px 32px rgba(15, 118, 110, 0.3)"
        }}
      />
    </div>
  );
};

export default ScriptSeoTrigger;