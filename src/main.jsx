import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CryptoContextProvider } from "./context/CryptoContext";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CryptoContextProvider>
      <App />
    </CryptoContextProvider>
  </StrictMode>
);
