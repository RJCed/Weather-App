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

// Button Container
const cityInput = document.getElementById("type-location");
const searchBtn = document.getElementById("search-button");
searchBtn.addEventListener("click", funcOrder);


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
const locPopup = document.getElementById("location-popup");
const listContainer = document.getElementById("list-container");



// Data variables
let city = cityInput.value.trim();

let geoURL;
let geoResponse;
let geoData;

let latitude;
let longitude;
let cityName;
let country;

let weatherURL;
let weatherResponse;
let weatherData;

let weatherCode;
let temperature;
let rainPercent;
let windSpeed;
let humidity;
let highestTemp;
let lowestTemp;

let weatherName;
let weatherImage;

let dateTimeData;
let date;
let dateFormat;



// Show Popup for location picker
locPopup.showModal();


// Get Geo and Weather Data
async function getInfo(){
    
    city = cityInput.value.trim();

    // Request Location geo data from open-meteo
    geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    geoResponse = await fetch(geoURL);
    geoData = await geoResponse.json();
    console.log("Finished Geo Data")

    // Get variables from data
    latitude = geoData.results[0].latitude;
    longitude = geoData.results[0].longitude;
    cityName = geoData.results[0].name;
    country = geoData.results[0].country;
    console.log(geoData)

    

    // Request Weather Data from open-meteo
    weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=precipitation_probability_max,weather_code,temperature_2m_max,temperature_2m_min&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`
    weatherResponse = await fetch(weatherURL);
    weatherData = await weatherResponse.json();
    console.log("Finished Weather Data")

    // Get variables from data
    weatherCode = weatherData.daily.weather_code[0];
    temperature = weatherData.current.temperature_2m;
    rainPercent = weatherData.daily.precipitation_probability_max[0];
    windSpeed = weatherData.current.wind_speed_10m;
    humidity = weatherData.current.relative_humidity_2m;
    highestTemp = weatherData.daily.temperature_2m_max[0];
    lowestTemp = weatherData.daily.temperature_2m_min[0];

    // Get weather name and image
    weatherName = weatherCodeMap[weatherCode][0];
    weatherImage = weatherCodeMap[weatherCode][1];

    // Get time and date to the used format of the page
    dateTimeData = weatherData.current.time;
    date = new Date(dateTimeData);
    dateFormat = `${date.toLocaleString("en-US", {
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
    // updateDOM();
}


function updateDOM(){
    // Close the popup
    locPopup.close();

    // Update DOM
    locationText.textContent = `${cityName}, ${country}`;
    weatherStatus.textContent = weatherName;
    weatherImg.src = `./images/${weatherImage}`;
    dateTime.textContent = dateFormat;
    temperatureText.textContent = `${Math.round(temperature)}°C`;
    highTemp.textContent = `H: ${highestTemp}`;
    lowTemp.textContent = `L: ${lowestTemp}`;
    chanceRain.textContent = `${rainPercent}%`;
    wind.textContent = `${windSpeed} km/h`;
    humidityText.textContent = `${humidity}%`;
}



// Append list of places with tha same name
function showPlace(){
    const placeResults = geoData.results;

    // Add each place to list
    for(i = 0; i < placeResults.length; i++){
        // Create place list (li)
        const placeList = document.createElement("li");
        
        // Add style of list
        placeList.classList.add("placeList");

        // Create place button
        const placeBtn = document.createElement("button");
        placeBtn.textContent = "City, Region, Country";

        // Add style in button
        placeBtn.classList.add("placeBtn");

        // Adds place button in the list
        placeList.appendChild(placeBtn);

        // Add list in list container
        listContainer.appendChild(placeList);
    }
    
}


async function funcOrder(){
    await getInfo();
    showPlace();
}