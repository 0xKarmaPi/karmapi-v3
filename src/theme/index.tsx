import { useMemo } from "react";
import merge from "lodash/merge";

import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";
import { createPresets } from "./options/presets";
import { createContrast } from "./options/contrast";
import { customShadows } from "./custom-shadows";
import { componentsOverrides } from "./overrides";

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const presets = createPresets("default");

  const contrast = createContrast("bold", "light");

  // const memoizedValue = useMemo(
  //   () => ({
  //     palette: {
  //       ...palette("light"),
  //       ...presets.palette,
  //       ...contrast.palette,
  //     },
  //     customShadows: {
  //       ...customShadows("light"),
  //       ...presets.customShadows,
  //     },
  //     shadows: shadows("light"),
  //     shape: { borderRadius: 12 },
  //     typography,
  //   }),
  //   [presets.palette, presets.customShadows, contrast.palette]
  // );
  const themeOptions = {
    palette: {
      ...palette("light"),
      ...presets.palette,
      ...contrast.palette,
    },
    customShadows: {
      ...customShadows("light"),
      ...presets.customShadows,
    },
    shadows: shadows("light"),
    shape: { borderRadius: 6 },
    typography,
  };

  const theme = createTheme(themeOptions as ThemeOptions);

  theme.components = merge(componentsOverrides(theme), contrast.components);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
