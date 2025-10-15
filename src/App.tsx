import React from "react";
import { ExpenseProvider } from "./context/ExpenseProvider";
import { ThemeProvider } from "./context/ThemeContext";
import ExpenseForm from "./components/form/ExpenseForm";
import ExpenseList from "./components/list/ExpenseList";
import { Container, Typography, Paper, Grid, Box } from "@mui/material";
import CurrencySummaryGrid from "./components/summary/CurrencySummaryGrid";
import ThemeToggle from "./components/ThemeToggle";


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <Container maxWidth="xl" sx={{ marginTop: 3, marginBottom: 3, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" align="center" sx={{ mr: 2 }}>
              Cost Tracker
            </Typography>
            <ThemeToggle />
          </Box>
        <Grid container spacing={3}>
          {/* Row 1: Form + List */}
          <Grid size={12} sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
            <Grid container spacing={{ xs: 0, md: 3 }}>
              {/* Form Tile */}
              <Grid size={{ xs: 12, md: 4 }} sx={{ mb: { xs: 3, md: 0 } }}>
                <Paper elevation={3} sx={{ padding: 3, height: "100%", minHeight: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Add Expense
                  </Typography>
                  <ExpenseForm />
                </Paper>
              </Grid>

              {/* List Tile */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper elevation={3} sx={{ padding: 3, height: "100%", minHeight: 400 }}>
                  <Typography variant="h6" gutterBottom>
                    Expenses
                  </Typography>
                  <ExpenseList />
                </Paper>
              </Grid>
            </Grid>
          </Grid>


          {/* Row 2: Currency Summaries */}
          <Grid size={12} sx={{ mt: { xs: 1, sm: 2 } }}>
            <CurrencySummaryGrid />
          </Grid>
        </Grid>
        </Container>
      </ExpenseProvider>
    </ThemeProvider>
  );
};

export default App;