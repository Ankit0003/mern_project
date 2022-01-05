require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');

require("./db/conn");
const registerUser = require('./models/registers');

const app = express();
const port = process.env.PORT || 3000;

const staticPath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));

app.use(express.static(staticPath));
app.set("view engine","hbs");
app.set("views",templatepath);
hbs.registerPartials(partialpath);

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/secret",auth,(req,res)=>{
    //console.log(req.cookies.jwt);
    res.render("index");
})
app.get("/logout",auth,(req,res)=>{
    try {

        res.send("Logout successfully");
        
    } catch (error) {
        res.status(400).send(error);
    }
})
app.get("/login",(req,res)=>{
    res.render('login');
})
app.get("/students/:id",async(req,res)=>{

    try {
        const _id = req.params.id;
        const searchId = await registerUser.findById({_id:_id});
        res.send(searchId);

    } catch (error) {
        res.send("Cannot able to find");
    }
})


app.post('/register',async(req,res)=>{
    try{
        //console.log(req.body);
    const newRegister = new registerUser(req.body);
    //console.log(newRegister);

    const token = await newRegister.generateAuthToken();
    
    console.log(token);
    res.cookie("jwt",token,{
        expires:new Date(Date.now() + 300000),
        httpOnly:true
    });
    const registered = await newRegister.save();
 //   console.log(registered);
    res.status(201).render('index');
    }
    catch(error){
        res.status(400).send("Cannot able to create user");
    }
})

app.post('/login',async(req,res)=>{
    try{

        const email = req.body.email;
        const password = req.body.password;

        const userDetails = await registerUser.findOne({email:email});
      //  console.log(userDetails.psw,password);
      const isMatch = bcrypt.compare(password,userDetails.psw);
     
      const token = await userDetails.generateAuthToken();
    
       // console.log(token);

        res.cookie("jwt",token,{
            expires:new Date(Date.now() + 300000),
            httpOnly:true
        });
        if(isMatch){
            res.status(200).send("Login successful");
        }
        else{
            res.status(400).send("Invalid details");
        }

    }catch(error){
        res.status(400).send("Invalid details");
    }
})

app.listen(port, ()=>{
    console.log("server listening");
})