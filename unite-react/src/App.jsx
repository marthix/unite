import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

const App = () => (
  <Router>
    <div>

      <nav className="header">
        <Link to="/"><img className="logo-unite" src="assets/logos/unite-logo-black.png" height="40px"/></Link>
        <Link to="/directory" className="button button-login"><img className="logo-discord" src="assets/logos/discord.svg" height="32px"/>LOG IN WITH DISCORD</Link>
      </nav>

        {/*
          <Route exact path="/" component={Home} />
          <Route path="/directory" component={Directory} />
        */}

    </div>
  </Router>
);

export default App;
