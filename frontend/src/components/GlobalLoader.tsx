import { Loader } from "lucide-react";
import { useResumeStore } from "../stores";

export default function GlobalLoader() {
  const loading = useResumeStore((s) => s.loading);
  const saving = useResumeStore((s) => s.saving);
  const autoSaving = useResumeStore((s) => s.autoSaving);
  
  const isLoading = loading || saving || autoSaving;

  if (!isLoading) return null;

  let message = "Processing...";

  if (loading) message = "Loading resume...";
  else if (saving) message = "Saving changes...";
  else if (autoSaving) message = "Updating...";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 px-6 py-4 rounded-xl shadow-lg flex items-center justify-center gap-3">
        {/* <img
              src="../../public/download.gif"
              alt="Success"
              className="h-12 object-contain"
            /> */}
            <Loader className="w-6 h-6 text-gray-600 animate-spin" />

        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {message}
        </span>
      </div>
    </div>
  );
}