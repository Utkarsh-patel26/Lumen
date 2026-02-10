import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/common/CourseCard.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import { useCourseStore } from "../store/courseStore.js";
import { useAuthStore } from "../store/authStore.js";
import { useEnrollmentStore } from "../store/enrollmentStore.js";
import useDebouncedValue from "../hooks/useDebouncedValue.js";

const CoursesList = () => {
  const { courses, loading, total, page, limit, fetchCourses } = useCourseStore();
  const { role, token } = useAuthStore();
  const { enroll } = useEnrollmentStore();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);

  useEffect(() => {
    fetchCourses({ page: 1, limit, search: debouncedSearch });
  }, [fetchCourses, limit, debouncedSearch]);

  const onEnroll = async (courseId) => {
    await enroll(courseId);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white">Explore courses</h2>
          <p className="text-sm text-slate-300">Curated tracks for builders and creators.</p>
        </div>
        <div className="w-full md:w-72">
          <Input
            name="search"
            placeholder="Search for React, design, AI..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-72" />
          ))}
        </div>
      )}

      {!loading && courses.length === 0 && (
        <EmptyState
          title="No courses yet"
          description="We could not find any course matching your search."
        />
      )}

      {!loading && courses.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              actions={
                <>
                  <Link to={`/courses/${course._id}`}>
                    <Button variant="secondary" size="sm">
                      Details
                    </Button>
                  </Link>
                  {token && role === "student" && (
                    <Button size="sm" onClick={() => onEnroll(course._id)}>
                      Enroll
                    </Button>
                  )}
                </>
              }
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchCourses({ page: Math.max(1, page - 1), limit, search: debouncedSearch })}
            disabled={page <= 1}
          >
            Prev
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchCourses({ page: Math.min(totalPages, page + 1), limit, search: debouncedSearch })}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoursesList;
