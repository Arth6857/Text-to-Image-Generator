import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";


//we will send the userId from the token in the middleware and that will be used here
const generateImage=async(req,res)=>{
    try{
        // const {userId,prompt}=req.body;
        const { prompt } = req.body; // ✅ get prompt from body
        const userId = req.userId;   // ✅ from auth middleware

        // ✅ Correct way: find user by ID
        const user = await userModel.findById(userId);

        if(!user||!prompt){
            return res.json({success: false, message: 'User not found or prompt missing'})
        }
        if(user.creditBalance<=0){
            return res.json({success: false, message: 'Insufficient credits'})
        } 
         
        //call the clipdrop api to generate image
        const formData=new FormData();
        formData.append('prompt',prompt);

        //send the request to clipdrop
        const {data}=await axios.post("https://clipdrop-api.co/text-to-image/v1",formData,{
            headers: {
             'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer' //important to get image buffer
        })

        const base64Image=Buffer.from(data, 'binary').toString('base64')
        const resultImage=`data:image/png;base64,${base64Image}` 

        //deduct one credit from user
        await userModel.findByIdAndUpdate(req.userId,{creditBalance: user.creditBalance-1})
        res.json({success: true,message: 'Image generated successfully', creditBalance: user.creditBalance-1, image: resultImage})

    }catch(error){
        console.error(error);
        res.json({success: false, message: error.message})
    }
}
export {generateImage};