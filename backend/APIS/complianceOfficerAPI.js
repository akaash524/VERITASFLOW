import exp from 'express'
import { register } from '../SERVICES/authService.js'
import { RulesModel } from '../MODELS/rulesModel.js'
import { verifyToken } from '../MIDDLEWARES/verifyToken.js'
import { authorizeRoles } from '../MIDDLEWARES/authorizeRoles.js'
import { TransactionModel } from '../MODELS/transactionModel.js'
export const complianceOfficerApp=exp.Router()

// Add new rule
complianceOfficerApp.post('/rules', verifyToken, authorizeRoles("ADMIN","COMPLIANCE_OFFICER"), async(req,res)=>{
    let newRule=req.body
    let newRuleDoc=new RulesModel(newRule)
    await newRuleDoc.validate()
    await newRuleDoc.save()
    let newRuleObj=newRuleDoc.toObject()
    res.status(200).json({message:'Added New Rule',payload:newRuleObj})

})

// View rules  
complianceOfficerApp.get('/rules', verifyToken, authorizeRoles("ADMIN","COMPLIANCE_OFFICER","SENIOR_MANAGER"), async(req,res)=>{
        let rules=await RulesModel.find({isActive:true})
        res.status(200).json({message:"All rules",payload:rules})
})

// Delete rule
complianceOfficerApp.delete('/rules/:id', verifyToken, authorizeRoles("ADMIN"), async(req,res)=>{
    let ruleId=req.params.id
    let deletedRule=await RulesModel.findByIdAndDelete(ruleId)
    res.status(200).json({message:'Rule Deleted Successfully',payload:deletedRule})
})

//get all  the pending transactions
complianceOfficerApp.get('/transactions/pending',verifyToken,authorizeRoles('COMPLIANCE_OFFICER'),async(req,res,next)=>{
   try{ let transactions=await TransactionModel.find({currentApprovalLevel:3,status:'pending'})
    res.status(200).json({messages:'All pending transaction',payload:transactions})}catch(err){
        next(err)
    }
})


//get the transaction details work on
complianceOfficerApp.post('/transactions/:id/action',verifyToken,authorizeRoles('COMPLIANCE_OFFICER'),async(req,res)=>{
    try{let transactionId=req.params.id
    let {action,comments}=req.body
    let transaction=await TransactionModel.findById(transactionId)

    if(!transaction) return res.status(404).json({ message: 'Transaction not found' })

    if(transaction.currentApprovalLevel !== 3){
        return res.status(400).json({ message: 'Transaction is not at your approval level' })
    }
    
    transaction.approvalHistory.push({
        user: req.user._id,
        action: action,
        comments: comments,
        level: 3
    })
    if(action === 'Rejected'){
        transaction.status = 'rejected'
    } 
    else if(action === "Approved" && transaction.riskLevel === "HIGH"){
        transaction.status = 'successful'
    }
    await transaction.save()
    res.status(201).json({message:'Updated transaction succesfully.',payload:transaction})}catch(err){next(err)}
})


