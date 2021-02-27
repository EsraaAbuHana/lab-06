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
server.get('/location', locationHandler);

function locationHandler(req, res) {
    let city = req.query.city;
    let saveValues = [city];
    let SQL = `SELECT * FROM locations WHERE search_query=$1;`;
    client
        .query(SQL, saveValues)
        .then(results => {

            if (results.rows.length > 0) {
                res.json(results.rows[0]);
            } else {

                apicall(city)
                    .then((locData) => {
                        let locationData = new Location(city, locData.display_name, locData.lat, locData.lon);
                        let SQL = `INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4) RETURNING *;`;
                        let safeValues = [locationData.search_query, locationData.formatted_query, locationData.latitude, locationData.longitude];
                        client.query(SQL, safeValues).then((results) => {
                            console.log(results.rows)
                            res.json(results.rows);
                        })
                        //    res.json(data.body[0]);
                    })
            }
        })
}

function apicall(city) {
    let key = process.env.locationKey;
    let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
    return superagent
        .get(url).then((result) => {
        //  console.log('instide api',result.body[0]);
            return result.body[0];
            // res.json(result);
        })
}


function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData.display_name;
    this.latitude = geoData.lat;
    this.longitude = geoData.lon;
}



client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`Listening on PORT ${PORT}`)
    });
})
    .catch((error) => {

        res.send('nicely have an error successfully ', error.message)

    })
