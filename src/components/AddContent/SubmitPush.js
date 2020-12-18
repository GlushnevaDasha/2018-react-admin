import React from "react";
import { sendPush } from "../../utils/api";

export default class SubmitPush extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      body: "",
      exit: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.state.exit) {
      if (this.state.body.length !== 0 && this.state.title.length !== 0) {
        await sendPush({
          body: this.state.body,
          postId: this.props.value.postId,
          title: this.state.title,
          topic: this.props.value.topic
        });
      }
    }
    this.setState({ exit: false });
    this.props.hideModal();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h2>Отправьте пуш</h2>
          <div className="inputWrapper">
            <input
              type="text"
              placeholder={"Заголовок"}
              className="input100"
              value={this.state.title}
              onChange={event => {
                this.setState({ title: event.target.value });
              }}
            />
          </div>
          <div className="inputWrapper">
            <input
              type="text"
              placeholder={"Текст"}
              className="input100"
              value={this.state.body}
              onChange={event => {
                this.setState({ body: event.target.value });
              }}
            />
          </div>

          <div className="buttonsWrapper">
            <div style={{ flex: 1 }} />
            <button
              className="large_button simple"
              onClick={() => {
                this.setState({ exit: false });
                this.props.hideModal();
              }}
            >
              Отменить
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
