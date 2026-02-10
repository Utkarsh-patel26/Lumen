import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import UploadModal from "../components/common/UploadModal.jsx";
import { sectionsApi } from "../services/api/sectionsApi.js";
import { lessonsApi } from "../services/api/lessonsApi.js";
import { useCourseStore } from "../store/courseStore.js";

const AdminCourseForm = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { course, fetchCourse, createCourse, updateCourse } = useCourseStore();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    thumbnailUrl: "",
    heroImageUrl: "",
    status: "published"
  });
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [sectionTitle, setSectionTitle] = useState("");
  const [uploadState, setUploadState] = useState(null);
  const [orderingDirty, setOrderingDirty] = useState(false);
  const [sectionDrag, setSectionDrag] = useState(null);
  const [lessonDrag, setLessonDrag] = useState(null);

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchCourse(id);
    }
  }, [mode, id, fetchCourse]);

  useEffect(() => {
    if (mode === "edit" && course) {
      setForm({
        title: course.title || "",
        description: course.description || "",
        price: course.price || "",
        thumbnailUrl: course.thumbnailUrl || "",
        heroImageUrl: course.heroImageUrl || "",
        status: course.status || "published"
      });
      const orderedSections = (course.sections || [])
        .slice()
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setSections(orderedSections);
    }
  }, [mode, course]);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        thumbnailUrl: form.thumbnailUrl,
        heroImageUrl: form.heroImageUrl || undefined,
        status: form.status || "published"
      };
      if (mode === "edit" && id) {
        await updateCourse(id, payload);
      } else {
        await createCourse(payload);
      }
      navigate("/dashboard/admin");
    } finally {
      setLoading(false);
    }
  };

  const orderedSections = useMemo(
    () => sections.slice().sort((a, b) => (a.order || 0) - (b.order || 0)),
    [sections]
  );

  const normalizeOrder = (items) =>
    items.map((item, index) => ({ ...item, order: index }));

  const onAddSection = async () => {
    if (!sectionTitle.trim() || !id) return;
    const created = await sectionsApi.create(id, {
      title: sectionTitle.trim(),
      order: sections.length
    });
    setSections((prev) => [...prev, created]);
    setSectionTitle("");
  };

  const onDeleteSection = async (sectionId) => {
    await sectionsApi.remove(sectionId);
    setSections((prev) =>
      normalizeOrder(prev.filter((section) => section._id !== sectionId))
    );
    setOrderingDirty(true);
  };

  const onUpdateSection = async (sectionId, updates) => {
    const updated = await sectionsApi.update(sectionId, updates);
    setSections((prev) =>
      prev.map((section) => (section._id === sectionId ? { ...section, ...updated } : section))
    );
  };

  const onDeleteLesson = async (sectionId, lessonId) => {
    await lessonsApi.remove(lessonId);
    setSections((prev) =>
      prev.map((section) =>
        section._id === sectionId
          ? {
              ...section,
              lessons: normalizeOrder(section.lessons.filter((lesson) => lesson._id !== lessonId))
            }
          : section
      )
    );
    setOrderingDirty(true);
  };

  const onUpdateLesson = async (sectionId, lessonId, updates) => {
    const updated = await lessonsApi.update(lessonId, updates);
    setSections((prev) =>
      prev.map((section) =>
        section._id === sectionId
          ? {
              ...section,
              lessons: section.lessons.map((lesson) =>
                lesson._id === lessonId ? { ...lesson, ...updated } : lesson
              )
            }
          : section
      )
    );
  };

  const onUploadLesson = async ({ sectionId, type, title, duration, url }) => {
    const payload = {
      title,
      type,
      duration,
      order: sections.find((section) => section._id === sectionId)?.lessons?.length || 0
    };
    if (type === "video") payload.videoUrl = url;
    if (type === "file") payload.fileUrl = url;

    const lesson = await lessonsApi.create(sectionId, payload);
    setSections((prev) =>
      prev.map((section) =>
        section._id === sectionId
          ? { ...section, lessons: [...section.lessons, lesson] }
          : section
      )
    );
  };

  const onSectionDragStart = (sectionId) => setSectionDrag(sectionId);

  const onSectionDrop = (targetSectionId) => {
    if (!sectionDrag || sectionDrag === targetSectionId) return;
    const fromIndex = orderedSections.findIndex((section) => section._id === sectionDrag);
    const toIndex = orderedSections.findIndex((section) => section._id === targetSectionId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...orderedSections];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setSections(normalizeOrder(reordered));
    setOrderingDirty(true);
    setSectionDrag(null);
  };

  const onLessonDragStart = (sectionId, lessonId) =>
    setLessonDrag({ sectionId, lessonId });

  const onLessonDrop = (sectionId, lessonId) => {
    if (!lessonDrag || lessonDrag.sectionId !== sectionId) return;
    const section = orderedSections.find((entry) => entry._id === sectionId);
    if (!section) return;

    const lessons = section.lessons.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    const fromIndex = lessons.findIndex((lesson) => lesson._id === lessonDrag.lessonId);
    const toIndex = lessons.findIndex((lesson) => lesson._id === lessonId);
    if (fromIndex === -1 || toIndex === -1) return;

    const reordered = [...lessons];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    const normalizedLessons = normalizeOrder(reordered);

    setSections((prev) =>
      prev.map((entry) =>
        entry._id === sectionId ? { ...entry, lessons: normalizedLessons } : entry
      )
    );
    setOrderingDirty(true);
    setLessonDrag(null);
  };

  const saveOrdering = async () => {
    for (const section of sections) {
      await sectionsApi.update(section._id, { order: section.order });
      for (const lesson of section.lessons) {
        await lessonsApi.update(lesson._id, { order: lesson.order });
      }
    }
    setOrderingDirty(false);
  };

  return (
    <div className="space-y-8">
      <Card className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {mode === "edit" ? "Edit course" : "Create course"}
          </h2>
          <p className="text-sm text-slate-300">Share your expertise with the community.</p>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            label="Title"
            name="title"
            placeholder="Design systems mastery"
            value={form.title}
            onChange={onChange}
            required
          />
          <Input
            label="Description"
            name="description"
            placeholder="Course overview"
            value={form.description}
            onChange={onChange}
            required
          />
          <Input
            label="Price"
            name="price"
            type="number"
            placeholder="120"
            value={form.price}
            onChange={onChange}
            required
          />
          <Input
            label="Thumbnail URL"
            name="thumbnailUrl"
            placeholder="https://..."
            value={form.thumbnailUrl}
            onChange={onChange}
            required
          />
          <Input
            label="Hero image URL"
            name="heroImageUrl"
            placeholder="https://..."
            value={form.heroImageUrl}
            onChange={onChange}
          />
          <label className="block text-sm text-slate-200">
            <span className="mb-2 block font-medium">Status</span>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save course"}
          </Button>
        </form>
      </Card>

      {mode === "edit" && id && (
        <Card className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-white">Course builder</h3>
              <p className="text-sm text-slate-300">Create sections and add lessons.</p>
            </div>
            {orderingDirty && (
              <Button variant="secondary" onClick={saveOrdering}>
                Save ordering
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <Input
              label="New section"
              placeholder="Basics of Java"
              value={sectionTitle}
              onChange={(event) => setSectionTitle(event.target.value)}
            />
            <Button onClick={onAddSection}>Add section</Button>
          </div>

          <div className="space-y-4">
            {orderedSections.map((section) => (
              <div
                key={section._id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
                draggable
                onDragStart={() => onSectionDragStart(section._id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onSectionDrop(section._id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge tone="info">Section</Badge>
                      <span className="text-xs text-slate-400">Drag to reorder</span>
                    </div>
                    <Input
                      label="Title"
                      value={section.title}
                      onChange={(event) =>
                        setSections((prev) =>
                          prev.map((entry) =>
                            entry._id === section._id
                              ? { ...entry, title: event.target.value }
                              : entry
                          )
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onUpdateSection(section._id, { title: section.title })}
                    >
                      Save title
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDeleteSection(section._id)}>
                      Delete section
                    </Button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => setUploadState({ sectionId: section._id, type: "video" })}
                    >
                      Add video
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setUploadState({ sectionId: section._id, type: "file" })}
                    >
                      Add file
                    </Button>
                  </div>

                  {section.lessons
                    .slice()
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((lesson) => (
                      <div
                        key={lesson._id}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
                        draggable
                        onDragStart={() => onLessonDragStart(section._id, lesson._id)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => onLessonDrop(section._id, lesson._id)}
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs text-slate-400">Drag</span>
                          <Badge tone={lesson.type === "video" ? "info" : "warn"}>
                            {lesson.type === "video" ? "Video" : "File"}
                          </Badge>
                        </div>
                        <div className="flex flex-1 flex-wrap items-end gap-3">
                          <Input
                            label="Lesson title"
                            value={lesson.title}
                            onChange={(event) =>
                              setSections((prev) =>
                                prev.map((entry) =>
                                  entry._id === section._id
                                    ? {
                                        ...entry,
                                        lessons: entry.lessons.map((item) =>
                                          item._id === lesson._id
                                            ? { ...item, title: event.target.value }
                                            : item
                                        )
                                      }
                                    : entry
                                )
                              )
                            }
                          />
                          {lesson.type === "video" && (
                            <Input
                              label="Duration (min)"
                              type="number"
                              value={lesson.duration || ""}
                              onChange={(event) =>
                                setSections((prev) =>
                                  prev.map((entry) =>
                                    entry._id === section._id
                                      ? {
                                          ...entry,
                                          lessons: entry.lessons.map((item) =>
                                            item._id === lesson._id
                                              ? { ...item, duration: event.target.value }
                                              : item
                                          )
                                        }
                                      : entry
                                  )
                                )
                              }
                            />
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                              onUpdateLesson(section._id, lesson._id, {
                                title: lesson.title,
                                duration: lesson.duration ? Number(lesson.duration) : 0
                              })
                            }
                          >
                            Save lesson
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteLesson(section._id, lesson._id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <UploadModal
        open={Boolean(uploadState)}
        type={uploadState?.type}
        folder={
          uploadState?.sectionId && id
            ? `lumen/courses/${id}/${uploadState.sectionId}`
            : "lumen/courses"
        }
        onClose={() => setUploadState(null)}
        onUploaded={(payload) => {
          if (!uploadState) return;
          onUploadLesson({
            sectionId: uploadState.sectionId,
            type: uploadState.type,
            title: payload.title,
            duration: payload.duration,
            url: payload.url
          });
        }}
      />
    </div>
  );
};

export default AdminCourseForm;
