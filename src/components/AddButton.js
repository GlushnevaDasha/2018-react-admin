import React from "react";
import { IconAdd } from "../content/Icons";

export default function AddButton(props) {
  return (
    <div
      className="add_button"
      onClick={() => {
        props.onClick();
      }}
    >
      <IconAdd />
      <p>{"Добавить"}</p>
    </div>
  );
}
