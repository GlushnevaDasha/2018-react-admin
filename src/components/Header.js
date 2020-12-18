import React from "react";
import { UpdateContext } from "../content/context";
import cookie from "react-cookies";
import { Link } from "react-router-dom";

import Line from "./Line";
import ShortProfile from "../atoms/ShortProfile";
import { NotAuthorized } from "./Gag";

import { WHITE } from "../content/color";
import { AngleLeft } from "../content/Icons";
import { URL_HOST } from "../content/const";

import FeedPage from "../pages/Feed";
import TextEditorPage from "../pages/Feed/TextEditorPage";
import VideosPage from "../pages/Videos";
import PlaylistPage from "../pages/Videos/PlaylistPage";
import ProfilePage from "../pages/ProfilePage";
import UsersPage from "../pages/Users";
import ShopPage from "../pages/Shop";
import ProductGroupPage from "../pages/Shop/ProductGroupPage";
import PodcastsPage from "../pages/Podcasts";
import CompetitionsPage from "../pages/Competitions";
import AddCompetition from "../pages/Competitions/AddCompetitions";
import CompetitionPage from "../pages/Competitions/CompetitionPage";
import CompetitionResultPage from "../pages/Competitions/CompetitionResults";
import CommentsPage from "../pages/Comments";
import ControlUsersPage from "../pages/Control";
import { DropdownHeader } from "../components/Dropdown";

import "../stylesheets/components/Header.css";

function CustomLink(props) {
  return (
    <Link
      className={props.isActive ? "navItem active" : "navItem"}
      to={props.link}
    >
      {props.name}
    </Link>
  );
}

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeId: props.idMenu,
      color: !props.color ? WHITE : props.color
    };
  }

  render() {
    return (
      <div style={{ backgroundColor: this.state.color }}>
        <header className="intent">
          <nav>
            {!this.props.short ? (
              <>
                <div className="mainMenu">
                  {headerItem.map((item, index) => {
                    if (
                      item.role === cookie.load("token").profile.role ||
                      cookie.load("token").profile.role === "ADMIN"
                    ) {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            this.setState({
                              activeId: item.id
                            });
                          }}
                        >
                          <CustomLink
                            link={item.link}
                            name={item.name}
                            isActive={
                              item.id !== this.state.activeId ? false : true
                            }
                          />
                        </div>
                      );
                    }
                  })}
                </div>

                <div className="subMenu">
                  {headerUserItem.map((item, index) => {
                    if (item.role === cookie.load("token").profile.role) {
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            this.setState({
                              activeId: item.id
                            });
                          }}
                        >
                          <CustomLink
                            link={item.link}
                            name={item.name}
                            isActive={
                              item.id !== this.state.activeId ? false : true
                            }
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", flex: 1 }}>
                <CustomLink
                  icon={<AngleLeft />}
                  link={this.props.short.link}
                  name={this.props.short.text}
                  isActive={false}
                />
              </div>
            )}
            <DropdownHeader button={<ShortProfile />} />
          </nav>
          <Line />
        </header>
      </div>
    );
  }
}

export function Feed() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header idMenu={0} />
      <FeedPage />
    </>
  );
}

export function Videos() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header idMenu={1} />
      <VideosPage />
    </>
  );
}

export function HadingPlaylist() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header />
      <PlaylistPage />
    </>
  );
}

export function Profile() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <UpdateContext.Provider
      value={{
        isUpdate: false
      }}
    >
      <Header />
      <ProfilePage />
    </UpdateContext.Provider>
  );
}

export function Shop() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header idMenu={2} />
      <ShopPage />
    </>
  );
}

export function Users() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header idMenu={6} />
      <UsersPage />
    </>
  );
}

export function Podcasts() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header idMenu={4} />
      <PodcastsPage />
    </>
  );
}

export function Competitions() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header idMenu={3} />
      <CompetitionsPage />
    </>
  );
}

export function Comments() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header idMenu={5} />
      <CommentsPage />
    </>
  );
}

export function ControlUsers() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header />
      <ControlUsersPage />
    </>
  );
}

export function Playlist() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header />
      <ControlUsersPage />
    </>
  );
}

export function TextEditor() {
  return (
    <>
      <Header
        color={WHITE}
        short={{
          link: "/feed/exclusives?page=1",
          text: "к списку публикаций".toUpperCase()
        }}
      />
      <TextEditorPage />
    </>
  );
}

export function AddCompetitionPage() {
  return (
    <>
      <Header
        color={WHITE}
        short={{
          link: "/competitions?page=1",
          text: "вернуться назад".toUpperCase()
        }}
      />
      <AddCompetition />
    </>
  );
}

export function Product() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header idMenu={2} />
      <ProductGroupPage />
    </>
  );
}

export function Competition() {
  if (!cookie.load("token")) {
    return <NotAuthorized />;
  }
  return (
    <>
      <Header idMenu={3} />
      <CompetitionPage />
    </>
  );
}

export function CompetitionResult() {
  return (
    <>
      <Header
        short={{
          link: window.location.href
            .replace(URL_HOST, "")
            .replace("_result", ""),
          text: "вернуться назад".toUpperCase()
        }}
      />
      <CompetitionResultPage />
    </>
  );
}

const headerItem = [
  {
    id: 0,
    name: "Лента",
    link: "/feed/social_network?page=1",
    role: "ADMIN"
  },
  {
    id: 1,
    name: "Видео",
    link: "/videos/video?page=1",
    role: "ADMIN"
  },
  {
    id: 2,
    name: "Годнота",
    link: "/shop?page=1",
    role: "PARTNER"
  },
  {
    id: 3,
    name: "Конкурсы",
    link: "/competitions?page=1",
    role: "PARTNER"
  },
  {
    id: 4,
    name: "Подкасты",
    link: "/podcasts",
    role: "ADMIN"
  }
];

const headerUserItem = [
  {
    id: 5,
    name: "Комментарии",
    link: "/comments?status=all&page=1",
    role: "ADMIN"
  },
  {
    id: 6,
    name: "Пользователи",
    link: "/users?page=1",
    role: "ADMIN"
  }
];
