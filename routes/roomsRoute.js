const express = require('express')
const router = express.Router();

const room = require('../models/room.js');

router.get('/getallrooms', async(req,res)=>{
    try{
        const rooms = await room.find({});
        res.send(rooms);
        }
        catch(err){
            res.status(500).json({message:err.message})
            }       
});

router.post("/getroombyid", async(req, res) => {
    const roomid = req.body.roomid;
    try {
    const roomone = await room.findById(roomid) ;
    res.send(roomone);
    } catch (error) {
    return res.status(400).json({ message: error });
    }
    });

    router.post("/addroom", async (req, res) => {
    
        try {
            const newRoom = new room(req.body);
            await newRoom.save();
            res.status(201).send('Room added successfully');
        } catch (error) {
            console.error('Error saving room:', error);
            res.status(400).json({ error: error.message });
        }
    });
    

module.exports = router;