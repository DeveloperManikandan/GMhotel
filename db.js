const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://manisaragan:Mani%40divya1924@manidiv.pqya5lq.mongodb.net/hotel",{
    serverSelectionTimeoutMS: 5000, // Increase the timeout here
    socketTimeoutMS: 45000,
}
).then(()=>{
    console.log('Database connected');
    }).catch((err)=>{
        console.log(err);
})

module.exports= mongoose;