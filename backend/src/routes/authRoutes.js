import express from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

const router = express.Router();

const generateToken = (userId) => {
    // Token generation logic here (e.g., using JWT)
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15d' });
}


router.post("/register",async(req,res)=>{
    try {
        const{email,username,password}=req.body;
        if(!email || !username || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }
        if(username.length<3){
            return res.status(400).json({message:"Username must be at least 3 characters long"});
        }

        //checking for existing user
        const existingEmail=await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message:"Email already in use"});
        }
        const existingUsername=await User.findOne({username});
        if(existingUsername){
            return res.status(400).json({message:"Username already in use"});
        }
        const profileImage=`https://api.dicebear.com/6.x/avataaars/png?seed=${username}`;

        //create new user
        const newUser=new User({
            email,
            username,
            password,
            profileImage
        })
  
        await newUser.save();

        const token= generateToken(newUser._id);
        res.status(201).json({
            token,
            user:{
                id:newUser._id,
                email:newUser.email,
                username:newUser.username,
                profileImage:newUser.profileImage,
                createdAt:newUser.createdAt
            }

        });

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({message:"Server error"});
    }
})


router.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }

        const isMatch=await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"});
        }
        
        const token=generateToken(user._id);
        res.status(200).json({
            token,
            user:{
                id:user._id,
                email:user.email,
                username:user.username,
                profileImage:user.profileImage,
                createdAt:user.createdAt
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({message:"Server error"});
    }
})

export default router;  