import React from "react";
import { Link } from "react-router-dom";
import uniteLogo from "../logos/unite-logo-black.png";
import discordLogo from "../logos/discord.svg";

export default class Navigation extends React.Component {

  getInitialState = () => {

    return {
      isLoggedIn: false
    };

  };

  state = this.getInitialState();

  callApi = async (url) => {
    const response = await fetch(url);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  handleLogin = () => {
    this.callApi('/login')
      .then(res => this.setState({ response: res.express }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <nav className="header">
        <Link to="/"><img className="logo-unite" src={uniteLogo} height="40px"/></Link>

        {(() => {

          if (this.state.isLoggedIn) {

          } else {
            return (
              <button className="button button-login" onClick={this.handleLogin}>
                <img className="logo-discord" src={discordLogo}/>
                log in with discord
              </button>
            );
          }

        })()}

      </nav>
    );
  }
}
