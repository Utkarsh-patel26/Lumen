import { useState } from "react";
import Modal from "./Modal.jsx";
import Input from "../ui/Input.jsx";
import Button from "../ui/Button.jsx";
import { uploadsApi } from "../../services/api/uploadsApi.js";

const UploadModal = ({ open, type, onClose, onUploaded, titleLabel, folder }) => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!file || !title) return;
    setLoading(true);
    try {
      const result = await uploadsApi.upload({
        file,
        type: type === "video" ? "video" : "raw",
        folder: folder || "lumen/courses",
        fileName: title.replace(/\s+/g, "-").toLowerCase()
      });
      onUploaded({
        title,
        duration: duration ? Number(duration) : 0,
        url: result.url
      });
      setTitle("");
      setDuration("");
      setFile(null);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={titleLabel || (type === "video" ? "Upload video" : "Upload file")}
      onClose={onClose}
    >
      <div className="space-y-4">
        <Input
          label="Lesson title"
          placeholder="Intro lesson"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        {type === "video" && (
          <Input
            label="Duration (minutes)"
            type="number"
            placeholder="12"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
          />
        )}
        <input
          type="file"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-200"
          accept={type === "video" ? "video/*" : ".pdf,.txt,.doc,.docx"}
        />
        <Button className="w-full" onClick={onSubmit} disabled={loading || !file || !title}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </Modal>
  );
};

export default UploadModal;
