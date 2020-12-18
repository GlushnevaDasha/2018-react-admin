import React from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { login } from "../../utils/api";

class SignInForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "" };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isActive() {
    return this.state.email.length !== 0 && this.state.password.length !== 0
      ? true
      : false;
  }

  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
      password: this.state.password
    });
  }

  handleChangePassword(event) {
    this.setState({
      email: this.state.email,
      password: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    if (this.state.email.length !== 0 && this.state.password.length !== 0) {
      const data = await login({
        email: this.state.email,
        password: this.state.password
      });
      if (data.error) {
        alert(
          `Ошибка: ${data.code} - ${data.message.header} \n Как исправить: ${data.message.body}`
        );
      } else {
        cookie.load("token").profile.role === "ADMIN"
          ? (document.location.href = "/feed/social_network?page=1")
          : (document.location.href = "/shop?page=1");
      }
    } else {
      this.setState({
        email: this.state.email,
        password: this.state.password
      });
      alert("Вы не ввели данные для авторизации в системе.");
    }
  };

  componentDidMount() {
    cookie.remove("token", { path: "/" });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div data-validate="Username is required" className="inputWrapper">
          <input
            id="email"
            type="email"
            placeholder="E-mail"
            className="input100"
            value={this.state.email}
            onChange={this.handleChangeEmail}
          />
        </div>
        <div data-validate="Password is required" className="inputWrapper">
          <input
            id="pass"
            className="input100"
            type="password"
            placeholder="Пароль"
            value={this.state.password}
            onChange={this.handleChangePassword}
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
            value="Войти"
          />
        </div>

        <div className="formLink">
          <Link to={"/reset_password_by_email"}>Забыли пароль?</Link>
        </div>
      </form>
    );
  }
}

export default SignInForm;
