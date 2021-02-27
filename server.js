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
require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const { query } = require('express');
const client = new pg.Client({
    connectionString: process.env.database_url
});
//   ,ssl: { rejectUnauthorized: false }, //herocu

server.use(cors());
const PORT = process.env.PORT || 3030;
/////////////////////////////////////////////////////////////
server.get('/weather', weatherHandler);
server.get('/parks', parkHandler);
////////////////////////////////////////////////////////////
// server.get(url, locationHandler);
server.get('/location', locationHandler);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function locationHandler(req, res) {
//     let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
//     const values = [req.query.database_url];
//     // const city = req.query.city;
//     client.query(query, values).then(results => {
// //pass it or add it ......database 
//         if (results.rows.length === 0) {
//             superagent.get(url).then(locData => {
//                 const locationData = new Location(req.query.database_url, locData.body.results[0].formatted_query, locData.body.results[0].latitude, locData.body.results[0].longitude);
//                 const query = `SELECT * FROM locations where search_query = "${city}";`;
//                 let values = Object.values(values);

//                 res.send(locationData);
//             })
//                 .catch(() => {
//                     errorHandler(`Error`, req, res);
//                 });
//         }
//         res.send(results.rows);
//     })
//         .catch((error) => {
//             res.send('this is error', error.message)
//         })
// }
/////// 
// const city = req.query.city;

server.get('/location', locationHandler);
//pass it or add it ......database 
function locationHandler(req, res) {
    //  const values = [req.query.database_url];
    let city = req.query.city;


    client.query(query, values).then(results => {

        if (location.rows.length === 0 || city !== req.query.city) {
            let key = process.env.locationKey;
            let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
            superagent.get(url, (req, res) => {
                let SQL = `INSERT INTO location (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4);`;
                let locationData = new Location(req.query.database_url, locData.body.results[0].formatted_query, locData.body.results[0].latitude, locData.body.results[0].longitude);

                client.query(SQL, locationData).then((results) => {
                    res.send(results.rows);
                })
                    .catch((error) => {
                        res.send('this is add to schema error ', error.message)
                    })
            })
        } else {
            if (city === req.query.city) {
                const SQL = `SELECT * FROM locations where search_query = "${city}";`;
                client.query(SQL).then(results => {
                    res.send(results.rows);
                })
                    .catch((error) => {
                        res.send('get from schema error', error.message)
                    })
                //   }else{ }  
            }
        }
        res.send(results.rows);
    })
}
///////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData.display_name;
    this.latitude = geoData.lat;
    this.longitude = geoData.lon;
}
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`Listening on PORT ${PORT}`)
    });
})
    .catch((error) => {

        res.send('nicely have an error successfully ', error.message)

    })

/////error:jquery.min.js:4 GET http://localhost:3000/location?city=amman 500 (Internal Server Error)
// send @ jquery.min.js:4
// ajax @ jquery.min.js:4
// fetchCityData @ app.js:73
// dispatch @ jquery.min.js:3
// q.handle @ jquery.min.js:3
