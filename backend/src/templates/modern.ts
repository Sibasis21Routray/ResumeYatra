export function buildModernTemplate(data: any, theme?: any): string {
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

  // ✅ Step 1: Theme system with defaults
  const defaultTheme = {
    primary: "#4b5563",
    text: "#1a1a1a",
    heading: "#374151",
    textLight: "#4b5563",
    background: "#ffffff",
  };

  const currentTheme = { ...defaultTheme, ...(theme || {}) };
  
  // ✅ Dynamic font size from user settings
  const baseFontSize = data?.formatting?.bodyFontSize || data?.fontSize || 14;
  const userFontFamily = data?.formatting?.fontFamily || data?.fontFamily || "'Helvetica', 'Arial', sans-serif";
  
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
  const nameFontSize = Math.round(baseFontSize * 3.7); // ~52px at 14px base
  const labelFontSize = Math.round(baseFontSize * 1.14); // ~16px at 14px base
  const normalTextFontSize = Math.round(baseFontSize); // ~14px at 14px base
  const smallTextFontSize = Math.round(baseFontSize * 0.93); // ~13px at 14px base
  const entryTitleFontSize = Math.round(baseFontSize * 1.07); // ~15px at 14px base

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
          <div class="custom-list-item" style="display: table; width: 100%; margin-bottom: 6px; font-size: ${normalTextFontSize}px; line-height: 1.4; color: ${currentTheme.textLight};">
            <div style="display: table-cell; width: 22px; vertical-align: top; padding-top: 0; font-family: 'Arial', sans-serif; font-size: 16px; text-align: center;">${bulletChar}</div>
            <div style="display: table-cell; vertical-align: top; padding-left: 2px;">${line.trim()}</div>
          </div>
        `).join('')}
      </div>
    `;
  };

  

  // Helper to parse skills into two columns with proper bullet points
  const parseSkillsToColumns = (skills: any) => {
    let list: string[] = [];
    
    if (typeof skills === "string") {
      if (skills.includes('<ul>') || skills.includes('<li>')) {
        const matches = skills.match(/<li>(.*?)<\/li>/g);
        if (matches) {
          list = matches.map(m => m.replace(/<\/?li>/g, '').trim());
        } else {
          const textContent = skills.replace(/<[^>]*>/g, '');
          list = textContent.split(',').map(s => s.trim()).filter(s => s);
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
          line-height: 1.25;
          padding: 40px 50px;
          background: #ffffff;
          max-width: 850px;
          margin: 0 auto;
          font-size: ${baseFontSize}px;
          font-weight: ${currentFontWeight};
          text-align: ${currentAlignment};
        }

        /* Header */
        header {
          margin-bottom: 30px;
        }
        .name {
          font-size: ${nameFontSize}px;
          font-weight: 900;
          color: ${currentTheme.heading};
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 4px;
        }
        
        /* Top Accent Line - Below Name */
        .top-line {
          height: 8px;
          background-color: ${currentTheme.primary};
          margin: 8px 0 20px 0;
        }
        
        .contact-info {
          font-size: ${smallTextFontSize}px;
          color: ${currentTheme.textLight};
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 5px;
        }

        /* Core Layout Grid: Fixed width left column, remaining width right column */
        .section-row {
          display: grid;
          grid-template-columns: 180px 1fr;
          margin-top: 25px;
        }

        .label-main {
          font-size: ${labelFontSize}px;
          font-weight: 800;
          text-transform: uppercase;
          color: ${currentTheme.heading};
        }

        /* Entry Layout (Dates on Left, Text on Right) */
        .entry {
          display: grid;
          grid-template-columns: 180px 1fr;
          margin-bottom: 20px;
        }
        .entry-left {
          font-size: ${normalTextFontSize}px;
          font-weight: 800;
          color: ${currentTheme.text};
        }
        .entry-right {
          width: 100%;
        }
        .entry-right b {
          font-size: ${entryTitleFontSize}px;
          font-weight: 800;
          display: block;
          color: ${currentTheme.text};
        }
        .entry-right .sub-line {
          font-weight: 800;
          margin-bottom: 6px;
          display: block;
          color: ${currentTheme.textLight};
        }

        .bullet-list {
          list-style-type: disc;
          margin-left: 18px;
          font-size: ${normalTextFontSize}px;
          color: ${currentTheme.textLight};
        }
        .bullet-list li {
          margin-bottom: 4px;
        }

        .skills-container .bullet-list {
          flex: 1;
          margin-left: 0;
          list-style-type: none;
          padding-left: 0;
        }
        .skills-container .bullet-list li {
          margin-bottom: 6px;
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
          font-size: ${normalTextFontSize}px;
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
        .description-html p {
          margin-bottom: 8px;
          color: ${currentTheme.textLight};
        }

        /* Additional sections styling */
        .inline-list {
          list-style-type: disc;
          margin-left: 18px;
          font-size: ${normalTextFontSize}px;
        }
        .inline-list li {
          margin-bottom: 4px;
        }
        
        .context-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          width: 100%;
        }
        .context-item {
          font-size: ${normalTextFontSize}px;
          color: ${currentTheme.textLight};
        }
        .context-label {
          font-weight: 800;
          color: ${currentTheme.text};
        }

        .section-content {
          width: 100%;
        }
        
        a {
          color: ${currentTheme.primary};
          text-decoration: none;
        }
        
        a:hover {
          text-decoration: underline;
        }

        @media print {
          body { 
            padding: 0; 
            max-width: none;
          }
          .top-line { 
            -webkit-print-color-adjust: exact; 
            background-color: ${currentTheme.primary} !important; 
          }
        }
      </style>
    </head>
    <body>
      <header data-section="personal">
        <h1 class="name">${personal.name?.toUpperCase() || ""}</h1>
        <div class="top-line"></div>
        <div class="contact-info">
          ${personal.location ? `<span>${personal.location}${personal.pinCode ? ` ${personal.pinCode}` : ''}</span> | ` : ''}
          ${personal.country ? `<span>${personal.country}</span> | ` : ''}
          ${personal.phone ? `<span>${personal.phone}</span> | ` : ''}
          ${personal.alternatePhone ? `<span>${personal.alternatePhone}</span> | ` : ''}
          ${personal.email ? `<span>${personal.email}</span>` : ''}
        </div>
        <div class="contact-info" style="margin-bottom: 0;">
          ${personal.fullAddress ? `<span>${personal.fullAddress}</span>` : ''}
          ${personal.dob ? `<span>DOB: ${personal.dob}</span>` : ''}
          ${personal.gender ? `<span>Gender: ${personal.gender}</span>` : ''}
          ${personal.maritalStatus ? `<span>Marital: ${personal.maritalStatus}</span>` : ''}
        </div>
      </header>

    
      ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
      <div class="section-row" data-section="availabilityWorkAuth">
        <div class="label-main">Availability</div>
        <div class="context-grid">
          ${availabilityWorkAuth.availabilityNoticePeriod ? `<div class="context-item"><span class="context-label">Notice Period:</span> ${availabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
          ${availabilityWorkAuth.workAuthorizationStatus ? `<div class="context-item"><span class="context-label">Work Auth:</span> ${availabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
          ${availabilityWorkAuth.preferredLocation ? `<div class="context-item"><span class="context-label">Preferred Location:</span> ${availabilityWorkAuth.preferredLocation}</div>` : ''}
        </div>
      </div>
      ` : ''}

      ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
      <div class="section-row" data-section="careerObjective">
        <div class="label-main">Career Objective</div>
        <div class="section-content">
          <p style="font-size: ${normalTextFontSize}px; text-align: justify; color: ${currentTheme.textLight};">${careerObjective}</p>
        </div>
      </div>
      ` : ''}

      ${summary && summary.trim() ? `
      <div class="section-row" data-section="summary">
        <div class="label-main">Summary</div>
        <div class="section-content">
          <p style="font-size: ${normalTextFontSize}px; text-align: justify; color: ${currentTheme.textLight};">${summary}</p>
        </div>
      </div>
      ` : ''}

      ${nonEmptyExperience.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="experience">
        <div class="label-main">Experience</div>
        <div></div>
      </div>

      ${nonEmptyExperience.map((exp, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</div>
          <div class="entry-right">
            <b>${exp.title || ''}</b>
            <span class="sub-line">${exp.company || ''}${exp.location ? ` - ${exp.location}` : ''}</span>
            ${exp.description ? renderDescription(exp.description) : ''}
            ${exp.achievements ? `<p style="margin-top: 5px; color: ${currentTheme.textLight};"><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyProjects.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="projects">
        <div class="label-main">Projects</div>
        <div></div>
      </div>
      ${nonEmptyProjects.map((project, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${project.duration || ''}</div>
          <div class="entry-right">
            <b>${project.name || project.title || ''}</b>
            ${project.role ? `<span class="sub-line">Role: ${project.role}</span>` : ''}
            ${project.description ? renderDescription(project.description) : ''}
            ${project.technologies ? `<p style="color: ${currentTheme.textLight};"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyInternships.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="internships">
        <div class="label-main">Internships</div>
        <div></div>
      </div>
      ${nonEmptyInternships.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
          <div class="entry-right">
            <b>${item.title || ''}</b>
            <span class="sub-line">${item.company || ''}</span>
            ${item.description ? renderDescription(item.description) : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="trainingPrograms">
        <div class="label-main">Training Programs</div>
        <div></div>
      </div>
      ${nonEmptyTrainingPrograms.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.completionDate || ''}${item.duration ? ` (${item.duration})` : ''}</div>
          <div class="entry-right">
            <b>${item.name || ''}</b>
            <span class="sub-line">${item.provider || item.organization || ''}</span>
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="academicProjects">
        <div class="label-main">Academic Projects</div>
        <div></div>
      </div>
      ${nonEmptyAcademicProjects.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.duration || ''}</div>
          <div class="entry-right">
            <b>${item.name || item.title || ''}</b>
            <span class="sub-line">${item.institution || ''}${item.course ? ` | ${item.course}` : ''}</span>
            ${item.description ? renderDescription(item.description) : ''}
            ${item.technologies && item.technologies.length > 0 ? `<p style="color: ${currentTheme.textLight};"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
            ${item.url ? `<p><strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="leadershipPositions">
        <div class="label-main">Leadership Positions</div>
        <div></div>
      </div>
      ${nonEmptyLeadershipPositions.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${formatDateRange(item.startDate, item.endDate) || ''}</div>
          <div class="entry-right">
            <b>${item.position || item.title || ''}</b>
            <span class="sub-line">${item.organization || ''}</span>
            ${item.description ? renderDescription(item.description) : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="coCurricular">
        <div class="label-main">Co-curricular</div>
        <div></div>
      </div>
      ${nonEmptyCoCurricular.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <b>${item.activity || ''}</b>
            ${item.role ? `<span class="sub-line">Role: ${item.role}</span>` : ''}
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="extracurricular">
        <div class="label-main">Extracurricular</div>
        <div></div>
      </div>
      ${nonEmptyExtracurricular.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <b>${item.activity || ''}</b>
            ${item.role ? `<span class="sub-line">Role: ${item.role}</span>` : ''}
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyEducation.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="education">
        <div class="label-main">Education</div>
        <div></div>
      </div>
      ${nonEmptyEducation.map((edu, idx) => {
        const dateParts = [];
        if (edu.startDate && edu.startDate.trim()) dateParts.push(edu.startDate.trim());
        if (edu.graduationDate && edu.graduationDate.trim()) dateParts.push(edu.graduationDate.trim());
        else if (edu.endDate && edu.endDate.trim()) dateParts.push(edu.endDate.trim());
        const dateRange = dateParts.length > 0 ? dateParts.join(" - ") : "";
        return `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${dateRange || edu.graduationDate || edu.endDate || ''}</div>
          <div class="entry-right">
            <b>${edu.degree || ''}${edu.field ? ` in ${edu.field}` : ''}</b>
            <span class="sub-line">${edu.school || ''}${edu.location ? ` - ${edu.location}` : ''}</span>
            ${edu.grade ? `<p style="color: ${currentTheme.textLight};"><strong>${edu.grade}</strong></p>` : ''}
            ${edu.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${edu.description}</p>` : ''}
          </div>
        </div>
      `}).join('')}
      ` : ''}

      ${col1.length > 0 || col2.length > 0 ? `
      <div class="section-row" data-section="skills">
        <div class="label-main">Skills</div>
        <div class="skills-container">
          ${col1.length > 0 ? `
          <div style="flex: 1;">
            ${col1.map((s, idx) => `<div class="sidebar-list-item" data-index="${idx}">${s}</div>`).join('')}
          </div>
          ` : ''}
          ${col2.length > 0 ? `
          <div style="flex: 1;">
            ${col2.map((s, idx) => `<div class="sidebar-list-item" data-index="${col1.length + idx}">${s}</div>`).join('')}
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}


      <!-- Core Competencies Section -->
${coreCompCol1.length > 0 || coreCompCol2.length > 0 ? `
<div class="section-row" data-section="coreCompetencies">
  <div class="label-main">Competencies</div>
  <div class="skills-container" style="display: flex; gap: 30px;">
    ${coreCompCol1.length > 0 ? `
    <div style="flex: 1;">
      ${coreCompCol1.map((s, idx) => `<div class="sidebar-list-item" data-index="${idx}">${s}</div>`).join('')}
    </div>
    ` : ''}
    ${coreCompCol2.length > 0 ? `
    <div style="flex: 1;">
      ${coreCompCol2.map((s, idx) => `<div class="sidebar-list-item" data-index="${coreCompCol1.length + idx}">${s}</div>`).join('')}
    </div>
    ` : ''}
  </div>
</div>
` : ''}


      ${nonEmptyLanguages.length > 0 ? `
      <div class="section-row" data-section="languages">
        <div class="label-main">Languages</div>
        <div>
          <ul class="bullet-list" style="list-style: none; margin-left: 0;">
            ${nonEmptyLanguages.map((lang: any, idx) => `
              <li data-index="${idx}">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>
            `).join('')}
          </ul>
        </div>
      </div>
      ` : ''}

      ${nonEmptyCertifications.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="certifications">
        <div class="label-main">Certifications</div>
        <div></div>
      </div>
      ${nonEmptyCertifications.map((cert, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${cert.date || ''}</div>
          <div class="entry-right">
            <b>${cert.name || ''}</b>
            <span class="sub-line">${cert.issuer || ''}</span>
            ${cert.url ? `<p><a href="${cert.url}" target="_blank">${cert.url}</a></p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyAwards.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="awards">
        <div class="label-main">Awards</div>
        <div></div>
      </div>
      ${nonEmptyAwards.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.issueYear || item.year || ''}</div>
          <div class="entry-right">
            <b>${item.title || ''}</b>
            <span class="sub-line">${item.organization || ''}</span>
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyScholarships.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="scholarships">
        <div class="label-main">Scholarships</div>
        <div></div>
      </div>
      ${nonEmptyScholarships.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <b>${item.name || ''}</b>
            <span class="sub-line">${item.provider || item.organization || ''}</span>
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="speakingEngagements">
        <div class="label-main">Speaking Engagements</div>
        <div></div>
      </div>
      ${nonEmptySpeakingEngagements.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.date || ''}</div>
          <div class="entry-right">
            <b>${item.topic || ''}</b>
            <span class="sub-line">${item.eventName || ''}</span>
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyMemberships.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="memberships">
        <div class="label-main">Memberships</div>
        <div></div>
      </div>
      ${nonEmptyMemberships.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <b>${item.membershipName || ''}</b>
            <span class="sub-line">${item.organizationName || item.organization || ''}</span>
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyWorkshops.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="workshops">
        <div class="label-main">Workshops</div>
        <div></div>
      </div>
      ${nonEmptyWorkshops.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <b>${item.programTitle || item.title || ''}</b>
            <span class="sub-line">${item.conductedBy || ''}</span>
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyClientProjects.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="clientProjects">
        <div class="label-main">Client Projects</div>
        <div></div>
      </div>
      ${nonEmptyClientProjects.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.duration || ''}</div>
          <div class="entry-right">
            <b>${item.name || ''}</b>
            <span class="sub-line">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</span>
            ${item.description ? renderDescription(item.description) : ''}
            ${item.toolsTechnologies ? `<p><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ''}
            ${item.projectUrl ? `<p><strong>URL:</strong> <a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyPortfolio.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="portfolio">
        <div class="label-main">Portfolio</div>
        <div></div>
      </div>
      ${nonEmptyPortfolio.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left"></div>
          <div class="entry-right">
            <b>${item.name || ''}</b>
            <span class="sub-line">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</span>
            ${item.url ? `<p><a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyVolunteering.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="volunteering">
        <div class="label-main">Volunteering</div>
        <div></div>
      </div>
      ${nonEmptyVolunteering.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
          <div class="entry-right">
            <b>${item.role || ''}</b>
            <span class="sub-line">${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}</span>
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="militaryService">
        <div class="label-main">Military Service</div>
        <div></div>
      </div>
      ${nonEmptyMilitaryService.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
          <div class="entry-right">
            <b>${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</b>
            ${item.specialization ? `<span class="sub-line">${item.specialization}</span>` : ''}
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="toolsTechnologies">
        <div class="label-main">Tools & Technologies</div>
        <div></div>
      </div>
      ${nonEmptyToolsTechnologies.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left"></div>
          <div class="entry-right">
            <b>${item.name || ''}</b>
            ${item.category ? `<p><strong>Category:</strong> ${item.category}</p>` : ''}
            ${item.proficiency ? `<p><strong>Proficiency:</strong> ${item.proficiency}</p>` : ''}
            ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyMethodologies.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="methodologies">
        <div class="label-main">Methodologies</div>
        <div></div>
      </div>
      ${nonEmptyMethodologies.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left"></div>
          <div class="entry-right">
            <b>${item.name || ''}</b>
            ${item.certification ? `<p><strong>Certification:</strong> ${item.certification}</p>` : ''}
            ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="industryExpertise">
        <div class="label-main">Industry Expertise</div>
        <div></div>
      </div>
      ${nonEmptyIndustryExpertise.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left"></div>
          <div class="entry-right">
            <b>${item.industry || ''}</b>
            ${item.domainArea ? `<p><strong>Domain:</strong> ${item.domainArea}</p>` : ''}
            ${item.experienceDuration ? `<p><strong>Experience:</strong> ${item.experienceDuration}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="teachingExperience">
        <div class="label-main">Teaching Experience</div>
        <div></div>
      </div>
      ${nonEmptyTeachingExperience.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
          <div class="entry-right">
            <b>${item.subjectCourseTaught || item.title || ''}</b>
            <span class="sub-line">${item.institution || ''}</span>
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="mentorshipExperience">
        <div class="label-main">Mentorship Experience</div>
        <div></div>
      </div>
      ${nonEmptyMentorshipExperience.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</div>
          <div class="entry-right">
            <b>${item.mentorshipArea || ''}</b>
            <span class="sub-line">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</span>
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="researchGrants">
        <div class="label-main">Research Grants</div>
        <div></div>
      </div>
      ${nonEmptyResearchGrants.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <b>${item.title || ''}</b>
            <span class="sub-line">${item.agency || ''}${item.amount ? ` | Amount: ${item.amount}` : ''}</span>
            ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyTestScores.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="testScores">
        <div class="label-main">Test Scores</div>
        <div></div>
      </div>
      ${nonEmptyTestScores.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <b>${item.testName || ''}</b>
            <p><strong>Score:</strong> ${item.score || ''}</p>
            ${item.percentileRank ? `<p><strong>Percentile:</strong> ${item.percentileRank}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyPublications.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="publications">
        <div class="label-main">Publications</div>
        <div></div>
      </div>
      ${nonEmptyPublications.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <b>${item.title || ''}</b>
            <span class="sub-line">${item.journalPublisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</span>
            ${item.urlDoi ? `<p><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyPatents.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="patents">
        <div class="label-main">Patents</div>
        <div></div>
      </div>
      ${nonEmptyPatents.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left">${item.year || ''}</div>
          <div class="entry-right">
            <b>${item.title || ''}</b>
            <span class="sub-line">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</span>
            ${item.status ? `<p><strong>Status:</strong> ${item.status}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyReferences.length > 0 ? `
      <div class="section-row" style="margin-bottom: 0;" data-section="references">
        <div class="label-main">References</div>
        <div></div>
      </div>
      ${nonEmptyReferences.map((item, idx) => `
        <div class="entry" data-index="${idx}">
          <div class="entry-left"></div>
          <div class="entry-right">
            <b>${item.name || ''}</b>
            <span class="sub-line">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</span>
            ${item.contactInformation ? `<p style="color: ${currentTheme.textLight};">${item.contactInformation}</p>` : ''}
          </div>
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="section-row" data-section="socialProfiles">
        <div class="label-main">Social Profiles</div>
        <div>
          <ul class="bullet-list">
            ${nonEmptySocialProfiles.map((item: any, idx) => `
              <li data-index="${idx}">${item.platform || 'Profile'}: <a href="${item.url || ''}" target="_blank">${item.url || ''}</a></li>
            `).join('')}
          </ul>
        </div>
      </div>
      ` : ''}

      ${nonEmptyHobbies.length > 0 ? `
      <div class="section-row" data-section="hobbies">
        <div class="label-main">Hobbies</div>
        <div>
          <ul class="bullet-list">
            ${nonEmptyHobbies.map((hobby: any, idx) => `<li data-index="${idx}">${typeof hobby === "string" ? hobby.trim() : hobby}</li>`).join('')}
          </ul>
        </div>
      </div>
      ` : ''}
    </body>
    </html>
  `;
}