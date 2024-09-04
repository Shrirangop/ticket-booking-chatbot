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
})


module.exports = router;