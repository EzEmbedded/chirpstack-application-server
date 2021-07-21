import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { withStyles } from "@material-ui/core/styles";
import Typograhy from "@material-ui/core/Typography";
import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";

import FormComponent from "../../classes/FormComponent";
import AESKeyField from "../../components/AESKeyField";
import DevAddrField from "../../components/DevAddrField";
import Form from "../../components/Form";
import DeviceStore from "../../stores/DeviceStore";
import theme from "../../theme";


const styles = {
  link: {
    color: theme.palette.primary.main,
  },
};


class LW10DeviceActivationForm extends FormComponent {
  constructor() {
    super();
    this.getRandomDevAddr = this.getRandomDevAddr.bind(this);
  }

  getRandomDevAddr(cb) {
    DeviceStore.getRandomDevAddr(this.props.match.params.devEUI, resp => {
      cb(resp.devAddr);
    });
  }

  render() {
    if (this.state.object === undefined) {
      return(<div></div>);
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
        <DevAddrField
          id="devAddr"
          label="前端设备地址"
          margin="normal"
          value={this.state.object.devAddr || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          randomFunc={this.getRandomDevAddr}
          helperText="输入前端设备地址时请注意：根据lorawan协议的兼容性要求，前端设备地址可由地址前缀+NwkAddr组成。"
          fullWidth
          required
          random
        />
        <AESKeyField
          id="nwkSEncKey"
          label="网络会话密钥 (LoRaWAN 1.0)"
          margin="normal"
          value={this.state.object.nwkSEncKey || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          fullWidth
          required
          random
        />
        <AESKeyField
          id="appSKey"
          label="应用会话密钥 (LoRaWAN 1.0)"
          margin="normal"
          value={this.state.object.appSKey || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          required
          fullWidth
          random
        />
        <TextField
          id="fCntUp"
          label="上行帧计数器"
          margin="normal"
          type="number"
          value={this.state.object.fCntUp || 0}
          onChange={this.onChange}
          disabled={this.props.disabled}
          required
          fullWidth
        />
        <TextField
          id="nFCntDown"
          label="下行帧计数器 (网络)"
          margin="normal"
          type="number"
          value={this.state.object.nFCntDown || 0}
          onChange={this.onChange}
          disabled={this.props.disabled}
          required
          fullWidth
        />
      </Form>
    );
  }
}


class LW11DeviceActivationForm extends FormComponent {
  constructor() {
    super();
    this.getRandomDevAddr = this.getRandomDevAddr.bind(this);
  }

  getRandomDevAddr(cb) {
    DeviceStore.getRandomDevAddr(this.props.match.params.devEUI, resp => {
      cb(resp.devAddr);
    });
  }

  render() {
    if (this.state.object === undefined) {
      return(<div></div>);
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
        <DevAddrField
          id="devAddr"
          label="前端设备地址"
          margin="normal"
          value={this.state.object.devAddr || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          randomFunc={this.getRandomDevAddr}
          fullWidth
          required
          random
        />
        <AESKeyField
          id="nwkSEncKey"
          label="网络会话加密密钥"
          margin="normal"
          value={this.state.object.nwkSEncKey || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          fullWidth
          required
          random
        />
        <AESKeyField
          id="sNwkSIntKey"
          label="网络服务会话完整性密钥"
          margin="normal"
          value={this.state.object.sNwkSIntKey || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          fullWidth
          required
          random
        />
        <AESKeyField
          id="fNwkSIntKey"
          label="网络转发会话密钥"
          margin="normal"
          value={this.state.object.fNwkSIntKey || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          fullWidth
          required
          random
        />
        <AESKeyField
          id="appSKey"
          label="应用会话密钥"
          margin="normal"
          value={this.state.object.appSKey || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          required
          fullWidth
          random
        />
        <TextField
          id="fCntUp"
          label="上行帧计数器"
          margin="normal"
          type="number"
          value={this.state.object.fCntUp || 0}
          onChange={this.onChange}
          disabled={this.props.disabled}
          required
          fullWidth
        />
        <TextField
          id="nFCntDown"
          label="下行帧计数器 (网络)"
          margin="normal"
          type="number"
          value={this.state.object.nFCntDown || 0}
          onChange={this.onChange}
          disabled={this.props.disabled}
          required
          fullWidth
        />
        <TextField
          id="aFCntDown"
          label="下行帧计数器 (应用)"
          margin="normal"
          type="number"
          value={this.state.object.aFCntDown || 0}
          onChange={this.onChange}
          disabled={this.props.disabled}
          required
          fullWidth
        />
      </Form>
    );
  }
}


LW10DeviceActivationForm = withStyles(styles)(LW10DeviceActivationForm);
LW11DeviceActivationForm = withStyles(styles)(LW11DeviceActivationForm);


class DeviceActivation extends Component {
  constructor() {
    super();
    this.state = {};
    this.onSubmit = this.onSubmit.bind(this);
  }
  
  componentDidMount() {
    DeviceStore.getActivation(this.props.match.params.devEUI, resp => {
      if (resp === null) {
        this.setState({
          deviceActivation: {
            deviceActivation: {},
          },
        });
      } else {
        this.setState({
          deviceActivation: resp,
        });
      }
    });
  }

  onSubmit(deviceActivation) {
    let act = deviceActivation;
    act.devEUI = this.props.match.params.devEUI;

    if (this.props.deviceProfile.macVersion.startsWith("1.0")) {
      act.fNwkSIntKey = act.nwkSEncKey;
      act.sNwkSIntKey = act.nwkSEncKey;
    }

    DeviceStore.activate(act, resp => {
      this.props.history.push(`/organizations/${this.props.match.params.organizationID}/applications/${this.props.match.params.applicationID}`);
    });
  }

  render() {
    if (this.state.deviceActivation === undefined) {
      return null;
    }

    let submitLabel = null;
    if (!this.props.deviceProfile.supportsJoin) {
      submitLabel = "激活（重激活）前端设备";
    }

    let showForm = false;
    if (!this.props.deviceProfile.supportsJoin || (this.props.deviceProfile.supportsJoin && this.state.deviceActivation.deviceActivation.devAddr !== undefined)) {
      showForm = true;
    }

    return(
      <Card>
        <CardContent>
          {showForm && this.props.deviceProfile.macVersion.startsWith("1.0") && <LW10DeviceActivationForm
            submitLabel={submitLabel}
            object={this.state.deviceActivation.deviceActivation}
            onSubmit={this.onSubmit}
            disabled={this.props.deviceProfile.supportsJoin}
            match={this.props.match}
            deviceProfile={this.props.deviceProfile}
          />}
          {showForm && this.props.deviceProfile.macVersion.startsWith("1.1") && <LW11DeviceActivationForm
            submitLabel={submitLabel}
            object={this.state.deviceActivation.deviceActivation}
            onSubmit={this.onSubmit}
            disabled={this.props.deviceProfile.supportsJoin}
            match={this.props.match}
            deviceProfile={this.props.deviceProfile}
          />}
          {!showForm && <Typograhy variant="body1">
            前端设备未激活。
          </Typograhy>}
        </CardContent>
      </Card>
    );
  }
}

export default withRouter(DeviceActivation);
