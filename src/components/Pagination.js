import React from "react";
import { AngleRight, AngleLeft } from "../content/Icons";

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: null
    };
    this.getPager = this.getPager.bind(this);
  }

  componentDidMount() {
    this.getPager();
  }

  componentDidUpdate() {
    if (this.props.pageSize !== this.state.pages.length) {
      this.getPager();
    }
  }

  getPager() {
    let page = [];
    for (var i = 0; i < this.props.pageSize; i++) {
      page.push({ item: i + 1, link: `${this.props.link}${i + 1}` });
    }
    this.setState({ pages: page });
  }

  render() {
    return (
      <div style={{ display: "flex", paddingTop: 56, paddingBottom: 72 }}>
        <div style={{ margin: "auto" }}>
          {!this.state.pages || this.state.pages.length <= 1 ? null : (
            <div style={{ display: "flex", alignItems: "center" }}>
              {this.props.activePage + 1 > 1 ? (
                <div className="pagination_block">
                  <a
                    className="pagination_text"
                    href={`${this.props.link}${this.props.activePage - 1}`}
                    onClick={() =>
                      this.props.setStatePage(this.props.activePage - 1)
                    }
                  >
                    <AngleLeft />
                  </a>
                </div>
              ) : null}
              {this.props.pageSize > 1
                ? this.state.pages.map((item, index) =>
                    (item.item >= this.props.activePage + 1 - 2 &&
                      item.item <= this.props.activePage + 1 + 2) ||
                    item.item.toString() === "1" ||
                    item.item.toString() === this.props.pageSize.toString() ? (
                      <div
                        className={
                          item.item.toString() !==
                          (this.props.activePage + 1).toString()
                            ? "pagination_block"
                            : "pagination_block background_blue"
                        }
                        key={index}
                      >
                        <a
                          className={
                            item.item.toString() !==
                            (this.props.activePage + 1).toString()
                              ? "pagination_text"
                              : "pagination_text color_white"
                          }
                          href={item.link}
                          onClick={() => this.props.setStatePage(item.item - 1)}
                        >
                          {item.item}
                        </a>
                      </div>
                    ) : (item.item === this.props.activePage + 1 - 3 ||
                        item.item === this.props.activePage + 1 + 3) &&
                      (item.item.toString() !== "1" &&
                        item.item.toString() !==
                          this.props.pageSize.toString()) ? (
                      <div
                        className={
                          item.item.toString() !==
                          (this.props.activePage + 1).toString()
                            ? "pagination_block"
                            : "pagination_block background_blue"
                        }
                        key={index}
                      >
                        <div
                          className={
                            item.item.toString() !==
                            (this.props.activePage + 1).toString()
                              ? "pagination_text"
                              : "pagination_text color_white"
                          }
                        >
                          {"..."}
                        </div>
                      </div>
                    ) : null
                  )
                : null}

              {this.props.activePage + 1 < this.props.pageSize ? (
                <div className="pagination_block">
                  <a
                    className="pagination_text"
                    href={`${this.props.link}${this.props.activePage + 1}`}
                    onClick={() =>
                      this.props.setStatePage(this.props.activePage + 1)
                    }
                  >
                    <AngleRight />
                  </a>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    );
  }
}
