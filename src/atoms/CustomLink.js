import React from "react";
import { Link } from "react-router-dom";

export default function CustomLink(props) {
  return (
    <Link
      className= {
        props.isActive
          ? "navBarItem active"
          : "navBarItem"
      }
      to={props.link}
    >
      {props.name}
      {props.children}
    </Link>
  );
}
