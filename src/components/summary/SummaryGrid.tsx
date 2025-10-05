import React, { useContext, useMemo, useCallback } from "react";
import { ExpenseContext } from "../../context/ExpenseContext";
import type { Expense } from "../../types";
import { Grid, Paper, Typography, Box, Divider } from "@mui/material";
import PieSection from "./PieSection";
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

const SummaryGrid: React.FC = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("ExpenseContext is not available");

  const { expenses } = context;

  const parseDate = useCallback((dateString: string): Date => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date();
    }
    return date;
  }, []);

  const data = useMemo(() => {
    const today = new Date();

    // Week
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const expensesInCurrentWeek = expenses.filter((expense) =>
      isWithinInterval(parseDate(expense.date), { start: weekStart, end: weekEnd })
    );
    const dailyCosts = expensesInCurrentWeek.reduce((acc, expense) => {
      const day = format(parseDate(expense.date), "yyyy-MM-dd");
      acc[day] = (acc[day] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    const dailyData = Object.entries(dailyCosts).map(([day, total]) => ({ name: day, value: total }));
    const weeklyTotal = Object.values(dailyCosts).reduce((sum, v) => sum + v, 0);

    // Month
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const expensesInCurrentMonth = expenses.filter((expense) =>
      isWithinInterval(parseDate(expense.date), { start: monthStart, end: monthEnd })
    );
    const weeklyCosts = expensesInCurrentMonth.reduce((acc, expense) => {
      const d = parseDate(expense.date);
      const ws = startOfWeek(d, { weekStartsOn: 1 });
      const we = endOfWeek(d, { weekStartsOn: 1 });
      const key = `${format(ws, "yyyy-MM-dd")} - ${format(we, "yyyy-MM-dd")}`;
      acc[key] = (acc[key] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    const weeklyData = Object.entries(weeklyCosts).map(([name, value]) => ({ name, value }));
    const monthlyTotal = Object.values(weeklyCosts).reduce((sum, v) => sum + v, 0);

    // Year
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);
    const expensesInCurrentYear = expenses.filter((expense) =>
      isWithinInterval(parseDate(expense.date), { start: yearStart, end: yearEnd })
    );
    const monthlyCosts = expensesInCurrentYear.reduce((acc, expense) => {
      const month = format(parseDate(expense.date), "MMMM");
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    const monthlyData = Object.entries(monthlyCosts).map(([name, value]) => ({ name, value }));
    const yearlyTotal = Object.values(monthlyCosts).reduce((sum, v) => sum + v, 0);

    const getMostCommonCurrency = (list: Expense[]): string => {
      if (list.length === 0) return "HUF";
      const currencyCount = list.reduce((acc, e) => {
        acc[e.currency] = (acc[e.currency] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const entries = Object.entries(currencyCount);
      if (entries.length === 0) return "HUF";
      return entries.reduce((a, b) => (currencyCount[a[0]] > currencyCount[b[0]] ? a : b))[0];
    };

    return {
      dailyData,
      weeklyTotal,
      weeklyCurrency: getMostCommonCurrency(expensesInCurrentWeek),
      weeklyData,
      monthlyTotal,
      monthlyCurrency: getMostCommonCurrency(expensesInCurrentMonth),
      monthlyData,
      yearlyTotal,
      yearlyCurrency: getMostCommonCurrency(expensesInCurrentYear),
    };
  }, [expenses, parseDate]);

  return (
    <Grid container spacing={3}>
      {/* Left column matches form width (md=4) */}
      <Grid item xs={12} md={4}>
        <Paper elevation={3} style={{ padding: "1.5rem", height: "400px", width: "244px" }}>
          <PieSection title="Daily Costs (Current Week)" data={data.dailyData} color="#8884d8" />
          <Typography align="center" variant="subtitle1">
            Weekly Total: {data.weeklyTotal.toFixed(2)} {data.weeklyCurrency}
          </Typography>
        </Paper>
      </Grid>

      {/* Right column matches list width (md=8), stack two tiles */}
      <Grid item xs={12} md={8}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: "1.5rem", height: "400px", width: "280px" }}>
              <PieSection title="Weekly Costs (Current Month)" data={data.weeklyData} color="#82ca9d" />
              <Typography align="center" variant="subtitle1">
                Monthly Total: {data.monthlyTotal.toFixed(2)} {data.monthlyCurrency}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: "1.5rem", height: "400px", width: "280px" }}>
              <PieSection title="Monthly Costs (Current Year)" data={data.monthlyData} color="#FF8042" />
              <Typography align="center" variant="subtitle1">
                Yearly Total: {data.yearlyTotal.toFixed(2)} {data.yearlyCurrency}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SummaryGrid;


