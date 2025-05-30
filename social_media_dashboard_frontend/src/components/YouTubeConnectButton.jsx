import { useEffect, useState, useCallback } from "react";
import axios from "axios";

/**
 * Props
 * -----
 * onConnect : () => void
 *   Fired once when YouTube is successfully linked.
 */
const YouTubeConnectButton = ({ onConnect }) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected]   = useState(false);

  /* -------------------------------------------------------------------- */
  /* 1. Check initial connection status on mount                          */
  /* -------------------------------------------------------------------- */
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const me = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (me.data.user?.socialTokens?.youtube?.access_token) {
          setConnected(true);
        }
      } catch {
        /* ignore */
      }
    };
    checkStatus();
  }, []);

  /* -------------------------------------------------------------------- */
  /* 2. Main connect flow                                                 */
  /* -------------------------------------------------------------------- */
  const handleConnect = useCallback(async () => {
    setConnecting(true);
    try {
      // STEP 1: Backend returns Google URL
      const { data } = await axios.get(
        "http://localhost:5000/api/youtube/auth-url",
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const popup = window.open(
        data.url,
        "_blank",
        "width=500,height=650"
      );

      const poll = setInterval(async () => {
        if (!popup || popup.closed) {
          clearInterval(poll);
          setConnecting(false);
          return;
        }

        try {
          const url = new URL(popup.location.href);
          const code = url.searchParams.get("code");

          if (code) {
            popup.close();
            clearInterval(poll);

            // STEP 2: Exchange code → tokens
            await axios.post(
              "http://localhost:5000/api/youtube/callback",
              { code },
              { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            setConnected(true);
            onConnect?.();          // 🔔 notify parent
          }
        } catch {
          /* Cross-origin until redirect completes → ignore */
        }
      }, 700);
    } catch (err) {
      console.error("YouTube connect error:", err);
      alert("❌ Could not connect YouTube. Try again.");
    } finally {
      setConnecting(false);
    }
  }, [onConnect]);

  /* -------------------------------------------------------------------- */
  /* 3. Render                                                            */
  /* -------------------------------------------------------------------- */
  return (
    <div className="mt-6 text-center">
      <button
        onClick={handleConnect}
        disabled={connected || connecting}
        className={`px-6 py-3 font-semibold rounded-lg text-white transition
          ${connected ? "bg-green-600 cursor-default" : "bg-red-500 hover:bg-red-600"}
          ${connecting && "opacity-60 cursor-wait"}
        `}
      >
        {connected
          ? "✅ YouTube Connected"
          : connecting
          ? "Connecting…"
          : "Connect YouTube"}
      </button>
    </div>
  );
};

export default YouTubeConnectButton;
