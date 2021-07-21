import React, { Component } from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from "@material-ui/core/FormHelperText";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from "@material-ui/core/Typography";

import { Map, Marker } from 'react-leaflet';

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import KVForm from "../../components/KVForm";
import AutocompleteSelect from "../../components/AutocompleteSelect";
import NetworkServerStore from "../../stores/NetworkServerStore";
import GatewayProfileStore from "../../stores/GatewayProfileStore";
import ServiceProfileStore from "../../stores/ServiceProfileStore";
import LocationStore from "../../stores/LocationStore";
import MapTileLayer from "../../components/MapTileLayer";
import EUI64Field from "../../components/EUI64Field";
import AESKeyField from "../../components/AESKeyField";
import theme from "../../theme";


const boardStyles = {
  formLabel: {
    color: theme.palette.primary.main,
  },
  a: {
    color: theme.palette.primary.main,
  },
};


class GatewayBoardForm extends Component {
  constructor() {
    super();

    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  onChange(e) {
    let board = this.props.board;
    const field = e.target.id;

    board[field] = e.target.value;
    this.props.onChange(board);
  }

  onDelete(e) {
    e.preventDefault();
    this.props.onDelete();
  }

  render() {
    return(
      <FormControl fullWidth margin="normal">
        <FormLabel className={this.props.classes.formLabel}>Board #{this.props.i} configuration (<a href="#delete" onClick={this.onDelete} className={this.props.classes.a}>delete</a>)</FormLabel>
        <EUI64Field
          id="fpgaID"
          label="FPGA ID"
          margin="normal"
          value={this.props.board.fpgaID || ""}
          onChange={this.onChange}
          helperText="FPGA ID 地理信息采集板，只有在第二版网关里才存在，并且是可选的。"
          fullWidth
        />
        <AESKeyField
          id="fineTimestampKey"
          label="精确时间戳解密密钥"
          margin="normal"
          value={this.props.board.fineTimestampKey || ""}
          onChange={this.onChange}
          helperText="精确时间戳 AES解密密钥，当设置了此解密密钥，第二版网关将解密精确时间戳（可选功能）。"
          fullWidth
        />
      </FormControl>
    );
  }
}

GatewayBoardForm = withStyles(boardStyles)(GatewayBoardForm);


const styles = {
  mapLabel: {
    marginBottom: theme.spacing(1),
  },
  link: {
    color: theme.palette.primary.main,
  },
  formLabel: {
    fontSize: 12,
  },
};

class GatewayForm extends FormComponent {
  constructor() {
    super();
    
    this.state = {
      mapZoom: 15,
      tab: 0,
      tags: [],
      metadata: [],
    };

    this.getNetworkServerOption = this.getNetworkServerOption.bind(this);
    this.getNetworkServerOptions = this.getNetworkServerOptions.bind(this);
    this.getGatewayProfileOption = this.getGatewayProfileOption.bind(this);
    this.getGatewayProfileOptions = this.getGatewayProfileOptions.bind(this);
    this.setCurrentPosition = this.setCurrentPosition.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.updateZoom = this.updateZoom.bind(this);
    this.addGatewayBoard = this.addGatewayBoard.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.setKVArrays(this.props.object || {});

    if (!this.props.update) {
      this.setCurrentPosition();
    }
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    if (prevProps.object !== this.props.object) {
      this.setKVArrays(this.props.object || {});
    }
  }

  onChange(e) {
    if (e.target.id === "networkServerID" && e.target.value !== this.state.object.networkServerID) {
      let object = this.state.object;
      object.gatewayProfileID = null;
      object.serviceProfileID = null;
      this.setState({
        object: object,
      });
    }

    super.onChange(e);
  }

  setCurrentPosition(e) {
    if (e !== undefined) {
      e.preventDefault();
    }

    LocationStore.getLocation(position => {
      let object = this.state.object;
      object.location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: this.state.object.location.altitude,
      }
      this.setState({
        object: object,
      });
    });
  }

  updatePosition() {
    const position = this.refs.marker.leafletElement.getLatLng();
    let object = this.state.object;
    object.location = {
      latitude: position.lat,
      longitude: position.lng,
      altitude: this.state.object.location.altitude,
    }
    this.setState({
      object: object,
    });
  }

  updateZoom(e) {
    this.setState({
      mapZoom: e.target.getZoom(),
    });
  }

