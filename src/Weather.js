import React, { Component } from 'react';
import WeatherToday from './WeatherToday.js'
import WeatherForecast from './WeatherForecast.js'
import './css/weather-icons.css';
import './css/weather-icons-wind.css';
import 'dotenv/config'

/**
* Using weather icons from https://github.com/erikflowers/weather-icons
**/
export default class Weather extends Component {

  static defaultProps = {
    locationID: process.env.REACT_APP_WEATHER_LOC, //Cape Town (http://openweathermap.org/help/city_list.txt)
    apiKey: process.env.REACT_APP_WEATHER_API,
    url: process.env.REACT_APP_WEATHER_URL
  }

  render() {
    return (
      <div className="Weather">
        <WeatherToday {...this.props}/>
        <div className="Spacer"/>
        <div className="Spacer"/>
        <WeatherForecast {...this.props}/>
      </div>
    );
  }
}
