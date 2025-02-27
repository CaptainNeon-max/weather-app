const LOCAL_STORAGE_SETTINGS_KEY = "settings";
const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY));
const temperature = settings.temperature;
const wSpeed = settings.windSpeed;
const precipitation = settings.precipitation;

function convertTemperature(temp) {
    if(temperature === "fahrenheit") {
        return `${Math.round((temp * (9/5)) + 32)}<sup>o</sup>`;
    } 
    return `${Math.round(temp)}<sup>o</sup>`;
}

function convertWindSpeed(ws) {
    if(wSpeed == "km/h") {
        return `${Math.round(ws * 3.6)} km/h`;
    }
    if(wSpeed == "knots") {
        return `${Math.round(ws * 1.94384)} knots`;
    }
    return `${Math.round(ws)} m/s`;
}