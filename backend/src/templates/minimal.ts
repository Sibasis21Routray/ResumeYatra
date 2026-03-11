export function buildMinimalTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#2563eb",
    secondary: "#64748b",
    background: "#ffffff",
    headingFont: "Inter",
    bodyFont: "Inter",
  };

  const currentTheme = theme || defaultTheme;
  const typography = theme?.typography || {
    fontSize: "medium",
    alignment: "left",
    fontWeight: "normal",
  };

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 11; // Default 11px
  const userFontFamily =
    data.formatting?.fontFamily || data.fontFamily || "Arial, sans-serif";

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.5); // 2.5x base size
  const subheadingFontSize = Math.round(userFontSize * 1.2); // 1.2x base size

  // Typography mappings
  const fontSizeMap = {
    small: { base: "10px", heading: "28px", subheading: "13px" },
    medium: { base: "11px", heading: "30px", subheading: "14px" },
    large: { base: "12px", heading: "34px", subheading: "15px" },
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
    fontWeightMap[typography.fontWeight as keyof typeof fontWeightMap] || "400";

  // Helper function to check if an array has meaningful content
  const hasContent = (arr: any): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    if (arr.length === 0) return false;
    return arr.some((item: any) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(
          (val: any) => typeof val === "string" && val.trim().length > 0
        );
      }
      return false;
    });
  };

  // Helper to safely get non-empty array
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

  // Helper to safely format subtitle with multiple fields
  const formatSubtitle = (parts: (string | undefined | null)[]): string => {
    const filtered = parts.filter(part => part && typeof part === "string" && part.trim().length > 0);
    return filtered.join(" • ");
  };

  // Helper to safely format date range
  const formatDateRange = (startDate?: string, endDate?: string): string => {
    if (!startDate && !endDate) return "";
    if (startDate && !endDate) return startDate;
    if (!startDate && endDate) return endDate;
    return `${startDate} - ${endDate}`;
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
  const nonEmptyKeyAchievements = getNonEmptyArray(data.keyAchievements);
  const nonEmptyResponsibilities = getNonEmptyArray(
    Array.isArray(data.responsibilities)
      ? data.responsibilities
      : (data.responsibilities || "").split("\n")
  );
  const nonEmptyTools = getNonEmptyArray(
    Array.isArray(data.tools) ? data.tools : (data.tools || "").split("\n")
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --background-color: ${currentTheme.background};
      --text-color: #1e293b;
      --text-light: #64748b;
      --border-color: #e2e8f0;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text-color);
      line-height: 1.6;
      font-size: ${baseFontSize}px;
      background: #f8fafc;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: var(--background-color);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    /* Header */
    .header {
      margin-bottom: 30px;
      padding-bottom: 25px;
      border-bottom: 2px solid var(--border-color);
    }
    
    .name {
      font-size: ${Math.round(baseFontSize * 2.7)}px;
      font-weight: 700;
      color: var(--text-color);
      margin-bottom: 8px;
      line-height: 1.2;
    }
    
    .name .surname {
      color: #ffffff;
      display: block;
      background: var(--primary-color);
      padding: 2px 8px;
      margin-top: 4px;
      width: fit-content;
    }

    .role {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 400;
      color: var(--text-light);
      margin-bottom: 15px;
    }
    
    .contact {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      color: var(--text-light);
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      line-height: 1.5;
    }
    
    .contact span {
      position: relative;
    }
    
    .contact span:not(:last-child)::after {
      content: "•";
      margin-left: 12px;
      color: var(--border-color);
    }
    
    /* Sections */
    .section {
      margin-bottom: 28px;
    }
    
    .section-title {
      font-size: ${Math.round(baseFontSize * 1.15)}px;
      font-weight: 700;
      color: var(--text-color);
      text-transform: uppercase;
      margin-bottom: 14px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--primary-color);
      letter-spacing: 0.5px;
    }
    
    /* Entries */
    .entry {
      margin-bottom: 18px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .entry:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 6px;
      gap: 15px;
    }
    
    .entry-title {
      font-weight: 600;
      font-size: ${Math.round(baseFontSize * 1.05)}px;
      color: var(--text-color);
      flex: 1;
    }
    
    .entry-date {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: var(--text-light);
      white-space: nowrap;
      font-style: italic;
    }
    
    .entry-subtitle {
      font-size: ${baseFontSize}px;
      color: var(--text-light);
      margin-bottom: 8px;
      font-style: italic;
    }
    
    .entry-content {
      font-size: ${baseFontSize}px;
      color: var(--text-color);
      line-height: 1.7;
    }

    .entry-content ul {
      margin: 8px 0 8px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .entry-content li {
      margin: 5px 0;
      padding: 0;
      color: var(--text-color);
    }

    .entry-content b {
      font-weight: 700;
      color: var(--text-color);
    }

    /* Enhanced Education Styles */
    .education-school {
      font-size: ${baseFontSize}px;
      color: var(--text-light);
      font-weight: 500;
      margin-bottom: 4px;
      font-style: italic;
    }

    .education-field {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      color: var(--text-light);
      margin-bottom: 4px;
    }

    .education-location {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: var(--text-light);
      margin-bottom: 6px;
    }

    .education-description {
      font-size: ${baseFontSize}px;
      color: var(--text-color);
      line-height: 1.7;
      margin-top: 8px;
      padding: 4px 0;
    }

    .education-achievements {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid var(--border-color);
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .education-achievements ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }

    .education-achievements li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 5px;
      color: var(--text-color);
      font-size: ${baseFontSize}px;
      line-height: 1.6;
    }

    .education-achievements li:before {
      content: "•";
      color: var(--primary-color);
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    
    /* Skills */
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .skill-badge {
      background: #f1f5f9;
      color: var(--text-color);
      padding: 6px 12px;
      border-radius: 4px;
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      font-weight: 500;
      border: 1px solid var(--border-color);
    }
    
    /* Links */
    a {
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    a:hover {
      text-decoration: underline;
    }

    /* Metrics Grid for Professional Context */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .metric-item {
      background: #f8fafc;
      padding: 10px;
      border-radius: 6px;
      text-align: center;
    }

    .metric-value {
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      font-weight: 700;
      color: var(--primary-color);
      line-height: 1.2;
    }

    .metric-label {
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }
    
    /* Print styles */
    @media print {
      body {
        background: white;
      }
      .container { 
        padding: 20px; 
        max-width: none;
        box-shadow: none;
      }
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      .container {
        padding: 25px 20px;
      }
      
      .contact {
        flex-direction: column;
        gap: 8px;
      }
      
      .contact span:not(:last-child)::after {
        display: none;
      }
      
      .entry-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }
      
      .entry-date {
        white-space: normal;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header" data-section="personal">
      <div class="name">
        ${(() => {
          const fullName =
            data.personal?.name && data.personal?.name !== "undefined"
              ? data.personal.name
              : "Your Name";
          const nameParts = fullName.trim().split(" ");
          if (nameParts.length > 1) {
            const surname = nameParts[nameParts.length - 1];
            const firstAndMiddle = nameParts.slice(0, -1).join(" ");
            return `${firstAndMiddle}<span class="surname">${surname}</span>`;
          }
          return fullName;
        })()}
      </div>
      ${
        data.personal?.role
          ? `<div class="role">${data.personal.role}</div>`
          : ""
      }

      <!-- Contact Information -->
      <div class="contact">
        ${data.personal?.email ? `<span data-section="personal">${data.personal.email}</span>` : ""}
        ${data.personal?.phone ? `<span data-section="personal">${data.personal.phone}</span>` : ""}
        ${data.personal?.alternatePhone ? `<span data-section="personal">${data.personal.alternatePhone} (Alt)</span>` : ""}
        
        <!-- Address -->
        ${(() => {
          const addressParts = [
            data.personal?.fullAddress,
            data.personal?.location,
            data.personal?.country,
            data.personal?.pinCode
          ].filter(Boolean);
          return addressParts.length > 0 
            ? `<span data-section="personal">${addressParts.join(", ")}</span>`
            : "";
        })()}
        
        <!-- Inline Personal Details -->
        ${
          data.personal?.personalInfoDisplay === "inline"
            ? (() => {
                const inlineParts = [
                  data.personal?.fathersName ? `Father: ${data.personal.fathersName}` : "",
                  data.personal?.dob ? `DOB: ${data.personal.dob}` : "",
                  data.personal?.gender ? `Gender: ${data.personal.gender}` : "",
                  data.personal?.maritalStatus ? `Marital: ${data.personal.maritalStatus}` : "",
                  data.personal?.nationality ? `Nationality: ${data.personal.nationality}` : ""
                ].filter(Boolean);
                return inlineParts.map(part => `<span data-section="personal">${part}</span>`).join('');
              })()
            : ""
        }
        
        <!-- Social/Profile Links -->
        ${data.personal?.linkedinUrl ? `<span data-section="personal"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></span>` : ""}
        ${data.personal?.githubUrl ? `<span data-section="personal"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></span>` : ""}
        ${data.personal?.portfolioUrl ? `<span data-section="personal"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></span>` : ""}
        ${data.personal?.website ? `<span data-section="personal"><a href="${data.personal.website}" target="_blank">Website</a></span>` : ""}
      </div>
    </div>

    <!-- Professional Context -->
    ${
      data.professionalContext && Object.values(data.professionalContext).some(v => v)
        ? `
    <div class="section" data-section="professionalContext">
      <div class="section-title">Professional Context</div>
      <div class="metrics-grid">
        ${data.professionalContext.totalExperience ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.totalExperience}</div>
          <div class="metric-label">Total Experience</div>
        </div>` : ''}
        ${data.professionalContext.teamSize ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.teamSize}</div>
          <div class="metric-label">Team Size</div>
        </div>` : ''}
        ${data.professionalContext.industry ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.industry}</div>
          <div class="metric-label">Industry</div>
        </div>` : ''}
        ${data.professionalContext.functionalDomain ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.functionalDomain}</div>
          <div class="metric-label">Domain</div>
        </div>` : ''}
        ${data.professionalContext.geographicScope ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.geographicScope}</div>
          <div class="metric-label">Geographic Scope</div>
        </div>` : ''}
        ${data.professionalContext.revenueResponsibility ? `
        <div class="metric-item">
          <div class="metric-value">${data.professionalContext.revenueResponsibility}</div>
          <div class="metric-label">Revenue Responsibility</div>
        </div>` : ''}
      </div>
    </div>`
        : ""
    }

    <!-- Personal Details (if not inline) -->
    ${
      data.personal?.personalInfoDisplay !== "inline" &&
      (data.personal?.fathersName ||
        data.personal?.dob ||
        data.personal?.gender ||
        data.personal?.maritalStatus ||
        data.personal?.nationality ||
        data.personal?.passportNo)
        ? `
    <div class="section" data-section="personal">
      <div class="section-title">Personal Details</div>
      <div class="entry-content">
        <ul>
          ${
            data.personal?.fathersName
              ? `<li><strong>Father's Name:</strong> ${data.personal.fathersName}</li>`
              : ""
          }
          ${
            data.personal?.dob
              ? `<li><strong>Date of Birth:</strong> ${data.personal.dob}</li>`
              : ""
          }
          ${
            data.personal?.gender
              ? `<li><strong>Gender:</strong> ${data.personal.gender}</li>`
              : ""
          }
          ${
            data.personal?.maritalStatus
              ? `<li><strong>Marital Status:</strong> ${data.personal.maritalStatus}</li>`
              : ""
          }
          ${
            data.personal?.nationality
              ? `<li><strong>Nationality:</strong> ${data.personal.nationality}</li>`
              : ""
          }
          ${
            data.personal?.passportNo
              ? `<li><strong>Passport No:</strong> ${data.personal.passportNo}</li>`
              : ""
          }
        </ul>
      </div>
    </div>
    `
        : ""
    }

    <!-- Summary -->
    ${
      data.sectionVisibility?.summary !== false && data.summary
        ? `<div class="section" data-section="summary">
      <div class="section-title">Summary</div>
      <p class="entry-content">${data.summary}</p>
    </div>`
        : ""
    }

    <!-- Career Objective -->
    ${
      typeof data.careerObjective === "string" &&
      data.careerObjective.trim().length > 0
        ? `<div class="section" data-section="careerObjective">
      <div class="section-title">Career Objective</div>
      <p class="entry-content">${data.careerObjective}</p>
    </div>`
        : ""
    }

    <!-- Work Experience -->
    ${
      data.sectionVisibility?.experience !== false &&
      data.experience &&
      data.experience.length > 0
        ? `<div class="section" data-section="experience">
      <div class="section-title">Work Experience</div>
      ${(data.experience || [])
        .map(
          (exp: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${exp.title || ""}</div>
            <div class="entry-date">${formatDateRange(exp.startDate, exp.endDate)}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([exp.company, exp.location])}</div>
          <div class="entry-content">${exp.description || ""}</div>
          ${exp.achievements ? `<div class="entry-content" style="margin-top: 8px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ""}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Internships -->
    ${
      nonEmptyInternships.length > 0
        ? `<div class="section" data-section="internships">
      <div class="section-title">Internships</div>
      ${nonEmptyInternships
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-date">${item.duration || ""}</div>
          </div>
          <div class="entry-subtitle">${item.company || ""}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Training Programs -->
    ${
      nonEmptyTrainingPrograms.length > 0
        ? `<div class="section" data-section="trainingPrograms">
      <div class="section-title">Training Programs</div>
      ${nonEmptyTrainingPrograms
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-date">${item.completionDate || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Education -->
    ${
      data.sectionVisibility?.education !== false &&
      data.education &&
      data.education.length > 0
        ? `<div class="section" data-section="education">
      <div class="section-title">Education</div>
      ${(data.education || [])
        .map(
          (edu: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">
              ${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}${edu.qualification ? ` (${edu.qualification})` : ""}
            </div>
            <div class="entry-date">${edu.graduationDate || ""}</div>
          </div>
          ${
            edu.school
              ? `<div class="education-school">${edu.school}${edu.location ? `, ${edu.location}` : ""}</div>`
              : ""
          }
          ${
            edu.grade
              ? `<div class="education-field">Grade: ${edu.grade}</div>`
              : ""
          }
          
          ${
            edu.description
              ? `
            <div class="education-description">
              ${edu.description}
            </div>
          `
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Projects -->
    ${
      data.sectionVisibility?.projects !== false &&
      data.projects &&
      data.projects.length > 0
        ? `<div class="section" data-section="projects">
      <div class="section-title">Projects</div>
      ${(data.projects || [])
        .map(
          (project: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${project.name || ""}</div>
            ${(() => {
              const dateRange = formatDateRange(project.startDate, project.endDate);
              return dateRange ? `<div class="entry-date">${dateRange}</div>` : "";
            })()}
          </div>
          ${
            project.technologies
              ? `<div class="entry-subtitle">${project.technologies}</div>`
              : ""
          }
          <div class="entry-content">${project.description || ""}</div>
          ${
            project.url
              ? `<div class="entry-content" style="margin-top: 6px;">
            <a href="${project.url}" target="_blank">${project.urlText || project.url}</a>
          </div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Academic Projects -->
    ${
      nonEmptyAcademicProjects.length > 0
        ? `<div class="section" data-section="academicProjects">
      <div class="section-title">Academic Projects</div>
      ${nonEmptyAcademicProjects
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.name || item.title || ""}</div>
            <div class="entry-date">${item.duration || ""}</div>
          </div>
          ${
            item.institution || item.course
              ? `<div class="entry-subtitle">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ""])}</div>`
              : ""
          }
          <div class="entry-content">${item.description || ""}</div>
          ${
            item.technologies
              ? `<div class="entry-content" style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>`
              : ""
          }
          ${
            item.url
              ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.url}" target="_blank">View Project</a></div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Client Projects -->
    ${
      nonEmptyClientProjects.length > 0
        ? `<div class="section" data-section="clientProjects">
      <div class="section-title">Client Projects</div>
      ${nonEmptyClientProjects
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-date">${item.duration || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ""])}</div>
          <div class="entry-content">${item.description || ""}</div>
          ${
            item.toolsTechnologies
              ? `<div class="entry-content" style="margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</div>`
              : ""
          }
          ${
            item.projectUrl
              ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank">View Project</a></div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Portfolio -->
    ${
      nonEmptyPortfolio.length > 0
        ? `<div class="section" data-section="portfolio">
      <div class="section-title">Portfolio</div>
      ${nonEmptyPortfolio
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-date">${formatSubtitle([item.type, item.platform])}</div>
          </div>
          <div class="entry-content">${item.description || ""}</div>
          ${
            item.url
              ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.url}" target="_blank">View Portfolio</a></div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Leadership Positions -->
    ${
      nonEmptyLeadershipPositions.length > 0
        ? `<div class="section" data-section="leadershipPositions">
      <div class="section-title">Leadership & Positions</div>
      ${nonEmptyLeadershipPositions
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.position || item.title || ""}</div>
            <div class="entry-date">${formatDateRange(item.startDate, item.endDate)}</div>
          </div>
          <div class="entry-subtitle">${item.organization || ""}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Volunteering -->
    ${
      nonEmptyVolunteering.length > 0
        ? `<div class="section" data-section="volunteering">
      <div class="section-title">Volunteering</div>
      ${nonEmptyVolunteering
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.role || ""}</div>
            <div class="entry-date">${item.duration || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([item.organization, item.causeArea])}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Military Service -->
    ${
      nonEmptyMilitaryService.length > 0
        ? `<div class="section" data-section="militaryService">
      <div class="section-title">Military Service</div>
      ${nonEmptyMilitaryService
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.rank ? `${item.rank} - ${item.branch}` : item.branch || ""}</div>
            <div class="entry-date">${item.duration || ""}</div>
          </div>
          <div class="entry-subtitle">${item.specialization || ""}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Teaching Experience -->
    ${
      nonEmptyTeachingExperience.length > 0
        ? `<div class="section" data-section="teachingExperience">
      <div class="section-title">Teaching Experience</div>
      ${nonEmptyTeachingExperience
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-date">${item.duration || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([item.institution, item.subjectCourseTaught])}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Mentorship Experience -->
    ${
      nonEmptyMentorshipExperience.length > 0
        ? `<div class="section" data-section="mentorshipExperience">
      <div class="section-title">Mentorship Experience</div>
      ${nonEmptyMentorshipExperience
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.mentorshipArea || ""}</div>
            <div class="entry-date">${item.duration || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ""])}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Research Grants -->
    ${
      nonEmptyResearchGrants.length > 0
        ? `<div class="section" data-section="researchGrants">
      <div class="section-title">Research Grants</div>
      ${nonEmptyResearchGrants
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-date">${item.year || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([item.agency, item.amount])}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Publications -->
    ${
      nonEmptyPublications.length > 0
        ? `<div class="section" data-section="publications">
      <div class="section-title">Publications</div>
      ${nonEmptyPublications
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-date">${item.year || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
          ${item.authors ? `<div class="entry-content"><strong>Authors:</strong> ${item.authors}</div>` : ""}
          ${
            item.urlDoi
              ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank">View Publication</a></div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Patents -->
    ${
      nonEmptyPatents.length > 0
        ? `<div class="section" data-section="patents">
      <div class="section-title">Patents</div>
      ${nonEmptyPatents
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-date">${item.year || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([item.patentNumber, item.issuingAuthority])}</div>
          <div class="entry-content"><strong>Status:</strong> ${item.status || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Test Scores -->
    ${
      nonEmptyTestScores.length > 0
        ? `<div class="section" data-section="testScores">
      <div class="section-title">Test Scores</div>
      ${nonEmptyTestScores
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.testName || ""}</div>
            <div class="entry-date">${item.year || ""}</div>
          </div>
          <div class="entry-subtitle">Score: ${item.score || ""}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Certifications -->
    ${
      data.sectionVisibility?.certifications !== false &&
      data.certifications &&
      data.certifications.length > 0
        ? `<div class="section" data-section="certifications">
      <div class="section-title">Certifications</div>
      ${(data.certifications || [])
        .map(
          (cert: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${cert.name || ""}</div>
            <div class="entry-date">${cert.date || ""}</div>
          </div>
          <div class="entry-subtitle">${cert.issuer || ""}</div>
          ${cert.description ? `<div class="entry-content">${cert.description}</div>` : ""}
          ${
            cert.url
              ? `<div class="entry-content" style="margin-top: 6px;">
            <a href="${cert.url}" target="_blank">View Certificate</a>
          </div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Scholarships -->
    ${
      nonEmptyScholarships.length > 0
        ? `<div class="section" data-section="scholarships">
      <div class="section-title">Scholarships</div>
      ${nonEmptyScholarships
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-date">${item.year || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Awards -->
    ${
      nonEmptyAwards.length > 0
        ? `<div class="section" data-section="awards">
      <div class="section-title">Awards</div>
      ${nonEmptyAwards
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-date">${item.issueYear || ""}</div>
          </div>
          <div class="entry-subtitle">${item.organization || ""}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Speaking Engagements -->
    ${
      nonEmptySpeakingEngagements.length > 0
        ? `<div class="section" data-section="speakingEngagements">
      <div class="section-title">Speaking Engagements</div>
      ${nonEmptySpeakingEngagements
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.topic || ""}</div>
            <div class="entry-date">${item.date || ""}</div>
          </div>
          <div class="entry-subtitle">${item.eventName || ""}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Memberships -->
    ${
      nonEmptyMemberships.length > 0
        ? `<div class="section" data-section="memberships">
      <div class="section-title">Memberships</div>
      ${nonEmptyMemberships
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.membershipName || ""}</div>
            <div class="entry-date">${item.year || ""}</div>
          </div>
          <div class="entry-subtitle">${item.organizationName || ""}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Workshops -->
    ${
      nonEmptyWorkshops.length > 0
        ? `<div class="section" data-section="workshops">
      <div class="section-title">Workshops</div>
      ${nonEmptyWorkshops
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.programTitle || ""}</div>
            <div class="entry-date">${item.year || ""}</div>
          </div>
          <div class="entry-subtitle">${item.conductedBy || ""}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Co-curricular Activities -->
    ${
      nonEmptyCoCurricular.length > 0
        ? `<div class="section" data-section="coCurricular">
      <div class="section-title">Co-curricular Activities</div>
      ${nonEmptyCoCurricular
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.activity || ""}</div>
            <div class="entry-date">${item.year || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([item.organization, item.role])}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Extracurricular Activities -->
    ${
      nonEmptyExtracurricular.length > 0
        ? `<div class="section" data-section="extracurricular">
      <div class="section-title">Extracurricular Activities</div>
      ${nonEmptyExtracurricular
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${item.activity || ""}</div>
            <div class="entry-date">${item.year || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([item.organization, item.role])}</div>
          <div class="entry-content">${item.description || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Skills -->
    ${
      nonEmptySkills.length > 0
        ? `<div class="section" data-section="skills">
      <div class="section-title">Skills</div>
      <div class="skills">
        ${nonEmptySkills
          .map(
            (skill: any, index: number) => `
          <div class="skill-badge" data-section="skills" data-index="${index}">${
              typeof skill === "string" ? skill.trim() : skill
            }</div>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Tools & Technologies -->
    ${
      nonEmptyToolsTechnologies.length > 0
        ? `<div class="section" data-section="toolsTechnologies">
      <div class="section-title">Tools & Technologies</div>
      <div class="skills">
        ${nonEmptyToolsTechnologies
          .map(
            (item: any, index: number) => `
          <div class="skill-badge" data-section="toolsTechnologies" data-index="${index}">
            ${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}
          </div>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Methodologies -->
    ${
      nonEmptyMethodologies.length > 0
        ? `<div class="section" data-section="methodologies">
      <div class="section-title">Methodologies</div>
      <div class="skills">
        ${nonEmptyMethodologies
          .map(
            (item: any, index: number) => `
          <div class="skill-badge" data-section="methodologies" data-index="${index}">
            ${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}
          </div>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Industry Expertise -->
    ${
      nonEmptyIndustryExpertise.length > 0
        ? `<div class="section" data-section="industryExpertise">
      <div class="section-title">Industry Expertise</div>
      <div class="skills">
        ${nonEmptyIndustryExpertise
          .map(
            (item: any, index: number) => `
          <div class="skill-badge" data-section="industryExpertise" data-index="${index}">
            ${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}
          </div>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Languages -->
    ${
      data.sectionVisibility?.languages !== false &&
      data.languages &&
      data.languages.length > 0
        ? `<div class="section" data-section="languages">
      <div class="section-title">Languages</div>
      <div class="skills">
        ${(data.languages || [])
          .map(
            (lang: any, index: number) => `
          <div class="skill-badge" data-section="languages" data-index="${index}">
            ${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}
          </div>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Hobbies -->
    ${
      data.sectionVisibility?.hobbies !== false &&
      data.hobbies &&
      data.hobbies.length > 0
        ? `<div class="section" data-section="hobbies">
      <div class="section-title">Hobbies & Interests</div>
      <div class="skills">
        ${(data.hobbies || [])
          .map(
            (hobby: any, index: number) => `
          <div class="skill-badge" data-section="hobbies" data-index="${index}">${hobby}</div>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Availability & Work Authorization -->
    ${
      data.availabilityWorkAuth && Object.values(data.availabilityWorkAuth).some(v => v)
        ? `<div class="section" data-section="availabilityWorkAuth">
      <div class="section-title">Availability</div>
      <div class="skills">
        ${data.availabilityWorkAuth.availabilityNoticePeriod ? `<div class="skill-badge">Notice: ${data.availabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
        ${data.availabilityWorkAuth.workAuthorizationStatus ? `<div class="skill-badge">Work Auth: ${data.availabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
        ${data.availabilityWorkAuth.preferredLocation ? `<div class="skill-badge">Preferred: ${data.availabilityWorkAuth.preferredLocation}</div>` : ''}
      </div>
    </div>`
        : ""
    }

    <!-- Social Links -->
    ${
      data.sectionVisibility?.socialLinks !== false &&
      data.socialLinks &&
      data.socialLinks.length > 0
        ? `<div class="section" data-section="socialLinks">
      <div class="section-title">Social Links</div>
      <div class="skills">
        ${data.socialLinks
          .map(
            (link: any, index: number) => `
          <a href="${link.url}" target="_blank" class="skill-badge" style="background: #e6f0fa; color: var(--primary-color);" data-section="socialLinks" data-index="${index}">
            ${link.urlText || link.url.replace("https://", "").replace("http://", "").split('/')[0]}
          </a>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Social Profiles -->
    ${
      nonEmptySocialProfiles.length > 0
        ? `<div class="section" data-section="socialProfiles">
      <div class="section-title">Social Profiles</div>
      <div class="skills">
        ${nonEmptySocialProfiles
          .map(
            (profile: any, index: number) => `
          <a href="${profile.url}" target="_blank" class="skill-badge" style="background: #e6f0fa; color: var(--primary-color);" data-section="socialProfiles" data-index="${index}">
            ${profile.platform || "Profile"}
          </a>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- References -->
    ${
      nonEmptyReferences.length > 0
        ? `<div class="section" data-section="references">
      <div class="section-title">References</div>
      ${nonEmptyReferences
        .map(
          (ref: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <div class="entry-title">${ref.name || ""}</div>
          </div>
          <div class="entry-subtitle">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
          <div class="entry-content">${ref.contactInformation || ""}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Key Achievements -->
    ${
      nonEmptyKeyAchievements.length > 0
        ? `<div class="section" data-section="keyAchievements">
      <div class="section-title">Key Achievements</div>
      <div class="entry-content">
        <ul>
          ${nonEmptyKeyAchievements
            .map(
              (achievement: string, index: number) =>
                `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`
            )
            .join("")}
        </ul>
      </div>
    </div>`
        : ""
    }

    <!-- Key Responsibilities -->
    ${
      nonEmptyResponsibilities.length > 0
        ? `<div class="section" data-section="responsibilities">
      <div class="section-title">Key Responsibilities</div>
      <div class="entry-content">
        <ul>
          ${nonEmptyResponsibilities
            .map(
              (line: string, index: number) =>
                `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`
            )
            .join("")}
        </ul>
      </div>
    </div>`
        : ""
    }

    <!-- Tools (Simple List) -->
    ${
      nonEmptyTools.length > 0
        ? `<div class="section" data-section="tools">
      <div class="section-title">Tools</div>
      <div class="entry-content">
        <ul>
          ${nonEmptyTools
            .map(
              (line: string, index: number) =>
                `<li data-section="tools" data-index="${index}">${line.trim()}</li>`
            )
            .join("")}
        </ul>
      </div>
    </div>`
        : ""
    }

    <!-- Custom Sections -->
    ${
      data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section: any) => section.isVisible)
            .map(
              (section: any, sectionIndex: number) => `
    <div class="section" data-section="custom-${sectionIndex}">
      <div class="section-title">${section.heading || "Custom Section"}</div>
      ${
        section.entries && section.entries.length > 0
          ? section.entries
              .filter((entry: any) => entry.isVisible)
              .map(
                (entry: any, entryIndex: number) => `
        <div class="entry" data-index="${entryIndex}">
          <div class="entry-header">
            <div class="entry-title">${entry.title || ""}${entry.title && entry.organization ? " at " : ""}${entry.organization || ""}</div>
            ${entry.date ? `<div class="entry-date">${entry.date}</div>` : ""}
          </div>
          ${
            entry.description
              ? `<div class="entry-content">${entry.description}</div>`
              : ""
          }
        </div>
      `
              )
              .join("")
          : '<div style="color: var(--text-light); font-style: italic;">No entries in this section</div>'
      }
    </div>
    `
            )
            .join("")
        : ""
    }
  </div>
</body>
</html>`;
}

// Keep the old function for backward compatibility but redirect to new one
export function buildModernTemplate(data: any, theme?: any): string {
  return buildMinimalTemplate(data, theme);
}