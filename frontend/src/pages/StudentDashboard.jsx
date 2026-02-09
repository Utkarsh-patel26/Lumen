import { useEffect, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import DataTable from "../components/common/DataTable.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { dashboardApi } from "../services/api/dashboardApi.js";
import { useEnrollmentStore } from "../store/enrollmentStore.js";

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { enrollments, fetchMyEnrollments } = useEnrollmentStore();

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

  return (
    <div className="space-y-8">
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

      {enrollments.length === 0 ? (
        <EmptyState
          title="No enrollments yet"
          description="Enroll in your first course to start tracking progress."
        />
      ) : (
        <DataTable
          columns={[
            { key: "course", label: "Course", render: (row) => row.courseId?.title || "Course" },
            { key: "progress", label: "Progress", render: (row) => `${row.progress || 0}%` },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <Badge tone={row.completed ? "success" : "info"}>
                  {row.completed ? "Completed" : "In progress"}
                </Badge>
              )
            }
          ]}
          rows={enrollments}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
