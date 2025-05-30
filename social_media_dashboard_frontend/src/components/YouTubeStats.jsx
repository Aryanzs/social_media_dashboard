import { useEffect, useState, useCallback } from "react";
import axios from "axios";

// ――― helper to prettify large numbers ―――
const formatNumber = (n) =>
  Number(n).toLocaleString("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

/**
 * Props
 * -----
 * connected : boolean   – true once YouTube OAuth is done
 */
const YouTubeStats = ({ connected }) => {
  const [data, setData]     = useState(null);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState("");

  /* -------------------------------------------------------- */
  /* fetch analytics (memoised)                               */
  /* -------------------------------------------------------- */
  const fetchAnalytics = useCallback(async () => {
    if (!connected) return;
    setLoad(true);
    setError("");

    try {
      const { data } = await axios.get("http://localhost:5000/api/youtube/analytics", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setData(data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch YouTube analytics.");
    } finally {
      setLoad(false);
    }
  }, [connected]);

  /* fetch on mount & when `connected` flips true */
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  /* -------------------------------------------------------- */
  /* Render                                                   */
  /* -------------------------------------------------------- */
  if (!connected) return null;                  // 👈 never render before OAuth
  if (loading)   return <p className="mt-6 text-center text-gray-600">📡 Loading YouTube stats…</p>;

  if (error)
    return (
      <div className="mt-6 text-red-500 text-center border border-red-200 bg-red-50 p-4 rounded-lg">
        ❌ {error}
      </div>
    );

  if (!data)
    return (
      <p className="mt-6 text-center text-gray-500">
        Analytics not ready yet — please refresh.
      </p>
    );

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Channel"      value={data.channelTitle} solid />
        <StatCard title="Subscribers"  value={formatNumber(data.subscribers)} />
        <StatCard title="Total Views"  value={formatNumber(data.views)} />
        <StatCard title="Videos"       value={formatNumber(data.videoCount)} />
      </div>

      {/* optional manual refresh */}
      <div className="mt-4 text-center">
        <button
          onClick={fetchAnalytics}
          className="text-sm text-teal-600 hover:underline disabled:opacity-40"
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>
    </>
  );
};

const StatCard = ({ title, value, solid = false }) => (
  <div
    className={`rounded-lg p-6 text-center border transition ${
      solid ? "bg-teal-600 text-white" : "bg-white border-teal-100 hover:shadow-lg"
    }`}
  >
    <p className={`text-xs font-medium ${solid ? "text-teal-100/80" : "text-gray-500"} mb-1`}>
      {title}
    </p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default YouTubeStats;
