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
const pg=require('pg');
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL
  });
//   ,ssl: { rejectUnauthorized: false },

server.use(cors());
const PORT = process.env.PORT || 3030;

/////////////////////////////////////////////////////////////

server.get('/location', locationHandler);
server.get('/weather', weatherHandler);
server.get('/parks', parkHandler);

////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
function locationHandler(req, res) {
   
        const city = req.query.city;

 let key = process.env.locationKey;
    let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
///
let SQL=`SELECT * FROM locations where search_query = "${city}";`;
client.query(SQL).then(results=>{
//if (results.rows.length===0){bring from api >>>pass the search to scheme}
//else()
if (results.rows.length === 0){
        superagent.get(url).then(locData => {
     
        const locationData = new Location(city,locData.body[0]);
       res.send(locationData);
})
.catch(() => {
    errorHandler(`Error`, req, res);
  });
}else{
    server.get('/addLocation',(req,res)=>{
        let formatted_query=req.query.formatted_query;
        let name=req.query.search_query;
        let latitude=req.query.latitude;
        let longitude=req.query.longitude;
        let SQL=`INSERT INTO locations VALUES($1,$2,$3,$4) RETURNING *;`;
        let safeValues=[formatted_query,name,latitude,longitude];
        client.query(SQL,safeValues).then((results)=>{
            res.send(results.rows);
        
        })
        .catch((error)=>{
            res.send('this is a big biiig ',error.message)
        })
        
        })
}
    
    res.send(results.rows);
})
.catch((error)=>{
    res.send('this is',error.message)
})
/////

}

server.get('location',(req,res)=>{
    let SQL=`SELECT *FROM location;`;
    client.query(SQL).then(results=>{
        res.send(results.rows)
    })
    .catch((error)=>{
        res.send('ther is a line error ',error.message)
    })
})




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

    // const client=new pg.client(process.env.database_url);//1st step local
    client.connect().then(()=>{
server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`)
      });
    })
    .catch((error)=>{

    res.send('error in line 175 ',error.message)

})

/////////////////////////////////////////////////////////////////////////////

