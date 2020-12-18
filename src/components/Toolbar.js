import React, { Component } from "react";
import PropTypes from "prop-types";
import { EditorState, RichUtils } from "draft-js";
import classNames from "classnames";
import { getSelectionCoords } from "../utils/functions";

export default class Toolbar extends Component {
  static defaultProps = {
    shouldDisplayToolbarFn(props, state) {
      return (
        (props.editorHasFocus || state.editingEntity) &&
        !props.editorState.getSelection().isCollapsed()
      );
    }
  };
  static propTypes = {
    editorHasFocus: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      editingEntity: null,
      link: "",
      error: null
    };
    this.renderButton = this.renderButton.bind(this);
    this.cancelEntity = this.cancelEntity.bind(this);
    this.removeEntity = this.removeEntity.bind(this);
    this.setError = this.setError.bind(this);
    this.cancelError = this.cancelError.bind(this);
  }

  toggleInlineStyle(inlineStyle) {
    const newEditorState = RichUtils.toggleInlineStyle(
      this.props.editorState,
      inlineStyle
    );
    this.props.onChange(newEditorState);
  }

  toggleBlockType(blockType) {
    this.props.onChange(
      RichUtils.toggleBlockType(this.props.editorState, blockType)
    );
  }

  toggleEntity(entity) {
    this.setState({ editingEntity: entity });
  }

  renderButton(item) {
    let key = item.label;

    const { entity = "LINK" } = item;
    key = "entity-" + entity;

    return (
      <ToolbarItem
        key={key}
        active={this.hasEntity(entity)}
        toggle={this.toggleEntity(entity)}
        item={item}
      />
    );
  }

  setError(errorMsg) {
    this.setState({ error: errorMsg });
  }

  cancelError() {
    this.setState({ error: null });
  }

  setBarPosition() {
    const editor = this.props.editor;
    const toolbar = this.toolbarEl;
    const selectionCoords = getSelectionCoords(editor, toolbar);

    if (!selectionCoords) {
      return null;
    }

    if (
      (selectionCoords && !this.state.position) ||
      this.state.position.top !== selectionCoords.offsetTop ||
      this.state.position.left !== selectionCoords.offsetLeft ||
      this.state.arrowStyle !== selectionCoords.arrowStyle ||
      !this.state.show
    ) {
      this.setState({
        show: true,
        position: {
          top: selectionCoords.offsetTop,
          left: selectionCoords.offsetLeft
        },
        arrowStyle: selectionCoords.arrowStyle
      });
    }
  }

  handleSetToolbar() {
    if (this.props.shouldDisplayToolbarFn(this.props, this.state)) {
      this.shouldUpdatePos = false;
      return this.setBarPosition();
    } else {
      if (this.state.show) {
        this.setState({
          show: false,
          editingEntity: null,
          link: "",
          error: null
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentContentState = this.props.editorState.getCurrentContent();
    const newContentState = nextProps.editorState.getCurrentContent();

    if (currentContentState === newContentState) {
      this.shouldUpdatePos = true;
    }
  }

  componentDidUpdate() {
    if (this.shouldUpdatePos) {
      this.handleSetToolbar();
    }
  }

  getCurrentEntityKey() {
    const selection = this.props.editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const contentState = this.props.editorState.getCurrentContent();
    const anchorBlock = contentState.getBlockForKey(anchorKey);
    const offset = selection.anchorOffset;
    const index = selection.isBackward ? offset - 1 : offset;
    return anchorBlock.getEntityAt(index);
  }

  getCurrentEntity() {
    const contentState = this.props.editorState.getCurrentContent();
    const entityKey = this.getCurrentEntityKey();
    if (entityKey) {
      return contentState.getEntity(entityKey);
    }
    return null;
  }

  hasEntity(entityType) {
    const entity = this.getCurrentEntity();
    if (entity && entity.getType() === entityType) {
      return true;
    }
    return false;
  }

  setEntity(entityType, data, mutability = "MUTABLE") {
    const { editorState } = this.props;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      entityType,
      mutability,
      data
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newState = RichUtils.toggleLink(
      editorState,
      editorState.getSelection(),
      entityKey
    );
    const selectionState = EditorState.forceSelection(
      newState,
      editorState.getSelection()
    );

    this.props.onChange(selectionState);
  }

  removeEntity() {
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.props.onChange(RichUtils.toggleLink(editorState, selection, null));
    }
    this.cancelEntity();
  }

  cancelEntity() {
    this.setState(
      {
        editingEntity: null,
        error: null
      },
      () => {
        this.props.draft && this.props.draft.focus();
      }
    );
  }
  renderEntityInput(entityType) {
    if (!this.props.entityInputs) {
      console.warn("no entityInputs provided");
      return null;
    }
    const Component = this.props.entityInputs[entityType];
    const setEntity = (data, mutability) =>
      this.setEntity(entityType, data, mutability);
    let entityData = {};
    let entity = null;
    if (this.hasEntity(entityType)) {
      entity = this.getCurrentEntity();
      if (entity) {
        entityData = entity.getData();
      }
    }
    if (Component) {
      return (
        <Component
          i18n={this.props.i18n}
          editorState={this.props.editorState}
          setEntity={setEntity}
          entityType={entityType}
          onChange={this.props.onChange}
          cancelEntity={this.cancelEntity}
          removeEntity={this.removeEntity}
          setError={this.setError}
          cancelError={this.cancelError}
          entity={entity}
          {...entityData}
        />
      );
    } else {
      console.warn("unknown entity type: " + entityType);
      return null;
    }
  }
  // Рендер кнопок изменения текста
  renderToolList() {
    return (
      <ul className="toolbar__list">
        {this.props.actions.map(this.renderButton)}
      </ul>
    );
  }
  render() {
    if (
      this.props.readOnly ||
      !this.props.shouldDisplayToolbarFn(this.props, this.state)
    ) {
      return null;
    }

    const toolbarClass = classNames("toolbar", {
      "toolbar--open": this.state.show,
      "toolbar--error": this.state.error
    });

    return (
      <div
        className={toolbarClass}
        style={this.state.position}
        ref="toolbarWrapper"
      >
        <div style={{ position: "absolute", bottom: 0 }}>
          <div
            className="toolbar__wrapper"
            ref={el => {
              this.toolbarEl = el;
            }}
            onMouseDown={e => {
              if (e.target.localName !== "input") {
                e.preventDefault();
              }
            }}
          >
            {this.state.editingEntity
              ? this.renderEntityInput(this.state.editingEntity)
              : this.renderToolList()}
            <p className="toolbar__error-msg">{this.state.error}</p>
            <span
              className="toolbar__arrow"
              ref={el => {
                this.arrowEl = el;
              }}
              style={this.state.arrowStyle}
            />
          </div>
        </div>
      </div>
    );
  }
}

class ToolbarItem extends Component {
  toggleAction(action) {
    if (action.toggle) {
      action.toggle(!action.active);
    }
  }

  render() {
    const Icon = this.props.item.icon;

    if (this.props.item.type === "separator") {
      return <li className="toolbar__item toolbar__item--separator" />;
    }

    const className = classNames("toolbar__item", {
      "toolbar__item--active": this.props.active
    });

    return (
      <li className={className}>
        <button
          onClick={() => {
            this.toggleAction(this.props);
          }}
          type="button"
          className="toolbar__button"
        >
          <Icon />
        </button>
      </li>
    );
  }
}
