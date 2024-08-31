const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors());
const dbconfig = require("./db");
const roomsRoute = require('./routes/roomsRoute')
const userRoute = require('./routes/userRoute')
const bookingRoute = require('./routes/bookingRoute')
app.use(express.json());

app.use('/api/rooms',roomsRoute);
app.use('/api/user',userRoute);
app.use('/api/bookings',bookingRoute);

const port = process.env.PORT || 5000;

app.listen(port,console.log(`hiii`));