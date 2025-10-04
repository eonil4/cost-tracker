import React, { Suspense, lazy } from "react";
import { ExpenseProvider } from "./context/ExpenseProvider";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { Container, Typography, Paper, CircularProgress, Box } from "@mui/material";

// Lazy load the heavy ExpenseSummary component
const ExpenseSummary = lazy(() => import("./components/ExpenseSummary"));

const App: React.FC = () => {
  return (
    <ExpenseProvider>
      <Container maxWidth="md" style={{ marginTop: "2rem" }}>
        <Paper elevation={3} style={{ padding: "2rem" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Cost Tracker
          </Typography>
          <ExpenseForm />
          <ExpenseList />
          <Suspense fallback={
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          }>
            <ExpenseSummary />
          </Suspense>
        </Paper>
      </Container>
    </ExpenseProvider>
  );
};

export default App;