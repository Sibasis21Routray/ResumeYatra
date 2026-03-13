export function buildTechItTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#1a1a1a',
    secondary: '#444444',
    background: '#ffffff',
    accent: '#000000',
    headingFont: 'serif', // Matches the screenshot's classic style
    bodyFont: 'Arial, sans-serif'
  };
  const currentTheme = theme || defaultTheme;

  // Font sizes for the classic look
  const bodyFontSize = '10pt';
  const headingFontSize = '11pt';
  const nameFontSize = '24pt';

  // Sort experience reverse chronological
  const sortedExperience = data.experience ? [...data.experience].sort((a: any, b: any) => new Date(b.startDate || '1900-01-01').getTime() - new Date(a.startDate || '1900-01-01').getTime()) : [];

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

  // Helper to format date range
  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" - ");
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

  // For backward compatibility
  const hasContent = (arr: any): boolean => {
    if (!arr || !Array.isArray(arr)) return arr && (typeof arr === 'string' ? arr.trim().length > 0 : false);
    if (arr.length === 0) return false;
    return arr.some((item: any) => {
      if (typeof item === 'string') return item.trim().length > 0;
      if (typeof item === 'object' && item !== null) {
        return Object.values(item).some((val: any) =>
          typeof val === 'string' && val.trim().length > 0
        );
      }
      return false;
    });
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --background-color: ${currentTheme.background};
      --accent-color: ${currentTheme.accent};
      --heading-font: ${currentTheme.headingFont};
      --body-font: ${currentTheme.bodyFont};
    }

    body {
      font-family: var(--body-font);
      color: var(--primary-color);
      line-height: 1.5;
      margin: 0;
      padding: 40px;
      background: var(--background-color);
    }
    
    .resume-container {
      max-width: 800px;
      margin: 0 auto;
    }

    /* Header Styling */
    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .initial-circle {
      width: 50px;
      height: 50px;
      border: 1px solid var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 15px;
      font-family: var(--heading-font);
      font-size: 18pt;
      text-transform: uppercase;
    }

    .name {
      font-family: var(--heading-font);
      font-size: ${nameFontSize};
      font-weight: normal;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .contact-line {
      font-size: 8pt;
      color: var(--secondary-color);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .contact-line span:not(:last-child):after {
      content: " • ";
      margin: 0 8px;
    }

    /* Section Styling */
    .main-section {
      margin-bottom: 30px;
    }

    .section-title {
      font-family: var(--heading-font);
      font-size: ${headingFontSize};
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #ddd;
      margin-bottom: 12px;
      padding-bottom: 3px;
    }

    .summary-text {
      font-size: ${bodyFontSize};
      text-align: justify;
      color: var(--secondary-color);
    }

    /* Experience & Projects */
    .item-row {
      display: flex;
      margin-bottom: 20px;
    }

    .item-left {
      width: 30%;
      font-size: 9pt;
      color: var(--secondary-color);
      padding-right: 20px;
    }

    .item-right {
      width: 70%;
    }

    .item-title {
      font-weight: bold;
      font-size: 10pt;
      text-transform: uppercase;
    }

    .item-subtitle {
      font-style: italic;
      margin-bottom: 8px;
      font-size: 10pt;
    }

    ul {
      margin: 5px 0 0 18px;
      padding: 0;
    }

    li {
      font-size: 9pt;
      margin-bottom: 4px;
      color: var(--secondary-color);
    }

    /* Two-column Skills Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 40px;
    }

    .skill-item {
      font-size: 9pt;
      display: flex;
      align-items: center;
    }

    .skill-item:before {
      content: "•";
      margin-right: 8px;
    }

    /* Certifications */
    .cert-item {
      margin-bottom: 10px;
      font-size: 9pt;
    }

    .cert-name {
      font-weight: bold;
      margin-bottom: 2px;
    }

    .cert-issuer {
      color: var(--secondary-color);
      margin-bottom: 2px;
    }

    .cert-date {
      font-size: 8pt;
      color: var(--secondary-color);
    }

    /* Languages */
    .language-item {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 9pt;
    }

    .language-name {
      font-weight: bold;
    }

    .language-level {
      color: var(--secondary-color);
      font-style: italic;
    }

    /* Tags for Hobbies */
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      font-size: 9pt;
    }

    .tag {
      padding: 2px 8px;
      border: 1px solid #ddd;
      border-radius: 3px;
      background: #f5f5f5;
    }

    /* Social Links */
    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 9pt;
    }

    .contact-item {
      display: flex;
      gap: 5px;
    }

    .contact-label {
      font-weight: 600;
      min-width: 80px;
    }

    .contact-value a {
      color: var(--secondary-color);
      text-decoration: none;
    }

    .contact-value a:hover {
      text-decoration: underline;
    }

    @media print {
      body { padding: 0; }
      .resume-container { max-width: 100%; }
    }
  </style>
