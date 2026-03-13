export function buildMachampTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#000000", // Black primary for headings/names
    secondary: "#64748b", // Grey for contact info
    background: "#ffffff",
    headingFont: "Inter, sans-serif",
    bodyFont: "Inter, sans-serif"
  };

  // --- PRESERVED LOGIC START ---
  const currentTheme = theme || defaultTheme;
  const typography = theme?.typography || {
    fontSize: "medium",
    alignment: "left",
    fontWeight: "normal",
  };

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14 // Default 14px
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Inter, sans-serif'
  
  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize
  const headingFontSize = Math.round(userFontSize * 2.25) // 2.25x base size
  const subheadingFontSize = Math.round(userFontSize * 1.125) // 1.125x base size

  const fontSizeMap = {
    small: { base: "11px", heading: "30px", subheading: "14px" },
    medium: { base: "14px", heading: "36px", subheading: "15px" },
    large: { base: "16px", heading: "42px", subheading: "17px" },
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

  const currentFontSize =
    fontSizeMap[typography.fontSize as keyof typeof fontSizeMap] ||
    fontSizeMap.medium;
  const currentAlignment =
    alignmentMap[typography.alignment as keyof typeof alignmentMap] || "left";
  const currentFontWeight =
    fontWeightMap[typography.fontWeight as keyof typeof fontWeightMap] ||
    "400";
  // --- PRESERVED LOGIC END ---

  const greyBackground = '#e0e0e0'; // Grey background for the top section

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

  // Helper to format subtitle with multiple fields using " • " separator
  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(" • ");
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
  * {
    margin: 0; padding: 0; box-sizing: border-box;
  }

  :root {
    --primary-color: ${currentTheme.primary};
    --secondary-color: ${currentTheme.secondary};
    --background-color: ${currentTheme.background};
    --heading-font: ${currentTheme.headingFont};
    --body-font: ${currentTheme.bodyFont};
  }

  body {
    font-family: ${userFontFamily};
    background: #f3f6fa;
    color: #1e293b;
    line-height: 1.65;
    font-size: ${baseFontSize}px;
  }

  .container {
    max-width: 880px;
    margin: 40px auto;
    border-radius: 14px;
  }

  /* --- TOP GREY SECTION --- */
  .top-section {
    background-color: ${greyBackground};
    padding: 48px 48px 30px 48px;
    display: flex;
    align-items: flex-start;
    gap: 30px;
  }

  /* --- PROFILE PHOTO SECTION --- */
  .profile-photo-container {
    width: 160px;
    height: 160px;
    flex-shrink: 0;
  }

  .profile-photo {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #f8fafc;
  }

  .photo-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 14px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* --- HEADER CONTENT (Name & Summary) --- */
  .header-content {
    flex: 1;
  }

  .name {
    font-size: ${Math.round(baseFontSize * 3)}px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .summary-text {
    font-size: ${currentFontSize.base};
    line-height: 1.7;
    color: var(--secondary-color);
    text-align: ${currentAlignment};
    font-weight: ${currentFontWeight};
  }

  /* --- MAIN CONTENT LAYOUT (Below Grey Section) --- */
  .main-content {
    display: flex;
    padding: 30px 48px 48px 48px;
    gap: 40px;
  }

  .left-column {
    flex: 1;
  }

  .right-column {
    flex: 2;
  }

  /* --- SECTION STYLING --- */
  .section {
    margin-bottom: 32px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb; /* Light grey underline */
  }

  /* --- CONTACT INFO STYLING (Left Column) --- */
  .contact-info {
    font-size: 14px;
    color: var(--secondary-color);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    word-break: break-all; /* Ensure long emails/links wrap */
  }
  
  .contact-item a {
    color: inherit;
    text-decoration: none;
  }

  .contact-item a:hover {
    text-decoration: underline;
  }

  /* --- SKILLS STYLING (Left Column) --- */
  .skills-list {
    list-style: none;
  }

  .skill-item {
    font-size: ${currentFontSize.base};
    color: var(--secondary-color);
    margin-bottom: 10px;
    padding-left: 15px;
    position: relative;
  }

  .skill-item:before {
    content: "•";
    color: var(--primary-color);
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  /* --- EDUCATION & EXPERIENCE (Right Column) --- */
  .entry {
    margin-bottom: 20px;
  }

  .entry-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 5px;
  }

  .entry-subtitle {
    font-size: 14px;
    color: var(--secondary-color);
    font-style: italic;
    margin-bottom: 8px;
  }

  .entry-content {
    font-size: 14px;
    color: var(--secondary-color);
    line-height: 1.6;
  }

  .entry-content ul {
    margin: 8px 0 8px 20px;
    padding: 0;
    list-style-type: disc;
  }

  .entry-content li {
    margin: 4px 0;
    padding: 0;
    color: var(--secondary-color);
  }

  .entry-content b {
    font-weight: 700;
    color: var(--primary-color);
  }

  /* Enhanced Education Styles */
  .education-field {
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 4px;
    font-size: ${Math.round(baseFontSize * 0.95)}px;
  }

  .education-school {
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 4px;
  }

  .education-location {
    color: var(--secondary-color);
    font-style: italic;
    margin-bottom: 6px;
    font-size: ${Math.round(baseFontSize * 0.9)}px;
  }

  .education-description {
    font-size: ${Math.round(baseFontSize * 0.9)}px;
    color: var(--secondary-color);
    line-height: 1.6;
    margin-top: 6px;
    padding: 10px;
    background: rgba(255,255,255,0.7);
    border-left: 3px solid var(--primary-color);
    border-radius: 4px;
  }

  .education-description ul {
    margin: 5px 0 5px 20px;
    padding: 0;
    list-style-type: disc;
  }

  .education-description li {
    margin: 3px 0;
    color: var(--secondary-color);
  }

  .education-description b {
    font-weight: 700;
    color: var(--primary-color);
  }

  .education-achievements {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e5e7eb;
  }

  .education-achievements h4 {
    font-size: ${Math.round(baseFontSize * 0.85)}px;
    font-weight: 700;
    color: var(--primary-color);
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
    color: var(--secondary-color);
    font-size: ${Math.round(baseFontSize * 0.9)}px;
  }

  .education-achievements li:before {
    content: "•";
    color: var(--primary-color);
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .top-section {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 30px;
    }
    
    .header-content {
      margin-bottom: 20px;
    }

    .profile-photo-container {
      width: 140px;
      height: 140px;
      order: -1; /* Photo above name on mobile */
      margin-bottom: 20px;
    }

    .main-content {
      flex-direction: column;
      padding: 30px;
      gap: 30px;
    }
    
    .name {
      font-size: 36px;
    }
    
    .container {
      margin: 20px auto;
      border-radius: 0; /* Remove border radius on mobile for full width look */
    }
  }

  @media (max-width: 480px) {
    .name {
      font-size: 30px;
    }
    
    .profile-photo-container {
      width: 120px;
      height: 120px;
    }
  }
</style>
</head>

<body>
<div class="container">

<div class="top-section" data-section="personal">
  <div class="profile-photo-container" data-section="personal">
    ${data.personal?.image ?
    `<img src="${data.personal.image}" alt="${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Profile Photo'}" class="profile-photo" />` :
    `<div class="photo-placeholder">Profile Photo</div>`
  }
  </div>
  <div class="header-content" data-section="personal">
    <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : "YOUR NAME"}${data.personal?.middleName ? ` ${data.personal.middleName}` : ''}</div>
    ${data.personal?.role ? `<div style="font-size: 18px; margin-bottom: 10px; font-weight: 600; color: #334155;" data-section="personal">${data.personal.role}</div>` : ''}
    ${data.summary && data.summary.trim() ? `
    <div class="summary-section" data-section="summary">
      <p class="summary-text" data-section="summary">${data.summary}</p>
    </div>` : ""}
    
    ${data.careerObjective && data.careerObjective.trim() ? `
    <div class="summary-section" data-section="careerObjective" style="margin-top: 15px;">
      <p class="summary-text" data-section="careerObjective"><strong>Career Objective:</strong> ${data.careerObjective}</p>
    </div>` : ""}
  </div>
</div>

  <div class="main-content">
    <div class="left-column">

      <!-- Personal Details -->
      ${(() => {
        const personalDetails = [];
        if (data.personal?.fathersName) personalDetails.push(`<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>`);
        if (data.personal?.dob) personalDetails.push(`<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>`);
        if (data.personal?.gender) personalDetails.push(`<div><strong>Gender:</strong> ${data.personal.gender}</div>`);
        if (data.personal?.maritalStatus) personalDetails.push(`<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>`);
        if (data.personal?.nationality) personalDetails.push(`<div><strong>Nationality:</strong> ${data.personal.nationality}</div>`);
        if (data.personal?.passportNo) personalDetails.push(`<div><strong>Passport No:</strong> ${data.personal.passportNo}</div>`);
        
        return personalDetails.length > 0 ? `
      <div class="section" data-section="personal">
        <div class="section-title">Personal Details</div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${baseFontSize}px; color: var(--secondary-color);">
          ${personalDetails.join('')}
        </div>
      </div>` : '';
      })()}

      <!-- Professional Context -->
      ${nonEmptyProfessionalContext ? `
      <div class="section" data-section="professionalContext">
        <div class="section-title">Professional Context</div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${baseFontSize}px; color: var(--secondary-color);">
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
      <div class="section" data-section="availabilityWorkAuth">
        <div class="section-title">Availability</div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${baseFontSize}px; color: var(--secondary-color);">
          ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<div><strong>Notice Period:</strong> ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
          ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<div><strong>Work Authorization:</strong> ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
          ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<div><strong>Preferred Location:</strong> ${nonEmptyAvailabilityWorkAuth.preferredLocation}</div>` : ''}
        </div>
      </div>` : ''}

      <!-- Contact -->
      <div class="section" data-section="contact">
        <div class="section-title">Contact</div>
        <div class="contact-info">
          ${(() => {
            const addressParts = [
              data.personal?.fullAddress,
              data.personal?.location,
              data.personal?.country,
              data.personal?.pinCode
            ].filter(Boolean);
            return addressParts.length > 0 ? `<div class="contact-item">${addressParts.join(', ')}</div>` : '';
          })()}
          ${data.personal?.phone ? `<div class="contact-item">${data.personal.phone}</div>` : ''}
          ${data.personal?.alternatePhone ? `<div class="contact-item">${data.personal.alternatePhone}</div>` : ''}
          ${data.personal?.email ? `<div class="contact-item">${data.personal.email}</div>` : ''}
          ${data.personal?.linkedinUrl ? `<div class="contact-item"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>` : ''}
          ${data.personal?.githubUrl ? `<div class="contact-item"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>` : ''}
          ${data.personal?.portfolioUrl ? `<div class="contact-item"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>` : ''}
          ${data.personal?.website ? `<div class="contact-item"><a href="${data.personal.website}" target="_blank">Website</a></div>` : ''}
          ${data.personal?.twitterUrl ? `<div class="contact-item"><a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></div>` : ''}
          ${data.personal?.facebookUrl ? `<div class="contact-item"><a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></div>` : ''}
          ${data.personal?.instagramUrl ? `<div class="contact-item"><a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></div>` : ''}
          ${data.personal?.behanceUrl ? `<div class="contact-item"><a href="${data.personal.behanceUrl}" target="_blank">Behance</a></div>` : ''}
          ${data.personal?.dribbbleUrl ? `<div class="contact-item"><a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></div>` : ''}
          ${data.personal?.stackoverflowUrl ? `<div class="contact-item"><a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></div>` : ''}
          ${data.personal?.mediumUrl ? `<div class="contact-item"><a href="${data.personal.mediumUrl}" target="_blank">Medium</a></div>` : ''}
        </div>
      </div>

      <!-- Skills -->
      ${nonEmptySkills.length > 0 ? `
      <div class="section" data-section="skills">
        <div class="section-title">Skills</div>
        <ul class="skills-list">
          ${nonEmptySkills.map((skill: any, index: number) =>
      `<li class="skill-item" data-section="skills" data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</li>`
    ).join("")}
        </ul>
      </div>` : ""}

      <!-- Tools & Technologies -->
      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="section" data-section="toolsTechnologies">
        <div class="section-title">Tools & Technologies</div>
        <ul class="skills-list">
          ${nonEmptyToolsTechnologies.map((item: any, index: number) =>
      `<li class="skill-item" data-section="toolsTechnologies" data-index="${index}">${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}</li>`
    ).join("")}
        </ul>
      </div>` : ""}

      <!-- Methodologies -->
      ${nonEmptyMethodologies.length > 0 ? `
      <div class="section" data-section="methodologies">
        <div class="section-title">Methodologies</div>
        <ul class="skills-list">
          ${nonEmptyMethodologies.map((item: any, index: number) =>
      `<li class="skill-item" data-section="methodologies" data-index="${index}">${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}</li>`
    ).join("")}
        </ul>
      </div>` : ""}

      <!-- Industry Expertise -->
      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section" data-section="industryExpertise">
        <div class="section-title">Industry Expertise</div>
        <ul class="skills-list">
          ${nonEmptyIndustryExpertise.map((item: any, index: number) =>
      `<li class="skill-item" data-section="industryExpertise" data-index="${index}">${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}</li>`
    ).join("")}
        </ul>
      </div>` : ""}

      <!-- Languages -->
      ${nonEmptyLanguages.length > 0 ? `
      <div class="section" data-section="languages">
        <div class="section-title">Languages</div>
        <ul class="skills-list">
          ${nonEmptyLanguages.map((lang: any, index: number) =>
      `<li class="skill-item" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>`
    ).join("")}
        </ul>
      </div>` : ""}

      <!-- Hobbies -->
      ${nonEmptyHobbies.length > 0 ? `
      <div class="section" data-section="hobbies">
        <div class="section-title">Hobbies</div>
        <ul class="skills-list">
          ${nonEmptyHobbies.map((hobby: any, index: number) =>
      `<li class="skill-item" data-section="hobbies" data-index="${index}">${hobby}</li>`
    ).join("")}
        </ul>
      </div>` : ""}

      <!-- Social Links -->
      ${nonEmptySocialLinks.length > 0 ? `
      <div class="section" data-section="socialLinks">
        <div class="section-title">Social Links</div>
        <ul class="skills-list">
          ${nonEmptySocialLinks.map((link: any, index: number) =>
      `<li class="skill-item" data-section="socialLinks" data-index="${index}"><a href="${link.url}" target="_blank" style="color: var(--secondary-color); text-decoration: none;">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a></li>`
    ).join("")}
        </ul>
      </div>` : ""}

      <!-- Social Profiles -->
      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="section" data-section="socialProfiles">
        <div class="section-title">Social Profiles</div>
        <ul class="skills-list">
          ${nonEmptySocialProfiles.map((profile: any, index: number) =>
      `<li class="skill-item" data-section="socialProfiles" data-index="${index}"><a href="${profile.url}" target="_blank" style="color: var(--secondary-color); text-decoration: none;">${profile.platform || "Profile"}</a></li>`
    ).join("")}
        </ul>
      </div>` : ""}

      <!-- References -->
      ${nonEmptyReferences.length > 0 ? `
      <div class="section" data-section="references">
        <div class="section-title">References</div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${nonEmptyReferences.map((ref: any, index: number) => `
            <div class="entry" data-section="references" data-index="${index}">
              <div class="entry-title" style="font-size: 14px;">${ref.name || ''}</div>
              ${ref.designationRelationship ? `<div class="entry-subtitle" style="font-size: 13px;">${ref.designationRelationship}</div>` : ''}
              ${ref.organization ? `<div class="entry-subtitle" style="font-size: 13px;">${ref.organization}</div>` : ''}
              ${ref.contactInformation ? `<div class="entry-content" style="font-size: 13px;"><strong>Contact:</strong> ${ref.contactInformation}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>` : ''}
    </div>

    <div class="right-column">
      <!-- Work Experience -->
      ${hasNonEmptyItems(data.experience) ? `
      <div class="section" data-section="experience">
        <div class="section-title">Work Experience</div>
        ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
          const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
          const subtitle = formatSubtitle([exp.company, exp.location, exp.domain]);
          
          return `
          <div class="entry" data-section="experience" data-index="${index}">
            <div class="entry-title">${exp.title || ''}</div>
            <div class="entry-subtitle">${subtitle} • ${dateRange}</div>
            <div class="entry-content">${exp.description || ''}</div>
            ${exp.achievements ? `<div class="entry-content" style="margin-top: 5px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ''}
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Internships -->
      ${nonEmptyInternships.length > 0 ? `
      <div class="section" data-section="internships">
        <div class="section-title">Internships</div>
        ${nonEmptyInternships.map((item: any, index: number) => {
          const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
          const subtitle = formatSubtitle([item.company, item.location]);
          
          return `
          <div class="entry" data-section="internships" data-index="${index}">
            <div class="entry-title">${item.title || ''}</div>
            <div class="entry-subtitle">${subtitle} • ${dateRange}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Training Programs -->
      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="section" data-section="trainingPrograms">
        <div class="section-title">Training Programs</div>
        ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
          <div class="entry" data-section="trainingPrograms" data-index="${index}">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.duration])} • ${item.completionDate || ''}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Education -->
      ${hasNonEmptyItems(data.education) ? `
      <div class="section" data-section="education">
        <div class="section-title">Education</div>
        ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
          <div class="entry" data-section="education" data-index="${index}">
            <div class="entry-title">
              ${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}${edu.qualification ? ` (${edu.qualification})` : ''}
            </div>
            
            ${edu.school ? `<div class="education-school">${edu.school}${edu.location ? `, ${edu.location}` : ''}</div>` : ''}
            ${edu.grade ? `<div class="education-field">Grade: ${edu.grade}</div>` : ''}
            <div class="entry-subtitle">Graduation: ${edu.graduationDate || ""}</div>
            
            ${edu.description ? `
              <div class="education-description">
                ${edu.description}
              </div>
            ` : ''}
            
            ${edu.achievements && edu.achievements.length > 0 ? `
              <div class="education-achievements">
                <h4>Academic Excellence</h4>
                <ul>
                  ${edu.achievements.filter((achievement: string) => achievement.trim()).map((achievement: string, achIndex: number) => 
                    `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`
                  ).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Projects -->
      ${nonEmptyProjects.length > 0 ? `
      <div class="section" data-section="projects">
        <div class="section-title">Projects</div>
        ${nonEmptyProjects.map((project: any, index: number) => {
          const dateRange = formatDateRange(project.startDate, project.endDate);
          
          return `
          <div class="entry" data-section="projects" data-index="${index}">
            <div class="entry-title">${project.name || ''}</div>
            ${project.technologies ? `<div class="entry-subtitle">${project.technologies}</div>` : ''}
            ${dateRange ? `<div class="entry-subtitle">${dateRange}</div>` : ''}
            <div class="entry-content">${project.description || ''}</div>
            ${project.url ? `<div class="entry-content" style="margin-top: 5px;"><a href="${project.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">${project.urlText || 'View Project'}</a></div>` : ''}
          </div>`
        }).join("")}
      </div>` : ""}

      <!-- Academic Projects -->
      ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="section" data-section="academicProjects">
        <div class="section-title">Academic Projects</div>
        ${nonEmptyAcademicProjects.map((item: any, index: number) => `
          <div class="entry" data-section="academicProjects" data-index="${index}">
            <div class="entry-title">${item.name || item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.institution, item.duration])}</div>
            ${item.course ? `<div class="entry-subtitle">Course: ${item.course}</div>` : ''}
            <div class="entry-content">${item.description || ''}</div>
            ${item.technologies ? `<div class="entry-content" style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
            ${item.url ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Project</a></div>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Client Projects -->
      ${nonEmptyClientProjects.length > 0 ? `
      <div class="section" data-section="clientProjects">
        <div class="section-title">Client Projects</div>
        ${nonEmptyClientProjects.map((item: any, index: number) => `
          <div class="entry" data-section="clientProjects" data-index="${index}">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : '', item.duration])}</div>
            <div class="entry-content">${item.description || ''}</div>
            ${item.toolsTechnologies ? `<div class="entry-content" style="margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ''}
            ${item.projectUrl ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Project</a></div>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Portfolio -->
      ${nonEmptyPortfolio.length > 0 ? `
      <div class="section" data-section="portfolio">
        <div class="section-title">Portfolio</div>
        ${nonEmptyPortfolio.map((item: any, index: number) => `
          <div class="entry" data-section="portfolio" data-index="${index}">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.type, item.platform])}</div>
            <div class="entry-content">${item.description || ''}</div>
            ${item.url ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Portfolio</a></div>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Leadership Positions -->
      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="section" data-section="leadershipPositions">
        <div class="section-title">Leadership & Positions</div>
        ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
          const dateRange = formatDateRange(item.startDate, item.endDate);
          
          return `
          <div class="entry" data-section="leadershipPositions" data-index="${index}">
            <div class="entry-title">${item.position || item.title || ''}</div>
            <div class="entry-subtitle">${item.organization || ''} • ${dateRange}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Volunteering -->
      ${nonEmptyVolunteering.length > 0 ? `
      <div class="section" data-section="volunteering">
        <div class="section-title">Volunteering</div>
        ${nonEmptyVolunteering.map((item: any, index: number) => `
          <div class="entry" data-section="volunteering" data-index="${index}">
            <div class="entry-title">${item.role || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.causeArea, item.duration])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Military Service -->
      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="section" data-section="militaryService">
        <div class="section-title">Military Service</div>
        ${nonEmptyMilitaryService.map((item: any, index: number) => `
          <div class="entry" data-section="militaryService" data-index="${index}">
            <div class="entry-title">${item.rank ? item.rank : ''}${item.rank && item.branch ? ' - ' : ''}${item.branch || ''}</div>
            ${item.specialization ? `<div class="entry-subtitle">${item.specialization}</div>` : ''}
            ${item.duration ? `<div class="entry-subtitle">${item.duration}</div>` : ''}
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Teaching Experience -->
      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="section" data-section="teachingExperience">
        <div class="section-title">Teaching Experience</div>
        ${nonEmptyTeachingExperience.map((item: any, index: number) => `
          <div class="entry" data-section="teachingExperience" data-index="${index}">
            <div class="entry-title">${item.subjectCourseTaught || item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.institution, item.duration])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Mentorship Experience -->
      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="section" data-section="mentorshipExperience">
        <div class="section-title">Mentorship Experience</div>
        ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
          <div class="entry" data-section="mentorshipExperience" data-index="${index}">
            <div class="entry-title">${item.mentorshipArea || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : '', item.duration])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Research Grants -->
      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="section" data-section="researchGrants">
        <div class="section-title">Research Grants</div>
        ${nonEmptyResearchGrants.map((item: any, index: number) => `
          <div class="entry" data-section="researchGrants" data-index="${index}">
            <div class="entry-title">${item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : '', item.year])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Publications -->
      ${nonEmptyPublications.length > 0 ? `
      <div class="section" data-section="publications">
        <div class="section-title">Publications</div>
        ${nonEmptyPublications.map((item: any, index: number) => `
          <div class="entry" data-section="publications" data-index="${index}">
            <div class="entry-title">${item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.journalPublisher, item.publicationType, item.year])}</div>
            ${item.authors ? `<div class="entry-content"><strong>Authors:</strong> ${item.authors}</div>` : ''}
            ${item.urlDoi ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Publication</a></div>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Patents -->
      ${nonEmptyPatents.length > 0 ? `
      <div class="section" data-section="patents">
        <div class="section-title">Patents</div>
        ${nonEmptyPatents.map((item: any, index: number) => `
          <div class="entry" data-section="patents" data-index="${index}">
            <div class="entry-title">${item.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : '', item.issuingAuthority, item.year])}</div>
            ${item.status ? `<div class="entry-content"><strong>Status:</strong> ${item.status}</div>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Test Scores -->
      ${nonEmptyTestScores.length > 0 ? `
      <div class="section" data-section="testScores">
        <div class="section-title">Test Scores</div>
        ${nonEmptyTestScores.map((item: any, index: number) => `
          <div class="entry" data-section="testScores" data-index="${index}">
            <div class="entry-title">${item.testName || ''}</div>
            <div class="entry-subtitle">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''} • ${item.year || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Scholarships -->
      ${nonEmptyScholarships.length > 0 ? `
      <div class="section" data-section="scholarships">
        <div class="section-title">Scholarships</div>
        ${nonEmptyScholarships.map((item: any, index: number) => `
          <div class="entry" data-section="scholarships" data-index="${index}">
            <div class="entry-title">${item.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.amount, item.year])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Co-curricular Activities -->
      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="section" data-section="coCurricular">
        <div class="section-title">Co-curricular Activities</div>
        ${nonEmptyCoCurricular.map((item: any, index: number) => `
          <div class="entry" data-section="coCurricular" data-index="${index}">
            <div class="entry-title">${item.activity || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role, item.year || formatDateRange(item.startDate, item.endDate)])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Extracurricular Activities -->
      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="section" data-section="extracurricular">
        <div class="section-title">Extracurricular Activities</div>
        ${nonEmptyExtracurricular.map((item: any, index: number) => `
          <div class="entry" data-section="extracurricular" data-index="${index}">
            <div class="entry-title">${item.activity || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role, item.year || formatDateRange(item.startDate, item.endDate)])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Certifications -->
      ${nonEmptyCertifications.length > 0 ? `
      <div class="section" data-section="certifications">
        <div class="section-title">Certifications</div>
        ${nonEmptyCertifications.map((cert: any, index: number) => `
          <div class="entry" data-section="certifications" data-index="${index}">
            <div class="entry-title">${cert.name || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([cert.issuer, cert.date])}</div>
            ${cert.description ? `<div class="entry-content">${cert.description}</div>` : ''}
            ${cert.url ? `<div class="entry-content" style="margin-top: 5px;"><a href="${cert.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Certificate</a></div>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Awards -->
      ${nonEmptyAwards.length > 0 ? `
      <div class="section" data-section="awards">
        <div class="section-title">Awards</div>
        ${nonEmptyAwards.map((award: any, index: number) => `
          <div class="entry" data-section="awards" data-index="${index}">
            <div class="entry-title">${award.title || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([award.organization, award.issueYear || award.year])}</div>
            ${award.description ? `<div class="entry-content">${award.description}</div>` : ''}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Speaking Engagements -->
      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="section" data-section="speakingEngagements">
        <div class="section-title">Speaking Engagements</div>
        ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
          <div class="entry" data-section="speakingEngagements" data-index="${index}">
            <div class="entry-title">${item.topic || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.eventName, item.date])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Memberships -->
      ${nonEmptyMemberships.length > 0 ? `
      <div class="section" data-section="memberships">
        <div class="section-title">Memberships</div>
        ${nonEmptyMemberships.map((item: any, index: number) => `
          <div class="entry" data-section="memberships" data-index="${index}">
            <div class="entry-title">${item.membershipName || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organizationName, item.year])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Workshops -->
      ${nonEmptyWorkshops.length > 0 ? `
      <div class="section" data-section="workshops">
        <div class="section-title">Workshops</div>
        ${nonEmptyWorkshops.map((item: any, index: number) => `
          <div class="entry" data-section="workshops" data-index="${index}">
            <div class="entry-title">${item.programTitle || ''}</div>
            <div class="entry-subtitle">${formatSubtitle([item.conductedBy, item.year])}</div>
            <div class="entry-content">${item.description || ''}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Key Achievements -->
      ${nonEmptyKeyAchievements.length > 0 ? `
      <div class="section" data-section="keyAchievements">
        <div class="section-title">Key Achievements</div>
        <div class="entry-content">
          <ul>
            ${nonEmptyKeyAchievements.map((achievement: string, index: number) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
          </ul>
        </div>
      </div>` : ""}

      <!-- Key Responsibilities -->
      ${nonEmptyResponsibilities.length > 0 ? `
      <div class="section" data-section="responsibilities">
        <div class="section-title">Key Responsibilities</div>
        <div class="entry-content">
          <ul>
            ${nonEmptyResponsibilities.map((line: string, index: number) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
          </ul>
        </div>
      </div>` : ""}

      <!-- Tools -->
      ${nonEmptyTools.length > 0 ? `
      <div class="section" data-section="tools">
        <div class="section-title">Tools & Technologies</div>
        <div class="entry-content">
          <ul>
            ${nonEmptyTools.map((line: string, index: number) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
          </ul>
        </div>
      </div>` : ""}

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
            <div class="entry-title">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
            ${entry.date ? `<div class="entry-subtitle">${entry.date}</div>` : ''}
            ${entry.description ? `<div class="entry-content">${entry.description}</div>` : ''}
          </div>
        `).join('') : '<div style="color: var(--secondary-color); font-style: italic;">No entries in this section</div>'}
      </div>
      `).join('') : ''}
    </div>
  </div>

</div>
</body>
</html>`;
}