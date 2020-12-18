import React from "react";
import { ButtonLoader } from "../../atoms/Loader";
import { UpdateContext } from "../../content/context";
import { BLUE, WHITE } from "../../content/color";
import Line from "../Line";
import { UploadWithPreview } from "../Upload";
import { addImage, updateCompetitionItem } from "../../utils/api";
import { isSubstring } from "../../utils/functions";
import { URL_FILE } from "../../content/const";

export default class UpdatePrize extends React.Component {
  static contextType = UpdateContext;
  constructor(props) {
    super(props);
    this.state = {
      fileImage: "",
      file: null,
      name: "",
      exit: false,
      isFeatch: false,
      imageParam: null
    };
  }

  componentDidMount() {
    this.setState({
      fileImage: this.props.value.imageUrl,
      name: this.props.value.name
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.state.exit) {
      this.setState({ isFeatch: true });
      let nameImage = { fileName: this.state.fileImage };
      if (this.state.file !== null) {
        nameImage = await addImage(this.state.file);
      }
      let imgURL = isSubstring(nameImage.fileName, "https")
        ? nameImage.fileName
        : URL_FILE + nameImage.fileName;

      var img = new Image();
      img.src = imgURL;
      img.onload = () => {
        this.setState(
          {
            imageParam: { height: img.naturalHeight, width: img.naturalWidth }
          },
          async () => {
            const result = await updateCompetitionItem(this.props.value.id, {
              imageUrl: imgURL,
              name: this.state.name,
              imageWidth: this.state.imageParam.width,
              imageHigh: this.state.imageParam.height
            });
            if (result.error) {
              alert(result.message);
            } else {
              this.context.setState();
              this.setState({ exit: false, isFeatch: false });
              this.props.hideModal();
            }
          }
        );
      };
    } else {
      this.setState({ exit: false, isFeatch: false });
      this.props.hideModal();
    }
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
          <h1>Измените приз</h1>
          <div style={{ paddingTop: 20, paddingBottom: 10 }}>
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
          <div style={{ paddingTop: 15, paddingBottom: 15 }}>
            <Line height={1} />
          </div>
          <h4 style={style.header}>Загрузите обложку</h4>
          <p style={{ font: "lighter 14px/20px GraphikLCG-Regular" }}>
            Минимальный размер 1000×1000px.
          </p>
          <div style={{ paddingTop: 15, paddingBottom: 5 }}>
            <UploadWithPreview
              value={{
                imageUrl: this.state.fileImage,
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
            />
          </div>
          <div style={{ paddingTop: 15, paddingBottom: 15 }}>
            <Line height={1} />
          </div>
          <div style={{ display: "flex", paddingTop: 10 }}>
            <div style={{ flex: 1 }} />
            <div>
              <button
                className="login"
                style={{
                  ...style.display,
                  ...style.button,
                  backgroundColor: "rgba(0,0,0,0)",
                  borderColor: "rgba(0,0,0,0)",
                  color: BLUE
                }}
                onClick={() => {
                  this.setState({ exit: true });
                  this.props.hideModal();
                }}
              >
                Отмена
              </button>
            </div>
            <div
              style={{
                marginLeft: 10
              }}
            >
              <button
                className={"large_button active"}
                onSubmit={this.handleSubmit}
              >
                {this.state.isFeatch ? <ButtonLoader /> : "Изменить"}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const style = {
  header: {
    fontFamily: "GraphikLCG-Medium",
    paddingTop: 10,
    paddingBottom: 10
  },
  display: {
    display: "flex"
  },
  button: {
    color: WHITE,
    justifyContent: "center",
    height: 50,
    backgroundColor: BLUE,
    borderRadius: 3
  }
};
