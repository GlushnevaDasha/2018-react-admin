import React from "react";
import { BLUE, WHITE } from "../../content/color";
import { UpdateContext } from "../../content/context";
import { InputWithLength } from "../CustomInput";

export default class CompetitionCondition extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = {
      header: props.content[props.index].title || "",
      description: props.content[props.index].description || "",
      isExsit: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.header !== "" && !this.state.isExsit) {
      this.props.setContent({
        id: this.props.content[this.props.index].id,
        description: this.state.description,
        field: true,
        place: this.props.content[this.props.index].place,
        title: this.state.header
      });
      this.setState({ description: "", header: "" });
    }
    this.setState({ isExsit: false });
    this.props.hideModal();
  };

  render() {
    return (
      <div style={{ padding: 10 }}>
        <form onSubmit={this.handleSubmit}>
          <h1>Редактируйте условие</h1>

          <InputWithLength
            maxLength={50}
            styleDiv={{ paddingTop: 20, display: "flex" }}
            state={this.state.header}
            onChange={event => {
              this.setState({ header: event.target.value });
            }}
            placeholder={"Заголовок"}
          />
          <InputWithLength
            maxLength={80}
            styleDiv={{ paddingTop: 10, paddingBottom: 10 }}
            state={this.state.description}
            onChange={event => {
              this.setState({ description: event.target.value });
            }}
            placeholder={"Описание"}
          />

          <div style={{ display: "flex", paddingTop: 30 }}>
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
                onClick={() => {
                  this.props.hideModal();
                  this.setState({ isExsit: true });
                }}
              >
                Отмена
              </button>
            </div>
            <div
              style={{
                marginLeft: 10
              }}
            >
              <input
                className="login"
                style={{
                  ...style.display,
                  ...style.button,
                  paddingLeft: 25,
                  paddingRight: 25,
                  backgroundColor: BLUE,
                  color: WHITE
                }}
                type="submit"
                value="Изменить"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const style = {
  display: {
    display: "flex"
  },
  button: {
    justifyContent: "center",
    height: 50,
    borderRadius: 3
  }
};
