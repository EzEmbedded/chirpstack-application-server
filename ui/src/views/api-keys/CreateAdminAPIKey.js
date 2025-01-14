import React, { Component } from "react";

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";

import TitleBar from "../../components/TitleBar";
import TitleBarTitle from "../../components/TitleBarTitle";
import APIKeyForm from "./APIKeyForm";


class CreateAdminAPIKey extends Component {
  render() {
    return(
      <Grid container spacing={4}>
        <TitleBar>
          <TitleBarTitle title="全局 API keys（Global API keys）" to="/api-keys" />
          <TitleBarTitle title="/" />
          <TitleBarTitle title="创建" />
        </TitleBar>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <APIKeyForm
                submitLabel="创建 API key"
                onSubmit={this.onSubmit}
                isAdmin={true}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default CreateAdminAPIKey;
