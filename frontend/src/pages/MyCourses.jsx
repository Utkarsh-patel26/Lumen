import { useEffect } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { useEnrollmentStore } from "../store/enrollmentStore.js";
import { useAuthStore } from "../store/authStore.js";

const MyCourses = () => {
  const { enrollments, loading, fetchMyEnrollments } = useEnrollmentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchMyEnrollments();
  }, [fetchMyEnrollments]);

  const safeEnrollments = enrollments.filter((enrollment) => enrollment.courseId);
  const firstName = user?.name?.split(" ")[0];

  if (!loading && safeEnrollments.length === 0) {
    return (
      <EmptyState
        title="No courses yet"
        description="Enroll in a course to start learning and tracking progress."
        actionLabel="Refresh database"
        onAction={fetchMyEnrollments}
      />
    );
  }

  const renderProgress = (value) => {
    const progress = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
    return (
      <div className="relative h-12 w-12">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#34d399 ${progress}%, rgba(255,255,255,0.15) 0)`
          }}
        />
        <div className="absolute inset-1 flex items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
          {progress}%
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">
          Happy to see you back{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="mt-2 text-sm text-slate-300">Pick up where you left off and keep the streak going.</p>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {safeEnrollments.map((enrollment) => {
            const course = enrollment.courseId;
            const cover = course?.thumbnailUrl || course?.imageUrl;
            const communityUrl = course?.communityUrl || course?.discordUrl;

            return (
              <Card key={enrollment._id} className="flex flex-col gap-4 overflow-hidden p-0">
                <div className="relative h-40">
                  {cover ? (
                    <img
                      src={cover}
                      alt={course?.title || "Course cover"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-sm text-slate-300">
                      Course cover coming soon
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
                  <div className="absolute right-4 top-4">{renderProgress(enrollment.progress)}</div>
                </div>

                <div className="space-y-3 px-6 pb-6">
                  <Badge tone={enrollment.completed ? "success" : "info"}>
                    {enrollment.completed ? "Completed" : "In progress"}
                  </Badge>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{course?.title || "Course"}</h3>
                    <p className="mt-2 text-sm text-slate-300 line-clamp-2">
                      {course?.description || "Resume your learning journey."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/courses/${course?._id}`}>
                      <Button size="sm">View course</Button>
                    </Link>
                    {communityUrl && (
                      <a href={communityUrl} target="_blank" rel="noreferrer">
                        <Button size="sm" variant="secondary">
                          Join Discord
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && safeEnrollments.length > 0 && (
        <Card className="text-center">
          <h3 className="text-lg font-semibold text-white">Don't see your courses?</h3>
          <p className="mt-2 text-sm text-slate-300">
            Try refreshing the database. If you are still facing issues, contact support.
          </p>
          <div className="mt-6">
            <Button onClick={fetchMyEnrollments}>Refresh database</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyCourses;
