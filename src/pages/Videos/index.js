import React from "react";
import { UpdateContext } from "../../content/context";
import Line from "../../components/Line";
import Link from "../../atoms/CustomLink";
import VideoPage from "./VideosPage";
// import AnnouncementPage from "./AnnouncementPage";
import HeadingsPage from "./HeadingsPage";
import ChannelPage from "./ChannelPage";
import MenuBar from "../../components/MenuBar";
import { divStyle } from "../../content/styles";
import { isSubstring } from "../../utils/functions";
import { WHITE, BG_GRADIENT } from "../../content/color";

export default class VideosPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeId: this.getID(),
      isUpdate: false
    };
    this.setUpdate = this.setUpdate.bind(this);
  }

  setUpdate() {
    this.setState({
      isUpdate: !this.state.isUpdate
    });
  }

  getID = () => {
    let href = window.location.href.split("?");
    for (let i = 0; i < bar.length; i++) {
      let page = bar[i].to.split("?");
      if (isSubstring(href[0], page[0])) {
        return bar[i].id;
      }
    }
    return 0;
  };

  componentDidUpdate() {
    if (this.state.activeId !== this.getID()) {
      this.setState({
        activeId: this.getID()
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
          <div className="intent" style={{ backgroundImage: BG_GRADIENT }}>
            <MenuBar
              name={bar[this.state.activeId].name}
              description={bar[this.state.activeId].description}
              forma={bar[this.state.activeId].typeForm}
              params={bar[this.state.activeId].params}
            />

            <div className="navBar">
              {bar.map(item => (
                <div
                  onClick={() => {
                    this.setState({
                      activeId: item.id
                    });
                  }}
                >
                  <Link
                    link={item.to}
                    name={item.name}
                    isActive={item.id !== this.state.activeId ? false : true}
                  />
                </div>
              ))}
            </div>
          </div>
          <Line />
          <div
            style={{
              backgroundColor: WHITE,
              ...divStyle.page,
              height: "100%"
            }}
          >
            {bar[this.state.activeId].component}
          </div>
        </UpdateContext.Provider>
      </div>
    );
  }
}

const bar = [
  {
    id: 0,
    name: "Видео",
    description: "Все опубликованные в приложении видео",
    to: "/videos/video?page=1",
    typeForm: "URL",
    params: {
      header: "Поделитесь видео",
      linkDesc: "Ссылка на YouTube видео",
      reminder:
        "Напоминаем, что видео из подключенных каналов публикуются автоматически."
    },
    component: <VideoPage />
  },
  // {
  //   id: 1,
  //   name: "Анонсы",
  //   description: "Анонсируйте стримы и будущие премьеры",
  //   to: "/videos/announcement?page=1",
  //   typeForm: 2,
  //   params: {
  //     header: "Создайте анонс",
  //     linkDesc: "Ссылка на видео YouTube или Twitch",
  //     reminder:
  //       "Напоминаем, что видео из подключенных каналов публикуются автоматически.",
  //     cover: true
  //   },
  //   component: <AnnouncementPage />
  // },
  {
    id: 1,
    name: "Рубрики",
    description: "Добавляйте плейлисты из YouTube",
    to: "/videos/headings",
    typeForm: "Headings",
    component: <HeadingsPage />
  },
  {
    id: 2,
    name: "Каналы",
    description: "Видео с подключённых каналов публикуются автоматически",
    to: "/videos/channels?page=1",
    typeForm: "URL",
    params: {
      header: "Подключите канал",
      linkDesc: "Ссылка на YouTube канал",
      reminder:
        "Все видео из добавленного канала будут автоматически публиковаться в приложении."
    },
    component: <ChannelPage />
  }
];
