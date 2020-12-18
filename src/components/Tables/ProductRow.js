import React, { Component } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";
import Image from "../Image";
import Modal from "../Modal";
import UpdateProduct from "../UpdateContent/Product";

import "../../content/dropdown.css";
import "../../stylesheets/components/Tables.css";

import { Menu } from "../../content/Icons";

import { deleteProductSelectionItem } from "../../utils/api";
import { isEmpty } from "../../utils/functions";

export class ProductRow extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false };
  }
  render() {
    return (
      <div>
        <div className="tableRow">
          <div style={{ width: "50%" }}>
            <Image
              styleImg={{
                borderRadius: 8,
                objectFit: "cover",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#F0F0F0",
              }}
              img={this.props.value.imageUrl}
              width={48}
              height={48}
            />
            <div className="secondary" style={{ width: "calc(100% - 48px)" }}>
              <span>{this.props.value.name}</span>
            </div>
          </div>

          <div className="secondary" style={{ width: "15%" }}>
            <span>{`${this.props.value.value} ₽`}</span>
          </div>

          <div className="secondary" style={{ width: "28%" }}>
            <span>{this.props.value.link}</span>
          </div>

          <div>
            <Modal isShowModal={this.state.isShowModal}>
              {
                <UpdateProduct
                  value={this.props.value}
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
                  this.setState({ isShowModal: true });
                }}
              >
                Редактировать
              </Dropdown.Item>
              <Dropdown.Item
                onClick={async () => {
                  let data = await deleteProductSelectionItem(
                    this.props.value.id
                  );
                  if (!isEmpty(data)) {
                    this.context.setState();
                  }
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
