import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation.jsx"

export default class App extends React.Component {

  render() {
    return (
      <Router>
        <div>

          <Navigation />

            {/*
              <Route exact path="/" component={Home} />
              <Route path="/directory" component={Directory} />
            */}

        </div>
      </Router>
    );
  }
}
