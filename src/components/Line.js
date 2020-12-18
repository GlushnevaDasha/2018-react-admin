import React from "react";
import { DIVIDER_GREY } from "../content/color";

export default function Line(props) {
  return (
    <hr
      style={{
        ...props.style,
        border: "none",
        backgroundColor: props.color || DIVIDER_GREY,
        height: props.height || 1,
        marginBlockStart: "0em",
        marginBlockEnd: "0em"
      }}
    />
  );
}
