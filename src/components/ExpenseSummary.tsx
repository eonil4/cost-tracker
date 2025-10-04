import React, { useContext, useMemo } from "react";
import { ExpenseContext } from "../context/ExpenseContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
  format,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { Typography, Box, Divider } from "@mui/material";

// Define colors for the pie chart
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6666", "#66CCFF",
  "#FF99CC", "#99CCFF", "#FFCC99", "#99FF99", "#CC99FF",
];

const ExpenseSummary: React.FC = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("ExpenseContext is not available");

  const { expenses } = context;

  // Helper to parse yyyy-MM-dd as local date to avoid timezone skew
  const parseLocalDate = (dateString: string): Date => {
    // Expect format yyyy-MM-dd
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
    if (!match) return new Date(dateString);
    const year = Number(match[1]);
    const monthIndex = Number(match[2]) - 1; // 0-based
    const day = Number(match[3]);
    return new Date(year, monthIndex, day);
  };

  // Get today's date
  const today = new Date();

  // === DAILY COSTS (CURRENT WEEK) ===
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const expensesInCurrentWeek = useMemo(() =>
    expenses.filter((expense) =>
      isWithinInterval(parseLocalDate(expense.date), { start: weekStart, end: weekEnd })
    )
  , [expenses, weekStart, weekEnd]);

  const dailyCosts = expensesInCurrentWeek.reduce((acc, expense) => {
    const day = format(parseLocalDate(expense.date), "yyyy-MM-dd");
    acc[day] = (acc[day] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const dailyData = Object.entries(dailyCosts).map(([day, total]) => ({
    name: day,
    value: total,
  }));

  const weeklySummary = Object.values(dailyCosts).reduce((sum, value) => sum + value, 0);

  // === WEEKLY COSTS (CURRENT MONTH) ===
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const expensesInCurrentMonth = useMemo(() =>
    expenses.filter((expense) =>
      isWithinInterval(parseLocalDate(expense.date), { start: monthStart, end: monthEnd })
    )
  , [expenses, monthStart, monthEnd]);

  const weeklyCosts = expensesInCurrentMonth.reduce((acc, expense) => {
    const expenseDate = parseLocalDate(expense.date);
    const weekStart = startOfWeek(expenseDate, { weekStartsOn: 1 }); // Week starts on Monday
    const weekEnd = endOfWeek(expenseDate, { weekStartsOn: 1 });
    const weekKey = `${format(weekStart, "yyyy-MM-dd")} - ${format(weekEnd, "yyyy-MM-dd")}`; // Group by week
    acc[weekKey] = (acc[weekKey] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const weeklyData = Object.entries(weeklyCosts).map(([week, total]) => ({
    name: week,
    value: total,
  }));

  const monthlySummary = Object.values(weeklyCosts).reduce((sum, value) => sum + value, 0);

  // === MONTHLY COSTS (CURRENT YEAR) ===
  const yearStart = startOfYear(today);
  const yearEnd = endOfYear(today);
  const expensesInCurrentYear = useMemo(() =>
    expenses.filter((expense) =>
      isWithinInterval(parseLocalDate(expense.date), { start: yearStart, end: yearEnd })
    )
  , [expenses, yearStart, yearEnd]);

  const monthlyCosts = expensesInCurrentYear.reduce((acc, expense) => {
    const month = format(parseLocalDate(expense.date), "MMMM");
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.entries(monthlyCosts).map(([month, total]) => ({
    name: month,
    value: total,
  }));

  const yearlySummary = Object.values(monthlyCosts).reduce((sum, value) => sum + value, 0);

  return (
    <Box>
      {/* Daily Costs (Current Week) */}
      <Typography variant="h6" align="center" gutterBottom>
        Daily Costs (Current Week)
      </Typography>
      <Box style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={dailyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {dailyData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Typography align="center" variant="subtitle1">
        Weekly Total: {weeklySummary.toFixed(2)} HUF
      </Typography>
      <Divider style={{ margin: "1rem 0" }} />

      {/* Weekly Costs (Current Month) */}
      <Typography variant="h6" align="center" gutterBottom>
        Weekly Costs (Current Month)
      </Typography>
      <Box style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={weeklyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#82ca9d"
              label
            >
              {weeklyData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Typography align="center" variant="subtitle1">
        Monthly Total: {monthlySummary.toFixed(2)} HUF
      </Typography>
      <Divider style={{ margin: "1rem 0" }} />

      {/* Monthly Costs (Current Year) */}
      <Typography variant="h6" align="center" gutterBottom>
        Monthly Costs (Current Year)
      </Typography>
      <Box style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={monthlyData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#FF8042"
              label
            >
              {monthlyData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Typography align="center" variant="subtitle1">
        Yearly Total: {yearlySummary.toFixed(2)} HUF
      </Typography>
    </Box>
  );
};

export default ExpenseSummary;