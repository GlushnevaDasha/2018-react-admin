import React, { Component } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";
import Image from "../Image";
import { DoubleText } from "../../atoms/DoubleText";
import Modal from "../Modal";
import SubmitPush from "../AddContent/SubmitPush";
import { Menu } from "../../content/Icons";
import { getData, getTwitchURL } from "../../utils/functions";
import { deleteVideo } from "../../utils/api";

import "../../content/dropdown.css";
import "../../stylesheets/components/Tables.css";

export class VideoRow extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false };
  }
  render() {
    return (
      <div>
        <div className="tableRow">
          <div style={{ width: "65%" }}>
            <Image
              styleImg={{
                borderRadius: 4,
                objectFit: "cover",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#F0F0F0"
              }}
              img={getTwitchURL(this.props.value.imageUrl)}
              width={85}
              height={48}
            />
            <div className="secondary" style={{ width: "calc(100% - 85px)" }}>
              <DoubleText
                text={this.props.value.title}
                desc={this.props.value.username}
              />
            </div>
          </div>

          <div className="secondary" style={{ width: "20%" }}>
            <DoubleText
              text={this.props.value.authorFullName}
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
                color: "#007AFF",
                textAlign: "center"
              }}
            >
              {this.props.value.commentCount}
            </a>

            <Modal isShowModal={this.state.isShowModal}>
              {
                <SubmitPush
                  value={{
                    postId: this.props.value.id,
                    topic: "VIDEOS"
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
                onClick={async () => {
                  await deleteVideo(this.props.value.id);
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
