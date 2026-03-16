import { model,Schema } from "mongoose";

const userSchema=new Schema({
    firstName:{
        type:String,
        minLength:[4,'Minimum 4 characters are required'],
        required:[true,'First Name is required']
    },
    lastName:{
        type:String,
        minLength:[4,'Minimum 4 characters are required'],
        required:[true,'Last Name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true
    },
    password:{
        type:String,
        minLength:[4,'Password must contain 4 characters'],
        required:[true,'Password is required']
    },
    role:{
        type:String,
        enum:["USER","MANAGER","SENIOR_MANAGER","COMPLIANCE_OFFICER","ADMIN"],
        required:[true,'Role is required']
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true,
    strict:"throw",
    versionKey:false

})

export const UserModel=model('user',userSchema);