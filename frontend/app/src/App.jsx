import { useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Paper,
  Button,
} from "@mui/material";
import { auraTheme } from "./theme";
import "./App.css";

function App() {
  const [isLogin, setLogin] = useState(false);

  if (!isLogin) {
    return (
      <ThemeProvider theme={auraTheme}>
        <CssBaseline />
        <header>
          <Box className="title">
            <Typography variant="h1">Aura</Typography>
          </Box>
        </header>

        <Box className="login-page">
          <Paper elevation={4} className="login-card">
            <Typography className="card-title">Sign In</Typography>

            <Box className="text-fields">
              <TextField label="User Name" variant="outlined"></TextField>
              <TextField
                label="Passward"
                type="password"
                variant="outlined"
              ></TextField>

              <Button variant="contained">Submit</Button>
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={auraTheme}>
      <CssBaseline />
      <header>
        <Box className="title">
          <Typography variant="h1">Aura</Typography>
        </Box>
      </header>
    </ThemeProvider>
  );
}

export default App;
