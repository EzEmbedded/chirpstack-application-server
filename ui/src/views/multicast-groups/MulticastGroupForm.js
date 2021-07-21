import React from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

import FormComponent from "../../classes/FormComponent";
import AESKeyField from "../../components/AESKeyField";
import DevAddrField from "../../components/DevAddrField";
import Form from "../../components/Form";
import AutocompleteSelect from "../../components/AutocompleteSelect";
import theme from "../../theme";


const styles = {
  formLabel: {
    fontSize: 12,
  },
  link: {
    color: theme.palette.primary.main,
  },
};


class MulticastGroupForm extends FormComponent {
  getRandomKey(len) {
    let cryptoObj = window.crypto || window.msCrypto;
    let b = new Uint8Array(len);
    cryptoObj.getRandomValues(b);

    return Buffer.from(b).toString('hex');
  }

  getRandomMcAddr = (cb) => {
    cb(this.getRandomKey(4));
  }

  getRandomSessionKey = (cb) => {
    cb(this.getRandomKey(16));
  }


  getGroupTypeOptions(search, callbackFunc) {
    const options = [
      {value: "CLASS_B", label: "Class-B"},
      {value: "CLASS_C", label: "Class-C"},
    ];

    callbackFunc(options);
  }

  getPingSlotPeriodOptions(search, callbackFunc) {
    const pingSlotPeriodOptions = [
      {value: 32 * 1, label: "每秒"},
      {value: 32 * 2, label: "每2秒"},
      {value: 32 * 4, label: "每4秒"},
      {value: 32 * 8, label: "每8秒"},
      {value: 32 * 16, label: "每16秒"},
      {value: 32 * 32, label: "每32秒"},
      {value: 32 * 64, label: "每64秒"},
      {value: 32 * 128, label: "每128秒"},
    ];

    callbackFunc(pingSlotPeriodOptions);
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
        <TextField
          id="name"
          label="多播组名"
          margin="normal"
          value={this.state.object.name || ""}
          onChange={this.onChange}
          helperText="多播组的名称。"
          fullWidth
          required
        />
        <DevAddrField
          id="mcAddr"
          label="多播地址"
          margin="normal"
          value={this.state.object.mcAddr || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          randomFunc={this.getRandomMcAddr}
          fullWidth
          required
          random
        />
        <AESKeyField
          id="mcNwkSKey"
          label="多播网络会话密钥 session key"
          margin="normal"
          value={this.state.object.mcNwkSKey || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          fullWidth
          required
          random
        />
        <AESKeyField
          id="mcAppSKey"
          label="多播应用会话密钥 session key"
          margin="normal"
          value={this.state.object.mcAppSKey || ""}
          onChange={this.onChange}
          disabled={this.props.disabled}
          fullWidth
          required
          random
        />
        <TextField
          id="fCnt"
          label="帧计数器"
          margin="normal"
          type="number"
          value={this.state.object.fCnt || 0}
          onChange={this.onChange}
          required
          fullWidth
        />
        <TextField
          id="dr"
          label="数据率"
          helperText="用于发送多播数据的数据率。请参考LoraWAN 规范里区域参数的认可值。"
          margin="normal"
          type="number"
          value={this.state.object.dr || 0}
          onChange={this.onChange}
          required
          fullWidth
        />
        <TextField
          id="frequency"
          label="频率 (Hz)"
          helperText="用于发送多播帧的频率，请参考LoraWAN 规范里区域参数的认可值。"
          margin="normal"
          type="number"
          value={this.state.object.frequency || 0}
          onChange={this.onChange}
          required
          fullWidth
        />
        <FormControl fullWidth margin="normal">
          <FormLabel className={this.props.classes.formLabel} required>Multicast-group type</FormLabel>
          <AutocompleteSelect
            id="groupType"
            label="选择组播帧类型"
            value={this.state.object.groupType || ""}
            onChange={this.onChange}
            getOptions={this.getGroupTypeOptions}
            required
          />
          <FormHelperText>
            组播帧类型定义了网路服务器如何计划发送组播帧。
          </FormHelperText>
        </FormControl>
        {this.state.object.groupType === "CLASS_B" && <FormControl fullWidth margin="normal">
          <FormLabel className={this.props.classes.formLabel} required>Class-B ping-slot periodicity</FormLabel>
          <AutocompleteSelect
            id="pingSlotPeriod"
            label="选择 Class-B ping-slot 周期"
            value={this.state.object.pingSlotPeriod || ""}
            onChange={this.onChange}
            getOptions={this.getPingSlotPeriodOptions}
            required
          />
          <FormHelperText>Class-B ping-slot 周期。</FormHelperText>
        </FormControl>}
      </Form>
    );
  }
}

export default withStyles(styles)(MulticastGroupForm);
