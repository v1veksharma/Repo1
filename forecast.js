const api = {
    key: "28fd15358cdecbc1a1dfef367e71acef",
    base: "https://api.openweathermap.org/data/2.5/"
};

document.addEventListener("DOMContentLoaded", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getForecastByLocation, showError);
    } else {
        document.getElementById("forecastData").innerHTML = "<p>Geolocation is not supported by your browser.</p>";
    }
});

function getForecastByLocation(position) {
    const { latitude, longitude } = position.coords;

    fetch(`${api.base}forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${api.key}`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => console.error("Error fetching forecast:", error));
}

function displayForecast(response) {
    const forecastContainer = document.getElementById("forecastData");

    if (!response || !response.list) {
        forecastContainer.innerHTML = "<p>Forecast data unavailable.</p>";
        return;
    }

    forecastContainer.innerHTML = response.list
        .slice(0, 8) // Show next 8 hours
        .map(forecast => {
            let time = new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return `
                <div class="hour">
                    <p>${time}</p>
                    <img src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="Weather icon">
                    <p>${Math.round(forecast.main.temp)}°C</p>
                </div>
            `;
        })
        .join("");
}

function showError(error) {
    document.getElementById("forecastData").innerHTML = `<p>Error getting location: ${error.message}</p>`;
}

function goBack() {
    window.location.href = "index.html";
}
