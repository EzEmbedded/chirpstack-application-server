import React, { Component } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import moment from "moment";

import GatewayStore from "../../stores/GatewayStore";


class GatewayCertificate extends Component {
  constructor() {
    super();

    this.state = {
      caCert: null,
      tlsCert: null,
      tlsKey: null,
      buttonDisabled: false,
    };
  }

  requestCertificate = () => {
    this.setState({
      buttonDisabled: true,
    });

    GatewayStore.generateClientCertificate(this.props.match.params.gatewayID, (resp => {
      this.setState({
        tlsKey: resp.tlsKey,
        tlsCert: resp.tlsCert,
        caCert: resp.caCert,
        expiresAt: moment(resp.expiresAt).format("lll"),
      });
    }));
  }

  render() {
    return(
      <Card>
        <CardContent>
          <Typography gutterBottom>
            如果网络需要，网关需要一个客户端证书来连接到网络。这个客户端证书必须在网关内配置。这个证书生成后，只能获取一次，请妥善保存。
          </Typography>
          {this.state.tlsCert == null && <Button onClick={this.requestCertificate} disabled={this.state.buttonDisabled}>Generate certificate</Button>}
          {this.state.tlsCert != null && <form>
            <TextField
              id="expiresAt"
              label="证书失效日期"
              margin="normal"
              value={this.state.expiresAt}
              helperText="证书在以上日期失效，必须在失效日期前，生成和配置一个新的未失效的网关客户端证书。"
              disabled
              fullWidth
            />
            <TextField
              id="caCert"
              label="CA 证书"
              margin="normal"
              value={this.state.caCert}
              rows={10}
              multiline
              fullWidth
              helperText="CA证书是用来认证服务证书，将此证书作为文本文件存放在网关里，并命名为'ca.pem'。"
            />
            <TextField
              id="tlsCert"
              label="TLS 证书"
              margin="normal"
              value={this.state.tlsCert}
              rows={10}
              multiline
              fullWidth
              helperText="将此证书以文本文件的形式存放在网关里，例如，命名为'cert.pem'。"
            />
            <TextField
              id="tlsKey"
              label="TLS 密钥"
              margin="normal"
              value={this.state.tlsKey}
              rows={10}
              multiline
              fullWidth
              helperText="将此证书以文本文件的形式存放在网关里，例如，命名为 'key.pem'。"
            />
          </form>}
        </CardContent>
      </Card>
    );
  }
}

export default GatewayCertificate;
