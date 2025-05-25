import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import theme from "./styles/theme";
import { Auth0Provider } from "./auth/Auth0Provider";
import { CustomApolloProvider } from "./lib/apollo";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider>
        <CustomApolloProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </CustomApolloProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);
