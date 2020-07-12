const express = require('express')
const app = express()
const cors = require('cors')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')

app.use(cors());

// const configuration = require('./configuration')

// var dbdetails = configuration.dbdetails;


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));

const PORT =  process.env.PORT || 4000;

const PORT =   4000;

 const URL = 'mongodb://127.0.0.1:27017/remainders'; 

// const URL = 'mongodb+srv://'+dbdetails.username+':'+dbdetails.password+'@'+dbdetails.host+'/'+dbdetails.database+'?retryWrites=true&w=majority';

mongoose.connect(URL, {useNewUrlParser : true},(err) => {
    if (err) {
    	console.log(err)
        console.log('Error while Connecting!')
    } else {
        console.log('Connected to Mongo DB')
    }
})


app.get('/',function(req,res){
    res.send("Welcome to  Remainder services")
})


const RemainderRoute = require('./Routers/RemainderRoute');
app.use('/remainder', RemainderRoute);

const UserRoute = require('./Routers//UserRoute');
app.use('/user', UserRoute);


app.listen(PORT, () => {
    console.log('Server Started on PORT ' + PORT)
})