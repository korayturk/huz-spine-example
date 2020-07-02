import React from "react";
import { Provider } from "@byhuz/huz-ui-project";
import { MuiThemeProvider as ThemeProvider } from "@material-ui/core/styles";

export default () => {
  return {};
};

const provider = ({ children }) => (
  <Provider>
    <ThemeProvider>{children}</ThemeProvider>
  </Provider>
);

export { provider as Provider };
