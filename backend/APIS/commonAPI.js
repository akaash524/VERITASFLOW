import exp from 'express'
import { authenticate, register } from '../SERVICES/authService.js'
import { userApp } from './userAPI.js'
import { UserModel } from '../MODELS/userModel.js'
import { compare,hash } from 'bcryptjs'
export const commonRouter=exp.Router()



//register 
commonRouter.post('/signup',async(req,res)=>{
    //get deatils 
    let userObj=req.body
    //use regiester to craete and insert and get user obj
    let newUserObj=await register(userObj)
    //send res
    res.status(200).json({message:'Registration Sucessfully Please login',payload:newUserObj})
})



//login
commonRouter.post('/login',async (req,res)=>{
    //getting the credentials
    let userCred=req.body
    //craete the token
    let { token , user }=await authenticate(userCred)
    //save as htttp cookie only 
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"lax",
        secure:false,
    })
    //send response
    res.status(200).json({ message:"Login Success", payload:user })

})

// logout
commonRouter.get('/logout',async(req,res)=>{
    //logout for user,author and admin
    res.clearCookie('token',{
        httpOnly:true,
        secure:false,
        sameSite:'lax'
    })
    //send response
    res.status(200).json({
        message:'logged out succesfully'
    })
})


//update the password
commonRouter.put('/change-password',async(req,res)=>{
    //get all details 
    let {email,currentPassword,newPassword}=req.body
    //find and get the user
    let user=await UserModel.findOne({email:email})
    //check the user existed
    if(!user){
        return res.status(404).json({maessage:'User Not found'})
    }
    //c ompare the passwords
    let check=await compare(currentPassword,user.password)
    //if not matched send res
    if(!check){
        return res.status(400).json({message:'Incorrect Old Password'})
    }
    //replace new password and save
    let newHashPassword=await hash(newPassword,10)
    user.password=newHashPassword
    await user.save()
    //send res
    res.status(200).json({message:'Password Updated Sucessfully'})
})

//