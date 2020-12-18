import React from "react";
import { ButtonLoader } from "../../atoms/Loader";
import { UpdateContext } from "../../content/context";

import { UploadWithPreview } from "../Upload";
import { addImage, createCompetitionItem } from "../../utils/api";
import { URL_FILE } from "../../content/const";

export default class AddPrize extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      name: "",
      exit: false,
      isFeatch: false,
      isClose: false,
      imageParam: null
    };
  }

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.state.exit) {
      this.setState({ isFeatch: true });
      const nameImage = await addImage(this.state.file);
      if (nameImage.error) {
        alert(nameImage.message);
      } else {
        var img = new Image();
        img.src = URL_FILE + nameImage.fileName;
        img.onload = () => {
          this.setState(
            {
              imageParam: { height: img.naturalHeight, width: img.naturalWidth }
            },
            async () => {
              const result = await createCompetitionItem(this.props.id, {
                imageUrl: URL_FILE + nameImage.fileName,
                name: this.state.name,
                imageWidth: this.state.imageParam.width,
                imageHigh: this.state.imageParam.height
              });
              if (result.error) {
                alert(result.message);
                this.props.hideModal();
              } else {
                this.setState(
                  {
                    file: null,
                    name: "",
                    exit: false,
                    isFeatch: false,
                    isClose: true
                  },
                  () => {
                    this.context.setState();
                    this.props.hideModal();
                  }
                );
              }
            }
          );
        };
      }
    } else {
      this.props.hideModal();
    }
  };

  onDropIMG = acceptedFiles => {
    let reader = new FileReader();
    let file = acceptedFiles[0];
    reader.onloadend = () => {
      this.setState({
        file: file
      });
    };
    reader.readAsDataURL(file);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h2>Добавьте приз</h2>
          <div className="inputWrapper">
            <input
              type="text"
              placeholder={"Название"}
              className="input100"
              value={this.state.name}
              onChange={event => {
                this.setState({
                  name: event.target.value
                });
              }}
            />
          </div>

          <div className="modalWindowSection">
            <h4>Загрузите фото</h4>
            <span className="input_description">
              Минимальный размер 1000×1000px
            </span>
            <div style={{ paddingTop: 15, paddingBottom: 5 }}>
              <UploadWithPreview
                value={{
                  imageUrl: "",
                  setFile: newFile => {
                    this.setState({
                      file: newFile
                    });
                  },
                  deleteFile: () => {
                    this.setState({ file: null, imageUrl: "" });
                  }
                }}
                text={"Выберите фото"}
                type={"image/*"}
                isClose={this.state.isClose}
                editState={() => {
                  this.setState({ isClose: false });
                }}
              />
            </div>
          </div>

          <div className="buttonsWrapper">
            <div style={{ flex: 1 }} />
            <button
              className="large_button simple"
              onClick={() => {
                this.setState({ exit: true });
                this.props.hideModal();
              }}
            >
              Отмена
            </button>

            <button
              className="large_button active"
              onSubmit={this.handleSubmit}
            >
              {this.state.isFeatch ? <ButtonLoader /> : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
