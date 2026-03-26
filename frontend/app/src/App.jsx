import { useState, useEffect } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  Link,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClassIcon from "@mui/icons-material/Class";
import { auraTheme } from "./theme";
import "./App.css";

function App() {
  const [isLogin, setLogin] = useState(false);
  const [role, setRole] = useState("");
  const [usernameAttempt, setUserNameAttempt] = useState("");
  const [passwordAttempt, setPasswordAttempt] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [username, setUsername] = useState("");
  const [tab, setTab] = useState("1");
  const [courses, setCourses] = useState([]);

  const fetchCourses = () => {
    fetch("http://localhost:5001/api/courses", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    if (isLogin) fetchCourses();
  }, [isLogin]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const checkLogin = async () => {
    setPasswordError("");
    setUsernameError("");

    const response = await fetch("http://localhost:5001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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

    setRole(result.role);
    setUsername(result.username);

    if (result.role === "admin") {
      window.location.href = "http://127.0.0.1:5001/admin/user/";
      setLogin(true);
    } else if (result.role === "student") {
      setLogin(true);
      fetchCourses();
    } else {
      setLogin(false);
      fetchCourses();
    }
  };

  const logout = async () => {
    await fetch("http://localhost:5001/api/logout", { credentials: "include" });

    setLogin(false);
    setRole("");
    setUserNameAttempt("");
    setPasswordAttempt("");
    setCourses([]);
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
  } else if (role === "teacher") {
    return (
      <ThemeProvider theme={auraTheme}>
        <CssBaseline />
        <header className="header">
          <Box className="menu">
            <Typography variant="h1">Aura</Typography>
          </Box>
        </header>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={auraTheme}>
        <CssBaseline />
        <header className="header">
          <Box className="menu">
            <Typography variant="h2">Welcome, {username}</Typography>
            <Link
              component="button"
              onClick={logout}
              variant="h4"
              sx={{ color: "#ff5252", textDecorationStyle: "#ff5252" }}
            >
              Log Out
            </Link>
          </Box>
        </header>
        <Box className="interface-page">
          <Paper elevation={4} className="interface">
            <Tabs
              value={tab}
              onChange={handleTabChange}
              centered
              variant="fullWidth"
            >
              <Tab label="Your Courses" value="1" />
              <Tab label="Add Courses" value="2" />
            </Tabs>
            {tab === "1" && (
              <List>
                {courses.map((course) => (
                  <ListItem
                    key={course.id}
                    secondaryAction={
                      <IconButton edge="end">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <ClassIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {course.className}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {course.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
