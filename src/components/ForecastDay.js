import React from 'react';

const ForecastDay = ({ data }) => {
  return (
    <div className="ui centered card">
      <div className="content">
        <div className="center aligned header">
          <p>{data.weekDay}</p>
          <img 
            className="ui tiny image"
            alt="Weather Icon"
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          />
        </div>
      </div>
      <div className="extra content">
        <div className="center aligned description">
          <p><b>H:</b>{data.high} <b>L:</b>{data.low}</p>
          <p style={{textTransform: "capitalize"}}>{data.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ForecastDay;