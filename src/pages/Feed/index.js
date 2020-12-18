import React from "react";
import Line from "../../components/Line";
import MenuBar from "../../components/MenuBar";
import Link from "../../atoms/CustomLink";
import PostPage from "./PostPage";
import WylsaPostPage from "./WylsaPostPage";
import ExclusivePage from "./ExclusivePage";
import { isSubstring } from "../../utils/functions";
import { divStyle } from "../../content/styles";
import { UpdateContext } from "../../content/context";
import { BG_GRADIENT } from "../../content/color";

export default class FeedsPage extends React.Component {
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
              link={bar[this.state.activeId].link}
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
          <div style={divStyle.page}>{bar[this.state.activeId].component}</div>
        </UpdateContext.Provider>
      </div>
    );
  }
}

const bar = [
  {
    id: 0,
    name: "Социальные сети",
    description: "Делитесь постами из Instagram",
    // description: "Делитесь постами из Twitter и Instagram",
    to: "/feed/social_network?page=1",
    typeForm: "URL",
    params: {
      header: "Поделиться постом",
      linkDesc: "Ссылка на пост из Instagram",
      // linkDesc: "Ссылка на пост из Twitter или Instagram",
      reminder:
        "Чтобы правильно скопировать ссылку кликните правой кнопкой мыши на дату создания поста."
    },
    component: <PostPage />
  },
  {
    id: 1,
    name: "Эксклюзивы",
    description: "Делитесь небольшими публикациями прямо в приложении",
    to: "/feed/exclusives?page=1",
    link: "/feed/exclusive/:add",
    component: <ExclusivePage />
  },
  {
    id: 2,
    name: "Wylsa.com",
    description: "Отправляйте пуши на материалы с сайта wylsa.com",
    to: "/feed/wylsa_posts?page=1",
    component: <WylsaPostPage />
  }
];
