import React, { Component } from 'react';
import DateFormat from 'dateformat';

/**
* Using weather icons from https://github.com/erikflowers/weather-icons
**/
export default class WeatherForecast extends Component {

  constructor(props, context) {
      super(props, context);

      this.state = {
        weekForecastEvents: []
      };

      this.fetchForecast();
  }

  componentDidMount() {
    this.interval = setInterval(this.fetchForecast, 60 * 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  fetchForecast = () => {
    const url = this.props.url
                  .concat('forecast')
                  .concat('?APPID=').concat(this.props.apiKey)
                  .concat('&id=').concat(this.props.locationID)
                  .concat('&units=metric')
                  .concat('&cnt=54'); // 24 hrs * 7 days / 3hr intervals

    fetch(url)
      .then(results => {
        return results.json();
      })
      .then(data => {
        console.log(JSON.stringify(data, null, " "));

        const today = DateFormat(new Date(), 'yyyy-mm-dd');
        const weekForecastEvents = data.list.filter(item => item.hasOwnProperty('dt_txt') && !item.dt_txt.startsWith(today) && item.dt_txt.includes('12:00'));
        this.setState({weekForecastEvents: weekForecastEvents});
      });
  }

  render() {

    const forecast = this.state.weekForecastEvents.map(function(event) {

      if (event.dt !== undefined) {
        const date = (event.dt !== undefined) ? new Date(event.dt * 1000) : undefined;
        const dayName = DateFormat(date, 'ddd');
        const weatherIconName = 'wi wi-owm-day-'.concat(event.weather[0].id);
        const weatherTemp = parseFloat(event.main.temp).toFixed(0);

        return <p className="dim" key={event.dt}>
                  {dayName} <i className={weatherIconName}/> {weatherTemp}
               </p>
      }

      return null;
    });

    return (
      <div className="WeatherForecast">
        {forecast}
      </div>
    );
  }
}
