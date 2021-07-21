import React from "react";

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";


class OrganizationUserForm extends FormComponent {
  render() {
    if (this.state.object === undefined) {
      return(<div></div>);
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
          <TextField
            label="Email"
            id="email"
            margin="normal"
            value={this.state.object.email || ""}
            onChange={this.onChange}
            required
            fullWidth
            disabled={this.props.update}
          />
          <Typography variant="body1">
            在组织中，没有授权的用户可以看到组织内的资源和收发组织内前端设备数据。
          </Typography>
          <FormControl fullWidth margin="normal">
            <FormControlLabel
              label="组织管理员用户"
              control={
                <Checkbox
                  id="isAdmin"
                  checked={!!this.state.object.isAdmin}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
            <FormHelperText>组织管理员可以添加和修改组织下属的资源.</FormHelperText>
          </FormControl>
          {!!!this.state.object.isAdmin && <FormControl fullWidth margin="normal">
            <FormControlLabel
              label="前端设备管理员用户"
              control={
                <Checkbox
                  id="isDeviceAdmin"
                  checked={!!this.state.object.isDeviceAdmin}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
            <FormHelperText>设备管理员可以添加和修改此组织下的前端设备资源。</FormHelperText>
          </FormControl>}
          {!!!this.state.object.isAdmin && <FormControl fullWidth margin="normal">
            <FormControlLabel
              label="网关管理员用户"
              control={
                <Checkbox
                  id="isGatewayAdmin"
                  checked={!!this.state.object.isGatewayAdmin}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
            <FormHelperText>网关管理员可以添加或修改组织下的网关。</FormHelperText>
          </FormControl>}
      </Form>
    );
  }
}

export default OrganizationUserForm;
