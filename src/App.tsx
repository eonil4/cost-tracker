import React from "react";
import { ExpenseProvider } from "./context/ExpenseProvider";
import ExpenseForm from "./components/form/ExpenseForm";
import ExpenseList from "./components/list/ExpenseList";
import { Container, Typography, Paper, Grid } from "@mui/material";
import SummaryGrid from "./components/summary/SummaryGrid";


const App: React.FC = () => {
  return (
    <ExpenseProvider>
      <Container maxWidth="xl" sx={{ marginTop: 3, marginBottom: 3, px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
          Cost Tracker
        </Typography>
        <Grid container spacing={3}>
          {/* Row 1: Form + List */}
          <Grid size={12}>
            <Grid container spacing={3}>
              {/* Form Tile */}
              <Grid size={{ xs: 12, md: 4 }}>
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

          {/* Row 2: Summary */}
          <Grid size={12}>
            <SummaryGrid />
          </Grid>
        </Grid>
      </Container>
    </ExpenseProvider>
  );
};

export default App;