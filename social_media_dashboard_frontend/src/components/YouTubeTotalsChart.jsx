// src/components/YouTubeTotalsChart.jsx
import { useState, useMemo } from "react";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import useYouTubeTotals from "../hooks/useYouTubeTotals";

const COLORS = ["#ff6b6b", "#4ecdc4", "#45b7d1"];
const GRADIENT_COLORS = [
  { from: "#ff6b6b", to: "#ff8e8e" },
  { from: "#4ecdc4", to: "#6dd5d0" },
  { from: "#45b7d1", to: "#67c3d7" }
];

const TYPES = [
  { key: "bar", label: "Bar Chart", icon: "📊" },
  { key: "pie", label: "Pie Chart", icon: "🥧" },
  { key: "radial", label: "Radial", icon: "⭕" },
];

/**
 * Props
 * -----
 * connected          : boolean – true after OAuth
 * onDisconnectYouTube: () => void – fires when token refresh fails
 */
export default function YouTubeTotalsChart({
  connected,
  onDisconnectYouTube,
}) {
  // 1) fetch totals via hook
  const { totals, loading, error } = useYouTubeTotals(connected, {
    onExpired: onDisconnectYouTube,
  });

  // 2) chart‐type state
  const [type, setType] = useState("bar");

  // 3) ALWAYS build data array (hook order preserved)
  const data = useMemo(() => {
    if (!totals) return [];
    const { views = 0, subscribers = 0, videoCount = 0 } = totals;
    return [
      { name: "Views", value: +views, shortName: "Views", color: COLORS[0] },
      { name: "Subscribers", value: +subscribers, shortName: "Subs", color: COLORS[1] },
      { name: "Videos", value: +videoCount, shortName: "Videos", color: COLORS[2] },
    ];
  }, [totals]);

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl border border-gray-700">
          <p className="font-semibold text-sm">{label || payload[0]?.payload?.name}</p>
          <p className="text-lg font-bold text-blue-300">
            {payload[0]?.value?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // 4) early‐exit guards
  if (!connected) return null;
  
  if (loading) {
    return (
      <div className="mt-8 p-8 h-96 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-lg border border-slate-200">
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-slate-300 rounded-lg w-48"></div>
            <div className="h-8 bg-slate-300 rounded-lg w-32"></div>
          </div>
          <div className="h-64 bg-slate-300 rounded-xl"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="mt-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <div>
            <h4 className="text-red-800 font-semibold">Error Loading Data</h4>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!totals || data.every((d) => d.value === 0)) return null;

  // 5) render chart
  return (
    <div className="mt-8 bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Decorative header background */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 h-2"></div>
      
      <div className="p-8">
        {/* Header with stats cards */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              📊 Channel Analytics
            </h3>
            <p className="text-slate-500 text-sm mt-1">Your YouTube channel at a glance</p>
          </div>
          
          {/* Chart type selector */}
          <div className="flex items-center space-x-2 bg-slate-100 rounded-xl p-2">
            {TYPES.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setType(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  type === key
                    ? "bg-white text-slate-800 shadow-md transform scale-105"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span>{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {data.map((item, index) => (
            <div
              key={item.name}
              className="bg-white rounded-xl p-4 shadow-md border border-slate-100 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{item.name}</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatNumber(item.value)}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart container */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
          <ResponsiveContainer width="100%" height={320}>
            {type === "bar" && (
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  {GRADIENT_COLORS.map((gradient, index) => (
                    <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={gradient.from} stopOpacity={0.8}/>
                      <stop offset="100%" stopColor={gradient.to} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                <XAxis 
                  dataKey="shortName" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatNumber}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {data.map((_, i) => (
                    <Cell key={i} fill={`url(#gradient${i})`} />
                  ))}
                </Bar>
              </BarChart>
            )}

            {type === "pie" && (
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  {GRADIENT_COLORS.map((gradient, index) => (
                    <linearGradient key={index} id={`pieGradient${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={gradient.from}/>
                      <stop offset="100%" stopColor={gradient.to}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                  }
                  labelLine={false}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={`url(#pieGradient${i})`} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
              </PieChart>
            )}

            {type === "radial" && (
              <RadialBarChart
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="20%"
                outerRadius="80%"
                startAngle={90}
                endAngle={-270}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  {GRADIENT_COLORS.map((gradient, index) => (
                    <linearGradient key={index} id={`radialGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={gradient.from}/>
                      <stop offset="100%" stopColor={gradient.to}/>
                    </linearGradient>
                  ))}
                </defs>
                <RadialBar 
                  dataKey="value" 
                  background={{ fill: '#f1f5f9' }}
                  clockWise
                  cornerRadius={10}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={`url(#radialGradient${i})`} />
                  ))}
                </RadialBar>
                <Legend
                  iconSize={12}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}