import React, { Component } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";
import Image from "../Image";

import { Menu } from "../../content/Icons";

import { deactivateVideoChannel, activateVideoChannel } from "../../utils/api";

import "../../content/dropdown.css";
import "../../stylesheets/components/Cards/ChanelCard.css";

export class ChannelCard extends Component {
  static contextType = UpdateContext;
  render() {
    return (
      <div
        className={
          this.props.value.active
            ? "chanelCard"
            : "chanelCard disable"
        }
      >
        <Image
          img={this.props.value.imageUrl}
          width={48}
          height={48}
        />
        <div className="info">
          <span className="name">{this.props.value.username}</span>
          <span className="userName">{"@" + this.props.value.username}</span>
        </div>
        <div>
          <DropdownButton
            alignRight
            title={<Menu />}
            id="dropdown-menu-align-right"
          >
            <Dropdown.Item
              onClick={async () => {
                this.props.value.active
                  ? await deactivateVideoChannel(this.props.value.id)
                  : await activateVideoChannel(this.props.value.id);
                this.context.setState();
              }}
            >
              {this.props.value.active ? "Отключить" : "Подключить"}
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
    );
  }
}
