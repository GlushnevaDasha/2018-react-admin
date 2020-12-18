import React from "react";

import "../stylesheets/components/Modal.css"

export default function Modal(props) {
  return (
    <div
      className="modalWindowWrapper"
      style={{
        display: props.isShowModal ? "flex" : "none"
      }}
    >
      <div className="modalWindow">{props.children}</div>
    </div>
  );
}
