const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();
const crypto = require('crypto');
const mongoose = require('mongoose');
const ShowTicket = require('../models/showsticketmodel'); // Assuming a Mongoose model for show tickets
const Museum = require('../models/entryticketmodel'); // Assuming a Mongoose model for museums

// Initialize Razorpay with your key and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay Key Secret
});

// Unified API endpoint for booking museum and show tickets with Razorpay payment
router.post('/booktickets', async (req, res) => {
  const { museum, shows, tickets, details } = req.body; // Expect museum, shows, and number of tickets in the request body
  let totalPrice = 0; // Initialize total price for calculation
  const updatedShows = []; // Keep track of updated shows to handle multiple updates

  try {
    // Find the museum and check ticket availability
    const curr_museum = await Museum.findOne({ museum: museum });

    if (!curr_museum) {
      return res.status(404).json({ msg: 'Museum not found' });
    }

    // Check if enough tickets are available for the museum
    if (curr_museum.currtickets < tickets) {
      return res.status(400).json({ msg: 'Not enough tickets available at the museum' });
    }

    // Calculate total price based on the museum price and requested tickets
    totalPrice += curr_museum.price * tickets;

    // Handle each show booking inside the museum
    if (shows && shows.length > 0) {
      for (let i = 0; i < shows.length; i++) {
        const show = await ShowTicket.findOne({
          museum: museum,
          showname: shows[i],
        });

        if (!show) {
          return res.status(404).json({
            status: 'fail',
            message: `Show not found: ${shows[i]}`,
          });
        }

        // Check if enough tickets are available for the show
        if (show.currtickets < tickets) {
          return res.status(400).json({
            status: 'fail',
            message: `Not enough tickets available for ${shows[i]}`,
          });
        }

        // Update total price based on each show's price
        totalPrice += show.price * tickets;
        updatedShows.push(show); // Add the show to updatedShows for later ticket updates
      }
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(totalPrice * 100), // Amount in paise
      currency: 'INR', // Currency code
      receipt: `receipt_${Date.now()}`, // Unique receipt number
      payment_capture: 1, // Auto-capture the payment
    };

    const order = await razorpay.orders.create(options);

    // Create a Razorpay payment link
    const paymentLink = await razorpay.paymentLink.create({
      amount: Math.round(totalPrice * 100), // Amount in paise
      currency: 'INR',
      customer: {
        name: details.name,
        email: details.email,
        contact: details.phone,
      },
      accept_partial: false,
      first_min_partial_amount: 0,
      reference_id: `ref_${Date.now()}`,
      description: 'Ticket Booking',
      notes: {
        order_id: order.id,
      },
      callback_url: `https://your-callback-url.com/confirm-payment`, // Change to your actual callback URL
    });

    // Respond with the Razorpay order details and payment link
    res.status(200).json({
      status: 'success',
      order_id: order.id, // Return the order ID for client-side integration
      payment_link: paymentLink.short_url, // URL for the user to complete the payment
    });

    // Client-side will handle the payment with Razorpay. On success, client will call a new route to confirm payment and update the database.
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'An error occurred while creating the Razorpay order' });
  }
});
// Confirm payment and update tickets after payment success
router.post('/confirm-payment', async (req, res) => {
  const { order_id, payment_id, signature, museum, shows, tickets } = req.body;

  try {
    // Verify the Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${order_id}|${payment_id}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ status: 'fail', message: 'Invalid payment signature' });
    }

    // Fetch the museum and update ticket availability
    const curr_museum = await Museum.findOne({ museum: museum });
    if (!curr_museum) {
      return res.status(404).json({ msg: 'Museum not found' });
    }

    // Check if the museum has enough tickets to be updated
    if (curr_museum.currtickets < tickets) {
      return res.status(400).json({ msg: 'Not enough tickets available at the museum for this update' });
    }

    // Update the museum's ticket count
    curr_museum.currtickets -= tickets;
    await curr_museum.save();

    // Update the shows' tickets after successful payment
    for (let showName of shows) {
      const show = await ShowTicket.findOne({ museum: museum, showname: showName });
      if (show) {
        // Check if the show has enough tickets to be updated
        if (show.currtickets < tickets) {
          return res.status(400).json({
            status: 'fail',
            message: `Not enough tickets available for ${showName}`,
          });
        }
        console.log(show.currtickets);
        console.log(tickets);
        show.currtickets -= tickets;
        await show.save();
      }
    }

    // Return a successful response
    res.status(200).json({
      status: 'success',
      message: 'Tickets booked successfully',
      museum: museum,
      bookedshows: shows,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'An error occurred while confirming the payment' });
  }
});
module.exports = router;
