let interval;
let weather = {
    apiKey: `43270b9e2390919f2b01b8dba56d6c43`,
    fetchWeather(query){
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&APPID=${this.apiKey}`
        ).then((response)=>response.json())
        .then((data)=>{
            this.displayWeather(data);
            this.forecast(data);
            this.historical(data);
        });
    },
    getTimeMil(data){
        let t= new Date();
        
        return t.getTime()+t.getTimezoneOffset()*60000+data.timezone*1000;
    },
    getDate(data){
        
        let d=new Date(this.getTimeMil(data));

        const months=["January","Febuary","March","April","May","June","July","August","September","October","November","December"];
        const days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        
        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day}, ${date} ${month} ${year}`;
    },
    getTime(data){
        
        let time=new Date(this.getTimeMil(data));
        return time.toLocaleTimeString();
    },
    getSunrise(data){
        let t= new Date();
        return data.sys.sunrise*1000+t.getTimezoneOffset()*60000+data.timezone*1000;
    },
    getSunset(data){
        let t= new Date();
        return data.sys.sunset*1000+t.getTimezoneOffset()*60000+data.timezone*1000;
    },
    displayWeather(data){
        
        const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp}=data.main;
        console.log(data);
        //main info
        document.querySelector('.city').innerText = name;
        document.querySelector('.temperature').innerHTML = Math.round(temp)+'&deg;<span>C</span>';
        document.querySelector('.weatherDesc').innerText = description.split(" ").map(word => word[0].toUpperCase()+word.slice(1)).join(" ");
        //secondary info
        document.querySelector('.nowIcon').src = "http://openweathermap.org/img/wn/"+icon+"@2x.png";
        document.querySelector('.date').innerText = this.getDate(data);
        //clock
        document.querySelector('.time').innerText=this.getTime(data);
        clearInterval(interval);
        interval=setInterval(() => {
            document.querySelector('.time').innerText=this.getTime(data);
        }, 1000);
        
        //hide the display before search
        document.querySelector(".mainInfo").classList.remove('loading');
        document.querySelector(".secInfo").classList.remove('loading');
        document.querySelector(".forecast").classList.remove('loading');
        document.querySelector(".clock").classList.remove('loading');
        //change theme
        if(this.getTimeMil(data)>this.getSunrise(data) && this.getTimeMil(data)<this.getSunset(data)){
            if(temp>=30){
                this.hotTheme();
            }else{
                this.coldTheme();
            }
        }else{
            this.nightTheme();
        }
        //change background image 
        document.body.style.backgroundImage = `url("https://source.unsplash.com/1920x3400?${name}")`
        //remove user input after search
        this.removeInput();

    },
    search(){
        this.fetchWeather(document.querySelector("#searchbar").value)
    },
    removeInput(){
        document.querySelector('#searchbar').value = ''; 
    },
    hotTheme(){
        document.querySelector('.container').style.backgroundImage = 'linear-gradient(to bottom, rgba(255,165,0,0.2),rgb(135,206,235))';
        document.querySelector('#searchbox').style.background='rgba(255,165,0,0.5)';
        document.querySelector('.temperature').style.color='rgba(255,165,0)'
        document.querySelector('.clock').style.backgroundColor= 'rgba(255,165,0,0.8)';
        document.querySelector('.time').style.color= 'white';
    },
    coldTheme(){
        document.querySelector('.container').style.backgroundImage = 'linear-gradient(to bottom,rgba(135,206,235,0.2),rgb(135,206,235))';
        document.querySelector('#searchbox').style.background='rgba(255,255,255,0.5)';
        document.querySelector('.temperature').style.color='white'
        document.querySelector('.clock').style.backgroundColor= 'rgba(255,255,255,0.8)';
        document.querySelector('.time').style.color= 'skyblue';
    },
    nightTheme(){
        document.querySelector('.container').style.backgroundImage = 'linear-gradient(to bottom,rgba(0,0,139,0.4),black)';
        document.querySelector('#searchbox').style.background='rgba(0,0,139,0.5)';
        document.querySelector('.temperature').style.color='white'
        document.querySelector('.clock').style.backgroundColor= 'rgba(0,0,139,0.8)';
        document.querySelector('.time').style.color= 'white';
    },
    forecast(weatherData){
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${this.apiKey}`)
        .then((response)=>response.json())
        .then((forecastData)=>this.displayForecast(forecastData));
    },
    displayForecast(forecastData){
        console.log(forecastData);
        document.querySelector('.tomorrowIcon').src="http://openweathermap.org/img/wn/"+forecastData.daily[0].weather[0].icon+"@2x.png";
        document.querySelector('.tomorrowTemp').innerHTML = Math.round(forecastData.daily[0].temp.day)+'&deg;C'
    },
    historical(weatherData){
        console.log(new Date(weatherData.dt*1000-24*60*60*1000));
        fetch(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&dt=${weatherData.dt-24*60*60}&units=metric&appid=${this.apiKey}`)
        .then(response=>response.json())
        .then(historicalData=>this.displayHistorical(historicalData));
    },
    displayHistorical(historicalData){
        console.log(historicalData);
        document.querySelector('.yesterdayIcon').src="http://openweathermap.org/img/wn/"+historicalData.current.weather[0].icon+"@2x.png";
        document.querySelector('.yesterdayTemp').innerHTML = Math.round(historicalData.current.temp)+'&deg;C'
    }
}

//search functions
document.querySelector(".searchButton").addEventListener("click", ()=>{
    weather.search();
})
document.querySelector("#searchbar").addEventListener('keyup', (e)=>{
    if(e.key == 'Enter'){
        weather.search();
    }
})

