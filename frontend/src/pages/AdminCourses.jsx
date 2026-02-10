import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../components/common/DataTable.jsx";
import Button from "../components/ui/Button.jsx";
import Modal from "../components/common/Modal.jsx";
import { useCourseStore } from "../store/courseStore.js";

const AdminCourses = () => {
  const { courses, fetchMyCourses, deleteCourse } = useCourseStore();
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  const onConfirmDelete = async () => {
    if (!courseToDelete) return;
    await deleteCourse(courseToDelete._id);
    await fetchMyCourses();
    setCourseToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-white">Your courses</h2>
          <p className="text-sm text-slate-300">Manage content, pricing, and lessons.</p>
        </div>
        <Link to="/admin/courses/new">
          <Button>Create course</Button>
        </Link>
      </div>

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

      <Modal
        open={Boolean(courseToDelete)}
        title="Delete course"
        onClose={() => setCourseToDelete(null)}
        primaryLabel="Delete"
        onPrimary={onConfirmDelete}
      >
        This will permanently remove the course and its lessons.
      </Modal>
    </div>
  );
};

export default AdminCourses;
