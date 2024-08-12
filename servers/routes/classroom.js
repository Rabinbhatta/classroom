import express from "express"
import { createClassroom,createTimetable } from "../controllers/classroom.js"


const route = express.Router()

route.post("/create",createClassroom)
route.post("/timetable",createTimetable)

export default route