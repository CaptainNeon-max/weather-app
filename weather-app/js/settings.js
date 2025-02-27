const LOCAL_STORAGE_SETTINGS_KEY = "settings";
const temperature = document.getElementById('temperature');
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const precipitation = document.getElementById("precipitation");
const distance = document.getElementById("distance");

function setSettingsToLocalStorage() {
    if(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) == null) {
        const settings = {
            "temperature": "celsius",
            "windSpeed": "m/s",
            "pressure": "mm",
            "precipitation": "inches",
            "distance": "kilometers"
        };

        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    }
}

function setActiveButtons() {
    const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
    document.getElementById(settings.temperature.toLowerCase()).classList.add('active');
    document.getElementById(settings.windSpeed.replace("/","").toLowerCase()).classList.add("active");
    document.getElementById(settings.pressure.replace("/","").toLowerCase()).classList.add("active");
    document.getElementById(settings.precipitation.toLowerCase()+"Precipitation").classList.add("active");
    document.getElementById(settings.distance.toLowerCase()).classList.add("active");
}

function initializeEvents() {
    temperature.addEventListener('click', handleTemperatureClick);
    windSpeed.addEventListener('click', handleWindSpeedClick);
    pressure.addEventListener('click', handlePressureClick);
    precipitation.addEventListener('click', handlePrecipitationClick);
    distance.addEventListener('click', handleDistanceClick);
}

function handleTemperatureClick(evt) {
    evt.preventDefault();
    if(evt.target.matches("button"))
            changeValueInLocalStorage("temperature", evt.target.textContent.trim());
}

function handleWindSpeedClick(evt) {
    evt.preventDefault();
    if(evt.target.matches("button"))
            changeValueInLocalStorage("windSpeed", evt.target.textContent.trim());
}

function handlePressureClick(evt) {
    evt.preventDefault();
    if(evt.target.matches("button"))
            changeValueInLocalStorage("pressure", evt.target.textContent.trim());
}

function handlePrecipitationClick(evt) {
    evt.preventDefault();
    if(evt.target.matches("button"))
            changeValueInLocalStorage("precipitation", evt.target.textContent.trim());
}

function handleDistanceClick(evt) {
    evt.preventDefault();
    if(evt.target.matches("button"))
            changeValueInLocalStorage("distance", evt.target.textContent.trim());
}

function changeValueInLocalStorage(key, value) {
    const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
    settings[key] = value;
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY,JSON.stringify(settings));
}

setSettingsToLocalStorage();
setActiveButtons()
initializeEvents();