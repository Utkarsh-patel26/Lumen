import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
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
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);

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
        imageUrl: course.imageUrl || ""
      });
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
        thumbnailUrl: form.thumbnailUrl
      };

      if (form.imageUrl) {
        payload.imageUrl = form.imageUrl;
      }

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

  return (
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
          name="imageUrl"
          placeholder="https://..."
          value={form.imageUrl}
          onChange={onChange}
        />
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Saving..." : "Save course"}
        </Button>
      </form>
    </Card>
  );
};

export default AdminCourseForm;
