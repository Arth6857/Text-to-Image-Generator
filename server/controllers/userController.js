import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; //crete token for authentication

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password){
            return res. json({sucess:false, message:'Missing Details'})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userdata={
            name,email,
            password:hashedPassword
        }
        //we have to store the user in the database
        const newUser = new userModel(userdata)
        const user= await newUser.save()

        // create a token for the user
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)

        res. json({success: true, token, user: {name: user.name}})
    }catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await userModel.findOne({  email }); //find user from this email
 
        if(!user){
            return res.json({success: false, message: 'User not found'})
        }

        //Match the password
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            //generate one token
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            res.json({success: true,token, user: {name:user.name}})
            
        }else{
            return res.json({success: false, message: 'Invalid Credentials'}) 

        }
    }catch{
        console.error(error);
        res.json({success: false, message: error.message})
    }
}

const userCredits = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId); //find userID
        res.json({success: true, credits: user.creditBalance, user: {name: user.name}});
        // Assuming you have middleware to set req.user
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message})
    }
}
    
export { registerUser, loginUser,userCredits };