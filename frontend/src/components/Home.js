import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import { Grid, Button, ButtonGroup, Typography } from "@material-ui/core";
import RomeJoinPage from "./RomeJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  async componentDidMount() {
    fetch("/api/user-in-room")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          roomCode: data.code,
        });
      });
  }

  renderHomePage() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" compact="h3">
            Music Player
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup variant="contained" color="primary">
            <Button color="primary" to="/join" component={Link}>
              Join Room
            </Button>
            <Button color="secondary" to="/create" component={Link}>
              Create Room
            </Button>
          </ButtonGroup>
        </Grid>
        {/* <Grid item xs={12} align="center"></Grid> */}
      </Grid>
    );
  }
  clearRoomCode() {
    this.setState({
      roomCode: null,
    });
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return this.state.roomCode ? (
                <Redirect to={`/room/${this.state.roomCode}`} />
              ) : (
                this.renderHomePage()
              );
            }}
          ></Route>
          <Route path="/join" component={RomeJoinPage}></Route>
          <Route path="/create" component={CreateRoomPage}></Route>
          <Route
            path="/room/:roomCode"
            render={(props) => {
              return <Room {...props} leaveRoomCallback={this.clearRoomCode} />;
            }}
          ></Route>
        </Switch>
      </Router>
    );
  }
}
