import User from "../models/user.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import Classroom from "../models/classroom.js";

export const login = async(req,res)=>{
     try {
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({msg:"User not found"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
             return res.status(401).json({error :"Wrong password!!"})
        }else{
        const token =  jwt.sign(user.id,process.env.JWT_Key)
      
         return res.status(200).json({user,token});} 
        
     } catch (error) {
        res.status(404).json({msg:error.message})
     }
}

export const createUser = async(req,res)=>{
    try {
        const { password , email , name , role} = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(404).json({error :"Email already used!!"})
        }else{
        const passwordhash = await bcrypt.hash(password,10);
        const newUser = new User({email,password:passwordhash,name,role});
        await newUser.save()
        return res.status(200).json({msg:"New User created"});
        }

    } catch (error) {
        res.status(404).json({msg:error.message})
    }
}

export const getUser = async (req, res) => {
    try {
        const allUsers = await User.find({ role: { $in: ["Teacher", "Student"] } }).select("-password");
        res.status(200).json(allUsers); 
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' }); 
    }
};

export const deleteUser = async(req,res)=>{
    try {
        const { id } = req.params;
    await User.findByIdAndDelete(id);
    await Classroom.findOneAndDelete({teacher:id})
    await Classroom.updateMany(
        { 'students._id': id },
        { $pull: { students: { _id: id } } }
    );
        
        res.status(200).json({msg:"User Deleted"});
        

    } catch (error) {
        res.status(404).json({msg:error.message})
    }
}

