import React, { useContext, useMemo, useCallback } from "react";
import { ExpenseContext } from "../../context/ExpenseContext";
import PieSection from "./PieSection";
import type { Expense } from "../../types";
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

// Colors moved to shared SUMMARY_COLORS

const ExpenseSummary: React.FC = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("ExpenseContext is not available");

  const { expenses } = context;

  // Helper function to parse a date string into a Date object
  const parseDate = useCallback((dateString: string): Date => {
    const date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateString}`);
      return new Date(); // Return current date as fallback
    }
    return date;
  }, []);

  // Memoize expensive calculations
  const summaryData = useMemo(() => {
    const today = new Date();

    // === DAILY COSTS (CURRENT WEEK) ===
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const expensesInCurrentWeek = expenses.filter((expense) =>
      isWithinInterval(parseDate(expense.date), { start: weekStart, end: weekEnd })
    );

    const dailyCosts = expensesInCurrentWeek.reduce((acc, expense) => {
      const day = format(parseDate(expense.date), "yyyy-MM-dd"); // Group by day
      acc[day] = (acc[day] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const dailyData = Object.entries(dailyCosts).map(([day, total]) => ({
      name: day,
      value: total,
    }));

    const weeklySummary = Object.values(dailyCosts).reduce((sum, value) => sum + value, 0);

    // Get the most common currency for display
    const getMostCommonCurrency = (expenses: Expense[]): string => {
      if (expenses.length === 0) return "HUF";
      const currencyCount = expenses.reduce((acc, expense) => {
        acc[expense.currency] = (acc[expense.currency] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const currencies = Object.entries(currencyCount);
      if (currencies.length === 0) return "HUF";
      return currencies.reduce((a, b) => currencyCount[a[0]] > currencyCount[b[0]] ? a : b)[0];
    };

    // === WEEKLY COSTS (CURRENT MONTH) ===
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const expensesInCurrentMonth = expenses.filter((expense) =>
      isWithinInterval(parseDate(expense.date), { start: monthStart, end: monthEnd })
    );

    const weeklyCosts = expensesInCurrentMonth.reduce((acc, expense) => {
      const expenseDate = parseDate(expense.date);
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
    const expensesInCurrentYear = expenses.filter((expense) =>
      isWithinInterval(parseDate(expense.date), { start: yearStart, end: yearEnd })
    );

    const monthlyCosts = expensesInCurrentYear.reduce((acc, expense) => {
      const month = format(parseDate(expense.date), "MMMM"); // Group by month name
      acc[month] = (acc[month] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const monthlyData = Object.entries(monthlyCosts).map(([month, total]) => ({
      name: month,
      value: total,
    }));

    const yearlySummary = Object.values(monthlyCosts).reduce((sum, value) => sum + value, 0);

    return {
      dailyData,
      weeklySummary,
      expensesInCurrentWeek,
      weeklyData,
      monthlySummary,
      expensesInCurrentMonth,
      monthlyData,
      yearlySummary,
      expensesInCurrentYear,
      getMostCommonCurrency
    };
  }, [expenses, parseDate]);

  return (
    <Box>
      {/* Daily Costs (Current Week) */}
      <PieSection title="Daily Costs (Current Week)" data={summaryData.dailyData} color="#8884d8" />
      <Typography align="center" variant="subtitle1">
        Weekly Total: {summaryData.weeklySummary.toFixed(2)} {summaryData.getMostCommonCurrency(summaryData.expensesInCurrentWeek)}
      </Typography>
      <Divider style={{ margin: "1rem 0" }} />

      {/* Weekly Costs (Current Month) */}
      <PieSection title="Weekly Costs (Current Month)" data={summaryData.weeklyData} color="#82ca9d" />
      <Typography align="center" variant="subtitle1">
        Monthly Total: {summaryData.monthlySummary.toFixed(2)} {summaryData.getMostCommonCurrency(summaryData.expensesInCurrentMonth)}
      </Typography>
      <Divider style={{ margin: "1rem 0" }} />

      {/* Monthly Costs (Current Year) */}
      <PieSection title="Monthly Costs (Current Year)" data={summaryData.monthlyData} color="#FF8042" />
      <Typography align="center" variant="subtitle1">
        Yearly Total: {summaryData.yearlySummary.toFixed(2)} {summaryData.getMostCommonCurrency(summaryData.expensesInCurrentYear)}
      </Typography>
    </Box>
  );
};

export default ExpenseSummary;


