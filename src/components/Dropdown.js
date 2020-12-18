import React from "react";
import cookie from "react-cookies";
import { DropdownButton, Dropdown } from "react-bootstrap";

import { User, SignOut, Shape, Book, Chat } from "../content/Icons";
import { DARK_GREY } from "../content/color";

function ItemWithIcon(props) {
  return (
    <Dropdown.Item onClick={() => (!props.onClick ? null : props.onClick())}>
      <div
        onClick={() => {
          if (props.url) {
            document.location.href = props.url;
          }
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ height: 18, marginRight: 10 }}>{props.icon}</div>
          <div>
            <p style={{ fontSize: 14 }}>{props.text}</p>
          </div>
        </div>
      </div>
    </Dropdown.Item>
  );
}

export function DropdownHeader(props) {
  return (
    <DropdownButton alignRight title={props.button}>
      <ItemWithIcon
        url={`/profile?id=${cookie.load("token").profile.id}`}
        icon={<User />}
        text={"Редактировать профиль"}
      />

      {cookie.load("token").profile.role === "ADMIN" ? (
        <ItemWithIcon
          url={`/control_users`}
          icon={<Shape />}
          text={"Перейти к управлению"}
        />
      ) : null}
      <ItemWithIcon url={`/sign_in`} icon={<SignOut />} text={"Выйти"} />
    </DropdownButton>
  );
}

export function DropdownQuestion(props) {
  return (
    <DropdownButton alignRight title={props.button}>
      <ItemWithIcon icon={<Book />} text={"Открыть гайд"} />
      <ItemWithIcon icon={<User />} text={"Что нового?"} />
      <ItemWithIcon icon={<Chat />} text={"Написать разработчику"} />

      <Dropdown.Item>
        <p
          style={{
            fontSize: 12,
            color: DARK_GREY,
            padding: 10
          }}
        >
          Version 1.0.0
        </p>
      </Dropdown.Item>
    </DropdownButton>
  );
}
