// src/components/YouTubeStats.jsx
import useYouTubeTotals from "../hooks/useYouTubeTotals";

/**
 * Props
 * -----
 * connected          : boolean  – true after successful OAuth
 * onDisconnectYouTube: () => {} – call when session expired (optional)
 */
const YouTubeStats = ({ connected, onDisconnectYouTube }) => {
  /* hook supplies data + loading + error */
  const { totals, loading, error, refresh } = useYouTubeTotals(connected, {
    onExpired: onDisconnectYouTube,
  });

  /* never render before OAuth */
  if (!connected) return null;

  /* loading state */
  if (loading) {
    return (
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded-lg border border-gray-100"
          />
        ))}
      </div>
    );
  }

  /* error state */
  if (error) {
    return (
      <div className="mt-6 text-red-500 text-center border border-red-200 bg-red-50 p-4 rounded-lg">
        ❌ {error}
      </div>
    );
  }

  /* still no data? nothing to show */
  if (!totals) return null;

  /* normal render */
  const pretty = (n) =>
    Number(n).toLocaleString("en", { notation: "compact", maximumFractionDigits: 1 });

  return (
    <>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Channel"     value={totals.channelTitle} solid />
        <StatCard title="Subscribers" value={pretty(totals.subscribers)} />
        <StatCard title="Total Views" value={pretty(totals.views)} />
        <StatCard title="Videos"      value={pretty(totals.videoCount)} />
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={refresh}
          disabled={loading}
          className="text-sm text-teal-600 hover:underline disabled:opacity-40"
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
      solid
        ? "bg-teal-600 text-white"
        : "bg-white border-teal-100 hover:shadow-lg"
    }`}
  >
    <p
      className={`text-xs font-medium mb-1 ${
        solid ? "text-teal-100/80" : "text-gray-500"
      }`}
    >
      {title}
    </p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default YouTubeStats;
