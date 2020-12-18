import React from "react";
import { BLUE, GREY, WHITE } from "../../content/color";
import Line from "../Line";

export function AddContentByURLAndHeader(props) {
  return (
    <div>
      <h1>{props.header}</h1>
      <div style={{ paddingTop: 20, paddingBottom: 10 }}>
        <input
          type="text"
          name="url"
          placeholder={"Заголовок"}
          className="input100"
        />
      </div>
      <div style={{ paddingTop: 5, paddingBottom: 10 }}>
        <input
          type="text"
          name="url"
          placeholder={props.linkDesc}
          className="input100"
        />
      </div>
      <p
        style={{ fontFamily: "GraphikLCG-Regular", fontSize: 12, color: GREY }}
      >
        {props.reminder}
      </p>

      <div style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Line />
      </div>
      <h4 style={style.header}>Загрузите обложку</h4>
      <p style={{ font: "lighter 14px/20px GraphikLCG-Regular" }}>
        Минимальный размер 1000×1000px
      </p>
      <div style={{ paddingTop: 15, paddingBottom: 5 }}>
        {/* <Upload
          value={{
            imageUrl: this.state.imageUrl,
            setFile: newFile => {
              this.setState({
                file: newFile
              });
            },
            deleteFile: () => {
              this.setState({ file: null, imageUrl: "" });
            }
          }}
          text={"Выбор фото"}
          type={"image/*"}
        /> */}
      </div>

      <div style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Line />
      </div>
      <div style={{ display: "flex", paddingTop: 10 }}>
        <div style={{ flex: 1 }} />
        <div>
          <button
            className="login"
            style={{
              ...style.display,
              ...style.button,
              backgroundColor: "rgba(0,0,0,0)",
              borderColor: "rgba(0,0,0,0)",
              color: BLUE
            }}
            onClick={props.hideModal}
          >
            Отмена
          </button>
        </div>
        <div
          style={{
            marginLeft: 10
          }}
        >
          <button
            className="login"
            style={{
              ...style.display,
              ...style.button,
              paddingLeft: 10,
              paddingRight: 10
            }}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}

const style = {
  display: {
    display: "flex"
  },
  button: {
    color: WHITE,
    justifyContent: "center",
    height: 50,
    backgroundColor: BLUE,
    borderRadius: 3
  },
  header: {
    fontFamily: "GraphikLCG-Regular",
    paddingTop: 10,
    paddingBottom: 10
  }
};
