const express = require("express");
const router = express.Router();

const User = require("../models/usermodel");

router.post("/adduser", async (req, res)=>{
    try{
        const {name, email,phone,museum,shows,nooftickets,userid}  = req.body;

        const user = new User({
            name,
            email,
            phone,
            museum,
            shows,
            nooftickets,
            userid
        });

        await user.save();
        res.status(200).send({
            message : "User added successfully"
        });
    }catch(err){
        res.status(400).send({
            error : err
        });
    }
})

router.get("/getuser", async (req, res)=>{
    try{
        const {userid} = req.query;

        const users = await User.find(
            {
                userid
            }
        );

        res.status(200).send({
            users
        });
        
    }catch(err){
        res.status(400).send({
            error : err
        });
    }
})

module.exports = router;