import React, { Component } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";
import Image from "../Image";
import Text from "../CustomText";
import { DoubleText } from "../../atoms/DoubleText";
import "../../content/dropdown.css";
import "../../stylesheets/components/Tables.css";
import { BLUE } from "../../content/color";
import { Menu } from "../../content/Icons";
import { getRole } from "../../utils/functions";

export class ControlUserRow extends Component {
  static contextType = UpdateContext;
  render() {
    return (
      <div>
        <div className="tableRow">
          <div style={{ width: "70%", alignItems: "center" }}>
            <Image
              styleImg={{
                borderRadius: 25
              }}
              img={this.props.value.avatarUrl}
              width={50}
              height={50}
            />
            <div className="secondary" style={{ width: "calc(100% - 85px)" }}>
              <DoubleText
                text={this.props.value.fullName}
                desc={getRole(this.props.value.role)}
              />
            </div>
          </div>
          <div style={{ width: "40%" }}>
            {this.props.value.email}
          </div>
          <div style={{ paddingRight: 15 }}>
            <DropdownButton
              alignRight
              title={<Menu />}
              id="dropdown-menu-align-right"
            >
              <Dropdown.Item
                onClick={() => {
                  document.location.href = `/profile?id=${this.props.value.id}`;
                }}
              >
                Редактировать
              </Dropdown.Item>
              {/* <Dropdown.Item
              // onClick={async () => {
              //   this.context.setState();
              // }}
              >
                Удалить
              </Dropdown.Item> */}
            </DropdownButton>
          </div>
        </div>
      </div>
    );
  }
}
