import React from "react";
import { isSubstring, isEmpty } from "../../utils/functions";
import { addPlaylists } from "../../utils/api";
import { UpdateContext } from "../../content/context";

class AddHeadings extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      des: "",
      title: ""
    };
    this.handleChangeURL = this.handleChangeURL.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeDes = this.handleChangeDes.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isActive() {
    return this.state.url.length !== 0 &&
      this.state.title.length !== 0 &&
      this.state.des.length !== 0
      ? true
      : false;
  }

  handleChangeURL(event) {
    this.setState({
      url: event.target.value
    });
  }

  handleChangeDes(event) {
    this.setState({
      des: event.target.value
    });
  }

  handleChangeName(event) {
    this.setState({
      title: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    let type = this.state.url;
    let result = {};
    if (isSubstring(type, "youtube")) {
      result = await addPlaylists({
        description: this.state.des,
        title: this.state.title,
        youtubePlaylistUrl: this.state.url
      });
    } else {
      alert("Введен некорректный URL");
    }
    if (result.error) {
      alert(result.message);
    } else {
      this.setState({
        url: "",
        des: "",
        title: ""
      });
      if (!isEmpty(result)) {
        this.context.setState();
      }
    }
    this.props.hideModal();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h2>Добавьте рубрику</h2>
          <div className="inputWrapper">
            <input
              type="text"
              placeholder={"Ссылка на YouTube плейлист"}
              className="input100"
              value={this.state.url}
              onChange={this.handleChangeURL}
            />
          </div>
          <div className="inputWrapper">
            <input
              type="text"
              placeholder={"Название"}
              className="input100"
              value={this.state.title}
              onChange={this.handleChangeName}
            />
          </div>
          <div className="inputWrapper">
            <input
              maxLength={50}
              type="text"
              placeholder={"Краткое описание"}
              className="input100"
              value={this.state.des}
              onChange={this.handleChangeDes}
            />
            <div className="inputCounter">
              <p>{50 - this.state.des.length}</p>
            </div>
          </div>
          <div className="buttonsWrapper">
            <div style={{ flex: 1 }} />
            <button
              className="large_button simple"
              onClick={this.props.hideModal}
            >
              Отмена
            </button>
            <input
              className={
                this.isActive() ? "large_button active" : "large_button disable"
              }
              type="submit"
              value="Добавить"
            />
          </div>
        </form>
      </div>
    );
  }
}
export default AddHeadings;
