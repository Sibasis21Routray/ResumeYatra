export function buildCharizardTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#363636",
    secondary: "#666666",
    background: "#ffffff",
    headingFont: "Arial",
    bodyFont: "Arial",
  };

  // --- PRESERVED SECTION START ---
  const currentTheme = theme || defaultTheme;

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14; // Default 14px
  const userFontFamily =
    data.formatting?.fontFamily || data.fontFamily || "Roboto, sans-serif";

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
  const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size
  // --- PRESERVED SECTION END ---

  // Define colors based on the reference image (Monochrome/Grey) with theme support
  const headerTopBg = currentTheme.primary;
  const headerBottomBg = currentTheme.secondary;
  const primaryText = "#000000";
  const secondaryText = "#444444";
  const dateText = "#666666";
  const sectionBorder = currentTheme.primary;

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

  // SVG Icons for contact section
  const icons = {
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: middle;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: middle;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: middle;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    link: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px; vertical-align: middle;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
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
     color: ${primaryText};
     line-height: 1.6;
     background: #ffffff;
     font-size: ${baseFontSize}px;
   }
   .container {
     max-width: 850px;
     margin: 0 auto;
     background: #ffffff;
   }
   .header-name-bar {
     background-color: ${headerTopBg};
     padding: 35px 40px;
     text-transform: uppercase;
   }
   .name {
     font-size: ${headingFontSize}px;
     font-weight: 800;
     color: #f7efefff; /* FIXED: Changed from currentTheme.primary to white */
     letter-spacing: 2px;
     line-height: 1.1;
   }

   .role {
     font-size: ${Math.round(baseFontSize * 1.3)}px;
     font-weight: 400;
     color: rgba(255, 255, 255, 0.9);
     margin-top: 8px;
     letter-spacing: 1px;
   }

   .header-contact-bar {
       background-color: ${headerBottomBg};
       padding: 15px 40px;
       display: flex;
       flex-wrap: wrap;
       column-gap: 25px;
       row-gap: 10px;
       font-size: ${Math.round(baseFontSize * 0.85)}px;
       align-items: center;
   }
   .contact-item {
       display: flex;
       align-items: center;
       white-space: nowrap;
       color: black;
   }
   .contact-item a {
       color: black;
       text-decoration: none;
   }

   .content-wrapper {
     padding: 40px;
   }
   .section {
     margin-bottom: 35px;
   }
   .section-title {
     font-size: ${Math.round(subheadingFontSize * 1.2)}px;
     font-weight: 800;
     color: ${currentTheme.primary};
     text-transform: uppercase;
     margin-bottom: 18px;
     border-bottom: 2px solid ${sectionBorder};
     padding-bottom: 6px;
   }
   .entry {
     margin-bottom: 22px;
   }
   .entry-header {
     display: flex;
     justify-content: space-between;
     margin-bottom: 4px;
     flex-wrap: wrap;
     gap: 8px;
   }
   .entry-title {
     font-weight: 700;
     font-size: ${subheadingFontSize}px;
   }
   .entry-date {
     font-size: ${Math.round(baseFontSize * 0.9)}px;
     color: ${dateText};
     font-weight: 600;
     white-space: nowrap;
   }
   .entry-subtitle {
     color: ${secondaryText};
     font-size: ${baseFontSize}px;
     margin-bottom: 10px;
     font-weight: 600;
   }
   .entry-content {
     font-size: ${baseFontSize}px;
     color: ${secondaryText};
   }

   .entry-content ul {
     margin: 10px 0 10px 20px;
   }

   .entry-content li {
     margin-bottom: 6px;
   }

   /* Enhanced Education Styles */
   .education-field {
     font-weight: 700;
     color: ${primaryText};
     margin-bottom: 6px;
     font-size: ${Math.round(baseFontSize * 0.95)}px;
   }

   .education-school {
     font-weight: 600;
     color: ${secondaryText};
     margin-bottom: 6px;
   }

   .education-location {
     color: ${dateText};
     font-style: italic;
     margin-bottom: 8px;
   }

   .education-description {
     font-size: ${baseFontSize}px;
     color: ${secondaryText};
     line-height: 1.6;
     margin-top: 12px;
     padding: 12px;
     background: #f8f9fa;
     border-left: 3px solid ${currentTheme.primary};
     border-radius: 4px;
   }

   .education-description ul {
     margin: 8px 0 8px 20px;
     padding: 0;
     list-style-type: disc;
   }

   .education-description li {
     margin: 4px 0;
     color: ${secondaryText};
   }

   .education-description b {
     font-weight: 700;
     color: ${primaryText};
   }

   .education-achievements {
     margin-top: 12px;
     padding-top: 10px;
     border-top: 1px solid #e0e0e0;
   }

   .education-achievements h4 {
     font-size: ${Math.round(baseFontSize * 0.9)}px;
     font-weight: 700;
     color: ${currentTheme.primary};
     margin-bottom: 8px;
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
     padding-left: 20px;
     margin-bottom: 6px;
     color: ${secondaryText};
     font-size: ${baseFontSize}px;
   }

   .education-achievements li:before {
     content: "■";
     color: ${currentTheme.primary};
     font-weight: bold;
     position: absolute;
     left: 0;
   }

   .skills-list {
       display: flex;
       flex-wrap: wrap;
       gap: 8px;
       margin-top: 10px;
   }

   .skill-tag {
       background: #f0f0f0;
       padding: 4px 12px;
       border-radius: 4px;
       font-size: ${Math.round(baseFontSize * 0.9)}px;
       color: ${secondaryText};
   }

   .metrics-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
     gap: 12px;
     margin: 15px 0;
   }

   .metric-item {
     text-align: center;
   }

   .metric-value {
     font-weight: 700;
     font-size: ${Math.round(baseFontSize * 1.2)}px;
     color: ${currentTheme.primary};
   }

   .metric-label {
     font-size: ${Math.round(baseFontSize * 0.8)}px;
     color: ${secondaryText};
     text-transform: uppercase;
     letter-spacing: 0.5px;
   }

   .tags-container {
     display: flex;
     flex-wrap: wrap;
     gap: 8px;
     margin-top: 10px;
   }

   @media print {
     .header-name-bar, .header-contact-bar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
   }
 </style>
