import jwt from 'jsonwebtoken'
import {hash,compare} from 'bcryptjs'
import { UserModel } from '../MODELS/userModel.js'
import { config } from 'dotenv'
config()

export const authenticate=async ({email,password})=>{
    // get the user 
    let user=await UserModel.findOne({email})
    if(!user){
        const err=new Error("Invalid email");
        err.status=401
        throw err
    }
    // check password
    let passwordMatched=await compare(password,user.password)
    if(!passwordMatched){
        const err=new Error("Invalid password");
        err.status=401
        throw err
    }
    //check user is active
    if(user.isActive===false){
        const err=new Error('Your Account is please contact admin')
        err.status=403
        throw err
    }
    //create jwt token
    const token=jwt.sign({_id:user._id,role:user.role,email:user.email},
        process.env.JWT_SECRECT,
        {expiresIn:"1h"}
    )
    const userObj=user.toObject()
    delete userObj.password
    //send token and user details in res
    return {token,user:userObj};
    
}

export const register=async (userObj)=>{
    // craete document 
    const userDoc=new UserModel(userObj)
    //validate the empty password
    await userDoc.validate()
    // hash and replac ethe password
    userDoc.password=await hash(userDoc.password,10)
    //save
    const created = await userDoc.save()
    //convert the document into obj 
    const newUserObj=created.toObject()
    //remove password
    delete newUserObj.password
    //return user object without password
    return newUserObj
}