const express=require('express');
const app=express();

//view engine
app.set('view engine','ejs');

//use
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static(__dirname+'/public'));


//routing
const indexRouter=require('./route/indexRouter');
app.use('/',indexRouter);

//Hosting
app.listen(process.env.PORT || 3000, ()=>{
    console.log('App is running at port 3000...');
});