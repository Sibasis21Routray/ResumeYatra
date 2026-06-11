export function buildPhotoMinimalTemplate(data: any, theme?: any): string {
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
    coreCompetencies = "",
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
    availabilityWorkAuth = {},
    socialProfiles = []
  } = data;

  const defaultTheme = {
    primary: "#005F5F",
    secondary: "#555555",
    background: "#ffffff",
    headingFont: "sans-serif",
    bodyFont: "sans-serif",
  };

  const currentTheme = { ...defaultTheme, ...(theme || {}) };

  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14;
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || "'Helvetica Neue', Helvetica, Arial, sans-serif";

  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.25);
  const subheadingFontSize = Math.round(userFontSize * 1.125);

  const hasNonEmptyItems = (arr: any[]): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    return arr.some(item => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(val => typeof val === "string" && val.trim().length > 0);
      }
      return false;
    });
  };

  const getNonEmptyArray = (arr: any): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter((item: any) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some((val: any) => typeof val === "string" && val.trim().length > 0);
      }
      return false;
    });
  };

  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => val !== null && val !== undefined && val !== "");
  };

  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(", ");
  };

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" – ");
  };

  const renderDescription = (description: string): string => {
    if (!description) return '';
    if (description.includes('<ul>') || description.includes('<li>') || description.includes('<div>')) {
      return `<div class="description-html">${description}</div>`;
    }
    const lines = description.split('\n').filter(line => line.trim());
    if (lines.length === 0) return '';
    return `
      <ul class="bullet-list">
        ${lines.map(line => `<li>${line.trim()}</li>`).join('')}
      </ul>
    `;
  };

  const parseSkills = (): any[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.filter((s: any) => s && (typeof s === "string" ? s.trim() : s));
    if (typeof skills === 'string') {
      if (skills.includes('<ul>')) {
        const matches = skills.match(/<li>(.*?)<\/li>/g);
        if (matches) return matches.map(m => m.replace(/<\/?li>/g, '').trim());
      }
      return skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const parseCoreCompetencies = (): any[] => {
    if (!coreCompetencies) return [];
    if (Array.isArray(coreCompetencies)) return coreCompetencies.filter((c: any) => c && (typeof c === "string" ? c.trim() : c));
    if (typeof coreCompetencies === 'string') {
      if (coreCompetencies.includes('<ul>')) {
        const matches = coreCompetencies.match(/<li>(.*?)<\/li>/g);
        if (matches) return matches.map(m => m.replace(/<\/?li>/g, '').trim());
      }
      return coreCompetencies.split(',').map((c: string) => c.trim()).filter(Boolean);
    }
    return [];
  };

  const skillsArray = parseSkills();
  const coreCompetenciesArray = parseCoreCompetencies();
  const nonEmptyExperience = getNonEmptyArray(experience);
  const nonEmptyEducation = getNonEmptyArray(education);
  const nonEmptyProjects = getNonEmptyArray(projects);
  const nonEmptyInternships = getNonEmptyArray(internships);
  const nonEmptyTrainingPrograms = getNonEmptyArray(trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyArray(academicProjects);
  const nonEmptyLeadershipPositions = getNonEmptyArray(leadershipPositions);
  const nonEmptyCoCurricular = getNonEmptyArray(coCurricular);
  const nonEmptyExtracurricular = getNonEmptyArray(extracurricular);
  const nonEmptyLanguages = getNonEmptyArray(languages);
  const nonEmptyCertifications = getNonEmptyArray(certifications);
  const nonEmptyScholarships = getNonEmptyArray(scholarships);
  const nonEmptyAwards = getNonEmptyArray(awards);
  const nonEmptySpeakingEngagements = getNonEmptyArray(speakingEngagements);
  const nonEmptyMemberships = getNonEmptyArray(memberships);
  const nonEmptyWorkshops = getNonEmptyArray(workshops);
  const nonEmptyClientProjects = getNonEmptyArray(clientProjects);
  const nonEmptyPortfolio = getNonEmptyArray(portfolio);
  const nonEmptyVolunteering = getNonEmptyArray(volunteering);
  const nonEmptyMilitaryService = getNonEmptyArray(militaryService);
  const nonEmptyMethodologies = getNonEmptyArray(methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyArray(industryExpertise);
  const nonEmptyReferences = getNonEmptyArray(references);
  const nonEmptyTeachingExperience = getNonEmptyArray(teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyArray(mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyArray(researchGrants);
  const nonEmptyTestScores = getNonEmptyArray(testScores);
  const nonEmptyPublications = getNonEmptyArray(publications);
  const nonEmptyPatents = getNonEmptyArray(patents);
  const nonEmptyToolsTechnologies = getNonEmptyArray(toolsTechnologies);
  const nonEmptySocialProfiles = getNonEmptyArray(socialProfiles);
  const nonEmptyHobbies = getNonEmptyArray(hobbies);

  const defaultAvatarSvg = `<svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="70" cy="70" r="68" fill="${currentTheme.primary}" stroke="${currentTheme.primary}" stroke-width="4"/>
    <circle cx="70" cy="55" r="20" fill="white" opacity="0.9"/>
    <path d="M70 80 C50 80 35 95 35 115 L105 115 C105 95 90 80 70 80Z" fill="white" opacity="0.9"/>
  </svg>`;

  const profileImage = personal.image || personal.photo || personal.avatar || null;

  // SVG Icons (replacing Font Awesome)
  const svgIcons = {
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${currentTheme.primary}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`
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
     color: #333333;
     line-height: 1.5;
     background: #ffffff;
     font-size: ${baseFontSize}px;
     padding: 50px 45px;
   }
   
   .container {
     max-width: 820px;
     margin: 0 auto;
     background: #ffffff;
   }

   .header-wrapper {
     display: flex;
     align-items: center;
     gap: 30px;
     margin-bottom: 25px;
   }

   .avatar-box {
     flex-shrink: 0;
     width: 140px;
     height: 140px;
     border-radius: 50%;
     overflow: hidden;
     border: 2px solid ${currentTheme.primary};
     background: #f0f0f0;
     display: flex;
     align-items: center;
     justify-content: center;
   }

   .avatar-box img {
     width: 100%;
     height: 100%;
     object-fit: cover;
   }

   .avatar-box svg {
     width: 100%;
     height: 100%;
   }

   .header-info {
     flex-grow: 1;
   }

   .name {
     font-size: ${headingFontSize}px;
     font-weight: 700;
     color: ${currentTheme.primary};
     letter-spacing: 0.5px;
     text-transform: uppercase;
     line-height: 1.1;
     margin-bottom: 8px;
   }

   .role {
     font-size: ${Math.round(baseFontSize * 1.25)}px;
     font-weight: 600;
     color: ${currentTheme.primary};
     text-transform: uppercase;
     letter-spacing: 1px;
     padding-bottom: 12px;
   }

   .header-line {
     border: none;
     border-top: 1px solid ${currentTheme.primary};
     margin-bottom: 15px;
     width: 100%;
   }

   .contact-grid {
     display: grid;
     grid-template-columns: 1fr 1.1fr;
     row-gap: 12px;
     column-gap: 20px;
     padding-left: 5px;
   }

   .contact-item {
     display: flex;
     align-items: center;
     font-size: ${Math.round(baseFontSize * 0.95)}px;
     color: #222222;
   }

   .contact-item a {
     color: #222222;
     text-decoration: none;
   }

   .contact-icon {
     width: 18px;
     height: 18px;
     display: inline-flex;
     align-items: center;
     justify-content: center;
     margin-right: 8px;
   }

   .section {
     margin-top: 35px;
     margin-bottom: 10px;
   }

   .section-title-container {
     position: relative;
     margin-bottom: 18px;
     display: inline-block;
     width: 100%;
   }

   .section-title {
     font-size: ${Math.round(subheadingFontSize * 1.15)}px;
     font-weight: 700;
     color: ${currentTheme.primary};
     text-transform: uppercase;
     letter-spacing: 0.5px;
     display: inline-block;
     position: relative;
     padding-bottom: 6px;
     width: 100%;
   }

   .section-title::after {
     content: "";
     position: absolute;
     left: 0;
     bottom: 0;
     height: 3px;
     width: 12%;
     background-color: ${currentTheme.primary};
   }

   .summary-text {
     font-size: ${Math.round(baseFontSize * 1.0)}px;
     color: #222222;
     line-height: 1.5;
     text-align: justify;
   }

   .entry {
     margin-bottom: 25px;
     page-break-inside: avoid;
   }

   .entry-header {
     display: flex;
     justify-content: space-between;
     align-items: baseline;
     margin-bottom: 4px;
   }

   .entry-title {
     font-weight: 700;
     font-size: ${Math.round(baseFontSize * 1.15)}px;
     color: ${currentTheme.primary};
   }

   .entry-date {
     font-size: ${Math.round(baseFontSize * 0.95)}px;
     color: #222222;
     font-weight: 500;
     white-space: nowrap;
   }

   .entry-subtitle {
     color: #222222;
     font-size: ${Math.round(baseFontSize * 1.0)}px;
     margin-bottom: 10px;
     font-weight: 400;
   }

   .entry-content ul, .bullet-list {
     margin-left: 16px;
     list-style-type: disc;
   }

   .entry-content li, .bullet-list li {
     margin-bottom: 6px;
     color: #222222;
     font-size: ${Math.round(baseFontSize * 0.98)}px;
     line-height: 1.5;
   }

   .skills-list {
     display: flex;
     flex-wrap: wrap;
     gap: 8px;
     margin-top: 10px;
   }

   .skill-tag {
     background: #f0f0f0;
     padding: 4px 12px;
     border-radius: 4px;
     font-size: ${Math.round(baseFontSize * 0.9)}px;
     color: #555555;
   }

   @media print {
     body { padding: 0; }
     .section-title::after { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
   }
 </style>
</head>
<body>
<div class="container">
  
  <!-- HEADER SECTION -->
  <div class="header-wrapper" id="section-header" data-section="header">
    <div class="avatar-box">
      ${profileImage ? `<img src="${profileImage}" alt="Profile">` : defaultAvatarSvg}
    </div>
    
    <div class="header-info">
      <div class="name">${personal.name || "Your Name "}</div>
     ${
  personal.role &&
  personal.role !== "undefined" &&
  personal.role !== "null"
    ? `<div class="role">${personal.role}</div>`
    : ""
}
      
      <hr class="header-line" />

      <div class="contact-grid">
        ${personal.phone ? `<div class="contact-item"><span class="contact-icon">${svgIcons.phone}</span><span>${personal.phone}</span></div>` : ""}
        ${personal.alternatePhone ? `<div class="contact-item"><span class="contact-icon">${svgIcons.phone}</span><span>${personal.alternatePhone} (Alt)</span></div>` : ""}
        ${personal.email ? `<div class="contact-item"><span class="contact-icon">${svgIcons.email}</span><span><a href="mailto:${personal.email}">${personal.email}</a></span></div>` : ""}
        ${(() => {
          const addressParts = [personal.fullAddress, personal.location, personal.country, personal.pinCode].filter(Boolean);
          return addressParts.length > 0 ? `<div class="contact-item"><span class="contact-icon">${svgIcons.location}</span><span>${addressParts.join(", ")}</span></div>` : "";
        })()}
        ${personal.linkedinUrl ? `<div class="contact-item"><span class="contact-icon">${svgIcons.linkedin}</span><span><a href="${personal.linkedinUrl}" target="_blank">${personal.linkedinUrl.replace(/https?:\/\/(www\.)?/, "")}</a></span></div>` : ""}
        ${personal.dob ? `<div class="contact-item"><span class="contact-icon">${svgIcons.calendar}</span><span>DOB: ${personal.dob}</span></div>` : ""}
        ${personal.gender ? `<div class="contact-item"><span class="contact-icon">${svgIcons.user}</span><span>${personal.gender}</span></div>` : ""}
        ${personal.maritalStatus ? `<div class="contact-item"><span class="contact-icon">${svgIcons.heart}</span><span>${personal.maritalStatus}</span></div>` : ""}
      </div>
    </div>
  </div>

  <!-- AVAILABILITY & WORK AUTH SECTION -->
  ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
  <div class="section" id="section-availability" data-section="availability">
    <div class="section-title-container">
      <div class="section-title">Availability & Work Authorization</div>
    </div>
    <div class="skills-list">
      ${availabilityWorkAuth.availabilityNoticePeriod ? `<span class="skill-tag">Notice: ${availabilityWorkAuth.availabilityNoticePeriod}</span>` : ''}
      ${availabilityWorkAuth.workAuthorizationStatus ? `<span class="skill-tag">Work Auth: ${availabilityWorkAuth.workAuthorizationStatus}</span>` : ''}
      ${availabilityWorkAuth.preferredLocation ? `<span class="skill-tag">Preferred: ${availabilityWorkAuth.preferredLocation}</span>` : ''}
    </div>
  </div>` : ""}

  

  <!-- SUMMARY SECTION - Priority over Career Objective -->
  ${summary && summary.trim() ? `
  <div class="section" id="section-summary" data-section="summary">
    <div class="section-title-container">
      <div class="section-title">Professional Summary</div>
    </div>
    <p class="summary-text">${summary}</p>
  </div>` : ""}

  <!-- CAREER OBJECTIVE SECTION - Only shown if Summary is empty -->
  ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
  <div class="section" id="section-careerObjective" data-section="careerObjective">
    <div class="section-title-container">
      <div class="section-title">Career Objective</div>
    </div>
    <p class="summary-text">${careerObjective}</p>
  </div>` : ""}


   <!-- EDUCATION SECTION -->
  ${nonEmptyEducation.length > 0 ? `
  <div class="section" id="section-education" data-section="education">
    <div class="section-title-container">
      <div class="section-title">Education</div>
    </div>
    ${nonEmptyEducation.map((edu) => {
      const startDate = edu.startDate || edu.startYear;
      const endDate = edu.endDate || edu.endYear || edu.graduationDate;
      const dateDisplay = startDate && endDate ? `${startDate} – ${endDate}` : (startDate || endDate || "");
      return `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${edu.degree || edu.course || ""}${edu.field ? ` in ${edu.field}` : ""}</div>
          <div class="entry-date">${dateDisplay}</div>
        </div>
        <div class="entry-subtitle">${formatSubtitle([edu.school || edu.institution || edu.university, edu.location])}</div>
        ${edu.grade ? `<div class="entry-content">${edu.grade}</div>` : ""}
        ${edu.description ? `<div class="entry-content">${edu.description}</div>` : ""}
      </div>
    `}).join("")}
  </div>` : ""}

   <!-- EXPERIENCE SECTION -->
  ${nonEmptyExperience.length > 0 ? `
  <div class="section" id="section-experience" data-section="experience">
    <div class="section-title-container">
      <div class="section-title">Experience</div>
    </div>
    ${nonEmptyExperience.map((exp) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
      const subtitle = formatSubtitle([exp.company, exp.location]);
      return `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${exp.title || exp.designation || exp.role || ""}</div>
          ${dateRange ? `<div class="entry-date">${dateRange}</div>` : ""}
        </div>
        ${subtitle ? `<div class="entry-subtitle">${subtitle}</div>` : ""}
        ${exp.description ? renderDescription(exp.description) : ""}
        ${exp.achievements ? `<div class="entry-content"><strong>Achievements:</strong> ${exp.achievements}</div>` : ""}
      </div>
    `}).join("")}
  </div>` : ""}

  <!-- SKILLS SECTION -->
  ${skillsArray.length > 0 ? `
  <div class="section" id="section-skills" data-section="skills">
    <div class="section-title-container">
      <div class="section-title">Skills</div>
    </div>
    <div class="skills-list">
      ${skillsArray.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- CORE COMPETENCIES SECTION -->
  ${coreCompetenciesArray.length > 0 ? `
  <div class="section" id="section-coreCompetencies" data-section="coreCompetencies">
    <div class="section-title-container">
      <div class="section-title">Core Competencies</div>
    </div>
    <div class="skills-list">
      ${coreCompetenciesArray.map((comp) => `<span class="skill-tag">${comp}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- TOOLS & TECHNOLOGIES SECTION -->
  ${nonEmptyToolsTechnologies.length > 0 ? `
  <div class="section" id="section-toolsTechnologies" data-section="toolsTechnologies">
    <div class="section-title-container">
      <div class="section-title">Tools & Technologies</div>
    </div>
    <div class="skills-list">
      ${nonEmptyToolsTechnologies.map((item) => `<span class="skill-tag">${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- LANGUAGES SECTION -->
  ${nonEmptyLanguages.length > 0 ? `
  <div class="section" id="section-languages" data-section="languages">
    <div class="section-title-container">
      <div class="section-title">Languages</div>
    </div>
    <div class="skills-list">
      ${nonEmptyLanguages.map((lang) => `<span class="skill-tag">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</span>`).join("")}
    </div>
  </div>` : ""}

 

  <!-- PROJECTS SECTION -->
  ${nonEmptyProjects.length > 0 ? `
  <div class="section" id="section-projects" data-section="projects">
    <div class="section-title-container">
      <div class="section-title">Projects</div>
    </div>
    ${nonEmptyProjects.map((project) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${project.name || project.title || ''}</div>
          ${project.duration ? `<div class="entry-date">${project.duration}</div>` : ""}
        </div>
        ${project.role ? `<div class="entry-subtitle">Role: ${project.role}</div>` : ""}
        ${project.description ? renderDescription(project.description) : ''}
        ${project.technologies ? `<div class="entry-content"><strong>Technologies:</strong> ${project.technologies}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- INTERNSHIPS SECTION -->
  ${nonEmptyInternships.length > 0 ? `
  <div class="section" id="section-internships" data-section="internships">
    <div class="section-title-container">
      <div class="section-title">Internships</div>
    </div>
    ${nonEmptyInternships.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.title || item.role || ''}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        <div class="entry-subtitle">${formatSubtitle([item.company, item.location])}</div>
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- TRAINING PROGRAMS SECTION -->
  ${nonEmptyTrainingPrograms.length > 0 ? `
  <div class="section" id="section-trainingPrograms" data-section="trainingPrograms">
    <div class="section-title-container">
      <div class="section-title">Training Programs</div>
    </div>
    ${nonEmptyTrainingPrograms.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.name || item.title || ''}</div>
          ${item.completionDate ? `<div class="entry-date">${item.completionDate}</div>` : ''}
        </div>
        <div class="entry-subtitle">${item.provider || item.organization || ''}</div>
        ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- ACADEMIC PROJECTS SECTION -->
  ${nonEmptyAcademicProjects.length > 0 ? `
  <div class="section" id="section-academicProjects" data-section="academicProjects">
    <div class="section-title-container">
      <div class="section-title">Academic Projects</div>
    </div>
    ${nonEmptyAcademicProjects.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.name || item.title || ''}</div>
          ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ''}
        </div>
        <div class="entry-subtitle">${item.institution || ''}${item.course ? ` - ${item.course}` : ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
        ${item.technologies ? `<div class="entry-content"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
        ${item.url ? `<div class="entry-content"><a href="${item.url}" target="_blank">${item.url}</a></div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- LEADERSHIP POSITIONS SECTION -->
  ${nonEmptyLeadershipPositions.length > 0 ? `
  <div class="section" id="section-leadershipPositions" data-section="leadershipPositions">
    <div class="section-title-container">
      <div class="section-title">Leadership Positions</div>
    </div>
    ${nonEmptyLeadershipPositions.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.position || item.title || ''}</div>
          <div class="entry-date">${formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        <div class="entry-subtitle">${item.organization || ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- CO-CURRICULAR SECTION -->
  ${nonEmptyCoCurricular.length > 0 ? `
  <div class="section" id="section-coCurricular" data-section="coCurricular">
    <div class="section-title-container">
      <div class="section-title">Co-curricular Activities</div>
    </div>
    ${nonEmptyCoCurricular.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.activity || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        ${item.role ? `<div class="entry-subtitle">Role: ${item.role}</div>` : ''}
        ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- EXTRACURRICULAR SECTION -->
  ${nonEmptyExtracurricular.length > 0 ? `
  <div class="section" id="section-extracurricular" data-section="extracurricular">
    <div class="section-title-container">
      <div class="section-title">Extracurricular Activities</div>
    </div>
    ${nonEmptyExtracurricular.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.activity || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        ${item.role ? `<div class="entry-subtitle">Role: ${item.role}</div>` : ''}
        ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- SCHOLARSHIPS SECTION -->
  ${nonEmptyScholarships.length > 0 ? `
  <div class="section" id="section-scholarships" data-section="scholarships">
    <div class="section-title-container">
      <div class="section-title">Scholarships</div>
    </div>
    ${nonEmptyScholarships.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.name || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div class="entry-subtitle">${item.provider || item.organization || ''}</div>
        ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- AWARDS SECTION -->
  ${nonEmptyAwards.length > 0 ? `
  <div class="section" id="section-awards" data-section="awards">
    <div class="section-title-container">
      <div class="section-title">Awards & Recognition</div>
    </div>
    ${nonEmptyAwards.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.title || ''}</div>
          ${item.issueYear || item.year ? `<div class="entry-date">${item.issueYear || item.year}</div>` : ''}
        </div>
        <div class="entry-subtitle">${item.organization || ''}</div>
        ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- SPEAKING ENGAGEMENTS SECTION -->
  ${nonEmptySpeakingEngagements.length > 0 ? `
  <div class="section" id="section-speakingEngagements" data-section="speakingEngagements">
    <div class="section-title-container">
      <div class="section-title">Speaking Engagements</div>
    </div>
    ${nonEmptySpeakingEngagements.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.topic || ''}</div>
          ${item.date ? `<div class="entry-date">${item.date}</div>` : ''}
        </div>
        <div class="entry-subtitle">${item.eventName || ''}</div>
        ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- MEMBERSHIPS SECTION -->
  ${nonEmptyMemberships.length > 0 ? `
  <div class="section" id="section-memberships" data-section="memberships">
    <div class="section-title-container">
      <div class="section-title">Memberships</div>
    </div>
    ${nonEmptyMemberships.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.membershipName || item.name || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div class="entry-subtitle">${item.organizationName || item.organization || ''}</div>
        ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- WORKSHOPS SECTION -->
  ${nonEmptyWorkshops.length > 0 ? `
  <div class="section" id="section-workshops" data-section="workshops">
    <div class="section-title-container">
      <div class="section-title">Workshops</div>
    </div>
    ${nonEmptyWorkshops.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.programTitle || item.title || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div class="entry-subtitle">${item.conductedBy || ''}</div>
        ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- CLIENT PROJECTS SECTION -->
  ${nonEmptyClientProjects.length > 0 ? `
  <div class="section" id="section-clientProjects" data-section="clientProjects">
    <div class="section-title-container">
      <div class="section-title">Client Projects</div>
    </div>
    ${nonEmptyClientProjects.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.name || ''}</div>
          ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ''}
        </div>
        <div class="entry-subtitle">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
        ${item.toolsTechnologies ? `<div class="entry-content"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ''}
        ${item.projectUrl ? `<div class="entry-content"><a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- PORTFOLIO SECTION -->
  ${nonEmptyPortfolio.length > 0 ? `
  <div class="section" id="section-portfolio" data-section="portfolio">
    <div class="section-title-container">
      <div class="section-title">Portfolio</div>
    </div>
    ${nonEmptyPortfolio.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.name || ''}</div>
        </div>
        <div class="entry-subtitle">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</div>
        ${item.url ? `<div class="entry-content"><a href="${item.url}" target="_blank">${item.url}</a></div>` : ''}
        ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- VOLUNTEERING SECTION -->
  ${nonEmptyVolunteering.length > 0 ? `
  <div class="section" id="section-volunteering" data-section="volunteering">
    <div class="section-title-container">
      <div class="section-title">Volunteering</div>
    </div>
    ${nonEmptyVolunteering.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.role || ''}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        <div class="entry-subtitle">${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- MILITARY SERVICE SECTION -->
  ${nonEmptyMilitaryService.length > 0 ? `
  <div class="section" id="section-militaryService" data-section="militaryService">
    <div class="section-title-container">
      <div class="section-title">Military Service</div>
    </div>
    ${nonEmptyMilitaryService.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        ${item.specialization ? `<div class="entry-subtitle">Specialization: ${item.specialization}</div>` : ''}
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- METHODOLOGIES SECTION -->
  ${nonEmptyMethodologies.length > 0 ? `
  <div class="section" id="section-methodologies" data-section="methodologies">
    <div class="section-title-container">
      <div class="section-title">Methodologies</div>
    </div>
    <div class="skills-list">
      ${nonEmptyMethodologies.map((item) => `<span class="skill-tag">${item.name || ''}${item.certification ? ` (${item.certification})` : ''}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- INDUSTRY EXPERTISE SECTION -->
  ${nonEmptyIndustryExpertise.length > 0 ? `
  <div class="section" id="section-industryExpertise" data-section="industryExpertise">
    <div class="section-title-container">
      <div class="section-title">Industry Expertise</div>
    </div>
    <div class="skills-list">
      ${nonEmptyIndustryExpertise.map((item) => `<span class="skill-tag">${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- TEACHING EXPERIENCE SECTION -->
  ${nonEmptyTeachingExperience.length > 0 ? `
  <div class="section" id="section-teachingExperience" data-section="teachingExperience">
    <div class="section-title-container">
      <div class="section-title">Teaching Experience</div>
    </div>
    ${nonEmptyTeachingExperience.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.subjectCourseTaught || item.title || ''}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        <div class="entry-subtitle">${item.institution || ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- MENTORSHIP EXPERIENCE SECTION -->
  ${nonEmptyMentorshipExperience.length > 0 ? `
  <div class="section" id="section-mentorshipExperience" data-section="mentorshipExperience">
    <div class="section-title-container">
      <div class="section-title">Mentorship Experience</div>
    </div>
    ${nonEmptyMentorshipExperience.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.mentorshipArea || ''}</div>
          <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate)}</div>
        </div>
        <div class="entry-subtitle">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</div>
        ${item.description ? renderDescription(item.description) : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- RESEARCH GRANTS SECTION -->
  ${nonEmptyResearchGrants.length > 0 ? `
  <div class="section" id="section-researchGrants" data-section="researchGrants">
    <div class="section-title-container">
      <div class="section-title">Research Grants</div>
    </div>
    ${nonEmptyResearchGrants.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.title || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div class="entry-subtitle">${item.agency || ''}${item.amount ? ` | Amount: ${item.amount}` : ''}</div>
        ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- TEST SCORES SECTION -->
  ${nonEmptyTestScores.length > 0 ? `
  <div class="section" id="section-testScores" data-section="testScores">
    <div class="section-title-container">
      <div class="section-title">Test Scores</div>
    </div>
    ${nonEmptyTestScores.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.testName || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div class="entry-subtitle">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
      </div>
    `).join("")}
  </div>` : ""}

  <!-- PUBLICATIONS SECTION -->
  ${nonEmptyPublications.length > 0 ? `
  <div class="section" id="section-publications" data-section="publications">
    <div class="section-title-container">
      <div class="section-title">Publications</div>
    </div>
    ${nonEmptyPublications.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.title || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div class="entry-subtitle">${item.journalPublisher || item.publisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</div>
        ${item.urlDoi ? `<div class="entry-content"><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- PATENTS SECTION -->
  ${nonEmptyPatents.length > 0 ? `
  <div class="section" id="section-patents" data-section="patents">
    <div class="section-title-container">
      <div class="section-title">Patents</div>
    </div>
    ${nonEmptyPatents.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.title || ''}</div>
          ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
        </div>
        <div class="entry-subtitle">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</div>
        ${item.status ? `<div class="entry-content"><strong>Status:</strong> ${item.status}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- REFERENCES SECTION -->
  ${nonEmptyReferences.length > 0 ? `
  <div class="section" id="section-references" data-section="references">
    <div class="section-title-container">
      <div class="section-title">References</div>
    </div>
    ${nonEmptyReferences.map((item) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${item.name || ''}</div>
        </div>
        <div class="entry-subtitle">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</div>
        ${item.contactInformation ? `<div class="entry-content">${item.contactInformation}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

  <!-- CERTIFICATIONS SECTION -->
  ${nonEmptyCertifications.length > 0 ? `
  <div class="section" id="section-certifications" data-section="certifications">
    <div class="section-title-container">
      <div class="section-title">Certifications</div>
    </div>
    ${nonEmptyCertifications.map((cert) => `
      <div class="entry">
        <div class="entry-header">
          <div class="entry-title">${cert.name || cert.title || ''}</div>
          ${cert.date ? `<div class="entry-date">${cert.date}</div>` : ''}
        </div>
        <div class="entry-subtitle">${cert.issuer || ''}</div>
        ${cert.description ? `<div class="entry-content">${cert.description}</div>` : ''}
      </div>
    `).join("")}
  </div>` : ""}

 

  <!-- HOBBIES SECTION -->
  ${nonEmptyHobbies.length > 0 ? `
  <div class="section" id="section-hobbies" data-section="hobbies">
    <div class="section-title-container">
      <div class="section-title">Hobbies & Interests</div>
    </div>
    <div class="skills-list">
      ${nonEmptyHobbies.map((hobby) => `<span class="skill-tag">${typeof hobby === "string" ? hobby.trim() : hobby}</span>`).join("")}
    </div>
  </div>` : ""}

  <!-- SOCIAL PROFILES SECTION -->
  ${nonEmptySocialProfiles.length > 0 ? `
  <div class="section" id="section-socialProfiles" data-section="socialProfiles">
    <div class="section-title-container">
      <div class="section-title">Social Profiles</div>
    </div>
    <div class="skills-list">
      ${nonEmptySocialProfiles.map((profile) => `<a href="${profile.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none; margin-right: 10px;"><span class="skill-tag">${profile.platform || profile.network || 'Profile'}</span></a>`).join("")}
    </div>
  </div>` : ""}

</div>
</body>
</html>`;
}