'use strict';
require('dotenv').config();

const express = require('express');
const server = express();
const PORT = process.env.PORT || 3030;
const cors = require('cors');
const superagent = require('superagent');
server.use(cors());
//weather
//https://api.weatherbit.io/v2.0/history/daily?&city=Raleigh,NC&start_date=2021-02-18&end_date=2021-02-19&key=API_KEY

//or
//https://api.weatherbit.io/v2.0/history/daily?postal_code=27601&country=US&start_date=2021-02-18&end_date=2021-02-19&key=API_KEY
//(weather by city name) &city=Raleigh,NC&start_date=2021-02-18&end_date=2021-02-19
//Park
//https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=SZcUUGdtmXRqUb5BNLV6gQa6TIvkVF0mLVsdFmWd
//location
//https://us1.locationiq.com/v1/search.php?key=YOUR_ACCESS_TOKEN&q=SEARCH_STRING&format=json

//why that :3 packages are looking for funding
// run `npm fund` for details

/////////////////////////////////////////////////////////////

server.get('/location', locationHandler);
server.get('/weather', weatherHandler);
server.get('/parks', parkHandler);
server.get('/',homeRouteHandler);
server.use('*', errorHandler);
function errorHandler(req, res) {
    let errorObj = {
        status: 500,
        responseText: "Sorry, something went wrong",
    }
    res.status(500).send(errorObj);
}

////////////////////////////////////////////////////////////
function homeRouteHandler(req, res)  {
    res.send('your server is working fine!!')
}


function locationHandler(req, res) {
    const cityName = req.query.city;
    /////
    let key=process.env.locationKey;
    let url=`https://us1.locationiq.com/v1/search.php?key=${key}&q=${cityName}&format=json`;
    superagent.get(url).then(locData=>{
        // console.log(locData);
        const locationData = new Location(cityName,locData.body[0]);
        res.send(locationData);

    })
    // const locData = require('./data/location.json');
    // console.log(locData);
    // // console.log(locData[0]);
    // const locObj = new Location(locData);
    // console.log(locObj);
    // res.send(locObj);
    // getLocation(city).then(locationData=>{
    //     res.status(200).json(locationData);

    // })
    
}
function weatherHandler(req, res) {
    const city = req.query.city;
    
    getWeather(city).then(weatherData => {
        res.status(200).json(weatherData);
    })
}

function parkHandler(req, res) {
    const city = req.query.city;
    
    getPark(name).then(parkData => {
        res.status(200).json(parkData);
    })
}
//////////////////////////////////////////////////////////////
function getLocation(city) {
    let key = process.env.locationKey;
    let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    return superagent.get(url).then(locData => {
        //error {"error":"Invalid key"}
        // const  = require('./data/location.json');
        // const locationData = new Location(locData);
        return locationData;
    })
}

// const arrOfDays_Weather = [];
function getWeather(city) {
    let key = process.env.WeatherKey;
    let url = `https://api.weatherbit.io/v2.0/history/daily?&city=${city_name},NC&start_date=2021-02-18&end_date=2021-02-19&key=${key}`;
    return superagent.get(url).then(weatherDayData => {

        const weatherData = new Weather(weatherDayData);
        return weatherData;
    });
}

function getPark(city) {
    let key = process.env.parkKey;
    let url = `us1.locationiq.com/v1/search.php?key=${name}&q=${key}&format=json`;
    return superagent.get(url).then(parkDayData => {

        const parkData = new Park(parkDayData);
        return parkData;
    });
}

/////////////////////////////////////////////////////////////

function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData.display_name;
    this.latitude = geoData.lat;
    this.longitude = geoData.lon;

}


// function Weather(weatherData) {
//     this.forecast = weatherData.weather.description;
//     this.time = weatherData.valid_date;

// }
function Weather(city_name, temp, datetime) {
    this.city_name = city_name;
    this.temp = day.data.temp;
    this.datetime = new Date(data.datetime).toString().slice(0, 15);

}
function Park(name) {
    this.name = full_name;
    this.description = data.description;
    this.parkUrl = data.url;
    this.directionsUrl = data.directionsUrl;
    this.fee = data.fees;

}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});

// server.get('/weather', (req, res) => {
//     // let =[];
//     const weatherData = require('./data/weather.json');
//  // console.log(weatherData);
//     // console.log(weatherData[0].data);
//     // let weatherObj = Object.keys(weatherData.data);

//   let aarOfWeatherObj = weatherData.data.map( function(val){
//         let weatherObj = new Weather(weatherData);

//  return weatherObj ;

// });
//     res.send(aarOfWeatherObj);


// server.get('/location', (req, res) => {
//     const locData = require('./data/location.json');
//     // console.log(locData);
//     // console.log(locData[0]);
//     const locObj = new Location(locData);
//     // console.log(locObj);
//     res.send(locObj);

// server.use('*', (req, res) => {
//     let errorObj = {
//         status: 500,

//         responseText: "Sorry, something went wrong",
//     }
//     res.status(500).send(errorObj)

// })
//     const geoData = require('./data/weather.json');

//     geoData.data.map(function (val) {
//         let weatherObj = new Weather(val);

//         return arrOfDays_Weather;

//     });
//     res.send(arrOfDays_Weather);

// }

