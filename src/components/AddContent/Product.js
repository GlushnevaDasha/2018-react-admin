import React from "react";
import { UpdateContext } from "../../content/context";
import { UploadWithPreview } from "../Upload";
import { ButtonLoader } from "../../atoms/Loader";
import { addImage, createProductSelectionItem } from "../../utils/api";
import { isEmpty } from "../../utils/functions";
import { URL_FILE } from "../../content/const";

export default class AddProduct extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.refUploadImage = React.createRef();
    this.state = {
      file: null,
      name: "",
      value: "",
      link: "",
      exit: false,
      isFeatch: false
    };
  }

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.state.exit) {
      this.setState({ isFeatch: true });
      const nameImage = await addImage(this.state.file);
      if (nameImage.error) {
        alert(
          "Картинка не сохранилась на файловый сервер. Пожалуйста, повторите попытку позже."
        );
      } else {
        const result = await createProductSelectionItem(this.props.id, {
          imageUrl: URL_FILE + nameImage.fileName,
          link: this.state.link,
          name: this.state.name,
          value: this.state.value
        });
        if (result.error) {
          alert(result.message);
        } else {
          if (!isEmpty(result)) {
            this.context.setState();
            this.setState({
              file: null,
              name: "",
              value: "",
              link: ""
            });
            this.refUploadImage.current.clear();
          }
        }
      }
    }
    this.setState({ exit: false, isFeatch: true });
    this.props.hideModal();
  };
  componentDidMount() {}

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <h2>Добавьте продукт</h2>
          <div className="inputWrapper">
            <input
              maxLength={50}
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
                ref={this.refUploadImage}
                value={{
                  imageUrl: "",
                  setFile: newFile => {
                    this.setState({
                      file: newFile
                    });
                  },
                  deleteFile: () => {
                    this.setState({ file: null, imageUrl: "" });
                  },
                  close: this.state.exit
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
              {this.state.isFeatch ? <ButtonLoader /> : "Добавить"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
