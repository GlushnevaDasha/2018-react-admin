import React from "react";
import { editCompetitionById } from "../../utils/api";
import { isEmpty } from "../../utils/functions";
import { UpdateContext } from "../../content/context";

export default class AddStream extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      stream: "",
      exit: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isActive() {
    return this.state.stream.length !== 0 ? true : false;
  }

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.state.exit) {
      const result = await editCompetitionById(this.props.id, {
        ...this.state.data,
        resultStream: this.state.stream
      });
      if (result.error) {
        alert(result.message);
      } else {
        if (!isEmpty(result)) {
          this.context.setState();
        }
      }
    }
    this.setState({ exit: false });
    this.props.hideModal();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h2>Добавьте ссылку на стрим</h2>
          <div className="inputWrapper">
            <input
              type="text"
              placeholder={"Ссылка на стрим"}
              className="input100"
              value={this.state.stream}
              onChange={event => {
                this.setState({ stream: event.target.value });
              }}
            />
          </div>

          <div className="buttonsWrapper">
            <div style={{ flex: 1 }} />
            <button
              className="large_button simple"
              onClick={() => {
                this.setState({ exit: true });
                this.props.hideModal();
              }}
            >
              Отмена
            </button>

            <input
              className="large_button active"
              type="submit"
              value="Добавить"
            />
          </div>
        </form>
      </div>
    );
  }
}
