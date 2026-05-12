export function buildBlastoiseTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#0d3b66",
    secondary: "#7f8c8d",
    background: "#ffffff",
    sidebarBg: "#0d3b66",
    headingFont: "Inter, sans-serif",
    bodyFont: "Inter, sans-serif",
  };

  const currentTheme = theme || defaultTheme;

  const textColor = "#2c3e50";
  const lightText = "#ffffff";
  const mutedColor = "#7f8c8d";
  const borderColor = "#d5d8dc";
  const backgroundColor = currentTheme.background;
  const sidebarBg = "#0d3b66";

  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 11;
  const userFontFamily =
    data.formatting?.fontFamily ||
    data.fontFamily ||
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  const baseFontSize = userFontSize;
  const nameFontSize = Math.round(userFontSize * 2.4);
  const headingFontSize = Math.round(userFontSize * 1.3);
  const subHeadingFontSize = Math.round(userFontSize * 1.0);

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

  // Build contact items (filtered)
  const contactItems = [];
  if (data.personal?.email) contactItems.push(data.personal.email);
  if (data.personal?.phone) contactItems.push(data.personal.phone);
  if (data.personal?.alternatePhone) contactItems.push(data.personal.alternatePhone);
  
  const addressParts = [
    data.personal?.fullAddress,
    data.personal?.location,
    data.personal?.country,
    data.personal?.pinCode
  ].filter(Boolean);
  if (addressParts.length > 0) contactItems.push(addressParts.join(", "));
  
  if (data.personal?.linkedinUrl) contactItems.push(`<a href="${data.personal.linkedinUrl}" target="_blank" style="color: ${textColor}; text-decoration: none;">LinkedIn: ${data.personal.linkedinUrl.replace("https://", "").replace("http://", "")}</a>`);
  if (data.personal?.githubUrl) contactItems.push(`<a href="${data.personal.githubUrl}" target="_blank" style="color: ${textColor}; text-decoration: none;">GitHub: ${data.personal.githubUrl.replace("https://", "").replace("http://", "")}</a>`);
  if (data.personal?.portfolioUrl) contactItems.push(`<a href="${data.personal.portfolioUrl}" target="_blank" style="color: ${textColor}; text-decoration: none;">Portfolio: ${data.personal.portfolioUrl.replace("https://", "").replace("http://", "")}</a>`);
  if (data.personal?.website) contactItems.push(`<a href="${data.personal.website}" target="_blank" style="color: ${textColor}; text-decoration: none;">Website: ${data.personal.website.replace("https://", "").replace("http://", "")}</a>`);
  if (data.personal?.twitterUrl) contactItems.push(`<a href="${data.personal.twitterUrl}" target="_blank" style="color: ${textColor}; text-decoration: none;">Twitter: ${data.personal.twitterUrl.replace("https://", "").replace("http://", "")}</a>`);
  if (data.personal?.facebookUrl) contactItems.push(`<a href="${data.personal.facebookUrl}" target="_blank" style="color: ${textColor}; text-decoration: none;">Facebook: ${data.personal.facebookUrl.replace("https://", "").replace("http://", "")}</a>`);
  if (data.personal?.instagramUrl) contactItems.push(`<a href="${data.personal.instagramUrl}" target="_blank" style="color: ${textColor}; text-decoration: none;">Instagram: ${data.personal.instagramUrl.replace("https://", "").replace("http://", "")}</a>`);
  if (data.personal?.behanceUrl) contactItems.push(`<a href="${data.personal.behanceUrl}" target="_blank" style="color: ${textColor}; text-decoration: none;">Behance: ${data.personal.behanceUrl.replace("https://", "").replace("http://", "")}</a>`);
  if (data.personal?.dribbbleUrl) contactItems.push(`<a href="${data.personal.dribbbleUrl}" target="_blank" style="color: ${textColor}; text-decoration: none;">Dribbble: ${data.personal.dribbbleUrl.replace("https://", "").replace("http://", "")}</a>`);
  if (data.personal?.stackoverflowUrl) contactItems.push(`<a href="${data.personal.stackoverflowUrl}" target="_blank" style="color: ${textColor}; text-decoration: none;">Stack Overflow: ${data.personal.stackoverflowUrl.replace("https://", "").replace("http://", "")}</a>`);
  if (data.personal?.mediumUrl) contactItems.push(`<a href="${data.personal.mediumUrl}" target="_blank" style="color: ${textColor}; text-decoration: none;">Medium: ${data.personal.mediumUrl.replace("https://", "").replace("http://", "")}</a>`);
  if (data.personal?.fathersName) contactItems.push(`Father's Name: ${data.personal.fathersName}`);
  if (data.personal?.dob) contactItems.push(`DOB: ${data.personal.dob}`);
  if (data.personal?.gender) contactItems.push(`Gender: ${data.personal.gender}`);
  if (data.personal?.maritalStatus) contactItems.push(`Marital Status: ${data.personal.maritalStatus}`);
  if (data.personal?.nationality) contactItems.push(`Nationality: ${data.personal.nationality}`);
  if (data.personal?.passportNo) contactItems.push(`Passport No: ${data.personal.passportNo}`);
  
  const contactInfo = contactItems.length > 0 ? contactItems.join(" | ") : "";

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
      color: ${textColor};
      line-height: 1.6;
      background: #f5f5f5;
      font-size: ${baseFontSize}px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: ${backgroundColor};
      display: grid;
      grid-template-columns: 3fr 1fr;
      min-height: 100vh;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .left-column {
      padding: 40px 35px;
      background: ${backgroundColor};
    }

    .right-column {
      padding: 40px 35px;
      background: ${sidebarBg};
      color: ${lightText};
    }

    .profile-section {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 25px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    }

    .profile-photo {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      margin: 0 auto 20px;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 60px;
      overflow: hidden;
    }

    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .name {
      font-size: ${nameFontSize}px;
      font-weight: 700;
      color: ${lightText};
      margin-bottom: 8px;
      letter-spacing: 0.5px;
      line-height: 1.2;
    }

    .role {
      font-size: ${subHeadingFontSize}px;
      color: rgba(255, 255, 255, 0.8);
      font-weight: 400;
      margin-bottom: 15px;
    }

    .contact-section {
      margin-bottom: 28px;
    }

    .section-heading {
      font-size: ${Math.round(baseFontSize * 1.0)}px;
      font-weight: 700;
      color: ${lightText};
      margin-bottom: 15px;
      text-transform: capitalize;
      letter-spacing: 0.5px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.2);
      padding-bottom: 10px;
    }

    .contact-item {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      margin-bottom: 10px;
      line-height: 1.5;
      word-break: break-word;
    }

    .contact-item a {
      color: ${lightText};
      text-decoration: none;
    }

    .contact-item a:hover {
      text-decoration: underline;
    }

    .skills-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .skill-item {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      line-height: 1.5;
    }

    .hobbies-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .hobby-item {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      line-height: 1.5;
    }

    .hobbies-list li {
      margin-left: 20px;
    }

    .hobbies-list li::marker {
      color: ${lightText};
    }

    .main-section {
      margin-bottom: 28px;
    }

    .section-title {
      font-size: ${headingFontSize}px;
      font-weight: 700;
      color: ${textColor};
      text-transform: capitalize;
      margin-bottom: 15px;
      border-bottom: 2px solid ${currentTheme.primary};
      padding-bottom: 8px;
      letter-spacing: 0.3px;
    }

    .summary-text {
      font-size: ${baseFontSize}px;
      line-height: 1.7;
      color: ${textColor};
      text-align: left;
    }

    .exp-item {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e8e8e8;
    }

    .exp-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .exp-header {
      margin-bottom: 6px;
    }

    .exp-title {
      font-weight: 700;
      font-size: ${Math.round(baseFontSize * 1.05)}px;
      color: ${textColor};
      margin-bottom: 2px;
    }

    .exp-company {
      font-size: ${baseFontSize}px;
      color: ${mutedColor};
      font-weight: 500;
      margin-bottom: 2px;
    }

    .exp-date {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: ${mutedColor};
      font-weight: 400;
    }

    .exp-description {
      font-size: ${baseFontSize}px;
      line-height: 1.6;
      color: ${textColor};
      margin-top: 8px;
    }

    .exp-achievements {
      list-style: none;
      margin-top: 8px;
      padding-left: 0;
    }

    .exp-achievements li {
      position: relative;
      padding-left: 16px;
      margin-bottom: 6px;
      font-size: ${baseFontSize}px;
      line-height: 1.5;
      color: ${textColor};
    }

    .exp-achievements li:last-child {
      margin-bottom: 0;
    }

    .exp-achievements li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: ${currentTheme.primary};
      font-weight: bold;
    }

    .exp-achievements b {
      font-weight: 700;
      color: ${textColor};
    }

    /* Metrics Grid for Professional Context */
    .metrics-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 15px 0;
    }

    .metric-item {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }

    .metric-value {
      font-weight: 700;
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      color: ${currentTheme.primary};
      min-width: 120px;
    }

    .metric-label {
      font-size: ${Math.round(baseFontSize * 0.8)}px;
      color: ${mutedColor};
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
      padding: 4px 12px;
      border-radius: 4px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: ${textColor};
    }

    @media (max-width: 768px) {
      .container {
        grid-template-columns: 1fr;
      }

      .left-column {
        order: 2;
      }

      .right-column {
        order: 1;
        border-bottom: 2px solid ${borderColor};
      }
    }

    @media print {
      body {
        background: ${sidebarBg};
      }
      .container {
        box-shadow: none;
        max-width: 100%;
      }
      .left-column, .right-column {
        padding: 30px;
      }
      .right-column {
        color: ${lightText};
        background: ${sidebarBg};
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .section-heading {
        color: ${lightText};
        border-bottom-color: #ddd;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="left-column">
      <!-- Professional Context -->
      ${nonEmptyProfessionalContext ? `
      <div class="main-section" data-section="professionalContext">
        <div class="section-title">Professional Context</div>
        <div class="metrics-grid">
          ${nonEmptyProfessionalContext.totalExperience ? `
          <div class="metric-item">
            <span class="metric-value">${nonEmptyProfessionalContext.totalExperience}</span>
            <span class="metric-label">Total Experience</span>
          </div>` : ''}
          ${nonEmptyProfessionalContext.teamSize ? `
          <div class="metric-item">
            <span class="metric-value">${nonEmptyProfessionalContext.teamSize}</span>
            <span class="metric-label">Team Size</span>
          </div>` : ''}
          ${nonEmptyProfessionalContext.industry ? `
          <div class="metric-item">
            <span class="metric-value">${nonEmptyProfessionalContext.industry}</span>
            <span class="metric-label">Industry</span>
          </div>` : ''}
          ${nonEmptyProfessionalContext.functionalDomain ? `
          <div class="metric-item">
            <span class="metric-value">${nonEmptyProfessionalContext.functionalDomain}</span>
            <span class="metric-label">Domain</span>
          </div>` : ''}
          ${nonEmptyProfessionalContext.geographicScope ? `
          <div class="metric-item">
            <span class="metric-value">${nonEmptyProfessionalContext.geographicScope}</span>
            <span class="metric-label">Geographic Scope</span>
          </div>` : ''}
          ${nonEmptyProfessionalContext.revenueResponsibility ? `
          <div class="metric-item">
            <span class="metric-value">${nonEmptyProfessionalContext.revenueResponsibility}</span>
            <span class="metric-label">Revenue Responsibility</span>
          </div>` : ''}
        </div>
      </div>` : ''}

      <!-- Availability & Work Auth -->
      ${nonEmptyAvailabilityWorkAuth ? `
      <div class="main-section" data-section="availabilityWorkAuth">
        <div class="section-title">Availability</div>
        <div class="tags-container">
          ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<span class="tag">Notice: ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</span>` : ''}
          ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<span class="tag">Work Auth: ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</span>` : ''}
          ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<span class="tag">Preferred: ${nonEmptyAvailabilityWorkAuth.preferredLocation}</span>` : ''}
        </div>
      </div>` : ''}

      ${
        data.sectionVisibility?.summary !== false &&
        data.summary &&
        data.summary.trim()
          ? `
      <div class="main-section">
        <div class="section-title">Professional Summary</div>
        <p class="summary-text">${data.summary}</p>
      </div>` : ""
      }

      ${
        data.careerObjective && data.careerObjective.trim()
          ? `
      <div class="main-section">
        <div class="section-title">Career Objective</div>
        <p class="summary-text">${data.careerObjective}</p>
      </div>` : ""
      }

      <!-- Work Experience -->
      ${hasNonEmptyItems(data.experience) ? `
      <div class="main-section" data-section="experience">
        <div class="section-title">Employment History</div>
        ${getNonEmptyArray(data.experience).map((e: any, index: number) => {
          const dateRange = formatDateRange(e.startDate, e.endDate, e.isCurrent);
          
          return `
          <div class="exp-item" data-section="experience" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${e.title || ""}</div>
              <div class="exp-company">${e.company || ""}${e.location ? ` - ${e.location}` : ""}</div>
              <div class="exp-date">${dateRange}</div>
            </div>
            ${e.description ? `<p class="exp-description">${e.description}</p>` : ""}
            ${e.achievements ? `
              <ul class="exp-achievements">
                ${(Array.isArray(e.achievements) ? e.achievements : [e.achievements]).map((achievement: any, achIndex: number) => `
                  <li data-section="experience" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>
                `).join("")}
              </ul>
            ` : ""}
          </div>
        `}).join("")}
      </div>` : ""
      }

      <!-- Internships -->
      ${nonEmptyInternships.length > 0 ? `
      <div class="main-section" data-section="internships">
        <div class="section-title">Internships</div>
        ${nonEmptyInternships.map((item: any, index: number) => {
          const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
          
          return `
          <div class="exp-item" data-section="internships" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.title || ""}</div>
              <div class="exp-company">${item.company || ""}${item.location ? ` - ${item.location}` : ""}</div>
              <div class="exp-date">${dateRange}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Training Programs -->
      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="main-section" data-section="trainingPrograms">
        <div class="section-title">Training Programs</div>
        ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
          <div class="exp-item" data-section="trainingPrograms" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-company">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
              <div class="exp-date">${item.completionDate || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Education -->
      ${hasNonEmptyItems(data.education) ? `
      <div class="main-section" data-section="education">
        <div class="section-title">Education</div>
        ${getNonEmptyArray(data.education).map((e: any, index: number) => `
          <div class="exp-item" data-section="education" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${e.degree || ""}${e.field ? ` in ${e.field}` : ""}${e.qualification ? ` (${e.qualification})` : ""}</div>
              <div class="exp-company">${e.school || ""}${e.location ? `, ${e.location}` : ""}</div>
              <div class="exp-date">${e.graduationDate || ""}</div>
            </div>
            ${e.grade ? `<div class="exp-description"><strong></strong> ${e.grade}</div>` : ""}
            ${e.description ? `<p class="exp-description">${e.description}</p>` : ""}
            ${e.achievements && e.achievements.length > 0 ? `
              <ul class="exp-achievements">
                ${e.achievements.filter((a: string) => a.trim()).map((achievement: string, achIndex: number) => `
                  <li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>
                `).join("")}
              </ul>
            ` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Academic Projects -->
      ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="main-section" data-section="academicProjects">
        <div class="section-title">Academic Projects</div>
        ${nonEmptyAcademicProjects.map((item: any, index: number) => `
          <div class="exp-item" data-section="academicProjects" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.name || item.title || ""}</div>
              <div class="exp-company">${item.institution || ""}</div>
              <div class="exp-date">${item.duration || ""}</div>
            </div>
            <p class="exp-description">${item.description || ""}</p>
            ${item.technologies ? `<p class="exp-description"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ""}
            ${item.url ? `<p class="exp-description"><a href="${item.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Project</a></p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Client Projects -->
      ${nonEmptyClientProjects.length > 0 ? `
      <div class="main-section" data-section="clientProjects">
        <div class="section-title">Client Projects</div>
        ${nonEmptyClientProjects.map((item: any, index: number) => `
          <div class="exp-item" data-section="clientProjects" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-company">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ""])}</div>
              <div class="exp-date">${item.duration || ""}</div>
            </div>
            <p class="exp-description">${item.description || ""}</p>
            ${item.toolsTechnologies ? `<p class="exp-description"><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ""}
            ${item.projectUrl ? `<p class="exp-description"><a href="${item.projectUrl}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Project</a></p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Portfolio -->
      ${nonEmptyPortfolio.length > 0 ? `
      <div class="main-section" data-section="portfolio">
        <div class="section-title">Portfolio</div>
        ${nonEmptyPortfolio.map((item: any, index: number) => `
          <div class="exp-item" data-section="portfolio" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-company">${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ""])}</div>
            </div>
            <p class="exp-description">${item.description || ""}</p>
            ${item.url ? `<p class="exp-description"><a href="${item.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Portfolio</a></p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Leadership Positions -->
      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="main-section" data-section="leadershipPositions">
        <div class="section-title">Leadership & Positions</div>
        ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
          const dateRange = formatDateRange(item.startDate, item.endDate);
          
          return `
          <div class="exp-item" data-section="leadershipPositions" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.position || item.title || ""}</div>
              <div class="exp-company">${item.organization || ""}</div>
              <div class="exp-date">${dateRange}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Volunteering -->
      ${nonEmptyVolunteering.length > 0 ? `
      <div class="main-section" data-section="volunteering">
        <div class="section-title">Volunteering</div>
        ${nonEmptyVolunteering.map((item: any, index: number) => `
          <div class="exp-item" data-section="volunteering" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.role || ""}</div>
              <div class="exp-company">${formatSubtitle([item.organization, item.causeArea])}</div>
              <div class="exp-date">${item.duration || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Military Service -->
      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="main-section" data-section="militaryService">
        <div class="section-title">Military Service</div>
        ${nonEmptyMilitaryService.map((item: any, index: number) => `
          <div class="exp-item" data-section="militaryService" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.rank ? item.rank : ""}${item.rank && item.branch ? " - " : ""}${item.branch || ""}</div>
              <div class="exp-company">${item.specialization || ""}</div>
              <div class="exp-date">${item.duration || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Teaching Experience -->
      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="main-section" data-section="teachingExperience">
        <div class="section-title">Teaching Experience</div>
        ${nonEmptyTeachingExperience.map((item: any, index: number) => `
          <div class="exp-item" data-section="teachingExperience" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.subjectCourseTaught || item.title || ""}</div>
              <div class="exp-company">${item.institution || ""}</div>
              <div class="exp-date">${item.duration || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Mentorship Experience -->
      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="main-section" data-section="mentorshipExperience">
        <div class="section-title">Mentorship Experience</div>
        ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
          <div class="exp-item" data-section="mentorshipExperience" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.mentorshipArea || ""}</div>
              <div class="exp-company">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ""])}</div>
              <div class="exp-date">${item.duration || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Research Grants -->
      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="main-section" data-section="researchGrants">
        <div class="section-title">Research Grants</div>
        ${nonEmptyResearchGrants.map((item: any, index: number) => `
          <div class="exp-item" data-section="researchGrants" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.title || ""}</div>
              <div class="exp-company">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : ""])}</div>
              <div class="exp-date">${item.year || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Publications -->
      ${nonEmptyPublications.length > 0 ? `
      <div class="main-section" data-section="publications">
        <div class="section-title">Publications</div>
        ${nonEmptyPublications.map((item: any, index: number) => `
          <div class="exp-item" data-section="publications" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.title || ""}</div>
              <div class="exp-company">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
              <div class="exp-date">${item.year || ""}</div>
            </div>
            ${item.authors ? `<p class="exp-description"><strong>Authors:</strong> ${item.authors}</p>` : ""}
            ${item.urlDoi ? `<p class="exp-description"><a href="${item.urlDoi}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Publication</a></p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Patents -->
      ${nonEmptyPatents.length > 0 ? `
      <div class="main-section" data-section="patents">
        <div class="section-title">Patents</div>
        ${nonEmptyPatents.map((item: any, index: number) => `
          <div class="exp-item" data-section="patents" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.title || ""}</div>
              <div class="exp-company">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : "", item.issuingAuthority])}</div>
              <div class="exp-date">${item.year || ""}</div>
            </div>
            ${item.status ? `<p class="exp-description"><strong>Status:</strong> ${item.status}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Test Scores -->
      ${nonEmptyTestScores.length > 0 ? `
      <div class="main-section" data-section="testScores">
        <div class="section-title">Test Scores</div>
        ${nonEmptyTestScores.map((item: any, index: number) => `
          <div class="exp-item" data-section="testScores" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.testName || ""}</div>
              <div class="exp-company">Score: ${item.score || ""}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ""}</div>
              <div class="exp-date">${item.year || ""}</div>
            </div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Certifications -->
      ${nonEmptyCertifications.length > 0 ? `
      <div class="main-section" data-section="certifications">
        <div class="section-title">Certifications</div>
        ${nonEmptyCertifications.map((cert: any, index: number) => `
          <div class="exp-item" data-section="certifications" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${cert.name || ""}</div>
              <div class="exp-company">${cert.issuer || ""}</div>
              <div class="exp-date">${cert.date || ""}</div>
            </div>
            ${cert.description ? `<p class="exp-description">${cert.description}</p>` : ""}
            ${cert.url ? `<p class="exp-description"><a href="${cert.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Certificate</a></p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Scholarships -->
      ${nonEmptyScholarships.length > 0 ? `
      <div class="main-section" data-section="scholarships">
        <div class="section-title">Scholarships</div>
        ${nonEmptyScholarships.map((item: any, index: number) => `
          <div class="exp-item" data-section="scholarships" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.name || ""}</div>
              <div class="exp-company">${formatSubtitle([item.provider || item.organization, item.amount ? `Amount: ${item.amount}` : ""])}</div>
              <div class="exp-date">${item.year || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Co-curricular Activities -->
      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="main-section" data-section="coCurricular">
        <div class="section-title">Co-curricular Activities</div>
        ${nonEmptyCoCurricular.map((item: any, index: number) => `
          <div class="exp-item" data-section="coCurricular" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.activity || ""}</div>
              <div class="exp-company">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ""])}</div>
              <div class="exp-date">${item.year || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Extracurricular Activities -->
      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="main-section" data-section="extracurricular">
        <div class="section-title">Extracurricular Activities</div>
        ${nonEmptyExtracurricular.map((item: any, index: number) => `
          <div class="exp-item" data-section="extracurricular" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.activity || ""}</div>
              <div class="exp-company">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ""])}</div>
              <div class="exp-date">${item.year || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Projects -->
      ${nonEmptyProjects.length > 0 ? `
      <div class="main-section" data-section="projects">
        <div class="section-title">Projects</div>
        ${nonEmptyProjects.map((project: any, index: number) => {
          const dateRange = formatDateRange(project.startDate, project.endDate);
          
          return `
          <div class="exp-item" data-section="projects" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${project.name || ""}</div>
              <div class="exp-company">${project.technologies || ""}</div>
              <div class="exp-date">${dateRange}</div>
            </div>
            <p class="exp-description">${project.description || ""}</p>
            ${project.url ? `<p class="exp-description"><a href="${project.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">${project.urlText || "View Project"}</a></p>` : ""}
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Languages -->
      ${nonEmptyLanguages.length > 0 ? `
      <div class="main-section" data-section="languages">
        <div class="section-title">Languages</div>
        <ul class="exp-achievements">
          ${nonEmptyLanguages.map((lang: any, index: number) => `
            <li data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ""}${lang.capability ? ` - ${lang.capability}` : ""}</li>
          `).join("")}
        </ul>
      </div>` : ""}

      <!-- Tools & Technologies -->
      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="main-section" data-section="toolsTechnologies">
        <div class="section-title">Tools & Technologies</div>
        <ul class="exp-achievements">
          ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
            <li data-section="toolsTechnologies" data-index="${index}">${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}</li>
          `).join("")}
        </ul>
      </div>` : ""}

      <!-- Methodologies -->
      ${nonEmptyMethodologies.length > 0 ? `
      <div class="main-section" data-section="methodologies">
        <div class="section-title">Methodologies</div>
        <ul class="exp-achievements">
          ${nonEmptyMethodologies.map((item: any, index: number) => `
            <li data-section="methodologies" data-index="${index}">${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}</li>
          `).join("")}
        </ul>
      </div>` : ""}

      <!-- Industry Expertise -->
      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="main-section" data-section="industryExpertise">
        <div class="section-title">Industry Expertise</div>
        <ul class="exp-achievements">
          ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
            <li data-section="industryExpertise" data-index="${index}">${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}</li>
          `).join("")}
        </ul>
      </div>` : ""}

      <!-- Key Achievements -->
      ${nonEmptyKeyAchievements.length > 0 ? `
      <div class="main-section" data-section="keyAchievements">
        <div class="section-title">Key Achievements</div>
        <ul class="exp-achievements">
          ${nonEmptyKeyAchievements.map((achievement: string, index: number) => `
            <li data-section="keyAchievements" data-index="${index}">${achievement}</li>
          `).join("")}
        </ul>
      </div>` : ""}

      <!-- Key Responsibilities -->
      ${nonEmptyResponsibilities.length > 0 ? `
      <div class="main-section" data-section="responsibilities">
        <div class="section-title">Key Responsibilities</div>
        <ul class="exp-achievements">
          ${nonEmptyResponsibilities.map((line: string, index: number) => `
            <li data-section="responsibilities" data-index="${index}">${line.trim()}</li>
          `).join("")}
        </ul>
      </div>` : ""}

      <!-- Tools -->
      ${nonEmptyTools.length > 0 ? `
      <div class="main-section" data-section="tools">
        <div class="section-title">Tools & Technologies</div>
        <ul class="exp-achievements">
          ${nonEmptyTools.map((line: string, index: number) => `
            <li data-section="tools" data-index="${index}">${line.trim()}</li>
          `).join("")}
        </ul>
      </div>` : ""}

      <!-- Awards -->
      ${nonEmptyAwards.length > 0 ? `
      <div class="main-section" data-section="awards">
        <div class="section-title">Awards</div>
        ${nonEmptyAwards.map((award: any, index: number) => `
          <div class="exp-item" data-section="awards" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${award.title || ""}</div>
              <div class="exp-company">${award.organization || ""}</div>
              <div class="exp-date">${award.issueYear || award.year || ""}</div>
            </div>
            ${award.description ? `<p class="exp-description">${award.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Speaking Engagements -->
      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="main-section" data-section="speakingEngagements">
        <div class="section-title">Speaking Engagements</div>
        ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
          <div class="exp-item" data-section="speakingEngagements" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.topic || ""}</div>
              <div class="exp-company">${item.eventName || ""}</div>
              <div class="exp-date">${item.date || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Memberships -->
      ${nonEmptyMemberships.length > 0 ? `
      <div class="main-section" data-section="memberships">
        <div class="section-title">Memberships</div>
        ${nonEmptyMemberships.map((item: any, index: number) => `
          <div class="exp-item" data-section="memberships" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.membershipName || ""}</div>
              <div class="exp-company">${item.organizationName || ""}</div>
              <div class="exp-date">${item.year || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Workshops -->
      ${nonEmptyWorkshops.length > 0 ? `
      <div class="main-section" data-section="workshops">
        <div class="section-title">Workshops</div>
        ${nonEmptyWorkshops.map((item: any, index: number) => `
          <div class="exp-item" data-section="workshops" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${item.programTitle || ""}</div>
              <div class="exp-company">${item.conductedBy || ""}</div>
              <div class="exp-date">${item.year || ""}</div>
            </div>
            ${item.description ? `<p class="exp-description">${item.description}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Contact Information -->
      ${contactInfo ? `
      <div class="main-section">
        <div class="section-title">Contact Information</div>
        <p class="summary-text" style="font-size: ${Math.round(baseFontSize * 0.95)}px;">${contactInfo}</p>
      </div>` : ""}

      <!-- Social Links -->
      ${nonEmptySocialLinks.length > 0 ? `
      <div class="main-section" data-section="socialLinks">
        <div class="section-title">Social Links</div>
        <div class="tags-container">
          ${nonEmptySocialLinks.map((link: any, index: number) => `
            <a href="${link.url}" target="_blank" class="tag" style="background: #f0f0f0; color: ${textColor}; text-decoration: none; display: inline-block;">${link.urlText || link.url.replace("https://", "").replace("http://", "")}</a>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Social Profiles -->
      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="main-section" data-section="socialProfiles">
        <div class="section-title">Social Profiles</div>
        <div class="tags-container">
          ${nonEmptySocialProfiles.map((profile: any, index: number) => `
            <a href="${profile.url}" target="_blank" class="tag" style="background: #f0f0f0; color: ${textColor}; text-decoration: none; display: inline-block;">${profile.platform || "Profile"}</a>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- References -->
      ${nonEmptyReferences.length > 0 ? `
      <div class="main-section" data-section="references">
        <div class="section-title">References</div>
        ${nonEmptyReferences.map((ref: any, index: number) => `
          <div class="exp-item" data-section="references" data-index="${index}">
            <div class="exp-header">
              <div class="exp-title">${ref.name || ""}</div>
              <div class="exp-company">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
            </div>
            ${ref.contactInformation ? `<p class="exp-description"><strong>Contact:</strong> ${ref.contactInformation}</p>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Custom Sections -->
      ${nonEmptyCustomSections.length > 0 ? data.customSections
        .filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries))
        .map((section: any) => {
          const heading = section.heading || "Custom Section";
          const lowerHeading = heading.toLowerCase();

          if (lowerHeading.includes("language")) {
            return `
      <div class="main-section" data-section="customSections">
        <div class="section-title">${heading}</div>
        <ul class="exp-achievements">
          ${section.entries && section.entries.length > 0
            ? section.entries.filter((entry: any) => entry.isVisible && (entry.title || entry.organization || entry.description))
              .map((entry: any, index: number) => `
                <li data-section="customSections" data-index="${index}">${entry.title || entry.organization || entry.description || "Language"}${entry.level ? ` (${entry.level})` : ""}</li>
              `).join("")
            : '<li style="color: #7f8c8d; font-style: italic;">No entries</li>'}
        </ul>
      </div>`;
          } else if (lowerHeading.includes("hobby") || lowerHeading.includes("interest")) {
            return `
      <div class="main-section" data-section="customSections">
        <div class="section-title">${heading}</div>
        <ul class="hobbies-list">
          ${section.entries && section.entries.length > 0
            ? section.entries.filter((entry: any) => entry.isVisible && (entry.title || entry.organization || entry.description))
              .map((entry: any, index: number) => `
                <li class="hobby-item" data-section="customSections" data-index="${index}">${entry.title || entry.organization || entry.description || "Item"}</li>
              `).join("")
            : '<li style="color: #7f8c8d; font-style: italic;">No entries</li>'}
        </ul>
      </div>`;
          } else if (lowerHeading.includes("achievement") || lowerHeading.includes("award")) {
            return `
      <div class="main-section" data-section="customSections">
        <div class="section-title">${heading}</div>
        <ul class="exp-achievements">
          ${section.entries && section.entries.length > 0
            ? section.entries.filter((entry: any) => entry.isVisible && (entry.title || entry.organization || entry.description))
              .map((entry: any, index: number) => `
                <li data-section="customSections" data-index="${index}">${entry.title || entry.organization || entry.description || "Item"}</li>
              `).join("")
            : '<li style="color: #7f8c8d; font-style: italic;">No entries</li>'}
        </ul>
      </div>`;
          } else if (lowerHeading.includes("responsibility") || lowerHeading.includes("duty")) {
            return `
      <div class="main-section" data-section="customSections">
        <div class="section-title">${heading}</div>
        <ul class="exp-achievements">
          ${section.entries && section.entries.length > 0
            ? section.entries.filter((entry: any) => entry.isVisible && (entry.title || entry.organization || entry.description))
              .map((entry: any, index: number) => `
                <li data-section="customSections" data-index="${index}">${entry.title || entry.organization || entry.description || "Item"}</li>
              `).join("")
            : '<li style="color: #7f8c8d; font-style: italic;">No entries</li>'}
        </ul>
      </div>`;
          } else if (lowerHeading.includes("tool") || lowerHeading.includes("technology")) {
            return `
      <div class="main-section" data-section="customSections">
        <div class="section-title">${heading}</div>
        <ul class="exp-achievements">
          ${section.entries && section.entries.length > 0
            ? section.entries.filter((entry: any) => entry.isVisible && (entry.title || entry.organization || entry.description))
              .map((entry: any, index: number) => `
                <li data-section="customSections" data-index="${index}">${entry.title || entry.organization || entry.description || "Item"}</li>
              `).join("")
            : '<li style="color: #7f8c8d; font-style: italic;">No entries</li>'}
        </ul>
      </div>`;
          } else {
            return `
      <div class="main-section" data-section="customSections">
        <div class="section-title">${heading}</div>
        ${section.entries && section.entries.length > 0
          ? section.entries.filter((entry: any) => entry.isVisible && (entry.title || entry.description))
            .map((entry: any, entryIndex: number) => `
          <div class="exp-item" data-section="customSections" data-index="${entryIndex}">
            <div class="exp-header">
              <div class="exp-title">${entry.title || ""}${entry.title && entry.organization ? " at " : ""}${entry.organization || ""}</div>
              <div class="exp-date">${entry.date || ""}</div>
            </div>
            ${entry.description ? `<p class="exp-description">${entry.description}</p>` : ""}
          </div>
        `).join("")
          : '<div style="color: #7f8c8d; font-style: italic;">No entries in this section</div>'}
      </div>`;
          }
        }).join("") : ""
      }
    </div>

    <div class="right-column">
      <div class="profile-section">
        <div class="profile-photo" data-section="personal">
          ${data.personal?.image ? `<img src="${data.personal.image}" alt="Profile" />` : ""}
        </div>
        <div class="name" data-section="personal">
          ${data.personal?.name && data.personal?.name !== "undefined" && data.personal?.name.trim()
            ? data.personal.name
            : "Your Name"}
        </div>
        ${data.personal?.role && data.personal.role.trim() ? `
        <div class="role">${data.personal.role}</div>` : ""}
      </div>

      ${data.personal?.email || data.personal?.phone || data.personal?.alternatePhone ||
        data.personal?.location || data.personal?.country || data.personal?.pinCode ||
        data.personal?.fullAddress || data.personal?.linkedinUrl || data.personal?.githubUrl ||
        data.personal?.portfolioUrl || data.personal?.website || data.personal?.twitterUrl ||
        data.personal?.facebookUrl || data.personal?.instagramUrl || data.personal?.behanceUrl ||
        data.personal?.dribbbleUrl || data.personal?.stackoverflowUrl || data.personal?.mediumUrl ||
        data.personal?.fathersName || data.personal?.dob || data.personal?.gender ||
        data.personal?.maritalStatus || data.personal?.nationality || data.personal?.passportNo ? `
      <div class="contact-section">
        <div class="section-heading">Contact</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${data.personal?.email ? `<div class="contact-item">${data.personal.email}</div>` : ""}
          ${data.personal?.phone ? `<div class="contact-item">${data.personal.phone}</div>` : ""}
          ${data.personal?.alternatePhone ? `<div class="contact-item">${data.personal.alternatePhone}</div>` : ""}
          ${(() => {
            const addressParts = [
              data.personal?.fullAddress,
              data.personal?.location,
              data.personal?.country,
              data.personal?.pinCode
            ].filter(Boolean);
            return addressParts.length > 0 ? `<div class="contact-item">${addressParts.join(", ")}</div>` : "";
          })()}
          ${data.personal?.fathersName ? `<div class="contact-item">Father's Name: ${data.personal.fathersName}</div>` : ""}
          ${data.personal?.dob ? `<div class="contact-item">DOB: ${data.personal.dob}</div>` : ""}
          ${data.personal?.gender ? `<div class="contact-item">Gender: ${data.personal.gender}</div>` : ""}
          ${data.personal?.maritalStatus ? `<div class="contact-item">Marital Status: ${data.personal.maritalStatus}</div>` : ""}
          ${data.personal?.nationality ? `<div class="contact-item">Nationality: ${data.personal.nationality}</div>` : ""}
          ${data.personal?.passportNo ? `<div class="contact-item">Passport No: ${data.personal.passportNo}</div>` : ""}
          ${data.personal?.linkedinUrl ? `<div class="contact-item"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>` : ""}
          ${data.personal?.githubUrl ? `<div class="contact-item"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>` : ""}
          ${data.personal?.portfolioUrl ? `<div class="contact-item"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>` : ""}
          ${data.personal?.website ? `<div class="contact-item"><a href="${data.personal.website}" target="_blank">Website</a></div>` : ""}
          ${data.personal?.twitterUrl ? `<div class="contact-item"><a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></div>` : ""}
          ${data.personal?.facebookUrl ? `<div class="contact-item"><a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></div>` : ""}
          ${data.personal?.instagramUrl ? `<div class="contact-item"><a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></div>` : ""}
          ${data.personal?.behanceUrl ? `<div class="contact-item"><a href="${data.personal.behanceUrl}" target="_blank">Behance</a></div>` : ""}
          ${data.personal?.dribbbleUrl ? `<div class="contact-item"><a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></div>` : ""}
          ${data.personal?.stackoverflowUrl ? `<div class="contact-item"><a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></div>` : ""}
          ${data.personal?.mediumUrl ? `<div class="contact-item"><a href="${data.personal.mediumUrl}" target="_blank">Medium</a></div>` : ""}
        </div>
      </div>` : ""}

      ${nonEmptySkills.length > 0 ? `
      <div class="contact-section">
        <div class="section-heading">Skills</div>
        <div class="skills-list">
          ${nonEmptySkills.map((skill: any, index: number) => `
            <div class="skill-item" data-section="skills" data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</div>
          `).join("")}
        </div>
      </div>` : ""}

      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="contact-section">
        <div class="section-heading">Tools & Tech</div>
        <div class="skills-list">
          ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
            <div class="skill-item" data-section="toolsTechnologies" data-index="${index}">${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}</div>
          `).join("")}
        </div>
      </div>` : ""}

      ${nonEmptyMethodologies.length > 0 ? `
      <div class="contact-section">
        <div class="section-heading">Methodologies</div>
        <div class="skills-list">
          ${nonEmptyMethodologies.map((item: any, index: number) => `
            <div class="skill-item" data-section="methodologies" data-index="${index}">${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}</div>
          `).join("")}
        </div>
      </div>` : ""}

      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="contact-section">
        <div class="section-heading">Industry Expertise</div>
        <div class="skills-list">
          ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
            <div class="skill-item" data-section="industryExpertise" data-index="${index}">${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}</div>
          `).join("")}
        </div>
      </div>` : ""}

      ${nonEmptyLanguages.length > 0 ? `
      <div class="contact-section">
        <div class="section-heading">Languages</div>
        <div class="skills-list">
          ${nonEmptyLanguages.map((lang: any, index: number) => `
            <div class="skill-item" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ""}${lang.capability ? ` - ${lang.capability}` : ""}</div>
          `).join("")}
        </div>
      </div>` : ""}

      ${nonEmptyHobbies.length > 0 ? `
      <div class="contact-section">
        <div class="section-heading">Hobbies</div>
        <ul class="hobbies-list" data-section="hobbies">
          ${nonEmptyHobbies.map((hobby: string, index: number) => `
            <li class="hobby-item" data-index="${index}">${hobby}</li>
          `).join("")}
        </ul>
      </div>` : ""}
    </div>
  </div>
</body>
</html>`;
}