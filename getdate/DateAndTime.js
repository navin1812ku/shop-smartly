const moment = require('moment-timezone');

function getCurrentDateTimeIST() {
    return moment().tz('Asia/Kolkata').format('YYYY-MM-DD hh:mm:ss A');
}

function getCurrentDateTimePlus15DaysIST() {
    return moment().tz('Asia/Kolkata').add(15, 'days').format('YYYY-MM-DD hh:mm:ss A');
}

function isFirstDateBeforeSecondDate(firstDate, secondDate) {
    const format = 'YYYY-MM-DD hh:mm:ss A';
    const firstMoment = moment.tz(firstDate, format, 'Asia/Kolkata');
    const secondMoment = moment.tz(secondDate, format, 'Asia/Kolkata');
    return firstMoment.isBefore(secondMoment);
}

function getCurrentDateTimeISTForReturnDate() {
    return moment().tz('Asia/Kolkata').add(30, 'days').format('YYYY-MM-DD hh:mm:ss A');
}

module.exports = {
    getCurrentDateTimeIST,
    getCurrentDateTimePlus15DaysIST,
    isFirstDateBeforeSecondDate,
    getCurrentDateTimeISTForReturnDate
};