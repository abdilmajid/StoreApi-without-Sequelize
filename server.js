const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
// const morgan = require('morgan');
const pg = require('pg');


const app = express()



//Allows you to set eviroment variable
// require('dotenv').config()

// Morgan logs server requests in the terminal
// app.use(morgan('short'))


//Connect Express Server to Postgress
// *JUST CHANGE DATABASE everything else same
const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
}
// Query postgress using pool
const pool = new pg.Pool(config);

// localhost../..html is served from public folder
app.use(express.static('./public'));
// Extended true ->is a nested  
// Extended False ->not nested object
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());


//importing routes from different file
const router = require('./routes')
app.use(router)





app.listen(process.env.PORT || 4001, ()=> {
  console.log(`app is running on port ${process.env.PORT}`);
})