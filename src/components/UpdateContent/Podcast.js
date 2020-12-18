import React from "react";
import { ButtonLoader } from "../../atoms/Loader";
import { UpdateContext } from "../../content/context";
import { UploadWithPreview } from "../Upload";
import { addImage, updatePodcast } from "../../utils/api";
import { isEmpty } from "../../utils/functions";
import { URL_FILE } from "../../content/const";
export default class AddPodcast extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = {
      fileImage: null,
      name: "",
      number: "",
      oldFile: "",
      exit: false,
      isFeatch: false
    };
  }

  componentDidMount() {
    this.setState({
      oldFile: this.props.value.imageUrl,
      name: this.props.value.title,
      number: this.props.value.number
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.state.exit) {
      this.setState({ isFeatch: true });
      let nameImage = { fileName: this.state.oldFile };
      if (this.state.fileImage !== null) {
        nameImage = await addImage(this.state.fileImage);
      }
      const result = await updatePodcast(this.props.value.id, {
        imageUrl:
          nameImage.fileName.indexOf("https") !== -1
            ? nameImage.fileName
            : URL_FILE + nameImage.fileName,
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
    this.setState({ exit: false, isFeatch: false });
    this.props.hideModal();
  };

  onDropIMG = acceptedFiles => {
    let reader = new FileReader();
    let file = acceptedFiles[0];
    reader.onloadend = () => {
      this.setState({
        fileImage: file
      });
    };
    reader.readAsDataURL(file);
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h2>Редактируйте подкаст</h2>
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
              Соотношение 1:1. Минимальный размер 600х600px
            </span>
            <div style={{ paddingTop: 15, paddingBottom: 5 }}>
              <UploadWithPreview
                value={{
                  imageUrl: this.state.oldFile,
                  setFile: newFile => {
                    this.setState({
                      fileImage: newFile
                    });
                  },
                  deleteFile: () => {
                    this.setState({ fileImage: null, imageUrl: "" });
                  }
                }}
                text={"Выберите фото"}
                type={"image/*"}
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
              {this.state.isFeatch ? <ButtonLoader /> : "Обновить"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
