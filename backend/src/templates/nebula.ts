export function buildNebulaTemplate(data: any, theme?: any): string {
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

  // Theme colors with dynamic text colors
  const defaultTheme = {
    primary: "#abc9eb",
    accent: "#4a90e2",
    background: "#ffffff",
    text: "#333333",
    textLight: "#666666",
  };

  const currentTheme = theme || defaultTheme;
  
  // User font settings
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14;
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || "'Georgia', serif";
  
  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 3.2);
  const subheadingFontSize = Math.round(userFontSize * 1.57);
  const jobTitleFontSize = Math.round(userFontSize * 1.29);
  const normalTextFontSize = Math.round(userFontSize * 1);
  const smallTextFontSize = Math.round(userFontSize * 0.93);
  
  // Typography settings from theme
  const typography = theme?.typography || {
    fontSize: "medium",
    alignment: "left",
    fontWeight: "normal",
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
  
  const currentAlignment = alignmentMap[typography.alignment as keyof typeof alignmentMap] || "left";
  const currentFontWeight = fontWeightMap[typography.fontWeight as keyof typeof fontWeightMap] || "400";

  // Icons for contact section
  const icons = {
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    mail: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
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

  // Helper to render skills (preserve HTML if present)
  const renderSkills = (skills: any): string => {
    if (!skills) return '';
    if (typeof skills === "string") {
      if (skills.includes('<ul>') || skills.includes('<li>')) {
        return `<div class="skills-html">${skills}</div>`;
      }
      const skillArray = skills.split(',').map(s => s.trim()).filter(s => s);
      if (skillArray.length === 0) return '';
      return `
        <ul class="sidebar-list">
          ${skillArray.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
      `;
    }
    if (Array.isArray(skills)) {
      if (skills.length === 0) return '';
      return `
        <ul class="sidebar-list">
          ${skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
      `;
    }
    return '';
  };

  const skillList = renderSkills(skills);
  
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

  const profileImage = personal.image || personal.photo || personal.avatar || "profile_placeholder.jpg";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        /* PAGE WRAPPER FIX */
        .page {
          display: flex;
          min-height: 100vh;
          page-break-after: always;
          break-inside: avoid;
        }
        
        .page:last-child {
          page-break-after: auto;
        }
        
        body {
          font-family: ${userFontFamily};
          background: white;
          color: ${currentTheme.text};
          font-size: ${baseFontSize}px;
          font-weight: ${currentFontWeight};
          text-align: ${currentAlignment};
        }

        .sidebar {
          width: 300px;
          background-color: ${currentTheme.primary};
          min-height: 100vh;
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          color: ${currentTheme.text};
          border-radius: 0;
          clip-path: polygon(
            0 0,
            calc(100% - 40px) 0,
            100% 40px,
            100% 100%,
            0 100%
          );
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .profile-container {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          overflow: hidden;
          border: 8px solid white;
          margin: 0 auto 40px auto;
        }
        .profile-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .sidebar-section { margin-bottom: 35px; }
        .sidebar-title {
          font-size: ${subheadingFontSize}px;
          font-weight: bold;
          margin-bottom: 15px;
          color: ${currentTheme.text};
        }
        .sidebar-content {
          font-size: ${smallTextFontSize}px;
          line-height: 1.6;
          color: ${currentTheme.textLight};
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
          font-size: ${smallTextFontSize}px;
          line-height: 1.4;
        }
        .contact-item svg {
          flex-shrink: 0;
          margin-top: 2px;
        }
        .contact-text {
          flex: 1;
        }
        .sidebar-list {
          list-style: none;
        }
        .sidebar-list li {
          margin-bottom: 10px;
          position: relative;
          padding-left: 15px;
          font-size: ${smallTextFontSize}px;
          color: ${currentTheme.textLight};
        }
        .sidebar-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: ${currentTheme.text};
        }
        
        /* Style for HTML skills with ul/li */
        .skills-html ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .skills-html li {
          margin-bottom: 10px;
          position: relative;
          padding-left: 15px;
          font-size: ${smallTextFontSize}px;
          color: ${currentTheme.textLight};
        }
        .skills-html li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: ${currentTheme.text};
        }

        /* Main Content Styling */
        .main-content {
          flex: 1;
          padding: 60px 50px;
          position: relative;
          background: white;
        }

        /* Header Accent - FIXED: Now positioned relative to name-header */
        .name-header {
          position: relative;
          z-index: 1;
          margin-bottom: 60px;
        }
        
        .header-accent {
          position: absolute;
          bottom: -30px;
          right: -50px;
          width: calc(100% + 50px);
          height: 25px;
          background-color: ${currentTheme.primary};
          transform: skewX(-45deg);
          z-index: 0;
          pointer-events: none;
        }
        
        .name-first {
          display: block;
          font-size: ${headingFontSize}px;
          color: ${currentTheme.accent};
          line-height: 1.2;
          word-break: break-word;
        }
        .name-last {
          display: block;
          font-size: ${headingFontSize}px;
          color: ${currentTheme.text};
          line-height: 1.2;
          word-break: break-word;
        }

        .content-section { 
          margin-bottom: 40px; 
          position: relative; 
          z-index: 1; 
        }
        .section-title {
          font-size: ${subheadingFontSize}px;
          font-weight: bold;
          margin-bottom: 15px;
          color: ${currentTheme.text};
        }
        .summary-text {
          font-size: ${normalTextFontSize}px;
          line-height: 1.8;
          text-align: justify;
          color: ${currentTheme.textLight};
        }

        /* Experience Layout */
        .exp-item { margin-bottom: 30px; }
        .job-title {
          font-size: ${jobTitleFontSize}px;
          font-weight: bold;
          margin-bottom: 5px;
          color: ${currentTheme.text};
        }
        .job-meta {
          font-size: ${smallTextFontSize}px;
          margin-bottom: 10px;
          color: ${currentTheme.textLight};
        }
        .bullet-list {
          list-style: none;
          padding-left: 5px;
        }
        .bullet-list li {
          font-size: ${normalTextFontSize}px;
          line-height: 1.6;
          margin-bottom: 8px;
          position: relative;
          padding-left: 20px;
          color: ${currentTheme.textLight};
        }
        .bullet-list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 7px;
          width: 5px;
          height: 5px;
          background-color: ${currentTheme.accent};
        }
        
        /* Style for HTML content with bullet points */
        .description-html ul, 
        .description-html ol {
          list-style: none;
          padding-left: 5px;
          margin: 5px 0;
        }
        .description-html li {
          font-size: ${normalTextFontSize}px;
          line-height: 1.6;
          margin-bottom: 8px;
          position: relative;
          padding-left: 20px;
          color: ${currentTheme.textLight};
        }
        .description-html li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 7px;
          width: 5px;
          height: 5px;
          background-color: ${currentTheme.accent};
        }
        .description-html p {
          margin-bottom: 8px;
          font-size: ${normalTextFontSize}px;
          color: ${currentTheme.textLight};
        }

        a {
          color: ${currentTheme.accent};
          text-decoration: none;
        }
        
        a:hover {
          text-decoration: underline;
        }

        /* Prevent content from breaking awkwardly */
        .exp-item, .content-section, .sidebar-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .sidebar { background-color: ${currentTheme.primary} !important; }
          .page {
            break-inside: avoid;
            page-break-after: always;
          }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <aside class="sidebar">
          <div class="profile-container" data-section="personal">
            <img src="${profileImage}" >
          </div>

          ${(personal.phone || personal.email || personal.alternatePhone || personal.fullAddress || personal.location || personal.country || personal.pinCode || personal.dob || personal.gender || personal.maritalStatus) ? `
          <div class="sidebar-section" data-section="personal">
            <h2 class="sidebar-title">Contact</h2>
            <div class="sidebar-content">
              ${personal.phone ? `
              <div class="contact-item">
                ${icons.phone}
                <span class="contact-text">${personal.phone}</span>
              </div>
              ` : ''}
              ${personal.alternatePhone ? `
              <div class="contact-item">
                ${icons.phone}
                <span class="contact-text">${personal.alternatePhone} (Alt)</span>
              </div>
              ` : ''}
              ${personal.email ? `
              <div class="contact-item">
                ${icons.mail}
                <span class="contact-text">${personal.email}</span>
              </div>
              ` : ''}
              ${personal.fullAddress ? `
              <div class="contact-item">
                ${icons.mapPin}
                <span class="contact-text">${personal.fullAddress}</span>
              </div>
              ` : ''}
              ${personal.location ? `
              <div class="contact-item">
                ${icons.location}
                <span class="contact-text">${personal.location}${personal.pinCode ? `, ${personal.pinCode}` : ''}</span>
              </div>
              ` : ''}
              ${personal.country ? `
              <div class="contact-item">
                ${icons.globe}
                <span class="contact-text">${personal.country}</span>
              </div>
              ` : ''}
              ${personal.pinCode && !personal.location ? `
              <div class="contact-item">
                ${icons.location}
                <span class="contact-text">${personal.pinCode}</span>
              </div>
              ` : ''}
              ${personal.dob ? `
              <div class="contact-item">
                ${icons.calendar}
                <span class="contact-text">DOB: ${personal.dob}</span>
              </div>
              ` : ''}
              ${personal.gender ? `
              <div class="contact-item">
                ${icons.user}
                <span class="contact-text">Gender: ${personal.gender}</span>
              </div>
              ` : ''}
              ${personal.maritalStatus ? `
              <div class="contact-item">
                ${icons.heart}
                <span class="contact-text">Marital: ${personal.maritalStatus}</span>
              </div>
              ` : ''}
            </div>
          </div>
          ` : ''}

          ${skillList ? `
          <div class="sidebar-section" data-section="skills">
            <h2 class="sidebar-title">Skills</h2>
            <div class="skills-html">${skillList}</div>
          </div>
          ` : ''}

          ${nonEmptyLanguages.length > 0 ? `
          <div class="sidebar-section" data-section="languages">
            <h2 class="sidebar-title">Languages</h2>
            <ul class="sidebar-list">
              ${nonEmptyLanguages.map((lang: any, idx: number) => `
                <li data-index="${idx}">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>
              `).join('')}
            </ul>
          </div>
          ` : ''}

          ${nonEmptyCertifications.length > 0 ? `
          <div class="sidebar-section" data-section="certifications">
            <h2 class="sidebar-title">Certifications</h2>
            <div class="sidebar-content">
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
              ${nonEmptyHobbies.map((hobby: any, idx: number) => `<li data-index="${idx}">${typeof hobby === "string" ? hobby.trim() : hobby}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          ${nonEmptySocialProfiles.length > 0 ? `
          <div class="sidebar-section" data-section="socialProfiles">
            <h2 class="sidebar-title">Social Profiles</h2>
            <div class="sidebar-content">
              ${nonEmptySocialProfiles.map((item: any, idx: number) => `
                <div style="margin-bottom: 8px;" data-index="${idx}">
                  <strong>${item.platform || 'Profile'}:</strong><br>
                  <a href="${item.url || ''}" style="color: ${currentTheme.text}; word-break: break-all;">${item.url || ''}</a>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          ${nonEmptyEducation.length > 0 ? `
          <div class="sidebar-section" data-section="education">
            <h2 class="sidebar-title">Education</h2>
            <div class="sidebar-content">
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

        <main class="main-content">
          <div class="name-header" data-section="personal">
            <span class="name-first">${(personal.name || "").split(' ')[0] || ''}</span>
            <span class="name-last">${(personal.name || "").split(' ').slice(1).join(' ') || ''}</span>
            <div class="header-accent"></div>
          </div>

          ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
          <div class="content-section" data-section="availabilityWorkAuth">
            <h2 class="section-title">Availability & Work Authorization</h2>
            <div style="font-size: ${normalTextFontSize}px; line-height: 1.8;">
              ${availabilityWorkAuth.availabilityNoticePeriod ? `<p><strong>Notice Period:</strong> ${availabilityWorkAuth.availabilityNoticePeriod}</p>` : ''}
              ${availabilityWorkAuth.workAuthorizationStatus ? `<p><strong>Work Authorization:</strong> ${availabilityWorkAuth.workAuthorizationStatus}</p>` : ''}
              ${availabilityWorkAuth.preferredLocation ? `<p><strong>Preferred Location:</strong> ${availabilityWorkAuth.preferredLocation}</p>` : ''}
            </div>
          </div>
          ` : ''}

          ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
          <div class="content-section" data-section="careerObjective">
            <h2 class="section-title">Career Objective</h2>
            <p class="summary-text">${careerObjective}</p>
          </div>
          ` : ''}

          ${summary && summary.trim() ? `
          <div class="content-section" data-section="summary">
            <h2 class="section-title">Summary</h2>
            <p class="summary-text">${summary}</p>
          </div>
          ` : ''}

          ${nonEmptyExperience.length > 0 ? `
          <div class="content-section" data-section="experience">
            <h2 class="section-title">Experience</h2>
            ${nonEmptyExperience.map((exp, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${exp.title || ''}</h3>
                <p class="job-meta">${exp.company || ''}${exp.location ? ` | ${exp.location}` : ''} | ${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</p>
                ${exp.description ? renderDescription(exp.description) : ''}
                ${exp.achievements ? `<p><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyProjects.length > 0 ? `
          <div class="content-section" data-section="projects">
            <h2 class="section-title">Projects</h2>
            ${nonEmptyProjects.map((project, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${project.name || project.title || ''}</h3>
                <p class="job-meta">${project.role ? `Role: ${project.role}` : ''}${project.duration ? ` | ${project.duration}` : ''}</p>
                ${project.description ? renderDescription(project.description) : ''}
                ${project.technologies ? `<p><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyInternships.length > 0 ? `
          <div class="content-section" data-section="internships">
            <h2 class="section-title">Internships</h2>
            ${nonEmptyInternships.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.title || ''}</h3>
                <p class="job-meta">${item.company || ''}${item.duration ? ` | ${item.duration}` : formatDateRange(item.startDate, item.endDate) ? ` | ${formatDateRange(item.startDate, item.endDate)}` : ''}</p>
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyTrainingPrograms.length > 0 ? `
          <div class="content-section" data-section="trainingPrograms">
            <h2 class="section-title">Training Programs</h2>
            ${nonEmptyTrainingPrograms.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.name || ''}</h3>
                <p class="job-meta">${item.provider || item.organization || ''}${item.completionDate ? ` | ${item.completionDate}` : ''}${item.duration ? ` | ${item.duration}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyAcademicProjects.length > 0 ? `
          <div class="content-section" data-section="academicProjects">
            <h2 class="section-title">Academic Projects</h2>
            ${nonEmptyAcademicProjects.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.name || item.title || ''}</h3>
                <p class="job-meta">${item.institution || ''}${item.course ? ` | ${item.course}` : ''}${item.duration ? ` | ${item.duration}` : ''}</p>
                ${item.description ? renderDescription(item.description) : ''}
                ${item.technologies && item.technologies.length > 0 ? `<p><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
                ${item.url ? `<p><strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyLeadershipPositions.length > 0 ? `
          <div class="content-section" data-section="leadershipPositions">
            <h2 class="section-title">Leadership Positions</h2>
            ${nonEmptyLeadershipPositions.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.position || item.title || ''}</h3>
                <p class="job-meta">${item.organization || ''}${item.startDate ? ` | ${item.startDate}` : ''}${item.endDate ? ` - ${item.endDate}` : ''}</p>
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyCoCurricular.length > 0 ? `
          <div class="content-section" data-section="coCurricular">
            <h2 class="section-title">Co-curricular Activities</h2>
            ${nonEmptyCoCurricular.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.activity || ''}</h3>
                <p class="job-meta">${item.role ? `Role: ${item.role}` : ''}${item.year ? ` | ${item.year}` : formatDateRange(item.startDate, item.endDate) ? ` | ${formatDateRange(item.startDate, item.endDate)}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyExtracurricular.length > 0 ? `
          <div class="content-section" data-section="extracurricular">
            <h2 class="section-title">Extracurricular Activities</h2>
            ${nonEmptyExtracurricular.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.activity || ''}</h3>
                <p class="job-meta">${item.role ? `Role: ${item.role}` : ''}${item.year ? ` | ${item.year}` : formatDateRange(item.startDate, item.endDate) ? ` | ${formatDateRange(item.startDate, item.endDate)}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyScholarships.length > 0 ? `
          <div class="content-section" data-section="scholarships">
            <h2 class="section-title">Scholarships</h2>
            ${nonEmptyScholarships.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.name || ''}</h3>
                <p class="job-meta">${item.provider || item.organization || ''}${item.year ? ` | ${item.year}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyAwards.length > 0 ? `
          <div class="content-section" data-section="awards">
            <h2 class="section-title">Awards</h2>
            ${nonEmptyAwards.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.title || ''}</h3>
                <p class="job-meta">${item.organization || ''}${item.issueYear ? ` | ${item.issueYear}` : item.year ? ` | ${item.year}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptySpeakingEngagements.length > 0 ? `
          <div class="content-section" data-section="speakingEngagements">
            <h2 class="section-title">Speaking Engagements</h2>
            ${nonEmptySpeakingEngagements.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.topic || ''}</h3>
                <p class="job-meta">${item.eventName || ''}${item.date ? ` | ${item.date}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyMemberships.length > 0 ? `
          <div class="content-section" data-section="memberships">
            <h2 class="section-title">Memberships</h2>
            ${nonEmptyMemberships.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.membershipName || ''}</h3>
                <p class="job-meta">${item.organizationName || item.organization || ''}${item.year ? ` | ${item.year}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyWorkshops.length > 0 ? `
          <div class="content-section" data-section="workshops">
            <h2 class="section-title">Workshops</h2>
            ${nonEmptyWorkshops.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.programTitle || item.title || ''}</h3>
                <p class="job-meta">${item.conductedBy || ''}${item.year ? ` | ${item.year}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyClientProjects.length > 0 ? `
          <div class="content-section" data-section="clientProjects">
            <h2 class="section-title">Client Projects</h2>
            ${nonEmptyClientProjects.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.name || ''}</h3>
                <p class="job-meta">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}${item.duration ? ` | ${item.duration}` : ''}</p>
                ${item.description ? renderDescription(item.description) : ''}
                ${item.toolsTechnologies ? `<p><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ''}
                ${item.projectUrl ? `<p><strong>URL:</strong> <a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyPortfolio.length > 0 ? `
          <div class="content-section" data-section="portfolio">
            <h2 class="section-title">Portfolio</h2>
            ${nonEmptyPortfolio.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.name || ''}</h3>
                <p class="job-meta">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</p>
                ${item.url ? `<p><a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyVolunteering.length > 0 ? `
          <div class="content-section" data-section="volunteering">
            <h2 class="section-title">Volunteering</h2>
            ${nonEmptyVolunteering.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.role || ''}</h3>
                <p class="job-meta">${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}${item.duration ? ` | ${item.duration}` : formatDateRange(item.startDate, item.endDate) ? ` | ${formatDateRange(item.startDate, item.endDate)}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyMilitaryService.length > 0 ? `
          <div class="content-section" data-section="militaryService">
            <h2 class="section-title">Military Service</h2>
            ${nonEmptyMilitaryService.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</h3>
                <p class="job-meta">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</p>
                ${item.specialization ? `<p><strong>Specialization:</strong> ${item.specialization}</p>` : ''}
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyToolsTechnologies.length > 0 ? `
          <div class="content-section" data-section="toolsTechnologies">
            <h2 class="section-title">Tools & Technologies</h2>
            ${nonEmptyToolsTechnologies.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title" style="font-size: ${jobTitleFontSize * 0.9}px;">${item.name || ''}</h3>
                ${item.category ? `<p><strong>Category:</strong> ${item.category}</p>` : ''}
                ${item.proficiency ? `<p><strong>Proficiency:</strong> ${item.proficiency}</p>` : ''}
                ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyMethodologies.length > 0 ? `
          <div class="content-section" data-section="methodologies">
            <h2 class="section-title">Methodologies</h2>
            ${nonEmptyMethodologies.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title" style="font-size: ${jobTitleFontSize * 0.9}px;">${item.name || ''}</h3>
                ${item.certification ? `<p><strong>Certification:</strong> ${item.certification}</p>` : ''}
                ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyIndustryExpertise.length > 0 ? `
          <div class="content-section" data-section="industryExpertise">
            <h2 class="section-title">Industry Expertise</h2>
            ${nonEmptyIndustryExpertise.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title" style="font-size: ${jobTitleFontSize * 0.9}px;">${item.industry || ''}</h3>
                ${item.domainArea ? `<p><strong>Domain:</strong> ${item.domainArea}</p>` : ''}
                ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyTeachingExperience.length > 0 ? `
          <div class="content-section" data-section="teachingExperience">
            <h2 class="section-title">Teaching Experience</h2>
            ${nonEmptyTeachingExperience.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.subjectCourseTaught || item.title || ''}</h3>
                <p class="job-meta">${item.institution || ''}${item.duration ? ` | ${item.duration}` : formatDateRange(item.startDate, item.endDate) ? ` | ${formatDateRange(item.startDate, item.endDate)}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyMentorshipExperience.length > 0 ? `
          <div class="content-section" data-section="mentorshipExperience">
            <h2 class="section-title">Mentorship Experience</h2>
            ${nonEmptyMentorshipExperience.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.mentorshipArea || ''}</h3>
                <p class="job-meta">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}${item.duration ? ` | ${item.duration}` : formatDateRange(item.startDate, item.endDate) ? ` | ${formatDateRange(item.startDate, item.endDate)}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyResearchGrants.length > 0 ? `
          <div class="content-section" data-section="researchGrants">
            <h2 class="section-title">Research Grants</h2>
            ${nonEmptyResearchGrants.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.title || ''}</h3>
                <p class="job-meta">${item.agency || ''}${item.amount ? ` | ${item.amount}` : ''}${item.year ? ` | ${item.year}` : ''}</p>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyTestScores.length > 0 ? `
          <div class="content-section" data-section="testScores">
            <h2 class="section-title">Test Scores</h2>
            ${nonEmptyTestScores.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title" style="font-size: ${jobTitleFontSize * 0.9}px;">${item.testName || ''}</h3>
                <p><strong>Score:</strong> ${item.score || ''}</p>
                ${item.year ? `<p><strong>Year:</strong> ${item.year}</p>` : ''}
                ${item.percentileRank ? `<p><strong>Percentile:</strong> ${item.percentileRank}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyPublications.length > 0 ? `
          <div class="content-section" data-section="publications">
            <h2 class="section-title">Publications</h2>
            ${nonEmptyPublications.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.title || ''}</h3>
                <p class="job-meta">${item.journalPublisher || ''}${item.year ? ` | ${item.year}` : ''}${item.publicationType ? ` (${item.publicationType})` : ''}</p>
                ${item.urlDoi ? `<p><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyPatents.length > 0 ? `
          <div class="content-section" data-section="patents">
            <h2 class="section-title">Patents</h2>
            ${nonEmptyPatents.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.title || ''}</h3>
                <p class="job-meta">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}${item.year ? ` | ${item.year}` : ''}</p>
                ${item.status ? `<p><strong>Status:</strong> ${item.status}</p>` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${nonEmptyReferences.length > 0 ? `
          <div class="content-section" data-section="references">
            <h2 class="section-title">References</h2>
            ${nonEmptyReferences.map((item, idx) => `
              <div class="exp-item" data-index="${idx}">
                <h3 class="job-title">${item.name || ''}</h3>
                <p class="job-meta">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</p>
                ${item.contactInformation ? `<p>${item.contactInformation}</p>` : ''}
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