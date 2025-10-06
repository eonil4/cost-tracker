import React from "react";
import { Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SUMMARY_COLORS } from "./colors";

interface PieSectionProps {
  title: string;
  data: { name: string; value: number }[];
  color?: string;
}

const PieSection: React.FC<PieSectionProps> = ({ title, data, color }) => {
  return (
    <>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: "100%", height: 300, flex: 1 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={color ?? "#8884d8"}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={SUMMARY_COLORS[index % SUMMARY_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
};

export default PieSection;


