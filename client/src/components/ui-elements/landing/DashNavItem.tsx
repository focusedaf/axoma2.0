import { LucideIcon } from "lucide-react";
import Link from "next/link"; 

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
}

const DashNavItem = ({ icon: Icon, label, href, isActive }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 p-3 rounded-lg cursor-pointer group
        ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }
        transition-colors duration-200
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default DashNavItem