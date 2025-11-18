import {registerUser, loginUser,userCredits} from "../controllers/userController.js";
 import express from "express";
import userAuth from "../middleware/auth.js";

//crete an end point
const userRouter = express.Router();
userRouter.post("/register", registerUser); //end point path
userRouter.post("/login", loginUser);
userRouter.get("/credits",userAuth,userCredits); // Assuming userCredits is defined in usercontroller.js


//in end export this router
export default userRouter;

//localhost:4000/api/users/register
//localhost:4000/api/users/login