import React from 'react';
import './App.css';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(res => res.data);

/* navbar includes login */
export default function Navbar(props) {
    const handleClick = () => {
        props.login();
    };

    return (
        <nav>
            <div className="left-nav">
                <h1>{props.displayText}</h1>
            </div>
            <WeatherAPIDisplay/>
            <button className="login-btn" onClick={handleClick}>{props.buttonText}</button>
        </nav>
    );
}

function WeatherAPIDisplay(){
    const { data, error, isLoading } = useSWR('http://localhost:5000/weather', fetcher);
    if (error) {
      console.error(error);
    }

    if(isLoading)
        return;

    var weather = JSON.parse(data);
    // console.log(weather)

    var text = 'Temperature at ' + weather['location']['name'] + ", " + weather['location']['region'] + 
               ' is ' + weather['current']['temperature'] + '°C, ' + weather['current']['weather_descriptions'][0]
    return(
        <h2>{text}</h2>
    )
}