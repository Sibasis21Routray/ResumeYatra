export function buildGengarTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#7c3aed",
    secondary: "#666666",
    background: "#ffffff",
    headingFont: "Arial",
    bodyFont: "Arial",
  };
  const currentTheme = theme || defaultTheme;

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14; // Default 14px
  const userFontFamily =
    data.formatting?.fontFamily ||
    data.fontFamily ||
    "Space Grotesk, sans-serif";

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
  const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size

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
  <!-- Google Fonts disabled for PDF compatibility -->
 <style>
 * { margin: 0; padding: 0; box-sizing: border-box; }

 :root {
   --primary-color: ${currentTheme.primary};
   --secondary-color: ${currentTheme.secondary};
   --background-color: ${currentTheme.background};
   --heading-font: ${currentTheme.headingFont || "Arial"};
   --body-font: ${currentTheme.bodyFont || "Arial"};
 }

 body {
   font-family: ${userFontFamily};
   font-size: ${baseFontSize}px;
   color: var(--primary-color);
   background: var(--background-color);
   line-height: 1.5;
 }

  .container {
    max-width: 900px;
    margin: 24px auto;
    padding: 40px 48px;
    background: #ffffff;
  }


  /* ===== HEADER (FIXED) ===== */
.header {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  padding-bottom: 16px;
  margin-bottom: 28px;


  border-bottom: 1.5px solid var(--primary-color);
}


.photo-placeholder {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  line-height: 1.3;
  overflow: hidden;
}

.photo-placeholder img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.header-content {
  flex: 1;
}


.name {
  font-size: ${Math.round(baseFontSize * 2.3)}px;
  font-weight: 800;
  color: #05356a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}


.contact {
  display: block;
  font-size: ${Math.round(baseFontSize * 0.95)}px;
  color: #374151;
  line-height: 1.6;
}

.contact-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 4px;
}

.contact-row:last-child {
  margin-bottom: 0;
}

.contact-item {
  display: flex;
  align-items: center;
}



.contact a {
  color: var(--primary-color);
  text-decoration: none;
}


  /* ===== CONTENT ===== */
  .content-wrapper {
    padding: 0;
  }

  .section {
    margin-bottom: 26px;
  }



