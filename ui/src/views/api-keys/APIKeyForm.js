import React from "react";

import TextField from '@material-ui/core/TextField';

import FormComponent from "../../classes/FormComponent";
import Form from "../../components/Form";
import InternalStore from "../../stores/InternalStore";


class APIKeyForm extends FormComponent {
  constructor() {
    super();
    this.state = {
      token: null,
      id: null,
    };
  }

  onSubmit = (e) => {
    e.preventDefault();

    let apiKey = this.state.object;
    apiKey.isAdmin = this.props.isAdmin || false;
    apiKey.organizationID = this.props.organizationID || 0;
    apiKey.applicationID = this.props.applicationID || 0;

    InternalStore.createAPIKey(apiKey, resp => {
      this.setState({
        token: resp.jwtToken,
        id: resp.id,
      });
    });
  }

  render() {
    if (this.state.object === undefined) {
      return null;
    }

    if (this.state.token !== null) {
      return(
        <div>
          <TextField
            id="id"
            label="API key ID号"
            value={this.state.id}
            margin="normal"
            disabled
            fullWidth
          />
          <TextField
            id="name"
            label="API key 名"
            value={this.state.object.name}
            margin="normal"
            disabled
            fullWidth
          />
          <TextField
            id="jwtToken"
            label="令牌(JWT)"
            value={this.state.token}
            rows={5}
            margin="normal"
            helperText="此令牌用于这个API key产生API请求，并且这个令牌只生成一次，如有必要请妥善保存。"
            fullWidth
            multiline
          />
        </div>
      );
    }

    return(
      <Form
        submitLabel={this.props.submitLabel}
        onSubmit={this.onSubmit}
      >
        <TextField
          id="name"
          label="API key 名"
          helperText="此API key的描述名"
          margin="normal"
          value={this.state.object.name || ""}
          onChange={this.onChange}
          required
          fullWidth
        />
      </Form>
    );
  }
}

export default APIKeyForm;
