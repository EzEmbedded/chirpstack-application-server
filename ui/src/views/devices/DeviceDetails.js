import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import Refresh from "mdi-material-ui/Refresh";
import Delete from "mdi-material-ui/Delete";

import moment from "moment";

import TableCellLink from "../../components/TableCellLink";
import DeviceQueueItemForm from "./DeviceQueueItemForm";
import DeviceQueueStore from "../../stores/DeviceQueueStore";
import DeviceStore from "../../stores/DeviceStore";
import MulticastGroupStore from "../../stores/MulticastGroupStore";

import theme from "../../theme";


const styles = {
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    cursor: "pointer",
  },
};



class DetailsCard extends Component {
  render() {
    const multicastGroups = this.props.multicastGroups.map((mg, i) => <div><Link className={this.props.classes.link} to={`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}/multicast-groups/${mg.id}`}>{ mg.name }</Link></div>);

    return(
      <Card>
        <CardHeader title="详细资料" />
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>名称</TableCell>
                <TableCell>{this.props.device.device.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>描述</TableCell>
                <TableCell>{this.props.device.device.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>前端设备简介（Device-profile）</TableCell>
                <TableCellLink to={`/organizations/${this.props.match.params.organizationID}/device-profiles/${this.props.deviceProfile.deviceProfile.id}`}>{this.props.deviceProfile.deviceProfile.name}</TableCellLink>
              </TableRow>
              <TableRow>
                <TableCell>多播组</TableCell>
                <TableCell>{multicastGroups}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
}

DetailsCard = withStyles(styles)(DetailsCard);


class StatusCard extends Component {
  render() {
    let lastSeenAt = "never";
    let state = "enabled";

    if (this.props.device.lastSeenAt !== null) {
      lastSeenAt = moment(this.props.device.lastSeenAt).format("lll");
    }

    if (this.props.device.device.isDisabled === true) {
      state = "disabled";
    }

    return(
      <Card>
        <CardHeader title="状态" />
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>最后一次看到时间</TableCell>
                <TableCell>{lastSeenAt}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>状态</TableCell>
                <TableCell>{state}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
}

class EnqueueCard extends Component {
  constructor() {
    super();

    this.state = {
      object: {},
    };
  }

  onSubmit = (queueItem) => {
    let qi = queueItem;
    qi.devEUI = this.props.match.params.devEUI;

    DeviceQueueStore.enqueue(qi, resp => {
      this.setState({
        object: {},
      });
    });
  }

  render() {
    return(
      <Card>
        <CardHeader title="负载队列payload" />
        <CardContent>
          <DeviceQueueItemForm
            submitLabel="负载队列Enqueue payload"
            onSubmit={this.onSubmit}
            object={this.state.object}
          />
        </CardContent>
      </Card>
    );
  }
}

EnqueueCard = withRouter(EnqueueCard);


class QueueCardRow extends Component {
  render() {
    let confirmed = "否";
    if (this.props.item.confirmed) {
      confirmed = "是";
    }

    return(
      <TableRow>
        <TableCell>{this.props.item.fCnt}</TableCell>
        <TableCell>{this.props.item.fPort}</TableCell>
        <TableCell>{confirmed}</TableCell>
        <TableCell>{this.props.item.data}</TableCell>
      </TableRow>
    );
  }
}


class QueueCard extends Component {
  constructor() {
    super();

    this.state = {
      deviceQueueItems: [],
    };
  }

  componentDidMount() {
    this.getQueue();

    DeviceQueueStore.on("enqueue", this.getQueue);
  }

  componentWillUnmount() {
    DeviceQueueStore.removeListener("enqueue", this.getQueue);
  }

  getQueue = () => {
    DeviceQueueStore.list(this.props.match.params.devEUI, resp => {
      this.setState({
        deviceQueueItems: resp.deviceQueueItems,
      });
    });
  }

  flushQueue = () => {
    if (window.confirm("确实要冲洗前端设备数据缓存队列？")) {
      DeviceQueueStore.flush(this.props.match.params.devEUI, resp => {
        this.getQueue();
      });
    }
  }

  render() {
    const rows = this.state.deviceQueueItems.map((item, i) => <QueueCardRow key={i} item={item}/>);

    return(
      <Card>
        <CardHeader title="下行队列" action={
          <div>
            <Button onClick={this.getQueue}><Refresh /></Button>
            <Button onClick={this.flushQueue} color="secondary"><Delete /></Button>
          </div>
        } />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>帧计数器FCnt</TableCell>
                <TableCell>帧端口FPort</TableCell>
                <TableCell>验证Confirmed</TableCell>
                <TableCell>Base64 编码负载</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }
}

QueueCard = withRouter(QueueCard);


class DeviceDetails extends Component {
  constructor() {
    super();
    this.state = {
      activated: false,
      multicastGroups: [],
    };
  }

  componentDidMount() {
    this.setDeviceActivation();
    this.setMulticastGroups();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.device !== this.props.device) {
      this.setDeviceActivation();
      this.setMulticastGroups();
    }
  }

  setDeviceActivation = () => {
    if (this.props.device === undefined) {
      return;
    }

    DeviceStore.getActivation(this.props.device.device.devEUI, resp => {
      if (resp === null) {
        this.setState({
          activated: false,
        });
      } else {
        this.setState({
          activated: true,
        });
      }
    });
  };

  setMulticastGroups = () => {
    MulticastGroupStore.list("", 0, "", this.props.device.device.devEUI, 999, 0, resp => {
      this.setState({
        multicastGroups: resp.result,
      });
    });
  }

  render() {
    return(
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <DetailsCard multicastGroups={this.state.multicastGroups} device={this.props.device} deviceProfile={this.props.deviceProfile} match={this.props.match} />
        </Grid>
        <Grid item xs={6}>
          <StatusCard device={this.props.device} />
        </Grid>
        {this.state.activated && <Grid item xs={12}>
          <EnqueueCard />
        </Grid>}
        {this.state.activated &&<Grid item xs={12}>
          <QueueCard />
        </Grid>}
      </Grid>
    );
  }
}

export default DeviceDetails;
