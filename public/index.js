let interval;
let weather = {
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
        

    },
    //get time in milliseconds
    getTimeMil(data){
        let t= new Date();
        
        return t.getTime()+t.getTimezoneOffset()*60000+data.timezone*1000;
    },
    //get local time
    getTime(data){
        
        let time=new Date(this.getTimeMil(data));
        return time.toLocaleTimeString();
    },
    //get local date
    getDate(data){
        
        let d=new Date(this.getTimeMil(data));

        const months=["January","Febuary","March","April","May","June","July","August","September","October","November","December"];
        const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        
        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();

        return `${day}, ${date} ${month} ${year}`;
    },
    //get sunrise time
    getSunrise(data){
        let t= new Date();
        return data.sys.sunrise*1000+t.getTimezoneOffset()*60000+data.timezone*1000;
    },
    //get sunset time
    getSunset(data){
        let t= new Date();
        return data.sys.sunset*1000+t.getTimezoneOffset()*60000+data.timezone*1000;
    },
    //themes
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
    //forecast
    fetchForecast(weatherData){
        fetch(`/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}`)
        .then(response=>response.json())
        .then(forecastData=>this.displayForecast(forecastData));
    },
    displayForecast(forecastData){
        console.log(forecastData);
        document.querySelector('.tomorrowIcon').src="http://openweathermap.org/img/wn/"+forecastData.daily[0].weather[0].icon+"@2x.png";
        document.querySelector('.tomorrowTemp').innerHTML = Math.round(forecastData.daily[0].temp.day)+'&deg;C'
    },
    //historical data
    fetchHistorical(weatherData){
        fetch(`/historical?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&dt=${weatherData.dt}`)
        .then(response=>response.json())
        .then(historicalData=>this.displayHistorical(historicalData));
    },
    displayHistorical(historicalData){
        console.log(historicalData);
        document.querySelector('.yesterdayIcon').src="http://openweathermap.org/img/wn/"+historicalData.current.weather[0].icon+"@2x.png";
        document.querySelector('.yesterdayTemp').innerHTML = Math.round(historicalData.current.temp)+'&deg;C'
        this.removeInput();
    },
    //remove input on searchbar after search
    removeInput(){
        document.querySelector('#searchbar').value='';
    }
}

//search functions
document.querySelector("#searchbox").addEventListener("submit", (e)=>{ 
    e.preventDefault();
    //api call to backend, passing user input
    //backend responses with weather data object
    let api=`/search?city=${document.querySelector('#searchbar').value}`;
    fetch(api)
    .then(response=>response.json())
    .then((data)=>{
        weather.displayWeather(data);
        weather.fetchForecast(data);
        weather.fetchHistorical(data);
    });
})
