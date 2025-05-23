import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { store } from "./store/store";
import { NavigationLogger } from './hooks/navigationLogger';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <NavigationLogger />
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
