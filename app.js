const api = {
    key: "28fd15358cdecbc1a1dfef367e71acef",
    base: "https://api.openweathermap.org/data/2.5/"
};

document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
        document.getElementById("errorMessage").textContent = "Please enter a city name.";
        return;
    }

    getWeather(city);
    localStorage.setItem("selectedCity", city);
});

function getWeather(city) {
    fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                document.getElementById("errorMessage").textContent = "City not found. Try again.";
                return;
            }

            document.getElementById("cityName").textContent = data.name;
            document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
            document.getElementById("weatherDescription").textContent = data.weather[0].description;
            document.querySelector(".humidity").textContent = `Humidity: ${data.main.humidity}%`;
            document.querySelector(".wind").textContent = `Wind: ${Math.round(data.wind.speed)} km/h`;

            document.getElementById("errorMessage").textContent = "";
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

function viewForecast() {
    window.location.href = "forecast.html";
}

document.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherByLocation, showError);
    } else {
        document.getElementById("errorMessage").textContent = "Geolocation is not supported by your browser.";
    }
});

function getWeatherByLocation(position) {
    const { latitude, longitude } = position.coords;

    // Fetch Weather Data
    fetch(`${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api.key}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                document.getElementById("errorMessage").textContent = "Could not fetch weather for your location.";
                return;
            }

            document.getElementById("cityName").textContent = data.name;
            document.getElementById("temperature").textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
            document.getElementById("weatherDescription").textContent = data.weather[0].description;
            document.querySelector(".humidity").textContent = `Humidity: ${data.main.humidity}%`;
            document.querySelector(".wind").textContent = `Wind: ${Math.round(data.wind.speed)} km/h`;

            document.getElementById("errorMessage").textContent = "";
            getAQI(latitude, longitude);
        })
        .catch(error => console.error("Error fetching weather data:", error));
}

function getAQI(lat, lon) {
    fetch(`${api.base}air_pollution?lat=${lat}&lon=${lon}&appid=${api.key}`)
        .then(response => response.json())
        .then(data => {
            const aqi = data.list[0].main.aqi;
            const aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
            document.getElementById("aqi").textContent = `AQI: ${aqi} (${aqiText[aqi - 1]})`;
        })
        .catch(error => console.error("Error fetching AQI data:", error));
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("errorMessage").textContent = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("errorMessage").textContent = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById("errorMessage").textContent = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById("errorMessage").textContent = "An unknown error occurred.";
            break;
    }
}

