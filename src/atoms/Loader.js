import React from "react";
import Loader from "react-loader-spinner";
import { BLUE, WHITE } from "../content/color";
import "../stylesheets/atoms/Loader.css";

export function CustomLoader(props) {
  return (
    <div className="loaderContainer">
      <Loader type="TailSpin" color={BLUE} height={56} width={56} />
    </div>
  );
}

export function ButtonLoader(props) {
  return <Loader type="TailSpin" color={WHITE} height={20} width={20} />;
}
