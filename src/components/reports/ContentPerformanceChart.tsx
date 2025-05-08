
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "@/hooks/use-theme";

// Mock data
const data = [
  { name: "Semana 1", planned: 8, published: 7 },
  { name: "Semana 2", planned: 10, published: 9 },
  { name: "Semana 3", planned: 8, published: 6 },
  { name: "Semana 4", planned: 6, published: 5 },
];

const ContentPerformanceChart: React.FC = () => {
  const { theme = 'light' } = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.1)" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
            borderRadius: "6px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value: number, name: string) => [
            value, 
            name === "planned" ? "Planejado" : "Publicado"
          ]}
          labelFormatter={(label) => `${label}`}
        />
        <Bar dataKey="planned" name="Planejado" fill="#9b87f5" radius={[4, 4, 0, 0]} />
        <Bar dataKey="published" name="Publicado" fill="#0094fb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ContentPerformanceChart;
