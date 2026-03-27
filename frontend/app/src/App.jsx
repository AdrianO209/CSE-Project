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
  ListSubheader,
  CircularProgress,
  selectClasses,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ClassIcon from "@mui/icons-material/Class";
import AddIcon from "@mui/icons-material/Add";
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
  const [allCourses, setAllCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  const fetchCourses = async () => {
    const response = await fetch("http://localhost:5001/api/courses", {
      credentials: "include",
    });
    if (!response.ok) {
      setCourses([]);
      return;
    }

    const data = await response.json();
    setCourses(data);
  };

  const fetchAllCourse = async () => {
    const response = await fetch("http://localhost:5001/api/allCourses", {
      credentials: "include",
    });

    const data = await response.json();
    setAllCourses(data);
  };

  useEffect(() => {
    if (isLogin) {
      fetchCourses();
      fetchAllCourse();
    }
  }, [isLogin]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const checkLogin = async () => {
    setPasswordError("");
    setUsernameError("");
    setIsLoading(true);

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
        setIsLoading(false);
        return;
      } else {
        setPasswordError(result.passwordError);
        setIsLoading(false);
        return;
      }
    }

    if (result.role === "admin") {
      window.location.href = "http://127.0.0.1:5001/admin/user/";
      return;
    }

    setRole(result.role);
    setUsername(result.username);
    setLogin(true);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const logout = async () => {
    await fetch("http://localhost:5001/api/logout", { credentials: "include" });

    setLogin(false);
    setRole("");
    setUserNameAttempt("");
    setPasswordAttempt("");
    setCourses([]);
    setEditCourse(null);
    setTab("1");
  };

  const handleAddAction = async (courseData) => {
    await fetch("http://localhost:5001/api/add", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course: courseData }),
    });

    fetchCourses();
    fetchAllCourse();
  };

  const handleDeleteAction = async (courseData) => {
    await fetch("http://localhost:5001/api/remove", {
      credentials: "include",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course: courseData }),
    });

    fetchCourses();
    fetchAllCourse();
  };

  const handleEditClick = (course) => {
    setEditCourse(course);
    setTab("3");
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
                label="Password"
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
            <Typography variant="h2">Welcome, {username}</Typography>
            <Button
              variant="outlined"
              onClick={logout}
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "#ff5252",
                  color: "#ff5252",
                  backgroundColor: "rgba(255, 82, 82, 0.1)",
                },
              }}
            >
              Log Out
            </Button>
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
              <Tab label="Your Schedule" value="1" />
            </Tabs>
            {tab === "1" && (
              <List>
                <Box className="list-sub-headers">
                  <Box></Box>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Course Name
                  </ListSubheader>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Instructor
                  </ListSubheader>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Time
                  </ListSubheader>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Students Enrolled
                  </ListSubheader>
                  <Box></Box>
                </Box>
                {courses.map((course) => (
                  <ListItem key={course.id} className="my-row-class">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar>
                        <ClassIcon />
                      </Avatar>
                    </Box>

                    <Typography
                      sx={{
                        fontWeight: "medium",
                        cursor: "pointer",
                        color: "#6a5acd",
                        "&:hover": { textDecoration: "underline" },
                      }}
                      onClick={() => handleEditClick(course)}
                    >
                      {course.className}
                    </Typography>

                    <Typography color="text.secondary">
                      {course.instructor}
                    </Typography>

                    <Typography color="text.secondary">
                      {course.time}
                    </Typography>

                    <Typography fontWeight="bold" align="center">
                      {course.enrolled}/{course.total}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}
            {tab === "3" && editCourse && (
              <List>
                <Box className="edit-page">
                  <Typography variant="h3">{editCourse.className}</Typography>
                </Box>

                <Box className="edit-subheaders">
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Student's Name
                  </ListSubheader>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Grade
                  </ListSubheader>
                </Box>

                <Box className="students-rows">
                  {editCourse.studentList &&
                    editCourse.studentList.map((studentName, index) => (
                      <Typography variant="body1" key={index}>
                        {studentName}
                      </Typography>
                    ))}
                </Box>
              </List>
            )}
          </Paper>
        </Box>
      </ThemeProvider>
    );
  } else {
    return (
      <ThemeProvider theme={auraTheme}>
        <CssBaseline />
        <header className="header">
          <Box className="menu">
            <Typography variant="h2">Welcome, {username}</Typography>
            <Button
              variant="outlined"
              onClick={logout}
              sx={{
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "#ff5252",
                  color: "#ff5252",
                  backgroundColor: "rgba(255, 82, 82, 0.1)",
                },
              }}
            >
              Log Out
            </Button>
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
                <Box className="list-sub-headers">
                  <Box></Box>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Course Name
                  </ListSubheader>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Instructor
                  </ListSubheader>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Time
                  </ListSubheader>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Students Enrolled
                  </ListSubheader>
                  <Box></Box>
                </Box>
                {courses.map((course) => (
                  <ListItem key={course.id} className="my-row-class">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar>
                        <ClassIcon />
                      </Avatar>
                    </Box>

                    <Typography sx={{ fontWeight: "medium" }}>
                      {course.className}
                    </Typography>

                    <Typography color="text.secondary">
                      {course.instructor}
                    </Typography>

                    <Typography color="text.secondary">
                      {course.time}
                    </Typography>

                    <Typography fontWeight="bold" align="center">
                      {course.enrolled}/{course.total}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}
            {tab === "2" && (
              <List>
                <Box className="list-sub-headers">
                  <Box></Box>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Course Name
                  </ListSubheader>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Instructor
                  </ListSubheader>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Time
                  </ListSubheader>
                  <ListSubheader disableSticky sx={{ fontWeight: "bold" }}>
                    Students Enrolled
                  </ListSubheader>
                  <Box></Box>
                </Box>
                {allCourses.map((course) => {
                  const isEnrolled = courses.some((c) => c.id === course.id);

                  return (
                    <ListItem key={course.id} className="my-row-class">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar>
                          <ClassIcon />
                        </Avatar>
                      </Box>

                      <Typography sx={{ fontWeight: "medium" }}>
                        {course.className}
                      </Typography>

                      <Typography sx={{ fontWeight: "medium" }}>
                        {course.instructor}
                      </Typography>

                      <Typography sx={{ fontWeight: "medium" }}>
                        {course.time}
                      </Typography>

                      <Typography fontWeight="bold" align="center">
                        {course.enrolled}/{course.total}
                      </Typography>

                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <IconButton
                          edge="end"
                          aria-label="course-action"
                          color={isEnrolled ? "error" : "success"}
                          onClick={() =>
                            isEnrolled
                              ? handleDeleteAction(course.className)
                              : handleAddAction(course.className)
                          }
                        >
                          {isEnrolled ? <DeleteIcon /> : <AddIcon />}
                        </IconButton>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        </Box>
      </ThemeProvider>
    );
  }
}

export default App;
