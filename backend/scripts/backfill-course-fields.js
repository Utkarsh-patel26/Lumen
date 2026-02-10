import dotenv from "dotenv";
import mongoose from "mongoose";
import { CourseModel, EnrollmentModel } from "../../db.js";

dotenv.config();

const run = async () => {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error("MONGO_URL is not configured");
  }

  await mongoose.connect(mongoUrl);

  const now = new Date();

  await CourseModel.updateMany({ tags: { $exists: false } }, { $set: { tags: [] } });
  await CourseModel.updateMany(
    { level: { $exists: false } },
    { $set: { level: "beginner" } }
  );
  await CourseModel.updateMany(
    { duration: { $exists: false } },
    { $set: { duration: 0 } }
  );
  await CourseModel.updateMany(
    { status: { $exists: false } },
    { $set: { status: "published", publishedAt: now } }
  );
  await CourseModel.updateMany(
    { status: "published", publishedAt: { $in: [null, undefined] } },
    { $set: { publishedAt: now } }
  );

  await EnrollmentModel.updateMany(
    { lastLessonId: { $exists: false } },
    { $set: { lastLessonId: null } }
  );
  await EnrollmentModel.updateMany(
    { lastPositionSec: { $exists: false } },
    { $set: { lastPositionSec: 0 } }
  );
  await EnrollmentModel.updateMany(
    { lastActiveAt: { $exists: false } },
    { $set: { lastActiveAt: null } }
  );
  await EnrollmentModel.updateMany(
    { streakCount: { $exists: false } },
    { $set: { streakCount: 0 } }
  );
  await EnrollmentModel.updateMany(
    { lastStreakDate: { $exists: false } },
    { $set: { lastStreakDate: null } }
  );

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Backfill failed:", err);
  process.exitCode = 1;
});