  getNetworkServerOption(id, callbackFunc) {
    NetworkServerStore.get(id, resp => {
      callbackFunc({label: resp.networkServer.name, value: resp.networkServer.id});
    });
  }

  getNetworkServerOptions(search, callbackFunc) {
    NetworkServerStore.list(this.props.match.params.organizationID, 999, 0, resp => {
      const options = resp.result.map((ns, i) => {return {label: ns.name, value: ns.id}});
      callbackFunc(options);
    });
  }

  getGatewayProfileOption(id, callbackFunc) {
    GatewayProfileStore.get(id, resp => {
      callbackFunc({label: resp.gatewayProfile.name, value: resp.gatewayProfile.id});
    });
  }

  getGatewayProfileOptions(search, callbackFunc) {
    if (this.state.object === undefined || this.state.object.networkServerID === undefined) {
      callbackFunc([]);
      return;
    }

    GatewayProfileStore.list(this.state.object.networkServerID, 999, 0, resp => {
      const options = resp.result.map((gp, i) => {return {label: gp.name, value: gp.id}});
      callbackFunc(options);
    });
  }

  getServiceProfileOption = (id, callbackFunc) => {
    ServiceProfileStore.get(id, resp => {
      callbackFunc({label: resp.serviceProfile.name, value: resp.serviceProfile.id});
    });
  }

  getServiceProfileOptions = (search, callbackFunc) => {
    if (this.state.object === undefined || this.state.object.networkServerID === undefined) {
      callbackFunc([]);
      return;
    }

    ServiceProfileStore.list(this.props.match.params.organizationID, this.state.object.networkServerID, 999, 0, resp => {
      const options = resp.result.map((sp, i) => { return {label: sp.name, value: sp.id} });
      callbackFunc(options);
    });
  }

  addGatewayBoard() {
    let object = this.state.object;
    if (object.boards === undefined) {
      object.boards = [{}];
    } else {
      object.boards.push({});
    }

    this.setState({
      object: object,
    });
  }

  deleteGatewayBoard(i) {
    let object = this.state.object;
    object.boards.splice(i, 1);
    this.setState({
      object: object,
    });
  }

  updateGatewayBoard(i, board) {
    let object = this.state.object;
    object.boards[i] = board;
    this.setState({
      object: object,
    });
  }

  onTabChange = (e, v) => {
    this.setState({
      tab: v,
    });
  }

