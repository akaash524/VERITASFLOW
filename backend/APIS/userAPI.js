import exp from 'express'
import { verifyToken } from '../MIDDLEWARES/verifyToken.js'
import { authorizeRoles } from '../MIDDLEWARES/authorizeRoles.js'
import { evaluateRisk } from '../SERVICES/riskEngine.js'
import { TransactionModel } from '../MODELS/transactionModel.js'
import { initiateWorkflow } from '../SERVICES/workFlowEngine.js'
import { UserModel } from '../MODELS/userModel.js'
export const userApp=exp.Router()

//create a new transaction
userApp.post('/transaction/create',verifyToken,authorizeRoles("USER"),async (req,res)=>{
    let transaction=req.body
    if(transaction.receiverId===req.email){
        return res.status(400).json({ message: 'You cannot send a transaction to yourself' })
    }
    let { score, level, reasons }=await evaluateRisk(transaction)
    let receiver=await UserModel.findOne({email:transaction.receiverId,role:'USER'})
    if(!receiver){
        return res.status(404).json({message:'User not found'})
    }
    transaction.receiverId=receiver._id
    transaction.senderId = req.user._id
    transaction.riskScore=score
    transaction.riskLevel=level
    transaction.riskReasons=reasons
    transaction.isFraud = score >= 80 
    let newTransactionDoc=new TransactionModel(transaction)
    await newTransactionDoc.save()
    await initiateWorkflow(newTransactionDoc)
    res.status(201).json({message:'New Transaction Added',payload:newTransactionDoc})
})

//get all the transaction of this user.
userApp.get('/transactions',verifyToken,authorizeRoles("USER"),async(req,res)=>{
    let transactions=await TransactionModel.find({senderId:req.user._id})
    if(!transactions) return res.status(404).json({ message: 'Transaction not found' })
    res.status(200).json({message:'Transactions Found',payload:transactions})
})


//audit log
userApp.get('/transactions/:id/audit', verifyToken, async(req,res,next) => {
    try {
        let transaction = await TransactionModel.findById(req.params.id)
            .populate('senderId', 'firstName lastName email role')
            .populate('receiverId', 'firstName lastName email role')
            .populate('approvalHistory.user', 'firstName lastName email role')
        
        if(!transaction) return res.status(404).json({ message: 'Transaction not found' })
        if(transaction.senderId._id.toString() !== req.user._id.toString()){
            return res.status(403).json({ message: 'Access Denied: Not your transaction' })
        }
        
        res.status(200).json({ message: 'Audit Trail', payload: transaction })
    } catch(err) {
        next(err)
    }
})

//get all the users.
userApp.get('/users',verifyToken,async(req,res)=>{
    let users=await UserModel.find({role:'USER'})
    res.status(200).json({message:'all users',payload:users})
})