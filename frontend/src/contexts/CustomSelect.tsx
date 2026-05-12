import { ChevronDown, Info } from "lucide-react";
import { useState } from "react";

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    label: string;
    required?: boolean;
    error?: string;
    helperText?: string;
    tooltip?: string;
}

export function CustomSelect({
    value,
    onChange,
    options,
    label,
    required,
    error,
    helperText,
    tooltip,
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full">
            <label className="block text-sm font-semibold mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    className={`w-full px-4 py-3 rounded-lg border appearance-none cursor-pointer pr-10
            bg-white dark:bg-gray-800 text-text-primary dark:text-dark-text-primary
            ${error ? "border-red-500 focus:ring-red-500" : "border-light-border dark:border-dark-border focus:ring-accent"}
            focus:outline-none focus:ring-2 transition-colors`}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
                <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
            {error ? (
                <p className="mt-1 text-xs text-red-500">{error}</p>
            ) : helperText ? (
                <p className="mt-1 text-xs text-gray-500">{helperText}</p>
            ) : null}
        </div>
    );
}