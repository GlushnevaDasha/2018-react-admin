import React from "react";
import { ButtonLoader } from "../../atoms/Loader";
import { Link } from "react-router-dom";
import { MegadraftEditor, editorStateFromRaw } from "megadraft";
import Toolbar from "../../components/Toolbar";
import { stateToMarkdown } from "draft-js-export-markdown";
import { markdownToDraft } from "markdown-draft-js";
import { UploadWithPreview } from "../../components/Upload";
import {
  feedById,
  feedUpdateById,
  feedCreate,
  addImage,
  feedPublish
} from "../../utils/api";
import { URL_FILE, URL_HOST } from "../../content/const";
import "../../stylesheets/pages/Feed/megadraft.css";
import "../../stylesheets/pages/Feed/TextEditorPage.css";

export default class TextEditorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: window.location.href
        .replace(`${URL_HOST}/feed/exclusive/`, "")
        .replace(":", ""),
      activeContent: true,
      mark: "",
      file: null,
      imageUrl: "",
      isShowPublish: false,
      headerState: "",
      contentState: editorStateFromRaw(null),
      content: null,
      isFeatch: false,
      isSave: false
    };
    this.onChange = contentState => {
      this.setState({ contentState });
    };
  }

  async componentDidMount() {
    if (this.state.id !== "add") {
      let data = await feedById(this.state.id);
      if (data.error) {
        this.setState({ error: true });
      } else {
        this.setState({
          headerState: data.title,
          contentState: editorStateFromRaw(markdownToDraft(data.content)),
          mark: data.tag,
          imageUrl: data.fileName
        });
      }
    }
  }

  onDrop = acceptedFiles => {
    let reader = new FileReader();
    let file = acceptedFiles[0];
    reader.onloadend = () => {
      this.setState({
        file: file
      });
    };
    reader.readAsDataURL(file);
  };

  addOrEditFeed = async () => {
    this.setState({ isSave: true });
    if (this.state.id === "add") {
      let nameImage = await addImage(this.state.file);
      let data = await feedCreate({
        content: stateToMarkdown(this.state.contentState.getCurrentContent()),
        fileName: URL_FILE + nameImage.fileName,
        tag: this.state.mark,
        title: this.state.headerState
      });
      if (data.error) {
        this.setState({ error: true, isSave: false });
      } else {
        this.setState({
          id: data.id,
          headerState: data.title,
          contentState: editorStateFromRaw(markdownToDraft(data.content)),
          mark: data.tag,
          imageUrl: data.fileName,
          isSave: false
        });
        document.location.href = "/feed/exclusives?page=1";
      }
    } else {
      let nameImage = { fileName: "" };
      if ((this.state.file === null) & (this.state.id !== null)) {
        nameImage = { fileName: this.state.imageUrl };
      } else {
        nameImage = await addImage(this.state.file);
      }
      let data = await feedUpdateById(this.state.id, {
        content: stateToMarkdown(this.state.contentState.getCurrentContent()),
        fileName:
          nameImage.fileName.indexOf("https") !== -1
            ? nameImage.fileName
            : URL_FILE + nameImage.fileName,
        tag: this.state.mark,
        title: this.state.headerState
      });
      if (data.error) {
        this.setState({ error: true, isSave: false });
      } else {
        this.setState({
          headerState: data.title,
          contentState: editorStateFromRaw(markdownToDraft(data.content)),
          mark: data.tag,
          imageUrl: data.fileName,
          isSave: false
        });
        document.location.href = "/feed/exclusives?page=1";
      }
    }
  };

  render() {
    return (
      <div>
        {this.state.isShowPublish ? (
          <div className="textEditor">
            <div className="prePublish">
              <div>
                <h2>Настройка публикации</h2>
                <p>
                  Вы можете ознакомиться с хорошими примерами оформления
                  публикаций в <Link>гайдлайнах</Link>.
                </p>
              </div>

              <div>
                <h4>Добавьте метку</h4>
                <p>Метка нужна, чтобы выделить публикацию среди других.</p>
                <div className="inputWrapper" style={{ maxWidth: 400 }}>
                  <input
                    maxLength={30}
                    type="text"
                    placeholder={"Например, «Мнение»"}
                    className="input100"
                    value={this.state.mark}
                    onChange={event => {
                      this.setState({ mark: event.target.value });
                    }}
                  />
                  <div className="inputCounter">
                    <p>{30 - this.state.mark.length}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4>Загрузите обложку</h4>
                <p>Минимальный размер 1000×1000px</p>
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
            </div>

            <div className="buttonsBar">
              <Link
                className="medium_button simple"
                onClick={() => {
                  this.setState({
                    isShowPublish: false
                  });
                }}
              >
                В редактор
              </Link>

              <div>
                <Link
                  className="medium_button simple"
                  style={{ marginRight: 8 }}
                  onClick={() => {
                    this.addOrEditFeed();
                  }}
                >
                  {this.state.isSave ? <ButtonLoader /> : "Сохранить"}
                </Link>
                <Link
                  className="medium_button active"
                  onClick={async () => {
                    if (this.state.id === "add") {
                      this.setState({ isFeatch: true });
                      let nameImage = await addImage(this.state.file);
                      let data = await feedCreate({
                        content: stateToMarkdown(
                          this.state.contentState.getCurrentContent()
                        ),
                        fileName:
                          nameImage.fileName.indexOf("https") !== -1
                            ? nameImage.fileName
                            : URL_FILE + nameImage.fileName,
                        tag: this.state.mark,
                        title: this.state.headerState
                      });
                      if (data.error) {
                        this.setState({ error: true, isFeatch: false });
                      } else {
                        this.setState({
                          id: data.id,
                          headerState: data.title,
                          contentState: editorStateFromRaw(
                            markdownToDraft(data.content)
                          ),
                          mark: data.tag,
                          imageUrl: data.fileName,
                          isFeatch: false
                        });
                      }
                    } else {
                      let nameImage = { fileName: "" };
                      if (
                        (this.state.file === null) &
                        (this.state.id !== null)
                      ) {
                        nameImage = { fileName: this.state.imageUrl };
                      } else {
                        nameImage = await addImage(this.state.file);
                      }
                      let data = await feedUpdateById(this.state.id, {
                        content: stateToMarkdown(
                          this.state.contentState.getCurrentContent()
                        ),
                        fileName:
                          nameImage.fileName.indexOf("https") !== -1
                            ? nameImage.fileName
                            : URL_FILE + nameImage.fileName,
                        tag: this.state.mark,
                        title: this.state.headerState
                      });
                      if (data.error) {
                        this.setState({ error: true, isFeatch: false });
                      } else {
                        this.setState({
                          headerState: data.title,
                          contentState: editorStateFromRaw(
                            markdownToDraft(data.content)
                          ),
                          mark: data.tag,
                          imageUrl: data.fileName
                        });
                      }
                    }
                    let data = await feedPublish(this.state.id);
                    if (data.error) {
                      this.setState({ error: true, isFeatch: false });
                    } else {
                      this.setState({ isFeatch: false });
                      document.location.href = "/feed/exclusives?page=1";
                    }
                  }}
                >
                  {this.state.isFeatch ? (
                    <ButtonLoader />
                  ) : (
                    "Опубликовать сейчас"
                  )}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="textEditor">
            <div className="c-editor-container js-editor-container">
              <div>
                <textarea
                  className="editorHeader"
                  placeholder={"Заголовок"}
                  value={this.state.headerState}
                  onChange={event => {
                    this.setState({ headerState: event.target.value });
                  }}
                />
              </div>

              {this.state.activeContent ? (
                <MegadraftEditor
                  className="editorContent"
                  placeholder="А теперь постарайтесь рассказать что-то интересное"
                  editorState={this.state.contentState}
                  // actions={customActions}
                  Toolbar={Toolbar}
                  onChange={this.onChange}
                  keyBindings={[
                    {
                      name: "save",
                      isKeyBound: e => {
                        return e.keyCode === 83 && e.ctrlKey;
                      },
                      action: () => {
                        this.onSave();
                      }
                    }
                  ]}
                  resetStyleNewLine={true}
                  maxSidebarButtons={null}
                />
              ) : null}
            </div>

            <div className="buttonsBar">
              <Link
                className="medium_button simple"
                onClick={() => {
                  this.addOrEditFeed();
                }}
              >
                {this.state.isSave ? <ButtonLoader /> : "Сохранить"}
              </Link>
              <Link
                className="medium_button active"
                onClick={() => {
                  this.setState({
                    isShowPublish: true
                  });
                }}
              >
                Готовы публиковать?
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }
}
