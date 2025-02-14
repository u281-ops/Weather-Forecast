const apiKey = "21880843a2e4de4035a997e00944f0eb"; // Your API Key
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherDiv = document.getElementById("weather");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const weatherType = document.getElementById("weatherType");
const forecastDiv = document.getElementById("forecast");
const hourlyForecast = document.getElementById("hourlyForecast");
const toggleTheme = document.getElementById("toggleTheme");

// Check if dark mode is enabled
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

// Search weather on button click
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert("Please enter a city!");
        return;
    }
    fetchWeather(city);
});

// Fetch current weather
async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) throw new Error("City not found");

        const data = await response.json();
        displayWeather(data);

        // Fetch hourly forecast
        await fetchForecast(city);
    } catch (error) {
        alert(error.message);
    }
}

// Display current weather
function displayWeather(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${data.main.temp}°C`;
    weatherType.textContent = data.weather[0].description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDiv.classList.remove("hidden");
}

// Fetch hourly forecast
async function fetchForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) throw new Error("Forecast data not available");

        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        alert(error.message);
    }
}

// Display hourly forecast
function displayForecast(data) {
    hourlyForecast.innerHTML = "";
    for (let i = 0; i < 24; i++) {
        const hourData = data.list[i];
        const div = document.createElement("div");
        div.classList.add("forecast-item");
        div.innerHTML = `
            <p>${new Date(hourData.dt_txt).getHours()}:00</p>
            <img src="https://openweathermap.org/img/wn/${hourData.weather[0].icon}.png" />
            <p>${hourData.main.temp}°C</p>
        `;
        hourlyForecast.appendChild(div);
    }
    forecastDiv.classList.remove("hidden");
}

// Toggle Dark Mode
toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});
