import React from "react";
import { ButtonLoader } from "../../atoms/Loader";
import { Link } from "react-router-dom";
import { UploadWithPreview } from "../../components/Upload";
import { BLUE } from "../../content/color";
import {
  getCompetition,
  editCompetitionById,
  addCompetition,
  addImage
} from "../../utils/api";
import {
  getParameterFromUrl,
  convertToDay,
  convertToTime
} from "../../utils/functions";
import { URL_FILE } from "../../content/const";
import { InputWithLength } from "../../components/CustomInput";
import "../../stylesheets/pages/Competitions/AddCompetitions.css";

var moment = require("moment");

export default class AddCompetition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: getParameterFromUrl("id"),
      file: null,
      imageUrl: "",
      nameFile: "",
      deadlineTime: "",
      deadlineDay: "",
      description: "",
      descriptor: "",
      name: "",
      resultStream: null,
      resultsTime: "",
      resultsDay: "",
      isFeatch: false,
      imageParam: null
    };
  }

  async componentDidMount() {
    if (this.state.id) {
      let data = await getCompetition(this.state.id);
      if (data.error) {
        this.setState({ error: true });
      } else {
        this.setState({
          imageUrl: data.imageUrl,
          nameFile: data.imageUrl.replace(`${URL_FILE}images/`, ""),
          deadlineTime: convertToTime(data.deadline),
          deadlineDay: convertToDay(data.deadline),
          description: data.description,
          descriptor: data.descriptor,
          name: data.name,
          resultStream: data.resultStream === "" ? null : data.resultStream,
          resultsTime: convertToTime(data.results),
          resultsDay: convertToDay(data.results)
        });
      }
    }
  }

  addOrUpdateCompetition = async () => {
    this.setState({ isFeatch: true });
    var img = new Image();
    if (!this.state.id) {
      let nameImage = await addImage(this.state.file);

      img.src = URL_FILE + nameImage.fileName;
      img.onload = () => {
        this.setState(
          {
            imageParam: { height: img.naturalHeight, width: img.naturalWidth }
          },
          async () => {
            let data = await addCompetition({
              deadline: moment(
                this.state.deadlineDay + " " + this.state.deadlineTime
              ).unix(),
              description: this.state.description,
              descriptor: this.state.descriptor,
              imageUrl: URL_FILE + nameImage.fileName,
              imageWidth: this.state.imageParam.width,
              imageHigh: this.state.imageParam.height,
              name: this.state.name,
              resultStream: this.state.resultStream,
              results: moment(
                this.state.resultsDay + " " + this.state.resultsTime
              ).unix()
            });
            if (data.error) {
              this.setState({ error: true, isFeatch: false });
            } else {
              this.setState({
                id: data.id,
                isFeatch: false
              });
              document.location.href = `/competition/?id=${this.state.id}`;
            }
          }
        );
      };
    } else {
      let nameImage = {};
      if ((this.state.file === null) & (this.state.id !== null)) {
        nameImage = { fileName: this.state.imageUrl };
      } else {
        nameImage = await addImage(this.state.file);
      }

      if (nameImage.fileName.indexOf("https") !== -1) {
        img.src = nameImage.fileName;
      } else {
        img.src = URL_FILE + nameImage.fileName;
      }

      img.onload = () => {
        this.setState(
          {
            imageParam: { height: img.naturalHeight, width: img.naturalWidth }
          },
          async () => {
            let data = await editCompetitionById(this.state.id, {
              deadline: moment(
                this.state.deadlineDay + " " + this.state.deadlineTime
              ).unix(),
              description: this.state.description,
              descriptor: this.state.descriptor,
              imageUrl:
                nameImage.fileName.indexOf("https") !== -1
                  ? nameImage.fileName
                  : URL_FILE + nameImage.fileName,
              imageWidth: this.state.imageParam.width,
              imageHigh: this.state.imageParam.height,
              name: this.state.name,
              resultStream: this.state.resultStream,
              results: moment(
                this.state.resultsDay + " " + this.state.resultsTime
              ).unix()
            });
            if (data.error) {
              this.setState({ error: true, isFeatch: false });
            } else {
              this.setState({
                id: data.id,
                isFeatch: true
              });
              document.location.href = `/competition/?id=${this.state.id}`;
            }
          }
        );
      };
    }
  };

  render() {
    return (
      <div className="addCompetitionWrapper">
        <div>
          <div className="header">
            {this.state.id ? (
              <h2>Редактирование конкурса</h2>
            ) : (
              <h2>Создание конкурса</h2>
            )}

            <p>
              Перед началом ознакомтесь с{" "}
              <Link style={{ color: BLUE }}>гайдлайнами</Link>, где вы найдете
              примеры правильного оформления.
            </p>
          </div>

          <div className="formBlock">
            <h4>Расскажите о конкурсе</h4>
            <p className="formBlockDescription">
              Желательно сделать это кратко и ёмко.
            </p>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <InputWithLength
                styleDiv={{ width: 388 }}
                maxLength={30}
                placeholder={"Дескриптор"}
                state={this.state.descriptor}
                onChange={event => {
                  this.setState({ descriptor: event.target.value });
                }}
              />

              <InputWithLength
                styleDiv={{ width: 388 }}
                maxLength={50}
                placeholder={"Название"}
                state={this.state.name}
                onChange={event => {
                  this.setState({ name: event.target.value });
                }}
              />
            </div>

            <div style={{ paddingTop: 20 }}>
              <textarea
                placeholder={"Описание"}
                className="input100"
                value={this.state.description}
                onChange={event => {
                  this.setState({ description: event.target.value });
                }}
              />
            </div>
          </div>

          <div className="formBlock">
            <h4>Загрузите обложку</h4>
            <p className="formBlockDescription">
              Минимальный размер 1005×735px
            </p>

            <div>
              <UploadWithPreview
                value={{
                  imageUrl: this.state.imageUrl,
                  setFile: newFile => {
                    this.setState({
                      file: newFile
                    });
                  },
                  deleteFile: () => {
                    this.setState({ file: null, imageUrl: "" });
                  }
                }}
                text={"Выбор фото"}
                type={"image/*"}
              />
            </div>
          </div>

          <div className="formBlock">
            <h4>Укажите дедлайн</h4>
            <p className="formBlockDescription">
              Дата, до которой будут приниматься заявки
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: 388
              }}
            >
              <div style={{ width: 255 }}>
                <input
                  className="input100"
                  type="date"
                  placeholder={"DD.MM.YYYY"}
                  value={this.state.deadlineDay}
                  onChange={event => {
                    this.setState({ deadlineDay: event.target.value });
                  }}
                />
              </div>

              <div style={{ width: 125 }}>
                <input
                  type="time"
                  placeholder={"21:00"}
                  className="input100"
                  value={this.state.deadlineTime}
                  onChange={event => {
                    this.setState({ deadlineTime: event.target.value });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="formBlock">
            <h4>Подведение итогов</h4>
            <p className="formBlockDescription">
              Укажите дату подведения итогов, а так же ссылку на стрим, если он
              будет проводиться.
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flex: 1
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: 388
                }}
              >
                <div style={{ width: 255 }}>
                  <input
                    type="date"
                    placeholder={"DD.MM.YYYY"}
                    className="input100"
                    value={this.state.resultsDay}
                    onChange={event => {
                      this.setState({ resultsDay: event.target.value });
                    }}
                  />
                </div>

                <div style={{ width: 125 }}>
                  <input
                    type="time"
                    placeholder={"21:00"}
                    className="input100"
                    value={this.state.resultsTime}
                    onChange={event => {
                      this.setState({ resultsTime: event.target.value });
                    }}
                  />
                </div>
              </div>

              <div style={{ width: 388 }}>
                <input
                  type="text"
                  placeholder={"Ссылка на стрим"}
                  className="input100"
                  value={this.state.resultStream}
                  onChange={event => {
                    this.setState({ resultStream: event.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="submitWrapper">
          <div
            onClick={() => {
              this.addOrUpdateCompetition();
            }}
          >
            <p className="large_button active" style={{ width: "100%" }}>
              {this.state.isFeatch ? (
                <ButtonLoader />
              ) : this.state.id ? (
                "Сохранить изменения"
              ) : (
                "Создать и продолжить"
              )}
            </p>
          </div>

          <p className="button_description">
            Конкурс не будет опубликован. Вы сможете добавить призы, условия и
            создать форму для участия.
          </p>
        </div>
      </div>
    );
  }
}
