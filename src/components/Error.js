import React from "react";
import { BLUE, DARK_GREY, WHITE } from "../content/color";

function ErrorMessage(props) {
  return (
    <div>
      <h1>Ошибка</h1>
      <p
        style={{
          fontFamily: "GraphikLCG-Regular",
          fontSize: 14,
          color: DARK_GREY
        }}
      >
        {props.textError}
      </p>
      <div style={{ display: "flex", paddingTop: 10 }}>
        <div style={{ flex: 1 }} />
        <div
          style={{
            marginLeft: 10
          }}
        >
          <button
            className="login"
            style={{
              ...style.display,
              ...style.button,
              paddingLeft: 10,
              paddingRight: 10
            }}
          >
            ОК
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;

const style = {
  display: {
    display: "flex"
  },
  button: {
    color: WHITE,
    justifyContent: "center",
    height: 50,
    backgroundColor: BLUE,
    borderRadius: 3
  }
};
