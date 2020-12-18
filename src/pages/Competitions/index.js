import React from "react";
import { UpdateContext } from "../../content/context";
import { CustomLoader } from "../../atoms/Loader";
import FlatList from "../../components/FlatList";
import { NoData } from "../../components/Gag";
import { CompetitionCard } from "../../components/Cards/CompetitionCard";
import MenuBar from "../../components/MenuBar";
import Line from "../../components/Line";
import { divStyle } from "../../content/styles";
import { BG_GRADIENT } from "../../content/color";
import { isSubstring, isTimePassed } from "../../utils/functions";
import { getCompetitionList, editStatusCompetitors } from "../../utils/api";
import Pagination from "../../components/Pagination";

function CompetitionsList(props) {
  return (
    props.value
      // .slice(0)
      // .reverse()
      .map(item => <CompetitionCard value={item} />)
  );
}

export default class CompetitionsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      activeId: 0,
      status:
        "statuses=DRAFT&statuses=PUBLISHED&statuses=RESULTS_WAITING&statuses=FINISHED",
      isUpdate: false,
      competitions: null,
      activePage: this.getActivePage() - 1,
      pageSize: 0
    };
  }

  getActivePage = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var vars = url.searchParams.get("page");
    return vars;
  };

  getID = name => {
    for (let i = 0; i < bar.length; i++) {
      if (isSubstring(bar[i].name, name)) {
        return bar[i].id;
      }
    }
    return 0;
  };

  async getData() {
    let data = {};
    switch (this.state.activeId) {
      case 0:
        data = await getCompetitionList(
          this.state.activePage,
          this.state.status
        );
        break;
      case 1:
        data = await getCompetitionList(
          this.state.activePage,
          this.state.status
        );
        break;
      default:
        data = {};
    }
    if (data.error) {
      this.setState({
        competitions: [],
        pageSize: 0,
        activePage: this.state.activePage
      });
    } else {
      this.setState(
        {
          competitions: data.data,
          pageSize: !data.attributes.totalCount
            ? this.state.pageSize
            : Math.ceil(data.attributes.totalCount / 50),
          activePage: this.state.activePage
        },
        () => {
          this.editStatus();
        }
      );
    }
  }

  editStatus() {
    this.state.competitions.map(async item => {
      if (isTimePassed(item.deadline) && item.status === "PUBLISHED") {
        let data = await editStatusCompetitors(item.id, "RESULTS_WAITING");
        if (data.error) {
          this.setState({ isError: true });
        } else {
          this.setState({ isUpdate: true });
        }
      }
    });
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
          activePage: this.getActivePage() - 1
        },
        () => this.getData()
      );
    }
  }

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
              name={"Конкурсы"}
              description={"Создавайте и подводите результаты конкурсов"}
              link={bar[this.state.activeId].link}
            />
            <div className="navBar">
              {bar.map(item => (
                <div
                  className={
                    item.id === this.state.activeId
                      ? "navBarItem active"
                      : "navBarItem"
                  }
                  onClick={() => {
                    this.setState({
                      activeId: item.id,
                      status: item.status
                    });
                  }}
                >
                  <div style={{ cursor: "pointer" }}>{item.name}</div>
                </div>
              ))}
            </div>
          </div>
          <Line />
          <div
            className="intent"
            style={{ ...divStyle.page, paddingTop: 30, paddingBottom: 30 }}
          >
            {!this.state.competitions ? (
              <CustomLoader />
            ) : this.state.competitions.length !== 0 ? (
              <FlatList
                children={<CompetitionsList value={this.state.competitions} />}
                column={360}
              />
            ) : (
              <NoData doing={"создали"} what={"одного конкурса"} />
            )}
          </div>
          <Pagination
            link={"/competitions?page="}
            activePage={this.state.activePage}
            pageSize={this.state.pageSize}
            setStatePage={page =>
              this.setState({ activePage: page }, () => this.getData())
            }
          />
        </UpdateContext.Provider>
      </div>
    );
  }
}

const bar = [
  {
    id: 0,
    name: "Все",
    status:
      "statuses=DRAFT&statuses=PUBLISHED&statuses=RESULTS_WAITING&statuses=FINISHED",
    link: "/add_competition"
  },
  {
    id: 1,
    name: "Архив",
    status: "statuses=ARCHIVE"
    // link: "/add_competition"
  }
];
