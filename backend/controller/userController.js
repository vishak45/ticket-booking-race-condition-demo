import userSchema from "../models/userSchema";
// import jwt and bycrypt
import  jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const checkEmail=await userSchema.findOne({email})
        if(checkEmail){
            return res.status(400).json({"message":"email already exists"})
        }
        const checkUsername=await userSchema.findOne({username})
        if(checkUsername){
            return res.status(400).json({"message":"username already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await userSchema.create({ username, email, password: hashedPassword });
        res.status(200).json({"message":"user registered successfully","user":user});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({"message":"internal server error"})
    }
}

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await userSchema.findOne({email})
        if(!user){
            return res.status(400).json({"message":"user not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({"message":"incorrect password"})
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.status(200).json({"message":"user logged in successfully","token":token})
    }
    catch(err)
    {
        console.log(err)
        res.status(500).json({"message":"internal server error"})
    }
}

module.exports={registerUser,loginUser}