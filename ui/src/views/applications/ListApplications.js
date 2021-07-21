import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

import Plus from "mdi-material-ui/Plus";

import TitleBar from "../../components/TitleBar";
import TitleBarTitle from "../../components/TitleBarTitle";
import TableCellLink from "../../components/TableCellLink";
import TitleBarButton from "../../components/TitleBarButton";
import DataTable from "../../components/DataTable";
import Admin from "../../components/Admin";
import ApplicationStore from "../../stores/ApplicationStore";


class ListApplications extends Component {
  constructor() {
    super();
    this.getPage = this.getPage.bind(this);
    this.getRow = this.getRow.bind(this);
  }

  getPage(limit, offset, callbackFunc) {
    ApplicationStore.list("", this.props.match.params.organizationID, limit, offset, callbackFunc);
  }

  getRow(obj) {
    return(
      <TableRow
        key={obj.id}
        hover
      >
        <TableCell>{obj.id}</TableCell>
        <TableCellLink to={`/organizations/${this.props.match.params.organizationID}/applications/${obj.id}`}>{obj.name}</TableCellLink>
        <TableCellLink to={`/organizations/${this.props.match.params.organizationID}/service-profiles/${obj.serviceProfileID}`}>{obj.serviceProfileName}</TableCellLink>
        <TableCell>{obj.description}</TableCell>
      </TableRow>
    );
  }

  render() {
    return(
      <Grid container spacing={4}>
        <TitleBar
          buttons={
            <Admin organizationID={this.props.match.params.organizationID}>
              <TitleBarButton
                label="创建"
                icon={<Plus />}
                to={`/organizations/${this.props.match.params.organizationID}/applications/create`}
              />
            </Admin>
          }
        >
          <TitleBarTitle title="应用" />
        </TitleBar>
        <Grid item xs={12}>
          <DataTable
            header={
              <TableRow>
                <TableCell>ID号</TableCell>
                <TableCell>名称</TableCell>
                <TableCell>服务简介ervice-profile</TableCell>
                <TableCell>描述</TableCell>
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

export default ListApplications;
