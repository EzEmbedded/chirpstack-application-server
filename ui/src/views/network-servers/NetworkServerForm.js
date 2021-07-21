import React from "react";

import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import FormControl from "../../components/FormControl";


class NetworkServerForm extends FormComponent {
  constructor() {
    super();
    this.state = {
      tab: 0,
    };

    this.onChangeTab = this.onChangeTab.bind(this);
  }

  onChangeTab(event, value) {
    this.setState({
      tab: value,
    });
  }

  render() {
    if (this.state.object === undefined) {
      return(null);
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
            <Tabs
              value={this.state.tab}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.onChangeTab}
            >
              <Tab label="常规" />
              <Tab label="探查网关" />
              <Tab label="TLS 证书" />
            </Tabs>
          {this.state.tab === 0 && <div>
            <TextField
              id="name"
              label="网络服务器名"
              fullWidth={true}
              margin="normal"
              value={this.state.object.name || ""}
              onChange={this.onChange}
              helperText="网络服务器名称."
              required={true}
            />
            <TextField
              id="server"
              label="网络服务器"
              fullWidth={true}
              margin="normal"
              value={this.state.object.server || ""}
              onChange={this.onChange}
              helperText="网络服务器的'hostname:port',例如. 'localhost:8000'."
              required={true}
            />
          </div>}
          {this.state.tab === 1 && <div>
            <FormControl
              label="探查网关"
            >
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="gatewayDiscoveryEnabled"
                      checked={!!this.state.object.gatewayDiscoveryEnabled}
                      onChange={this.onChange}
                      value="true"
                      color="primary"
                    />
                  }
                  label="使能探查网关功能"
                />
              </FormGroup>
              <FormHelperText>使能网络服务器的网关探查功能。</FormHelperText>
            </FormControl>
            {this.state.object.gatewayDiscoveryEnabled && <TextField
              id="gatewayDiscoveryInterval"
              label="周期（每天）"
              type="number"
              fullWidth={true}
              margin="normal"
              value={this.state.object.gatewayDiscoveryInterval}
              onChange={this.onChange}
              helperText="应用服务器每天广播网关探查命令（'pings'）的次数。"
              required={true}
            />}
            {this.state.object.gatewayDiscoveryEnabled && <TextField
              id="gatewayDiscoveryTXFrequency"
              label="发送频率 (Hz)"
              type="number"
              fullWidth={true}
              margin="normal"
              value={this.state.object.gatewayDiscoveryTXFrequency}
              onChange={this.onChange}
              helperText="网关探查命令'pings'使用的无线频率 (Hz) ，请参考lorawan协议的区域参数定义的通道可用频率。"
              required={true}
            />}
            {this.state.object.gatewayDiscoveryEnabled && <TextField
              id="gatewayDiscoveryDR"
              label="发送数据率"
              type="number"
              fullWidth={true}
              margin="normal"
              value={this.state.object.gatewayDiscoveryDR}
              onChange={this.onChange}
              helperText="发送网关探查命令'pings'使用的数据率 ，请参考lorawan协议的区域参数定义的区域可用数据率。"
              required={true}
            />}
          </div>}
          {this.state.tab === 2 && <div>
            <FormControl
              label="应用服务器到网络服务器连接时使用的数字证书"
            >
              <FormGroup>
                <TextField
                  id="caCert"
                  label="CA 证书"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.caCert || ""}
                  onChange={this.onChange}
                  helperText="将CA 证书（PEM格式）的内容粘贴到上面的文本框内，如果不使用TLS加密，请留白。"
                  multiline
                  rows="4"
                />
                <TextField
                  id="tlsCert"
                  label="TLS 证书"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.tlsCert || ""}
                  onChange={this.onChange}
                  helperText="将TLS 证书（PEM格式）的内容粘贴到上面的文本框内，如果不使用TLS加密，请留白。"
                  multiline
                  rows="4"
                />
                <TextField
                  id="tlsKey"
                  label="TLS 密钥"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.tlsKey || ""}
                  onChange={this.onChange}
                  helperText="将TLS 密钥（PEM格式）的内容粘贴到上面的文本框内，如果不使用TLS加密，请留白。注意：由于安全原因，TLS 密钥在提交后，文本框将变空白，密钥无法再次找回，如果此时再次提交，TLS密钥会是空白，上次提交的密钥也不会被覆盖。"
                  multiline
                  rows="4"
                />
              </FormGroup>
            </FormControl>

            <FormControl
              label="网络服务器到应用服务器连接时使用的数字证书"
            >
              <FormGroup>
                <TextField
                  id="routingProfileCACert"
                  label="CA 证书"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.routingProfileCACert || ""}
                  onChange={this.onChange}
                  helperText="将CA 证书（PEM格式）的内容粘贴到上面的文本框内，如果不使用TLS加密，请留白。"
                  multiline
                  rows="4"
                />
                <TextField
                  id="routingProfileTLSCert"
                  label="TLS 证书"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.routingProfileTLSCert || ""}
                  onChange={this.onChange}
                  helperText="将TLS 证书（PEM格式）的内容粘贴到上面的文本框内，如果不使用TLS加密，请留白。"
                  multiline
                  rows="4"
                />
                <TextField
                  id="routingProfileTLSKey"
                  label="TLS 密钥"
                  fullWidth={true}
                  margin="normal"
                  value={this.state.object.routingProfileTLSKey || ""}
                  onChange={this.onChange}
                  helperText="将TLS 密钥（PEM格式）的内容粘贴到上面的文本框内，如果不使用TLS加密，请留白。注意：由于安全原因，TLS 密钥在提交后，文本框将变空白，密钥无法再次找回，如果此时再次提交，TLS密钥会是空白，上次提交的密钥也不会被覆盖。"
                  multiline
                  rows="4"
                />
              </FormGroup>
            </FormControl>
          </div>}
      </Form>
    );
  }
}

export default NetworkServerForm;
