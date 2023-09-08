//DATA
var apiKey = "AIzaSyDMAjoIQZ_CJWBTz9m52oX-6WKhdK463GQ";
var WeatherAPIKey = "6cf092f23b87fdf33fc57108faf70e1a";
let map;
let service;
let infowindow;
//my location in lat/long
var latitude;
var longitude;

//radius label
var radiusLabel = document.querySelector("#radiusLabel");
// radius buttons
var radiusButtons = document.getElementsByClassName("radius-option");
// Search Input Button
var searchButton = document.getElementById("search-button");
//map element
var mapEl = document.querySelector("#map");
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

//reload map with custom inputs
function findMoreStuffNearLocation(location, radius, searchInput) {
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
    type: [searchInput],
    radius: radius,
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

//create new map based on inputs
searchButton.addEventListener("click", function getResult() {
  //get inputs
  var searchInput = document.querySelector("#input").value;
  var radius = radiusLabel.textContent;
  //change radius input to meters
  if (radius === "30-Miles") {
    radius = "48280";
  } else if (radius === "20-Miles") {
    radius = "32187";
  } else {
    radius = "16093";
  }
  console.log(radius);
  //get location
  window.navigator.geolocation.getCurrentPosition(function (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  });
  console.log(latitude, longitude);
  //update map
  findMoreStuffNearLocation({ latitude, longitude }, radius, searchInput);
});

//choose radius
for (var i = 0; i < radiusButtons.length; i++) {
  radiusButtons[i].addEventListener("click", radiusDisplay, false);
}

function radiusDisplay(event) {
  event.preventDefault();
  var label = this.id;
  var radiusLabel = document.querySelector("#radiusLabel");
  radiusLabel.innerHTML = label;
}

//create function to get route from current location to endpoint
function getRoute() {}

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

//user interaction
mapEl.addEventListener("click", function (event) {
  var element = event.target;

  if (element.matches("#marker-button")) {
    var buttonEl = element;
    var endPoint = buttonEl.textContent;

    //get location in scope
    window.navigator.geolocation.getCurrentPosition(function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      LatLng = `${latitude},${longitude}`;
      console.log(LatLng);

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: latitude, lng: longitude },
      });
      calculateAndDisplayRoute(
        directionsService,
        directionsRenderer,
        LatLng,
        endPoint
      );
      directionsRenderer.setMap(map);
    });
  }
});

//function to make route
function calculateAndDisplayRoute(
  directionsService,
  directionsRenderer,
  start,
  endpoint
) {
  directionsService
    .route({
      origin: {
        query: start,
      },
      destination: {
        query: endpoint,
      },
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + e));
}

// initialize
window.initMap = initMap;
getLocation();
