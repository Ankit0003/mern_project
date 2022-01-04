const mongoose = require('mongoose');

const dbname  = process.env.DB_NAME;
mongoose.connect("mongodb://localhost:27017/"+dbname).then(()=>{
    console.log("Connection successful");
}).catch((e)=>{
    console.log("no connection");
})
