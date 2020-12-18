import React from "react";
import { Link } from "react-router-dom";
import { HardHat, InfoCircle } from "../content/Icons";
import { WHITE, DARK_SLATE_GREY } from "../content/color";
import AddButton from "./AddButton";

function ContentCenter(props) {
  return (
    <div
      style={{
        ...style.outer,
        backgroundColor: WHITE,
        position: "absolute",
        width: "100%",
        height: "100%"
      }}
    >
      <div style={style.inner}>
        <div style={style.outer}>
          <div style={style.inner}>{props.icon}</div>
        </div>
        <h1 style={{ textAlign: "center" }}>{props.text}</h1>
      </div>
    </div>
  );
}

function Content(props) {
  return (
    <div
      style={{
        paddingTop: "5%",
        backgroundColor: WHITE,
        width: "100%",
        height: "100%"
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ margin: "auto" }}>{props.icon}</div>
      </div>
      <div>
        <h1 style={{ textAlign: "center" }}>{props.text}</h1>
      </div>
    </div>
  );
}

export function UnderConstruction() {
  return <Content icon={<HardHat />} text={"Данный раздел еще в разработке"} />;
}

export function NoData(props) {
  return (
    <div>
      <h1 style={{textAlign: "center"}}>
        {"Пусто"}
      </h1>

      <p
        style={{
          fontSize: 18,
          textAlign: "center",
          padding: "8px 0 40px 0"
        }}
      >
        {!props.text
          ? `Вы еще не ${props.doing} ни ${props.what}, но это легко исправить`
          : props.text}
      </p>
      {props.buttonClick ? <AddButton onClick={props.buttonClick} /> : null}
    </div>
  );
}

export function NoContent() {
  return (
    <ContentCenter
      icon={<InfoCircle />}
      text={"Данной страницы не существует"}
    />
  );
}

export function Error() {
  return (
    <ContentCenter
      icon={<InfoCircle />}
      text={"Данной страницы не существует"}
    />
  );
}

export function NotAuthorized() {
  return (
    <div style={style.fon}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1
        }}
      >
        <div>
          <span style={style.namePage}>Контент недоступен</span>
          <p className="regular" style={style.text}>
            Вы не авторизованы в системе.
          </p>

          <p className="regular" style={style.text}>
            Для получения доступа к контенту перейдите на странуцу{" "}
            <Link style={style.text} to="/sign_in">
              {"авторизации."}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const style = {
  outer: {
    display: "flex"
  },
  inner: {
    margin: "auto"
  },
  fon: {
    width: "100%",
    height: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    position: "absolute",
    backgroundColor: DARK_SLATE_GREY,
    bottom: 0,
    display: "flex"
  },
  namePage: {
    padding: 60,
    textAlign: "center",
    fontSize: 27,
    color: WHITE,
    display: "block"
  },
  text: {
    color: WHITE,
    textAlign: "center",
    fontSize: 18,
    marginTop: 20
  }
};
