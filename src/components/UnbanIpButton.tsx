"use client";
import { CheckCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

export default function UnbanIpButton({ ip }: { ip: string }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleUnban = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/security/unban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip })
      });
      if (res.ok) {
        setSuccess(true);
        setShowModal(false);
        setTimeout(() => {
          router.refresh();
        }, 1000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        disabled={loading || success}
        className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${success ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-white/5 hover:bg-green-500/20 text-white hover:text-green-400 border-white/10 hover:border-green-500/30'}`}
      >
        {success ? <><ShieldCheck className="w-4 h-4" /> Unbanned</> : <><CheckCircle className="w-4 h-4" /> Unban</>}
      </button>

      <ConfirmModal
        isOpen={showModal}
        title="Unban IP Address"
        message={`Are you sure you want to unban ${ip}? They will regain access to the platform immediately.`}
        confirmText="Yes, Unban IP"
        onConfirm={handleUnban}
        onCancel={() => setShowModal(false)}
        isLoading={loading}
      />
    </>
  );
}
