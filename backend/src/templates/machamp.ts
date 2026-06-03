export function buildMachampTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#000000", 
    secondary: "#1e293b", 
    background: "#ffffff",
    headingFont: "Inter, sans-serif",
    bodyFont: "Inter, sans-serif"
  };

  // --- PRESERVED LOGIC START ---
  const currentTheme = theme || defaultTheme;
  const typography = theme?.typography || {
    fontSize: "medium",
    alignment: "left",
    fontWeight: "normal",
  };

  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14 
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Inter, sans-serif'
  
  const baseFontSize = userFontSize

  const fontSizeMap = {
    small: { base: "11px", heading: "30px", subheading: "14px" },
    medium: { base: "14px", heading: "36px", subheading: "15px" },
    large: { base: "16px", heading: "42px", subheading: "17px" },
  };

  const alignmentMap = {
    left: "left",
    center: "center",
    justify: "justify",
  };

  const fontWeightMap = {
    normal: "400",
    bold: "700",
  };

  const currentFontSize =
    fontSizeMap[typography.fontSize as keyof typeof fontSizeMap] ||
    fontSizeMap.medium;
  const currentAlignment =
    alignmentMap[typography.alignment as keyof typeof alignmentMap] || "left";
  const currentFontWeight =
    fontWeightMap[typography.fontWeight as keyof typeof fontWeightMap] ||
    "400";
  // --- PRESERVED LOGIC END ---

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

  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => 
      val !== null && val !== undefined && val !== ""
    );
  };

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" - ");
  };

  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(", ");
  };

  const parseSkills = (): any[] => {
    if (!data.skills) return [];
    if (Array.isArray(data.skills)) return data.skills.filter((s: any) => s && (typeof s === "string" ? s.trim() : s));
    if (typeof data.skills === 'string') {
      if (data.skills.includes('<ul>')) {
        const matches = data.skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          return matches.map(m => m.replace(/<\/? li>/g, '').trim());
        }
      }
      if (data.skills.includes('\n')) {
        return data.skills.split('\n')
          .map((s: string) => s.trim())
          .filter(s => s && s !== '-');
      }
      return data.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  };


  const parseCoreCompetencies = (): any[] => {
  if (!data.coreCompetencies) return [];
  if (Array.isArray(data.coreCompetencies)) return data.coreCompetencies.filter((s: any) => s && (typeof s === "string" ? s.trim() : s));
  if (typeof data.coreCompetencies === 'string') {
    if (data.coreCompetencies.includes('<ul>')) {
      const matches = data.coreCompetencies.match(/<li>(.*?)<\/li>/g);
      if (matches) {
        return matches.map(m => m.replace(/<\/?li>/g, '').trim());
      }
    }
    if (data.coreCompetencies.includes('\n')) {
      return data.coreCompetencies.split('\n')
        .map((s: string) => s.trim())
        .filter(s => s && s !== '-');
    }
    return data.coreCompetencies.split(',').map((s: string) => s.trim()).filter(Boolean);
  }
  return [];
};

  const renderDescription = (description: string): string => {
    if (!description) return '';
    
    if (description.includes('<ul>') || description.includes('<li>')) {
      return `<ul class="description-list">${description.replace(/<li>/g, '<li><span class="bullet">&#8226;</span><span class="bullet-text">').replace(/<\/li>/g, '</span></li>')}</ul>`;
    }
    
    const lines = description.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) return '';
    
    return `<ul class="description-list">${lines.map(line => `<li><span class="bullet">&#8226;</span><span class="bullet-text">${line.trim()}</span></li>`).join('')}</ul>`;
  };

  // SVG Icons
  const icons = {
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    phoneAlt: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    pinCode: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 8 10 6 10-6"/></svg>`,
    birthday: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    gender: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 22v-4M4 12h4M16 12h4"/></svg>`,
    marital: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  };

  const nonEmptySkills = parseSkills();
  const nonEmptyCoreCompetencies = parseCoreCompetencies();
  const nonEmptyInternships = getNonEmptyArray(data.internships);
  const nonEmptyTrainingPrograms = getNonEmptyArray(data.trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyArray(data.academicProjects);
  const nonEmptyToolsTechnologies = getNonEmptyArray(data.toolsTechnologies);
  const nonEmptyMethodologies = getNonEmptyArray(data.methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyArray(data.industryExpertise);
  const nonEmptyReferences = getNonEmptyArray(data.references);
  const nonEmptySocialProfiles = getNonEmptyArray(data.socialProfiles);
  const nonEmptySocialLinks = getNonEmptyArray(data.socialLinks);
  const nonEmptyLanguages = getNonEmptyArray(data.languages);
  const nonEmptyHobbies = getNonEmptyArray(data.hobbies);
  const nonEmptyProjects = getNonEmptyArray(data.projects);
  const nonEmptyCertifications = getNonEmptyArray(data.certifications);
  const nonEmptyCustomSections = getNonEmptyArray(data.customSections);
  const nonEmptyProfessionalContext = data.professionalContext && hasObjectValues(data.professionalContext) ? data.professionalContext : null;
  const nonEmptyAvailabilityWorkAuth = data.availabilityWorkAuth && hasObjectValues(data.availabilityWorkAuth) ? data.availabilityWorkAuth : null;
  
  const nonEmptyLeadershipPositions = getNonEmptyArray(data.leadershipPositions);
  const nonEmptyCoCurricular = getNonEmptyArray(data.coCurricular);
  const nonEmptyExtracurricular = getNonEmptyArray(data.extracurricular);
  const nonEmptyScholarships = getNonEmptyArray(data.scholarships);
  const nonEmptyAwards = getNonEmptyArray(data.awards);
  const nonEmptySpeakingEngagements = getNonEmptyArray(data.speakingEngagements);
  const nonEmptyMemberships = getNonEmptyArray(data.memberships);
  const nonEmptyWorkshops = getNonEmptyArray(data.workshops);
  const nonEmptyClientProjects = getNonEmptyArray(data.clientProjects);
  const nonEmptyPortfolio = getNonEmptyArray(data.portfolio);
  const nonEmptyVolunteering = getNonEmptyArray(data.volunteering);
  const nonEmptyMilitaryService = getNonEmptyArray(data.militaryService);
  const nonEmptyTeachingExperience = getNonEmptyArray(data.teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyArray(data.mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyArray(data.researchGrants);
  const nonEmptyTestScores = getNonEmptyArray(data.testScores);
  const nonEmptyPublications = getNonEmptyArray(data.publications);
  const nonEmptyPatents = getNonEmptyArray(data.patents);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Resume</title>

<style>
  * {
    margin: 0; padding: 0; box-sizing: border-box;
  }

  body {
    font-family: ${userFontFamily};
    background: #ffffff;
    color: #2c3e50;
    line-height: 1.5;
    font-size: ${baseFontSize}px;
    padding: 40px;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
    background: #ffffff;
  }

  /* --- HEADER STYLING --- */
  .header-section {
    text-align: center;
    margin-bottom: 25px;
  }

  .name {
    font-size: 34px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 4px;
    letter-spacing: -0.5px;
  }

  .role-title {
    font-size: 18px;
    color: #2c3e50;
    font-weight: 500;
    margin-bottom: 15px;
  }

  .contact-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
    align-items: center;
    font-size: 13px;
    color: #4a5568;
    margin-bottom: 8px;
  }

  .contact-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .contact-item svg {
    width: 14px;
    height: 14px;
    stroke: #000000;
    flex-shrink: 0;
  }

  .contact-item a {
    color: inherit;
    text-decoration: none;
  }

  .contact-item a:hover {
    text-decoration: underline;
  }

  .divider-line {
    border-top: 1px solid #d1d5db;
    margin: 15px 0 25px 0;
  }

  /* --- SECTION GENERIC STYLING --- */
  .section {
    margin-bottom: 28px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 700;
    color: #000000;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding-bottom: 5px;
    border-bottom: 1px solid #9ca3af;
    margin-bottom: 14px;
  }

  /* --- SUMMARY --- */
  .summary-text {
    font-size: ${baseFontSize}px;
    color: #374151;
    line-height: 1.6;
    text-align: justify;
  }

  /* --- SKILLS 2-COLUMN GRID --- */
  .skills-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 40px;
  }

  .skills-column {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .skill-item {
    font-size: ${baseFontSize}px;
    color: #374151;
    margin-bottom: 8px;
    line-height: 1.4;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    list-style: none;
  }

  .skill-bullet {
    color: #000000;
    font-size: ${baseFontSize}px;
    display: inline-block;
    flex-shrink: 0;
  }

  .skill-text {
    flex: 1;
  }

  /* --- ENTRIES (EXPERIENCE, EDUCATION, ETC) --- */
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2px;
  }

  .entry-title {
    font-size: 15px;
    font-weight: 700;
    color: #111827;
  }

  .entry-date {
    font-size: 13px;
    font-weight: 500;
    color: #111827;
    white-space: nowrap;
  }

  .entry-subheader {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #4b5563;
    font-style: italic;
    margin-bottom: 8px;
  }

  .entry-content {
    font-size: ${baseFontSize}px;
    color: #374151;
    margin-bottom: 16px;
  }

  /* Description lists with proper bullets for PDF */
  .description-list {
    list-style: none;
    margin-left: 0;
    margin-top: 4px;
    padding-left: 0;
  }

  .description-list li {
    margin-bottom: 5px;
    line-height: 1.5;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .description-list .bullet {
    color: #000000;
    display: inline-block;
    flex-shrink: 0;
  }

  .description-list .bullet-text {
    flex: 1;
  }

  /* Context grid for availability etc */
  .context-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 5px;
  }
  .context-item {
    font-size: ${baseFontSize}px;
    color: #374151;
  }
  .context-label {
    font-weight: 700;
    color: #111827;
  }

  /* Mobile Optimization */
  @media (max-width: 600px) {
    body { padding: 20px; }
    .entry-header, .entry-subheader {
      flex-direction: column;
      justify-content: flex-start;
    }
    .entry-date { margin-top: 2px; }
    .skills-container { 
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .context-grid { grid-template-columns: 1fr; }
  }

  /* Print/PDF Optimization */
  @media print {
    body { padding: 0; }
    .contact-item svg { stroke: #000000 !important; }
    .skill-bullet { color: #000000 !important; }
    .description-list .bullet { color: #000000 !important; }
  }
</style>
</head>

<body>
<div class="container">

  <div class="header-section" data-section="personal">
    <div class="name">${data.personal?.name && data.personal?.name !== "undefined" ? data.personal.name : "YOUR NAME"}${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</div>
    ${data.personal?.role ? `<div class="role-title">${data.personal.role}</div>` : ""}
    
    <div class="contact-container">
      ${data.personal?.phone ? `<span class="contact-item">${icons.phone} ${data.personal.phone}</span>` : ""}
      ${data.personal?.alternatePhone ? `<span class="contact-item">${icons.phoneAlt} ${data.personal.alternatePhone}</span>` : ""}
      ${data.personal?.email ? `<span class="contact-item">${icons.email} <a href="mailto:${data.personal.email}">${data.personal.email}</a></span>` : ""}
      ${(() => {
        const locParts = [
          data.personal?.location,
          data.personal?.country,
        ].filter(Boolean);
        return locParts.length > 0
          ? `<span class="contact-item">${icons.location} ${locParts.join(", ")}</span>`
          : "";
      })()}
      ${data.personal?.pinCode ? `<span class="contact-item">${icons.pinCode} ${data.personal.pinCode}</span>` : ""}
      ${data.personal?.dob ? `<span class="contact-item">${icons.birthday} ${data.personal.dob}</span>` : ""}
      ${data.personal?.gender ? `<span class="contact-item">${icons.gender} ${data.personal.gender}</span>` : ""}
      ${data.personal?.maritalStatus ? `<span class="contact-item">${icons.marital} ${data.personal.maritalStatus}</span>` : ""}
    </div>
    
    <div class="contact-container" style="margin-top: 4px;">
      ${data.personal?.linkedinUrl ? `<span class="contact-item">${icons.linkedin} <a href="${data.personal.linkedinUrl}" target="_blank">${data.personal.linkedinUrl.replace("https://", "")}</a></span>` : ""}
      ${data.personal?.website ? `<span class="contact-item">${icons.globe} <a href="${data.personal.website}" target="_blank">${data.personal.website.replace("https://", "")}</a></span>` : ""}
    </div>
  </div>

  <div class="divider-line"></div>

  ${
    nonEmptyAvailabilityWorkAuth
      ? `
  <div class="section" data-section="availabilityWorkAuth">
    <div class="section-title">Availability & Work Auth</div>
    <div class="context-grid">
      ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<div class="context-item"><span class="context-label">Notice Period:</span> ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</div>` : ""}
      ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<div class="context-item"><span class="context-label">Work Auth:</span> ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</div>` : ""}
      ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<div class="context-item"><span class="context-label">Preferred Location:</span> ${nonEmptyAvailabilityWorkAuth.preferredLocation}</div>` : ""}
    </div>
  </div>`
      : ""
  }

  ${
    data.careerObjective &&
    data.careerObjective.trim() &&
    (!data.summary || !data.summary.trim())
      ? `
  <div class="section" data-section="careerObjective">
    <div class="section-title">Career Objective</div>
    <p class="summary-text">${data.careerObjective}</p>
  </div>`
      : ""
  }

  ${
    data.summary && data.summary.trim()
      ? `
  <div class="section" data-section="summary">
    <div class="section-title">Summary</div>
    <p class="summary-text">${data.summary}</p>
  </div>`
      : ""
  }

  ${
  nonEmptySkills.length > 0
    ? `
  <div class="section" data-section="skills">
    <div class="section-title">Skills</div>
    <div class="skills-container">
      ${(() => {
        const midPoint = Math.ceil(nonEmptySkills.length / 2);
        const firstColumn = nonEmptySkills.slice(0, midPoint);
        const secondColumn = nonEmptySkills.slice(midPoint);
        return `
          <div class="skills-column">
            ${firstColumn
              .map(
                (skill: any) => `
                  <div class="skill-item">
                    <span class="skill-bullet">&#8226;</span>
                    <span class="skill-text">${typeof skill === "string" ? skill.trim() : skill}</span>
                  </div>                  
                `
              )
              .join("")}
          </div>
          <div class="skills-column">
            ${secondColumn
              .map(
                (skill: any) => `
                  <div class="skill-item">
                    <span class="skill-bullet">&#8226;</span>
                    <span class="skill-text">${typeof skill === "string" ? skill.trim() : skill}</span>
                  </div>                  
                `
              )
              .join("")}
          </div>
        `;
      })()}
    </div>
  </div>`
    : ""
}

${
  nonEmptyCoreCompetencies.length > 0
    ? `
  <div class="section" data-section="coreCompetencies">
    <div class="section-title">Core Competencies</div>
    <div class="skills-container">
      ${(() => {
        const midPoint = Math.ceil(nonEmptyCoreCompetencies.length / 2);
        const firstColumn = nonEmptyCoreCompetencies.slice(0, midPoint);
        const secondColumn = nonEmptyCoreCompetencies.slice(midPoint);
        return `
          <div class="skills-column">
            ${firstColumn
              .map(
                (comp: any) => `
                  <div class="skill-item">
                    <span class="skill-bullet">&#8226;</span>
                    <span class="skill-text">${typeof comp === "string" ? comp.trim() : comp}</span>
                  </div>                  
                `
              )
              .join("")}
          </div>
          <div class="skills-column">
            ${secondColumn
              .map(
                (comp: any) => `
                  <div class="skill-item">
                    <span class="skill-bullet">&#8226;</span>
                    <span class="skill-text">${typeof comp === "string" ? comp.trim() : comp}</span>
                  </div>                  
                `
              )
              .join("")}
          </div>
        `;
      })()}
    </div>
  </div>`
    : ""
}

  ${
    hasNonEmptyItems(data.experience)
      ? `
  <div class="section" data-section="experience">
    <div class="section-title">Experience</div>
    ${getNonEmptyArray(data.experience)
      .map((exp: any, index: number) => {
        const dateRange = formatDateRange(
          exp.startDate,
          exp.endDate,
          exp.isCurrent,
        );
        return `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${exp.title || ""}</div>
          <div class="entry-date">${dateRange}</div>
        </div>
        <div class="entry-subheader">
          <div>${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}</div>
        </div>
        <div class="entry-content">
          ${exp.description ? renderDescription(exp.description) : ""}
          ${exp.achievements ? `<p><strong>Achievements:</strong> ${exp.achievements}</p>` : ""}
        </div>
      </div>
    `;
      })
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyInternships.length > 0
      ? `
  <div class="section" data-section="internships">
    <div class="section-title">Internships</div>
    ${nonEmptyInternships
      .map((item: any, index: number) => {
        const dateRange =
          item.duration || formatDateRange(item.startDate, item.endDate);
        return `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.title || ""}</div>
          <div class="entry-date">${dateRange}</div>
        </div>
        <div class="entry-subheader">
          <div>${item.company || ""}${item.location ? `, ${item.location}` : ""}</div>
        </div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `;
      })
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyTrainingPrograms.length > 0
      ? `
  <div class="section" data-section="trainingPrograms">
    <div class="section-title">Training Programs</div>
    ${nonEmptyTrainingPrograms
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.name || ""}</div>
          <div class="entry-date">${item.completionDate || item.duration || ""}</div>
        </div>
        <div class="entry-subheader">
          <div>${item.provider || item.organization || ""}</div>
        </div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyAcademicProjects.length > 0
      ? `
  <div class="section" data-section="academicProjects">
    <div class="section-title">Academic Projects</div>
    ${nonEmptyAcademicProjects
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.name || item.title || ""}</div>
          <div class="entry-date">${item.duration || ""}</div>
        </div>
        <div class="entry-subheader">
          <div>${item.institution || ""}${item.course ? ` | ${item.course}` : ""}</div>
        </div>
        <div class="entry-content">
          ${item.description ? renderDescription(item.description) : ""}
          ${item.technologies ? `<p><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(", ") : item.technologies}</p>` : ""}
          ${item.url ? `<p><strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a></p>` : ""}
        </div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    hasNonEmptyItems(data.education)
      ? `
  <div class="section" data-section="education">
    <div class="section-title">Education</div>
    ${getNonEmptyArray(data.education)
      .map(
        (edu: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</div>
          <div class="entry-date">${edu.graduationDate || edu.endDate || ""}</div>
        </div>
        <div class="entry-subheader">
          <div>${edu.school || ""}${edu.location ? `, ${edu.location}` : ""}</div>
        </div>
        ${edu.startDate ? `<div class="entry-content" style="margin-top:-4px;">Start: ${edu.startDate}</div>` : ""}
        ${edu.grade ? `<div class="entry-content" style="margin-top:-4px; margin-bottom:8px; font-weight:500;">Grade: ${edu.grade}</div>` : ""}
        ${edu.description ? `<div class="entry-content">${renderDescription(edu.description)}</div>` : ""}
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyProjects.length > 0
      ? `
  <div class="section" data-section="projects">
    <div class="section-title">Projects</div>
    ${nonEmptyProjects
      .map((project: any, index: number) => {
        const dateRange = formatDateRange(project.startDate, project.endDate);
        return `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${project.name || project.title || ""}</div>
          <div class="entry-date">${dateRange || project.duration || ""}</div>
        </div>
        ${project.role ? `<div class="entry-subheader"><div>Role: ${project.role}</div></div>` : ""}
        ${project.technologies ? `<div class="entry-subheader"><div>Technologies: ${project.technologies}</div></div>` : ""}
        <div class="entry-content">${project.description ? renderDescription(project.description) : ""}</div>
      </div>
    `;
      })
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyCertifications.length > 0
      ? `
  <div class="section" data-section="certifications">
    <div class="section-title">Certifications</div>
    ${nonEmptyCertifications
      .map(
        (cert: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${cert.name || cert.title || cert}</div>
          <div class="entry-date">${cert.date || ""}</div>
        </div>
        ${cert.issuer ? `<div class="entry-subheader"><div>${cert.issuer}</div></div>` : ""}
        ${cert.url ? `<div class="entry-content"><a href="${cert.url}" target="_blank">${cert.url}</a></div>` : ""}
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyLeadershipPositions.length > 0
      ? `
  <div class="section" data-section="leadershipPositions">
    <div class="section-title">Leadership Positions</div>
    ${nonEmptyLeadershipPositions
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.position || item.title || ""}</div>
          <div class="entry-date">${formatDateRange(item.startDate, item.endDate) || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.organization || ""}</div></div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyCoCurricular.length > 0
      ? `
  <div class="section" data-section="coCurricular">
    <div class="section-title">Co-curricular</div>
    ${nonEmptyCoCurricular
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.activity || ""}</div>
          <div class="entry-date">${item.year || ""}</div>
        </div>
        ${item.role ? `<div class="entry-subheader"><div>Role: ${item.role}</div></div>` : ""}
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyExtracurricular.length > 0
      ? `
  <div class="section" data-section="extracurricular">
    <div class="section-title">Extracurricular</div>
    ${nonEmptyExtracurricular
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.activity || ""}</div>
          <div class="entry-date">${item.year || ""}</div>
        </div>
        ${item.role ? `<div class="entry-subheader"><div>Role: ${item.role}</div></div>` : ""}
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyAwards.length > 0
      ? `
  <div class="section" data-section="awards">
    <div class="section-title">Awards</div>
    ${nonEmptyAwards
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.title || ""}</div>
          <div class="entry-date">${item.issueYear || item.year || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.organization || ""}</div></div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyScholarships.length > 0
      ? `
  <div class="section" data-section="scholarships">
    <div class="section-title">Scholarships</div>
    ${nonEmptyScholarships
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.name || ""}</div>
          <div class="entry-date">${item.year || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.provider || item.organization || ""}</div></div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptySpeakingEngagements.length > 0
      ? `
  <div class="section" data-section="speakingEngagements">
    <div class="section-title">Speaking Engagements</div>
    ${nonEmptySpeakingEngagements
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.topic || ""}</div>
          <div class="entry-date">${item.date || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.eventName || ""}</div></div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyMemberships.length > 0
      ? `
  <div class="section" data-section="memberships">
    <div class="section-title">Memberships</div>
    ${nonEmptyMemberships
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.membershipName || ""}</div>
          <div class="entry-date">${item.year || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.organizationName || item.organization || ""}</div></div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyWorkshops.length > 0
      ? `
  <div class="section" data-section="workshops">
    <div class="section-title">Workshops</div>
    ${nonEmptyWorkshops
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.programTitle || item.title || ""}</div>
          <div class="entry-date">${item.year || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.conductedBy || ""}</div></div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyClientProjects.length > 0
      ? `
  <div class="section" data-section="clientProjects">
    <div class="section-title">Client Projects</div>
    ${nonEmptyClientProjects
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.name || ""}</div>
          <div class="entry-date">${item.duration || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.clientOrganization || ""}${item.role ? ` - ${item.role}` : ""}</div></div>
        <div class="entry-content">
          ${item.description ? renderDescription(item.description) : ""}
          ${item.toolsTechnologies ? `<p><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ""}
          ${item.projectUrl ? `<p><strong>URL:</strong> <a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></p>` : ""}
        </div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyPortfolio.length > 0
      ? `
  <div class="section" data-section="portfolio">
    <div class="section-title">Portfolio</div>
    ${nonEmptyPortfolio
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.name || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.type || ""}${item.platform ? ` on ${item.platform}` : ""}</div></div>
        <div class="entry-content">
          ${item.url ? `<p><a href="${item.url}" target="_blank">${item.url}</a></p>` : ""}
          ${item.description || ""}
        </div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyVolunteering.length > 0
      ? `
  <div class="section" data-section="volunteering">
    <div class="section-title">Volunteering</div>
    ${nonEmptyVolunteering
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.role || ""}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.organization || ""}${item.causeArea ? ` - ${item.causeArea}` : ""}</div></div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyMilitaryService.length > 0
      ? `
  <div class="section" data-section="militaryService">
    <div class="section-title">Military Service</div>
    ${nonEmptyMilitaryService
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.branch ? item.branch : ""}${item.rank ? ` - ${item.rank}` : ""}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</div>
        </div>
        ${item.specialization ? `<div class="entry-subheader"><div>${item.specialization}</div></div>` : ""}
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyToolsTechnologies.length > 0
      ? `
  <div class="section" data-section="toolsTechnologies">
    <div class="section-title">Tools & Technologies</div>
    ${nonEmptyToolsTechnologies
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.name || ""}</div>
        </div>
        ${item.category ? `<div class="entry-subheader"><div>Category: ${item.category}</div></div>` : ""}
        <div class="entry-content">
          ${item.proficiency ? `<p><strong>Proficiency:</strong> ${item.proficiency}</p>` : ""}
          ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ""}
        </div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyMethodologies.length > 0
      ? `
  <div class="section" data-section="methodologies">
    <div class="section-title">Methodologies</div>
    ${nonEmptyMethodologies
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.name || ""}</div>
        </div>
        <div class="entry-content">
          ${item.certification ? `<p><strong>Certification:</strong> ${item.certification}</p>` : ""}
          ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ""}
        </div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyIndustryExpertise.length > 0
      ? `
  <div class="section" data-section="industryExpertise">
    <div class="section-title">Industry Expertise</div>
    ${nonEmptyIndustryExpertise
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.industry || ""}</div>
        </div>
        <div class="entry-content">
          ${item.domainArea ? `<p><strong>Domain:</strong> ${item.domainArea}</p>` : ""}
          ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ""}
        </div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyTeachingExperience.length > 0
      ? `
  <div class="section" data-section="teachingExperience">
    <div class="section-title">Teaching Experience</div>
    ${nonEmptyTeachingExperience
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.subjectCourseTaught || item.title || ""}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.institution || ""}</div></div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyMentorshipExperience.length > 0
      ? `
  <div class="section" data-section="mentorshipExperience">
    <div class="section-title">Mentorship Experience</div>
    ${nonEmptyMentorshipExperience
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.mentorshipArea || ""}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.organizationPlatform || ""}${item.menteeLevel ? ` - ${item.menteeLevel}` : ""}</div></div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyResearchGrants.length > 0
      ? `
  <div class="section" data-section="researchGrants">
    <div class="section-title">Research Grants</div>
    ${nonEmptyResearchGrants
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.title || ""}</div>
          <div class="entry-date">${item.year || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.agency || ""}${item.amount ? ` | Amount: ${item.amount}` : ""}</div></div>
        <div class="entry-content">${item.description ? renderDescription(item.description) : ""}</div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyTestScores.length > 0
      ? `
  <div class="section" data-section="testScores">
    <div class="section-title">Test Scores</div>
    ${nonEmptyTestScores
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.testName || ""}</div>
          <div class="entry-date">${item.year || ""}</div>
        </div>
        <div class="entry-content">
          <p><strong>Score:</strong> ${item.score || ""}</p>
          ${item.percentileRank ? `<p><strong>Percentile:</strong> ${item.percentileRank}</p>` : ""}
        </div>
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyPublications.length > 0
      ? `
  <div class="section" data-section="publications">
    <div class="section-title">Publications</div>
    ${nonEmptyPublications
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.title || ""}</div>
          <div class="entry-date">${item.year || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.journalPublisher || ""}${item.publicationType ? ` (${item.publicationType})` : ""}</div></div>
        ${item.urlDoi ? `<div class="entry-content"><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></div>` : ""}
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyPatents.length > 0
      ? `
  <div class="section" data-section="patents">
    <div class="section-title">Patents</div>
    ${nonEmptyPatents
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.title || ""}</div>
          <div class="entry-date">${item.year || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.patentNumber ? `Patent #: ${item.patentNumber}` : ""}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ""}</div></div>
        ${item.status ? `<div class="entry-content"><strong>Status:</strong> ${item.status}</div>` : ""}
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptyReferences.length > 0
      ? `
  <div class="section" data-section="references">
    <div class="section-title">References</div>
    ${nonEmptyReferences
      .map(
        (item: any, index: number) => `
      <div class="entry" data-index="${index}">
        <div class="entry-header">
          <div class="entry-title">${item.name || ""}</div>
        </div>
        <div class="entry-subheader"><div>${item.designationRelationship || ""}${item.organization ? ` at ${item.organization}` : ""}</div></div>
        ${item.contactInformation ? `<div class="entry-content">${item.contactInformation}</div>` : ""}
      </div>
    `,
      )
      .join("")}
  </div>`
      : ""
  }

  ${
    nonEmptySocialProfiles.length > 0
      ? `
  <div class="section" data-section="socialProfiles">
    <div class="section-title">Social Profiles</div>
    <div class="skills-container">
      <div class="skills-column">
        ${nonEmptySocialProfiles
          .map(
            (item: any, index: number) => `
          <div class="skill-item">
            <span class="skill-bullet">&#8226;</span>
            <span class="skill-text">${item.platform || "Profile"}: <a href="${item.url || ""}" target="_blank">${item.url || ""}</a></span>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  </div>`
      : ""
  }

  ${
    nonEmptyHobbies.length > 0
      ? `
  <div class="section" data-section="hobbies">
    <div class="section-title">Hobbies</div>
    <div class="skills-container">
      <div class="skills-column">
        ${nonEmptyHobbies
          .map(
            (hobby: any, index: number) => `
          <div class="skill-item">
            <span class="skill-bullet">&#8226;</span>
            <span class="skill-text">${typeof hobby === "string" ? hobby.trim() : hobby}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  </div>`
      : ""
  }

</div>
</body>
</html>`;
}