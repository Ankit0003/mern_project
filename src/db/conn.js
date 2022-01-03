const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/registration").then(()=>{
    console.log("Connection successful");
}).catch((e)=>{
    console.log("no connection");
})
