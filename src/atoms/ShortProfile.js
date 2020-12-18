import React from "react";
import { UpdateContext } from "../content/context";
import cookie from "react-cookies";
import Image from "../components/Image";
import { AngleDown } from "../content/Icons";

import "../stylesheets/atoms/ShortProfile.css"

export default class ShortProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarUrl: cookie.load("token").profile.avatarUrl,
      fullName: cookie.load("token").profile.fullName
    };
  }

  componentDidUpdate() {
    if (
      this.state.fullName !== cookie.load("token").profile.fullName ||
      this.state.avatarUrl !== cookie.load("token").profile.avatarUrl
    ) {
      this.setState({
        avatarUrl: cookie.load("token").profile.avatarUrl,
        fullName: cookie.load("token").profile.fullName
      });
    }
  }

  render() {
    return (
      <div className="shortProfile">
        <Image
          img={this.state.avatarUrl}
          width={28}
          height={28}
        />
        <span>
          {this.state.fullName}
        </span>
        <AngleDown />
      </div>
    );
  }
}
ShortProfile.contextType = UpdateContext;
