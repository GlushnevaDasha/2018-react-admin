import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { UpdateContext } from "../../content/context";
import Line from "../../components/Line";
import { WHITE, BG_GRADIENT } from "../../content/color";
import { getParameterFromUrl } from "../../utils/functions";
import {
  countСompetition,
  getCompetitors,
  getCompetition
} from "../../utils/api";
import { Search } from "../../content/Icons";
import FlatList from "../../components/FlatList";
import { PrizeCard } from "../../components/Cards/PrizeCard";
import { UsersCompetitionRow } from "../../components/Tables/UsersCompetitionRow";
import { CustomLoader } from "../../atoms/Loader";
import { NoData } from "../../components/Gag";

import "../../stylesheets/pages/Competitions/CompetitionResults.css";

export default class CompetitionResults extends React.Component {
  divRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      id: getParameterFromUrl("id"),
      activePrize: 0,
      name: "",
      count: 0,
      status: "",
      search: "",
      searchText: "",
      item: null,
      newItems: null,
      isError: false,
      isUpdate: false,
      isSearch: false,
      prize: [],
      winner: [],
      conditions: null,
      isFeath: true
    };
  }

  srcollInfinity() {
    this.divRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

  keyPressed = event => {
    if (event.key === "Enter") {
      this.setState(
        {
          search: this.state.searchText
        },
        () => {
          this.getCompetition();
        }
      );
    }
  };

  async getCompetition() {
    let count = this.state.search !== "" ? this.state.search - 6 : 0;
    let data = await getCompetitors(this.state.id, 1000, count);

    if (data.error) {
      this.setState({
        isError: true
      });
    } else {
      this.setState(
        {
          isFeath: false,
          item: data,
          newItems: data
        },
        () => {
          this.srcollInfinity();
        }
      );
    }
  }

  async getData() {
    let competition = await getCompetition(this.state.id);
    if (competition.error) {
      this.setState({
        isError: true
      });
    } else {
      this.setState({
        status: competition.status,
        prize: competition.items,
        name: competition.name,
        conditions: competition.conditions,
        winner: this.getAllWinner(competition)
      });
    }
    let count = await countСompetition(this.state.id);
    if (count.error) {
      this.setState({
        isError: true
      });
    } else {
      this.setState({
        count: count.count
      });
      if (count.count !== 0) {
        let data;
        count.count <= 1000
          ? (data = await getCompetitors(this.state.id, count.count, 0))
          : (data = await getCompetitors(this.state.id, 1000, 0));
        if (data.error) {
          this.setState({
            isError: true
          });
        } else {
          this.setState({
            isFeath: false,
            item: data,
            newItems: data
          });
        }
      } else {
        this.setState({
          isFeath: false,
          item: []
        });
      }
    }
  }

  getAllWinner = competition => {
    let winner = [];
    competition.items.map(item => {
      winner.push({
        id: item.id,
        name: item.name,
        winner: item.winner
      });
    });
    return winner;
  };

  componentDidMount() {
    this.setState({ search: "", searchText: "" });
    this.getData();
  }

  componentDidUpdate() {
    if (this.state.isUpdate) {
      this.setState(
        {
          isUpdate: false
        },
        () => {
          this.getData();
        }
      );
    }
  }

  render() {
    return this.state.isFeath ? (
      <CustomLoader styleConteiner={{ backgroundColor: BG_GRADIENT }} />
    ) : (
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
            className="competitionResults intent"
            style={{ backgroundImage: BG_GRADIENT }}
          >
            <div className="header">
              <div>
                <span>{this.state.name.toLocaleUpperCase()}</span>
                <h1>Приняло участие: {this.state.count}</h1>
              </div>

              <a
                className="large_button active"
                href={"https://www.random.org/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                Открыть Random.org
              </a>
            </div>

            <div>
              {this.state.prize.length !== 0 ? (
                <FlatList
                  children={this.state.prize.map((item, index) => (
                    <PrizeCard
                      key={index}
                      index={index}
                      value={item}
                      result={true}
                      isActive={this.state.activePrize !== index ? false : true}
                      editActive={index => {
                        this.setState({
                          activePrize: index
                        });
                      }}
                    />
                  ))}
                  column={160}
                />
              ) : null}
            </div>
          </div>
          <Line />

          <div className="intent" style={{ paddingTop: 40 }}>
            {this.state.item.length !== 0 ? (
              <div className="tableSearchInput">
                <div style={{ paddingLeft: 15 }}>
                  <Search />
                </div>
                <input
                  style={{
                    backgroundColor: WHITE
                  }}
                  type="text"
                  placeholder={"Введите номер участника"}
                  className="input100"
                  value={this.state.searchText}
                  onKeyPress={this.keyPressed}
                  onChange={event => {
                    this.setState({
                      searchText: event.target.value
                    });
                  }}
                />
              </div>
            ) : (
              <NoData text={"Еще никто не учавствует в конкурсе"} />
            )}

            <div className="competitionResultsTable">
              <div>
                {this.state.item.length !== 0 ? (
                  <div className="tableHeadWrapper">
                    <div className="tableHead" style={{ minWidth: 80 }}>
                      №
                    </div>

                    {this.state.conditions.map((item, index) =>
                      item.field ? (
                        <div
                          key={index}
                          className="tableHead"
                          style={{ width: 250 }}
                        >
                          {item.title}
                        </div>
                      ) : null
                    )}
                    <div className="tableHead" style={{ minWidth: 300 }}>
                      Пользователь
                    </div>
                  </div>
                ) : null}
                <div
                  style={{ position: "relative", top: 42, overflowY: "scroll" }}
                >
                  <div
                    style={{ height: "calc(100vh - 100px)", overflow: "auto" }}
                    ref={this.divRef}
                  >
                    <InfiniteScroll
                      pageStart={0}
                      threshold={10}
                      initialScrollY={0}
                      loadMore={async () => {
                        let data =
                          this.state.count <= 1000
                            ? await getCompetitors(
                                this.state.id,
                                this.state.count,
                                this.state.item[this.state.item.length - 1]
                                  .localId
                              )
                            : await getCompetitors(
                                this.state.id,
                                1000,
                                this.state.item[this.state.item.length - 1]
                                  .localId
                              );
                        if (data.error) {
                          this.setState({
                            isError: true
                          });
                        } else {
                          this.setState({
                            isFeath: false,
                            item: [...this.state.item, ...data]
                          });
                        }
                      }}
                      hasMore={
                        this.state.item.length >= this.state.count
                          ? false
                          : true
                      }
                      loader={<CustomLoader />}
                      useWindow={false}
                    >
                      {this.state.search === ""
                        ? this.state.item.map((item, index) => {
                            return (
                              <UsersCompetitionRow
                                key={index}
                                status={this.state.status}
                                value={item}
                                activePrize={
                                  this.state.winner[this.state.activePrize].id
                                }
                                prize={this.state.winner}
                                condition={this.state.conditions}
                              />
                            );
                          })
                        : this.state.item.map((item, index) => {
                            return item.localId >= this.state.search - 5 &&
                              this.state.search >= 10 ? (
                              <UsersCompetitionRow
                                key={index}
                                search={
                                  item.localId.toString() ===
                                  this.state.search.toString()
                                    ? true
                                    : false
                                }
                                status={this.state.status}
                                value={item}
                                activePrize={
                                  this.state.winner[this.state.activePrize].id
                                }
                                prize={this.state.winner}
                                condition={this.state.conditions}
                              />
                            ) : null;
                          })}
                    </InfiniteScroll>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UpdateContext.Provider>
      </div>
    );
  }
}
