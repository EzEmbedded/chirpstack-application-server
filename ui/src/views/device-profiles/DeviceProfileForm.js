import React from "react";

import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import {Controlled as CodeMirror} from "react-codemirror2";
import "codemirror/mode/javascript/javascript";

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import KVForm from "../../components/KVForm";
import DurationField from "../../components/DurationField";
import AutocompleteSelect from "../../components/AutocompleteSelect";
import NetworkServerStore from "../../stores/NetworkServerStore";
import { FormLabel } from "../../../node_modules/@material-ui/core";


const styles = {
  formLabel: {
    fontSize: 12,
  },
  codeMirror: {
    zIndex: 1,
  },
};


class DeviceProfileForm extends FormComponent {
  constructor() {
    super();
    this.state = {
      tab: 0,
      tags: [],
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.getNetworkServerOptions = this.getNetworkServerOptions.bind(this);
    this.getMACVersionOptions = this.getMACVersionOptions.bind(this);
    this.getRegParamsOptions = this.getRegParamsOptions.bind(this);
    this.getPingSlotPeriodOptions = this.getPingSlotPeriodOptions.bind(this);
    this.getPayloadCodecOptions = this.getPayloadCodecOptions.bind(this);
    this.onCodeChange = this.onCodeChange.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    this.setKVArray(this.props.object || {});
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);

    if (prevProps.object !== this.props.object) {
      this.setKVArray(this.props.object || {});
    }
  }

  getNetworkServerOptions(search, callbackFunc) {
    NetworkServerStore.list(this.props.match.params.organizationID, 999, 0, resp => {
      const options = resp.result.map((ns, i) => {return {label: ns.name, value: ns.id}});
      callbackFunc(options);
    });
  }

  getMACVersionOptions(search, callbackFunc) {
    const macVersionOptions = [
      {value: "1.0.0", label: "1.0.0"},
      {value: "1.0.1", label: "1.0.1"},
      {value: "1.0.2", label: "1.0.2"},
      {value: "1.0.3", label: "1.0.3"},
      {value: "1.0.4", label: "1.0.4"},
      {value: "1.1.0", label: "1.1.0"},
    ];

    callbackFunc(macVersionOptions);
  }

