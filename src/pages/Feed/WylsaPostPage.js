import React from "react";
import { WylsaPostRow } from "../../components/Tables/WylsaPostRow";
import { CustomLoader } from "../../atoms/Loader";
import { WHITE } from "../../content/color";
import { getWPPostsList } from "../../utils/api";
import { NoData } from "../../components/Gag";
import Pagination from "../../components/Pagination";

class WylsaPostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wylsaPosts: null,
      activePage: this.getActivePage() - 1,
      pageSize: this.getActivePage() - 1
    };
  }

  async getData() {
    let data = await getWPPostsList(this.state.activePage);
    if (data.error) {
      this.setState({
        wylsaPosts: [],
        pageSize: this.getActivePage() - 1
      });
    } else {
      this.setState({
        wylsaPosts: data.data,
        pageSize: !data.attributes.totalCount
          ? this.state.pageSize
          : Math.ceil(data.attributes.totalCount / 50)
      });
    }
  }

  componentDidMount() {
    this.getData();
  }

  getActivePage = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var vars = url.searchParams.get("page");
    return vars;
  };

  render() {
    if (!this.state.wylsaPosts) {
      return <CustomLoader />;
    }
    return (
      <div
        className="intent"
        style={{ backgroundColor: WHITE }}
      >
        <div className="tableHead">
          <div style={{ width: "60%" }}>
            <p>Заголовок</p>
          </div>
          <div className="secondary" style={{ width: "23%" }}>
            <p>Автор</p>
          </div>
          <div className="secondary" style={{ width: "10%" }}>
            <p>Просмотры</p>
          </div>
        </div>

        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
          {this.state.wylsaPosts.length !== 0 ? (
            this.state.wylsaPosts.map(item => <WylsaPostRow value={item} />)
          ) : (
            <NoData doing={"добавили"} what={"один пост"} />
          )}
        </div>

        <Pagination
          link={"/feed/wylsa_posts?page="}
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
export default WylsaPostPage;
