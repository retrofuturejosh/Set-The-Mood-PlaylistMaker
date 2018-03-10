import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import history from "../history";

import { detect } from "detect-browser";
import MobileDetect from "mobile-detect";

export const Login = props => {
  const browser = detect();
  const md = new MobileDetect(window.navigator.userAgent);

  return browser.name === "safari" ? (
    <div id="safari">sorry, safari is not supported</div>
  ) : (
    <div className="login-window">
      <div className="login-main">
        {md.phone() !== null ? (
          <div id="mobile">Note: Vibez is best experienced on a desktop</div>
        ) : null}
        <a href="/api/spotifyAuth/login">CONNECT SPOTIFY</a>
      </div>
      <div id="or">OR</div>
      <div
        className="login"
        onClick={e => {
          history.push("/landing");
        }}
      >
        <a>SET VIBEZ</a>
      </div>
      <div id="login-disappear">playlist maker</div>
    </div>
  );
};
