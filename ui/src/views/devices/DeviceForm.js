import React from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import KVForm from "../../components/KVForm";
import EUI64Field from "../../components/EUI64Field";
import AutocompleteSelect from "../../components/AutocompleteSelect";
import DeviceProfileStore from "../../stores/DeviceProfileStore";


const styles = {
  formLabel: {
    fontSize: 12,
  },
};


class DeviceForm extends FormComponent {
  constructor() {
    super();
    this.getDeviceProfileOption = this.getDeviceProfileOption.bind(this);
    this.getDeviceProfileOptions = this.getDeviceProfileOptions.bind(this);

    this.state = {
      tab: 0,
      variables: [],
      tags: [],
    };
  }

  componentDidMount() {
    super.componentDidMount();

    this.setKVArrays(this.props.object || {});
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    if (prevProps.object !== this.props.object) {
      this.setKVArrays(this.props.object || {});
    }
  }

  setKVArrays = (props) => {
    let variables = [];
    let tags = [];

    if (props.variables !== undefined) {
      for (let key in props.variables) {
        variables.push({key: key, value: props.variables[key]});
      }
    }

    if (props.tags !== undefined) {
      for (let key in props.tags) {
        tags.push({key: key, value: props.tags[key]});
      }
    }

    this.setState({
      variables: variables,
      tags: tags,
    });
  }

  getDeviceProfileOption(id, callbackFunc) {
    DeviceProfileStore.get(id, resp => {
      callbackFunc({label: resp.deviceProfile.name, value: resp.deviceProfile.id});
    });
  }

  getDeviceProfileOptions(search, callbackFunc) {
    DeviceProfileStore.list(0, this.props.match.params.applicationID, 999, 0, resp => {
      const options = resp.result.map((dp, i) => {return {label: dp.name, value: dp.id}});
      callbackFunc(options);
    });
  }

  onTabChange = (e, v) => {
    this.setState({
      tab: v,
    });
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    const variables = this.state.variables.map((obj, i) => <KVForm key={i} index={i} object={obj} onChange={this.onChangeKV("variables")} onDelete={this.onDeleteKV("variables")} />);
    const tags = this.state.tags.map((obj, i) => <KVForm key={i} index={i} object={obj} onChange={this.onChangeKV("tags")} onDelete={this.onDeleteKV("tags")} />);

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
        disabled={this.props.disabled}
      >
        <Tabs value={this.state.tab} onChange={this.onTabChange} indicatorColor="primary">
          <Tab label="常规" />
          <Tab label="变量" />
          <Tab label="标签" />
        </Tabs>

        {this.state.tab === 0 && <div>
          <TextField
            id="name"
            label="前端设备名称"
            helperText="前端设备名由字母数字和破折号组成。"
            margin="normal"
            value={this.state.object.name || ""}
            onChange={this.onChange}
            inputProps={{
              pattern: "[\\w-]+",
            }}
            fullWidth
            required
          />
          <TextField
            id="description"
            label="前端设备描述"
            margin="normal"
            value={this.state.object.description || ""}
            onChange={this.onChange}
            fullWidth
            required
          />
          {!this.props.update && <EUI64Field
            margin="normal"
            id="devEUI"
            label="前端设备 EUI"
            onChange={this.onChange}
            value={this.state.object.devEUI || ""}
            fullWidth
            required
            random
          />}
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel} required>Device-profile</FormLabel>
            <AutocompleteSelect
              id="deviceProfileID"
              label="前端设备简介（Device-profile）"
              value={this.state.object.deviceProfileID}
              onChange={this.onChange}
              getOption={this.getDeviceProfileOption}
              getOptions={this.getDeviceProfileOptions}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <FormGroup>
              <FormControlLabel
                label="禁止帧计数器核实"
                control={
                  <Checkbox
                    id="skipFCntCheck"
                    checked={!!this.state.object.skipFCntCheck}
                    onChange={this.onChange}
                    color="primary"
                  />
                }
              />
            </FormGroup>
            <FormHelperText>
              注意：禁止帧计数器核实会带来安全风险，因为禁止帧计数器核实后将阻止不了重放攻击（replay-attacks）。
              Note that disabling the frame-counter validation will compromise security as it enables people to perform replay-attacks.
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <FormGroup>
              <FormControlLabel
                label="前端设备禁止"
                control={
                  <Checkbox
                    id="isDisabled"
                    checked={!!this.state.object.isDisabled}
                    onChange={this.onChange}
                    color="primary"
                  />
                }
              />
            </FormGroup>
            <FormHelperText>
              网络服务器将忽略禁止后的前端设备的上传数据和入网请求。
            </FormHelperText>
          </FormControl>
        </div>}

        {this.state.tab === 1 && <div>
          <FormControl fullWidth margin="normal">
            <Typography variant="body1">
              变量可被用作如集成用替换占位符，例如，在需要配置前端设备的特殊令牌的集成场景。
            </Typography>
            {variables}
          </FormControl>
          <Button variant="outlined" onClick={this.addKV("variables")}>添加变量</Button>
        </div>}

        {this.state.tab === 2 && <div>
          <FormControl fullWidth margin="normal">
            <Typography variant="body1">
              标签可用来过滤前端设备，为集成应用来显示更多的元数据（meta-data）。
            </Typography>
            {tags}
          </FormControl>
          <Button variant="outlined" onClick={this.addKV("tags")}>添加标签</Button>
        </div>}
      </Form>
    );
  }
}

export default withStyles(styles)(DeviceForm);
