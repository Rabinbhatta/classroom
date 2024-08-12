import mongoose from "mongoose";

const classroomSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        
    },
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        
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
    ]
   
})

const Classroom = mongoose.model("Classroom",classroomSchema)

export default Classroom