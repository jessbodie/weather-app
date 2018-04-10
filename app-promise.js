// Node app to return weather data for a location
// Based on instruction and assignment from Andrew Mead's NodeJS Udemy
// https://www.udemy.com/the-complete-nodejs-developer-course-2

// Yargs for handling arguments
const yargs = require('yargs'); // eslint-disable-line no-unused-vars

// Axios for handling requests with promises
const axios = require('axios'); // eslint-disable-line no-unused-vars

// File System for saving default location
const fs = require("fs"); // eslint-disable-line no-unused-vars

// Command -a to retreive weather info for a specific address
// Command -d to set a default address and retreive weather info
const argv = yargs
    .options({
        a: {
            demandOption: true,
            alias: 'address',
            describe: 'Look up weather info for specific address',
            string: true
        },
        d: {
            alias: 'default',
            describe: 'Set default location and look up weather info',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;



// Retrieve saved location, if already saved
var fetchLoc = () => {
    try {
        var locString = fs.readFileSync('default-location.json');
        return JSON.parse(locString);
    } catch (e) { 
        return [];
    }
};

// Set default location, save if different
var setDefaultLoc = (loc) => {
    var curDefaultLoc = fetchLoc();
    if (curDefaultLoc !== loc) {
        fs.writeFileSync('default-location.json', JSON.stringify(loc));
    }
};


// Set address to retreive for
var encodedAddress;
// Update default address and retrieve
if (argv.default) {
    var encodedDefault = encodeURIComponent(argv.default);
    setDefaultLoc(encodedDefault);
    encodedAddress = encodedDefault;
} else if (argv.address) {
    // Retrieve for newly entered
    encodedAddress = encodeURIComponent(argv.address);
} else {
    //Retrieve for saved address
    encodedAddress = fetchLoc();
}


// Endpoint to retreive lat and lon
var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodedAddress + '&key=AIzaSyAyzHLTGVnfo6xTxNx6F8aCwD5YbCtO1As';


// For Axios, pass in URL and add promises handling
axios.get(geocodeURL).then((response) => {
    if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Sorry unable to find that address.');
    } 
   
    var lat = response.data.results[0].geometry.location.lat;
    var lon = response.data.results[0].geometry.location.lng;
    // Endpoint to retrieve weather for lat and lon
    var darkskyKey = 'aa3bf442011ba7d7d05844457c5c95bd';
    var weatherURL = `https://api.darksky.net/forecast/${darkskyKey}/${lat},${lon}`;
    // Read back formatted address
    console.log(`Address: ${response.data.results[0].formatted_address}`);
    return axios.get(weatherURL);
}).then((response) => {
    // Obtain, format weather data
    var temperature = response.data.currently.temperature;
    temperature = Math.ceil(temperature);
    var temperatureLow = response.data.daily.data[0].temperatureMin;
    temperatureLow = Math.ceil(temperatureLow);
    var temperatureHi = response.data.daily.data[0].temperatureMax;
    temperatureHi = Math.ceil(temperatureHi);
    var precip = response.data.daily.data[0].precipProbability;
    precip = precip * 100;
    console.log(`Current temperature: ${temperature}°F \nForecasted high: ${temperatureHi}°F \nForecasted low:  ${temperatureLow}°F \nChance of precipitation: ${precip}%`);
}).catch((e) => {
    if (e.code === 'ENOTFOUND') {
        console.log('Unable to connect.');
    } else {
        console.log(e.message);
    }
});


