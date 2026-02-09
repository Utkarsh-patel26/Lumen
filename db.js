import mongoose from "mongoose";


const Schema = mongoose.Schema;

const User = new Schema({
  
  name : String,
  email : {type : String,unique : true},
  password : String,
  age : Number,
  role : {type : String, enum : ["student","admin"], default : "student"},

})

const Admin = new Schema({
  name : String,
  email : {type : String,unique : true},
  password : String,
  age : Number,
})

const Course = new Schema({

  creatorId : Schema.ObjectId,
  title : String,
  description : String,
  price : Number,
  imageUrl : String,
  thumbnailUrl : String,

})

const Purchase = new Schema({

  name : String,
  courseId : Schema.ObjectId,
  userId : Schema.ObjectId,

})

const Enrollment = new Schema({
  userId : {type : Schema.ObjectId, ref : "UserModel"},
  courseId : {type : Schema.ObjectId, ref : "CourseModel"},
  enrolledAt : {type : Date, default : Date.now},
  progress : {type : Number, default : 0, min : 0, max : 100},
  completed : {type : Boolean, default : false}
})

User.index({ email : 1 }, { unique : true })
Course.index({ title : "text", description : "text" })
Enrollment.index({ userId : 1, courseId : 1 }, { unique : true })

//Course content ka ek aur table bhi banasakte ho aap.

const UserModel = mongoose.model("UserModel",User)

const AdminModel = mongoose.model("AdminModel",Admin)

const CourseModel = mongoose.model("CourseModel",Course)

const PurchasesModel = mongoose.model("PurchasesModel",Purchase)
const EnrollmentModel = mongoose.model("EnrollmentModel",Enrollment)


export {UserModel,AdminModel,CourseModel,PurchasesModel,EnrollmentModel}