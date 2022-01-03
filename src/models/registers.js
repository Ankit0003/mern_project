const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    }
})

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