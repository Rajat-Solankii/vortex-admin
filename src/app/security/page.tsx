import { ShieldAlert, Network } from "lucide-react";
import db from "@/lib/db";
import UnbanIpButton from "@/components/UnbanIpButton";

export default async function SecurityPage() {
  const bannedIps = db.prepare('SELECT ip, reason, bannedAt FROM banned_ips ORDER BY bannedAt DESC').all() as Array<{
    ip: string;
    reason: string;
    bannedAt: string;
  }>;

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Security & Bans</h1>
          <p className="text-gray-400">Manage banned IPs and platform security.</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex items-center bg-white/[0.01]">
          <h2 className="text-xl font-bold flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-500" /> Banned IP Addresses</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] text-gray-400 text-sm border-b border-white/5">
                <th className="px-8 py-5 font-semibold tracking-wide">IP Address</th>
                <th className="px-8 py-5 font-semibold tracking-wide">Reason</th>
                <th className="px-8 py-5 font-semibold tracking-wide">Banned Date</th>
                <th className="px-8 py-5 font-semibold tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bannedIps.map((record) => (
                <tr key={record.ip} className="hover:bg-white/[0.04] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3 font-semibold text-white">
                      <Network className="w-4 h-4 text-gray-400" />
                      {record.ip}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-gray-300">
                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg text-sm">
                      {record.reason}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-400 font-medium">
                    {new Date(record.bannedAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end">
                      <UnbanIpButton ip={record.ip} />
                    </div>
                  </td>
                </tr>
              ))}
              {bannedIps.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-gray-500">
                    No IPs are currently banned.
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
