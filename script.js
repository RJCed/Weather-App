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


async function getInfo(){
    const city = cityInput.value.trim();

    // Request Location geo data from open-meteo
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    const geoResponse = await fetch(geoURL);
    const geoData = await geoResponse.json();

    // Take latitude and longitude of the location
    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;

    console.log(geoData)

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_probability_max,weather_code,temperature_2m_max,temperature_2m_min&current=temperature_2m,wind_speed_10m,relative_humidity_2m&timezone=auto`
    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();

    console.log(weatherData)

}