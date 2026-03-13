export function buildProfessionalTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#5B9BD5",
    secondary: "#2c3e50",
    background: "#ffffff",
    sidebarBg: "#5B9BD5",
    sidebarText: "#ffffff",
    headingFont: "Arial",
    bodyFont: "Arial",
  };
  const currentTheme = theme || defaultTheme;

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 11;
  const userFontFamily =
    data.formatting?.fontFamily || data.fontFamily || "Arial, sans-serif";

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.5);
  const subheadingFontSize = Math.round(userFontSize * 1.2);

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
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --sidebar-bg: ${currentTheme.primary || "#5B9BD5"};
      --sidebar-text: ${currentTheme.sidebarText || "#ffffff"};
      --primary-color: ${currentTheme.primary || "#5B9BD5"};
      --background-color: ${currentTheme.background || "#ffffff"};
    }

    body {
      font-family: ${userFontFamily};
      color: #000000;
      line-height: 1.6;
      background: #f5f5f5;
      font-size: ${baseFontSize}px;
    }
    
    .container {
      max-width: 850px;
      margin: 0 auto;
      background: var(--background-color);
      display: grid;
      grid-template-columns: 250px 1fr;
      min-height: 100vh;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    /* Sidebar */
    .sidebar {
      background: var(--sidebar-bg);
      color: var(--sidebar-text);
      padding: 30px 20px;
    }
    
    .profile-photo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #ffffff;
      margin: 0 auto 20px;
      overflow: hidden;
      border: 3px solid rgba(255,255,255,0.3);
    }
    
    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .photo-placeholder {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%);
      border: 3px solid rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.9);
      font-size: ${Math.round(baseFontSize * 0.7)}px;
      text-align: center;
      padding: 10px;
      font-weight: 500;
    }
    
    .sidebar-section {
      margin-bottom: 25px;
    }
    
    .sidebar-title {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid rgba(255,255,255,0.3);
    }
    
    .contact-item {
      margin-bottom: 10px;
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      line-height: 1.5;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    
    .contact-icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    
    .contact-item a {
      color: var(--sidebar-text);
      text-decoration: none;
      word-break: break-word;
    }
    
    .sidebar-list {
      list-style: none;
      padding: 0;
    }
    
    .sidebar-list li {
      margin-bottom: 8px;
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      padding-left: 12px;
      position: relative;
    }
    
    .sidebar-list li:before {
      content: "▪";
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    
    .language-item {
      margin-bottom: 10px;
      font-size: ${Math.round(baseFontSize * 0.85)}px;
    }
    
    .language-name {
      font-weight: 600;
      display: block;
    }
    
    .language-level {
      font-size: ${Math.round(baseFontSize * 0.75)}px;
      opacity: 0.9;
      font-style: italic;
    }
    
    .hobby-item {
      display: inline-block;
      margin: 4px 4px 4px 0;
      padding: 3px 8px;
      background: rgba(255,255,255,0.2);
      border-radius: 3px;
      font-size: ${Math.round(baseFontSize * 0.8)}px;
    }
    
    /* Main Content */
    .main-content {
      padding: 40px 35px;
    }
    
    .header-section {
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 3px solid var(--sidebar-bg);
    }
    
    .name-header {
      font-size: ${Math.round(baseFontSize * 2.8)}px;
      font-weight: 700;
      color: #111;
      margin-bottom: 5px;
      text-transform: none;
      letter-spacing: 0;
      line-height: 1.1;
    }
    
    .name-header .surname {
      color: var(--primary-color);
      display: block;
    }
    
    .role-subtitle {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      color: #7f8c8d;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
    }
    
    .content-section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 700;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
      padding-bottom: 6px;
      border-bottom: 2px solid var(--sidebar-bg);
    }
    
    .summary-text {
      font-size: ${baseFontSize}px;
      line-height: 1.7;
      color: #555;
      text-align: justify;
    }
    
    /* Experience & Education Items */
    .item {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .item-title {
      font-size: ${Math.round(baseFontSize * 1.05)}px;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 4px;
    }
    
    .item-subtitle {
      font-size: ${baseFontSize}px;
      color: #7f8c8d;
      font-weight: 600;
      margin-bottom: 3px;
    }
    
    .item-date {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: #95a5a6;
      font-style: italic;
      margin-bottom: 8px;
    }
    
    .item-description {
      font-size: ${baseFontSize}px;
      color: #555;
      line-height: 1.7;
    }
    
    .item-description ul {
      margin: 10px 0 10px 20px;
      padding: 0;
    }
    
    .item-description li {
      margin: 5px 0;
    }
    
    .item-description b {
      font-weight: 700;
      color: var(--primary-color);
    }
    
    /* Projects */
    .project-name {
      font-size: ${Math.round(baseFontSize * 1.05)}px;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 3px;
    }
    
    .project-tech {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: #7f8c8d;
      font-weight: 600;
      margin-bottom: 6px;
    }
    
    /* Certifications */
    .cert-item {
      margin-bottom: 15px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .cert-item:last-child {
      border-bottom: none;
    }
    
    .cert-name {
      font-weight: 700;
      color: var(--primary-color);
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      margin-bottom: 3px;
    }
    
    .cert-issuer {
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: #7f8c8d;
      margin-bottom: 2px;
    }
    
    .cert-date {
      font-size: ${Math.round(baseFontSize * 0.8)}px;
      color: #95a5a6;
      font-style: italic;
    }
    
    /* Lists */
    .achievement-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .achievement-list li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 8px;
      font-size: ${baseFontSize}px;
      color: #555;
      line-height: 1.6;
    }
    
    .achievement-list li:before {
      content: "▸";
      position: absolute;
      left: 0;
      color: var(--sidebar-bg);
      font-weight: bold;
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
      color: #7f8c8d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }
    
    /* Links */
    a {
      color: var(--sidebar-bg);
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .container {
        grid-template-columns: 1fr;
      }
      
      .sidebar {
        padding: 25px 20px;
      }
      
      .main-content {
        padding: 30px 25px;
      }
    }
    
    @media print {
      body { background: white; }
      .container { 
        box-shadow: none;
        max-width: 100%;
      }
      .sidebar {
        background: var(--sidebar-bg) !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Profile Photo -->
      <div class="profile-photo">
        ${
          data.personal?.photoUrl || data.personal?.image
            ? `<img src="${
                data.personal.photoUrl || data.personal.image
              }" alt="${
                data.personal?.name && data.personal?.name !== "undefined"
                  ? data.personal.name
                  : "Profile Photo"
              }" />`
            : `<div class="photo-placeholder">Profile Photo</div>`
        }
      </div>
      
      <!-- Contact Section -->
      <div class="sidebar-section">
        <div class="sidebar-title">CONTACT</div>
        ${
          data.personal?.phone
            ? `
        <div class="contact-item" data-field="phone">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
          <span>${data.personal.phone}</span>
        </div>`
            : ""
        }
        
        ${
          data.personal?.alternatePhone
            ? `
        <div class="contact-item" data-field="alternatePhone">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
          <span>${data.personal.alternatePhone} (Alt)</span>
        </div>`
            : ""
        }
        
        ${
          data.personal?.email
            ? `
        <div class="contact-item" data-field="email">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
          <span>${data.personal.email}</span>
        </div>`
            : ""
        }
        
        ${
          data.personal?.location || data.personal?.fullAddress || data.personal?.country || data.personal?.pinCode
            ? (() => {
                const addressParts = [
                  data.personal?.fullAddress,
                  data.personal?.location,
                  data.personal?.country,
                  data.personal?.pinCode
                ].filter(Boolean);
                return `
        <div class="contact-item" data-field="location">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
          <span>${addressParts.join(", ")}</span>
        </div>`;
              })()
            : ""
        }
        
        ${
          data.personal?.linkedinUrl
            ? `
        <div class="contact-item" data-field="linkedinUrl">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/></svg>
          <a href="${
            data.personal.linkedinUrl
          }" target="_blank">${data.personal.linkedinUrl
                .replace("https://", "")
                .replace("http://", "")
                .substring(0, 20)}...</a>
        </div>`
            : ""
        }
        
        ${
          data.personal?.githubUrl
            ? `
        <div class="contact-item" data-field="githubUrl">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V19c0 .27.16.58.68.5C17.14 18.16 20 14.42 20 10 20 4.477 15.523 0 10 0z" clip-rule="evenodd"/></svg>
          <a href="${
            data.personal.githubUrl
          }" target="_blank">${data.personal.githubUrl
                .replace("https://", "")
                .replace("http://", "")
                .substring(0, 20)}...</a>
        </div>`
            : ""
        }
        
        ${
          data.personal?.portfolioUrl || data.personal?.website
            ? `
        <div class="contact-item" data-field="website">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"/></svg>
          <a href="${
            data.personal.portfolioUrl || data.personal.website
          }" target="_blank">${(data.personal.portfolioUrl || data.personal.website || "")
                .replace("https://", "")
                .replace("http://", "")
                .substring(0, 20)}...</a>
        </div>`
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
        <div class="contact-item" data-field="personal-${index}">
          <span>${item}</span>
        </div>`).join('');
              })()
            : ""
        }
      </div>
      
      <!-- Skills Section -->
      ${
        nonEmptySkills.length > 0
          ? `
      <div class="sidebar-section" data-section="skills">
        <div class="sidebar-title">SKILLS</div>
        <ul class="sidebar-list">
          ${nonEmptySkills
            .map(
              (skill: any, index: number) => `
            <li data-section="skills" data-index="${index}">${
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
          ? `
      <div class="sidebar-section" data-section="toolsTechnologies">
        <div class="sidebar-title">TOOLS & TECH</div>
        <ul class="sidebar-list">
          ${nonEmptyToolsTechnologies
            .map(
              (item: any, index: number) => `
            <li data-section="toolsTechnologies" data-index="${index}">
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
          ? `
      <div class="sidebar-section" data-section="methodologies">
        <div class="sidebar-title">METHODOLOGIES</div>
        <ul class="sidebar-list">
          ${nonEmptyMethodologies
            .map(
              (item: any, index: number) => `
            <li data-section="methodologies" data-index="${index}">
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
          ? `
      <div class="sidebar-section" data-section="industryExpertise">
        <div class="sidebar-title">INDUSTRY EXPERTISE</div>
        <ul class="sidebar-list">
          ${nonEmptyIndustryExpertise
            .map(
              (item: any, index: number) => `
            <li data-section="industryExpertise" data-index="${index}">
              ${item.industry || ''}${item.domainArea ? ` - ${item.domainArea}` : ''}${item.experienceDuration ? ` (${item.experienceDuration} years)` : ''}
            </li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }
      
      <!-- Languages Section -->
      ${
        data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0
          ? `
      <div class="sidebar-section" data-section="languages">
        <div class="sidebar-title">LANGUAGES</div>
        ${(data.languages || [])
          .map(
            (lang: any, index: number) => `
          <div class="language-item" data-section="languages" data-index="${index}">
            <span class="language-name">${lang.language || lang}</span>
            ${
              lang.level
                ? `<span class="language-level">${lang.level}${lang.capability ? ` - ${lang.capability}` : ''}</span>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }
      
      <!-- Certifications (in sidebar if few) -->
      ${
        data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 0 && data.certifications.length <= 3
          ? `
      <div class="sidebar-section" data-section="certifications">
        <div class="sidebar-title">CERTIFICATIONS</div>
        ${(data.certifications || [])
          .map(
            (cert: any, index: number) => `
          <div class="language-item" data-section="certifications" data-index="${index}">
            <span class="language-name">${cert.name || ""}</span>
            ${cert.issuer ? `<span class="language-level">${cert.issuer}</span>` : ""}
            ${cert.date ? `<span class="language-level">${cert.date}</span>` : ""}
          </div>
        `
          )
          .join("")}
      </div>`
          : ""
      }
      
      <!-- Hobbies Section -->
      ${
        data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
          ? `
      <div class="sidebar-section" data-section="hobbies">
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
      
      <!-- Availability & Work Authorization (in sidebar) -->
      ${
        data.availabilityWorkAuth && Object.values(data.availabilityWorkAuth).some(v => v)
          ? `
      <div class="sidebar-section" data-section="availabilityWorkAuth">
        <div class="sidebar-title">AVAILABILITY</div>
        <ul class="sidebar-list">
          ${data.availabilityWorkAuth.availabilityNoticePeriod ? `<li>Notice: ${data.availabilityWorkAuth.availabilityNoticePeriod}</li>` : ''}
          ${data.availabilityWorkAuth.workAuthorizationStatus ? `<li>Work Auth: ${data.availabilityWorkAuth.workAuthorizationStatus}</li>` : ''}
          ${data.availabilityWorkAuth.preferredLocation ? `<li>Preferred: ${data.availabilityWorkAuth.preferredLocation}</li>` : ''}
        </ul>
      </div>`
          : ""
      }
      
      <!-- Social Profiles (in sidebar) -->
      ${
        nonEmptySocialProfiles.length > 0
          ? `
      <div class="sidebar-section" data-section="socialProfiles">
        <div class="sidebar-title">SOCIAL PROFILES</div>
        <ul class="sidebar-list">
          ${nonEmptySocialProfiles
            .map(
              (profile: any, index: number) => `
            <li data-section="socialProfiles" data-index="${index}">
              <a href="${profile.url}" target="_blank" style="color: var(--sidebar-text);">${profile.platform || "Profile"}</a>
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
      <!-- Header -->
      <div class="header-section" data-section="personal">
        <div class="name-header" data-section="personal">
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
            ? `<div class="role-subtitle" data-section="personal">${data.personal.role}</div>`
            : ""
        }
      </div>

      <!-- Professional Context -->
      ${
        data.professionalContext && Object.values(data.professionalContext).some(v => v)
          ? `
      <div class="content-section" data-section="professionalContext">
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
      
      <!-- Summary -->
      ${
        data.sectionVisibility?.summary !== false && data.summary
          ? `
      <div class="content-section">
        <div class="section-title">PROFILE</div>
        <p class="summary-text" data-section="summary">${data.summary}</p>
      </div>`
          : ""
      }

      <!-- Career Objective -->
      ${
        typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
          ? `
      <div class="content-section" data-section="careerObjective">
        <div class="section-title">CAREER OBJECTIVE</div>
        <p class="summary-text">${data.careerObjective}</p>
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
      <div class="content-section" data-section="personal">
        <div class="section-title">PERSONAL DETAILS</div>
        <ul class="achievement-list">
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
      </div>`
          : ""
      }
      
      <!-- Work Experience -->
      ${
        data.sectionVisibility?.experience !== false &&
        data.experience &&
        data.experience.length > 0
          ? `
      <div class="content-section" data-section="experience">
        <div class="section-title">EXPERIENCE</div>
        ${(data.experience || [])
          .map(
            (exp: any, index: number) => `
          <div class="item" data-section="experience" data-index="${index}">
            <div class="item-title" data-section="experience">${
              exp.title || ""
            }</div>
            <div class="item-subtitle" data-section="experience">${formatSubtitle([exp.company, exp.location])}</div>
            <div class="item-date" data-section="experience">${formatDateRange(exp.startDate, exp.endDate)}</div>
            <div class="item-description" data-section="experience">${
              exp.description || ""
            }</div>
            ${exp.achievements ? `<div class="item-description" style="margin-top: 8px;"><strong>Achievements:</strong> ${exp.achievements}</div>` : ""}
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
      <div class="content-section" data-section="internships">
        <div class="section-title">INTERNSHIPS</div>
        ${nonEmptyInternships
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="internships" data-index="${index}">
            <div class="item-title" data-section="internships">${item.title || ""}</div>
            <div class="item-subtitle" data-section="internships">${item.company || ""}</div>
            <div class="item-date" data-section="internships">${item.duration || ""}</div>
            <div class="item-description" data-section="internships">${item.description || ""}</div>
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
      <div class="content-section" data-section="trainingPrograms">
        <div class="section-title">TRAINING PROGRAMS</div>
        ${nonEmptyTrainingPrograms
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="trainingPrograms" data-index="${index}">
            <div class="item-title" data-section="trainingPrograms">${item.name || ""}</div>
            <div class="item-subtitle" data-section="trainingPrograms">${formatSubtitle([item.provider || item.organization, item.duration])}</div>
            <div class="item-date" data-section="trainingPrograms">${item.completionDate || ""}</div>
            <div class="item-description" data-section="trainingPrograms">${item.description || ""}</div>
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
          ? `
      <div class="content-section" data-section="education">
        <div class="section-title">EDUCATION</div>
        ${(data.education || [])
          .map(
            (edu: any, index: number) => `
          <div class="item" data-section="education" data-index="${index}">
            <div class="item-title" data-section="education">${
              edu.degree || ""
            }${edu.field ? ` in ${edu.field}` : ""}${edu.qualification ? ` (${edu.qualification})` : ""}</div>
            <div class="item-subtitle" data-section="education">${
              edu.school || ""
            }${edu.location ? `, ${edu.location}` : ""}</div>
            <div class="item-date" data-section="education">${edu.graduationDate || ""}${edu.grade ? ` |  ${edu.grade}` : ""}</div>
            ${
              edu.description
                ? `<div class="item-description" data-section="education">${
                    edu.description.includes("<ul>") ||
                    edu.description.includes("<li>")
                      ? edu.description
                      : `<p>${edu.description}</p>`
                  }</div>`
                : ""
            }
            ${
              edu.achievements && edu.achievements.length > 0
                ? `
              <ul class="achievement-list" style="margin-top: 10px;">
                ${edu.achievements
                  .filter((a: string) => a.trim())
                  .map(
                    (achievement: string, achIndex: number) =>
                      `<li data-section="education" data-index="${achIndex}">${achievement}</li>`
                  )
                  .join("")}
              </ul>
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
          ? `
      <div class="content-section" data-section="projects">
        <div class="section-title">PROJECTS</div>
        ${(data.projects || [])
          .map(
            (project: any, index: number) => `
          <div class="item" data-section="projects" data-index="${index}">
            <div class="project-name" data-section="projects">${
              project.name || ""
            }</div>
            ${
              project.technologies
                ? `<div class="project-tech" data-section="projects">${project.technologies}</div>`
                : ""
            }
            ${project.startDate || project.endDate ? `<div class="item-date" data-section="projects">${formatDateRange(project.startDate, project.endDate)}</div>` : ""}
            <div class="item-description" data-section="projects">${
              project.description || ""
            }</div>
            ${
              project.url
                ? `<div style="margin-top: 6px;"><a href="${
                    project.url
                  }" target="_blank">${
                    project.urlText || project.url
                  }</a></div>`
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
          ? `
      <div class="content-section" data-section="academicProjects">
        <div class="section-title">ACADEMIC PROJECTS</div>
        ${nonEmptyAcademicProjects
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="academicProjects" data-index="${index}">
            <div class="item-title" data-section="academicProjects">${item.name || item.title || ""}</div>
            <div class="item-subtitle" data-section="academicProjects">${formatSubtitle([item.institution, item.course ? `Course: ${item.course}` : ""])}</div>
            <div class="item-date" data-section="academicProjects">${item.duration || ""}</div>
            <div class="item-description" data-section="academicProjects">${item.description || ""}</div>
            ${
              item.technologies
                ? `<div class="item-description" style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>`
                : ""
            }
            ${
              item.url
                ? `<div style="margin-top: 5px;"><a href="${item.url}" target="_blank">View Project</a></div>`
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
      <div class="content-section" data-section="clientProjects">
        <div class="section-title">CLIENT PROJECTS</div>
        ${nonEmptyClientProjects
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="clientProjects" data-index="${index}">
            <div class="item-title" data-section="clientProjects">${item.name || ""}</div>
            <div class="item-subtitle" data-section="clientProjects">${formatSubtitle([item.clientOrganization, item.role ? `Role: ${item.role}` : ""])}</div>
            <div class="item-date" data-section="clientProjects">${item.duration || ""}</div>
            <div class="item-description" data-section="clientProjects">${item.description || ""}</div>
            ${
              item.toolsTechnologies
                ? `<div class="item-description" style="margin-top: 5px;"><strong>Tools:</strong> ${item.toolsTechnologies}</div>`
                : ""
            }
            ${
              item.projectUrl
                ? `<div style="margin-top: 5px;"><a href="${item.projectUrl}" target="_blank">View Project</a></div>`
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
      <div class="content-section" data-section="portfolio">
        <div class="section-title">PORTFOLIO</div>
        ${nonEmptyPortfolio
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="portfolio" data-index="${index}">
            <div class="item-title" data-section="portfolio">${item.name || ""}</div>
            <div class="item-subtitle" data-section="portfolio">${formatSubtitle([item.type, item.platform])}</div>
            <div class="item-description" data-section="portfolio">${item.description || ""}</div>
            ${
              item.url
                ? `<div style="margin-top: 5px;"><a href="${item.url}" target="_blank">View Portfolio</a></div>`
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
          ? `
      <div class="content-section" data-section="leadershipPositions">
        <div class="section-title">LEADERSHIP & POSITIONS</div>
        ${nonEmptyLeadershipPositions
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="leadershipPositions" data-index="${index}">
            <div class="item-title" data-section="leadershipPositions">${item.position || item.title || ""}</div>
            <div class="item-subtitle" data-section="leadershipPositions">${item.organization || ""}</div>
            <div class="item-date" data-section="leadershipPositions">${formatDateRange(item.startDate, item.endDate)}</div>
            <div class="item-description" data-section="leadershipPositions">${item.description || ""}</div>
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
      <div class="content-section" data-section="volunteering">
        <div class="section-title">VOLUNTEERING</div>
        ${nonEmptyVolunteering
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="volunteering" data-index="${index}">
            <div class="item-title" data-section="volunteering">${item.role || ""}</div>
            <div class="item-subtitle" data-section="volunteering">${formatSubtitle([item.organization, item.causeArea])}</div>
            <div class="item-date" data-section="volunteering">${item.duration || ""}</div>
            <div class="item-description" data-section="volunteering">${item.description || ""}</div>
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
      <div class="content-section" data-section="militaryService">
        <div class="section-title">MILITARY SERVICE</div>
        ${nonEmptyMilitaryService
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="militaryService" data-index="${index}">
            <div class="item-title" data-section="militaryService">${item.rank ? `${item.rank} - ${item.branch}` : item.branch || ""}</div>
            <div class="item-subtitle" data-section="militaryService">${item.specialization || ""}</div>
            <div class="item-date" data-section="militaryService">${item.duration || ""}</div>
            <div class="item-description" data-section="militaryService">${item.description || ""}</div>
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
      <div class="content-section" data-section="teachingExperience">
        <div class="section-title">TEACHING EXPERIENCE</div>
        ${nonEmptyTeachingExperience
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="teachingExperience" data-index="${index}">
            <div class="item-title" data-section="teachingExperience">${item.title || ""}</div>
            <div class="item-subtitle" data-section="teachingExperience">${formatSubtitle([item.institution, item.subjectCourseTaught])}</div>
            <div class="item-date" data-section="teachingExperience">${item.duration || ""}</div>
            <div class="item-description" data-section="teachingExperience">${item.description || ""}</div>
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
      <div class="content-section" data-section="mentorshipExperience">
        <div class="section-title">MENTORSHIP EXPERIENCE</div>
        ${nonEmptyMentorshipExperience
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="mentorshipExperience" data-index="${index}">
            <div class="item-title" data-section="mentorshipExperience">${item.mentorshipArea || ""}</div>
            <div class="item-subtitle" data-section="mentorshipExperience">${formatSubtitle([item.organizationPlatform, item.menteeLevel ? `Mentee Level: ${item.menteeLevel}` : ""])}</div>
            <div class="item-date" data-section="mentorshipExperience">${item.duration || ""}</div>
            <div class="item-description" data-section="mentorshipExperience">${item.description || ""}</div>
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
      <div class="content-section" data-section="researchGrants">
        <div class="section-title">RESEARCH GRANTS</div>
        ${nonEmptyResearchGrants
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="researchGrants" data-index="${index}">
            <div class="item-title" data-section="researchGrants">${item.title || ""}</div>
            <div class="item-subtitle" data-section="researchGrants">${formatSubtitle([item.agency, item.amount])}</div>
            <div class="item-date" data-section="researchGrants">${item.year || ""}</div>
            <div class="item-description" data-section="researchGrants">${item.description || ""}</div>
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
      <div class="content-section" data-section="publications">
        <div class="section-title">PUBLICATIONS</div>
        ${nonEmptyPublications
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="publications" data-index="${index}">
            <div class="item-title" data-section="publications">${item.title || ""}</div>
            <div class="item-subtitle" data-section="publications">${formatSubtitle([item.journalPublisher, item.publicationType])}</div>
            <div class="item-date" data-section="publications">${item.year || ""}</div>
            ${item.authors ? `<div class="item-description"><strong>Authors:</strong> ${item.authors}</div>` : ""}
            ${
              item.urlDoi
                ? `<div style="margin-top: 5px;"><a href="${item.urlDoi}" target="_blank">View Publication</a></div>`
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
      <div class="content-section" data-section="patents">
        <div class="section-title">PATENTS</div>
        ${nonEmptyPatents
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="patents" data-index="${index}">
            <div class="item-title" data-section="patents">${item.title || ""}</div>
            <div class="item-subtitle" data-section="patents">${formatSubtitle([item.patentNumber, item.issuingAuthority])}</div>
            <div class="item-date" data-section="patents">${item.year || ""} | Status: ${item.status || ""}</div>
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
      <div class="content-section" data-section="testScores">
        <div class="section-title">TEST SCORES</div>
        ${nonEmptyTestScores
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="testScores" data-index="${index}">
            <div class="item-title" data-section="testScores">${item.testName || ""}</div>
            <div class="item-subtitle" data-section="testScores">Score: ${item.score || ""}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ""}</div>
            <div class="item-date" data-section="testScores">${item.year || ""}</div>
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
          ? `
      <div class="content-section" data-section="certifications">
        <div class="section-title">CERTIFICATIONS</div>
        ${(data.certifications || [])
          .map(
            (cert: any, index: number) => `
          <div class="cert-item" data-section="certifications" data-index="${index}">
            <div class="cert-name">${cert.name || ""}</div>
            <div class="cert-issuer">${cert.issuer || ""}</div>
            <div class="cert-date">${cert.date || ""}</div>
            ${cert.description ? `<div class="item-description">${cert.description}</div>` : ""}
            ${
              cert.url
                ? `<div style="margin-top: 5px;"><a href="${cert.url}" target="_blank">View Certificate</a></div>`
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
          ? `
      <div class="content-section" data-section="scholarships">
        <div class="section-title">SCHOLARSHIPS</div>
        ${nonEmptyScholarships
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="scholarships" data-index="${index}">
            <div class="item-title" data-section="scholarships">${item.name || ""}</div>
            <div class="item-subtitle" data-section="scholarships">${formatSubtitle([item.provider || item.organization, item.amount])}</div>
            <div class="item-date" data-section="scholarships">${item.year || ""}</div>
            <div class="item-description" data-section="scholarships">${item.description || ""}</div>
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
      <div class="content-section" data-section="awards">
        <div class="section-title">AWARDS</div>
        ${nonEmptyAwards
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="awards" data-index="${index}">
            <div class="item-title" data-section="awards">${item.title || ""}</div>
            <div class="item-subtitle" data-section="awards">${item.organization || ""}</div>
            <div class="item-date" data-section="awards">${item.issueYear || ""}</div>
            <div class="item-description" data-section="awards">${item.description || ""}</div>
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
      <div class="content-section" data-section="speakingEngagements">
        <div class="section-title">SPEAKING ENGAGEMENTS</div>
        ${nonEmptySpeakingEngagements
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="speakingEngagements" data-index="${index}">
            <div class="item-title" data-section="speakingEngagements">${item.topic || ""}</div>
            <div class="item-subtitle" data-section="speakingEngagements">${item.eventName || ""}</div>
            <div class="item-date" data-section="speakingEngagements">${item.date || ""}</div>
            <div class="item-description" data-section="speakingEngagements">${item.description || ""}</div>
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
      <div class="content-section" data-section="memberships">
        <div class="section-title">MEMBERSHIPS</div>
        ${nonEmptyMemberships
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="memberships" data-index="${index}">
            <div class="item-title" data-section="memberships">${item.membershipName || ""}</div>
            <div class="item-subtitle" data-section="memberships">${item.organizationName || ""}</div>
            <div class="item-date" data-section="memberships">${item.year || ""}</div>
            <div class="item-description" data-section="memberships">${item.description || ""}</div>
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
      <div class="content-section" data-section="workshops">
        <div class="section-title">WORKSHOPS</div>
        ${nonEmptyWorkshops
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="workshops" data-index="${index}">
            <div class="item-title" data-section="workshops">${item.programTitle || ""}</div>
            <div class="item-subtitle" data-section="workshops">${item.conductedBy || ""}</div>
            <div class="item-date" data-section="workshops">${item.year || ""}</div>
            <div class="item-description" data-section="workshops">${item.description || ""}</div>
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
      <div class="content-section" data-section="coCurricular">
        <div class="section-title">CO-CURRICULAR ACTIVITIES</div>
        ${nonEmptyCoCurricular
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="coCurricular" data-index="${index}">
            <div class="item-title" data-section="coCurricular">${item.activity || ""}</div>
            <div class="item-subtitle" data-section="coCurricular">${formatSubtitle([item.organization, item.role])}</div>
            <div class="item-date" data-section="coCurricular">${item.year || ""}</div>
            <div class="item-description" data-section="coCurricular">${item.description || ""}</div>
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
      <div class="content-section" data-section="extracurricular">
        <div class="section-title">EXTRACURRICULAR ACTIVITIES</div>
        ${nonEmptyExtracurricular
          .map(
            (item: any, index: number) => `
          <div class="item" data-section="extracurricular" data-index="${index}">
            <div class="item-title" data-section="extracurricular">${item.activity || ""}</div>
            <div class="item-subtitle" data-section="extracurricular">${formatSubtitle([item.organization, item.role])}</div>
            <div class="item-date" data-section="extracurricular">${item.year || ""}</div>
            <div class="item-description" data-section="extracurricular">${item.description || ""}</div>
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
          ? `
      <div class="content-section" data-section="keyAchievements">
        <div class="section-title">KEY ACHIEVEMENTS</div>
        <ul class="achievement-list">
          ${nonEmptyKeyAchievements
            .map(
              (achievement: string, index: number) => `
            <li data-section="keyAchievements" data-index="${index}">${achievement}</li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }
      
      <!-- Key Responsibilities -->
      ${
        nonEmptyResponsibilities.length > 0
          ? `
      <div class="content-section" data-section="responsibilities">
        <div class="section-title">KEY RESPONSIBILITIES</div>
        <ul class="achievement-list">
          ${nonEmptyResponsibilities
            .map(
              (line: string, index: number) => `
            <li data-section="responsibilities" data-index="${index}">${line.trim()}</li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }
      
      <!-- Tools (Simple List) -->
      ${
        nonEmptyTools.length > 0
          ? `
      <div class="content-section" data-section="tools">
        <div class="section-title">TOOLS</div>
        <ul class="achievement-list">
          ${nonEmptyTools
            .map(
              (line: string, index: number) => `
            <li data-section="tools" data-index="${index}">${line.trim()}</li>
          `
            )
            .join("")}
        </ul>
      </div>`
          : ""
      }
      
      <!-- References -->
      ${
        nonEmptyReferences.length > 0
          ? `
      <div class="content-section" data-section="references">
        <div class="section-title">REFERENCES</div>
        ${nonEmptyReferences
          .map(
            (ref: any, index: number) => `
          <div class="item" data-section="references" data-index="${index}">
            <div class="item-title" data-section="references">${ref.name || ""}</div>
            <div class="item-subtitle" data-section="references">${formatSubtitle([ref.designationRelationship, ref.organization])}</div>
            <div class="item-description" data-section="references">${ref.contactInformation || ""}</div>
          </div>
        `
          )
          .join("")}
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
        <div class="content-section" data-section="custom-${sectionIndex}">
          <div class="section-title">${
            section.heading || "Custom Section"
          }</div>
          ${
            section.entries && section.entries.length > 0
              ? section.entries
                  .filter((entry: any) => entry.isVisible)
                  .map(
                    (entry: any, entryIndex: number) => `
            <div class="item" data-index="${entryIndex}">
              <div class="item-title">${entry.title || ""}${entry.title && entry.organization ? " at " : ""}${entry.organization || ""}</div>
              ${entry.date ? `<div class="item-date">${entry.date}</div>` : ""}
              ${
                entry.description
                  ? `<div class="item-description">${entry.description}</div>`
                  : ""
              }
            </div>
          `
                  )
                  .join("")
              : '<div style="color: #7f8c8d; font-style: italic;">No entries in this section</div>'
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