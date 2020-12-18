import React from "react";
import { UpdateContext } from "../../content/context";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { CustomLoader } from "../../atoms/Loader";
import Line from "../../components/Line";
import Modal from "../../components/Modal";
import { style } from "../../content/styles";
import {
  getParameterFromUrl,
  getStatus,
  getTheme,
  getColorHex
} from "../../utils/functions";
import {
  getProductSelection,
  publishProductSelection,
  deleteProductSelection
} from "../../utils/api";
import { NoData } from "../../components/Gag";
import { MenuHorizontal } from "../../content/Icons";
import { ProductRow } from "../../components/Tables/ProductRow";
import AddProduct from "../../components/AddContent/Product";
import SubmitPush from "../../components/AddContent/SubmitPush";
import { LabelBlue } from "../../atoms/Labels";

import "../../stylesheets/pages/shop/ProductGroupPage.css";

export default class ShopPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      isShowPush: false,
      description: "",
      descriptor: "",
      imageUrl: "",
      name: "",
      theme: "",
      color: "",
      status: "",
      product: null,
      isError: false,
      id: getParameterFromUrl("id"),
      isUpdate: false
    };
  }

  async deleteContent(id) {
    await deleteProductSelection(id);
    this.setState({
      isUpdate: !this.state.isUpdate
    });
  }

  async updateStatus(id, status) {
    let data = await publishProductSelection(id, status);
    if (data.error) {
    } else {
      this.setState({
        isUpdate: !this.state.isUpdate
      });
    }
  }

  async getData() {
    let data = await getProductSelection(this.state.id);
    if (data.error) {
      this.setState({
        isError: true
      });
    } else {
      this.setState({
        description: data.description,
        descriptor: data.descriptor,
        imageUrl: data.imageUrl,
        name: data.name,
        theme: data.theme,
        color: getColorHex(data.color),
        status: data.status,
        product: data.productSelectionItems
      });
    }
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate() {
    if (this.state.isUpdate) {
      this.getData();
      this.setState({
        isUpdate: false
      });
    }
  }

  changeCurrentPage(numPage) {
    this.setState({ page: numPage });
    this.getData();
  }

  render() {
    if (!this.state.product) {
      return <CustomLoader />;
    }
    return (
      <div>
        <UpdateContext.Provider
          value={{
            isUpdate: this.state.isUpdate,
            setState: () => {
              this.setState({
                isUpdate: !this.state.isUpdate
              });
            }
          }}
        >
          <div className="intent productGroupWrapper">
            <div className="productCover">
              <img src={this.state.imageUrl} alt="" />
            </div>
            <div className="productGroupInfo">
              <span className="descriptor">
                {this.state.descriptor.toLocaleUpperCase()}
              </span>
              <h1>{this.state.name}</h1>
              <p>{this.state.description}</p>
              <div className="productGroupParametrs">
                <div>
                  <span>Цвет</span>
                  <div
                    className="productGroupColor"
                    style={{ backgroundColor: this.state.color }}
                  />
                </div>
                <div>
                  <span>Цвет интерфейса</span>
                  <p>{getTheme(this.state.theme)}</p>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  {this.state.status !== "PUBLISHED" ? (
                    <div
                      onClick={async () => {
                        if (this.state.product.length !== 0) {
                          let data = await publishProductSelection(
                            this.state.id,
                            "PUBLISHED"
                          );
                          if (data.error) {
                            this.setState({ isError: true });
                          } else {
                            this.setState({
                              isUpdate: !this.state.isUpdate
                            });
                          }
                        }
                      }}
                      style={{ marginRight: 8 }}
                    >
                      <button
                        className={
                          this.state.product.length !== 0
                            ? "medium_button active"
                            : "medium_button disable"
                        }
                      >
                        Опубликовать
                      </button>
                    </div>
                  ) : null}

                  <div style={{ marginRight: 8 }}>
                    <button
                      className="medium_button simple"
                      style={{ backgroundColor: "transparent" }}
                      onClick={() => {
                        document.location.href = `/edit_shop?id=${this.state.id}`;
                      }}
                    >
                      Редактировать
                    </button>
                  </div>
                  <div>
                    <Modal isShowModal={this.state.isShowPush}>
                      {
                        <SubmitPush
                          value={{
                            postId: this.state.id,
                            topic: "PRODUCT_SELECTIONS"
                          }}
                          hideModal={() => {
                            this.setState({ isShowPush: false });
                          }}
                        />
                      }
                    </Modal>
                    <DropdownButton
                      alignRight
                      title={<MenuHorizontal />}
                      id="dropdown-menu-align-right"
                    >
                      {this.state.status !== "ARCHIVE" ? (
                        <Dropdown.Item
                          onClick={() => {
                            document.location.href = `/edit_shop?id=${this.state.id}`;
                          }}
                        >
                          Редактировать
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item
                          onClick={() => {
                            this.updateStatus(this.state.id, "DRAFT");
                          }}
                        >
                          Восстановить
                        </Dropdown.Item>
                      )}
                      {this.state.status !== "PUBLISHED" &&
                      this.state.status !== "ARCHIVE" ? (
                        <Dropdown.Item
                          onClick={async () => {
                            if (this.state.productSelectionItems !== 0) {
                              this.updateStatus(this.state.id, "PUBLISHED");
                            }
                          }}
                        >
                          Опубликовать
                        </Dropdown.Item>
                      ) : this.state.status !== "ARCHIVE" ? (
                        <Dropdown.Item
                          onClick={() => {
                            this.setState({ isShowPush: true });
                          }}
                        >
                          Отправить пуш
                        </Dropdown.Item>
                      ) : null}
                      {this.state.status !== "ARCHIVE" ? (
                        <Dropdown.Item
                          onClick={async () => {
                            this.updateStatus(this.state.id, "ARCHIVE");
                          }}
                        >
                          Архивировать
                        </Dropdown.Item>
                      ) : (
                        <Dropdown.Item
                          onClick={() => {
                            this.deleteContent(this.state.id);
                          }}
                        >
                          Удалить
                        </Dropdown.Item>
                      )}
                    </DropdownButton>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={{ textAlign: "center" }}>
                <LabelBlue
                  className="blue"
                  text={getStatus(this.state.status)}
                />
              </div>
            </div>
            <div style={style.navigation} />
          </div>
          <Line />

          <div className="intent" style={{ paddingBottom: 80 }}>
            <div className="productTableHeading">
              <h2>Продукты</h2>
              <Modal isShowModal={this.state.isShowModal}>
                <AddProduct
                  id={this.state.id}
                  hideModal={() => {
                    this.setState({ isShowModal: false });
                  }}
                />
              </Modal>
              <div
                className="addLink"
                onClick={() => {
                  this.setState({ isShowModal: true });
                }}
              >
                Добавить
              </div>
            </div>

            <div className="tableHead">
              <div style={{ width: "50%" }}>
                <p>Название и фото</p>
              </div>
              <div className="secondary" style={{ width: "15%" }}>
                <p>Цена</p>
              </div>
              <div className="secondary" style={{ width: "35%" }}>
                <p>Ссылка</p>
              </div>
            </div>
            {this.state.product.length !== 0 ? (
              this.state.product.map(item => <ProductRow value={item} />)
            ) : (
              <div className="emptyStateWrapper">
                <NoData doing={"добавили"} what={"одного товара"} />
              </div>
            )}
          </div>
        </UpdateContext.Provider>
      </div>
    );
  }
}
