export function buildCosmosTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#0e6d7d", // Professional Teal
    secondary: "#f4f4f5",
    background: "#ffffff",
    headingFont: "Arial, sans-serif",
    bodyFont: "Arial, sans-serif",
  };

  const currentTheme = theme || defaultTheme;
  const userFontSize = data.fontSize || 10;
  const userFontFamily = data.fontFamily || "Arial, sans-serif";

  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.8);

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
  const getNonEmptyItems = (arr: any[]): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter(item => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(val => 
          typeof val === "string" && val.trim().length > 0
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

  // Helper function to check if section has data
  const hasData = (section: any): boolean => {
    if (!section) return false;
    if (Array.isArray(section)) return hasNonEmptyItems(section);
    if (typeof section === "object") return hasObjectValues(section);
    return typeof section === "string" && section.trim().length > 0;
  };

  // Helper to format date range
  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    return parts.join(" - ");
  };

  // Helper to safely get array from skills
  const getSkillsArray = (skills: any): string[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.filter(s => s && (typeof s === "string" ? s.trim() : s));
    if (typeof skills === "string") {
      if (skills.includes('<ul>')) {
        const matches = skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          return matches.map(m => m.replace(/<\/?li>/g, '').trim()).filter(s => s);
        }
      }
      return skills.split(",").map(s => s.trim()).filter(s => s);
    }
    return [];
  };

  const skillsArray = getSkillsArray(data.skills);

  // Process arrays to ensure only non-empty items are shown
  const nonEmptyInternships = getNonEmptyItems(data.internships || []);
  const nonEmptyTrainingPrograms = getNonEmptyItems(data.trainingPrograms || []);
  const nonEmptyAcademicProjects = getNonEmptyItems(data.academicProjects || []);
  const nonEmptyClientProjects = getNonEmptyItems(data.clientProjects || []);
  const nonEmptyPortfolio = getNonEmptyItems(data.portfolio || []);
  const nonEmptyLeadershipPositions = getNonEmptyItems(data.leadershipPositions || []);
  const nonEmptyVolunteering = getNonEmptyItems(data.volunteering || []);
  const nonEmptyMilitaryService = getNonEmptyItems(data.militaryService || []);
  const nonEmptyTeachingExperience = getNonEmptyItems(data.teachingExperience || []);
  const nonEmptyMentorshipExperience = getNonEmptyItems(data.mentorshipExperience || []);
  const nonEmptyResearchGrants = getNonEmptyItems(data.researchGrants || []);
  const nonEmptyPublications = getNonEmptyItems(data.publications || []);
  const nonEmptyPatents = getNonEmptyItems(data.patents || []);
  const nonEmptyTestScores = getNonEmptyItems(data.testScores || []);
  const nonEmptyScholarships = getNonEmptyItems(data.scholarships || []);
  const nonEmptyAwards = getNonEmptyItems(data.awards || []);
  const nonEmptySpeakingEngagements = getNonEmptyItems(data.speakingEngagements || []);
  const nonEmptyMemberships = getNonEmptyItems(data.memberships || []);
  const nonEmptyWorkshops = getNonEmptyItems(data.workshops || []);
  const nonEmptyCoCurricular = getNonEmptyItems(data.coCurricular || []);
  const nonEmptyExtracurricular = getNonEmptyItems(data.extracurricular || []);
  const nonEmptyToolsTechnologies = getNonEmptyItems(data.toolsTechnologies || []);
  const nonEmptyMethodologies = getNonEmptyItems(data.methodologies || []);
  const nonEmptyIndustryExpertise = getNonEmptyItems(data.industryExpertise || []);
  const nonEmptyReferences = getNonEmptyItems(data.references || []);
  const nonEmptySocialProfiles = getNonEmptyItems(data.socialProfiles || []);
  const nonEmptySocialLinks = getNonEmptyItems(data.socialLinks || []);
  const nonEmptyLanguages = getNonEmptyItems(data.languages || []);
  const nonEmptyHobbies = getNonEmptyItems(data.hobbies || []);
  const nonEmptyKeyAchievements = getNonEmptyItems(data.keyAchievements || []);
  const nonEmptyResponsibilities = getNonEmptyItems(
    Array.isArray(data.responsibilities) 
      ? data.responsibilities 
      : (data.responsibilities || "").split("\n")
  );
  const nonEmptyTools = getNonEmptyItems(
    Array.isArray(data.tools) ? data.tools : (data.tools || "").split(",")
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
      --primary: ${currentTheme.primary};
      --text: #1a1a1a;
      --text-light: #52525b;
      --border: #e4e4e7;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text);
      line-height: 1.5;
      background: #e5e7eb;
      font-size: ${baseFontSize}px;
      padding: 40px 0;
    }

    .container {
      max-width: 850px;
      margin: 0 auto;
      background: #fff;
      min-height: 1100px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }

    /* Teal accent bar at the very top */
    .top-accent {
      height: 20px;
      background: var(--primary);
      width: 100%;
    }

    .main-layout {
      display: grid;
      grid-template-columns: 1.8fr 1fr;
      flex-grow: 1;
    }

    /* Left Column Content */
    .left-col {
      padding: 45px 40px;
      border-right: 1px solid #f3f4f6;
    }

    /* Right Column Sidebar */
    .right-col {
      padding: 45px 30px;
      background: #fff;
    }

    /* Photo Section - Placed in Right Column */
    .photo-wrapper {
      width: 100%;
      margin-bottom: 35px;
    }

    .profile-img {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      display: block;
      filter: grayscale(20%);
      border-radius: 8px;
    }

    .profile-photo-placeholder {
      width: 100%;
      aspect-ratio: 1 / 1;
      background: linear-gradient(135deg, var(--primary) 0%, #f3f4f6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text);
      font-size: ${Math.round(baseFontSize * 4)}px;
      font-weight: 700;
      border-radius: 8px;
    }

    .name-heading {
      font-size: ${headingFontSize}px;
      font-weight: 800;
      text-transform: uppercase;
      line-height: 1.1;
      margin-bottom: 35px;
      color: #000;
      letter-spacing: -0.5px;
    }

    .section-box {
      margin-bottom: 30px;
    }

    .section-label {
      font-size: ${baseFontSize}px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text);
      border-bottom: 2px solid var(--border);
      padding-bottom: 4px;
      margin-bottom: 15px;
      letter-spacing: 0.5px;
    }

    .entry-item {
      margin-bottom: 20px;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 8px;
    }

    .entry-bold {
      font-weight: 700;
      color: #000;
    }

    .entry-title {
      font-weight: 700;
      color: #000;
    }

    .entry-date {
      color: var(--text-light);
      font-size: ${baseFontSize - 1}px;
      font-style: italic;
    }

    .entry-sub {
      color: var(--text-light);
      font-size: ${baseFontSize - 1}px;
      margin-bottom: 6px;
    }

    .entry-detail {
      color: var(--text);
      font-size: ${baseFontSize - 1}px;
      margin: 4px 0;
    }

    .entry-detail strong {
      color: var(--primary);
      font-weight: 600;
    }

    .description-text {
      color: var(--text);
      font-size: ${baseFontSize}px;
    }

    .description-text ul {
      margin-top: 5px;
      padding-left: 15px;
    }

    /* Sidebar specific styling */
    .contact-row {
      margin-bottom: 15px;
      font-size: ${baseFontSize - 1}px;
      word-break: break-word;
    }

    .contact-label {
      font-weight: 700;
      display: block;
      color: #000;
      margin-bottom: 2px;
    }

    .contact-row a {
      color: var(--primary);
      text-decoration: none;
    }

    .contact-row a:hover {
      text-decoration: underline;
    }

    .skill-item {
      display: block;
      margin-bottom: 6px;
      padding-left: 12px;
      position: relative;
    }

    .skill-item::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: bold;
    }

    .skills-container {
      display: flex;
      flex-direction: column;
    }

    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 5px;
    }

    .tech-tag {
      background-color: ${currentTheme.primary}15;
      color: var(--primary);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: ${baseFontSize - 2}px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    @media print {
      body { padding: 0; background: white; }
      .container { box-shadow: none; width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="top-accent"></div>
    
    <div class="main-layout">
      <div class="left-col">
        <div class="name-heading" data-section="personal">
          ${data.personal?.name?.toUpperCase() || "YOUR NAME"}
        </div>

        <!-- Summary -->
        ${data.summary && data.summary.trim() ? `
          <div class="section-box" data-section="summary">
            <div class="section-label">Summary</div>
            <div class="description-text">${data.summary}</div>
          </div>
        ` : ""}

        <!-- Career Objective -->
        ${data.careerObjective && data.careerObjective.trim() ? `
          <div class="section-box" data-section="careerObjective">
            <div class="section-label">Career Objective</div>
            <div class="description-text">${data.careerObjective}</div>
          </div>
        ` : ""}

        <!-- Work Experience -->
        ${data.experience && hasNonEmptyItems(data.experience) ? `
          <div class="section-box" data-section="experience">
            <div class="section-label">Experience</div>
            ${data.experience.filter((exp: any) => exp.title || exp.company).map((exp: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${exp.title || ""}</span>
                  <span class="entry-date">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                </div>
                <div class="entry-sub">
                  ${exp.company ? exp.company : ""}${exp.location ? `, ${exp.location}` : ""}${exp.domain ? ` | ${exp.domain}` : ""}
                </div>
                ${exp.description && exp.description.trim() ? `<div class="description-text">${exp.description}</div>` : ""}
                ${exp.achievements && exp.achievements.trim() ? `<div class="description-text" style="margin-top: 8px;"><strong>Key Achievements:</strong> ${exp.achievements}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Education -->
        ${data.education && hasNonEmptyItems(data.education) ? `
          <div class="section-box" data-section="education">
            <div class="section-label">Education</div>
            ${data.education.filter((edu: any) => edu.degree || edu.school).map((edu: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${edu.degree ? edu.degree : ""}${edu.field ? ` in ${edu.field}` : ""}</span>
                  <span class="entry-date">${edu.graduationDate || edu.endDate || ""}</span>
                </div>
                <div class="entry-sub">
                  ${edu.school ? edu.school : ""}${edu.location ? `, ${edu.location}` : ""}
                </div>
                ${edu.startDate && edu.startDate.trim() ? `<div class="entry-detail"><strong>Start Date:</strong> ${edu.startDate}</div>` : ""}
                ${edu.grade && edu.grade.trim() ? `<div class="entry-detail"><strong></strong> ${edu.grade}</div>` : ""}
                ${edu.description && edu.description.trim() ? `<div class="description-text">${edu.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Internships -->
        ${nonEmptyInternships.length > 0 ? `
          <div class="section-box" data-section="internships">
            <div class="section-label">Internships</div>
            ${nonEmptyInternships.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.title || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">${item.company ? item.company : ""}${item.location ? `, ${item.location}` : ""}</div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Academic Projects -->
        ${nonEmptyAcademicProjects.length > 0 ? `
          <div class="section-box" data-section="academicProjects">
            <div class="section-label">Academic Projects</div>
            ${nonEmptyAcademicProjects.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.name || item.title || ""}</span>
                  <span class="entry-date">${item.duration || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.institution ? item.institution : ""}${item.course ? ` | ${item.course}` : ""}
                </div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
                ${item.technologies && item.technologies.length > 0 ? `
                  <div class="tech-stack">
                    ${(Array.isArray(item.technologies) ? item.technologies : [item.technologies]).filter((tech: string) => tech && tech.trim()).map((tech: string) => 
                      `<span class="tech-tag">${tech.trim()}</span>`
                    ).join("")}
                  </div>
                ` : ""}
                ${item.url ? `<div class="entry-detail"><strong>URL:</strong> <a href="${item.url}" target="_blank" style="color: var(--primary);">${item.url}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Training Programs -->
        ${nonEmptyTrainingPrograms.length > 0 ? `
          <div class="section-box" data-section="trainingPrograms">
            <div class="section-label">Training Programs</div>
            ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.name || ""}</span>
                  <span class="entry-date">${item.completionDate || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.provider || item.organization || ""}${item.duration ? ` | ${item.duration}` : ""}
                </div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Leadership Positions -->
        ${nonEmptyLeadershipPositions.length > 0 ? `
          <div class="section-box" data-section="leadershipPositions">
            <div class="section-label">Leadership & Positions</div>
            ${nonEmptyLeadershipPositions.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.position || item.title || ""}</span>
                  <span class="entry-date">${formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">${item.organization ? item.organization : ""}</div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Co-curricular Activities -->
        ${nonEmptyCoCurricular.length > 0 ? `
          <div class="section-box" data-section="coCurricular">
            <div class="section-label">Co-curricular Activities</div>
            ${nonEmptyCoCurricular.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.activity || ""}</span>
                  <span class="entry-date">${item.year || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.organization ? item.organization : ""}${item.role ? ` | ${item.role}` : ""}
                </div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Extracurricular Activities -->
        ${nonEmptyExtracurricular.length > 0 ? `
          <div class="section-box" data-section="extracurricular">
            <div class="section-label">Extracurricular Activities</div>
            ${nonEmptyExtracurricular.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.activity || ""}</span>
                  <span class="entry-date">${item.year || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.organization ? item.organization : ""}${item.role ? ` | ${item.role}` : ""}
                </div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Projects -->
        ${data.projects && hasNonEmptyItems(data.projects) ? `
          <div class="section-box" data-section="projects">
            <div class="section-label">Projects</div>
            ${data.projects.filter((project: any) => project.name).map((project: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${project.name || ""}</span>
                  <span class="entry-date">${formatDateRange(project.startDate, project.endDate) || ""}</span>
                </div>
                ${project.technologies && project.technologies.trim() ? `<div class="entry-detail"><strong>Technologies:</strong> ${project.technologies}</div>` : ""}
                ${project.description && project.description.trim() ? `<div class="description-text">${project.description}</div>` : ""}
                ${project.url ? `<div class="entry-detail"><a href="${project.url}" target="_blank" style="color: var(--primary);">${project.urlText || project.url}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Certifications -->
        ${data.certifications && hasNonEmptyItems(data.certifications) ? `
          <div class="section-box" data-section="certifications">
            <div class="section-label">Certifications</div>
            ${data.certifications.filter((cert: any) => cert.name).map((cert: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${cert.name || ""}</span>
                  <span class="entry-date">${cert.date || ""}</span>
                </div>
                <div class="entry-sub">${cert.issuer || ""}</div>
                ${cert.description && cert.description.trim() ? `<div class="description-text">${cert.description}</div>` : ""}
                ${cert.url ? `<div class="entry-detail"><a href="${cert.url}" target="_blank" style="color: var(--primary);">View Certificate</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Scholarships -->
        ${nonEmptyScholarships.length > 0 ? `
          <div class="section-box" data-section="scholarships">
            <div class="section-label">Scholarships</div>
            ${nonEmptyScholarships.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.name || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.provider || item.organization || ""}${item.amount ? ` | Amount: ${item.amount}` : ""}
                </div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Awards -->
        ${nonEmptyAwards.length > 0 ? `
          <div class="section-box" data-section="awards">
            <div class="section-label">Awards</div>
            ${nonEmptyAwards.map((award: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${award.title || ""}</span>
                  <span class="entry-date">${award.issueYear || award.year || ""}</span>
                </div>
                <div class="entry-sub">${award.organization || ""}</div>
                ${award.description && award.description.trim() ? `<div class="description-text">${award.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Speaking Engagements -->
        ${nonEmptySpeakingEngagements.length > 0 ? `
          <div class="section-box" data-section="speakingEngagements">
            <div class="section-label">Speaking Engagements</div>
            ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.topic || ""}</span>
                  <span class="entry-date">${item.date || ""}</span>
                </div>
                <div class="entry-sub">${item.eventName || ""}</div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Memberships -->
        ${nonEmptyMemberships.length > 0 ? `
          <div class="section-box" data-section="memberships">
            <div class="section-label">Memberships</div>
            ${nonEmptyMemberships.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.membershipName || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-sub">${item.organizationName || ""}</div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Workshops -->
        ${nonEmptyWorkshops.length > 0 ? `
          <div class="section-box" data-section="workshops">
            <div class="section-label">Workshops</div>
            ${nonEmptyWorkshops.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.programTitle || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-sub">${item.conductedBy || ""}</div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Portfolio -->
        ${nonEmptyPortfolio.length > 0 ? `
          <div class="section-box" data-section="portfolio">
            <div class="section-label">Portfolio</div>
            ${nonEmptyPortfolio.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.name || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.type ? item.type : ""}${item.platform ? ` on ${item.platform}` : ""}
                </div>
                ${item.url ? `<div class="entry-detail"><a href="${item.url}" target="_blank" style="color: var(--primary);">${item.url}</a></div>` : ""}
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Client Projects -->
        ${nonEmptyClientProjects.length > 0 ? `
          <div class="section-box" data-section="clientProjects">
            <div class="section-label">Client Projects</div>
            ${nonEmptyClientProjects.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.name || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.clientOrganization ? item.clientOrganization : ""}${item.role ? ` - ${item.role}` : ""}
                </div>
                ${item.duration ? `<div class="entry-detail"><strong>Duration:</strong> ${item.duration}</div>` : ""}
                ${item.toolsTechnologies ? `<div class="entry-detail"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
                ${item.projectUrl ? `<div class="entry-detail"><a href="${item.projectUrl}" target="_blank" style="color: var(--primary);">${item.projectUrl}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Volunteering -->
        ${nonEmptyVolunteering.length > 0 ? `
          <div class="section-box" data-section="volunteering">
            <div class="section-label">Volunteering</div>
            ${nonEmptyVolunteering.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.role || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">${item.organization ? item.organization : ""}</div>
                ${item.causeArea ? `<div class="entry-detail"><strong>Cause:</strong> ${item.causeArea}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Military Service -->
        ${nonEmptyMilitaryService.length > 0 ? `
          <div class="section-box" data-section="militaryService">
            <div class="section-label">Military Service</div>
            ${nonEmptyMilitaryService.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.branch ? item.branch : ""}${item.rank ? ` - ${item.rank}` : ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                ${item.specialization ? `<div class="entry-sub">${item.specialization}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Key Achievements -->
        ${nonEmptyKeyAchievements.length > 0 ? `
          <div class="section-box" data-section="keyAchievements">
            <div class="section-label">Key Achievements</div>
            ${nonEmptyKeyAchievements.map((achievement: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="description-text">• ${achievement}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Responsibilities -->
        ${nonEmptyResponsibilities.length > 0 ? `
          <div class="section-box" data-section="responsibilities">
            <div class="section-label">Responsibilities</div>
            ${nonEmptyResponsibilities.map((responsibility: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="description-text">• ${responsibility}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Tools (Simple List) -->
        ${nonEmptyTools.length > 0 ? `
          <div class="section-box" data-section="tools">
            <div class="section-label">Tools & Technologies</div>
            <div class="skills-container">
              ${nonEmptyTools.map((tool: any) => `
                  <span class="skill-item">${typeof tool === "string" ? tool.trim() : tool}</span>
                `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Tools Technologies (from toolsTechnologies array) -->
        ${nonEmptyToolsTechnologies.length > 0 ? `
          <div class="section-box" data-section="toolsTechnologies">
            <div class="section-label">Tools & Technologies</div>
            <div class="grid-2">
              ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
                <div class="entry-item" data-index="${index}">
                  <div class="entry-bold">${item.name || ""}</div>
                  ${item.category ? `<div class="entry-detail"><strong>Category:</strong> ${item.category}</div>` : ""}
                  ${item.proficiency ? `<div class="entry-detail"><strong>Proficiency:</strong> ${item.proficiency}</div>` : ""}
                  ${item.experienceDuration ? `<div class="entry-detail"><strong>Experience:</strong> ${item.experienceDuration}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Methodologies -->
        ${nonEmptyMethodologies.length > 0 ? `
          <div class="section-box" data-section="methodologies">
            <div class="section-label">Methodologies</div>
            <div class="grid-2">
              ${nonEmptyMethodologies.map((item: any, index: number) => `
                <div class="entry-item" data-index="${index}">
                  <div class="entry-bold">${item.name || ""}</div>
                  ${item.certification ? `<div class="entry-detail"><strong>Certification:</strong> ${item.certification}</div>` : ""}
                  ${item.experienceDuration ? `<div class="entry-detail"><strong>Experience:</strong> ${item.experienceDuration}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Industry Expertise -->
        ${nonEmptyIndustryExpertise.length > 0 ? `
          <div class="section-box" data-section="industryExpertise">
            <div class="section-label">Industry Expertise</div>
            <div class="grid-2">
              ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
                <div class="entry-item" data-index="${index}">
                  <div class="entry-bold">${item.industry || ""}</div>
                  ${item.domainArea ? `<div class="entry-detail"><strong>Domain:</strong> ${item.domainArea}</div>` : ""}
                  ${item.experienceDuration ? `<div class="entry-detail"><strong>Experience:</strong> ${item.experienceDuration}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Teaching Experience -->
        ${nonEmptyTeachingExperience.length > 0 ? `
          <div class="section-box" data-section="teachingExperience">
            <div class="section-label">Teaching Experience</div>
            ${nonEmptyTeachingExperience.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.subjectCourseTaught || item.title || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">${item.institution ? item.institution : ""}${item.title && !item.subjectCourseTaught ? ` - ${item.title}` : ""}</div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Mentorship Experience -->
        ${nonEmptyMentorshipExperience.length > 0 ? `
          <div class="section-box" data-section="mentorshipExperience">
            <div class="section-label">Mentorship Experience</div>
            ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.mentorshipArea || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">${item.organizationPlatform ? item.organizationPlatform : ""}${item.menteeLevel ? ` - ${item.menteeLevel}` : ""}</div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Research Grants -->
        ${nonEmptyResearchGrants.length > 0 ? `
          <div class="section-box" data-section="researchGrants">
            <div class="section-label">Research Grants</div>
            ${nonEmptyResearchGrants.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.title || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-sub">${item.agency ? item.agency : ""}${item.amount ? ` | Amount: ${item.amount}` : ""}</div>
                ${item.description && item.description.trim() ? `<div class="description-text">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Test Scores -->
        ${nonEmptyTestScores.length > 0 ? `
          <div class="section-box" data-section="testScores">
            <div class="section-label">Test Scores</div>
            <div class="grid-2">
              ${nonEmptyTestScores.map((item: any, index: number) => `
                <div class="entry-item" data-index="${index}">
                  <div class="entry-header">
                    <span class="entry-bold">${item.testName || ""}</span>
                    <span class="entry-date">${item.year || ""}</span>
                  </div>
                  <div class="entry-detail"><strong>Score:</strong> ${item.score || ""}</div>
                  ${item.percentileRank ? `<div class="entry-detail"><strong>Percentile:</strong> ${item.percentileRank}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Publications -->
        ${nonEmptyPublications.length > 0 ? `
          <div class="section-box" data-section="publications">
            <div class="section-label">Publications</div>
            ${nonEmptyPublications.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.title || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-sub">${item.journalPublisher ? item.journalPublisher : ""}${item.publicationType ? ` (${item.publicationType})` : ""}</div>
                ${item.urlDoi ? `<div class="entry-detail"><a href="${item.urlDoi}" target="_blank" style="color: var(--primary);">${item.urlDoi}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Patents -->
        ${nonEmptyPatents.length > 0 ? `
          <div class="section-box" data-section="patents">
            <div class="section-label">Patents</div>
            ${nonEmptyPatents.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-bold">${item.title || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.patentNumber ? `Patent #: ${item.patentNumber}` : ""}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ""}
                </div>
                ${item.status ? `<div class="entry-detail"><strong>Status:</strong> ${item.status}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- References -->
        ${nonEmptyReferences.length > 0 ? `
          <div class="section-box" data-section="references">
            <div class="section-label">References</div>
            ${nonEmptyReferences.map((item: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-bold">${item.name || ""}</div>
                <div class="entry-sub">${item.designationRelationship ? item.designationRelationship : ""}${item.organization ? ` at ${item.organization}` : ""}</div>
                ${item.contactInformation ? `<div class="entry-detail"><strong>Contact:</strong> ${item.contactInformation}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Custom Sections -->
        ${data.customSections && data.customSections.length > 0 ? `
          ${data.customSections.filter((section: any) => section.visible !== false && section.title && section.title.trim()).map((section: any) => `
            ${section.entries && hasNonEmptyItems(section.entries) ? `
              <div class="section-box" data-section="customSections" data-custom-section-id="${section.id}">
                <div class="section-label">${section.title || ""}</div>
                ${section.entries.filter((entry: any) => entry.title || entry.description).map((entry: any, index: number) => `
                  <div class="entry-item" data-index="${index}">
                    <div class="entry-header">
                      <span class="entry-bold">${entry.title || ""}</span>
                      ${entry.date ? `<span class="entry-date">${entry.date}</span>` : ""}
                    </div>
                    ${entry.subtitle ? `<div class="entry-sub">${entry.subtitle}</div>` : ""}
                    ${entry.description && entry.description.trim() ? `<div class="description-text">${entry.description}</div>` : ""}
                  </div>
                `).join("")}
              </div>
            ` : ""}
          `).join("")}
        ` : ""}
      </div>

      <div class="right-col">
        <!-- Profile Photo -->
        <div class="photo-wrapper">
          ${data.personal?.image ? `
            <img src="${data.personal.image}" class="profile-img" alt="Profile Photo">
          ` : data.personal?.name ? `
            <div class="profile-photo-placeholder">
              ${data.personal.name.charAt(0).toUpperCase()}
            </div>
          ` : `
            <div class="profile-photo-placeholder">?</div>
          `}
        </div>

        <!-- Contact Information -->
        <div class="section-box" data-section="contact">
          <div class="section-label" data-section="contact">Contact</div>
          
          ${(() => {
            const addressParts = [
              data.personal?.fullAddress,
              data.personal?.location,
              data.personal?.country,
              data.personal?.pinCode
            ].filter(Boolean);
            return addressParts.length > 0 ? `
            <div class="contact-row" data-section="contact">
              <span class="contact-label">Address</span>
              ${addressParts.join(", ")}
            </div>
            ` : "";
          })()}
          
          ${data.personal?.phone ? `
            <div class="contact-row" data-section="contact">
              <span class="contact-label">Phone</span>
              ${data.personal.phone}
            </div>
          ` : ""}
          
          ${data.personal?.alternatePhone ? `
            <div class="contact-row" data-section="contact">
              <span class="contact-label">Alt. Phone</span>
              ${data.personal.alternatePhone}
            </div>
          ` : ""}
          
          ${data.personal?.email ? `
            <div class="contact-row" data-section="contact">
              <span class="contact-label">Email</span>
              ${data.personal.email}
            </div>
          ` : ""}
          
          ${data.personal?.linkedinUrl ? `
            <div class="contact-row" data-section="contact">
              <span class="contact-label">LinkedIn</span>
              <a href="${data.personal.linkedinUrl}" target="_blank">${data.personal.linkedinUrl}</a>
            </div>
          ` : ""}
          
          ${data.personal?.githubUrl ? `
            <div class="contact-row" data-section="contact">
              <span class="contact-label">GitHub</span>
              <a href="${data.personal.githubUrl}" target="_blank">${data.personal.githubUrl}</a>
            </div>
          ` : ""}
          
          ${data.personal?.portfolioUrl ? `
            <div class="contact-row" data-section="contact">
              <span class="contact-label">Portfolio</span>
              <a href="${data.personal.portfolioUrl}" target="_blank">${data.personal.portfolioUrl}</a>
            </div>
          ` : ""}
          
          ${data.personal?.website ? `
            <div class="contact-row" data-section="contact">
              <span class="contact-label">Website</span>
              <a href="${data.personal.website}" target="_blank">${data.personal.website}</a>
            </div>
          ` : ""}
        </div>

        <!-- Personal Details -->
        ${(() => {
          const personalDetails = [];
          if (data.personal?.fathersName) personalDetails.push('fathersName');
          if (data.personal?.dob) personalDetails.push('dob');
          if (data.personal?.gender) personalDetails.push('gender');
          if (data.personal?.maritalStatus) personalDetails.push('maritalStatus');
          if (data.personal?.nationality) personalDetails.push('nationality');
          if (data.personal?.passportNo) personalDetails.push('passportNo');
          
          return personalDetails.length > 0 ? `
          <div class="section-box" data-section="personal">
            <div class="section-label" data-section="personal">Personal Details</div>
            
            ${data.personal?.fathersName ? `
              <div class="contact-row" data-section="personal">
                <span class="contact-label">Father's Name</span>
                ${data.personal.fathersName}
              </div>
            ` : ""}
            
            ${data.personal?.dob ? `
              <div class="contact-row" data-section="personal">
                <span class="contact-label">Date of Birth</span>
                ${data.personal.dob}
              </div>
            ` : ""}
            
            ${data.personal?.gender ? `
              <div class="contact-row" data-section="personal">
                <span class="contact-label">Gender</span>
                ${data.personal.gender}
              </div>
            ` : ""}
            
            ${data.personal?.maritalStatus ? `
              <div class="contact-row" data-section="personal">
                <span class="contact-label">Marital Status</span>
                ${data.personal.maritalStatus}
              </div>
            ` : ""}
            
            ${data.personal?.nationality ? `
              <div class="contact-row" data-section="personal">
                <span class="contact-label">Nationality</span>
                ${data.personal.nationality}
              </div>
            ` : ""}
            
            ${data.personal?.passportNo ? `
              <div class="contact-row" data-section="personal">
                <span class="contact-label">Passport No</span>
                ${data.personal.passportNo}
              </div>
            ` : ""}
          </div>
          ` : "";
        })()}

        <!-- Professional Context -->
        ${data.professionalContext && Object.keys(data.professionalContext).filter(key => data.professionalContext[key]).length > 0 ? `
          <div class="section-box" data-section="professionalContext">
            <div class="section-label">Professional Context</div>
            ${data.professionalContext.totalExperience ? `
              <div class="contact-row">
                <span class="contact-label">Total Experience</span>
                ${data.professionalContext.totalExperience}
              </div>
            ` : ""}
            ${data.professionalContext.teamSize ? `
              <div class="contact-row">
                <span class="contact-label">Team Size</span>
                ${data.professionalContext.teamSize}
              </div>
            ` : ""}
            ${data.professionalContext.industry ? `
              <div class="contact-row">
                <span class="contact-label">Industry</span>
                ${data.professionalContext.industry}
              </div>
            ` : ""}
            ${data.professionalContext.functionalDomain ? `
              <div class="contact-row">
                <span class="contact-label">Functional Domain</span>
                ${data.professionalContext.functionalDomain}
              </div>
            ` : ""}
            ${data.professionalContext.geographicScope ? `
              <div class="contact-row">
                <span class="contact-label">Geographic Scope</span>
                ${data.professionalContext.geographicScope}
              </div>
            ` : ""}
            ${data.professionalContext.revenueResponsibility ? `
              <div class="contact-row">
                <span class="contact-label">Revenue Responsibility</span>
                ${data.professionalContext.revenueResponsibility}
              </div>
            ` : ""}
          </div>
        ` : ""}

        <!-- Availability & Work Auth -->
        ${data.availabilityWorkAuth && Object.keys(data.availabilityWorkAuth).filter(key => data.availabilityWorkAuth[key]).length > 0 ? `
          <div class="section-box" data-section="availabilityWorkAuth">
            <div class="section-label">Availability</div>
            ${data.availabilityWorkAuth.availabilityNoticePeriod ? `
              <div class="contact-row">
                <span class="contact-label">Notice Period</span>
                ${data.availabilityWorkAuth.availabilityNoticePeriod}
              </div>
            ` : ""}
            ${data.availabilityWorkAuth.workAuthorizationStatus ? `
              <div class="contact-row">
                <span class="contact-label">Work Auth</span>
                ${data.availabilityWorkAuth.workAuthorizationStatus}
              </div>
            ` : ""}
            ${data.availabilityWorkAuth.preferredLocation ? `
              <div class="contact-row">
                <span class="contact-label">Preferred Location</span>
                ${data.availabilityWorkAuth.preferredLocation}
              </div>
            ` : ""}
          </div>
        ` : ""}

        <!-- Skills -->
        ${skillsArray.length > 0 ? `
          <div class="section-box" data-section="skills">
            <div class="section-label">Skills</div>
            <div class="skills-container">
              ${skillsArray.map((skill: string) => `
                <span class="skill-item">${skill}</span>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Languages -->
        ${nonEmptyLanguages.length > 0 ? `
          <div class="section-box" data-section="languages">
            <div class="section-label">Languages</div>
            ${nonEmptyLanguages.map((lang: any, index: number) => `
              <div class="entry-item" data-index="${index}">
                <div class="entry-bold">${lang.language || lang}</div>
                <div class="entry-sub">
                  ${lang.proficiency ? `${lang.proficiency}` : ""}
                  ${lang.capability ? ` - ${lang.capability}` : ""}
                </div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Hobbies -->
        ${nonEmptyHobbies.length > 0 ? `
          <div class="section-box" data-section="hobbies">
            <div class="section-label">Hobbies</div>
            <div class="skills-container">
              ${nonEmptyHobbies.map((hobby: any) => `
                  <span class="skill-item">${typeof hobby === "string" ? hobby.trim() : hobby}</span>
                `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Social Links -->
        ${nonEmptySocialLinks.length > 0 ? `
          <div class="section-box" data-section="socialLinks">
            <div class="section-label">Social Links</div>
            ${nonEmptySocialLinks.map((link: any, index: number) => `
              <div class="contact-row" data-index="${index}">
                <span class="contact-label">${link.platform || link.urlText || "Link"}</span>
                <a href="${link.url}" target="_blank">${link.url}</a>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Social Profiles -->
        ${nonEmptySocialProfiles.length > 0 ? `
          <div class="section-box" data-section="socialProfiles">
            <div class="section-label">Social Profiles</div>
            ${nonEmptySocialProfiles.map((item: any, index: number) => `
              <div class="contact-row" data-index="${index}">
                <span class="contact-label">${item.platform || "Profile"}</span>
                <a href="${item.url}" target="_blank">${item.url}</a>
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    </div>
  </div>
</body>
</html>`;
}