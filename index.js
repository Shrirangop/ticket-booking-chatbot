const express = require('express');
const cors=require("cors");
require('dotenv').config();
const app=express();
let port = process.env.PORT;
if(!port){
  port=3000;
}
const connectdb=require('./db/connection')
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

connectdb();
// Import the router
const entryticketroute = require('./routes/entryticketroute');
const showticketroute = require('./routes/showticketroute');
const paymentroute = require('./routes/paymentroute');
const userroute = require("./routes/userroute");


// Use the router
app.use('/entry', entryticketroute);
app.use('/show',showticketroute );
app.use('/payment',paymentroute );
app.use('/user',userroute );


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

