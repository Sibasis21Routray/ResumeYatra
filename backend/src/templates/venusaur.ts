export function buildVenusaurTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#000000",
    secondary: "#444444",
    background: "#ffffff",
    headingFont: "Arial",
    bodyFont: "Arial",
  };

  // --- PRESERVED LOGIC START ---
  const currentTheme = theme || defaultTheme;

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14; // Default 14px
  const userFontFamily =
    data.formatting?.fontFamily || data.fontFamily || "Open Sans, sans-serif";

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
  const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size
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
      background: #ffffff;
      padding: 40px 50px;
    }
    
    /* Header Styles */
    .header {
      margin-bottom: 40px;
      border-bottom: 2px solid ${currentTheme.primary};
      padding-bottom: 15px;
    }
    .name {
      font-size: ${Math.round(headingFontSize * 1.1)}px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
      color: ${currentTheme.primary};
    }
    .contact {
      font-size: ${baseFontSize}px;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      color: #333;
    }
    .contact span {
      display: flex;
      align-items: center;
    }
    /* Separator pipe for contact */
    .contact span:not(:last-child)::after {
      content: "|";
      margin-left: 15px;
      color: ${currentTheme.primary};
      font-weight: bold;
    }
    .contact a {
      color: inherit;
      text-decoration: none;
    }

    /* Section Styles */
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      font-weight: 800;
      color: ${currentTheme.primary};
      text-transform: uppercase;
      margin-bottom: 15px;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #ccc; /* Light separator for sections */
      padding-bottom: 5px;
    }

    /* Entry Grid Layout (Left Date, Right Content) */
    .entry {
      display: grid;
      grid-template-columns: 130px 1fr; /* Date width fixed, Content takes rest */
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
      font-weight: 800;
      font-size: ${subheadingFontSize}px;
      color: ${currentTheme.primary};
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    
    .entry-subtitle {
      font-weight: 600;
      font-style: italic;
      margin-bottom: 8px;
      color: #444;
    }

    .entry-description {
      font-size: ${baseFontSize}px;
      color: #333;
    }

    /* Bullets styling */
    .entry-description ul {
      margin: 5px 0 5px 20px;
      padding: 0;
      list-style-type: square; /* Square bullets per image */
    }
    .entry-description li {
      margin-bottom: 4px;
      padding-left: 5px;
    }

    /* Skills Layout - Simple Grid/List */
    .skills-section-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 40px;
    }
    .skill-item {
      display: flex;
      align-items: center;
      font-size: ${baseFontSize}px;
    }
    .skill-bullet {
      width: 6px;
      height: 6px;
      background: ${currentTheme.primary};
      margin-right: 10px;
    }

    /* Enhanced Education Styles */
    .education-field {
      font-weight: 800;
      color: ${currentTheme.primary};
      margin-bottom: 6px;
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      text-transform: uppercase;
    }

    .education-school {
      font-weight: 800;
      color: ${currentTheme.primary};
      margin-bottom: 6px;
      text-transform: uppercase;
    }

    .education-location {
      color: #444;
      font-style: italic;
      margin-bottom: 8px;
    }

    .education-description {
      font-size: ${baseFontSize}px;
      color: #333;
      line-height: 1.6;
      margin-top: 8px;
      padding: 8px;
      background: #f9f9f9;
      border-left: 3px solid ${currentTheme.primary};
    }

    .education-description ul {
      margin: 6px 0 6px 20px;
      padding: 0;
      list-style-type: square;
    }

    .education-description li {
      margin: 3px 0;
      color: #333;
    }

    .education-description b {
      font-weight: 800;
      color: ${currentTheme.primary};
    }

    .education-achievements {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #ccc;
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      font-weight: 800;
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
      color: #333;
      font-size: ${baseFontSize}px;
    }

    .education-achievements li:before {
      content: "■";
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
      background: #f9f9f9;
      padding: 10px;
      border-left: 3px solid ${currentTheme.primary};
    }

    .metric-value {
      font-weight: 800;
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      color: ${currentTheme.primary};
    }

    .metric-label {
      font-size: ${Math.round(baseFontSize * 0.8)}px;
      color: #666;
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
    }

    /* Summary Section - Just text */
    .summary-text {
      font-size: ${baseFontSize}px;
      color: #333;
    }

    /* Responsive adjustment for mobile or small screens (though PDF is fixed) */
    @media (max-width: 600px) {
      .entry { grid-template-columns: 1fr; }
      .entry-date-col { margin-bottom: 5px; }
    }

    @media print {
      body { background: white; }
      .container { padding: 0; box-shadow: none; margin: 0; width: 100%; max-width: none; }
      .header { border-bottom: 2px solid #000 !important; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
<div class="container">
  <div class="header" data-section="personal">
    <div class="name" data-section="personal">${
      data.personal?.name && data.personal?.name !== "undefined"
        ? data.personal.name
        : "Your Name"
    }${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</div>
    ${
      data.personal?.role
        ? `<div style="font-size: 16px; margin-bottom: 10px; font-weight: 600;" data-section="personal">${data.personal.role}</div>`
        : ""
    }
    <div class="contact" data-section="personal">
      ${data.personal?.email ? `<span data-section="personal">✉️ ${data.personal.email}</span>` : ""}
      ${data.personal?.phone ? `<span data-section="personal">📞 ${data.personal.phone}</span>` : ""}
      ${data.personal?.alternatePhone ? `<span data-section="personal">📞 ${data.personal.alternatePhone}</span>` : ""}
      ${(() => {
        const addressParts = [
          data.personal?.fullAddress,
          data.personal?.location,
          data.personal?.country,
          data.personal?.pinCode
        ].filter(Boolean);
        return addressParts.length > 0 ? `<span data-section="personal">📍 ${addressParts.join(", ")}</span>` : "";
      })()}
      
      <!-- Social Links in header -->
      ${data.personal?.linkedinUrl ? `<span data-section="personal"><a href="${data.personal.linkedinUrl}" target="_blank">🔗 LinkedIn</a></span>` : ""}
      ${data.personal?.githubUrl ? `<span data-section="personal"><a href="${data.personal.githubUrl}" target="_blank">🐙 GitHub</a></span>` : ""}
      ${data.personal?.portfolioUrl ? `<span data-section="personal"><a href="${data.personal.portfolioUrl}" target="_blank">💼 Portfolio</a></span>` : ""}
      ${data.personal?.website ? `<span data-section="personal"><a href="${data.personal.website}" target="_blank">🌐 Website</a></span>` : ""}
      ${data.personal?.twitterUrl ? `<span data-section="personal"><a href="${data.personal.twitterUrl}" target="_blank">🐦 Twitter</a></span>` : ""}
      ${data.personal?.facebookUrl ? `<span data-section="personal"><a href="${data.personal.facebookUrl}" target="_blank">📘 Facebook</a></span>` : ""}
      ${data.personal?.instagramUrl ? `<span data-section="personal"><a href="${data.personal.instagramUrl}" target="_blank">📷 Instagram</a></span>` : ""}
      ${data.personal?.behanceUrl ? `<span data-section="personal"><a href="${data.personal.behanceUrl}" target="_blank">🎨 Behance</a></span>` : ""}
      ${data.personal?.dribbbleUrl ? `<span data-section="personal"><a href="${data.personal.dribbbleUrl}" target="_blank">🏀 Dribbble</a></span>` : ""}
      ${data.personal?.stackoverflowUrl ? `<span data-section="personal"><a href="${data.personal.stackoverflowUrl}" target="_blank">📚 Stack Overflow</a></span>` : ""}
      ${data.personal?.mediumUrl ? `<span data-section="personal"><a href="${data.personal.mediumUrl}" target="_blank">📝 Medium</a></span>` : ""}
      
      <!-- Inline personal details in header (if configured) -->
      ${(() => {
        if (data.personal?.personalInfoDisplay === "inline") {
          const inlineItems = [];
          if (data.personal?.fathersName) inlineItems.push(`<span data-section="personal">👨 Father: ${data.personal.fathersName}</span>`);
          if (data.personal?.dob) inlineItems.push(`<span data-section="personal">📅 DOB: ${data.personal.dob}</span>`);
          if (data.personal?.gender) inlineItems.push(`<span data-section="personal">⚥ ${data.personal.gender}</span>`);
          if (data.personal?.maritalStatus) inlineItems.push(`<span data-section="personal">💍 ${data.personal.maritalStatus}</span>`);
          if (data.personal?.nationality) inlineItems.push(`<span data-section="personal">🌍 ${data.personal.nationality}</span>`);
          return inlineItems.join('');
        }
        return '';
      })()}
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

    <!-- Personal Details (non-inline) -->
    ${
      data.personal?.personalInfoDisplay !== "inline" &&
      (data.personal?.fathersName ||
        data.personal?.dob ||
        data.personal?.gender ||
        data.personal?.maritalStatus ||
        data.personal?.nationality ||
        data.personal?.passportNo) ? `
    <div class="section">
      <div class="section-title">Personal Details</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 30px; font-size: ${baseFontSize}px;">
        ${data.personal?.fathersName ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ""}
        ${data.personal?.dob ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>` : ""}
        ${data.personal?.gender ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>` : ""}
        ${data.personal?.maritalStatus ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ""}
        ${data.personal?.nationality ? `<div><strong>Nationality:</strong> ${data.personal.nationality}</div>` : ""}
        ${data.personal?.passportNo ? `<div><strong>Passport No:</strong> ${data.personal.passportNo}</div>` : ""}
      </div>
    </div>
    ` : ""
    }

    <div class="content-wrapper">
      <!-- Summary -->
      ${data.summary && data.summary.trim() ? `
      <div class="section" data-section="summary">
        <div class="section-title">Professional Summary</div>
        <p class="summary-text" data-section="summary">${data.summary}</p>
      </div>` : ""}

      <!-- Career Objective -->
      ${data.careerObjective && data.careerObjective.trim() ? `
      <div class="section" data-section="careerObjective">
        <div class="section-title">Career Objective</div>
        <p class="summary-text" data-section="careerObjective">${data.careerObjective}</p>
      </div>` : ""}

      <!-- Work Experience -->
      ${hasNonEmptyItems(data.experience) ? `
      <div class="section" data-section="experience">
        <div class="section-title">Work History</div>
        ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
          const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
          const subtitle = formatSubtitle([exp.company, exp.location, exp.domain]);
          
          return `
          <div class="entry" data-section="experience" data-index="${index}">
            <div class="entry-date-col">
              ${dateRange ? dateRange.replace(' – ', ' -<br/>') : ''}
            </div>
            <div class="entry-content-col">
              <div class="entry-title">${exp.title || ''}</div>
              ${subtitle ? `<div class="entry-subtitle">${subtitle}</div>` : ''}
              ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
              ${exp.achievements ? `<div class="entry-description" style="margin-top: 8px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ''}
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
            <div class="entry-date-col">
              ${dateRange ? dateRange.replace(' – ', ' -<br/>') : ''}
            </div>
            <div class="entry-content-col">
              <div class="entry-title">${item.title || ''}</div>
              ${subtitle ? `<div class="entry-subtitle">${subtitle}</div>` : ''}
              ${item.description ? `<div class="entry-description">${item.description}</div>` : ''}
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
            <div class="entry-date-col">
              ${item.completionDate || ''}
            </div>
            <div class="entry-content-col">
              <div class="entry-title">${item.name || ''}</div>
              <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
              ${item.description ? `<div class="entry-description">${item.description}</div>` : ''}
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
            <div class="entry-date-col">
              ${edu.graduationDate || ''}
            </div>
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
          <div class="entry" data-section="academicProjects" data-index="${index}">
            <div class="entry-date-col">
              ${item.duration || ''}
            </div>
            <div class="entry-content-col">
              <div class="entry-title">${item.name || item.title || ''}</div>
              <div class="entry-subtitle">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ''])}</div>
              <div class="entry-description">${item.description || ''}</div>
              ${item.technologies ? `<div class="entry-description" style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
              ${item.url ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Project</a></div>` : ''}
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
            <div class="entry-date-col">
              ${item.duration || ''}
            </div>
            <div class="entry-content-col">
              <div class="entry-title">${item.name || ''}</div>
              <div class="entry-subtitle">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ''])}</div>
              <div class="entry-description">${item.description || ''}</div>
              ${item.toolsTechnologies ? `<div class="entry-description"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ''}
              ${item.projectUrl ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Project</a></div>` : ''}
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
            <div class="entry-date-col">
              ${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ''])}
            </div>
            <div class="entry-content-col">
              <div class="entry-title">${item.name || ''}</div>
              <div class="entry-description">${item.description || ''}</div>
              ${item.url ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Portfolio</a></div>` : ''}
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
            <div class="entry-date-col">
              ${dateRange ? dateRange.replace(' – ', ' -<br/>') : ''}
            </div>
            <div class="entry-content-col">
              <div class="entry-title">${project.name || ''}</div>
              <div class="entry-subtitle">${project.technologies || ''}</div>
              <div class="entry-description">${project.description || ''}</div>
              ${project.url ? `<div class="entry-description" style="margin-top: 5px;"><a href="${project.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">${project.urlText || 'View Project'}</a></div>` : ''}
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
            <div class="entry-date-col">
              ${dateRange ? dateRange.replace(' – ', ' -<br/>') : ''}
            </div>
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
          <div class="entry" data-section="volunteering" data-index="${index}">
            <div class="entry-date-col">
              ${item.duration || ''}
            </div>
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
          <div class="entry" data-section="militaryService" data-index="${index}">
            <div class="entry-date-col">
              ${item.duration || ''}
            </div>
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
          <div class="entry" data-section="teachingExperience" data-index="${index}">
            <div class="entry-date-col">
              ${item.duration || ''}
            </div>
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
          <div class="entry" data-section="mentorshipExperience" data-index="${index}">
            <div class="entry-date-col">
              ${item.duration || ''}
            </div>
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
          <div class="entry" data-section="researchGrants" data-index="${index}">
            <div class="entry-date-col">
              ${item.year || ''}
            </div>
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
          <div class="entry" data-section="publications" data-index="${index}">
            <div class="entry-date-col">
              ${item.year || ''}
            </div>
            <div class="entry-content-col">
              <div class="entry-title">${item.title || ''}</div>
              <div class="entry-subtitle">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
              ${item.authors ? `<div class="entry-description"><strong>Authors:</strong> ${item.authors}</div>` : ''}
              ${item.urlDoi ? `<div class="entry-description" style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">${item.urlDoi}</a></div>` : ''}
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
            <div class="entry-date-col">
              ${item.year || ''}
            </div>
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
          <div class="entry" data-section="testScores" data-index="${index}">
            <div class="entry-date-col">
              ${item.year || ''}
            </div>
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
          <div class="entry" data-section="scholarships" data-index="${index}">
            <div class="entry-date-col">
              ${item.year || ''}
            </div>
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
          <div class="entry" data-section="coCurricular" data-index="${index}">
            <div class="entry-date-col">
              ${item.year || ''}
            </div>
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
          <div class="entry" data-section="extracurricular" data-index="${index}">
            <div class="entry-date-col">
              ${item.year || ''}
            </div>
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
        <div class="skills-section-content">
          ${nonEmptySkills.map((skill: any, index: number) => `
            <div class="skill-item" data-section="skills" data-index="${index}">
               <div class="skill-bullet"></div>
               <div>${typeof skill === "string" ? skill.trim() : skill}</div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Tools & Technologies -->
      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="section" data-section="toolsTechnologies">
        <div class="section-title">Tools & Technologies</div>
        <div class="skills-section-content">
          ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
            <div class="skill-item" data-section="toolsTechnologies" data-index="${index}">
               <div class="skill-bullet"></div>
               <div>${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Methodologies -->
      ${nonEmptyMethodologies.length > 0 ? `
      <div class="section" data-section="methodologies">
        <div class="section-title">Methodologies</div>
        <div class="skills-section-content">
          ${nonEmptyMethodologies.map((item: any, index: number) => `
            <div class="skill-item" data-section="methodologies" data-index="${index}">
               <div class="skill-bullet"></div>
               <div>${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Industry Expertise -->
      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section" data-section="industryExpertise">
        <div class="section-title">Industry Expertise</div>
        <div class="skills-section-content">
          ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
            <div class="skill-item" data-section="industryExpertise" data-index="${index}">
               <div class="skill-bullet"></div>
               <div>${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Languages -->
      ${nonEmptyLanguages.length > 0 ? `
      <div class="section" data-section="languages">
        <div class="section-title">Languages</div>
        <div class="skills-section-content">
          ${nonEmptyLanguages.map((lang: any, index: number) => `
            <div class="skill-item" data-section="languages" data-index="${index}">
               <div class="skill-bullet"></div>
               <div>${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Hobbies -->
      ${nonEmptyHobbies.length > 0 ? `
      <div class="section" data-section="hobbies">
        <div class="section-title">Hobbies & Interests</div>
        <div class="skills-section-content">
          ${nonEmptyHobbies.map((hobby: any, index: number) => `
            <div class="skill-item" data-section="hobbies" data-index="${index}">
               <div class="skill-bullet"></div>
               <div>${hobby}</div>
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Social Links -->
      ${nonEmptySocialLinks.length > 0 ? `
      <div class="section" data-section="socialLinks">
        <div class="section-title">Social Links</div>
        <div class="tags-container" data-section="socialLinks">
          ${nonEmptySocialLinks.map((link: any, index: number) => `
            <a href="${link.url}" target="_blank" class="tag" style="background: #f0f0f0; color: ${currentTheme.primary}; text-decoration: none; display: inline-block;">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Social Profiles -->
      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="section" data-section="socialProfiles">
        <div class="section-title">Social Profiles</div>
        <div class="tags-container" data-section="socialProfiles">
          ${nonEmptySocialProfiles.map((profile: any, index: number) => `
            <a href="${profile.url}" target="_blank" class="tag" style="background: #f0f0f0; color: ${currentTheme.primary}; text-decoration: none; display: inline-block;">${profile.platform || "Profile"}</a>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- Certifications -->
      ${nonEmptyCertifications.length > 0 ? `
      <div class="section" data-section="certifications">
        <div class="section-title">Certifications</div>
        ${nonEmptyCertifications.map((cert: any, index: number) => `
          <div class="entry" data-section="certifications" data-index="${index}">
            <div class="entry-date-col">
              ${cert.date || ''}
            </div>
            <div class="entry-content-col">
              <div class="entry-title">${cert.name || ''}</div>
              <div class="entry-subtitle">${cert.issuer || ''}</div>
              ${cert.description ? `<div class="entry-description">${cert.description}</div>` : ''}
              ${cert.url ? `<div class="entry-description" style="margin-top: 5px;"><a href="${cert.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Certificate</a></div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Key Achievements -->
      ${nonEmptyKeyAchievements.length > 0 ? `
      <div class="section" data-section="keyAchievements">
        <div class="section-title">Key Achievements</div>
        <div class="entry-description">
          <ul data-section="keyAchievements">
            ${nonEmptyKeyAchievements.map((achievement: string, index: number) =>
              `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`
            ).join('')}
          </ul>
        </div>
      </div>` : ''}

      <!-- Key Responsibilities -->
      ${nonEmptyResponsibilities.length > 0 ? `
      <div class="section" data-section="responsibilities">
        <div class="section-title">Key Responsibilities</div>
        <div class="entry-description">
          <ul data-section="responsibilities">
            ${nonEmptyResponsibilities.map((line: string, index: number) =>
              `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`
            ).join('')}
          </ul>
        </div>
      </div>` : ''}

      <!-- Tools -->
      ${nonEmptyTools.length > 0 ? `
      <div class="section" data-section="tools">
        <div class="section-title">Tools & Technologies</div>
        <div class="entry-description">
          <ul data-section="tools">
            ${nonEmptyTools.map((line: string, index: number) =>
              `<li data-section="tools" data-index="${index}">${line.trim()}</li>`
            ).join('')}
          </ul>
        </div>
      </div>` : ''}

      <!-- Awards -->
      ${nonEmptyAwards.length > 0 ? `
      <div class="section" data-section="awards">
        <div class="section-title">Awards</div>
        ${nonEmptyAwards.map((award: any, index: number) => `
          <div class="entry" data-section="awards" data-index="${index}">
            <div class="entry-date-col">
              ${award.issueYear || award.year || ''}
            </div>
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
          <div class="entry" data-section="speakingEngagements" data-index="${index}">
            <div class="entry-date-col">
              ${item.date || ''}
            </div>
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
          <div class="entry" data-section="memberships" data-index="${index}">
            <div class="entry-date-col">
              ${item.year || ''}
            </div>
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
          <div class="entry" data-section="workshops" data-index="${index}">
            <div class="entry-date-col">
              ${item.year || ''}
            </div>
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
          <div class="entry" data-section="references" data-index="${index}">
            <div class="entry-content-col" style="grid-column: 1/-1;">
              <div class="entry-title">${ref.name || ''}</div>
              <div class="entry-subtitle">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
              ${ref.contactInformation ? `<div class="entry-description"><strong>Contact:</strong> ${ref.contactInformation}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Custom Sections -->
      ${nonEmptyCustomSections.length > 0 ? data.customSections
        .filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries))
        .map((section: any) => `
      <div class="section" data-section="customSections">
        <div class="section-title">${section.heading || 'Custom Section'}</div>
        ${section.entries && section.entries.length > 0 ? section.entries
          .filter((entry: any) => entry.isVisible && (entry.title || entry.description))
          .map((entry: any, entryIndex: number) => `
          <div class="entry" data-section="customSections" data-index="${entryIndex}">
            <div class="entry-date-col">
              ${entry.date || ''}
            </div>
            <div class="entry-content-col">
              <div class="entry-title">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
              ${entry.description ? `<div class="entry-description">${entry.description}</div>` : ''}
            </div>
          </div>
        `).join('') : '<div style="color: #666666; font-style: italic;">No entries in this section</div>'}
      </div>
      `).join('') : ""}
    </div>
  </div>
</body>
</html>`;
}