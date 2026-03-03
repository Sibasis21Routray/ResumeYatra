"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeParsedResume = normalizeParsedResume;
function normalizeParsedResume(parsed) {
    if (!parsed)
        parsed = {};
    // Helper to parse dates (handles "dates" string or startDate/endDate objects)
    function parseDateRange(dates, startKey, endKey) {
        let startDate = null;
        let endDate = null;
        if (typeof dates === "string" && dates) {
            // Try to split by various separators: " to ", "-", "–", "—"
            const parts = dates
                .split(/\s*to\s*|\s*[-–—]\s*/)
                .map((p) => p.trim());
            if (parts.length >= 1)
                startDate = parts[0];
            if (parts.length >= 2)
                endDate = parts[1];
            // If only one part and it looks like a date range, try splitting differently
            if (parts.length === 1 && dates.includes(" ")) {
                const words = dates.split(/\s+/);
                if (words.length >= 3) {
                    startDate = words[0] + " " + words[1];
                    endDate = words.slice(2).join(" ");
                }
            }
        }
        else if (typeof dates === "object" && dates !== null) {
            startDate = dates[startKey] || dates.startDate || null;
            endDate = dates[endKey] || dates.endDate || null;
        }
        return { startDate, endDate };
    }
    return {
        personal: {
            name: parsed.personal?.name || null,
            email: parsed.personal?.email || null,
            phone: parsed.personal?.phone || null,
            location: parsed.personal?.location || null,
        },
        summary: parsed.summary || null,
        skills: Array.isArray(parsed.skills) && parsed.skills.length > 0
            ? `<h3>Core / Technical Skills</h3><ul>${parsed.skills
                .map((s) => `<li>${s}</li>`)
                .join("")}</ul>`
            : parsed.skills || "",
        experience: Array.isArray(parsed.experience)
            ? parsed.experience.map((e) => {
                // Parse date range from dates string
                let startDate = null;
                let endDate = null;
                if (typeof e.dates === "string" && e.dates) {
                    const parts = e.dates
                        .split(/\s*to\s*|\s*[-–—]\s*/)
                        .map((p) => p.trim());
                    if (parts.length >= 1)
                        startDate = parts[0];
                    if (parts.length >= 2)
                        endDate = parts[1];
                }
                // Check if current (looking for "Present", "Current", etc.)
                const isCurrent = e.isCurrent === true ||
                    (typeof e.dates === "string" &&
                        /present|current|now/i.test(e.dates)) ||
                    e.endDate === "Present" ||
                    e.endDate === "Current";
                return {
                    id: e.id ||
                        `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    company: e.company || e.organization || null,
                    title: e.title || e.position || e.role || e.jobTitle || null,
                    domain: e.domain || e.industry || null,
                    location: e.location || e.jobLocation || null,
                    startDate: startDate || e.startDate || e.start || null,
                    endDate: endDate ||
                        e.endDate ||
                        e.end ||
                        (isCurrent ? null : e.date) ||
                        null,
                    description: e.description || e.jobDescription || null,
                    achievements: e.achievements || null,
                    duration: e.duration || null,
                    isCurrent: isCurrent || false,
                };
            })
            : [],
        education: Array.isArray(parsed.education)
            ? parsed.education.map((edu) => {
                // For education, use graduationDate for single date or parse from dates string
                let graduationDate = null;
                if (typeof edu.dates === "string" && edu.dates) {
                    // If it's a range like "2018 - 2022", take the end date as graduation
                    const parts = edu.dates
                        .split(/\s*to\s*|\s*[-–—]\s*/)
                        .map((p) => p.trim());
                    if (parts.length >= 2) {
                        graduationDate = parts[1]; // End date is graduation
                    }
                    else if (parts.length === 1) {
                        graduationDate = parts[0]; // Single date is graduation
                    }
                }
                else if (typeof edu.dates === "string") {
                    graduationDate = edu.dates;
                }
                return {
                    school: edu.school || edu.institute || edu.institution || null,
                    degree: edu.degree || null,
                    field: edu.field || edu.fieldOfStudy || edu.major || null,
                    location: edu.location || null,
                    graduationDate: graduationDate ||
                        edu.graduationDate ||
                        edu.endDate ||
                        edu.end ||
                        edu.date ||
                        null,
                    cgpa: edu.cgpa || null,
                    description: edu.description || null,
                };
            })
            : [],
        projects: Array.isArray(parsed.projects)
            ? parsed.projects.map((p) => {
                // Parse date range from dates string
                let startDate = null;
                let endDate = null;
                if (typeof p.dates === "string" && p.dates) {
                    const parts = p.dates
                        .split(/\s*to\s*|\s*[-–—]\s*/)
                        .map((p) => p.trim());
                    if (parts.length >= 1)
                        startDate = parts[0];
                    if (parts.length >= 2)
                        endDate = parts[1];
                }
                // Handle technologies - convert array to comma-separated string
                let technologiesStr = "";
                if (Array.isArray(p.technologies)) {
                    technologiesStr = p.technologies.join(", ");
                }
                else if (typeof p.technologies === "string") {
                    technologiesStr = p.technologies;
                }
                else if (Array.isArray(p.techStack)) {
                    technologiesStr = p.techStack.join(", ");
                }
                else if (Array.isArray(p.skills)) {
                    technologiesStr = p.skills.join(", ");
                }
                else if (typeof p.tech === "string") {
                    technologiesStr = p.tech;
                }
                return {
                    id: p.id ||
                        `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: p.name || p.projectName || p.title || null,
                    description: p.description || p.projectDescription || null,
                    technologies: technologiesStr,
                    url: p.url || p.link || p.projectUrl || null,
                    urlText: p.urlText || p.linkText || null,
                    startDate: startDate || p.startDate || null,
                    endDate: endDate || p.endDate || null,
                };
            })
            : [],
        languages: Array.isArray(parsed.languages) ? parsed.languages : [],
        // optional: counts for analytics
        skillsCount: Array.isArray(parsed.skills) ? parsed.skills.length : 0,
        experienceCount: Array.isArray(parsed.experience)
            ? parsed.experience.length
            : 0,
        educationCount: Array.isArray(parsed.education)
            ? parsed.education.length
            : 0,
        projectsCount: Array.isArray(parsed.projects) ? parsed.projects.length : 0,
        languagesCount: Array.isArray(parsed.languages)
            ? parsed.languages.length
            : 0,
        professionalContext: {
            totalExperience: parsed.professionalContext?.totalExperience || null,
            teamSize: parsed.professionalContext?.teamSize || null,
            industry: parsed.professionalContext?.industry || null,
            industryCustom: parsed.professionalContext?.industryCustom || null,
            functionalDomain: parsed.professionalContext?.functionalDomain || null,
            functionalDomainCustom: parsed.professionalContext?.functionalDomainCustom || null,
            geographicScope: parsed.professionalContext?.geographicScope || null,
            revenueResponsibility: parsed.professionalContext?.revenueResponsibility || null,
        },
    };
}
