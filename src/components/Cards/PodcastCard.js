import React, { Component } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";
import { deletePodcast } from "../../utils/api";

import "../../stylesheets/components/Cards/PodcastCard.css";
import "../../content/dropdown.css";

import {LabelDark} from "../../atoms/Labels";

import Modal from "../Modal";
import UpdatePodcast from "../UpdateContent/Podcast";
import SubmitPush from "../AddContent/SubmitPush";

import { Menu, Oval } from "../../content/Icons";
import { getData } from "../../utils/functions";

export class PodcastCard extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false, isShowPush: false };
  }
  render() {
    return (
      <div className="PodcastCard">
        <div className="infoHead">
          <span>{this.props.value.authorFullName}</span>
          <Oval />
          <span>{getData(this.props.value.publicationTime)}</span>
        </div>

        <div className="title">
          <h3>{this.props.value.title}</h3>
        </div>

        <div className="footer">
          <LabelDark text={`Выпуск ${this.props.value.number}`} />
          <Modal isShowModal={this.state.isShowModal}>
            {
              <UpdatePodcast
                value={this.props.value}
                hideModal={() => {
                  this.setState({ isShowModal: false });
                }}
              />
            }
          </Modal>
          <Modal isShowModal={this.state.isShowPush}>
            {
              <SubmitPush
                value={{
                  postId: this.props.value.id,
                  topic: "PODCASTS"
                }}
                hideModal={() => {
                  this.setState({ isShowPush: false });
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
              Редактировать
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                this.setState({ isShowPush: true });
              }}
            >
              Отправить пуш
            </Dropdown.Item>
            <Dropdown.Item
              onClick={async () => {
                await deletePodcast(this.props.value.id);
                this.context.setState();
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
