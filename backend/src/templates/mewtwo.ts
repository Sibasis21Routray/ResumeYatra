export function buildMewtwoTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#000000',
    secondary: '#333333',
    background: '#ffffff',
    headingFont: 'Arial',
    bodyFont: 'Arial'
  }
  const currentTheme = theme || defaultTheme

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 12 // Default 12px
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Arial, Helvetica, sans-serif'

  // Calculate responsive font sizes
  const baseFontSize = userFontSize
  const nameFontSize = Math.round(userFontSize * 2.5) 
  const sectionTitleFontSize = Math.round(userFontSize * 1.1)

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
      color: #000000;
      line-height: 1.5;
      background: #ffffff;
      font-size: ${baseFontSize}px;
    }
    .container {
      max-width: 850px;
      margin: 0 auto;
      padding: 40px 50px;
      background: #ffffff;
    }

    /* Header Styles matching image_ff6e34.png */
    .header {
      margin-bottom: 30px;
    }
    
    .name {
      font-size: ${nameFontSize}px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
      color: ${currentTheme.primary};
    }

    .header-divider {
      width: 100%;
      height: 1px;
      background-color: ${currentTheme.primary};
      margin-bottom: 8px;
    }

    .contact-info {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.primary};
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }

    .contact-info span {
      display: flex;
      align-items: center;
    }

    /* Pipe separator for contact info */
    .contact-info span:not(:last-child)::after {
      content: "|";
      margin-left: 15px;
      font-weight: normal;
      color: ${currentTheme.primary};
    }

    .contact-info a {
      color: ${currentTheme.primary};
      text-decoration: none;
    }

    /* Section Styles */
    .section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: ${sectionTitleFontSize}px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 15px;
      color: ${currentTheme.primary};
      letter-spacing: 0.5px;
    }

    /* Grid Layout for Entries (Date Left, Content Right) */
    .entry {
      display: grid;
      grid-template-columns: 140px 1fr; /* Fixed width for dates/labels */
      gap: 20px;
      margin-bottom: 15px;
    }

    .entry-left {
      font-weight: 700;
      font-size: ${baseFontSize}px;
      color: ${currentTheme.primary};
      text-align: left;
      line-height: 1.4;
    }

    .entry-right {
      display: flex;
      flex-direction: column;
    }

    .entry-title {
      font-weight: 700;
      font-size: ${baseFontSize}px;
      color: ${currentTheme.primary};
      margin-bottom: 2px;
    }

    .entry-subtitle {
      font-style: italic;
      color: ${currentTheme.secondary};
      margin-bottom: 5px;
      font-size: ${baseFontSize}px;
    }

    .entry-content {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
    }

    /* List Styling */
    .entry-content ul {
      margin: 5px 0 5px 18px;
      padding: 0;
      list-style-type: square; /* Square bullets per image */
    }

    .entry-content li {
      margin-bottom: 3px;
      padding-left: 5px;
    }

    /* Skills Layout */
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .skill-item:not(:last-child)::after {
      content: ",";
      margin-right: 5px;
    }

    /* Summary Text */
    .summary-text {
      line-height: 1.6;
      color: ${currentTheme.secondary};
    }

    /* Enhanced Education Styles */
    .education-field {
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 4px;
      font-size: ${baseFontSize}px;
    }

    .education-school {
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 4px;
    }

    .education-location {
      color: ${currentTheme.secondary};
      font-style: italic;
      margin-bottom: 6px;
    }

    .education-description {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
      line-height: 1.5;
      margin-top: 6px;
      padding: 8px;
      background: #f8f8f8;
      border-left: 3px solid ${currentTheme.primary};
    }

    .education-description ul {
      margin: 5px 0 5px 18px;
      padding: 0;
      list-style-type: square;
    }

    .education-description li {
      margin: 3px 0;
      color: ${currentTheme.secondary};
    }

    .education-description b {
      font-weight: 700;
      color: ${currentTheme.primary};
    }

    .education-achievements {
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid ${currentTheme.secondary};
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 4px;
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
      padding-left: 14px;
      margin-bottom: 3px;
      color: ${currentTheme.secondary};
      font-size: ${baseFontSize}px;
    }

    .education-achievements li:before {
      content: "●";
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
      color: ${currentTheme.secondary};
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
      color: ${currentTheme.secondary};
    }

    @media print {
      body { -webkit-print-color-adjust: exact; }
      .container { padding: 0; width: 100%; max-width: none; }
    }
  </style>
