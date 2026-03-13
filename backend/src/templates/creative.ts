export function buildCreativeTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#2c3e50",
    secondary: "#64748b",
    background: "#ffffff",
    headingFont: "Playfair Display",
    bodyFont: "Inter",
  };

  const currentTheme = theme || defaultTheme;

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 13; // Default 13px
  const userFontFamily =
    data.formatting?.fontFamily || data.fontFamily || "Inter, sans-serif";

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
  const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size

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
    return filtered.join(" | ");
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
  <!-- Google Fonts disabled for PDF compatibility -->
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --background-color: ${currentTheme.background};
      --heading-font: ${currentTheme.headingFont || "Playfair Display"};
      --body-font: ${currentTheme.bodyFont || "Inter"};
    }

    body {
      font-family: ${userFontFamily};
      color: #1e293b;
      line-height: 1.6;
      background: #fafaf8;
      font-size: ${baseFontSize}px;
    }
    .container {
      max-width: 820px;
      margin: 40px auto;
      background: var(--background-color);
      border-radius: 2px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
      position: relative;
    }
    
    /* Left Sidebar */
    .sidebar {
      width: 260px;
      background: var(--primary-color);
      color: white;
      padding: 40px 30px;
      float: left;
      height: 100%;
      min-height: 1000px;
    }
    
    /* Main Content */
    .main-content {
      margin-left: 260px;
      padding: 40px 45px;
    }
    
    /* Name */
    .name {
      font-family: var(--heading-font), serif;
      font-size: ${Math.round(baseFontSize * 2.4615)}px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 5px;
      letter-spacing: 0.5px;
    }

    /* Role */
    .role {
      font-size: ${Math.round(baseFontSize * 1.2308)}px;
      color: #ecf0f1;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Title */
    .title {
      font-size: ${Math.round(baseFontSize * 1.0769)}px;
      color: #ecf0f1;
      margin-bottom: 30px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Profile Image - Only shown when image exists */
    .profile-image {
      position: absolute;
      top: 40px;
      right: 30px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px solid #3498db;
      overflow: hidden;
      z-index: 2;
    }
    .profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    /* Sidebar Sections */
    .sidebar-section {
      margin-bottom: 35px;
    }
    
    .sidebar-title {
      font-family: var(--heading-font), serif;
      font-size: ${Math.round(baseFontSize * 1.3846)}px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding-bottom: 8px;
      border-bottom: 2px solid #3498db;
    }
    
    /* Contact Info in Education Section */
    .education-contact {
      background: #34495e;
      padding: 15px;
      border-radius: 4px;
      margin-top: 10px;
    }
    
    .contact-item {
      margin-bottom: 8px;
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #ecf0f1;
    }

    .contact-item a {
      color: #ecf0f1;
      text-decoration: none;
      border-bottom: 1px dotted #3498db;
    }
    
    .contact-item a:hover {
      color: #3498db;
    }
    
    /* Skills List */
    .skills-list {
      list-style: none;
      padding-left: 0;
    }
    
    .skill-item {
      margin-bottom: 10px;
      padding-left: 15px;
      position: relative;
      color: #ecf0f1;
      font-size: ${baseFontSize}px;
    }
    
    .skill-item:before {
      content: "•";
      color: #3498db;
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    
    /* Main Content Sections */
    .section {
      margin-bottom: 35px;
    }
    
    .section-title {
      font-family: var(--heading-font), serif;
      font-size: ${Math.round(baseFontSize * 1.5385)}px;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding-bottom: 8px;
      border-bottom: 2px solid #3498db;
      position: relative;
    }
    
    /* Experience Items */
    .experience-item {
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .experience-item:last-child {
      border-bottom: none;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    
    .experience-title {
      font-size: ${Math.round(baseFontSize * 1.1538)}px;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 4px;
    }
    
    .experience-company {
      font-size: ${baseFontSize}px;
      color: #3498db;
      font-weight: 500;
    }
    
    .experience-date {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #7f8c8d;
      font-weight: 500;
    }
    
    .experience-description {
      font-size: ${baseFontSize}px;
      color: #34495e;
      line-height: 1.6;
      margin-top: 10px;
    }

    .experience-description ul {
      margin: 8px 0 8px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .experience-description li {
      margin: 4px 0;
      padding: 0;
      color: #34495e;
    }

    .experience-description b {
      font-weight: 700;
      color: var(--primary-color);
    }
    
    /* Summary Box */
    .summary-box {
      background: #f8f9fa;
      padding: 20px;
      border-left: 4px solid #3498db;
      border-radius: 4px;
      margin-top: 10px;
    }
    
    .summary-text {
      font-size: ${baseFontSize}px;
      line-height: 1.7;
      color: #34495e;
    }
    
    /* Education Items */
    .education-item {
      margin-bottom: 25px;
      padding-bottom: 18px;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .education-item:last-child {
      border-bottom: none;
    }
    
    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }
    
    .education-degree {
      font-size: ${Math.round(baseFontSize * 1.0769)}px;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 5px;
    }
    
    .education-school {
      font-size: ${baseFontSize}px;
      color: #7f8c8d;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .education-field {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #3498db;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .education-location {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #95a5a6;
      margin-bottom: 6px;
    }
    
    .education-date {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #7f8c8d;
      font-weight: 500;
    }
    
    .education-description {
      font-size: ${baseFontSize}px;
      color: #34495e;
      line-height: 1.6;
      margin-top: 10px;
    }

    .education-description ul {
      margin: 8px 0 8px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .education-description li {
      margin: 4px 0;
      padding: 0;
      color: #34495e;
    }

    .education-description b {
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .education-achievements {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid #bdc3c7;
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      font-weight: 600;
      color: #3498db;
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
      margin-bottom: 4px;
      color: #34495e;
      font-size: ${baseFontSize}px;
    }

    .education-achievements li:before {
      content: "•";
      color: #3498db;
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    
    /* Projects */
    .project-item {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .project-item:last-child {
      border-bottom: none;
    }
    
    .project-name {
      font-size: ${Math.round(baseFontSize * 1.0769)}px;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 5px;
    }
    
    .project-tech {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #3498db;
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .project-description {
      font-size: ${baseFontSize}px;
      color: #34495e;
      line-height: 1.6;
    }

    .project-description ul {
      margin: 8px 0 8px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .project-description li {
      margin: 4px 0;
      padding: 0;
      color: #34495e;
    }

    .project-description b {
      font-weight: 700;
      color: var(--primary-color);
    }
    
    /* Languages */
    .language-item {
      margin-bottom: 10px;
      font-size: ${baseFontSize}px;
      color: #34495e;
    }
    
    .language-name {
      font-weight: 600;
    }
    
    .language-level {
      color: #7f8c8d;
      margin-left: 8px;
    }
    
    /* Hobbies */
    .hobby-item {
      display: inline-block;
      background: #ecf0f1;
      color: var(--primary-color);
      padding: 6px 12px;
      border-radius: 3px;
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      font-weight: 500;
      margin-right: 8px;
      margin-bottom: 8px;
    }

    /* Certification Styles */
    .certification-item {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ecf0f1;
    }

    .certification-item:last-child {
      border-bottom: none;
    }

    .certification-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
    }

    .certification-name {
      font-weight: 600;
      color: var(--primary-color);
      font-size: ${Math.round(baseFontSize * 1.05)}px;
    }

    .certification-date {
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: #7f8c8d;
      font-style: italic;
    }

    .certification-issuer {
      font-size: ${baseFontSize}px;
      color: #3498db;
      margin-bottom: 8px;
    }

    /* Metrics Grid for Professional Context */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .metric-item {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 4px;
      border-left: 3px solid #3498db;
    }

    .metric-value {
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      font-weight: 700;
      color: var(--primary-color);
      line-height: 1.2;
    }

    .metric-label {
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: #7f8c8d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }
    
    /* Clearfix */
    .clearfix:after {
      content: "";
      display: table;
      clear: both;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        float: none;
        min-height: auto;
      }
      
      .main-content {
        margin-left: 0;
        padding: 30px;
      }
      
      .container {
        margin: 20px;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
    
    @media print {
      body { background: white; }
      .container { margin: 0; box-shadow: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="container clearfix">
    <!-- Left Sidebar -->
    <div class="sidebar">
      
      <!-- Name -->
      <div class="name" data-section="personal">${
        data.personal?.name && data.personal?.name !== "undefined"
          ? data.personal.name
          : "Your Name"
      }${data.personal?.middleName ? ` ${data.personal.middleName}` : ""}</div>
      ${
        data.personal?.role
          ? `<div class="title" data-section="personal">${data.personal.role}</div>`
          : ""
      }
      
      <!-- Contact Section -->
      ${
        data.personal?.email ||
        data.personal?.phone ||
        data.personal?.alternatePhone ||
        data.personal?.location ||
        data.personal?.fullAddress ||
        data.personal?.country ||
        data.personal?.pinCode ||
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
        data.personal?.mediumUrl ||
        (data.personal?.personalInfoDisplay === "inline" && (
          data.personal?.fathersName ||
          data.personal?.dob ||
          data.personal?.gender ||
          data.personal?.maritalStatus ||
          data.personal?.nationality
        ))
          ? `
      <div class="sidebar-section">
        <div class="sidebar-title">CONTACT</div>
        <!-- Contact Info -->

        <div class="education-contact" data-section="contact">
          ${
            data.personal?.fullAddress || data.personal?.location || data.personal?.country || data.personal?.pinCode
              ? (() => {
                  const addressParts = [
                    data.personal?.fullAddress,
                    data.personal?.location,
                    data.personal?.country,
                    data.personal?.pinCode
                  ].filter(Boolean);
                  return `<div class="contact-item" data-section="contact">${addressParts.join(", ")}</div>`;
                })()
              : ""
          }
          ${
            data.personal?.phone
              ? `<div class="contact-item" data-section="contact">📞 ${data.personal.phone}</div>`
              : ""
          }
          ${
            data.personal?.alternatePhone
              ? `<div class="contact-item" data-section="contact">📞 ${data.personal.alternatePhone} (Alt)</div>`
              : ""
          }
          ${
            data.personal?.email
              ? `<div class="contact-item" data-section="contact">✉️ ${data.personal.email}</div>`
              : ""
          }
          ${
            data.personal?.personalInfoDisplay === "inline"
              ? (() => {
                  const inlineItems = [];
                  if (data.personal?.fathersName) inlineItems.push(`Father: ${data.personal.fathersName}`);
                  if (data.personal?.dob) inlineItems.push(`DOB: ${data.personal.dob}`);
                  if (data.personal?.gender) inlineItems.push(`Gender: ${data.personal.gender}`);
                  if (data.personal?.maritalStatus) inlineItems.push(`Marital: ${data.personal.maritalStatus}`);
                  if (data.personal?.nationality) inlineItems.push(`Nationality: ${data.personal.nationality}`);
                  
                  return inlineItems.map((item, index) => `
                    <div class="contact-item" data-section="contact" data-index="personal-${index}">${item}</div>
                  `).join('');
                })()
              : ""
          }
          ${
            data.personal?.linkedinUrl
              ? `<div class="contact-item" data-section="contact"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>`
              : ""
          }
          ${
            data.personal?.githubUrl
              ? `<div class="contact-item" data-section="contact"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>`
              : ""
          }
          ${
            data.personal?.portfolioUrl
              ? `<div class="contact-item" data-section="contact"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>`
              : ""
          }
          ${
            data.personal?.website
              ? `<div class="contact-item" data-section="contact"><a href="${data.personal.website}" target="_blank">Website</a></div>`
              : ""
          }
          ${
            data.personal?.twitterUrl
              ? `<div class="contact-item" data-section="contact"><a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></div>`
              : ""
          }
          ${
            data.personal?.facebookUrl
              ? `<div class="contact-item" data-section="contact"><a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></div>`
              : ""
          }
          ${
            data.personal?.instagramUrl
              ? `<div class="contact-item" data-section="contact"><a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></div>`
              : ""
          }
          ${
            data.personal?.behanceUrl
              ? `<div class="contact-item" data-section="contact"><a href="${data.personal.behanceUrl}" target="_blank">Behance</a></div>`
              : ""
          }
          ${
            data.personal?.dribbbleUrl
              ? `<div class="contact-item" data-section="contact"><a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></div>`
              : ""
          }
          ${
            data.personal?.stackoverflowUrl
              ? `<div class="contact-item" data-section="contact"><a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></div>`
              : ""
          }
          ${
            data.personal?.mediumUrl
              ? `<div class="contact-item" data-section="contact"><a href="${data.personal.mediumUrl}" target="_blank">Medium</a></div>`
              : ""
          }
        </div>
      </div>
      `
          : ""
      }
      
      <!-- Skills Section -->
      ${
        nonEmptySkills.length > 0
          ? `<div class="sidebar-section">
        <div class="sidebar-title">SKILLS</div>

        <ul class="skills-list" data-section="skills">
          ${nonEmptySkills
            .map(
              (skill: any, index: number) => `
            <li class="skill-item" data-section="skills" data-index="${index}">${
                typeof skill === "string" ? skill.trim() : skill
              }</li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Tools & Technologies (in sidebar) -->
      ${
        nonEmptyToolsTechnologies.length > 0
          ? `<div class="sidebar-section">
        <div class="sidebar-title">TOOLS & TECH</div>
        <ul class="skills-list" data-section="toolsTechnologies">
          ${nonEmptyToolsTechnologies
            .map(
              (item: any, index: number) => `
            <li class="skill-item" data-section="toolsTechnologies" data-index="${index}">
              ${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration}` : ''}
            </li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Methodologies (in sidebar) -->
      ${
        nonEmptyMethodologies.length > 0
          ? `<div class="sidebar-section">
        <div class="sidebar-title">METHODOLOGIES</div>
        <ul class="skills-list" data-section="methodologies">
          ${nonEmptyMethodologies
            .map(
              (item: any, index: number) => `
            <li class="skill-item" data-section="methodologies" data-index="${index}">
              ${item.name || ''}${item.certification ? ` (${item.certification})` : ''}${item.experienceDuration ? ` - ${item.experienceDuration} years` : ''}
            </li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Industry Expertise (in sidebar) -->
      ${
        nonEmptyIndustryExpertise.length > 0
          ? `<div class="sidebar-section">
        <div class="sidebar-title">INDUSTRY EXPERTISE</div>
        <ul class="skills-list" data-section="industryExpertise">
          ${nonEmptyIndustryExpertise
            .map(
              (item: any, index: number) => `
            <li class="skill-item" data-section="industryExpertise" data-index="${index}">
              ${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}
            </li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Languages Section (in sidebar) -->
      ${
        data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0
          ? `<div class="sidebar-section">
        <div class="sidebar-title">LANGUAGES</div>
        <ul class="skills-list" data-section="languages">
          ${(data.languages || [])
            .map(
              (lang: any, index: number) => `
            <li class="skill-item" data-section="languages" data-index="${index}">
              ${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}
            </li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Hobbies Section (in sidebar) -->
      ${
        data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
          ? `<div class="sidebar-section">
        <div class="sidebar-title">HOBBIES</div>
        <div>
          ${(data.hobbies || [])
            .map(
              (hobby: any, index: number) => `
            <span class="hobby-item" data-section="hobbies" data-index="${index}">${hobby}</span>
          `
            )
            .join("")}
        </div>
      </div>`
          : ""
      }

      <!-- Certifications (in sidebar if few) -->
      ${
        data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 0 && data.certifications.length <= 3
          ? `<div class="sidebar-section">
        <div class="sidebar-title">CERTIFICATIONS</div>
        <ul class="skills-list">
          ${(data.certifications || [])
            .map(
              (cert: any, index: number) => `
            <li class="skill-item" data-section="certifications" data-index="${index}">
              ${cert.name || ""}${cert.issuer ? ` - ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}
            </li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Availability & Work Authorization (in sidebar) -->
      ${
        data.availabilityWorkAuth && Object.values(data.availabilityWorkAuth).some(v => v)
          ? `<div class="sidebar-section">
        <div class="sidebar-title">AVAILABILITY</div>
        <ul class="skills-list">
          ${data.availabilityWorkAuth.availabilityNoticePeriod ? `<li class="skill-item">Notice: ${data.availabilityWorkAuth.availabilityNoticePeriod}</li>` : ''}
          ${data.availabilityWorkAuth.workAuthorizationStatus ? `<li class="skill-item">Work Auth: ${data.availabilityWorkAuth.workAuthorizationStatus}</li>` : ''}
          ${data.availabilityWorkAuth.preferredLocation ? `<li class="skill-item">Preferred: ${data.availabilityWorkAuth.preferredLocation}</li>` : ''}
        </ul>
      </div>`
          : ""
      }

      <!-- Social Profiles (in sidebar) -->
      ${
        nonEmptySocialProfiles.length > 0
          ? `<div class="sidebar-section">
        <div class="sidebar-title">SOCIAL PROFILES</div>
        <ul class="skills-list">
          ${nonEmptySocialProfiles
            .map(
              (profile: any, index: number) => `
            <li class="skill-item" data-section="socialProfiles" data-index="${index}">
              <a href="${profile.url}" target="_blank" style="color: white;">${profile.platform || "Profile"}</a>
            </li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
      <!-- Professional Context -->
      ${
        data.professionalContext && Object.values(data.professionalContext).some(v => v)
          ? `
      <div class="section" data-section="professionalContext">
        <div class="section-title">PROFESSIONAL CONTEXT</div>
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

      <!-- Summary Section -->
      ${
        data.sectionVisibility?.summary !== false && data.summary
          ? `<div class="section" data-section="summary">
        <div class="section-title" data-section="summary">SUMMARY</div>
        <div class="summary-box" data-section="summary">
          <p class="summary-text" data-section="summary">${data.summary}</p>
        </div>
      </div>`
          : ""
      }

      <!-- Career Objective -->
      ${
        typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
          ? `<div class="section" data-section="careerObjective">
        <div class="section-title" data-section="careerObjective">CAREER OBJECTIVE</div>
        <div class="summary-box" data-section="careerObjective">
          <p class="summary-text">${data.careerObjective}</p>
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
          ? `<div class="section" data-section="personal">
        <div class="section-title" data-section="personal">PERSONAL DETAILS</div>
        <div class="summary-box" style="background: #f8f9fa; padding: 15px;">
          <ul style="list-style: none; padding-left: 0;" data-section="personal">
            ${
              data.personal?.fathersName
                ? `<li style="margin-bottom: 8px;" data-section="personal"><strong>Father's Name:</strong> ${data.personal.fathersName}</li>`
                : ""
            }
            ${
              data.personal?.dob
                ? `<li style="margin-bottom: 8px;" data-section="personal"><strong>Date of Birth:</strong> ${data.personal.dob}</li>`
                : ""
            }
            ${
              data.personal?.gender
                ? `<li style="margin-bottom: 8px;" data-section="personal"><strong>Gender:</strong> ${data.personal.gender}</li>`
                : ""
            }
            ${
              data.personal?.maritalStatus
                ? `<li style="margin-bottom: 8px;" data-section="personal"><strong>Marital Status:</strong> ${data.personal.maritalStatus}</li>`
                : ""
            }
            ${
              data.personal?.nationality
                ? `<li style="margin-bottom: 8px;" data-section="personal"><strong>Nationality:</strong> ${data.personal.nationality}</li>`
                : ""
            }
            ${
              data.personal?.passportNo
                ? `<li style="margin-bottom: 8px;" data-section="personal"><strong>Passport No:</strong> ${data.personal.passportNo}</li>`
                : ""
            }
          </ul>
        </div>
      </div>`
          : ""
      }
      
      <!-- Work Experience -->
      ${
        data.sectionVisibility?.experience !== false &&
        data.experience &&
        data.experience.length > 0
          ? `<div class="section" data-section="experience">
        <div class="section-title" data-section="experience">EXPERIENCE</div>
        ${(data.experience || [])
          .map(
            (exp: any, index: number) => `
          <div class="experience-item" data-section="experience" data-index="${index}">
            <div class="experience-header" data-section="experience" data-index="${index}">
              <div>
                <div class="experience-title" data-section="experience" data-index="${index}">${
              exp.title || ""
            }</div>
                <div class="experience-company" data-section="experience" data-index="${index}">${formatSubtitle([exp.company, exp.location])}</div>
              </div>
              <div class="experience-date" data-section="experience" data-index="${index}">${formatDateRange(exp.startDate, exp.endDate)}</div>
            </div>
            <div class="experience-description" data-section="experience" data-index="${index}">${
              exp.description || ""
            }</div>
            ${exp.achievements ? `<div class="experience-description" style="margin-top: 8px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ""}
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
        <div class="section-title" data-section="internships">INTERNSHIPS</div>
        ${nonEmptyInternships
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="internships" data-index="${index}">
            <div class="experience-header" data-section="internships" data-index="${index}">
              <div>
                <div class="experience-title" data-section="internships" data-index="${index}">${item.title || ""}</div>
                <div class="experience-company" data-section="internships" data-index="${index}">${item.company || ""}</div>
              </div>
              <div class="experience-date" data-section="internships" data-index="${index}">${item.duration || ""}</div>
            </div>
            <div class="experience-description" data-section="internships" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="trainingPrograms">TRAINING PROGRAMS</div>
        ${nonEmptyTrainingPrograms
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="trainingPrograms" data-index="${index}">
            <div class="experience-header" data-section="trainingPrograms" data-index="${index}">
              <div>
                <div class="experience-title" data-section="trainingPrograms" data-index="${index}">${item.name || ""}</div>
                <div class="experience-company" data-section="trainingPrograms" data-index="${index}">${item.provider || item.organization || ""}</div>
              </div>
              <div class="experience-date" data-section="trainingPrograms" data-index="${index}">${item.completionDate || ""}${item.duration ? ` • ${item.duration}` : ""}</div>
            </div>
            <div class="experience-description" data-section="trainingPrograms" data-index="${index}">${item.description || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }
      
      <!-- Education Section -->
      ${
        data.sectionVisibility?.education !== false &&
        data.education &&
        data.education.length > 0
          ? `<div class="section" data-section="education">
        <div class="section-title" data-section="education">EDUCATION</div>
        ${(data.education || [])
          .map(
            (edu: any, index: number) => `
          <div class="education-item" data-section="education" data-index="${index}">
            <div class="education-header" data-section="education" data-index="${index}">
              <div class="education-degree" data-section="education" data-index="${index}">
                ${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}${edu.qualification ? ` (${edu.qualification})` : ""}
              </div>
              <div class="education-date" data-section="education" data-index="${index}">${edu.graduationDate || ""}</div>
            </div>
            ${
              edu.school
                ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}${edu.location ? `, ${edu.location}` : ""}</div>`
                : ""
            }
            ${
              edu.grade
                ? `<div class="education-field" data-section="education" data-index="${index}"> ${edu.grade}</div>`
                : ""
            }
            
            ${
              edu.description
                ? `
              <div class="education-description" data-section="education" data-index="${index}">
                ${edu.description}
              </div>
            `
                : ""
            }
            
            ${
              edu.achievements && edu.achievements.length > 0
                ? `
              <div class="education-achievements" data-section="education" data-index="${index}">
                <h4>Achievements & Highlights</h4>
                <ul>
                  ${edu.achievements
                    .filter((achievement: string) => achievement.trim())
                    .map(
                      (achievement: string, achIndex: number) =>
                        `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`
                    )
                    .join("")}
                </ul>
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
          ? `<div class="section">
        <div class="section-title">PROJECTS</div>
        ${(data.projects || [])
          .map(
            (project: any, index: number) => `
          <div class="project-item" data-section="projects" data-index="${index}">
            <div class="project-name" data-section="projects" data-index="${index}">${
              project.name || ""
            }</div>
            ${(() => {
              const dateRange = formatDateRange(project.startDate, project.endDate);
              return dateRange ? `<div class="project-tech" data-section="projects" data-index="${index}" style="margin-bottom: 5px;">${dateRange}</div>` : "";
            })()}
            ${
              project.technologies
                ? `<div class="project-tech" data-section="projects" data-index="${index}">${project.technologies}</div>`
                : ""
            }
            <div class="project-description" data-section="projects" data-index="${index}">${
              project.description || ""
            }</div>
            ${
              project.url
                ? `<div style="margin-top: 8px;">
              <a href="${
                project.url
              }" target="_blank" style="font-size: ${Math.round(
                    baseFontSize * 0.9231
                  )}px; color: #3498db; font-weight: 500; text-decoration: none;">${
                    project.urlText || "View Project"
                  }</a>
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
        <div class="section-title" data-section="academicProjects">ACADEMIC PROJECTS</div>
        ${nonEmptyAcademicProjects
          .map(
            (item: any, index: number) => `
          <div class="project-item" data-section="academicProjects" data-index="${index}">
            <div class="project-name" data-section="academicProjects" data-index="${index}">${item.name || item.title || ""}</div>
            <div class="project-tech" data-section="academicProjects" data-index="${index}">${formatSubtitle([item.duration, item.institution, item.course ? `Course: ${item.course}` : ""])}</div>
            <div class="project-description" data-section="academicProjects" data-index="${index}">${item.description || ""}</div>
            ${
              item.technologies
                ? `<div class="project-description" style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>`
                : ""
            }
            ${
              item.url
                ? `<div style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: #3498db;">View Project</a></div>`
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
        <div class="section-title" data-section="clientProjects">CLIENT PROJECTS</div>
        ${nonEmptyClientProjects
          .map(
            (item: any, index: number) => `
          <div class="project-item" data-section="clientProjects" data-index="${index}">
            <div class="project-name" data-section="clientProjects" data-index="${index}">${item.name || ""}</div>
            <div class="project-tech" data-section="clientProjects" data-index="${index}">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : "", item.duration])}</div>
            <div class="project-description" data-section="clientProjects" data-index="${index}">${item.description || ""}</div>
            ${
              item.toolsTechnologies
                ? `<div class="project-description" style="margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</div>`
                : ""
            }
            ${
              item.projectUrl
                ? `<div style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank" style="color: #3498db;">View Project</a></div>`
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
        <div class="section-title" data-section="portfolio">PORTFOLIO</div>
        ${nonEmptyPortfolio
          .map(
            (item: any, index: number) => `
          <div class="project-item" data-section="portfolio" data-index="${index}">
            <div class="project-name" data-section="portfolio" data-index="${index}">${item.name || ""}</div>
            <div class="project-tech" data-section="portfolio" data-index="${index}">${formatSubtitle([item.type, item.platform])}</div>
            <div class="project-description" data-section="portfolio" data-index="${index}">${item.description || ""}</div>
            ${
              item.url
                ? `<div style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="color: #3498db;">View Portfolio</a></div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Leadership & Positions -->
      ${
        nonEmptyLeadershipPositions.length > 0
          ? `<div class="section" data-section="leadershipPositions">
        <div class="section-title" data-section="leadershipPositions">LEADERSHIP & POSITIONS</div>
        ${nonEmptyLeadershipPositions
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="leadershipPositions" data-index="${index}">
            <div class="experience-header" data-section="leadershipPositions" data-index="${index}">
              <div>
                <div class="experience-title" data-section="leadershipPositions" data-index="${index}">${item.position || item.title || ""}</div>
                <div class="experience-company" data-section="leadershipPositions" data-index="${index}">${item.organization || ""}</div>
              </div>
              <div class="experience-date" data-section="leadershipPositions" data-index="${index}">${formatDateRange(item.startDate, item.endDate)}</div>
            </div>
            <div class="experience-description" data-section="leadershipPositions" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="volunteering">VOLUNTEERING</div>
        ${nonEmptyVolunteering
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="volunteering" data-index="${index}">
            <div class="experience-header" data-section="volunteering" data-index="${index}">
              <div>
                <div class="experience-title" data-section="volunteering" data-index="${index}">${item.role || ""}</div>
                <div class="experience-company" data-section="volunteering" data-index="${index}">${formatSubtitle([item.organization, item.causeArea])}</div>
              </div>
              <div class="experience-date" data-section="volunteering" data-index="${index}">${item.duration || ""}</div>
            </div>
            <div class="experience-description" data-section="volunteering" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="militaryService">MILITARY SERVICE</div>
        ${nonEmptyMilitaryService
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="militaryService" data-index="${index}">
            <div class="experience-header" data-section="militaryService" data-index="${index}">
              <div>
                <div class="experience-title" data-section="militaryService" data-index="${index}">${item.rank ? `${item.rank} - ${item.branch}` : item.branch || ""}</div>
                <div class="experience-company" data-section="militaryService" data-index="${index}">${item.specialization || ""}</div>
              </div>
              <div class="experience-date" data-section="militaryService" data-index="${index}">${item.duration || ""}</div>
            </div>
            <div class="experience-description" data-section="militaryService" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="teachingExperience">TEACHING EXPERIENCE</div>
        ${nonEmptyTeachingExperience
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="teachingExperience" data-index="${index}">
            <div class="experience-header" data-section="teachingExperience" data-index="${index}">
              <div>
                <div class="experience-title" data-section="teachingExperience" data-index="${index}">${item.title || ""}</div>
                <div class="experience-company" data-section="teachingExperience" data-index="${index}">${formatSubtitle([item.institution, item.subjectCourseTaught])}</div>
              </div>
              <div class="experience-date" data-section="teachingExperience" data-index="${index}">${item.duration || ""}</div>
            </div>
            <div class="experience-description" data-section="teachingExperience" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="mentorshipExperience">MENTORSHIP EXPERIENCE</div>
        ${nonEmptyMentorshipExperience
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="mentorshipExperience" data-index="${index}">
            <div class="experience-header" data-section="mentorshipExperience" data-index="${index}">
              <div>
                <div class="experience-title" data-section="mentorshipExperience" data-index="${index}">${item.mentorshipArea || ""}</div>
                <div class="experience-company" data-section="mentorshipExperience" data-index="${index}">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ""])}</div>
              </div>
              <div class="experience-date" data-section="mentorshipExperience" data-index="${index}">${item.duration || ""}</div>
            </div>
            <div class="experience-description" data-section="mentorshipExperience" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="researchGrants">RESEARCH GRANTS</div>
        ${nonEmptyResearchGrants
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="researchGrants" data-index="${index}">
            <div class="experience-header" data-section="researchGrants" data-index="${index}">
              <div>
                <div class="experience-title" data-section="researchGrants" data-index="${index}">${item.title || ""}</div>
                <div class="experience-company" data-section="researchGrants" data-index="${index}">${formatSubtitle([item.agency, item.amount])}</div>
              </div>
              <div class="experience-date" data-section="researchGrants" data-index="${index}">${item.year || ""}</div>
            </div>
            <div class="experience-description" data-section="researchGrants" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="publications">PUBLICATIONS</div>
        ${nonEmptyPublications
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="publications" data-index="${index}">
            <div class="experience-header" data-section="publications" data-index="${index}">
              <div>
                <div class="experience-title" data-section="publications" data-index="${index}">${item.title || ""}</div>
                <div class="experience-company" data-section="publications" data-index="${index}">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
              </div>
              <div class="experience-date" data-section="publications" data-index="${index}">${item.year || ""}</div>
            </div>
            ${item.authors ? `<div class="experience-description"><strong>Authors:</strong> ${item.authors}</div>` : ""}
            ${
              item.urlDoi
                ? `<div style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank" style="color: #3498db;">View Publication</a></div>`
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
        <div class="section-title" data-section="patents">PATENTS</div>
        ${nonEmptyPatents
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="patents" data-index="${index}">
            <div class="experience-header" data-section="patents" data-index="${index}">
              <div>
                <div class="experience-title" data-section="patents" data-index="${index}">${item.title || ""}</div>
                <div class="experience-company" data-section="patents" data-index="${index}">${formatSubtitle([item.patentNumber, item.issuingAuthority])}</div>
              </div>
              <div class="experience-date" data-section="patents" data-index="${index}">${item.year || ""} • Status: ${item.status || ""}</div>
            </div>
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
        <div class="section-title" data-section="testScores">TEST SCORES</div>
        ${nonEmptyTestScores
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="testScores" data-index="${index}">
            <div class="experience-header" data-section="testScores" data-index="${index}">
              <div>
                <div class="experience-title" data-section="testScores" data-index="${index}">${item.testName || ""}</div>
                <div class="experience-company" data-section="testScores" data-index="${index}">Score: ${item.score || ""}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ""}</div>
              </div>
              <div class="experience-date" data-section="testScores" data-index="${index}">${item.year || ""}</div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Certifications (if many, show in main content) -->
      ${
        data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 3
          ? `<div class="section">
        <div class="section-title">CERTIFICATIONS</div>
        ${(data.certifications || [])
          .map(
            (cert: any, index: number) => `
          <div class="certification-item" data-section="certifications" data-index="${index}">
            <div class="certification-header" data-section="certifications" data-index="${index}">
              <div class="certification-name" data-section="certifications" data-index="${index}">${
              cert.name || ""
            }</div>
              <div class="certification-date" data-section="certifications" data-index="${index}">${
              cert.date || ""
            }</div>
            </div>
            <div class="certification-issuer" data-section="certifications" data-index="${index}">${
              cert.issuer || ""
            }</div>
            ${cert.description ? `<div class="experience-description">${cert.description}</div>` : ""}
            ${
              cert.url
                ? `<div style="margin-top: 8px;">
              <a href="${
                cert.url
              }" target="_blank" style="font-size: ${Math.round(
                    baseFontSize * 0.9231
                  )}px; color: #3498db; font-weight: 500; text-decoration: none;">View Certificate</a>
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
        <div class="section-title" data-section="scholarships">SCHOLARSHIPS</div>
        ${nonEmptyScholarships
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="scholarships" data-index="${index}">
            <div class="experience-header" data-section="scholarships" data-index="${index}">
              <div>
                <div class="experience-title" data-section="scholarships" data-index="${index}">${item.name || ""}</div>
                <div class="experience-company" data-section="scholarships" data-index="${index}">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
              </div>
              <div class="experience-date" data-section="scholarships" data-index="${index}">${item.year || ""}</div>
            </div>
            <div class="experience-description" data-section="scholarships" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="awards">AWARDS</div>
        ${nonEmptyAwards
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="awards" data-index="${index}">
            <div class="experience-header" data-section="awards" data-index="${index}">
              <div>
                <div class="experience-title" data-section="awards" data-index="${index}">${item.title || ""}</div>
                <div class="experience-company" data-section="awards" data-index="${index}">${item.organization || ""}</div>
              </div>
              <div class="experience-date" data-section="awards" data-index="${index}">${item.issueYear || ""}</div>
            </div>
            <div class="experience-description" data-section="awards" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="speakingEngagements">SPEAKING ENGAGEMENTS</div>
        ${nonEmptySpeakingEngagements
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="speakingEngagements" data-index="${index}">
            <div class="experience-header" data-section="speakingEngagements" data-index="${index}">
              <div>
                <div class="experience-title" data-section="speakingEngagements" data-index="${index}">${item.topic || ""}</div>
                <div class="experience-company" data-section="speakingEngagements" data-index="${index}">${item.eventName || ""}</div>
              </div>
              <div class="experience-date" data-section="speakingEngagements" data-index="${index}">${item.date || ""}</div>
            </div>
            <div class="experience-description" data-section="speakingEngagements" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="memberships">MEMBERSHIPS</div>
        ${nonEmptyMemberships
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="memberships" data-index="${index}">
            <div class="experience-header" data-section="memberships" data-index="${index}">
              <div>
                <div class="experience-title" data-section="memberships" data-index="${index}">${item.membershipName || ""}</div>
                <div class="experience-company" data-section="memberships" data-index="${index}">${item.organizationName || ""}</div>
              </div>
              <div class="experience-date" data-section="memberships" data-index="${index}">${item.year || ""}</div>
            </div>
            <div class="experience-description" data-section="memberships" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="workshops">WORKSHOPS</div>
        ${nonEmptyWorkshops
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="workshops" data-index="${index}">
            <div class="experience-header" data-section="workshops" data-index="${index}">
              <div>
                <div class="experience-title" data-section="workshops" data-index="${index}">${item.programTitle || ""}</div>
                <div class="experience-company" data-section="workshops" data-index="${index}">${item.conductedBy || ""}</div>
              </div>
              <div class="experience-date" data-section="workshops" data-index="${index}">${item.year || ""}</div>
            </div>
            <div class="experience-description" data-section="workshops" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="coCurricular">CO-CURRICULAR ACTIVITIES</div>
        ${nonEmptyCoCurricular
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="coCurricular" data-index="${index}">
            <div class="experience-header" data-section="coCurricular" data-index="${index}">
              <div>
                <div class="experience-title" data-section="coCurricular" data-index="${index}">${item.activity || ""}</div>
                <div class="experience-company" data-section="coCurricular" data-index="${index}">${formatSubtitle([item.organization, item.role])}</div>
              </div>
              <div class="experience-date" data-section="coCurricular" data-index="${index}">${item.year || ""}</div>
            </div>
            <div class="experience-description" data-section="coCurricular" data-index="${index}">${item.description || ""}</div>
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
        <div class="section-title" data-section="extracurricular">EXTRACURRICULAR ACTIVITIES</div>
        ${nonEmptyExtracurricular
          .map(
            (item: any, index: number) => `
          <div class="experience-item" data-section="extracurricular" data-index="${index}">
            <div class="experience-header" data-section="extracurricular" data-index="${index}">
              <div>
                <div class="experience-title" data-section="extracurricular" data-index="${index}">${item.activity || ""}</div>
                <div class="experience-company" data-section="extracurricular" data-index="${index}">${formatSubtitle([item.organization, item.role])}</div>
              </div>
              <div class="experience-date" data-section="extracurricular" data-index="${index}">${item.year || ""}</div>
            </div>
            <div class="experience-description" data-section="extracurricular" data-index="${index}">${item.description || ""}</div>
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }

      <!-- Languages (if not in sidebar) -->
      ${
        data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0 && data.languages.length > 5
          ? `<div class="section">
        <div class="section-title">LANGUAGES</div>
        <div class="languages-list" data-section="languages">
          ${(data.languages || [])
            .map(
              (lang: any, index: number) => `
            <div class="language-item" data-section="languages" data-index="${index}">${
                lang.language || lang
              }${lang.level ? ` (${lang.level})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</div>
          `
            )
            .join("")}
        </div>
      </div>`
          : ""
      }

      <!-- Hobbies (if not in sidebar) -->
      ${
        data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0 && data.hobbies.length > 8
          ? `<div class="section">
        <div class="section-title">HOBBIES & INTERESTS</div>
        <div class="hobbies-list" data-section="hobbies">
          ${(data.hobbies || [])
            .map(
              (hobby: any, index: number) => `
            <div class="hobby-item" data-section="hobbies" data-index="${index}">${hobby}</div>
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
          ? `<div class="section">
        <div class="section-title">SOCIAL LINKS</div>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px;" data-section="socialLinks">
          ${data.socialLinks
            .map(
              (link: any, index: number) => `
            <a href="${
              link.url
            }" target="_blank" style="color: #3498db; text-decoration: none; font-weight: 500; font-size: ${baseFontSize}px; border-bottom: 1px dotted #3498db;" data-section="socialLinks" data-index="${index}">${
                link.urlText ||
                link.url.replace("https://", "").replace("http://", "")
              }</a>
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
        <div class="section-title" data-section="references">REFERENCES</div>
        ${nonEmptyReferences
          .map(
            (ref: any, index: number) => `
          <div class="experience-item" data-section="references" data-index="${index}">
            <div class="experience-header" data-section="references" data-index="${index}">
              <div>
                <div class="experience-title" data-section="references" data-index="${index}">${ref.name || ""}</div>
                <div class="experience-company" data-section="references" data-index="${index}">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
              </div>
            </div>
            <div class="experience-description" data-section="references" data-index="${index}">${ref.contactInformation || ""}</div>
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
        <div class="section-title" data-section="keyAchievements">KEY ACHIEVEMENTS</div>
        <ul style="list-style: none; padding-left: 0;" data-section="keyAchievements">
          ${nonEmptyKeyAchievements
            .map(
              (achievement: string, index: number) =>
                `<li style="margin-bottom: 8px; color: #34495e; position: relative; padding-left: 15px;" data-section="keyAchievements" data-index="${index}">
                  <span style="position: absolute; left: 0; color: #3498db;">•</span> ${achievement}
                </li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Key Responsibilities -->
      ${
        nonEmptyResponsibilities.length > 0
          ? `<div class="section" data-section="responsibilities">
        <div class="section-title" data-section="responsibilities">KEY RESPONSIBILITIES</div>
        <ul style="list-style: none; padding-left: 0;" data-section="responsibilities">
          ${nonEmptyResponsibilities
            .map(
              (line: string, index: number) =>
                `<li style="margin-bottom: 8px; color: #34495e; position: relative; padding-left: 15px;" data-section="responsibilities" data-index="${index}">
                  <span style="position: absolute; left: 0; color: #3498db;">•</span> ${line.trim()}
                </li>`
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }

      <!-- Tools (Simple List) -->
      ${
        nonEmptyTools.length > 0
          ? `<div class="section" data-section="tools">
        <div class="section-title" data-section="tools">TOOLS</div>
        <ul style="list-style: none; padding-left: 0;" data-section="tools">
          ${nonEmptyTools
            .map(
              (line: string, index: number) =>
                `<li style="margin-bottom: 8px; color: #34495e; position: relative; padding-left: 15px;" data-section="tools" data-index="${index}">
                  <span style="position: absolute; left: 0; color: #3498db;">•</span> ${line.trim()}
                </li>`
            )
            .join("")}
        </ul>
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
          <div class="section-title" data-section="custom-${sectionIndex}">${
            section.heading || "Custom Section"
          }</div>
          ${
            section.entries && section.entries.length > 0
              ? section.entries
                  .filter((entry: any) => entry.isVisible)
                  .map(
                    (entry: any, entryIndex: number) => `
            <div class="experience-item" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
              <div class="experience-header" data-section="custom-${sectionIndex}" data-index="${entryIndex}">
                <div>
                  ${
                    entry.title || entry.organization
                      ? `<div class="experience-title" data-section="custom-${sectionIndex}" data-index="${entryIndex}">${
                          entry.title || ""
                        }${entry.title && entry.organization ? " at " : ""}${
                          entry.organization || ""
                        }</div>`
                      : ""
                  }
                </div>
                ${
                  entry.date
                    ? `<div class="experience-date" data-section="custom-${sectionIndex}" data-index="${entryIndex}">${entry.date}</div>`
                    : ""
                }
              </div>
              ${
                entry.description
                  ? `<div class="experience-description" data-section="custom-${sectionIndex}" data-index="${entryIndex}">${entry.description}</div>`
                  : ""
              }
            </div>
          `
                  )
                  .join("")
              : '<div style="color: #7f8c8d; font-style: italic; padding: 15px 0;">No entries in this section</div>'
          }
        </div>
      `
              )
              .join("")
          : ""
      }
    </div>
  </div>
</body>
</html>`;
}