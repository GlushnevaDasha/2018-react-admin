import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { UpdateContext } from "../../content/context";
import { LabelBlue } from "../../atoms/Labels";
import Modal from "../Modal";
import SubmitPush from "../AddContent/SubmitPush";
import "../../content/dropdown.css";

import "../../stylesheets/components/Cards/CompetitionCard.css";

import { BLACK } from "../../content/color";
import { Menu, Oval } from "../../content/Icons";
import { getData, getStatusCompetitions } from "../../utils/functions";
import { editStatusCompetitors } from "../../utils/api";

export class CompetitionCard extends Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = { isShowModal: false };
  }
  render() {
    return (
      <div className="CompetitionCard">
        <div>
          <Link
            style={{ color: BLACK }}
            to={`/competition/?id=${this.props.value.id}`}
          >
            <div className="infoHead">
              <span>{this.props.value.author.fullName}</span>
              <Oval />
              <span>{getData(this.props.value.publicationTime, true)}</span>
            </div>

            <h3>{this.props.value.name}</h3>
          </Link>

          <div className="footer">
            <LabelBlue
              className="blue"
              text={getStatusCompetitions(this.props.value.status)}
            />

            <Modal isShowModal={this.state.isShowModal}>
            {
              <SubmitPush
              value={{
                postId: this.props.value.id,
                topic: "COMPETITIONS"
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
            {this.props.value.status === "RESULTS_WAITING" ? (
              <Dropdown.Item
              onClick={() => {
                document.location.href = `/competition_result/?id=${this.props.value.id}`;
              }}
              >
              Подвести итоги
              </Dropdown.Item>
            ) : null}
            {this.props.value.status === "DRAFT" ? (
              <>
              <Dropdown.Item
              onClick={() => {
                document.location.href = `/edit_competition?id=${this.props.value.id}`;
              }}
              >
              Редактировать
              </Dropdown.Item>
              <Dropdown.Item
              onClick={async () => {
                let data = await editStatusCompetitors(
                  this.props.value.id,
                  "PUBLISHED"
                );
                if (data.error) {
                  this.setState({ isError: true });
                } else {
                  this.context.setState();
                }
              }}
              >
              Запустить
              </Dropdown.Item>
              </>
            ) : (
              <Dropdown.Item
              onClick={() => {
                this.setState({ isShowModal: true });
              }}
              >
              Отправить пуш
              </Dropdown.Item>
            )}

            {this.props.value.status !== "ARCHIVE" ? (
              <Dropdown.Item
              onClick={async () => {
                let data = await editStatusCompetitors(
                  this.props.value.id,
                  "ARCHIVE"
                );
                if (data.error) {
                  this.setState({ isError: true });
                } else {
                  this.context.setState();
                }
              }}
              >
              Архивировать
              </Dropdown.Item>
            ) : null}
            </DropdownButton>
          </div>
        </div>

        <Link
          style={{ color: BLACK }}
          to={`/competition/?id=${this.props.value.id}`}
        >
          <div
            style={{
              borderRadius: "0px 0px 10px 10px",
              flex: 1,
              height: 264,
              backgroundImage: `url(${this.props.value.imageUrl})`,
              webkitBackgroundSize: "100%",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
        </Link>
      </div>
    );
  }
}
