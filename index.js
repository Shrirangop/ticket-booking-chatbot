const express = require('express');
const app=express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Import the router
const entryticketroute = require('./routes/entryticketroute');

// Use the router
app.use('/entry', entryticketroute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});