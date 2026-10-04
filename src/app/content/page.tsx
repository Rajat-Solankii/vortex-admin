import { Plus, Search, Filter, PlayCircle, MoreVertical } from "lucide-react";

export default function ContentPage() {
  const media = [
    { id: 1, title: "Stranger Things", type: "TV Show", views: "1.2M", status: "Published", added: "Oct 2, 2026", cover: "bg-red-900/50" },
    { id: 2, title: "The Dark Knight", type: "Movie", views: "850K", status: "Published", added: "Sep 28, 2026", cover: "bg-blue-900/50" },
    { id: 3, title: "Breaking Bad", type: "TV Show", views: "2.1M", status: "Published", added: "Sep 15, 2026", cover: "bg-green-900/50" },
    { id: 4, title: "Inception", type: "Movie", views: "620K", status: "Draft", added: "Oct 3, 2026", cover: "bg-indigo-900/50" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Content Management</h1>
          <p className="text-gray-400">Manage your movies, TV shows, and media catalog.</p>
        </div>
        <button className="bg-vortex hover:bg-vortex-light text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(112,71,235,0.4)] flex items-center gap-2">
          <Plus className="w-4 h-4" /> Upload Media
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center w-80 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            <input 
              type="text" 
              placeholder="Search content by title..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-vortex focus:ring-1 focus:ring-vortex transition-all"
            />
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {media.map((item) => (
            <div key={item.id} className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-vortex/50 transition-all">
              <div className={`h-40 ${item.cover} relative flex items-center justify-center`}>
                <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-white transition-colors" />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-md border ${
                    item.status === 'Published' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-white text-lg line-clamp-1">{item.title}</h3>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-vortex-light mb-3">{item.type}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{item.views} views</span>
                  <span>Added {item.added}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
