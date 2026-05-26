export function buildStellarTemplate(data: any, theme?: any): string {
  const {
    personal = {},
    summary = "",
    careerObjective = "",
    experience = [],
    projects = [],
    education = [],
    internships = [],
    trainingPrograms = [],
    academicProjects = [],
    leadershipPositions = [],
    coCurricular = [],
    extracurricular = [],
    skills = "",
    languages = [],
    hobbies = [],
    certifications = [],
    scholarships = [],
    awards = [],
    speakingEngagements = [],
    memberships = [],
    workshops = [],
    clientProjects = [],
    portfolio = [],
    volunteering = [],
    militaryService = [],
    methodologies = [],
    industryExpertise = [],
    references = [],
    teachingExperience = [],
    mentorshipExperience = [],
    researchGrants = [],
    testScores = [],
    publications = [],
    patents = [],
    toolsTechnologies = [],
    professionalContext = {},
    availabilityWorkAuth = {},
    socialProfiles = []
  } = data;

  // Theme system with defaults
  const defaultTheme = {
    primary: "#004B87",
    background: "#ffffff",
    bodyFont: "Arial, sans-serif",
    text: "#333333",
    textLight: "#666666",
    borderColor: "#004B87"
  };

  const currentTheme = theme || defaultTheme;
  
  // Dynamic font size from user settings
  const userFontSize = data.fontSize || 13;
  const userFontFamily = data.fontFamily || "Arial, sans-serif";
  
  // Typography settings
  const typography = theme?.typography || {
    fontSize: "medium",
    alignment: "left",
    fontWeight: "normal",
  };
  
  const alignmentMap = { left: "left", center: "center", justify: "justify" };
  const fontWeightMap = { normal: "400", bold: "700" };
  
  const currentAlignment = alignmentMap[typography.alignment as keyof typeof alignmentMap] || "left";
  const currentFontWeight = fontWeightMap[typography.fontWeight as keyof typeof fontWeightMap] || "400";

  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.4);
  const sectionTitleFontSize = Math.round(userFontSize * 1.3);
  const smallTextFontSize = Math.round(userFontSize * 0.93);
  const smallTextFontSize2 = Math.round(userFontSize * 0.96);
  const entryTitleFontSize = Math.round(userFontSize * 1.07);

  // Helper functions
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

  const getNonEmptyItems = (arr: any[]): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter(item => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(val => 
          typeof val === "string" && val.trim().length > 0
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
    return parts.join(" - ");
  };

  const renderDescription = (description: string): string => {
    if (!description) return '';
    
    const bulletChar = '&#8226;';

    if (description.includes('<ul>') || description.includes('<li>')) {
      let cleaned = description;
      cleaned = cleaned.replace(/<li>(.*?)<\/li>/gs, (match, content) => {
        return `<li><div class="bullet-wrap"><div class="bullet-circle">${bulletChar}</div></div><div class="li-text">${content}</div></li>`;
      });
      return `<div class="description-html">${cleaned}</div>`;
    }
    const lines = description.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
      
    if (lines.length === 0) return '';
    return `
      <div class="custom-list-container" style="margin-top: 5px; margin-left: 5px;">
        ${lines.map(line => `
          <div class="custom-list-item" style="display: table; width: 100%; margin-bottom: 6px; font-size: ${smallTextFontSize2}px; line-height: 1.4; color: ${currentTheme.textLight};">
            <div style="display: table-cell; width: 22px; vertical-align: top; padding-top: 0; font-family: 'Arial', sans-serif; font-size: 16px; text-align: center;">${bulletChar}</div>
            <div style="display: table-cell; vertical-align: top; padding-left: 2px;">${line.trim()}</div>
          </div>
        `).join('')}
      </div>
    `;
  };

  const getSkillsArray = (skills: any): string[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.filter(s => s && (typeof s === "string" ? s.trim() : s));
    if (typeof skills === "string") {
      if (skills.includes('<ul>')) {
        const matches = skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          return matches.map(m => m.replace(/<\/?li>/g, '').trim()).filter(s => s);
        }
      }
      return skills.split(",").map(s => s.trim()).filter(s => s);
    }
    return [];
  };

  const skillsArray = getSkillsArray(skills);
  const nonEmptyExperience = getNonEmptyItems(experience);
  const nonEmptyEducation = getNonEmptyItems(education);
  const nonEmptyInternships = getNonEmptyItems(internships);
  const nonEmptyTrainingPrograms = getNonEmptyItems(trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyItems(academicProjects);
  const nonEmptyLeadershipPositions = getNonEmptyItems(leadershipPositions);
  const nonEmptyCoCurricular = getNonEmptyItems(coCurricular);
  const nonEmptyExtracurricular = getNonEmptyItems(extracurricular);
  const nonEmptyLanguages = getNonEmptyItems(languages);
  const nonEmptyCertifications = getNonEmptyItems(certifications);
  const nonEmptyScholarships = getNonEmptyItems(scholarships);
  const nonEmptyAwards = getNonEmptyItems(awards);
  const nonEmptySpeakingEngagements = getNonEmptyItems(speakingEngagements);
  const nonEmptyMemberships = getNonEmptyItems(memberships);
  const nonEmptyWorkshops = getNonEmptyItems(workshops);
  const nonEmptyClientProjects = getNonEmptyItems(clientProjects);
  const nonEmptyPortfolio = getNonEmptyItems(portfolio);
  const nonEmptyVolunteering = getNonEmptyItems(volunteering);
  const nonEmptyMilitaryService = getNonEmptyItems(militaryService);
  const nonEmptyMethodologies = getNonEmptyItems(methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyItems(industryExpertise);
  const nonEmptyReferences = getNonEmptyItems(references);
  const nonEmptyTeachingExperience = getNonEmptyItems(teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyItems(mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyItems(researchGrants);
  const nonEmptyTestScores = getNonEmptyItems(testScores);
  const nonEmptyPublications = getNonEmptyItems(publications);
  const nonEmptyPatents = getNonEmptyItems(patents);
  const nonEmptyToolsTechnologies = getNonEmptyItems(toolsTechnologies);
  const nonEmptySocialProfiles = getNonEmptyItems(socialProfiles);
  const nonEmptyHobbies = getNonEmptyItems(hobbies);
  const nonEmptyProjects = getNonEmptyItems(projects);

  // SVG Icons
  const icons = {
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${userFontFamily};
      color: ${currentTheme.text};
      padding: 40px 0;
      font-size: ${baseFontSize}px;
      font-weight: ${currentFontWeight};
      text-align: ${currentAlignment};
      -webkit-font-smoothing: antialiased;
      
    }

    /* A4 Paper Size */
    .container {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: ${currentTheme.background};
      padding: 15mm 12mm;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      position: relative;
    }

    @media print {
      body {
        padding: 0;
        background: white;
      }
      .container {
        box-shadow: none;
        padding: 0;
        width: 100%;
        min-height: auto;
      }
    }

    .header-block {
      text-align: center;
      margin-bottom: 20px;
    }

    .name-heading {
      font-size: ${headingFontSize}px;
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 15px;
      letter-spacing: -0.5px;
    }

    .contact-strip {
      background-color: ${currentTheme.primary}33;
      padding: 8px 12px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 12px;
      font-size: ${baseFontSize - 1}px;
      color: #222222;
      border-radius: 6px;
    }

    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .contact-item svg {
      stroke: #222222;
    }

    .contact-item a {
      color: #222222;
      text-decoration: none;
    }

    .contact-item a:hover {
      text-decoration: underline;
    }

    .cv-section {
      margin-top: 20px;
    }

    .cv-section-title {
      font-size: ${sectionTitleFontSize}px;
      font-weight: 700;
      color: ${currentTheme.primary};
      padding-bottom: 3px;
      border-bottom: 2px solid ${currentTheme.borderColor};
      margin-bottom: 12px;
      text-transform: uppercase;
    }

    .summary-paragraph {
      color: ${currentTheme.textLight};
      text-align: justify;
      font-size: ${baseFontSize}px;
      line-height: 1.45;
    }

    .skills-flex-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 10px;
    }

    .skill-pill {
      display: inline-block;
      border: 1px solid #777777;
      color: ${currentTheme.text};
      padding: 4px 12px;
      border-radius: 8px;
      font-size: ${baseFontSize - 1}px;
      font-weight: 500;
      background: #ffffff;
    }

    .timeline-entry {
      margin-bottom: 16px;
      position: relative;
    }

    .entry-row-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: 700;
      color: #111111;
      font-size: ${baseFontSize + 1}px;
    }

    .entry-row-subhead {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-size: ${baseFontSize}px;
      color: ${currentTheme.textLight};
      margin-top: 2px;
      margin-bottom: 4px;
    }

    .institution-name {
      font-weight: 700;
    }

    .location-span {
      font-style: italic;
      color: #666666;
      font-size: ${baseFontSize - 1}px;
    }

    .date-badge {
      background-color: ${currentTheme.primary};
      color: #ffffff;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: ${baseFontSize - 2}px;
      font-weight: 600;
      white-space: nowrap;
    }

    .bullets-container {
      margin-top: 4px;
      padding-left: 18px;
    }

    .bullets-container li {
      margin-bottom: 3px;
      color: ${currentTheme.textLight};
      font-size: ${baseFontSize}px;
    }

    .context-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .context-item {
      font-size: ${smallTextFontSize}px;
      color: ${currentTheme.textLight};
    }
    
    .context-label {
      font-weight: 800;
      color: ${currentTheme.text};
    }

    a {
      color: ${currentTheme.primary};
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }

    .description-html ul {
      list-style: none;
      margin-left: 0;
    }
    
    .description-html li {
      display: table;
      width: 100%;
      margin-bottom: 4px;
      color: ${currentTheme.textLight};
      font-size: ${smallTextFontSize2}px;
      line-height: 1.4;
    }
    
    .description-html li .bullet-wrap {
      display: table-cell;
      width: 20px;
      vertical-align: top;
    }
    
    .description-html li .li-text {
      display: table-cell;
      vertical-align: top;
    }

    /*  divider - only under summary section */
.divider {
  width: 100%;
  height: 2px;
  background: ${currentTheme.primary};
  margin-bottom: 12px;
}
  

  </style>
</head>
<body>
  <div class="container">
    
    <!-- Personal Section -->
    <div class="header-block" data-section="personal">
      <h1 class="name-heading">${personal?.name || "Robert Williams"}</h1>
      
      <div class="contact-strip">
        ${personal?.phone ? `<div class="contact-item">${icons.phone}<span>${personal.phone}</span></div>` : ""}
        ${personal?.email ? `<div class="contact-item">${icons.email}<a href="mailto:${personal.email}">${personal.email}</a></div>` : ""}
        ${(() => {
          const loc = [personal?.location, personal?.country].filter(Boolean).join(", ");
          return loc ? `<div class="contact-item">${icons.location}<span>${loc}</span></div>` : "";
        })()}
        ${personal?.dob ? `<div class="contact-item">${icons.calendar}<span>${personal.dob}</span></div>` : ""}
        ${personal?.gender ? `<div class="contact-item">${icons.user}<span>${personal.gender}</span></div>` : ""}
      </div>
    </div>

    <!-- Availability Section -->
    ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Availability</h2>
        <div class="divider"></div>
        <div class="context-grid">
          ${availabilityWorkAuth.availabilityNoticePeriod ? `<div class="context-item"><span class="context-label">Notice Period:</span> ${availabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
          ${availabilityWorkAuth.workAuthorizationStatus ? `<div class="context-item"><span class="context-label">Work Auth:</span> ${availabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
          ${availabilityWorkAuth.preferredLocation ? `<div class="context-item"><span class="context-label">Preferred Location:</span> ${availabilityWorkAuth.preferredLocation}</div>` : ''}
        </div>
      </div>
    ` : ""}

    
    <!-- Career Objective Section -->
    ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
      <div class="cv-section" data-section="careerObjective">
        <h2 class="cv-section-title">Career Objective</h2>
        <div class="divider"></div>
        <p class="summary-paragraph">${careerObjective}</p>
      </div>
    ` : ""}

    <!-- Professional Summary Section -->
    ${summary && summary.trim() ? `
      <div class="cv-section" data-section="summary">
        <h2 class="cv-section-title">Professional Summary</h2>
        <div class="divider"></div>
        <p class="summary-paragraph">${summary}</p>
      </div>
    ` : ""}

    <!-- Skills Section -->
    ${skillsArray.length > 0 ? `
      <div class="cv-section" data-section="skills">
        <h2 class="cv-section-title">Skills</h2>
        <div class="divider"></div>
        <div class="skills-flex-wrap">
          ${skillsArray.map(skill => `<span class="skill-pill">${skill}</span>`).join("")}
        </div>
      </div>
    ` : ""}

    <!-- Tools & Technologies Section -->
    ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Tools & Technologies</h2>
        <div class="divider"></div>
        ${nonEmptyToolsTechnologies.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="toolsTechnologies" data-index="${idx}">
            <div class="entry-row-header"><span>${item.name || ''}</span></div>
            ${item.category ? `<div class="entry-row-subhead">Category: ${item.category}</div>` : ''}
            ${item.proficiency ? `<div class="entry-row-subhead">Proficiency: ${item.proficiency}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Languages Section -->
    ${nonEmptyLanguages.length > 0 ? `
      <div class="cv-section" data-section="languages">
        <h2 class="cv-section-title">Languages</h2>
        <div class="divider"></div>
        <div class="skills-flex-wrap">
          ${nonEmptyLanguages.map((lang: any) => `<span class="skill-pill">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}</span>`).join('')}
        </div>
      </div>
    ` : ""}

    <!-- Certifications Section -->
    ${nonEmptyCertifications.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Certifications</h2>
        <div class="divider"></div>
        ${nonEmptyCertifications.map((cert: any, idx: number) => `
          <div class="timeline-entry" data-section="certifications" data-index="${idx}">
            <div class="entry-row-header">
              <span>${cert.name || ''}</span>
              ${cert.date ? `<span class="date-badge">${cert.date}</span>` : ''}
            </div>
            ${cert.issuer ? `<div class="entry-row-subhead">${cert.issuer}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Education Section -->
    ${nonEmptyEducation.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Education</h2>
        <div class="divider"></div>
        ${nonEmptyEducation.map((edu: any, idx: number) => {
          const dateParts = [edu.startDate, edu.graduationDate || edu.endDate].filter(Boolean);
          const dateRange = dateParts.join(" - ");
          return `
            <div class="timeline-entry" data-section="education" data-index="${idx}">
              <div class="entry-row-header">
                <span class="institution-name">${edu.school || ""}</span>
                ${dateRange ? `<span class="date-badge">${dateRange}</span>` : ""}
              </div>
              <div class="entry-row-subhead">
                <span>${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}${edu.grade ? `, ${edu.grade}` : ""}</span>
                ${edu.location ? `<span class="location-span">${edu.location}</span>` : ""}
              </div>
              ${edu.description ? `<div class="bullets-container"><p>${edu.description}</p></div>` : ""}
            </div>
          `;
        }).join('')}
      </div>
    ` : ""}

    <!-- Experience Section -->
    ${nonEmptyExperience.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Experience</h2>
        <div class="divider"></div>
        ${nonEmptyExperience.map((exp: any, idx: number) => {
          const dateParts = [exp.startDate, exp.isCurrent ? "Present" : exp.endDate].filter(Boolean);
          return `
            <div class="timeline-entry" data-section="experience" data-index="${idx}">
              <div class="entry-row-header">
                <span>${exp.company || ""}</span>
                <span class="date-badge">${dateParts.join(" - ")}</span>
              </div>
              <div class="entry-row-subhead">
                <span style="font-weight: 600;">${exp.title || ""}</span>
                ${exp.location ? `<span class="location-span">${exp.location}</span>` : ""}
              </div>
              ${exp.description ? renderDescription(exp.description) : ""}
              ${exp.achievements ? `<div class="bullets-container"><p><strong>Achievements:</strong> ${exp.achievements}</p></div>` : ""}
            </div>
          `;
        }).join('')}
      </div>
    ` : ""}

    <!-- Projects Section -->
    ${nonEmptyProjects.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Projects</h2>
        <div class="divider"></div>
        ${nonEmptyProjects.map((project: any, idx: number) => `
          <div class="timeline-entry" data-section="projects" data-index="${idx}">
            <div class="entry-row-header">
              <span>${project.name || project.title || ''}</span>
              ${project.duration ? `<span class="date-badge">${project.duration}</span>` : ''}
            </div>
            ${project.role ? `<div class="entry-row-subhead">Role: ${project.role}</div>` : ''}
            ${project.description ? renderDescription(project.description) : ''}
            ${project.technologies ? `<div class="entry-row-subhead">Technologies: ${project.technologies}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Internships Section -->
    ${nonEmptyInternships.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Internships</h2>
        <div class="divider"></div>
        ${nonEmptyInternships.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="internships" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.company || ''}</span>
              <span class="date-badge">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="entry-row-subhead">${item.title || ''}</div>
            ${item.description ? renderDescription(item.description) : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Training Programs Section -->
    ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Training Programs</h2>
        <div class="divider"></div>
        ${nonEmptyTrainingPrograms.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="trainingPrograms" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.name || ''}</span>
              ${item.completionDate ? `<span class="date-badge">${item.completionDate}</span>` : ''}
            </div>
            <div class="entry-row-subhead">${item.provider || item.organization || ''}</div>
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Academic Projects Section -->
    ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Academic Projects</h2>
        <div class="divider"></div>
        ${nonEmptyAcademicProjects.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="academicProjects" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.name || item.title || ''}</span>
              ${item.duration ? `<span class="date-badge">${item.duration}</span>` : ''}
            </div>
            <div class="entry-row-subhead">${item.institution || ''}</div>
            ${item.description ? renderDescription(item.description) : ''}
            ${item.technologies ? `<div class="entry-row-subhead">Technologies: ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Leadership Positions Section -->
    ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Leadership Positions</h2>
        <div class="divider"></div>
        ${nonEmptyLeadershipPositions.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="leadershipPositions" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.position || item.title || ''}</span>
              <span class="date-badge">${formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="entry-row-subhead">${item.organization || ''}</div>
            ${item.description ? renderDescription(item.description) : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Co-curricular Section -->
    ${nonEmptyCoCurricular.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Co-curricular Activities</h2>
        <div class="divider"></div>
        ${nonEmptyCoCurricular.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="coCurricular" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.activity || ''}</span>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ''}
            </div>
            ${item.role ? `<div class="entry-row-subhead">Role: ${item.role}</div>` : ''}
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Extracurricular Section -->
    ${nonEmptyExtracurricular.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Extracurricular Activities</h2>
        <div class="divider"></div>
        ${nonEmptyExtracurricular.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="extracurricular" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.activity || ''}</span>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ''}
            </div>
            ${item.role ? `<div class="entry-row-subhead">Role: ${item.role}</div>` : ''}
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Scholarships Section -->
    ${nonEmptyScholarships.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Scholarships</h2>
        <div class="divider"></div>
        ${nonEmptyScholarships.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="scholarships" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.name || ''}</span>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ''}
            </div>
            <div class="entry-row-subhead">${item.provider || item.organization || ''}</div>
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Awards Section -->
    ${nonEmptyAwards.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Awards</h2>
        <div class="divider"></div>
        ${nonEmptyAwards.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="awards" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.title || ''}</span>
              ${item.issueYear || item.year ? `<span class="date-badge">${item.issueYear || item.year}</span>` : ''}
            </div>
            <div class="entry-row-subhead">${item.organization || ''}</div>
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Speaking Engagements Section -->
    ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Speaking Engagements</h2>
        <div class="divider"></div>
        ${nonEmptySpeakingEngagements.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="speakingEngagements" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.topic || ''}</span>
              ${item.date ? `<span class="date-badge">${item.date}</span>` : ''}
            </div>
            <div class="entry-row-subhead">${item.eventName || ''}</div>
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Memberships Section -->
    ${nonEmptyMemberships.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Memberships</h2>
        <div class="divider"></div>
        ${nonEmptyMemberships.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="memberships" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.membershipName || ''}</span>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ''}
            </div>
            <div class="entry-row-subhead">${item.organizationName || item.organization || ''}</div>
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Workshops Section -->
    ${nonEmptyWorkshops.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Workshops</h2>
        <div class="divider"></div>
        ${nonEmptyWorkshops.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="workshops" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.programTitle || item.title || ''}</span>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ''}
            </div>
            <div class="entry-row-subhead">${item.conductedBy || ''}</div>
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Client Projects Section -->
    ${nonEmptyClientProjects.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Client Projects</h2>
        <div class="divider"></div>
        ${nonEmptyClientProjects.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="clientProjects" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.name || ''}</span>
              ${item.duration ? `<span class="date-badge">${item.duration}</span>` : ''}
            </div>
            <div class="entry-row-subhead">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</div>
            ${item.description ? renderDescription(item.description) : ''}
            ${item.toolsTechnologies ? `<div class="entry-row-subhead">Tools: ${item.toolsTechnologies}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Portfolio Section -->
    ${nonEmptyPortfolio.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Portfolio</h2>
        <div class="divider"></div>
        ${nonEmptyPortfolio.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="portfolio" data-index="${idx}">
            <div class="entry-row-header"><span>${item.name || ''}</span></div>
            <div class="entry-row-subhead">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</div>
            ${item.url ? `<div class="entry-row-subhead"><a href="${item.url}" target="_blank">${item.url}</a></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Volunteering Section -->
    ${nonEmptyVolunteering.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Volunteering</h2>
        <div class="divider"></div>
        ${nonEmptyVolunteering.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="volunteering" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.role || ''}</span>
              <span class="date-badge">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="entry-row-subhead">${item.organization || ''}</div>
            ${item.description ? renderDescription(item.description) : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Military Service Section -->
    ${nonEmptyMilitaryService.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Military Service</h2>
        <div class="divider"></div>
        ${nonEmptyMilitaryService.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="militaryService" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</span>
              <span class="date-badge">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            ${item.specialization ? `<div class="entry-row-subhead">Specialization: ${item.specialization}</div>` : ''}
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Methodologies Section -->
    ${nonEmptyMethodologies.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Methodologies</h2>
        <div class="divider"></div>
        ${nonEmptyMethodologies.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="methodologies" data-index="${idx}">
            <div class="entry-row-header"><span>${item.name || ''}</span></div>
            ${item.certification ? `<div class="entry-row-subhead">Certification: ${item.certification}</div>` : ''}
            ${item.experienceDuration ? `<div class="entry-row-subhead">Experience: ${item.experienceDuration}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Industry Expertise Section -->
    ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Industry Expertise</h2>
        <div class="divider"></div>
        ${nonEmptyIndustryExpertise.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="industryExpertise" data-index="${idx}">
            <div class="entry-row-header"><span>${item.industry || ''}</span></div>
            ${item.domainArea ? `<div class="entry-row-subhead">Domain: ${item.domainArea}</div>` : ''}
            ${item.experienceDuration ? `<div class="entry-row-subhead">Experience: ${item.experienceDuration}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Teaching Experience Section -->
    ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Teaching Experience</h2>
        <div class="divider"></div>
        ${nonEmptyTeachingExperience.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="teachingExperience" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.subjectCourseTaught || item.title || ''}</span>
              <span class="date-badge">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="entry-row-subhead">${item.institution || ''}</div>
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Mentorship Experience Section -->
    ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Mentorship Experience</h2>
        <div class="divider"></div>
        ${nonEmptyMentorshipExperience.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="mentorshipExperience" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.mentorshipArea || ''}</span>
              <span class="date-badge">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="entry-row-subhead">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</div>
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Research Grants Section -->
    ${nonEmptyResearchGrants.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Research Grants</h2>
        <div class="divider"></div>
        ${nonEmptyResearchGrants.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="researchGrants" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.title || ''}</span>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ''}
            </div>
            <div class="entry-row-subhead">${item.agency || ''}${item.amount ? ` | Amount: ${item.amount}` : ''}</div>
            ${item.description ? `<div class="bullets-container"><p>${item.description}</p></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Test Scores Section -->
    ${nonEmptyTestScores.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Test Scores</h2>
        <div class="divider"></div>
        ${nonEmptyTestScores.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="testScores" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.testName || ''}</span>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ''}
            </div>
            <div class="entry-row-subhead">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Publications Section -->
    ${nonEmptyPublications.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Publications</h2>
        <div class="divider"></div>
        ${nonEmptyPublications.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="publications" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.title || ''}</span>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ''}
            </div>
            <div class="entry-row-subhead">${item.journalPublisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</div>
            ${item.urlDoi ? `<div class="entry-row-subhead"><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Patents Section -->
    ${nonEmptyPatents.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Patents</h2>
        <div class="divider"></div>
        ${nonEmptyPatents.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="patents" data-index="${idx}">
            <div class="entry-row-header">
              <span>${item.title || ''}</span>
              ${item.year ? `<span class="date-badge">${item.year}</span>` : ''}
            </div>
            <div class="entry-row-subhead">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</div>
            ${item.status ? `<div class="entry-row-subhead">Status: ${item.status}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- References Section -->
    ${nonEmptyReferences.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">References</h2>
        <div class="divider"></div>
        ${nonEmptyReferences.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="references" data-index="${idx}">
            <div class="entry-row-header"><span>${item.name || ''}</span></div>
            <div class="entry-row-subhead">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</div>
            ${item.contactInformation ? `<div class="entry-row-subhead">${item.contactInformation}</div>` : ''}
          </div>
        `).join('')}
      </div>
    ` : ""}

    <!-- Hobbies Section -->
    ${nonEmptyHobbies.length > 0 ? `
      <div class="cv-section" data-section="hobbies">
        <h2 class="cv-section-title">Hobbies & Interests</h2>
        <div class="divider"></div>
        <div class="skills-flex-wrap">
          ${nonEmptyHobbies.map((hobby: any) => `<span class="skill-pill">${typeof hobby === "string" ? hobby.trim() : hobby}</span>`).join('')}
        </div>
      </div>
    ` : ""}

    <!-- Social Profiles Section -->
    ${nonEmptySocialProfiles.length > 0 ? `
      <div class="cv-section">
        <h2 class="cv-section-title">Social Profiles</h2>
        <div class="divider"></div>
        ${nonEmptySocialProfiles.map((item: any, idx: number) => `
          <div class="timeline-entry" data-section="socialProfiles" data-index="${idx}">
            <div class="entry-row-header"><span>${item.platform || 'Profile'}</span></div>
            <div class="entry-row-subhead"><a href="${item.url || ''}" target="_blank">${item.url || ''}</a></div>
          </div>
        `).join('')}
      </div>
    ` : ""}

  </div>
</body>
</html>`;
}