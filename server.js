'use strict';

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
const express = require('express');//7
const server = express();//13 app=server
const PORT = process.env.PORT || 3030;//12
require('dotenv').config();//4
const cors = require('cors');//8
const superagent = require('superagent');//9


server.use(cors());//14
//16-18 home page


server.get('/location', locationHandler);//21
server.get('/weather', weatherHandler);//22


function locationHandler(req, res) {//27-38
    const city = req.query.city;
    //
    getLocation(city).then(locationData => {
        res.status(200).json(locationData);
    })

}
function weatherHandler(req, res) {//67-71
    const city = req.query.city;
    
    getWeather(city).then(weatherData => {
        res.status(200).json(weatherData);
    })
}
function getLocation(city) {//39-58
    let key = process.env.locationKey;
    let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    return superagent.get(url).then(locData => {
        //error {"error":"Invalid key"}
        // const  = require('./data/location.json');
        const locationData = new Location(locData);
        return locationData;
    })

}

const arrOfDays_Weather = [];//74
function getWeather(city) {//75-82
    let key = process.env.WeatherKey;
    let url = `https://api.weatherbit.io/v2.0/history/daily?&city=${city_name},NC&start_date=2021-02-18&end_date=2021-02-19&key=${key}`;
    return superagent.get(url).then(weatherDayData => {
        
        const weatherData = new Location(weatherDayData);
        return weatherData;
    });
}
///////////////////////////////////////////

function Location(city, geoData) {//60-65
    this.search_query = city;
    this.formatted_query = geoData.display_name;
    this.latitude = geoData.lat;
    this.longitude = geoData.lon;

}
function Weather(city_name,temp,datetime) {//85-89
    this.city_name = city_name;
    this.temp = day.data.temp;
    this.datetime = new Date(data.datetime).toString().slice(0, 15);

}

server.listen(PORT, () => {//92
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

// server.get('/test', (req, res) => {
//     res.send('your server is working fine!!')
// })

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






