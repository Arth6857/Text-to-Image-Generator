import {registerUser, loginUser,userCredits} from "../controllers/usercontroller.js";
import express from "express";
import userAuth from "../middleware/auth.js";

const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/credits",userAuth,userCredits); // Assuming userCredits is defined in usercontroller.js

export default userRouter;

//localhost:4000/api/users/register
//localhost:4000/api/users/login