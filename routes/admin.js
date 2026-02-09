import express from "express"; 
import {z} from "zod";
import { AdminModel,CourseModel } from "../db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { JWT_SECRET_ADMIN,verifyTokenAdmin } from "../middlewares/adminMiddleware.js";

const adminRouter = express.Router(); 

adminRouter.post("/signup",async(req,res) => {

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

      await AdminModel.create({
        "name" : name,
        "password" : hashPassword,
        "age" : age,
        "email" : email
      })

      res.status(200).json({"message" : "User Created successfully."})

    }catch(e){

      res.status(400).json({"message" : "User already exists."})
    }

  }
})

adminRouter.post("/login", async (req,res) => {

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

  const user = await AdminModel.findOne({
    "email" : email
  })

  console.log(user);

  if(user){
    const isPasswordTrue = await bcrypt.compare(password,user.password) //Use await yaha, VScode no need bolega
    

    if(isPasswordTrue){

      const token = jwt.sign({"id" : user._id},JWT_SECRET_ADMIN);
      
      res.status(200).json({"message" : "Welcome back","token" : token})

    }else{
      res.status(401).json({"message"  : "Invalid or incorrect password"})
    }
  }else{

    res.status(401).json({"message" : "User doesn't exist,Please sign up"})

  }
})


adminRouter.post("/create-course",verifyTokenAdmin,async (req,res) => {

  const id = req.id;

  const admin = await AdminModel.findOne({
    "_id" : id
  })

  try{

  if(admin){

    await CourseModel.create({
      "creatorId" : admin._id,
      "description" : req.body.description,
      "price" : req.body.price,
      "title" : req.body.title,
      "imageUrl" : req.body.imageUrl
    })

    res.status(201).json({"message" : "Course created successfully"})


  }else{
    res.status(401).json({"message" : "Admin not found."})  
  }

  }catch(e){
    console.log(e);
    res.json({"message" : "Some backend error."})
  }

  
})

adminRouter.put("/update-course",verifyTokenAdmin,async(req,res) => {

  const id = req.id;

  const admin = await AdminModel.findOne({
    "_id" : id
  })

  if(admin){

    try{
 
      const updateField = req.body.updateField;
      const change = req.body.change;
      const title = req.body.title;

      await CourseModel.updateOne({
        "creatorId" : admin._id,
        "title" : title
      },{$set : {[updateField] : change}}) //[] ke andar daalke karna hota hai for custom fields.

      res.status(200).json({"message" : "Field successfully updated."})


    }catch(e){
      
      res.status(400).json({"message" : "Some backend Issue happenend."})

    }

  }else{
    res.status(401).json({"message" : "Admin not found"})
  }

  

})

adminRouter.get("/created-courses",verifyTokenAdmin,async(req,res) => {
  
  const id = req.id;

  const admin = await AdminModel.findOne({
    "_id" : id
  })


  if(admin){

    const courses = await CourseModel.find({ //find hai yaha
      "creatorId" : admin._id
    })

    console.log(courses);
    res.status(200).json({"courses" : courses});

  }else{
    res.status(401).json({"message" : "Admin not found"})
  }
  
})

adminRouter.delete("/delete-course",verifyTokenAdmin,async(req,res) => {

  const id = req.id;

  const admin = await AdminModel.exists({
    "_id" : id
  })

  if(admin){

    try{

      await CourseModel.findOneAndDelete({
        "_id" : req.body._id //request mein pass kara dena.
      })

      res.status(200).json({"message" : "Course deleted successfully."})

    }catch(e){
      res.status(400).json({"message" : "Backend error"});

    }


  }else{
    res.status(401).json({"message" : "Admin doesn't exist"})
  }

})



export{adminRouter}