import React from "react";

import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import Admin from "../../components/Admin";
import FormControl from "../../components/FormControl";
import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";



class OrganizationForm extends FormComponent {
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
          label="组织名称"
          helperText="名称由字母、数字和破折号（-）组成"
          margin="normal"
          value={this.state.object.name || ""}
          onChange={this.onChange}
          inputProps={{
            pattern: "[\\w-]+",
          }}
          disabled={this.props.disabled}
          required
          fullWidth
        />
        <TextField
          id="displayName"
          label="显示名"
          margin="normal"
          value={this.state.object.displayName || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          required
          fullWidth
        />
        <Admin>
          <FormControl
            label="网关"
          >
            <FormGroup>
              <FormControlLabel
                label="组织可以拥有网关"
                control={
                  <Checkbox
                    id="canHaveGateways"
                    checked={!!this.state.object.canHaveGateways}
                    onChange={this.onChange}
                    disabled={this.props.disabled}
                    value="true"
                    color="primary"
                  />
                }
              />
            </FormGroup>
            <FormHelperText>选中，表明组织管理员可以添加自己的网关到网络中，并且网关的使用对此组织没有限制。</FormHelperText>
            {!!this.state.object.canHaveGateways && <TextField
              id="maxGatewayCount"
              label="网关数量的最大值"
              helperText="此组织可添加网关的最大数量（0=无限制）。"
              margin="normal"
              value={this.state.object.maxGatewayCount || 0}
              onChange={this.onChange}
              type="number"
              disabled={this.props.disabled}
              required
              fullWidth
            />}
          </FormControl>
          <FormControl
            label="Devices"
          >
            <TextField
              id="maxDeviceCount"
              label="前端设备的最大数量"
              helperText="此组织可添加前端设备的最大数量（0=无限制）。"
              margin="normal"
              value={this.state.object.maxDeviceCount || 0}
              onChange={this.onChange}
              type="number"
              disabled={this.props.disabled}
              required
              fullWidth
            />
          </FormControl>
        </Admin>
      </Form>
    );
  }
}

export default OrganizationForm;
