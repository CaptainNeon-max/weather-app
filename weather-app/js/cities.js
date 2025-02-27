const LOCAL_STORAGE_CITIES_KEY = "cities";

const http  = new slhttp();
const baseURL = "https://api.openweathermap.org/data/2.5/forecast";
const APIKey = "f8619bb13757313574e9d1209340ca1c";
const units = "metric";

const cityForm = document.getElementById('cityForm');
const cityTextField = document.getElementById('cityTextField');
const alertMsg = document.getElementById('alertMsg');
const weatherCards = document.getElementById("weatherCards");

const currentCityName = document.getElementById("currentCityName");
const CurrentPOP = document.getElementById("CurrentPOP");
const currentTemp = document.getElementById("currentTemp");
const currentImg = document.getElementById("currentImg");

const months = ['Jan','Feb','Mar','Apr','MAy','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const times = { "0": "12 AM", "3": "3 AM", "6": "6 AM", "9": "9 AM", "12": "12 PM", "15": "3 PM", "18": "6 PM", "21": "9 PM"};
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let isFirst = true;
let selectedCity = null;

function initializeEvents() {
    cityForm.addEventListener('submit', handleSubmit);
}

function addCitiesToLocalStorage() {
    if(localStorage.getItem(LOCAL_STORAGE_CITIES_KEY) == null) {
        const cities = ["mumbai","delhi","ulhasnagar"];
        localStorage.setItem(LOCAL_STORAGE_CITIES_KEY, JSON.stringify(cities));
    }
}

function addCities() {
    const cities = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CITIES_KEY));
    cities.forEach(city => addCityIfAvailable(city,true));
}

function showAlert(time=5000) {
    alertMsg.style.display = 'block';
    setTimeout(() => alertMsg.style.display = 'none', 5000);
}

function handleSubmit(evt) {
    evt.preventDefault();
    console.log("Hi");
    const inputText = cityTextField.value;
    if(inputText == "") {
        showAlert();
    } else {
        addCityIfAvailable(inputText,false);
    }  
}

function handleClick(evt) {
    const currentWeatherCard = evt.currentTarget;
    const selectedWeatherCard = document.querySelector(`div[data-city="${selectedCity}"]`);
    const cityName = currentWeatherCard.getAttribute("data-city");
    
    if(selectedCity !== cityName) {
        selectedCity = cityName;
        loadSidePanel(cityName);

        currentWeatherCard.classList.remove("bg-secondary");
        currentWeatherCard.classList.add("border");
        currentWeatherCard.classList.add("border-blue");
        currentWeatherCard.classList.add("bg-transparent");

        selectedWeatherCard.classList.add("bg-secondary");
        selectedWeatherCard.classList.remove("border");
        selectedWeatherCard.classList.remove("border-blue");
        selectedWeatherCard.classList.remove("bg-transparent");
    }
}

function addCityIfAvailable(cityName,isAddingFromLocalStorage) {
    let cities = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CITIES_KEY));
    if(isAddingFromLocalStorage || !cities.includes(cityName)) {
        const url = baseURL + `?q=${cityName}` + `&appid=${APIKey}` + `&units=${units}`;
        http.get(url)
            .then(data => addCity(data,isAddingFromLocalStorage))
            .catch(err => showAlert());
        if(!isAddingFromLocalStorage) {
            cities.push(cityName);
            localStorage.setItem(LOCAL_STORAGE_CITIES_KEY, JSON.stringify(cities));
            loadSidePanel(cityName);
        }
    }
}

