const https = require('https');

const apiKey= `43270b9e2390919f2b01b8dba56d6c43`;
//search function that calls fetchWeather function
exports.search = (req,res)=>{
    //req.query contains an object, which contains whatever thing after the ? in url. 
    //Ex, our url is locahlhost:3000/?city=melaka, thus req.query contains {city:melaka}
    const city = req.query.city;
    console.log('Searched city: '+city);
    fetchWeather(city,(data)=>{
        let json=JSON.parse(data);
        res.send(json);
    })
    
}

//fetch api from open weather map
const fetchWeather = (city,callback) =>{
    const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
    //fetch exist only in browser, use classic https get request here.
    console.log('this is fetchweather, city: '+city);

    https.get(url,res=>{
        console.log('this is https');
        let data='';
        res.on('data',chunk=>{
            data+=chunk; 
        });
        res.on('end',()=>{
            callback(data);
        });

        res.on('error',err=>{
            log(err.message);
        });
    })
}

exports.forecast=(req,res)=>{
    let {lat,lon} = req.query;
    fetchForecast(lat,lon,(data)=>{
        let json=JSON.parse(data);
        res.send(json);
    });
}

const fetchForecast=(lat,lon,callback)=>{
    let url=`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${apiKey}`;
   
    https.get(url,res=>{
        let data = '';
        res.on('data',chunk=>{
            data+=chunk;
        })
        res.on('end',()=>{
            callback(data);
        })
    })
}

exports.historical=(req,res)=>{
    let {lat,lon,dt} = req.query;
    fetchHistorical(lat,lon,dt,(data)=>{
        let json=JSON.parse(data);
        res.send(json);
    });
}
const fetchHistorical=(lat,lon,dt,callback)=>{
    let url=`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt-24*60*60}&units=metric&appid=${apiKey}`;
   
    https.get(url,res=>{
        let data = '';
        res.on('data',chunk=>{
            data+=chunk;
        })
        res.on('end',()=>{
            callback(data);
        })
    })
}