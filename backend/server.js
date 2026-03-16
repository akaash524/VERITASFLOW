import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { commonRouter } from './APIS/commonAPI.js'
import { userApp } from './APIS/userAPI.js'
import { complianceOfficerApp } from './APIS/complianceOfficerAPI.js'
import cookieParser from 'cookie-parser'
import { managerApp } from './APIS/managerAPI.js'
import { seniorManagerApp } from './APIS/seniorManagerAPI.js'
import cors from 'cors'


config()

const app=exp()

app.use(cors({
    origin: 'http://localhost:5173',  
    credentials: true,                
}))

app.use(exp.json())
app.use(cookieParser())

async function connectDB(){
    try{
        await connect(process.env.DB_URL)
        console.log('DB connection succesfull')
        app.listen(process.env.PORT,()=>console.log(`Server is Up And Running on Port ${process.env.PORT}......`))
    }catch(err){
        console.log('Error connecting DB',err)
    }
}
connectDB()

app.use('/veritasflow',commonRouter)
app.use('/veritasflow/co',complianceOfficerApp)
app.use('/veritasflow/user-api',userApp)
app.use('/veritasflow/manager-api',managerApp)
app.use('/veritasflow/senior-manager-api',seniorManagerApp)
app.use('/veritasflow/co-api',complianceOfficerApp)
//error handler middle-ware
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "error occurred",
      error: err.message,
    });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} ${value} already exists`,
    });
  }

  // ✅ HANDLE CUSTOM ERRORS
  if (err.status) {
    return res.status(err.status).json({
      message: "error occurred",
      error: err.message,
    });
  }

  // default server error
  res.status(500).json({
    message: "error occurred",
    error: "Server side error",
  });
});