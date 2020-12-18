import React, { Component } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";
import "../../content/dropdown.css";

import { Menu } from "../../content/Icons";
import { getDataTime } from "../../utils/functions";

import { deleteComment } from "../../utils/api";

export class CommentRow extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false };
  }

  render() {
    return (
      <div
        className={
          this.props.value.deleted ? "commentRow deleted" : "commentRow"
        }
      >
        <div className="commentText">{this.props.value.content}</div>

        <div className="commentInfo">
          <p className="displayName">{this.props.value.author.displayName}</p>
          <p className="date">{getDataTime(this.props.value.postDateGmt)}</p>
          <p className="sourceTitle">{this.props.value.sourceTitle}</p>
        </div>

        <div>
          <DropdownButton
            alignRight
            title={<Menu />}
            id="dropdown-menu-align-right"
          >
            <Dropdown.Item
              onClick={async () => {
                let data = await deleteComment(this.props.value.commentId);
                if (data.error) {
                } else {
                  this.context.setState();
                }
              }}
            >
              Удалить
            </Dropdown.Item>
          </DropdownButton>
        </div>
      </div>
    );
  }
}
