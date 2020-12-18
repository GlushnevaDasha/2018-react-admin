import React from "react";
import { VideoRow } from "../../components/Tables/VideoRow";
import { CustomLoader } from "../../atoms/Loader";
import { getVideoList } from "../../utils/api";
import { getActivePage } from "../../utils/functions";
import { NoData } from "../../components/Gag";
import { UpdateContext } from "../../content/context";
import Pagination from "../../components/Pagination";

export default class VideoPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: null,
      activePage: getActivePage() - 1,
      pageSize: getActivePage() - 1
    };
  }

  async getData() {
    let data = await getVideoList(this.state.activePage);
    if (data.error) {
      this.setState({
        pageSize: getActivePage() - 1,
        videos: []
      });
    } else {
      this.setState({
        pageSize: !data.attributes.totalCount
          ? this.state.pageSize
          : Math.ceil(data.attributes.totalCount / 10),
        videos: data.data
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

  render() {
    if (!this.state.videos) {
      return <CustomLoader />;
    }
    return (
      <div className="intent">
        <div className="tableHead">
          <div style={{ width: "65%" }}>
            <p>Видео</p>
          </div>
          <div className="secondary" style={{ width: "20%" }}>
            <p>Опубликовано</p>
          </div>
          <div className="secondary" style={{ width: "15%" }}>
            <p>Комментарии</p>
          </div>
        </div>

        {this.state.videos.length !== 0 ? (
          this.state.videos.map(item => <VideoRow value={item} />)
        ) : (
          <NoData doing={"добавили"} what={"одного видео"} />
        )}

        <Pagination
          link={"/videos/video?page="}
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
VideoPage.contextType = UpdateContext;
