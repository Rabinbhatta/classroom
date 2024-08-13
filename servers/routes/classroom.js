import express from "express"
import { createClassroom,createTimetable, getClassroom,getOneClassroom,updateTimetable,getASingleClassroom } from "../controllers/classroom.js"


const route = express.Router()

route.post("/create",createClassroom)
route.post("/timetable",createTimetable)
route.get("/getClassroom",getClassroom)
route.get("/:id",getOneClassroom)
route.get("/student/:id",getASingleClassroom)
route.put("/timetable/:id",updateTimetable)

export default route