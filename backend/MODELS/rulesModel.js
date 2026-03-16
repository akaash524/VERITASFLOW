import { Schema,model } from "mongoose";


const conditionSchema=new Schema({
    field:{
        type:String
    },
    operator:{
        type:String
    },
    value:{
        type: Schema.Types.Mixed
    }
})
const RuleSchema=new Schema({
    name:{
        type:String,
        required:[true,'Name of the rule is required']
    },
    condition:conditionSchema,
    score:{
        type:Number
    },
    reason:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

export const RulesModel=model('rule',RuleSchema)