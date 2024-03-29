import { ThemeOptions } from "@mui/material";
import { Theme } from "@mui/material/styles";

export function defaultProps(theme: Theme) {
  return {
    MuiButton: {
      defaultProps: {
        color: "inherit" as const,
        disableElevation: true,
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          borderRadius: "1rem",
        },
      },
    },
    MuiStack: {
      defaultProps: {
        // alignItems: "fle" as const,
      },
    },
  };
}
