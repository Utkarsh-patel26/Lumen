import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";

const SectionCard = ({ section, isOpen, onToggle, children }) => {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase text-slate-400">Section</p>
          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
        </div>
        {onToggle && (
          <Button variant="ghost" size="sm" onClick={onToggle}>
            {isOpen ? "Hide lessons" : "View lessons"}
          </Button>
        )}
      </div>
      {isOpen && <div className="space-y-3">{children}</div>}
    </Card>
  );
};

export default SectionCard;
