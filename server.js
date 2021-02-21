
'use strict';
const express = require ('express');
const server =express();
const PORT=process.env.PORT || 3030;
require('dotenv').config();

const cors = require('cors');

server.use(cors());

server.get('/test',(req,res)=>{
    res.send('your server is working fine!!')
})


server.listen(PORT, ()=>{
    console.log(`Listening on PORT ${PORT}`);
})