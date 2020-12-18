import React from "react";
import { UpdateContext } from "../../content/context";
import { InputWithLength } from "../CustomInput";

export default class ApplicationForm extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = {
      header: "",
      description: "",
      isExsit: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.header !== "" && !this.state.isExsit) {
      this.props.setContent({
        id: this.props.length,
        description: this.state.description,
        field: true,
        place: this.props.length,
        title: this.state.header
      });
      this.setState({ description: "", header: "" });
    }
    this.setState({ isExsit: false });
    this.props.hideModal();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h2>Добавьте поле ввода</h2>
          <div className="inputWrapper">
            <input
              maxLength={50}
              type="text"
              placeholder={"Название поля, например Ссылка на VK"}
              className="input100"
              value={this.state.header}
              onChange={event => {
                this.setState({ header: event.target.value });
              }}
            />
          </div>
          <InputWithLength
            maxLength={140}
            state={this.state.description}
            onChange={event => {
              this.setState({ description: event.target.value });
            }}
            placeholder={"Подсказка"}
          />

          <span className="input_description">
            Если вам кажется, что у пользователя могут возникнуть трудности
            с&nbsp;заполнением, дайтеему небольшую подсказку.
          </span>

          <div className="buttonsWrapper">
            <div style={{ flex: 1 }} />
            <button
              className="large_button simple"
              onClick={() => {
                this.props.hideModal();
                this.setState({ isExsit: true });
              }}
            >
              Отмена
            </button>
            <input
              className={"large_button active"}
              type="submit"
              value="Добавить"
            />
          </div>
        </form>
      </div>
    );
  }
}
