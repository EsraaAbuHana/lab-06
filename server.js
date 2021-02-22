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


server.get('/weather', (req, res) => {
    // let =[];
    const weatherData = require('./data/weather.json');
 // console.log(weatherData);
    // console.log(weatherData[0].data);
    // let weatherObj = Object.keys(weatherData.data);

  let aarOfWeatherObj = weatherData.data.map( function(val){
        let weatherObj = new Weather(weatherData);

 return weatherObj ;
   
});
    res.send(aarOfWeatherObj);

    
})

    // weatherObj.forEach(element => {

    //     const weatherObj = new Weather(weatherData);
    //     // console.log(weatherObj.data);
    //     weatherObj.push(this);
    //     // element.forEach(prop => {

    //     // Object.entries(weatherObj.data).forEach(element => {
    //     //     console.log(element);
    //     //   });
    //   

    // });

    // console.log(weatherData);

// })

server.use('*',(req,res)=>{
    let errorObj={status: 500,

        responseText: "Sorry, something went wrong",}
    res.status(500).send(errorObj)

    // {
    //     
    //     ...
    //   }
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


function Weather(weatherData) {
    this.forecast = weatherData.description;
    this.time = Date(weatherData.datetime).toString().slice(0,15);
  
}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})
//weather
//https://api.weatherbit.io/v2.0/history/daily?postal_code=27601&country=US&start_date=2021-02-18&end_date=2021-02-19&key=API_KEY
//(weather by city name) &city=Raleigh,NC&start_date=2021-02-18&end_date=2021-02-19
//Park
//https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=SZcUUGdtmXRqUb5BNLV6gQa6TIvkVF0mLVsdFmWd
//location
//GET https://us1.locationiq.com/v1/search.php?key=YOUR_ACCESS_TOKEN&q=SEARCH_STRING&format=json
