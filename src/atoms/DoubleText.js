import React from "react";
import Text from "../components/CustomText";

export function DoubleText(props) {
  return (
    <div>
      <span>{props.text}</span>
      <span className="subLabel">{props.desc}</span>
    </div>
  );
}

export function DoubleTextHeader(props) {
  return (
    <div style={{ flex: 1, alignSelf: "center" }}>
      <div style={{ marginBottom: 5 }}>
        <h3 style={{ ...props.styleHeader }}>{props.text}</h3>
      </div>
      <div>
        <Text
          style={{ ...props.styleDesc }}
          text={props.desc}
        />
      </div>
    </div>
  );
}
