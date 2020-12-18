import React from "react";
import "../stylesheets/atoms/Labels.css";

export function LabelDark(props) {
  return <span className="label dark">{props.text}</span>;
}

export function LabelLight(props) {
  return <span className="label light">{props.text}</span>;
}

export function LabelBlue(props) {
  return <span className="label blue">{props.text}</span>;
}

export function LabelRed(props) {
  return <span className="label red">{props.text}</span>;
}
