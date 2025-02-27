// https://api.openweathermap.org/data/2.5/forecast?q=mumbai&appid=f8619bb13757313574e9d1209340ca1c&units=metric

const http  = new slhttp();
const baseURL = "https://api.openweathermap.org/data/2.5/forecast";
const geoBaseURL = "http://api.openweathermap.org/geo/1.0/reverse"; 
const APIKey = "f8619bb13757313574e9d1209340ca1c";
const units = "metric";
const NO_OF_RECENT_FORECASTS = 6;

const cityForm = document.getElementById('cityForm');
const cityTextField = document.getElementById('cityTextField');
const alertMsg = document.getElementById('alertMsg');
const recentForecasts = document.getElementById('recentForecasts');
const currentPlace = document.getElementById('currentPlace');
const desc = document.getElementById('desc');
const currentTemp = document.getElementById('currentTemp');
const currentImg = document.getElementById('currentImg');
const realFeel = document.getElementById("realFeel");
const chanceOfRain = document.getElementById('chanceOfRain');
const windSpeed = document.getElementById('windSpeed');
const humidity = document.getElementById('humidity');

const months = ['Jan','Feb','Mar','Apr','MAy','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const times = { "0": "12 AM", "3": "3 AM", "6": "6 AM", "9": "9 AM", "12": "12 PM", "15": "3 PM", "18": "6 PM", "21": "9 PM"};
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function initializeEvents() {
    cityForm.addEventListener('submit', handleSubmit);
    document.addEventListener('DOMContentLoaded', getLocation())
}

function handleSubmit(evt) {
    evt.preventDefault();
    const inputText = cityTextField.value;
    if(inputText == "") {
        showAlert();
    } else {
        getData(inputText.trim());
    }  
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(handleLocation);
}

function handleLocation(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    const url = geoBaseURL + `?lat=${lat}` + `&lon=${lon}` + `&appid=${APIKey}`;

    http.get(url)
        .then(data => getData(data[0].name))
        .catch(err => console.warn(err));
}

function showAlert(time=5000) {
    alertMsg.style.display = 'block';
    setTimeout(() => alertMsg.style.display = 'none', 5000);
}

function getData(cityName) {
    const url = baseURL + `?q=${cityName}` + `&appid=${APIKey}` + `&units=${units}`;
    http.get(url)
        .then(data => loadUI(data))
        .catch(err => showAlert());
}

function loadUI(data) {
    currentPlace.innerHTML = data.city.name;
    manageCurrentForecast(data);
    manageRecentForecast(data.list);
    manageFutureForecasts(data.list);
    manageAirConditions(data.list);
}

function manageCurrentForecast(data) {
    smallestIndex = findSmallestIndex(data.list);

    // console.log(smallestIndex);
    desc.innerHTML = data.list[smallestIndex].weather[0].description;
    currentTemp.innerHTML = convertTemperature(data.list[smallestIndex].main.temp);
    currentImg.src = `https://openweathermap.org/img/wn/${data.list[smallestIndex].weather[0].icon}@2x.png`;
}

function manageFutureForecasts(data) {
    const daysArr = document.querySelectorAll('.day');
    const images = document.querySelectorAll(".image")
    const descriptions = document.querySelectorAll('.desc');
    const highTemps = document.querySelectorAll('.highTemp');
    const lowTemps = document.querySelectorAll('.lowTemp');

    let index = findSmallestIndex(data);

    for(let i=0; i<5; i++) {
        if(i==0)
            daysArr[i].innerHTML = 'Today';
        else
            daysArr[i].innerHTML = `${days[new Date(data[i*8].dt_txt).getDay()]}`;
        images[i].src = `https://openweathermap.org/img/wn/${data[index+i*8].weather[0].icon}@2x.png`;
        descriptions[i].innerHTML =`${data[index+i*8].weather[0].description}`;
        highTemps[i].innerHTML = convertTemperature(data[index+i*8].main.temp_max).substring(0,2);
        lowTemps[i].innerHTML = `/${convertTemperature(data[index+i*8].main.temp_min).substring(0,2)}`;
    }
}

function manageRecentForecast(data) {
    clearRecentForecasts();
    for(let i=0; i<NO_OF_RECENT_FORECASTS; i++) {
        const dateString = new Date(data[i].dt_txt);
        const temp = convertTemperature(data[i].main.temp);

        const DIV = document.createElement('DIV');
        DIV.className = 'd-flex flex-column justify-content-between align-items-center';

        const SPAN = document.createElement('SPAN');
        SPAN.className = 'text-gray-500 text-capitalize fw-bold fs-lg-6 fs-md-6 fs-sm-6 fs-7';
        SPAN.innerHTML = `${dateString.getDate()} ${months[dateString.getMonth()]} - ${times[dateString.getHours()]}`;

        const IMG = document.createElement('IMG');
        IMG.className = 'img-fluid w-50 h-50';
        IMG.src = `https://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png`;

        const tempDIV = document.createElement('DIV');
        tempDIV.className = 'fs-5 text-white fw-bolder';
        tempDIV.innerHTML = temp;

        DIV.appendChild(SPAN);
        DIV.appendChild(IMG);
        DIV.appendChild(tempDIV);

        recentForecasts.appendChild(DIV);

        if(i != NO_OF_RECENT_FORECASTS-1) {
            const borderDIV = document.createElement('DIV');
            borderDIV.className = 'vr border';
            recentForecasts.appendChild(borderDIV);
        }
    }
}

function manageAirConditions(data) {
    let index = findSmallestIndex(data);

    realFeel.innerHTML = convertTemperature(data[index].main.feels_like);
    chanceOfRain.innerHTML = `${data[index].pop * 100}%`;
    windSpeed.innerHTML = convertWindSpeed(data[index].wind.speed);
    humidity.innerHTML = `${data[index].main.humidity}%`;
}

function findSmallestIndex(data) {
    let smallestDiff = Infinity;
    let smallestIndex = 0;

    for(let i=0; i<NO_OF_RECENT_FORECASTS; i++) {
        let temp = Math.abs(new Date(data[i].dt_txt).getTime() - new Date().getTime());

        if(temp < smallestDiff) {
            smallestDiff = temp;
            smallestIndex = i;
        }
    }
    return smallestIndex;
}

function clearRecentForecasts() {
    while(recentForecasts.firstChild) {
        recentForecasts.firstChild.remove();
    }
}

initializeEvents();