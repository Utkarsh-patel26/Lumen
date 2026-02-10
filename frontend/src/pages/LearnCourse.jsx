import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import SectionCard from "../components/common/SectionCard.jsx";
import LessonItem from "../components/common/LessonItem.jsx";
import VideoPlayer from "../components/common/VideoPlayer.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { useCourseStore } from "../store/courseStore.js";
import { useEnrollmentStore } from "../store/enrollmentStore.js";

const sortByOrder = (items = []) => [...items].sort((a, b) => (a.order || 0) - (b.order || 0));

const LearnCourse = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { course, loading, fetchCourse } = useCourseStore();
  const { enrollments, fetchMyEnrollments, markLessonComplete } = useEnrollmentStore();
  const [openSectionId, setOpenSectionId] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
      fetchMyEnrollments();
    }
  }, [courseId, fetchCourse, fetchMyEnrollments]);

  const enrollment = enrollments.find((entry) => entry.courseId?._id === courseId);
  const canLearn = Boolean(enrollment);
  const completedLessons = enrollment?.completedLessons || [];
  const completedLessonIds = new Set(completedLessons.map((id) => String(id)));

  const sections = useMemo(() => sortByOrder(course?.sections || []), [course]);
  const selectedLesson = useMemo(() => {
    for (const section of sections) {
      const lesson = section.lessons.find((item) => item._id === lessonId);
      if (lesson) return lesson;
    }
    return null;
  }, [sections, lessonId]);

  useEffect(() => {
    if (!openSectionId && sections.length > 0) {
      setOpenSectionId(sections[0]._id);
    }
  }, [openSectionId, sections]);

  const onComplete = async () => {
    if (!courseId || !lessonId || !canLearn) return;
    await markLessonComplete(courseId, lessonId);
    await fetchMyEnrollments();
  };

  if (loading || !course) {
    return <Skeleton className="h-64" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to={`/courses/${courseId}`} className="text-sm text-slate-300">
            {"<- Back to course"}
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-white">{course.title}</h1>
          <p className="text-sm text-slate-300">Keep learning and track your progress.</p>
        </div>
        <Link to="/my-courses">
          <Button variant="secondary">View my courses</Button>
        </Link>
      </div>

      {!enrollment && (
        <Card>
          <p className="text-sm text-slate-300">
            You are not enrolled in this course yet. Enroll from the course page to start learning.
          </p>
        </Card>
      )}

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold text-white">{selectedLesson?.title || "Select a lesson"}</h2>
        {!canLearn && (
          <p className="text-sm text-slate-400">
            Enrollment is required to unlock video playback and downloads.
          </p>
        )}
        {canLearn && selectedLesson?.type === "video" ? (
          <VideoPlayer src={selectedLesson.videoUrl} onComplete={onComplete} />
        ) : canLearn && selectedLesson?.type === "file" ? (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => {
                if (selectedLesson.fileUrl) window.open(selectedLesson.fileUrl, "_blank", "noopener");
                onComplete();
              }}
            >
              Open file
            </Button>
            <p className="text-sm text-slate-300">This lesson is a downloadable resource.</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Choose a lesson to start learning.</p>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionCard
              key={section._id}
              section={section}
              isOpen={openSectionId === section._id}
              onToggle={() => setOpenSectionId(section._id)}
            >
              {sortByOrder(section.lessons).map((lesson) => (
                <LessonItem
                  key={lesson._id}
                  lesson={lesson}
                  completed={completedLessonIds.has(String(lesson._id))}
                  disabled={!canLearn}
                  actionLabel={canLearn ? "Open lesson" : "Enroll to start"}
                  onOpen={() => {
                    if (canLearn) {
                      navigate(`/learn/${courseId}/${lesson._id}`);
                    }
                  }}
                />
              ))}
            </SectionCard>
          ))}
        </div>
        <Card className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Lessons</h3>
          {sections.map((section) => (
            <div key={section._id}>
              <p className="text-xs uppercase text-slate-400">{section.title}</p>
              <div className="mt-2 space-y-2">
                {sortByOrder(section.lessons).map((lesson) =>
                  canLearn ? (
                    <Link
                      key={lesson._id}
                      to={`/learn/${courseId}/${lesson._id}`}
                      className="block rounded-2xl border border-white/10 px-3 py-2 text-sm text-slate-200 hover:border-emerald-400/40"
                    >
                      {lesson.title}
                    </Link>
                  ) : (
                    <span
                      key={lesson._id}
                      className="block rounded-2xl border border-white/5 px-3 py-2 text-sm text-slate-500"
                    >
                      {lesson.title}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default LearnCourse;
