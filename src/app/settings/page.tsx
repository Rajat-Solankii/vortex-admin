import { Settings } from "lucide-react";
import SettingsForm from "@/components/SettingsForm";
import db from "@/lib/db";

export const dynamic = 'force-dynamic';
export default async function SettingsPage() {
  const getSetting = (key: string, defaultValue: string) => {
    const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
    return setting ? setting.value : defaultValue;
  };

  const platformName = getSetting('platform_name', 'Vortex Media');
  const supportEmail = getSetting('support_email', 'support@vortex.app');
  const publicRegistration = getSetting('public_registration', 'false') === 'true';

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-4 h-[calc(100vh-8rem)] overflow-hidden">
      <div className="flex items-center justify-between relative">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your admin preferences and platform configurations.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-72 flex flex-col gap-2">
          <button className="flex items-center gap-3 px-5 py-4 bg-vortex/10 text-vortex border border-vortex/20 rounded-2xl font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all">
            <Settings className="w-5 h-5" /> General Settings
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col min-h-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-vortex/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          <h2 className="text-xl font-bold text-white mb-4 relative z-10 shrink-0">General Settings</h2>
          
          <div className="overflow-y-auto flex-1 pr-4 custom-scrollbar relative z-10">
            <SettingsForm 
              initialPlatformName={platformName}
              initialSupportEmail={supportEmail}
              initialPublicRegistration={publicRegistration}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
