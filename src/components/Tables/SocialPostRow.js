import React, { Component } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";
import Image from "../Image";
import { DoubleText } from "../../atoms/DoubleText";
import Modal from "../Modal";
import SubmitPush from "../AddContent/SubmitPush";

import "../../content/dropdown.css";
import "../../stylesheets/components/Tables.css";

import { Menu } from "../../content/Icons";
import { getData, getIcon } from "../../utils/functions";

import { instagramPostDelete } from "../../utils/api";

export class SocialPostRow extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false };
  }

  async deleteContent(url) {
    await instagramPostDelete(url);
    this.context.setState();
  }

  render() {
    return (
      <div>
        <div className="tableRow">
          <div style={{ width: "65%" }}>
            <Image
              styleImg={{
                borderRadius: 8,
                objectFit: "cover",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#F0F0F0"
              }}
              img={this.props.value.imageUrl}
              width={48}
              height={48}
            />

            <div className="secondary" style={{ width: "calc(100% - 48px)" }}>
              <DoubleText
                text={this.props.value.title}
                desc={`@${this.props.value.username}`}
              />
            </div>
          </div>

          <div className="secondary" style={{ width: "20%" }}>
            <DoubleText
              text={this.props.value.authorName}
              desc={getData(this.props.value.publicationTime)}
            />
          </div>

          <div style={{ width: "15%" }}>
            <a
              href={this.props.value.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: 80,
                fontSize: 14,
                textAlign: "center"
              }}
            >
              {getIcon(this.props.value.sourceUrl)}
            </a>

            <Modal isShowModal={this.state.isShowModal}>
              {
                <SubmitPush
                  value={{
                    postId: this.props.value.id,
                    topic: "SOCIAL_NETWORK_POSTS"
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
                  this.setState({ isShowModal: true });
                }}
              >
                Отправить пуш
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  this.deleteContent(this.props.value.sourceUrl);
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
