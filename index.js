const express = require('express');

require('dotenv').config();
const app=express();
let port = process.env.PORT;
if(!port){
  port=3000;
}
const connectdb=require('./db/connection')
// Middleware to parse JSON bodies
app.use(express.json());


connectdb();
// Import the router
const entryticketroute = require('./routes/entryticketroute');
const showticketroute = require('./routes/showticketroute');


// Use the router
app.use('/entry', entryticketroute);
app.use('/show',showticketroute );


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