</head>
<body>
<div class="container">
  <div class="header" data-section="personal">
    <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'YOUR NAME'}${data.personal?.middleName ? ` ${data.personal.middleName}` : ''}</div>
    ${data.personal?.role ? `<div style="font-size: 16px; margin-bottom: 5px; font-weight: 600;" data-section="personal">${data.personal.role}</div>` : ''}
    <div class="header-divider" data-section="personal"></div>
    <div class="contact-info" data-section="personal">
      ${data.personal?.phone ? `<span data-section="personal">📞 ${data.personal.phone}</span>` : ''}
      ${data.personal?.alternatePhone ? `<span data-section="personal">📞 ${data.personal.alternatePhone}</span>` : ''}
      ${data.personal?.email ? `<span data-section="personal">✉️ ${data.personal.email}</span>` : ''}
      ${(() => {
        const addressParts = [
          data.personal?.fullAddress,
          data.personal?.location,
          data.personal?.country,
          data.personal?.pinCode
        ].filter(Boolean);
        return addressParts.length > 0 ? `<span data-section="personal">📍 ${addressParts.join(', ')}</span>` : '';
      })()}
      ${data.personal?.fathersName ? `<span data-section="personal">👨 Father: ${data.personal.fathersName}</span>` : ''}
      ${data.personal?.dob ? `<span data-section="personal">📅 DOB: ${data.personal.dob}</span>` : ''}
      ${data.personal?.gender ? `<span data-section="personal">⚥ Gender: ${data.personal.gender}</span>` : ''}
      ${data.personal?.maritalStatus ? `<span data-section="personal">💍 Marital: ${data.personal.maritalStatus}</span>` : ''}
      ${data.personal?.nationality ? `<span data-section="personal">🌍 Nationality: ${data.personal.nationality}</span>` : ''}
      ${data.personal?.passportNo ? `<span data-section="personal">🛂 Passport: ${data.personal.passportNo}</span>` : ''}
      ${data.personal?.website ? `<span data-section="personal"><a href="${data.personal.website}" target="_blank">🌐 Website</a></span>` : ''}
      ${data.personal?.linkedinUrl ? `<span data-section="personal"><a href="${data.personal.linkedinUrl}" target="_blank">🔗 LinkedIn</a></span>` : ''}
      ${data.personal?.githubUrl ? `<span data-section="personal"><a href="${data.personal.githubUrl}" target="_blank">🐙 GitHub</a></span>` : ''}
      ${data.personal?.portfolioUrl ? `<span data-section="personal"><a href="${data.personal.portfolioUrl}" target="_blank">💼 Portfolio</a></span>` : ''}
      ${data.personal?.twitterUrl ? `<span data-section="personal"><a href="${data.personal.twitterUrl}" target="_blank">🐦 Twitter</a></span>` : ''}
      ${data.personal?.facebookUrl ? `<span data-section="personal"><a href="${data.personal.facebookUrl}" target="_blank">📘 Facebook</a></span>` : ''}
      ${data.personal?.instagramUrl ? `<span data-section="personal"><a href="${data.personal.instagramUrl}" target="_blank">📷 Instagram</a></span>` : ''}
      ${data.personal?.behanceUrl ? `<span data-section="personal"><a href="${data.personal.behanceUrl}" target="_blank">🎨 Behance</a></span>` : ''}
      ${data.personal?.dribbbleUrl ? `<span data-section="personal"><a href="${data.personal.dribbbleUrl}" target="_blank">🏀 Dribbble</a></span>` : ''}
      ${data.personal?.stackoverflowUrl ? `<span data-section="personal"><a href="${data.personal.stackoverflowUrl}" target="_blank">📚 Stack Overflow</a></span>` : ''}
      ${data.personal?.mediumUrl ? `<span data-section="personal"><a href="${data.personal.mediumUrl}" target="_blank">📝 Medium</a></span>` : ''}
    </div>
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
    <div class="section" data-section="availabilityWorkAuth">
      <div class="section-title">Availability</div>
      <div class="tags-container">
        ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<span class="tag">📅 Notice: ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</span>` : ''}
        ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<span class="tag">🪪 Work Auth: ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</span>` : ''}
        ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<span class="tag">📍 Preferred: ${nonEmptyAvailabilityWorkAuth.preferredLocation}</span>` : ''}
      </div>
    </div>` : ''}

    <!-- Summary -->
    ${data.summary && data.summary.trim() ? `
    <div class="section" data-section="summary">
      <div class="section-title">Professional Summary</div>
      <div class="entry">
        <div class="entry-left"></div>
        <div class="entry-right">
          <p class="summary-text">${data.summary}</p>
        </div>
      </div>
    </div>` : ''}

    <!-- Career Objective -->
    ${data.careerObjective && data.careerObjective.trim() ? `
    <div class="section" data-section="careerObjective">
      <div class="section-title">Career Objective</div>
      <div class="entry">
        <div class="entry-left"></div>
        <div class="entry-right">
          <p class="summary-text">${data.careerObjective}</p>
        </div>
      </div>
    </div>` : ''}

    <!-- Work Experience -->
    ${hasNonEmptyItems(data.experience) ? `
    <div class="section" data-section="experience">
      <div class="section-title">Work Experience</div>
      ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
        const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
        const subtitle = formatSubtitle([exp.company, exp.location, exp.domain]);
        
        return `
        <div class="entry" data-section="experience" data-index="${index}">
          <div class="entry-left">${dateRange ? dateRange.replace(' – ', '<br/>') : ''}</div>
          <div class="entry-right">
            <div class="entry-title">${exp.title || ''}</div>
            ${subtitle ? `<div class="entry-subtitle">${subtitle}</div>` : ''}
            ${exp.description ? `<div class="entry-content">${exp.description}</div>` : ''}
            ${exp.achievements ? `<div class="entry-content" style="margin-top: 5px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ''}
          </div>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Internships -->
    ${nonEmptyInternships.length > 0 ? `
    <div class="section" data-section="internships">
      <div class="section-title">Internships</div>
      ${nonEmptyInternships.map((item: any, index: number) => {
        const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
        const subtitle = formatSubtitle([item.company, item.location]);
        
        return `
        <div class="entry" data-section="internships" data-index="${index}">
          <div class="entry-left">${dateRange ? dateRange.replace(' – ', '<br/>') : ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.title || ''}</div>
            ${subtitle ? `<div class="entry-subtitle">${subtitle}</div>` : ''}
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
          </div>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Training Programs -->
    ${nonEmptyTrainingPrograms.length > 0 ? `
    <div class="section" data-section="trainingPrograms">
      <div class="section-title">Training Programs</div>
      ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
        <div class="entry" data-section="trainingPrograms" data-index="${index}">
          <div class="entry-left">${item.completionDate || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Education -->
    ${hasNonEmptyItems(data.education) ? `
    <div class="section" data-section="education">
      <div class="section-title">Education</div>
      ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
        <div class="entry" data-section="education" data-index="${index}">
          <div class="entry-left">${edu.graduationDate || ''}</div>
          <div class="entry-right">
            <div class="entry-title">
              ${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}${edu.qualification ? ` (${edu.qualification})` : ''}
            </div>
            
            ${edu.school ? `<div class="education-school">${edu.school}${edu.location ? `, ${edu.location}` : ''}</div>` : ''}
            ${edu.grade ? `<div class="education-field"> ${edu.grade}</div>` : ''}
            
            ${edu.description ? `
              <div class="education-description">
                ${edu.description}
              </div>
            ` : ''}
            
            ${edu.achievements && edu.achievements.length > 0 ? `
              <div class="education-achievements">
                <h4>Academic Achievements</h4>
                <ul>
                  ${edu.achievements.filter((achievement: string) => achievement.trim()).map((achievement: string, achIndex: number) => 
                    `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`
                  ).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Academic Projects -->
    ${nonEmptyAcademicProjects.length > 0 ? `
    <div class="section" data-section="academicProjects">
      <div class="section-title">Academic Projects</div>
      ${nonEmptyAcademicProjects.map((item: any, index: number) => `
        <div class="entry" data-section="academicProjects" data-index="${index}">
          <div class="entry-left">${item.duration || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.name || item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ''])}</div>
            <div class="entry-content">${item.description || ''}</div>
            ${item.technologies ? `<div class="entry-content" style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
            ${item.url ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Project</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Client Projects -->
    ${nonEmptyClientProjects.length > 0 ? `
    <div class="section" data-section="clientProjects">
      <div class="section-title">Client Projects</div>
      ${nonEmptyClientProjects.map((item: any, index: number) => `
        <div class="entry" data-section="clientProjects" data-index="${index}">
          <div class="entry-left">${item.duration || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ''])}</div>
            <div class="entry-content">${item.description || ''}</div>
            ${item.toolsTechnologies ? `<div class="entry-content" style="margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ''}
            ${item.projectUrl ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Project</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Portfolio -->
    ${nonEmptyPortfolio.length > 0 ? `
    <div class="section" data-section="portfolio">
      <div class="section-title">Portfolio</div>
      ${nonEmptyPortfolio.map((item: any, index: number) => `
        <div class="entry" data-section="portfolio" data-index="${index}">
          <div class="entry-left">${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ''])}</div>
          <div class="entry-right">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-content">${item.description || ''}</div>
            ${item.url ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Portfolio</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Projects -->
    ${nonEmptyProjects.length > 0 ? `
    <div class="section" data-section="projects">
      <div class="section-title">Projects</div>
      ${nonEmptyProjects.map((project: any, index: number) => {
        const dateRange = formatDateRange(project.startDate, project.endDate);
        
        return `
        <div class="entry" data-section="projects" data-index="${index}">
          <div class="entry-left">${dateRange || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${project.name || ''}</div>
            <div class="entry-subtitle">${project.technologies || ''}</div>
            <div class="entry-content">${project.description || ''}</div>
            ${project.url ? `<div class="entry-content" style="margin-top: 5px;"><a href="${project.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">${project.urlText || 'View Project'}</a></div>` : ''}
          </div>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Leadership Positions -->
    ${nonEmptyLeadershipPositions.length > 0 ? `
    <div class="section" data-section="leadershipPositions">
      <div class="section-title">Leadership & Positions</div>
      ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
        const dateRange = formatDateRange(item.startDate, item.endDate);
        
        return `
        <div class="entry" data-section="leadershipPositions" data-index="${index}">
          <div class="entry-left">${dateRange ? dateRange.replace(' – ', '<br/>') : ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.position || item.title || ''}</div>
            <div class="entry-subtitle">${item.organization || ''}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Volunteering -->
    ${nonEmptyVolunteering.length > 0 ? `
    <div class="section" data-section="volunteering">
      <div class="section-title">Volunteering</div>
      ${nonEmptyVolunteering.map((item: any, index: number) => `
        <div class="entry" data-section="volunteering" data-index="${index}">
          <div class="entry-left">${item.duration || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.role || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.causeArea])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Military Service -->
    ${nonEmptyMilitaryService.length > 0 ? `
    <div class="section" data-section="militaryService">
      <div class="section-title">Military Service</div>
      ${nonEmptyMilitaryService.map((item: any, index: number) => `
        <div class="entry" data-section="militaryService" data-index="${index}">
          <div class="entry-left">${item.duration || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.rank ? item.rank : ''}${item.rank && item.branch ? ' - ' : ''}${item.branch || ''}</div>
            ${item.specialization ? `<div class="entry-subtitle">${item.specialization}</div>` : ''}
            <div class="entry-content">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Teaching Experience -->
    ${nonEmptyTeachingExperience.length > 0 ? `
    <div class="section" data-section="teachingExperience">
      <div class="section-title">Teaching Experience</div>
      ${nonEmptyTeachingExperience.map((item: any, index: number) => `
        <div class="entry" data-section="teachingExperience" data-index="${index}">
          <div class="entry-left">${item.duration || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.subjectCourseTaught || item.title || ''}</div>
            <div class="entry-subtitle">${item.institution || ''}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Mentorship Experience -->
    ${nonEmptyMentorshipExperience.length > 0 ? `
    <div class="section" data-section="mentorshipExperience">
      <div class="section-title">Mentorship Experience</div>
      ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
        <div class="entry" data-section="mentorshipExperience" data-index="${index}">
          <div class="entry-left">${item.duration || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.mentorshipArea || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ''])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Research Grants -->
    ${nonEmptyResearchGrants.length > 0 ? `
    <div class="section" data-section="researchGrants">
      <div class="section-title">Research Grants</div>
      ${nonEmptyResearchGrants.map((item: any, index: number) => `
        <div class="entry" data-section="researchGrants" data-index="${index}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : ''])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Publications -->
    ${nonEmptyPublications.length > 0 ? `
    <div class="section" data-section="publications">
      <div class="section-title">Publications</div>
      ${nonEmptyPublications.map((item: any, index: number) => `
        <div class="entry" data-section="publications" data-index="${index}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
            ${item.authors ? `<div class="entry-content"><strong>Authors:</strong> ${item.authors}</div>` : ''}
            ${item.urlDoi ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">${item.urlDoi}</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Patents -->
    ${nonEmptyPatents.length > 0 ? `
    <div class="section" data-section="patents">
      <div class="section-title">Patents</div>
      ${nonEmptyPatents.map((item: any, index: number) => `
        <div class="entry" data-section="patents" data-index="${index}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : '', item.issuingAuthority])}</div>
            ${item.status ? `<div class="entry-content"><strong>Status:</strong> ${item.status}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Test Scores -->
    ${nonEmptyTestScores.length > 0 ? `
    <div class="section" data-section="testScores">
      <div class="section-title">Test Scores</div>
      ${nonEmptyTestScores.map((item: any, index: number) => `
        <div class="entry" data-section="testScores" data-index="${index}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.testName || ''}</div>
            <div class="entry-subtitle">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Scholarships -->
    ${nonEmptyScholarships.length > 0 ? `
    <div class="section" data-section="scholarships">
      <div class="section-title">Scholarships</div>
      ${nonEmptyScholarships.map((item: any, index: number) => `
        <div class="entry" data-section="scholarships" data-index="${index}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Co-curricular Activities -->
    ${nonEmptyCoCurricular.length > 0 ? `
    <div class="section" data-section="coCurricular">
      <div class="section-title">Co-curricular Activities</div>
      ${nonEmptyCoCurricular.map((item: any, index: number) => `
        <div class="entry" data-section="coCurricular" data-index="${index}">
          <div class="entry-left">${item.year || formatDateRange(item.startDate, item.endDate) || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.activity || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Extracurricular Activities -->
    ${nonEmptyExtracurricular.length > 0 ? `
    <div class="section" data-section="extracurricular">
      <div class="section-title">Extracurricular Activities</div>
      ${nonEmptyExtracurricular.map((item: any, index: number) => `
        <div class="entry" data-section="extracurricular" data-index="${index}">
          <div class="entry-left">${item.year || formatDateRange(item.startDate, item.endDate) || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.activity || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Skills -->
    ${nonEmptySkills.length > 0 ? `
    <div class="section" data-section="skills">
      <div class="section-title">Skills</div>
      <div style="display: block;">
        <div class="skills-list">
          ${nonEmptySkills.map((skill: any, index: number) => `
            <span class="skill-item" data-section="skills" data-index="${index}">${typeof skill === 'string' ? skill.trim() : skill}</span>
          `).join('')}
        </div>
      </div>
    </div>` : ''}

    <!-- Tools & Technologies -->
    ${nonEmptyToolsTechnologies.length > 0 ? `
    <div class="section" data-section="toolsTechnologies">
      <div class="section-title">Tools & Technologies</div>
      <div class="skills-list">
        ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
          <span class="skill-item" data-section="toolsTechnologies" data-index="${index}">${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}</span>
        `).join('')}
      </div>
    </div>` : ''}

    <!-- Methodologies -->
    ${nonEmptyMethodologies.length > 0 ? `
    <div class="section" data-section="methodologies">
      <div class="section-title">Methodologies</div>
      <div class="skills-list">
        ${nonEmptyMethodologies.map((item: any, index: number) => `
          <span class="skill-item" data-section="methodologies" data-index="${index}">${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}</span>
        `).join('')}
      </div>
    </div>` : ''}

    <!-- Industry Expertise -->
    ${nonEmptyIndustryExpertise.length > 0 ? `
    <div class="section" data-section="industryExpertise">
      <div class="section-title">Industry Expertise</div>
      <div class="skills-list">
        ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
          <span class="skill-item" data-section="industryExpertise" data-index="${index}">${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}</span>
        `).join('')}
      </div>
    </div>` : ''}

    <!-- Languages -->
    ${nonEmptyLanguages.length > 0 ? `
    <div class="section" data-section="languages">
      <div class="section-title">Languages</div>
      <div class="entry">
        <div class="entry-left"></div>
        <div class="entry-right">
          <div class="skills-list">
            ${nonEmptyLanguages.map((lang: any, index: number) => `
              <span class="skill-item" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Hobbies -->
    ${nonEmptyHobbies.length > 0 ? `
    <div class="section" data-section="hobbies">
      <div class="section-title">Hobbies</div>
      <div class="entry">
        <div class="entry-left"></div>
        <div class="entry-right">
          <div class="skills-list">
            ${nonEmptyHobbies.map((hobby: any, index: number) => `
              <span class="skill-item" data-section="hobbies" data-index="${index}">${hobby}</span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Social Links -->
    ${nonEmptySocialLinks.length > 0 ? `
    <div class="section" data-section="socialLinks">
      <div class="section-title">Social Links</div>
      <div class="entry">
        <div class="entry-left"></div>
        <div class="entry-right">
          <div class="skills-list">
            ${nonEmptySocialLinks.map((link: any, index: number) => `
              <a href="${link.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none; margin-right: 15px;" data-section="socialLinks" data-index="${index}">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Social Profiles -->
    ${nonEmptySocialProfiles.length > 0 ? `
    <div class="section" data-section="socialProfiles">
      <div class="section-title">Social Profiles</div>
      <div class="entry">
        <div class="entry-left"></div>
        <div class="entry-right">
          <div class="skills-list">
            ${nonEmptySocialProfiles.map((profile: any, index: number) => `
              <a href="${profile.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none; margin-right: 15px;" data-section="socialProfiles" data-index="${index}">${profile.platform || "Profile"}</a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Certifications -->
    ${nonEmptyCertifications.length > 0 ? `
    <div class="section" data-section="certifications">
      <div class="section-title">Certifications</div>
      ${nonEmptyCertifications.map((cert: any, index: number) => `
        <div class="entry" data-section="certifications" data-index="${index}">
          <div class="entry-left">${cert.date || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${cert.name || ''}</div>
            <div class="entry-subtitle">${cert.issuer || ''}</div>
            ${cert.description ? `<div class="entry-content">${cert.description}</div>` : ''}
            ${cert.url ? `<div class="entry-content" style="margin-top: 5px;"><a href="${cert.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Certificate</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Awards -->
    ${nonEmptyAwards.length > 0 ? `
    <div class="section" data-section="awards">
      <div class="section-title">Awards</div>
      ${nonEmptyAwards.map((award: any, index: number) => `
        <div class="entry" data-section="awards" data-index="${index}">
          <div class="entry-left">${award.issueYear || award.year || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${award.title || ''}</div>
            <div class="entry-subtitle">${award.organization || ''}</div>
            ${award.description ? `<div class="entry-content">${award.description}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Speaking Engagements -->
    ${nonEmptySpeakingEngagements.length > 0 ? `
    <div class="section" data-section="speakingEngagements">
      <div class="section-title">Speaking Engagements</div>
      ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
        <div class="entry" data-section="speakingEngagements" data-index="${index}">
          <div class="entry-left">${item.date || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.topic || ''}</div>
            <div class="entry-subtitle">${item.eventName || ''}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Memberships -->
    ${nonEmptyMemberships.length > 0 ? `
    <div class="section" data-section="memberships">
      <div class="section-title">Memberships</div>
      ${nonEmptyMemberships.map((item: any, index: number) => `
        <div class="entry" data-section="memberships" data-index="${index}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.membershipName || ''}</div>
            <div class="entry-subtitle">${item.organizationName || ''}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Workshops -->
    ${nonEmptyWorkshops.length > 0 ? `
    <div class="section" data-section="workshops">
      <div class="section-title">Workshops</div>
      ${nonEmptyWorkshops.map((item: any, index: number) => `
        <div class="entry" data-section="workshops" data-index="${index}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${item.programTitle || ''}</div>
            <div class="entry-subtitle">${item.conductedBy || ''}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- References -->
    ${nonEmptyReferences.length > 0 ? `
    <div class="section" data-section="references">
      <div class="section-title">References</div>
      ${nonEmptyReferences.map((ref: any, index: number) => `
        <div class="entry" data-section="references" data-index="${index}">
          <div class="entry-left"></div>
          <div class="entry-right">
            <div class="entry-title">${ref.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
            ${ref.contactInformation ? `<div class="entry-content"><strong>Contact:</strong> ${ref.contactInformation}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Key Achievements -->
    ${nonEmptyKeyAchievements.length > 0 ? `
    <div class="section" data-section="keyAchievements">
      <div class="section-title">Key Achievements</div>
      <div class="entry">
        <div class="entry-left"></div>
        <div class="entry-right">
          <div class="entry-content">
            <ul>
              ${nonEmptyKeyAchievements.map((achievement: string, index: number) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Key Responsibilities -->
    ${nonEmptyResponsibilities.length > 0 ? `
    <div class="section" data-section="responsibilities">
      <div class="section-title">Key Responsibilities</div>
      <div class="entry">
        <div class="entry-left"></div>
        <div class="entry-right">
          <div class="entry-content">
            <ul>
              ${nonEmptyResponsibilities.map((line: string, index: number) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Tools -->
    ${nonEmptyTools.length > 0 ? `
    <div class="section" data-section="tools">
      <div class="section-title">Tools & Technologies</div>
      <div class="entry">
        <div class="entry-left"></div>
        <div class="entry-right">
          <div class="entry-content">
            <ul>
              ${nonEmptyTools.map((line: string, index: number) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Custom Sections -->
    ${nonEmptyCustomSections.length > 0 ? data.customSections
      .filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries))
      .map((section: any, sectionIndex: number) => `
    <div class="section" data-section="custom-${sectionIndex}">
      <div class="section-title">${section.heading || 'Custom Section'}</div>
      ${section.entries && section.entries.length > 0 ? section.entries
        .filter((entry: any) => entry.isVisible && (entry.title || entry.description))
        .map((entry: any, entryIndex: number) => `
        <div class="entry" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
          <div class="entry-left">${entry.date || ''}</div>
          <div class="entry-right">
            <div class="entry-title">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
            ${entry.description ? `<div class="entry-content">${entry.description}</div>` : ''}
          </div>
        </div>
      `).join('') : '<div style="color: #666666; font-style: italic;">No entries in this section</div>'}
    </div>
    `).join('') : ''}

  </div>
</body>
</html>`
}