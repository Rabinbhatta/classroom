import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoute from "./routes/auth.js"
import classroomRoute from "./routes/classroom.js"

dotenv.config()

const app = express();

app.use("/auth",authRoute)
app.use("/classroom",classroomRoute)

app.use(express.json())
app.use(cors())

mongoose.set()

mongoose.connect(process.env.MONGODB).then(()=>app.listen(process.env.PORT,
    ()=>console.log(`Server listening at ${process.env.PORT}`)
)).catch((error)=>console.log(error))