.section-title {
    font-size: ${Math.round(baseFontSize * 1)}px;
    font-weight: 800;
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
    padding-bottom: 4px;
    border-bottom: 2px solid var(--primary-color);
  }

  /* ===== ENTRIES ===== */
  .entry {
    margin-bottom: 18px;
  }

  .entry-header {
    display: block;
    margin-bottom: 4px;
  }


  .entry-title {
    font-weight: 700;
    font-size: ${Math.round(baseFontSize * 1.05)}px;
    color: var(--primary-color);
  }

  .entry-date {
    font-size: ${Math.round(baseFontSize * 0.9)}px;
    color: #6b7280;
    margin-top: 2px;
  }

  .entry-subtitle {
    font-size: ${Math.round(baseFontSize * 0.95)}px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
  }

  .entry-content {
    font-size: ${baseFontSize}px;
    color: #374151;
  }

  .entry-content ul {
    margin-left: 18px;
  }

  .entry-content li {
    margin-bottom: 4px;
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
    color: #374151;
    margin-bottom: 4px;
  }

  .education-location {
    color: #6b7280;
    font-style: italic;
    margin-bottom: 6px;
  }

  .education-description {
    font-size: ${baseFontSize}px;
    color: #374151;
    line-height: 1.6;
    margin-top: 10px;
    padding: 12px;
    background: #f8fafc;
    border-left: 3px solid var(--primary-color);
    border-radius: 4px;
  }

  .education-description ul {
    margin: 8px 0 8px 18px;
    padding: 0;
    list-style-type: disc;
  }

  .education-description li {
    margin: 4px 0;
    color: #374151;
  }

  .education-description b {
    font-weight: 700;
    color: var(--primary-color);
  }

  .education-achievements {
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid #e5e7eb;
  }

  .education-achievements h4 {
    font-size: ${Math.round(baseFontSize * 0.9)}px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .education-achievements ul {
    margin: 0;
    padding-left: 0;
    list-style: none;
  }

  .education-achievements li {
    position: relative;
    padding-left: 18px;
    margin-bottom: 6px;
    color: #374151;
    font-size: ${baseFontSize}px;
  }

  .education-achievements li:before {
    content: "▸";
    color: var(--primary-color);
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  /* Metrics Grid for Professional Context */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
  }

  .metric-item {
    text-align: center;
  }

  .metric-value {
    font-size: ${Math.round(baseFontSize * 1.3)}px;
    font-weight: 700;
    color: var(--primary-color);
    line-height: 1.2;
  }

  .metric-label {
    font-size: ${Math.round(baseFontSize * 0.8)}px;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
  }

  /* ===== SUMMARY ===== */
  .summary-text {
    font-size: ${baseFontSize}px;
    color: #374151;
  }

  /* ===== SKILLS ===== */
  .skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .skill-badge {
    display: inline-block;
    padding: 4px 12px;
    background: #f3f4f6;
    border-radius: 20px;
    font-size: ${baseFontSize}px;
    color: #374151;
    border: 1px solid #e5e7eb;
  }

  /* ===== PRINT ===== */
  @media print {
    .container {
      margin: 0;
      padding: 32px;
    }
  }
</style>

</head>
<body>
  <div class="container">

    <div class="header" data-section="personal">

      <div class="photo-placeholder" data-section="personal">
        ${
          data.personal?.image
            ? `<img src="${data.personal.image}" alt="Profile Photo">`
            : "Photo"
        }
      </div>
      <div class="header-content" data-section="personal">
        <div class="name">${
          data.personal?.name && data.personal?.name !== "undefined"
            ? data.personal.name
            : "Your Name"
        }${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</div>
        ${
          data.personal?.role
            ? `<div style="font-size: 18px; margin-bottom: 15px; font-weight: 600;">${data.personal.role}</div>`
            : ""
        }

        <div class="contact">

          <!-- Row 1: Email & Phones -->
          <div class="contact-row" data-section="contact">
            ${data.personal?.email ? `<div class="contact-item" data-section="contact">✉️ ${data.personal.email}</div>` : ""}
            ${data.personal?.phone ? `<div class="contact-item" data-section="contact">📞 ${data.personal.phone}</div>` : ""}
            ${data.personal?.alternatePhone ? `<div class="contact-item" data-section="contact">📞 ${data.personal.alternatePhone}</div>` : ""}
          </div>
          
          <!-- Row 2: Location -->
          ${(() => {
            const addressParts = [
              data.personal?.fullAddress,
              data.personal?.location,
              data.personal?.country,
              data.personal?.pinCode
            ].filter(Boolean);
            return addressParts.length > 0 ? `
            <div class="contact-row" data-section="contact">
              <div class="contact-item" data-section="contact">📍 ${addressParts.join(", ")}</div>
            </div>
            ` : "";
          })()}
          
          <!-- Row 3: Social Links -->
          ${(() => {
            const socialLinks = [];
            if (data.personal?.linkedinUrl) socialLinks.push(`<div class="contact-item" data-section="contact"><a href="${data.personal.linkedinUrl}" target="_blank">🔗 LinkedIn</a></div>`);
            if (data.personal?.githubUrl) socialLinks.push(`<div class="contact-item" data-section="contact"><a href="${data.personal.githubUrl}" target="_blank">🐙 GitHub</a></div>`);
            if (data.personal?.portfolioUrl) socialLinks.push(`<div class="contact-item" data-section="contact"><a href="${data.personal.portfolioUrl}" target="_blank">💼 Portfolio</a></div>`);
            if (data.personal?.website) socialLinks.push(`<div class="contact-item" data-section="contact"><a href="${data.personal.website}" target="_blank">🌐 Website</a></div>`);
            if (data.personal?.twitterUrl) socialLinks.push(`<div class="contact-item" data-section="contact"><a href="${data.personal.twitterUrl}" target="_blank">🐦 Twitter</a></div>`);
            if (data.personal?.facebookUrl) socialLinks.push(`<div class="contact-item" data-section="contact"><a href="${data.personal.facebookUrl}" target="_blank">📘 Facebook</a></div>`);
            if (data.personal?.instagramUrl) socialLinks.push(`<div class="contact-item" data-section="contact"><a href="${data.personal.instagramUrl}" target="_blank">📷 Instagram</a></div>`);
            if (data.personal?.behanceUrl) socialLinks.push(`<div class="contact-item" data-section="contact"><a href="${data.personal.behanceUrl}" target="_blank">🎨 Behance</a></div>`);
            if (data.personal?.dribbbleUrl) socialLinks.push(`<div class="contact-item" data-section="contact"><a href="${data.personal.dribbbleUrl}" target="_blank">🏀 Dribbble</a></div>`);
            if (data.personal?.stackoverflowUrl) socialLinks.push(`<div class="contact-item" data-section="contact"><a href="${data.personal.stackoverflowUrl}" target="_blank">📚 Stack Overflow</a></div>`);
            if (data.personal?.mediumUrl) socialLinks.push(`<div class="contact-item" data-section="contact"><a href="${data.personal.mediumUrl}" target="_blank">📝 Medium</a></div>`);
            
            return socialLinks.length > 0 ? `
            <div class="contact-row" data-section="contact">
              ${socialLinks.join('')}
            </div>
            ` : "";
          })()}

          <!-- Row 4: Personal Details (inline) -->
          ${(() => {
            const inlineItems = [];
            if (data.personal?.personalInfoDisplay === "inline") {
              if (data.personal?.fathersName) inlineItems.push(`<div class="contact-item" data-section="contact">👨 Father: ${data.personal.fathersName}</div>`);
              if (data.personal?.dob) inlineItems.push(`<div class="contact-item" data-section="contact">📅 DOB: ${data.personal.dob}</div>`);
              if (data.personal?.gender) inlineItems.push(`<div class="contact-item" data-section="contact">⚥ Gender: ${data.personal.gender}</div>`);
              if (data.personal?.maritalStatus) inlineItems.push(`<div class="contact-item" data-section="contact">💍 Marital: ${data.personal.maritalStatus}</div>`);
              if (data.personal?.nationality) inlineItems.push(`<div class="contact-item" data-section="contact">🌍 Nationality: ${data.personal.nationality}</div>`);
            }
            return inlineItems.length > 0 ? `
            <div class="contact-row" data-section="contact">
              ${inlineItems.join('')}
            </div>
            ` : "";
          })()}
        </div>
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
    </div>
    ` : ''}

    <!-- Availability & Work Auth -->
    ${nonEmptyAvailabilityWorkAuth ? `
    <div class="section" data-section="availabilityWorkAuth">
      <div class="section-title">Availability</div>
      <div class="skills">
        ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod ? `<span class="skill-badge">📅 Notice: ${nonEmptyAvailabilityWorkAuth.availabilityNoticePeriod}</span>` : ''}
        ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus ? `<span class="skill-badge">🪪 Work Auth: ${nonEmptyAvailabilityWorkAuth.workAuthorizationStatus}</span>` : ''}
        ${nonEmptyAvailabilityWorkAuth.preferredLocation ? `<span class="skill-badge">📍 Preferred: ${nonEmptyAvailabilityWorkAuth.preferredLocation}</span>` : ''}
      </div>
    </div>
    ` : ''}

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
      <div class="contact" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 30px; font-size: ${baseFontSize}px;">
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
        <div class="section-title" data-section="summary">About Me</div>
        <p class="summary-text" data-section="summary">${data.summary}</p>
      </div>` : ""}

      <!-- Career Objective -->
      ${data.careerObjective && data.careerObjective.trim() ? `
      <div class="section" data-section="careerObjective">
        <div class="section-title" data-section="careerObjective">Career Objective</div>
        <p class="summary-text" data-section="careerObjective">${data.careerObjective}</p>
      </div>` : ""}

      <!-- Work Experience -->
      ${hasNonEmptyItems(data.experience) ? `
      <div class="section" data-section="experience">
        <div class="section-title" data-section="experience">Experience</div>
        ${getNonEmptyArray(data.experience).map((exp: any, index: number) => {
          const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
          const metaParts = formatSubtitle([exp.company, exp.location, exp.domain]);
          
          return `
          <div class="entry" data-section="experience" data-index="${index}">
            <div class="entry-header" data-section="experience" data-index="${index}">
              <div class="entry-title" data-section="experience" data-index="${index}">${exp.title || ""}</div>
              ${dateRange ? `<div class="entry-date" data-section="experience" data-index="${index}">${dateRange}</div>` : ""}
            </div>
            ${metaParts ? `<div class="entry-subtitle" data-section="experience" data-index="${index}">${metaParts}</div>` : ""}
            ${exp.description ? `<div class="entry-content" data-section="experience" data-index="${index}">${exp.description}</div>` : ""}
            ${exp.achievements ? `<div class="entry-content" style="margin-top: 8px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ""}
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Internships -->
      ${nonEmptyInternships.length > 0 ? `
      <div class="section" data-section="internships">
        <div class="section-title" data-section="internships">Internships</div>
        ${nonEmptyInternships.map((item: any, index: number) => {
          const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
          const metaParts = formatSubtitle([item.company, item.location]);
          
          return `
          <div class="entry" data-section="internships" data-index="${index}">
            <div class="entry-header" data-section="internships" data-index="${index}">
              <div class="entry-title" data-section="internships" data-index="${index}">${item.title || ""}</div>
              ${dateRange ? `<div class="entry-date" data-section="internships" data-index="${index}">${dateRange}</div>` : ""}
            </div>
            ${metaParts ? `<div class="entry-subtitle" data-section="internships" data-index="${index}">${metaParts}</div>` : ""}
            ${item.description ? `<div class="entry-content" data-section="internships" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Training Programs -->
      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="section" data-section="trainingPrograms">
        <div class="section-title" data-section="trainingPrograms">Training Programs</div>
        ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
          <div class="entry" data-section="trainingPrograms" data-index="${index}">
            <div class="entry-header" data-section="trainingPrograms" data-index="${index}">
              <div class="entry-title" data-section="trainingPrograms" data-index="${index}">${item.name || ""}</div>
              ${item.completionDate ? `<div class="entry-date" data-section="trainingPrograms" data-index="${index}">${item.completionDate}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="trainingPrograms" data-index="${index}">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
            ${item.description ? `<div class="entry-content" data-section="trainingPrograms" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Education -->
      ${hasNonEmptyItems(data.education) ? `
      <div class="section" data-section="education">
        <div class="section-title" data-section="education">Education</div>
        ${getNonEmptyArray(data.education).map((edu: any, index: number) => `
          <div class="entry" data-section="education" data-index="${index}">
            <div class="entry-header" data-section="education" data-index="${index}">
              <div class="entry-title" data-section="education" data-index="${index}">
                ${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}${edu.qualification ? ` (${edu.qualification})` : ""}
              </div>
              ${edu.graduationDate ? `<div class="entry-date" data-section="education" data-index="${index}">${edu.graduationDate}</div>` : ""}
            </div>
            
            ${edu.school ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}${edu.location ? `, ${edu.location}` : ""}</div>` : ""}
            ${edu.grade ? `<div class="education-field" data-section="education" data-index="${index}"> ${edu.grade}</div>` : ""}
            
            ${edu.description ? `
              <div class="education-description" data-section="education" data-index="${index}">
                ${edu.description}
              </div>
            ` : ""}
            
            ${edu.achievements && edu.achievements.length > 0 ? `
              <div class="education-achievements" data-section="education" data-index="${index}">
                <h4>Academic Achievements</h4>
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
        <div class="section-title" data-section="academicProjects">Academic Projects</div>
        ${nonEmptyAcademicProjects.map((item: any, index: number) => `
          <div class="entry" data-section="academicProjects" data-index="${index}">
            <div class="entry-header" data-section="academicProjects" data-index="${index}">
              <div class="entry-title" data-section="academicProjects" data-index="${index}">${item.name || item.title || ""}</div>
              ${item.duration ? `<div class="entry-date" data-section="academicProjects" data-index="${index}">${item.duration}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="academicProjects" data-index="${index}">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ""])}</div>
            ${item.description ? `<div class="entry-content" data-section="academicProjects" data-index="${index}">${item.description}</div>` : ""}
            ${item.technologies ? `<div class="entry-content"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ""}
            ${item.url ? `<div class="entry-content" style="margin-top: 8px;"><a href="${item.url}" target="_blank" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">View Project →</a></div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Client Projects -->
      ${nonEmptyClientProjects.length > 0 ? `
      <div class="section" data-section="clientProjects">
        <div class="section-title" data-section="clientProjects">Client Projects</div>
        ${nonEmptyClientProjects.map((item: any, index: number) => `
          <div class="entry" data-section="clientProjects" data-index="${index}">
            <div class="entry-header" data-section="clientProjects" data-index="${index}">
              <div class="entry-title" data-section="clientProjects" data-index="${index}">${item.name || ""}</div>
              ${item.duration ? `<div class="entry-date" data-section="clientProjects" data-index="${index}">${item.duration}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="clientProjects" data-index="${index}">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ""])}</div>
            ${item.description ? `<div class="entry-content" data-section="clientProjects" data-index="${index}">${item.description}</div>` : ""}
            ${item.toolsTechnologies ? `<div class="entry-content"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ""}
            ${item.projectUrl ? `<div class="entry-content" style="margin-top: 8px;"><a href="${item.projectUrl}" target="_blank" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">View Project →</a></div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Portfolio -->
      ${nonEmptyPortfolio.length > 0 ? `
      <div class="section" data-section="portfolio">
        <div class="section-title" data-section="portfolio">Portfolio</div>
        ${nonEmptyPortfolio.map((item: any, index: number) => `
          <div class="entry" data-section="portfolio" data-index="${index}">
            <div class="entry-header" data-section="portfolio" data-index="${index}">
              <div class="entry-title" data-section="portfolio" data-index="${index}">${item.name || ""}</div>
              ${item.type || item.platform ? `<div class="entry-date">${formatSubtitle([item.type, item.platform ? `on ${item.platform}` : ""])}</div>` : ""}
            </div>
            ${item.description ? `<div class="entry-content" data-section="portfolio" data-index="${index}">${item.description}</div>` : ""}
            ${item.url ? `<div class="entry-content" style="margin-top: 8px;"><a href="${item.url}" target="_blank" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">View Portfolio →</a></div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Projects -->
      ${nonEmptyProjects.length > 0 ? `
      <div class="section" data-section="projects">
        <div class="section-title" data-section="projects">Projects</div>
        ${nonEmptyProjects.map((project: any, index: number) => {
          const dateRange = formatDateRange(project.startDate, project.endDate);
          
          return `
          <div class="entry" data-section="projects" data-index="${index}">
            <div class="entry-title" data-section="projects" data-index="${index}">${project.name || ""}</div>
            ${dateRange ? `<div class="entry-date" style="margin-bottom: 5px;">${dateRange}</div>` : ""}
            ${project.technologies ? `<div class="entry-subtitle" data-section="projects" data-index="${index}">${project.technologies}</div>` : ""}
            ${project.description ? `<div class="entry-content" data-section="projects" data-index="${index}">${project.description}</div>` : ""}
            ${project.url ? `<div class="entry-content" style="margin-top: 12px;"><a href="${project.url}" target="_blank" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">${project.urlText || "View Project →"}</a></div>` : ""}
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Leadership Positions -->
      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="section" data-section="leadershipPositions">
        <div class="section-title" data-section="leadershipPositions">Leadership & Positions</div>
        ${nonEmptyLeadershipPositions.map((item: any, index: number) => {
          const dateRange = formatDateRange(item.startDate, item.endDate);
          
          return `
          <div class="entry" data-section="leadershipPositions" data-index="${index}">
            <div class="entry-header" data-section="leadershipPositions" data-index="${index}">
              <div class="entry-title" data-section="leadershipPositions" data-index="${index}">${item.position || item.title || ""}</div>
              ${dateRange ? `<div class="entry-date" data-section="leadershipPositions" data-index="${index}">${dateRange}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="leadershipPositions" data-index="${index}">${item.organization || ""}</div>
            ${item.description ? `<div class="entry-content" data-section="leadershipPositions" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `}).join("")}
      </div>` : ""}

      <!-- Volunteering -->
      ${nonEmptyVolunteering.length > 0 ? `
      <div class="section" data-section="volunteering">
        <div class="section-title" data-section="volunteering">Volunteering</div>
        ${nonEmptyVolunteering.map((item: any, index: number) => `
          <div class="entry" data-section="volunteering" data-index="${index}">
            <div class="entry-header" data-section="volunteering" data-index="${index}">
              <div class="entry-title" data-section="volunteering" data-index="${index}">${item.role || ""}</div>
              ${item.duration ? `<div class="entry-date" data-section="volunteering" data-index="${index}">${item.duration}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="volunteering" data-index="${index}">${formatSubtitle([item.organization, item.causeArea])}</div>
            ${item.description ? `<div class="entry-content" data-section="volunteering" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Military Service -->
      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="section" data-section="militaryService">
        <div class="section-title" data-section="militaryService">Military Service</div>
        ${nonEmptyMilitaryService.map((item: any, index: number) => `
          <div class="entry" data-section="militaryService" data-index="${index}">
            <div class="entry-header" data-section="militaryService" data-index="${index}">
              <div class="entry-title" data-section="militaryService" data-index="${index}">${item.rank ? item.rank : ""}${item.rank && item.branch ? " - " : ""}${item.branch || ""}</div>
              ${item.duration ? `<div class="entry-date" data-section="militaryService" data-index="${index}">${item.duration}</div>` : ""}
            </div>
            ${item.specialization ? `<div class="entry-subtitle">${item.specialization}</div>` : ""}
            ${item.description ? `<div class="entry-content" data-section="militaryService" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Teaching Experience -->
      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="section" data-section="teachingExperience">
        <div class="section-title" data-section="teachingExperience">Teaching Experience</div>
        ${nonEmptyTeachingExperience.map((item: any, index: number) => `
          <div class="entry" data-section="teachingExperience" data-index="${index}">
            <div class="entry-header" data-section="teachingExperience" data-index="${index}">
              <div class="entry-title" data-section="teachingExperience" data-index="${index}">${item.subjectCourseTaught || item.title || ""}</div>
              ${item.duration ? `<div class="entry-date" data-section="teachingExperience" data-index="${index}">${item.duration}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="teachingExperience" data-index="${index}">${formatSubtitle([item.institution])}</div>
            ${item.description ? `<div class="entry-content" data-section="teachingExperience" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Mentorship Experience -->
      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="section" data-section="mentorshipExperience">
        <div class="section-title" data-section="mentorshipExperience">Mentorship Experience</div>
        ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
          <div class="entry" data-section="mentorshipExperience" data-index="${index}">
            <div class="entry-header" data-section="mentorshipExperience" data-index="${index}">
              <div class="entry-title" data-section="mentorshipExperience" data-index="${index}">${item.mentorshipArea || ""}</div>
              ${item.duration ? `<div class="entry-date" data-section="mentorshipExperience" data-index="${index}">${item.duration}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="mentorshipExperience" data-index="${index}">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ""])}</div>
            ${item.description ? `<div class="entry-content" data-section="mentorshipExperience" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Research Grants -->
      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="section" data-section="researchGrants">
        <div class="section-title" data-section="researchGrants">Research Grants</div>
        ${nonEmptyResearchGrants.map((item: any, index: number) => `
          <div class="entry" data-section="researchGrants" data-index="${index}">
            <div class="entry-header" data-section="researchGrants" data-index="${index}">
              <div class="entry-title" data-section="researchGrants" data-index="${index}">${item.title || ""}</div>
              ${item.year ? `<div class="entry-date" data-section="researchGrants" data-index="${index}">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="researchGrants" data-index="${index}">${formatSubtitle([item.agency, item.amount ? `Amount: ${item.amount}` : ""])}</div>
            ${item.description ? `<div class="entry-content" data-section="researchGrants" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Publications -->
      ${nonEmptyPublications.length > 0 ? `
      <div class="section" data-section="publications">
        <div class="section-title" data-section="publications">Publications</div>
        ${nonEmptyPublications.map((item: any, index: number) => `
          <div class="entry" data-section="publications" data-index="${index}">
            <div class="entry-header" data-section="publications" data-index="${index}">
              <div class="entry-title" data-section="publications" data-index="${index}">${item.title || ""}</div>
              ${item.year ? `<div class="entry-date" data-section="publications" data-index="${index}">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="publications" data-index="${index}">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
            ${item.authors ? `<div class="entry-content"><strong>Authors:</strong> ${item.authors}</div>` : ""}
            ${item.urlDoi ? `<div class="entry-content" style="margin-top: 8px;"><a href="${item.urlDoi}" target="_blank" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">View Publication →</a></div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Patents -->
      ${nonEmptyPatents.length > 0 ? `
      <div class="section" data-section="patents">
        <div class="section-title" data-section="patents">Patents</div>
        ${nonEmptyPatents.map((item: any, index: number) => `
          <div class="entry" data-section="patents" data-index="${index}">
            <div class="entry-header" data-section="patents" data-index="${index}">
              <div class="entry-title" data-section="patents" data-index="${index}">${item.title || ""}</div>
              ${item.year ? `<div class="entry-date" data-section="patents" data-index="${index}">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="patents" data-index="${index}">${formatSubtitle([item.patentNumber ? `Patent #: ${item.patentNumber}` : "", item.issuingAuthority])}</div>
            ${item.status ? `<div class="entry-content"><strong>Status:</strong> ${item.status}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Test Scores -->
      ${nonEmptyTestScores.length > 0 ? `
      <div class="section" data-section="testScores">
        <div class="section-title" data-section="testScores">Test Scores</div>
        ${nonEmptyTestScores.map((item: any, index: number) => `
          <div class="entry" data-section="testScores" data-index="${index}">
            <div class="entry-header" data-section="testScores" data-index="${index}">
              <div class="entry-title" data-section="testScores" data-index="${index}">${item.testName || ""}</div>
              ${item.year ? `<div class="entry-date" data-section="testScores" data-index="${index}">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="testScores" data-index="${index}">Score: ${item.score || ""}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ""}</div>
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Scholarships -->
      ${nonEmptyScholarships.length > 0 ? `
      <div class="section" data-section="scholarships">
        <div class="section-title" data-section="scholarships">Scholarships</div>
        ${nonEmptyScholarships.map((item: any, index: number) => `
          <div class="entry" data-section="scholarships" data-index="${index}">
            <div class="entry-header" data-section="scholarships" data-index="${index}">
              <div class="entry-title" data-section="scholarships" data-index="${index}">${item.name || ""}</div>
              ${item.year ? `<div class="entry-date" data-section="scholarships" data-index="${index}">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="scholarships" data-index="${index}">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
            ${item.description ? `<div class="entry-content" data-section="scholarships" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Awards -->
      ${nonEmptyAwards.length > 0 ? `
      <div class="section" data-section="awards">
        <div class="section-title" data-section="awards">Awards</div>
        ${nonEmptyAwards.map((item: any, index: number) => `
          <div class="entry" data-section="awards" data-index="${index}">
            <div class="entry-header" data-section="awards" data-index="${index}">
              <div class="entry-title" data-section="awards" data-index="${index}">${item.title || ""}</div>
              ${item.issueYear || item.year ? `<div class="entry-date" data-section="awards" data-index="${index}">${item.issueYear || item.year}</div>` : ""}
            </div>
            ${item.organization ? `<div class="entry-subtitle" data-section="awards" data-index="${index}">${item.organization}</div>` : ""}
            ${item.description ? `<div class="entry-content" data-section="awards" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Speaking Engagements -->
      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="section" data-section="speakingEngagements">
        <div class="section-title" data-section="speakingEngagements">Speaking Engagements</div>
        ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
          <div class="entry" data-section="speakingEngagements" data-index="${index}">
            <div class="entry-header" data-section="speakingEngagements" data-index="${index}">
              <div class="entry-title" data-section="speakingEngagements" data-index="${index}">${item.topic || ""}</div>
              ${item.date ? `<div class="entry-date" data-section="speakingEngagements" data-index="${index}">${item.date}</div>` : ""}
            </div>
            ${item.eventName ? `<div class="entry-subtitle" data-section="speakingEngagements" data-index="${index}">${item.eventName}</div>` : ""}
            ${item.description ? `<div class="entry-content" data-section="speakingEngagements" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Memberships -->
      ${nonEmptyMemberships.length > 0 ? `
      <div class="section" data-section="memberships">
        <div class="section-title" data-section="memberships">Memberships</div>
        ${nonEmptyMemberships.map((item: any, index: number) => `
          <div class="entry" data-section="memberships" data-index="${index}">
            <div class="entry-header" data-section="memberships" data-index="${index}">
              <div class="entry-title" data-section="memberships" data-index="${index}">${item.membershipName || ""}</div>
              ${item.year ? `<div class="entry-date" data-section="memberships" data-index="${index}">${item.year}</div>` : ""}
            </div>
            ${item.organizationName ? `<div class="entry-subtitle" data-section="memberships" data-index="${index}">${item.organizationName}</div>` : ""}
            ${item.description ? `<div class="entry-content" data-section="memberships" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Workshops -->
      ${nonEmptyWorkshops.length > 0 ? `
      <div class="section" data-section="workshops">
        <div class="section-title" data-section="workshops">Workshops</div>
        ${nonEmptyWorkshops.map((item: any, index: number) => `
          <div class="entry" data-section="workshops" data-index="${index}">
            <div class="entry-header" data-section="workshops" data-index="${index}">
              <div class="entry-title" data-section="workshops" data-index="${index}">${item.programTitle || ""}</div>
              ${item.year ? `<div class="entry-date" data-section="workshops" data-index="${index}">${item.year}</div>` : ""}
            </div>
            ${item.conductedBy ? `<div class="entry-subtitle" data-section="workshops" data-index="${index}">${item.conductedBy}</div>` : ""}
            ${item.description ? `<div class="entry-content" data-section="workshops" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Co-curricular Activities -->
      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="section" data-section="coCurricular">
        <div class="section-title" data-section="coCurricular">Co-curricular Activities</div>
        ${nonEmptyCoCurricular.map((item: any, index: number) => `
          <div class="entry" data-section="coCurricular" data-index="${index}">
            <div class="entry-header" data-section="coCurricular" data-index="${index}">
              <div class="entry-title" data-section="coCurricular" data-index="${index}">${item.activity || ""}</div>
              ${item.year ? `<div class="entry-date" data-section="coCurricular" data-index="${index}">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="coCurricular" data-index="${index}">${formatSubtitle([item.organization, item.role])}</div>
            ${item.description ? `<div class="entry-content" data-section="coCurricular" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Extracurricular Activities -->
      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="section" data-section="extracurricular">
        <div class="section-title" data-section="extracurricular">Extracurricular Activities</div>
        ${nonEmptyExtracurricular.map((item: any, index: number) => `
          <div class="entry" data-section="extracurricular" data-index="${index}">
            <div class="entry-header" data-section="extracurricular" data-index="${index}">
              <div class="entry-title" data-section="extracurricular" data-index="${index}">${item.activity || ""}</div>
              ${item.year ? `<div class="entry-date" data-section="extracurricular" data-index="${index}">${item.year}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="extracurricular" data-index="${index}">${formatSubtitle([item.organization, item.role])}</div>
            ${item.description ? `<div class="entry-content" data-section="extracurricular" data-index="${index}">${item.description}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Skills -->
      ${nonEmptySkills.length > 0 ? `
      <div class="section" data-section="skills">
        <div class="section-title" data-section="skills">Skills</div>
        <div class="skills" data-section="skills">
          ${nonEmptySkills.map((skill: any, index: number) => `
            <span class="skill-badge" data-section="skills" data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</span>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Tools & Technologies -->
      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="section" data-section="toolsTechnologies">
        <div class="section-title" data-section="toolsTechnologies">Tools & Technologies</div>
        <div class="skills" data-section="toolsTechnologies">
          ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
            <span class="skill-badge" data-section="toolsTechnologies" data-index="${index}">
              ${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}
            </span>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Methodologies -->
      ${nonEmptyMethodologies.length > 0 ? `
      <div class="section" data-section="methodologies">
        <div class="section-title" data-section="methodologies">Methodologies</div>
        <div class="skills" data-section="methodologies">
          ${nonEmptyMethodologies.map((item: any, index: number) => `
            <span class="skill-badge" data-section="methodologies" data-index="${index}">
              ${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}
            </span>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Industry Expertise -->
      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section" data-section="industryExpertise">
        <div class="section-title" data-section="industryExpertise">Industry Expertise</div>
        <div class="skills" data-section="industryExpertise">
          ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
            <span class="skill-badge" data-section="industryExpertise" data-index="${index}">
              ${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}
            </span>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Languages -->
      ${nonEmptyLanguages.length > 0 ? `
      <div class="section" data-section="languages">
        <div class="section-title" data-section="languages">Languages</div>
        <div class="skills" data-section="languages">
          ${nonEmptyLanguages.map((lang: any, index: number) => `
            <span class="skill-badge" data-section="languages" data-index="${index}">
              ${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}
            </span>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Hobbies -->
      ${nonEmptyHobbies.length > 0 ? `
      <div class="section" data-section="hobbies">
        <div class="section-title" data-section="hobbies">Hobbies & Interests</div>
        <div class="skills" data-section="hobbies">
          ${nonEmptyHobbies.map((hobby: any, index: number) => `
            <span class="skill-badge" data-section="hobbies" data-index="${index}">${hobby}</span>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Social Links -->
      ${nonEmptySocialLinks.length > 0 ? `
      <div class="section" data-section="socialLinks">
        <div class="section-title" data-section="socialLinks">Social Links</div>
        <div class="skills" data-section="socialLinks">
          ${nonEmptySocialLinks.map((link: any, index: number) => `
            <a href="${link.url}" target="_blank" class="skill-badge" style="background: #f3f4f6; color: var(--primary-color); text-decoration: none; display: inline-block;" data-section="socialLinks" data-index="${index}">
              ${link.urlText || link.url.replace("https://", "").replace("http://", "")}
            </a>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- Social Profiles -->
      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="section" data-section="socialProfiles">
        <div class="section-title" data-section="socialProfiles">Social Profiles</div>
        <div class="skills" data-section="socialProfiles">
          ${nonEmptySocialProfiles.map((profile: any, index: number) => `
            <a href="${profile.url}" target="_blank" class="skill-badge" style="background: #f3f4f6; color: var(--primary-color); text-decoration: none; display: inline-block;" data-section="socialProfiles" data-index="${index}">
              ${profile.platform || "Profile"}
            </a>
          `).join("")}
        </div>
      </div>` : ""}

      <!-- References -->
      ${nonEmptyReferences.length > 0 ? `
      <div class="section" data-section="references">
        <div class="section-title" data-section="references">References</div>
        ${nonEmptyReferences.map((ref: any, index: number) => `
          <div class="entry" data-section="references" data-index="${index}">
            <div class="entry-title" data-section="references" data-index="${index}">${ref.name || ""}</div>
            <div class="entry-subtitle" data-section="references" data-index="${index}">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
            ${ref.contactInformation ? `<div class="entry-content"><strong>Contact:</strong> ${ref.contactInformation}</div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Certifications -->
      ${nonEmptyCertifications.length > 0 ? `
      <div class="section" data-section="certifications">
        <div class="section-title" data-section="certifications">Certifications</div>
        ${nonEmptyCertifications.map((cert: any, index: number) => `
          <div class="entry" data-section="certifications" data-index="${index}">
            <div class="entry-header" data-section="certifications" data-index="${index}">
              <div class="entry-title" data-section="certifications" data-index="${index}">${cert.name || ""}</div>
              ${cert.date ? `<div class="entry-date" data-section="certifications" data-index="${index}">${cert.date}</div>` : ""}
            </div>
            <div class="entry-subtitle" data-section="certifications" data-index="${index}">${cert.issuer || ""}</div>
            ${cert.description ? `<div class="entry-content">${cert.description}</div>` : ""}
            ${cert.url ? `<div class="entry-content" style="margin-top: 12px;"><a href="${cert.url}" target="_blank" style="color: var(--primary-color); font-weight: 600; text-decoration: none;">View Certificate →</a></div>` : ""}
          </div>
        `).join("")}
      </div>` : ""}

      <!-- Key Achievements -->
      ${nonEmptyKeyAchievements.length > 0 ? `
      <div class="section" data-section="keyAchievements">
        <div class="section-title" data-section="keyAchievements">Key Achievements</div>
        <div class="entry-content" data-section="keyAchievements">
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
        <div class="section-title" data-section="responsibilities">Key Responsibilities</div>
        <div class="entry-content" data-section="responsibilities">
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
        <div class="section-title" data-section="tools">Tools & Technologies</div>
        <div class="entry-content" data-section="tools">
          <ul data-section="tools">
            ${nonEmptyTools.map((line: string, index: number) =>
              `<li data-section="tools" data-index="${index}">${line.trim()}</li>`
            ).join("")}
          </ul>
        </div>
      </div>` : ""}

      <!-- Custom Sections -->
      ${nonEmptyCustomSections.length > 0 ? data.customSections
        .filter((section: any) => section.isVisible && section.entries && hasNonEmptyItems(section.entries))
        .map((section: any) => `
        <div class="section" data-section="customSections">
          <div class="section-title" data-section="customSections">${section.heading || "Custom Section"}</div>
          ${section.entries && section.entries.length > 0 ? section.entries
            .filter((entry: any) => entry.isVisible && (entry.title || entry.description))
            .map((entry: any, entryIndex: number) => `
            <div class="entry" data-section="customSections" data-index="${entryIndex}">
              <div class="entry-header" data-section="customSections" data-index="${entryIndex}">
                ${entry.title || entry.organization ? `<div class="entry-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ""}${entry.title && entry.organization ? " at " : ""}${entry.organization || ""}</div>` : ""}
                ${entry.date ? `<div class="entry-date" data-section="customSections" data-index="${entryIndex}">${entry.date}</div>` : ""}
              </div>
              ${entry.description ? `<div class="entry-content" data-section="customSections" data-index="${entryIndex}">${entry.description}</div>` : ""}
            </div>
          `).join("") : '<div style="color: #6b7280; font-style: italic;">No entries in this section</div>'}
        </div>
      `).join("") : ""}
    </div>
  </div>
</body>
</html>`;
}