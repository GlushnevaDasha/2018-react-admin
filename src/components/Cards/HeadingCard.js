import React, { Component } from "react";
import { UpdateContext } from "../../content/context";

import "../../stylesheets/components/Cards/HeadingCard.css";

export class HeadingCard extends Component {
  static contextType = UpdateContext;
  render() {
    let url = `/videos/playlist?id=${this.props.value.id}&title=${this.props.value.title}&des=${this.props.value.description}&active=${this.props.value.active}&page=1`;
    return (
      <div
        className={
          this.props.value.active ? "headingCard" : "headingCard disable"
        }
        onClick={() => {
          document.location.href = url;
        }}
      >
        <img src={this.props.value.imageUrl} width={265} headth={145} alt="" />

        <h4> {this.props.value.title} </h4>
        <span className="description">{this.props.value.description}</span>
        <span className="videoCounter">{`${this.props.value.videoCount} видео`}</span>
      </div>
    );
  }
}
