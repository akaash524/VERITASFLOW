import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
config()

export const verifyToken= async (req,res,next)=>{
    try{
    let token=req.cookies.token
    if(!token){
        return res.status(401).json({message:'Session expired please login...'})
    }
    let decodedToken=jwt.verify(token,process.env.JWT_SECRECT)
    req.user = decodedToken
    next()
    }catch(err){
        if(err.name==='JsonWebTokenError'){
            return res.status(403).json({message:'Token Expired. Please login Again'})
        }
    }
}