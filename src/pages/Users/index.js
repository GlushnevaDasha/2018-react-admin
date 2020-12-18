import React from "react";
import { UpdateContext } from "../../content/context";
import { Link } from "react-router-dom";
import { NoData } from "../../components/Gag";
import MenuBar from "../../components/MenuBar";
import Line from "../../components/Line";
import { divStyle } from "../../content/styles";
import { WHITE, BG_GRADIENT } from "../../content/color";
import { getAllUsers } from "../../utils/api";
import { Search } from "../../content/Icons";
import Pagination from "../../components/Pagination";
import { MobileUserRow } from "../../components/Tables/MobileUserRow";
import { CustomLoader } from "../../atoms/Loader";

export default class UsersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      search: "",
      activeId: 0,
      id: 0,
      activePage: this.getActivePage() - 1,
      isUpdate: false,
      pageSize: 0,
      banOnly: false
    };
    this.handleChange = this.handleChange.bind(this);
  }

  getActivePage = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var vars = url.searchParams.get("page");
    return vars;
  };

  componentDidMount() {
    this.getData();
  }

  async getData() {
    this.setState({
      isFetch: false,
      banOnly: this.state.id !== 0 ? true : false
    });
    let data = await getAllUsers(
      this.state.activePage,
      this.state.search,
      this.state.banOnly
    );
    if (data.error) {
      this.setState({
        users: [],
        pageSize: 0,
        isError: true
      });
    } else {
      this.setState({
        users: data.data,
        pageSize: !data.attributes.totalCount
          ? this.state.pageSize
          : Math.ceil(data.attributes.totalCount / 20)
      });
    }
  }

  handleChange(event) {
    this.setState(
      {
        search: event.target.value
      },
      () => this.getData()
    );
  }

  componentDidUpdate() {
    if (this.state.id !== this.state.activeId || this.state.isUpdate) {
      this.setState(
        {
          id: this.state.activeId,
          isUpdate: false,
          activePage: this.getActivePage() - 1
        },
        () => this.getData()
      );
    }
  }

  render() {
    return (
      <div>
        <div className="intent" style={{ backgroundImage: BG_GRADIENT }}>
          <MenuBar
            name={"Пользователи"}
            description={"Управляйте пользователями приложения"}
          />
          <div className="navBar">
            {bar.map(item => (
              <Link
                className={
                  item.id === this.state.activeId
                    ? "navBarItem active"
                    : "navBarItem"
                }
                onClick={() => {
                  this.setState({
                    activeId: item.id,
                    banOnly: !this.state.banOnly
                  });
                }}
                to={"/users?page=1"}
              >
                <div style={{ cursor: "pointer" }}>{item.name}</div>
              </Link>
            ))}
          </div>
        </div>
        <Line />
        <div style={divStyle.page}>
          <div className="intent" style={{ paddingTop: 40 }}>
            <div className="tableSearchInput" style={{ marginBottom: 28 }}>
              <div style={{ paddingLeft: 15 }}>
                <Search />
              </div>

              <input
                style={{
                  backgroundColor: WHITE
                }}
                type="text"
                placeholder={"Для поиска введите имя пользователя"}
                className="input100"
                value={this.state.search}
                onChange={this.handleChange}
              />
            </div>
            <div className="tableHead">
              <div style={{ width: "52%" }}>
                <p>Пользователь</p>
              </div>
              <div style={{ width: "15%" }}>
                <p>Аккаунт</p>
              </div>
              <div style={{ width: "20%" }}>
                <p>Комментарии</p>
              </div>
            </div>
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
              {!this.state.users ? (
                <CustomLoader />
              ) : this.state.users.length !== 0 ? (
                this.state.users.map(item => <MobileUserRow value={item} />)
              ) : (
                <NoData text={"Пользователей еще нет"} />
              )}
            </UpdateContext.Provider>
          </div>
          {!this.state.users || this.state.users.length === 0 ? null : (
            <Pagination
              link={"/users?page="}
              activePage={this.state.activePage}
              pageSize={this.state.pageSize}
              setStatePage={page =>
                this.setState({ activePage: page }, () => this.getData())
              }
            />
          )}
        </div>
      </div>
    );
  }
}

const bar = [
  {
    id: 0,
    name: "Все"
  },
  {
    id: 1,
    name: "Чёрный список"
  }
];
