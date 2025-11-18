import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; //crete token for authentication
// import razorpay from "razorpay";

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
// initialize a controllerb for razorpay payments
// const razorpayInstance = new razorpay ({
// key_id: process.env.RAZORPAY_KEY_ID, 
// key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// const paymentRazorpay = async (req, res)=>{
//     try{
//        const {userId, planId} = req.body
//        const userData = await userModel.findById(userId)

//        //whether user data and plan Id is available or not
//        if (!userId || !planId) {
//              return res.json({success: false, message: 'Missing Details' })
//     }
//     let credits, plan, amount, date
//     switch(planId){
//         case 'Basic':
//             plan= 'Basic'
//             credits= 100
//             amount= 10
//             break;
//         case 'Advanced':
//             plan= 'Advanced'
//             credits= 500
//             amount= 50
//             break;
//         case 'Business':
//             plan= 'Business'
//             credits= 5000
//             amount= 250
//             break;
//         default:
//             return res.json({success: false, message: 'plan not found'});
//     }
    
// }catch{
//         console.log(error);
//         res.json({success: false, message: error.message})
//     }
// }
export { registerUser, loginUser,userCredits };