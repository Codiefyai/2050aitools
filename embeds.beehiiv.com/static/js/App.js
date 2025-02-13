import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";

// Routes
import { NotFound } from "./routes/NotFound";
import Submit from "./routes/Submit";

const history = createBrowserHistory();

// Unauthed Routes
const routes = () => {
  return (
    <Switch>
      <Route exact path="/not-found" component={NotFound} />
      <Route exact path="/:embedId" component={Submit} />
      <Route component={NotFound} />
    </Switch>
  );
};

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Router history={history}>{routes()}</Router>
      </React.Fragment>
    );
  }
}

export default App;
