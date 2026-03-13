export function buildOperationsSupportTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#1a1a2e",
    secondary: "#16213e",
    background: "#ffffff",
    accent: "#0891b2",
    accentLight: "#22d3ee",
    headingFont: "Arial, Helvetica, sans-serif",
    bodyFont: "Arial, Helvetica, sans-serif",
  };
  const currentTheme = { ...defaultTheme, ...theme };

  // Font sizes as per spec: body 11-12pt, headings 13-15pt
  const bodyFontSize = "11pt";
  const headingFontSize = "13pt";
  const subheadingFontSize = "11pt";
  const nameFontSize = "26pt";
  const sectionTitleFontSize = "12pt";

  // Utility functions
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Helper function to check if an array has non-empty items
  const hasNonEmptyItems = (arr: any[]): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    return arr.some(item => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(val => 
          typeof val === "string" && val.trim().length > 0
        );
      }
      return false;
    });
  };

  // Helper to get non-empty array items
  const getNonEmptyArray = (arr: any): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter((item: any) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(
          (val: any) => typeof val === "string" && val.trim().length > 0
        );
      }
      return false;
    });
  };

  // Helper to check if an object has any non-empty values
  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => 
      val !== null && val !== undefined && val !== ""
    );
  };

  // Helper to safely join strings with separator, filtering empty values
  const safeJoin = (items: any[], separator: string = ", "): string => {
    if (!items || !Array.isArray(items)) return "";
    const filtered = items.filter(item => item && typeof item === "string" && item.trim().length > 0);
    return filtered.join(separator);
  };

  // Helper to format date range without empty parentheses
  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" – ");
  };

  // Helper to format subtitle with multiple fields
  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(" | ");
  };

  const isEmpty = (value: any): boolean => {
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return value === null || Object.keys(value).length === 0;
    return !value || value === "undefined";
  };

  const escapeHtml = (text: string): string => {
    if (typeof text !== "string") return "";
    return text.replace(/[&<>"']/g, (m: string) => {
      switch (m) {
        case "&": return "&amp;";
        case "<": return "<";
        case ">": return ">";
        case '"': return "";
        case "'": return "&#039;";
        default: return m;
      }
    });
  };

  // Sort experience reverse chronological
  const sortedExperience = data.experience
    ? [...data.experience].sort(
        (a: any, b: any) =>
          new Date(b.startDate || "1900-01-01").getTime() -
          new Date(a.startDate || "1900-01-01").getTime()
      )
    : [];

  // Filter and process skills with proficiency
  const processSkills = (): { name: string; level?: number }[] => {
    if (!data.skills) return [];
    if (Array.isArray(data.skills)) {
      return data.skills.slice(0, 12).map((s: any) =>
        typeof s === "string" ? { name: s.trim() } : { name: s.name || "", level: s.level }
      );
    }
    if (typeof data.skills === 'string') {
      if (data.skills.includes('<ul>')) {
        const matches = data.skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          return matches.map(m => ({ name: m.replace(/<\/?li>/g, '').trim() }));
        }
      }
      return data.skills.split(",").slice(0, 12).map((s: string) => ({ name: s.trim() }));
    }
    return [];
  };

  // Process certifications with proper validation
  const processCertifications = (): any[] => {
    if (!data.certifications || !Array.isArray(data.certifications)) return [];
    return data.certifications
      .filter((c: any) => c && c.name)
      .map((c: any) => ({
        name: c.name,
        issuer: c.issuer || "",
        date: formatDate(c.date || c.issueDate),
        expiryDate: formatDate(c.expiryDate),
        url: c.url || "",
        description: c.description || ""
      }));
  };

  const skills = processSkills();
  const certifications = processCertifications();

  // Process arrays to ensure only non-empty items are shown
  const nonEmptyInternships = getNonEmptyArray(data.internships);
  const nonEmptyTrainingPrograms = getNonEmptyArray(data.trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyArray(data.academicProjects);
  const nonEmptyClientProjects = getNonEmptyArray(data.clientProjects);
  const nonEmptyPortfolio = getNonEmptyArray(data.portfolio);
  const nonEmptyLeadershipPositions = getNonEmptyArray(data.leadershipPositions);
  const nonEmptyVolunteering = getNonEmptyArray(data.volunteering);
  const nonEmptyMilitaryService = getNonEmptyArray(data.militaryService);
  const nonEmptyTeachingExperience = getNonEmptyArray(data.teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyArray(data.mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyArray(data.researchGrants);
  const nonEmptyPublications = getNonEmptyArray(data.publications);
  const nonEmptyPatents = getNonEmptyArray(data.patents);
  const nonEmptyTestScores = getNonEmptyArray(data.testScores);
  const nonEmptyScholarships = getNonEmptyArray(data.scholarships);
  const nonEmptyAwards = getNonEmptyArray(data.awards);
  const nonEmptySpeakingEngagements = getNonEmptyArray(data.speakingEngagements);
  const nonEmptyMemberships = getNonEmptyArray(data.memberships);
  const nonEmptyWorkshops = getNonEmptyArray(data.workshops);
  const nonEmptyCoCurricular = getNonEmptyArray(data.coCurricular);
  const nonEmptyExtracurricular = getNonEmptyArray(data.extracurricular);
  const nonEmptyToolsTechnologies = getNonEmptyArray(data.toolsTechnologies);
  const nonEmptyMethodologies = getNonEmptyArray(data.methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyArray(data.industryExpertise);
  const nonEmptyReferences = getNonEmptyArray(data.references);
  const nonEmptySocialProfiles = getNonEmptyArray(data.socialProfiles);
  const nonEmptySocialLinks = getNonEmptyArray(data.socialLinks);
  const nonEmptyLanguages = getNonEmptyArray(data.languages);
  const nonEmptyHobbies = getNonEmptyArray(data.hobbies);
  const nonEmptyKeyAchievements = getNonEmptyArray(data.keyAchievements);
  const nonEmptyResponsibilities = getNonEmptyArray(
    Array.isArray(data.responsibilities)
      ? data.responsibilities
      : (data.responsibilities || "").split("\n")
  );
  const nonEmptyTools = getNonEmptyArray(
    Array.isArray(data.tools) ? data.tools : (data.tools || "").split("\n")
  );
  const nonEmptyProjects = getNonEmptyArray(data.projects);
  const nonEmptyCustomSections = getNonEmptyArray(data.customSections);
  const nonEmptyProfessionalContext = data.professionalContext && hasObjectValues(data.professionalContext) ? data.professionalContext : null;
  const nonEmptyAvailabilityWorkAuth = data.availabilityWorkAuth && hasObjectValues(data.availabilityWorkAuth) ? data.availabilityWorkAuth : null;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.personal?.name || "Resume")}</title>
  <meta name="description" content="Professional resume for ${escapeHtml(data.personal?.name || "Operations Support")}">
  <style>
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --background-color: ${currentTheme.background};
      --accent-color: ${currentTheme.accent};
      --accent-light: ${currentTheme.accentLight};
      --heading-font: ${currentTheme.headingFont};
      --body-font: ${currentTheme.bodyFont};
      --sidebar-width: 280px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--body-font);
      color: var(--primary-color);
      line-height: 1.5;
      background: #f0f2f5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .resume-container {
      max-width: 850px;
      margin: 0 auto;
      display: flex;
      background: var(--background-color);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      min-height: 100vh;
    }

    /* Left Sidebar */
    .sidebar {
      width: var(--sidebar-width);
      background: linear-gradient(180deg, var(--accent-color) 0%, #0e7490 100%);
      color: #ffffff;
      padding: 28px 20px;
      flex-shrink: 0;
    }

    .profile-photo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      margin: 0 auto 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4px solid rgba(255, 255, 255, 0.25);
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-photo-placeholder {
      width: 64px;
      height: 64px;
      opacity: 0.6;
    }

    .sidebar .section {
      margin-bottom: 24px;
    }

    .sidebar .section-title {
      font-size: ${sectionTitleFontSize};
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    }

    .sidebar p, .sidebar li {
      font-size: ${bodyFontSize};
      margin-bottom: 4px;
      opacity: 0.95;
    }

    .sidebar ul {
      list-style: none;
      padding: 0;
    }

    .sidebar li {
      padding-left: 0;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .sidebar a {
      color: #ffffff;
      text-decoration: none;
      transition: opacity 0.2s ease;
    }

    .sidebar a:hover {
      opacity: 0.8;
      text-decoration: underline;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      font-size: ${subheadingFontSize};
      line-height: 1.4;
    }

    .contact-icon {
      width: 18px;
      min-width: 18px;
      margin-right: 10px;
      flex-shrink: 0;
      opacity: 0.85;
    }

    .skill-item {
      margin-bottom: 12px;
    }

    .skill-name {
      font-size: ${bodyFontSize};
      font-weight: 500;
      margin-bottom: 4px;
    }

    .skill-bar {
      background: rgba(255, 255, 255, 0.2);
      height: 5px;
      border-radius: 3px;
      overflow: hidden;
    }

    .skill-bar-fill {
      background: #ffffff;
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    /* Language proficiency */
    .language-item {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .language-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .language-name {
      font-size: ${bodyFontSize};
      font-weight: 600;
      margin-bottom: 3px;
    }

    .language-level {
      font-size: ${subheadingFontSize};
      opacity: 0.85;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      padding: 28px 32px;
    }

    .header {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 3px solid var(--accent-color);
    }

    .name {
      font-size: ${nameFontSize};
      font-weight: 700;
      color: var(--accent-color);
      margin-bottom: 6px;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .title {
      font-size: 14pt;
      color: #555;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .main-content .section {
      margin-bottom: 22px;
      page-break-inside: avoid;
    }

    .main-content .section-title {
      font-size: ${headingFontSize};
      font-weight: 700;
      color: var(--accent-color);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-bottom: 14px;
      padding-bottom: 6px;
      border-bottom: 2px solid var(--accent-color);
    }

    .main-content p {
      font-size: ${bodyFontSize};
      line-height: 1.6;
      color: #444;
      margin-bottom: 8px;
    }

    .main-content ul {
      margin-left: 20px;
      padding: 0;
    }

    .main-content li {
      font-size: ${bodyFontSize};
      margin-bottom: 6px;
      color: #444;
      line-height: 1.5;
    }

    .experience-item, .education-item, .project-item, .certification-item {
      margin-bottom: 18px;
      padding-bottom: 18px;
      border-bottom: 1px solid #eee;
    }

    .experience-item:last-child, .education-item:last-child, .project-item:last-child, .certification-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
      flex-wrap: wrap;
      gap: 4px;
    }

    .item-title {
      font-weight: 700;
      font-size: 11.5pt;
      color: #222;
    }

    .item-subtitle {
      font-size: ${subheadingFontSize};
      color: #555;
      font-style: italic;
    }

    .item-date {
      font-size: ${subheadingFontSize};
      color: var(--accent-color);
      font-weight: 600;
      white-space: nowrap;
    }

    .item-company {
      font-size: ${bodyFontSize};
      color: var(--accent-color);
      font-weight: 600;
    }

    .item-description {
      font-size: ${bodyFontSize};
      color: #555;
      line-height: 1.5;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-top: 10px;
      padding: 12px;
      background: rgba(8, 145, 178, 0.05);
      border-radius: 6px;
      border-left: 3px solid var(--accent-color);
    }

    .metric-item {
      text-align: center;
    }

    .metric-value {
      font-size: 18pt;
      font-weight: 700;
      color: var(--accent-color);
      line-height: 1.2;
    }

    .metric-label {
      font-size: 9pt;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    /* Print Styles */
    @media print {
      body {
        background: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .resume-container {
        box-shadow: none;
        max-width: 100%;
        width: 100%;
      }

      .sidebar {
        width: var(--sidebar-width);
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .main-content .section {
        page-break-inside: avoid;
      }

      .experience-item, .education-item, .project-item, .certification-item {
        page-break-inside: avoid;
      }

      @page {
        margin: 0;
        size: auto;
      }
    }

    /* Responsive */
    @media screen and (max-width: 768px) {
      .resume-container {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
      }

      .item-header {
        flex-direction: column;
      }

      .item-date {
        white-space: normal;
      }
    }
  </style>
</head>
<body>
<div class="resume-container">
  <!-- Left Sidebar -->
  <div class="sidebar">
    <!-- Profile Photo -->
    <div class="profile-photo" data-section="photo">
      ${
        data.personal?.image
          ? `<img src="${data.personal.image}" alt="${
              data.personal?.name && data.personal?.name !== "undefined"
                ? data.personal.name
                : "Profile Photo"
            }" />`
          : `
      <svg class="profile-photo-placeholder" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>`
      }
    </div>

    <!-- Contact Information -->
    <div class="section" data-section="contact">
      <div class="section-title">Contact</div>
      ${
        data.personal?.phone
          ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        <span>${data.personal.phone}</span>
      </div>` : ""
      }
      ${
        data.personal?.alternatePhone
          ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        <span>${data.personal.alternatePhone}</span>
      </div>` : ""
      }
      ${
        data.personal?.email
          ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        <span>${data.personal.email}</span>
      </div>` : ""
      }
      ${(() => {
        const addressParts = [
          data.personal?.fullAddress,
          data.personal?.location,
          data.personal?.country,
          data.personal?.pinCode
        ].filter(Boolean);
        return addressParts.length > 0 ? `
        <div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <span>${addressParts.join(", ")}</span>
        </div>
        ` : "";
      })()}
      ${
        data.personal?.linkedinUrl
          ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
        <a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a>
      </div>` : ""
      }
      ${
        data.personal?.githubUrl
          ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        <a href="${data.personal.githubUrl}" target="_blank">GitHub</a>
      </div>` : ""
      }
      ${
        data.personal?.portfolioUrl
          ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
        <a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a>
      </div>` : ""
      }
      ${
        data.personal?.website
          ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
        <a href="${data.personal.website}" target="_blank">Website</a>
      </div>` : ""
      }
      
      <!-- Inline Personal Details in Sidebar -->
      ${
        data.personal?.personalInfoDisplay === "inline"
          ? (() => {
              const inlineItems = [];
              if (data.personal?.fathersName) inlineItems.push(`
                <div class="contact-item">
                  <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  <span>Father: ${data.personal.fathersName}</span>
                </div>
              `);
              if (data.personal?.dob) inlineItems.push(`
                <div class="contact-item">
                  <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
                  <span>DOB: ${data.personal.dob}</span>
                </div>
              `);
              if (data.personal?.gender) inlineItems.push(`
                <div class="contact-item">
                  <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                  <span>Gender: ${data.personal.gender}</span>
                </div>
              `);
              if (data.personal?.maritalStatus) inlineItems.push(`
                <div class="contact-item">
                  <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>
                  <span>Marital: ${data.personal.maritalStatus}</span>
                </div>
              `);
              if (data.personal?.nationality) inlineItems.push(`
                <div class="contact-item">
                  <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  <span>Nationality: ${data.personal.nationality}</span>
                </div>
              `);
              return inlineItems.length > 0 ? inlineItems.join('') : "";
            })()
          : ""
      }
    </div>

    <!-- Skills in Sidebar -->
    ${skills.length > 0 ? `
      <div class="section" data-section="skills">
        <div class="section-title">Skills</div>
        <ul>
          ${skills.map((skill: any, index: number) => `
            <li data-index="${index}">${skill.name}</li>
          `).join("")}
        </ul>
      </div>
    ` : ""}

    <!-- Tools & Technologies in Sidebar -->
    ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="section" data-section="toolsTechnologies">
        <div class="section-title">Tools & Tech</div>
        <ul>
          ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
            <li data-index="${index}">${item.name || ""}${item.proficiency ? ` (${item.proficiency})` : ""}${item.experienceDuration ? ` - ${item.experienceDuration}` : ""}</li>
          `).join("")}
        </ul>
      </div>
    ` : ""}

    <!-- Methodologies in Sidebar -->
    ${nonEmptyMethodologies.length > 0 ? `
      <div class="section" data-section="methodologies">
        <div class="section-title">Methodologies</div>
        <ul>
          ${nonEmptyMethodologies.map((item: any, index: number) => `
            <li data-index="${index}">${item.name || ""}${item.certification ? ` (${item.certification})` : ""}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ""}</li>
          `).join("")}
        </ul>
      </div>
    ` : ""}

    <!-- Industry Expertise in Sidebar -->
    ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section" data-section="industryExpertise">
        <div class="section-title">Industry Expertise</div>
        <ul>
          ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
            <li data-index="${index}">${item.industry || ""}${item.domainArea ? ` - ${item.domainArea}` : ""}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ""}</li>
          `).join("")}
        </ul>
      </div>
    ` : ""}

    <!-- Languages -->
    ${nonEmptyLanguages.length > 0 ? `
      <div class="section" data-section="languages">
        <div class="section-title">Languages</div>
        ${nonEmptyLanguages.map((lang: any, index: number) => `
          <div class="language-item" data-index="${index}">
            <div class="language-name">${lang.language || lang}</div>
            <div class="language-level">${lang.level ? lang.level : ""}${lang.capability ? ` - ${lang.capability}` : ""}</div>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Hobbies -->
    ${nonEmptyHobbies.length > 0 ? `
      <div class="section" data-section="hobbies">
        <div class="section-title">Interests</div>
        <ul>
          ${nonEmptyHobbies.map((hobby: string, index: number) => `
            <li data-index="${index}">${hobby}</li>
          `).join("")}
        </ul>
      </div>
    ` : ""}

    <!-- Social Links -->
    ${nonEmptySocialLinks.length > 0 ? `
      <div class="section" data-section="socialLinks">
        <div class="section-title">Links</div>
        <ul>
          ${nonEmptySocialLinks.map((link: any, index: number) => `
            <li data-index="${index}"><a href="${link.url}" target="_blank">${link.urlText || link.url.replace("https://", "").replace("http://", "")}</a></li>
          `).join("")}
        </ul>
      </div>
    ` : ""}

    <!-- Social Profiles -->
    ${nonEmptySocialProfiles.length > 0 ? `
      <div class="section" data-section="socialProfiles">
        <div class="section-title">Social Profiles</div>
        <ul>
          ${nonEmptySocialProfiles.map((profile: any, index: number) => `
            <li data-index="${index}"><a href="${profile.url}" target="_blank">${profile.platform || "Profile"}</a></li>
          `).join("")}
        </ul>
      </div>
    ` : ""}

    <!-- Availability & Work Auth -->
    ${nonEmptyAvailabilityWorkAuth ? `
      <div class="section" data-section="availabilityWorkAuth">
        <div class="section-title">Availability</div>
        <ul>
          ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<li><strong>Notice:</strong> ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</li>` : ""}
          ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<li><strong>Work Auth:</strong> ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</li>` : ""}
          ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<li><strong>Preferred:</strong> ${nonEmptyAvailabilityWorkAuth.preferredLocation}</li>` : ""}
        </ul>
      </div>
    ` : ""}
  </div>

  <!-- Main Content -->
  <div class="main-content">
    <!-- Header with Name -->
    <div class="header" data-section="personal">
      <div class="name">${
        data.personal?.name && data.personal?.name !== "undefined"
          ? data.personal.name
          : "Your Name"
      }${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</div>
      ${
        data.personal?.title || data.personal?.role
          ? `<div class="title">${data.personal?.title || data.personal?.role}</div>`
          : ""
      }
    </div>

    <!-- Professional Context -->
    ${nonEmptyProfessionalContext ? `
      <div class="section" data-section="professionalContext">
        <div class="section-title">Professional Context</div>
        <div class="metrics-grid">
          ${nonEmptyProfessionalContext.totalExperience ? `
            <div class="metric-item">
              <div class="metric-value">${nonEmptyProfessionalContext.totalExperience}</div>
              <div class="metric-label">Total Experience</div>
            </div>` : ""}
          ${nonEmptyProfessionalContext.teamSize ? `
            <div class="metric-item">
              <div class="metric-value">${nonEmptyProfessionalContext.teamSize}</div>
              <div class="metric-label">Team Size</div>
            </div>` : ""}
          ${nonEmptyProfessionalContext.industry ? `
            <div class="metric-item">
              <div class="metric-value">${nonEmptyProfessionalContext.industry}</div>
              <div class="metric-label">Industry</div>
            </div>` : ""}
          ${nonEmptyProfessionalContext.functionalDomain ? `
            <div class="metric-item">
              <div class="metric-value">${nonEmptyProfessionalContext.functionalDomain}</div>
              <div class="metric-label">Domain</div>
            </div>` : ""}
          ${nonEmptyProfessionalContext.geographicScope ? `
            <div class="metric-item">
              <div class="metric-value">${nonEmptyProfessionalContext.geographicScope}</div>
              <div class="metric-label">Geographic Scope</div>
            </div>` : ""}
          ${nonEmptyProfessionalContext.revenueResponsibility ? `
            <div class="metric-item">
              <div class="metric-value">${nonEmptyProfessionalContext.revenueResponsibility}</div>
              <div class="metric-label">Revenue Responsibility</div>
            </div>` : ""}
        </div>
      </div>
    ` : ""}

    <!-- Personal Details (non-inline) -->
    ${
      data.personal?.personalInfoDisplay !== "inline" &&
      (data.personal?.fathersName ||
        data.personal?.dateOfBirth ||
        data.personal?.dob ||
        data.personal?.gender ||
        data.personal?.maritalStatus ||
        data.personal?.nationality ||
        data.personal?.passportNo) ? `
      <div class="section" data-section="personal">
        <div class="section-title">Personal Details</div>
        <div style="font-size: ${bodyFontSize}; line-height: 1.6;">
          ${data.personal?.fathersName ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ""}
          ${data.personal?.dateOfBirth || data.personal?.dob ? `<div><strong>Date of Birth:</strong> ${data.personal?.dateOfBirth || data.personal?.dob}</div>` : ""}
          ${data.personal?.gender ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>` : ""}
          ${data.personal?.maritalStatus ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ""}
          ${data.personal?.nationality ? `<div><strong>Nationality:</strong> ${data.personal.nationality}</div>` : ""}
          ${data.personal?.passportNo ? `<div><strong>Passport No:</strong> ${data.personal.passportNo}</div>` : ""}
        </div>
      </div>` : ""
    }

    <!-- Professional Summary -->
    ${
      data.sectionVisibility?.summary !== false && data.summary && data.summary.trim()
        ? `<div class="section" data-section="summary">
      <div class="section-title">Professional Summary</div>
      <p>${data.summary}</p>
    </div>` : ""
    }

    <!-- Career Objective -->
    ${
      data.careerObjective && data.careerObjective.trim()
        ? `<div class="section" data-section="careerObjective">
      <div class="section-title">Career Objective</div>
      <p>${data.careerObjective}</p>
    </div>` : ""
    }

    <!-- Key Responsibilities -->
    ${nonEmptyResponsibilities.length > 0 ? `
      <div class="section" data-section="responsibilities">
        <div class="section-title">Key Responsibilities</div>
        <ul>
          ${nonEmptyResponsibilities.map((line: string, index: number) => `
            <li data-index="${index}">${line.trim()}</li>
          `).join("")}
        </ul>
      </div>
    ` : ""}

    <!-- Professional Experience -->
    ${sortedExperience.length > 0 ? `
      <div class="section" data-section="experience">
        <div class="section-title">Professional Experience</div>
        ${sortedExperience.map((exp: any, index: number) => {
          const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
          const metaParts = formatSubtitle([exp.domain, exp.location]);
          
          return `
            <div class="experience-item" data-index="${index}">
              <div class="item-header">
                <div>
                  <div class="item-title">${exp.title || ""}</div>
                  <div class="item-company">${exp.company || ""}${metaParts ? ` | ${metaParts}` : ""}</div>
                </div>
                <div class="item-date">${dateRange}</div>
              </div>
              ${exp.description ? `<ul>${exp.description.split("\n").filter((line: string) => line.trim()).map((line: string) => `<li>${line.trim()}</li>`).join("")}</ul>` : ""}
              ${exp.achievements ? `<div style="margin-top: 8px;"><strong style="color: var(--text);">Key Achievements:</strong><br/>${exp.achievements}</div>` : ""}
            </div>
          `;
        }).join("")}
      </div>
    ` : ""}

    <!-- Internships -->
    ${nonEmptyInternships.length > 0 ? `
      <div class="section" data-section="internships">
        <div class="section-title">Internships</div>
        ${nonEmptyInternships.map((item: any, index: number) => {
          const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
          
          return `
            <div class="experience-item" data-index="${index}">
              <div class="item-header">
                <div>
                  <div class="item-title">${item.title || ""}</div>
                  <div class="item-company">${item.company || ""}</div>
                </div>
                <div class="item-date">${dateRange}</div>
              </div>
              ${item.location ? `<div class="item-subtitle">${item.location}</div>` : ""}
              ${item.description ? `<p>${item.description}</p>` : ""}
            </div>
          `;
        }).join("")}
      </div>
    ` : ""}

    <!-- Training Programs -->
    ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="section" data-section="trainingPrograms">
        <div class="section-title">Training Programs</div>
        ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.name || ""}</div>
                <div class="item-company">${item.provider || item.organization || ""}</div>
              </div>
              <div class="item-date">${item.completionDate || ""}</div>
            </div>
            ${item.duration ? `<div class="item-subtitle">Duration: ${item.duration}</div>` : ""}
            ${item.description ? `<p>${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Education -->
    ${hasNonEmptyItems(data.education) ? `
      <div class="section" data-section="education">
        <div class="section-title">Education</div>
        ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
          <div class="education-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}${edu.qualification ? ` (${edu.qualification})` : ""}</div>
                ${edu.school ? `<div class="item-company">${edu.school}${edu.location ? `, ${edu.location}` : ""}</div>` : ""}
              </div>
              <div class="item-date">${edu.graduationDate || ""}</div>
            </div>
            ${edu.grade ? `<div class="item-subtitle"> ${edu.grade}</div>` : ""}
            ${edu.description ? `<p>${edu.description}</p>` : ""}
            ${edu.achievements && edu.achievements.length > 0 ? `
              <ul>
                ${edu.achievements.filter((a: string) => a.trim()).map((achievement: string, achIndex: number) => `
                  <li data-item-index="${achIndex}">${achievement}</li>
                `).join("")}
              </ul>
            ` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Academic Projects -->
    ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="section" data-section="academicProjects">
        <div class="section-title">Academic Projects</div>
        ${nonEmptyAcademicProjects.map((item: any, index: number) => `
          <div class="project-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.name || item.title || ""}</div>
                ${item.institution ? `<div class="item-subtitle">${item.institution}</div>` : ""}
              </div>
              <div class="item-date">${item.duration || ""}</div>
            </div>
            <p>${item.description || ""}</p>
            ${item.technologies ? `<p><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ""}
            ${item.url ? `<p><a href="${item.url}" target="_blank" style="color: var(--accent-color);">View Project</a></p>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Client Projects -->
    ${nonEmptyClientProjects.length > 0 ? `
      <div class="section" data-section="clientProjects">
        <div class="section-title">Client Projects</div>
        ${nonEmptyClientProjects.map((item: any, index: number) => `
          <div class="project-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.name || ""}</div>
                ${item.clientOrganization ? `<div class="item-subtitle">${item.clientOrganization}</div>` : ""}
              </div>
              <div class="item-date">${item.duration || ""}</div>
            </div>
            ${item.role ? `<div class="item-subtitle">Role: ${item.role}</div>` : ""}
            <p>${item.description || ""}</p>
            ${item.toolsTechnologies ? `<p><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ""}
            ${item.projectUrl ? `<p><a href="${item.projectUrl}" target="_blank" style="color: var(--accent-color);">View Project</a></p>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Portfolio -->
    ${nonEmptyPortfolio.length > 0 ? `
      <div class="section" data-section="portfolio">
        <div class="section-title">Portfolio</div>
        ${nonEmptyPortfolio.map((item: any, index: number) => `
          <div class="project-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.name || ""}</div>
              </div>
              <div class="item-date">${formatSubtitle([item.type, item.platform])}</div>
            </div>
            <p>${item.description || ""}</p>
            ${item.url ? `<p><a href="${item.url}" target="_blank" style="color: var(--accent-color);">${item.url}</a></p>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Leadership & Positions -->
    ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="section" data-section="leadershipPositions">
        <div class="section-title">Leadership & Positions</div>
        ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
          const dateRange = formatDateRange(item.startDate, item.endDate);
          
          return `
            <div class="experience-item" data-index="${index}">
              <div class="item-header">
                <div>
                  <div class="item-title">${item.position || item.title || ""}</div>
                  <div class="item-company">${item.organization || ""}</div>
                </div>
                <div class="item-date">${dateRange}</div>
              </div>
              <p>${item.description || ""}</p>
            </div>
          `;
        }).join("")}
      </div>
    ` : ""}

    <!-- Volunteering -->
    ${nonEmptyVolunteering.length > 0 ? `
      <div class="section" data-section="volunteering">
        <div class="section-title">Volunteering</div>
        ${nonEmptyVolunteering.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.role || ""}</div>
                <div class="item-company">${item.organization || ""}</div>
              </div>
              <div class="item-date">${item.duration || ""}</div>
            </div>
            ${item.causeArea ? `<div class="item-subtitle">Cause: ${item.causeArea}</div>` : ""}
            <p>${item.description || ""}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Military Service -->
    ${nonEmptyMilitaryService.length > 0 ? `
      <div class="section" data-section="militaryService">
        <div class="section-title">Military Service</div>
        ${nonEmptyMilitaryService.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.rank ? item.rank : ""}${item.rank && item.branch ? " - " : ""}${item.branch || ""}</div>
              </div>
              <div class="item-date">${item.duration || ""}</div>
            </div>
            ${item.specialization ? `<div class="item-subtitle">${item.specialization}</div>` : ""}
            <p>${item.description || ""}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Teaching Experience -->
    ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="section" data-section="teachingExperience">
        <div class="section-title">Teaching Experience</div>
        ${nonEmptyTeachingExperience.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.subjectCourseTaught || item.title || ""}</div>
                <div class="item-company">${item.institution || ""}</div>
              </div>
              <div class="item-date">${item.duration || ""}</div>
            </div>
            <p>${item.description || ""}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Mentorship Experience -->
    ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="section" data-section="mentorshipExperience">
        <div class="section-title">Mentorship Experience</div>
        ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.mentorshipArea || ""}</div>
                <div class="item-company">${item.organizationPlatform || ""}</div>
              </div>
              <div class="item-date">${item.duration || ""}</div>
            </div>
            ${item.menteeLevel ? `<div class="item-subtitle">Mentee Level: ${item.menteeLevel}</div>` : ""}
            <p>${item.description || ""}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Research Grants -->
    ${nonEmptyResearchGrants.length > 0 ? `
      <div class="section" data-section="researchGrants">
        <div class="section-title">Research Grants</div>
        ${nonEmptyResearchGrants.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.title || ""}</div>
                <div class="item-company">${item.agency || ""}</div>
              </div>
              <div class="item-date">${item.year || ""}</div>
            </div>
            ${item.amount ? `<div class="item-subtitle">Amount: ${item.amount}</div>` : ""}
            <p>${item.description || ""}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Publications -->
    ${nonEmptyPublications.length > 0 ? `
      <div class="section" data-section="publications">
        <div class="section-title">Publications</div>
        ${nonEmptyPublications.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.title || ""}</div>
                <div class="item-company">${item.journalPublisher || ""}</div>
              </div>
              <div class="item-date">${item.year || ""}</div>
            </div>
            ${item.publicationType ? `<div class="item-subtitle">Type: ${item.publicationType}</div>` : ""}
            ${item.authors ? `<div><strong>Authors:</strong> ${item.authors}</div>` : ""}
            ${item.urlDoi ? `<p><a href="${item.urlDoi}" target="_blank" style="color: var(--accent-color);">${item.urlDoi}</a></p>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Patents -->
    ${nonEmptyPatents.length > 0 ? `
      <div class="section" data-section="patents">
        <div class="section-title">Patents</div>
        ${nonEmptyPatents.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.title || ""}</div>
              </div>
              <div class="item-date">${item.year || ""}</div>
            </div>
            ${item.patentNumber ? `<div><strong>Patent #:</strong> ${item.patentNumber}</div>` : ""}
            ${item.issuingAuthority ? `<div><strong>Authority:</strong> ${item.issuingAuthority}</div>` : ""}
            ${item.status ? `<div><strong>Status:</strong> ${item.status}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Test Scores -->
    ${nonEmptyTestScores.length > 0 ? `
      <div class="section" data-section="testScores">
        <div class="section-title">Test Scores</div>
        ${nonEmptyTestScores.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.testName || ""}</div>
              </div>
              <div class="item-date">${item.year || ""}</div>
            </div>
            <div><strong>Score:</strong> ${item.score || ""}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ""}</div>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Tools & Systems -->
    ${nonEmptyTools.length > 0 ? `
      <div class="section" data-section="tools">
        <div class="section-title">Tools & Systems</div>
        <ul>
          ${nonEmptyTools.map((tool: string, index: number) => `
            <li data-index="${index}">${tool.trim()}</li>
          `).join("")}
        </ul>
      </div>
    ` : ""}

    <!-- Certifications -->
    ${certifications.length > 0 ? `
      <div class="section" data-section="certifications">
        <div class="section-title">Certifications</div>
        ${certifications.map((cert: any, index: number) => `
          <div class="certification-item" data-section="certifications" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${cert.name || ""}</div>
                <div class="item-company">${cert.issuer || ""}</div>
              </div>
              <div class="item-date">${cert.date || ""}</div>
            </div>
            ${cert.description ? `<p>${cert.description}</p>` : ""}
            ${cert.url ? `<p><a href="${cert.url}" target="_blank" style="color: var(--accent-color);">View Certificate</a></p>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Scholarships -->
    ${nonEmptyScholarships.length > 0 ? `
      <div class="section" data-section="scholarships">
        <div class="section-title">Scholarships</div>
        ${nonEmptyScholarships.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.name || ""}</div>
                <div class="item-company">${item.provider || item.organization || ""}</div>
              </div>
              <div class="item-date">${item.year || ""}</div>
            </div>
            ${item.amount ? `<div class="item-subtitle">Amount: ${item.amount}</div>` : ""}
            <p>${item.description || ""}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Co-curricular Activities -->
    ${nonEmptyCoCurricular.length > 0 ? `
      <div class="section" data-section="coCurricular">
        <div class="section-title">Co-curricular Activities</div>
        ${nonEmptyCoCurricular.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.activity || ""}</div>
                <div class="item-company">${item.organization || ""}</div>
              </div>
              <div class="item-date">${item.year || formatDateRange(item.startDate, item.endDate) || ""}</div>
            </div>
            ${item.role ? `<div class="item-subtitle">Role: ${item.role}</div>` : ""}
            <p>${item.description || ""}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Extracurricular Activities -->
    ${nonEmptyExtracurricular.length > 0 ? `
      <div class="section" data-section="extracurricular">
        <div class="section-title">Extracurricular Activities</div>
        ${nonEmptyExtracurricular.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.activity || ""}</div>
                <div class="item-company">${item.organization || ""}</div>
              </div>
              <div class="item-date">${item.year || formatDateRange(item.startDate, item.endDate) || ""}</div>
            </div>
            ${item.role ? `<div class="item-subtitle">Role: ${item.role}</div>` : ""}
            <p>${item.description || ""}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Projects -->
    ${nonEmptyProjects.length > 0 ? `
      <div class="section" data-section="projects">
        <div class="section-title">Projects</div>
        ${nonEmptyProjects.map((project: any, index: number) => {
          const dateRange = formatDateRange(project.startDate, project.endDate);
          
          return `
            <div class="project-item" data-index="${index}">
              <div class="item-header">
                <div>
                  <div class="item-title">${project.name || ""}</div>
                  ${project.technologies ? `<div class="item-subtitle">${project.technologies}</div>` : ""}
                </div>
                <div class="item-date">${dateRange}</div>
              </div>
              <p>${project.description || ""}</p>
              ${project.url ? `<p><a href="${project.url}" target="_blank" style="color: var(--accent-color);">${project.urlText || "View Project"}</a></p>` : ""}
            </div>
          `;
        }).join("")}
      </div>
    ` : ""}

    <!-- Key Achievements -->
    ${nonEmptyKeyAchievements.length > 0 ? `
      <div class="section" data-section="keyAchievements">
        <div class="section-title">Key Achievements</div>
        <ul>
          ${nonEmptyKeyAchievements.map((achievement: string, index: number) => `
            <li data-index="${index}">${achievement}</li>
          `).join("")}
        </ul>
      </div>
    ` : ""}

    <!-- Awards -->
    ${nonEmptyAwards.length > 0 ? `
      <div class="section" data-section="awards">
        <div class="section-title">Awards</div>
        ${nonEmptyAwards.map((award: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${award.title || ""}</div>
                <div class="item-company">${award.organization || ""}</div>
              </div>
              <div class="item-date">${award.issueYear || ""}</div>
            </div>
            ${award.description ? `<div class="item-description">${award.description}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Speaking Engagements -->
    ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="section" data-section="speakingEngagements">
        <div class="section-title">Speaking Engagements</div>
        ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.topic || ""}</div>
                <div class="item-company">${item.eventName || ""}</div>
              </div>
              <div class="item-date">${item.date || ""}</div>
            </div>
            <p>${item.description || ""}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Memberships -->
    ${nonEmptyMemberships.length > 0 ? `
      <div class="section" data-section="memberships">
        <div class="section-title">Memberships</div>
        ${nonEmptyMemberships.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.membershipName || ""}</div>
                <div class="item-company">${item.organizationName || ""}</div>
              </div>
              <div class="item-date">${item.year || ""}</div>
            </div>
            <p>${item.description || ""}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Workshops -->
    ${nonEmptyWorkshops.length > 0 ? `
      <div class="section" data-section="workshops">
        <div class="section-title">Workshops</div>
        ${nonEmptyWorkshops.map((item: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${item.programTitle || ""}</div>
                <div class="item-company">${item.conductedBy || ""}</div>
              </div>
              <div class="item-date">${item.year || ""}</div>
            </div>
            <p>${item.description || ""}</p>
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- References -->
    ${nonEmptyReferences.length > 0 ? `
      <div class="section" data-section="references">
        <div class="section-title">References</div>
        ${nonEmptyReferences.map((ref: any, index: number) => `
          <div class="experience-item" data-index="${index}">
            <div class="item-header">
              <div>
                <div class="item-title">${ref.name || ""}</div>
                <div class="item-subtitle">${ref.designationRelationship || ""}</div>
                <div class="item-company">${ref.organization || ""}</div>
              </div>
            </div>
            ${ref.contactInformation ? `<div><strong>Contact:</strong> ${ref.contactInformation}</div>` : ""}
          </div>
        `).join("")}
      </div>
    ` : ""}

    <!-- Custom Sections -->
    ${nonEmptyCustomSections.length > 0 ? `
      ${data.customSections
        .filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries))
        .map((section: any, sectionIndex: number) => `
          <div class="section" data-section="custom-${sectionIndex}">
            <div class="section-title">${section.heading || "Custom Section"}</div>
            ${section.entries
              .filter((entry: any) => entry.isVisible && (entry.title || entry.description))
              .map((entry: any, entryIndex: number) => `
                <div class="project-item" data-index="${entryIndex}">
                  <div class="item-header">
                    <div>
                      <div class="item-title">${entry.title || ""}</div>
                      ${entry.organization ? `<div class="item-company">${entry.organization}</div>` : ""}
                    </div>
                    ${entry.date ? `<div class="item-date">${entry.date}</div>` : ""}
                  </div>
                  ${entry.description ? `<p>${entry.description}</p>` : ""}
                </div>
              `).join("")}
          </div>
        `).join("")}
    ` : ""}
  </div>
</div>
</body>
</html>`;
}