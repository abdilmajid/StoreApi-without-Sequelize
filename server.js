
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const morgan = require('morgan');
const pg = require('pg');


const app = express()



//Allows you to set eviroment variable
require('dotenv').config()

// Morgan logs server requests in the terminal
app.use(morgan('short'))


//Connect Express Server to Postgress
// *JUST CHANGE DATABASE everything else same
const config = {
  user: 'postgres',
  database: 'test2',
  password: 123456,
  port: 5432,
}
// Query postgress using pool
const pool = new pg.Pool(config);

// localhost../..html is served from public folder
app.use(express.static('./public'));
// Extended true ->is a nested  
// Extended False ->not nested object
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());


//importing routes from different file
const router = require('./routes')
app.use(router)


const port = process.env.PORT || 6003


app.listen(port, () => {
  console.log(`App Running on port ${process.env.PORT}`)
});