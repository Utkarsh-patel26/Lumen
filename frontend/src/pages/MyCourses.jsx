import { useEffect } from "react";
import DataTable from "../components/common/DataTable.jsx";
import Badge from "../components/ui/Badge.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { useEnrollmentStore } from "../store/enrollmentStore.js";

const MyCourses = () => {
  const { enrollments, fetchMyEnrollments } = useEnrollmentStore();

  useEffect(() => {
    fetchMyEnrollments();
  }, [fetchMyEnrollments]);

  if (enrollments.length === 0) {
    return (
      <EmptyState
        title="No courses yet"
        description="Enroll in a course to start learning and tracking progress."
      />
    );
  }

  return (
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
  );
};

export default MyCourses;
