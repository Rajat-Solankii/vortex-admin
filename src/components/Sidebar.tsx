"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, ShieldAlert, Database } from "lucide-react";

const navItems = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Database", href: "/database", icon: Database },
  { name: "Users", href: "/users", icon: Users },
  { name: "Security", href: "/security", icon: ShieldAlert },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 flex flex-col bg-[#07090e] border-r border-white/5 z-20 transition-all shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
      <div className="h-16 flex items-center px-6 border-b border-white/5 bg-black/20">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vortex to-vortex-dark flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(112,71,235,0.4)]">
          <span className="font-bold text-white text-lg leading-none mt-0.5">V</span>
        </div>
        <span className="text-lg font-bold tracking-wide text-white">Vortex Admin</span>
      </div>
      
      <div className="flex-1 py-8 px-4 overflow-y-auto flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? "text-white bg-vortex/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_20px_rgba(112,71,235,0.2)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 w-1 h-full bg-vortex shadow-[0_0_10px_#7047eb]"></div>
              )}
              <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-vortex' : 'group-hover:text-vortex'}`} />
              <span className="font-semibold text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <a href="http://localhost:3000" className="flex items-center gap-3 px-4 py-3.5 rounded-xl w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group">
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm tracking-wide">Return to App</span>
        </a>
      </div>
    </aside>
  );
}
