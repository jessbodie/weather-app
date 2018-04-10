// Dark Sky Secret Key
// aa3bf442011ba7d7d05844457c5c95bd
// Dark Sky Static URL
// https://api.darksky.net/forecast/aa3bf442011ba7d7d05844457c5c95bd/40.619923,-74.03442

const request = require('request'); // eslint-disable-line no-unused-vars

var getWeather = (lat, lon, callback) => {
    var darkskyKey = 'aa3bf442011ba7d7d05844457c5c95bd';

    request({
        url: `https://api.darksky.net/forecast/${darkskyKey}/${lat},${lon}`,
        json: true
        }, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                callback(undefined, {
                    temperature: body.currently.temperature,
                    apparentTemperature: body.currently.apparentTemperature
                });    
            } else {
                callback('Unable to fetch weather');
            } 
        })
};

// Export so app.js can access
module.exports.getWeather = getWeather;



// Prints all of JSON "pretty print":
// console.log(JSON.stringify(response, undefined, 4));
