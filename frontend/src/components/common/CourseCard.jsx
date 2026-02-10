import { Link } from "react-router-dom";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import Button from "../ui/Button.jsx";

const CourseCard = ({ course, actions, ctaLabel = "Details" }) => {
  const cover = course.thumbnailUrl || course.heroImageUrl || "/course-thumb-placeholder.svg";

  return (
    <Card className="flex flex-col gap-4 overflow-hidden p-0">
      <div className="relative h-40">
        <img
          src={cover}
          alt={course.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
      </div>
      <div className="space-y-3 px-6 pb-6">
        <Badge tone="info">Course</Badge>
        <div>
          <h3 className="text-lg font-semibold text-white">{course.title}</h3>
          <p className="mt-2 text-sm text-slate-300 line-clamp-2">{course.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-emerald-200">${course.price}</span>
          <div className="flex gap-2">
            {actions || (
              <Link to={`/courses/${course._id}`}>
                <Button variant="secondary" size="sm">
                  {ctaLabel}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
