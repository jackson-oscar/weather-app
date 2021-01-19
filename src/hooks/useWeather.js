import { useState, useEffect } from 'react';
import axios from 'axios';

const OW_API_KEY = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
const PS_API_KEY = process.env.REACT_APP_POSITION_STACK_API_KEY;
const coordinatesURL = 'http://api.positionstack.com/v1/forward?';
const forecastURL = 'http://api.openweathermap.org/data/2.5/onecall?';

const useWeather = (defaultQuery) => {
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    search(defaultQuery);
  }, [defaultQuery]);

  const search = async (query) => {
    try { // try1
      const response = await axios.get(coordinatesURL, {
        params: {
          access_key: PS_API_KEY,
          query: `${query},wa`,
          country: "us"
        }
      });

      /**
       * Displays error message when nothing is found
       * Nothing found gives back empty array or empty array of arrays
       * Random queries still give results
       */
      if (response.data.data.length > 0 || response.data.data[0].length > 0) {
        try { // try2
          const forecastWeatherGet = await axios.get(forecastURL, {
            params: {
              lat: response.data.data[0].latitude,
              lon: response.data.data[0].longitude,
              exclude: "minutely,hourly",
              APPID: OW_API_KEY,
              units: 'imperial'
            }
          });

          const currentWeather = forecastWeatherGet.data.current;
          const forecastWeather = forecastWeatherGet.data.daily;
          const cityLabel = response.data.data[0].locality ? response.data.data[0].locality : response.data.data[0].label;
          
          setWeather([
            {
              city: cityLabel,
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
        }
      } else {
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
  for(let i = 1; i <= 5; i++){
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