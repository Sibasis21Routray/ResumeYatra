import React from "react";
import { useParams } from "react-router-dom";
import { ResumeEditor } from "../components/editor/ResumeEditor";

export function EditorPage() {
  const { id } = useParams();

  console.log("[EditorPage] Received resume ID:", id);

  // Enhanced validation for resume ID
  if (!id || id === "undefined" || id === "null" || id.trim() === "") {
    console.error("[EditorPage] Invalid or missing resume ID:", id);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center w-full max-w-sm sm:max-w-md mx-auto">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Invalid Resume ID
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
            The resume ID is missing or invalid. This might happen if:
            <br className="hidden sm:block" />• The resume creation failed
            <br className="hidden sm:block" />• The page was refreshed
            incorrectly
            <br className="hidden sm:block" />• There's a navigation error
          </p>
          <div className="space-y-3">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm font-medium rounded-lg sm:rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Dashboard
            </a>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <a
                href="/templates"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Create a new resume from template
              </a>
            </div>
          </div>
          {import.meta.env.DEV && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-left">
              <p className="text-xs font-mono text-gray-600 dark:text-gray-300">
                Debug Info:
                <br />
                ID: {id || "undefined"}
                <br />
                URL: {window.location.href}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  console.log("[EditorPage] Valid resume ID, rendering ResumeEditor");
  return <ResumeEditor />;
}
