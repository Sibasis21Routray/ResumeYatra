export function buildVenusaurTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#0f172a",
    secondary: "#64748b",
    background: "#ffffff",
    headingFont: "Arial, Helvetica, sans-serif",
    bodyFont: "Arial, Helvetica, sans-serif",
  };

  // --- PRESERVED LOGIC START ---
  const currentTheme = { ...defaultTheme, ...(theme || {}) };

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 13;
  const userFontFamily =
    data.formatting?.fontFamily || data.fontFamily || "Arial, Helvetica, sans-serif";

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.6);
  const subheadingFontSize = Math.round(userFontSize * 1.3);
  const smallTextFontSize = Math.round(userFontSize * 0.93);
  const smallTextFontSize2 = Math.round(userFontSize * 0.96);
  // --- PRESERVED LOGIC END ---

  // Destructure all fields
  const {
    personal = {},
    summary = "",
    careerObjective = "",
    experience = [],
    projects = [],
    education = [],
    internships = [],
    trainingPrograms = [],
    academicProjects = [],
    leadershipPositions = [],
    coCurricular = [],
    extracurricular = [],
    skills = "",
    coreCompetencies = "",
    languages = [],
    hobbies = [],
    certifications = [],
    scholarships = [],
    awards = [],
    speakingEngagements = [],
    memberships = [],
    workshops = [],
    clientProjects = [],
    portfolio = [],
    volunteering = [],
    militaryService = [],
    methodologies = [],
    industryExpertise = [],
    references = [],
    teachingExperience = [],
    mentorshipExperience = [],
    researchGrants = [],
    testScores = [],
    publications = [],
    patents = [],
    toolsTechnologies = [],
    availabilityWorkAuth = {},
    socialProfiles = []
  } = data;

  // Helper functions
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

  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => 
      val !== null && val !== undefined && val !== ""
    );
  };

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" - ");
  };

  const renderDescription = (description: string): string => {
    if (!description) return '';
    
    const bulletChar = '&#8226;';

    if (description.includes('<ul>') || description.includes('<li>')) {
      let cleaned = description;
      cleaned = cleaned.replace(/<li>(.*?)<\/li>/gs, (match, content) => {
        return `<li><span class="bullet">${bulletChar}</span><span class="bullet-text">${content}</span></li>`;
      });
      return `<ul class="description-list">${cleaned}</ul>`;
    }
    
    const lines = description.split('\n').filter(line => line.trim().length > 0);
    if (lines.length === 0) return '';
    
    return `<ul class="description-list">${lines.map(line => `<li><span class="bullet">${bulletChar}</span><span class="bullet-text">${line.trim()}</span></li>`).join('')}</ul>`;
  };

  const parseSkills = (): any[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.filter((s: any) => s && (typeof s === "string" ? s.trim() : s));
    if (typeof skills === 'string') {
      if (skills.includes('<ul>')) {
        const matches = skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          return matches.map(m => m.replace(/<\/? li>/g, '').trim());
        }
      }
      if (skills.includes('\n')) {
        return skills.split('\n')
          .map((s: string) => s.trim())
          .filter(s => s && s !== '-');
      }
      return skills.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const parseCoreCompetencies = (): any[] => {
  if (!coreCompetencies) return [];
  if (Array.isArray(coreCompetencies)) return coreCompetencies.filter((s: any) => s && (typeof s === "string" ? s.trim() : s));
  if (typeof coreCompetencies === 'string') {
    if (coreCompetencies.includes('<ul>')) {
      const matches = coreCompetencies.match(/<li>(.*?)<\/li>/gs);
      if (matches) {
        return matches.map(m => m.replace(/<\/?li>/g, '').trim());
      }
    }
    if (coreCompetencies.includes('\n')) {
      return coreCompetencies.split('\n')
        .map((s: string) => s.trim())
        .filter(s => s && s !== '-');
    }
    return coreCompetencies.split(',').map((s: string) => s.trim()).filter(Boolean);
  }
  return [];
};

  // Get profile image from multiple possible sources
  const getProfileImage = (): string => {
    if (personal?.photoUrl) return personal.photoUrl;
    if (personal?.image) return personal.image;
    if (personal?.photo) return personal.photo;
    if (personal?.avatar) return personal.avatar;
    if (personal?.profileImage) return personal.profileImage;
    if (personal?.profilePicture) return personal.profilePicture;
    if (personal?.picture) return personal.picture;
    return '';
  };

  const profileImage = getProfileImage();
  const skillsArray = parseSkills();
  const coreCompetenciesArray = parseCoreCompetencies();

  
  // Get all non-empty arrays
  const nonEmptyExperience = getNonEmptyArray(experience);
  const nonEmptyEducation = getNonEmptyArray(education);
  const nonEmptyProjects = getNonEmptyArray(projects);
  const nonEmptyInternships = getNonEmptyArray(internships);
  const nonEmptyTrainingPrograms = getNonEmptyArray(trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyArray(academicProjects);
  const nonEmptyLeadershipPositions = getNonEmptyArray(leadershipPositions);
  const nonEmptyCoCurricular = getNonEmptyArray(coCurricular);
  const nonEmptyExtracurricular = getNonEmptyArray(extracurricular);
  const nonEmptyLanguages = getNonEmptyArray(languages);
  const nonEmptyCertifications = getNonEmptyArray(certifications);
  const nonEmptyScholarships = getNonEmptyArray(scholarships);
  const nonEmptyAwards = getNonEmptyArray(awards);
  const nonEmptySpeakingEngagements = getNonEmptyArray(speakingEngagements);
  const nonEmptyMemberships = getNonEmptyArray(memberships);
  const nonEmptyWorkshops = getNonEmptyArray(workshops);
  const nonEmptyClientProjects = getNonEmptyArray(clientProjects);
  const nonEmptyPortfolio = getNonEmptyArray(portfolio);
  const nonEmptyVolunteering = getNonEmptyArray(volunteering);
  const nonEmptyMilitaryService = getNonEmptyArray(militaryService);
  const nonEmptyMethodologies = getNonEmptyArray(methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyArray(industryExpertise);
  const nonEmptyReferences = getNonEmptyArray(references);
  const nonEmptyTeachingExperience = getNonEmptyArray(teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyArray(mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyArray(researchGrants);
  const nonEmptyTestScores = getNonEmptyArray(testScores);
  const nonEmptyPublications = getNonEmptyArray(publications);
  const nonEmptyPatents = getNonEmptyArray(patents);
  const nonEmptyToolsTechnologies = getNonEmptyArray(toolsTechnologies);
  const nonEmptySocialProfiles = getNonEmptyArray(socialProfiles);
  const nonEmptyHobbies = getNonEmptyArray(hobbies);

  // SVG Icons
  const icons = {
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    location: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    globe: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
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
      color: #334155;
      line-height: 1.6;
      background: #ffffff;
      font-size: ${baseFontSize}px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      position: relative;
    }

    /* --- TOP ACCENT STRIPE --- */
    .top-stripe {
      width: 100%;
      height: 10px;
      background-color: #94a3b8;
    }

    .content-wrapper {
      padding: 32px 40px 40px 40px;
    }
    
    /* --- TWO-COLUMN HEADER (PHOTO + TEXT) --- */
    .header-container {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 24px;
    }

    .profile-img {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #ffffff;
      box-shadow: 0 0 0 1px #cbd5e1, 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
      background-color: #f1f5f9;
    }

    .profile-placeholder {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      background-color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: #94a3b8;
      border: 4px solid #ffffff;
      box-shadow: 0 0 0 1px #cbd5e1, 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
    }

    .header-text {
      display: flex;
      flex-direction: column;
    }

    .name {
      font-size: ${headingFontSize}px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .role-title {
      font-size: ${subheadingFontSize}px;
      color: #64748b;
      font-weight: 400;
      margin-top: 4px;
    }

    /* --- PILL BOX CONTACT ROW --- */
    .contact-box {
      background-color: #f8fafc;
      border-radius: 8px;
      padding: 12px 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      gap: 20px;
      font-size: 13px;
      color: #334155;
      margin-bottom: 24px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .contact-item svg {
      width: 14px;
      height: 14px;
      stroke: #0f172a;
    }

    .contact-box a {
      color: inherit;
      text-decoration: none;
    }

    /* --- SUMMARY TEXT --- */
    .summary-text {
      font-size: ${baseFontSize}px;
      color: #475569;
      line-height: 1.6;
      text-align: justify;
      margin-bottom: 28px;
    }

    /* --- STRUCTURAL SECTIONS --- */
    .section {
      margin-bottom: 24px;
    }

    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .divider {
      border: 0;
      border-top: 1px solid #cbd5e1;
      margin-bottom: 16px;
    }

    /* --- SKILLS PILL TAGS - NO BULLETS --- */
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .skill-pill {
      background-color: #e2e8f0;
      color: #1e293b;
      padding: 5px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
    }

    /* --- EXPERIENCE & TIMELINES --- */
    .entry-wrapper {
      margin-bottom: 16px;
    }

    .entry-header-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
    }

    .entry-left-block {
      display: flex;
      flex-direction: column;
    }

    .entry-right-block {
      text-align: right;
      display: flex;
      flex-direction: column;
    }

    .entry-title {
      font-weight: 700;
      font-size: 14px;
      color: #0f172a;
    }
    
    .entry-subtitle {
      font-weight: 600;
      font-size: 13px;
      color: #0f172a;
      margin-top: 2px;
    }

    .entry-date {
      font-style: italic;
      font-size: 13px;
      color: #64748b;
    }

    .entry-description {
      margin-top: 6px;
    }

    /* Description lists */
    .description-list {
      list-style: none;
      margin-left: 0;
      margin-top: 4px;
      padding-left: 0;
    }

    .description-list li {
      margin-bottom: 5px;
      line-height: 1.5;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .description-list .bullet {
      color: #000000;
      display: inline-block;
      flex-shrink: 0;
    }

    .description-list .bullet-text {
      flex: 1;
    }

    /* Context grid for availability */
    .context-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-top: 5px;
    }
    .context-item {
      font-size: ${baseFontSize}px;
      color: #374151;
    }
    .context-label {
      font-weight: 700;
      color: #111827;
    }

    @media print {
      body { padding: 0; }
      .container { width: 100%; max-width: none; }
      .content-wrapper { padding: 30px; }
    }
  </style>
</head>
<body>
<div class="container">
  
  <div class="top-stripe"></div>
  
  <div class="content-wrapper">
    <!-- Header with Profile Image -->
    <div class="header-container" data-section="personal">
      ${profileImage ? 
        `<img src="${profileImage}" class="profile-img" alt="Profile" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />` : 
        `<div class="profile-placeholder">
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
</div>`
      }
      <div class="header-text">
        <div class="name">${personal?.name && personal?.name !== "undefined" ? personal.name : "Your Name"}</div>
        ${personal?.role ? `<div class="role-title">${personal.role}</div>` : ""}
      </div>
    </div>

    <!-- Contact Box -->
    <div class="contact-box">
      ${personal?.email ? `
      <div class="contact-item">
        ${icons.email}
        <span><a href="mailto:${personal.email}">${personal.email}</a></span>
      </div>` : ""}

      ${personal?.phone ? `
      <div class="contact-item">
        ${icons.phone}
        <span>${personal.phone}</span>
      </div>` : ""}
      
      ${(() => {
        const loc = [personal?.location, personal?.country].filter(Boolean);
        return loc.length > 0 ? `
        <div class="contact-item">
          ${icons.location}
          <span>${loc.join(", ")}</span>
        </div>` : "";
      })()}

      ${personal?.linkedinUrl ? `
      <div class="contact-item">
        ${icons.linkedin}
        <span><a href="${personal.linkedinUrl}" target="_blank">LinkedIn</a></span>
      </div>` : ""}
      
      ${personal?.website ? `
      <div class="contact-item">
        ${icons.globe}
        <span><a href="${personal.website}" target="_blank">Website</a></span>
      </div>` : ""}
    </div>

    <!-- Availability & Work Auth Section -->
    ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
    <div class="section" data-section="availabilityWorkAuth">
      <div class="section-title">Availability & Work Auth</div>
      <hr class="divider" />
      <div class="context-grid">
        ${availabilityWorkAuth.availabilityNoticePeriod ? `<div class="context-item"><span class="context-label">Notice Period:</span> ${availabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
        ${availabilityWorkAuth.workAuthorizationStatus ? `<div class="context-item"><span class="context-label">Work Auth:</span> ${availabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
        ${availabilityWorkAuth.preferredLocation ? `<div class="context-item"><span class="context-label">Preferred Location:</span> ${availabilityWorkAuth.preferredLocation}</div>` : ''}
      </div>
    </div>` : ""}

    <!-- Career Objective Section -->
    ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
    <div class="section" data-section="careerObjective">
      <div class="section-title">Career Objective</div>
      <hr class="divider" />
      <p class="summary-text">${careerObjective}</p>
    </div>` : ""}

    <!-- Professional Summary Section -->
    ${summary && summary.trim() ? `
    <div class="section" data-section="summary">
      <div class="section-title">Professional Summary</div>
      <hr class="divider" />
      <p class="summary-text">${summary}</p>
    </div>` : ""}

    <!-- Skills Section - No Bullets -->
    ${skillsArray.length > 0 ? `
    <div class="section" data-section="skills">
      <div class="section-title">Skills</div>
      <hr class="divider" />
      <div class="skills-container">
        ${skillsArray.map((skill: any) => `<span class="skill-pill">${typeof skill === "string" ? skill.trim() : skill}</span>`).join("")}
      </div>
    </div>` : ""}

    <!-- Core Competencies Section -->
${coreCompetenciesArray.length > 0 ? `
<div class="section" data-section="coreCompetencies">
  <div class="section-title">Core Competencies</div>
  <hr class="divider" />
  <div class="skills-container">
    ${coreCompetenciesArray.map((comp: any) => `<span class="skill-pill">${typeof comp === "string" ? comp.trim() : comp}</span>`).join("")}
  </div>
</div>` : ""}


    <!-- Tools & Technologies Section -->
    ${nonEmptyToolsTechnologies.length > 0 ? `
    <div class="section" data-section="toolsTechnologies">
      <div class="section-title">Tools & Technologies</div>
      <hr class="divider" />
      ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.name || ''}</div>
            </div>
          </div>
          ${item.category ? `<div class="entry-subtitle">Category: ${item.category}</div>` : ''}
          ${item.proficiency ? `<div class="entry-subtitle">Proficiency: ${item.proficiency}</div>` : ''}
          ${item.experienceDuration ? `<div class="entry-subtitle">Experience: ${item.experienceDuration}</div>` : ''}
        </div>
      `).join('')}
    </div>` : ""}

    <!-- Languages Section -->
    ${nonEmptyLanguages.length > 0 ? `
    <div class="section" data-section="languages">
      <div class="section-title">Languages</div>
      <hr class="divider" />
      <div class="skills-container">
        ${nonEmptyLanguages.map((lang: any) => `<span class="skill-pill">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</span>`).join('')}
      </div>
    </div>` : ""}

    <!-- Certifications Section -->
    ${nonEmptyCertifications.length > 0 ? `
    <div class="section" data-section="certifications">
      <div class="section-title">Certifications</div>
      <hr class="divider" />
      ${nonEmptyCertifications.map((cert: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${cert.name || cert.title || cert}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${cert.date || ''}</div>
            </div>
          </div>
          ${cert.issuer ? `<div class="entry-subtitle">${cert.issuer}</div>` : ''}
          ${cert.url ? `<div class="entry-description"><a href="${cert.url}" target="_blank">${cert.url}</a></div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Education Section -->
    ${nonEmptyEducation.length > 0 ? `
    <div class="section" data-section="education">
      <div class="section-title">Education</div>
      <hr class="divider" />
      ${nonEmptyEducation.map((edu: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}</div>
              <div class="entry-subtitle">${edu.school || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${edu.graduationDate || edu.endDate || ''}</div>
            </div>
          </div>
          ${edu.startDate ? `<div class="entry-subtitle">Start: ${edu.startDate}</div>` : ''}
          ${edu.grade ? `<div class="entry-subtitle">Grade: ${edu.grade}</div>` : ''}
          ${edu.description ? `<div class="entry-description">${renderDescription(edu.description)}</div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Experience Section -->
    ${nonEmptyExperience.length > 0 ? `
    <div class="section" data-section="experience">
      <div class="section-title">Experience</div>
      <hr class="divider" />
      ${nonEmptyExperience.map((exp: any, index: number) => {
        const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrent);
        return `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${exp.title || ''}</div>
              <div class="entry-subtitle">${exp.company || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${dateRange}</div>
            </div>
          </div>
          <div class="entry-description">
            ${exp.description ? renderDescription(exp.description) : ''}
            ${exp.achievements ? `<p><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
          </div>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Projects Section -->
    ${nonEmptyProjects.length > 0 ? `
    <div class="section" data-section="projects">
      <div class="section-title">Projects</div>
      <hr class="divider" />
      ${nonEmptyProjects.map((project: any, index: number) => {
        const dateRange = formatDateRange(project.startDate, project.endDate);
        return `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${project.name || project.title || ''}</div>
              ${project.technologies ? `<div class="entry-subtitle">Technologies: ${project.technologies}</div>` : ''}
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${dateRange || project.duration || ''}</div>
            </div>
          </div>
          ${project.role ? `<div class="entry-subtitle">Role: ${project.role}</div>` : ''}
          <div class="entry-description">${project.description ? renderDescription(project.description) : ''}</div>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Internships Section -->
    ${nonEmptyInternships.length > 0 ? `
    <div class="section" data-section="internships">
      <div class="section-title">Internships</div>
      <hr class="divider" />
      ${nonEmptyInternships.map((item: any, index: number) => {
        const dateRange = item.duration || formatDateRange(item.startDate, item.endDate);
        return `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.title || ''}</div>
              <div class="entry-subtitle">${item.company || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${dateRange}</div>
            </div>
          </div>
          <div class="entry-description">${item.description ? renderDescription(item.description) : ''}</div>
        </div>
      `}).join('')}
    </div>` : ''}

    <!-- Training Programs Section -->
    ${nonEmptyTrainingPrograms.length > 0 ? `
    <div class="section" data-section="trainingPrograms">
      <div class="section-title">Training Programs</div>
      <hr class="divider" />
      ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.name || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.completionDate || item.duration || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.provider || item.organization || ''}</div>
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Academic Projects Section -->
    ${nonEmptyAcademicProjects.length > 0 ? `
    <div class="section" data-section="academicProjects">
      <div class="section-title">Academic Projects</div>
      <hr class="divider" />
      ${nonEmptyAcademicProjects.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.name || item.title || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.duration || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.institution || ''}${item.course ? ` | ${item.course}` : ''}</div>
          <div class="entry-description">
            ${item.description ? renderDescription(item.description) : ''}
            ${item.technologies ? `<p><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
            ${item.url ? `<p><strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Leadership Positions Section -->
    ${nonEmptyLeadershipPositions.length > 0 ? `
    <div class="section" data-section="leadershipPositions">
      <div class="section-title">Leadership Positions</div>
      <hr class="divider" />
      ${nonEmptyLeadershipPositions.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.position || item.title || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${formatDateRange(item.startDate, item.endDate) || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.organization || ''}</div>
          <div class="entry-description">${item.description ? renderDescription(item.description) : ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Co-curricular Section -->
    ${nonEmptyCoCurricular.length > 0 ? `
    <div class="section" data-section="coCurricular">
      <div class="section-title">Co-curricular Activities</div>
      <hr class="divider" />
      ${nonEmptyCoCurricular.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.activity || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.year || ''}</div>
            </div>
          </div>
          ${item.role ? `<div class="entry-subtitle">Role: ${item.role}</div>` : ''}
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Extracurricular Section -->
    ${nonEmptyExtracurricular.length > 0 ? `
    <div class="section" data-section="extracurricular">
      <div class="section-title">Extracurricular Activities</div>
      <hr class="divider" />
      ${nonEmptyExtracurricular.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.activity || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.year || ''}</div>
            </div>
          </div>
          ${item.role ? `<div class="entry-subtitle">Role: ${item.role}</div>` : ''}
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Scholarships Section -->
    ${nonEmptyScholarships.length > 0 ? `
    <div class="section" data-section="scholarships">
      <div class="section-title">Scholarships</div>
      <hr class="divider" />
      ${nonEmptyScholarships.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.name || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.year || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.provider || item.organization || ''}</div>
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Awards Section -->
    ${nonEmptyAwards.length > 0 ? `
    <div class="section" data-section="awards">
      <div class="section-title">Awards</div>
      <hr class="divider" />
      ${nonEmptyAwards.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.title || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.issueYear || item.year || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.organization || ''}</div>
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Speaking Engagements Section -->
    ${nonEmptySpeakingEngagements.length > 0 ? `
    <div class="section" data-section="speakingEngagements">
      <div class="section-title">Speaking Engagements</div>
      <hr class="divider" />
      ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.topic || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.date || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.eventName || ''}</div>
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Memberships Section -->
    ${nonEmptyMemberships.length > 0 ? `
    <div class="section" data-section="memberships">
      <div class="section-title">Memberships</div>
      <hr class="divider" />
      ${nonEmptyMemberships.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.membershipName || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.year || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.organizationName || item.organization || ''}</div>
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Workshops Section -->
    ${nonEmptyWorkshops.length > 0 ? `
    <div class="section" data-section="workshops">
      <div class="section-title">Workshops</div>
      <hr class="divider" />
      ${nonEmptyWorkshops.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.programTitle || item.title || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.year || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.conductedBy || ''}</div>
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Client Projects Section -->
    ${nonEmptyClientProjects.length > 0 ? `
    <div class="section" data-section="clientProjects">
      <div class="section-title">Client Projects</div>
      <hr class="divider" />
      ${nonEmptyClientProjects.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.name || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.duration || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</div>
          <div class="entry-description">
            ${item.description ? renderDescription(item.description) : ''}
            ${item.toolsTechnologies ? `<p><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ''}
            ${item.projectUrl ? `<p><strong>URL:</strong> <a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Portfolio Section -->
    ${nonEmptyPortfolio.length > 0 ? `
    <div class="section" data-section="portfolio">
      <div class="section-title">Portfolio</div>
      <hr class="divider" />
      ${nonEmptyPortfolio.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.name || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</div>
          <div class="entry-description">
            ${item.url ? `<p><a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
            ${item.description || ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Volunteering Section -->
    ${nonEmptyVolunteering.length > 0 ? `
    <div class="section" data-section="volunteering">
      <div class="section-title">Volunteering</div>
      <hr class="divider" />
      ${nonEmptyVolunteering.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.role || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}</div>
          <div class="entry-description">${item.description ? renderDescription(item.description) : ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Military Service Section -->
    ${nonEmptyMilitaryService.length > 0 ? `
    <div class="section" data-section="militaryService">
      <div class="section-title">Military Service</div>
      <hr class="divider" />
      ${nonEmptyMilitaryService.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
            </div>
          </div>
          ${item.specialization ? `<div class="entry-subtitle">Specialization: ${item.specialization}</div>` : ''}
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Methodologies Section -->
    ${nonEmptyMethodologies.length > 0 ? `
    <div class="section" data-section="methodologies">
      <div class="section-title">Methodologies</div>
      <hr class="divider" />
      ${nonEmptyMethodologies.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.name || ''}</div>
            </div>
          </div>
          <div class="entry-description">
            ${item.certification ? `<p><strong>Certification:</strong> ${item.certification}</p>` : ''}
            ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Industry Expertise Section -->
    ${nonEmptyIndustryExpertise.length > 0 ? `
    <div class="section" data-section="industryExpertise">
      <div class="section-title">Industry Expertise</div>
      <hr class="divider" />
      ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.industry || ''}</div>
            </div>
          </div>
          <div class="entry-description">
            ${item.domainArea ? `<p><strong>Domain:</strong> ${item.domainArea}</p>` : ''}
            ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Teaching Experience Section -->
    ${nonEmptyTeachingExperience.length > 0 ? `
    <div class="section" data-section="teachingExperience">
      <div class="section-title">Teaching Experience</div>
      <hr class="divider" />
      ${nonEmptyTeachingExperience.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.subjectCourseTaught || item.title || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.institution || ''}</div>
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Mentorship Experience Section -->
    ${nonEmptyMentorshipExperience.length > 0 ? `
    <div class="section" data-section="mentorshipExperience">
      <div class="section-title">Mentorship Experience</div>
      <hr class="divider" />
      ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.mentorshipArea || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</div>
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Research Grants Section -->
    ${nonEmptyResearchGrants.length > 0 ? `
    <div class="section" data-section="researchGrants">
      <div class="section-title">Research Grants</div>
      <hr class="divider" />
      ${nonEmptyResearchGrants.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.title || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.year || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.agency || ''}${item.amount ? ` | Amount: ${item.amount}` : ''}</div>
          <div class="entry-description">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Test Scores Section -->
    ${nonEmptyTestScores.length > 0 ? `
    <div class="section" data-section="testScores">
      <div class="section-title">Test Scores</div>
      <hr class="divider" />
      ${nonEmptyTestScores.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.testName || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.year || ''}</div>
            </div>
          </div>
          <div class="entry-description">
            <p><strong>Score:</strong> ${item.score || ''}</p>
            ${item.percentileRank ? `<p><strong>Percentile:</strong> ${item.percentileRank}</p>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Publications Section -->
    ${nonEmptyPublications.length > 0 ? `
    <div class="section" data-section="publications">
      <div class="section-title">Publications</div>
      <hr class="divider" />
      ${nonEmptyPublications.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.title || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.year || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.journalPublisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</div>
          ${item.urlDoi ? `<div class="entry-description"><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Patents Section -->
    ${nonEmptyPatents.length > 0 ? `
    <div class="section" data-section="patents">
      <div class="section-title">Patents</div>
      <hr class="divider" />
      ${nonEmptyPatents.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.title || ''}</div>
            </div>
            <div class="entry-right-block">
              <div class="entry-date">${item.year || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</div>
          ${item.status ? `<div class="entry-description"><strong>Status:</strong> ${item.status}</div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- References Section -->
    ${nonEmptyReferences.length > 0 ? `
    <div class="section" data-section="references">
      <div class="section-title">References</div>
      <hr class="divider" />
      ${nonEmptyReferences.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.name || ''}</div>
            </div>
          </div>
          <div class="entry-subtitle">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</div>
          ${item.contactInformation ? `<div class="entry-description">${item.contactInformation}</div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    <!-- Hobbies Section -->
    ${nonEmptyHobbies.length > 0 ? `
    <div class="section" data-section="hobbies">
      <div class="section-title">Hobbies & Interests</div>
      <hr class="divider" />
      <div class="skills-container">
        ${nonEmptyHobbies.map((hobby: any) => `<span class="skill-pill">${typeof hobby === "string" ? hobby.trim() : hobby}</span>`).join('')}
      </div>
    </div>` : ''}

    <!-- Social Profiles Section -->
    ${nonEmptySocialProfiles.length > 0 ? `
    <div class="section" data-section="socialProfiles">
      <div class="section-title">Social Profiles</div>
      <hr class="divider" />
      ${nonEmptySocialProfiles.map((item: any, index: number) => `
        <div class="entry-wrapper" data-index="${index}">
          <div class="entry-header-row">
            <div class="entry-left-block">
              <div class="entry-title">${item.platform || 'Profile'}</div>
            </div>
          </div>
          <div class="entry-description"><a href="${item.url || ''}" target="_blank">${item.url || ''}</a></div>
        </div>
      `).join('')}
    </div>` : ''}

  </div>
</div>
</body>
</html>`;
}