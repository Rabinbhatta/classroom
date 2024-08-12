import User from "../models/user.js";

export const login = async(req,res)=>{
     try {
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            res.status(404).json({msg:"User not found"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            res.status(404).json({error :"Wrong password!!"})
        }else{
        const token =  jwt.sign(user.id,process.env.JWT_KEY)
      
        res.status(200).json({user,token});} 
        
     } catch (error) {
        res.status(404).json({msg:error})
     }
}

export const createUser = async(req,res)=>{
    try {
        const {email,password,name,role} = req.body;
        const user = await User.findOne({email});
        if(user){
            res.status(404).json({error :"Email already used!!"})
        }else{
        const passwordhash = await bcrypt.hash(password,10);
        const newUser = new User({email,password:passwordhash,name,role});
        await newUser.save()
        }

        
        res.status(200).json({msg:"New User created"});
        
        
    } catch (error) {
        res.status(404).json({msg:error})
    }
}

