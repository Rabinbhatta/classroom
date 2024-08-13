import express from "express"
import { login,createUser,getUser, deleteUser } from "../controllers/auth.js"

const route = express.Router()

//login route
route.post("/login",login)

//create teacher and student route
route.post("/createUser",createUser)
route.get("/getUser",getUser)
route.delete("/delete/:id",deleteUser)

export default route