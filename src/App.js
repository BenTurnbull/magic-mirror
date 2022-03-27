import React, { Component } from 'react';
import './css/App.css';
import Clock from './Clock.js'
import Calendar from './Calendar.js'
import Weather from './Weather.js'

export default class App extends Component {
  render() {
    return (
      <div className="BaseContainer">
        <div className="LeftColumn">
          <Clock/>
          <div className="Spacer"/>
          <Calendar/>
        </div>
        <div className="MiddleColumn"/>
        <div className="RightColumn">
          <Weather/>
        </div>
      </div>

    );
  }
}
