function convertIntoMint(time) {
    let hms = time;

    let aTime = hms.split(':');

    let minutes = (+aTime[0]) * 60  + (+aTime[1]) ;

    return minutes;
};

module.exports = convertIntoMint ;