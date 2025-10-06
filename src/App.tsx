import React from "react";
import { ExpenseProvider } from "./context/ExpenseProvider";
import ExpenseForm from "./components/form/ExpenseForm";
import ExpenseList from "./components/list/ExpenseList";
import { Container, Typography, Paper, Grid } from "@mui/material";
import SummaryGrid from "./components/summary/SummaryGrid";


const App: React.FC = () => {
  return (
    <ExpenseProvider>
      <Container maxWidth="lg" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <Typography variant="h4" align="center" gutterBottom  style={{ height: "100%", width: "1020px" }}>
          Cost Tracker
        </Typography>
        <Grid container rowSpacing={3} columnSpacing={3}>
          {/* Row 1: Form + List */}
          <Grid size={12} style={{ marginBottom: "1.5rem" }}>
            <Grid container spacing={3}>
              {/* Form Tile */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper elevation={3} style={{ padding: "1.5rem", height: "100%", width: "244px" }}>
                  <Typography variant="h6" gutterBottom>
                    Add Expense
                  </Typography>
                  <ExpenseForm />
                </Paper>
              </Grid>

              {/* List Tile */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper elevation={3} style={{ padding: "1.5rem", height: "100%", width: "632px" }}>
                  <Typography variant="h6" gutterBottom>
                    Expenses
                  </Typography>
                  <ExpenseList />
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Row 2: Summary */}
          <Grid size={12} style={{ marginTop: "24px" }}>
            <SummaryGrid />
          </Grid>
        </Grid>
      </Container>
    </ExpenseProvider>
  );
};

export default App;