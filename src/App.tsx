import React from "react";
import { ExpenseProvider } from "./context/ExpenseProvider";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";
import { Container, Typography, Paper } from "@mui/material";

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
          <ExpenseSummary />
        </Paper>
      </Container>
    </ExpenseProvider>
  );
};

export default App;