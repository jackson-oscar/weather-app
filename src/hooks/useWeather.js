import { useState, useEffect } from 'react';
import axios from 'axios';

const OW_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const GC_API_KEY = process.env.REACT_APP_GEOCODIO_API_KEY;

const useWeather = (defaultQuery) => {
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    search(defaultQuery);
  }, [defaultQuery]);

  const search = async (query) => {
    try { // try1
      const geocodeResponse = await axios.get('https://api.geocod.io/v1.6/geocode?', {
        params: {
          api_key: GC_API_KEY,
          q: query,
          limit: 1
        }
      });
      console.log(geocodeResponse);

      try { // try2
        const forecastWeatherGet = await axios.get('https://api.openweathermap.org/data/2.5/onecall?', {
          params: {
            appid: OW_API_KEY,
            lat: geocodeResponse.data.results[0].location.lat,
            lon: geocodeResponse.data.results[0].location.lng,
            exclude: "minutely,hourly",
            units: 'imperial'
          }
        });

        const currentWeather = forecastWeatherGet.data.current;
        const forecastWeather = forecastWeatherGet.data.daily;

        setWeather([
          {
            city: `${geocodeResponse.data.results[0].address_components.city}, ${geocodeResponse.data.results[0].address_components.state}`,
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

export default useWeather;