// src/components/YouTubeConnectButton.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";

/**
 * Props
 * -----
 * onConnect : () => void
 *   Fired exactly once when YouTube is linked successfully.
 */
const YouTubeConnectButton = ({ onConnect }) => {
  const [connecting, setConnecting] = useState(false);
  const [connected,  setConnected]  = useState(false);

  const notifiedRef   = useRef(false);   // prevents double-fire of onConnect
  const pollTimerRef  = useRef(null);    // holds setInterval id

  /* ───────────────────────────────────────────────
   * 1. On mount – detect if YouTube already linked
   * ─────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const isLinked = !!data.user?.socialTokens?.youtube?.access_token;
        if (isLinked) {
          setConnected(true);
          if (!notifiedRef.current) {
            notifiedRef.current = true;
            onConnect?.();
          }
        }
      } catch /* ignore */ {}
    })();

    return () => clearInterval(pollTimerRef.current); // cleanup on unmount
  }, [onConnect]);

  /* ───────────────────────────────────────────────
   * 2. Click handler – OAuth popup & polling
   * ─────────────────────────────────────────────── */
  const handleConnect = useCallback(async () => {
    setConnecting(true);

    try {
      // ➊ ask backend for Google OAuth URL
      const { data } = await axios.get("http://localhost:5000/api/youtube/auth-url", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // ➋ open popup – allow opener access (no noopener / noreferrer)
      const popup = window.open(
        data.url,
        "_blank",
        "width=520,height=650,noopener=false,noreferrer=false"
      );
      if (!popup) {
        alert("Please allow pop-ups to connect your YouTube account.");
        setConnecting(false);
        return;
      }

      // ➌ poll popup until it redirects back with ?code=
      pollTimerRef.current = setInterval(async () => {
        if (popup.closed) {
          clearInterval(pollTimerRef.current);
          setConnecting(false);
          return;
        }
        try {
          const popupUrl = new URL(popup.location.href);
          const code     = popupUrl.searchParams.get("code");
          if (code) {
            clearInterval(pollTimerRef.current);
            popup.close();

            // ➍ exchange code → tokens
            await axios.post(
              "http://localhost:5000/api/youtube/callback",
              { code },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            setConnected(true);
            if (!notifiedRef.current) {
              notifiedRef.current = true;
              onConnect?.();
            }
            setConnecting(false);
          }
        } catch {
          /* DOMException until popup returns to same origin – ignore */
        }
      }, 500);
    } catch (err) {
      console.error("YouTube connect error:", err);
      alert("❌ Could not start YouTube connect. Try again.");
      setConnecting(false);
    }
  }, [onConnect]);

  /* ───────────────────────────────────────────────
   * 3. Render
   * ─────────────────────────────────────────────── */
  return (
    <div className="mt-6 text-center">
      <button
        onClick={handleConnect}
        disabled={connecting || connected}
        className={`px-6 py-3 font-semibold rounded-lg text-white transition
          ${connected ? "bg-green-600 cursor-default"
                      : "bg-red-500 hover:bg-red-600"}
          ${connecting && "opacity-60 cursor-wait"}`}
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
