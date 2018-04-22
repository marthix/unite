import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const App = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/directory">Directory</Link>
        </li>
      </ul>

      <hr />

      {/*
        <Route exact path="/" component={Home} />
        <Route path="/directory" component={Directory} />
      */}
    </div>
  </Router>
);

export default App;
