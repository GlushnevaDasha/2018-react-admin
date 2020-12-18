import React from "react";
import "../stylesheets/pages/shop/ShopCreate.css";

export function Input(props) {
  return (
    <input
      style={props.style}
      type={props.type ? props.type : "text"}
      placeholder={props.placeholder}
      className="input100"
      value={props.state}
      onChange={props.onChange}
    />
  );
}

export function InputWithLength(props) {
  return (
    <div className="inputWrapper" style={{ ...props.styleDiv }}>
      <input
        maxLength={props.maxLength}
        type={props.type ? props.type : "text"}
        placeholder={props.placeholder}
        className="input100"
        value={props.state}
        onChange={props.onChange}
      />
      <div className="inputCounter">
        <p>{props.maxLength - props.state.length}</p>
      </div>
    </div>
  );
}
