import exp from 'express'
import { register } from '../SERVICES/authService.js'
import { verifyToken } from '../MIDDLEWARES/verifyToken.js'
import { authorizeRoles } from '../MIDDLEWARES/authorizeRoles.js'
import { TransactionModel } from '../MODELS/transactionModel.js'
export const seniorManagerApp=exp.Router()


//get all  the pending transactions
seniorManagerApp.get('/transactions/pending',verifyToken,authorizeRoles('SENIOR_MANAGER'),async(req,res,next)=>{
   try{ let transactions=await TransactionModel.find({currentApprovalLevel:2,status:'pending'})
    res.status(200).json({messages:'All pending transaction',payload:transactions})}catch(err){next(err)}
})


//get the transaction details work on
seniorManagerApp.post('/transactions/:id/action',verifyToken,authorizeRoles('SENIOR_MANAGER'),async(req,res,next)=>{
    try{let transactionId=req.params.id
    let {action,comments}=req.body
    let transaction=await TransactionModel.findById(transactionId)

    if(!transaction) return res.status(404).json({ message: 'Transaction not found' })

    if(transaction.currentApprovalLevel !== 2){
        return res.status(400).json({ message: 'Transaction is not at your approval level' })
    }
    
    transaction.approvalHistory.push({
        user: req.user._id,
        action: action,
        comments: comments,
        level: 2
    })
    if(action === 'Rejected'){
        transaction.status = 'rejected'
    } 
    else if(action === "Approved" && transaction.riskLevel === "HIGH"){
        transaction.currentApprovalLevel = 3
    }
    await transaction.save()
    res.status(201).json({message:'Updated transaction succesfully.',payload:transaction})}catch(err){next(err)}
})