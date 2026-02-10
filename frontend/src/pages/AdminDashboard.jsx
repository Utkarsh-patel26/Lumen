import { useEffect, useState } from "react";
import Card from "../components/ui/Card.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import DataTable from "../components/common/DataTable.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Modal from "../components/common/Modal.jsx";
import { Link } from "react-router-dom";
import { dashboardApi } from "../services/api/dashboardApi.js";
import { useCourseStore } from "../store/courseStore.js";
import { useEnrollmentStore } from "../store/enrollmentStore.js";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { courses, fetchMyCourses, deleteCourse } = useCourseStore();
  const { enrollments, fetchAdminEnrollments } = useEnrollmentStore();
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await dashboardApi.admin();
      setStats(data);
      await fetchMyCourses();
      await fetchAdminEnrollments();
      setLoading(false);
    };
    load();
  }, [fetchMyCourses, fetchAdminEnrollments]);

  if (loading || !stats) {
    return <Skeleton className="h-64" />;
  }

  const onConfirmDelete = async () => {
    if (!courseToDelete) return;
    await deleteCourse(courseToDelete._id);
    await fetchMyCourses();
    setCourseToDelete(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-slate-400">Total courses</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{stats.totalCourses}</h3>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Enrollments</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{stats.totalEnrollments}</h3>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Estimated revenue</p>
          <h3 className="mt-3 text-2xl font-semibold text-white">${stats.estimatedRevenue}</h3>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Your courses</h3>
        <DataTable
          columns={[
            { key: "title", label: "Title" },
            { key: "price", label: "Price", render: (row) => `$${row.price}` },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex gap-2">
                  <Link to={`/admin/courses/${row._id}/edit`}>
                    <Button variant="secondary" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => setCourseToDelete(row)}>
                    Delete
                  </Button>
                </div>
              )
            }
          ]}
          rows={courses}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Recent enrollments</h3>
        <DataTable
          columns={[
            { key: "course", label: "Course", render: (row) => row.courseId?.title || "Course" },
            {
              key: "status",
              label: "Status",
              render: (row) => (
                <Badge tone={row.completed ? "success" : "info"}>
                  {row.completed ? "Completed" : "Active"}
                </Badge>
              )
            }
          ]}
          rows={enrollments}
        />
      </div>

      <Modal
        open={Boolean(courseToDelete)}
        title="Delete course"
        onClose={() => setCourseToDelete(null)}
        primaryLabel="Delete"
        onPrimary={onConfirmDelete}
      >
        This will permanently remove the course and its enrollments.
      </Modal>
    </div>
  );
};

export default AdminDashboard;
