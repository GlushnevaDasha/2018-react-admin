import React from "react";
import { addVideoByURL, instagramPostAdd, addChannels } from "../../utils/api";
import { isSubstring, isEmpty } from "../../utils/functions";
import { UpdateContext } from "../../content/context";

function deleteSubstring(text, substring) {
  const result = text.replace(substring, "");
  return result;
}

class AddContentByURL extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      errorURL: false,
      isExit: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isActive() {
    return this.state.url.length !== 0 ? true : false;
  }

  handleChange(event) {
    this.setState({
      url: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    let result = {};
    if (this.state.isExit) {
      this.setState({ isExit: false });
      this.props.hideModal();
    } else {
      if (
        isSubstring(this.state.url, "youtube") ||
        isSubstring(this.state.url, "twitch")
      ) {
        if (
          isSubstring(this.state.url, "youtube") &&
          (isSubstring(this.state.url, "channel") ||
            isSubstring(this.state.url, "user"))
        ) {
          result = await addChannels(this.state.url);
        } else {
          result = await addVideoByURL(this.state.url);
        }
      }
      if (isSubstring(this.state.url, "instagram")) {
        result = await instagramPostAdd(
          deleteSubstring(this.state.url, "/?utm_source=ig_web_copy_link")
        );
      }
      if (result.error) {
        alert(result.message);
      } else {
        this.setState({
          url: ""
        });
        if (!isEmpty(result)) {
          this.context.setState();
        }
      }
      this.props.hideModal();
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h2>{this.props.header}</h2>
          <div className="inputWrapper">
            <input
              type="text"
              placeholder={this.props.linkDesc}
              className={this.state.errorURL ? "input100 error" : "input100"}
              value={this.state.url}
              onChange={this.handleChange}
            />
          </div>
          <span className="input_description">{this.props.reminder}</span>
          <div className="buttonsWrapper">
            <div style={{ flex: 1 }} />
            <button
              className="large_button simple"
              onClick={() => {
                this.props.hideModal();
                this.setState({ isExit: true });
              }}
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
export default AddContentByURL;
