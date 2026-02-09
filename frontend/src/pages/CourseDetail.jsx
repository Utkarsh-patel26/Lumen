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

  const heroImage = course.imageUrl || course.thumbnailUrl;

  return (
    <div className="space-y-8">
      <Link to="/courses" className="text-sm text-slate-300">
        {"<- Back to courses"}
      </Link>
      <Card className="space-y-6 overflow-hidden p-0">
        <div className="relative h-64">
          {heroImage ? (
            <img
              src={heroImage}
              alt={course.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 text-sm text-slate-300">
              Course hero image coming soon
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
        </div>
        <div className="space-y-6 px-6 pb-6">
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
        </div>
      </Card>
    </div>
  );
};

export default CourseDetail;
