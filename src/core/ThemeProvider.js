import { createTheme, ThemeProvider } from '@material-ui/core';

const darkTheme = createTheme({
  palette: {
    type: 'dark'
  }
});

export default function Palette({ children }) {
  return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
}
