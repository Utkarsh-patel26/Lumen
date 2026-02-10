import clsx from "clsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";

const LessonItem = ({ lesson, completed, onOpen, disabled, actionLabel }) => {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3",
        completed && "border-emerald-400/40"
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge tone={lesson.type === "video" ? "info" : "warn"}>
            {lesson.type === "video" ? "Video" : "File"}
          </Badge>
          {completed && <Badge tone="success">Completed</Badge>}
        </div>
        <p className="text-sm font-semibold text-white">{lesson.title}</p>
        {lesson.duration ? (
          <p className="text-xs text-slate-400">{lesson.duration} min</p>
        ) : null}
      </div>
      <Button variant="secondary" size="sm" onClick={onOpen} disabled={disabled}>
        {actionLabel || "Open lesson"}
      </Button>
    </div>
  );
};

export default LessonItem;
