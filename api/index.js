require('dotenv/config');
const cors =require('cors');
const express =require('express');
const mongoose = require('mongoose');
const { usersRoute, competitionsRoute, playersRoute, predictionsRoute } =require('./routes/index.js')

const app =express();

// request handler middleware
app.use(cors())
app.use(express.json({limit: '30mb'}));
app.use(express.urlencoded({extended: true, limit: '30mb'}));

// constants
const DB_URI =process.env.DB_URI;
const PORT =process.env.PORT || 5000;
const HOST =process.env.HOST || 'localhost';

// endpoints
app.use('/users', usersRoute);
app.use('/players', playersRoute);
app.use('/predictions', predictionsRoute);
app.use('/competitions', competitionsRoute);

// listen
app.listen(PORT, HOST, async () =>{
    try {
        await mongoose.connect(DB_URI);
        console.log(`[+] Listening on ${HOST}:${PORT}`);
    } catch ({message}) {
        console.log(`[-] Error: ${message}`);
    }
})