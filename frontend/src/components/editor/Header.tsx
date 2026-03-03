import React from 'react';
import { ArrowLeft, Undo, Redo, Clock } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

interface HeaderProps {
  onBack: () => void;
  autoSaving: boolean;
  lastSaved: Date | null;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function Header({
  onBack,
  autoSaving,
  lastSaved,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: HeaderProps) {
  const formatLast = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors p-1 sm:p-0"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline text-sm">Back</span>
        </button>

        <div className="flex items-center space-x-1 sm:space-x-2">
          
        </div>
      </div>

      <div className="flex items-center space-x-1 sm:space-x-3">
        {/* Auto-save status */}
        <div className="hidden md:flex items-center space-x-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
          {autoSaving ? (
            <>
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 border-t-[#04477E] rounded-full animate-spin"></div>
              <span className="hidden lg:inline">Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden lg:inline">Saved {formatLast(lastSaved)}</span>
            </>
          ) : null}
        </div>

        {/* Undo/Redo buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <Undo className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Redo"
          >
            <Redo className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>


        <ThemeToggle />
      </div>
    </header>
  );
}
