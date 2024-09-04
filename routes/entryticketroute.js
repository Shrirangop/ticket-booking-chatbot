const express = require('express');
const router = express.Router();
const Museum = require('../models/entryticketmodel');


router.get('/fetchtickets',async function (req,res){
    try {
        const mueseum_name=req.query.museum; // Assuming the name is passed as a query parameter
        const curr_museum = await Museum.findOne({ name: mueseum_name });
        res.status(200).json({
            tickets:curr_museum.currtickets
        })
      } catch (error) {
        console.error('Error checking museum:', error);
        return res.status(500).send('Internal Server Error');
      }
});

router.post('/bookticket', async function (req, res) {
    try {
      const museum_name = req.body.museum; // Assuming the name is passed in the request body
      const ticketreq=req.body.tickets;
      // Find the museum by name
      const curr_museum = await Museum.findOne({ museum: museum_name });
  
      if (!curr_museum) {
        return res.status(404).json({
          msg: "Museum not found",
        });
      }
      // Decrement the number of tickets by 1
      curr_museum.currtickets -= ticketreq;
  
      // Save the updated museum document
      await curr_museum.save();
  
      // Respond with a success message
      res.status(200).json({
        msg: "Ticket booked successfully",
        price:curr_museum.price,
        remaining_tickets: curr_museum.currtickets,  // Optionally, return the remaining tickets
      });
  
    } catch (error) {
      console.error('Error booking ticket:', error);
      return res.status(500).send('Internal Server Error');
    }
  });
  
  
  module.exports = router;