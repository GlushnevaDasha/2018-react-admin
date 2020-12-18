import React, { Component } from "react";
import { UpdateContext } from "../../content/context";
import Modal from "../Modal";
import UpdatePrize from "../UpdateContent/Prize";

import "../../content/dropdown.css";
import "../../stylesheets/components/Cards/PrizeCard.css";

import { deleteCompetitionItem } from "../../utils/api";

export class PrizeCard extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false };
  }
  render() {
    return (
      <div
        className={
          this.props.isActive && !this.props.winner
            ? "prizeCard active"
            : "prizeCard"
        }
        onClick={() => {
          if (this.props.result) {
            this.props.editActive(this.props.index, this.props.value.id);
          }
        }}
      >
        <img src={this.props.value.imageUrl} alt="prize" />

        <h3> {this.props.value.name} </h3>

        {this.props.result ? (
          <div>
            <p className="winnerName">
              {this.props.value.winner
                ? this.props.value.winner.displayName
                : ""}
            </p>
          </div>
        ) : (
          <div>
            <p
              onClick={() => {
                this.setState({ isShowModal: true });
              }}
              className="simpleAction blue"
            >
              Редактировать
            </p>
            <p
              onClick={async () => {
                await deleteCompetitionItem(this.props.value.id);
                this.context.setState();
              }}
              className="simpleAction danger"
            >
              Удалить
            </p>
            <Modal isShowModal={this.state.isShowModal}>
              <UpdatePrize
                value={this.props.value}
                hideModal={() => {
                  this.setState({ isShowModal: false });
                }}
              />
            </Modal>
          </div>
        )}
      </div>
    );
  }
}
