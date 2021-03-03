'use strict';
require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
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
server.get('/movies', movieHandler);
server.get('/*', errorHandler);
//////////////////////////////////////////////////////////////
function yelpHandler(req, res) {

    let city = req.query.search_query;
    const page = req.query.page;
    const key = process.env.YelpKey;
    let limit = 5;
    const offset = (page - 1) * limit + 1;
    const url = `https://api.yelp.com/v3/businesses/search?location=${city}&limit=${limit}&offset=${offset}`;

    superagent.get(url).set("Authorization", `Bearer ${key}`)
        .then(yelpData => {
            let yelpArr = yelpData.body.businesses.map(value => {
                return new Yelp(value);
            })
            // console.log(yelpArr);
            res.send(yelpArr);
        }).catch(() => {
            errorHandler(`Error:!!`, req, res);
        })
}

function movieHandler(req, res) {
    let city = req.query.search_query;
    const key = process.env.MovieKey;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${city}`;

    superagent.get(url).then(movieData => {
        // console.log(movieData.body);
        let movieArr = movieData.body.results.map(value => {
            return new Movie(value);
        })
        // console.log(movieArr);
        res.send(movieArr);
    }).catch(() => {
        errorHandler(`Error:!!`, req, res);
    })


}

////////////////////////////////////////////////////////////////////////
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
    let ArrOfWeatherDays = [];
    const city = req.query.search_query;
    const key = process.env.WeatherKey;
    let url = `https://api.weatherbit.io/v2.0/history/daily?&city=${city}&key=${key}`;

    superagent.get(url).then(weatherData => {
        ArrOfWeatherDays = weatherData.body.data.map(element => {
            return new Weather(element);
        })
        // console.log(ArrOfWeatherDays);
        res.send(ArrOfWeatherDays);
    }).catch(() => {
        errorHandler(`Error:!!`, req, res);
    })


}
// let ArrOfParks = [];
function parkHandler(req, res) {
    let key = process.env.parkKey;
    ParkString = req.query.latitude + ',' + req.query.longitude;
    let url = `https://developer.nps.gov/api/v1/parks?parkCode=${ParkString}&limit=3&api_key=${key}`;

    // const city = req.query.city;

    superagent.get(url).then(parkDayData => {

        const ArrOfParks = parkDayData.body.data.map(element => {
            const parkObj = new Park(element);
            return parkObj;
        });
        res.send(ArrOfParks);
    }).catch(() => {
        errorHandler(`Error:!!`, req, res);
    })

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
/////////////////////////////////////////////////////////////////
function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData.display_name || geoData.formatted_query;
    this.latitude = geoData.lat || geoData.latitude;
    this.longitude = geoData.lon || geoData.longitude;
}
function Weather(weatherData) {
    this.forecast = weatherData.weather.description;
    this.dateTime = new Date(weatherData.valid_date).toString().slice(0, 15);
}
function Park(parkData) {
    this.name = parkData.fullName;
    this.description = parkData.description;
    this.parkUrl = parkData.url;
    this.address = `"${parkData.addresses[0].line1}" "${parkData.addresses[0].city}" "${parkData.addresses[0].stateCode}" "${parkData.addresses[0].postalCode}"`;
    this.fee = parkData.entranceFees[0].cost;
}
function Yelp(yelpData) {

    this.url = yelpData.url;
    this.name = yelpData.name;
    this.price = yelpData.price;
    this.rating = yelpData.rating;
    this.image_url = yelpData.image_url;



}
function Movie(movieData) {

    this.title = movieData.title;
    this.overview = movieData.overview;
    this.popularity = movieData.popularity;
    this.total_votes = movieData.total_votes;
    this.image_url = `https://image.tmdb.org/t/p/w500/${movieData.poster_path}`;
    this.released_on = movieData.released_on;
    this.average_votes = movieData.average_votes;


}


/////////////////////////////////////////////////////////////////
client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`Listening on PORT ${PORT}`)
    });
})
    .catch(() => {
        errorHandler(`Error:!!`, req, res);
    })


