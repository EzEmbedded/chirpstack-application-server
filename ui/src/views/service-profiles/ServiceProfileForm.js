import React from "react";

import TextField from '@material-ui/core/TextField';
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import AutocompleteSelect from "../../components/AutocompleteSelect";
import NetworkServerStore from "../../stores/NetworkServerStore";


class ServiceProfileForm extends FormComponent {
  constructor() {
    super();
    this.getNetworkServerOption = this.getNetworkServerOption.bind(this);
    this.getNetworkServerOptions = this.getNetworkServerOptions.bind(this);
  }

  getNetworkServerOption(id, callbackFunc) {
    NetworkServerStore.get(id, resp => {
      callbackFunc({label: resp.networkServer.name, value: resp.networkServer.id});
    });
  }

  getNetworkServerOptions(search, callbackFunc) {
    NetworkServerStore.list(0, 999, 0, resp => {
      const options = resp.result.map((ns, i) => {return {label: ns.name, value: ns.id}});
      callbackFunc(options);
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
        disabled={this.props.disabled}
      >
        <TextField
          id="name"
          label="服务简介名称"
          margin="normal"
          value={this.state.object.name || ""}
          onChange={this.onChange}
          helperText="标识服务简介（service-profile）的名称。"
          disabled={this.props.disabled}
          required
          fullWidth
        />
        {!this.props.update && <FormControl fullWidth margin="normal">
          <FormLabel required>Network-server</FormLabel>
          <AutocompleteSelect
            id="networkServerID"
            label="网络服务器"
            value={this.state.object.networkServerID || null}
            onChange={this.onChange}
            getOption={this.getNetworkServerOption}
            getOptions={this.getNetworkServerOptions}
          />
          <FormHelperText>
            与将提供的服务简介（service-profile）相关联的网络服务器在创建后就不能更改。
          </FormHelperText>
        </FormControl>}
        <FormControl fullWidth margin="normal">
          <FormControlLabel
            label="添加网关元数据"
            control={
              <Checkbox
                id="addGWMetaData"
                checked={!!this.state.object.addGWMetaData}
                onChange={this.onChange}
                disabled={this.props.disabled}
                color="primary"
              />
            }
          />
          <FormHelperText>
            网关元数据 (RSSI, SNR, GW geoloc., 等) 被加入到数据包内，发送到应用服务器。
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <FormControlLabel
            label="使能地理位置"
            control={
              <Checkbox
                id="nwkGeoLoc"
                checked={!!this.state.object.nwkGeoLoc}
                onChange={this.onChange}
                disabled={this.props.disabled}
                color="primary"
              />
            }
          />
          <FormHelperText>
            使能此选项，网络服务器将解析在此服务简介下的设备位置，请注意，这需要网关支持优良的时间戳功能，并且网络服务器需要配置成支持地理位置功能。
          </FormHelperText>
        </FormControl>
        <TextField
          id="devStatusReqFreq"
          label="设备状态请求频率"
          margin="normal"
          type="number"
          value={this.state.object.devStatusReqFreq || 0}
          onChange={this.onChange}
          helperText="终端设备状态请求的初始频率（请求/天），当设置为0时，禁制此功能。"
          disabled={this.props.disabled}
          fullWidth
        />
        {this.state.object.devStatusReqFreq > 0 && <FormControl fullWidth margin="normal">
          <FormGroup>
            <FormControlLabel
              label="向应用服务器告知前端设备的电源电压"
              control={
                <Checkbox
                  id="reportDevStatusBattery"
                  checked={!!this.state.object.reportDevStatusBattery}
                  onChange={this.onChange}
                  disabled={this.props.disabled}
                  color="primary"
                />
              }
            />
            <FormControlLabel
              label="向应用服务器告知前端设备的链路预算（link margin）"
              control={
                <Checkbox
                  id="reportDevStatusMargin"
                  checked={!!this.state.object.reportDevStatusMargin}
                  onChange={this.onChange}
                  disabled={this.props.disabled}
                  color="primary"
                />
              }
            />
          </FormGroup>
        </FormControl>}
        <TextField
          id="drMin"
          label="允许的最小数据率（data-rate）"
          margin="normal"
          type="number"
          value={this.state.object.drMin || 0}
          onChange={this.onChange}
          helperText="用于ADR（自动数据率）的最小允许的数据率."
          disabled={this.props.disabled}
          fullWidth
          required
        />
        <TextField
          id="drMax"
          label="允许的最大数据率M（data-rate）"
          margin="normal"
          type="number"
          value={this.state.object.drMax || 0}
          onChange={this.onChange}
          helperText="用于ADR（自动数据率）的最大允许的数据率."
          disabled={this.props.disabled}
          fullWidth
          required
        />
        <FormControl fullWidth margin="normal">
          <FormControlLabel
            label="私有网关"
            control={
              <Checkbox
                id="gwsPrivate"
                checked={!!this.state.object.gwsPrivate}
                onChange={this.onChange}
                disabled={this.props.disabled}
                color="primary"
              />
            }
          />
          <FormHelperText>
            在此服务简介下的网关是私有的，意味着这些私有网关下的前端设备只能用于这个相同的服务简介（service-profile）下。
          </FormHelperText>
        </FormControl>
      </Form>
    );
  }
}

export default ServiceProfileForm;
