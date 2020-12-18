import React from "react";
import { Link } from "react-router-dom";
import { UpdateContext } from "../../content/context";
import { CommentRow } from "../../components/Tables/CommentRow";
import MenuBar from "../../components/MenuBar";
import Line from "../../components/Line";
import { divStyle } from "../../content/styles";
import { WHITE, BG_GRADIENT } from "../../content/color";
import { Search } from "../../content/Icons";
import { CustomLoader } from "../../atoms/Loader";
import {
  getComments,
  getDeletedComments,
  getReportedComments,
  getPublishedComments
} from "../../utils/api";
import {
  isSubstring,
  getActivePage,
  getParameterFromUrl
} from "../../utils/functions";
import { NoData } from "../../components/Gag";
import Pagination from "../../components/Pagination";

export default class CommentsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: null,
      isError: false,
      isUpdate: false,
      isFeatch: false,
      activeId: this.getID(),
      id: this.getID(),
      search: "",
      searchText: "",
      activePage: getActivePage() - 1,
      pageSize: 0
    };
    this.handleChange = this.handleChange.bind(this);
  }

  getID = () => {
    for (let i = 0; i < bar.length; i++) {
      if (isSubstring(bar[i].link, getParameterFromUrl("status"))) {
        return bar[i].id;
      }
    }
    return 0;
  };

  async getData() {
    this.setState({ isFeatch: true }, async () => {
      let data = {};
      switch (getParameterFromUrl("status")) {
        case "all":
          data = await getComments(this.state.activePage, this.state.search);
          break;
        case "publish":
          data = await getPublishedComments(this.state.activePage);
          break;
        case "delete":
          data = await getDeletedComments(this.state.activePage);
          break;
        case "report":
          data = await getReportedComments(this.state.activePage);
          break;
        default:
          data = { attributes: { totalCount: 0 }, error: true };
      }
      if (data.error) {
        this.setState({
          comments: [],
          pageSize: 0,
          isError: true,
          isFeatch: false
        });
      } else {
        this.setState({
          comments: data.data,
          isFeatch: false,
          pageSize: !data.attributes.totalCount
            ? this.state.pageSize
            : Math.ceil(data.attributes.totalCount / 50)
        });
      }
    });
  }

  handleChange(event) {
    this.setState(
      {
        search: event.target.value
      },
      () => this.getData()
    );
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate() {
    if (this.state.id !== this.state.activeId || this.state.isUpdate) {
      this.setState(
        {
          id: this.state.activeId,
          isUpdate: false,
          activePage: getActivePage() - 1
        },
        () => this.getData()
      );
    }
  }

  keyPressed = event => {
    if (event.key === "Enter") {
      this.setState(
        {
          search: this.state.searchText
        },
        () => {
          this.getData();
        }
      );
    }
  };

  render() {
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
          <div className="intent" style={{ backgroundImage: BG_GRADIENT }}>
            <MenuBar
              name={"Комментарии"}
              description={"Управляйте комментариями пользователей"}
            />
            <div className="navBar">
              {bar.map((item, index) => (
                <Link
                  key={index}
                  className={
                    item.id === this.state.activeId
                      ? "navBarItem active"
                      : "navBarItem"
                  }
                  onClick={() => {
                    this.setState({
                      activeId: item.id
                    });
                  }}
                  to={`${item.link}1`}
                >
                  <div style={{ cursor: "pointer" }}>{item.name}</div>
                </Link>
              ))}
            </div>
          </div>
          <Line />
          <div style={divStyle.page}>
            <div className="intent" style={{ paddingTop: 40 }}>
              {bar[this.state.activeId].id === 0 ? (
                <div className="tableSearchInput" style={{ marginBottom: 28 }}>
                  <div style={{ paddingLeft: 15 }}>
                    <Search />
                  </div>
                  <input
                    style={{
                      backgroundColor: WHITE
                    }}
                    type="text"
                    placeholder={"Поиск по тексту комментария"}
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
              ) : null}

              {!this.state.comments || this.state.isFeatch ? (
                <CustomLoader />
              ) : this.state.comments.length !== 0 ? (
                this.state.comments.map((item, index) => (
                  <CommentRow value={item} key={index} />
                ))
              ) : (
                <NoData text={"Пользователи еще ничего не прокомментировали"} />
              )}
              {!this.state.comments ||
              this.state.isFeatch ||
              this.state.comments.length === 0 ? null : (
                <Pagination
                  link={bar[this.state.activeId].link}
                  activePage={this.state.activePage}
                  pageSize={this.state.pageSize}
                  setStatePage={page => this.setState({ activePage: page })}
                />
              )}
            </div>
          </div>
        </UpdateContext.Provider>
      </div>
    );
  }
}

const bar = [
  {
    id: 0,
    name: "Все",
    link: "/comments?status=all&page="
  },
  {
    id: 1,
    name: "Опубликованные",
    link: "/comments?status=publish&page="
  },
  {
    id: 2,
    name: "Удаленные",
    link: "/comments?status=delete&page="
  },
  {
    id: 3,
    name: "Жалобы",
    link: "/comments?status=report&page="
  }
];
