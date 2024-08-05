function reset(){
    location.reload()

}


async function checkWeather(cityName) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=f7cfb6cb435ce0512c77d91f0cd8700a&units=metric`;
    const hourlyApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=f7cfb6cb435ce0512c77d91f0cd8700a&units=metric`;
    
    

    try {
        // Fetch current weather data
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            // Update current weather display
            document.querySelector("#temp").innerHTML = `${Math.round(data.main.temp)}°C`;
            document.querySelector("#location").innerHTML = data.name;
            document.querySelector("#weather-description").innerHTML = data.weather[0].description;
            document.querySelector("#wind").innerHTML = `Wind speed: ${data.wind.speed} kmph`;
            document.querySelector("#precip").innerHTML = `Precip: ${data.rain ? data.rain['1h'] : '0'} mm`;
            document.querySelector("#pressure").innerHTML = `Pressure: ${data.main.pressure} mb`;
            document.querySelector("#humidity").innerHTML=`humidity: ${data.main.humidity} rh`

            // Set weather icon
            const weatherIcon = document.querySelector("#weather-info");
            const iconMapping = {
                "Clear": "clear.png",
                "Clouds": "clouds.png",
                "Rain": "rain.png",
                "Snow": "snow.png",
                "Drizzle": "drizzle.png",
                "Wind": "wind.png"
            };
            
        document.querySelector(".display").style.display = "block"
            weatherIcon.src = `images/${iconMapping[data.weather[0].main] || 'default.png'}`;
            
            // Fetch and display hourly forecast data
            const hourlyResponse = await fetch(hourlyApiUrl);
            const hourlyData = await hourlyResponse.json();
            displayHourlyForecast(hourlyData.list);

        } else {
            alert(data.message || "Weather data not available.");
            reset()
            
        }

    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Unable to fetch weather data.");
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastContainer = document.querySelector(".hourly-forecast");
    hourlyForecastContainer.innerHTML = ""; // Clear any existing content

    const next24Hours = hourlyData.slice(0, 8); // Adjust the slice as needed

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        const forecastElement = document.createElement('div');
        forecastElement.className = 'forecast-item';

        forecastElement.innerHTML = `
            <p>${hour}:00</p>
            <img aria-hidden="true" alt="${item.weather[0].description}" src="${iconUrl}" class="forecast-icon" />
            <p>${temperature}°C</p>
        `;

        hourlyForecastContainer.appendChild(forecastElement);
    });
}

document.querySelector("#searchBtn").addEventListener("click", () => {
    const cityName = document.querySelector("#searchInput").value;
    if (cityName) {
        checkWeather(cityName);
    }
});
