import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function LinkDetail({ to, children }) {
  return (
    <Link
      to={to}
      className="
        inline-flex items-center gap-2 
        px-3 py-2 rounded-lg
        text-sm font-medium text-blue-600 
        hover:bg-blue-50 hover:text-blue-700
        active:bg-blue-100
        transition-colors duration-150
        touch-manipulation
      "
    >
      {children}
      <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
