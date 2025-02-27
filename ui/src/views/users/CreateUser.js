import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

import { CardContent } from "@material-ui/core";

import TitleBar from "../../components/TitleBar";
import TitleBarTitle from "../../components/TitleBarTitle";
import UserForm from "./UserForm";
import UserStore from "../../stores/UserStore";


class CreateUser extends Component {
  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(user) {
    UserStore.create(user, user.password, [], resp => {
      this.props.history.push("/users");
    });
  }

  render() {
    return(
      <Grid container spacing={4}>
        <TitleBar>
          <TitleBarTitle title="用户" to="/Users" />
          <TitleBarTitle title="/" />
          <TitleBarTitle title="创建" />
        </TitleBar>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <UserForm
                submitLabel="创建用户"
                onSubmit={this.onSubmit}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(CreateUser);
