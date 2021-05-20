import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
    };
    this.roomCode = this.props.match.params.roomCode;
    this.leaveRoom = this.leaveRoom.bind(this);
    this.getRoom();
  }
  getRoom() {
    fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
      });
  }
  leaveRoom() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((response) => {
      this.props.history.push("/");
    });
  }
  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code :{this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            votes:{this.state.votesToSkip.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            guest:{this.state.guestCanPause.toString()}{" "}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            host:{this.state.isHost.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={this.leaveRoom}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}

// <div>
// <h1>{this.roomCode}</h1>
// <p>votes:{this.state.votesToSkip.toString()}</p>
// <p>guest:{this.state.guestCanPause.toString()}</p>
// <p>host:{this.state.isHost.toString()}</p>
// </div>
