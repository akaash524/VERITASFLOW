import exp from 'express'
import { register } from '../SERVICES/authService.js'
import { verifyToken } from '../MIDDLEWARES/verifyToken.js'
import { authorizeRoles } from '../MIDDLEWARES/authorizeRoles.js'
import { TransactionModel } from '../MODELS/transactionModel.js'
export const managerApp=exp.Router()

//get all  the pending transactions
managerApp.get('/transactions/pending',verifyToken,authorizeRoles('MANAGER'),async(req,res,next)=>{
    try{
        let transactions=await TransactionModel.find({currentApprovalLevel:1,status:'pending'})
    res.status(200).json({messages:'All pending transaction',payload:transactions}) 
    }catch(err){
        next(err)
    }
})


//get the transaction details work on
managerApp.post('/transactions/:id/action',verifyToken,authorizeRoles('MANAGER'),async(req,res,next)=>{
    try{
        let transactionId=req.params.id
    let {action,comments}=req.body
    let transaction=await TransactionModel.findById(transactionId)

    if(!transaction) return res.status(404).json({ message: 'Transaction not found' })

    if(transaction.currentApprovalLevel !== 1){
        return res.status(400).json({ message: 'Transaction is not at your approval level' })
    }

    transaction.approvalHistory.push({
        user: req.user._id,
        action: action,
        comments: comments,
        level: 1
    })
    if(action === 'Rejected'){
        transaction.status = 'rejected'
    } 
    else if(action === "Approved" && transaction.riskLevel === "MEDIUM"){
        transaction.status = "successful"
    } 
    else if(action === "Approved" && transaction.riskLevel === "HIGH"){
        transaction.currentApprovalLevel = 2
    }
    await transaction.save()
    res.status(201).json({message:'Updated transaction succesfully.',payload:transaction})
    }
    catch(err){next(err)}
})