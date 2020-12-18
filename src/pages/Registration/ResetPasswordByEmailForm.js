import React from "react";
import { Link } from "react-router-dom";
import { getURLToResetPassword } from "../../utils/api";

class ResetPasswordByEmailForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", isShow: false, textMessage: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isActive() {
    return this.state.email.length !== 0 ? true : false;
  }

  handleSubmit = async event => {
    event.preventDefault();

    if (this.state.email.length !== 0) {
      let data = await getURLToResetPassword({
        email: this.state.email
      });
      if (data.error) {
        this.setState({
          textMessage:
            "Данного пользователя нет в системе. Проверьте правильность написания email.",
          isShow: true
        });
      } else {
        this.setState({
          textMessage: "Ссылка для востановления отправлена на Вашу почту.",
          isShow: true
        });
      }
    } else {
      this.setState({
        textMessage: "Вы не ввели почту для востановления пароля.",
        isShow: true
      });
    }
  };

  componentWillMount() {
    this.setState({ isShow: false });
  }

  render() {
    return (
      <>
        {this.state.isShow ? (
          <div className="notification">{this.state.textMessage}</div>
        ) : null}
        <form onSubmit={this.handleSubmit}>
          <div data-validate="Username is required" className="inputWrapper">
            <input
              id="email"
              type="email"
              placeholder="E-mail"
              className="input100"
              value={this.state.email}
              onChange={event => {
                this.setState({ email: event.target.value });
              }}
            />
          </div>

          <div className="inputWrapper">
            <input
              className={
                this.isActive()
                  ? "large_button active stretch"
                  : "large_button disable stretch"
              }
              type="submit"
              value="Выслать ссылку для сброса"
            />
          </div>

          <div className="formLink">
            <Link to={"/sign_in"}>Вернуться к форме входа</Link>
          </div>
        </form>
      </>
    );
  }
}

export default ResetPasswordByEmailForm;
