import React, { Component } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";
import Image from "../Image";
import Text from "../CustomText";
import { DoubleText } from "../../atoms/DoubleText";
import Line from "../Line";
import Modal from "../Modal";
import SubmitPush from "../AddContent/SubmitPush";
import "../../content/dropdown.css";

import { BLUE } from "../../content/color";
import { Menu } from "../../content/Icons";
import { getData, getIcon, getTwitchURL } from "../../utils/functions";

export class AnnouncementRow extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false };
  }
  render() {
    return (
      <div>
        <div className="TableRow">
          <div
            style={{
              flex: 2,
              display: "flex",
              alignItems: "center"
            }}
          >
            <Image
              img={getTwitchURL(this.props.value.imageUrl)}
              styleImg={{
                borderRadius: 10
              }}
              width={50}
              height={50}
            />
            <div style={{ margin: 10 }}>
              <Text text={this.props.value.title} />
            </div>
          </div>
          <div style={{ width: 200 }}>
            <DoubleText
              text={this.props.value.authorFullName}
              desc={getData(this.props.value.publicationTime)}
            />
          </div>
          <div style={{ width: 150 }}>
            <Text
              style={{ color: BLUE }}
              text={this.props.value.commentCount}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: 100
            }}
          >
            <div>
              <a
                href={this.props.value.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getIcon(this.props.value.sourceUrl)}
              </a>
            </div>
            <div style={{ paddingRight: 30 }}>
              <Modal isShowModal={this.state.isShowModal}>
                {
                  <SubmitPush
                    value={{
                      postId: this.props.value.id,
                      topic: "ANNOUNCEMENTS"
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
                <Dropdown.Item
                  onClick={async () => {
                    this.context.setState();
                  }}
                >
                  Удалить
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
        </div>
        <Line height={1} />
      </div>
    );
  }
}
