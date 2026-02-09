import express from "express"; 
import {z} from "zod";
import { UserModel,PurchasesModel,CourseModel} from "../db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { JWT_SECRET_USER,verifyTokenUser } from "../middlewares/userMiddleware.js";


const userRouter = express.Router();

// For whole route middlewares you can do userRouter.use()

userRouter.post("/signup",async(req,res) => {

  const reqBody = z.object({
    email : z.string().min(4).email(),
    name : z.string().min(3).max(80),
    password : z.string().min(6).max(80),
    age : z.number().min(1).max(120),
  })

  const parsedData = reqBody.safeParse(req.body);
  

  if(!parsedData.success){
    console.log(parsedData.error)
    res.status(401).json({"message" : parsedData.error.issues[0].message});
    return;
  }

  const email = req.body["email"]
  const password = req.body["password"]
  const name = req.body["name"]
  const age = req.body["age"]

  if(email && password && name && age){

    const hashPassword = await bcrypt.hash(password,12);

    try{

      await UserModel.create({
        "name" : name,
        "password" : hashPassword,
        "age" : age,
        "email" : email
      })

      res.status(200).json({"message" : "User Created successfully."})

    }catch(e){
      console.log(e);
      res.status(400).json({"message" : "User already exists."})
    }

  }
})

userRouter.post("/login", async (req,res) => {

  const reqBody = z.object({
    email : z.string().min(4).email(),
    password : z.string().min(6).max(80),
  })

  const parsedData = reqBody.safeParse(req.body);

  if(!parsedData.success){
    console.log(parsedData.error)
    res.status(401).json({"message" : parsedData.error.issues[0].message});
    return;
  }

  const email = req.body["email"];
  const password = req.body["password"];

  const user = await UserModel.findOne({
    "email" : email
  })

  console.log(user);

  if(user){
    const isPasswordTrue = await bcrypt.compare(password,user.password) //Use await yaha, VScode no need bolega
    console.log(isPasswordTrue);

    if(isPasswordTrue){

      const token = jwt.sign({"id" : user._id},JWT_SECRET_USER);
      
      res.status(200).json({"message" : "Welcome back","token" : token})

    }else{
      res.status(401).json({"message"  : "Invalid or incorrect password"})
    }
  }else{

    res.status(401).json({"message" : "User doesn't exist,Please sign up"})

  }
  
})

userRouter.get("/purchases",verifyTokenUser, async (req,res) =>{

  const id = req.id;

  const user = await UserModel.findOne({
    _id : id
  })

  if(user){

    const purchasedCourses = await PurchasesModel.find({
      "userId" : user._id
    })

    if(purchasedCourses){

      res.status(200).json({"courses" : purchasedCourses})

    }else{
      res.status(200).json({"message" : "You don't have any purchased courses."})
    }

  }else{
    res.status(401).json({"message" : "User not found."})
  }
  

})

userRouter.post("/course/purchase",verifyTokenUser,async (req,res) => {

  const id = req.id;

  const user = await UserModel.findOne({
    "_id" : id
  })

  if(user){

    //const course 

    const course = await CourseModel.findOne({
      "_id" : req.body.courseId
    })

    if(course){

      await PurchasesModel.create({
        "name" : course.title,
        "courseId" : course._id,
        "userId" : user._id,
         
      })

      res.status(201).json({"message" : "Purchase confirmed."})

    }else{
      res.status(401).json({"message" : "Course not found"});
    }
    



  }else{
    res.status(401).json({"message" : "User not found"});
  }

})






export {userRouter}