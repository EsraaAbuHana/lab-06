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
    const locData = require('./data/location.json');//bring the data from location.json an assign them as this variable that i creat it .
    console.log(locData);
    // console.log(locData[0]);
    const locObj = new Location(locData);//i will creat a new object based on my data from locData.
    console.log(locObj);
    res.send(locObj);

})


server.get('/weather', (req, res) => {
    let arrOfWeatherObj = [];
    const weatherData = require('./data/weather.json');
    // i want to access the object inside tha array of them inside the weatherData
    weatherData.data.forEach(element => {
        const weatherObj = new Weather(element);
        // console.log(weatherObj.data);
        arrOfWeatherObj.push(weatherObj);
         console.log(arrOfWeatherObj);

    });   

    res.send(arrOfWeatherObj);

})

server.use('*', (req, res) => {
    //put it as the last rout in order not to make a response for any rout you already declared it above.
    let errorObj = {
        status: 500,

        responseText: "Sorry, something went wrong",
    }
    res.status(500).send(errorObj);

})


function Location(geoData) {
    this.search_query = 'Lynnwood';
    this.formatted_query = geoData[0].display_name;//i want to access inside to get my data =>>but its an array from only  one index=>>thats why we pass it as index of [0]=>>to git back the first object.
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;

}

function Weather(weatherData) {
    this.forecast = weatherData.weather.description;
    this.time = weatherData.valid_date;

}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})
