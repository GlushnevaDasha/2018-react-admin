import React from "react";
import { ButtonLoader } from "../../atoms/Loader";
import { UpdateContext } from "../../content/context";
import { UploadWithPreview } from "../Upload";
import { addMP3, addImage, createPodcast } from "../../utils/api";
import { isEmpty } from "../../utils/functions";
import { URL_FILE } from "../../content/const";

export default class AddPodcast extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = {
      fileImage: null,
      fileMP3: null,
      name: "",
      number: "",
      exit: false,
      isFeatch: false
    };
  }

  isActive = () => {
    return this.state.name !== "" &&
      this.state.number !== "" &&
      this.state.fileMP3 !== null &&
      this.state.fileImage !== null
      ? true
      : false;
  };

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.state.exit) {
      this.setState({ isFeatch: true });
      const nameImage = await addImage(this.state.fileImage);
      if (nameImage.error) {
        alert("Не удалось загрузить файлы");
      } else {
        const nameMP3 = await addMP3(this.state.fileMP3);
        if (nameMP3.error) {
          alert("Не удалось загрузить файлы");
        } else {
          const result = await createPodcast({
            fileUrl: URL_FILE + nameMP3.fileName,
            duration: nameMP3.duration,
            imageUrl: URL_FILE + nameImage.fileName,
            number: this.state.number,
            title: this.state.name
          });
          if (result.error) {
            alert(result.message);
          } else {
            if (!isEmpty(result)) {
              this.context.setState();
            }
          }
        }
      }
    }
    this.setState({ exit: false, isFeatch: false });
    this.props.hideModal();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h2>Загрузите подкаст</h2>
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
          <div className="inputWrapper">
            <input
              type="text"
              placeholder={"Номер выпуска"}
              className="input100"
              value={this.state.number}
              onChange={event => {
                this.setState({
                  number: event.target.value
                });
              }}
            />
          </div>

          <div className="modalWindowSection">
            <h4>Загрузите обложку</h4>
            <span className="input_description">
              Соотношение 1:1. Минимальный размер 600х600px.
            </span>
            <div style={{ paddingTop: 15, paddingBottom: 5 }}>
              <UploadWithPreview
                value={{
                  imageUrl: "",
                  setFile: newFile => {
                    this.setState({
                      fileImage: newFile
                    });
                  },
                  deleteFile: () => {
                    this.setState({ fileImage: null, imageUrl: "" });
                  }
                }}
                text={"Выбор фото"}
                type={"image/*"}
              />
            </div>
          </div>

          <div className="modalWindowSection">
            <h4>Файл подкаста</h4>
            <span className="input_description">Принимаем mp3.</span>
            <div style={{ paddingTop: 15, paddingBottom: 5 }}>
              <UploadWithPreview
                value={{
                  imageUrl: "",
                  setFile: newFile => {
                    this.setState({
                      fileMP3: newFile
                    });
                  },
                  deleteFile: () => {
                    this.setState({ fileMP3: null, imageUrl: "" });
                  }
                }}
                text={"Выберите файл"}
                type={"audio/*"}
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
              className={
                this.isActive() ? "large_button active" : "large_button disable"
              }
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
