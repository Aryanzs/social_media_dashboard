import {
    BarChart, Bar,
    PieChart, Pie, Cell,
    RadialBarChart, RadialBar,
    XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  } from "recharts";
  import { useState } from "react";
  
  const COLORS = ["#14b8a6", "#6366f1", "#f97316"];
  const CHARTS  = [
    { key: "bar",    label: "Bar"    },
    { key: "pie",    label: "Pie"    },
    { key: "radial", label: "Radial" },
  ];
  
  const YouTubeTotalsChart = ({ totals }) => {
    /* 🛡️ safeguard: if totals still undefined, render nothing */
    if (!totals) return null;
  
    const [chart, setChart] = useState("bar");
  
    /* fallback to zero if a field is missing */
    const { views = 0, subscribers = 0, videoCount = 0 } = totals;
  
    const data = [
      { name: "Views",  value: +views        },
      { name: "Subs",   value: +subscribers  },
      { name: "Videos", value: +videoCount   },
    ];
  
    return (
      <div className="mt-8">
        {/* chart selector */}
        <div className="flex justify-end mb-2">
          <select
            value={chart}
            onChange={(e) => setChart(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            {CHARTS.map(c => <option key={c.key}>{c.label}</option>)}
          </select>
        </div>
  
        <ResponsiveContainer width="100%" height={280}>
          {chart === "bar" && (
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          )}
  
          {chart === "pie" && (
            <PieChart>
              <Pie data={data} dataKey="value" outerRadius={110} label>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
  
          {chart === "radial" && (
            <RadialBarChart innerRadius="30%" outerRadius="80%" data={data}>
              <RadialBar background clockWise dataKey="value">
                {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </RadialBar>
              <Tooltip />
              <Legend />
            </RadialBarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default YouTubeTotalsChart;
  