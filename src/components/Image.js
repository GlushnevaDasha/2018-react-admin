import React from "react";
import { GREY } from "../content/color";
import noImage from "../content/icons/NoImage/noImage.svg";
import noImage25px from "../content/icons/NoImage/noImage25px.svg";
import photo from "../content/image/favicon.png";

export default function Image(props) {
  return props.img ? (
    <img
      src={props.img.indexOf("http") !== -1 ? props.img : photo} // Другую обработку
      alt="Avatar"
      style={{
        ...props.styleImg,
        maxWidth: props.width,
        maxHeight: props.height,
        minWidth: props.width,
        minHeight: props.height,
        height: "100%",
        width: "auto"
      }}
      width={props.width}
      height={props.height}
    />
  ) : (
    <NoImage
      size={props.width < 50 ? "1x" : props.width < 150 ? "2x" : "4x"}
      style={{
        ...props.styleImg,
        maxWidth: props.width,
        maxHeight: props.height,
        minWidth: props.width,
        minHeight: props.height,
        height: "100%",
        width: "auto"
      }}
    />
  );
}

const getIcon = size => {
  switch (size) {
    case "1x":
      return noImage25px;
    case "2x":
      return noImage;
    case "4x":
      return noImage;
    default:
      return noImage;
  }
};

function NoImage(props) {
  return (
    <div style={{ ...style.outer, ...props.style }}>
      <img src={getIcon(props.size)} className="App-logo" alt="logo" />
    </div>
  );
}

const style = {
  outer: {
    backgroundColor: GREY,

    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};
