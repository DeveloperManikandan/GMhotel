const express = require("express");
const router = express. Router();
const User = require("../models/user")
router.post("/register", async(req, res) => {
const newuser = new User({name: req.body.name, email: req.body.email, password: req.body.password});
console.log(newuser);

try { 
const users = await newuser.save()
res.send('User Registered Successfully')
} catch (error) {
return res.status(400).json({ error });
}
});

router.post("/login", async(req, res) => {
    const {email, password} = req.body
    try {
    const finduser = await User.findOne({email: email, password : password});
    if(finduser) {
        const temp={
            name:finduser.name,
            email:finduser.email,
            isAdmin :finduser.isAdmin,
            _id : finduser._id
            }
        
    res.send(temp);
    } 
    else{
    return res.status(400).json({ message: 'Login failed, try again later' });
    }
    } catch (error) {
    return res.status(400).json({ error });
    }
    });

router.get("/getuser", async(req, res) => {
    try {
        const finduser = await User.find({});
        res.send(finduser);
    }catch(error){
        return res.status(400).json({ error });
    }
});


module.exports = router