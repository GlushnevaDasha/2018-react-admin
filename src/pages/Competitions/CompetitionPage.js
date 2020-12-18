import React from "react";
import cookie from "react-cookies";
import { UpdateContext } from "../../content/context";
import { Link } from "react-router-dom";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CustomLoader } from "../../atoms/Loader";
import Line from "../../components/Line";
import Modal from "../../components/Modal";
import { LabelBlue } from "../../atoms/Labels";
import { style, divStyle } from "../../content/styles";
import { LIGHT_GREY, BG_GRADIENT } from "../../content/color";
import {
  getParameterFromUrl,
  getStatusCompetitions,
  dataString,
  isTimePassed
} from "../../utils/functions";
import {
  getCompetition,
  updateConditions,
  editStatusCompetitors,
  countСompetition
} from "../../utils/api";
import { NoData } from "../../components/Gag";
import { MenuHorizontal } from "../../content/Icons";
import FlatList from "../../components/FlatList";
import AddButton from "../../components/AddButton";
import { PrizeCard } from "../../components/Cards/PrizeCard";
import { ConditionsCard } from "../../components/Cards/ConditionsCard";
import AddPrize from "../../components/AddContent/Prize";
import CompetitionCondition from "../../components/AddContent/CompetitionCondition";
import ApplicationForm from "../../components/AddContent/ApplicationForm";
import SubmitPush from "../../components/AddContent/SubmitPush";
import Stream from "../../components/AddContent/Stream";

import "../../stylesheets/pages/Competitions/CompetitionPage.css";

function PrizeList(props) {
  return props.value.map(item => <PrizeCard value={item} />);
}

