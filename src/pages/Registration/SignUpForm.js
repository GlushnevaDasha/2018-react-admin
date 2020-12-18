import React from "react";
import { GREY } from "../../content/color";
import { getInvite, createUser, login } from "../../utils/api";
import cookie from "react-cookies";

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", fio: "", password: "", secondPassword: "" };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isActive() {
    return this.state.fio.length !== 0 &&
      this.state.password.length >= 12 &&
      this.state.password === this.state.secondPassword
      ? true
      : false;
  }

  handleSubmit = async event => {
    event.preventDefault();
    if (
      this.state.fio.length !== 0 &&
      this.state.password.length >= 12 &&
      this.state.password === this.state.secondPassword
    ) {
      const data = await createUser(this.getToken(), {
        avatarUrl: "",
        fullName: this.state.fio,
        password: this.state.password
      });
      if (data.error) {
        alert(data.message);
      } else {
        const signIn = await login({
          email: this.state.email,
          password: this.state.password
        });
        if (signIn.error) {
          alert(signIn.message);
        } else {
          cookie.load("token").profile.role === "ADMIN"
            ? (document.location.href = "/feed/social_network?page=1")
            : (document.location.href = "/shop");
        }
      }
    } else {
      alert("Некорректные данные для регистрации в системе.");
    }
  };

  getToken = () => {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var vars = url.searchParams.get("token");
    return vars;
  };

  componentDidMount() {
    cookie.remove("token", { path: "/" });
    this.getUser();
  }

  getUser = async () => {
    const data = await getInvite(this.getToken());
    if (data.error) {
      alert("Вам не отправлялось письмо с данными для регистрации");
    } else {
      this.setState({
        email: data.email
      });
    }
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="inputWrapper">
          <input
            id="email"
            style={{ color: GREY }}
            type="email"
            placeholder={this.state.email}
            className="input100 disable"
            value={this.state.email}
            readonly
          />
        </div>
        <div className="inputWrapper">
          <input
            type="text"
            placeholder="Фамилия и Имя"
            className="input100"
            value={this.state.fio}
            onChange={event => {
              this.setState({
                fio: event.target.value
              });
            }}
          />
        </div>
        <div className="inputWrapper">
          <input
            id="pass"
            type="password"
            placeholder="Пароль"
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
            value={this.state.secondPassword}
            onChange={event => {
              this.setState({
                secondPassword: event.target.value
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
            value="Зарегистрироваться"
          />
        </div>
      </form>
    );
  }
}

export default SignUpForm;
