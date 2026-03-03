"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanResumeText = cleanResumeText;
function cleanResumeText(text) {
    if (!text)
        return "";
    let cleaned = text;
    // Remove null characters (PDF garbage)
    cleaned = cleaned.replace(/\u0000/g, "");
    // Normalize line breaks
    cleaned = cleaned.replace(/\r/g, "\n");
    // Fix spaced letters like: J O H N   D O E → JOHN DOE
    cleaned = cleaned.replace(/([A-Z])\s+(?=[A-Z])/g, "$1");
    // Convert bullets to dash
    cleaned = cleaned.replace(/[•●▪◦]/g, "- ");
    // Replace tabs with space
    cleaned = cleaned.replace(/\t/g, " ");
    // Collapse multiple spaces
    cleaned = cleaned.replace(/[ ]{2,}/g, " ");
    // Collapse excessive newlines
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
    // Fix weird spacing around punctuation
    cleaned = cleaned.replace(/\s+([.,:;])/g, "$1");
    // Remove non-printable characters
    cleaned = cleaned.replace(/[^\x20-\x7E\n]/g, "");
    // Trim each line
    cleaned = cleaned
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
    return cleaned.trim();
}
