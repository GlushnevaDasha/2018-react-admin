import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Roter from "./Roter";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<Roter />, document.getElementById("root"));

serviceWorker.unregister();
