import React from "react";
import { CustomLoader } from "../../atoms/Loader";
import { SocialPostRow } from "../../components/Tables/SocialPostRow";
import { getPostsList } from "../../utils/api";
import { UpdateContext } from "../../content/context";
import { NoData } from "../../components/Gag";
import Pagination from "../../components/Pagination";

class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetch: false,
      posts: null,
      activePage: this.getActivePage() - 1,
      pageSize: this.getActivePage()
    };
  }

  async getData() {
    this.setState({
      isFetch: false
    });
    let data = await getPostsList(this.state.activePage);
    if (data.error) {
      this.setState({
        posts: 0,
        isFetch: true
      });
    } else {
      this.setState({
        isFetch: true,
        posts: data.data,
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
    if (!this.state.posts) {
      return <CustomLoader />;
    }
    return (
      <div className="intent">
        <div className="tableHead">
          <div style={{ width: "65%" }}>
            <p>Пост</p>
          </div>
          <div className="secondary" style={{ width: "20%" }}>
            <p>Опубликовано</p>
          </div>
          <div className="secondary" style={{ width: "15%" }}>
            <p>Ссылка</p>
          </div>
        </div>

        {this.state.posts.length !== 0 ? (
          this.state.posts.map(item => <SocialPostRow value={item} />)
        ) : (
          <NoData doing={"добавили"} what={"один пост из социальных сетей"} />
        )}

        <Pagination
          link={"/feed/social_network?page="}
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

export default PostPage;
PostPage.contextType = UpdateContext;