  setKVArrays = (props) => {
    let tags = [];
    let metadata = [];

    if (props.tags !== undefined) {
      for (let key in props.tags) {
        tags.push({key: key, value: props.tags[key]});
      }
    }

    if (props.metadata !== undefined) {
      for (let key in props.metadata) {
        metadata.push({key: key, value: props.metadata[key]});
      }
    }

    this.setState({
      tags: tags,
      metadata: metadata,
    });
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    const style = {
      height: 400,
    };

    let position = [];
    if (this.state.object.location.latitude !== undefined && this.state.object.location.longitude !== undefined) {
      position = [this.state.object.location.latitude, this.state.object.location.longitude];
    } else {
      position = [0, 0];
    }

    let boards = [];
    if (this.state.object.boards !== undefined) {
      boards = this.state.object.boards.map((b, i) => <GatewayBoardForm key={i} i={i} board={b} onDelete={() => this.deleteGatewayBoard(i)} onChange={board => this.updateGatewayBoard(i, board)} />);
    }

    const tags = this.state.tags.map((obj, i) => <KVForm key={i} index={i} object={obj} onChange={this.onChangeKV("tags")} onDelete={this.onDeleteKV("tags")} />);
    const metadata = this.state.metadata.map((obj, i) => <KVForm disabled={true} key={i} index={i} object={obj} onChange={this.onChangeKV("metadata")} onDelete={this.onDeleteKV("metadata")} />);

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
        extraButtons={this.state.tab === 0 && <Button onClick={this.addGatewayBoard}>添加网关板配置</Button>}
      >
        <Tabs value={this.state.tab} onChange={this.onTabChange} indicatorColor="primary">
          <Tab label="常规" />
          <Tab label="标签" />
          <Tab label="元数据" />
        </Tabs>

        {this.state.tab === 0 && <div>
          <TextField
            id="name"
            label="网关名"
            margin="normal"
            value={this.state.object.name || ""}
            onChange={this.onChange}
            inputProps={{
              pattern: "[\\w-]+",
            }}
            helperText="网关名由字母、数字和破折号（-）组成。"
            required
            fullWidth
          />
          <TextField
            id="description"
            label="网关描述"
            margin="normal"
            value={this.state.object.description || ""}
            onChange={this.onChange}
            rows={4}
            multiline
            required
            fullWidth
          />
          {!this.props.update && <EUI64Field
            id="id"
            label="网关 ID"
            margin="normal"
            value={this.state.object.id || ""}
            onChange={this.onChange}
            required
            fullWidth
            random
          />}
          {!this.props.update && <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel} required>Network-server</FormLabel>
            <AutocompleteSelect
              id="networkServerID"
              label="选择网络服务器"
              value={this.state.object.networkServerID || ""}
              onChange={this.onChange}
              getOption={this.getNetworkServerOption}
              getOptions={this.getNetworkServerOptions}
              required
            />
            <FormHelperText>
              选出与网关连接的网络服务器，当下拉列表没有网络服务器时，需要确认组织下有没有配置服务简介（service-profile）。
            </FormHelperText>
          </FormControl>}
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel}>服务简介（Service-profile）</FormLabel>
            <AutocompleteSelect
              id="serviceProfileID"
              label="选择服务简介（service-profile）"
              value={this.state.object.serviceProfileID || ""}
              triggerReload={this.state.object.networkServerID || ""}
              onChange={this.onChange}
              getOption={this.getServiceProfileOption}
              getOptions={this.getServiceProfileOptions}
              clearable={true}
            />
            <FormHelperText>
              Select the service-profile under which the gateway must be added. The available service-profiles depend on the selected network-server, which must be selected first.
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel}>Gateway-profile</FormLabel>
            <AutocompleteSelect
              id="gatewayProfileID"
              label="选择网关简介（gateway-profile）"
              value={this.state.object.gatewayProfileID || ""}
              triggerReload={this.state.object.networkServerID || ""}
              onChange={this.onChange}
              getOption={this.getGatewayProfileOption}
              getOptions={this.getGatewayProfileOptions}
              clearable={true}
            />
            <FormHelperText>
              此为可选项。当给网关配置一个关简介（gateway-profile）后，网络服务器会试图用此关简介（gateway-profile）更新网关。注意，在这种情况下，网关集线器不是必须的。
            </FormHelperText>
          </FormControl>
          <FormGroup>
            <FormControlLabel
              label="使能网关探查"
              control={
                <Checkbox
                  id="discoveryEnabled"
                  checked={!!this.state.object.discoveryEnabled}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
            <FormHelperText>
              使能后（网络服务器启用网关探查功能），网关将会周期性通过网络中其他网关发送‘ping’包来测试自己的工作质量。
            </FormHelperText>
          </FormGroup>
          <TextField
            id="location.altitude"
            label="网关海拔（米）"
            margin="normal"
            type="number"
            value={this.state.object.location.altitude || 0}
            onChange={this.onChange}
            helperText="如果网关带有板载GPS，海拔值就会通过网关发送的统计数据来自动设置。"
            required
            fullWidth
          />
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.mapLabel}>网关位置 (<a onClick={this.setCurrentPosition} href="#getlocation" className={this.props.classes.link}>设置为当前位置</a>)</FormLabel>
            <Map
              center={position}
              zoom={this.state.mapZoom}
              style={style}
              animate={true}
              scrollWheelZoom={false}
              onZoomend={this.updateZoom}
              >
              <MapTileLayer />
              <Marker position={position} draggable={true} onDragend={this.updatePosition} ref="marker" />
            </Map>
            <FormHelperText>
              将标记拖动到网关的实际位置。当网关有板载GPS时，位置值将会从网关获取的统计数据中自动获取。
            </FormHelperText>
          </FormControl>
          {boards}
        </div>}
        {this.state.tab === 1 && <div>
          <FormControl fullWidth margin="normal">
            <Typography variant="body1">
              标签可用来存储另外的键/值数据。
            </Typography>
            {tags}
          </FormControl>
          <Button variant="outlined" onClick={this.addKV("tags")}>添加标签</Button>
        </div>}
        {this.state.tab === 2 && <div>
          <FormControl fullWidth margin="normal">
            <Typography variant="body1">
              元数据被网关桥用来发送网关相关信息（例如： ip / hostname, serial number, temperatures, ...）。这些数据会根据网关的统计数据自动更新。
            </Typography>
            {metadata}
          </FormControl>
        </div>}
      </Form>
    );
  }
}

export default withStyles(styles)(GatewayForm);
