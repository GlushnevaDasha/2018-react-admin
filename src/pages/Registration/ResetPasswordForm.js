import React from "react";
import { getUserData, resetPassword } from "../../utils/api";

class ResetPasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password: "", passwordConfirmation: "", isNoUser: false };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getToken = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var vars = url.searchParams.get("token");
    return vars;
  };

  isActive() {
    return this.state.password.length >= 12 &&
      this.state.password === this.state.passwordConfirmation
      ? true
      : false;
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (
      this.state.password.length >= 12 &&
      this.state.password === this.state.passwordConfirmation
    ) {
      let date = await resetPassword(this.getToken(), {
        password: this.state.password,
        passwordConfirmation: this.state.passwordConfirmation
      });
      if (!date) {
        document.location.href = "/sign_in";
      }
    } else {
      alert("Вы не ввели новый пароль.");
    }
  }

  async componentDidMount() {
    const user = await getUserData(this.getToken());
    if (user.error) {
      this.setState({ isNoUser: true });
    }
  }

  render() {
    if (this.state.isNoUser) {
      return (
        <div>
          <p style={{ textAlign: "center" }}>
            Ссылка на сброс пароля устарела.
          </p>
        </div>
      );
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="inputWrapper">
          <input
            id="pass"
            type="password"
            placeholder="Новый пароль"
            className="input100"
            value={this.state.password}
            onChange={event => {
              this.setState({
                password: event.target.value
              });
            }}
          />
        </div>
        <div className="inputWrapper">
          <input
            className="input100"
            type="password"
            placeholder="Повторите пароль"
            value={this.state.passwordConfirmation}
            onChange={event => {
              this.setState({
                passwordConfirmation: event.target.value
              });
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
            value="Сбросить пароль"
          />
        </div>
        <p className="button_description">Пароль минимум 12 символов</p>
      </form>
    );
  }
}

export default ResetPasswordForm;
