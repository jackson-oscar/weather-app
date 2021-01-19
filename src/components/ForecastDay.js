import React from 'react';

const ForecastDay = ({ data }) => {
  return (
    <div className="ui centered card">
      <div className="content">
        <div className="center aligned header">
          <p>{data.weekDay}</p>
          <img className="ui tiny image" src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`} />
        </div>
      </div>
      <div className="extra content">
        <div className="center aligned description">
          <p>H:{data.high} L:{data.low}</p>
          <p>{data.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ForecastDay;