import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import Grid from '@material-ui/core/Grid';

import Delete from "mdi-material-ui/Delete";
import KeyVariant from "mdi-material-ui/KeyVariant";

import TitleBar from "../../components/TitleBar";
import TitleBarTitle from "../../components/TitleBarTitle";
import TitleBarButton from "../../components/TitleBarButton";
import UserStore from "../../stores/UserStore";
import UpdateUser from "./UpdateUser";


class UserLayout extends Component {
  constructor() {
    super();
    this.state = {
    };

    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount() {
    UserStore.get(this.props.match.params.userID, resp => {
      this.setState({
        user: resp,
      });
    });
  }

  deleteUser() {
    if (window.confirm("真的要删除这个用户？")) {
      UserStore.delete(this.props.match.params.userID, () => {
        this.props.history.push("/users");
      });
    }
  }

  render() {
    if (this.state.user === undefined) {
      return(<div></div>);
    }

    return(
      <Grid container spacing={4}>
        <TitleBar
          buttons={[
            <TitleBarButton
              key={1}
              label="修改密码"
              icon={<KeyVariant />}
              to={`/users/${this.props.match.params.userID}/password`}
            />,
            <TitleBarButton
              key={2}
              label="删除"
              icon={<Delete />}
              color="secondary"
              onClick={this.deleteUser}
            />,
          ]}
        >
          <TitleBarTitle to="/users" title="用户" />
          <TitleBarTitle title="/" />
          <TitleBarTitle title={this.state.user.user.email} />
        </TitleBar>

        <Grid item xs={12}>
          <UpdateUser user={this.state.user.user} />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(UserLayout);
