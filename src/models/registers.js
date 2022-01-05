const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Email invalid");
            }
        },
        unique: true
    },
    psw:{
        type: String,
        required: true
    },
    psw_repeat:{
        type: String,
        required: true 
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})

registerSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id},"mynameisankitkumarandiampracingmernstack");
        this.tokens = this.tokens.concat({token:token});
      //  await this.save();
        return token;
    } catch (error) {
        res.send("Cannot able to create token");
    }
}

registerSchema.pre("save",async function(next){
    if(this.isModified("psw"))
    {
        this.psw = await bcrypt.hash(this.psw,10);
    }
    this.psw_repeat = undefined;
    next();
})

const register = mongoose.model('Register',registerSchema);

module.exports = register;