const buttonText = state => {
  switch (state) {
    case "DRAFT":
      return "Запустить";
    case "PUBLISHED":
      return "Список участников";
    case "RESULTS_WAITING":
      return "Подведение итогов";
    case "FINISHED":
      return "Просмотреть участников";
    case "ARCHIVE":
      return "Просмотреть участников";
    default:
      return "Запустить";
  }
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  let [removed] = sourceClone.splice(droppableSource.index, 1);
  removed = {
    ...removed,
    field: droppableDestination.droppableId !== "forms" ? false : true,
    place: droppableDestination.index
  };
  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

export default class CompetitionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      isShowCondition: false,
      isShowApplicationForm: false,
      isShowStream: false,
      isShowPush: false,
      description: "",
      descriptor: "",
      deadline: "",
      resultStream: "",
      results: "",
      name: "",
      imageUrl: "",
      imageWidth: 0,
      imageHigh: 0,
      status: "",
      item: null,
      count: 0,
      conditions: null,
      condition: [],
      forms: [],
      isError: false,
      isAdd: false,
      id: getParameterFromUrl("id"),
      isUpdate: false
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  id2List = {
    condition: "condition",
    forms: "forms"
  };

  getList = id => this.state[this.id2List[id]];

  isUserCount = () => {
    return this.state.status === "RESULTS_WAITING" ||
      this.state.status === "FINISHED" ||
      this.state.status === "ARCHIVE"
      ? true
      : false;
  };

  onDragEnd = result => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      if (source.droppableId === "forms") {
        let form = [];
        items.map((item, index) => {
          form.push({
            description: item.description,
            field: item.field,
            id: item.id,
            place: index,
            title: item.title
          });
        });
        this.setState({ forms: form }, () => {
          this.updateCondition();
        });
      } else {
        let conditions = [];
        items.map((item, index) => {
          conditions.push({
            description: item.description,
            field: item.field,
            id: item.id,
            place: index,
            title: item.title
          });
        });
        this.setState(
          {
            condition: conditions
          },
          () => {
            this.updateCondition();
          }
        );
      }
    } else {
      result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      let conditions = [];
      result.condition.map((item, index) => {
        conditions.push({
          description: item.description,
          field: item.field,
          id: item.id,
          place: index,
          title: item.title
        });
      });

      let form = [];
      result.forms.map((item, index) => {
        form.push({
          description: item.description,
          field: item.field,
          id: item.id,
          place: index,
          title: item.title
        });
      });
      this.setState(
        {
          condition: conditions,
          forms: form
        },
        () => {
          this.updateCondition();
        }
      );
    }
  };

  arraySplitting() {
    let forms = [];
    let condition = [];
    if (this.state.conditions) {
      if (this.state.conditions.length !== 0) {
        this.state.conditions.map(item =>
          !item.field ? condition.push(item) : forms.push(item)
        );
      } else {
        forms = [];
        condition = [];
      }
    }
    this.setState({
      condition: condition,
      forms: forms
    });
  }

  async getData() {
    let data = await getCompetition(this.state.id);
    if (data.error) {
      this.setState({
        isError: true
      });
    } else {
      this.setState(
        {
          description: data.description,
          descriptor: data.descriptor,
          imageUrl: data.imageUrl,
          imageWidth: data.imageWidth,
          imageHigh: data.imageHigh,
          status: data.status,
          item: data.items,
          conditions: data.conditions,
          name: data.name,
          deadline: data.deadline,
          results: data.results,
          resultStream: data.resultStream
        },
        () => {
          this.arraySplitting();
          isTimePassed(this.state.deadline);
        }
      );
      if (this.isUserCount()) {
        let count = await countСompetition(this.state.id);
        if (count.error) {
          this.setState({
            isError: true
          });
        } else {
          this.setState({
            count: count.count
          });
        }
      }
    }
  }

  async editStatus(status, redirect = false) {
    let data = await editStatusCompetitors(this.state.id, status);
    if (data.error) {
      this.setState({ isError: true });
    } else {
      this.setState({
        isUpdate: true
      });
      if (redirect) {
        document.location.href = `/competition_result/?id=${this.state.id}`;
      }
    }
  }

  componentDidMount() {
    this.getData();
    if (
      isTimePassed(this.state.deadline) &&
      this.state.status === "PUBLISHED"
    ) {
      this.editStatus("RESULTS_WAITING");
      this.getData();
    }
    if (this.state.status === "RESULTS_WAITING" && this.allWinner()) {
      this.editStatus("FINISHED");
      this.getData();
    }
  }

  updateCondition = () => {
    this.setState(
      {
        conditions: [...this.state.condition, ...this.state.forms]
      },
      async () => {
        let data = await updateConditions(this.state.id, this.state.conditions);
        if (!data.error) {
          this.setState({ isUpdate: true });
        }
      }
    );
  };

  async componentDidUpdate() {
    if (this.state.isUpdate) {
      this.getData();
      this.setState({
        isUpdate: false
      });
    }
    if (
      isTimePassed(this.state.deadline) &&
      this.state.status === "PUBLISHED"
    ) {
      this.editStatus("RESULTS_WAITING");
      this.getData();
    }
    if (this.state.status === "RESULTS_WAITING" && this.allWinner()) {
      this.editStatus("FINISHED");
      this.getData();
    }
  }

  allWinner() {
    let flag = true;
    this.state.item.map(item => {
      if (!item.winner) {
        flag = false;
      }
    });
    return flag;
  }

  competitionData() {
    return {
      deadline: this.state.deadline,
      description: this.state.description,
      descriptor: this.state.descriptor,
      imageUrl: this.state.imageUrl,
      name: this.state.name,
      results: 0,
      imageWidth: this.state.imageWidth,
      imageHigh: this.state.imageHigh
    };
  }

  render() {
    if (!this.state.item && !this.state.conditions) {
      return <CustomLoader styleConteiner={{ backgroundColor: LIGHT_GREY }} />;
    } else {
      return (
        <div>
          <UpdateContext.Provider
            value={{
              isUpdate: this.state.isUpdate,
              setState: () => {
                this.setState({
                  isUpdate: !this.state.isUpdate
                });
              }
            }}
          >
            <div
              className="competitionInfoWrapper"
              style={{ backgroundImage: BG_GRADIENT }}
            >
              <div className="intent2x">
                <div>
                  <LabelBlue
                    className="blue"
                    text={getStatusCompetitions(this.state.status)}
                  />

                  <h1>{this.state.name}</h1>

                  <p>{this.state.description}</p>

                  <div className="competitionParametrs">
                    <div>
                      {this.isUserCount() ? (
                        <>
                          <span>Приняло участие</span>
                          <p>{this.state.count}</p>
                        </>
                      ) : (
                        <>
                          <span>Заявки принимаются</span>
                          <p>{dataString(this.state.deadline, true)}</p>
                        </>
                      )}
                    </div>

                    <div>
                      <span>Дата и время розыгрыша</span>
                      <p>{dataString(this.state.results, true)}</p>
                    </div>

                    <div>
                      <span>Ссылка на стрим</span>

                      <Modal isShowModal={this.state.isShowStream}>
                        <Stream
                          id={this.state.id}
                          data={this.competitionData()}
                          hideModal={() => {
                            this.setState({
                              isShowStream: false,
                              isUpdate: true
                            });
                          }}
                        />
                      </Modal>

                      {this.state.resultStream.length !== 0 ? (
                        <a
                          className="competition_link"
                          href={this.state.resultStream}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {"YouTube"}
                        </a>
                      ) : (
                        <p
                          className="competition_link"
                          onClick={() => {
                            this.setState({ isShowStream: true });
                          }}
                        >
                          {"Добавить"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {cookie.load("token").profile.role === "ADMIN" ? (
                        <div
                          onClick={async () => {
                            switch (this.state.status) {
                              case "DRAFT":
                                if (
                                  this.state.item.length !== 0 &&
                                  this.state.conditions.length !== 0
                                ) {
                                  this.editStatus("PUBLISHED");
                                }
                                break;
                              case "PUBLISHED":
                                document.location.href = `/competition_result/?id=${this.state.id}`;
                                break;
                              case "RESULTS_WAITING":
                                document.location.href = `/competition_result/?id=${this.state.id}`;
                                break;
                              case "FINISHED":
                                document.location.href = `/competition_result/?id=${this.state.id}`;
                                break;
                              case "ARCHIVE":
                                document.location.href = `/competition_result/?id=${this.state.id}`;
                                break;
                              default:
                                break;
                            }
                          }}
                          style={{ marginRight: 10 }}
                        >
                          <div
                            className={
                              this.state.item.length !== 0 &&
                              this.state.conditions.length !== 0
                                ? "large_button active"
                                : "large_button disable"
                            }
                          >
                            {buttonText(this.state.status)}
                          </div>
                        </div>
                      ) : null}
                      <div style={{ marginRight: 10 }}>
                        {this.state.status === "DRAFT" ? (
                          <div
                            className="medium_button simple"
                            onClick={() => {
                              document.location.href = `/edit_competition?id=${this.state.id}`;
                            }}
                          >
                            Редактировать
                          </div>
                        ) : this.state.status === "DRAFT" ? (
                          <div
                            className={
                              this.state.item.length !== 0 &&
                              this.state.conditions.length !== 0
                                ? "large_button active"
                                : "large_button disable"
                            }
                            onClick={() => {
                              document.location.href = `/edit_competition?id=${this.state.id}`;
                            }}
                          >
                            Завершить
                          </div>
                        ) : null}
                      </div>
                      <div>
                        <Modal isShowModal={this.state.isShowPush}>
                          {
                            <SubmitPush
                              value={{
                                postId: this.state.id,
                                topic: "COMPETITIONS"
                              }}
                              hideModal={() => {
                                this.setState({ isShowPush: false });
                              }}
                            />
                          }
                        </Modal>
                        <DropdownButton
                          alignRight
                          title={<MenuHorizontal />}
                          id="dropdown-menu-align-right"
                        >
                          {this.state.status === "DRAFT" ? (
                            <Dropdown.Item>
                              <Link
                                style={{
                                  color: "#212529"
                                }}
                                to={`/edit_competition?id=${this.state.id}`}
                              >
                                Редактировать
                              </Link>
                            </Dropdown.Item>
                          ) : null}
                          {this.state.status === "FINISHED" ? (
                            <Dropdown.Item
                              onClick={() => {
                                this.editStatus("ARCHIVE");
                              }}
                            >
                              Архивировать
                            </Dropdown.Item>
                          ) : null}

                          <Dropdown.Item
                            onClick={() => {
                              this.setState({ isShowPush: true });
                            }}
                          >
                            Отправить пуш
                          </Dropdown.Item>
                        </DropdownButton>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={style.navigation} />
              </div>
            </div>

            <Line />

            <div className="intent2x">
              {this.state.item && this.state.item.length !== 0 ? (
                <div className="productTableHeading">
                  <h2>Призы</h2>
                  <Modal isShowModal={this.state.isShowModal}>
                    <AddPrize
                      id={this.state.id}
                      hideModal={() => {
                        this.setState({ isShowModal: false, isUpdate: true });
                      }}
                    />
                  </Modal>
                  <div
                    onClick={() => {
                      this.setState({ isShowModal: true });
                    }}
                    className="addLink"
                  >
                    {"Добавить".toLocaleUpperCase()}
                  </div>
                </div>
              ) : null}

              <div className="prizeListLarge">
                <UpdateContext.Provider
                  value={{
                    isUpdate: this.state.isUpdate,
                    setState: () => {
                      this.setState({
                        isUpdate: !this.state.isUpdate
                      });
                    }
                  }}
                >
                  {!this.state.item ? (
                    <CustomLoader />
                  ) : this.state.item.length !== 0 ? (
                    <FlatList
                      children={<PrizeList value={this.state.item} />}
                      column={215}
                    />
                  ) : (
                    <div className="emptyStateWrapper">
                      <NoData doing={"добавили"} what={"одного приза"} />
                      <Modal isShowModal={this.state.isShowModal}>
                        <AddPrize
                          id={this.state.id}
                          hideModal={() => {
                            this.setState({
                              isShowModal: false,
                              isUpdate: true
                            });
                          }}
                        />
                      </Modal>
                      <AddButton
                        onClick={() => {
                          this.setState({ isShowModal: true });
                        }}
                      />
                    </div>
                  )}
                </UpdateContext.Provider>
              </div>
            </div>

            <Line />

            <DragDropContext
              onDragEnd={this.state.status === "DRAFT" ? this.onDragEnd : null}
            >
              <div className="intent2x" style={{ ...divStyle.page }}>
                {this.state.condition.length !== 0 ? (
                  <div className="productTableHeading">
                    <h2>Условия</h2>
                    <Modal isShowModal={this.state.isShowCondition}>
                      <CompetitionCondition
                        length={this.state.conditions.length}
                        setContent={newContent => {
                          this.setState(
                            {
                              condition: [...this.state.condition, newContent]
                            },
                            () => {
                              this.updateCondition();
                            }
                          );
                        }}
                        hideModal={() => {
                          this.setState({ isShowCondition: false });
                        }}
                      />
                    </Modal>

                    <div
                      onClick={() => {
                        this.setState({ isShowCondition: true });
                      }}
                      className="addLink"
                    >
                      {"Добавить".toLocaleUpperCase()}
                    </div>
                  </div>
                ) : null}

                <div
                  style={{
                    paddingTop: 20,
                    paddingBottom: 40
                  }}
                >
                  <Droppable droppableId="condition">
                    {provided => (
                      <div ref={provided.innerRef}>
                        {!this.state.condition ? (
                          <CustomLoader />
                        ) : this.state.condition.length !== 0 ? (
                          this.state.condition.map((item, index) => (
                            <Draggable
                              key={index}
                              draggableId={item.id}
                              index={index}
                            >
                              {provided => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <ConditionsCard
                                    index={index}
                                    value={item}
                                    content={this.state.condition}
                                    update={content => {
                                      let contents = this.state.condition;
                                      contents.splice(index, 1, content);
                                      this.setState(
                                        {
                                          condition: contents
                                        },
                                        () => {
                                          this.updateCondition();
                                        }
                                      );
                                    }}
                                    delete={() => {
                                      let content = this.state.condition;

                                      content.splice(index, 1);
                                      this.setState(
                                        {
                                          condition: content
                                        },
                                        () => {
                                          this.updateCondition();
                                        }
                                      );
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <div className="emptyStateWrapper">
                            <NoData
                              doing={"добавили"}
                              what={"одного условия"}
                            />
                            <Modal isShowModal={this.state.isShowCondition}>
                              <CompetitionCondition
                                length={this.state.conditions.length}
                                setContent={newContent => {
                                  this.setState(
                                    {
                                      condition: [
                                        ...this.state.condition,
                                        newContent
                                      ]
                                    },
                                    () => {
                                      this.updateCondition();
                                    }
                                  );
                                }}
                                hideModal={() => {
                                  this.setState({ isShowCondition: false });
                                }}
                              />
                            </Modal>
                            <AddButton
                              onClick={() => {
                                this.setState({ isShowCondition: true });
                              }}
                            />
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>

              <Line />

              <div className="intent2x" style={{ ...divStyle.page }}>
                {this.state.conditions && this.state.conditions.length !== 0 ? (
                  <div className="productTableHeading">
                    <h2>Форма для участия</h2>
                    <Modal isShowModal={this.state.isShowApplicationForm}>
                      <ApplicationForm
                        length={this.state.conditions.length}
                        setContent={newContent => {
                          this.setState(
                            {
                              forms: [...this.state.forms, newContent]
                            },
                            () => {
                              this.updateCondition();
                            }
                          );
                        }}
                        hideModal={() => {
                          this.setState({ isShowApplicationForm: false });
                        }}
                      />
                    </Modal>
                    <div
                      onClick={() => {
                        this.setState({ isShowApplicationForm: true });
                      }}
                      className="addLink"
                    >
                      {"Добавить".toLocaleUpperCase()}
                    </div>
                  </div>
                ) : null}

                <div
                  style={{
                    paddingTop: 20,
                    paddingBottom: 20
                  }}
                >
                  <Droppable droppableId="forms">
                    {provided => (
                      <div ref={provided.innerRef}>
                        {!this.state.forms ? (
                          <CustomLoader />
                        ) : this.state.forms.length !== 0 ? (
                          this.state.forms.map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {provided => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <ConditionsCard
                                    isForm={true}
                                    index={index}
                                    value={item}
                                    content={this.state.forms}
                                    update={content => {
                                      let form = this.state.forms;
                                      form.splice(index, 1, content);
                                      this.setState(
                                        {
                                          forms: form
                                        },
                                        () => {
                                          this.updateCondition();
                                        }
                                      );
                                    }}
                                    delete={() => {
                                      let form = this.state.forms;
                                      form.splice(index, 1);
                                      this.setState(
                                        {
                                          forms: form
                                        },
                                        () => {
                                          this.updateCondition();
                                        }
                                      );
                                    }}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <div className="emptyStateWrapper">
                            <NoData
                              doing={"добавили"}
                              what={"одной формы для участия"}
                            />
                            <Modal
                              isShowModal={this.state.isShowApplicationForm}
                            >
                              <ApplicationForm
                                length={this.state.conditions.length}
                                setContent={newContent => {
                                  this.setState(
                                    {
                                      forms: [...this.state.forms, newContent]
                                    },
                                    () => {
                                      this.updateCondition();
                                    }
                                  );
                                }}
                                hideModal={() => {
                                  this.setState({
                                    isShowApplicationForm: false
                                  });
                                }}
                              />
                            </Modal>
                            <AddButton
                              onClick={() => {
                                this.setState({ isShowApplicationForm: true });
                              }}
                            />
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            </DragDropContext>
          </UpdateContext.Provider>
        </div>
      );
    }
  }
}
