import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function LinkDetail({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
      {children} <ArrowRight size={16} />
    </Link>
  );
}
