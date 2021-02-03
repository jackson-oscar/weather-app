import React from 'react';

const CurrentDay = ({ data, units }) => {
  return (
    <div>
      <h1 className="ui header">
        {data.city}
        <br />
        {data.temp}&deg;{units}
        <br />
        <img
          className="ui massive image"
          alt="Weather Icon"
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
        />
        <div className="sub header">
          <span style={{textTransform: "capitalize"}}>{data.description}</span>
          <br />
          <b>H:</b>{data.high} <b>L:</b>{data.low}
        </div>
      </h1>
    </div>
  );
};

export default CurrentDay;