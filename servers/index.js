import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoute from "./routes/auth.js"
import classroomRoute from "./routes/classroom.js"

dotenv.config()

const app = express();

app.use(express.json())
const corsOptions = {
    origin: 'http://example.com',
    methods: ['GET', 'POST'],     
  
};

app.use("/auth",authRoute)
app.use("/classroom",classroomRoute)



mongoose.set()

mongoose.connect("mongodb+srv://rabinbhattarai646:WuuIb9toaQF7xjDv@intern.tzwkf.mongodb.net/").then(()=>app.listen(8000,
    ()=>console.log(`Server listening at 8000`)
)).catch((error)=>console.log(error))

