import React, { Component } from "react";
import { UpdateContext } from "../../content/context";
import { DropdownButton, Dropdown } from "react-bootstrap";

import Image from "../Image";

import "../../content/dropdown.css";

import { GREY, BLUE } from "../../content/color";
import { Menu } from "../../content/Icons";
import { getIconAccaunt, getDataBan } from "../../utils/functions";
import { userBan, userUnblock } from "../../utils/api";
import { LabelRed } from "../../atoms/Labels";

export class MobileUserRow extends Component {
  static contextType = UpdateContext;
  async ban(date, user) {
    let data = await userBan(date, user);
    if (data === undefined) {
      this.context.setState();
    }
  }

  render() {
    return (
      <div>
        <div className="tableRow">
          <div style={{ width: "70%", alignItems: "center" }}>
            <Image
              styleImg={{
                borderRadius: 25
              }}
              img={this.props.value.pictureUrl}
              width={50}
              height={50}
            />
            <div className="secondary" style={{ width: "calc(100% - 85px)" }}>
              <p>{this.props.value.displayName}</p>
            </div>
          </div>
          <div style={{ width: "20%" }}>
            {getIconAccaunt(this.props.value.accountType)}
          </div>
          <div style={{ width: "20%", color: BLUE }}>
            {this.props.value.commentCount}
          </div>
          <div style={{ flex: 0.1, minWidth: 120, maxWidth: 150 }}>
            {this.props.value.foreverBanned || this.props.value.bannedUntil ? (
              <LabelRed
                text={
                  this.props.value.foreverBanned
                    ? "Бан навсегда"
                    : `Бан до ${getDataBan(this.props.value.bannedUntil)}`
                }
              />
            ) : null}
          </div>
          <div>
            <DropdownButton
              style={{ width: 80, textAlign: "center" }}
              alignRight
              title={<Menu />}
              id="dropdown-menu-align-right"
            >
              {this.props.value.foreverBanned ||
              this.props.value.bannedUntil ? (
                <Dropdown.Item
                  onClick={async () => {
                    let data = await userUnblock(this.props.value.id);
                    if (data) {
                    } else {
                      this.context.setState();
                    }
                  }}
                >
                  Восстановить
                </Dropdown.Item>
              ) : (
                <>
                  <p style={{ paddingLeft: 20, color: GREY }}>
                    {"Заблокировать".toUpperCase()}
                  </p>

                  <Dropdown.Item
                    onClick={async () => {
                      this.ban("DAY", this.props.value.id);
                    }}
                  >
                    На сутки
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={async () => {
                      this.ban("WEEK", this.props.value.id);
                    }}
                  >
                    На неделю
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={async () => {
                      this.ban("MONTH", this.props.value.id);
                    }}
                  >
                    На месяц
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={async () => {
                      this.ban("THREE_MONTH", this.props.value.id);
                    }}
                  >
                    На 3 месяца
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={async () => {
                      this.ban("FOREVER", this.props.value.id);
                    }}
                  >
                    Навсегда
                  </Dropdown.Item>
                </>
              )}
            </DropdownButton>
          </div>
        </div>
      </div>
    );
  }
}