function addCity(data, isAddingFromLocalStorage) {
    let smallestIndex = findSmallestIndex(data.list);

    const DIV = document.createElement('DIV');
    DIV.setAttribute("data-city", data.city.name);
    if(isFirst) {
        DIV.className = "d-flex justify-content-between align-items-center rounded-4 border border-blue bg-transparent text-white px-4 py-lg-0 py-xl-0 py-3 my-3";
        loadSidePanel(data.city.name);
        selectedCity = data.city.name;
        isFirst = !isFirst;
    } else {
        DIV.className = "d-flex justify-content-between align-items-center rounded-4 bg-secondary text-white px-4 py-lg-0 py-xl-0 py-3 my-3";
    }
    const innerDIV = document.createElement('DIV');
    innerDIV.className = "d-flex align-items-center gap-2";
    
    const IMG = document.createElement('IMG');
    IMG.className = "img-fluid";
    IMG.src = `https://openweathermap.org/img/wn/${data.list[smallestIndex].weather[0].icon}@2x.png`;
    
    const cityNameDIV = document.createElement('DIV');
    cityNameDIV.className = "d-flex flex-column justify-content-between align-items-start";

    const cityNameSPAN = document.createElement('SPAN');
    cityNameSPAN.className = "text-gray-400 fs-lg-2x fs-xl-2x fw-bold";
    cityNameSPAN.appendChild(document.createTextNode(data.city.name));

    const descSPAN = document.createElement('SPAN');
    descSPAN.className = "text-gray-500";
    descSPAN.appendChild(document.createTextNode(data.list[smallestIndex].weather[0].description));

    const tempSPAN = document.createElement('SPAN');
    tempSPAN.className = "fs-1";
    tempSPAN.innerHTML = convertTemperature(data.list[smallestIndex].main.temp);

    cityNameDIV.appendChild(cityNameSPAN);
    cityNameDIV.appendChild(descSPAN);
    innerDIV.appendChild(IMG);
    innerDIV.appendChild(cityNameDIV);
    DIV.appendChild(innerDIV);
    DIV.appendChild(tempSPAN);

    weatherCards.appendChild(DIV);
    DIV.addEventListener('click',handleClick);
    if(!isAddingFromLocalStorage)
        DIV.click();
}

function findSmallestIndex(data) {
    let smallestDiff = Infinity;
    let smallestIndex = 0;
    let n = 6;
    for(let i=0; i<n; i++) {
        let temp = Math.abs(new Date(data[i].dt_txt).getTime() - new Date().getTime());

        if(temp < smallestDiff) {
            smallestDiff = temp;
            smallestIndex = i;
        }
    }
    return smallestIndex;
}    

function loadSidePanel(cityName) {
    const url = baseURL + `?q=${cityName}` + `&appid=${APIKey}` + `&units=${units}`;
    http.get(url)
        .then(data => {
            manageCurrentForecast(data);
            manageTodaysForecast(data.list);
            manageFutureForecasts(data.list);
        })
        .catch(err => showAlert());
}

function manageCurrentForecast(data) {
    let smallestIndex = findSmallestIndex(data.list);

    currentCityName.innerHTML = data.city.name;
    CurrentPOP.innerHTML = `${data.list[smallestIndex].pop * 100}%`;
    currentTemp.innerHTML = convertTemperature(data.list[smallestIndex].main.temp);
    currentImg.src = `https://openweathermap.org/img/wn/${data.list[smallestIndex].weather[0].icon}@4x.png`;
}

function manageTodaysForecast(data) {
    let smallestIndex = findSmallestIndex(data);
    let n = 3;

    const timesArr = document.querySelectorAll(".todayTime");
    const imgsArr = document.querySelectorAll(".todayImg");
    const tempsArr = document.querySelectorAll(".todayTemp");

    for(let i=0; i<n; i++) {
        let dateString = new Date(data[smallestIndex].dt_txt);
        timesArr[i].innerHTML = `${dateString.getDate()} ${months[dateString.getMonth()]} - ${times[dateString.getHours()]}`;
        imgsArr[i].src = `https://openweathermap.org/img/wn/${data[smallestIndex].weather[0].icon}@2x.png`;
        tempsArr[i].innerHTML = convertTemperature(data[smallestIndex].main.temp);
        smallestIndex++;
    }
}

function manageFutureForecasts(data) {
    let smallestIndex = findSmallestIndex(data);
    let n=3;

    const daysArr = document.querySelectorAll(".day");
    const futureImgsArr = document.querySelectorAll(".futureImg");
    const descriptionsArr = document.querySelectorAll(".desc");
    const futureTempHighArr = document.querySelectorAll(".futureTempHigh");
    const futureTempLowArr = document.querySelectorAll(".futureTempLow");

    for(let i=0; i<n; i++) {
        if(i==0)
            daysArr[i].innerHTML = 'Today';
        else
            daysArr[i].innerHTML = `${days[new Date(data[i*8].dt_txt).getDay()]}`;
        futureImgsArr[i].src = `https://openweathermap.org/img/wn/${data[smallestIndex+i*8].weather[0].icon}@4x.png`;
        descriptionsArr[i].innerHTML =`${data[smallestIndex+i*8].weather[0].description}`;
        futureTempHighArr[i].innerHTML = convertTemperature(data[smallestIndex+i*8].main.temp_max).substring(0,2);
        futureTempLowArr[i].innerHTML = `/${convertTemperature(data[smallestIndex+i*8].main.temp_min).substring(0,2)}`;
    }
}

initializeEvents();
addCitiesToLocalStorage();
addCities();