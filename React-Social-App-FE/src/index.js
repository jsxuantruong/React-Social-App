import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import store from "./redux/store";

import GlobalStyles from "./components/GlobalStyles";
import "./index.css";

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <BrowserRouter>
                <GlobalStyles>
                    <App />
                </GlobalStyles>
            </BrowserRouter>
            <ToastContainer />
        </React.StrictMode>
    </Provider>,
    document.getElementById("root")
);
