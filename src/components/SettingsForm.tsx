'use client';

import { Key, Save } from "lucide-react";
import { useState, useTransition } from "react";
import MaintenanceToggle from "./MaintenanceToggle";
import { saveSettings } from "@/app/actions";

interface SettingsFormProps {
  initialPlatformName: string;
  initialSupportEmail: string;
  initialPublicRegistration: boolean;
}

export default function SettingsForm({ initialPlatformName, initialSupportEmail, initialPublicRegistration }: SettingsFormProps) {
  const [platformName, setPlatformName] = useState(initialPlatformName);
  const [supportEmail, setSupportEmail] = useState(initialSupportEmail);
  const [publicRegistration, setPublicRegistration] = useState(initialPublicRegistration);
  
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleToggleSave = async (key: string, value: string) => {
    startTransition(async () => {
      await saveSettings([{ key, value }]);
    });
  };

  const handleSave = () => {
    setSaved(false);
    startTransition(async () => {
      await saveSettings([
        { key: 'platform_name', value: platformName },
        { key: 'support_email', value: supportEmail },
        { key: 'public_registration', value: publicRegistration ? 'true' : 'false' },
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  return (
    <>
      <div className="space-y-8 relative z-10 mt-2">
        {/* Platform Name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-300">Platform Name</label>
          <input 
            type="text" 
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-vortex/50 focus:bg-white/10 transition-all shadow-inner max-w-xl"
          />
          <p className="text-xs text-gray-500">The primary name displayed across the user app.</p>
        </div>

        {/* Support Email */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-300">Support Email</label>
          <input 
            type="email" 
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-vortex/50 focus:bg-white/10 transition-all shadow-inner max-w-xl"
          />
        </div>

        <div className="w-full h-px bg-white/5 my-4"></div>

        {/* Maintenance Mode Toggle (Independent) */}
        <div className="flex items-start justify-between max-w-xl">
          <div>
            <h3 className="text-white font-semibold mb-1">Maintenance Mode</h3>
            <p className="text-sm text-gray-400">Temporarily disable the main streaming app for updates.</p>
          </div>
          <div className="mt-0.5">
            <MaintenanceToggle />
          </div>
        </div>

        {/* Public Registration Toggle */}
        <div className="flex items-start justify-between max-w-xl">
          <div>
            <h3 className="text-white font-semibold mb-1">Allow Public Registration</h3>
            <p className="text-sm text-gray-400">Enable new users to sign up without an invite link.</p>
          </div>
          <div className="mt-0.5">
            <button 
              onClick={() => {
                const newValue = !publicRegistration;
                setPublicRegistration(newValue);
                handleToggleSave('public_registration', newValue ? 'true' : 'false');
              }}
              disabled={isPending}
              className={`w-14 h-7 rounded-full relative transition-colors focus:outline-none ${publicRegistration ? 'bg-vortex shadow-[0_0_10px_rgba(112,71,235,0.4)]' : 'bg-white/10'} ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`w-5 h-5 rounded-full absolute top-1 transition-transform ${publicRegistration ? 'bg-white translate-x-8' : 'bg-gray-400 translate-x-1'}`}></div>
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-white/5 my-4"></div>

        {/* Danger Zone */}
        <div className="flex flex-col gap-4 border border-red-500/20 bg-red-500/5 rounded-2xl p-6 max-w-xl">
          <h3 className="text-red-400 font-bold flex items-center gap-2">
            <Key className="w-5 h-5" /> Danger Zone
          </h3>
          <p className="text-sm text-gray-400">Actions here can result in permanent data loss. Proceed with caution.</p>
          <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-xl font-medium transition-all w-max mt-2">
            Flush Cache & Temporary Data
          </button>
        </div>

        <div className="w-full h-px bg-white/5 my-4"></div>

        {/* Form Actions */}
        <div className="flex justify-end max-w-xl">
          <button 
            onClick={handleSave}
            disabled={isPending}
            className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
              saved 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gradient-to-r from-vortex to-vortex-dark hover:from-vortex-light hover:to-vortex text-white shadow-[0_0_20px_rgba(112,71,235,0.4)] hover:shadow-[0_0_30px_rgba(112,71,235,0.6)]'
            } ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
          >
            <Save className="w-5 h-5" /> 
            {isPending ? 'Saving...' : saved ? 'Saved Successfully!' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </>
  );
}
