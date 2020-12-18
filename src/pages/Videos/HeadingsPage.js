import React from "react";
import FlatList from "../../components/FlatList";
import { HeadingCard } from "../../components/Cards/HeadingCard";
import { divStyle } from "../../content/styles";
import { WHITE, BLUE } from "../../content/color";
import { getPlaylists } from "../../utils/api";
// import { getActivePage } from "../../utils/functions";
import { CustomLoader } from "../../atoms/Loader";
import { NoData } from "../../components/Gag";
import { UpdateContext } from "../../content/context";
import { IconAdd } from "../../content/Icons";
// import Pagination from "../../components/Pagination";

function HeadingList(props) {
  return props.value
    .slice(0)
    .reverse()
    .map(item => <HeadingCard value={item} />);
}

class HeadingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // activePage: getActivePage() - 1,
      // pageSize: getActivePage() - 1,
      playlist: null
    };
  }

  async getData() {
    let data = await getPlaylists();
    if (data.error) {
      this.setState({
        playlist: []
        // pageSize: getActivePage() - 1
      });
    } else {
      this.setState({
        playlist: data
        // pageSize: !data.attributes.totalCount
        //   ? this.state.pageSize
        //   : Math.ceil(data.attributes.totalCount / 10)
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
    if (!this.state.playlist) {
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
        {this.state.playlist.length !== 0 ? (
          <FlatList children={<HeadingList value={this.state.playlist} />} />
        ) : (
          <>
            <NoData doing={"создали"} what={"одной рубрики"} />
            <div
              style={{
                width: 125,
                display: "flex",
                backgroundColor: BLUE,
                padding: 5,
                borderRadius: 30,
                alignItems: "center",
                margin: "auto"
              }}
            >
              <div style={{ paddingRight: 10 }}>
                <IconAdd />
              </div>
              <div>
                <p
                  style={{
                    textAlign: "center",
                    font: "lighter 14px/22px GraphikLCG-Regular",
                    color: WHITE
                  }}
                >
                  {"Добавить"}
                </p>
              </div>
            </div>
          </>
        )}
        {/* <Pagination
          link={"/headings?page="}
          activePage={this.state.activePage}
          pageSize={this.state.pageSize}
          setStatePage={page =>
            this.setState({ activePage: page }, () => this.getData())
          }
        /> */}
      </div>
    );
  }
}

export default HeadingPage;
HeadingPage.contextType = UpdateContext;
