export function buildModernTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#2c3e50",
    secondary: "#7f8c8d",
    accent: "#34495e",
    background: "#ffffff",
    headingFont: "Inter",
    bodyFont: "Inter",
  };

  const currentTheme = theme || defaultTheme;
  const typography = theme?.typography || {
    fontSize: "medium",
    alignment: "left",
    fontWeight: "normal",
  };

  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 11;
  const userFontFamily =
    data.formatting?.fontFamily ||
    data.fontFamily ||
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const fontSizeMap = {
    small: { base: "10px", heading: "22px", subheading: "12px" },
    medium: { base: "11px", heading: "24px", subheading: "13px" },
    large: { base: "12px", heading: "26px", subheading: "14px" },
  };

  const alignmentMap = { left: "left", center: "center", justify: "justify" };
  const fontWeightMap = { normal: "400", bold: "700" };

  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2);
  const subheadingFontSize = Math.round(userFontSize * 1.1);

  const currentAlignment =
    alignmentMap[typography.alignment as keyof typeof alignmentMap] || "left";
  const currentFontWeight =
    fontWeightMap[typography.fontWeight as keyof typeof fontWeightMap] || "400";

  // Helper function to check if an array has non-empty items
  const hasContent = (arr: any): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    if (arr.length === 0) return false;
    return arr.some((item: any) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(
          (val: any) => typeof val === "string" && val.trim().length > 0
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

  // Helper to format date range without empty parentheses
  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" - ");
  };

  // Helper to safely join strings with separator, filtering empty values
  const safeJoin = (items: any[], separator: string = ", "): string => {
    if (!items || !Array.isArray(items)) return "";
    const filtered = items.filter(item => item && typeof item === "string" && item.trim().length > 0);
    return filtered.join(separator);
  };

  // Helper to format subtitle with multiple fields
  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(" | ");
  };

  // Parse skills (handles HTML string or array)
  const parseSkills = (): any[] => {
    if (!data.skills) return [];
    if (Array.isArray(data.skills)) return data.skills.filter((s: any) => s && (typeof s === "string" ? s.trim() : s));
    if (typeof data.skills === 'string') {
      if (data.skills.includes('<ul>')) {
        const matches = data.skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          return matches.map(m => m.replace(/<\/?li>/g, '').trim());
        }
      }
      return data.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const nonEmptySkills = parseSkills();
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
  const nonEmptyCertifications = getNonEmptyArray(data.certifications);
  const nonEmptyCustomSections = getNonEmptyArray(data.customSections);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --primary: ${currentTheme.primary};
      --secondary: ${currentTheme.secondary};
      --accent: ${currentTheme.accent};
      --bg: ${currentTheme.background};
      --text: #000000;
      --text-light: #444444;
      --border: #e0e0e0;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text);
      line-height: 1.5;
      background: var(--bg);
      font-size: ${baseFontSize}px;
    }

    .container {
      max-width: 850px;
      margin: 0 auto;
      background: var(--bg);
      padding: 40px 50px;
    }

    .header {
      margin-bottom: 8px;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 10px;
    }

    .header-name {
      font-size: ${Math.round(baseFontSize * 1.6)}px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 2px;
    }

    .header-role {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: var(--primary);
      font-weight: 400;
      line-height: 1.4;
    }

    .contact-header {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 15px;
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: var(--text);
      margin-top: 8px;
      margin-bottom: 15px;
    }

    .contact-header-item {
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .contact-header-item a {
      color: var(--text);
      text-decoration: none;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: ${Math.round(baseFontSize * 1)}px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      margin-top: 5px;
    }

    .summary-text {
      font-size: ${baseFontSize}px;
      color: var(--text);
      line-height: 1.6;
      text-align: ${currentAlignment};
      margin-bottom: 10px;
    }

    .competencies-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4px 15px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      margin-bottom: 10px;
    }

    .competency-item {
      position: relative;
      padding-left: 10px;
    }

    .competency-item:before {
      content: "|";
      position: absolute;
      left: 0;
      color: var(--text);
      font-weight: bold;
    }

    .item {
      margin-bottom: 15px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
      gap: 10px;
      flex-wrap: wrap;
    }

    .item-title-line {
      flex: 1;
    }

    .item-title {
      font-size: ${Math.round(baseFontSize * 1)}px;
      font-weight: 700;
      color: var(--primary);
      display: inline;
    }

    .item-subtitle {
      font-size: ${Math.round(baseFontSize * 1)}px;
      color: var(--text-light);
      font-weight: 400;
      display: inline;
    }

    .item-date {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: var(--text-light);
      font-weight: 400;
      white-space: nowrap;
    }

    .item-description {
      font-size: ${baseFontSize}px;
      color: var(--text);
      line-height: 1.6;
      margin-top: 5px;
    }

    .item-description ul {
      margin: 5px 0 5px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .item-description li {
      margin: 3px 0;
      color: var(--text);
      line-height: 1.5;
    }

    .item-description b,
    .item-description strong {
      font-weight: 600;
    }

    .bullet-list {
      list-style: none;
      padding: 0;
      margin: 5px 0;
    }

    .bullet-list li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 3px;
      color: var(--text);
      font-size: ${baseFontSize}px;
      line-height: 1.5;
    }

    .bullet-list li:before {
      content: "•";
      position: absolute;
      left: 0;
      font-weight: bold;
    }

    .skills-inline {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      line-height: 1.6;
    }

    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
    }

    .contact-item {
      display: flex;
      gap: 5px;
    }

    .contact-label {
      font-weight: 600;
      min-width: 80px;
    }

    .contact-value a {
      color: var(--text);
      text-decoration: none;
    }

    .contact-value a:hover {
      text-decoration: underline;
    }

    .two-column-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px 30px;
      margin-bottom: 10px;
    }

    .three-column-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px 20px;
      margin-bottom: 10px;
    }

    .language-item {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
    }

    .language-name {
      font-weight: 600;
    }

    .language-level {
      color: var(--text-light);
      font-style: italic;
    }

    .cert-item {
      margin-bottom: 10px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
    }

    .cert-name {
      font-weight: 600;
      margin-bottom: 2px;
    }

    .cert-issuer {
      color: var(--text-light);
      margin-bottom: 2px;
    }

    .cert-date {
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: var(--text-light);
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      font-size: ${Math.round(baseFontSize * 0.85)}px;
    }

    .tag {
      padding: 2px 8px;
      border: 1px solid var(--border);
      border-radius: 3px;
      background: #f5f5f5;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 10px;
      margin-bottom: 10px;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 4px;
    }

    .metric-item {
      text-align: center;
    }

    .metric-value {
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      font-weight: 700;
      color: var(--primary);
      line-height: 1.2;
    }

    .metric-label {
      font-size: ${Math.round(baseFontSize * 0.8)}px;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    a {
      color: var(--text);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 15px 0;
    }

    @media (max-width: 768px) {
      .container {
        padding: 25px;
      }

      .competencies-grid {
        grid-template-columns: 1fr;
      }

      .two-column-grid, .three-column-grid {
        grid-template-columns: 1fr;
      }

      .contact-header {
        flex-direction: column;
        gap: 3px;
      }
    }

    @media print {
      body { background: white; }
      .container { padding: 30px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" data-section="personal">
      <div class="header-name" data-section="personal">${
        data.personal?.name && data.personal?.name !== "undefined"
          ? data.personal.name
          : "Your Name"
      }${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</div>
      ${
        data.personal?.role
          ? `<div class="header-role" data-section="personal">${data.personal.role}</div>`
          : ""
      }
    </div>

    ${
      (data.personal?.location ||
      data.personal?.phone ||
      data.personal?.email ||
      data.personal?.linkedinUrl ||
      data.personal?.githubUrl ||
      data.personal?.website ||
      data.personal?.portfolioUrl ||
      data.personal?.fullAddress ||
      data.personal?.alternatePhone ||
      data.personal?.country ||
      data.personal?.pinCode) ? `
    <div class="contact-header">
      ${(() => {
        const addressParts = [
          data.personal?.fullAddress,
          data.personal?.location,
          data.personal?.country,
          data.personal?.pinCode
        ].filter(Boolean);
        return addressParts.length > 0 ? `
        <div class="contact-header-item"><span>📍</span> <span>${addressParts.join(", ")}</span></div>
        ` : "";
      })()}
      ${
        data.personal?.phone
          ? `<div class="contact-header-item"><span>📞</span> <span>${data.personal.phone}</span></div>`
          : ""
      }
      ${
        data.personal?.alternatePhone
          ? `<div class="contact-header-item"><span>📞</span> <span>${data.personal.alternatePhone} (Alt)</span></div>`
          : ""
      }
      ${
        data.personal?.email
          ? `<div class="contact-header-item"><span>✉</span> <span><a href="mailto:${data.personal.email}">${data.personal.email}</a></span></div>`
          : ""
      }
      ${
        data.personal?.linkedinUrl
          ? `<div class="contact-header-item"><span>🔗</span> <span><a href="${
              data.personal.linkedinUrl
            }" target="_blank">${data.personal.linkedinUrl
              .replace("https://", "")
              .replace("http://", "")}</a></span></div>`
          : ""
      }
      ${
        data.personal?.githubUrl
          ? `<div class="contact-header-item"><span>🐙</span> <span><a href="${
              data.personal.githubUrl
            }" target="_blank">${data.personal.githubUrl
              .replace("https://", "")
              .replace("http://", "")}</a></span></div>`
          : ""
      }
      ${
        data.personal?.website || data.personal?.portfolioUrl
          ? `<div class="contact-header-item"><span>🌐</span> <span><a href="${
              data.personal.website || data.personal.portfolioUrl
            }" target="_blank">${(
              data.personal.website || data.personal.portfolioUrl
            )
              .replace("https://", "")
              .replace("http://", "")}</a></span></div>`
          : ""
      }
    </div>
    ` : ""
    }

    <!-- Professional Context -->
    ${
      data.professionalContext && hasObjectValues(data.professionalContext) ? `
    <div class="section" data-section="professionalContext">
      <div class="section-title">Professional Context</div>
      <div class="metrics-grid">
        ${data.professionalContext.totalExperience ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.totalExperience}</div>
          <div class="metric-label">Total Experience</div>
        </div>` : ''}
        ${data.professionalContext.teamSize ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.teamSize}</div>
          <div class="metric-label">Team Size</div>
        </div>` : ''}
        ${data.professionalContext.industry ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.industry}</div>
          <div class="metric-label">Industry</div>
        </div>` : ''}
        ${data.professionalContext.functionalDomain ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.functionalDomain}</div>
          <div class="metric-label">Domain</div>
        </div>` : ''}
        ${data.professionalContext.geographicScope ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.geographicScope}</div>
          <div class="metric-label">Geographic Scope</div>
        </div>` : ''}
        ${data.professionalContext.revenueResponsibility ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.revenueResponsibility}</div>
          <div class="metric-label">Revenue Responsibility</div>
        </div>` : ''}
      </div>
    </div>` : ""
    }

    <!-- Personal Details (Inline) -->
    ${
      data.personal?.personalInfoDisplay === "inline"
        ? (() => {
            const inlineItems = [];
            if (data.personal?.fathersName) inlineItems.push(`<div class="contact-header-item"><span>👨</span> <span>Father: ${data.personal.fathersName}</span></div>`);
            if (data.personal?.dob) inlineItems.push(`<div class="contact-header-item"><span>📅</span> <span>DOB: ${data.personal.dob}</span></div>`);
            if (data.personal?.gender) inlineItems.push(`<div class="contact-header-item"><span>⚥</span> <span>${data.personal.gender}</span></div>`);
            if (data.personal?.maritalStatus) inlineItems.push(`<div class="contact-header-item"><span>💍</span> <span>${data.personal.maritalStatus}</span></div>`);
            if (data.personal?.nationality) inlineItems.push(`<div class="contact-header-item"><span>🌍</span> <span>${data.personal.nationality}</span></div>`);
            
            return inlineItems.length > 0 ? `
    <div class="contact-header" style="margin-bottom: 15px; border-top: 1px solid #e0e0e0; padding-top: 10px;">
      ${inlineItems.join('')}
    </div>
    ` : "";
          })()
        : (data.personal?.fathersName ||
          data.personal?.dob ||
          data.personal?.gender ||
          data.personal?.maritalStatus ||
          data.personal?.nationality ||
          data.personal?.passportNo) ? `
    <div class="section">
      <div class="section-title">Personal Details</div>
      <div class="contact-list">
        ${data.personal?.fathersName ? `<div class="contact-item"><span class="contact-label">Father's Name:</span> <span class="contact-value">${data.personal.fathersName}</span></div>` : ""}
        ${data.personal?.dob ? `<div class="contact-item"><span class="contact-label">Date of Birth:</span> <span class="contact-value">${data.personal.dob}</span></div>` : ""}
        ${data.personal?.gender ? `<div class="contact-item"><span class="contact-label">Gender:</span> <span class="contact-value">${data.personal.gender}</span></div>` : ""}
        ${data.personal?.maritalStatus ? `<div class="contact-item"><span class="contact-label">Marital Status:</span> <span class="contact-value">${data.personal.maritalStatus}</span></div>` : ""}
        ${data.personal?.nationality ? `<div class="contact-item"><span class="contact-label">Nationality:</span> <span class="contact-value">${data.personal.nationality}</span></div>` : ""}
        ${data.personal?.passportNo ? `<div class="contact-item"><span class="contact-label">Passport No:</span> <span class="contact-value">${data.personal.passportNo}</span></div>` : ""}
      </div>
    </div>
    ` : ""
    }

    <!-- Summary -->
    ${
      data.sectionVisibility?.summary !== false && data.summary && data.summary.trim() ? `
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <p class="summary-text" data-section="summary">${data.summary}</p>
    </div>
    ` : ""
    }

    <!-- Career Objective -->
    ${
      data.careerObjective && data.careerObjective.trim() ? `
    <div class="section">
      <div class="section-title">Career Objective</div>
      <p class="summary-text" data-section="careerObjective">${data.careerObjective}</p>
    </div>
    ` : ""
    }

    <!-- Skills -->
    ${
      data.sectionVisibility?.skills !== false && nonEmptySkills.length > 0 ? `
    <div class="section">
      <div class="section-title">Core Competencies</div>
      <div class="competencies-grid">
        ${nonEmptySkills.map((skill: any, index: number) => `
          <div class="competency-item" data-section="skills" data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</div>
        `).join("")}
      </div>
    </div>
    ` : ""
    }

    <!-- Work Experience -->
    ${
      data.sectionVisibility?.experience !== false && hasContent(data.experience) ? `
    <div class="section">
      <div class="section-title">Professional Experience</div>
      ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
        const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
        const subtitle = formatSubtitle([exp.company, exp.location, exp.domain]);
        
        return `
        <div class="item" data-section="experience" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="experience">${exp.title || ""}</span>
              ${subtitle ? ` <span class="item-subtitle" data-section="experience">— ${subtitle}</span>` : ""}
            </div>
            ${dateRange ? `<div class="item-date" data-section="experience">${dateRange}</div>` : ""}
          </div>
          ${exp.description ? `<div class="item-description" data-section="experience">${exp.description}</div>` : ""}
          ${exp.achievements ? `<div class="item-description" data-section="experience" style="margin-top: 8px;"><strong>Key Achievements:</strong><br/>${exp.achievements}</div>` : ""}
        </div>
      `}).join("")}
    </div>
    ` : ""
    }

    <!-- Internships -->
    ${
      nonEmptyInternships.length > 0 ? `
    <div class="section">
      <div class="section-title">Internships</div>
      ${nonEmptyInternships.map((item: any, index: number) => {
        const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
        const subtitle = formatSubtitle([item.company, item.location]);
        
        return `
        <div class="item" data-section="internships" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="internships">${item.title || ""}</span>
              ${subtitle ? ` <span class="item-subtitle" data-section="internships">— ${subtitle}</span>` : ""}
            </div>
            ${dateRange ? `<div class="item-date" data-section="internships">${dateRange}</div>` : ""}
          </div>
          ${item.description ? `<div class="item-description" data-section="internships">${item.description}</div>` : ""}
        </div>
      `}).join("")}
    </div>
    ` : ""
    }

    <!-- Training Programs -->
    ${
      nonEmptyTrainingPrograms.length > 0 ? `
    <div class="section">
      <div class="section-title">Training Programs</div>
      ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
        <div class="item" data-section="trainingPrograms" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="trainingPrograms">${item.name || ""}</span>
            </div>
            ${item.completionDate ? `<div class="item-date" data-section="trainingPrograms">${item.completionDate}</div>` : ""}
          </div>
          ${(item.provider || item.organization || item.duration) ? `
            <div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
          ` : ""}
          ${item.description ? `<div class="item-description" data-section="trainingPrograms">${item.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Education -->
    ${
      data.sectionVisibility?.education !== false && hasContent(data.education) ? `
    <div class="section">
      <div class="section-title">Education</div>
      ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
        <div class="item" data-section="education" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="education">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}${edu.qualification ? ` (${edu.qualification})` : ""}</span>
              ${edu.school ? ` <span class="item-subtitle" data-section="education">— ${edu.school}${edu.location ? `, ${edu.location}` : ""}</span>` : ""}
            </div>
            ${edu.graduationDate ? `<div class="item-date" data-section="education">${edu.graduationDate}</div>` : ""}
          </div>
          ${edu.grade ? `<div class="item-description" data-section="education"><strong>Grade:</strong> ${edu.grade}</div>` : ""}
          ${edu.description ? `<div class="item-description" data-section="education">${edu.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Academic Projects -->
    ${
      nonEmptyAcademicProjects.length > 0 ? `
    <div class="section">
      <div class="section-title">Academic Projects</div>
      ${nonEmptyAcademicProjects.map((item: any, index: number) => `
        <div class="item" data-section="academicProjects" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="academicProjects">${item.name || item.title || ""}</span>
            </div>
            ${item.duration ? `<div class="item-date" data-section="academicProjects">${item.duration}</div>` : ""}
          </div>
          ${(item.institution || item.course) ? `
            <div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ""])}</div>
          ` : ""}
          ${item.description ? `<div class="item-description" data-section="academicProjects">${item.description}</div>` : ""}
          ${item.technologies ? `
            <div class="item-description" data-section="academicProjects" style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>
          ` : ""}
          ${item.url ? `<div style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="font-size: ${Math.round(baseFontSize * 0.85)}px;">View Project</a></div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Client Projects -->
    ${
      nonEmptyClientProjects.length > 0 ? `
    <div class="section">
      <div class="section-title">Client Projects</div>
      ${nonEmptyClientProjects.map((item: any, index: number) => `
        <div class="item" data-section="clientProjects" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="clientProjects">${item.name || ""}</span>
            </div>
            ${item.duration ? `<div class="item-date" data-section="clientProjects">${item.duration}</div>` : ""}
          </div>
          ${(item.clientOrganization || item.role) ? `
            <div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ""])}</div>
          ` : ""}
          ${item.description ? `<div class="item-description" data-section="clientProjects">${item.description}</div>` : ""}
          ${item.toolsTechnologies ? `<div class="item-description" data-section="clientProjects" style="margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ""}
          ${item.projectUrl ? `<div style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank" style="font-size: ${Math.round(baseFontSize * 0.85)}px;">View Project</a></div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Portfolio -->
    ${
      nonEmptyPortfolio.length > 0 ? `
    <div class="section">
      <div class="section-title">Portfolio</div>
      ${nonEmptyPortfolio.map((item: any, index: number) => `
        <div class="item" data-section="portfolio" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="portfolio">${item.name || ""}</span>
            </div>
            ${(item.type || item.platform) ? `<div class="item-date" data-section="portfolio">${formatSubtitle([item.type, item.platform])}</div>` : ""}
          </div>
          ${item.description ? `<div class="item-description" data-section="portfolio">${item.description}</div>` : ""}
          ${item.url ? `<div style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="font-size: ${Math.round(baseFontSize * 0.85)}px;">View Portfolio</a></div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Leadership Positions -->
    ${
      nonEmptyLeadershipPositions.length > 0 ? `
    <div class="section">
      <div class="section-title">Leadership & Positions</div>
      ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
        const dateRange = formatDateRange(item.startDate, item.endDate);
        
        return `
        <div class="item" data-section="leadershipPositions" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="leadershipPositions">${item.position || item.title || ""}</span>
              ${item.organization ? ` <span class="item-subtitle" data-section="leadershipPositions">— ${item.organization}</span>` : ""}
            </div>
            ${dateRange ? `<div class="item-date" data-section="leadershipPositions">${dateRange}</div>` : ""}
          </div>
          ${item.description ? `<div class="item-description" data-section="leadershipPositions">${item.description}</div>` : ""}
        </div>
      `}).join("")}
    </div>
    ` : ""
    }

    <!-- Volunteering -->
    ${
      nonEmptyVolunteering.length > 0 ? `
    <div class="section">
      <div class="section-title">Volunteering</div>
      ${nonEmptyVolunteering.map((item: any, index: number) => `
        <div class="item" data-section="volunteering" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="volunteering">${item.role || ""}</span>
              ${item.organization ? ` <span class="item-subtitle" data-section="volunteering">— ${item.organization}</span>` : ""}
            </div>
            ${item.duration ? `<div class="item-date" data-section="volunteering">${item.duration}</div>` : ""}
          </div>
          ${item.causeArea ? `<div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">Cause: ${item.causeArea}</div>` : ""}
          ${item.description ? `<div class="item-description" data-section="volunteering">${item.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Military Service -->
    ${
      nonEmptyMilitaryService.length > 0 ? `
    <div class="section">
      <div class="section-title">Military Service</div>
      ${nonEmptyMilitaryService.map((item: any, index: number) => `
        <div class="item" data-section="militaryService" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="militaryService">${item.rank ? item.rank : ""}${item.rank && item.branch ? " - " : ""}${item.branch || ""}</span>
            </div>
            ${item.duration ? `<div class="item-date" data-section="militaryService">${item.duration}</div>` : ""}
          </div>
          ${item.specialization ? `<div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">Specialization: ${item.specialization}</div>` : ""}
          ${item.description ? `<div class="item-description" data-section="militaryService">${item.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Teaching Experience -->
    ${
      nonEmptyTeachingExperience.length > 0 ? `
    <div class="section">
      <div class="section-title">Teaching Experience</div>
      ${nonEmptyTeachingExperience.map((item: any, index: number) => `
        <div class="item" data-section="teachingExperience" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="teachingExperience">${item.title || ""}</span>
              ${item.institution ? ` <span class="item-subtitle" data-section="teachingExperience">— ${item.institution}</span>` : ""}
            </div>
            ${item.duration ? `<div class="item-date" data-section="teachingExperience">${item.duration}</div>` : ""}
          </div>
          ${item.subjectCourseTaught ? `<div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">Subject: ${item.subjectCourseTaught}</div>` : ""}
          ${item.description ? `<div class="item-description" data-section="teachingExperience">${item.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Mentorship Experience -->
    ${
      nonEmptyMentorshipExperience.length > 0 ? `
    <div class="section">
      <div class="section-title">Mentorship Experience</div>
      ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
        <div class="item" data-section="mentorshipExperience" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="mentorshipExperience">${item.mentorshipArea || ""}</span>
            </div>
            ${item.duration ? `<div class="item-date" data-section="mentorshipExperience">${item.duration}</div>` : ""}
          </div>
          ${(item.organizationPlatform || item.menteeLevel) ? `
            <div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ""])}</div>
          ` : ""}
          ${item.description ? `<div class="item-description" data-section="mentorshipExperience">${item.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Research Grants -->
    ${
      nonEmptyResearchGrants.length > 0 ? `
    <div class="section">
      <div class="section-title">Research Grants</div>
      ${nonEmptyResearchGrants.map((item: any, index: number) => `
        <div class="item" data-section="researchGrants" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="researchGrants">${item.title || ""}</span>
            </div>
            ${item.year ? `<div class="item-date" data-section="researchGrants">${item.year}</div>` : ""}
          </div>
          ${(item.agency || item.amount) ? `
            <div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : ""])}</div>
          ` : ""}
          ${item.description ? `<div class="item-description" data-section="researchGrants">${item.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Publications -->
    ${
      nonEmptyPublications.length > 0 ? `
    <div class="section">
      <div class="section-title">Publications</div>
      ${nonEmptyPublications.map((item: any, index: number) => `
        <div class="item" data-section="publications" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="publications">${item.title || ""}</span>
            </div>
            ${item.year ? `<div class="item-date" data-section="publications">${item.year}</div>` : ""}
          </div>
          ${(item.journalPublisher || item.publicationType) ? `
            <div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
          ` : ""}
          ${item.authors ? `<div class="item-description" data-section="publications"><strong>Authors:</strong> ${item.authors}</div>` : ""}
          ${item.urlDoi ? `<div style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank" style="font-size: ${Math.round(baseFontSize * 0.85)}px;">View Publication</a></div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Patents -->
    ${
      nonEmptyPatents.length > 0 ? `
    <div class="section">
      <div class="section-title">Patents</div>
      ${nonEmptyPatents.map((item: any, index: number) => `
        <div class="item" data-section="patents" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="patents">${item.title || ""}</span>
            </div>
            ${item.year ? `<div class="item-date" data-section="patents">${item.year}</div>` : ""}
          </div>
          ${(item.patentNumber || item.issuingAuthority) ? `
            <div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : "", item.issuingAuthority])}</div>
          ` : ""}
          ${item.status ? `<div class="item-description" data-section="patents"><strong>Status:</strong> ${item.status}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Test Scores -->
    ${
      nonEmptyTestScores.length > 0 ? `
    <div class="section">
      <div class="section-title">Test Scores</div>
      <div class="two-column-grid">
        ${nonEmptyTestScores.map((item: any, index: number) => `
          <div class="cert-item" data-section="testScores" data-index="${index}">
            <div class="cert-name">${item.testName || ""}</div>
            ${(item.score || item.percentileRank) ? `
              <div class="cert-issuer">${item.score ? `Score: ${item.score}` : ""}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ""}</div>
            ` : ""}
            ${item.year ? `<div class="cert-date">${item.year}</div>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""
    }

    <!-- Awards -->
    ${
      nonEmptyAwards.length > 0 ? `
    <div class="section">
      <div class="section-title">Awards</div>
      ${nonEmptyAwards.map((item: any, index: number) => `
        <div class="item" data-section="awards" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="awards">${item.title || ""}</span>
              ${item.organization ? ` <span class="item-subtitle" data-section="awards">— ${item.organization}</span>` : ""}
            </div>
            ${item.issueYear ? `<div class="item-date" data-section="awards">${item.issueYear}</div>` : ""}
          </div>
          ${item.description ? `<div class="item-description" data-section="awards">${item.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Speaking Engagements -->
    ${
      nonEmptySpeakingEngagements.length > 0 ? `
    <div class="section">
      <div class="section-title">Speaking Engagements</div>
      ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
        <div class="item" data-section="speakingEngagements" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="speakingEngagements">${item.topic || ""}</span>
            </div>
            ${item.date ? `<div class="item-date" data-section="speakingEngagements">${item.date}</div>` : ""}
          </div>
          ${item.eventName ? `<div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">Event: ${item.eventName}</div>` : ""}
          ${item.description ? `<div class="item-description" data-section="speakingEngagements">${item.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Memberships -->
    ${
      nonEmptyMemberships.length > 0 ? `
    <div class="section">
      <div class="section-title">Memberships</div>
      ${nonEmptyMemberships.map((item: any, index: number) => `
        <div class="item" data-section="memberships" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="memberships">${item.membershipName || ""}</span>
              ${item.organizationName ? ` <span class="item-subtitle" data-section="memberships">— ${item.organizationName}</span>` : ""}
            </div>
            ${item.year ? `<div class="item-date" data-section="memberships">${item.year}</div>` : ""}
          </div>
          ${item.description ? `<div class="item-description" data-section="memberships">${item.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Workshops -->
    ${
      nonEmptyWorkshops.length > 0 ? `
    <div class="section">
      <div class="section-title">Workshops</div>
      ${nonEmptyWorkshops.map((item: any, index: number) => `
        <div class="item" data-section="workshops" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="workshops">${item.programTitle || ""}</span>
            </div>
            ${item.year ? `<div class="item-date" data-section="workshops">${item.year}</div>` : ""}
          </div>
          ${item.conductedBy ? `<div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">Conducted by: ${item.conductedBy}</div>` : ""}
          ${item.description ? `<div class="item-description" data-section="workshops">${item.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Scholarships -->
    ${
      nonEmptyScholarships.length > 0 ? `
    <div class="section">
      <div class="section-title">Scholarships</div>
      ${nonEmptyScholarships.map((item: any, index: number) => `
        <div class="item" data-section="scholarships" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="scholarships">${item.name || ""}</span>
            </div>
            ${item.year ? `<div class="item-date" data-section="scholarships">${item.year}</div>` : ""}
          </div>
          ${(item.provider || item.organization || item.amount) ? `
            <div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">${formatSubtitle([item.provider || item.organization, item.amount ? `Amount: ${item.amount}` : ""])}</div>
          ` : ""}
          ${item.description ? `<div class="item-description" data-section="scholarships">${item.description}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Co-curricular Activities -->
    ${
      nonEmptyCoCurricular.length > 0 ? `
    <div class="section">
      <div class="section-title">Co-curricular Activities</div>
      ${nonEmptyCoCurricular.map((item: any, index: number) => `
        <div class="item" data-section="coCurricular" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="coCurricular">${item.activity || ""}</span>
              ${item.organization ? ` <span class="item-subtitle" data-section="coCurricular">— ${item.organization}</span>` : ""}
            </div>
            ${item.year ? `<div class="item-date" data-section="coCurricular">${item.year}</div>` : ""}
          </div>
          ${item.role ? `<div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;"><strong>Role:</strong> ${item.role}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Extracurricular Activities -->
    ${
      nonEmptyExtracurricular.length > 0 ? `
    <div class="section">
      <div class="section-title">Extracurricular Activities</div>
      ${nonEmptyExtracurricular.map((item: any, index: number) => `
        <div class="item" data-section="extracurricular" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="extracurricular">${item.activity || ""}</span>
              ${item.organization ? ` <span class="item-subtitle" data-section="extracurricular">— ${item.organization}</span>` : ""}
            </div>
            ${item.year ? `<div class="item-date" data-section="extracurricular">${item.year}</div>` : ""}
          </div>
          ${item.role ? `<div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;"><strong>Role:</strong> ${item.role}</div>` : ""}
        </div>
      `).join("")}
    </div>
    ` : ""
    }

    <!-- Certifications -->
    ${
      data.sectionVisibility?.certifications !== false && nonEmptyCertifications.length > 0 ? `
    <div class="section">
      <div class="section-title">Certifications</div>
      <div class="two-column-grid">
        ${nonEmptyCertifications.map((cert: any, index: number) => `
          <div class="cert-item" data-section="certifications" data-index="${index}">
            <div class="cert-name">${cert.name || ""}</div>
            ${cert.issuer ? `<div class="cert-issuer">${cert.issuer}</div>` : ""}
            ${cert.date ? `<div class="cert-date">${cert.date}</div>` : ""}
            ${cert.description ? `<div class="cert-issuer">${cert.description}</div>` : ""}
            ${cert.url ? `<div style="margin-top: 3px;"><a href="${cert.url}" target="_blank" style="font-size: ${Math.round(baseFontSize * 0.8)}px;">View Certificate</a></div>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""
    }

    <!-- Languages -->
    ${
      data.sectionVisibility?.languages !== false && nonEmptyLanguages.length > 0 ? `
    <div class="section">
      <div class="section-title">Languages</div>
      <div class="two-column-grid">
        ${nonEmptyLanguages.map((lang: any, index: number) => `
          <div class="language-item">
            <span class="language-name">${lang.language || lang}</span>
            ${lang.level ? `<span class="language-level">${lang.level}${lang.capability ? ` - ${lang.capability}` : ''}</span>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""
    }

    <!-- Tools & Technologies -->
    ${
      nonEmptyToolsTechnologies.length > 0 ? `
    <div class="section">
      <div class="section-title">Tools & Technologies</div>
      <div class="three-column-grid">
        ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
          <div class="cert-item" data-section="toolsTechnologies" data-index="${index}">
            <div class="cert-name">${item.name || ""}</div>
            ${(item.category || item.proficiency) ? `<div class="cert-issuer">${formatSubtitle([item.category, item.proficiency])}</div>` : ""}
            ${item.experienceDuration ? `<div class="cert-date">${item.experienceDuration}</div>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""
    }

    <!-- Methodologies -->
    ${
      nonEmptyMethodologies.length > 0 ? `
    <div class="section">
      <div class="section-title">Methodologies</div>
      <div class="two-column-grid">
        ${nonEmptyMethodologies.map((item: any, index: number) => `
          <div class="cert-item" data-section="methodologies" data-index="${index}">
            <div class="cert-name">${item.name || ""}</div>
            ${(item.certification || item.experienceDuration) ? `
              <div class="cert-issuer">${formatSubtitle([item.certification, item.experienceDuration ? `${item.experienceDuration} years` : ""])}</div>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""
    }

    <!-- Industry Expertise -->
    ${
      nonEmptyIndustryExpertise.length > 0 ? `
    <div class="section">
      <div class="section-title">Industry Expertise</div>
      <div class="two-column-grid">
        ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
          <div class="cert-item" data-section="industryExpertise" data-index="${index}">
            <div class="cert-name">${item.industry || ""}</div>
            ${(item.domainArea || item.experienceDuration) ? `
              <div class="cert-issuer">${formatSubtitle([item.domainArea, item.experienceDuration ? `${item.experienceDuration} years` : ""])}</div>
            ` : ""}
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""
    }

    <!-- Availability & Work Authorization -->
    ${
      data.availabilityWorkAuth && hasObjectValues(data.availabilityWorkAuth) ? `
    <div class="section">
      <div class="section-title">Availability</div>
      <div class="competencies-grid">
        ${data.availabilityWorkAuth.availabilityNoticePeriod ? `
        <div class="competency-item">
          <strong>Notice Period:</strong> ${data.availabilityWorkAuth.availabilityNoticePeriod}
        </div>` : ''}
        ${data.availabilityWorkAuth.workAuthorizationStatus ? `
        <div class="competency-item">
          <strong>Work Auth:</strong> ${data.availabilityWorkAuth.workAuthorizationStatus}
        </div>` : ''}
        ${data.availabilityWorkAuth.preferredLocation ? `
        <div class="competency-item">
          <strong>Preferred Location:</strong> ${data.availabilityWorkAuth.preferredLocation}
        </div>` : ''}
      </div>
    </div>
    ` : ""
    }

    <!-- Social Profiles -->
    ${
      nonEmptySocialProfiles.length > 0 ? `
    <div class="section">
      <div class="section-title">Social Profiles</div>
      <div class="contact-header" style="justify-content: flex-start;">
        ${nonEmptySocialProfiles.map((profile: any, index: number) => `
          <div class="contact-header-item" data-section="socialProfiles" data-index="${index}">
            <span>🔗</span> <span><a href="${profile.url}" target="_blank">${profile.platform || "Profile"}</a></span>
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""
    }

    <!-- Key Achievements -->
    ${
      nonEmptyKeyAchievements.length > 0 ? `
    <div class="section">
      <div class="section-title">Key Achievements</div>
      <ul class="bullet-list">
        ${nonEmptyKeyAchievements.map((achievement: string, index: number) => `
          <li data-section="keyAchievements" data-index="${index}">${achievement}</li>
        `).join("")}
      </ul>
    </div>
    ` : ""
    }

    <!-- Key Responsibilities -->
    ${
      nonEmptyResponsibilities.length > 0 ? `
    <div class="section">
      <div class="section-title">Key Responsibilities</div>
      <ul class="bullet-list">
        ${nonEmptyResponsibilities.map((line: string, index: number) => `
          <li data-section="responsibilities" data-index="${index}">${line.trim()}</li>
        `).join("")}
      </ul>
    </div>
    ` : ""
    }

    <!-- Tools (Simple List) -->
    ${
      nonEmptyTools.length > 0 ? `
    <div class="section">
      <div class="section-title">Tools</div>
      <ul class="bullet-list">
        ${nonEmptyTools.map((line: string, index: number) => `
          <li data-section="tools" data-index="${index}">${line.trim()}</li>
        `).join("")}
      </ul>
    </div>
    ` : ""
    }

    <!-- Projects (General) -->
    ${
      data.sectionVisibility?.projects !== false && nonEmptyProjects.length > 0 ? `
    <div class="section">
      <div class="section-title">Projects</div>
      ${nonEmptyProjects.map((project: any, index: number) => {
        const dateRange = formatDateRange(project.startDate, project.endDate);
        
        return `
        <div class="item" data-section="projects" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="projects">${project.name || ""}</span>
            </div>
            ${dateRange ? `<div class="item-date" data-section="projects">${dateRange}</div>` : ""}
          </div>
          ${project.technologies ? `<div class="item-subtitle" style="font-size: ${Math.round(baseFontSize * 0.9)}px;">${project.technologies}</div>` : ""}
          ${project.description ? `<div class="item-description" data-section="projects">${project.description}</div>` : ""}
          ${project.url ? `<div style="margin-top: 5px;"><a href="${project.url}" target="_blank" style="font-size: ${Math.round(baseFontSize * 0.85)}px;">${project.urlText || "View Project"}</a></div>` : ""}
        </div>
      `}).join("")}
    </div>
    ` : ""
    }

    <!-- Hobbies -->
    ${
      data.sectionVisibility?.hobbies !== false && nonEmptyHobbies.length > 0 ? `
    <div class="section">
      <div class="section-title">Hobbies & Interests</div>
      <div class="tags-container">
        ${nonEmptyHobbies.map((hobby: any, index: number) => `
          <span class="tag" data-section="hobbies" data-index="${index}">${hobby}</span>
        `).join("")}
      </div>
    </div>
    ` : ""
    }

    <!-- Social Links -->
    ${
      data.sectionVisibility?.socialLinks !== false && nonEmptySocialLinks.length > 0 ? `
    <div class="section">
      <div class="section-title">Social Links</div>
      <div class="contact-list">
        ${nonEmptySocialLinks.map((link: any, index: number) => `
          <div data-section="socialLinks" data-index="${index}">
            <a href="${link.url}" target="_blank">${
              link.urlText ||
              link.url.replace("https://", "").replace("http://", "")
            }</a>
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""
    }

    <!-- References -->
    ${
      nonEmptyReferences.length > 0 ? `
    <div class="section">
      <div class="section-title">References</div>
      <div class="two-column-grid">
        ${nonEmptyReferences.map((ref: any, index: number) => `
          <div class="cert-item" data-section="references" data-index="${index}">
            <div class="cert-name">${ref.name || ""}</div>
            ${ref.designationRelationship ? `<div class="cert-issuer">${ref.designationRelationship}</div>` : ""}
            ${ref.organization ? `<div class="cert-issuer">${ref.organization}</div>` : ""}
            ${ref.contactInformation ? `<div class="cert-date">${ref.contactInformation}</div>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""
    }

    <!-- Custom Sections -->
    ${
      nonEmptyCustomSections.length > 0
        ? data.customSections
            .filter((section: any) => section.isVisible)
            .map((section: any, sectionIndex: number) => `
      <div class="section" data-section="custom-${sectionIndex}">
        <div class="section-title">${section.heading || "Custom Section"}</div>
        ${
          section.entries && section.entries.length > 0
            ? section.entries
                .filter((entry: any) => entry.isVisible)
                .map((entry: any, entryIndex: number) => `
          <div class="item" data-index="${entryIndex}">
            <div class="item-header">
              <div class="item-title-line">
                <span class="item-title">${entry.title || ""}</span>
                ${entry.organization ? ` <span class="item-subtitle">— ${entry.organization}</span>` : ""}
              </div>
              ${entry.date ? `<div class="item-date">${entry.date}</div>` : ""}
            </div>
            ${entry.description ? `<div class="item-description">${entry.description}</div>` : ""}
          </div>
        `).join("")
            : ""
        }
      </div>
    `).join("")
        : ""
    }
  </div>
</body>
</html>`;
}