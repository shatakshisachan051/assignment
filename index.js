const jsonAvailble = require('./availbility.json')
const express = require('express')
const app = express()

var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function getDayIndex(dateString) {
    var parts = dateString.split('-');

    var date = new Date(parts[0], parts[1] - 1, parts[2]);

    var dayIndex = date.getDay();

    return dayIndex;
}

function checkSlot(date, time, dayIndex) {

    let day = days[dayIndex];

    const slotsInDay = jsonAvailble.availabilityTimings[day];

    let i;
    for (i = 0; i < slotsInDay.length; i++) {
        let slot = slotsInDay[i];
        let start = slot.start;
        let end = slot.end;

        let startingSlot = convertIntoMint(start);
        let endingSlot = convertIntoMint(end);

        let askingTime = convertIntoMint(time);

        if (askingTime < endingSlot && askingTime >= startingSlot) {
            return { isAvailable: true };

        } else if (askingTime < startingSlot) {
            return {
                isAvailable: false, nextAvailableSlot: {
                    date: date,
                    time: start
                }
            }
        }
    }

    dayIndex++;
    let numberOfDaysChecked = 0

    while (numberOfDaysChecked <= 7) {
        numberOfDaysChecked++;
        dayIndex = dayIndex % 7;
        var parts = date.split('-');

        var dateObj = new Date(parts[0], parts[1] - 1, parts[2]);

        dateObj.setDate(dateObj.getDate() + 1);
        date = formatDate(dateObj);

        let slot = jsonAvailble.availabilityTimings[days[dayIndex]];

        if (slot.length === 0) {
            dayIndex++;
            continue;
        }
        let start = slot[0].start;
        return {
            isAvailable: false, nextAvailableSlot: {
                date: date,
                time: start
            }
        }
    }

    return { isAvailable: false };

};

function convertIntoMint(time) {
    let hms = time;

    let aTime = hms.split(':');

    let minutes = (+aTime[0]) * 60  + (+aTime[1]) ;

    return minutes;
};


app.get('/doctor-availability', function (req, res) {
    
    let date = req.query.date;
    let time = req.query.time;
    let dayIndex = getDayIndex(date);
    let slot = checkSlot(date, time, dayIndex);

    res.json(slot);

});



app.listen(3000)



