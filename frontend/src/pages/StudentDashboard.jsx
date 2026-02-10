import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { dashboardApi } from "../services/api/dashboardApi.js";
import { useAuthStore } from "../store/authStore.js";
import { useEnrollmentStore } from "../store/enrollmentStore.js";

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { enrollments, fetchMyEnrollments } = useEnrollmentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await dashboardApi.student();
      setStats(data);
      await fetchMyEnrollments();
      setLoading(false);
    };
    load();
  }, [fetchMyEnrollments]);

  if (loading || !stats) {
    return <Skeleton className="h-64" />;
  }

  const safeEnrollments = enrollments.filter((enrollment) => enrollment.courseId);
  const firstName = user?.name?.split(" ")[0];

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
        <p className="mt-2 text-sm text-slate-300">Your learning stats and active courses in one place.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-slate-400">Enrolled courses</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{stats.enrolledCount}</h3>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Completed</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{stats.completedCount}</h3>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Avg. progress</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{stats.avgProgress}%</h3>
        </Card>
      </div>

      {safeEnrollments.length === 0 ? (
        <EmptyState
          title="No enrollments yet"
          description="Enroll in your first course to start tracking progress."
          actionLabel="Browse courses"
          onAction={() => window.location.assign("/courses")}
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {safeEnrollments.map((enrollment) => {
              const course = enrollment.courseId;
              const cover =
                course?.thumbnailUrl || course?.heroImageUrl || "/course-thumb-placeholder.svg";
              const communityUrl = course?.communityUrl || course?.discordUrl;

              return (
                <Card key={enrollment._id} className="flex flex-col gap-4 overflow-hidden p-0">
                  <div className="relative h-40">
                    <img
                      src={cover}
                      alt={course?.title || "Course cover"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
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
          <Card className="text-center">
            <h3 className="text-lg font-semibold text-white">Don't see your courses?</h3>
            <p className="mt-2 text-sm text-slate-300">
              Try refreshing the database. If you are still facing issues, contact support.
            </p>
            <div className="mt-6">
              <Button onClick={fetchMyEnrollments}>Refresh database</Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
