import { Link, useLocation } from "wouter";
import { 
  Home, 
  PlusCircle, 
  Folder, 
  Video, 
  Mic, 
  BarChart3,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Create Content", href: "/create", icon: PlusCircle },
  { name: "Content Library", href: "/library", icon: Folder },
  { name: "Video Scripts", href: "/scripts", icon: Video },
  { name: "Voice Scripts", href: "/voice", icon: Mic },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white border-r border-neutral-200 flex flex-col">
      {/* Logo Header */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-neutral-800">ContentCraft</span>
        </div>
      </div>
  {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <a
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-neutral-600 hover:bg-neutral-100"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-medium">AJ</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-800">Alex Johnson</p>
            <p className="text-xs text-neutral-500">Content Creator</p>
          </div>
        </div>
      </div>
    </div>
  );
}