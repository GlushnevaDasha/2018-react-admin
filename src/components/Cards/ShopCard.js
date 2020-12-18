import React, { Component } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";
import Image from "../Image";
import Modal from "../Modal";
import SubmitPush from "../AddContent/SubmitPush";

import { LabelDark, LabelLight } from "../../atoms/Labels";
import { Menu, Oval } from "../../content/Icons";
import { getData, getStatus, getColorHex } from "../../utils/functions";

import "../../content/dropdown.css";
import "../../stylesheets/components/Cards/ShopCard.css";

import {
  publishProductSelection,
  deleteProductSelection
} from "../../utils/api";

export class ShopCard extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false };
  }

  async deleteContent(id) {
    await deleteProductSelection(id);
    this.context.setState();
  }

  async updateStatus(id, status) {
    let data = await publishProductSelection(id, status);
    if (data.error) {
    } else {
      this.context.setState();
    }
  }

  render() {
    let url = `/product?id=${this.props.value.id}`;
    return (
      <div
        className="shopCard"
        style={{
          backgroundColor: getColorHex(this.props.value.color)
        }}
      >
        <div
          className="shopCardInfo"
          onClick={() => {
            document.location.href = url;
          }}
        >
          <Image img={this.props.value.imageUrl} />
          <div className="infoHead">
            <span
              className={
                this.props.value.theme !== "DARK" ? "darkCard" : "lightCard"
              }
            >
              {this.props.value.author.fullName}
            </span>
            <Oval type={this.props.value.theme} />
            <span
              className={
                this.props.value.theme !== "DARK" ? "darkCard" : "lightCard"
              }
            >
              {getData(this.props.value.publicationTime, true)}
            </span>
          </div>
          <div className="title">
            <h3
              className={
                this.props.value.theme !== "DARK" ? "darkCard" : "lightCard"
              }
            >
              {this.props.value.name}
            </h3>
          </div>
        </div>

        <div className="footer">
          {this.props.value.theme !== "DARK" ? (
            <LabelLight text={getStatus(this.props.value.status)} />
          ) : (
            <LabelDark text={getStatus(this.props.value.status)} />
          )}

          <Modal isShowModal={this.state.isShowModal}>
            {
              <SubmitPush
                value={{
                  postId: this.props.value.id,
                  topic: "PRODUCT_SELECTIONS"
                }}
                hideModal={() => {
                  this.setState({ isShowModal: false });
                }}
              />
            }
          </Modal>
          <DropdownButton
            alignRight
            title={<Menu theme={this.props.value.theme} />}
            id="dropdown-menu-align-right"
          >
            {this.props.value.status !== "ARCHIVE" ? (
              <Dropdown.Item
                onClick={() => {
                  document.location.href = `/edit_shop?id=${this.props.value.id}`;
                }}
              >
                Редактировать
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                onClick={() => {
                  this.updateStatus(this.props.value.id, "DRAFT");
                }}
              >
                Восстановить
              </Dropdown.Item>
            )}
            {this.props.value.status !== "PUBLISHED" &&
            this.props.value.status !== "ARCHIVE" ? (
              <Dropdown.Item
                onClick={async () => {
                  if (this.props.value.productSelectionItems !== 0) {
                    this.updateStatus(this.props.value.id, "PUBLISHED");
                  }
                }}
              >
                Опубликовать
              </Dropdown.Item>
            ) : this.props.value.status !== "ARCHIVE" ? (
              <Dropdown.Item
                onClick={() => {
                  this.setState({ isShowModal: true });
                }}
              >
                Отправить пуш
              </Dropdown.Item>
            ) : null}
            {this.props.value.status !== "ARCHIVE" ? (
              <Dropdown.Item
                onClick={async () => {
                  this.updateStatus(this.props.value.id, "ARCHIVE");
                }}
              >
                Архивировать
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                onClick={() => {
                  this.deleteContent(this.props.value.id);
                }}
              >
                Удалить
              </Dropdown.Item>
            )}
          </DropdownButton>
        </div>
      </div>
    );
  }
}
