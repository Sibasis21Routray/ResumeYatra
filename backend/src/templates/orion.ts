export function buildOrionTemplate(data: any, theme?: any): string {
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
    professionalContext = {},
    availabilityWorkAuth = {},
    socialProfiles = []
  } = data;

  // ✅ Theme system with defaults - ONLY sidebar is dynamic
  const defaultTheme = {
    sidebarBg: "#1a428a",
    sidebarText: "#ffffff",
    sidebarTextLight: "rgba(255,255,255,0.6)",
    text: "#333333",
    textLight: "#666666",
    borderColor: "#333333",
    accent: "#ffffff"
  };

const currentTheme = {
  ...defaultTheme,
  ...(theme || {}),
  sidebarBg: theme?.sidebarBg || theme?.primary || defaultTheme.sidebarBg,
  sidebarText: theme?.sidebarText || "#ffffff"
};
  
  // ✅ Dynamic font size from user settings
  const baseFontSize = data?.formatting?.bodyFontSize || data?.fontSize || 14;
  const userFontFamily = data?.formatting?.fontFamily || data?.fontFamily || "'Georgia', serif";
  
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
  
  // Responsive font sizes based on baseFontSize
  const bannerNameFontSize = Math.round(baseFontSize * 3);
  const sidebarTitleFontSize = Math.round(baseFontSize * 1.3);
  const sectionTitleFontSize = Math.round(baseFontSize * 1.3);
  const normalTextFontSize = Math.round(baseFontSize);
  const smallTextFontSize = Math.round(baseFontSize * 0.93);
  const smallTextFontSize2 = Math.round(baseFontSize * 0.96);
  const entryTitleFontSize = Math.round(baseFontSize * 1.07);

  // Helper functions (same as before)
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
// console.log("THEME:????????????????>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", currentTheme);
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
    
    // Use a very robust bullet character that Adobe identifies correctly
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

  const parseSkills = (skills: any) => {
    if (Array.isArray(skills)) return skills;
    if (typeof skills === "string") {
      if (skills.includes('<ul>') || skills.includes('<li>')) {
        const matches = skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          return matches.map(m => m.replace(/<\/?li>/g, '').trim());
        }
        return skills.split(',').map(s => s.trim()).filter(s => s);
      }
      return skills.split(',').map(s => s.trim()).filter(s => s);
    }
    return [];
  };

  const skillList = parseSkills(skills);
  const parsedCoreCompetencies = parseSkills(coreCompetencies);

  // Filter arrays
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

  // SVG Icons with fill and stroke colors that inherit from parent
  const icons = {
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    mail: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: ${userFontFamily};
          background: white;
          color: ${currentTheme.text};
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          font-size: ${baseFontSize}px;
          font-weight: ${currentFontWeight};
          text-align: ${currentAlignment};
        }

        .name-banner {
          background-color: #333333;
          color: white;
          padding: 45px 0;
          text-align: center;
        }
        .name-banner h1 {
          font-size: ${bannerNameFontSize}px;
          text-transform: uppercase;
          letter-spacing: 5px;
          font-weight: bold;
        }

        .main-container {
          display: flex;
          flex: 1;
        }

        .sidebar {
          width: 32%;
          background-color: ${currentTheme.sidebarBg};
          color: ${currentTheme.sidebarText};
          padding: 40px 25px;
        }
        .sidebar-section {
          margin-bottom: 35px;
        }
        .sidebar-title {
          font-size: ${sidebarTitleFontSize}px;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 1.5px solid ${currentTheme.sidebarTextLight};
          padding-bottom: 8px;
          margin-bottom: 15px;
          letter-spacing: 1px;
          color: ${currentTheme.sidebarText};
        }
        .contact-item {
           width: 100%;
           word-break: break-all;
          overflow-wrap: break-word;

          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: ${smallTextFontSize}px;
          font-family: 'Arial', sans-serif;
          color: ${currentTheme.sidebarText};
        }
        .icon-wrapper {
          margin-right: 10px;
          display: flex;
          align-items: center;
          opacity: 0.9;
          color: ${currentTheme.sidebarText};
        }
        .icon-wrapper svg {
          stroke: ${currentTheme.sidebarText};
          fill: none;
        }

        .sidebar-list {
          list-style: none;
        }
        .sidebar-list li {
          margin-bottom: 8px;
          font-size: ${smallTextFontSize2}px;
          padding-left: 12px;
          position: relative;
          color: ${currentTheme.sidebarText};
        }
        .sidebar-list li::before {
          content: '●';
          font-size: 8px;
          position: absolute;
          left: 0;
          top: 4px;
          color: ${currentTheme.sidebarTextLight};
        }

        .content {
          width: 68%;
          padding: 40px 50px;
        }
        .section-title {
          font-size: ${sectionTitleFontSize}px;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 2px solid ${currentTheme.borderColor};
          padding-bottom: 4px;
          margin-bottom: 15px;
          margin-top: 10px;
          color: ${currentTheme.text};
        }

        .entry { margin-bottom: 20px; }
        .date-line { 
          font-size: ${smallTextFontSize}px; 
          color: ${currentTheme.textLight}; 
          margin-bottom: 4px; 
        }
        .title-line { 
          font-size: ${entryTitleFontSize}px; 
          font-weight: bold; 
          margin-bottom: 5px; 
          color: ${currentTheme.text};
        }
        
        .bullet-list {
          list-style-type: disc;
          margin-left: 20px;
          font-size: ${smallTextFontSize2}px;
          line-height: 1.5;
          color: ${currentTheme.textLight};
        }
        .bullet-list li { margin-bottom: 4px; }

        .description-html ul {
          list-style: none;
          margin-left: 0;
        }
        .description-html li {
          display: table;
          width: 100%;
          margin-bottom: 6px;
          color: ${currentTheme.textLight};
          font-size: ${smallTextFontSize2}px;
          line-height: 1.4;
        }
        .description-html li::before {
          content: none;
        }
        .description-html li .bullet-wrap {
          display: table-cell;
          width: 22px;
          vertical-align: top;
          padding-top: 0;
          font-family: 'Arial', sans-serif;
          font-size: 16px;
          text-align: center;
        }
        .description-html li .bullet-circle {
          color: ${currentTheme.textLight};
        }
        .description-html li .li-text {
          display: table-cell;
          vertical-align: top;
          padding-left: 2px;
        }
        .description-html p {
          margin-bottom: 8px;
          color: ${currentTheme.textLight};
        }

        .context-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
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
          color: ${currentTheme.accent};
          text-decoration: none;
        }
        
        a:hover {
          text-decoration: underline;
        }

        @media print {
          body { -webkit-print-color-adjust: exact; }
          .sidebar { background-color: ${currentTheme.sidebarBg} !important; color: ${currentTheme.sidebarText} !important; }
        }
      </style>
    </head>
    <body>
      <div class="name-banner" data-section="personal">
        <h1>${personal.name?.toUpperCase() || ''}</h1>
      </div>

      <div class="main-container">
        <aside class="sidebar">
          ${(personal.location || personal.pinCode || personal.phone || personal.email || personal.alternatePhone || personal.fullAddress || personal.country || personal.dob || personal.gender || personal.maritalStatus) ? `
          <div class="sidebar-section" data-section="personal">
            <h2 class="sidebar-title">Contact</h2>
            ${personal.location || personal.pinCode ? `
            <div class="contact-item">
              <span class="icon-wrapper">${icons.location}</span>
              <span>${personal.location ? `${personal.location}${personal.pinCode ? ` ${personal.pinCode}` : ''}` : personal.pinCode ? personal.pinCode : ''}</span>
            </div>
            ` : ''}
            ${personal.phone ? `
            <div class="contact-item">
              <span class="icon-wrapper">${icons.phone}</span>
              <span>${personal.phone}</span>
            </div>
            ` : ''}
            ${personal.email ? `
            <div class="contact-item">
              <span class="icon-wrapper">${icons.mail}</span>
              <span>${personal.email}</span>
            </div>
            ` : ''}
            ${personal.alternatePhone ? `
            <div class="contact-item">
              <span class="icon-wrapper">${icons.phone}</span>
              <span>${personal.alternatePhone} (Alt)</span>
            </div>
            ` : ''}
            ${personal.fullAddress ? `
            <div class="contact-item">
              <span class="icon-wrapper">${icons.location}</span>
              <span>${personal.fullAddress}</span>
            </div>
            ` : ''}
            ${personal.country ? `
            <div class="contact-item">
              <span class="icon-wrapper">${icons.location}</span>
              <span>${personal.country}</span>
            </div>
            ` : ''}
            ${personal.dob ? `
            <div class="contact-item">
              <span class="icon-wrapper">${icons.calendar}</span>
              <span>DOB: ${personal.dob}</span>
            </div>
            ` : ''}
            ${personal.gender ? `
            <div class="contact-item">
              <span class="icon-wrapper">${icons.user}</span>
              <span>Gender: ${personal.gender}</span>
            </div>
            ` : ''}
            ${personal.maritalStatus ? `
            <div class="contact-item">
              <span class="icon-wrapper">${icons.heart}</span>
              <span>Marital: ${personal.maritalStatus}</span>
            </div>
            ` : ''}
          </div>
          ` : ''}

          ${skillList.length > 0 ? `
          <div class="sidebar-section" data-section="skills">
            <h2 class="sidebar-title">Skills</h2>
            <ul class="sidebar-list">
              ${skillList.map((skill, idx) => `
                <li data-index="${idx}">
                  <div class="text">${skill}</div>
                </li>
              `).join('')}
            </ul>
          </div>
          ` : ''}

           ${parsedCoreCompetencies.length > 0 ? `
          <div class="sidebar-section" data-section="skills">
            <h2 class="sidebar-title">Competencies</h2>
            <ul class="sidebar-list">
              ${parsedCoreCompetencies.map((coreCompetency, idx) => `
                <li data-index="${idx}">
                  <div class="text">${coreCompetency}</div>
                </li>
              `).join('')}
            </ul>
          </div>
          ` : ''}

          ${nonEmptyLanguages.length > 0 ? `
          <div class="sidebar-section" data-section="languages">
            <h2 class="sidebar-title">Languages</h2>
            <ul class="sidebar-list">
              ${nonEmptyLanguages.map((lang: any, idx: number) => `
                <li data-index="${idx}">
                  <div class="text">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</div>
                </li>
              `).join('')}
            </ul>
          </div>
          ` : ''}

          ${nonEmptyCertifications.length > 0 ? `
          <div class="sidebar-section" data-section="certifications">
            <h2 class="sidebar-title">Certifications</h2>
            <div style="font-size: ${smallTextFontSize}px;">
              ${nonEmptyCertifications.map((cert: any, idx: number) => `
                <div style="margin-bottom: 12px;" data-index="${idx}">
                  <strong>${cert.name || ''}</strong><br>
                  ${cert.issuer ? `${cert.issuer}<br>` : ''}
                  ${cert.date ? `${cert.date}` : ''}
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          ${nonEmptyHobbies.length > 0 ? `
          <div class="sidebar-section" data-section="hobbies">
            <h2 class="sidebar-title">Hobbies</h2>
            <ul class="sidebar-list">
              ${nonEmptyHobbies.map((hobby: any, idx: number) => `
                <li data-index="${idx}">
                  <div class="text">${typeof hobby === "string" ? hobby.trim() : hobby}</div>
                </li>
              `).join('')}
            </ul>
          </div>
          ` : ''}

          ${nonEmptySocialProfiles.length > 0 ? `
          <div class="sidebar-section" data-section="socialProfiles">
            <h2 class="sidebar-title">Social Profiles</h2>
            <div style="font-size: ${smallTextFontSize}px;">
              ${nonEmptySocialProfiles.map((item: any, idx: number) => `
                <div style="margin-bottom: 8px;" data-index="${idx}">
                  <strong>${item.platform || 'Profile'}:</strong><br>
                  <a href="${item.url || ''}" style="color: ${currentTheme.sidebarText}; word-break: break-all;">${item.url || ''}</a>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

         ${nonEmptyEducation.length > 0 ? `
<div class="sidebar-section" data-section="education">
  <h2 class="sidebar-title">Education</h2>
  <div style="font-size: ${smallTextFontSize}px;">
    ${nonEmptyEducation.map((edu, idx: number) => {
      const dateParts = [];
      if (edu.startDate && edu.startDate.trim()) dateParts.push(edu.startDate.trim());
      if (edu.graduationDate && edu.graduationDate.trim()) dateParts.push(edu.graduationDate.trim());
      else if (edu.endDate && edu.endDate.trim()) dateParts.push(edu.endDate.trim());
      const dateRange = dateParts.length > 0 ? dateParts.join(" - ") : "";
      return `
      <div style="margin-bottom: 15px;" data-index="${idx}">
        <p><strong>${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}</strong></p>
        <p>${edu.school || ''}</p>
        ${edu.location ? `<p>${edu.location}</p>` : ''}
        ${dateRange ? `<p>${dateRange}</p>` : ''}
        ${edu.grade ? `<p>${edu.grade}</p>` : ''}
        ${edu.description ? `<p style="">${edu.description}</p>` : ''}
      </div>
    `}).join('')}
  </div>
</div>
` : ''}
        </aside>

        <main class="content">
        

          ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
          <div class="section" data-section="availabilityWorkAuth">
            <h2 class="section-title">Availability</h2>
            <div class="context-grid">
              ${availabilityWorkAuth.availabilityNoticePeriod ? `<div class="context-item"><span class="context-label">Notice Period:</span> ${availabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
              ${availabilityWorkAuth.workAuthorizationStatus ? `<div class="context-item"><span class="context-label">Work Auth:</span> ${availabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
              ${availabilityWorkAuth.preferredLocation ? `<div class="context-item"><span class="context-label">Preferred Location:</span> ${availabilityWorkAuth.preferredLocation}</div>` : ''}
            </div>
          </div>
          ` : ''}

          ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
          <div class="section" data-section="careerObjective">
            <h2 class="section-title">Career Objective</h2>
            <p style="text-align: justify; margin-bottom: 15px; color: ${currentTheme.textLight};">${careerObjective}</p>
          </div>
          ` : ''}

          ${summary && summary.trim() ? `
          <div class="section" data-section="summary">
            <p style="text-align: justify; margin-bottom: 25px; color: ${currentTheme.textLight};">${summary}</p>
          </div>
          ` : ''}

          ${nonEmptyExperience.length > 0 ? `
          <div class="section" data-section="experience">
            <h2 class="section-title">Experience</h2>
            ${nonEmptyExperience.map((exp, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</div>
                <div class="title-line">
                  ${exp.title || ''}, <i>${exp.company || ''}</i> — ${exp.location || ''}
                </div>
                ${exp.description ? renderDescription(exp.description) : ''}
                ${exp.achievements ? `<p style="margin-top: 5px; color: ${currentTheme.textLight};"><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyProjects.length > 0 ? `
          <div class="section" data-section="projects">
            <h2 class="section-title">Projects</h2>
            ${nonEmptyProjects.map((project, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${project.duration || ''}</div>
                <div class="title-line">
                  ${project.name || project.title || ''}
                </div>
                ${project.role ? `<p><strong>Role:</strong> ${project.role}</p>` : ''}
                ${project.description ? renderDescription(project.description) : ''}
                ${project.technologies ? `<p><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyInternships.length > 0 ? `
          <div class="section" data-section="internships">
            <h2 class="section-title">Internships</h2>
            ${nonEmptyInternships.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
                <div class="title-line">
                  ${item.title || ''}, <i>${item.company || ''}</i>
                </div>
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyTrainingPrograms.length > 0 ? `
          <div class="section" data-section="trainingPrograms">
            <h2 class="section-title">Training Programs</h2>
            ${nonEmptyTrainingPrograms.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.completionDate || ''}${item.duration ? ` (${item.duration})` : ''}</div>
                <div class="title-line">
                  ${item.name || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.provider || item.organization || ''}</p>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyAcademicProjects.length > 0 ? `
          <div class="section" data-section="academicProjects">
            <h2 class="section-title">Academic Projects</h2>
            ${nonEmptyAcademicProjects.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.duration || ''}</div>
                <div class="title-line">
                  ${item.name || item.title || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.institution || ''}${item.course ? ` | ${item.course}` : ''}</p>
                ${item.description ? renderDescription(item.description) : ''}
                ${item.technologies && item.technologies.length > 0 ? `<p><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
                ${item.url ? `<p><strong>URL:</strong> <a href="${item.url}" target="_blank" style="color:#9ca3af;">${item.url}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyLeadershipPositions.length > 0 ? `
          <div class="section" data-section="leadershipPositions">
            <h2 class="section-title">Leadership Positions</h2>
            ${nonEmptyLeadershipPositions.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${formatDateRange(item.startDate, item.endDate) || ''}</div>
                <div class="title-line">
                  ${item.position || item.title || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.organization || ''}</p>
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyCoCurricular.length > 0 ? `
          <div class="section" data-section="coCurricular">
            <h2 class="section-title">Co-curricular Activities</h2>
            ${nonEmptyCoCurricular.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.year || ''}</div>
                <div class="title-line">
                  ${item.activity || ''}
                </div>
                ${item.role ? `<p>Role: ${item.role}</p>` : ''}
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyExtracurricular.length > 0 ? `
          <div class="section" data-section="extracurricular">
            <h2 class="section-title">Extracurricular Activities</h2>
            ${nonEmptyExtracurricular.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.year || ''}</div>
                <div class="title-line">
                  ${item.activity || ''}
                </div>
                ${item.role ? `<p>Role: ${item.role}</p>` : ''}
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyScholarships.length > 0 ? `
          <div class="section" data-section="scholarships">
            <h2 class="section-title">Scholarships</h2>
            ${nonEmptyScholarships.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.year || ''}</div>
                <div class="title-line">
                  ${item.name || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.provider || item.organization || ''}</p>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyAwards.length > 0 ? `
          <div class="section" data-section="awards">
            <h2 class="section-title">Awards</h2>
            ${nonEmptyAwards.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.issueYear || item.year || ''}</div>
                <div class="title-line">
                  ${item.title || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.organization || ''}</p>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptySpeakingEngagements.length > 0 ? `
          <div class="section" data-section="speakingEngagements">
            <h2 class="section-title">Speaking Engagements</h2>
            ${nonEmptySpeakingEngagements.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.date || ''}</div>
                <div class="title-line">
                  ${item.topic || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.eventName || ''}</p>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyMemberships.length > 0 ? `
          <div class="section" data-section="memberships">
            <h2 class="section-title">Memberships</h2>
            ${nonEmptyMemberships.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.year || ''}</div>
                <div class="title-line">
                  ${item.membershipName || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.organizationName || item.organization || ''}</p>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyWorkshops.length > 0 ? `
          <div class="section" data-section="workshops">
            <h2 class="section-title">Workshops</h2>
            ${nonEmptyWorkshops.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.year || ''}</div>
                <div class="title-line">
                  ${item.programTitle || item.title || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.conductedBy || ''}</p>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyClientProjects.length > 0 ? `
          <div class="section" data-section="clientProjects">
            <h2 class="section-title">Client Projects</h2>
            ${nonEmptyClientProjects.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.duration || ''}</div>
                <div class="title-line">
                  ${item.name || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</p>
                ${item.description ? renderDescription(item.description) : ''}
                ${item.toolsTechnologies ? `<p><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ''}
                ${item.projectUrl ? `<p><strong>URL:</strong> <a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyPortfolio.length > 0 ? `
          <div class="section" data-section="portfolio">
            <h2 class="section-title">Portfolio</h2>
            ${nonEmptyPortfolio.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="title-line">
                  ${item.name || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</p>
                ${item.url ? `<p><a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyVolunteering.length > 0 ? `
          <div class="section" data-section="volunteering">
            <h2 class="section-title">Volunteering</h2>
            ${nonEmptyVolunteering.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
                <div class="title-line">
                  ${item.role || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}</p>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyMilitaryService.length > 0 ? `
          <div class="section" data-section="militaryService">
            <h2 class="section-title">Military Service</h2>
            ${nonEmptyMilitaryService.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
                <div class="title-line">
                  ${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}
                </div>
                ${item.specialization ? `<p>Specialization: ${item.specialization}</p>` : ''}
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyToolsTechnologies.length > 0 ? `
          <div class="section" data-section="toolsTechnologies">
            <h2 class="section-title">Tools & Technologies</h2>
            ${nonEmptyToolsTechnologies.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="title-line" style="font-size: ${normalTextFontSize}px;">
                  ${item.name || ''}
                </div>
                ${item.category ? `<p><strong>Category:</strong> ${item.category}</p>` : ''}
                ${item.proficiency ? `<p><strong>Proficiency:</strong> ${item.proficiency}</p>` : ''}
                ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyMethodologies.length > 0 ? `
          <div class="section" data-section="methodologies">
            <h2 class="section-title">Methodologies</h2>
            ${nonEmptyMethodologies.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="title-line" style="font-size: ${normalTextFontSize}px;">
                  ${item.name || ''}
                </div>
                ${item.certification ? `<p><strong>Certification:</strong> ${item.certification}</p>` : ''}
                ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyIndustryExpertise.length > 0 ? `
          <div class="section" data-section="industryExpertise">
            <h2 class="section-title">Industry Expertise</h2>
            ${nonEmptyIndustryExpertise.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="title-line" style="font-size: ${normalTextFontSize}px;">
                  ${item.industry || ''}
                </div>
                ${item.domainArea ? `<p><strong>Domain:</strong> ${item.domainArea}</p>` : ''}
                ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyTeachingExperience.length > 0 ? `
          <div class="section" data-section="teachingExperience">
            <h2 class="section-title">Teaching Experience</h2>
            ${nonEmptyTeachingExperience.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
                <div class="title-line">
                  ${item.subjectCourseTaught || item.title || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.institution || ''}</p>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyMentorshipExperience.length > 0 ? `
          <div class="section" data-section="mentorshipExperience">
            <h2 class="section-title">Mentorship Experience</h2>
            ${nonEmptyMentorshipExperience.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
                <div class="title-line">
                  ${item.mentorshipArea || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</p>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyResearchGrants.length > 0 ? `
          <div class="section" data-section="researchGrants">
            <h2 class="section-title">Research Grants</h2>
            ${nonEmptyResearchGrants.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.year || ''}</div>
                <div class="title-line">
                  ${item.title || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.agency || ''}${item.amount ? ` | Amount: ${item.amount}` : ''}</p>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyTestScores.length > 0 ? `
          <div class="section" data-section="testScores">
            <h2 class="section-title">Test Scores</h2>
            ${nonEmptyTestScores.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.year || ''}</div>
                <div class="title-line" style="font-size: ${normalTextFontSize}px;">
                  ${item.testName || ''}
                </div>
                <p><strong>Score:</strong> ${item.score || ''}</p>
                ${item.percentileRank ? `<p><strong>Percentile:</strong> ${item.percentileRank}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyPublications.length > 0 ? `
          <div class="section" data-section="publications">
            <h2 class="section-title">Publications</h2>
            ${nonEmptyPublications.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.year || ''}</div>
                <div class="title-line">
                  ${item.title || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.journalPublisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</p>
                ${item.urlDoi ? `<p><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyPatents.length > 0 ? `
          <div class="section" data-section="patents">
            <h2 class="section-title">Patents</h2>
            ${nonEmptyPatents.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="date-line">${item.year || ''}</div>
                <div class="title-line">
                  ${item.title || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</p>
                ${item.status ? `<p><strong>Status:</strong> ${item.status}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyReferences.length > 0 ? `
          <div class="section" data-section="references">
            <h2 class="section-title">References</h2>
            ${nonEmptyReferences.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="title-line">
                  ${item.name || ''}
                </div>
                <p style="color: ${currentTheme.textLight};">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</p>
                ${item.contactInformation ? `<p style="color: ${currentTheme.textLight};">${item.contactInformation}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

         
        </main>
      </div>
    </body>
    </html>
  `;
}