const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Room = require('../models/room');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51Psg41CsGAlJLD7FMaupKTZAdA07zEO3JxI1Xl3rb241UIw2GLYsSwm0inP09mBaxFEyNgPDxnlq9Gd4ccMo5DUA00tDBl8I3G')

router.post('/bookroom', async (req, res) => {
    const {
        room: roomDetails,
        userid,
        fromdate,
        todate,
        totalamount, 
        totaldays,
        token
    } = req.body;

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const payment = await stripe.charges.create(
            {
                amount: totalamount * 100,
                customer: customer.id,
                currency: 'INR',
                receipt_email: token.email
            }, {
            idempotencyKey: uuidv4()
        });

        if (payment) {
            try {
                const newBooking = new Booking({
                    room: roomDetails.name,
                    roomid: roomDetails._id,
                    user: userid,
                    fromdate,
                    todate,
                    totalamount,
                    totaldays,
                    transactionid: payment.id // Use the actual payment transaction ID
                });

                const booking = await newBooking.save();

                const tempRoom = await Room.findOne({ _id: roomDetails._id });
                if (!tempRoom) {
                    return res.status(404).json({ error: "Room not found" });
                }

                tempRoom.currentbookings.push({
                    bookingid: booking._id,
                    fromdate: fromdate,
                    todate: todate,
                    userid: userid,
                    status: booking.status
                });

                await tempRoom.save();

                return res.status(200).send('Booking successful');
            } catch (error) {
                console.error("Booking error:", error);
                return res.status(400).json({ error: error.message });
            }
        }
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/getbookingsbyuserid", async(req, res) => {
    const userid = req.body.userid;
    try {
        const bookings = await Booking.find({ user: userid });
        res.send(bookings);
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.post("/cancelbooking", async(req, res) => {
    const {bookingid, roomid} = req.body;
    try {
        const booking = await Booking.findOne({_id: bookingid });
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        booking.status = 'cancelled';
        await booking.save();

        const room = await Room.findOne({ _id: roomid });
        room.currentbookings = room.currentbookings.filter(booking => booking.bookingid != bookingid);
        await room.save();

        return res.status(200).send('Booking cancelled successfully');
    } catch (error) {
        return res.status(400).json({ error });
    }
});

router.get('/getallbookings', async(req,res)=>{
    try {
        const bookings = await Booking.find({});
        res.send(bookings);
    } catch (error) {
        return res.status(400).json({ error });
    }       
});
module.exports = router;
