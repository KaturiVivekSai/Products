const bcrypt = require("bcryptjs")
const User = require("../models/user")
const {makeToken} = require("../utils/makeToken");

exports.register = async(req,res,next) => {
    try{
        const {name, email, password, confirmPassword} = req.body;
        if(!name){
            return res.status(404).json({
                message : "Name not found"
            })
        }
        if(!email){
            return res.status(404).json({
                message : "Email not found"
            })
        }
        if(!password || !confirmPassword){
            return res.status(404).json({
                message : "Enter Password and Confirm Password"
            })
        }
        if(password !== confirmPassword){
            return res.status(404).json({
                message : "Password and Confirm Password not same"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password : hashedPassword
        })
        return res.status(200).json({
            id : user._id,
            name : user.name,
            email : user.email
        })
    } catch(err){
        next(err);
    }
}

exports.login =  async(req,res,next) =>{
    try{
        const {email, password} = req.body;
        if(!email){
            return res.status(404).json({
                message : "email not found"
            })
        }

        if(!password){
            return res.status(404).json({
                message : "password not found"
            })
        }

        const user = await User.findOne({email}).select("+password");

        if(!user){
            return res.status(404).json({
                message : "User doesn't exists"
            })
        }
        
        const ok = await bcrypt.compare(password,user.password);
        
        if(!ok){
             return res.status(404).json({
                message : "Invalid email or password"
            })
        }

        res.status(200).json({
            token : makeToken(user)
        })
    }
    catch(err){
        next(err);
    }
}
