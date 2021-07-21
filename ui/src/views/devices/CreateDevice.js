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

import ApplicationStore from "../../stores/ApplicationStore";
import DeviceProfileStore from "../../stores/DeviceProfileStore";
import DeviceStore from "../../stores/DeviceStore";
import DeviceForm from "./DeviceForm";


const styles = {
  card: {
    overflow: "visible",
  },
};


class CreateDevice extends Component {
  constructor() {
    super();
    this.state = {
      dpDialog: false,
    };
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  componentDidMount() {
    ApplicationStore.get(this.props.match.params.applicationID, resp => {
      this.setState({
        application: resp,
      });
    });

    DeviceProfileStore.list(0, this.props.match.params.applicationID, 0, 0, resp => {
      if (resp.totalCount === "0") {
        this.setState({
          dpDialog: true,
        });
      }
    });
  }

  closeDialog() {
    this.setState({
      dpDialog: false,
    });
  }

  onSubmit(device) {
    let dev = device;
    dev.applicationID = this.props.match.params.applicationID;

    DeviceStore.create(dev, resp => {
      DeviceProfileStore.get(dev.deviceProfileID, resp => {
        if (resp.deviceProfile.supportsJoin) {
          this.props.history.push(`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}/devices/${dev.devEUI}/keys`);
        } else {
          this.props.history.push(`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}/devices/${dev.devEUI}/activation`);
        }
      });

    });
  }

  render() {
    if (this.state.application === undefined) {
      return(<div></div>);
    }

    return(
      <Grid container spacing={4}>
        <Dialog
          open={this.state.dpDialog}
          onClose={this.closeDialog}
        >
          <DialogTitle>添加设备简介（device profile）？</DialogTitle>
          <DialogContent>
            <DialogContentText paragraph>
              选定的应用没有任何前端设备简介（device profile）。
              前端设备简介（device profile）定义了前端设备的功能和启动参数，可以为多种前端设备创建多个前端设备简介（device profile）。
            </DialogContentText>
            <DialogContentText>
              需要创建前端设备简介（device-profile）？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" component={Link} to={`/organizations/${this.props.match.params.organizationID}/device-profiles/create`} onClick={this.closeDialog}>Create device-profile</Button>
            <Button color="primary" onClick={this.closeDialog}>返回</Button>
          </DialogActions>
        </Dialog>

        <TitleBar>
          <TitleBarTitle title="应用" to={`/organizations/${this.props.match.params.organizationID}/applications`} />
          <TitleBarTitle title="/" />
          <TitleBarTitle title={this.state.application.application.name} to={`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}`} />
          <TitleBarTitle title="/" />
          <TitleBarTitle title="前端设备" to={`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}`} />
          <TitleBarTitle title="/" />
          <TitleBarTitle title="创建" />
        </TitleBar>

        <Grid item xs={12}>
          <Card className={this.props.classes.card}>
            <CardContent>
              <DeviceForm
                submitLabel="创建前端设备"
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

export default withStyles(styles)(withRouter(CreateDevice));