</head>
<body>
<div class="resume-container">
  <div class="header" data-section="personal">
    <div class="initial-circle" data-section="personal">
      ${data.personal?.name ? data.personal.name.charAt(0).toUpperCase() : 'R'}
    </div>
    <div class="name" data-section="personal">${data.personal?.name || 'Your Name'}${data.personal?.middleName ? ` ${data.personal.middleName}` : ''}</div>
    <div class="contact-line" data-section="personal">
      ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<span>${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</span>` : ''}
      ${data.personal?.phone ? `<span>📞 ${data.personal.phone}</span>` : ''}
      ${data.personal?.alternatePhone ? `<span>📞 ${data.personal.alternatePhone}</span>` : ''}
      ${data.personal?.email ? `<span>✉️ ${data.personal.email}</span>` : ''}
      ${data.personal?.fathersName ? `<span>Father: ${data.personal.fathersName}</span>` : ''}
      ${data.personal?.dob ? `<span>DOB: ${data.personal.dob}</span>` : ''}
      ${data.personal?.gender ? `<span>Gender: ${data.personal.gender}</span>` : ''}
      ${data.personal?.maritalStatus ? `<span>Marital: ${data.personal.maritalStatus}</span>` : ''}
      ${data.personal?.nationality ? `<span>Nationality: ${data.personal.nationality}</span>` : ''}
      ${data.personal?.linkedinUrl ? `<span><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></span>` : ''}
      ${data.personal?.githubUrl ? `<span><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></span>` : ''}
      ${data.personal?.portfolioUrl ? `<span><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></span>` : ''}
      ${data.personal?.website ? `<span><a href="${data.personal.website}" target="_blank">Website</a></span>` : ''}
    </div>
  </div>

  <!-- Personal Details (if not in header) -->
  ${(data.personal?.fathersName || data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus || data.personal?.nationality || data.personal?.passportNo) && !data.personal?.email ? `
  <div class="main-section" data-section="personal">
    <div class="section-title">Personal Details</div>
    <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${bodyFontSize}; color: var(--secondary-color);">
      ${data.personal?.fathersName ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ''}
      ${data.personal?.dob ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>` : ''}
      ${data.personal?.gender ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>` : ''}
      ${data.personal?.maritalStatus ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ''}
      ${data.personal?.nationality ? `<div><strong>Nationality:</strong> ${data.personal.nationality}</div>` : ''}
      ${data.personal?.passportNo ? `<div><strong>Passport No:</strong> ${data.personal.passportNo}</div>` : ''}
    </div>
  </div>` : ''}

  <!-- Professional Context -->
  ${nonEmptyProfessionalContext ? `
  <div class="main-section" data-section="professionalContext">
    <div class="section-title">Professional Context</div>
    <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${bodyFontSize}; color: var(--secondary-color);">
      ${nonEmptyProfessionalContext.totalExperience ? `<div><strong>Total Experience:</strong> ${nonEmptyProfessionalContext.totalExperience}</div>` : ''}
      ${nonEmptyProfessionalContext.teamSize ? `<div><strong>Team Size:</strong> ${nonEmptyProfessionalContext.teamSize}</div>` : ''}
      ${nonEmptyProfessionalContext.industry ? `<div><strong>Industry:</strong> ${nonEmptyProfessionalContext.industry}</div>` : ''}
      ${nonEmptyProfessionalContext.functionalDomain ? `<div><strong>Domain:</strong> ${nonEmptyProfessionalContext.functionalDomain}</div>` : ''}
      ${nonEmptyProfessionalContext.geographicScope ? `<div><strong>Geographic Scope:</strong> ${nonEmptyProfessionalContext.geographicScope}</div>` : ''}
      ${nonEmptyProfessionalContext.revenueResponsibility ? `<div><strong>Revenue Responsibility:</strong> ${nonEmptyProfessionalContext.revenueResponsibility}</div>` : ''}
    </div>
  </div>` : ''}

  <!-- Availability & Work Auth -->
  ${nonEmptyAvailabilityWorkAuth ? `
  <div class="main-section" data-section="availabilityWorkAuth">
    <div class="section-title">Availability</div>
    <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${bodyFontSize}; color: var(--secondary-color);">
      ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<div><strong>Notice Period:</strong> ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
      ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<div><strong>Work Auth:</strong> ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
      ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<div><strong>Preferred Location:</strong> ${nonEmptyAvailabilityWorkAuth.preferredLocation}</div>` : ''}
    </div>
  </div>` : ''}

  <!-- Summary -->
  ${data.summary && data.summary.trim() ? `
  <div class="main-section" data-section="summary">
    <div class="section-title">Summary</div>
    <p class="summary-text">${data.summary}</p>
  </div>` : ''}
  
  <!-- Career Objective -->
  ${data.careerObjective && data.careerObjective.trim() ? `
  <div class="main-section" data-section="careerObjective">
    <div class="section-title">Career Objective</div>
    <p class="summary-text">${data.careerObjective}</p>
  </div>` : ''}
  
  <!-- Work Experience -->
  ${sortedExperience.length > 0 ? `
  <div class="main-section" data-section="experience">
    <div class="section-title">Experience</div>
    ${sortedExperience.map((exp: any, index: number) => {
      const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
      
      return `
      <div class="item-row" data-section="experience" data-index="${index}">
        <div class="item-left">
          <div>${dateRange}</div>
          <div>${exp.location || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${exp.title || ''}</div>
          <div class="item-subtitle">${formatSubtitle([exp.company, exp.domain])}</div>
          ${exp.description ? `<ul>${exp.description.split('\n').filter((l: string) => l.trim()).map((line: string) => `<li>${line.trim()}</li>`).join('')}</ul>` : ''}
          ${exp.achievements ? `<p style="font-size: 9pt; color: var(--secondary-color); margin-top: 5px;"><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
        </div>
      </div>
    `}).join('')}
  </div>` : ''}
  
  <!-- Internships -->
  ${nonEmptyInternships.length > 0 ? `
  <div class="main-section" data-section="internships">
    <div class="section-title">Internships</div>
    ${nonEmptyInternships.map((item: any, index: number) => {
      const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
      
      return `
      <div class="item-row" data-section="internships" data-index="${index}">
        <div class="item-left">
          <div>${dateRange}</div>
          <div>${item.location || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.title || ''}</div>
          <div class="item-subtitle">${item.company || ''}</div>
          ${item.description ? `<ul>${item.description.split('\n').filter((l: string) => l.trim()).map((line: string, lineIndex: number) => `<li data-section="internships" data-index="${index}" data-item-index="${lineIndex}">${line.trim()}</li>`).join('')}</ul>` : ''}
        </div>
      </div>
    `}).join('')}
  </div>` : ''}
  
  <!-- Training Programs -->
  ${nonEmptyTrainingPrograms.length > 0 ? `
  <div class="main-section" data-section="trainingPrograms">
    <div class="section-title">Training Programs</div>
    ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
      <div class="item-row" data-section="trainingPrograms" data-index="${index}">
        <div class="item-left">
          <div>${item.completionDate || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.name || ''}</div>
          <div class="item-subtitle">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}
  
  <!-- Skills -->
  ${nonEmptySkills.length > 0 ? `
  <div class="main-section" data-section="skills">
    <div class="section-title">Skills</div>
    <div class="skills-grid">
      ${nonEmptySkills.map((skill: any, index: number) => `
        <div class="skill-item" data-section="skills" data-index="${index}">${typeof skill === 'string' ? skill.trim() : skill}</div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- Tools & Technologies -->
  ${nonEmptyToolsTechnologies.length > 0 ? `
  <div class="main-section" data-section="toolsTechnologies">
    <div class="section-title">Tools & Technologies</div>
    <div class="skills-grid">
      ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
        <div class="skill-item" data-section="toolsTechnologies" data-index="${index}">${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}</div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- Methodologies -->
  ${nonEmptyMethodologies.length > 0 ? `
  <div class="main-section" data-section="methodologies">
    <div class="section-title">Methodologies</div>
    <div class="skills-grid">
      ${nonEmptyMethodologies.map((item: any, index: number) => `
        <div class="skill-item" data-section="methodologies" data-index="${index}">${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}</div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- Industry Expertise -->
  ${nonEmptyIndustryExpertise.length > 0 ? `
  <div class="main-section" data-section="industryExpertise">
    <div class="section-title">Industry Expertise</div>
    <div class="skills-grid">
      ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
        <div class="skill-item" data-section="industryExpertise" data-index="${index}">${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}</div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- Education -->
  ${hasNonEmptyItems(data.education) ? `
  <div class="main-section" data-section="education">
    <div class="section-title">Education</div>
    ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
      <div class="item-row" data-section="education" data-index="${index}">
        <div class="item-left">${edu.graduationDate || ''}</div>
        <div class="item-right">
          <div class="item-title">${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}${edu.qualification ? ` (${edu.qualification})` : ''}</div>
          <div class="item-subtitle">${edu.school || ''}${edu.location ? `, ${edu.location}` : ''}${edu.grade ? ` |  ${edu.grade}` : ''}</div>
          ${edu.description ? `<p style="font-size: 9pt; color: var(--secondary-color); margin-top: 5px;">${edu.description}</p>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Academic Projects -->
  ${nonEmptyAcademicProjects.length > 0 ? `
  <div class="main-section" data-section="academicProjects">
    <div class="section-title">Academic Projects</div>
    ${nonEmptyAcademicProjects.map((item: any, index: number) => `
      <div class="item-row" data-section="academicProjects" data-index="${index}">
        <div class="item-left">
          <div>${item.duration || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.name || item.title || ''}</div>
          <div class="item-subtitle">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ''])}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
          ${item.technologies && item.technologies.length > 0 ? `<p style="font-size: 9pt; margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
          ${item.url ? `<div style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="font-size: 9pt; color: var(--secondary-color);">${item.url}</a></div>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Client Projects -->
  ${nonEmptyClientProjects.length > 0 ? `
  <div class="main-section" data-section="clientProjects">
    <div class="section-title">Client Projects</div>
    ${nonEmptyClientProjects.map((item: any, index: number) => `
      <div class="item-row" data-section="clientProjects" data-index="${index}">
        <div class="item-left">
          <div>${item.duration || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.name || ''}</div>
          <div class="item-subtitle">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ''])}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
          ${item.toolsTechnologies ? `<p style="font-size: 9pt; margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ''}
          ${item.projectUrl ? `<div style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank" style="font-size: 9pt; color: var(--secondary-color);">View Project</a></div>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Portfolio -->
  ${nonEmptyPortfolio.length > 0 ? `
  <div class="main-section" data-section="portfolio">
    <div class="section-title">Portfolio</div>
    ${nonEmptyPortfolio.map((item: any, index: number) => `
      <div class="item-row" data-section="portfolio" data-index="${index}">
        <div class="item-left">
          <div>${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ''])}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.name || ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
          ${item.url ? `<div style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="font-size: 9pt; color: var(--secondary-color);">View Portfolio</a></div>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Projects -->
  ${nonEmptyProjects.length > 0 ? `
  <div class="main-section" data-section="projects">
    <div class="section-title">Projects</div>
    ${nonEmptyProjects.map((project: any, index: number) => {
      const dateRange = formatDateRange(project.startDate, project.endDate);
      
      return `
      <div class="item-row" data-section="projects" data-index="${index}">
        <div class="item-left">
          <div>${dateRange || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${project.name || ''}</div>
          ${project.technologies ? `<div style="font-size: 9pt; color: var(--secondary-color); margin-bottom: 8px;">${project.technologies}</div>` : ''}
          <p style="font-size: 9pt; color: var(--secondary-color);">${project.description || ''}</p>
          ${project.url ? `<div style="margin-top: 5px;"><a href="${project.url}" target="_blank" style="font-size: 9pt; color: var(--secondary-color);">${project.urlText || project.url}</a></div>` : ''}
        </div>
      </div>
    `}).join('')}
  </div>` : ''}

  <!-- Leadership Positions -->
  ${nonEmptyLeadershipPositions.length > 0 ? `
  <div class="main-section" data-section="leadershipPositions">
    <div class="section-title">Leadership & Positions</div>
    ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
      const dateRange = formatDateRange(item.startDate, item.endDate);
      
      return `
      <div class="item-row" data-section="leadershipPositions" data-index="${index}">
        <div class="item-left">
          <div>${dateRange}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.position || item.title || ''}</div>
          <div class="item-subtitle">${item.organization || ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `}).join('')}
  </div>` : ''}

  <!-- Volunteering -->
  ${nonEmptyVolunteering.length > 0 ? `
  <div class="main-section" data-section="volunteering">
    <div class="section-title">Volunteering</div>
    ${nonEmptyVolunteering.map((item: any, index: number) => `
      <div class="item-row" data-section="volunteering" data-index="${index}">
        <div class="item-left">
          <div>${item.duration || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.role || ''}</div>
          <div class="item-subtitle">${formatSubtitle([item.organization, item.causeArea])}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Military Service -->
  ${nonEmptyMilitaryService.length > 0 ? `
  <div class="main-section" data-section="militaryService">
    <div class="section-title">Military Service</div>
    ${nonEmptyMilitaryService.map((item: any, index: number) => `
      <div class="item-row" data-section="militaryService" data-index="${index}">
        <div class="item-left">
          <div>${item.duration || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.rank ? item.rank : ''}${item.rank && item.branch ? ' - ' : ''}${item.branch || ''}</div>
          <div class="item-subtitle">${item.specialization || ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Teaching Experience -->
  ${nonEmptyTeachingExperience.length > 0 ? `
  <div class="main-section" data-section="teachingExperience">
    <div class="section-title">Teaching Experience</div>
    ${nonEmptyTeachingExperience.map((item: any, index: number) => `
      <div class="item-row" data-section="teachingExperience" data-index="${index}">
        <div class="item-left">
          <div>${item.duration || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.subjectCourseTaught || item.title || ''}</div>
          <div class="item-subtitle">${item.institution || ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Mentorship Experience -->
  ${nonEmptyMentorshipExperience.length > 0 ? `
  <div class="main-section" data-section="mentorshipExperience">
    <div class="section-title">Mentorship Experience</div>
    ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
      <div class="item-row" data-section="mentorshipExperience" data-index="${index}">
        <div class="item-left">
          <div>${item.duration || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.mentorshipArea || ''}</div>
          <div class="item-subtitle">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ''])}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Research Grants -->
  ${nonEmptyResearchGrants.length > 0 ? `
  <div class="main-section" data-section="researchGrants">
    <div class="section-title">Research Grants</div>
    ${nonEmptyResearchGrants.map((item: any, index: number) => `
      <div class="item-row" data-section="researchGrants" data-index="${index}">
        <div class="item-left">
          <div>${item.year || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.title || ''}</div>
          <div class="item-subtitle">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : ''])}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Publications -->
  ${nonEmptyPublications.length > 0 ? `
  <div class="main-section" data-section="publications">
    <div class="section-title">Publications</div>
    ${nonEmptyPublications.map((item: any, index: number) => `
      <div class="item-row" data-section="publications" data-index="${index}">
        <div class="item-left">
          <div>${item.year || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.title || ''}</div>
          <div class="item-subtitle">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
          ${item.authors ? `<p style="font-size: 9pt; color: var(--secondary-color);"><strong>Authors:</strong> ${item.authors}</p>` : ''}
          ${item.urlDoi ? `<div style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank" style="font-size: 9pt; color: var(--secondary-color);">View Publication</a></div>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Patents -->
  ${nonEmptyPatents.length > 0 ? `
  <div class="main-section" data-section="patents">
    <div class="section-title">Patents</div>
    ${nonEmptyPatents.map((item: any, index: number) => `
      <div class="item-row" data-section="patents" data-index="${index}">
        <div class="item-left">
          <div>${item.year || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.title || ''}</div>
          <div class="item-subtitle">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : '', item.issuingAuthority])}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);"><strong>Status:</strong> ${item.status || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Test Scores -->
  ${nonEmptyTestScores.length > 0 ? `
  <div class="main-section" data-section="testScores">
    <div class="section-title">Test Scores</div>
    ${nonEmptyTestScores.map((item: any, index: number) => `
      <div class="item-row" data-section="testScores" data-index="${index}">
        <div class="item-left">
          <div>${item.year || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.testName || ''}</div>
          <div class="item-subtitle">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Scholarships -->
  ${nonEmptyScholarships.length > 0 ? `
  <div class="main-section" data-section="scholarships">
    <div class="section-title">Scholarships</div>
    ${nonEmptyScholarships.map((item: any, index: number) => `
      <div class="item-row" data-section="scholarships" data-index="${index}">
        <div class="item-left">
          <div>${item.year || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.name || ''}</div>
          <div class="item-subtitle">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Certifications -->
  ${nonEmptyCertifications.length > 0 ? `
  <div class="main-section" data-section="certifications">
    <div class="section-title">Certifications</div>
    ${nonEmptyCertifications.map((cert: any, index: number) => `
      <div class="cert-item" data-section="certifications" data-index="${index}">
        <div class="cert-name">${cert.name || ''}</div>
        <div class="cert-issuer">${cert.issuer || ''}</div>
        <div class="cert-date">${cert.date || ''}</div>
        ${cert.description ? `<div style="font-size: 8pt; color: var(--secondary-color);">${cert.description}</div>` : ''}
        ${cert.url ? `<div style="margin-top: 3px;"><a href="${cert.url}" target="_blank" style="font-size: 8pt;">View Certificate</a></div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Languages -->
  ${nonEmptyLanguages.length > 0 ? `
  <div class="main-section" data-section="languages">
    <div class="section-title">Languages</div>
    <div class="skills-grid">
      ${nonEmptyLanguages.map((lang: any, index: number) => `
        <div class="language-item" data-section="languages" data-index="${index}">
          <span class="language-name">${lang.language || lang}</span>
          ${lang.level ? `<span class="language-level">${lang.level}${lang.capability ? ` - ${lang.capability}` : ''}</span>` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- Awards -->
  ${nonEmptyAwards.length > 0 ? `
  <div class="main-section" data-section="awards">
    <div class="section-title">Awards</div>
    ${nonEmptyAwards.map((award: any, index: number) => `
      <div class="item-row" data-section="awards" data-index="${index}">
        <div class="item-left">
          <div>${award.issueYear || award.year || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${award.title || ''}</div>
          <div class="item-subtitle">${award.organization || ''}</div>
          ${award.description ? `<p style="font-size: 9pt; color: var(--secondary-color);">${award.description}</p>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Speaking Engagements -->
  ${nonEmptySpeakingEngagements.length > 0 ? `
  <div class="main-section" data-section="speakingEngagements">
    <div class="section-title">Speaking Engagements</div>
    ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
      <div class="item-row" data-section="speakingEngagements" data-index="${index}">
        <div class="item-left">
          <div>${item.date || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.topic || ''}</div>
          <div class="item-subtitle">${item.eventName || ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Memberships -->
  ${nonEmptyMemberships.length > 0 ? `
  <div class="main-section" data-section="memberships">
    <div class="section-title">Memberships</div>
    ${nonEmptyMemberships.map((item: any, index: number) => `
      <div class="item-row" data-section="memberships" data-index="${index}">
        <div class="item-left">
          <div>${item.year || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.membershipName || ''}</div>
          <div class="item-subtitle">${item.organizationName || ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Workshops -->
  ${nonEmptyWorkshops.length > 0 ? `
  <div class="main-section" data-section="workshops">
    <div class="section-title">Workshops</div>
    ${nonEmptyWorkshops.map((item: any, index: number) => `
      <div class="item-row" data-section="workshops" data-index="${index}">
        <div class="item-left">
          <div>${item.year || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.programTitle || ''}</div>
          <div class="item-subtitle">${item.conductedBy || ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Co-curricular Activities -->
  ${nonEmptyCoCurricular.length > 0 ? `
  <div class="main-section" data-section="coCurricular">
    <div class="section-title">Co-curricular Activities</div>
    ${nonEmptyCoCurricular.map((item: any, index: number) => `
      <div class="item-row" data-section="coCurricular" data-index="${index}">
        <div class="item-left">
          <div>${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.activity || ''}</div>
          <div class="item-subtitle">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Extracurricular Activities -->
  ${nonEmptyExtracurricular.length > 0 ? `
  <div class="main-section" data-section="extracurricular">
    <div class="section-title">Extracurricular Activities</div>
    ${nonEmptyExtracurricular.map((item: any, index: number) => `
      <div class="item-row" data-section="extracurricular" data-index="${index}">
        <div class="item-left">
          <div>${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.activity || ''}</div>
          <div class="item-subtitle">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ''])}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Key Achievements -->
  ${nonEmptyKeyAchievements.length > 0 ? `
  <div class="main-section" data-section="keyAchievements">
    <div class="section-title">Key Achievements</div>
    <ul>
      ${nonEmptyKeyAchievements.map((achievement: string, index: number) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
    </ul>
  </div>` : ''}

  <!-- Key Responsibilities -->
  ${nonEmptyResponsibilities.length > 0 ? `
  <div class="main-section" data-section="responsibilities">
    <div class="section-title">Key Responsibilities</div>
    <ul>
      ${nonEmptyResponsibilities.map((resp: string, index: number) => `<li data-section="responsibilities" data-index="${index}">${resp}</li>`).join('')}
    </ul>
  </div>` : ''}

  <!-- Tools -->
  ${nonEmptyTools.length > 0 ? `
  <div class="main-section" data-section="tools">
    <div class="section-title">Tools & Technologies</div>
    <ul>
      ${nonEmptyTools.map((tool: string, index: number) => `<li data-section="tools" data-index="${index}">${tool}</li>`).join('')}
    </ul>
  </div>` : ''}

  <!-- Hobbies -->
  ${nonEmptyHobbies.length > 0 ? `
  <div class="main-section" data-section="hobbies">
    <div class="section-title">Hobbies & Interests</div>
    <div class="tags-container">
      ${nonEmptyHobbies.map((hobby: any, index: number) => `
        <span class="tag" data-section="hobbies" data-index="${index}">${hobby}</span>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- Social Links -->
  ${nonEmptySocialLinks.length > 0 ? `
  <div class="main-section" data-section="socialLinks">
    <div class="section-title">Social Links</div>
    <div class="contact-list">
      ${nonEmptySocialLinks.map((link: any, index: number) => `
        <div data-section="socialLinks" data-index="${index}">
          <a href="${link.url}" target="_blank">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- Social Profiles -->
  ${nonEmptySocialProfiles.length > 0 ? `
  <div class="main-section" data-section="socialProfiles">
    <div class="section-title">Social Profiles</div>
    <div class="contact-list">
      ${nonEmptySocialProfiles.map((profile: any, index: number) => `
        <div data-section="socialProfiles" data-index="${index}">
          <a href="${profile.url}" target="_blank">${profile.platform || "Profile"}</a>
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- References -->
  ${nonEmptyReferences.length > 0 ? `
  <div class="main-section" data-section="references">
    <div class="section-title">References</div>
    ${nonEmptyReferences.map((ref: any, index: number) => `
      <div class="item-row" data-section="references" data-index="${index}">
        <div class="item-left"></div>
        <div class="item-right">
          <div class="item-title">${ref.name || ''}</div>
          <div class="item-subtitle">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
          ${ref.contactInformation ? `<p style="font-size: 9pt; color: var(--secondary-color);"><strong>Contact:</strong> ${ref.contactInformation}</p>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Custom Sections -->
  ${nonEmptyCustomSections.length > 0 ? data.customSections
    .filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries))
    .map((section: any, sectionIndex: number) => `
    <div class="main-section" data-section="custom-${sectionIndex}">
      <div class="section-title">${section.heading || 'Custom Section'}</div>
      ${section.entries && section.entries.length > 0 ? section.entries
        .filter((entry: any) => entry.isVisible && (entry.title || entry.description))
        .map((entry: any, entryIndex: number) => `
        <div class="item-row" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
          <div class="item-left">${entry.date || ''}</div>
          <div class="item-right">
            <div class="item-title">${entry.title || ''}${entry.organization ? ` | ${entry.organization}` : ''}</div>
            <p style="font-size: 9pt; color: var(--secondary-color);">${entry.description || ''}</p>
          </div>
        </div>
      `).join('') : ''}
    </div>
  `).join('') : ''}
</div>
</body>
</html>`;
}