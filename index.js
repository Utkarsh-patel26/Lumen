import express from "express"; 
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.js";
import { adminRouter } from "./routes/admin.js";
import { coursesRouter } from "./routes/courses.js";
import { authRouter } from "./backend/routes/auth.js";
import { coursesApiRouter } from "./backend/routes/courses.js";
import { enrollmentRouter } from "./backend/routes/enrollments.js";
import { dashboardRouter } from "./backend/routes/dashboard.js";
import { requestLogger } from "./backend/config/logger.js";
import { errorHandler } from "./backend/middleware/errorHandler.js";
import { env } from "./backend/config/env.js";
dotenv.config()// Yeh ek hi baar karna padta hai no need to do baar baar.


mongoose.connect(process.env.MONGO_URL)

//  We are using it as a middleware in here,.use() hai yaad rakhna.

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));
app.use(requestLogger);


app.use("/user",userRouter)

app.use("/admin",adminRouter)

app.use("/",coursesRouter)

app.use("/", authRouter)
app.use("/", coursesApiRouter)
app.use("/", enrollmentRouter)
app.use("/", dashboardRouter)


app.get("/",(req,res) => {
  res.send("hi user");
})


app.use(errorHandler)


app.listen(env.port,() => {
  console.log(`http://localhost:${env.port}/`)
})