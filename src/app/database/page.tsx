import DatabaseManager from "@/components/DatabaseManager";

export default function DatabasePage() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-4 h-[calc(100vh-8rem)] overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Database Management</h1>
          <p className="text-gray-400">Directly view and manage all tables and records in real-time.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 w-full relative">
        <DatabaseManager />
      </div>
    </div>
  );
}
