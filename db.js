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

const Lesson = new Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["video", "file"], required: true },
  videoUrl: String,
  fileUrl: String,
  duration: { type: Number, default: 0 },
  order: { type: Number, default: 0 }
});

const Section = new Schema({
  title: { type: String, required: true },
  order: { type: Number, default: 0 },
  lessons: { type: [Lesson], default: [] }
});

const Course = new Schema({
  creatorId: Schema.ObjectId,
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, default: 0 },
  heroImageUrl: String,
  thumbnailUrl: String,
  tags: { type: [String], default: [] },
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
  duration: { type: Number, default: 0 },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
  publishedAt: { type: Date, default: null },
  sections: { type: [Section], default: [] }
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
  completed : {type : Boolean, default : false},
  completedLessons: { type: [Schema.ObjectId], default: [] },
  lastLessonId: { type: Schema.ObjectId, default: null },
  lastPositionSec: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: null },
  streakCount: { type: Number, default: 0 },
  lastStreakDate: { type: Date, default: null }
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