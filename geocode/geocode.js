// 
const request = require('request'); // eslint-disable-line no-unused-vars

var geocodeAddress = (addressToFetch, callback) => {

    var address = encodeURIComponent(addressToFetch);

    request({
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyAyzHLTGVnfo6xTxNx6F8aCwD5YbCtO1As',
        json: true
    }, (error, response, body) => {
        if (error) {
            callback('Unable to connect to Google servers.');
        } else if (body.status === 'ZERO_RESULTS') {
            callback('Unable to find that address.');
        } else if (body.status === 'OK') {
            callback (undefined, {
                address: body.results[0].formatted_address,
                lat: body.results[0].geometry.location.lat,
                lon: body.results[0].geometry.location.lng
            });
        }
        // Prints all of JSON "pretty print":
        // console.log(JSON.stringify(body, undefined, 4));
    })
};

// Export so app.js can access
module.exports.geocodeAddress = geocodeAddress;
