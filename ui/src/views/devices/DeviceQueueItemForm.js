import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

import {Controlled as CodeMirror} from "react-codemirror2";
import "codemirror/mode/javascript/javascript";

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";


const styles = {
  codeMirror: {
    zIndex: 1,
  },
};



class DeviceQueueItemForm extends FormComponent {
  constructor() {
    super();

    this.state = {
      tab: 0,
    };
  }

  onTabChange = (e, v) => {
    this.setState({
      tab: v,
    });
  }

  onCodeChange = (field, editor, data, newCode) => {
    let object = this.state.object;
    object[field] = newCode;
    this.setState({
      object: object,
    });
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    const codeMirrorOptions = {
      lineNumbers: true,
      mode: "javascript",
      theme: "default",
    };

    let objectCode = this.state.object.jsonObject;
    if (objectCode === "" || objectCode === undefined) {
      objectCode = `{}`
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
        <TextField
          id="fPort"
          label="功能端口fPort"
          margin="normal"
          value={this.state.object.fPort || ""}
          onChange={this.onChange}
          helperText="请注意，功能端口值必须大于0。"
          required
          fullWidth
          type="number"
        />
        <FormControl fullWidth margin="normal">
          <FormControlLabel
            label="下行确认Confirmed"
            control={
              <Checkbox
                id="confirmed"
                checked={!!this.state.object.confirmed}
                onChange={this.onChange}
                color="primary"
              />
            }
          />
        </FormControl>
        <Tabs value={this.state.tab} onChange={this.onTabChange} indicatorColor="primary">
          <Tab label="Base64 编码器" />
          <Tab label="JSON 对象" />
        </Tabs>
        {this.state.tab === 0 && <TextField
          id="data"
          label="Base64 编码字符串"
          margin="normal"
          value={this.state.object.data || ""}
          onChange={this.onChange}
          required
          fullWidth
        />}
        {this.state.tab === 1 && <FormControl fullWidth margin="normal">
          <CodeMirror
            value={objectCode}
            className={this.props.classes.codeMirror}
            options={codeMirrorOptions}
            onBeforeChange={this.onCodeChange.bind(this, 'jsonObject')}
          />
          <FormHelperText>
            前端设备必须配置一个前端设备简介（Device Profile），在这个前端设备简介里，要指定一个给定JSON负载的编解码器，用来编码这个负载。
          </FormHelperText>
        </FormControl>}
      </Form>
    );
  }
}

export default withStyles(styles)(DeviceQueueItemForm);

