import React, { Component } from 'react';
import DateFormat from 'dateformat';

export default class Clock extends Component {

  constructor(props, context) {
      super(props, context);

      this.state = {
        now: new Date()
      };
  }

  updateTime = () => {
    this.setState({now: new Date()})
  }

  componentDidMount() {
    this.interval = setInterval(this.updateTime, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <div className="Clock">
        <div className="normal medium">{DateFormat(this.state.now, "dddd, dS mmmm, yyyy")}</div>
        <div className="bright large">{DateFormat(this.state.now, "HH:MM")} <sup className="dim">{DateFormat(this.state.now, "ss")}</sup></div>
      </div>
    );
  }
}
