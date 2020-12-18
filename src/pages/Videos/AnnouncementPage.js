import React from "react";
import { AnnouncementRow } from "../../components/Tables/AnnouncementRow";
import Loader from "../../atoms/Loader";
import { WHITE } from "../../content/color";
import { divStyle, textStyle } from "../../content/styles";
import { getVideoList } from "../../utils/api";
import { NoData } from "../../components/Gag";
import { UpdateContext } from "../../content/context";
import Pagination from "../../components/Pagination";

class AnnouncementPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      announ: null,
      activePage: this.getActivePage() - 1,
      pageSize: this.getSizePage()
    };
  }

  async getData() {
    let data = await getVideoList(this.state.activePage);
    if (data.error) {
      this.setState({
        announ: [],
        pageSize: 0
      });
    } else {
      this.setState({
        announ: data.data,
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

  async getSizePage() {
    let data = await getVideoList(0);
    if (data.error) {
      this.setState({
        pageSize: this.getActivePage()
      });
    } else {
      this.setState({
        pageSize: !data.attributes.totalCount
          ? this.state.pageSize
          : Math.ceil(data.attributes.totalCount / 10)
      });
    }
  }

  render() {
    if (!this.state.announ) {
      return <Loader />;
    }
    return (
      <div
        className="intent"
        style={{
          backgroundColor: WHITE
        }}
      >
        <div style={{ ...divStyle.table, ...textStyle.table }}>
          <div style={{ flex: 2 }}>
            <p style={textStyle.cardHeader}>Пост</p>
          </div>
          <div style={{ width: 200 }}>
            <p style={textStyle.cardHeader}>Опубликовано</p>
          </div>
          <div style={{ width: 150 }}>
            <p style={textStyle.cardHeader}>Комментарии</p>
          </div>
          <div style={{ width: 100 }}>
            <p style={textStyle.cardHeader}>Ссылка</p>
          </div>
        </div>
        <div>
          {this.state.announ.length !== 0 ? (
            this.state.announ.map(item => <AnnouncementRow value={item} />)
          ) : (
            <NoData doing={"добавили"} what={"один анонс"} />
          )}
        </div>

        <Pagination
          link={"/videos/announcement?page="}
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
export default AnnouncementPage;
AnnouncementPage.contextType = UpdateContext;
