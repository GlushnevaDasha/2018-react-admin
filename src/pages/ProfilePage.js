import React from "react";
import { ButtonLoader, CustomLoader } from "../atoms/Loader";
import { UpdateContext } from "../content/context";
import cookie from "react-cookies";
import { Link } from "react-router-dom";
import { Upload } from "../components/Upload";
import noImage25px from "../content/icons/NoImage/noImage25px.svg";
import { BLACK } from "../content/color";
import { getRole } from "../utils/functions";
import { getUsersByID, updateUser, addImage } from "../utils/api";
import { URL_FILE } from "../content/const";

import "../stylesheets/pages/ProfilePage.css";

function Header(props) {
  return <p className="inputHeading">{props.text}</p>;
}

export default class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.getUrlVars("id").toString(),
      token: cookie.load("token").token,
      id: cookie.load("token").profile.id,
      newPass1: "",
      newPass2: "",
      email: "",
      fio: "",
      role: "",
      img: "",
      fileImage: null,
      preview: "",
      isUpdate: false,
      isFeatch: false
    };
    this.handleChangeFIO = this.handleChangeFIO.bind(this);
    this.handleChangePas1 = this.handleChangePas1.bind(this);
    this.handleChangePas2 = this.handleChangePas2.bind(this);
  }

  getUrlVars(search) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var vars = url.searchParams.get(search);
    return vars;
  }

  async getUser() {
    if (this.state.userId !== this.getUrlVars("id").toString()) {
      this.setState({ userId: this.getUrlVars("id").toString() });
    }
    let data = await getUsersByID(this.state.userId);
    if (data.error) {
      this.setState({
        email: cookie.load("token").profile.email,
        fio: cookie.load("token").profile.fullName,
        role: cookie.load("token").profile.role,
        img: cookie.load("token").profile.avatarUrl,
        preview: cookie.load("token").profile.avatarUrl
      });
    } else {
      this.setState({
        email: data.email,
        fio: data.fullName,
        role: data.role,
        img: data.avatarUrl,
        preview: data.avatarUrl
      });
    }
  }

  componentDidMount() {
    this.getUser();
  }

  componentDidUpdate() {
    if (this.state.isUpdate) {
      this.getUser();
      cookie.save(
        "token",
        {
          token: this.state.token,
          profile: {
            id: this.state.id,
            email: this.state.email,
            fullName: this.state.fio,
            role: this.state.role,
            avatarUrl: this.state.img
          }
        },
        { path: "/" }
      );
      this.setState({ isUpdate: false });
    }
  }

  handleChangePas1(event) {
    this.setState({
      newPass1: event.target.value
    });
  }

  handleChangePas2(event) {
    this.setState({
      newPass2: event.target.value
    });
  }

  handleChangeFIO(event) {
    this.setState({
      fio: event.target.value
    });
  }

  onDropIMG = acceptedFiles => {
    let reader = new FileReader();
    let file = acceptedFiles[0];
    reader.onloadend = () => {
      this.setState({
        fileImage: file,
        preview: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  render() {
    if (this.state.fio === "") {
      return <CustomLoader />;
    }
    if (this.state.userId === "") {
      return (
        <div
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            paddingTop: "15%"
          }}
        >
          <h1
            style={{
              textAlign: "center",
              font: "lighter 40px/50px GraphikLCG-Semibold"
            }}
          >
            {"Пользователь не найден"}
          </h1>

          <p
            style={{
              textAlign: "center",
              font: "lighter 24px/40px GraphikLCG-Regular"
            }}
          >
            {"Что-то пошло не так."}
          </p>
          <p
            style={{
              textAlign: "center",
              font: "lighter 24px/40px GraphikLCG-Regular"
            }}
          >
            Вернитесь на страницу{" "}
            <Link
              to={"/control_users"}
              style={{
                color: BLACK,
                textDecoration: "none",
                textAlign: "center",
                font: "lighter 24px/40px GraphikLCG-Regular"
              }}
            >
              'Перейти к управлению'
            </Link>{" "}
            и повторите действие."
          </p>
        </div>
      );
    }
    return (
      <div className="intent2x">
        <div className="profileHeader">
          <div
            className="userpic"
            style={{
              backgroundImage: `url(${this.state.img ||
                this.state.preview ||
                noImage25px})`
            }}
          />

          <Upload
            className="uploadUserpic"
            style={style.uploadLink}
            onDrop={this.onDropIMG}
            text={"Поменять изображение профиля"}
            type={"image/*"}
          />
        </div>

        <div style={{ display: "flex", marginBottom: 24 }}>
          <div style={{ flex: 1, marginRight: 12 }}>
            <Header text={"Имя и Фамилия"} />
            <div className="inputWrapper">
              <input
                className="input100"
                type="text"
                placeholder={this.state.fio}
                value={this.state.fio}
                onChange={this.handleChangeFIO}
              />
            </div>
          </div>

          <div style={{ flex: 1, marginLeft: 12 }}>
            <Header text={"E-mail"} />
            <div className="inputWrapper">
              <input
                className="input100 disable"
                type="text"
                value={this.state.email}
                disabled
              />
            </div>
          </div>
        </div>

        {cookie.load("token").profile.role !== "PARTNER" ? (
          <div style={{ display: "flex" }}>
            <div style={{ flex: 1, marginRight: 12 }}>
              <Header text={"Роль"} />
              <div className="inputWrapper">
                <input
                  className="input100 disable"
                  type="text"
                  value={getRole(this.state.role)}
                  disabled
                />
              </div>
            </div>
            <div style={{ flex: 1, marginLeft: 12 }} />
          </div>
        ) : null}

        <div className="profileFooter">
          <button
            className="large_button active"
            onClick={async () => {
              this.setState({ isFeatch: true });
              let nameImage = {};
              if (this.state.fileImage === null) {
                nameImage = { fileName: this.state.img };
              } else {
                nameImage = await addImage(this.state.fileImage);
              }
              if (!nameImage.error) {
                let data = await updateUser(this.state.userId, {
                  avatarUrl:
                    nameImage.fileName.indexOf("https") !== -1
                      ? nameImage.fileName
                      : URL_FILE + nameImage.fileName,
                  fullName: this.state.fio,
                  newPassword:
                    this.state.newPass1 !== "" ? this.state.newPass1 : null,
                  newPasswordConfirmation:
                    this.state.newPass1 !== "" ? this.state.newPass1 : null
                });
                if (data.error) {
                  alert("error", data);
                } else {
                  this.setState({ isUpdate: true });
                }
              } else {
                alert("error", nameImage);
              }
              this.setState({ isFeatch: false });
            }}
          >
            {this.state.isFeatch ? <ButtonLoader /> : "Сохранить"}
          </button>
        </div>
      </div>
    );
  }
}
ProfilePage.contextType = UpdateContext;

const style = {
  uploadLink: {
    maxWidth: 140,
    fontSize: 12,
    color: "#6D6D72",
    textAlign: "center",
    lineHeight: 1.3,
    textDecoration: "underline",
    cursor: "pointer"
  }
};
