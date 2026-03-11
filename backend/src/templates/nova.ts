export function buildNovaTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: "#80303d", // Burgundy/Maroon from the image
    secondary: "#a34a56",
    background: "#ffffff",
    headingFont: "Roboto",
    bodyFont: "Roboto",
  };

  const currentTheme = theme || defaultTheme;
  const userFontSize = data.fontSize || 16;
  const userFontFamily = data.fontFamily || "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif";

  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2); // Large name
  const subheadingFontSize = Math.round(userFontSize * 1.1);

  // Helper function to check if array has non-empty items
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
  const useTwoColumnsForSkills = skillsArray.length > 6;

  // Process arrays to ensure only non-empty items are shown
  const nonEmptyInternships = getNonEmptyItems(data.internships || []);
  const nonEmptyAcademicProjects = getNonEmptyItems(data.academicProjects || []);
  const nonEmptyTrainingPrograms = getNonEmptyItems(data.trainingPrograms || []);
  const nonEmptyLeadershipPositions = getNonEmptyItems(data.leadershipPositions || []);
  const nonEmptyCoCurricular = getNonEmptyItems(data.coCurricular || []);
  const nonEmptyExtracurricular = getNonEmptyItems(data.extracurricular || []);
  const nonEmptyProjects = getNonEmptyItems(data.projects || []);
  const nonEmptyCertifications = getNonEmptyItems(data.certifications || []);
  const nonEmptyScholarships = getNonEmptyItems(data.scholarships || []);
  const nonEmptyAwards = getNonEmptyItems(data.awards || []);
  const nonEmptyKeyAchievements = getNonEmptyItems(data.keyAchievements || []);
  const nonEmptyResponsibilities = getNonEmptyItems(
    Array.isArray(data.responsibilities) 
      ? data.responsibilities 
      : (data.responsibilities || "").split("\n")
  );
  const nonEmptyTools = getNonEmptyItems(
    Array.isArray(data.tools) ? data.tools : (data.tools || "").split(",")
  );
  const nonEmptySpeakingEngagements = getNonEmptyItems(data.speakingEngagements || []);
  const nonEmptyMemberships = getNonEmptyItems(data.memberships || []);
  const nonEmptyWorkshops = getNonEmptyItems(data.workshops || []);
  const nonEmptyPortfolio = getNonEmptyItems(data.portfolio || []);
  const nonEmptyClientProjects = getNonEmptyItems(data.clientProjects || []);
  const nonEmptyVolunteering = getNonEmptyItems(data.volunteering || []);
  const nonEmptyMilitaryService = getNonEmptyItems(data.militaryService || []);
  const nonEmptyToolsTechnologies = getNonEmptyItems(data.toolsTechnologies || []);
  const nonEmptyMethodologies = getNonEmptyItems(data.methodologies || []);
  const nonEmptyIndustryExpertise = getNonEmptyItems(data.industryExpertise || []);
  const nonEmptyTeachingExperience = getNonEmptyItems(data.teachingExperience || []);
  const nonEmptyMentorshipExperience = getNonEmptyItems(data.mentorshipExperience || []);
  const nonEmptyResearchGrants = getNonEmptyItems(data.researchGrants || []);
  const nonEmptyTestScores = getNonEmptyItems(data.testScores || []);
  const nonEmptyPublications = getNonEmptyItems(data.publications || []);
  const nonEmptyPatents = getNonEmptyItems(data.patents || []);
  const nonEmptyReferences = getNonEmptyItems(data.references || []);
  const nonEmptySocialProfiles = getNonEmptyItems(data.socialProfiles || []);
  const nonEmptySocialLinks = getNonEmptyItems(data.socialLinks || []);
  const nonEmptyLanguages = getNonEmptyItems(data.languages || []);
  const nonEmptyHobbies = getNonEmptyItems(data.hobbies || []);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --primary: ${currentTheme.primary};
      --text: #333333;
      --text-light: #666666;
      --border: #e2e2e2;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text);
      line-height: 1.4;
      background: #f0f0f0;
      font-size: ${baseFontSize}px;
      padding: 30px;
    }

    .container {
      max-width: 850px;
      margin: 0 auto;
      background: #fff;
      position: relative;
      overflow: hidden;
      min-height: 1100px;
    }

    /* Top Shape Header */
    .header-accent {
      position: absolute;
      top: 0;
      right: 0;
      width: 300px;
      height: 180px;
      background: var(--primary);
      border-bottom-left-radius: 100% 80%;
      z-index: 1;
    }

    .header {
      padding: 60px 50px 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      z-index: 2;
    }

    .name-block {
      max-width: 60%;
    }

    .name {
      font-size: ${headingFontSize}px;
      font-weight: 900;
      color: var(--primary);
      text-transform: uppercase;
      line-height: 1.1;
      margin-bottom: 10px;
    }

    .role-title {
       font-size: ${subheadingFontSize}px;
       letter-spacing: 2px;
       text-transform: uppercase;
       color: var(--text-light);
       font-weight: 500;
    }

    .photo-container {
      width: 140px;
      height: 140px;
      border-radius: 50%;
      border: 6px solid #fff;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      background: #eee;
    }

    .photo-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Layout Split */
    .main-grid {
      display: grid;
      grid-template-columns: 1.7fr 1fr;
      padding: 0 50px 50px;
      gap: 40px;
    }

    .section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: ${baseFontSize}px;
      font-weight: 900;
      text-transform: uppercase;
      color: #000;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }

    .left-col .section-title {
        border-bottom: 1px solid var(--primary);
        padding-bottom: 5px;
    }

    .right-col {
      border-left: 1px solid var(--primary);
      padding-left: 25px;
    }

    /* Content Styling */
    .entry {
      margin-bottom: 18px;
    }

    .entry-header {
      font-weight: 800;
      font-size: ${baseFontSize}px;
      margin-bottom: 2px;
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 8px;
    }

    .entry-title {
      font-weight: 800;
    }

    .entry-date {
      color: var(--text-light);
      font-size: ${baseFontSize - 1}px;
      font-weight: 400;
      font-style: italic;
    }

    .entry-sub {
      color: var(--text-light);
      font-weight: 600;
      font-size: ${baseFontSize - 1}px;
      margin-bottom: 5px;
      display: block;
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

    .entry-content {
      color: var(--text);
      font-size: ${baseFontSize - 1}px;
      text-align: justify;
      margin-top: 4px;
    }

    .entry-content ul {
      list-style-type: none;
      padding-left: 0;
    }

    .entry-content li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 4px;
    }

    .entry-content li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--primary);
    }

    /* Sidebar info items */
    .info-item {
      margin-bottom: 12px;
    }

    .info-label {
      display: block;
      font-weight: 800;
      font-size: ${baseFontSize - 2}px;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 2px;
    }

    .info-value {
      word-break: break-word;
      color: var(--text);
      font-size: ${baseFontSize - 1}px;
    }

    .info-value a {
      color: var(--primary);
      text-decoration: none;
    }

    .info-value a:hover {
      text-decoration: underline;
    }

    .skill-list {
        list-style: none;
        padding: 0;
    }

    .skill-list li {
        margin-bottom: 5px;
        font-weight: 500;
        position: relative;
        padding-left: 15px;
    }

    .skill-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--primary);
    }

    /* Dynamic Skills Grid Logic */
    .skills-list {
      display: block;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .skills-list ul {
      list-style: none;
      padding: 0;
      margin: 0 0 15px 0;
      display: grid;
      grid-template-columns: ${useTwoColumnsForSkills ? "1fr 1fr" : "1fr"};
      gap: 8px 15px;
    }

    .skills-list li {
      position: relative;
      padding-left: 18px;
      color: var(--text);
      font-size: ${baseFontSize - 1}px;
      margin-bottom: 5px;
      line-height: 1.5;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .skills-list li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: bold;
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
    <div class="header-accent"></div>
    
    <header class="header" data-section="personal">
      <div class="name-block">
        <div class="name">${
          data.personal?.name?.toUpperCase() || "YOUR NAME"
        }</div>
        ${data.personal?.jobTitle || data.personal?.role ? `<div class="role-title">${data.personal?.jobTitle || data.personal?.role}</div>` : ""}
      </div>
      
      <div class="photo-container">
        ${
          data.personal?.image
            ? `<img src="${data.personal.image}" alt="Profile">`
            : data.personal?.name ? `<div style="display:flex; height:100%; align-items:center; justify-content:center; background:var(--primary); color:white; font-size:40px;">${data.personal.name.charAt(0).toUpperCase()}</div>` : ""
        }
      </div>
    </header>

    <main class="main-grid">
      <div class="left-col">
        
        <!-- Summary -->
        ${data.summary && data.summary.trim() ? `
          <div class="section" data-section="summary">
            <div class="section-title">Summary</div>
            <div class="entry-content">${data.summary}</div>
          </div>
        ` : ""}

        <!-- Career Objective -->
        ${data.careerObjective && data.careerObjective.trim() ? `
          <div class="section" data-section="careerObjective">
            <div class="section-title">Career Objective</div>
            <div class="entry-content">${data.careerObjective}</div>
          </div>
        ` : ""}

        <!-- Work Experience -->
        ${data.experience && hasNonEmptyItems(data.experience) ? `
          <div class="section" data-section="experience">
            <div class="section-title">Experience</div>
            ${data.experience.filter((exp: any) => exp.title || exp.company).map((exp: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${exp.title || ""}</span>
                  <span class="entry-date">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                </div>
                <div class="entry-sub">
                  ${exp.company ? exp.company : ""}${exp.location ? `, ${exp.location}` : ""}${exp.domain ? ` | ${exp.domain}` : ""}
                </div>
                ${exp.description && exp.description.trim() ? `<div class="entry-content">${exp.description}</div>` : ""}
                ${exp.achievements && exp.achievements.trim() ? `<div class="entry-content" style="margin-top: 8px;"><strong style="color: var(--primary);">Key Achievements:</strong> ${exp.achievements}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Education -->
        ${data.education && hasNonEmptyItems(data.education) ? `
          <div class="section" data-section="education">
            <div class="section-title">Education</div>
            ${data.education.filter((edu: any) => edu.degree || edu.school).map((edu: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${edu.degree ? edu.degree : ""}${edu.field ? ` in ${edu.field}` : ""}</span>
                  <span class="entry-date">${edu.graduationDate || edu.endDate || ""}</span>
                </div>
                <div class="entry-sub">
                  ${edu.school ? edu.school : ""}${edu.location ? `, ${edu.location}` : ""}
                </div>
                ${edu.startDate ? `<div class="entry-detail"><strong>Start Date:</strong> ${edu.startDate}</div>` : ""}
                ${edu.grade ? `<div class="entry-detail"><strong>Grade:</strong> ${edu.grade}</div>` : ""}
                ${edu.description && edu.description.trim() ? `<div class="entry-content">${edu.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Internships -->
        ${nonEmptyInternships.length > 0 ? `
          <div class="section" data-section="internships">
            <div class="section-title">Internships</div>
            ${nonEmptyInternships.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.title || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">${item.company ? item.company : ""}${item.location ? `, ${item.location}` : ""}</div>
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Academic Projects -->
        ${nonEmptyAcademicProjects.length > 0 ? `
          <div class="section" data-section="academicProjects">
            <div class="section-title">Academic Projects</div>
            ${nonEmptyAcademicProjects.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.name || item.title || ""}</span>
                  <span class="entry-date">${item.duration || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.institution ? item.institution : ""}${item.course ? ` | ${item.course}` : ""}
                </div>
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
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
          <div class="section" data-section="trainingPrograms">
            <div class="section-title">Training Programs</div>
            ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.name || ""}</span>
                  <span class="entry-date">${item.completionDate || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.provider || item.organization || ""}${item.duration ? ` | ${item.duration}` : ""}
                </div>
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Leadership Positions -->
        ${nonEmptyLeadershipPositions.length > 0 ? `
          <div class="section" data-section="leadershipPositions">
            <div class="section-title">Leadership Positions</div>
            ${nonEmptyLeadershipPositions.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.position || item.title || ""}</span>
                  <span class="entry-date">${formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">${item.organization || ""}</div>
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Co-curricular Activities -->
        ${nonEmptyCoCurricular.length > 0 ? `
          <div class="section" data-section="coCurricular">
            <div class="section-title">Co-curricular Activities</div>
            ${nonEmptyCoCurricular.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.activity || ""}</span>
                  <span class="entry-date">${item.year || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                ${item.role ? `<div class="entry-detail"><strong>Role:</strong> ${item.role}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Extracurricular Activities -->
        ${nonEmptyExtracurricular.length > 0 ? `
          <div class="section" data-section="extracurricular">
            <div class="section-title">Extracurricular Activities</div>
            ${nonEmptyExtracurricular.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.activity || ""}</span>
                  <span class="entry-date">${item.year || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                ${item.role ? `<div class="entry-detail"><strong>Role:</strong> ${item.role}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Projects -->
        ${nonEmptyProjects.length > 0 ? `
          <div class="section" data-section="projects">
            <div class="section-title">Projects</div>
            ${nonEmptyProjects.map((project: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${project.name || ""}</span>
                  <span class="entry-date">${formatDateRange(project.startDate, project.endDate) || ""}</span>
                </div>
                ${project.technologies ? `<div class="entry-detail"><strong>Technologies:</strong> ${project.technologies}</div>` : ""}
                ${project.description && project.description.trim() ? `<div class="entry-content">${project.description}</div>` : ""}
                ${project.url ? `<div class="entry-detail"><a href="${project.url}" target="_blank" style="color: var(--primary);">${project.urlText || project.url}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Certifications -->
        ${nonEmptyCertifications.length > 0 ? `
          <div class="section" data-section="certifications">
            <div class="section-title">Certifications</div>
            ${nonEmptyCertifications.map((cert: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${cert.name || ""}</span>
                  <span class="entry-date">${cert.date || ""}</span>
                </div>
                <div class="entry-sub">${cert.issuer || ""}</div>
                ${cert.description && cert.description.trim() ? `<div class="entry-content">${cert.description}</div>` : ""}
                ${cert.url ? `<div class="entry-detail"><a href="${cert.url}" target="_blank" style="color: var(--primary);">View Certificate</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Scholarships -->
        ${nonEmptyScholarships.length > 0 ? `
          <div class="section" data-section="scholarships">
            <div class="section-title">Scholarships</div>
            ${nonEmptyScholarships.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.name || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.provider || item.organization || ""}${item.amount ? ` | Amount: ${item.amount}` : ""}
                </div>
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Awards -->
        ${nonEmptyAwards.length > 0 ? `
          <div class="section" data-section="awards">
            <div class="section-title">Awards</div>
            ${nonEmptyAwards.map((award: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${award.title || ""}</span>
                  <span class="entry-date">${award.issueYear || award.year || ""}</span>
                </div>
                <div class="entry-sub">${award.organization || ""}</div>
                ${award.description && award.description.trim() ? `<div class="entry-content">${award.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Key Achievements -->
        ${nonEmptyKeyAchievements.length > 0 ? `
          <div class="section" data-section="keyAchievements">
            <div class="section-title">Key Achievements</div>
            ${nonEmptyKeyAchievements.map((achievement: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-content">• ${achievement}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Responsibilities -->
        ${nonEmptyResponsibilities.length > 0 ? `
          <div class="section" data-section="responsibilities">
            <div class="section-title">Key Responsibilities</div>
            ${nonEmptyResponsibilities.map((line: string, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-content">• ${line.trim()}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Tools -->
        ${nonEmptyTools.length > 0 ? `
          <div class="section" data-section="tools">
            <div class="section-title">Tools & Technologies</div>
            <ul class="skill-list">
              ${nonEmptyTools.map((tool: any) => `
                  <li>${typeof tool === "string" ? tool.trim() : tool}</li>
                `).join("")}
            </ul>
          </div>
        ` : ""}

        <!-- Speaking Engagements -->
        ${nonEmptySpeakingEngagements.length > 0 ? `
          <div class="section" data-section="speakingEngagements">
            <div class="section-title">Speaking Engagements</div>
            ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.topic || ""}</span>
                  <span class="entry-date">${item.date || ""}</span>
                </div>
                <div class="entry-sub">${item.eventName || ""}</div>
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Memberships -->
        ${nonEmptyMemberships.length > 0 ? `
          <div class="section" data-section="memberships">
            <div class="section-title">Memberships</div>
            ${nonEmptyMemberships.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.membershipName || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-sub">${item.organizationName || ""}</div>
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Workshops -->
        ${nonEmptyWorkshops.length > 0 ? `
          <div class="section" data-section="workshops">
            <div class="section-title">Workshops</div>
            ${nonEmptyWorkshops.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.programTitle || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-sub">${item.conductedBy || ""}</div>
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Portfolio -->
        ${nonEmptyPortfolio.length > 0 ? `
          <div class="section" data-section="portfolio">
            <div class="section-title">Portfolio</div>
            ${nonEmptyPortfolio.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.name || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.type ? item.type : ""}${item.platform ? ` on ${item.platform}` : ""}
                </div>
                ${item.url ? `<div class="entry-detail"><a href="${item.url}" target="_blank" style="color: var(--primary);">${item.url}</a></div>` : ""}
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Client Projects -->
        ${nonEmptyClientProjects.length > 0 ? `
          <div class="section" data-section="clientProjects">
            <div class="section-title">Client Projects</div>
            ${nonEmptyClientProjects.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.name || ""}</span>
                </div>
                <div class="entry-sub">
                  ${item.clientOrganization ? item.clientOrganization : ""}${item.role ? ` - ${item.role}` : ""}
                </div>
                ${item.duration ? `<div class="entry-detail"><strong>Duration:</strong> ${item.duration}</div>` : ""}
                ${item.toolsTechnologies ? `<div class="entry-detail"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
                ${item.projectUrl ? `<div class="entry-detail"><a href="${item.projectUrl}" target="_blank" style="color: var(--primary);">${item.projectUrl}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Volunteering -->
        ${nonEmptyVolunteering.length > 0 ? `
          <div class="section" data-section="volunteering">
            <div class="section-title">Volunteering</div>
            ${nonEmptyVolunteering.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.role || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">${item.organization ? item.organization : ""}</div>
                ${item.causeArea ? `<div class="entry-detail"><strong>Cause:</strong> ${item.causeArea}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Military Service -->
        ${nonEmptyMilitaryService.length > 0 ? `
          <div class="section" data-section="militaryService">
            <div class="section-title">Military Service</div>
            ${nonEmptyMilitaryService.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.branch ? item.branch : ""}${item.rank ? ` - ${item.rank}` : ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                ${item.specialization ? `<div class="entry-sub">${item.specialization}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Tools & Technologies -->
        ${nonEmptyToolsTechnologies.length > 0 ? `
          <div class="section" data-section="toolsTechnologies">
            <div class="section-title">Tools & Technologies</div>
            <div class="grid-2">
              ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
                <div class="entry" data-index="${index}">
                  <div class="entry-title">${item.name || ""}</div>
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
          <div class="section" data-section="methodologies">
            <div class="section-title">Methodologies</div>
            <div class="grid-2">
              ${nonEmptyMethodologies.map((item: any, index: number) => `
                <div class="entry" data-index="${index}">
                  <div class="entry-title">${item.name || ""}</div>
                  ${item.certification ? `<div class="entry-detail"><strong>Certification:</strong> ${item.certification}</div>` : ""}
                  ${item.experienceDuration ? `<div class="entry-detail"><strong>Experience:</strong> ${item.experienceDuration}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Industry Expertise -->
        ${nonEmptyIndustryExpertise.length > 0 ? `
          <div class="section" data-section="industryExpertise">
            <div class="section-title">Industry Expertise</div>
            <div class="grid-2">
              ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
                <div class="entry" data-index="${index}">
                  <div class="entry-title">${item.industry || ""}</div>
                  ${item.domainArea ? `<div class="entry-detail"><strong>Domain:</strong> ${item.domainArea}</div>` : ""}
                  ${item.experienceDuration ? `<div class="entry-detail"><strong>Experience:</strong> ${item.experienceDuration}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Teaching Experience -->
        ${nonEmptyTeachingExperience.length > 0 ? `
          <div class="section" data-section="teachingExperience">
            <div class="section-title">Teaching Experience</div>
            ${nonEmptyTeachingExperience.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.subjectCourseTaught || item.title || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">${item.institution ? item.institution : ""}${item.title && !item.subjectCourseTaught ? ` - ${item.title}` : ""}</div>
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Mentorship Experience -->
        ${nonEmptyMentorshipExperience.length > 0 ? `
          <div class="section" data-section="mentorshipExperience">
            <div class="section-title">Mentorship Experience</div>
            ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.mentorshipArea || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-sub">${item.organizationPlatform ? item.organizationPlatform : ""}${item.menteeLevel ? ` - ${item.menteeLevel}` : ""}</div>
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Research Grants -->
        ${nonEmptyResearchGrants.length > 0 ? `
          <div class="section" data-section="researchGrants">
            <div class="section-title">Research Grants</div>
            ${nonEmptyResearchGrants.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.title || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-sub">${item.agency ? item.agency : ""}${item.amount ? ` | Amount: ${item.amount}` : ""}</div>
                ${item.description && item.description.trim() ? `<div class="entry-content">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Test Scores -->
        ${nonEmptyTestScores.length > 0 ? `
          <div class="section" data-section="testScores">
            <div class="section-title">Test Scores</div>
            <div class="grid-2">
              ${nonEmptyTestScores.map((item: any, index: number) => `
                <div class="entry" data-index="${index}">
                  <div class="entry-header">
                    <span class="entry-title">${item.testName || ""}</span>
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
          <div class="section" data-section="publications">
            <div class="section-title">Publications</div>
            ${nonEmptyPublications.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.title || ""}</span>
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
          <div class="section" data-section="patents">
            <div class="section-title">Patents</div>
            ${nonEmptyPatents.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.title || ""}</span>
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
          <div class="section" data-section="references">
            <div class="section-title">References</div>
            ${nonEmptyReferences.map((item: any, index: number) => `
              <div class="entry" data-index="${index}">
                <div class="entry-title">${item.name || ""}</div>
                <div class="entry-sub">${item.designationRelationship ? item.designationRelationship : ""}${item.organization ? ` at ${item.organization}` : ""}</div>
                ${item.contactInformation ? `<div class="entry-detail"><strong>Contact:</strong> ${item.contactInformation}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Skills (Left Column) -->
        ${skillsArray.length > 0 ? `
          <div class="section" data-section="skills">
            <div class="section-title">Skills</div>
            <div class="skills-list">
              ${typeof data.skills === "string" && data.skills.includes('<ul>') 
                ? data.skills 
                : `<ul>
                    ${skillsArray.map((skill: string, index: number) => 
                      `<li data-section="skills" data-index="${index}">${skill}</li>`
                    ).join("")}
                  </ul>`
              }
            </div>
          </div>
        ` : ""}

        <!-- Languages (Left Column) -->
        ${nonEmptyLanguages.length > 0 ? `
          <div class="section" data-section="languages">
            <div class="section-title">Languages</div>
            <ul class="skill-list">
              ${nonEmptyLanguages.map((lang: any) => `
                <li>${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ""}${lang.capability ? ` - ${lang.capability}` : ""}</li>
              `).join("")}
            </ul>
          </div>
        ` : ""}

        <!-- Hobbies -->
        ${nonEmptyHobbies.length > 0 ? `
          <div class="section" data-section="hobbies">
            <div class="section-title">Hobbies</div>
            <ul class="skill-list">
              ${nonEmptyHobbies.map((hobby: any) => `
                  <li>${typeof hobby === "string" ? hobby.trim() : hobby}</li>
                `).join("")}
            </ul>
          </div>
        ` : ""}

        <!-- Custom Sections -->
        ${data.customSections && data.customSections.length > 0 ? `
          ${data.customSections.filter((section: any) => section.visible !== false && section.title && section.title.trim()).map((section: any) => `
            ${section.entries && hasNonEmptyItems(section.entries) ? `
              <div class="section" data-section="customSections" data-custom-section-id="${section.id}">
                <div class="section-title">${section.title || ""}</div>
                ${section.entries.filter((entry: any) => entry.title || entry.description).map((entry: any, index: number) => `
                  <div class="entry" data-index="${index}">
                    <div class="entry-header">
                      <span class="entry-title">${entry.title || ""}</span>
                      ${entry.date ? `<span class="entry-date">${entry.date}</span>` : ""}
                    </div>
                    ${entry.subtitle ? `<div class="entry-sub">${entry.subtitle}</div>` : ""}
                    ${entry.description && entry.description.trim() ? `<div class="entry-content">${entry.description}</div>` : ""}
                  </div>
                `).join("")}
              </div>
            ` : ""}
          `).join("")}
        ` : ""}
      </div>

      <div class="right-col">
        
        <!-- Contact Information -->
        <div class="section" data-section="contact">
          <div class="section-title" data-section="contact">Contact</div>
          
          ${data.personal?.email ? `
            <div class="info-item" data-section="contact">
              <span class="info-label">Email</span>
              <div class="info-value">${data.personal.email}</div>
            </div>
          ` : ""}
          
          ${data.personal?.phone ? `
            <div class="info-item" data-section="contact">
              <span class="info-label">Phone</span>
              <div class="info-value">${data.personal.phone}</div>
            </div>
          ` : ""}
          
          ${data.personal?.alternatePhone ? `
            <div class="info-item" data-section="contact">
              <span class="info-label">Alt. Phone</span>
              <div class="info-value">${data.personal.alternatePhone}</div>
            </div>
          ` : ""}
          
          ${(() => {
            const addressParts = [
              data.personal?.fullAddress,
              data.personal?.location,
              data.personal?.country,
              data.personal?.pinCode
            ].filter(Boolean);
            return addressParts.length > 0 ? `
            <div class="info-item" data-section="contact">
              <span class="info-label">Address</span>
              <div class="info-value">${addressParts.join(", ")}</div>
            </div>
            ` : "";
          })()}
          
          ${data.personal?.linkedinUrl ? `
            <div class="info-item" data-section="contact">
              <span class="info-label">LinkedIn</span>
              <div class="info-value"><a href="${data.personal.linkedinUrl}" target="_blank">${data.personal.linkedinUrl}</a></div>
            </div>
          ` : ""}
          
          ${data.personal?.githubUrl ? `
            <div class="info-item" data-section="contact">
              <span class="info-label">GitHub</span>
              <div class="info-value"><a href="${data.personal.githubUrl}" target="_blank">${data.personal.githubUrl}</a></div>
            </div>
          ` : ""}
          
          ${data.personal?.portfolioUrl ? `
            <div class="info-item" data-section="contact">
              <span class="info-label">Portfolio</span>
              <div class="info-value"><a href="${data.personal.portfolioUrl}" target="_blank">${data.personal.portfolioUrl}</a></div>
            </div>
          ` : ""}
          
          ${data.personal?.website ? `
            <div class="info-item" data-section="contact">
              <span class="info-label">Website</span>
              <div class="info-value"><a href="${data.personal.website}" target="_blank">${data.personal.website}</a></div>
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
          <div class="section" data-section="personal">
            <div class="section-title" data-section="personal">Personal Details</div>
            
            ${data.personal?.fathersName ? `
              <div class="info-item" data-section="personal">
                <span class="info-label">Father's Name</span>
                <div class="info-value">${data.personal.fathersName}</div>
              </div>
            ` : ""}
            
            ${data.personal?.dob ? `
              <div class="info-item" data-section="personal">
                <span class="info-label">Date of Birth</span>
                <div class="info-value">${data.personal.dob}</div>
              </div>
            ` : ""}
            
            ${data.personal?.gender ? `
              <div class="info-item" data-section="personal">
                <span class="info-label">Gender</span>
                <div class="info-value">${data.personal.gender}</div>
              </div>
            ` : ""}
            
            ${data.personal?.maritalStatus ? `
              <div class="info-item" data-section="personal">
                <span class="info-label">Marital Status</span>
                <div class="info-value">${data.personal.maritalStatus}</div>
              </div>
            ` : ""}
            
            ${data.personal?.nationality ? `
              <div class="info-item" data-section="personal">
                <span class="info-label">Nationality</span>
                <div class="info-value">${data.personal.nationality}</div>
              </div>
            ` : ""}
            
            ${data.personal?.passportNo ? `
              <div class="info-item" data-section="personal">
                <span class="info-label">Passport No</span>
                <div class="info-value">${data.personal.passportNo}</div>
              </div>
            ` : ""}
          </div>
          ` : "";
        })()}

        <!-- Professional Context -->
        ${data.professionalContext && Object.keys(data.professionalContext).filter(key => data.professionalContext[key]).length > 0 ? `
          <div class="section" data-section="professionalContext">
            <div class="section-title">Professional Context</div>
            ${data.professionalContext.totalExperience ? `
              <div class="info-item" data-section="professionalContext">
                <span class="info-label">Total Experience</span>
                <div class="info-value">${data.professionalContext.totalExperience}</div>
              </div>
            ` : ""}
            ${data.professionalContext.teamSize ? `
              <div class="info-item" data-section="professionalContext">
                <span class="info-label">Team Size</span>
                <div class="info-value">${data.professionalContext.teamSize}</div>
              </div>
            ` : ""}
            ${data.professionalContext.industry ? `
              <div class="info-item" data-section="professionalContext">
                <span class="info-label">Industry</span>
                <div class="info-value">${data.professionalContext.industry}</div>
              </div>
            ` : ""}
            ${data.professionalContext.functionalDomain ? `
              <div class="info-item" data-section="professionalContext">
                <span class="info-label">Functional Domain</span>
                <div class="info-value">${data.professionalContext.functionalDomain}</div>
              </div>
            ` : ""}
            ${data.professionalContext.geographicScope ? `
              <div class="info-item" data-section="professionalContext">
                <span class="info-label">Geographic Scope</span>
                <div class="info-value">${data.professionalContext.geographicScope}</div>
              </div>
            ` : ""}
            ${data.professionalContext.revenueResponsibility ? `
              <div class="info-item" data-section="professionalContext">
                <span class="info-label">Revenue Responsibility</span>
                <div class="info-value">${data.professionalContext.revenueResponsibility}</div>
              </div>
            ` : ""}
          </div>
        ` : ""}

        <!-- Availability & Work Auth -->
        ${data.availabilityWorkAuth && Object.keys(data.availabilityWorkAuth).filter(key => data.availabilityWorkAuth[key]).length > 0 ? `
          <div class="section" data-section="availabilityWorkAuth">
            <div class="section-title">Availability</div>
            ${data.availabilityWorkAuth.availabilityNoticePeriod ? `
              <div class="info-item" data-section="availabilityWorkAuth">
                <span class="info-label">Notice Period</span>
                <div class="info-value">${data.availabilityWorkAuth.availabilityNoticePeriod}</div>
              </div>
            ` : ""}
            ${data.availabilityWorkAuth.workAuthorizationStatus ? `
              <div class="info-item" data-section="availabilityWorkAuth">
                <span class="info-label">Work Auth</span>
                <div class="info-value">${data.availabilityWorkAuth.workAuthorizationStatus}</div>
              </div>
            ` : ""}
            ${data.availabilityWorkAuth.preferredLocation ? `
              <div class="info-item" data-section="availabilityWorkAuth">
                <span class="info-label">Preferred Location</span>
                <div class="info-value">${data.availabilityWorkAuth.preferredLocation}</div>
              </div>
            ` : ""}
          </div>
        ` : ""}

        <!-- Social Profiles -->
        ${nonEmptySocialProfiles.length > 0 ? `
          <div class="section" data-section="socialProfiles">
            <div class="section-title">Social Profiles</div>
            ${nonEmptySocialProfiles.map((item: any, index: number) => `
              <div class="info-item" data-index="${index}">
                <span class="info-label">${item.platform || "Profile"}</span>
                <div class="info-value"><a href="${item.url}" target="_blank">${item.url}</a></div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Social Links -->
        ${nonEmptySocialLinks.length > 0 ? `
          <div class="section" data-section="socialLinks">
            <div class="section-title">Social Links</div>
            ${nonEmptySocialLinks.map((link: any, index: number) => `
              <div class="info-item" data-index="${index}">
                <span class="info-label">${link.platform || link.urlText || "Link"}</span>
                <div class="info-value"><a href="${link.url}" target="_blank">${link.url}</a></div>
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    </main>
  </div>
</body>
</html>`;
}