import React from "react";
import { UpdateContext } from "../../content/context";
import { ExclusiveRow } from "../../components/Tables/ExclusiveRow";
import { CustomLoader } from "../../atoms/Loader";
import { getFeedList } from "../../utils/api";
import { NoData } from "../../components/Gag";
import Pagination from "../../components/Pagination";

class ExclusivePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exclusives: null,
      activePage: this.getActivePage() - 1,
      pageSize: 0
    };
  }

  async getData() {
    let data = await getFeedList(this.state.activePage);
    if (data.error) {
      this.setState({
        exclusives: [],
        pageSize: 0,
        isFetch: true
      });
    } else {
      this.setState({
        exclusives: data.data,
        pageSize: !data.attributes.totalCount
          ? this.state.pageSize
          : Math.ceil(data.attributes.totalCount / 10)
      });
    }
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate() {
    if (this.context.isUpdate) {
      this.getData();
      this.context.setState();
    }
  }

  getActivePage = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var vars = url.searchParams.get("page");
    return vars;
  };

  render() {
    if (!this.state.exclusives) {
      return <CustomLoader />;
    }
    return (
      <div className="intent">
        <div className="tableHead">
          <div style={{ width: "45%" }}>
            <p>Заголовок</p>
          </div>
          <div className="secondary" style={{ width: "15%" }}>
            <p>Метка</p>
          </div>
          <div className="secondary" style={{ width: "20%" }}>
            <p>Автор</p>
          </div>
          <div className="secondary" style={{ width: "20%" }}>
            <p>Статус</p>
          </div>
        </div>

        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
          {this.state.exclusives.length !== 0 ? (
            this.state.exclusives.map(item =>
              item.status !== "DELETED" ? <ExclusiveRow value={item} /> : null
            )
          ) : (
            <NoData doing={"добавили"} what={"один эксклюзивный пост"} />
          )}
        </div>

        <Pagination
          link={"/feed/exclusives?page="}
          activePage={this.state.activePage}
          pageSize={this.state.pageSize}
          setStatePage={page =>
            this.setState({ activePage: page }, () => this.getData())
          }
        />
      </div>
    );
  }
}
export default ExclusivePage;
ExclusivePage.contextType = UpdateContext;
