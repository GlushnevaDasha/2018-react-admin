import React, { Component } from "react";
import { UpdateContext } from "../../content/context";
import Modal from "../Modal";
import CompetitionCondition from "../UpdateContent/CompetitionCondition";
import ApplicationForm from "../UpdateContent/ApplicationForm";

import "../../content/dropdown.css";
import "../../stylesheets/components/Cards/ConditionCard.css";

import { Bars } from "../../content/Icons";

export class ConditionsCard extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false };
  }
  render() {
    return (
      <div className="conditionCardWrapper">
        <div className="conditionCard">
          <div className="bar" data-title={"Перетяните для сортировки"}>
            <Bars />
          </div>

          <div className="info">
            <span className="title">
              {this.props.value.title}
            </span>

            <span className="description">
              {this.props.value.description}
            </span>
          </div>

          <div className="menu">
            <p className="simpleAction blue"
              onClick={() => {
                this.setState({ isShowModal: true });
              }}
            >
              Редактировать
            </p>

            <p className="simpleAction danger"
              onClick={() => {
                this.props.delete();
              }}
            >
              Удалить
            </p>

            <Modal isShowModal={this.state.isShowModal}>
              {this.props.isForm ? (
                <ApplicationForm
                  index={this.props.index}
                  content={this.props.content}
                  setContent={this.props.update}
                  hideModal={() => {
                    this.setState({ isShowModal: false });
                  }}
                />
              ) : (
                <CompetitionCondition
                  index={this.props.index}
                  content={this.props.content}
                  setContent={this.props.update}
                  hideModal={() => {
                    this.setState({ isShowModal: false });
                  }}
                />
              )}
            </Modal>
          </div>
        </div>
      </div>
    );
  }
}
