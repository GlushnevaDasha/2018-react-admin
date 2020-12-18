import React from "react";
import { CustomLoader } from "../../atoms/Loader";
import FlatList from "../../components/FlatList";
import { ChannelCard } from "../../components/Cards/ChannelCard";
import { WHITE } from "../../content/color";
import { divStyle } from "../../content/styles";
import { getChannels } from "../../utils/api";
import { getActivePage } from "../../utils/functions";
import { NoData } from "../../components/Gag";
import { UpdateContext } from "../../content/context";
import Pagination from "../../components/Pagination";

function ChannelList(props) {
  return props.value
    .slice(0)
    .reverse()
    .map(item => <ChannelCard value={item} />);
}

class ChannelPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: getActivePage() - 1,
      pageSize: getActivePage() - 1,
      channels: null
    };
  }

  async getData() {
    let data = await getChannels(this.state.activePage);
    if (data.error) {
      this.setState({
        channels: !this.state.channels ? [] : this.state.channels,
        pageSize: getActivePage() - 1
      });
    } else {
      this.setState({
        channels: data.data,
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

  render() {
    if (!this.state.channels) {
      return <CustomLoader />;
    }
    return (
      <div
        className="intent"
        style={{
          backgroundColor: WHITE,
          ...divStyle.table
        }}
      >
        {this.state.channels.length !== 0 ? (
          <FlatList
            children={<ChannelList value={this.state.channels} />}
            column={300}
          />
        ) : (
          <NoData doing={"подключили"} what={"один канал"} />
        )}
        <Pagination
          link={`/videos/channels?page=`}
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
export default ChannelPage;
ChannelPage.contextType = UpdateContext;