</head>
<body>
<div class="container">
  <div class="header" data-section="personal">
    <div class="header-name-bar" data-section="personal">
        <div class="name" data-section="personal">${
          data.personal?.name && data.personal?.name !== "undefined"
            ? data.personal.name
            : "Your Name"
        }${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</div>
        ${
          data.personal?.role
            ? `<div class="role" data-section="personal">${data.personal.role}</div>`
            : ""
        }
    </div>
    <div class="header-contact-bar" data-section="personal">
      ${data.personal?.phone ? `<span class="contact-item" data-section="personal">${icons.phone}${data.personal.phone}</span>` : ""}
      ${data.personal?.alternatePhone ? `<span class="contact-item" data-section="personal">${icons.phone}${data.personal.alternatePhone}</span>` : ""}
      ${data.personal?.email ? `<span class="contact-item" data-section="personal">${icons.email}${data.personal.email}</span>` : ""}
      ${(() => {
        const addressParts = [
          data.personal?.fullAddress,
          data.personal?.location,
          data.personal?.country,
          data.personal?.pinCode
        ].filter(Boolean);
        return addressParts.length > 0 ? `<span class="contact-item" data-section="personal">${icons.location}${addressParts.join(", ")}</span>` : "";
      })()}
      ${data.personal?.linkedinUrl ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></span>` : ""}
      ${data.personal?.githubUrl ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.githubUrl}" target="_blank">GitHub</a></span>` : ""}
      ${data.personal?.portfolioUrl ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></span>` : ""}
      ${data.personal?.website ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.website}" target="_blank">Website</a></span>` : ""}
      ${data.personal?.twitterUrl ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></span>` : ""}
      ${data.personal?.facebookUrl ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></span>` : ""}
      ${data.personal?.instagramUrl ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></span>` : ""}
      ${data.personal?.behanceUrl ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.behanceUrl}" target="_blank">Behance</a></span>` : ""}
      ${data.personal?.dribbbleUrl ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></span>` : ""}
      ${data.personal?.stackoverflowUrl ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></span>` : ""}
      ${data.personal?.mediumUrl ? `<span class="contact-item" data-section="personal">${icons.link}<a href="${data.personal.mediumUrl}" target="_blank">Medium</a></span>` : ""}
      
      ${(() => {
        const personalDetails = [];
        if (data.personal?.fathersName) personalDetails.push(`<span class="contact-item" data-section="personal">Father: ${data.personal.fathersName}</span>`);
        if (data.personal?.dob) personalDetails.push(`<span class="contact-item" data-section="personal">DOB: ${data.personal.dob}</span>`);
        if (data.personal?.gender) personalDetails.push(`<span class="contact-item" data-section="personal">Gender: ${data.personal.gender}</span>`);
        if (data.personal?.maritalStatus) personalDetails.push(`<span class="contact-item" data-section="personal">Marital: ${data.personal.maritalStatus}</span>`);
        if (data.personal?.nationality) personalDetails.push(`<span class="contact-item" data-section="personal">Nationality: ${data.personal.nationality}</span>`);
        if (data.personal?.passportNo) personalDetails.push(`<span class="contact-item" data-section="personal">Passport: ${data.personal.passportNo}</span>`);
        
        return personalDetails.join('');
      })()}
    </div>
  </div>

    <div class="content-wrapper">
      <!-- Professional Context -->
      ${nonEmptyProfessionalContext ? `
      <div class="section " data-section="professionalContext">
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
          ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<span class="skill-tag">Notice: ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</span>` : ''}
          ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<span class="skill-tag">Work Auth: ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</span>` : ''}
          ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<span class="skill-tag">Preferred: ${nonEmptyAvailabilityWorkAuth.preferredLocation}</span>` : ''}
        </div>
      </div>` : ''}

      <!-- Summary -->
      ${data.summary && data.summary.trim() ? `
      <div class="section" data-section="summary">
        <div class="section-title">Professional Summary</div>
        <p class="entry-content" data-section="summary">${data.summary}</p>
      </div>` : ""}

      <!-- Career Objective -->
      ${data.careerObjective && data.careerObjective.trim() ? `
      <div class="section" data-section="careerObjective">
        <div class="section-title">Career Objective</div>
        <p class="entry-content" data-section="careerObjective">${data.careerObjective}</p>
      </div>` : ""}

      <!-- Work Experience -->
      ${hasNonEmptyItems(data.experience) ? `
      <div class="section" data-section="experience">
        <div class="section-title">Work Experience</div>
        ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
          const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
          const subtitle = formatSubtitle([exp.company, exp.location, exp.domain]);
          
          return `
          <div class="entry" data-section="experience" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${exp.title || ""}</div>
              ${dateRange ? `<div class="entry-date">${dateRange}</div>` : ""}
            </div>
            ${subtitle ? `<div class="entry-subtitle">${subtitle}</div>` : ""}
            ${exp.description ? `<div class="entry-content">${exp.description}</div>` : ""}
            ${exp.achievements ? `<div class="entry-content" style="margin-top: 8px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ""}
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
            <div class="entry-header">
              <div class="entry-title">${item.title || ""}</div>
              ${dateRange ? `<div class="entry-date">${dateRange}</div>` : ""}
            </div>
            ${subtitle ? `<div class="entry-subtitle">${subtitle}</div>` : ""}
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Training Programs -->
      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="section" data-section="trainingPrograms">
        <div class="section-title">Training Programs</div>
        ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
          <div class="entry" data-section="trainingPrograms" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.name || ""}</div>
              ${item.completionDate ? `<div class="entry-date">${item.completionDate}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Education -->
      ${hasNonEmptyItems(data.education) ? `
      <div class="section" data-section="education">
        <div class="section-title">Education</div>
        ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
          <div class="entry" data-section="education" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">
                ${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}${edu.qualification ? ` (${edu.qualification})` : ""}
              </div>
              ${edu.graduationDate ? `<div class="entry-date">${edu.graduationDate}</div>` : ""}
            </div>
            
            ${edu.school ? `<div class="education-school">${edu.school}${edu.location ? `, ${edu.location}` : ""}</div>` : ""}
            ${edu.grade ? `<div class="education-field">Grade: ${edu.grade}</div>` : ""}
            
            ${edu.description ? `
              <div class="education-description">
                ${edu.description}
              </div>
            ` : ""}
            
            ${edu.achievements && edu.achievements.length > 0 ? `
              <div class="education-achievements">
                <h4>Academic Recognition</h4>
                <ul>
                  ${edu.achievements.filter((achievement: string) => achievement.trim()).map((achievement: string, achIndex: number) =>
                    `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`
                  ).join("")}
                </ul>
              </div>
            ` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Academic Projects -->
      ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="section" data-section="academicProjects">
        <div class="section-title">Academic Projects</div>
        ${nonEmptyAcademicProjects.map((item: any, index: number) => `
          <div class="entry" data-section="academicProjects" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.name || item.title || ""}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ""])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
            ${item.technologies ? `<div class="entry-content" style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ""}
            ${item.url ? `<div class="entry-content" style="margin-top: 5px;">${icons.link}<a href="${item.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Project</a></div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Client Projects -->
      ${nonEmptyClientProjects.length > 0 ? `
      <div class="section" data-section="clientProjects">
        <div class="section-title">Client Projects</div>
        ${nonEmptyClientProjects.map((item: any, index: number) => `
          <div class="entry" data-section="clientProjects" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.name || ""}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ""])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
            ${item.toolsTechnologies ? `<div class="entry-content" style="margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ""}
            ${item.projectUrl ? `<div class="entry-content" style="margin-top: 5px;">${icons.link}<a href="${item.projectUrl}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Project</a></div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Portfolio -->
      ${nonEmptyPortfolio.length > 0 ? `
      <div class="section" data-section="portfolio">
        <div class="section-title">Portfolio</div>
        ${nonEmptyPortfolio.map((item: any, index: number) => `
          <div class="entry" data-section="portfolio" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.name || ""}</div>
              ${(item.type || item.platform) ? `<div class="entry-date">${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ""])}</div>` : ""}
            </div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
            ${item.url ? `<div class="entry-content" style="margin-top: 5px;">${icons.link}<a href="${item.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Portfolio</a></div>` : ""}
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
            <div class="entry-header">
              <div class="entry-title">${project.name || ""}</div>
              ${dateRange ? `<div class="entry-date">${dateRange}</div>` : ""}
            </div>
            ${project.technologies ? `<div class="entry-subtitle">${project.technologies}</div>` : ""}
            ${project.description ? `<div class="entry-content">${project.description}</div>` : ""}
            ${project.url ? `<div class="entry-content" style="margin-top: 5px;">${icons.link}<a href="${project.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">${project.urlText || "View Project"}</a></div>` : ""}
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Leadership Positions -->
      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="section" data-section="leadershipPositions">
        <div class="section-title">Leadership & Positions</div>
        ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
          const dateRange = formatDateRange(item.startDate, item.endDate);
          
          return `
          <div class="entry" data-section="leadershipPositions" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.position || item.title || ""}</div>
              ${dateRange ? `<div class="entry-date">${dateRange}</div>` : ""}
            </div>
            <div class="entry-subtitle">${item.organization || ""}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Volunteering -->
      ${nonEmptyVolunteering.length > 0 ? `
      <div class="section" data-section="volunteering">
        <div class="section-title">Volunteering</div>
        ${nonEmptyVolunteering.map((item: any, index: number) => `
          <div class="entry" data-section="volunteering" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.role || ""}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.causeArea])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Military Service -->
      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="section" data-section="militaryService">
        <div class="section-title">Military Service</div>
        ${nonEmptyMilitaryService.map((item: any, index: number) => `
          <div class="entry" data-section="militaryService" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.rank ? item.rank : ""}${item.rank && item.branch ? " - " : ""}${item.branch || ""}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ""}
            </div>
            ${item.specialization ? `<div class="entry-subtitle">${item.specialization}</div>` : ""}
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Teaching Experience -->
      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="section" data-section="teachingExperience">
        <div class="section-title">Teaching Experience</div>
        ${nonEmptyTeachingExperience.map((item: any, index: number) => `
          <div class="entry" data-section="teachingExperience" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.subjectCourseTaught || item.title || ""}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.institution])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Mentorship Experience -->
      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="section" data-section="mentorshipExperience">
        <div class="section-title">Mentorship Experience</div>
        ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
          <div class="entry" data-section="mentorshipExperience" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.mentorshipArea || ""}</div>
              ${item.duration ? `<div class="entry-date">${item.duration}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ""])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Research Grants -->
      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="section" data-section="researchGrants">
        <div class="section-title">Research Grants</div>
        ${nonEmptyResearchGrants.map((item: any, index: number) => `
          <div class="entry" data-section="researchGrants" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.title || ""}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : ""])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Publications -->
      ${nonEmptyPublications.length > 0 ? `
      <div class="section" data-section="publications">
        <div class="section-title">Publications</div>
        ${nonEmptyPublications.map((item: any, index: number) => `
          <div class="entry" data-section="publications" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.title || ""}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
            ${item.authors ? `<div class="entry-content"><strong>Authors:</strong> ${item.authors}</div>` : ""}
            ${item.urlDoi ? `<div class="entry-content" style="margin-top: 5px;">${icons.link}<a href="${item.urlDoi}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Publication</a></div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Patents -->
      ${nonEmptyPatents.length > 0 ? `
      <div class="section" data-section="patents">
        <div class="section-title">Patents</div>
        ${nonEmptyPatents.map((item: any, index: number) => `
          <div class="entry" data-section="patents" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.title || ""}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : "", item.issuingAuthority])}</div>
            ${item.status ? `<div class="entry-content"><strong>Status:</strong> ${item.status}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Test Scores -->
      ${nonEmptyTestScores.length > 0 ? `
      <div class="section" data-section="testScores">
        <div class="section-title">Test Scores</div>
        ${nonEmptyTestScores.map((item: any, index: number) => `
          <div class="entry" data-section="testScores" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.testName || ""}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle">Score: ${item.score || ""}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ""}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Scholarships -->
      ${nonEmptyScholarships.length > 0 ? `
      <div class="section" data-section="scholarships">
        <div class="section-title">Scholarships</div>
        ${nonEmptyScholarships.map((item: any, index: number) => `
          <div class="entry" data-section="scholarships" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.name || ""}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Co-curricular Activities -->
      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="section" data-section="coCurricular">
        <div class="section-title">Co-curricular Activities</div>
        ${nonEmptyCoCurricular.map((item: any, index: number) => `
          <div class="entry" data-section="coCurricular" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.activity || ""}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ""])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Extracurricular Activities -->
      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="section" data-section="extracurricular">
        <div class="section-title">Extracurricular Activities</div>
        ${nonEmptyExtracurricular.map((item: any, index: number) => `
          <div class="entry" data-section="extracurricular" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.activity || ""}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role ? `Role: ${item.role}` : ""])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Skills -->
      ${nonEmptySkills.length > 0 ? `
      <div class="section" data-section="skills">
        <div class="section-title">Skills</div>
        <div class="skills-list" data-section="skills">
          ${nonEmptySkills.map((skill: any, index: number) =>
            `<span class="skill-tag" data-section="skills" data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</span>`
          ).join("")}
        </div>
      </div>` : ""}

      <!-- Tools & Technologies -->
      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="section" data-section="toolsTechnologies">
        <div class="section-title">Tools & Technologies</div>
        <div class="skills-list" data-section="toolsTechnologies">
          ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
            <span class="skill-tag" data-section="toolsTechnologies" data-index="${index}">
              ${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}
            </span>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Methodologies -->
      ${nonEmptyMethodologies.length > 0 ? `
      <div class="section" data-section="methodologies">
        <div class="section-title">Methodologies</div>
        <div class="skills-list" data-section="methodologies">
          ${nonEmptyMethodologies.map((item: any, index: number) => `
            <span class="skill-tag" data-section="methodologies" data-index="${index}">
              ${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}
            </span>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Industry Expertise -->
      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section" data-section="industryExpertise">
        <div class="section-title">Industry Expertise</div>
        <div class="skills-list" data-section="industryExpertise">
          ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
            <span class="skill-tag" data-section="industryExpertise" data-index="${index}">
              ${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}
            </span>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Languages -->
      ${nonEmptyLanguages.length > 0 ? `
      <div class="section" data-section="languages">
        <div class="section-title">Languages</div>
        <div class="skills-list" data-section="languages">
          ${nonEmptyLanguages.map((lang: any, index: number) =>
            `<span class="skill-tag" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</span>`
          ).join("")}
        </div>
      </div>` : ""}

      <!-- Hobbies -->
      ${nonEmptyHobbies.length > 0 ? `
      <div class="section" data-section="hobbies">
        <div class="section-title">Hobbies & Interests</div>
        <div class="skills-list" data-section="hobbies">
          ${nonEmptyHobbies.map((hobby: any, index: number) =>
            `<span class="skill-tag" data-section="hobbies" data-index="${index}">${hobby}</span>`
          ).join("")}
        </div>
      </div>` : ""}

      <!-- Social Links -->
      ${nonEmptySocialLinks.length > 0 ? `
      <div class="section" data-section="socialLinks">
        <div class="section-title">Social Links</div>
        <div class="tags-container" data-section="socialLinks">
          ${nonEmptySocialLinks.map((link: any, index: number) => `
            <a href="${link.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline; margin-right: 15px;" data-section="socialLinks" data-index="${index}">
              ${link.urlText || link.url.replace("https://", "").replace("http://", "")}
            </a>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Social Profiles -->
      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="section" data-section="socialProfiles">
        <div class="section-title">Social Profiles</div>
        <div class="tags-container" data-section="socialProfiles">
          ${nonEmptySocialProfiles.map((profile: any, index: number) => `
            <a href="${profile.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline; margin-right: 15px;" data-section="socialProfiles" data-index="${index}">
              ${profile.platform || "Profile"}
            </a>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- References -->
      ${nonEmptyReferences.length > 0 ? `
      <div class="section" data-section="references">
        <div class="section-title">References</div>
        ${nonEmptyReferences.map((ref: any, index: number) => `
          <div class="entry" data-section="references" data-index="${index}">
            <div class="entry-title">${ref.name || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
            ${ref.contactInformation ? `<div class="entry-content"><strong>Contact:</strong> ${ref.contactInformation}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Certifications -->
      ${nonEmptyCertifications.length > 0 ? `
      <div class="section" data-section="certifications">
        <div class="section-title">Certifications</div>
        ${nonEmptyCertifications.map((cert: any, index: number) => `
          <div class="entry" data-section="certifications" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${cert.name || ""}</div>
              ${cert.date ? `<div class="entry-date">${cert.date}</div>` : ""}
            </div>
            <div class="entry-subtitle">${cert.issuer || ""}</div>
            ${cert.description ? `<div class="entry-content">${cert.description}</div>` : ""}
            ${cert.url ? `<div class="entry-content" style="margin-top: 5px;">${icons.link}<a href="${cert.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Certificate</a></div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Key Achievements -->
      ${nonEmptyKeyAchievements.length > 0 ? `
      <div class="section" data-section="keyAchievements">
        <div class="section-title">Key Achievements</div>
        <div class="entry-content">
          <ul data-section="keyAchievements">
            ${nonEmptyKeyAchievements.map((achievement: string, index: number) =>
              `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`
            ).join("")}
          </ul>
        </div>
      </div>` : ""}

      <!-- Key Responsibilities -->
      ${nonEmptyResponsibilities.length > 0 ? `
      <div class="section" data-section="responsibilities">
        <div class="section-title">Key Responsibilities</div>
        <div class="entry-content">
          <ul data-section="responsibilities">
            ${nonEmptyResponsibilities.map((line: string, index: number) =>
              `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`
            ).join("")}
          </ul>
        </div>
      </div>` : ""}

      <!-- Tools -->
      ${nonEmptyTools.length > 0 ? `
      <div class="section" data-section="tools">
        <div class="section-title">Tools & Technologies</div>
        <div class="entry-content">
          <ul data-section="tools">
            ${nonEmptyTools.map((line: string, index: number) =>
              `<li data-section="tools" data-index="${index}">${line.trim()}</li>`
            ).join("")}
          </ul>
        </div>
      </div>` : ""}

      <!-- Awards -->
      ${nonEmptyAwards.length > 0 ? `
      <div class="section" data-section="awards">
        <div class="section-title">Awards</div>
        ${nonEmptyAwards.map((award: any, index: number) => `
          <div class="entry" data-section="awards" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${award.title || ""}</div>
              ${award.issueYear || award.year ? `<div class="entry-date">${award.issueYear || award.year}</div>` : ""}
            </div>
            <div class="entry-subtitle">${award.organization || ""}</div>
            ${award.description ? `<div class="entry-content">${award.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Speaking Engagements -->
      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="section" data-section="speakingEngagements">
        <div class="section-title">Speaking Engagements</div>
        ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
          <div class="entry" data-section="speakingEngagements" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.topic || ""}</div>
              ${item.date ? `<div class="entry-date">${item.date}</div>` : ""}
            </div>
            <div class="entry-subtitle">${item.eventName || ""}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Memberships -->
      ${nonEmptyMemberships.length > 0 ? `
      <div class="section" data-section="memberships">
        <div class="section-title">Memberships</div>
        ${nonEmptyMemberships.map((item: any, index: number) => `
          <div class="entry" data-section="memberships" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.membershipName || ""}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle">${item.organizationName || ""}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Workshops -->
      ${nonEmptyWorkshops.length > 0 ? `
      <div class="section" data-section="workshops">
        <div class="section-title">Workshops</div>
        ${nonEmptyWorkshops.map((item: any, index: number) => `
          <div class="entry" data-section="workshops" data-index="${index}">
            <div class="entry-header">
              <div class="entry-title">${item.programTitle || ""}</div>
              ${item.year ? `<div class="entry-date">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle">${item.conductedBy || ""}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Custom Sections -->
      ${nonEmptyCustomSections.length > 0 ? data.customSections
        .filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries))
        .map((section: any) => `
      <div class="section" data-section="customSections">
        <div class="section-title">${section.heading || "Custom Section"}</div>
        ${section.entries && section.entries.length > 0 ? section.entries
          .filter((entry: any) => entry.isVisible && (entry.title || entry.description))
          .map((entry: any, entryIndex: number) => `
          <div class="entry" data-section="customSections" data-index="${entryIndex}">
            <div class="entry-header">
              <div class="entry-title">${entry.title || ""}${entry.title && entry.organization ? " at " : ""}${entry.organization || ""}</div>
              ${entry.date ? `<div class="entry-date">${entry.date}</div>` : ""}
            </div>
            ${entry.description ? `<div class="entry-content">${entry.description}</div>` : ""}
          </div>
        `).join("") : '<div style="color: #666666; font-style: italic;">No entries in this section</div>'}
      </div>
      `).join("") : ""}
    </div>
  </div>
</body>
</html>`;
}