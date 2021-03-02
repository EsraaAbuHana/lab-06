'use strict';

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

server.use(cors());
const PORT = process.env.PORT || 3030;

/////////////////////////////////////////////////////////////
server.get('/location', locationHandler);
server.get('/weather', weatherHandler);
server.get('/parks', parkHandler);
server.get('/yelp', yelpHandler);
server.get('/movie', movieHandler);
server.get('/*', errorHandler);

function yelpHandler(params) {
    
}
function movieHandler(params) {
    
}

////////////////////////////////////////////////////////////
function locationHandler(req, res) {

    let city = req.query.city;
    let SQL = `SELECT * FROM locations WHERE search_query='${city}';`;

    let key = process.env.locationKey;
    let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

    client
        .query(SQL)
        .then(results => {

            if (results.rows.length === 0) {
                superagent.get(url).then((locData) => {

                    const locObj = new Location(city, locData.body[0]);

                    const insertQuery = `INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4) RETURNING *;`;

                    let saveValues = [city, locObj.formatted_query, locObj.latitude, locObj.longitude];
                    client.query(insertQuery, saveValues).then((getLocation) => {
                        res.json(getLocation.rows[0]);
                    }).catch(() => { 
                        errorHandler(`Error:!!`, req, res);
                      })
                }).catch(() => { 
                    errorHandler(`Error:!!`, req, res);
                  })
            }
            else if (result.rows[0].search_query === city) {
                const getObject = new Location(result.rows[0].search_query, result.rows[0]);
                res.json(getObject);
            }


        }).catch(() => { 
            errorHandler(`Error:!!`, req, res);
          })
}



function weatherHandler(req, res) {
    let ArrOfWeatherDays=[];
    const city = req.query.search_query;
    let key = process.env.WeatherKey;
    let url = `https://api.weatherbit.io/v2.0/history/daily?&city=${city_name}&key=${key}`;

superagent.get(url).then(weatherData=>{
    ArrOfWeatherDays=weatherData.body.data.map(element=>{
        return new Weather(element);
    })
}).catch(() => { 
    errorHandler(`Error:!!`, req, res);
  })


}
let ArrOfParks=[];
function parkHandler(req, res) {
    ParkCode=req.query.latitude+','+query.longitude;
    // const city = req.query.city;
    let key = process.env.parkKey;
    let url = `https://developer.nps.gov/api/v1/parks?parkCode=${ParkCode}&limit=3&api_key=${key}`;
     superagent.get(url).then(parkDayData => {

        ArrOfParks=parkDayData.body.data.map(element=>{
        parkObj = new Park(parkDayData);
        return parkObj;
    });
    res.send(ArrOfParks);
    }).catch(() => { 
        errorHandler(`Error:!!`, req, res);
      })
    // getPark(name).then(parkData => {
    //     res.status(200).json(parkData);
    // })
}
function errorHandler(error) {
    server.use("*", (req, res) => {
      res.status(500).send(error);
    })
  }
// function getWeather(city) {
//     // let key = process.env.WeatherKey;
//     // let url = `https://api.weatherbit.io/v2.0/history/daily?&city=${city_name},NC&start_date=2021-02-18&end_date=2021-02-19&key=${key}`;
//     return superagent.get(url).then(weatherDayData => {
//         const weatherData = new Weather(weatherDayData);
//         return weatherData;
//     });
// }
// function getPark(city) {
   
// }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Location(city, geoData) {
    this.search_query = city  ;
    this.formatted_query = geoData.display_name ||geoData.formatted_query ;
    this.latitude = geoData.lat ||geoData.latitude ;
    this.longitude = geoData.lon || geoData.longitude;
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
function Yelp(yelpData) {
    // https://`<partner_domain_path>/<partner_business_id>/?opportunity_token=<opportunity_token>`&yelp_site=m&yelp_locale=en_US
    this.url = yelpData.url;
  this.name = yelpData.name;
  this.price = yelpData.price;
  this.rating = yelpData.rating;
  this.image_url = yelpData.image_url;
 
    
      
}
function Movie(movieData)
{
    
    // https://api.themoviedb.org/3/search/movie?api_key=<<api_key>>&query=whiplash&language=de-DE&region=DE
    this.title = movieData.title;
    this.overview = movieData.overview;
    this.popularity = movieData.popularity;
    this.total_votes = movieData.total_votes;
    this.image_url = `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`;
    this.released_on = movieData.released_on;
    this.average_votes = movieData.average_votes;
  
  
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`Listening on PORT ${PORT}`)
    });
})
.catch(() => { 
    errorHandler(`Error:!!`, req, res);
  })

/////error:jquery.min.js:4 GET http://localhost:3000/location?city=amman 500 (Internal Server Error)
// send @ jquery.min.js:4
// ajax @ jquery.min.js:4
// fetchCityData @ app.js:73
// dispatch @ jquery.min.js:3
// q.handle @ jquery.min.js:3

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
// function locationHandler(req, res) {
//     let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
