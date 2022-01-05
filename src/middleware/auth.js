const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth =  async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;
    //    console.log(token);
        const verify = jwt.verify(token,"mynameisankitkumarandiampracingmernstack");
        console.log(verify);

        const user = await Register.findOne({_id:verify._id});
        console.log(user);

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send("Error occur");
    }
}
module.exports = auth;