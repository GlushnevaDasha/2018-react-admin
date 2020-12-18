import React from "react";
import MenuBar from "../../components/MenuBar";
import { ControlUserRow } from "../../components/Tables/ControlUserRow";
import Line from "../../components/Line";
import { WHITE, BG_GRADIENT } from "../../content/color";
import { getUsers } from "../../utils/api";
import { NoData } from "../../components/Gag";
import { CustomLoader } from "../../atoms/Loader";

class ControlPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null
    };
  }

  async componentDidMount() {
    let data = Array.from(await getUsers());
    this.setState({
      users: data
    });
  }

  render() {
    return (
      <div>
        <div className="intent" style={{ backgroundImage: BG_GRADIENT }}>
          <MenuBar
            name={"Управление"}
            description={"Управляйте учетными записями администраторов"}
            forma={"User"}
          />
        </div>
        <Line />
        <div className="intent">
          <div className="tableHead">
            <div style={{ width: "60%" }}>
              <p>Пользователь</p>
            </div>
            <div className="secondary" style={{ width: "40%" }}>
              <p>Email</p>
            </div>
          </div>

          {!this.state.users ? (
            <CustomLoader />
          ) : this.state.users.length !== 0 ? (
            this.state.users.map(item => <ControlUserRow value={item} />)
          ) : (
            <NoData text={"Пользователей еще нет"} />
          )}
        </div>
      </div>
    );
  }
}
export default ControlPage;
