import React from "react";
import { ButtonLoader } from "../../atoms/Loader";
import { Link } from "react-router-dom";
import { Upload } from "../../components/Upload";
import { ChromePicker } from "react-color";
import { WHITE } from "../../content/color";
import { MenuMobile } from "../../content/Icons";

import camera from "../../content/icons/Phone/camera.svg";
import {
  createProductSelection,
  addImage,
  getProductSelection,
  updateProductSelection
} from "../../utils/api";
import {
  getParameterFromUrl,
  getColorInt,
  getColorHex
} from "../../utils/functions";

import { URL_FILE } from "../../content/const";

import "../../stylesheets/pages/shop/ShopCreate.css";

export default class ShopCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      colorFon: "#F2F2F2",
      id: getParameterFromUrl("id"),
      theme: "DARK",
      name: "",
      description: "",
      link: "",
      file: null,
      imageName: "",
      imagePreviewUrl: "",
      imageByte: "",
      nameLink: "",
      descriptor: "",
      proba: "",
      isFeath: false
    };
  }

  onDrop = acceptedFiles => {
    let reader = new FileReader();
    let file = acceptedFiles[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  isThemeDark = () => {
    return this.state.theme === "DARK" ? true : false;
  };

  addOrUpdateShop = async () => {
    this.setState({ isFeath: true });
    let nameImage = {};
    if ((this.state.file === null) & (this.state.id !== null)) {
      nameImage = { fileName: this.state.imageName };
    } else {
      nameImage = await addImage(this.state.file);
    }
    let params = {
      color: getColorInt(this.state.colorFon),
      description: this.state.description,
      descriptor: this.state.descriptor,
      imageUrl:
        nameImage.fileName.indexOf("https") !== -1
          ? nameImage.fileName
          : URL_FILE + nameImage.fileName,
      link: this.state.link,
      linkName: this.state.nameLink,
      name: this.state.name,
      theme: this.state.theme
    };
    let data = {};
    if (!this.state.id) {
      data = await createProductSelection(params);
    } else {
      data = await updateProductSelection(this.state.id, params);
    }
    if (data.error) {
      this.setState({
        isError: true
      });
    } else {
      this.setState({ isFeath: false });
      document.location.href = `/product?id=${data.id}`;
    }
    this.setState({ isFeath: false });
  };

  async componentDidMount() {
    if (!this.state.id) {
    } else {
      let data = await getProductSelection(this.state.id);
      if (data.error) {
        this.setState({ error: true });
      } else {
        this.setState({
          colorFon: getColorHex(data.color),
          theme: data.theme,
          name: data.name,
          description: data.description,
          link: data.link,
          imageName: data.imageUrl,
          imageByte: data.imageUrl,
          nameLink: data.linkName,
          descriptor: data.descriptor
        });
      }
    }
  }

  render() {
    return (
      <div className="shopCreateWrapper">
        <div className="form">
          <div className="buttonBack">
            <Link
              to={
                this.state.id ? `product?id=${this.state.id}` : "/shop?page=1"
              }
            >
              {"вернуться назад".toLocaleUpperCase()}
            </Link>
          </div>
          <div className="heading formBlock">
            <h2>Создайте подборку</h2>
            <p>
              Перед началом ознакомтесь с <Link>гайдлайнами</Link>, где вы
              найдете примеры правильного оформления
            </p>
          </div>

          <div className="heading formBlock">
            <h4>Расскажите о подборке</h4>{" "}
            <p className="formBlockDescription">
              Желательно сделать это кратко и ёмко
            </p>
            <div className="inputWrapper">
              <input
                maxLength={30}
                type="text"
                placeholder={"Дескриптор, например 'Wylsacom советует'"}
                className="input100"
                value={this.state.descriptor}
                onChange={event => {
                  this.setState({ descriptor: event.target.value });
                }}
              />
              <div className="inputCounter">
                <p>{30 - this.state.descriptor.length}</p>
              </div>
            </div>
            <div className="inputWrapper">
              <input
                maxLength={50}
                type="text"
                placeholder={"Название"}
                className="input100"
                value={this.state.name}
                onChange={event =>
                  this.setState({
                    name: event.target.value
                  })
                }
              />
              <div className="inputCounter">
                <p>{50 - this.state.name.length}</p>
              </div>
            </div>
            <div className="inputWrapper">
              <input
                type="text"
                placeholder={"Описание"}
                className="input100"
                value={this.state.description}
                onChange={event =>
                  this.setState({
                    description: event.target.value
                  })
                }
              />
            </div>
          </div>

          <div className="heading formBlock">
            <h4>Загрузите обложку</h4>
            <p className="formBlockDescription">
              Соотношение 1:1. Минимальный размер 1242х1242px
            </p>
            <div style={{ paddingTop: 15, paddingBottom: 5 }}>
              <Upload
                onDrop={this.onDrop}
                text={"Выбор фото"}
                type={"image/*"}
              />
            </div>
          </div>

          <div className="heading formBlock">
            <h4>Выберите цвет</h4>
            <p className="formBlockDescription">
              Лучше всего подойдет цвет преобладающий на обложке
            </p>
            <div style={{ display: "flex", paddingTop: 15, paddingBottom: 5 }}>
              <div
                onClick={() => {
                  this.setState({ isShow: !this.state.isShow });
                }}
                style={{
                  boxShadow: "0 0 3px rgba(0,0,0,0.2)",
                  border: "3px solid",
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: this.state.colorFon,
                  borderColor: WHITE
                }}
              />
              {this.state.isShow ? (
                <div style={{ paddingLeft: 15 }}>
                  <ChromePicker
                    color={this.state.colorFon}
                    onChange={color => {
                      this.setState({ colorFon: color.hex });
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="heading formBlock">
            <h4>Проверьте читабельность</h4>
            <p className="formBlockDescription">
              Выберите цвет интерфейса, который будет контрастнее смотреться на
              выбранном ранее фоне.
            </p>
            <div style={{ display: "flex" }}>
              <div
                className={
                  this.state.theme === "DARK" ? "themeTab active" : "themeTab"
                }
                onClick={() => {
                  this.setState({ theme: "DARK" });
                }}
              >
                Темный
              </div>
              <div
                className={
                  this.state.theme === "DARK" ? "themeTab" : "themeTab active"
                }
                onClick={() => {
                  this.setState({ theme: "LIGHT" });
                }}
              >
                Светлый
              </div>
            </div>
          </div>

          <div className="heading formBlock">
            <h4>Оставьте ссылку</h4>
            <p className="formBlockDescription">
              Лучше всего ссылаться на каталог вашего магазина или
              промо-страницу.
            </p>
            <div className="inputWrapper">
              <input
                maxLength={30}
                type="text"
                placeholder={"Название, например 'Читайте на wylsa.com'"}
                className="input100"
                value={this.state.nameLink}
                onChange={event => {
                  this.setState({ nameLink: event.target.value });
                }}
              />
              <div className="inputCounter">
                <p>{30 - this.state.nameLink.length}</p>
              </div>
            </div>
            <div className="inputWrapper">
              <input
                type="text"
                placeholder={"Ссылка"}
                className="input100"
                value={this.state.link}
                onChange={event => {
                  this.setState({ link: event.target.value });
                }}
              />
            </div>
          </div>

          <div className="formBlock">
            <div
              onClick={() => {
                this.addOrUpdateShop();
              }}
            >
              <p className="large_button active" style={{ width: 400 }}>
                {this.state.isFeath ? <ButtonLoader /> : "Создать и продолжить"}
              </p>
            </div>
            <p className="button_description">
              Подборка не будет опубликована. Вы сможете добавить продукты
              и&nbsp;внести правки.
            </p>
          </div>
        </div>

        <div className="preview">
          <div
            className="phoneContainer"
            style={{ backgroundColor: this.state.colorFon }}
          >
            <div
              className="cover"
              style={{
                backgroundImage:
                  this.state.imagePreviewUrl.length !== 0
                    ? `url(${this.state.imagePreviewUrl})`
                    : this.state.imageByte.length !== 0
                    ? `url(${this.state.imageByte})`
                    : `url(${camera})`
              }}
            >
              <div style={{ justifyContent: "center" }}>
                <MenuMobile typeDark={this.isThemeDark()} />
              </div>
              <div style={{ paddingTop: 152 }}>
                <div
                  style={{
                    zIndex: 1,
                    height: 150,
                    background: `linear-gradient(rgba(255,255,255,0),${this.state.colorFon})`
                  }}
                />
              </div>
            </div>
            <div className="content">
              <p
                className="title"
                style={{ color: this.isThemeDark() ? "#000000" : WHITE }}
              >
                {this.state.name || "Название"}
              </p>
              <p style={{ color: this.isThemeDark() ? "#000000" : WHITE }}>
                {this.state.description || "Описание"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
