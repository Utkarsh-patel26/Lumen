import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-4xl font-semibold text-white">Lost in orbit</h1>
      <p className="text-sm text-slate-300">The page you are looking for does not exist.</p>
      <Link to="/">
        <Button>Return home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
