import React from 'react';
import CurrentDay from './CurrentDay';
import ForecastDay from './ForecastDay';
import SearchBar from './SearchBar';
import useWeather from '../hooks/useWeather';

const App = () => {
  const [weather, search] = useWeather('Seattle');

  return (
    <div>
      <br />
      <div className="ui center aligned container fluid" >
        <SearchBar onSearch={search} />
        <div className="ui divider fluid"></div>
        {/* Waits for fetch before rendering */}
        {(typeof weather[0] != "undefined") ?
          (<div>
            <CurrentDay data={weather[0]} units={"F"} />
            <br />
            <div className="ui stackable centered grid container">
              <div className="five column row">
                {weather[1].map((day) => {
                  return (
                    <div className="column" key={day.weekDay}>
                      <ForecastDay data={day} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          ) : (
            <div>
              <div className="ui active centered inline massive loader"></div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default App;