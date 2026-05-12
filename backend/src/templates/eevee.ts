export function buildEeveeTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#000000',
    secondary: '#444444',
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
      line-height: 1.6;
      background: #ffffff;
      font-size: ${baseFontSize}px;
    }
    
    .container {
      max-width: 850px;
      margin: 0 auto;
      padding: 40px 50px;
      background: #ffffff;
    }

    /* --- HEADER STYLES --- */
    .header {
      margin-bottom: 35px;
    }

    .name {
      font-family: 'Times New Roman', serif;
      font-size: ${Math.round(headingFontSize * 1.2)}px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: ${currentTheme.primary};
      margin-bottom: 5px;
      line-height: 1.1;
    }

    .header-divider {
      width: 100%;
      height: 2px;
      background-color: ${currentTheme.primary};
      margin-bottom: 12px;
    }

    .contact-info {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      line-height: 1.4;
    }

    .contact-info span {
      display: flex;
      align-items: center;
    }

    .contact-info span:not(:last-child)::after {
      content: "|";
      margin-left: 15px;
      color: ${currentTheme.primary};
      font-weight: 400;
    }

    .contact-info a {
      color: inherit;
      text-decoration: none;
    }

    /* --- SECTION STYLES --- */
    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-family: ${userFontFamily};
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 800;
      text-transform: uppercase;
      color: ${currentTheme.primary};
      margin-bottom: 15px;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 5px;
    }

    /* --- GRID LAYOUT (Left Date, Right Content) --- */
    .entry-grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }

    .entry-date-col {
      font-weight: 700;
      font-size: ${baseFontSize}px;
      color: ${currentTheme.primary};
      text-align: left;
      line-height: 1.4;
    }

    .entry-content-col {
      display: flex;
      flex-direction: column;
    }

    .entry-title {
      font-weight: 700;
      font-size: ${subheadingFontSize}px;
      color: ${currentTheme.primary};
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .entry-subtitle {
      font-weight: 600;
      font-style: italic;
      color: ${currentTheme.secondary};
      font-size: ${baseFontSize}px;
      margin-bottom: 6px;
    }

    .entry-description {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
      line-height: 1.5;
    }

    .entry-description ul {
      margin: 5px 0 5px 18px;
      padding: 0;
      list-style-type: square;
    }

    .entry-description li {
      margin-bottom: 3px;
      padding-left: 5px;
    }

    /* --- SKILLS & LANGUAGES --- */
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .skill-item {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
    }
    
    .skill-item:not(:last-child)::after {
      content: ",";
      margin-right: 5px;
    }

    /* --- SUMMARY --- */
    .summary-text {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
      line-height: 1.6;
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
      font-size: ${baseFontSize}px;
    }

    .education-location {
      color: ${currentTheme.secondary};
      font-style: italic;
      margin-bottom: 6px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
    }

    .education-description {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
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
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e5e5e5;
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.85)}px;
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
      padding-left: 14px;
      margin-bottom: 3px;
      color: ${currentTheme.secondary};
      font-size: ${Math.round(baseFontSize * 0.9)}px;
    }

    .education-achievements li:before {
      content: "◊";
      color: ${currentTheme.primary};
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; }
      .container { padding: 40px 50px; width: 100%; max-width: none; box-shadow: none; margin: 0; }
      .header-divider { background-color: #000 !important; }
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
      ${data.personal?.phone ? `<span data-section="personal">${data.personal.phone}</span>` : ''}
      ${data.personal?.alternatePhone ? `<span data-section="personal">${data.personal.alternatePhone}</span>` : ''}
      ${data.personal?.email ? `<span data-section="personal">${data.personal.email}</span>` : ''}
      ${(() => {
        const addressParts = [
          data.personal?.fullAddress,
          data.personal?.location,
          data.personal?.country,
          data.personal?.pinCode
        ].filter(Boolean);
        return addressParts.length > 0 ? `<span data-section="personal">${addressParts.join(', ')}</span>` : '';
      })()}
      ${data.personal?.fathersName ? `<span data-section="personal">Father: ${data.personal.fathersName}</span>` : ''}
      ${data.personal?.dob ? `<span data-section="personal">DOB: ${data.personal.dob}</span>` : ''}
      ${data.personal?.gender ? `<span data-section="personal">Gender: ${data.personal.gender}</span>` : ''}
      ${data.personal?.maritalStatus ? `<span data-section="personal">Marital: ${data.personal.maritalStatus}</span>` : ''}
      ${data.personal?.nationality ? `<span data-section="personal">Nationality: ${data.personal.nationality}</span>` : ''}
      ${data.personal?.passportNo ? `<span data-section="personal">Passport: ${data.personal.passportNo}</span>` : ''}
      ${data.personal?.linkedinUrl ? `<span data-section="personal"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></span>` : ''}
      ${data.personal?.githubUrl ? `<span data-section="personal"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></span>` : ''}
      ${data.personal?.portfolioUrl ? `<span data-section="personal"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></span>` : ''}
      ${data.personal?.website ? `<span data-section="personal"><a href="${data.personal.website}" target="_blank">Website</a></span>` : ''}
      ${data.personal?.twitterUrl ? `<span data-section="personal"><a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></span>` : ''}
      ${data.personal?.facebookUrl ? `<span data-section="personal"><a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></span>` : ''}
      ${data.personal?.instagramUrl ? `<span data-section="personal"><a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></span>` : ''}
      ${data.personal?.behanceUrl ? `<span data-section="personal"><a href="${data.personal.behanceUrl}" target="_blank">Behance</a></span>` : ''}
      ${data.personal?.dribbbleUrl ? `<span data-section="personal"><a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></span>` : ''}
      ${data.personal?.stackoverflowUrl ? `<span data-section="personal"><a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></span>` : ''}
      ${data.personal?.mediumUrl ? `<span data-section="personal"><a href="${data.personal.mediumUrl}" target="_blank">Medium</a></span>` : ''}
    </div>
  </div>

    <!-- Professional Context - Following Eevee template style -->
    ${nonEmptyProfessionalContext ? `
    <div class="section" data-section="professionalContext">
      <div class="section-title">Professional Context</div>
      ${nonEmptyProfessionalContext.totalExperience ? `
      <div class="entry-grid">
        <div class="entry-date-col">Total Experience</div>
        <div class="entry-content-col">
          <div class="entry-title">${nonEmptyProfessionalContext.totalExperience}</div>
        </div>
      </div>` : ''}
      ${nonEmptyProfessionalContext.teamSize ? `
      <div class="entry-grid">
        <div class="entry-date-col">Team Size</div>
        <div class="entry-content-col">
          <div class="entry-title">${nonEmptyProfessionalContext.teamSize}</div>
        </div>
      </div>` : ''}
      ${nonEmptyProfessionalContext.industry ? `
      <div class="entry-grid">
        <div class="entry-date-col">Industry</div>
        <div class="entry-content-col">
          <div class="entry-title">${nonEmptyProfessionalContext.industry}</div>
        </div>
      </div>` : ''}
      ${nonEmptyProfessionalContext.functionalDomain ? `
      <div class="entry-grid">
        <div class="entry-date-col">Domain</div>
        <div class="entry-content-col">
          <div class="entry-title">${nonEmptyProfessionalContext.functionalDomain}</div>
        </div>
      </div>` : ''}
      ${nonEmptyProfessionalContext.geographicScope ? `
      <div class="entry-grid">
        <div class="entry-date-col">Geographic Scope</div>
        <div class="entry-content-col">
          <div class="entry-title">${nonEmptyProfessionalContext.geographicScope}</div>
        </div>
      </div>` : ''}
      ${nonEmptyProfessionalContext.revenueResponsibility ? `
      <div class="entry-grid">
        <div class="entry-date-col">Revenue Responsibility</div>
        <div class="entry-content-col">
          <div class="entry-title">${nonEmptyProfessionalContext.revenueResponsibility}</div>
        </div>
      </div>` : ''}
    </div>` : ''}

    <!-- Availability & Work Auth - Following Eevee template style -->
    ${nonEmptyAvailabilityWorkAuth ? `
    <div class="section" data-section="availabilityWorkAuth">
      <div class="section-title">Availability</div>
      ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `
      <div class="entry-grid">
        <div class="entry-date-col">Notice Period</div>
        <div class="entry-content-col">
          <div class="entry-title">${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</div>
        </div>
      </div>` : ''}
      ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `
      <div class="entry-grid">
        <div class="entry-date-col">Work Authorization</div>
        <div class="entry-content-col">
          <div class="entry-title">${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</div>
        </div>
      </div>` : ''}
      ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `
      <div class="entry-grid">
        <div class="entry-date-col">Preferred Location</div>
        <div class="entry-content-col">
          <div class="entry-title">${nonEmptyAvailabilityWorkAuth.preferredLocation}</div>
        </div>
      </div>` : ''}
    </div>` : ''}

    <!-- Personal Details (if not in header) -->
    ${(() => {
      const personalDetails = [];
      if (!data.personal?.email && (data.personal?.fathersName || data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus || data.personal?.nationality || data.personal?.passportNo)) {
        if (data.personal?.fathersName) personalDetails.push(`<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>`);
        if (data.personal?.dob) personalDetails.push(`<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>`);
        if (data.personal?.gender) personalDetails.push(`<div><strong>Gender:</strong> ${data.personal.gender}</div>`);
        if (data.personal?.maritalStatus) personalDetails.push(`<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>`);
        if (data.personal?.nationality) personalDetails.push(`<div><strong>Nationality:</strong> ${data.personal.nationality}</div>`);
        if (data.personal?.passportNo) personalDetails.push(`<div><strong>Passport No:</strong> ${data.personal.passportNo}</div>`);
      }
      return personalDetails.length > 0 ? `
    <div class="section" data-section="personal">
      <div class="section-title">Personal Details</div>
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${baseFontSize}px; color: ${currentTheme.secondary};">
        ${personalDetails.join('')}
      </div>
    </div>` : '';
    })()}

    <!-- Summary -->
    ${data.summary && data.summary.trim() ? `
    <div class="section" data-section="summary">
      <div class="section-title">Professional Summary</div>
      <p class="summary-text">${data.summary}</p>
    </div>` : ''}

    <!-- Career Objective -->
    ${data.careerObjective && data.careerObjective.trim() ? `
    <div class="section" data-section="careerObjective">
      <div class="section-title">Career Objective</div>
      <p class="summary-text">${data.careerObjective}</p>
    </div>` : ''}

    <!-- Work Experience -->
    ${hasNonEmptyItems(data.experience) ? `
    <div class="section" data-section="experience">
      <div class="section-title">Work Experience</div>
      ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
        const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
        const subtitle = formatSubtitle([exp.company, exp.location, exp.domain]);
        
        return `
        <div class="entry-grid" data-section="experience" data-index="${index}">
          <div class="entry-date-col">${dateRange ? dateRange.replace(' – ', '<br/>') : ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${exp.title || ''}</div>
            ${subtitle ? `<div class="entry-subtitle">${subtitle}</div>` : ''}
            <div class="entry-description">${exp.description || ''}</div>
            ${exp.achievements ? `<div class="entry-description" style="margin-top: 5px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ''}
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
        <div class="entry-grid" data-section="internships" data-index="${index}">
          <div class="entry-date-col">${dateRange ? dateRange.replace(' – ', '<br/>') : ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.title || ''}</div>
            ${subtitle ? `<div class="entry-subtitle">${subtitle}</div>` : ''}
            <div class="entry-description">${item.description || ''}</div>
          </div>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Training Programs -->
    ${nonEmptyTrainingPrograms.length > 0 ? `
    <div class="section" data-section="trainingPrograms">
      <div class="section-title">Training Programs</div>
      ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
        <div class="entry-grid" data-section="trainingPrograms" data-index="${index}">
          <div class="entry-date-col">${item.completionDate || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
            <div class="entry-description">${item.description || ''}</div>
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
        <div class="entry-grid" data-section="projects" data-index="${index}">
          <div class="entry-date-col">${dateRange || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${project.name || ''}</div>
            <div class="entry-subtitle">${project.technologies || ''}</div>
            <div class="entry-description">${project.description || ''}</div>
            ${project.url ? `<div class="entry-description" style="margin-top: 5px;"><a href="${project.url}" target="_blank" style="text-decoration: underline; color: ${currentTheme.primary};">${project.urlText || 'View Project'}</a></div>` : ''}
          </div>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Education -->
    ${hasNonEmptyItems(data.education) ? `
    <div class="section" data-section="education">
      <div class="section-title">Education</div>
      ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
        <div class="entry-grid" data-section="education" data-index="${index}">
          <div class="entry-date-col">${edu.graduationDate || ''}</div>
          <div class="entry-content-col">
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
                <h4>Academic Distinction</h4>
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
        <div class="entry-grid" data-section="academicProjects" data-index="${index}">
          <div class="entry-date-col">${item.duration || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.name || item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
            ${item.technologies ? `<div class="entry-description" style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
            ${item.url ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="text-decoration: underline; color: ${currentTheme.primary};">View Project</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Client Projects -->
    ${nonEmptyClientProjects.length > 0 ? `
    <div class="section" data-section="clientProjects">
      <div class="section-title">Client Projects</div>
      ${nonEmptyClientProjects.map((item: any, index: number) => `
        <div class="entry-grid" data-section="clientProjects" data-index="${index}">
          <div class="entry-date-col">${item.duration || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
            ${item.toolsTechnologies ? `<div class="entry-description" style="margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ''}
            ${item.projectUrl ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank" style="text-decoration: underline; color: ${currentTheme.primary};">View Project</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Portfolio -->
    ${nonEmptyPortfolio.length > 0 ? `
    <div class="section" data-section="portfolio">
      <div class="section-title">Portfolio</div>
      ${nonEmptyPortfolio.map((item: any, index: number) => `
        <div class="entry-grid" data-section="portfolio" data-index="${index}">
          <div class="entry-date-col">${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ''])}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-description">${item.description || ''}</div>
            ${item.url ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="text-decoration: underline; color: ${currentTheme.primary};">View Portfolio</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Leadership Positions -->
    ${nonEmptyLeadershipPositions.length > 0 ? `
    <div class="section" data-section="leadershipPositions">
      <div class="section-title">Leadership & Positions</div>
      ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
        const dateRange = formatDateRange(item.startDate, item.endDate);
        
        return `
        <div class="entry-grid" data-section="leadershipPositions" data-index="${index}">
          <div class="entry-date-col">${dateRange ? dateRange.replace(' – ', '<br/>') : ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.position || item.title || ''}</div>
            <div class="entry-subtitle">${item.organization || ''}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Volunteering -->
    ${nonEmptyVolunteering.length > 0 ? `
    <div class="section" data-section="volunteering">
      <div class="section-title">Volunteering</div>
      ${nonEmptyVolunteering.map((item: any, index: number) => `
        <div class="entry-grid" data-section="volunteering" data-index="${index}">
          <div class="entry-date-col">${item.duration || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.role || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.causeArea])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Military Service -->
    ${nonEmptyMilitaryService.length > 0 ? `
    <div class="section" data-section="militaryService">
      <div class="section-title">Military Service</div>
      ${nonEmptyMilitaryService.map((item: any, index: number) => `
        <div class="entry-grid" data-section="militaryService" data-index="${index}">
          <div class="entry-date-col">${item.duration || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.rank ? item.rank : ''}${item.rank && item.branch ? ' - ' : ''}${item.branch || ''}</div>
            ${item.specialization ? `<div class="entry-subtitle">${item.specialization}</div>` : ''}
            <div class="entry-description">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Teaching Experience -->
    ${nonEmptyTeachingExperience.length > 0 ? `
    <div class="section" data-section="teachingExperience">
      <div class="section-title">Teaching Experience</div>
      ${nonEmptyTeachingExperience.map((item: any, index: number) => `
        <div class="entry-grid" data-section="teachingExperience" data-index="${index}">
          <div class="entry-date-col">${item.duration || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.subjectCourseTaught || item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.institution])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Mentorship Experience -->
    ${nonEmptyMentorshipExperience.length > 0 ? `
    <div class="section" data-section="mentorshipExperience">
      <div class="section-title">Mentorship Experience</div>
      ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
        <div class="entry-grid" data-section="mentorshipExperience" data-index="${index}">
          <div class="entry-date-col">${item.duration || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.mentorshipArea || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Research Grants -->
    ${nonEmptyResearchGrants.length > 0 ? `
    <div class="section" data-section="researchGrants">
      <div class="section-title">Research Grants</div>
      ${nonEmptyResearchGrants.map((item: any, index: number) => `
        <div class="entry-grid" data-section="researchGrants" data-index="${index}">
          <div class="entry-date-col">${item.year || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Publications -->
    ${nonEmptyPublications.length > 0 ? `
    <div class="section" data-section="publications">
      <div class="section-title">Publications</div>
      ${nonEmptyPublications.map((item: any, index: number) => `
        <div class="entry-grid" data-section="publications" data-index="${index}">
          <div class="entry-date-col">${item.year || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
            ${item.authors ? `<div class="entry-description"><strong>Authors:</strong> ${item.authors}</div>` : ''}
            ${item.urlDoi ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank" style="text-decoration: underline; color: ${currentTheme.primary};">View Publication</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Patents -->
    ${nonEmptyPatents.length > 0 ? `
    <div class="section" data-section="patents">
      <div class="section-title">Patents</div>
      ${nonEmptyPatents.map((item: any, index: number) => `
        <div class="entry-grid" data-section="patents" data-index="${index}">
          <div class="entry-date-col">${item.year || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : '', item.issuingAuthority])}</div>
            ${item.status ? `<div class="entry-description"><strong>Status:</strong> ${item.status}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Test Scores -->
    ${nonEmptyTestScores.length > 0 ? `
    <div class="section" data-section="testScores">
      <div class="section-title">Test Scores</div>
      ${nonEmptyTestScores.map((item: any, index: number) => `
        <div class="entry-grid" data-section="testScores" data-index="${index}">
          <div class="entry-date-col">${item.year || ''}</div>
          <div class="entry-content-col">
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
        <div class="entry-grid" data-section="scholarships" data-index="${index}">
          <div class="entry-date-col">${item.year || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Co-curricular Activities -->
    ${nonEmptyCoCurricular.length > 0 ? `
    <div class="section" data-section="coCurricular">
      <div class="section-title">Co-curricular Activities</div>
      ${nonEmptyCoCurricular.map((item: any, index: number) => `
        <div class="entry-grid" data-section="coCurricular" data-index="${index}">
          <div class="entry-date-col">${item.year || formatDateRange(item.startDate, item.endDate) || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.activity || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Extracurricular Activities -->
    ${nonEmptyExtracurricular.length > 0 ? `
    <div class="section" data-section="extracurricular">
      <div class="section-title">Extracurricular Activities</div>
      ${nonEmptyExtracurricular.map((item: any, index: number) => `
        <div class="entry-grid" data-section="extracurricular" data-index="${index}">
          <div class="entry-date-col">${item.year || formatDateRange(item.startDate, item.endDate) || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.activity || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
            <div class="entry-description">${item.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Skills -->
    ${nonEmptySkills.length > 0 ? `
    <div class="section" data-section="skills">
      <div class="section-title">Skills</div>
      <div class="entry-grid">
        <div class="entry-date-col"></div>
        <div class="entry-content-col">
           <div class="skills-grid">
             ${nonEmptySkills.map((skill: any, index: number) => `
               <span class="skill-item" data-section="skills" data-index="${index}">${typeof skill === 'string' ? skill.trim() : skill}</span>
             `).join('')}
           </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Tools & Technologies -->
    ${nonEmptyToolsTechnologies.length > 0 ? `
    <div class="section" data-section="toolsTechnologies">
      <div class="section-title">Tools & Technologies</div>
      <div class="entry-grid">
        <div class="entry-date-col"></div>
        <div class="entry-content-col">
           <div class="skills-grid">
             ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
               <span class="skill-item" data-section="toolsTechnologies" data-index="${index}">${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}</span>
             `).join('')}
           </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Methodologies -->
    ${nonEmptyMethodologies.length > 0 ? `
    <div class="section" data-section="methodologies">
      <div class="section-title">Methodologies</div>
      <div class="entry-grid">
        <div class="entry-date-col"></div>
        <div class="entry-content-col">
           <div class="skills-grid">
             ${nonEmptyMethodologies.map((item: any, index: number) => `
               <span class="skill-item" data-section="methodologies" data-index="${index}">${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}</span>
             `).join('')}
           </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Industry Expertise -->
    ${nonEmptyIndustryExpertise.length > 0 ? `
    <div class="section" data-section="industryExpertise">
      <div class="section-title">Industry Expertise</div>
      <div class="entry-grid">
        <div class="entry-date-col"></div>
        <div class="entry-content-col">
           <div class="skills-grid">
             ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
               <span class="skill-item" data-section="industryExpertise" data-index="${index}">${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}</span>
             `).join('')}
           </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Languages -->
    ${nonEmptyLanguages.length > 0 ? `
    <div class="section" data-section="languages">
      <div class="section-title">Languages</div>
      <div class="entry-grid">
        <div class="entry-date-col"></div>
        <div class="entry-content-col">
           <div class="skills-grid">
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
      <div class="entry-grid">
        <div class="entry-date-col"></div>
        <div class="entry-content-col">
           <div class="skills-grid">
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
      <div class="entry-grid">
        <div class="entry-date-col"></div>
        <div class="entry-content-col">
           <div style="display: flex; flex-wrap: wrap; gap: 15px;">
             ${nonEmptySocialLinks.map((link: any, index: number) => `
               <a href="${link.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none; font-size: ${baseFontSize}px;" data-section="socialLinks" data-index="${index}">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
             `).join('')}
           </div>
        </div>
      </div>
    </div>` : ''}

    <!-- Social Profiles -->
    ${nonEmptySocialProfiles.length > 0 ? `
    <div class="section" data-section="socialProfiles">
      <div class="section-title">Social Profiles</div>
      <div class="entry-grid">
        <div class="entry-date-col"></div>
        <div class="entry-content-col">
           <div style="display: flex; flex-wrap: wrap; gap: 15px;">
             ${nonEmptySocialProfiles.map((profile: any, index: number) => `
               <a href="${profile.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none; font-size: ${baseFontSize}px;" data-section="socialProfiles" data-index="${index}">${profile.platform || "Profile"}</a>
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
        <div class="entry-grid" data-section="certifications" data-index="${index}">
          <div class="entry-date-col">${cert.date || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${cert.name || ''}</div>
            <div class="entry-subtitle">${cert.issuer || ''}</div>
            ${cert.description ? `<div class="entry-description">${cert.description}</div>` : ''}
            ${cert.url ? `<div class="entry-description" style="margin-top: 5px;"><a href="${cert.url}" target="_blank" style="text-decoration: underline; color: ${currentTheme.primary};">View Certificate</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Awards -->
    ${nonEmptyAwards.length > 0 ? `
    <div class="section" data-section="awards">
      <div class="section-title">Awards</div>
      ${nonEmptyAwards.map((award: any, index: number) => `
        <div class="entry-grid" data-section="awards" data-index="${index}">
          <div class="entry-date-col">${award.issueYear || award.year || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${award.title || ''}</div>
            <div class="entry-subtitle">${award.organization || ''}</div>
            ${award.description ? `<div class="entry-description">${award.description}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Speaking Engagements -->
    ${nonEmptySpeakingEngagements.length > 0 ? `
    <div class="section" data-section="speakingEngagements">
      <div class="section-title">Speaking Engagements</div>
      ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
        <div class="entry-grid" data-section="speakingEngagements" data-index="${index}">
          <div class="entry-date-col">${item.date || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.topic || ''}</div>
            <div class="entry-subtitle">${item.eventName || ''}</div>
            ${item.description ? `<div class="entry-description">${item.description}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Memberships -->
    ${nonEmptyMemberships.length > 0 ? `
    <div class="section" data-section="memberships">
      <div class="section-title">Memberships</div>
      ${nonEmptyMemberships.map((item: any, index: number) => `
        <div class="entry-grid" data-section="memberships" data-index="${index}">
          <div class="entry-date-col">${item.year || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.membershipName || ''}</div>
            <div class="entry-subtitle">${item.organizationName || ''}</div>
            ${item.description ? `<div class="entry-description">${item.description}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Workshops -->
    ${nonEmptyWorkshops.length > 0 ? `
    <div class="section" data-section="workshops">
      <div class="section-title">Workshops</div>
      ${nonEmptyWorkshops.map((item: any, index: number) => `
        <div class="entry-grid" data-section="workshops" data-index="${index}">
          <div class="entry-date-col">${item.year || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${item.programTitle || ''}</div>
            <div class="entry-subtitle">${item.conductedBy || ''}</div>
            ${item.description ? `<div class="entry-description">${item.description}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- References -->
    ${nonEmptyReferences.length > 0 ? `
    <div class="section" data-section="references">
      <div class="section-title">References</div>
      ${nonEmptyReferences.map((ref: any, index: number) => `
        <div class="entry-grid" data-section="references" data-index="${index}">
          <div class="entry-date-col"></div>
          <div class="entry-content-col">
            <div class="entry-title">${ref.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
            ${ref.contactInformation ? `<div class="entry-description"><strong>Contact:</strong> ${ref.contactInformation}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Key Achievements -->
    ${nonEmptyKeyAchievements.length > 0 ? `
    <div class="section" data-section="keyAchievements">
      <div class="section-title">Key Achievements</div>
      <div class="entry-grid">
        <div class="entry-date-col"></div>
        <div class="entry-content-col">
          <div class="entry-description">
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
      <div class="entry-grid">
        <div class="entry-date-col"></div>
        <div class="entry-content-col">
          <div class="entry-description">
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
      <div class="entry-grid">
        <div class="entry-date-col"></div>
        <div class="entry-content-col">
          <div class="entry-description">
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
        <div class="entry-grid" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
          <div class="entry-date-col">${entry.date || ''}</div>
          <div class="entry-content-col">
            <div class="entry-title">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
            ${entry.description ? `<div class="entry-description">${entry.description}</div>` : ''}
          </div>
        </div>
      `).join('') : '<div style="color: #666666; font-style: italic;">No entries in this section</div>'}
    </div>
    `).join('') : ''}

  </div>
</body>
</html>`
}