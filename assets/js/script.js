//DATA
var apiKey = "AIzaSyDMAjoIQZ_CJWBTz9m52oX-6WKhdK463GQ";
var WeatherAPIKey = "6cf092f23b87fdf33fc57108faf70e1a";
//this tests
// var testApi = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=pizza&location=${latitude},${longitude}&radius=48280.3&type=restaurant&key=AIzaSyDMAjoIQZ_CJWBTz9m52oX-6WKhdK463GQ`;
let map;
let service;
let infowindow;
//my location in lat/long
var latitude;
var longitude;

//weather variables
var currentWeather = document.querySelector("#currentWeather");
var highLowHumidity = document.querySelector(".content");
var iconDisplay = document.querySelector("#iconImage");
//FUNCTIONS

//get my current location
function getLocation() {
  if (navigator.geolocation) {
    console.log("Getting location");
    window.navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      findStuffNearLocation({ latitude, longitude });
      getWeather();
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

//reload map
function findStuffNearLocation(location) {
  const myLocation = new google.maps.LatLng(
    location.latitude,
    location.longitude
  );

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: myLocation,
    zoom: 15,
  });

  const request = {
    location: myLocation,
    fields: ["name", "geometry"],
    type: ["restaurant"],
    radius: "20000",
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    console.log(results);
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });
}

function initMap() {
  const myLocation = new google.maps.LatLng(-33.8665433, 151.1956316);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: myLocation,
    zoom: 15,
  });

  const request = {
    location: myLocation,
    fields: ["name", "geometry"],
    type: ["restaurant"],
    radius: "20000",
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => {
    console.log(results);
    if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (let i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", (event) => {
    var contentString = `<h1> ${place.name} </h1> <p> Rating (0-5): ${place.rating} </p> <p> Price (0-4): ${place.price_level} </p> <p> Address: <button id="marker-button"> ${place.vicinity} </button> </p>`;

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: "Uluru",
    });
    infowindow.open({ anchor: marker, map });
  });
}

//create function to fetch api from google-places

// start API call for Weather
function getWeather() {
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    WeatherAPIKey +
    "&units=imperial";
  console.log("getting weather");
  fetch(weatherUrl).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        console.log(data);

        var currentTemp = data.main.temp;
        currentWeather.textContent = "Current Temp: " + currentTemp;

        var high = data.main.temp_max;
        var low = data.main.temp_min;
        var humidity = data.main.humidity;

        highLowHumidity.innerHTML =
          "High: " +
          high +
          "<br/>" +
          "Low: " +
          low +
          "<br/>" +
          "Humidity: " +
          humidity +
          "%";

        var icons = data.weather[0].icon;
        iconDisplay.src =
          "http://openweathermap.org/img/wn/" + icons + "@2x.png";
      });
    } else {
      alert("Error " + response.statusText);
    }
  });
}

//INITIALIZE
window.initMap = initMap;
getLocation();
