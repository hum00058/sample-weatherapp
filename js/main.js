/*
## DirectGeocoding API call
http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
## Reverse Geocoding API call
http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}
sample response - https://openweathermap.org/api/geocoding-api

## Current Weather API call
https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}
sample response - https://openweathermap.org/current


## 5 day/3 hour forecast API call
api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
sample response - https://openweathermap.org/forecast5

Key for this app - 9d5ccb9464d01899f376142bb081e04c
*/

const apiKey = '9d5ccb9464d01899f376142bb081e04c';
// const currentPosition = {
//   lat: 0,
//   lon: 0,
// };
let storedWeather = null;

(() => {
  document.querySelector('form').addEventListener('submit', directGeoCode);
  getCurrentPosition();
})();

function getCurrentPosition() {
  //check localstorage for lat lon city
  if (localStorage.getItem(`cityweather`)) {
    storedWeather = JSON.parse(localStorage.getItem(`cityweather`));
    document.querySelector('#search').value = storedWeather.city;
    // currentPosition.lat = storedWeather.lat;
    // currentPosition.lon = storedWeather.lon;
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      // currentPosition.lat = lat;
      // currentPosition.lon = lon;
      reverseGeoCode(lat, lon);
    });
  }
}

function reverseGeoCode(lat, lon) {
  let url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=3&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let city = data[0].name;
      let state = data[0].state;
      let country = data[0].country;
      document.querySelector('#search').value = city;
      //now get weather data when the user clicks the search button
      localStorage.setItem('cityweather', JSON.stringify({ city, lat, lon }));
    })
    .catch((err) => console.log(err));
}

function getWeatherData(lat, lon) {
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let div = document.querySelector('.weather-card');
      let icon = data.weather[0].main.toLowerCase();
      icon = icon.startsWith('cloud') ? 'cloudy' : icon;
      div.innerHTML = `
      <p class="temperature"><i class="wi wi-thermometer"></i> ${data.main.temp} <i class="wi wi-celsius"></i></p>
      <p class="main"><i class="wi wi-${icon}"></i> ${data.weather[0].main}</p>
      <p class="main"><i class="wi wi-cloudy"></i> ${data.clouds.all}% coverage </p>
      <p class="main"><i class="wi wi-humidity"></i> ${data.main.humidity} </p>
      <p class="main"><i class="wi wi-windy"></i> ${(data.wind.speed * 3.6).toFixed(1)} km/h </p>
      <p class="main"><i class="wi wi-barometer"></i> ${data.main.pressure} </p>
      <p class="main"><i class="wi wi-sunrise"></i> ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()} </p>
      <p class="main"><i class="wi wi-sunset"></i> ${new Date(data.sys.sunset * 1000).toLocaleTimeString()} </p>
      `;
    })
    .catch((err) => console.log(err));
}

function directGeoCode(ev) {
  ev.preventDefault();
  let city = document.querySelector('#search').value;
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const lat = data[0].lat;
      const lon = data[0].lon;
      // currentPosition.lat = lat;
      // currentPosition.lon = lon;
      localStorage.setItem('cityweather', JSON.stringify({ city, lat, lon }));
      getWeatherData(lat, lon);
    })
    .catch((err) => console.log(err));
}
