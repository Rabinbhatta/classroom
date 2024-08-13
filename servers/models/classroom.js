import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId, ref:"User"
        
    },
    students:[{
        type: mongoose.Schema.Types.ObjectId,  ref:"User"
        
    }],
    sessions:[
        {startTime : {
            type:String,
            required:true
        },
        endTime : {
            type:String,
            required:true
        },
        day:{
            type:String,
            required:true
        }}
    ],
    timetable:[{
  subject: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
    }]

   
})

const Classroom = mongoose.model("Classroom",classroomSchema)

export default Classroom