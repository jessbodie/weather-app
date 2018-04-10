// Previous, pre-promise version
// Refer to app-promise.js

const yargs = require('yargs'); // eslint-disable-line no-unused-vars

const geocode = require('./geocode/geocode.js'); // eslint-disable-line no-unused-vars
const weather = require('./weather/weather.js'); // eslint-disable-line no-unused-vars

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

geocode.geocodeAddress(argv.address, (errorMessage, results) => {
    if (errorMessage) {
        console.log(errorMessage);
    } else {
        console.log(results.address);
        weather.getWeather(results.lat, results.lon, (errorMessage, weatherResults) => {
            if (errorMessage) {
                console.log(errorMessage);
            } else {
                console.log(`It's currently ${weatherResults.temperature} degrees, but it feels like ${weatherResults.apparentTemperature} degrees.`);
            }
        });
    }
});

