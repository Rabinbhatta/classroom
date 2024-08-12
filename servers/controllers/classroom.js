import Classroom from "../models/classroom.js";

export const createClassroom = async(req,res)=>{
    try {
        const {name,teacher,sessions,students} = req.body;
        const classes = await Classroom.find()
        for(const i of classes){
             if(teacher == i.teacher){
                return res.status(404).json({msg:"Class already assinged"})
             }
        }
        const newClassroom = new Classroom({
            name,teacher,sessions,students
        })

        const savedClassroom = await newClassroom.save()
        res.status(202).json({classroom:savedClassroom})
        
    } catch (error) {
        res.status(404).json({msg:error})
    }
}

export const createTimetable = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}