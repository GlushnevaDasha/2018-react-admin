import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faClock,
  faTools,
  faQuestion,
  faSearch,
  faInfoCircle,
  faCommentAlt,
  faBars,
  faFile
} from "@fortawesome/free-solid-svg-icons";

import {
  faTwitter,
  faInstagram,
  faYoutube,
  faVk,
  faFacebookSquare,
  faGoogle,
  faTwitch,
  faApple
} from "@fortawesome/free-brands-svg-icons";
import { BLACK, BLUE, GREY } from "../content/color";
import add from "./icons/add.svg";
import blackOval from "./icons/blackOval.svg";
import blueOval from "./icons/blueOval.svg";
import whiteOval from "./icons/whiteOval.svg";

import menu from "./icons/menu.svg";
import menuWhite from "./icons/menuWhite.svg";

import user from "./icons/user.svg";
import signOut from "./icons/signOut.svg";
import menuHorizontal from "./icons/menuHorizontal.svg";
import book from "./icons/book.svg";
import shape from "./icons/shape.svg";

import angleLeft from "./icons/angleLeft.svg";
import angleRight from "./icons/angleRight.svg";

import toolBarDark from "./icons/Phone/toolBarDark.svg";
import toolBarLight from "./icons/Phone/toolBarLight.svg";
import statusBarDark from "./icons/Phone/statusBarDark.svg";
import statusBarLight from "./icons/Phone/statusBarLight.svg";

import winner from "./icons/winner.svg";

export function AngleDown() {
  return <FontAwesomeIcon icon={faAngleDown} color={BLACK} size="1x" />;
}

export function File() {
  return <FontAwesomeIcon icon={faFile} color={BLACK} size="2x" />;
}

export function AngleLeft() {
  return <img src={angleLeft} alt="left" />;
}

export function AngleRight() {
  return <img src={angleRight} alt="right" />;
}

export function IconAdd() {
  return <img src={add} alt="add" />;
}

export function Oval(props) {
  return props.color ? (
    <img src={blueOval} alt="oval" />
  ) : props.type !== "LIGHT" ? (
    <img src={blackOval} alt="oval" />
  ) : (
    <img src={whiteOval} alt="oval" />
  );
}

export function MenuMobile(props) {
  return (
    <>
      <div style={{ paddingLeft: 5, paddingTop: 5 }}>
        <img
          src={props.typeDark ? statusBarDark : statusBarLight}
          alt="statusBar"
        />
      </div>
      <div style={{ padding: 15 }}>
        <img src={props.typeDark ? toolBarDark : toolBarLight} alt="toolBar" />
      </div>
    </>
  );
}

export function Clock() {
  return <FontAwesomeIcon icon={faClock} color={BLACK} size="1x" />;
}

export function Bars() {
  return <FontAwesomeIcon icon={faBars} color={GREY} size="1x" />;
}

export function Menu(props) {
  if (props.theme === "LIGHT") {
    return <img style={{ padding: "0 6,5" }} src={menuWhite} alt="menu" />;
  }
  return <img style={{ paddingHorizontal: "6.5" }} src={menu} alt="menu" />;
}

export function MenuHorizontal() {
  return <img src={menuHorizontal} alt="menu" />;
}

export function HardHat() {
  return <FontAwesomeIcon icon={faTools} color={BLUE} size="10x" />;
}

export function Question() {
  return <FontAwesomeIcon icon={faQuestion} color={BLACK} size="1x" />;
}

export function User() {
  return <img width={18} height={18} src={user} alt="logo" />;
}

export function SignOut() {
  return <img width={18} height={18} src={signOut} alt="logo" />;
}

export function Book() {
  return <img src={book} width={18} height={18} alt="logo" />;
}

export function Shape() {
  return <img src={shape} width={18} height={18} alt="logo" />;
}

export function Search() {
  return <FontAwesomeIcon icon={faSearch} color={GREY} size="1x" />;
}

export function InfoCircle() {
  return <FontAwesomeIcon icon={faInfoCircle} color={BLUE} size="10x" />;
}
export function Chat() {
  return <FontAwesomeIcon icon={faCommentAlt} color={BLACK} size="1x" />;
}

export function Winner(props) {
  return (
    <div
      className="bar"
      data-title={props.title}
      style={{ padding: "0px 10px" }}
    >
      <img src={winner} width={24} height={24} alt="winner" />
    </div>
  );
}

// Brand icons
export function Youtube() {
  return <FontAwesomeIcon icon={faYoutube} color={BLUE} size="1x" />;
}

export function Instagram() {
  return <FontAwesomeIcon icon={faInstagram} color={BLUE} size="1x" />;
}

export function Twiter() {
  return <FontAwesomeIcon icon={faTwitter} color={BLUE} size="1x" />;
}

export function VK() {
  return <FontAwesomeIcon icon={faVk} color={BLUE} size="1x" />;
}

export function Facebook() {
  return <FontAwesomeIcon icon={faFacebookSquare} color={BLUE} size="1x" />;
}

export function Google() {
  return <FontAwesomeIcon icon={faGoogle} color={BLUE} size="1x" />;
}

export function Twitch() {
  return <FontAwesomeIcon icon={faTwitch} color={BLUE} size="1x" />;
}

export function Apple() {
  return <FontAwesomeIcon icon={faApple} color={BLUE} size="1x" />;
}
