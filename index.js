const jsonAvailble = require('./availbility.json');
const express = require('express');
const checkSlot = require('./checkSlot');
const getDayIndex = require('./getDayIndex');


const app = express();
const port = 3000;

app.get('/doctor-availability', function (req, res) {
    
    let date = req.query.date;
    let time = req.query.time;
    let dayIndex = getDayIndex(date);
    let slot = checkSlot(date, time, dayIndex);

    res.json(slot);

});

app.listen(port);



