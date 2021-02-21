'use strict';
const express = require('express');
const server = express();
const PORT = process.env.PORT || 3030;
require('dotenv').config();

const cors = require('cors');

server.use(cors());

server.get('/test', (req, res) => {
    res.send('your server is working fine!!')
})

server.get('/location', (req, res) => {
    const locData = require('./data/location.json');
    // console.log(locData);
    // console.log(locData[0]);
    const locObj = new Location(locData);
    // console.log(locObj);
    res.send(locObj);

})
function Location(geoData) {
    this.search_query = 'Lynnwood';
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
    // {
    //     "search_query": "seattle",
    //     "formatted_query": "Seattle, WA, USA",
    //     "latitude": "47.606210",
    //     "longitude": "-122.332071"
    //   }
}
// let arrOfObjs=[];

server.get('/weather', (req, res) => {
    const weatherData = require('./data/weather.json');
    // console.log(weatherData);
    // console.log(weatherData[0].data);
    let arrOfWeatherData = Object.keys(weatherData.data);
    arrOfWeatherData.forEach(element => {

        const weatherObj = new Weather(weatherData);
        // console.log(weatherObj.data);
        arrOfWeatherData.push(this);

    });
    res.send(arrOfWeatherData);
            console.log(arrOfWeatherData);


})
function Weather(weatherData) {
    this.forecast = weatherData.data.description;
    this.time = weatherData.data.valid_date;
    // arrOfObjs.push();
    // [{
    //     "forecast": "Partly cloudy until afternoon.",
    //     "time": "Mon Jan 01 2001"
    //   },
    //]
}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})