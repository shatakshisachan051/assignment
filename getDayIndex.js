function getDayIndex(dateString) {
    var parts = dateString.split('-');

    var date = new Date(parts[0], parts[1] - 1, parts[2]);

    var dayIndex = date.getDay();

    return dayIndex;
};

module.exports = getDayIndex;