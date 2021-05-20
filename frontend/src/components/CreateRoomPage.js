import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { FormHelperText } from "@material-ui/core";
import { Link } from "react-router-dom";
import { Radio } from "@material-ui/core";
import { RadioGroup } from "@material-ui/core";
import { FormControlLabel } from "@material-ui/core";
export default class CreateRoomPage extends Component {
  defaultvotes = 2;
  constructor(props) {
    super(props);
    this.state = {
      guest_can_pause: true,
      votes_to_skip: this.defaultvotes,
    };
    this.buttonPressed = this.buttonPressed.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
  }

  handleChanges(e) {
    this.setState({
      votes_to_skip: e.target.value,
    });
  }
  handlePause(e) {
    this.setState({
      guest_can_pause: e.target.value === "true" ? true : false,
    });
  }
  buttonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votes_to_skip,
        guest_can_pause: this.state.guest_can_pause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => this.props.history.push("/room/" + data.code));
  }
  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Create a room
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control playback</div>
            </FormHelperText>
            <RadioGroup row defaultValue="true" onChange={this.handlePause}>
              <FormControlLabel
                value="true"
                control={<Radio color="primary"></Radio>}
                label="play/pause"
                labelPlacement="bottom"
              ></FormControlLabel>
              <FormControlLabel
                value="false"
                control={<Radio color="secondary"></Radio>}
                label="No Control"
                labelPlacement="bottom"
              ></FormControlLabel>
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <TextField
              onChange={this.handleChanges}
              required={true}
              type="number"
              defaultValue={this.defaultvotes}
              inputProps={{ min: 1, style: { textAlign: "center" } }}
            ></TextField>
            <FormHelperText>
              <div align="Center">Votes Required to skip song</div>
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={this.buttonPressed}
          >
            Create A Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }
}
