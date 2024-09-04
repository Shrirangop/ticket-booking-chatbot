const express = require("express");
const router = express.Router();
const showtickets = require('../models/showsticketmodel');

router.get('/fetchshows',async (req,res)=>{
    try{
        const {museum, tickets} = req.query;


        const shows = await showtickets.find({
            museum : museum
        });

        let availableshows=[];

        for(let i = 0;i<shows.length;i++){
            if(tickets <= shows[i].currtickets){
                let val  = {
                    showname : shows[i].showname,
                    price : shows[i].price
                }
                availableshows.push(val);
            }
        }
        console.log(availableshows);
        res.status(200).json({
            status: 'success',
            data: availableshows,
        })
    }catch(err){
        res.send('Error ' + err);
    }
});
router.post('/bookshows', async (req, res) => {
    const { museum, shows, tickets } = req.body;

    console.log(req.body);

    try {
        for (let i = 0; i < shows.length; i++) {
            // Find the show by museum and showname
            let show = await showtickets.findOne({
                museum: { $exists: true, $ne: null, $eq: museum },
                showname: { $exists: true, $ne: null, $eq: shows[i] }
            });

            console.log(show);

            if (!show) {
                return res.status(404).json({
                    status: 'fail',
                    message: `Show not found: ${shows[i].showname}`
                });
            }

            // Update the current tickets
            show.currtickets -= tickets;

            // Ensure currtickets doesn't go below zero
            if (show.currtickets < 0) {
                return res.status(400).json({
                    status: 'fail',
                    message: `Not enough tickets available for ${shows[i].showname}`
                });
            }

            await show.save();
        }

        res.status(200).json({
            status: 'success',
            message: 'Tickets booked successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;