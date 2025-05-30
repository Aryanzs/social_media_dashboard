import { useState, useMemo } from "react";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#14b8a6", "#6366f1", "#f97316"];
const TYPES  = [
  { key: "bar",    label: "Bar"    },
  { key: "pie",    label: "Pie"    },
  { key: "radial", label: "Radial" },
];

/**
 * Quick snapshot chart (views / subs / videos).
 * Renders only after a valid `totals` object is supplied.
 *
 * @param {{ totals: { views:number, subscribers:number, videoCount:number } }} props
 */
const YouTubeTotalsChart = ({ totals }) => {
  const [type, setType] = useState("bar");

  /* turn totals → recharts‐friendly data */
  const data = useMemo(() => {
    if (!totals) return [];
    const { views = 0, subscribers = 0, videoCount = 0 } = totals;
    return [
      { name: "Views",  value: +views       },
      { name: "Subs",   value: +subscribers },
      { name: "Videos", value: +videoCount  },
    ];
  }, [totals]);

  /* Guard: render nothing until numbers arrive */
  if (!totals || data.every((d) => d.value === 0)) return null;

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      {/* header + chart selector */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">Totals snapshot</h3>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {TYPES.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        {type === "bar" && (
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Bar>
          </BarChart>
        )}

        {type === "pie" && (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}

        {type === "radial" && (
          <RadialBarChart
            data={data}
            innerRadius="30%"
            outerRadius="80%"
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar dataKey="value" background clockWise>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </RadialBar>
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
            <Tooltip />
          </RadialBarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default YouTubeTotalsChart;
