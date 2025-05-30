import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import TopBar               from "../components/TopBar";
import YouTubeConnectButton from "../components/YouTubeConnectButton";
import YouTubeStats         from "../components/YouTubeStats";
import YouTubeTotalsChart   from "../components/YouTubeTotalsChart";

const Dashboard = () => {
  const [user,       setUser]       = useState(null);
  const [connected,  setConnected]  = useState(false);
  const [showChart,  setShowChart]  = useState(false);
  const [loading,    setLoading]    = useState(true);

  /* ── load current user on mount ── */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(data.user);
        const isYT = !!data.user.socialTokens?.youtube?.access_token;
        setConnected(isYT);
        setShowChart(isYT);          // auto-open chart if already linked
      } catch {
        window.location.replace("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── callbacks to bubble down into children ── */
  const handleConnect    = () => { setConnected(true);  setShowChart(true);  };
  const handleDisconnect = useCallback(() => {
    setConnected(false);
    setShowChart(false);
  }, []);

  /* ── global spinner ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />

      <main className="p-8 space-y-8">
        {/* ── Greeting + connect button ── */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Hello, <span className="text-teal-600">{user.name}</span> 👋
          </h1>
          <YouTubeConnectButton onConnect={handleConnect} />
        </header>

        {connected ? (
          <>
            {/* ── Stats ── */}
            <section className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-700 mb-4">YouTube Overview</h2>
              <YouTubeStats
                connected={connected}
                onDisconnectYouTube={handleDisconnect}   /* expires → reset */
              />
            </section>

            {/* ── Totals chart ── */}
            <section className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-700">Totals Chart</h2>
                <button
                  onClick={() => setShowChart((v) => !v)}
                  className="text-sm text-teal-600 hover:underline"
                >
                  {showChart ? "Hide Chart" : "Show Chart"}
                </button>
              </div>

              {showChart ? (
                <YouTubeTotalsChart connected={connected} />
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-400">
                  Click “Show Chart” to view analytics
                </div>
              )}
            </section>
          </>
        ) : (
          /* ── prompt to connect ── */
          <section className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
            Connect your YouTube account to start seeing analytics here.
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
