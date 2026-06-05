export function buildAtsClassicTemplate(data: any, theme?: any): string {
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
    professionalContext = {},
    availabilityWorkAuth = {},
    socialProfiles = []
  } = data;

  // THEME SYSTEM
  const defaultTheme = {
    primary: "#002d62",
    accent: "#0f4c81",
    darkGray: "#1a1a1a",
    textGray: "#4a4a4a",
    background: "#ffffff",
    borderColor: "#002d62"
  };

  const currentTheme = { ...defaultTheme, ...theme };
  
  const primaryColor = currentTheme.primary;
  const accentColor = currentTheme.accent;
  const darkGray = currentTheme.darkGray;
  const textGray = currentTheme.textGray;

  const bodyFontSize = data.fontSize || 14;
  const fontFamily = data.fontFamily || "'Inter', 'Helvetica Neue', Arial, sans-serif";

  const getNonEmptyItems = (arr: any[]): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter(item => {
      if (typeof item === "string") return item.trim().length > 0;
      if (typeof item === "object" && item !== null) {
        return Object.values(item).some(val => typeof val === "string" && val.trim().length > 0);
      }
      return false;
    });
  };

  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => val !== null && val !== undefined && val !== "");
  };

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent) parts.push("Present");
    return parts.join(" – ");
  };

  const renderInlineSkills = (skillsData: any): string => {
    if (!skillsData) return "";
    let skillsArray: string[] = [];
    
    if (typeof skillsData === "string") {
      if (skillsData.includes('<li>')) {
        skillsArray = skillsData.replace(/<\/?[^>]+(>|$)/g, ",").split(',').map(s => s.trim()).filter(Boolean);
      } else {
        skillsArray = skillsData.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(skillsData)) {
      skillsArray = skillsData.map(s => typeof s === "string" ? s.trim() : s.name).filter(Boolean);
    }

    if (skillsArray.length === 0) return "";
    return `<div class="skills-inline">${skillsArray.join(' &nbsp;|&nbsp; ')}</div>`;
  };

  const renderInlinePills = (items: any[], labelKey: string = "language", profKey: string = "proficiency"): string => {
    if (!items.length) return "";
    const displayItems = items.map(item => {
      if (typeof item === "string") return item;
      if (typeof item === "object" && item !== null) {
        if (item[labelKey]) return item[profKey] ? `${item[labelKey]} (${item[profKey]})` : item[labelKey];
        if (item.name) return item.name;
      }
      return String(item);
    }).filter(Boolean);
    if (displayItems.length === 0) return "";
    return `<div class="skills-inline">${displayItems.join(' &nbsp;|&nbsp; ')}</div>`;
  };

  const renderDescription = (description: string): string => {
    if (!description) return '';
    if (description.includes('<ul>') || description.includes('<li>')) {
      return `<div class="description-html" style="margin-top: 4px;">${description}</div>`;
    }
    const lines = description.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length === 0) return '';
    return `
      <ul class="bullet-list" style="margin-top: 4px;">
        ${lines.map(line => `<li>${line.replace(/^[-•*]\s*/, '').trim()}</li>`).join('')}
      </ul>
    `;
  };

  const getSkillsArray = (skillsData: any): string[] => {
    if (!skillsData) return [];
    if (Array.isArray(skillsData)) return skillsData.filter(s => s && (typeof s === "string" ? s.trim() : s));
    if (typeof skillsData === "string") {
      if (skillsData.includes('<ul>')) {
        const matches = skillsData.match(/<li>(.*?)<\/li>/g);
        if (matches) return matches.map(m => m.replace(/<\/?li>/g, '').trim()).filter(s => s);
      }
      return skillsData.split(",").map(s => s.trim()).filter(s => s);
    }
    return [];
  };

  const skillsArray = getSkillsArray(skills);
  const coreCompetenciesArray = getSkillsArray(coreCompetencies);
  const nonEmptyExperience = getNonEmptyItems(experience);
  const nonEmptyEducation = getNonEmptyItems(education);
  const nonEmptyInternships = getNonEmptyItems(internships);
  const nonEmptyTrainingPrograms = getNonEmptyItems(trainingPrograms);
  const nonEmptyAcademicProjects = getNonEmptyItems(academicProjects);
  const nonEmptyLeadershipPositions = getNonEmptyItems(leadershipPositions);
  const nonEmptyCoCurricular = getNonEmptyItems(coCurricular);
  const nonEmptyExtracurricular = getNonEmptyItems(extracurricular);
  const nonEmptyLanguages = getNonEmptyItems(languages);
  const nonEmptyCertifications = getNonEmptyItems(certifications);
  const nonEmptyScholarships = getNonEmptyItems(scholarships);
  const nonEmptyAwards = getNonEmptyItems(awards);
  const nonEmptySpeakingEngagements = getNonEmptyItems(speakingEngagements);
  const nonEmptyMemberships = getNonEmptyItems(memberships);
  const nonEmptyWorkshops = getNonEmptyItems(workshops);
  const nonEmptyClientProjects = getNonEmptyItems(clientProjects);
  const nonEmptyPortfolio = getNonEmptyItems(portfolio);
  const nonEmptyVolunteering = getNonEmptyItems(volunteering);
  const nonEmptyMilitaryService = getNonEmptyItems(militaryService);
  const nonEmptyMethodologies = getNonEmptyItems(methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyItems(industryExpertise);
  const nonEmptyReferences = getNonEmptyItems(references);
  const nonEmptyTeachingExperience = getNonEmptyItems(teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyItems(mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyItems(researchGrants);
  const nonEmptyTestScores = getNonEmptyItems(testScores);
  const nonEmptyPublications = getNonEmptyItems(publications);
  const nonEmptyPatents = getNonEmptyItems(patents);
  const nonEmptyToolsTechnologies = getNonEmptyItems(toolsTechnologies);
  const nonEmptySocialProfiles = getNonEmptyItems(socialProfiles);
  const nonEmptyHobbies = getNonEmptyItems(hobbies);
  const nonEmptyProjects = getNonEmptyItems(projects);

  const fullAddress = personal.fullAddress || "";
  const locationParts = [personal.location, personal.pinCode].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(", ") : "";
  const countryStr = personal.country || "";
  const addressString = [fullAddress, locationStr, countryStr].filter(Boolean).join(", ");

  const linkedinProfile = socialProfiles?.find((p: any) => String(p.network || p.platform).toLowerCase().includes("linkedin") || String(p.url).toLowerCase().includes("linkedin"));
  const linkedinUrl = linkedinProfile?.url || linkedinProfile?.username || "";
  const cleanLinkedinLabel = linkedinUrl.replace(/^(https?:\/\/)?(www\.)?/, "");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: ${fontFamily};
          background-color: ${currentTheme.background};
          color: ${darkGray};
          font-size: ${bodyFontSize}px;
          line-height: 1.4;
          padding: 45px 50px;
        }

        .wrapper {
          width: 100%;
          max-width: 100%;
        }

        .header {
          margin-bottom: 24px;
          text-align: left;
        }

        .name {
          font-size: 32px;
          font-weight: 800;
          color: ${primaryColor};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .job-title {
          font-size: 15px;
          font-weight: 700;
          color: ${primaryColor};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          border-bottom: 3px solid ${primaryColor};
          padding-bottom: 6px;
        }

        .contact-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
          font-size: 12px;
          color: ${darkGray};
          font-weight: 500;
          margin-top: 8px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .contact-item svg {
          width: 13px;
          height: 13px;
          fill: ${primaryColor};
          flex-shrink: 0;
        }

        .section {
          margin-bottom: 22px;
          page-break-inside: avoid;
        }

        .section-title {
          font-size: 15px;
          font-weight: 700;
          color: ${primaryColor};
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid ${primaryColor};
          padding-bottom: 3px;
          margin-bottom: 10px;
          width: 100%;
        }

        .summary-text {
          color: ${darkGray};
          font-size: ${bodyFontSize}px;
          line-height: 1.5;
          text-align: justify;
        }

        .entry {
          margin-bottom: 14px;
          page-break-inside: avoid;
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 2px;
        }

        .entry-title {
          font-weight: 700;
          color: ${primaryColor};
          font-size: ${bodyFontSize}px;
        }

        .entry-date {
          color: ${darkGray};
          font-size: ${bodyFontSize}px;
          font-weight: 500;
          white-space: nowrap;
        }

        .entry-subtitle {
          font-weight: 700;
          color: ${primaryColor};
          font-size: ${bodyFontSize}px;
          margin-bottom: 6px;
        }

        .bullet-list {
          list-style-type: none;
          padding-left: 0;
          margin-top: 4px;
        }

        .bullet-list li {
          position: relative;
          padding-left: 14px;
          margin-bottom: 4px;
          font-size: ${bodyFontSize}px;
          color: ${darkGray};
          line-height: 1.4;
        }

        .bullet-list li::before {
          content: "•";
          position: absolute;
          left: 2px;
          top: 0;
          color: ${darkGray};
          font-weight: bold;
        }

        .skills-inline {
          font-size: ${bodyFontSize}px;
          color: ${darkGray};
          line-height: 1.6;
          font-weight: 500;
        }

        .context-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .context-item {
          font-size: ${bodyFontSize}px;
          color: ${textGray};
        }
        
        .context-label {
          font-weight: 800;
          color: ${darkGray};
        }

        .description-html ul {
          list-style: none;
          margin-left: 0;
        }
        
        .description-html li {
          position: relative;
          padding-left: 14px;
          margin-bottom: 4px;
          font-size: ${bodyFontSize}px;
          color: ${darkGray};
          line-height: 1.4;
        }
        
        .description-html li::before {
          content: "•";
          position: absolute;
          left: 2px;
          top: 0;
          color: ${darkGray};
          font-weight: bold;
        }

        .portfolio-link {
          color: ${primaryColor};
          text-decoration: none;
          word-break: break-all;
        }
        .portfolio-link:hover {
          text-decoration: underline;
        }

        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        
        <!-- Header -->
        <header class="header" id="section-header" data-section="header">
          <h1 class="name">${(personal.name || "Your Name ").toUpperCase()}</h1>
          ${
  (personal.jobTitle || personal.role)
    ? `<div class="job-title">${personal.jobTitle || personal.role}</div>`
    : ""
}
          <div class="contact-row">
            ${personal.phone ? `<div class="contact-item"><svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg><span>${personal.phone}</span></div>` : ""}
            ${personal.email ? `<div class="contact-item"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg><span>${personal.email}</span></div>` : ""}
            ${addressString ? `<div class="contact-item"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg><span>${addressString}</span></div>` : ""}
            ${cleanLinkedinLabel ? `<div class="contact-item"><svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg><span>${cleanLinkedinLabel}</span></div>` : ""}
          </div>
        </header>

        <!-- Availability Section -->
        ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
          <section class="section" id="section-availability" data-section="availability">
            <h2 class="section-title">Availability</h2>
            <div class="context-grid">
              ${availabilityWorkAuth.availabilityNoticePeriod ? `<div class="context-item"><span class="context-label">Notice Period:</span> ${availabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
              ${availabilityWorkAuth.workAuthorizationStatus ? `<div class="context-item"><span class="context-label">Work Auth:</span> ${availabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
              ${availabilityWorkAuth.preferredLocation ? `<div class="context-item"><span class="context-label">Preferred Location:</span> ${availabilityWorkAuth.preferredLocation}</div>` : ''}
            </div>
          </section>
        ` : ""}

        <!-- Professional Context Section -->
        ${professionalContext && hasObjectValues(professionalContext) ? `
          <section class="section" id="section-professionalContext" data-section="professionalContext">
            <h2 class="section-title">Professional Context</h2>
            <div class="context-grid">
              ${professionalContext.currentRole ? `<div class="context-item"><span class="context-label">Current Role:</span> ${professionalContext.currentRole}</div>` : ''}
              ${professionalContext.yearsOfExperience ? `<div class="context-item"><span class="context-label">Experience:</span> ${professionalContext.yearsOfExperience} years</div>` : ''}
              ${professionalContext.industry ? `<div class="context-item"><span class="context-label">Industry:</span> ${professionalContext.industry}</div>` : ''}
            </div>
          </section>
        ` : ""}

        <!-- Summary Section -->
        ${summary && summary.trim() ? `
          <section class="section" id="section-summary" data-section="summary">
            <h2 class="section-title">Summary</h2>
            <div class="summary-text">${summary}</div>
          </section>
        ` : careerObjective && careerObjective.trim() ? `
          <section class="section" id="section-careerObjective" data-section="careerObjective">
            <h2 class="section-title">Objective</h2>
            <div class="summary-text">${careerObjective}</div>
          </section>
        ` : ""}

        <!-- Skills Section -->
        ${skillsArray.length > 0 ? `
          <section class="section" id="section-skills" data-section="skills">
            <h2 class="section-title">Skills</h2>
            ${renderInlineSkills(skills)}
          </section>
        ` : ""}

        <!-- Core Competencies Section -->
        ${coreCompetenciesArray.length > 0 ? `
          <section class="section" id="section-coreCompetencies" data-section="coreCompetencies">
            <h2 class="section-title">Core Competencies</h2>
            ${renderInlineSkills(coreCompetencies)}
          </section>
        ` : ""}

        <!-- Tools & Technologies Section -->
        ${nonEmptyToolsTechnologies.length > 0 ? `
          <section class="section" id="section-toolsTechnologies" data-section="toolsTechnologies">
            <h2 class="section-title">Tools & Technologies</h2>
            ${nonEmptyToolsTechnologies.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.name || ''}</span></div>
                ${item.category ? `<div class="entry-subtitle">Category: ${item.category}</div>` : ''}
                ${item.proficiency ? `<div>Proficiency: ${item.proficiency}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Languages Section -->
        ${nonEmptyLanguages.length > 0 ? `
          <section class="section" id="section-languages" data-section="languages">
            <h2 class="section-title">Languages</h2>
            ${renderInlinePills(nonEmptyLanguages, "language", "proficiency")}
          </section>
        ` : ""}

        <!-- Certifications Section -->
        ${nonEmptyCertifications.length > 0 ? `
          <section class="section" id="section-certifications" data-section="certifications">
            <h2 class="section-title">Certifications</h2>
            ${nonEmptyCertifications.map((cert: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${cert.name || cert.title || ""}</span>${cert.date ? `<span class="entry-date">${cert.date}</span>` : ""}</div>
                ${cert.issuer ? `<div class="entry-subtitle">${cert.issuer}</div>` : ""}
              </div>
            `).join("")}
          </section>
        ` : ""}

        <!-- Experience Section -->
        ${nonEmptyExperience.length > 0 ? `
          <section class="section" id="section-experience" data-section="experience">
            <h2 class="section-title">Experience</h2>
            ${nonEmptyExperience.map((exp: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${exp.title || exp.designation || exp.role || ""}</span><span class="entry-date">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span></div>
                <div class="entry-subtitle">${exp.company ? exp.company : ""}${exp.location ? `, ${exp.location}` : ""}</div>
                ${exp.description ? renderDescription(exp.description) : ""}
                ${exp.achievements ? `<div><strong>Achievements:</strong> ${exp.achievements}</div>` : ""}
              </div>
            `).join("")}
          </section>
        ` : ""}

        <!-- Projects Section -->
        ${nonEmptyProjects.length > 0 ? `
          <section class="section" id="section-projects" data-section="projects">
            <h2 class="section-title">Projects</h2>
            ${nonEmptyProjects.map((project: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${project.name || project.title || ''}</span>${project.duration ? `<span class="entry-date">${project.duration}</span>` : ''}</div>
                ${project.role ? `<div class="entry-subtitle">Role: ${project.role}</div>` : ''}
                ${project.description ? renderDescription(project.description) : ''}
                ${project.technologies ? `<div>Technologies: ${project.technologies}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Education Section -->
        ${nonEmptyEducation.length > 0 ? `
          <section class="section" id="section-education" data-section="education">
            <h2 class="section-title">Education</h2>
            ${nonEmptyEducation.map((edu: any, idx: number) => {
              const startDate = edu.startDate || edu.startYear;
              const endDate = edu.endDate || edu.endYear || edu.graduationDate;
              const dateDisplay = startDate && endDate ? `${startDate} – ${endDate}` : (startDate || endDate || "");
              return `
                <div class="entry" data-index="${idx}">
                  <div class="entry-header"><span class="entry-title">${edu.degree || edu.course || ""}${edu.field ? ` – ${edu.field}` : ""}</span><span class="entry-date">${dateDisplay}</span></div>
                  <div class="entry-subtitle">${edu.school || edu.institution || edu.university || ""}${edu.location ? `, ${edu.location}` : ""}</div>
                  ${edu.grade ? `<div>${edu.grade}</div>` : ""}
                  ${edu.description ? `<div>${edu.description}</div>` : ""}
                </div>
              `;
            }).join("")}
          </section>
        ` : ""}

        <!-- Internships Section -->
        ${nonEmptyInternships.length > 0 ? `
          <section class="section" id="section-internships" data-section="internships">
            <h2 class="section-title">Internships</h2>
            ${nonEmptyInternships.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.title || item.role || ''}</span><span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span></div>
                <div class="entry-subtitle">${item.company || item.organization || ''}</div>
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Training Programs Section -->
        ${nonEmptyTrainingPrograms.length > 0 ? `
          <section class="section" id="section-trainingPrograms" data-section="trainingPrograms">
            <h2 class="section-title">Training Programs</h2>
            ${nonEmptyTrainingPrograms.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.name || item.title || ''}</span>${item.completionDate ? `<span class="entry-date">${item.completionDate}</span>` : ''}</div>
                <div class="entry-subtitle">${item.provider || item.organization || ''}</div>
                ${item.description ? `<div>${item.description}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Academic Projects Section -->
        ${nonEmptyAcademicProjects.length > 0 ? `
          <section class="section" id="section-academicProjects" data-section="academicProjects">
            <h2 class="section-title">Academic Projects</h2>
            ${nonEmptyAcademicProjects.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.name || item.title || ''}</span>${item.duration ? `<span class="entry-date">${item.duration}</span>` : ''}</div>
                <div class="entry-subtitle">${item.institution || ''}${item.course ? ` - ${item.course}` : ''}</div>
                ${item.description ? renderDescription(item.description) : ''}
                ${item.technologies ? `<div>Technologies: ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</div>` : ''}
                ${item.url ? `<div><a href="${item.url}" class="portfolio-link" target="_blank">${item.url}</a></div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Leadership Positions Section -->
        ${nonEmptyLeadershipPositions.length > 0 ? `
          <section class="section" id="section-leadershipPositions" data-section="leadershipPositions">
            <h2 class="section-title">Leadership Positions</h2>
            ${nonEmptyLeadershipPositions.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.position || item.title || ''}</span><span class="entry-date">${formatDateRange(item.startDate, item.endDate) || ''}</span></div>
                <div class="entry-subtitle">${item.organization || ''}</div>
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Co-curricular Section -->
        ${nonEmptyCoCurricular.length > 0 ? `
          <section class="section" id="section-coCurricular" data-section="coCurricular">
            <h2 class="section-title">Co-curricular Activities</h2>
            ${nonEmptyCoCurricular.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.activity || ''}</span>${item.year ? `<span class="entry-date">${item.year}</span>` : ''}</div>
                ${item.role ? `<div class="entry-subtitle">Role: ${item.role}</div>` : ''}
                ${item.description ? `<div>${item.description}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Extracurricular Section -->
        ${nonEmptyExtracurricular.length > 0 ? `
          <section class="section" id="section-extracurricular" data-section="extracurricular">
            <h2 class="section-title">Extracurricular Activities</h2>
            ${nonEmptyExtracurricular.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.activity || ''}</span>${item.year ? `<span class="entry-date">${item.year}</span>` : ''}</div>
                ${item.role ? `<div class="entry-subtitle">Role: ${item.role}</div>` : ''}
                ${item.description ? `<div>${item.description}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Scholarships Section -->
        ${nonEmptyScholarships.length > 0 ? `
          <section class="section" id="section-scholarships" data-section="scholarships">
            <h2 class="section-title">Scholarships</h2>
            ${nonEmptyScholarships.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.name || ''}</span>${item.year ? `<span class="entry-date">${item.year}</span>` : ''}</div>
                <div class="entry-subtitle">${item.provider || item.organization || ''}</div>
                ${item.description ? `<div>${item.description}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Awards Section -->
        ${nonEmptyAwards.length > 0 ? `
          <section class="section" id="section-awards" data-section="awards">
            <h2 class="section-title">Awards</h2>
            ${nonEmptyAwards.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.title || ''}</span>${item.issueYear || item.year ? `<span class="entry-date">${item.issueYear || item.year}</span>` : ''}</div>
                <div class="entry-subtitle">${item.organization || ''}</div>
                ${item.description ? `<div>${item.description}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Speaking Engagements Section -->
        ${nonEmptySpeakingEngagements.length > 0 ? `
          <section class="section" id="section-speakingEngagements" data-section="speakingEngagements">
            <h2 class="section-title">Speaking Engagements</h2>
            ${nonEmptySpeakingEngagements.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.topic || ''}</span>${item.date ? `<span class="entry-date">${item.date}</span>` : ''}</div>
                <div class="entry-subtitle">${item.eventName || ''}</div>
                ${item.description ? `<div>${item.description}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Memberships Section -->
        ${nonEmptyMemberships.length > 0 ? `
          <section class="section" id="section-memberships" data-section="memberships">
            <h2 class="section-title">Memberships</h2>
            ${nonEmptyMemberships.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.membershipName || item.name || ''}</span>${item.year ? `<span class="entry-date">${item.year}</span>` : ''}</div>
                <div class="entry-subtitle">${item.organizationName || item.organization || ''}</div>
                ${item.description ? `<div>${item.description}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Workshops Section -->
        ${nonEmptyWorkshops.length > 0 ? `
          <section class="section" id="section-workshops" data-section="workshops">
            <h2 class="section-title">Workshops</h2>
            ${nonEmptyWorkshops.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.programTitle || item.title || ''}</span>${item.year ? `<span class="entry-date">${item.year}</span>` : ''}</div>
                <div class="entry-subtitle">${item.conductedBy || ''}</div>
                ${item.description ? `<div>${item.description}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Client Projects Section -->
        ${nonEmptyClientProjects.length > 0 ? `
          <section class="section" id="section-clientProjects" data-section="clientProjects">
            <h2 class="section-title">Client Projects</h2>
            ${nonEmptyClientProjects.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.name || ''}</span>${item.duration ? `<span class="entry-date">${item.duration}</span>` : ''}</div>
                <div class="entry-subtitle">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</div>
                ${item.description ? renderDescription(item.description) : ''}
                ${item.toolsTechnologies ? `<div>Tools: ${item.toolsTechnologies}</div>` : ''}
                ${item.projectUrl ? `<div><a href="${item.projectUrl}" class="portfolio-link" target="_blank">${item.projectUrl}</a></div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Portfolio Section -->
        ${nonEmptyPortfolio.length > 0 ? `
          <section class="section" id="section-portfolio" data-section="portfolio">
            <h2 class="section-title">Portfolio</h2>
            ${nonEmptyPortfolio.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.name || ''}</span></div>
                <div class="entry-subtitle">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</div>
                ${item.url ? `<div><a href="${item.url}" class="portfolio-link" target="_blank">${item.url}</a></div>` : ''}
                ${item.description ? `<div>${item.description}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Volunteering Section -->
        ${nonEmptyVolunteering.length > 0 ? `
          <section class="section" id="section-volunteering" data-section="volunteering">
            <h2 class="section-title">Volunteering</h2>
            ${nonEmptyVolunteering.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.role || ''}</span><span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span></div>
                <div class="entry-subtitle">${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}</div>
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Military Service Section -->
        ${nonEmptyMilitaryService.length > 0 ? `
          <section class="section" id="section-militaryService" data-section="militaryService">
            <h2 class="section-title">Military Service</h2>
            ${nonEmptyMilitaryService.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</span><span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span></div>
                ${item.specialization ? `<div class="entry-subtitle">Specialization: ${item.specialization}</div>` : ''}
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Methodologies Section -->
        ${nonEmptyMethodologies.length > 0 ? `
          <section class="section" id="section-methodologies" data-section="methodologies">
            <h2 class="section-title">Methodologies</h2>
            ${nonEmptyMethodologies.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.name || ''}</span></div>
                ${item.certification ? `<div class="entry-subtitle">Certification: ${item.certification}</div>` : ''}
                ${item.experienceDuration ? `<div>Experience: ${item.experienceDuration}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Industry Expertise Section -->
        ${nonEmptyIndustryExpertise.length > 0 ? `
          <section class="section" id="section-industryExpertise" data-section="industryExpertise">
            <h2 class="section-title">Industry Expertise</h2>
            ${nonEmptyIndustryExpertise.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.industry || ''}</span></div>
                ${item.domainArea ? `<div class="entry-subtitle">Domain: ${item.domainArea}</div>` : ''}
                ${item.experienceDuration ? `<div>Experience: ${item.experienceDuration}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Teaching Experience Section -->
        ${nonEmptyTeachingExperience.length > 0 ? `
          <section class="section" id="section-teachingExperience" data-section="teachingExperience">
            <h2 class="section-title">Teaching Experience</h2>
            ${nonEmptyTeachingExperience.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.subjectCourseTaught || item.title || ''}</span><span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span></div>
                <div class="entry-subtitle">${item.institution || ''}</div>
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Mentorship Experience Section -->
        ${nonEmptyMentorshipExperience.length > 0 ? `
          <section class="section" id="section-mentorshipExperience" data-section="mentorshipExperience">
            <h2 class="section-title">Mentorship Experience</h2>
            ${nonEmptyMentorshipExperience.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.mentorshipArea || ''}</span><span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span></div>
                <div class="entry-subtitle">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</div>
                ${item.description ? renderDescription(item.description) : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Research Grants Section -->
        ${nonEmptyResearchGrants.length > 0 ? `
          <section class="section" id="section-researchGrants" data-section="researchGrants">
            <h2 class="section-title">Research Grants</h2>
            ${nonEmptyResearchGrants.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.title || ''}</span>${item.year ? `<span class="entry-date">${item.year}</span>` : ''}</div>
                <div class="entry-subtitle">${item.agency || ''}${item.amount ? ` | Amount: ${item.amount}` : ''}</div>
                ${item.description ? `<div>${item.description}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Test Scores Section -->
        ${nonEmptyTestScores.length > 0 ? `
          <section class="section" id="section-testScores" data-section="testScores">
            <h2 class="section-title">Test Scores</h2>
            ${nonEmptyTestScores.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.testName || ''}</span>${item.year ? `<span class="entry-date">${item.year}</span>` : ''}</div>
                <div class="entry-subtitle">Score: ${item.score || ''}${item.percentileRank ? ` (${item.percentileRank} percentile)` : ''}</div>
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Publications Section -->
        ${nonEmptyPublications.length > 0 ? `
          <section class="section" id="section-publications" data-section="publications">
            <h2 class="section-title">Publications</h2>
            ${nonEmptyPublications.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.title || ''}</span>${item.year ? `<span class="entry-date">${item.year}</span>` : ''}</div>
                <div class="entry-subtitle">${item.journalPublisher || item.publisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</div>
                ${item.urlDoi ? `<div><a href="${item.urlDoi}" class="portfolio-link" target="_blank">${item.urlDoi}</a></div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Patents Section -->
        ${nonEmptyPatents.length > 0 ? `
          <section class="section" id="section-patents" data-section="patents">
            <h2 class="section-title">Patents</h2>
            ${nonEmptyPatents.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.title || ''}</span>${item.year ? `<span class="entry-date">${item.year}</span>` : ''}</div>
                <div class="entry-subtitle">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</div>
                ${item.status ? `<div>Status: ${item.status}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- References Section -->
        ${nonEmptyReferences.length > 0 ? `
          <section class="section" id="section-references" data-section="references">
            <h2 class="section-title">References</h2>
            ${nonEmptyReferences.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.name || ''}</span></div>
                <div class="entry-subtitle">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</div>
                ${item.contactInformation ? `<div>${item.contactInformation}</div>` : ''}
              </div>
            `).join('')}
          </section>
        ` : ""}

        <!-- Hobbies Section -->
        ${nonEmptyHobbies.length > 0 ? `
          <section class="section" id="section-hobbies" data-section="hobbies">
            <h2 class="section-title">Hobbies & Interests</h2>
            ${renderInlinePills(nonEmptyHobbies)}
          </section>
        ` : ""}

        <!-- Social Profiles Section -->
        ${nonEmptySocialProfiles.length > 0 ? `
          <section class="section" id="section-socialProfiles" data-section="socialProfiles">
            <h2 class="section-title">Social Profiles</h2>
            ${nonEmptySocialProfiles.map((item: any, idx: number) => `
              <div class="entry" data-index="${idx}">
                <div class="entry-header"><span class="entry-title">${item.platform || item.network || 'Profile'}</span></div>
                <div><a href="${item.url || ''}" class="portfolio-link" target="_blank">${item.url || ''}</a></div>
              </div>
            `).join('')}
          </section>
        ` : ""}

      </div>
    </body>
    </html>
  `;
}