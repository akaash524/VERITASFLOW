import { Schema,model } from "mongoose";
const historySchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:[true,'Aprover ID is required']
    },
    action:{
        type:String,
        enum:["Approved","Rejected"],
        required:[true,"Action is required"]
    },
    comments:{
        type:String,
    },
    level:{
        type:Number,
        required:[true,'Level ID is required']
    }
},{
    timestamps:true
})
const transactionSchema=new Schema({
    transactionId:{
        type: String,
        default:()=>`TXN-${Date.now()}-${Math.random().toString(36).substr(2,5).toUpperCase()}`
    },
    senderId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:[true,'Sender ID is required']
    },
    receiverId:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:[true,'Reciver ID is required']
    },
    amount:{
        type:Number,
        required:[true,'Amount is required']
    },
    status:{
        type:String,
        enum:["successful","rejected","pending"],
        default:"pending",
        required:[true,'Status of the transaction is required']
    },
    riskLevel:{
        type:String,
        enum:["PENDING","LOW","MEDIUM","HIGH"],
        default:"PENDING"
    },
    isFraud:{
        type:Boolean,
        default:false,
    },
    riskScore:{
        type:Number,
    },
    currentApprovalLevel:{
        type:Number,
    },
    approvalHistory:[historySchema],
    riskReasons: {
        type: [String],
        default: []
    },
    operationType: {
        type: String,
        enum: ["TRANSFER", "WITHDRAWAL", "DEPOSIT"],
        required: [true, 'Operation type is required']
    }
},{
    timestamps:true,
    versionKey:false,
    strict:"throw"
})

export const TransactionModel=model('transaction',transactionSchema)