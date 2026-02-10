import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import SectionCard from "../components/common/SectionCard.jsx";
import LessonItem from "../components/common/LessonItem.jsx";
import { useCourseStore } from "../store/courseStore.js";
import { useEnrollmentStore } from "../store/enrollmentStore.js";
import { useAuthStore } from "../store/authStore.js";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { course, loading, fetchCourse } = useCourseStore();
  const { role, token } = useAuthStore();
  const { enroll, enrollments, fetchMyEnrollments } = useEnrollmentStore();
  const [openSectionId, setOpenSectionId] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCourse(id);
      if (token && role === "student") {
        fetchMyEnrollments();
      }
    }
  }, [fetchCourse, fetchMyEnrollments, id, role, token]);

  if (loading || !course) {
    return <Skeleton className="h-64" />;
  }

  const heroImage = course.heroImageUrl || course.thumbnailUrl || "/course-hero-placeholder.svg";
  const sections = useMemo(
    () => (course.sections || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0)),
    [course]
  );
  const enrollment = enrollments.find((entry) => entry.courseId?._id === course._id);
  const canLearn = token && role === "student" && enrollment;
  const completedLessons = enrollment?.completedLessons || [];
  const completedLessonIds = new Set(completedLessons.map((id) => String(id)));

  useEffect(() => {
    if (!openSectionId && sections.length > 0) {
      setOpenSectionId(sections[0]._id);
    }
  }, [openSectionId, sections]);

  return (
    <div className="space-y-8">
      <Link to="/courses" className="text-sm text-slate-300">
        {"<- Back to courses"}
      </Link>
      <Card className="space-y-6 overflow-hidden p-0">
        <div className="relative h-64">
          <img
            src={heroImage}
            alt={course.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
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
              <Button
                onClick={async () => {
                  await enroll(course._id);
                  await fetchMyEnrollments();
                }}
              >
                Enroll now
              </Button>
            )}
            <Button variant="secondary">Preview</Button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Course content</h3>
          {token && role === "student" && enrollment && sections.length > 0 && (
            <Link to={`/learn/${course._id}/${sections[0]?.lessons?.[0]?._id || ""}`}>
              <Button size="sm" disabled={!sections[0]?.lessons?.length}>
                Start learning
              </Button>
            </Link>
          )}
        </div>
        {sections.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-300">Lessons will appear here once the instructor adds them.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {sections.map((section) => (
              <SectionCard
                key={section._id}
                section={section}
                isOpen={openSectionId === section._id}
                onToggle={() => setOpenSectionId(section._id)}
              >
                {section.lessons
                  .slice()
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((lesson) => (
                    <LessonItem
                      key={lesson._id}
                      lesson={lesson}
                      completed={completedLessonIds.has(String(lesson._id))}
                      disabled={!canLearn}
                      actionLabel={canLearn ? "Open lesson" : "Enroll to start"}
                      onOpen={() => {
                        if (canLearn) {
                          navigate(`/learn/${course._id}/${lesson._id}`);
                        }
                      }}
                    />
                  ))}
              </SectionCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
