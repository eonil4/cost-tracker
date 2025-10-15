import React, { useContext, useMemo, useCallback, useState } from "react";
import { ExpenseContext } from "../../context/ExpenseContext";
import { Paper, Typography, Grid, Box } from "@mui/material";
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
  calculateDailyCostsByCurrencyForWeek,
  calculateWeeklyCostsByCurrencyForMonth,
  calculateMonthlyCostsByCurrencyForYear,
  getUniqueCurrencies
} from "../../utils/calculationUtils";

const CurrencySummaryGrid: React.FC = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error("ExpenseContext is not available");

  const { expenses } = context;

  // State for selected time periods
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const data = useMemo(() => {
    // Get all unique currencies
    const currencies = getUniqueCurrencies(expenses);
    
    // Calculate data for each currency
    const currencyData = currencies.map(currency => {
      // Filter expenses for this currency
      const currencyExpenses = expenses.filter(expense => expense.currency === currency);
      
      // Calculate daily costs for the selected week
      const dailyCosts = calculateDailyCostsByCurrencyForWeek(currencyExpenses, selectedWeek);
      const dailyData = convertCostsToChartData(dailyCosts[currency] || {});
      const weeklyTotal = calculateTotalCosts(dailyCosts[currency] || {});

      // Calculate weekly costs for the selected month
      const weeklyCosts = calculateWeeklyCostsByCurrencyForMonth(currencyExpenses, selectedMonth);
      const weeklyData = convertCostsToChartData(weeklyCosts[currency] || {});
      const monthlyTotal = calculateTotalCosts(weeklyCosts[currency] || {});

      // Calculate monthly costs for the selected year
      const monthlyCosts = calculateMonthlyCostsByCurrencyForYear(currencyExpenses, selectedYear);
      const monthlyData = convertCostsToChartData(monthlyCosts[currency] || {});
      const yearlyTotal = calculateTotalCosts(monthlyCosts[currency] || {});

      return {
        currency,
        dailyData,
        weeklyTotal,
        weeklyData,
        monthlyTotal,
        monthlyData,
        yearlyTotal,
      };
    });

    return currencyData;
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

  // Don't render if no currencies
  if (data.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
        Currency Breakdowns
      </Typography>
      {data.map((currencyData) => (
        <Box key={currencyData.currency} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
            {currencyData.currency} Summary
          </Typography>
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
                <PieSection title="" data={currencyData.dailyData} color="#8884d8" />
                <Typography align="center" variant="subtitle1" sx={{ mt: 2 }}>
                  Weekly Total: {currencyData.weeklyTotal.toFixed(2)} {currencyData.currency}
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
                <PieSection title="" data={currencyData.weeklyData} color="#82ca9d" />
                <Typography align="center" variant="subtitle1" sx={{ mt: 2 }}>
                  Monthly Total: {currencyData.monthlyTotal.toFixed(2)} {currencyData.currency}
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
                <PieSection title="" data={currencyData.monthlyData} color="#FF8042" />
                <Typography align="center" variant="subtitle1" sx={{ mt: 2 }}>
                  Yearly Total: {currencyData.yearlyTotal.toFixed(2)} {currencyData.currency}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default CurrencySummaryGrid;