  getRegParamsOptions(search, callbackFunc) {
    const regParamsOptions = [
      {value: "A", label: "A"},
      {value: "B", label: "B"},
      {value: "RP002-1.0.0", label: "RP002-1.0.0"},
      {value: "RP002-1.0.1", label: "RP002-1.0.1"},
    ];

    callbackFunc(regParamsOptions);
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

  getPayloadCodecOptions(search, callbackFunc) {
    const payloadCodecOptions = [
      {value: "", label: "无"},
      {value: "CAYENNE_LPP", label: "卡宴 LPP协议Cayenne LPP"},
      {value: "CUSTOM_JS", label: "自定义JavaScript 编解码器"},
    ];

    callbackFunc(payloadCodecOptions);
  }

  getADRAlgorithmsOptions = (search, callbackFunc) => {
    if (this.state.object.networkServerID === undefined) {
      callbackFunc([]);
    } else {
      NetworkServerStore.getADRAlgorithms(this.state.object.networkServerID, resp => {
        const options = resp.adrAlgorithms.map((adr, i) => {return {value: adr.id, label: adr.name}});
        callbackFunc(options);
      })
    }
  }

  onCodeChange(field, editor, data, newCode) {
    let object = this.state.object;
    object[field] = newCode;
    this.setState({
      object: object,
    });
  }

  onTabChange(e, v) {
    this.setState({
      tab: v,
    });
  }

  onChange(e) {
    super.onChange(e);
    if (e.target.id === "factoryPresetFreqsStr") {
      let object = this.state.object;
      let freqsStr = e.target.value.split(",");
      object["factoryPresetFreqs"] = freqsStr.map((f, i) => parseInt(f, 10));
      this.setState({
        object: object,
      });
    }
  }

  setKVArray = (props) => {
    let tags = [];

    if (props.tags !== undefined) {
      for (let key in props.tags) {
        tags.push({key: key, value: props.tags[key]});
      }
    }

    this.setState({
      tags: tags,
    });
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    let factoryPresetFreqsStr = "";
    if (this.state.object.factoryPresetFreqsStr !== undefined) {
      factoryPresetFreqsStr = this.state.object.factoryPresetFreqsStr;
    } else if (this.state.object.factoryPresetFreqs !== undefined) {
      factoryPresetFreqsStr = this.state.object.factoryPresetFreqs.join(", ");
    }

    const codeMirrorOptions = {
      lineNumbers: true,
      mode: "javascript",
      theme: "default",
    };
    
    let payloadEncoderScript = this.state.object.payloadEncoderScript;
    let payloadDecoderScript = this.state.object.payloadDecoderScript;

    if (payloadEncoderScript === "" || payloadEncoderScript === undefined) {
      payloadEncoderScript = `// Encode encodes the given object into an array of bytes.
//  - fPort contains the LoRaWAN fPort number
//  - obj is an object, e.g. {"temperature": 22.5}
//  - variables contains the device variables e.g. {"calibration": "3.5"} (both the key / value are of type string)
// The function must return an array of bytes, e.g. [225, 230, 255, 0]
function Encode(fPort, obj, variables) {
  return [];
}`;
    }

    if (payloadDecoderScript === "" || payloadDecoderScript === undefined) {
      payloadDecoderScript = `// Decode decodes an array of bytes into an object.
//  - fPort contains the LoRaWAN fPort number
//  - bytes is an array of bytes, e.g. [225, 230, 255, 0]
//  - variables contains the device variables e.g. {"calibration": "3.5"} (both the key / value are of type string)
// The function must return an object, e.g. {"temperature": 22.5}
function Decode(fPort, bytes, variables) {
  return {};
}`;
    }

    const tags = this.state.tags.map((obj, i) => <KVForm key={i} index={i} object={obj} onChange={this.onChangeKV("tags")} onDelete={this.onDeleteKV("tags")} />);


    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
        disabled={this.props.disabled}
      >
        <Tabs value={this.state.tab} onChange={this.onTabChange} indicatorColor="primary">
          <Tab label="常规" />
          <Tab label="入网激活 (OTAA / ABP)" />
          <Tab label="Class-B" />
          <Tab label="Class-C" />
          <Tab label="编解码器" />
          <Tab label="标签" />
        </Tabs>

        {this.state.tab === 0 && <div>
          <TextField
            id="name"
            label="前端设备简介（Device-profile）名"
            margin="normal"
            value={this.state.object.name || ""}
            onChange={this.onChange}
            helperText="前端设备简介名称。"
            required
            fullWidth
          />
          {!this.props.update && <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel} required>Network-server</FormLabel>
            <AutocompleteSelect
              id="networkServerID"
              label="选择网络服务器"
              value={this.state.object.networkServerID || ""}
              onChange={this.onChange}
              getOptions={this.getNetworkServerOptions}
            />
            <FormHelperText>
              网络服务器需要提供前端设备简介（device-profile），并且选定后不能更改。
            </FormHelperText>
          </FormControl>}
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel} required>LoRaWAN MAC 版本</FormLabel>
            <AutocompleteSelect
              id="macVersion"
              label="选择LoRaWAN MAC 版本"
              value={this.state.object.macVersion || ""}
              onChange={this.onChange}
              getOptions={this.getMACVersionOptions}
            />
            <FormHelperText>
              前端设备支持的LoRaWAN MAC版本
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel} required>LoRaWAN 区域参数版本</FormLabel>
            <AutocompleteSelect
              id="regParamsRevision"
              label="选择LoRaWAN 区域参数版本"
              value={this.state.object.regParamsRevision || ""}
              onChange={this.onChange}
              getOptions={this.getRegParamsOptions}
            />
            <FormHelperText>
                前端设备支持的LoRaWAN 区域参数版本。
            </FormHelperText>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel} required>自动数据率ADR 算法</FormLabel>
            <AutocompleteSelect
              id="adrAlgorithmID"
              label="选择自动数据率ADR算法"
              value={this.state.object.adrAlgorithmID || ""}
              onChange={this.onChange}
              getOptions={this.getADRAlgorithmsOptions}
              triggerReload={this.state.object.networkServerID || ""}
            />
            <FormHelperText>
                自动数据率ADR算法将控制前端设备的数据率。
            </FormHelperText>
          </FormControl>
          <TextField
            id="maxEIRP"
            label="最大等效辐射功率"
            type="number"
            margin="normal"
            value={this.state.object.maxEIRP || 0}
            onChange={this.onChange}
            helperText="前端设备支持的最大等效辐射功率Maximum EIRP 。"
            required
            fullWidth
          />
          <DurationField
            id="uplinkInterval"
            label="上行周期(秒)"
            helperText="以秒计的预期前端设备上行数据周期，这个可以用来判别前端设备是否失联。"
            value={this.state.object.uplinkInterval}
            onChange={this.onChange}
          />
        </div>}

        {this.state.tab === 1 && <div>
          <FormControl fullWidth margin="normal">
            <FormControlLabel
              label="前端设备支持 OTAA"
              control={
                <Checkbox
                  id="supportsJoin"
                  checked={!!this.state.object.supportsJoin}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
          </FormControl>
          {!this.state.object.supportsJoin && <TextField
            id="rxDelay1"
            label="RX1 延时"
            type="number"
            margin="normal"
            value={this.state.object.rxDelay1 || 0}
            onChange={this.onChange}
            helperText="RX1 延时 (取值范围 0 - 15S)."
            required
            fullWidth
          />}
          {!this.state.object.supportsJoin && <TextField
            id="rxDROffset1"
            label="RX1 数据率偏移"
            type="number"
            margin="normal"
            value={this.state.object.rxDROffset1 || 0}
            onChange={this.onChange}
            helperText="请参考LoRaWAN 协议的区域参数规范的获得可用值。"
            required
            fullWidth
          />}
          {!this.state.object.supportsJoin && <TextField
            id="rxDataRate2"
            label="RX2 数据率"
            type="number"
            margin="normal"
            value={this.state.object.rxDataRate2 || 0}
            onChange={this.onChange}
            helperText="请参考LoRaWAN 协议的区域参数规范的获得可用值。"
            required
            fullWidth
          />}
          {!this.state.object.supportsJoin && <TextField
            id="rxFreq2"
            label="RX2 通道频率 (Hz)"
            type="number"
            margin="normal"
            value={this.state.object.rxFreq2 || 0}
            onChange={this.onChange}
            required
            fullWidth
          />}
          {!this.state.object.supportsJoin && <TextField
            id="factoryPresetFreqsStr"
            label="出厂预置频率(Hz)"
            margin="normal"
            value={factoryPresetFreqsStr}
            onChange={this.onChange}
            helperText="出厂预置频率列表，用逗号隔开，单位Hz。"
            required
            fullWidth
          />}
        </div>}

        {this.state.tab === 2 && <div>
          <FormControl fullWidth margin="normal">
            <FormControlLabel
              label="前端设备支持 Class-B"
              control={
                <Checkbox
                  id="supportsClassB"
                  checked={!!this.state.object.supportsClassB}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
          </FormControl>

          {this.state.object.supportsClassB && <TextField
            id="classBTimeout"
            label="Class-B confirmed 确认下行超时"
            type="number"
            margin="normal"
            value={this.state.object.classBTimeout || 0}
            onChange={this.onChange}
            helperText="Class-B 下行超时（秒）确认confirmed"
            required
            fullWidth
          />}
          {this.state.object.supportsClassB && <FormControl
              fullWidth
              margin="normal"
            >
              <FormLabel className={this.props.classes.formLabel} required>Class-B ping-slot periodicity</FormLabel>
              <AutocompleteSelect
                id="pingSlotPeriod"
                label="选择Class-B ping-slot 周期"
                value={this.state.object.pingSlotPeriod || ""}
                onChange={this.onChange}
                getOptions={this.getPingSlotPeriodOptions}
              />
              <FormHelperText>Class-B ping-slot 周期。</FormHelperText>
          </FormControl>}
          {this.state.object.supportsClassB && <TextField
            id="pingSlotDR"
            label="Class-B ping-slot 数据率"
            type="number"
            margin="normal"
            value={this.state.object.pingSlotDR || 0}
            onChange={this.onChange}
            required
            fullWidth
          />}
          {this.state.object.supportsClassB && <TextField
            id="pingSlotFreq"
            label="Class-B ping-slot 频率(Hz)"
            type="number"
            margin="normal"
            value={this.state.object.pingSlotFreq || 0}
            onChange={this.onChange}
            required
            fullWidth
          />}
        </div>}

        {this.state.tab === 3 && <div>
          <FormControl fullWidth margin="normal">
            <FormControlLabel
              label="前端设备支持Class-C"
              control={
                <Checkbox
                  id="supportsClassC"
                  checked={!!this.state.object.supportsClassC}
                  onChange={this.onChange}
                  color="primary"
                />
              }
            />
            <FormHelperText>当需要前端设备激活后立即进入Class-C模式时，选择此项， 当需要前端设备收到DeviceModeInd MAC命令后进入Class-C时, 勿选此项。</FormHelperText>
          </FormControl>

          <TextField
            id="classCTimeout"
            label="Class-C confirmed 下行验证超时"
            type="number"
            margin="normal"
            value={this.state.object.classCTimeout || 0}
            onChange={this.onChange}
            helperText="Class-C confirmed 下行验证超时，单位秒。"
            required
            fullWidth
          />
        </div>}

        {this.state.tab === 4 && <div>
          <FormControl fullWidth margin="normal">
            <FormLabel className={this.props.classes.formLabel}>负载编解码器</FormLabel>
            <AutocompleteSelect
              id="payloadCodec"
              label="选择负载payload编解码器"
              value={this.state.object.payloadCodec || ""}
              onChange={this.onChange}
              getOptions={this.getPayloadCodecOptions}
            />
            <FormHelperText>
              应用服务器使用编解码器来编解码上下行负载数据。
            </FormHelperText>
          </FormControl>

          {this.state.object.payloadCodec === "CUSTOM_JS" && <FormControl fullWidth margin="normal">
            <CodeMirror
              value={payloadDecoderScript}
              options={codeMirrorOptions}
              onBeforeChange={this.onCodeChange.bind(this, 'payloadDecoderScript')}
              className={this.props.classes.codeMirror}
            />
            <FormHelperText>
              The function must have the signature <strong>function Decode(fPort, bytes)</strong> and must return an object.
              ChirpStack Application Server will convert this object to JSON.
            </FormHelperText>
          </FormControl>}
          {this.state.object.payloadCodec === "CUSTOM_JS" && <FormControl fullWidth margin="normal">
            <CodeMirror
              value={payloadEncoderScript}
              options={codeMirrorOptions}
              onBeforeChange={this.onCodeChange.bind(this, 'payloadEncoderScript')}
              className={this.props.classes.codeMirror}
            />
            <FormHelperText>
              The function must have the signature <strong>function Encode(fPort, obj)</strong> and must return an array
              of bytes.
            </FormHelperText>
          </FormControl>}
        </div>}

        {this.state.tab === 5 && <div>
          <FormControl fullWidth margin="normal">
            <Typography variant="body1">
              标签可用来存储另外的键/值数据。
            </Typography>
            {tags}
          </FormControl>
          <Button variant="outlined" onClick={this.addKV("tags")}>添加标签</Button>
        </div>}
      </Form>
    );
  }
}

export default withStyles(styles)(DeviceProfileForm);
