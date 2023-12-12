'use sltrict'

// время
const time = document.querySelector('.time');

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;
    setTimeout(showTime, 1000);
}
showTime();


// дата
const newdate = document.querySelector('.date');

function showDate() {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentDate = date.toLocaleDateString('en-En', options);
    newdate.textContent = currentDate;
}
showTime(showDate()); // обновление даты в 00:00



// приветствие
const greeting = document.querySelector('.greeting');
const date = new Date();
const hours = date.getHours();

let timeOfDay;

function getTimeOfDay(hours) {
    if (hours >= 0 && hours < 6) {
        return timeOfDay = 'night';
    } else if (hours >= 6 && hours < 12) {
        return timeOfDay = 'morning';
    } else if (hours >= 12 && hours < 18) {
        return timeOfDay = 'afternoon';
    } else if (hours >= 18 && hours <= 23) {
        return timeOfDay = 'evening';
    }
};

let verifiedTimeOfDay = getTimeOfDay(hours);

function showGreeting() {
    const greetingText = `Good ${verifiedTimeOfDay},`;
    greeting.textContent = greetingText;
}
showTime(showGreeting()); // обновление приветствия при смене суток



// local storage
let userName = document.querySelector('.name');
let city = document.querySelector('.city');
// добавить остальные данные

function setLocalStorage() {
    localStorage.setItem('name', userName.value);
    localStorage.setItem('city', city.value);
    // добавить остальные данные
  }
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if(localStorage.getItem('name')) {
      userName.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
        getWeather(); // чтобы отобразилась погода в сохранённом городе
    }
    //добавить остальные данные
}
window.addEventListener('load', getLocalStorage);


// слайдер фона
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

let randomNum = getRandomNum(1, 20);

const body = document.querySelector('.body');

