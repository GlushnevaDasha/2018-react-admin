import React from "react";
import { UpdateContext } from "../../content/context";
import MenuBar from "../../components/MenuBar";
import Line from "../../components/Line";
import { CustomLoader } from "../../atoms/Loader";
import FlatList from "../../components/FlatList";
import { PodcastCard } from "../../components/Cards/PodcastCard";
import { getAllPodcast } from "../../utils/api";
import { NoData } from "../../components/Gag";

function PodcastList(props) {
  return props.value.map((item, index) => (
    <PodcastCard key={index} value={item} />
  ));
}

export default class PodcastsPage extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = {
      podcasts: null,
      isUpdate: false
    };
    this.setUpdate = this.setUpdate.bind(this);
  }

  async getData() {
    let data = await getAllPodcast();
    this.setState({
      podcasts: data.data
    });
  }

  componentDidMount() {
    this.getData();
  }

  setUpdate() {
    this.setState({
      isUpdate: !this.state.isUpdate
    });
  }

  componentDidUpdate() {
    if (this.state.isUpdate) {
      this.getData();
      this.setState({
        isUpdate: !this.state.isUpdate
      });
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
          <div className="MenuBar wrapper">
            <MenuBar
              name={"Подкасты"}
              description={"Загружайте подкасты"}
              forma={"Podcast"}
            />
          </div>
          <Line />
          <div className="pageContent">
            {!this.state.podcasts ? (
              <CustomLoader />
            ) : this.state.podcasts.length !== 0 ? (
              <FlatList
                children={<PodcastList value={this.state.podcasts} />}
                column={350}
              />
            ) : (
              <NoData doing={"добавили"} what={"одного подкаста"} />
            )}
          </div>
        </UpdateContext.Provider>
      </div>
    );
  }
}
