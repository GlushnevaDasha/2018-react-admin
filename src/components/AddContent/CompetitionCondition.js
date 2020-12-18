import React from "react";
import { UpdateContext } from "../../content/context";
import { InputWithLength } from "../CustomInput";

export default class CompetitionCondition extends React.Component {
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
        field: false,
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
          <h2>Добавьте условие</h2>

          <InputWithLength
            maxLength={50}
            state={this.state.header}
            onChange={event => {
              this.setState({ header: event.target.value });
            }}
            placeholder={"Заголовок"}
          />
          <InputWithLength
            maxLength={80}
            state={this.state.description}
            onChange={event => {
              this.setState({ description: event.target.value });
            }}
            placeholder={"Описание"}
          />

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
