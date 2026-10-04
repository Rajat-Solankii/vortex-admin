import { Search, Bell, User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 w-full fixed top-0 pl-64 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md border-b border-white/10 z-10">
      <div className="flex items-center w-96 relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3" />
        <input 
          type="text" 
          placeholder="Search everywhere..." 
          className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-vortex focus:ring-1 focus:ring-vortex transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5 text-gray-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-vortex rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-vortex to-purple-400 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Admin User</span>
            <span className="text-xs text-gray-400">admin@vortex.app</span>
          </div>
        </div>
      </div>
    </header>
  );
}
