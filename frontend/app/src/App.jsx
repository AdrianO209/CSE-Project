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
  const [usernameAttempt, setUserNameAttempt] = useState("");
  const [passwordAttempt, setPasswordAttempt] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const checkLogin = async () => {
    setPasswordError("");
    setUsernameError("");

    const response = await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameAttempt,
        password: passwordAttempt,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        setUsernameError(result.usernameError);
        return;
      } else {
        setPasswordError(result.passwordError);
        return;
      }
    }

    const role = result.role;

    if (role === "admin") {
      window.location.href = "http://127.0.0.1:5000/admin/user/";
      setLogin(true);
    } else if (role === "student") {
      setLogin(true);
    } else {
      setLogin(false);
    }
  };

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
              <TextField
                label="User Name"
                value={usernameAttempt}
                onChange={(e) => setUserNameAttempt(e.target.value)}
                variant="outlined"
                error={usernameError !== ""}
                helperText={usernameError}
              ></TextField>
              <TextField
                label="Passward"
                type="password"
                value={passwordAttempt}
                onChange={(e) => setPasswordAttempt(e.target.value)}
                variant="outlined"
                error={passwordError !== ""}
                helperText={passwordError}
              ></TextField>

              <Button onClick={checkLogin} variant="contained">
                Submit
              </Button>
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
