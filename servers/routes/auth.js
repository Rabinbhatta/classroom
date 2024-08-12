import express from "express"
import { login,createUser } from "../controllers/auth.js"

const route = express.Router()

//login route
route.post("/login",login)

//create teacher and student route
route.post("/createUser",createUser)

export default route