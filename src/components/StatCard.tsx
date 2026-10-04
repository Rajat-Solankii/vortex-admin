import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: LucideIcon;
  href?: string;
}

import Link from "next/link";

export default function StatCard({ title, value, trend, isPositive, icon: Icon, href }: StatCardProps) {
  const content = (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 group h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-vortex/20 group-hover:text-vortex transition-all duration-300">
          <Icon className="w-6 h-6 text-gray-400 group-hover:text-vortex" />
        </div>
        <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {isPositive ? '+' : ''}{trend}
        </span>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
    </div>
  );

  return href ? (
    <Link href={href} className="block cursor-pointer">
      {content}
    </Link>
  ) : content;
}
