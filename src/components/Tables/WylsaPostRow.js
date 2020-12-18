import React, { Component } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";

import { DoubleText } from "../../atoms/DoubleText";
import Modal from "../Modal";
import SubmitPush from "../AddContent/SubmitPush";
import "../../content/dropdown.css";
import "../../stylesheets/components/Tables.css";

import { Menu } from "../../content/Icons";
import { getData } from "../../utils/functions";

import "../../content/dropdown.css";
import "../../stylesheets/components/Tables.css";

export class WylsaPostRow extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false };
  }
  render() {
    return (
      <div>
        <div className="tableRow">
          <div style={{ width: "60%" }}>
            <span>{this.props.value.postTitle}</span>
          </div>

          <div className="secondary" style={{ width: "25%" }}>
            <DoubleText
              text={this.props.value.postAuthor.displayName}
              desc={getData(this.props.value.postDateGmt)}
            />
          </div>

          <div style={{ width: "10%" }}>
            <span>{this.props.value.views}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Modal isShowModal={this.state.isShowModal}>
              {
                <SubmitPush
                  value={{
                    postId: this.props.value.wpPostId,
                    topic: "WYLSA_SITE_POST"
                  }}
                  hideModal={() => {
                    this.setState({ isShowModal: false });
                  }}
                />
              }
            </Modal>
            <DropdownButton
              alignRight
              title={<Menu />}
              id="dropdown-menu-align-right"
            >
              <Dropdown.Item
                onClick={() => {
                  this.setState({ isShowModal: true });
                }}
              >
                Отправить пуш
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
      </div>
    );
  }
}
