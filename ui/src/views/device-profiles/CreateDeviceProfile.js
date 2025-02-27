import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';

import { withStyles } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";

import TitleBar from "../../components/TitleBar";
import TitleBarTitle from "../../components/TitleBarTitle";

import DeviceProfileForm from "./DeviceProfileForm";
import DeviceProfileStore from "../../stores/DeviceProfileStore";
import ServiceProfileStore from "../../stores/ServiceProfileStore";


const styles = {
  card: {
    overflow: "visible",
  },
};


class CreateDeviceProfile extends Component {
  constructor() {
    super();
    this.state = {
      spDialog: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentDidMount() {
    ServiceProfileStore.list(this.props.match.params.organizationID, 0, 0, 0, resp => {
      if (resp.totalCount === "0") {
        this.setState({
          spDialog: true,
        });
      }
    });
  }

  closeDialog() {
    this.setState({
      spDialog: false,
    });
  }

  onSubmit(deviceProfile) {
    let sp = deviceProfile;
    sp.organizationID = this.props.match.params.organizationID;

    DeviceProfileStore.create(sp, resp => {
      this.props.history.push(`/organizations/${this.props.match.params.organizationID}/device-profiles`);
    });
  }

  render() {
    return(
      <Grid container spacing={4}>
        <Dialog
          open={this.state.spDialog}
          onClose={this.closeDialog}
        >
          <DialogTitle>添加服务简介（service-profile）？</DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              选择的组织还没有任何服务简介（service-profile）。
              The selected organization does not have a service-profile yet.
              服务简介(service-profile)是用来连接组织和网路服务器，并定义组织可以使用网络服务器。
            </DialogContentText>
            <DialogContentText>
              确定要添加服务简介（service-profile）？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" component={Link} to={`/organizations/${this.props.match.params.organizationID}/service-profiles/create`} onClick={this.closeDialog}>创建服务简介（service-profile）</Button>
            <Button color="primary" onClick={this.closeDialog}>返回</Button>
          </DialogActions>
        </Dialog>

        <TitleBar>
          <TitleBarTitle title="前端设备简介（Device-profiles）" to={`/organizations/${this.props.match.params.organizationID}/device-profiles`} />
          <TitleBarTitle title="/" />
          <TitleBarTitle title="创建" />
        </TitleBar>

        <Grid item xs={12}>
          <Card className={this.props.classes.card}>
            <CardContent>
              <DeviceProfileForm
                submitLabel="创建前端设备简介（device-profile）"
                onSubmit={this.onSubmit}
                match={this.props.match}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withRouter(CreateDeviceProfile));
