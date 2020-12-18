import React from "react";
import Modal from "../../components/Modal";
import Line from "../../components/Line";
import { CustomLoader } from "../../atoms/Loader";
import { VideoRow } from "../../components/Tables/VideoRow";
import EditPlaylist from "../../components/Forms/EditPlaylist";
import MenuBar from "../../components/MenuBar";
import { WHITE, GREY, LIGHT_GREY, BLUE } from "../../content/color";
import { style, divStyle, textStyle } from "../../content/styles";
import {
  getPlaylistVideo,
  deactivateVideoPlaylist,
  activateVideoPlaylist
} from "../../utils/api";
import { getParameterFromUrl } from "../../utils/functions";
import { NoData } from "../../components/Gag";
import Pagination from "../../components/Pagination";

export default class PlaylistPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: null,
      id: getParameterFromUrl("id").toString(),
      name: getParameterFromUrl("title").toString(),
      des: getParameterFromUrl("des").toString(),
      active:
        getParameterFromUrl("active").toString() !== "false" ? true : false,
      activePage: getParameterFromUrl("page") - 1,
      pageSize: getParameterFromUrl("page") - 1,
      isShowModal: false
    };
  }
  hideModal = () => {
    this.setState({ isShowModal: false });
  };

  async getData() {
    let data = await getPlaylistVideo(this.state.activePage, this.state.id);
    if (data.error) {
      this.setState({
        playlist: [],
        pageSize: getParameterFromUrl("page") - 1
      });
    } else {
      this.setState({
        playlist: data.data,
        pageSize: !data.attributes.totalCount
          ? this.state.pageSize
          : Math.ceil(data.attributes.totalCount / 10)
      });
    }
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    if (!this.state.playlist) {
      return <CustomLoader />;
    }
    return (
      <>
        <div className="intent">
          <MenuBar name={this.state.name} description={this.state.des} />
          <div style={{ ...style.navigation, paddingBottom: 20 }}>
            <Modal isShowModal={this.state.isShowModal}>
              {
                <EditPlaylist
                  hideModal={this.hideModal}
                  title={{
                    value: this.state.name,
                    setStateValue: name => {
                      this.setState({ name: name });
                    }
                  }}
                  des={{
                    value: this.state.des,
                    setStateValue: name => {
                      this.setState({
                        des: name
                      });
                    }
                  }}
                  id={this.state.id}
                />
              }
            </Modal>
            <div
              onClick={() => {
                this.setState({ isShowModal: true });
              }}
              style={{ marginLeft: 10 }}
            >
              <button
                style={{
                  ...buttonStyle,
                  color: WHITE,

                  backgroundColor: BLUE
                }}
              >
                Редактировать
              </button>
            </div>

            <button
              style={{
                ...buttonStyle,
                color: "#333333",

                border: "1px solid",
                borderColor: GREY,
                backgroundColor: LIGHT_GREY
              }}
              onClick={() => {
                this.state.active
                  ? this.setState({ active: false }, () => {
                      deactivateVideoPlaylist(this.state.id);
                    })
                  : this.setState({ active: true }, () => {
                      activateVideoPlaylist(this.state.id);
                    });
              }}
            >
              {this.state.active ? "Удалить" : "Подключить"}
            </button>
          </div>
        </div>
        <Line />

        <div
          className="intent"
          style={{
            backgroundColor: WHITE
          }}
        >
          <div style={{ ...divStyle.table, ...textStyle.table }}>
            <div style={{ flex: 1 }}>
              <p style={textStyle.cardHeader}>Видео</p>
            </div>
            <div style={{ width: 200 }}>
              <p style={textStyle.cardHeader}>Опубликовано</p>
            </div>
            <div style={{ width: 110 }}>
              <p style={textStyle.cardHeader}>Комментарии</p>
            </div>
          </div>
          <div style={{ paddingTop: 10, paddingBottom: 10 }}>
            {this.state.playlist.length !== 0 ? (
              this.state.playlist.map(item => <VideoRow value={item} />)
            ) : (
              <NoData doing={"добавили"} what={"одного видео"} />
            )}
          </div>
          <Pagination
            link={`/videos/playlist?id=${this.state.id}&title=${this.state.name}&des=${this.state.des}&active=${this.state.active}&page=`}
            activePage={this.state.activePage}
            pageSize={this.state.pageSize}
            setStatePage={page =>
              this.setState({ activePage: page }, () => this.getData())
            }
          />
        </div>
      </>
    );
  }
}

const buttonStyle = {
  fontFamily: "GraphikLCG-Regular",
  fontSize: 14,
  justifyContent: "center",
  padding: 15,
  borderRadius: 5,
  marginRight: 10
};
