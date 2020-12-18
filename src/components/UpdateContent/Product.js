import React from "react";
import { ButtonLoader } from "../../atoms/Loader";
import { UpdateContext } from "../../content/context";
import { UploadWithPreview } from "../Upload";
import { addImage, updateProductSelectionItem } from "../../utils/api";
import { isEmpty } from "../../utils/functions";
import { URL_FILE } from "../../content/const";
export default class UpdateProduct extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = {
      imageName: "",
      fileImage: null,
      name: "",
      value: "",
      link: "",
      oldFile: "",
      exit: false,
      isFeatch: false
    };
  }

  componentDidMount() {
    this.setState({
      oldFile: this.props.value.imageUrl,
      name: this.props.value.name,
      value: this.props.value.value,
      link: this.props.value.link
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.state.exit) {
      this.setState({ isFeatch: true });
      let nameImage = {};
      if (this.state.fileImage === null) {
        nameImage = { fileName: this.state.oldFile };
      } else {
        nameImage = await addImage(this.state.fileImage);
      }
      const result = await updateProductSelectionItem(this.props.value.id, {
        imageUrl:
          nameImage.fileName.indexOf("https") !== -1
            ? nameImage.fileName
            : URL_FILE + nameImage.fileName,
        link: this.state.link,
        name: this.state.name,
        value: this.state.value
      });
      if (result.error) {
        alert("Ошибка обновления данных. Код ошибки: ", result.code);
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
          <h2>Редактирование продукта</h2>
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
            <div className="inputCounter">
              <p>{50 - this.state.name.length}</p>
            </div>
          </div>

          <div className="inputWrapper">
            <input
              type="text"
              placeholder={"Ссылка на страницу продукта"}
              className="input100"
              value={this.state.link}
              onChange={event => {
                this.setState({
                  link: event.target.value
                });
              }}
            />
          </div>

          <div className="inputWrapper">
            <input
              type="text"
              placeholder={"Стоимость"}
              className="input100"
              value={this.state.value}
              onChange={event => {
                this.setState({
                  value: event.target.value
                });
              }}
            />
          </div>

          <div className="modalWindowSection">
            <h4>Загрузите фото</h4>
            <span className="input_description">
              Соотношение 1:1; Минимальный размер 600×600px; Белый фон.
              Посмотрите хорошие примеры в гайде.
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
