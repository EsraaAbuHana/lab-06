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
    

  let aarOfWeatherObj = weatherData.data.map( function(val){
        let weatherObj = new Weather(weatherData);

 return weatherObj ;
   
});
    res.send(aarOfWeatherObj);

    
})

   

server.use('*',(req,res)=>{
    let errorObj={status: 500,

        responseText: "Sorry, something went wrong",}
    res.status(500).send(errorObj)

   
})


function Location(geoData) {
    this.search_query = 'Lynnwood';
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
  
}



function Weather(weatherData) {
    this.forecast = weatherData.description;
    this.time = Date(weatherData.datetime).toString().slice(0,15);
  
}

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
})
