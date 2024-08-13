import Classroom from "../models/classroom.js";
import Timetable from "../models/schedule.js";

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
        const {classroom,subject,day,startTime,endTime} = req.body;
        const timetables = await Timetable.find({classroom})
        for(i of timetables){
            if(i.startTime == startTime || i.endTime == endTime){
                return res.status(404).json({msg:"Schedule already booked"})
            }
        }

        const newTimetable = new Timetable({
            classroom,
            subject,
            day,
            startTime,
            endTime
        })

        const savedTimetable = await newTimetable.save()
        res.status(202).json({timetable:savedTimetable})
    } catch (error) {
        res.status(404).json({msg:error})
    }
}

export const getClassroom = async (req, res) => {
    try {
        const classrooms = await Classroom.find()
            .populate('teacher', 'name email ') // Include name and email for teacher
            .populate('students', 'name email '); // Include name and email for students

        res.status(200).json(classrooms); 
    } catch (error) {
        console.error('Error fetching classrooms:', error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
};

export const getOneClassroom = async (req, res) => {
    try {
        const { id } = req.params;
        const classroom = await Classroom.findOne({ teacher: id })
                                                 .populate('teacher', 'name email ')
                                                 .populate('students', 'name email ');

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        res.status(200).json(classroom); 
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
};

export const updateTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const { timetable } = req.body;
        
        // Update the 'timetable' field only
        const updateClassroom = await Classroom.findByIdAndUpdate(
            id, 
            { $push: { timetable } }, 
            { new: true }
        );

        res.status(200).json({ classroom: updateClassroom });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getASingleClassroom = async (req, res) => {
    try {
        const { id } = req.params; // Extract the student id from req.params

        // Find the classroom where the student is included in the students array
        const classroom = await Classroom.findOne({ students:id })
                                         .populate('students', 'name email'); // Populate student data

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom is found' });
        }

        res.status(200).json(classroom); 
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message }); 
    }
};





