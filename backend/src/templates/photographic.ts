export function buildPhotographicTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#0ea5e9",
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
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14; // Default 14px
  const userFontFamily =
    data.formatting?.fontFamily || data.fontFamily || "Inter, sans-serif";

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
  const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size

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
    fontWeightMap[typography.fontWeight as keyof typeof fontWeightMap] || "400";

  // Helper function to check if an array has meaningful content
  const hasContent = (arr: any): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    if (arr.length === 0) return false;
    // Check if any item has non-empty content
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

  // Helper to safely join array items with separator, filtering out empty values
  const safeJoin = (items: any[], separator: string = " • "): string => {
    if (!items || !Array.isArray(items)) return "";
    const filtered = items.filter(item => item && typeof item === "string" && item.trim().length > 0);
    return filtered.join(separator);
  };

  // Helper to safely format entry subtitle with multiple fields
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Resume</title>

<!-- Google Fonts disabled for PDF compatibility -->

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
    padding: 48px;
    background: var(--background-color);
    border-radius: 14px;
    box-shadow: 0 6px 32px rgba(0, 0, 0, 0.07);
  }

  /* --- HEADER SECTION --- */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 2px solid #e5e7eb;
    position: relative;
  }

  .header-content {
    flex: 1;
    padding-right: 30px;
  }

  .name {
    font-size: ${Math.round(baseFontSize * 3)}px;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 8px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }


  .contact-info {
    font-size: 14px;
    color: var(--secondary-color);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .contact-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* --- PROFILE PHOTO SECTION --- */
  .profile-photo-container {
    position: relative;
    width: 160px;
    height: 160px;
    flex-shrink: 0;
  }

  .profile-photo {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
    border: 3px solid var(--primary-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: #f8fafc;
  }

  .photo-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50px;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border: 3px solid var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 14px;
    text-align: center;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* --- MAIN CONTENT LAYOUT --- */
  .main-content {
    display: flex;
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
    border-bottom: 2px solid var(--primary-color);
  }

  /* --- SKILLS STYLING --- */
  .skills-list {
    list-style: none;
  }

  .skill-item {
    font-size: ${currentFontSize.base};
    color: #334155;
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

  /* --- SUMMARY STYLING --- */
  .summary-text {
    font-size: ${currentFontSize.base};
    line-height: 1.7;
    color: #475569;
    text-align: ${currentAlignment};
    font-weight: ${currentFontWeight};
  }

  /* --- EDUCATION & EXPERIENCE --- */
  .entry {
    margin-bottom: 22px;
    padding-bottom: 18px;
    border-bottom: 1px solid #f1f5f9;
  }

  .entry:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }

  .entry-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 6px;
  }

  .entry-subtitle {
    font-size: 14px;
    color: var(--secondary-color);
    font-style: italic;
    margin-bottom: 8px;
  }

  .entry-content {
    font-size: 14px;
    color: #334155;
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
    color: #334155;
  }

  .entry-content b {
    font-weight: 700;
    color: #1e293b;
  }

  /* --- ENHANCED EDUCATION STYLES --- */
  .education-school {
    font-size: 14px;
    color: var(--secondary-color);
    font-weight: 500;
    margin-bottom: 4px;
  }

  .education-field {
    font-size: 13px;
    color: #475569;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .education-location {
    font-size: 12px;
    color: var(--secondary-color);
    margin-bottom: 6px;
  }

  .education-date {
    font-size: 12px;
    color: var(--secondary-color);
    font-weight: 500;
  }

  .education-description {
    font-size: 14px;
    color: #334155;
    line-height: 1.6;
    margin-top: 10px;
    padding: 8px 0;
  }

  .education-achievements {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
  }

  .education-achievements h4 {
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-color);
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
    padding-left: 15px;
    margin-bottom: 6px;
    color: #334155;
    font-size: 14px;
  }

  .education-achievements li:before {
    content: "•";
    color: var(--primary-color);
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  /* Professional Context Metrics */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
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
    font-size: 14px;
    font-weight: 700;
    color: var(--primary-color);
    line-height: 1.2;
  }

  .metric-label {
    font-size: 11px;
    color: var(--secondary-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }

  /* Tags for hobbies, tools, etc */
  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }

  .tag {
    background: #f1f5f9;
    color: #475569;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .header-content {
      padding-right: 0;
      margin-bottom: 20px;
    }
    
    .profile-photo-container {
      width: 140px;
      height: 140px;
      order: -1;
      margin-bottom: 20px;
    }
    
    .main-content {
      flex-direction: column;
      gap: 30px;
    }
    
    .name {
      font-size: 36px;
    }
    
    .contact-info {
      align-items: center;
    }
    
    .container {
      padding: 30px 25px;
      margin: 20px auto;
    }

    .metrics-grid {
      grid-template-columns: 1fr;
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


  <div class="header" data-section="personal">
    <div class="header-content" data-section="personal">
      <div class="name">${
        data.personal?.name && data.personal?.name !== "undefined"
          ? data.personal.name
          : "Your Name"
      }${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</div>
      ${
        data.personal?.role
          ? `<div style="font-size: 16px; color: #64748b; margin-bottom: 10px; font-weight: 600;">${data.personal.role}</div>`
          : ""
      }


      ${
        data.personal?.email ||
        data.personal?.phone ||
        data.personal?.alternatePhone ||
        data.personal?.location ||
        data.personal?.country ||
        data.personal?.pinCode ||
        data.personal?.fullAddress ||
        data.personal?.linkedinUrl ||
        data.personal?.githubUrl ||
        data.personal?.portfolioUrl ||
        data.personal?.website ||
        data.personal?.twitterUrl ||
        data.personal?.facebookUrl ||
        data.personal?.instagramUrl ||
        data.personal?.behanceUrl ||
        data.personal?.dribbbleUrl ||
        data.personal?.stackoverflowUrl ||
        data.personal?.mediumUrl
          ? `
      <div class="contact-info">
        <!-- Address Line -->
        ${
          data.personal?.fullAddress || data.personal?.location || data.personal?.country || data.personal?.pinCode
            ? `<div class="contact-row">
                ${data.personal?.fullAddress ? `<div class="contact-item">📍 ${data.personal.fullAddress}</div>` : ""}
                ${data.personal?.location ? `<div class="contact-item">${data.personal.location}</div>` : ""}
                ${data.personal?.country ? `<div class="contact-item">${data.personal.country}</div>` : ""}
                ${data.personal?.pinCode ? `<div class="contact-item">${data.personal.pinCode}</div>` : ""}
              </div>`
            : ""
        }

        <!-- Contact Line -->
        ${
          data.personal?.email || data.personal?.phone || data.personal?.alternatePhone
            ? `<div class="contact-row">
                ${data.personal?.email ? `<div class="contact-item">✉️ ${data.personal.email}</div>` : ""}
                ${data.personal?.phone ? `<div class="contact-item">📞 ${data.personal.phone}</div>` : ""}
                ${data.personal?.alternatePhone ? `<div class="contact-item">📞 ${data.personal.alternatePhone}</div>` : ""}
              </div>`
            : ""
        }

        <!-- URLs Line -->
        ${
          data.personal?.linkedinUrl ||
          data.personal?.githubUrl ||
          data.personal?.portfolioUrl ||
          data.personal?.website ||
          data.personal?.twitterUrl ||
          data.personal?.facebookUrl ||
          data.personal?.instagramUrl ||
          data.personal?.behanceUrl ||
          data.personal?.dribbbleUrl ||
          data.personal?.stackoverflowUrl ||
          data.personal?.mediumUrl
            ? `<div class="contact-row">
                ${data.personal?.linkedinUrl ? `<div class="contact-item"><a href="${data.personal.linkedinUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">LinkedIn</a></div>` : ""}
                ${data.personal?.githubUrl ? `<div class="contact-item"><a href="${data.personal.githubUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">GitHub</a></div>` : ""}
                ${data.personal?.portfolioUrl ? `<div class="contact-item"><a href="${data.personal.portfolioUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Portfolio</a></div>` : ""}
                ${data.personal?.website ? `<div class="contact-item"><a href="${data.personal.website}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Website</a></div>` : ""}
                ${data.personal?.twitterUrl ? `<div class="contact-item"><a href="${data.personal.twitterUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Twitter</a></div>` : ""}
                ${data.personal?.facebookUrl ? `<div class="contact-item"><a href="${data.personal.facebookUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Facebook</a></div>` : ""}
                ${data.personal?.instagramUrl ? `<div class="contact-item"><a href="${data.personal.instagramUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Instagram</a></div>` : ""}
                ${data.personal?.behanceUrl ? `<div class="contact-item"><a href="${data.personal.behanceUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Behance</a></div>` : ""}
                ${data.personal?.dribbbleUrl ? `<div class="contact-item"><a href="${data.personal.dribbbleUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Dribbble</a></div>` : ""}
                ${data.personal?.stackoverflowUrl ? `<div class="contact-item"><a href="${data.personal.stackoverflowUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Stack Overflow</a></div>` : ""}
                ${data.personal?.mediumUrl ? `<div class="contact-item"><a href="${data.personal.mediumUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Medium</a></div>` : ""}
              </div>`
            : ""
        }

        ${
          data.personal?.personalInfoDisplay === "inline"
            ? `
        <!-- Personal Details Line - Inline Mode -->
        ${
          data.personal?.fathersName ||
          data.personal?.dob ||
          data.personal?.gender ||
          data.personal?.maritalStatus ||
          data.personal?.nationality
            ? `<div class="contact-row">
                ${data.personal?.fathersName ? `<div class="contact-item">Father: ${data.personal.fathersName}</div>` : ""}
                ${data.personal?.dob ? `<div class="contact-item">DOB: ${data.personal.dob}</div>` : ""}
                ${data.personal?.gender ? `<div class="contact-item">Gender: ${data.personal.gender}</div>` : ""}
                ${data.personal?.maritalStatus ? `<div class="contact-item">Marital: ${data.personal.maritalStatus}</div>` : ""}
                ${data.personal?.nationality ? `<div class="contact-item">Nationality: ${data.personal.nationality}</div>` : ""}
              </div>`
            : ""
        }
        `
            : ""
        }
      </div>
      `
          : ""
      }
    </div>
    
    <div class="profile-photo-container">
      ${
        data.personal?.image
          ? `<img src="${data.personal.image}" alt="${
              data.personal?.name && data.personal?.name !== "undefined"
                ? data.personal.name
                : "Profile Photo"
            }" class="profile-photo" />`
          : `<div class="photo-placeholder">Profile Photo</div>`
      }
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

  <div class="main-content">
    <!-- Left Column for Skills -->
    <div class="left-column">

      <!-- Skills -->
      ${
        nonEmptySkills.length > 0
          ? `
      <div class="section" data-section="skills">
        <div class="section-title">Skills</div>
        <ul class="skills-list" data-section="skills">
          ${nonEmptySkills
            .map(
              (s: any) =>
                `<li class="skill-item">${
                  typeof s === "string" ? s.trim() : s
                }</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Tools & Technologies -->
      ${
        nonEmptyToolsTechnologies.length > 0
          ? `
      <div class="section" data-section="toolsTechnologies">
        <div class="section-title">Tools & Technologies</div>
        <ul class="skills-list" data-section="toolsTechnologies">
          ${nonEmptyToolsTechnologies
            .map(
              (item: any) =>
                `<li class="skill-item">${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Methodologies -->
      ${
        nonEmptyMethodologies.length > 0
          ? `
      <div class="section" data-section="methodologies">
        <div class="section-title">Methodologies</div>
        <ul class="skills-list" data-section="methodologies">
          ${nonEmptyMethodologies
            .map(
              (item: any) =>
                `<li class="skill-item">${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Industry Expertise -->
      ${
        nonEmptyIndustryExpertise.length > 0
          ? `
      <div class="section" data-section="industryExpertise">
        <div class="section-title">Industry Expertise</div>
        <ul class="skills-list" data-section="industryExpertise">
          ${nonEmptyIndustryExpertise
            .map(
              (item: any) =>
                `<li class="skill-item">${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }
      
      <!-- Education -->
      ${
        data.education?.length
          ? `
      <div class="section" data-section="education">
        <div class="section-title">Education</div>
        ${data.education
          .map(
            (edu: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">
              ${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}${edu.qualification ? ` (${edu.qualification})` : ""}
            </div>
            ${
              edu.school
                ? `<div class="education-school">${edu.school}${edu.location ? `, ${edu.location}` : ""}</div>`
                : ""
            }
            ${
              edu.graduationDate || edu.grade
                ? `<div class="education-date">${edu.graduationDate || ''}${edu.grade ? ` | Grade: ${edu.grade}` : ''}</div>`
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

      <!-- Languages -->
      ${
        data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0
          ? `
      <div class="section" data-section="languages">
        <div class="section-title">Languages</div>
        <ul class="skills-list" data-section="languages">
          ${(data.languages || [])
            .map(
              (lang: any) =>
                `<li class="skill-item">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Certifications -->
      ${
        data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 0
          ? `
      <div class="section" data-section="certifications">
        <div class="section-title">Certifications</div>
        ${data.certifications
          .map(
            (cert: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${cert.name || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([cert.issuer, cert.date])}</div>
            ${
              cert.url
                ? `<div class="entry-content" style="margin-top: 8px;"><a href="${cert.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Certificate</a></div>`
                : ""
            }
            ${cert.description ? `<div class="entry-content">${cert.description}</div>` : ""}
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
          ? `
      <div class="section" data-section="testScores">
        <div class="section-title">Test Scores</div>
        ${nonEmptyTestScores
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.testName || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([`Score: ${item.score || ""}`, item.percentileRank ? `(${item.percentileRank} percentile)` : '', item.year])}</div>
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
          ? `
      <div class="section" data-section="scholarships">
        <div class="section-title">Scholarships</div>
        ${nonEmptyScholarships
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.year, item.amount])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Hobbies -->
      ${
        data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
          ? `
      <div class="section" data-section="hobbies">
        <div class="section-title">Hobbies & Interests</div>
        <div class="tags-container">
          ${(data.hobbies || [])
            .map(
              (hobby: any, index: number) => `
            <div class="tag" data-section="hobbies" data-index="${index}">${hobby}</div>
          `
            )
            .join("")}
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
        <div class="tags-container">
          ${data.socialLinks
            .map(
              (link: any, index: number) => `
            <a href="${link.url}" target="_blank" class="tag" style="color: var(--primary-color); text-decoration: none; background: #e6f0fa;" data-section="socialLinks" data-index="${index}">${link.urlText || link.url.replace("https://", "").replace("http://", "").split('/')[0]}</a>
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
        <div class="tags-container">
          ${nonEmptySocialProfiles
            .map(
              (profile: any, index: number) => `
            <a href="${profile.url}" target="_blank" class="tag" style="color: var(--primary-color); text-decoration: none; background: #e6f0fa;" data-section="socialProfiles" data-index="${index}">${profile.platform || "Profile"}</a>
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
          ? `
      <div class="section" data-section="availabilityWorkAuth">
        <div class="section-title">Availability</div>
        <div class="entry-content">
          <ul>
            ${data.availabilityWorkAuth.availabilityNoticePeriod ? `<li><strong>Notice Period:</strong> ${data.availabilityWorkAuth.availabilityNoticePeriod}</li>` : ''}
            ${data.availabilityWorkAuth.workAuthorizationStatus ? `<li><strong>Work Auth:</strong> ${data.availabilityWorkAuth.workAuthorizationStatus}</li>` : ''}
            ${data.availabilityWorkAuth.preferredLocation ? `<li><strong>Preferred Location:</strong> ${data.availabilityWorkAuth.preferredLocation}</li>` : ''}
          </ul>
        </div>
      </div>`
          : ""
      }

      <!-- References -->
      ${
        nonEmptyReferences.length > 0
          ? `
      <div class="section" data-section="references">
        <div class="section-title">References</div>
        ${nonEmptyReferences
          .map(
            (ref: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${ref.name || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
            <div class="entry-content">${ref.contactInformation || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }
    </div>

    <!-- Right Column for Summary and Experience -->
    <div class="right-column">

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
          ? `
      <div class="section" data-section="summary">
        <div class="section-title">Professional Summary</div>
        <p class="summary-text" data-section="summary">${data.summary}</p>
      </div>`
          : ""
      }

      <!-- Career Objective -->
      ${
        typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
          ? `
      <div class="section" data-section="careerObjective">
        <div class="section-title">Career Objective</div>
        <p class="summary-text" data-section="careerObjective">${data.careerObjective}</p>
      </div>`
          : ""
      }

      <!-- Work Experience -->
      ${
        data.experience?.length
          ? `
      <div class="section" data-section="experience">
        <div class="section-title">Work Experience</div>
        ${data.experience
          .map(
            (exp: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${exp.title}</div>
            <div class="entry-subtitle">${formatSubtitle([exp.company, exp.location, `${exp.startDate} - ${exp.endDate || "Present"}`])}</div>
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
          ? `
      <div class="section" data-section="internships">
        <div class="section-title">Internships</div>
        ${nonEmptyInternships
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.company, item.duration])}</div>
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
          ? `
      <div class="section" data-section="trainingPrograms">
        <div class="section-title">Training Programs</div>
        ${nonEmptyTrainingPrograms
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.provider || item.organization, item.completionDate, item.duration])}</div>
            <div class="entry-content">${item.description || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Projects -->
      ${
        data.projects?.length
          ? `
      <div class="section" data-section="projects">
        <div class="section-title">Projects</div>
        ${data.projects
          .map((project: any, index: number) => {
            const projectName = project.name || project.title || "";
            const projectDesc = project.description || "";
            const technologies = project.technologies || "";
            const startDate = project.startDate || "";
            const endDate = project.endDate || "";
            const url = project.url || "";
            const urlText = project.urlText || "View Project";
            
            const dateRange = startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate || "";
            
            return `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${projectName}</div>
            ${dateRange ? `<div class="entry-subtitle">${dateRange}</div>` : ""}
            ${
              technologies
                ? `<div class="entry-content" style="font-style: italic; margin-bottom: 5px;">${technologies}</div>`
                : ""
            }
            <div class="entry-content">${projectDesc}</div>
            ${
              url
                ? `<div class="entry-content" style="margin-top: 8px;"><a href="${url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">${urlText}</a></div>`
                : ""
            }
          </div>`;
          })
          .join("")}
      </div>`
          : ""
      }

      <!-- Academic Projects -->
      ${
        nonEmptyAcademicProjects.length > 0
          ? `
      <div class="section" data-section="academicProjects">
        <div class="section-title">Academic Projects</div>
        ${nonEmptyAcademicProjects
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.name || item.title || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.duration, item.institution])}</div>
            <div class="entry-content">${item.description || ""}</div>
            ${
              item.technologies
                ? `<div class="entry-content" style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>`
                : ""
            }
            ${
              item.url
                ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Project</a></div>`
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
          ? `
      <div class="section" data-section="clientProjects">
        <div class="section-title">Client Projects</div>
        ${nonEmptyClientProjects
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.clientOrganization, item.duration, item.role ? `Role: ${item.role}` : ""])}</div>
            <div class="entry-content">${item.description || ""}</div>
            ${
              item.toolsTechnologies
                ? `<div class="entry-content" style="margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</div>`
                : ""
            }
            ${
              item.projectUrl
                ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Project</a></div>`
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
          ? `
      <div class="section" data-section="portfolio">
        <div class="section-title">Portfolio</div>
        ${nonEmptyPortfolio
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.name || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.type, item.platform])}</div>
            <div class="entry-content">${item.description || ""}</div>
            ${
              item.url
                ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Portfolio</a></div>`
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
          ? `
      <div class="section" data-section="leadershipPositions">
        <div class="section-title">Leadership & Positions</div>
        ${nonEmptyLeadershipPositions
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.position || item.title || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : ""])}</div>
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
          ? `
      <div class="section" data-section="volunteering">
        <div class="section-title">Volunteering</div>
        ${nonEmptyVolunteering
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.role || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.duration, item.causeArea])}</div>
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
          ? `
      <div class="section" data-section="militaryService">
        <div class="section-title">Military Service</div>
        ${nonEmptyMilitaryService
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.rank ? `${item.rank} - ${item.branch}` : item.branch || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.duration, item.specialization])}</div>
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
          ? `
      <div class="section" data-section="teachingExperience">
        <div class="section-title">Teaching Experience</div>
        ${nonEmptyTeachingExperience
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.institution, item.duration, item.subjectCourseTaught])}</div>
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
          ? `
      <div class="section" data-section="mentorshipExperience">
        <div class="section-title">Mentorship Experience</div>
        ${nonEmptyMentorshipExperience
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.mentorshipArea || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organizationPlatform, item.duration, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ""])}</div>
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
          ? `
      <div class="section" data-section="researchGrants">
        <div class="section-title">Research Grants</div>
        ${nonEmptyResearchGrants
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.agency, item.year, item.amount])}</div>
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
          ? `
      <div class="section" data-section="publications">
        <div class="section-title">Publications</div>
        ${nonEmptyPublications
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.journalPublisher, item.year, item.publicationType])}</div>
            ${item.authors ? `<div class="entry-content"><strong>Authors:</strong> ${item.authors}</div>` : ""}
            ${
              item.urlDoi
                ? `<div class="entry-content" style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Publication</a></div>`
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
          ? `
      <div class="section" data-section="patents">
        <div class="section-title">Patents</div>
        ${nonEmptyPatents
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.patentNumber, item.year])} • Status: ${item.status || ""}</div>
            ${item.issuingAuthority ? `<div class="entry-content">Issuing Authority: ${item.issuingAuthority}</div>` : ""}
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
          ? `
      <div class="section" data-section="awards">
        <div class="section-title">Awards</div>
        ${nonEmptyAwards
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.title || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.issueYear])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
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
          ? `
      <div class="section" data-section="speakingEngagements">
        <div class="section-title">Speaking Engagements</div>
        ${nonEmptySpeakingEngagements
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.topic || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.eventName, item.date])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
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
          ? `
      <div class="section" data-section="memberships">
        <div class="section-title">Memberships</div>
        ${nonEmptyMemberships
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.membershipName || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organizationName, item.year])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
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
          ? `
      <div class="section" data-section="workshops">
        <div class="section-title">Workshops</div>
        ${nonEmptyWorkshops
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.programTitle || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.conductedBy, item.year])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
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
          ? `
      <div class="section" data-section="coCurricular">
        <div class="section-title">Co-curricular Activities</div>
        ${nonEmptyCoCurricular
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.activity || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role, item.year])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
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
          ? `
      <div class="section" data-section="extracurricular">
        <div class="section-title">Extracurricular Activities</div>
        ${nonEmptyExtracurricular
          .map(
            (item: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${item.activity || ""}</div>
            <div class="entry-subtitle">${formatSubtitle([item.organization, item.role, item.year])}</div>
            ${item.description ? `<div class="entry-content">${item.description}</div>` : ""}
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Key Achievements -->
      ${
        hasContent(data.keyAchievements)
          ? `
      <div class="section" data-section="keyAchievements">
        <div class="section-title">Key Achievements</div>
        <div class="entry-content">
          <ul>
            ${getNonEmptyArray(data.keyAchievements)
              .map((achievement: string) => `<li>${achievement}</li>`)
              .join("")}
          </ul>
        </div>
      </div>`
          : ""
      }

      <!-- Key Responsibilities -->
      ${
        hasContent(data.responsibilities)
          ? `
      <div class="section" data-section="responsibilities">
        <div class="section-title">Key Responsibilities</div>
        <div class="entry-content">
          <ul>
            ${getNonEmptyArray(
              Array.isArray(data.responsibilities)
                ? data.responsibilities
                : (data.responsibilities || "").split("\n")
            )
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
        hasContent(data.tools)
          ? `
      <div class="section" data-section="tools">
        <div class="section-title">Tools</div>
        <div class="entry-content">
          <ul>
            ${getNonEmptyArray(
              Array.isArray(data.tools)
                ? data.tools
                : (data.tools || "").split("\n")
            )
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
              .map((section: any, sectionIndex: number) => {
                const heading = section.heading || "Custom Section";
                return `
      <div class="section" data-section="custom-${sectionIndex}">
        <div class="section-title">${heading}</div>
        ${
          section.entries && section.entries.length > 0
            ? section.entries
                .filter((entry: any) => entry.isVisible)
                .map(
                  (entry: any, entryIndex: number) => `
          <div class="entry" data-index="${entryIndex}">
            <div class="entry-title">${entry.title || ""}${entry.title && entry.organization ? " at " : ""}${entry.organization || ""}</div>
            ${entry.date ? `<div class="entry-subtitle">${entry.date}</div>` : ""}
            ${entry.description ? `<div class="entry-content">${entry.description}</div>` : ""}
          </div>
        `
                )
                .join("")
            : '<div style="color: #64748b; font-style: italic; margin-bottom: 15px;">No entries in this section</div>'
        }
      </div>
      `;
              })
              .join("")
          : ""
      }
    </div>
  </div>

</div>
</body>
</html>`;
}