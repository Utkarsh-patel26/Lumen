import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { useCourseStore } from "../store/courseStore.js";
import { useEnrollmentStore } from "../store/enrollmentStore.js";
import { useAuthStore } from "../store/authStore.js";

const CourseDetail = () => {
  const { id } = useParams();
  const { course, loading, fetchCourse } = useCourseStore();
  const { role, token } = useAuthStore();
  const { enroll } = useEnrollmentStore();

  useEffect(() => {
    if (id) {
      fetchCourse(id);
    }
  }, [fetchCourse, id]);

  if (loading || !course) {
    return <Skeleton className="h-64" />;
  }

  return (
    <div className="space-y-8">
      <Link to="/courses" className="text-sm text-slate-300">
        {"<- Back to courses"}
      </Link>
      <Card className="space-y-6">
        <Badge tone="success">${course.price}</Badge>
        <div>
          <h2 className="text-3xl font-semibold text-white">{course.title}</h2>
          <p className="mt-2 text-sm text-slate-300">{course.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {token && role === "student" && (
            <Button onClick={() => enroll(course._id)}>Enroll now</Button>
          )}
          <Button variant="secondary">Preview</Button>
        </div>
      </Card>
    </div>
  );
};

export default CourseDetail;
