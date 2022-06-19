// load express library
const express = require('express');
//const {v4: uuid} = require('uuid');

// create the app
const app = express();

// define the port where client files will be provided
const port = process.env.PORT || 3000;
// start to listen to that port
const server = app.listen(port);

// provide static access to the files
// in the "public" folder
app.use(express.static('public'));