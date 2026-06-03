export function buildLeadershipManagerialTemplate(data: any, theme?: any): string {
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

  // ✅ Theme system with defaults and proper merge
  const defaultTheme = {
    primary: "#000000",
    text: "#000000",
    textLight: "#666666",
    background: "#ffffff",
  };

  const currentTheme = {
    ...defaultTheme,
    ...(theme || {})
  };
  
  // ✅ Dynamic font size from user settings
  const baseFontSize = data?.formatting?.bodyFontSize || data?.fontSize || 14;
  const userFontFamily = data?.formatting?.fontFamily || data?.fontFamily || "'Times New Roman', Times, serif";
  
  // Typography settings
  const typography = theme?.typography || {
    fontSize: "medium",
    alignment: "left",
    fontWeight: "normal",
  };
  
  const alignmentMap = { left: "left", center: "center", justify: "justify" };
  const fontWeightMap = { normal: "400", bold: "700" };
  
  const currentAlignment = alignmentMap[typography.alignment as keyof typeof alignmentMap] || "left";
  const currentFontWeight = fontWeightMap[typography.fontWeight as keyof typeof fontWeightMap] || "400";
  
  // Responsive font sizes based on baseFontSize
  const nameFontSize = Math.round(baseFontSize * 2.3); // ~32px at 14px base
  const sectionTitleFontSize = Math.round(baseFontSize * 1.3); // ~18px at 14px base
  const normalTextFontSize = Math.round(baseFontSize); // ~14px at 14px base
  const smallTextFontSize = Math.round(baseFontSize * 0.96); // ~13.5px at 14px base

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

  // Helper to format date range
  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (endDate && endDate.trim()) parts.push(endDate.trim());
    else if (isCurrent && parts.length > 0) parts.push("Present");
    return parts.join(" - ");
  };

  // Helper to format education date - no dash when only one date
  const formatEducationDate = (startDate?: string, endDate?: string, graduationDate?: string): string => {
    const parts = [];
    if (startDate && startDate.trim()) parts.push(startDate.trim());
    if (graduationDate && graduationDate.trim()) parts.push(graduationDate.trim());
    else if (endDate && endDate.trim()) parts.push(endDate.trim());
    
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return parts.join(" - ");
  };

  // Helper to render description with HTML content
  const renderDescription = (description: string): string => {
    if (!description) return '';
    
    const bulletChar = '•'; // Use literal bullet for maximum Word compatibility

    if (description.includes('<ul>') || description.includes('<li>')) {
      let cleaned = description;
      cleaned = cleaned.replace(/<li>(.*?)<\/li>/gs, (match, content) => {
        return `<li><div class="bullet-wrap">${bulletChar}</div><div class="li-text">${content}</div></li>`;
      });
      return `<div class="description-html">${cleaned}</div>`;
    }
    const lines = description.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
      
    if (lines.length === 0) return '';
    return `
      <div class="custom-list-container" style="margin-top: 5px;">
        ${lines.map(line => `
          <div class="custom-list-item" style="display: table; width: 100%; margin-bottom: 6px; font-size: ${smallTextFontSize}px; line-height: 1.4; color: ${currentTheme.textLight};">
            <div style="display: table-cell; width: 22px; vertical-align: top; padding-top: 0; font-family: 'Arial', sans-serif; font-size: 16px; text-align: center;">${bulletChar}</div>
            <div style="display: table-cell; vertical-align: top; padding-left: 2px;">${line.trim()}</div>
          </div>
        `).join('')}
      </div>
    `;
  };

  const parseSkillsToColumns = (skills: any) => {
    let list: string[] = [];
    
    if (typeof skills === "string") {
      if (skills.includes('<ul>') || skills.includes('<li>')) {
        const matches = skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          list = matches.map(m => m.replace(/<\/?li>/g, '').trim());
        } else {
          list = skills.split(',').map(s => s.trim()).filter(s => s);
        }
      } else {
        list = skills.split(',').map(s => s.trim()).filter(s => s);
      }
    } else if (Array.isArray(skills)) {
      list = skills;
    }
    
    const mid = Math.ceil(list.length / 2);
    return {
      col1: list.slice(0, mid),
      col2: list.slice(mid)
    };
  };

  const { col1, col2 } = parseSkillsToColumns(skills);
  const { col1: coreCompCol1, col2: coreCompCol2 } = parseSkillsToColumns(coreCompetencies);

  
  // Filter arrays to only include non-empty items
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

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: ${userFontFamily};
          color: ${currentTheme.text};
          line-height: 1.4;
          padding: 40px 60px;
          background: white;
          font-size: ${baseFontSize}px;
          font-weight: ${currentFontWeight};
          text-align: ${currentAlignment};
        }

        /* Header Layout */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 25px;
        }
        .header-left h1 {
          font-size: ${nameFontSize}px;
          font-weight: bold;
          margin-bottom: 5px;
          color: ${currentTheme.text};
        }
        .header-left p, .header-right p {
          font-size: ${normalTextFontSize}px;
          color: ${currentTheme.textLight};
        }
        .header-right {
          text-align: right;
        }

        /* Section Styling - Borders Removed */
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: ${sectionTitleFontSize}px;
          font-weight: bold;
          margin-bottom: 8px;
          text-transform: none;
          color: ${currentTheme.text};
        }

        .content-block {
          padding-left: 0;
        }

        /* Experience Items */
        .entry {
          margin-bottom: 12px;
        }
        .entry-title-row {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          font-size: ${normalTextFontSize}px;
          color: ${currentTheme.text};
        }
        .company-row {
          font-weight: bold;
          font-size: ${normalTextFontSize}px;
          margin-bottom: 4px;
          color: ${currentTheme.textLight};
        }
        
        .bullet-list {
          list-style-type: disc;
          margin-left: 20px;
          font-size: ${smallTextFontSize}px;
          color: ${currentTheme.textLight};
        }
        .bullet-list li {
          margin-bottom: 2px;
        }

        /* Skills Grid */
        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 40px;
        }

        /* Education */
        .edu-item {
          font-size: ${normalTextFontSize}px;
          margin-bottom: 8px;
          color: ${currentTheme.textLight};
        }
        .edu-item b {
          font-weight: bold;
          color: ${currentTheme.text};
        }
        .edu-date {
          display: inline-block;
        }

        /* Style for HTML content with bullet points */
        .description-html ul {
          list-style: none;
          margin-left: 0;
        }
        .description-html li {
          display: table;
          width: 100%;
          margin-bottom: 6px;
          color: ${currentTheme.textLight};
          font-size: ${smallTextFontSize}px;
          line-height: 1.4;
        }
        .description-html li .bullet-wrap {
          display: table-cell;
          width: 22px;
          vertical-align: top;
          padding-top: 0;
          font-family: 'Arial', sans-serif;
          font-size: 16px;
          text-align: center;
        }
        .description-html li .li-text {
          display: table-cell;
          vertical-align: top;
          padding-left: 2px;
        }

        .context-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          font-size: ${smallTextFontSize}px;
        }
        .context-item {
          color: ${currentTheme.textLight};
        }
        .context-label {
          font-weight: bold;
          color: ${currentTheme.text};
        }

        a {
          color: ${currentTheme.primary};
          text-decoration: none;
        }
        
        a:hover {
          text-decoration: underline;
        }

        @media print {
          body { padding: 0.5in; }
        }
      </style>
    </head>
    <body>
      <header class="header" data-section="personal">
        <div class="header-left">
          <h1>${personal.name || ''}</h1>
          <p>${personal.location ? `${personal.location}${personal.pinCode ? ` ${personal.pinCode}` : ''}` : ''}</p>
          ${personal.fullAddress ? `<p>${personal.fullAddress}</p>` : ''}
          ${personal.country ? `<p>${personal.country}</p>` : ''}
          ${personal.dob ? `<p>DOB: ${personal.dob}</p>` : ''}
          ${personal.gender ? `<p>Gender: ${personal.gender}</p>` : ''}
          ${personal.maritalStatus ? `<p>Marital: ${personal.maritalStatus}</p>` : ''}
        </div>
        <div class="header-right">
          <p>${personal.phone || ''}</p>
          ${personal.alternatePhone ? `<p>Alt: ${personal.alternatePhone}</p>` : ''}
          <p>${personal.email || ''}</p>
        </div>
      </header>

    

      ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
      <div class="section" data-section="availabilityWorkAuth">
        <h2 class="section-title">Availability</h2>
        <div class="context-grid">
          ${availabilityWorkAuth.availabilityNoticePeriod ? `<div class="context-item"><span class="context-label">Notice Period:</span> ${availabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
          ${availabilityWorkAuth.workAuthorizationStatus ? `<div class="context-item"><span class="context-label">Work Auth:</span> ${availabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
          ${availabilityWorkAuth.preferredLocation ? `<div class="context-item"><span class="context-label">Preferred Location:</span> ${availabilityWorkAuth.preferredLocation}</div>` : ''}
        </div>
      </div>
      ` : ''}

      ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
      <div class="section" data-section="careerObjective">
        <h2 class="section-title">Career Objective</h2>
        <p style="text-align: justify; color: ${currentTheme.textLight};">${careerObjective}</p>
      </div>
      ` : ''}

      ${summary ? `
      <div class="section" data-section="summary">
        <h2 class="section-title">Summary</h2>
        <p style="text-align: justify; color: ${currentTheme.textLight};">${summary}</p>
      </div>
      ` : ''}

      ${nonEmptyExperience.length > 0 ? `
      <div class="section" data-section="experience">
        <h2 class="section-title">Experience</h2>
        ${nonEmptyExperience.map((exp, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${exp.title || ''}</span>
              <span>${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
            </div>
            <div class="company-row">${exp.company || ''} - ${exp.location || ''}</div>
            ${exp.description ? renderDescription(exp.description) : ''}
            ${exp.achievements ? `<p style="margin-top: 4px; color: ${currentTheme.textLight};"><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyProjects.length > 0 ? `
      <div class="section" data-section="projects">
        <h2 class="section-title">Projects</h2>
        ${nonEmptyProjects.map((project, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${project.name || project.title || ''}</span>
              <span>${project.duration || ''}</span>
            </div>
            ${project.role ? `<div class="company-row">Role: ${project.role}</div>` : ''}
            ${project.description ? renderDescription(project.description) : ''}
            ${project.technologies ? `<p style="color: ${currentTheme.textLight};"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyInternships.length > 0 ? `
      <div class="section" data-section="internships">
        <h2 class="section-title">Internships</h2>
        ${nonEmptyInternships.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.title || ''}</span>
              <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="company-row">${item.company || ''}</div>
            ${item.description ? renderDescription(item.description) : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="section" data-section="trainingPrograms">
        <h2 class="section-title">Training Programs</h2>
        ${nonEmptyTrainingPrograms.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.name || ''}</span>
              <span>${item.completionDate || ''}${item.duration ? ` (${item.duration})` : ''}</span>
            </div>
            <div class="company-row">${item.provider || item.organization || ''}</div>
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="section" data-section="academicProjects">
        <h2 class="section-title">Academic Projects</h2>
        ${nonEmptyAcademicProjects.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.name || item.title || ''}</span>
              <span>${item.duration || ''}</span>
            </div>
            <div class="company-row">${item.institution || ''}${item.course ? ` | ${item.course}` : ''}</div>
            ${item.description ? renderDescription(item.description) : ''}
            ${item.technologies && item.technologies.length > 0 ? `<p style="color: ${currentTheme.textLight};"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
            ${item.url ? `<p style="color: ${currentTheme.textLight};"><strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="section" data-section="leadershipPositions">
        <h2 class="section-title">Leadership Positions</h2>
        ${nonEmptyLeadershipPositions.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.position || item.title || ''}</span>
              <span>${formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="company-row">${item.organization || ''}</div>
            ${item.description ? renderDescription(item.description) : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="section" data-section="coCurricular">
        <h2 class="section-title">Co-curricular Activities</h2>
        ${nonEmptyCoCurricular.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.activity || ''}</span>
              <span>${item.year || ''}</span>
            </div>
            ${item.role ? `<div class="company-row">Role: ${item.role}</div>` : ''}
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="section" data-section="extracurricular">
        <h2 class="section-title">Extracurricular Activities</h2>
        ${nonEmptyExtracurricular.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.activity || ''}</span>
              <span>${item.year || ''}</span>
            </div>
            ${item.role ? `<div class="company-row">Role: ${item.role}</div>` : ''}
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${skills ? `
      <div class="section" data-section="skills">
        <h2 class="section-title">Skills</h2>
        <div class="skills-grid">
          ${col1.length > 0 ? `
          <ul class="bullet-list" style="list-style: none; margin-left: 0;">
            ${col1.map((s, idx) => `<li data-index="${idx}">${s}</li>`).join('')}
          </ul>
          ` : ''}
          ${col2.length > 0 ? `
          <ul class="bullet-list" style="list-style: none; margin-left: 0;">
            ${col2.map((s, idx) => `<li data-index="${col1.length + idx}">${s}</li>`).join('')}
          </ul>
          ` : ''}
        </div>
      </div>
      ` : ''}


      <!-- Core Competencies Section -->
${coreCompCol1.length > 0 || coreCompCol2.length > 0 ? `
<div class="section" data-section="coreCompetencies">
  <h2 class="section-title">Core Competencies</h2>
  <div class="skills-grid">
    ${coreCompCol1.length > 0 ? `
    <ul class="bullet-list" style="list-style: none; margin-left: 0;">
      ${coreCompCol1.map((c, idx) => `<li data-index="${idx}">${c}</li>`).join('')}
    </ul>
    ` : ''}
    ${coreCompCol2.length > 0 ? `
    <ul class="bullet-list" style="list-style: none; margin-left: 0;">
      ${coreCompCol2.map((c, idx) => `<li data-index="${coreCompCol1.length + idx}">${c}</li>`).join('')}
    </ul>
    ` : ''}
  </div>
</div>
` : ''}

      ${nonEmptyLanguages.length > 0 ? `
      <div class="section" data-section="languages">
        <h2 class="section-title">Languages</h2>
        <ul class="bullet-list" style="list-style: none; margin-left: 0;">
          ${nonEmptyLanguages.map((lang: any, idx) => `
            <li data-index="${idx}">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>
          `).join('')}
        </ul>
      </div>
      ` : ''}

      ${nonEmptyCertifications.length > 0 ? `
      <div class="section" data-section="certifications">
        <h2 class="section-title">Certifications</h2>
        ${nonEmptyCertifications.map((cert, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${cert.name || ''}</span>
              <span>${cert.date || ''}</span>
            </div>
            <div class="company-row">${cert.issuer || ''}</div>
            ${cert.url ? `<p style="color: ${currentTheme.textLight};"><a href="${cert.url}" target="_blank">${cert.url}</a></p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyAwards.length > 0 ? `
      <div class="section" data-section="awards">
        <h2 class="section-title">Awards</h2>
        ${nonEmptyAwards.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.title || ''}</span>
              <span>${item.issueYear || item.year || ''}</span>
            </div>
            <div class="company-row">${item.organization || ''}</div>
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyScholarships.length > 0 ? `
      <div class="section" data-section="scholarships">
        <h2 class="section-title">Scholarships</h2>
        ${nonEmptyScholarships.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.name || ''}</span>
              <span>${item.year || ''}</span>
            </div>
            <div class="company-row">${item.provider || item.organization || ''}</div>
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="section" data-section="speakingEngagements">
        <h2 class="section-title">Speaking Engagements</h2>
        ${nonEmptySpeakingEngagements.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.topic || ''}</span>
              <span>${item.date || ''}</span>
            </div>
            <div class="company-row">${item.eventName || ''}</div>
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyMemberships.length > 0 ? `
      <div class="section" data-section="memberships">
        <h2 class="section-title">Memberships</h2>
        ${nonEmptyMemberships.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.membershipName || ''}</span>
              <span>${item.year || ''}</span>
            </div>
            <div class="company-row">${item.organizationName || item.organization || ''}</div>
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyWorkshops.length > 0 ? `
      <div class="section" data-section="workshops">
        <h2 class="section-title">Workshops</h2>
        ${nonEmptyWorkshops.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.programTitle || item.title || ''}</span>
              <span>${item.year || ''}</span>
            </div>
            <div class="company-row">${item.conductedBy || ''}</div>
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyClientProjects.length > 0 ? `
      <div class="section" data-section="clientProjects">
        <h2 class="section-title">Client Projects</h2>
        ${nonEmptyClientProjects.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.name || ''}</span>
              <span>${item.duration || ''}</span>
            </div>
            <div class="company-row">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</div>
            ${item.description ? renderDescription(item.description) : ''}
            ${item.toolsTechnologies ? `<p style="color: ${currentTheme.textLight};"><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ''}
            ${item.projectUrl ? `<p style="color: ${currentTheme.textLight};"><strong>URL:</strong> <a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyPortfolio.length > 0 ? `
      <div class="section" data-section="portfolio">
        <h2 class="section-title">Portfolio</h2>
        ${nonEmptyPortfolio.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.name || ''}</span>
              <span>${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</span>
            </div>
            ${item.url ? `<p style="color: ${currentTheme.textLight};"><a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyVolunteering.length > 0 ? `
      <div class="section" data-section="volunteering">
        <h2 class="section-title">Volunteering</h2>
        ${nonEmptyVolunteering.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.role || ''}</span>
              <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="company-row">${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}</div>
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="section" data-section="militaryService">
        <h2 class="section-title">Military Service</h2>
        ${nonEmptyMilitaryService.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</span>
              <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            ${item.specialization ? `<div class="company-row">Specialization: ${item.specialization}</div>` : ''}
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="section" data-section="toolsTechnologies">
        <h2 class="section-title">Tools & Technologies</h2>
        ${nonEmptyToolsTechnologies.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.name || ''}</span>
            </div>
            ${item.category ? `<div class="company-row">Category: ${item.category}</div>` : ''}
            ${item.proficiency ? `<div class="company-row">Proficiency: ${item.proficiency}</div>` : ''}
            ${item.experienceDuration ? `<div class="company-row">Experience: ${item.experienceDuration}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyMethodologies.length > 0 ? `
      <div class="section" data-section="methodologies">
        <h2 class="section-title">Methodologies</h2>
        ${nonEmptyMethodologies.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.name || ''}</span>
            </div>
            ${item.certification ? `<div class="company-row">Certification: ${item.certification}</div>` : ''}
            ${item.experienceDuration ? `<div class="company-row">Experience: ${item.experienceDuration}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section" data-section="industryExpertise">
        <h2 class="section-title">Industry Expertise</h2>
        ${nonEmptyIndustryExpertise.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.industry || ''}</span>
            </div>
            ${item.domainArea ? `<div class="company-row">Domain: ${item.domainArea}</div>` : ''}
            ${item.experienceDuration ? `<div class="company-row">Experience: ${item.experienceDuration}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="section" data-section="teachingExperience">
        <h2 class="section-title">Teaching Experience</h2>
        ${nonEmptyTeachingExperience.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.subjectCourseTaught || item.title || ''}</span>
              <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="company-row">${item.institution || ''}</div>
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="section" data-section="mentorshipExperience">
        <h2 class="section-title">Mentorship Experience</h2>
        ${nonEmptyMentorshipExperience.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.mentorshipArea || ''}</span>
              <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
            </div>
            <div class="company-row">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</div>
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="section" data-section="researchGrants">
        <h2 class="section-title">Research Grants</h2>
        ${nonEmptyResearchGrants.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.title || ''}</span>
              <span>${item.year || ''}</span>
            </div>
            <div class="company-row">${item.agency || ''}${item.amount ? ` | Amount: ${item.amount}` : ''}</div>
            ${item.description ? `<p style="color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyTestScores.length > 0 ? `
      <div class="section" data-section="testScores">
        <h2 class="section-title">Test Scores</h2>
        ${nonEmptyTestScores.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.testName || ''}</span>
              <span>${item.year || ''}</span>
            </div>
            <div class="company-row">Score: ${item.score || ''}</div>
            ${item.percentileRank ? `<div class="company-row">Percentile: ${item.percentileRank}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyPublications.length > 0 ? `
      <div class="section" data-section="publications">
        <h2 class="section-title">Publications</h2>
        ${nonEmptyPublications.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.title || ''}</span>
              <span>${item.year || ''}</span>
            </div>
            <div class="company-row">${item.journalPublisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</div>
            ${item.urlDoi ? `<p style="color: ${currentTheme.textLight};"><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyPatents.length > 0 ? `
      <div class="section" data-section="patents">
        <h2 class="section-title">Patents</h2>
        ${nonEmptyPatents.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.title || ''}</span>
              <span>${item.year || ''}</span>
            </div>
            <div class="company-row">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</div>
            ${item.status ? `<div class="company-row">Status: ${item.status}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptyReferences.length > 0 ? `
      <div class="section" data-section="references">
        <h2 class="section-title">References</h2>
        ${nonEmptyReferences.map((item, idx) => `
          <div class="entry" data-index="${idx}">
            <div class="entry-title-row">
              <span>${item.name || ''}</span>
            </div>
            <div class="company-row">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</div>
            ${item.contactInformation ? `<p style="color: ${currentTheme.textLight};">${item.contactInformation}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="section" data-section="socialProfiles">
        <h2 class="section-title">Social Profiles</h2>
        <ul class="bullet-list">
          ${nonEmptySocialProfiles.map((item: any, idx) => `
            <li data-index="${idx}">${item.platform || 'Profile'}: <a href="${item.url || ''}" target="_blank">${item.url || ''}</a></li>
          `).join('')}
        </ul>
      </div>
      ` : ''}

      ${nonEmptyHobbies.length > 0 ? `
      <div class="section" data-section="hobbies">
        <h2 class="section-title">Hobbies</h2>
        <ul class="bullet-list">
          ${nonEmptyHobbies.map((hobby: any, idx) => `<li data-index="${idx}">${typeof hobby === "string" ? hobby.trim() : hobby}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      ${nonEmptyEducation.length > 0 ? `
      <div class="section" data-section="education">
        <h2 class="section-title">Education</h2>
        ${nonEmptyEducation.map((edu, idx) => {
          const dateRange = formatEducationDate(edu.startDate, edu.endDate, edu.graduationDate);
          return `
          <div class="edu-item" data-index="${idx}">
            <p>
              <b>${dateRange ? `${dateRange} ` : ''}${edu.school || ''}</b>${edu.location ? ` - ${edu.location}` : ''}
            </p>
            <p><b>${edu.degree || ''}${edu.field ? ' in ' + edu.field : ''}</b></p>
            ${edu.grade ? `<p>${edu.grade}</p>` : ''}
            ${edu.description ? `<p style="color: ${currentTheme.textLight};">${edu.description}</p>` : ''}
          </div>
        `}).join('')}
      </div>
      ` : ''}
    </body>
    </html>
  `;
}