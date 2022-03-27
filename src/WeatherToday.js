import React, { Component } from 'react';
import DateFormat from 'dateformat';

/**
* Using weather icons from https://github.com/erikflowers/weather-icons
**/
export default class WeatherToday extends Component {

  constructor(props, context) {
      super(props, context);

      this.state = {
        weatherIcon: undefined,
        currentTemp: undefined,
        windDirection: undefined,
        windSpeed: undefined,
        sunEventIcon: undefined,
        sunEventTime: undefined
      };

      this.fetchWeather();
  }

  componentDidMount() {
    this.interval = setInterval(this.fetchWeather, 10 * 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  fetchWeather = () => {
    const url = this.props.url
                  .concat('weather')
                  .concat('?APPID=').concat(this.props.apiKey)
                  .concat('&id=').concat(this.props.locationID)
                  .concat('&units=metric');

    fetch(url)
      .then(results => {
        return results.json();
      })
      .then(data => {
        //console.log(JSON.stringify(data, null, " "));

        if (data.hasOwnProperty('weather') && data.weather.length === 1) {
          const weather = data.weather[0];

          if (data.hasOwnProperty('sys')) {
            const currentTime = Date.now();
            const sunrise = data.sys.sunrise * 1000;
            const sunset = data.sys.sunset * 1000;

            const dayTime = currentTime > sunrise && currentTime < sunset;
            const weatherIcon = 'wi wi-owm-'
              .concat(dayTime ? 'day' : 'night')
              .concat('-')
              .concat(weather.id);
            this.setState({
              weatherIcon: weatherIcon
            })

            this.setState({
              sunEventIcon: dayTime ? 'wi wi-sunset' : 'wi wi-sunrise',
              sunEventTime: dayTime ? sunset : sunrise
            })

            if (data.hasOwnProperty('main')) {
              const temperature = parseFloat(data.main.temp).toFixed(0);
              this.setState({
                currentTemp: temperature
              })
            }
          }
        }

        if (data.hasOwnProperty('wind')) {
          const windSpeed = parseFloat(parseFloat(data.wind.speed) * 60 * 60 / 1000).toFixed(0); // km/h
          const windDirectionIcon = 'wi wi-wind wi-towards-'.concat(this.cardinalDirection(data.wind.deg));
          this.setState({
            windSpeed: windSpeed,
            windDirection: windDirectionIcon
          })
        }

      });
  }

  render() {

    const sunEvent = function SunEvent(sunIcon, sunTime) {
      return (
          <div>
          { sunIcon &&
            <div>
              <i className={"small normal " + sunIcon}>{DateFormat(sunTime, "HH:MM")}</i>
            </div>
          }
          </div>
        );
    }

    const generalWeather = function GeneralWeather(weatherIconName, weatherTemp) {
        return (
          <div>
          { weatherIconName &&
            <div>
              <i className={"large bright " + weatherIconName}> {weatherTemp}°c </i>
            </div>
          }
          </div>
        );
    }

    const windWeather = function WindWeather(windDirection, windSpeed) {
      return (
        <div>
          { windDirection &&
            <div className="normal">
              <i className={"small " + windDirection}></i> {windSpeed}km/h
            </div>
          }
        </div>
      );
    }

    return (
        <div className="WeatherToday">
          {sunEvent(this.state.sunEventIcon, this.state.sunEventTime)}
          {generalWeather(this.state.weatherIcon, this.state.currentTemp)}
          {windWeather(this.state.windDirection, this.state.windSpeed)}
        </div>
    );
  }

  cardinalDirection = (deg) => {
    if (deg > 11.25 && deg <= 33.75){
			return 'nne';
		} else if (deg > 33.75 && deg <= 56.25) {
			return 'ne';
		} else if (deg > 56.25 && deg <= 78.75) {
			return 'ene';
		} else if (deg > 78.75 && deg <= 101.25) {
			return 'e';
		} else if (deg > 101.25 && deg <= 123.75) {
			return 'ese';
		} else if (deg > 123.75 && deg <= 146.25) {
			return 'se';
		} else if (deg > 146.25 && deg <= 168.75) {
			return 'sse';
		} else if (deg > 168.75 && deg <= 191.25) {
			return 's';
		} else if (deg > 191.25 && deg <= 213.75) {
			return 'ssw';
		} else if (deg > 213.75 && deg <= 236.25) {
			return 'sw';
		} else if (deg > 236.25 && deg <= 258.75) {
			return 'wsw';
		} else if (deg > 258.75 && deg <= 281.25) {
			return 'w';
		} else if (deg > 281.25 && deg <= 303.75) {
			return 'wnw';
		} else if (deg > 303.75 && deg <= 326.25) {
			return 'nw';
		} else if (deg > 326.25 && deg <= 348.75) {
			return 'nnw';
		} else {
			return 'n';
    }
  }
}
