import React from "react";
import { BLUE, WHITE } from "../../content/color";
import { isEmpty } from "../../utils/functions";
import { updatePlaylist } from "../../utils/api";
export default class EditPlaylist extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: this.props.title.value, des: this.props.des.value };
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDes = this.handleChangeDes.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeDes(event) {
    this.setState({
      des: event.target.value
    });
  }

  handleChangeTitle(event) {
    this.setState({
      title: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    let result = {};
    let data = {
      description:
        this.state.des.length !== 0 ? this.state.des : this.props.des.value,
      title:
        this.state.title.length !== 0
          ? this.state.title
          : this.props.title.value
    };
    if (!isEmpty(data)) {
      result = await updatePlaylist(this.props.id, data);
    }
    if (!isEmpty(result)) {
      this.props.title.setStateValue(result.title);
      this.props.des.setStateValue(result.description);
    }
    this.props.hideModal();
  };

  render() {
    return (
      <div>
        <h1>{"Редактирование плейлиста"}</h1>
        <div style={{ paddingTop: 20, paddingBottom: 10 }}>
          <input
            type="text"
            name="url"
            placeholder={"Наименование"}
            className="input100"
            value={this.state.title}
            onChange={this.handleChangeTitle}
          />
        </div>
        <div style={{ paddingTop: 5, paddingBottom: 10 }}>
          <input
            type="text"
            name="url"
            placeholder={"Описание"}
            className="input100"
            value={this.state.des}
            onChange={this.handleChangeDes}
          />
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
              onClick={this.props.hideModal}
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
              onClick={this.handleSubmit}
            >
              Изменить
            </button>
          </div>
        </div>
      </div>
    );
  }
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
  }
};
