import { useEffect, useState } from "react";
import axios from "axios";
import TopBar from "../components/TopBar";
import YouTubeConnectButton from "../components/YouTubeConnectButton";
import YouTubeStats from "../components/YouTubeStats";
import YouTubeChart from "../components/YouTubeTotalsChart";   // 🆕 Chart component

const Dashboard = () => {
  const [user, setUser]               = useState(null);
  const [youtubeConnected, setYouCnx] = useState(false);
  const [showChart, setShowChart]     = useState(false);  // 🆕 toggle state

  /* ── fetch current user ── */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(({ data }) => {
        setUser(data.user);
        const isYT = !!data.user?.socialTokens?.youtube?.access_token;
        setYouCnx(isYT);
        if (!isYT) setShowChart(false);                   // hide chart if not connected
      })
      .catch(() => window.location.replace("/login"));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />

      <section className="p-8">
        {user ? (
          <>
            <h2 className="text-2xl font-semibold">
              Hello, <span className="text-teal-600">{user.name}</span> 👋
            </h2>

            {/* ── Connect YouTube ── */}
            <YouTubeConnectButton
              onConnect={() => {
                setYouCnx(true);
                setShowChart(true);      // auto-show chart right after connect
              }}
            />

            {/* ── Stats ── */}
            {youtubeConnected ? (
              <>
                <YouTubeStats connected={youtubeConnected} />

                {/* Chart toggle button */}
                <div className="text-center mt-6">
                  <button
                    onClick={() => setShowChart((v) => !v)}
                    className="px-4 py-2 text-sm rounded-md border border-teal-600 text-teal-600 hover:bg-teal-50 transition"
                  >
                    {showChart ? "Hide YouTube Chart" : "Show YouTube Chart"}
                  </button>
                </div>

                {/* Conditionally render chart */}
                {showChart && <YouTubeChart connected={youtubeConnected} />}
              </>
            ) : (
              <p className="mt-6 text-sm text-gray-500 text-center">
                Connect your YouTube account to view analytics.
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600 mt-10">Loading…</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
