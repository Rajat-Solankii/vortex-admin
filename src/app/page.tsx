import Link from "next/link";
import StatCard from "@/components/StatCard";
import { Users, Library, Bookmark, ArrowRight, Activity, Clock, Film, Tv, Database as DatabaseIcon, Settings as SettingsIcon } from "lucide-react";
import db from "@/lib/db";
import MediaChart from "@/components/MediaChart";

export default async function Home() {
  // Fetch stats from SQLite
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  const totalCollections = db.prepare('SELECT COUNT(*) as count FROM collections').get() as { count: number };
  const totalBookmarks = db.prepare('SELECT COUNT(*) as count FROM bookmarks').get() as { count: number };

  // Fetch chart data
  const chartData = db.prepare('SELECT mediaType, COUNT(*) as count FROM bookmarks GROUP BY mediaType').all() as { mediaType: string, count: number }[];

  // Fetch recent activity
  const recentBookmarks = db.prepare(`SELECT id, title, mediaType, createdAt, 'bookmark' as type FROM bookmarks ORDER BY createdAt DESC LIMIT 5`).all();
  const recentCollections = db.prepare(`SELECT id, name as title, 'collection' as mediaType, createdAt, 'collection' as type FROM collections ORDER BY createdAt DESC LIMIT 5`).all();
  
  // Mix and sort recent activity
  const recentActivity = [...recentBookmarks, ...recentCollections]
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4) as Array<{ id: number, title: string, mediaType: string, createdAt: string, type: string }>;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-4 h-[calc(100vh-8rem)] overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Overview</h1>
          <p className="text-gray-400">Real-time statistics from Vortex platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 shrink-0">
        <StatCard title="Total Users" value={totalUsers.count.toLocaleString()} trend="Live" isPositive={true} icon={Users} href="/users" />
        <StatCard title="Total Collections" value={totalCollections.count.toLocaleString()} trend="Live" isPositive={true} icon={Library} href="/database" />
        <StatCard title="Total Bookmarks" value={totalBookmarks.count.toLocaleString()} trend="Live" isPositive={true} icon={Bookmark} href="/database" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-0 flex-1 pb-4">
        {/* Recent Activity Feed */}
        <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-white/10 transition-colors flex flex-col h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-vortex/5 rounded-full blur-3xl group-hover:bg-vortex/10 transition-colors"></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10 shrink-0">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Clock className="text-vortex w-5 h-5" /> Recent Activity
            </h2>
          </div>
          
          <div className="space-y-3 relative z-10 overflow-y-auto flex-1 pr-2">
            {recentActivity.length === 0 ? (
               <div className="p-8 text-center text-gray-500 bg-white/[0.01] rounded-2xl border border-white/5">
                 No recent activity found.
               </div>
            ) : (
              recentActivity.map((activity, idx) => (
                <div key={`${activity.type}-${activity.id}-${idx}`} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-vortex/10 flex items-center justify-center border border-vortex/20">
                      {activity.type === 'bookmark' ? (
                        activity.mediaType === 'movie' ? <Film className="w-5 h-5 text-vortex-light" /> : <Tv className="w-5 h-5 text-vortex-light" />
                      ) : (
                        <Library className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        New {activity.type} created: <span className="font-semibold text-vortex-light">{activity.title}</span>
                      </p>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 h-full">
          {/* Analytics Chart */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl hover:border-white/10 transition-colors flex flex-col h-1/2">
            <h2 className="text-xl font-bold text-white mb-2 shrink-0">Bookmark Distribution</h2>
            <div className="flex-1 flex flex-col justify-center bg-black/20 rounded-2xl border border-white/5 p-2 min-h-0">
              <MediaChart data={chartData} />
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl hover:border-white/10 transition-colors flex flex-col h-1/2">
            <h2 className="text-xl font-bold text-white mb-4 shrink-0">Quick Actions</h2>
            <div className="flex flex-col gap-3 flex-1 justify-center">
              <Link href="/database" className="w-full bg-white/[0.03] hover:bg-white/[0.06] text-white p-4 rounded-xl flex items-center justify-between transition-all duration-300 border border-white/5 hover:border-vortex/30 group hover:shadow-[0_0_20px_rgba(112,71,235,0.15)]">
                <span className="font-semibold text-md flex items-center gap-2"><DatabaseIcon className="w-4 h-4 text-gray-400 group-hover:text-vortex transition-colors" /> Manage Database</span>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-vortex group-hover:-rotate-45 transition-all duration-300" />
              </Link>
              <Link href="/settings" className="w-full bg-white/[0.03] hover:bg-white/[0.06] text-white p-4 rounded-xl flex items-center justify-between transition-all duration-300 border border-white/5 hover:border-vortex/30 group hover:shadow-[0_0_20px_rgba(112,71,235,0.15)]">
                <span className="font-semibold text-md flex items-center gap-2"><SettingsIcon className="w-4 h-4 text-gray-400 group-hover:text-vortex transition-colors" /> System Settings</span>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-vortex group-hover:-rotate-45 transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

