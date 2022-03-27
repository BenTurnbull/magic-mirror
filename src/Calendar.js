import React, { Component } from 'react';
import DateFormat from 'dateformat';
import 'dotenv/config'

export default class Calendar extends Component {

  static defaultProps = {
    apiKey: process.env.REACT_APP_CALENDAR_API,
    calendarUrl: process.env.REACT_APP_CALENDAR_URL,
  }

  constructor(props, context) {
      super(props, context);

      this.state = {
        todayEvents: [],
        futureEvents: []
      };

      this.fetchCalendarEvents();
  }

  componentDidMount() {
    this.interval = setInterval(this.fetchCalendarEvents, 10 * 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  fetchCalendarEvents = () => {
    const now = new Date();
    const dateMask = "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'";
    const url = this.props.calendarUrl
                  .concat('?key=').concat(this.props.apiKey)
                  .concat('&singleEvents=true')
                  .concat('&orderBy=startTime')
                  .concat('&timeMin=').concat(DateFormat(now, dateMask))
                  .concat('&timeMax=').concat(DateFormat(now.getTime() + (60 * 24 * 60 * 60000), dateMask))
    //console.log("url=" + url)
    fetch(url)
    .then(results => {
      return results.json();
    })
    .then(data => {

      const events = data.items.filter(item => item && item.hasOwnProperty('status') && item.status !== 'cancelled'); //.reverse();

      now.setHours(23, 59, 59, 999); // set cut-off time
      const todayEvents = events.filter(event => new Date(event.start.dateTime || event.start.date).getTime() <= now.getTime());
      const futureEvents = events.filter(event => new Date(event.start.dateTime || event.start.date).getTime() > now.getTime());

      //console.log(JSON.stringify(events, null, " "));

      this.setState({
        todayEvents: todayEvents,
        futureEvents: futureEvents
      })
    });
  }

  render() {

    const todayList = this.state.todayEvents.map(function(event) {

      const startDate = (event.start.dateTime !== undefined) ? new Date(event.start.dateTime) :
                   (event.start.date !== undefined) ? new Date(event.start.date) :
                   undefined;

      const endDate = (event.end.dateTime !== undefined) ? new Date(event.end.dateTime) :
                  (event.end.date !== undefined) ? new Date(event.end.date) :
                  undefined;

      const delta = endDate.getTime() - startDate.getTime();
      const time = delta > 6 * 60 * 60 * 1000 ? "All day" : DateFormat(startDate, 'HH:MM');
      const brightness = "normal";
      //time.startsWith(DateFormat(this.state.now, 'HH')) ? "bright" : "normal";

      return <p className={brightness} key={event.id}>
                {time} {event.summary}
             </p>
    });

    const futureList = this.state.futureEvents.map(function(event) {

      const date = (event.start.dateTime !== undefined) ? new Date(event.start.dateTime) :
                   (event.start.date !== undefined) ? new Date(event.start.date) :
                   undefined;

      const time = DateFormat(date, 'dS mmmm');

      return <p className="dim" key={event.id}>
                {time} {event.summary}
             </p>
    });

    return (
      <div className="Calendar">
        {todayList}
        <span className="Divider"/>
        {futureList}
      </div>
    );
  }
}
