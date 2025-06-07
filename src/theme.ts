import { indigo, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  shape: {
    borderRadius: 4,
  },
  palette: {
    primary: {
      main: indigo["A200"],
    },
    secondary: {
      main: red[500],
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        position: "static",
        color: "primary",
        elevation: 0,
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        variant: "outlined",
        size: "small",
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
        autoComplete: "off",
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          display: "block",
          width: "160px",
        },
      },
    },
  },
});

export default theme;
