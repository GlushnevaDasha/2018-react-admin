import React, { useState } from "react";
import Modal from "./Modal";

import "../stylesheets/components/MenuBar.css";

import AddUser from "./AddContent/User";
import AddHeadings from "./AddContent/Headings";
import AddPodcast from "./AddContent/Podcast";
import AddContentByURL from "./AddContent/ContentByURL";
import { AddContentByURLAndHeader } from "./AddContent/Content";

import { DropdownQuestion } from "./Dropdown";
import { IconAdd, Question } from "../content/Icons";

function MenuBar(props) {
  const [isShowModal, setIsShowModal] = useState(false);
  const hideModal = () => {
    setIsShowModal(false);
  };
  const renderModalForm = () => {
    switch (props.forma) {
      case "URL":
        return (
          <AddContentByURL
            hideModal={hideModal}
            header={props.params.header}
            linkDesc={props.params.linkDesc}
            reminder={props.params.reminder}
          />
        );
      case 2:
        return (
          <AddContentByURLAndHeader
            hideModal={hideModal}
            header={props.params.header}
            linkDesc={props.params.linkDesc}
            reminder={props.params.reminder}
            cover={props.params.cover}
          />
        );
      case "User":
        return <AddUser hideModal={hideModal} />;
      case "Headings":
        return <AddHeadings hideModal={hideModal} />;
      case "Podcast":
        return <AddPodcast hideModal={hideModal} />;
      default:
        return null;
    }
  };
  return (
    <div className="menubarContainer">
      <div>
        <div className="headingContainer">
          <h1>{props.name}</h1>
          {/* /////////////////////////////////// */}
          {props.forma || props.link ? (
            <div style={{ paddingTop: 5 }}>
              <Modal isShowModal={isShowModal}>{renderModalForm()}</Modal>
              <div
                onClick={() => {
                  props.link
                    ? (document.location.href = props.link)
                    : setIsShowModal(true);
                }}
                style={{ cursor: "pointer" }}
              >
                <IconAdd />
              </div>
            </div>
          ) : null}
          {/* /////////////////////////////////// */}
        </div>
        <p>{props.description}</p>
      </div>
      <div>
        <DropdownQuestion
          button={
            <button className="questionButton">
              <Question />
            </button>
          }
        />
      </div>
    </div>
  );
}

export default MenuBar;
