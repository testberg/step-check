import { createTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: `"Almarai", sans-serif`,
  },
  palette: {
    primary: {
      main: '#212121',
    },
    secondary: {
      main: "#444DAC",
    },
    whiteText: {
      main: "#FFF",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    }
  },
});

export default theme;
