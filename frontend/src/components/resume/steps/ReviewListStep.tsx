import React from 'react';
import { Edit2, Trash2, Plus, ArrowLeft, ArrowRight, Calendar, Building } from 'lucide-react';

// Generic item type for the list - using index signature for flexibility
export interface ReviewItem {
  id: string;
  title?: string;
  subtitle?: string;
  dateRange?: string;
  description?: string;
  [key: string]: unknown;
}

// Configuration for displaying items
export interface ItemConfig {
  titleField: string;
  subtitleField?: string;
  dateRangeFields?: {
    start: string;
    end: string;
    current?: string;
  };
  descriptionField?: string;
}

// Props for ReviewListStep
interface ReviewListStepProps {
  title: string;
  items: ReviewItem[];
  itemConfig: ItemConfig;
  emptyTitle: string;
  emptyDescription: string;
  addButtonText: string;
  onAdd: () => void;
  onEdit?: (id: string) => void;
  onEditBasic?: (id: string) => void;
  onEditDescription?: (id: string) => void;
  onDelete: (id: string) => void;
  onBack?: () => void;
  onContinue?: () => void;
  canContinue?: boolean;
  isContinueLoading?: boolean;
}

export function ReviewListStep({
  title,
  items,
  itemConfig,
  emptyTitle,
  emptyDescription,
  addButtonText,
  onAdd,
  onEdit,
  onEditBasic,
  onEditDescription,
  onDelete,
  onBack,
  onContinue,
  canContinue = true,
  isContinueLoading = false,
}: ReviewListStepProps) {
  const getDisplayValue = (item: ReviewItem, field: string): string => {
    if (!field) return '';
    const value = item[field];
    return typeof value === 'string' ? value : String(value || '');
  };

  const formatDateRange = (item: ReviewItem): string => {
    if (!itemConfig.dateRangeFields) return '';

    const { start, end, current } = itemConfig.dateRangeFields;
    const startDate = item[start];
    const endDate = item[end];
    const isCurrent = current && Boolean(item[current]);

    const startStr = typeof startDate === 'string' ? startDate : String(startDate || '');
    if (!startStr) return '';

    if (isCurrent) {
      return `${startStr} - Present`;
    }

    const endStr = typeof endDate === 'string' ? endDate : String(endDate || '');
    if (endStr) {
      return `${startStr} - ${endStr}`;
    }

    return startStr;
  };

  // Helper function to highlight the last word of a title
  const highlightLastWord = (text: string) => {
    const words = text.split(' ');
    if (words.length === 0) return null;

    const lastWord = words.pop();
    return (
      <>
        <span className="text-text-primary dark:text-dark-text-primary">
          {words.join(' ')} <span className="text-accent dark:text-dark-accent">{lastWord}</span>
        </span>
      </>
    );
  };

  return (
    <div className="animate-fade-in w-full max-w-full sm:max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8 lg:mb-10 text-start">
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-text-primary mb-2 sm:mb-3">
          {highlightLastWord(title)}
        </h2>
        <p className="text-sm sm:text-base text-text-muted dark:text-dark-text-muted mb-4 sm:mb-6 max-w-lg">
          Review and manage your entries. Add, edit, or remove items as needed.
        </p>
        <div className="h-1 w-20 sm:w-24 lg:w-32 bg-gradient-to-r from-accent via-accent to-accent-hover dark:from-dark-accent dark:via-dark-accent dark:to-dark-accent-hover rounded-full"></div>
      </div>

      {/* Items List or Empty State */}
      {items.length === 0 ? (
        <div className="text-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 border-2 border-dashed border-light-border dark:border-dark-border rounded-xl sm:rounded-2xl lg:rounded-3xl bg-bg-secondary dark:bg-dark-bg-secondary mb-6 sm:mb-8 lg:mb-10 backdrop-blur-sm">
          <div className="inline-flex p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-accent/10 to-accent/20 dark:from-dark-accent/20 dark:to-dark-accent/30 rounded-2xl sm:rounded-3xl mb-4 sm:mb-5 lg:mb-6 transform transition-transform duration-500 hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 dark:bg-dark-accent/20 blur-lg sm:blur-xl rounded-full"></div>
              <svg className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-accent dark:text-dark-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-text-primary dark:text-dark-text-primary mb-2 sm:mb-3">
            {emptyTitle}
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-text-muted dark:text-dark-text-muted max-w-xs sm:max-w-sm lg:max-w-md mx-auto mb-6 sm:mb-8">
            {emptyDescription}
          </p>
          <button
            onClick={onAdd}
            className="group relative inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-text-primary to-accent hover:from-text-primary/90 hover:to-accent/90 text-white dark:text-dark-bg-primary px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 overflow-hidden text-sm sm:text-base"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            {addButtonText}
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5 lg:space-y-6 mb-8 sm:mb-10 lg:mb-12">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group relative border border-light-border dark:border-dark-border rounded-lg sm:rounded-xl lg:rounded-2xl bg-bg-primary dark:bg-dark-bg-primary shadow-sm hover:shadow-lg sm:hover:shadow-xl lg:hover:shadow-2xl transition-all duration-300 overflow-hidden hover:border-accent dark:hover:border-dark-accent animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent to-accent-hover dark:from-dark-accent dark:via-dark-accent dark:to-dark-accent-hover"></div>

              <div className="pl-4 sm:pl-5 pr-3 sm:pr-5 py-3 sm:py-4 lg:py-5">
                <div className="flex items-start justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:gap-2 lg:gap-3 mb-2 sm:mb-3">
                      <h4 className="text-base sm:text-lg lg:text-xl font-bold text-text-primary dark:text-dark-text-primary group-hover:text-accent dark:group-hover:text-dark-accent transition-colors truncate">
                        {getDisplayValue(item, itemConfig.titleField) || 'Untitled'}
                      </h4>
                      {itemConfig.subtitleField && getDisplayValue(item, itemConfig.subtitleField) && (
                        <span className="self-start mt-1 sm:mt-0 px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-semibold bg-gradient-to-r from-accent/10 to-accent/20 dark:from-dark-accent/20 dark:to-dark-accent/30 text-accent dark:text-dark-accent rounded-full border border-accent/30 dark:border-dark-accent/30 whitespace-nowrap">
                          {getDisplayValue(item, itemConfig.subtitleField)}
                        </span>
                      )}
                    </div>

                    {itemConfig.dateRangeFields && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-text-muted dark:text-dark-text-muted mb-3 sm:mb-4">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="font-medium truncate">{formatDateRange(item)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {onEditBasic && onEditDescription ? (
                      <>
                        <button
                          onClick={() => onEditBasic(item.id)}
                          className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-accent dark:text-dark-accent hover:bg-accent/10 dark:hover:bg-dark-accent/10 rounded-md sm:rounded-lg transition-all duration-300 hover:scale-105 border border-accent/30 dark:border-dark-accent/30"
                          title="Edit Basic Details"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline sm:inline">Details</span>
                        </button>
                        <button
                          onClick={() => onEditDescription(item.id)}
                          className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-accent dark:text-dark-accent hover:bg-accent/10 dark:hover:bg-dark-accent/10 rounded-md sm:rounded-lg transition-all duration-300 hover:scale-105 border border-accent/30 dark:border-dark-accent/30"
                          title="Edit Description"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline sm:inline">Description</span>
                        </button>
                      </>
                    ) : (
                      onEdit && (
                        <button
                          onClick={() => onEdit(item.id)}
                          className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-accent dark:text-dark-accent hover:bg-accent/10 dark:hover:bg-dark-accent/10 rounded-md sm:rounded-lg transition-all duration-300 hover:scale-105 border border-accent/30 dark:border-dark-accent/30"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden xs:inline sm:inline">Edit</span>
                        </button>
                      )
                    )}
                    <button
                      onClick={() => onDelete(item.id)}
                      className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md sm:rounded-lg transition-all duration-300 hover:scale-105 border border-red-200 dark:border-red-800/30"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline sm:inline">Delete</span>
                    </button>
                  </div>
                </div>

                {/* Description Preview */}
                {itemConfig.descriptionField && (() => {
                  const descValue = item[itemConfig.descriptionField];
                  if (descValue) {
                    return (
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-light-border dark:border-dark-border">
                        <div
                          className="text-xs sm:text-sm text-text-muted dark:text-dark-text-muted line-clamp-2 sm:line-clamp-3 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: String(descValue)
                          }}
                        />
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          ))}

          {/* Add More Button */}
          <button
            onClick={onAdd}
            className="group mt-4 sm:mt-6 lg:mt-8 w-full flex items-center justify-center gap-2 sm:gap-3 bg-bg-primary dark:bg-dark-bg-primary border-2 border-dashed border-light-border dark:border-dark-border text-accent dark:text-dark-accent hover:border-accent hover:bg-accent/10 dark:hover:bg-dark-accent/10 px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5 rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <div className="relative">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <div className="absolute inset-0 bg-accent/20 dark:bg-dark-accent/20 blur-md group-hover:bg-accent/30 dark:group-hover:bg-dark-accent/30 rounded-full transition-all duration-300"></div>
            </div>
            {addButtonText}
          </button>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-light-border dark:border-dark-border">
        {onBack ? (
          <button
            onClick={onBack}
            className="group flex items-center gap-2 sm:gap-3 px-5 sm:px-6 lg:px-8 py-2 sm:py-2.5 lg:py-3 rounded-full border border-light-border dark:border-dark-border text-text-primary dark:text-dark-text-primary font-semibold hover:border-accent dark:hover:border-dark-accent hover:text-accent dark:hover:text-dark-accent hover:bg-accent/10 dark:hover:bg-dark-accent/10 transition-all duration-300 hover:shadow-md w-full sm:w-auto justify-center text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 sm:group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
        ) : (
          <div className="w-full sm:w-auto" />
        )}

        {onContinue && (
          <button
            onClick={onContinue}
            disabled={!canContinue || isContinueLoading}
            className={`group relative flex items-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-2.5 sm:py-3 lg:py-3.5 rounded-full font-bold shadow-lg transition-all duration-300 overflow-hidden w-full sm:w-auto justify-center text-sm sm:text-base ${canContinue && !isContinueLoading
              ? 'bg-accent hover:bg-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-bg-primary dark:text-dark-bg-primary font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base hover:scale-105 active:scale-95'
              : 'bg-bg-secondary dark:bg-dark-bg-secondary text-text-muted dark:text-dark-text-muted cursor-not-allowed'
              }`}
          >
            {canContinue && !isContinueLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            )}
            {isContinueLoading ? (
              <>
                <svg className="animate-spin w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 sm:group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}