function setBg() {
    const bgNum = randomNum.toString().padStart(2, "0");
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/ElenaSinelle/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`
    //img.onload = () => {body.style.backgroundImage = "url('" + img.src + "')";} // устаревший метод
    img.addEventListener('load', () => {
        body.style.backgroundImage = "url('" + img.src + "')"; //запись для чтения img как переменной?
    })
}

setBg();

function getSlideNext() {
    randomNum++;
    if (randomNum === 21) {
        randomNum = 1;
    }
    setBg();
}

const slideNext = document.querySelector('.slide-next');
slideNext.addEventListener('click', getSlideNext);

function getSlidePrev() {
    randomNum--;
    if (randomNum === 0) {
        randomNum = 20;
    }
    setBg();
}

const slidePrev = document.querySelector('.slide-prev');
slidePrev.addEventListener('click', getSlidePrev);


// погода
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
//const city уже есть выше

async function getWeather() {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=39f3ac188021f7dc751132e456fa4fec&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (res.ok == false) {
        weatherDescription.textContent = 'City not found';
        temperature.textContent = ``;
        wind.textContent = ``;
        humidity.textContent = ``;
    }

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`); //id иконки погоды
    temperature.textContent = `${Math.round(data.main.temp)}°C`; //температура округл до целого
    weatherDescription.textContent = data.weather[0].description; //описание погоды
    wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`; //скорость ветра округл до целого
    humidity.textContent = `Humidity: ${Math.round(data.main.humidity)}%`; //влажность округл до целого
}

city.addEventListener('change', getWeather);
document.addEventListener('DOMContentLoaded', getWeather);


// цитата
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote')

async function getQuotes() {
    const quotes = 'data.json';
    const res = await fetch(quotes);
    const data = await res.json();
    let randomQuote = getRandomNum(0, 9);
    setTimeout(() => {
        quote.textContent = data[randomQuote].text;
        author.textContent = data[randomQuote].author;
    }, 100);
  }

getQuotes();

changeQuote.addEventListener('click', getQuotes);
window.addEventListener('load', getQuotes);




// простой плейер
import playList from './playList.js';
const playBtn = document.querySelector('.play');

const playNextBtn = document.querySelector('.play-next');
const playPrevBtn = document.querySelector('.play-prev');
const playListContainer = document.querySelector('.play-list');
const trackName = document.querySelector('.track-name');
const progressBar = document.querySelector('#progress-bar');

playList.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = item.title;
    li.style.display = "flex";
    li.style.flexDirection = "row";
    li.style.justifyContent = "space-between";
    playListContainer.append(li);
})

const tracks = playListContainer.querySelectorAll('li');
playListContainer.style.marginTop = "10px";

tracks.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('play-small');
    div.src = "../assets/svg/play.svg";
    item.append(div);
})

const buttons = playListContainer.querySelectorAll('.play-small');

const audio = new Audio();
let isPlay = false;
let playNum = 0;
audio.src = playList[playNum].src;

function playAudio() {
    setInterval(updateProgressValue, 100); // обновление прогресса звучания каждые 1/10 сек
    if (!isPlay) {
        audio.play();
        playBtn.classList.add('pause');
        isPlay = true;
        highlightTrack();
        highlightBtn();
        trackName.textContent = playList[playNum].title;
    } else {
        audio.pause();
        playBtn.classList.remove('pause');
        isPlay = false;
        buttons[playNum].classList.remove('pause-small');
    }
    audio.onended = function(){
        playNext();
      } //последовательное воспороизведение всех треков
}

playBtn.addEventListener('click', playAudio);

function playNext() {
   if (!isPlay) {
        playNum++;
        if (playNum > playList.length - 1) {
            playNum = 0;
        }
        audio.src = playList[playNum].src;
        playAudio();
   } else {
        audio.pause();
        playNum++;
        if (playNum > playList.length - 1) {
            playNum = 0;
        }
        audio.src = playList[playNum].src;
        setTimeout(() => audio.play(), 500);//задержка перед воспроизведением следующего трека
        isPlay = true;
        highlightTrack();
        highlightBtn();
        trackName.textContent = playList[playNum].title;
        setInterval(updateProgressValue, 100); // // обновление прогресса звучания каждые 1/10 сек
    }
}

function playPrev() {
    if (!isPlay ) {
        playNum--;
        if (playNum < 0) {
            playNum = playList.length - 1;
        }
        audio.src = playList[playNum].src;
        playAudio();
    } else {
        audio.pause();
        playNum--;
        if (playNum < 0) {
            playNum = playList.length - 1;
        }
        audio.src = playList[playNum].src;
        setTimeout(() => audio.play(), 500);//задержка перед воспроизведением предыдущего трека
        highlightTrack();
        highlightBtn();
        trackName.textContent = playList[playNum].title;
        setInterval(updateProgressValue, 100); // обновление прогресса звучания каждые 1/10 сек
    }
}

playNextBtn.addEventListener('click', playNext);
playPrevBtn.addEventListener('click', playPrev);

function highlightTrack () {
    for (let elem of tracks) {
        elem.classList.remove('item-active');
    }
    tracks[playNum].classList.add('item-active');

}
function highlightBtn () {
    for (let elem of buttons) {
        elem.classList.remove('pause-small');
    }
    buttons[playNum].classList.add('pause-small');
}


// продвинутый плейер
// обновление прогресса звучания
function updateProgressValue() {
    progressBar.max = audio.duration;
    progressBar.value = audio.currentTime;
    document.querySelector('.currentTime').textContent = `${(formatTime(Math.floor(audio.currentTime)))} / `;
    if (document.querySelector('.durationTime').textContent === undefined) {
        document.querySelector('.durationTime').textContent = "00:00";
    } else {
        document.querySelector('.durationTime').textContent = (formatTime(Math.floor(audio.duration)));
    }
};

// преобразование audio.currentTime и audio.duration в MM:SS
function formatTime(seconds) {
    let min = Math.floor((seconds / 60));
    let sec = Math.floor(seconds - (min * 60));
    if (sec < 10){
        sec  = `0${sec}`;
    };
    if (min < 10){
        min  = `0${min}`;
    };
    return `${min}:${sec}`;
};

//изменение значения progressBar.value при перетаскивании бегунка
function changeProgressBar() {
    audio.currentTime = progressBar.value;
};
progressBar.addEventListener("input", changeProgressBar);

// звук  вкл/выкл
audio.muted = false;
const soundImg = document.querySelector('.sound');

soundImg.addEventListener('click', function(){
  audio.muted = (audio.muted === true)? false: true;
  soundImg.src = (audio.muted === true)? soundImg.classList.add('sound-off') : soundImg.classList.remove('sound-off');
});

const soundRange = document.getElementById('sound-rande');
function volumeChange() {
    audio.volume = soundRange.value;
}

soundRange.addEventListener ("change", volumeChange);




//настройки
const settings = document.querySelector('.settings');
const settingsBtnOpen = document.querySelector('.open-settings');
const settingsBtnClose = document.querySelector('.close-settings')

function openSettings () {
    settings.classList.add('settings-active');
    settingsBtnOpen.style.opacity = '0';
}

function closeSettings () {
    settings.classList.remove('settings-active');
    settingsBtnOpen.style.opacity = '1';
}

settingsBtnOpen.addEventListener('click', openSettings);
settingsBtnClose.addEventListener('click', closeSettings);

const hideCalendar = settings.querySelector('.calendar-input');
const hideTime = settings.querySelector('.clock-input');
const hideGreeting = settings.querySelector('.greeting-input');
const hideQuote = settings.querySelector('.quote-input');
const hidePlayer = settings.querySelector('.player-input');
const hideWeather = settings.querySelector('.weather-input');

const player = document.querySelector('.player');
const weather = document.querySelector('.weather');
const greetingBox = document.querySelector('.greeting-container');
const quoteBox = document.querySelector('.quote-container');

hideTime.addEventListener("change", ()=>{
    if(hideTime.checked){
        time.style.opacity = '1';
    } else {
        time.style.opacity = '0';
    }
});

hideCalendar.addEventListener("change", ()=>{
    if(hideCalendar.checked){
        newdate.style.opacity = '1';
    } else {
        newdate.style.opacity = '0';
    }
});

hideGreeting.addEventListener("change", ()=>{
    if(hideGreeting.checked){
        greetingBox.style.opacity = '1';
    } else {
        greetingBox.style.opacity = '0';
    }
});

hideQuote.addEventListener("change", ()=>{
    if(hideQuote.checked){
        quoteBox.style.opacity = '1';
    } else {
        quoteBox.style.opacity = '0';
    }
});

hidePlayer.addEventListener("change", ()=>{
    if(hidePlayer.checked){
        player.style.opacity = '1';
    } else {
        player.style.opacity = '0';
    }
});

hideWeather.addEventListener("change", ()=>{
    if(hideWeather.checked){
        weather.style.opacity = '1';
    } else {
        weather.style.opacity = '0';
    }
});