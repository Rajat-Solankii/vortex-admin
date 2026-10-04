import { Search, Shield, ShieldAlert, User as UserIcon, Network } from "lucide-react";
import db from "@/lib/db";
import DeleteUserButton from "@/components/DeleteUserButton";
import BanIpButton from "@/components/BanIpButton";

export default async function UsersPage() {
  // Fetch users from SQLite
  const users = db.prepare('SELECT id, name, email, role, createdAt, lastIp FROM users ORDER BY createdAt DESC').all() as Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    lastIp: string | null;
  }>;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">User Management</h1>
          <p className="text-gray-400">View and manage all registered users.</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex items-center w-96 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-vortex/50 focus:bg-white/10 transition-all shadow-inner"
            />
          </div>
          <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg">
            Export CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] text-gray-400 text-sm border-b border-white/5">
                <th className="px-8 py-5 font-semibold tracking-wide">User</th>
                <th className="px-8 py-5 font-semibold tracking-wide">Role</th>
                <th className="px-8 py-5 font-semibold tracking-wide">Joined Date</th>
                <th className="px-8 py-5 font-semibold tracking-wide">Last IP</th>
                <th className="px-8 py-5 font-semibold tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:border-vortex/30 group-hover:from-vortex/20 transition-all">
                        <UserIcon className="w-6 h-6 text-gray-300 group-hover:text-vortex-light transition-colors" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-base">{user.name}</div>
                        <div className="text-sm text-gray-400 mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-2 text-sm font-medium text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg w-max border border-white/5">
                      {user.role === 'admin' ? <ShieldAlert className="w-4 h-4 text-vortex" /> : 
                       user.role === 'moderator' ? <Shield className="w-4 h-4 text-blue-400" /> : 
                       <UserIcon className="w-4 h-4 text-gray-500" />}
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-400 font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-400 font-medium">
                    {user.lastIp ? (
                      <span className="flex items-center gap-1.5"><Network className="w-3.5 h-3.5 text-gray-500" /> {user.lastIp}</span>
                    ) : 'Unknown'}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <BanIpButton ip={user.lastIp || ""} userName={user.name} />
                      <DeleteUserButton id={user.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
