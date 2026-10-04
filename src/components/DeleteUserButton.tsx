"use client";
import { Trash2, Check } from "lucide-react";
import { deleteUser } from "@/app/actions";
import { useTransition, useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function DeleteUserButton({ id }: { id: number | string }) {
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteUser(Number(id));
      if (res.success) {
        setSuccess(true);
        setShowModal(false);
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        disabled={isPending || success}
        className={`p-2.5 rounded-xl transition-all ${
          success ? 'text-green-500 bg-green-500/10' : 
          isPending ? 'text-gray-600 bg-white/5 cursor-not-allowed' : 'text-gray-500 hover:text-red-400 hover:bg-red-500/10'
        }`}
        title="Delete User"
      >
        {success ? <Check className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
      </button>

      <ConfirmModal
        isOpen={showModal}
        title="Delete User"
        message="Are you sure you want to permanently delete this user? This action cannot be undone and will delete all associated data."
        confirmText="Yes, Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowModal(false)}
        isLoading={isPending}
      />
    </>
  );
}
