import axios from 'axios';
import { useState, useEffect } from 'react';

const useWeather = (defaultZipCode) => {
  const [weather, setWeather] = useState([]);

  const apiKey = process.env.REACT_APP_OPEN_WEATHER_API_KEY;
  const dayURL = 'http://api.openweathermap.org/data/2.5/weather?';
  const forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?';

  useEffect(() => {
    search(defaultZipCode);
  }, [defaultZipCode]);

  const search = async (zipCode) => {
    if (!isValidZipCode(zipCode)) {
      alert("Please enter valid 5-digit ZIP Code");
      return;
    }

    try {
      const dayWeatherGet = axios.get(dayURL, {
        params: {
          q: zipCode + ",us",
          APPID: apiKey,
          units: 'imperial'
        }
      });

      const forecastWeatherGet =  axios.get(forecastURL, {
        params: {
          q: zipCode + ",us",
          APPID: apiKey,
          units: 'imperial'
        }
      });

      const [day, forecast] = await Promise.all([dayWeatherGet, forecastWeatherGet]);
      setWeather([
        {
          city: day.data.name,
          temp: Math.round(day.data.main.temp),
          high: Math.round(day.data.main.temp_max),
          low: Math.round(day.data.main.temp_min),
          description: day.data.weather[0].description,
          icon: day.data.weather[0].icon
        },

        forecastHighLow(forecast.data.list)
      ]);
    } catch (err) {
      console.warn(err);
      alert("Oops! Looks like there was an error retrieving that ZIP Code!");
    }
  };

  return [weather, search];
};

const forecastHighLow = (forecast) => {
  let renderedForecast = [];
  let recordedDate = '';
  let day = {};
  let weatherDescription = '';
  let weatherIcon = '';

  // Filter out same day data
  const weekForecast = forecast.filter(getWeekForecast);
  let forecastLength = weekForecast.length;

  // Initialize high and low for first day in forecast
  let tempDate = weekForecast[0].dt_txt,
    tempLow = weekForecast[0].main.temp,
    tempHigh = weekForecast[0].main.temp;

  for (let i = 1; i < forecastLength - 1; i++) {
    day = weekForecast[i];

    // Check if day is the same as previous
    if (isSameDay(day.dt_txt, tempDate)) {
      recordedDate = day.dt;

      if (day.main.temp > tempHigh) {
        tempHigh = day.main.temp;
      }

      if (day.main.temp < tempLow) {
        tempLow = day.main.temp;
      }

      // Get icon and description at noon dt_txt == xxxx-xx-xx 12:00:00
      // weatherIcon is changed to day time icon
      if (isNoon(day.dt_txt)) {
        weatherDescription = day.weather[0].description;
        weatherIcon = day.weather[0].icon.substring(0, 2) + "d";
      }
    } else {
      /* 
      *  If different day then push previous day info to renderedForecast[]
      *  Also pushes last day
      */
      renderedForecast.push({
        weekDay: getWeekDay(recordedDate),
        high: Math.round(tempHigh),
        low: Math.round(tempLow),
        description: weatherDescription,
        icon: weatherIcon,
        dt: recordedDate
      });

      tempDate = day.dt_txt;
      tempHigh = day.main.temp;
      tempLow = day.main.temp;
    }

  };

  /**
     * API can give different number of days of data back
     * Last Day needs to be pushed manually at different times
     * Only when list is less than 5
     */
  if (renderedForecast.length < 5) {
    renderedForecast.push({
      weekDay: getWeekDay(recordedDate),
      high: Math.round(tempHigh),
      low: Math.round(tempLow),
      description: weatherDescription,
      icon: weatherIcon,
      dt: recordedDate
    });
  }

  return renderedForecast;
};

/* 
*  Returns if day is the same
*  Checks date only not time
*/
const isSameDay = (current, previous) => {
  if (current.indexOf(previous.substring(0, 11)) !== -1) {
    return true;
  }
  return false;
};

/**
 * Returns forecast without current day data 
 */
const getWeekForecast = (day) => {
  const today = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + "";
  return !isSameDay(day.dt_txt, today);
};

/**
 * Returns true if the dates time is at noon
 */
const isNoon = (date) => {
  const noon = "12"

  if (date.substring(11, 14).indexOf(noon) !== -1) {
    return true
  }
  return false
};

/**
 * Returns if valid zipcode
 */
const isValidZipCode = (zipCode) => {
  return /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(zipCode);
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