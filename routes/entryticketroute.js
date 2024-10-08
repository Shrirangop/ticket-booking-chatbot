const express = require('express');
const router = express.Router();
const Museum = require('../models/entryticketmodel');


router.get('/fetchtickets',async function (req,res){
    try {
        const museum_name=req.query.museum; // Assuming the name is passed as a query parameter
        console.log(museum_name);
        const curr_museum = await Museum.findOne({ museum: museum_name });

        console.log(curr_museum);
        res.status(200).json({
            tickets:curr_museum.currtickets,
            price:curr_museum.price,
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
        remaining_tickets: curr_museum.currtickets,  // Optionally, return the remaining tickets
      });
  
    } catch (error) {
      console.error('Error booking ticket:', error);
      return res.status(500).send('Internal Server Error');
    }
  });
  
  
  module.exports = router;