import React from "react";
import { BLUE, GREY, WHITE, DARK_GREY, LIGHT_GREY } from "../../content/color";
import { sendInvite } from "../../utils/api";

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exit: false,
      displayMenu: false,
      email: "",
      role: "NO_ROLE"
    };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);
    this.showDropdownMenu = this.showDropdownMenu.bind(this);
    this.hideDropdownMenu = this.hideDropdownMenu.bind(this);
  }

  isActive() {
    return this.state.email.length !== 0 && this.state.role !== "NO_ROLE"
      ? true
      : false;
  }

  showDropdownMenu(event) {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
      document.addEventListener("click", this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener("click", this.hideDropdownMenu);
    });
  }

  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
      role: this.state.role
    });
  }

  handleChangeRole(event) {
    this.setState({
      email: this.state.email,
      role: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if (!this.state.exit) {
      await sendInvite({
        email: this.state.email,
        role: this.state.role
      });
    }
    this.setState({ exit: false });
    this.props.hideModal();
  }

  handleExit = () => {
    this.setState({ exit: true });
    this.props.hideModal();
  };

  render() {
    return (
      <div>
        <form
          onSubmit={event => {
            this.handleSubmit(event);
          }}
        >
          <h1>Пригласите пользователя</h1>
          <div style={{ paddingTop: 20, paddingBottom: 10 }}>
            <input
              type="text"
              placeholder={"E-mail"}
              className="input100"
              value={this.state.email}
              onChange={this.handleChangeEmail}
            />
          </div>
          <div style={{ paddingBottom: 10 }}>
            <select
              className="input100"
              value={this.state.value}
              onChange={this.handleChangeRole}
            >
              ><option value={"NO_ROLE"}>Укажите роль</option>
              <option value={"ADMIN"}>Администратор</option>
              <option value={"PARTNER"}>Партнер</option>
            </select>
          </div>

          <p
            style={{
              fontFamily: "GraphikLCG-Regular",
              fontSize: 12,
              color: GREY
            }}
          >
            Вы всегда можете изменить ротль пользователя, но для безопасности не
            стоит выдавать права администратора третьим лицам
          </p>
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
                onClick={this.handleExit}
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
                  paddingLeft: 10,
                  paddingRight: 10,
                  backgroundColor: this.isActive() ? BLUE : LIGHT_GREY,
                  color: this.isActive() ? WHITE : DARK_GREY
                }}
                onSubmit={this.handleSubmit}
                type="submit"
                value="Отправить инвайт"
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default AddUser;

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
