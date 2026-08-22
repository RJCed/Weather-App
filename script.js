const weatherCodeMap = {
    0: ["Clear Sky", "sun.png"],
    1: ["Mainly Clear", "sun.png"],
    2: ["Partly Cloudy", "cloudy.png"],
    3: ["Overcast", "overcast.png"],
    45: ["Fog", "fog.png"],
    48: ["Depositing Rime Fog", "fog.png"],
    51: ["Light Drizzle", "rain.png"],
    53: ["Moderate Drizzle", "rain.png"],
    55: ["Dense Drizzle", "rain.png"],
    56: ["Light Freezing Drizzle", "rain.png"],
    57: ["Dense Freezing Drizzle", "rain.png"],
    61: ["Slight Rain", "rain.png"],
    63: ["Moderate Rain", "rain.png"],
    65: ["Heavy Rain", "rain.png"],
    66: ["Light Freezing Rain", "rain.png"],
    67: ["Dense Freezing Rain", "rain.png"],
    71: ["Light Snow", "snow.png"],
    73: ["Moderate Snow", "snow.png"],
    75: ["Heavy Snow", "snow.png"],
    77: ["Snow Grains", "snow.png"],
    80: ["Slight Rain Showers", "rain.png"],
    81: ["Moderate Rain Showers", "rain.png"],
    82: ["Violent Rain Showers", "rain.png"],
    85: ["Slight Snow Showers", "snow.png"],
    86: ["Heavy Snow Showers", "snow.png"],
    95: ["Thunderstorm", "thunderstorm.png"],
    96: ["Thunderstorm With Slight Hail", "thunderstorm.png"],
    99: ["Thunderstorm With Heavy Hail", "thunderstorm.png"]
};

const cityInput = document.getElementById("type-location");
const searchBtn = document.getElementById("search-button");
searchBtn.addEventListener("click", getInfo);

const locationText = document.getElementById("location");
const weatherStatus = document.getElementById("weather-status");
const weatherImg = document.getElementById("weather-image");
const dateTime = document.getElementById("date-time");
const temperatureText = document.getElementById("temperature");
const highTemp = document.getElementById("high-temp");
const lowTemp = document.getElementById("low-temp");
const chanceRain = document.getElementById("chance-rain");
const wind = document.getElementById("wind-speed");
const humidityText = document.getElementById("humidity-percent");


async function getInfo(){
    const city = cityInput.value.trim();

    // Request Location geo data from open-meteo
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    const geoResponse = await fetch(geoURL);
    const geoData = await geoResponse.json();
    console.log("Finished Geo Data")

    // Get variables from data
    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;
    const cityName = geoData.results[0].name;
    const country = geoData.results[0].country;
    console.log(geoData)

    

    // Request Weather Data from open-meteo
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_probability_max,weather_code,temperature_2m_max,temperature_2m_min&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();
    console.log("Finished Weather Data")

    // Get variables from data
    const weatherCode = weatherData.daily.weather_code[0];
    const temperature = weatherData.current.temperature_2m;
    const rainPercent = weatherData.daily.precipitation_probability_max[0];
    const windSpeed = weatherData.current.wind_speed_10m;
    const humidity = weatherData.current.relative_humidity_2m;
    const highestTemp = weatherData.daily.temperature_2m_max[0];
    const lowestTemp = weatherData.daily.temperature_2m_min[0];

    // Get weather name and image
    const weatherName = weatherCodeMap[weatherCode][0];
    const weatherImage = weatherCodeMap[weatherCode][1];

    // Get time and date to the used format of the page
    const dateTimeData = weatherData.current.time;
    const date = new Date(dateTimeData);
    const dateFormat = `${date.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    })} | ${date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    })}`;
    console.log(weatherData)




    // Change DOM
    locationText.textContent = `${cityName}, ${country}`;
    weatherStatus.textContent = weatherName;
    weatherImg.src = `./images/${weatherImage}`;
    dateTime.textContent = dateFormat;
    temperatureText.textContent = `${Math.round(temperature)}°C`;
    highTemp.textContent = `H: ${highestTemp}`;
    lowTemp.textContent = `L: ${lowestTemp}`;
    chanceRain.textContent = `${rainPercent}%`;
    wind.textContent = `${windSpeed} km/h`;
    humidityText = `${humidity}%`;




}