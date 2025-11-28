import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import "dotenv/config"

const ProtectRoute=async(req,res,next)=>{
    try {
        const token=req.headers.authorization.replace("Bearer ","");
        if(!token){
            return res.status(401).json({message: "No token, authorization denied"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({message: "User not found, authorization denied"});
        }
        req.user=user;
        next(); 
    } catch (error) {
        console.error("Auth middleware error:",error);
        res.status(401).json({message: "Token is not valid"});
    }
}
export default ProtectRoute;