"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "../actions";
import { Lock, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await loginAdmin(password);
    if (res.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(res.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07090e] p-4 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7047eb]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#5d35d9]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-[#0a0d14] border border-white/10 rounded-3xl w-full max-w-md p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#7047eb]/10 rounded-2xl border border-[#7047eb]/30 flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-[#7047eb]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Vortex Admin</h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            Enter the master password to access the secure dashboard.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#7047eb] transition-all"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#7047eb] hover:bg-[#5d35d9] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(112,71,235,0.4)] flex justify-center items-center gap-2 group h-[56px]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Unlock Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
