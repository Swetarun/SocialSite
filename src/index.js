const express = require('express')
const app = express()
const mongoose = require('mongoose')
const route = require('./route/route')
const multer= require("multer");

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use( multer().any())

mongoose.connect("mongodb+srv://Swetarun:lBf6gTedHw2tfPtQ@cluster0.ebg8a.mongodb.net/wowTalent", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch( err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT || 5000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 5000))
});