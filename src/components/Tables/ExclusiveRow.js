import React, { Component } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";

import { DoubleText } from "../../atoms/DoubleText";
import { LabelBlue } from "../../atoms/Labels";
import Modal from "../Modal";
import SubmitPush from "../AddContent/SubmitPush";

import { Menu } from "../../content/Icons";
import { getData, getStatus } from "../../utils/functions";

import { deleteFeed } from "../../utils/api";

import "../../content/dropdown.css";
import "../../stylesheets/components/Tables.css";

export class ExclusiveRow extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false };
  }
  render() {
    let url = `/feed/exclusive/${this.props.value.id}`;
    return (
      <div>
        <div className="tableRow">
          <div style={{ width: "45%" }}>
            <span>{this.props.value.title}</span>
          </div>

          <div className="secondary" style={{ width: "15%" }}>
            <span>{this.props.value.tag}</span>
          </div>

          <div className="secondary" style={{ width: "20%" }}>
            <DoubleText
              text={this.props.value.authorName}
              desc={getData(this.props.value.publicationTime)}
            />
          </div>

          <div className="secondary" style={{ width: "20%" }}>
            <div>
              <LabelBlue text={getStatus(this.props.value.status, true)} />
            </div>
            <Modal isShowModal={this.state.isShowModal}>
              {
                <SubmitPush
                  value={{
                    postId: this.props.value.id,
                    topic: "EXCLUSIVE_POST"
                  }}
                  hideModal={() => {
                    this.setState({ isShowModal: false });
                  }}
                />
              }
            </Modal>
            <DropdownButton
              style={{ width: 80, textAlign: "center" }}
              alignRight
              title={<Menu />}
              id="dropdown-menu-align-right"
            >
              <Dropdown.Item
                onClick={() => {
                  document.location.href = url;
                }}
              >
                Редактировать
              </Dropdown.Item>{" "}
              {this.props.value.status !== "DRAFT" ? (
                <Dropdown.Item
                  onClick={() => {
                    this.setState({ isShowModal: true });
                  }}
                >
                  Отправить пуш
                </Dropdown.Item>
              ) : null}
              <Dropdown.Item
                onClick={async () => {
                  await deleteFeed(this.props.value.id);
                  this.context.setState();
                }}
              >
                Удалить
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
      </div>
    );
  }
}
