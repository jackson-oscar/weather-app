import { useState, useEffect } from 'react';
import axios from 'axios';

const OW_API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
const MB_API_KEY = 'pk.eyJ1Ijoib2pkZXZlbG9wZXIiLCJhIjoiY2trM3NhM2dnMWUwczJ2cDVjeDhmbHFreSJ9.Wl7xYBoighmtAkoC_IOYyg';

const useWeather = (defaultQuery) => {
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    search(defaultQuery);
  }, [defaultQuery]);

  const search = async (query) => {
    try { // try1
      const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MB_API_KEY}`, {
        params: {
          types: "postcode,place",
          worldview: "us",
          autocomplete: "false"
        }
      });

      try { // try2
        const forecastWeatherGet = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?&appid=${OW_API_KEY}`, {
          params: {
            lat: response.data.features[0].center[1],
            lon: response.data.features[0].center[0],
            exclude: "minutely,hourly",
            units: 'imperial'
          }
        });

        const currentWeather = forecastWeatherGet.data.current;
        const forecastWeather = forecastWeatherGet.data.daily;

        setWeather([
          {
            city: getCityName(response.data.features[0].place_name),
            temp: Math.round(currentWeather.temp),
            high: Math.round(forecastWeather[0].temp.max),
            low: Math.round(forecastWeather[0].temp.min),
            description: currentWeather.weather[0].description,
            icon: currentWeather.weather[0].icon
          },

          getFiveDayForecast(forecastWeather)
        ]);
      } catch (err) { // catch for try2
        console.log(err);
        alert("Oops! Looks like the ZIP Code entered was not found!");
      }

    } catch (err) { // catch for try1
      console.log(err);
      alert("Oops! Looks like the ZIP Code entered was not found!");
    };
  };

  return [weather, search];
};

/**
 * Returns five day forecast 
 */
const getFiveDayForecast = (data) => {
  const renderedData = [];

  // i = 1 skips current day
  for (let i = 1; i <= 5; i++) {
    renderedData.push(
      {
        weekDay: getWeekDay(data[i].dt),
        high: Math.round(data[i].temp.max),
        low: Math.round(data[i].temp.min),
        description: data[i].weather[0].description,
        icon: data[i].weather[0].icon,
        dt: data[i].dt
      }
    );
  };

  return renderedData;
};

/**
 * Returns the week day
 */
const getWeekDay = (date) => {
  // Get name of the day of the week
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let dayNum = new Date(date * 1000).getDay();
  return weekDays[dayNum];
};

/**
 * Returns only city name from string given from mapbox
 */
const getCityName = (str) => {
  return str.substr(0, str.indexOf(','));
};

export default useWeather;