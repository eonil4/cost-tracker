import React, { useContext, useMemo, useCallback, useState } from "react";
import { ExpenseContext } from "../../context/ExpenseContext";
import type { Expense } from "../../types";
import { Paper, Typography, Grid } from "@mui/material";
import PieSection from "./PieSection";
import TimePeriodSelector from "./TimePeriodSelector";
import {
  format,
  startOfWeek,
  startOfMonth,
} from "date-fns";
import { 
  convertCostsToChartData,
  calculateTotalCosts,
  countCurrencies,
  calculateDailyCostsForWeek,
  calculateWeeklyCostsForMonth,
  calculateMonthlyCostsForYear
} from "../../utils/calculationUtils";

const SummaryGrid: React.FC = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("ExpenseContext is not available");

  const { expenses } = context;

  // State for selected time periods
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());


  const data = useMemo(() => {
    // Calculate data for selected time periods
    const dailyCosts = calculateDailyCostsForWeek(expenses, selectedWeek);
    const dailyData = convertCostsToChartData(dailyCosts);
    const weeklyTotal = calculateTotalCosts(dailyCosts);

    const weeklyCosts = calculateWeeklyCostsForMonth(expenses, selectedMonth);
    const weeklyData = convertCostsToChartData(weeklyCosts);
    const monthlyTotal = calculateTotalCosts(weeklyCosts);

    const monthlyCosts = calculateMonthlyCostsForYear(expenses, selectedYear);
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
      weeklyCurrency: getMostCommonCurrency(expenses),
      weeklyData,
      monthlyTotal,
      monthlyCurrency: getMostCommonCurrency(expenses),
      monthlyData,
      yearlyTotal,
      yearlyCurrency: getMostCommonCurrency(expenses),
    };
  }, [expenses, selectedWeek, selectedMonth, selectedYear]);


  // Selection handlers
  const handleWeekSelect = useCallback((value: string) => {
    setSelectedWeek(new Date(value));
  }, []);

  const handleMonthSelect = useCallback((value: string) => {
    setSelectedMonth(new Date(value));
  }, []);

  const handleYearSelect = useCallback((value: string) => {
    setSelectedYear(new Date(value).getFullYear());
  }, []);

  return (
    <Grid container spacing={{ xs: 0, md: 3 }}>
      {/* Daily Costs */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ mb: { xs: 3, md: 0 } }}>
        <Paper elevation={3} sx={{ padding: 3, height: 500, display: 'flex', flexDirection: 'column' }}>
          <TimePeriodSelector
            title={`Daily Costs - Week of ${format(selectedWeek, 'MMM dd, yyyy')}`}
            currentValue={selectedWeek.toISOString()}
            onSelect={handleWeekSelect}
            pickerType="week"
          />
          <PieSection title="" data={data.dailyData} color="#8884d8" />
          <Typography align="center" variant="subtitle1" sx={{ mt: 2 }}>
            Weekly Total: {data.weeklyTotal.toFixed(2)} {data.weeklyCurrency}
          </Typography>
        </Paper>
      </Grid>

      {/* Weekly Costs */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ mb: { xs: 3, md: 0 } }}>
        <Paper elevation={3} sx={{ padding: 3, height: 500, display: 'flex', flexDirection: 'column' }}>
          <TimePeriodSelector
            title={`Weekly Costs - ${format(selectedMonth, 'MMMM yyyy')}`}
            currentValue={selectedMonth.toISOString()}
            onSelect={handleMonthSelect}
            pickerType="month"
          />
          <PieSection title="" data={data.weeklyData} color="#82ca9d" />
          <Typography align="center" variant="subtitle1" sx={{ mt: 2 }}>
            Monthly Total: {data.monthlyTotal.toFixed(2)} {data.monthlyCurrency}
          </Typography>
        </Paper>
      </Grid>

      {/* Monthly Costs */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ mb: { xs: 3, md: 0 } }}>
        <Paper elevation={3} sx={{ padding: 3, height: 500, display: 'flex', flexDirection: 'column' }}>
          <TimePeriodSelector
            title={`Monthly Costs - ${selectedYear}`}
            currentValue={new Date(selectedYear, 0, 1).toISOString()}
            onSelect={handleYearSelect}
            pickerType="year"
          />
          <PieSection title="" data={data.monthlyData} color="#FF8042" />
          <Typography align="center" variant="subtitle1" sx={{ mt: 2 }}>
            Yearly Total: {data.yearlyTotal.toFixed(2)} {data.yearlyCurrency}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SummaryGrid;


