const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

var cityReceived;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
    console.log(req.body.cityName);
    cityReceived = req.body.cityName;
    fetchWeather(cityReceived, res);
});

app.listen(3000, function () {
    console.log("Server listening on port 3000");
});

function fetchWeather(city, response) {
    const baseURL = "https://api.openweathermap.org/data/2.5/weather";
    const query = city;
    const apiKey = "c881f764b8219d1970ab3bb99b5fda58";
    const units = "metric";

    https.get(baseURL + "?q=" + query + "&appid=" + apiKey + "&units=" + units, (weatherRes) => {
        console.log('weatherResponseCode:', weatherRes.statusCode);

        weatherRes.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const wIcon = weatherData.weather[0].icon;
            
            const wIconSource = "https://openweathermap.org/img/wn/" + wIcon + "@2x.png";
            const weatherTempStr = "<h1>The temperature in " + query + " is " + temp + "C</h1>";
            const breakStr = "<br>";
            const weatherDescStr = "<h2>Current weather: " + weatherDescription + ".</h2>";

            response.write(weatherTempStr);
            response.write(breakStr);
            response.write(weatherDescStr);
            response.write("<img src=" + wIconSource + ">");
            response.send();
        });
    });
}