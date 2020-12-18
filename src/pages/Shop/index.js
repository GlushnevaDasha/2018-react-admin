import React from "react";
import { UpdateContext } from "../../content/context";
import { CustomLoader } from "../../atoms/Loader";
import MenuBar from "../../components/MenuBar";
import Line from "../../components/Line";
import { divStyle } from "../../content/styles";
import { BG_GRADIENT } from "../../content/color";
import { isSubstring } from "../../utils/functions";
import { getProductList } from "../../utils/api";
import FlatList from "../../components/FlatList";
import { ShopCard } from "../../components/Cards/ShopCard";
import { NoData } from "../../components/Gag";
import Pagination from "../../components/Pagination";

function ShopList(props) {
  return props.value
    .slice(0)
    .reverse()
    .map(item => <ShopCard value={item} />);
}

export default class ShopPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isUpdate: false,
      product: null,
      activePage: this.getActivePage() - 1,
      pageSize: 0,
      isFetch: false,
      activeId: 0,
      id: 0,
      status:
        "productSelectionStatuses=DRAFT&productSelectionStatuses=PUBLISHED"
    };
  }

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
        data = await getProductList(this.state.activePage, this.state.status);
        break;
      case 1:
        data = await getProductList(this.state.activePage, this.state.status);
        break;
      case 2:
        data = await getProductList(this.state.activePage, this.state.status);
        break;
      default:
        data = {};
    }
    if (data.error) {
      this.setState({
        product: [],
        pageSize: 0
      });
    } else {
      this.setState({
        product: data.data,
        pageSize: !data.attributes.totalCount
          ? this.state.pageSize
          : Math.ceil(data.attributes.totalCount / 10)
      });
    }
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
              name={"Годнота"}
              description={"Раздел с подборками продуктов от партнёров"}
              link={"/add_shop"}
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
            {!this.state.product ? (
              <CustomLoader />
            ) : this.state.product.length !== 0 ? (
              <FlatList
                children={<ShopList value={this.state.product} />}
                column={360}
              />
            ) : (
              <NoData doing={"создали"} what={"одной подборки"} />
            )}
            <Pagination
              link={"/shop?page="}
              activePage={this.state.activePage}
              pageSize={this.state.pageSize}
              setStatePage={page =>
                this.setState({ activePage: page }, () => this.getData())
              }
            />
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
    status: "productSelectionStatuses=DRAFT&productSelectionStatuses=PUBLISHED"
  },
  {
    id: 1,
    name: "Ожидают",
    status: "productSelectionStatuses=DRAFT"
  },
  {
    id: 2,
    name: "Архив",
    status: "productSelectionStatuses=ARCHIVE"
  }
];
