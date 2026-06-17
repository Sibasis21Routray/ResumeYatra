export function buildConsultantFreelancerTemplate(data: any, theme?: any): string {
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

  // ✅ Step 1: Fix theme keys - proper merge with defaults
  const defaultTheme = {
    primary: "#2c4b5c",
    divider: "#5f7a86",
    text: "#333333",
    textLight: "#666666",
    background: "#ffffff",
  };

  const currentTheme = {
    ...defaultTheme,
    ...(theme || {})
  };

  // ✅ Step 2: Fix font size source - use formatting.bodyFontSize first
  const baseFontSize = data?.formatting?.bodyFontSize || data?.fontSize || 14;
  const userFontFamily = data?.formatting?.fontFamily || data?.fontFamily || "'Open Sans', sans-serif";

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
  const nameFontSize = Math.round(baseFontSize * 3); // ~42px at 14px base
  const sectionLabelFontSize = Math.round(baseFontSize * 1.14); // ~16px at 14px base
  const normalTextFontSize = Math.round(baseFontSize); // ~14px at 14px base
  const smallTextFontSize = Math.round(baseFontSize * 0.93); // ~13px at 14px base

  // SVG Icons
  const icons = {
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    mail: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    home: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2h-5v-8H7v8H5a2 2 0 0 1-2-2z"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
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

  // Helper to check if an object has any non-empty values
  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val =>
      val !== null && val !== undefined && val !== ""
    );
  };

  // Helper to check if contact info exists
  const hasContactInfo = () => {
    return personal.location || personal.pinCode || personal.phone || personal.email ||
      personal.alternatePhone || personal.country || personal.fullAddress ||
      personal.dob || personal.gender || personal.maritalStatus;
  };

  // Helper to format date range
  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    return parts.join(" - ");
  };

  // Helper to render description with HTML content
  const renderDescription = (description: string): string => {
    if (!description) return '';

    const bulletChar = '•'; // Use literal bullet for maximum Word compatibility

    if (description.includes('<ul>') || description.includes('<li>')) {
      let cleaned = description;
      cleaned = cleaned.replace(/<li>(.*?)<\/li>/gs, (match, content) => {
        return `<li><div class="bullet-wrap">${bulletChar}</div><div class="li-text">${content}</div></li>`;
      });
      return `<div class="description-html">${cleaned}</div>`;
    }
    const lines = description.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) return '';
    return `
      <div class="custom-list-container" style="margin-top: 5px;">
        ${lines.map(line => `
          <div class="custom-list-item" style="display: table; width: 100%; margin-bottom: 6px; font-size: ${normalTextFontSize}pt; line-height: 1.4; color: ${currentTheme.textLight};">
            <div style="display: table-cell; width: 22px; vertical-align: top; padding-top: 0; font-family: 'Arial', sans-serif; font-size: 16pt; text-align: center;">${bulletChar}</div>
            <div style="display: table-cell; vertical-align: top; padding-left: 2px;">${line.trim()}</div>
          </div>
        `).join('')}
      </div>
    `;
  };

  const parseSkillsToColumns = (skills: any) => {
    if (!skills) return { col1: [], col2: [] };
    let list: string[] = [];

    if (typeof skills === "string") {
      if (skills.includes('<ul>') || skills.includes('<li>')) {
        const matches = skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          list = matches.map(m => m.replace(/<\/?li>/g, '').trim());
        } else {
          list = skills.split(',').map(s => s.trim()).filter(s => s);
        }
      } else {
        list = skills.split(',').map(s => s.trim()).filter(s => s);
      }
    } else if (Array.isArray(skills)) {
      list = skills;
    }

    const mid = Math.ceil(list.length / 2);
    return {
      col1: list.slice(0, mid),
      col2: list.slice(mid)
    };
  };

  const { col1, col2 } = parseSkillsToColumns(skills);
  const { col1: coreCompCol1, col2: coreCompCol2 } = parseSkillsToColumns(coreCompetencies);


  // Filter arrays to only include non-empty items
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

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: ${userFontFamily};
          color: ${currentTheme.text};
          line-height: 1.4;
          background: white;
          padding: 0;
          font-size: ${baseFontSize}pt;
          font-weight: ${currentFontWeight};
          text-align: ${currentAlignment};
        }

        /* Top Accent Bar - Deeper Color */
        .top-bar {
          background-color: ${currentTheme.primary};
          height: 35px;
          width: 100%;
          position: relative;
          margin-bottom: 40px;
        }
        .top-bar::after {
          content: "";
          position: absolute;
          bottom: -15px;
          left: 235px;
          width: 0;
          height: 0;
          rotate: 90deg;
          border-left: 15px solid ${currentTheme.primary};
          border-top: 15px solid transparent;
        }

        .container { padding: 0 40px; }

        /* Header Area */
        .header {
          display: flex;
          gap: 30px;
          margin-bottom: 50px;
        }
        .profile-img {
          width: 170px;
          height: 210px;
          object-fit: cover;
          background: #eee;
        }
        .header-info { flex: 1; }
        .name {
          font-size: ${nameFontSize}pt;
          font-weight: 700;
          color: ${currentTheme.primary};
          letter-spacing: 2px;
          margin-top: 10px;
          margin-bottom: 25px;
          text-transform: uppercase;
        }
        .contact-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
          font-size: ${smallTextFontSize}pt;
          color: ${currentTheme.textLight};
        }
        .icon-box {
          background: ${currentTheme.primary};
          color: white;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
        }
        .icon-box svg {
          width: 14px;
          height: 14px;
          stroke: white;
        }

        /* Section Layout */
        .section {
          display: flex;
          margin-bottom: 40px;
          padding-top: 10px;
          border-top: 3px solid transparent;
          border-image: linear-gradient(
            to right,
            ${currentTheme.primary} 30%,
            #d3d3d3 30%
          ) 1;
        }
        .section-label {
          width: 215px;
          font-weight: 800;
          font-size: ${sectionLabelFontSize}pt;
          text-transform: uppercase;
          color: ${currentTheme.text};
        }
        .section-content { flex: 1; }

        /* Typography */
        .summary-text { 
          font-size: ${normalTextFontSize}pt; 
          color: ${currentTheme.textLight}; 
          line-height: 1.5; 
        }
        
        .entry { margin-bottom: 20px; }
        .entry-header {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          margin-bottom: 4px;
          text-transform: uppercase;
          color: ${currentTheme.text};
        }
        .company-line {
          font-weight: 700;
          margin-bottom: 8px;
          color: ${currentTheme.textLight};
        }
        .bullet-list {
          list-style: none;
          padding-left: 0;
        }
        .bullet-list li {
          position: relative;
          margin-bottom: 5px;
          font-size: ${normalTextFontSize}pt;
          color: ${currentTheme.textLight};
        }

        /* Skills Columns */
        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        /* Education */
        .edu-line { 
          font-style: italic; 
          font-size: ${normalTextFontSize}pt; 
          margin-bottom: 8px; 
          color: ${currentTheme.textLight};
        }
        .edu-line b { 
          font-style: normal; 
          color: ${currentTheme.text};
        }

        /* Style for HTML content with bullet points */
        .description-html ul {
          list-style: none;
          padding-left: 0;
        }
        .description-html li {
          display: table;
          width: 100%;
          margin-bottom: 6px;
          color: ${currentTheme.textLight};
          font-size: ${normalTextFontSize}pt;
          line-height: 1.4;
        }
        .description-html li .bullet-wrap {
          display: table-cell;
          width: 22px;
          vertical-align: top;
          padding-top: 0;
          font-family: 'Arial', sans-serif;
          font-size: 16pt;
          text-align: center;
        }
        .description-html li .li-text {
          display: table-cell;
          vertical-align: top;
          padding-left: 2px;
        }
        .description-html p {
          margin-bottom: 4px;
          color: ${currentTheme.textLight};
        }

        .context-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          font-size: ${normalTextFontSize}pt;
        }
        .context-item {
          color: ${currentTheme.textLight};
        }
        .context-label {
          font-weight: bold;
          color: ${currentTheme.text};
        }

        a {
          color: ${currentTheme.primary};
          text-decoration: none;
        }
        
        a:hover {
          text-decoration: underline;
        }

        @media print {
          .top-bar { -webkit-print-color-adjust: exact; }
          .icon-box { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="top-bar"></div>
      
      <div class="container">
        <header class="header" data-section="personal">
          ${(() => {
            const profileImg = personal.image || personal.photo || personal.avatar;
            return profileImg ? `<img src="${profileImg}" class="profile-img">` : '<div class="profile-img"></div>';
          })()}
          <div class="header-info">
            <h1 class="name">${personal.name ? personal.name.toUpperCase() : ''}</h1>
            ${(() => {
              const addressString = [personal.location, personal.pinCode].filter(Boolean).join(", ") || personal.fullAddress || "";
              const linkedinProfile = socialProfiles?.find((p: any) => 
                String(p.network || p.platform).toLowerCase().includes("linkedin") || 
                String(p.url).toLowerCase().includes("linkedin")
              );
              const linkedinUrl = personal.linkedinUrl || linkedinProfile?.url || linkedinProfile?.username || "";
              const cleanLinkedinLabel = linkedinUrl ? linkedinUrl.replace(/^(https?:\/\/)?(www\.)?/, "") : "";
              
              const githubProfile = socialProfiles?.find((p: any) => 
                String(p.network || p.platform).toLowerCase().includes("github") || 
                String(p.url).toLowerCase().includes("github")
              );
              const githubUrl = githubProfile?.url || githubProfile?.username || "";
              const cleanGithubLabel = githubUrl ? githubUrl.replace(/^(https?:\/\/)?(www\.)?/, "") : "";

              const linkedinIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`;
              const githubIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;

              const items = [];
              if (personal.phone) {
                items.push(`<div class="contact-row"><span class="icon-box">${icons.phone}</span><span>${personal.phone}</span></div>`);
              }
              if (personal.email) {
                items.push(`<div class="contact-row"><span class="icon-box">${icons.mail}</span><span>${personal.email}</span></div>`);
              }
              if (personal.dob) {
                items.push(`<div class="contact-row"><span class="icon-box">${icons.calendar}</span><span>DOB: ${personal.dob}</span></div>`);
                if (linkedinUrl) {
                  items.push(`<div class="contact-row"><span class="icon-box">${linkedinIcon}</span><span><a href="${linkedinUrl}" target="_blank">${cleanLinkedinLabel}</a></span></div>`);
                } else if (addressString) {
                  items.push(`<div class="contact-row"><span class="icon-box">${icons.location}</span><span>${addressString}</span></div>`);
                }
              } else {
                if (linkedinUrl) {
                  items.push(`<div class="contact-row"><span class="icon-box">${linkedinIcon}</span><span><a href="${linkedinUrl}" target="_blank">${cleanLinkedinLabel}</a></span></div>`);
                } else if (addressString) {
                  items.push(`<div class="contact-row"><span class="icon-box">${icons.location}</span><span>${addressString}</span></div>`);
                }
              }
              
              if (githubUrl) {
                items.push(`<div class="contact-row"><span class="icon-box">${githubIcon}</span><span><a href="${githubUrl}" target="_blank">${cleanGithubLabel}</a></span></div>`);
              }
              
              return items.join("");
            })()}
          </div>
        </header>

    

        ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
        <div class="section" data-section="availabilityWorkAuth">
          <div class="section-label">Availability</div>
          <div class="section-content">
            <div class="context-grid">
              ${availabilityWorkAuth.availabilityNoticePeriod ? `<div class="context-item"><span class="context-label">Notice Period:</span> ${availabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
              ${availabilityWorkAuth.workAuthorizationStatus ? `<div class="context-item"><span class="context-label">Work Auth:</span> ${availabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
              ${availabilityWorkAuth.preferredLocation ? `<div class="context-item"><span class="context-label">Preferred Location:</span> ${availabilityWorkAuth.preferredLocation}</div>` : ''}
            </div>
          </div>
        </div>
        ` : ''}

        ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
        <div class="section" data-section="careerObjective">
          <div class="section-label">Career Objective</div>
          <div class="section-content">
            <p class="summary-text">${careerObjective}</p>
          </div>
        </div>
        ` : ''}

        ${summary && summary.trim() ? `
        <div class="section" data-section="summary">
          <div class="section-label">Summary</div>
          <div class="section-content">
            <p class="summary-text">${summary}</p>
          </div>
        </div>` : ''}


       

        ${nonEmptyExperience.length > 0 ? `
        <div class="section" data-section="experience">
          <div class="section-label">Experience</div>
          <div class="section-content">
            ${nonEmptyExperience.map((exp, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${exp.title || ''}</span>
                  <span>${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                </div>
                <div class="company-line">${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</div>
                ${exp.description ? renderDescription(exp.description) : ''}
                ${exp.achievements ? `<p style="margin-top: 5px; color: ${currentTheme.textLight};"><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyProjects.length > 0 ? `
        <div class="section" data-section="projects">
          <div class="section-label">Projects</div>
          <div class="section-content">
            ${nonEmptyProjects.map((project, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${project.name || project.title || ''}</span>
                  <span>${project.duration || ''}</span>
                </div>
                ${project.role ? `<div class="company-line">Role: ${project.role}</div>` : ''}
                ${project.description ? renderDescription(project.description) : ''}
                ${project.technologies ? `<p style="color: ${currentTheme.textLight};"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyInternships.length > 0 ? `
        <div class="section" data-section="internships">
          <div class="section-label">Internships</div>
          <div class="section-content">
            ${nonEmptyInternships.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.title || ''}</span>
                  <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
                </div>
                <div class="company-line">${item.company || ''}</div>
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyTrainingPrograms.length > 0 ? `
        <div class="section" data-section="trainingPrograms">
          <div class="section-label">Training Programs</div>
          <div class="section-content">
            ${nonEmptyTrainingPrograms.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.name || ''}</span>
                  <span>${item.completionDate || ''}${item.duration ? ` (${item.duration})` : ''}</span>
                </div>
                <div class="company-line">${item.provider || item.organization || ''}</div>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyAcademicProjects.length > 0 ? `
        <div class="section" data-section="academicProjects">
          <div class="section-label">Academic Projects</div>
          <div class="section-content">
            ${nonEmptyAcademicProjects.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.name || item.title || ''}</span>
                  <span>${item.duration || ''}</span>
                </div>
                <div class="company-line">${item.institution || ''}${item.course ? ` | ${item.course}` : ''}</div>
                ${item.description ? renderDescription(item.description) : ''}
                ${item.technologies && item.technologies.length > 0 ? `<p style="color: ${currentTheme.textLight};"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
                ${item.url ? `<p style="color: ${currentTheme.textLight};"><strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

          ${nonEmptyEducation.length > 0 ? `
        <div class="section" data-section="education">
          <div class="section-label">Education</div>
          <div class="section-content">
            ${nonEmptyEducation.map((edu, idx) => {
    const dateParts = [];
    if (edu.startDate && edu.startDate.trim()) dateParts.push(edu.startDate.trim());
    if (edu.graduationDate && edu.graduationDate.trim()) dateParts.push(edu.graduationDate.trim());
    else if (edu.endDate && edu.endDate.trim()) dateParts.push(edu.endDate.trim());
    const dateRange = dateParts.length > 0 ? dateParts.join(" - ") : "";

    const schoolParts = [];
    if (edu.school && edu.school.trim()) schoolParts.push(edu.school.trim());
    if (edu.location && edu.location.trim()) schoolParts.push(edu.location.trim());
    const schoolLine = schoolParts.length > 0 ? schoolParts.join(", ") : "";

    const firstLine = [];
    if (schoolLine) firstLine.push(`<b>${schoolLine}</b>`);
    if (dateRange) firstLine.push(dateRange);

    return `
              <p class="edu-line" data-index="${idx}">
                ${firstLine.length > 0 ? firstLine.join(", ") + "<br/>" : ""}
                ${edu.degree || ''}${edu.field ? ' in ' + edu.field : ''}
                ${edu.grade ? `<br/><span style="font-size: ${smallTextFontSize}pt;">${edu.grade}</span>` : ''}
                ${edu.description ? `<br/><span style="font-size: ${smallTextFontSize}pt;">${edu.description}</span>` : ''}
              </p>
            `}).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyLeadershipPositions.length > 0 ? `
        <div class="section" data-section="leadershipPositions">
          <div class="section-label">Leadership Positions</div>
          <div class="section-content">
            ${nonEmptyLeadershipPositions.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.position || item.title || ''}</span>
                  <span>${formatDateRange(item.startDate, item.endDate) || ''}</span>
                </div>
                <div class="company-line">${item.organization || ''}</div>
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyCoCurricular.length > 0 ? `
        <div class="section" data-section="coCurricular">
          <div class="section-label">Co-curricular</div>
          <div class="section-content">
            ${nonEmptyCoCurricular.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.activity || ''}</span>
                  <span>${item.year || ''}</span>
                </div>
                ${item.role ? `<div class="company-line">Role: ${item.role}</div>` : ''}
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyExtracurricular.length > 0 ? `
        <div class="section" data-section="extracurricular">
          <div class="section-label">Extracurricular</div>
          <div class="section-content">
            ${nonEmptyExtracurricular.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.activity || ''}</span>
                  <span>${item.year || ''}</span>
                </div>
                ${item.role ? `<div class="company-line">Role: ${item.role}</div>` : ''}
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${(col1.length > 0 || col2.length > 0) ? `
        <div class="section" data-section="skills">
          <div class="section-label">Skills</div>
          <div class="section-content">
            <div class="skills-grid">
              ${col1.length > 0 ? `
              <ul class="bullet-list">
                ${col1.map((s, idx) => `<li data-index="${idx}">${s}</li>`).join('')}
              </ul>
              ` : ''}
              ${col2.length > 0 ? `
              <ul class="bullet-list">
                ${col2.map((s, idx) => `<li data-index="${col1.length + idx}">${s}</li>`).join('')}
              </ul>
              ` : ''}
            </div>
          </div>
        </div>` : ''}

        <!-- Core Competencies Section -->
${(coreCompCol1.length > 0 || coreCompCol2.length > 0) ? `
<div class="section" data-section="coreCompetencies">
  <div class="section-label">Core Competencies</div>
  <div class="section-content">
    <div class="skills-grid">
      ${coreCompCol1.length > 0 ? `
      <ul class="bullet-list">
        ${coreCompCol1.map((c, idx) => `<li data-index="${idx}">${c}</li>`).join('')}
      </ul>
      ` : ''}
      ${coreCompCol2.length > 0 ? `
      <ul class="bullet-list">
        ${coreCompCol2.map((c, idx) => `<li data-index="${coreCompCol1.length + idx}">${c}</li>`).join('')}
      </ul>
      ` : ''}
    </div>
  </div>
</div>` : ''}

        

        ${nonEmptyLanguages.length > 0 ? `
        <div class="section" data-section="languages">
          <div class="section-label">Languages</div>
          <div class="section-content">
            <ul class="bullet-list">
              ${nonEmptyLanguages.map((lang: any, idx) => `
                <li data-index="${idx}">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>
              `).join('')}
            </ul>
          </div>
        </div>` : ''}

        ${nonEmptyCertifications.length > 0 ? `
        <div class="section" data-section="certifications">
          <div class="section-label">Certifications</div>
          <div class="section-content">
            ${nonEmptyCertifications.map((cert, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${cert.name || ''}</span>
                  <span>${cert.date || ''}</span>
                </div>
                <div class="company-line">${cert.issuer || ''}</div>
                ${cert.url ? `<p style="color: ${currentTheme.textLight};"><a href="${cert.url}" target="_blank">${cert.url}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyAwards.length > 0 ? `
        <div class="section" data-section="awards">
          <div class="section-label">Awards</div>
          <div class="section-content">
            ${nonEmptyAwards.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.title || ''}</span>
                  <span>${item.issueYear || item.year || ''}</span>
                </div>
                <div class="company-line">${item.organization || ''}</div>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyScholarships.length > 0 ? `
        <div class="section" data-section="scholarships">
          <div class="section-label">Scholarships</div>
          <div class="section-content">
            ${nonEmptyScholarships.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.name || ''}</span>
                  <span>${item.year || ''}</span>
                </div>
                <div class="company-line">${item.provider || item.organization || ''}</div>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptySpeakingEngagements.length > 0 ? `
        <div class="section" data-section="speakingEngagements">
          <div class="section-label">Speaking Engagements</div>
          <div class="section-content">
            ${nonEmptySpeakingEngagements.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.topic || ''}</span>
                  <span>${item.date || ''}</span>
                </div>
                <div class="company-line">${item.eventName || ''}</div>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyMemberships.length > 0 ? `
        <div class="section" data-section="memberships">
          <div class="section-label">Memberships</div>
          <div class="section-content">
            ${nonEmptyMemberships.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.membershipName || ''}</span>
                  <span>${item.year || ''}</span>
                </div>
                <div class="company-line">${item.organizationName || item.organization || ''}</div>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyWorkshops.length > 0 ? `
        <div class="section" data-section="workshops">
          <div class="section-label">Workshops</div>
          <div class="section-content">
            ${nonEmptyWorkshops.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.programTitle || item.title || ''}</span>
                  <span>${item.year || ''}</span>
                </div>
                <div class="company-line">${item.conductedBy || ''}</div>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyClientProjects.length > 0 ? `
        <div class="section" data-section="clientProjects">
          <div class="section-label">Client Projects</div>
          <div class="section-content">
            ${nonEmptyClientProjects.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.name || ''}</span>
                  <span>${item.duration || ''}</span>
                </div>
                <div class="company-line">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</div>
                ${item.description ? renderDescription(item.description) : ''}
                ${item.toolsTechnologies ? `<p style="color: ${currentTheme.textLight};"><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ''}
                ${item.projectUrl ? `<p style="color: ${currentTheme.textLight};"><strong>URL:</strong> <a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyPortfolio.length > 0 ? `
        <div class="section" data-section="portfolio">
          <div class="section-label">Portfolio</div>
          <div class="section-content">
            ${nonEmptyPortfolio.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.name || ''}</span>
                  <span>${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</span>
                </div>
                ${item.url ? `<p style="color: ${currentTheme.textLight};"><a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyVolunteering.length > 0 ? `
        <div class="section" data-section="volunteering">
          <div class="section-label">Volunteering</div>
          <div class="section-content">
            ${nonEmptyVolunteering.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.role || ''}</span>
                  <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
                </div>
                <div class="company-line">${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}</div>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyMilitaryService.length > 0 ? `
        <div class="section" data-section="militaryService">
          <div class="section-label">Military Service</div>
          <div class="section-content">
            ${nonEmptyMilitaryService.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</span>
                  <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
                </div>
                ${item.specialization ? `<div class="company-line">Specialization: ${item.specialization}</div>` : ''}
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyToolsTechnologies.length > 0 ? `
        <div class="section" data-section="toolsTechnologies">
          <div class="section-label">Tools & Tech</div>
          <div class="section-content">
            ${nonEmptyToolsTechnologies.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.name || ''}</span>
                </div>
                ${item.category ? `<div class="company-line">Category: ${item.category}</div>` : ''}
                ${item.proficiency ? `<div class="company-line">Proficiency: ${item.proficiency}</div>` : ''}
                ${item.experienceDuration ? `<div class="company-line">Experience: ${item.experienceDuration}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyMethodologies.length > 0 ? `
        <div class="section" data-section="methodologies">
          <div class="section-label">Methodologies</div>
          <div class="section-content">
            ${nonEmptyMethodologies.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.name || ''}</span>
                </div>
                ${item.certification ? `<div class="company-line">Certification: ${item.certification}</div>` : ''}
                ${item.experienceDuration ? `<div class="company-line">Experience: ${item.experienceDuration}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyIndustryExpertise.length > 0 ? `
        <div class="section" data-section="industryExpertise">
          <div class="section-label">Industry Expertise</div>
          <div class="section-content">
            ${nonEmptyIndustryExpertise.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.industry || ''}</span>
                </div>
                ${item.domainArea ? `<div class="company-line">Domain: ${item.domainArea}</div>` : ''}
                ${item.experienceDuration ? `<div class="company-line">Experience: ${item.experienceDuration}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyTeachingExperience.length > 0 ? `
        <div class="section" data-section="teachingExperience">
          <div class="section-label">Teaching Experience</div>
          <div class="section-content">
            ${nonEmptyTeachingExperience.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.subjectCourseTaught || item.title || ''}</span>
                  <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
                </div>
                <div class="company-line">${item.institution || ''}</div>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyMentorshipExperience.length > 0 ? `
        <div class="section" data-section="mentorshipExperience">
          <div class="section-label">Mentorship Experience</div>
          <div class="section-content">
            ${nonEmptyMentorshipExperience.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.mentorshipArea || ''}</span>
                  <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
                </div>
                <div class="company-line">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</div>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyResearchGrants.length > 0 ? `
        <div class="section" data-section="researchGrants">
          <div class="section-label">Research Grants</div>
          <div class="section-content">
            ${nonEmptyResearchGrants.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.title || ''}</span>
                  <span>${item.year || ''}</span>
                </div>
                <div class="company-line">${item.agency || ''}${item.amount ? ` | Amount: ${item.amount}` : ''}</div>
                ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyTestScores.length > 0 ? `
        <div class="section" data-section="testScores">
          <div class="section-label">Test Scores</div>
          <div class="section-content">
            ${nonEmptyTestScores.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.testName || ''}</span>
                  <span>${item.year || ''}</span>
                </div>
                <div class="company-line">Score: ${item.score || ''}</div>
                ${item.percentileRank ? `<div class="company-line">Percentile: ${item.percentileRank}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyPublications.length > 0 ? `
        <div class="section" data-section="publications">
          <div class="section-label">Publications</div>
          <div class="section-content">
            ${nonEmptyPublications.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.title || ''}</span>
                  <span>${item.year || ''}</span>
                </div>
                <div class="company-line">${item.journalPublisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</div>
                ${item.urlDoi ? `<p style="color: ${currentTheme.textLight};"><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyPatents.length > 0 ? `
        <div class="section" data-section="patents">
          <div class="section-label">Patents</div>
          <div class="section-content">
            ${nonEmptyPatents.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.title || ''}</span>
                  <span>${item.year || ''}</span>
                </div>
                <div class="company-line">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</div>
                ${item.status ? `<div class="company-line">Status: ${item.status}</div>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptyReferences.length > 0 ? `
        <div class="section" data-section="references">
          <div class="section-label">References</div>
          <div class="section-content">
            ${nonEmptyReferences.map((item, idx) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header">
                  <span>${item.name || ''}</span>
                </div>
                <div class="company-line">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</div>
                ${item.contactInformation ? `<p style="color: ${currentTheme.textLight};">${item.contactInformation}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>` : ''}

        ${nonEmptySocialProfiles.length > 0 ? `
        <div class="section" data-section="socialProfiles">
          <div class="section-label">Social Profiles</div>
          <div class="section-content">
            <ul class="bullet-list">
              ${nonEmptySocialProfiles.map((item: any, idx) => `
                <li data-index="${idx}">${item.platform || 'Profile'}: <a href="${item.url || ''}" target="_blank">${item.url || ''}</a></li>
              `).join('')}
            </ul>
          </div>
        </div>` : ''}

        ${nonEmptyHobbies.length > 0 ? `
        <div class="section" data-section="hobbies">
          <div class="section-label">Hobbies</div>
          <div class="section-content">
            <ul class="bullet-list">
              ${nonEmptyHobbies.map((hobby: any, idx) => `<li data-index="${idx}">${typeof hobby === "string" ? hobby.trim() : hobby}</li>`).join('')}
            </ul>
          </div>
        </div>` : ''}

       
      </div>
    </body>
    </html>
  `;
}