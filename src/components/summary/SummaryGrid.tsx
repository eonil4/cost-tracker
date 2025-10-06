import React, { useContext, useMemo, useCallback } from "react";
import { ExpenseContext } from "../../context/ExpenseContext";
import type { Expense } from "../../types";
import { Paper, Typography, Grid } from "@mui/material";
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
import { 
  calculateWeeklyCosts, 
  calculateMonthlyCosts,
  convertCostsToChartData,
  calculateTotalCosts,
  countCurrencies
} from "../../utils/calculationUtils";

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
    const weeklyCosts = calculateWeeklyCosts(expensesInCurrentMonth);
    const weeklyData = convertCostsToChartData(weeklyCosts);
    const monthlyTotal = calculateTotalCosts(weeklyCosts);

    // Year
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);
    const expensesInCurrentYear = expenses.filter((expense) =>
      isWithinInterval(parseDate(expense.date), { start: yearStart, end: yearEnd })
    );
    const monthlyCosts = calculateMonthlyCosts(expensesInCurrentYear);
    const monthlyData = convertCostsToChartData(monthlyCosts);
    const yearlyTotal = calculateTotalCosts(monthlyCosts);

    const getMostCommonCurrency = (list: Expense[]): string => {
      if (list.length === 0) return "HUF";
      const currencyCount = countCurrencies(list);
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
    <Grid container spacing={{ xs: 0, md: 3 }}>
      {/* Daily Costs */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ mb: { xs: 3, md: 0 } }}>
        <Paper elevation={3} sx={{ padding: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
          <PieSection title="Daily Costs (Current Week)" data={data.dailyData} color="#8884d8" />
          <Typography align="center" variant="subtitle1" sx={{ mt: 2 }}>
            Weekly Total: {data.weeklyTotal.toFixed(2)} {data.weeklyCurrency}
          </Typography>
        </Paper>
      </Grid>

      {/* Weekly Costs */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ mb: { xs: 3, md: 0 } }}>
        <Paper elevation={3} sx={{ padding: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
          <PieSection title="Weekly Costs (Current Month)" data={data.weeklyData} color="#82ca9d" />
          <Typography align="center" variant="subtitle1" sx={{ mt: 2 }}>
            Monthly Total: {data.monthlyTotal.toFixed(2)} {data.monthlyCurrency}
          </Typography>
        </Paper>
      </Grid>

      {/* Monthly Costs */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ mb: { xs: 3, md: 0 } }}>
        <Paper elevation={3} sx={{ padding: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
          <PieSection title="Monthly Costs (Current Year)" data={data.monthlyData} color="#FF8042" />
          <Typography align="center" variant="subtitle1" sx={{ mt: 2 }}>
            Yearly Total: {data.yearlyTotal.toFixed(2)} {data.yearlyCurrency}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SummaryGrid;


