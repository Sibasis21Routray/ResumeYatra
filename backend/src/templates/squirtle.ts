export function buildSquirtleTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#373737', // Dark charcoal for sidebar
    secondary: '#ffffff', // White text for sidebar
    background: '#ffffff',
    headingFont: 'Libre Baskerville',
    bodyFont: 'Source Sans Pro'
  }
  
  // --- PRESERVED LOGIC START ---
  const currentTheme = theme || defaultTheme

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 12 // Default 12px
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Inter, sans-serif'

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize
  const headingFontSize = Math.round(userFontSize * 2.25) // 2.25x base size
  const subheadingFontSize = Math.round(userFontSize * 1.125) // 1.125x base size
  // --- PRESERVED LOGIC END ---

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
  const nonEmptyProfessionalContext = data.professionalContext && hasObjectValues(data.professionalContext) ? data.professionalContext : null;
  const nonEmptyAvailabilityWorkAuth = data.availabilityWorkAuth && hasObjectValues(data.availabilityWorkAuth) ? data.availabilityWorkAuth : null;

  // SVG Icons for sidebar (White color)
  const icons = {
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    link: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`
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
      background: #555; /* Dark background for the whole page context */
      font-size: ${baseFontSize}px;
    }
    
    .container {
      max-width: 850px;
      min-height: 1000px; /* Ensure full page height simulation */
      margin: 0 auto;
      background: #ffffff;
      display: flex;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      padding: 40px 50px;
    }

    /* --- SIDEBAR STYLES --- */
    .sidebar {
      width: 40%;
      background-color: ${currentTheme.primary};
      color: #ffffff;
      padding: 40px 25px;
      display: flex;
      flex-direction: column;
    }

    .name-header {
      font-family: 'Times New Roman', serif; /* Matching the serif look in image */
      font-size: ${Math.round(headingFontSize)}px;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 1.1;
      margin-bottom: 40px;
      letter-spacing: 1px;
      color: #ffffff;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding-bottom: 20px;
    }

    .sidebar-section {
      margin-bottom: 30px;
    }

    .sidebar-title {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 15px;
      letter-spacing: 1px;
      color: #ffffff;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding-bottom: 5px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      font-size: ${baseFontSize}px;
      color: #ffffff;
      word-break: break-word;
    }

    .contact-icon {
      margin-right: 10px;
      display: flex;
      align-items: center;
      min-width: 20px;
    }

    .contact-item a {
      color: #ffffff;
      text-decoration: none;
    }

    .contact-item a:hover {
      text-decoration: underline;
    }

    .sidebar-list {
      list-style: none;
      padding: 0;
    }

    .sidebar-list-item {
      margin-bottom: 8px;
      font-size: ${baseFontSize}px;
      color: #ffffff;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 4px;
    }
    
    .sidebar-list-item:last-child {
        border-bottom: none;
    }

    /* --- MAIN CONTENT STYLES --- */
    .main-content {
      width: 65%;
      background-color: #ffffff;
      padding: 40px 30px;
    }

    .main-section {
      margin-bottom: 30px;
    }

    .main-section-title {
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      font-weight: 700;
      text-transform: uppercase;
      color: ${currentTheme.primary};
      margin-bottom: 15px;
      border-bottom: 2px solid ${currentTheme.primary};
      padding-bottom: 5px;
      letter-spacing: 0.5px;
    }

    .entry {
      margin-bottom: 20px;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
      flex-wrap: wrap;
      gap: 8px;
    }

    .entry-title {
      font-weight: 700;
      font-size: ${subheadingFontSize}px;
      color: ${currentTheme.primary};
      text-transform: uppercase;
    }

    .entry-date {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      font-style: italic;
      color: ${currentTheme.primary};
      white-space: nowrap;
    }

    .entry-subtitle {
      font-weight: 600;
      font-size: ${baseFontSize}px;
      color: ${currentTheme.primary};
      margin-bottom: 8px;
    }

    .entry-description {
      font-size: ${baseFontSize}px;
      color: #333333;
      line-height: 1.6;
    }

    .entry-description ul {
      margin: 5px 0 5px 20px;
      padding: 0;
      list-style-type: disc;
    }
    
    .entry-description li {
      margin-bottom: 3px;
      color: #333333;
    }

    .summary-text {
      font-size: ${baseFontSize}px;
      line-height: 1.6;
      color: #333333;
    }

    /* Enhanced Education Styles */
    .education-field {
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 4px;
      font-size: ${Math.round(baseFontSize * 0.95)}px;
    }

    .education-school {
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 4px;
    }

    .education-location {
      color: ${currentTheme.primary};
      font-style: italic;
      margin-bottom: 6px;
    }

    .education-description {
      font-size: ${baseFontSize}px;
      color: #333333;
      line-height: 1.6;
      margin-top: 6px;
      padding: 10px;
      background: #f8f8f8;
      border-left: 3px solid ${currentTheme.primary};
      border-radius: 2px;
    }

    .education-description ul {
      margin: 5px 0 5px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .education-description li {
      margin: 3px 0;
      color: #333333;
    }

    .education-description b {
      font-weight: 700;
      color: ${currentTheme.primary};
    }

    .education-achievements {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #ddd;
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .education-achievements ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }

    .education-achievements li {
      position: relative;
      padding-left: 16px;
      margin-bottom: 4px;
      color: #333333;
      font-size: ${baseFontSize}px;
    }

    .education-achievements li:before {
      content: "◆";
      color: ${currentTheme.primary};
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    /* Metrics Grid for Professional Context */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin: 15px 0;
    }

    .metric-item {
      background: #f8f8f8;
      padding: 10px;
      border-left: 3px solid ${currentTheme.primary};
    }

    .metric-value {
      font-weight: 700;
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      color: ${currentTheme.primary};
    }

    .metric-label {
      font-size: ${Math.round(baseFontSize * 0.8)}px;
      color: ${currentTheme.primary};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }

    .tag {
      background: #f0f0f0;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: #333333;
    }

    .tag a {
      color: ${currentTheme.primary};
      text-decoration: none;
    }

    @media print {
      body { background: none; -webkit-print-color-adjust: exact; }
      .container { width: 100%; max-width: none; box-shadow: none; margin: 0; height: auto; min-height: 0; }
      .sidebar { background-color: #373737 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; height: 100%; }
      .main-content { height: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar" data-section="personal">
      <div class="name-header" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Your Name'}${data.personal?.middleName ? ` ${data.personal.middleName}` : ''}</div>
      ${data.personal?.role ? `<div style="font-size: 16px; margin-bottom: 20px; font-weight: 600; color: #ffffff;" data-section="personal">${data.personal.role}</div>` : ''}

      <div class="sidebar-section" data-section="personal">
        <div class="sidebar-title" data-section="personal">Contact</div>
        ${data.personal?.phone ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.phone}</span>📞 ${data.personal.phone}</div>` : ''}
        ${data.personal?.alternatePhone ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.phone}</span>📞 ${data.personal.alternatePhone}</div>` : ''}
        ${data.personal?.email ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.email}</span>✉️ ${data.personal.email}</div>` : ''}
        ${(() => {
          const addressParts = [
            data.personal?.fullAddress,
            data.personal?.location,
            data.personal?.country,
            data.personal?.pinCode
          ].filter(Boolean);
          return addressParts.length > 0 ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>📍 ${addressParts.join(', ')}</div>` : '';
        })()}
        ${data.personal?.fathersName ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>👨 Father: ${data.personal.fathersName}</div>` : ''}
        ${data.personal?.dob ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>📅 DOB: ${data.personal.dob}</div>` : ''}
        ${data.personal?.maritalStatus ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>💍 Marital: ${data.personal.maritalStatus}</div>` : ''}
        ${data.personal?.gender ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>⚥ Gender: ${data.personal.gender}</div>` : ''}
        ${data.personal?.nationality ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>🌍 Nationality: ${data.personal.nationality}</div>` : ''}
        ${data.personal?.passportNo ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>🛂 Passport: ${data.personal.passportNo}</div>` : ''}
        ${data.personal?.linkedinUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span>🔗 <a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>` : ''}
        ${data.personal?.githubUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span>🐙 <a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>` : ''}
        ${data.personal?.portfolioUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span>💼 <a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>` : ''}
        ${data.personal?.website ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span>🌐 <a href="${data.personal.website}" target="_blank">Website</a></div>` : ''}
        ${data.personal?.twitterUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span>🐦 <a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></div>` : ''}
        ${data.personal?.facebookUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span>📘 <a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></div>` : ''}
        ${data.personal?.instagramUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span>📷 <a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></div>` : ''}
        ${data.personal?.behanceUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span>🎨 <a href="${data.personal.behanceUrl}" target="_blank">Behance</a></div>` : ''}
        ${data.personal?.dribbbleUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span>🏀 <a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></div>` : ''}
        ${data.personal?.stackoverflowUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span>📚 <a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></div>` : ''}
        ${data.personal?.mediumUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span>📝 <a href="${data.personal.mediumUrl}" target="_blank">Medium</a></div>` : ''}
      </div>

      <!-- Professional Context in Sidebar -->
      ${nonEmptyProfessionalContext ? `
      <div class="sidebar-section" data-section="professionalContext">
        <div class="sidebar-title">Professional Context</div>
        ${nonEmptyProfessionalContext.totalExperience ? `
        <div class="contact-item">
          <span class="contact-icon">⏱️</span>Experience: ${nonEmptyProfessionalContext.totalExperience}
        </div>` : ''}
        ${nonEmptyProfessionalContext.teamSize ? `
        <div class="contact-item">
          <span class="contact-icon">👥</span>Team Size: ${nonEmptyProfessionalContext.teamSize}
        </div>` : ''}
        ${nonEmptyProfessionalContext.industry ? `
        <div class="contact-item">
          <span class="contact-icon">🏢</span>Industry: ${nonEmptyProfessionalContext.industry}
        </div>` : ''}
        ${nonEmptyProfessionalContext.functionalDomain ? `
        <div class="contact-item">
          <span class="contact-icon">📊</span>Domain: ${nonEmptyProfessionalContext.functionalDomain}
        </div>` : ''}
        ${nonEmptyProfessionalContext.geographicScope ? `
        <div class="contact-item">
          <span class="contact-icon">🌎</span>Scope: ${nonEmptyProfessionalContext.geographicScope}
        </div>` : ''}
        ${nonEmptyProfessionalContext.revenueResponsibility ? `
        <div class="contact-item">
          <span class="contact-icon">💰</span>Revenue: ${nonEmptyProfessionalContext.revenueResponsibility}
        </div>` : ''}
      </div>` : ''}

      <!-- Availability & Work Auth -->
      ${nonEmptyAvailabilityWorkAuth ? `
      <div class="sidebar-section" data-section="availabilityWorkAuth">
        <div class="sidebar-title">Availability</div>
        ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `
        <div class="contact-item">
          <span class="contact-icon">📅</span>Notice: ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}
        </div>` : ''}
        ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `
        <div class="contact-item">
          <span class="contact-icon">🪪</span>Work Auth: ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}
        </div>` : ''}
        ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `
        <div class="contact-item">
          <span class="contact-icon">📍</span>Preferred: ${nonEmptyAvailabilityWorkAuth.preferredLocation}
        </div>` : ''}
      </div>` : ''}

      <!-- Skills -->
      ${nonEmptySkills.length > 0 ? `
      <div class="sidebar-section" data-section="skills">
        <div class="sidebar-title">Skills</div>
        <ul class="sidebar-list">
          ${nonEmptySkills.map((skill: any, index: number) => `
            <li class="sidebar-list-item" data-section="skills" data-index="${index}">${typeof skill === 'string' ? skill.trim() : skill}</li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Tools & Technologies -->
      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="sidebar-section" data-section="toolsTechnologies">
        <div class="sidebar-title">Tools & Technologies</div>
        <ul class="sidebar-list">
          ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
            <li class="sidebar-list-item" data-section="toolsTechnologies" data-index="${index}">
              ${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}
            </li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Methodologies -->
      ${nonEmptyMethodologies.length > 0 ? `
      <div class="sidebar-section" data-section="methodologies">
        <div class="sidebar-title">Methodologies</div>
        <ul class="sidebar-list">
          ${nonEmptyMethodologies.map((item: any, index: number) => `
            <li class="sidebar-list-item" data-section="methodologies" data-index="${index}">
              ${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}
            </li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Industry Expertise -->
      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="sidebar-section" data-section="industryExpertise">
        <div class="sidebar-title">Industry Expertise</div>
        <ul class="sidebar-list">
          ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
            <li class="sidebar-list-item" data-section="industryExpertise" data-index="${index}">
              ${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}
            </li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Languages -->
      ${nonEmptyLanguages.length > 0 ? `
      <div class="sidebar-section" data-section="languages">
        <div class="sidebar-title">Languages</div>
        <ul class="sidebar-list">
          ${nonEmptyLanguages.map((lang: any, index: number) => `
            <li class="sidebar-list-item" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Hobbies -->
      ${nonEmptyHobbies.length > 0 ? `
      <div class="sidebar-section" data-section="hobbies">
        <div class="sidebar-title">Hobbies</div>
        <ul class="sidebar-list">
          ${nonEmptyHobbies.map((hobby: any, index: number) => `
            <li class="sidebar-list-item" data-section="hobbies" data-index="${index}">${hobby}</li>
          `).join('')}
        </ul>
      </div>` : ''}

      <!-- Social Links -->
      ${nonEmptySocialLinks.length > 0 ? `
      <div class="sidebar-section" data-section="socialLinks">
        <div class="sidebar-title">Social Links</div>
        <div style="display: flex; flex-direction: column; gap: 8px;" data-section="socialLinks">
          ${nonEmptySocialLinks.map((link: any, index: number) => `
            <a href="${link.url}" target="_blank" style="color: #ffffff; text-decoration: none; font-size: ${baseFontSize}px;" data-section="socialLinks" data-index="${index}">🔗 ${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Social Profiles -->
      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="sidebar-section" data-section="socialProfiles">
        <div class="sidebar-title">Social Profiles</div>
        <div style="display: flex; flex-direction: column; gap: 8px;" data-section="socialProfiles">
          ${nonEmptySocialProfiles.map((profile: any, index: number) => `
            <a href="${profile.url}" target="_blank" style="color: #ffffff; text-decoration: none; font-size: ${baseFontSize}px;" data-section="socialProfiles" data-index="${index}">👤 ${profile.platform || "Profile"}</a>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- References -->
      ${nonEmptyReferences.length > 0 ? `
      <div class="sidebar-section" data-section="references">
        <div class="sidebar-title">References</div>
        ${nonEmptyReferences.map((ref: any, index: number) => `
          <div class="contact-item" data-section="references" data-index="${index}">
            <span class="contact-icon">👤</span>
            <div>
              <div><strong>${ref.name || ''}</strong></div>
              ${ref.designationRelationship ? `<div>${ref.designationRelationship}</div>` : ''}
              ${ref.organization ? `<div>${ref.organization}</div>` : ''}
              ${ref.contactInformation ? `<div>${ref.contactInformation}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}
    </div>

    <div class="main-content">

      <!-- Professional Context (also in main if needed) -->
      ${nonEmptyProfessionalContext ? `
      <div class="main-section" data-section="professionalContext">
        <div class="main-section-title">Professional Context</div>
        <div class="metrics-grid">
          ${nonEmptyProfessionalContext.totalExperience ? `
          <div class="metric-item">
            <div class="metric-value">${nonEmptyProfessionalContext.totalExperience}</div>
            <div class="metric-label">Total Experience</div>
          </div>` : ''}
          ${nonEmptyProfessionalContext.teamSize ? `
          <div class="metric-item">
            <div class="metric-value">${nonEmptyProfessionalContext.teamSize}</div>
            <div class="metric-label">Team Size</div>
          </div>` : ''}
          ${nonEmptyProfessionalContext.industry ? `
          <div class="metric-item">
            <div class="metric-value">${nonEmptyProfessionalContext.industry}</div>
            <div class="metric-label">Industry</div>
          </div>` : ''}
          ${nonEmptyProfessionalContext.functionalDomain ? `
          <div class="metric-item">
            <div class="metric-value">${nonEmptyProfessionalContext.functionalDomain}</div>
            <div class="metric-label">Domain</div>
          </div>` : ''}
          ${nonEmptyProfessionalContext.geographicScope ? `
          <div class="metric-item">
            <div class="metric-value">${nonEmptyProfessionalContext.geographicScope}</div>
            <div class="metric-label">Geographic Scope</div>
          </div>` : ''}
          ${nonEmptyProfessionalContext.revenueResponsibility ? `
          <div class="metric-item">
            <div class="metric-value">${nonEmptyProfessionalContext.revenueResponsibility}</div>
            <div class="metric-label">Revenue Responsibility</div>
          </div>` : ''}
        </div>
      </div>` : ''}

      <!-- Availability & Work Auth -->
      ${nonEmptyAvailabilityWorkAuth ? `
      <div class="main-section" data-section="availabilityWorkAuth">
        <div class="main-section-title">Availability</div>
        <div class="tags-container">
          ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<span class="tag">📅 Notice: ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</span>` : ''}
          ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<span class="tag">🪪 Work Auth: ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</span>` : ''}
          ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<span class="tag">📍 Preferred: ${nonEmptyAvailabilityWorkAuth.preferredLocation}</span>` : ''}
        </div>
      </div>` : ''}

      <!-- Summary -->
      ${data.summary && data.summary.trim() ? `
      <div class="main-section" data-section="summary">
        <div class="main-section-title">Profile</div>
        <div class="summary-text">${data.summary}</div>
      </div>` : ''}

      <!-- Career Objective -->
      ${data.careerObjective && data.careerObjective.trim() ? `
      <div class="main-section" data-section="careerObjective">
        <div class="main-section-title">Career Objective</div>
        <div class="summary-text">${data.careerObjective}</div>
      </div>` : ''}

      <!-- Work Experience -->
      ${hasNonEmptyItems(data.experience) ? `
      <div class="main-section" data-section="experience">
        <div class="main-section-title">Work Experience</div>
        ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
          const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
          const subtitle = formatSubtitle([exp.company, exp.location, exp.domain]);
          
          return `
          <div class="entry" data-section="experience" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${exp.title || ''}</div>
              ${dateRange ? `<div class="entry-date">${dateRange}</div>` : ''}
            </div>
            ${subtitle ? `<div class="entry-subtitle">${subtitle}</div>` : ''}
            ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
            ${exp.achievements ? `<div class="entry-description" style="margin-top: 5px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ''}
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Internships -->
      ${nonEmptyInternships.length > 0 ? `
      <div class="main-section" data-section="internships">
        <div class="main-section-title">Internships</div>
        ${nonEmptyInternships.map((item: any, index: number) => {
          const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
          const subtitle = formatSubtitle([item.company, item.location]);
          
          return `
          <div class="entry" data-section="internships" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.title || ''}</div>
              ${dateRange ? `<div class="entry-date">${dateRange}</div>` : ''}
            </div>
            ${subtitle ? `<div class="entry-subtitle">${subtitle}</div>` : ''}
            ${item.description ? `<div class="entry-description">${item.description}</div>` : ''}
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Training Programs -->
      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="main-section" data-section="trainingPrograms">
        <div class="main-section-title">Training Programs</div>
        ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
          <div class="entry" data-section="trainingPrograms" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.name || ''}</div>
              ${item.completionDate ? `<div class="entry-date">${item.completionDate}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
            ${item.description ? `<div class="entry-description">${item.description}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Education -->
      ${hasNonEmptyItems(data.education) ? `
      <div class="main-section" data-section="education">
        <div class="main-section-title">Education</div>
        ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
          <div class="entry" data-section="education" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">
                ${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}${edu.qualification ? ` (${edu.qualification})` : ''}
              </div>
              ${edu.graduationDate ? `<div class="entry-date">${edu.graduationDate}</div>` : ''}
            </div>
            
            ${edu.school ? `<div class="education-school">${edu.school}${edu.location ? `, ${edu.location}` : ''}</div>` : ''}
            ${edu.grade ? `<div class="education-field">Grade: ${edu.grade}</div>` : ''}
            
            ${edu.description ? `
              <div class="education-description">
                ${edu.description}
              </div>
            ` : ''}
            
            ${edu.achievements && edu.achievements.length > 0 ? `
              <div class="education-achievements">
                <h4>Academic Recognition</h4>
                <ul>
                  ${edu.achievements.filter((achievement: string) => achievement.trim()).map((achievement: string, achIndex: number) => 
                    `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`
                  ).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Academic Projects -->
      ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="main-section" data-section="academicProjects">
        <div class="main-section-title">Academic Projects</div>
        ${nonEmptyAcademicProjects.map((item: any, index: number) => `
          <div class="entry" data-section="academicProjects" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.name || item.title || ''}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
            ${item.technologies ? `<div class="entry-description" style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
            ${item.url ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Project</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Client Projects -->
      ${nonEmptyClientProjects.length > 0 ? `
      <div class="main-section" data-section="clientProjects">
        <div class="main-section-title">Client Projects</div>
        ${nonEmptyClientProjects.map((item: any, index: number) => `
          <div class="entry" data-section="clientProjects" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.name || ''}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
            ${item.toolsTechnologies ? `<div class="entry-description"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ''}
            ${item.projectUrl ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Project</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Portfolio -->
      ${nonEmptyPortfolio.length > 0 ? `
      <div class="main-section" data-section="portfolio">
        <div class="main-section-title">Portfolio</div>
        ${nonEmptyPortfolio.map((item: any, index: number) => `
          <div class="entry" data-section="portfolio" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.name || ''}</div>
              <div class="entry-date">${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ''])}</div>
            </div>
            <div class="entry-description">${item.description || ''}</div>
            ${item.url ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Portfolio</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Projects -->
      ${nonEmptyProjects.length > 0 ? `
      <div class="main-section" data-section="projects">
        <div class="main-section-title">Projects</div>
        ${nonEmptyProjects.map((project: any, index: number) => {
          const dateRange = formatDateRange(project.startDate, project.endDate);
          
          return `
          <div class="entry" data-section="projects" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${project.name || ''}</div>
              ${dateRange ? `<div class="entry-date">${dateRange}</div>` : ''}
            </div>
            <div class="entry-subtitle">${project.technologies || ''}</div>
            <div class="entry-description">${project.description || ''}</div>
            ${project.url ? `<div class="entry-description" style="margin-top:5px;"><a href="${project.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">${project.urlText || 'View Project'}</a></div>` : ''}
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Leadership Positions -->
      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="main-section" data-section="leadershipPositions">
        <div class="main-section-title">Leadership & Positions</div>
        ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
          const dateRange = formatDateRange(item.startDate, item.endDate);
          
          return `
          <div class="entry" data-section="leadershipPositions" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.position || item.title || ''}</div>
              ${dateRange ? `<div class="entry-date">${dateRange}</div>` : ''}
            </div>
            <div class="entry-subtitle">${item.organization || ''}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        `}).join('')}
      </div>` : ''}

      <!-- Volunteering -->
      ${nonEmptyVolunteering.length > 0 ? `
      <div class="main-section" data-section="volunteering">
        <div class="main-section-title">Volunteering</div>
        ${nonEmptyVolunteering.map((item: any, index: number) => `
          <div class="entry" data-section="volunteering" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.role || ''}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.causeArea])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Military Service -->
      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="main-section" data-section="militaryService">
        <div class="main-section-title">Military Service</div>
        ${nonEmptyMilitaryService.map((item: any, index: number) => `
          <div class="entry" data-section="militaryService" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.rank ? item.rank : ''}${item.rank && item.branch ? ' - ' : ''}${item.branch || ''}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ''}
            </div>
            ${item.specialization ? `<div class="entry-subtitle">${item.specialization}</div>` : ''}
            <div class="entry-description">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Teaching Experience -->
      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="main-section" data-section="teachingExperience">
        <div class="main-section-title">Teaching Experience</div>
        ${nonEmptyTeachingExperience.map((item: any, index: number) => `
          <div class="entry" data-section="teachingExperience" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.subjectCourseTaught || item.title || ''}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.institution])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Mentorship Experience -->
      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="main-section" data-section="mentorshipExperience">
        <div class="main-section-title">Mentorship Experience</div>
        ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
          <div class="entry" data-section="mentorshipExperience" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.mentorshipArea || ''}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Research Grants -->
      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="main-section" data-section="researchGrants">
        <div class="main-section-title">Research Grants</div>
        ${nonEmptyResearchGrants.map((item: any, index: number) => `
          <div class="entry" data-section="researchGrants" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.title || ''}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Publications -->
      ${nonEmptyPublications.length > 0 ? `
      <div class="main-section" data-section="publications">
        <div class="main-section-title">Publications</div>
        ${nonEmptyPublications.map((item: any, index: number) => `
          <div class="entry" data-section="publications" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.title || ''}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
            ${item.authors ? `<div class="entry-description"><strong>Authors:</strong> ${item.authors}</div>` : ''}
            ${item.urlDoi ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Publication</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Patents -->
      ${nonEmptyPatents.length > 0 ? `
      <div class="main-section" data-section="patents">
        <div class="main-section-title">Patents</div>
        ${nonEmptyPatents.map((item: any, index: number) => `
          <div class="entry" data-section="patents" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.title || ''}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : '', item.issuingAuthority])}</div>
            ${item.status ? `<div class="entry-description"><strong>Status:</strong> ${item.status}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Test Scores -->
      ${nonEmptyTestScores.length > 0 ? `
      <div class="main-section" data-section="testScores">
        <div class="main-section-title">Test Scores</div>
        ${nonEmptyTestScores.map((item: any, index: number) => `
          <div class="entry" data-section="testScores" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.testName || ''}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
            </div>
            <div class="entry-subtitle">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Scholarships -->
      ${nonEmptyScholarships.length > 0 ? `
      <div class="main-section" data-section="scholarships">
        <div class="main-section-title">Scholarships</div>
        ${nonEmptyScholarships.map((item: any, index: number) => `
          <div class="entry" data-section="scholarships" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.name || ''}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Co-curricular Activities -->
      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="main-section" data-section="coCurricular">
        <div class="main-section-title">Co-curricular Activities</div>
        ${nonEmptyCoCurricular.map((item: any, index: number) => `
          <div class="entry" data-section="coCurricular" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.activity || ''}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Extracurricular Activities -->
      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="main-section" data-section="extracurricular">
        <div class="main-section-title">Extracurricular Activities</div>
        ${nonEmptyExtracurricular.map((item: any, index: number) => `
          <div class="entry" data-section="extracurricular" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.activity || ''}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Certifications -->
      ${nonEmptyCertifications.length > 0 ? `
      <div class="main-section" data-section="certifications">
        <div class="main-section-title">Certifications</div>
        ${nonEmptyCertifications.map((cert: any, index: number) => `
          <div class="entry" data-section="certifications" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${cert.name || ''}</div>
              ${cert.date ? `<div class="entry-date">${cert.date}</div>` : ''}
            </div>
            <div class="entry-subtitle">${cert.issuer || ''}</div>
            ${cert.description ? `<div class="entry-description">${cert.description}</div>` : ''}
            ${cert.url ? `<div class="entry-description" style="margin-top:5px;"><a href="${cert.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Certificate</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Awards -->
      ${nonEmptyAwards.length > 0 ? `
      <div class="main-section" data-section="awards">
        <div class="main-section-title">Awards</div>
        ${nonEmptyAwards.map((award: any, index: number) => `
          <div class="entry" data-section="awards" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${award.title || ''}</div>
              ${award.issueYear || award.year ? `<div class="entry-date">${award.issueYear || award.year}</div>` : ''}
            </div>
            <div class="entry-subtitle">${award.organization || ''}</div>
            ${award.description ? `<div class="entry-description">${award.description}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Speaking Engagements -->
      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="main-section" data-section="speakingEngagements">
        <div class="main-section-title">Speaking Engagements</div>
        ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
          <div class="entry" data-section="speakingEngagements" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.topic || ''}</div>
              ${item.date ? `<div class="entry-date">${item.date}</div>` : ''}
            </div>
            <div class="entry-subtitle">${item.eventName || ''}</div>
            ${item.description ? `<div class="entry-description">${item.description}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Memberships -->
      ${nonEmptyMemberships.length > 0 ? `
      <div class="main-section" data-section="memberships">
        <div class="main-section-title">Memberships</div>
        ${nonEmptyMemberships.map((item: any, index: number) => `
          <div class="entry" data-section="memberships" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.membershipName || ''}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
            </div>
            <div class="entry-subtitle">${item.organizationName || ''}</div>
            ${item.description ? `<div class="entry-description">${item.description}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Workshops -->
      ${nonEmptyWorkshops.length > 0 ? `
      <div class="main-section" data-section="workshops">
        <div class="main-section-title">Workshops</div>
        ${nonEmptyWorkshops.map((item: any, index: number) => `
          <div class="entry" data-section="workshops" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.programTitle || ''}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ''}
            </div>
            <div class="entry-subtitle">${item.conductedBy || ''}</div>
            ${item.description ? `<div class="entry-description">${item.description}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Key Achievements -->
      ${nonEmptyKeyAchievements.length > 0 ? `
      <div class="main-section" data-section="keyAchievements">
        <div class="main-section-title">Key Achievements</div>
        <div class="entry-description">
          <ul>
            ${nonEmptyKeyAchievements.map((achievement: string, index: number) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
          </ul>
        </div>
      </div>` : ''}

      <!-- Key Responsibilities -->
      ${nonEmptyResponsibilities.length > 0 ? `
      <div class="main-section" data-section="responsibilities">
        <div class="main-section-title">Key Responsibilities</div>
        <div class="entry-description">
          <ul>
            ${nonEmptyResponsibilities.map((line: string, index: number) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
          </ul>
        </div>
      </div>` : ''}

      <!-- Tools -->
      ${nonEmptyTools.length > 0 ? `
      <div class="main-section" data-section="tools">
        <div class="main-section-title">Tools & Technologies</div>
        <div class="entry-description">
          <ul>
            ${nonEmptyTools.map((line: string, index: number) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
          </ul>
        </div>
      </div>` : ''}

      <!-- Custom Sections -->
      ${nonEmptyCustomSections.length > 0 ? data.customSections
        .filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries))
        .map((section: any, sectionIndex: number) => `
      <div class="main-section" data-section="custom-${sectionIndex}">
        <div class="main-section-title">${section.heading || 'Custom Section'}</div>
        ${section.entries && section.entries.length > 0 ? section.entries
          .filter((entry: any) => entry.isVisible && (entry.title || entry.description))
          .map((entry: any, entryIndex: number) => `
          <div class="entry" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
            <div class="entry-header">
              <div class="entry-title">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
              ${entry.date ? `<div class="entry-date">${entry.date}</div>` : ''}
            </div>
            ${entry.description ? `<div class="entry-description">${entry.description}</div>` : ''}
          </div>
        `).join('') : '<div style="color: #666666; font-style: italic;">No entries in this section</div>'}
      </div>
      `).join('') : ''}

    </div>
  </div>
</body>
</html>`
}