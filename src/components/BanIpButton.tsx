"use client";
import { Ban, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

export default function BanIpButton({ ip, userName }: { ip: string, userName: string }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  if (!ip || ip === "Unknown") return null;

  const handleBan = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/security/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, reason: `Banned from user panel: ${userName}` })
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
        title={`Ban IP: ${ip}`}
        className={`p-2 border rounded-xl transition-all disabled:opacity-50 ${success ? 'bg-green-500/20 text-green-500 border-green-500/30' : 'bg-white/5 hover:bg-orange-500/20 text-gray-400 hover:text-orange-500 border-white/5 hover:border-orange-500/30'}`}
      >
        {success ? <Check className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
      </button>

      <ConfirmModal
        isOpen={showModal}
        title="Ban IP Address"
        message={`Are you sure you want to BAN the IP address for ${userName}? They will be completely blocked from the platform.`}
        confirmText="Yes, Ban IP"
        onConfirm={handleBan}
        onCancel={() => setShowModal(false)}
        isLoading={loading}
      />
    </>
  );
}
