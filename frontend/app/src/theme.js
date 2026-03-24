import { createTheme } from "@mui/material/styles";

export const auraTheme = createTheme({
  palette: {
    primary: {
      main: "#764ba2",
      light: "#a677d6",
      dark: "#482172",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#667eea",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f7fa",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: "bold",
          padding: "10px",
        },
      },
    },
  },
});
