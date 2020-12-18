import React, { Component } from "react";
import { UpdateContext } from "../../content/context";
import "../../content/dropdown.css";
import { getIcon } from "../../utils/functions";
import { userWinn, userWinnDelete } from "../../utils/api";
import { Winner } from "../../content/Icons";
import { BLUE } from "../../content/color";

export class UsersCompetitionRow extends Component {
  static contextType = UpdateContext;
  isWinner() {
    let flag = false;
    if (this.props.prize) {
      this.props.prize.map(item => {
        if (item.winner && item.winner.id === this.props.value.id) {
          flag = true;
        }
      });
    }

    return flag;
  }
  idPrizeWinn() {
    let prize = null;
    this.props.prize.map(item => {
      if (item.winner && item.winner.id === this.props.value.id) {
        prize = { id: item.id, name: item.name };
      }
    });
    return prize;
  }

  render() {
    return (
      <div
        style={{
          display: "table-row",
          borderCollapse: "collapse",
          color: this.isWinner() || this.props.search ? BLUE : null
        }}
      >
        <div className="TableRow">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 14,
              padding: "10px 0px"
            }}
          >
            <div className="localIdRow">{this.props.value.localId}</div>

            {this.props.condition.map(condition =>
              this.props.value.answers.map((answer, index) =>
                condition.id === answer.condition ? (
                  <div className="simpleRow" key={index}>
                    {answer.answer}
                  </div>
                ) : null
              )
            )}

            <div
              style={{
                minWidth: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>{this.props.value.displayName}</div>
                <div>{getIcon(this.props.value.profileLink)}</div>
              </div>
              {this.isWinner() ? (
                <>
                  <Winner title={this.idPrizeWinn().name} />
                  <div
                    className="userWinnerButton"
                    onClick={async () => {
                      let data = await userWinnDelete(this.idPrizeWinn().id);
                      if (data.error) {
                      } else {
                        this.context.setState();
                      }
                    }}
                  >
                    Отменить
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      width: 44
                    }}
                  />
                  <div
                    className="userWinnerButton"
                    onClick={async () => {
                      let data = await userWinn(
                        this.props.activePrize,
                        this.props.value.id
                      );
                      if (data.error) {
                        if (this.props.status === "RESULTS_WAITING") {
                          alert("Возможно данный приз уже занят");
                        } else {
                          alert("Вы еще не можете подвести итоги конкурса");
                        }
                      } else {
                        this.context.setState();
                      }
                    }}
                  >
                    Выбрать
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
