import React from "react";
import Dropzone from "react-dropzone";
import { BLUE } from "../content/color";
import { URL_FILE } from "../content/const";
import { File } from "../content/Icons";
import { isSubstring } from "../utils/functions";
import "../stylesheets/components/Upload.css";

export class UploadWithPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newFile: null,
      newImageUrl: null,
      nameFile: "",
      isUpdate: true
    };
  }
  onDrop = acceptedFiles => {
    let reader = new FileReader();
    let file = acceptedFiles[0];

    reader.onloadend = () => {
      this.setState({
        newFile: file,
        newImageUrl: reader.result,
        nameFile: file.name
      });
      this.props.value.setFile(file);
    };

    reader.readAsDataURL(file);
  };

  clear = () => {
    this.setState({
      newFile: null,
      newImageUrl: "",
      nameFile: ""
    });
  };

  componentDidMount() {
    this.setState({
      newImageUrl: this.props.value.imageUrl || "",
      nameFile: this.props.value.imageUrl.replace(`${URL_FILE}images/`, "")
    });
  }

  componentDidUpdate() {
    if (this.props.value.imageUrl !== "" && this.state.isUpdate) {
      this.setState({
        newImageUrl: this.props.value.imageUrl || "",
        nameFile: this.props.value.imageUrl.replace(`${URL_FILE}images/`, ""),
        isUpdate: false
      });
    }
    if (this.props.isClose) {
      this.props.editState();
      this.clear();
    }
  }

  render() {
    if (
      this.state.newFile === null &&
      (this.state.newImageUrl === "" ||
        isSubstring(this.state.newImageUrl, "undefined"))
    ) {
      return (
        <Dropzone onDrop={this.onDrop} accept={this.props.type} minSize={0}>
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragReject,
            rejectedFiles
          }) => {
            const isFileTooLarge = rejectedFiles.length > 0;
            return (
              <div style={{ display: "flex" }}>
                <div
                  className={this.props.style ? null : "medium_button active"}
                  style={this.props.style}
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  {!isDragActive && this.props.text}
                  {isDragActive && !isDragReject && "Перетащите файл сюда"}
                  {isDragReject && "Сори, не тот тип файла"}
                  {isFileTooLarge && (
                    <div className="text-danger mt-2">File is too large.</div>
                  )}
                </div>
                <div style={{ flex: 1 }} />
              </div>
            );
          }}
        </Dropzone>
      );
    } else {
      return (
        <div className="uploadPreview">
          {this.props.type !== "image/*" ? (
            <div className="fileWrapper">
              <File />
            </div>
          ) : (
            <img src={this.state.newImageUrl} alt="img" />
          )}
          <div>
            <p className="name">{this.state.nameFile}</p>
            <div className="uploadPreview buttons">
              <Dropzone
                onDrop={this.onDrop}
                accept={this.props.type}
                minSize={0}
              >
                {({
                  getRootProps,
                  getInputProps,
                  isDragActive,
                  isDragReject,
                  rejectedFiles
                }) => {
                  const isFileTooLarge = rejectedFiles.length > 0;
                  return (
                    <div style={{ display: "flex" }}>
                      <div
                        className="upload"
                        style={{
                          backgroundColor: "rgba(0,0,0,0)",
                          color: BLUE
                        }}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        {!isDragActive && "Загрузить другой файл"}
                        {isDragActive &&
                          !isDragReject &&
                          "Drop it like it's hot!"}
                        {isDragReject && "File type not accepted, sorry!"}
                        {isFileTooLarge && (
                          <div className="text-danger mt-2">
                            File is too large.
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1 }} />
                    </div>
                  );
                }}
              </Dropzone>
              <div
                className="delete"
                onClick={() => {
                  this.setState({ newFile: null, newImageUrl: "" });
                  this.props.value.deleteFile();
                }}
              >
                <p>Удалить</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export class Upload extends React.Component {
  render() {
    return (
      <Dropzone onDrop={this.props.onDrop} accept={this.props.type} minSize={0}>
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragReject,
          rejectedFiles
        }) => {
          const isFileTooLarge = rejectedFiles.length > 0;
          return (
            <div style={{ display: "flex" }}>
              <div
                className={this.props.style ? null : "medium_button active"}
                style={this.props.style}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {!isDragActive && this.props.text}
                {isDragActive && !isDragReject && "Drop it like it's hot!"}
                {isDragReject && "File type not accepted, sorry!"}
                {isFileTooLarge && (
                  <div className="text-danger mt-2">File is too large.</div>
                )}
              </div>
              <div style={{ flex: 1 }} />
            </div>
          );
        }}
      </Dropzone>
    );
  }
}
