const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const dotenv = require('dotenv');
dotenv.config()


const app = express()



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