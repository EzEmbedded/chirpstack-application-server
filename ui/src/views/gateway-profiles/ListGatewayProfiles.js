import React, { Component } from "react";

import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Plus from "mdi-material-ui/Plus";
import HelpCircleOutline from "mdi-material-ui/HelpCircleOutline";

import TitleBar from "../../components/TitleBar";
import TitleBarTitle from "../../components/TitleBarTitle";
import TableCellLink from "../../components/TableCellLink";
import TitleBarButton from "../../components/TitleBarButton";
import DataTable from "../../components/DataTable";

import GatewayProfileStore from "../../stores/GatewayProfileStore";


class ListGatewayProfiles extends Component {
  constructor() {
    super();

    this.state = {
      dialogOpen: false,
    };
  }

  getPage(limit, offset, callbackFunc) {
    GatewayProfileStore.list(0, limit, offset, callbackFunc);
  }

  getRow(obj) {
    return(
      <TableRow
        id={obj.id}
        hover
      >
        <TableCellLink to={`/gateway-profiles/${obj.id}`}>{obj.name}</TableCellLink>
        <TableCellLink to={`/network-servers/${obj.networkServerID}`}>{obj.networkServerName}</TableCellLink>
      </TableRow>
    );
  }

  toggleHelpDialog = () => {
    this.setState({
      dialogOpen: !this.state.dialogOpen,
    });
  }

  render() {
    return(
      <Grid container spacing={4}>
        <Dialog
          open={this.state.dialogOpen}
          onClose={this.toggleHelpDialog}
          aria-labelledby="help-dialog-title"
          aria-describedby="help-dialog-description"
        >
          <DialogTitle id="help-dialog-title">网关简介（Gateway Profile） 帮助</DialogTitle>
          <DialogContent>
            <DialogContentText id="帮助对话框描述">
              网关简介（Gateway Profile）的唯一目的是采用网关简介（Gateway Profile）来配置（重配置）一个或多个网关。<br /><br />

              当网络服务器通过网关简介（Gateway Profile）检测到网关配置失去一致性，它将发送更新命令来配置网关。
             <br /><br />

              注意1，这个功能是可选项，并且只能用在有lorawan集线器模块的系统中。
              <br /><br />

              注意2，网关简介(Gateway Profile)并不改变前端设备的行为方式，配置前端设备的通道的使用计划是通过更新网络服务器的配置实现的。
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleHelpDialog} color="primary">关闭</Button>
          </DialogActions>
        </Dialog>

        <TitleBar
          buttons={[
            <TitleBarButton
              key={1}
              label="创建"
              icon={<Plus />}
              to={`/gateway-profiles/create`}
            />,
            <TitleBarButton
              key={2}
              label="帮助"
              icon={<HelpCircleOutline />}
              onClick={this.toggleHelpDialog}
            />
          ]}
        >
          <TitleBarTitle title="网关简介（Gateway Profile）" />
        </TitleBar>
        <Grid item xs={12}>
          <DataTable
            header={
              <TableRow>
                <TableCell>名称</TableCell>
                <TableCell>网络服务器</TableCell>
              </TableRow>
            }
            getPage={this.getPage}
            getRow={this.getRow}
          />
        </Grid>
      </Grid>
    );
  }
}

export default ListGatewayProfiles;
