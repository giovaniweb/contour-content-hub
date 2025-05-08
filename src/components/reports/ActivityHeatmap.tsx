
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ActivityData {
  [key: string]: number;
}

interface ActivityHeatmapProps {
  data: ActivityData;
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.substring(0, 3), // Use first 3 characters of day name
    posts: value,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.1)" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value: number) => [`${value} posts`, "Publicações"]}
          labelFormatter={(label) => `${label}`}
        />
        <Bar 
          dataKey="posts" 
          fill="#0094fb" 
          radius={[4, 4, 0, 0]}
          background={{ fill: "rgba(0, 0, 0, 0.05)" }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ActivityHeatmap;
