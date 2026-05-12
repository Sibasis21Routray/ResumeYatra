"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPhotographicTemplate = buildPhotographicTemplate;
function buildPhotographicTemplate(data, theme) {
    const { personal = {}, summary = "", careerObjective = "", experience = [], projects = [], education = [], internships = [], trainingPrograms = [], academicProjects = [], leadershipPositions = [], coCurricular = [], extracurricular = [], skills = "", languages = [], hobbies = [], certifications = [], scholarships = [], awards = [], speakingEngagements = [], memberships = [], workshops = [], clientProjects = [], portfolio = [], volunteering = [], militaryService = [], methodologies = [], industryExpertise = [], references = [], teachingExperience = [], mentorshipExperience = [], researchGrants = [], testScores = [], publications = [], patents = [], toolsTechnologies = [], professionalContext = {}, availabilityWorkAuth = {}, socialProfiles = [] } = data;
    // ✅ Theme system with defaults
    const defaultTheme = {
        primary: "#000000",
        text: "#000000",
        heading: "#000000",
        textLight: "#666666",
        borderColor: "#000000",
        background: "#ffffff",
    };
    const currentTheme = { ...defaultTheme, ...(theme || {}) };
    // ✅ Dynamic font size from user settings
    const baseFontSize = data?.formatting?.bodyFontSize || data?.fontSize || 13;
    const userFontFamily = data?.formatting?.fontFamily || data?.fontFamily || "'Times New Roman', Times, serif";
    // Typography settings
    const typography = theme?.typography || {
        fontSize: "medium",
        alignment: "left",
        fontWeight: "normal",
    };
    const alignmentMap = { left: "left", center: "center", justify: "justify" };
    const fontWeightMap = { normal: "400", bold: "700" };
    const currentAlignment = alignmentMap[typography.alignment] || "left";
    const currentFontWeight = fontWeightMap[typography.fontWeight] || "400";
    // Responsive font sizes based on baseFontSize
    const headerNameFontSize = Math.round(baseFontSize * 2.15); // ~28px at 13px base
    const sectionHeaderFontSize = Math.round(baseFontSize * 1.23); // ~16px at 13px base
    const companyNameFontSize = Math.round(baseFontSize * 1.15); // ~15px at 13px base
    const jobTitleFontSize = Math.round(baseFontSize * 1.08); // ~14px at 13px base
    const normalTextFontSize = Math.round(baseFontSize); // ~13px at 13px base
    const smallTextFontSize = Math.round(baseFontSize * 0.92); // ~12px at 13px base
    // Helper function to check if an array has non-empty items
    const hasNonEmptyItems = (arr) => {
        if (!arr || !Array.isArray(arr))
            return false;
        return arr.some(item => {
            if (typeof item === "string")
                return item.trim().length > 0;
            if (typeof item === "object" && item !== null) {
                return Object.values(item).some(val => typeof val === "string" && val.trim().length > 0);
            }
            return false;
        });
    };
    // Helper to get non-empty array items
    const getNonEmptyItems = (arr) => {
        if (!arr || !Array.isArray(arr))
            return [];
        return arr.filter(item => {
            if (typeof item === "string")
                return item.trim().length > 0;
            if (typeof item === "object" && item !== null) {
                return Object.values(item).some(val => typeof val === "string" && val.trim().length > 0);
            }
            return false;
        });
    };
    // Helper to check if an object has any non-empty values
    const hasObjectValues = (obj) => {
        if (!obj || typeof obj !== "object")
            return false;
        return Object.values(obj).some(val => val !== null && val !== undefined && val !== "");
    };
    // Helper to format date range
    const formatDateRange = (startDate, endDate, isCurrent) => {
        const parts = [];
        if (startDate && startDate.trim())
            parts.push(startDate.trim());
        if (endDate && endDate.trim())
            parts.push(endDate.trim());
        else if (isCurrent && parts.length > 0)
            parts.push("Present");
        return parts.join(" - ");
    };
    // Helper to render description with HTML content
    const renderDescription = (description) => {
        if (!description)
            return '';
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
        if (lines.length === 0)
            return '';
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
    const parseSkillsToColumns = (skills) => {
        let list = [];
        if (typeof skills === "string") {
            if (skills.includes('<ul>') || skills.includes('<li>')) {
                const matches = skills.match(/<li>(.*?)<\/li>/g);
                if (matches) {
                    list = matches.map(m => m.replace(/<\/?li>/g, '').trim());
                }
                else {
                    list = skills.split(',').map(s => s.trim()).filter(s => s);
                }
            }
            else {
                list = skills.split(',').map(s => s.trim()).filter(s => s);
            }
        }
        else if (Array.isArray(skills)) {
            list = skills;
        }
        const mid = Math.ceil(list.length / 2);
        return {
            col1: list.slice(0, mid),
            col2: list.slice(mid)
        };
    };
    const { col1, col2 } = parseSkillsToColumns(skills);
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
    // Helper to check if contact info exists
    const hasContactInfo = () => {
        return personal.location || personal.pinCode || personal.phone || personal.email ||
            personal.alternatePhone || personal.country || personal.fullAddress ||
            personal.dob || personal.gender || personal.maritalStatus;
    };
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
          line-height: 1.3;
          padding: 40px 50px;
          background: #ffffff;
          font-size: ${baseFontSize}px;
          font-weight: ${currentFontWeight};
          text-align: ${currentAlignment};
        }

        /* Header with Deep Solid Border Below Only */
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding: 10px 0;
          border-bottom: 4px solid ${currentTheme.borderColor};
        }
        .header h1 {
          font-size: ${headerNameFontSize}px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 5px;
          color: ${currentTheme.heading};
        }
        .contact-info {
          text-align: center;
          font-size: ${smallTextFontSize}px;
          margin-bottom: 15px;
          color: ${currentTheme.textLight};
        }

        /* Section Title with Lines on either side */
        .section-header {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 15px 0 10px 0;
        }
        .section-header::before, .section-header::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid ${currentTheme.borderColor};
        }
        .section-header span {
          padding: 0 15px;
          font-size: ${sectionHeaderFontSize}px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: ${currentTheme.heading};
        }

        /* Experience Layout */
        .exp-item {
          margin-bottom: 15px;
        }
        .company-name {
          text-align: center;
          font-weight: bold;
          font-size: ${companyNameFontSize}px;
          text-transform: uppercase;
          color: ${currentTheme.text};
        }
        .location-line {
          text-align: center;
          font-size: ${smallTextFontSize}px;
          margin-bottom: 4px;
          color: ${currentTheme.textLight};
        }
        .job-title-row {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          font-size: ${jobTitleFontSize}px;
          margin-bottom: 3px;
          color: ${currentTheme.text};
        }
        
        .bullet-list {
          list-style-type: disc;
          margin-left: 30px;
          font-size: ${normalTextFontSize}px;
          color: ${currentTheme.textLight};
        }
        .bullet-list li {
          margin-bottom: 2px;
        }

        /* Skills 2-Column Grid */
        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 50px;
        }

        /* Education Layout */
        .edu-row {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          font-size: ${jobTitleFontSize}px;
          text-transform: uppercase;
          color: ${currentTheme.text};
        }
        .edu-sub {
          font-weight: bold;
          font-size: ${smallTextFontSize}px;
          color: ${currentTheme.textLight};
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

        .context-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin-bottom: 10px;
        }
        .context-item {
          font-size: ${normalTextFontSize}px;
          color: ${currentTheme.textLight};
        }
        .context-label {
          font-weight: 800;
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
          body { padding: 0.3in; }
        }
      </style>
    </head>
    <body>
      <div class="header" data-section="personal">
        <h1>${personal.name?.toUpperCase() || ''}</h1>
      </div>

      ${hasContactInfo() ? `
      <div class="contact-info" data-section="personal">
        ${personal.location || personal.pinCode ? `<p>${personal.location ? `${personal.location}${personal.pinCode ? ` ${personal.pinCode}` : ''}` : personal.pinCode ? personal.pinCode : ''}</p>` : ''}
        ${personal.phone ? `<p>${personal.phone}</p>` : ''}
        ${personal.email ? `<p>${personal.email}</p>` : ''}
        ${personal.alternatePhone ? `<p>Alt: ${personal.alternatePhone}</p>` : ''}
        ${personal.country ? `<p>${personal.country}</p>` : ''}
        ${personal.fullAddress ? `<p>${personal.fullAddress}</p>` : ''}
        ${personal.dob ? `<p>DOB: ${personal.dob}</p>` : ''}
        ${personal.gender ? `<p>Gender: ${personal.gender}</p>` : ''}
        ${personal.maritalStatus ? `<p>Marital: ${personal.maritalStatus}</p>` : ''}
      </div>
      ` : ''}

     

      ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
      <div class="section-header" data-section="availabilityWorkAuth"><span>Availability</span></div>
      <div class="context-grid">
        ${availabilityWorkAuth.availabilityNoticePeriod ? `<div class="context-item"><span class="context-label">Notice Period:</span> ${availabilityWorkAuth.availabilityNoticePeriod}</div>` : ''}
        ${availabilityWorkAuth.workAuthorizationStatus ? `<div class="context-item"><span class="context-label">Work Auth:</span> ${availabilityWorkAuth.workAuthorizationStatus}</div>` : ''}
        ${availabilityWorkAuth.preferredLocation ? `<div class="context-item"><span class="context-label">Preferred Location:</span> ${availabilityWorkAuth.preferredLocation}</div>` : ''}
      </div>
      ` : ''}

      ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
      <div class="section-header" data-section="careerObjective"><span>Career Objective</span></div>
      <p style="font-size: ${normalTextFontSize}px; text-align: justify; padding: 0 5px; color: ${currentTheme.textLight};">${careerObjective}</p>
      ` : ''}

      ${summary && summary.trim() ? `
      <div class="section-header" data-section="summary"><span>Summary</span></div>
      <p style="font-size: ${normalTextFontSize}px; text-align: justify; padding: 0 5px; color: ${currentTheme.textLight};">${summary}</p>
      ` : ''}

      ${nonEmptyExperience.length > 0 ? `
      <div class="section-header" data-section="experience"><span>Experience</span></div>
      ${nonEmptyExperience.map((exp, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${exp.company || ''}</div>
          <div class="location-line">${exp.location || ''}</div>
          <div class="job-title-row">
            <span>${exp.title || ''}</span>
            <span>${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
          </div>
          ${exp.description ? renderDescription(exp.description) : ''}
          ${exp.achievements ? `<p style="font-size: ${normalTextFontSize}px; margin-top: 5px; color: ${currentTheme.textLight};"><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyProjects.length > 0 ? `
      <div class="section-header" data-section="projects"><span>Projects</span></div>
      ${nonEmptyProjects.map((project, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${project.name || project.title || ''}</div>
          <div class="job-title-row">
            <span>${project.role ? `Role: ${project.role}` : ''}</span>
            <span>${project.duration || ''}</span>
          </div>
          ${project.description ? renderDescription(project.description) : ''}
          ${project.technologies ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyInternships.length > 0 ? `
      <div class="section-header" data-section="internships"><span>Internships</span></div>
      ${nonEmptyInternships.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.company || ''}</div>
          <div class="job-title-row">
            <span>${item.title || ''}</span>
            <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
          </div>
          ${item.description ? renderDescription(item.description) : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyTrainingPrograms.length > 0 ? `
      <div class="section-header" data-section="trainingPrograms"><span>Training Programs</span></div>
      ${nonEmptyTrainingPrograms.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.name || ''}</div>
          <div class="job-title-row">
            <span>${item.provider || item.organization || ''}</span>
            <span>${item.completionDate || ''}${item.duration ? ` (${item.duration})` : ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyAcademicProjects.length > 0 ? `
      <div class="section-header" data-section="academicProjects"><span>Academic Projects</span></div>
      ${nonEmptyAcademicProjects.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.name || item.title || ''}</div>
          <div class="location-line">${item.institution || ''}${item.course ? ` | ${item.course}` : ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.duration || ''}</span>
          </div>
          ${item.description ? renderDescription(item.description) : ''}
          ${item.technologies && item.technologies.length > 0 ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
          ${item.url ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};"><strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyLeadershipPositions.length > 0 ? `
      <div class="section-header" data-section="leadershipPositions"><span>Leadership Positions</span></div>
      ${nonEmptyLeadershipPositions.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.position || item.title || ''}</div>
          <div class="location-line">${item.organization || ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${formatDateRange(item.startDate, item.endDate) || ''}</span>
          </div>
          ${item.description ? renderDescription(item.description) : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyCoCurricular.length > 0 ? `
      <div class="section-header" data-section="coCurricular"><span>Co-curricular Activities</span></div>
      ${nonEmptyCoCurricular.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.activity || ''}</div>
          <div class="job-title-row">
            <span>${item.role ? `Role: ${item.role}` : ''}</span>
            <span>${item.year || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyExtracurricular.length > 0 ? `
      <div class="section-header" data-section="extracurricular"><span>Extracurricular Activities</span></div>
      ${nonEmptyExtracurricular.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.activity || ''}</div>
          <div class="job-title-row">
            <span>${item.role ? `Role: ${item.role}` : ''}</span>
            <span>${item.year || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${(col1.length > 0 || col2.length > 0) ? `
      <div class="section-header" data-section="skills"><span>Skills</span></div>
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
      ` : ''}

      ${nonEmptyLanguages.length > 0 ? `
      <div class="section-header" data-section="languages"><span>Languages</span></div>
      <ul class="bullet-list" style="list-style: none; margin-left: 0;">
        ${nonEmptyLanguages.map((lang, idx) => `
          <li data-index="${idx}">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ''}${lang.capability ? ` - ${lang.capability}` : ''}</li>
        `).join('')}
      </ul>
      ` : ''}

      ${nonEmptyCertifications.length > 0 ? `
      <div class="section-header" data-section="certifications"><span>Certifications</span></div>
      ${nonEmptyCertifications.map((cert, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${cert.name || ''}</div>
          <div class="location-line">${cert.issuer || ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${cert.date || ''}</span>
          </div>
          ${cert.url ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};"><a href="${cert.url}" target="_blank">${cert.url}</a></p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyAwards.length > 0 ? `
      <div class="section-header" data-section="awards"><span>Awards</span></div>
      ${nonEmptyAwards.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.title || ''}</div>
          <div class="location-line">${item.organization || ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.issueYear || item.year || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyScholarships.length > 0 ? `
      <div class="section-header" data-section="scholarships"><span>Scholarships</span></div>
      ${nonEmptyScholarships.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.name || ''}</div>
          <div class="location-line">${item.provider || item.organization || ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.year || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptySpeakingEngagements.length > 0 ? `
      <div class="section-header" data-section="speakingEngagements"><span>Speaking Engagements</span></div>
      ${nonEmptySpeakingEngagements.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.topic || ''}</div>
          <div class="location-line">${item.eventName || ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.date || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyMemberships.length > 0 ? `
      <div class="section-header" data-section="memberships"><span>Memberships</span></div>
      ${nonEmptyMemberships.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.membershipName || ''}</div>
          <div class="location-line">${item.organizationName || item.organization || ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.year || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyWorkshops.length > 0 ? `
      <div class="section-header" data-section="workshops"><span>Workshops</span></div>
      ${nonEmptyWorkshops.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.programTitle || item.title || ''}</div>
          <div class="location-line">${item.conductedBy || ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.year || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyClientProjects.length > 0 ? `
      <div class="section-header" data-section="clientProjects"><span>Client Projects</span></div>
      ${nonEmptyClientProjects.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.name || ''}</div>
          <div class="location-line">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.duration || ''}</span>
          </div>
          ${item.description ? renderDescription(item.description) : ''}
          ${item.toolsTechnologies ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};"><strong>Tools:</strong> ${item.toolsTechnologies}</p>` : ''}
          ${item.projectUrl ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};"><strong>URL:</strong> <a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyPortfolio.length > 0 ? `
      <div class="section-header" data-section="portfolio"><span>Portfolio</span></div>
      ${nonEmptyPortfolio.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.name || ''}</div>
          <div class="location-line">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</div>
          ${item.url ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};"><a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyVolunteering.length > 0 ? `
      <div class="section-header" data-section="volunteering"><span>Volunteering</span></div>
      ${nonEmptyVolunteering.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.role || ''}</div>
          <div class="location-line">${item.organization || ''}${item.causeArea ? ` - ${item.causeArea}` : ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyMilitaryService.length > 0 ? `
      <div class="section-header" data-section="militaryService"><span>Military Service</span></div>
      ${nonEmptyMilitaryService.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.branch ? item.branch : ''}${item.rank ? ` - ${item.rank}` : ''}</div>
          <div class="location-line">${item.specialization || ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyToolsTechnologies.length > 0 ? `
      <div class="section-header" data-section="toolsTechnologies"><span>Tools & Technologies</span></div>
      ${nonEmptyToolsTechnologies.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.name || ''}</div>
          ${item.category ? `<div class="location-line">Category: ${item.category}</div>` : ''}
          ${item.proficiency ? `<div class="location-line">Proficiency: ${item.proficiency}</div>` : ''}
          ${item.experienceDuration ? `<div class="location-line">Experience: ${item.experienceDuration}</div>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyMethodologies.length > 0 ? `
      <div class="section-header" data-section="methodologies"><span>Methodologies</span></div>
      ${nonEmptyMethodologies.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.name || ''}</div>
          ${item.certification ? `<div class="location-line">Certification: ${item.certification}</div>` : ''}
          ${item.experienceDuration ? `<div class="location-line">Experience: ${item.experienceDuration}</div>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyIndustryExpertise.length > 0 ? `
      <div class="section-header" data-section="industryExpertise"><span>Industry Expertise</span></div>
      ${nonEmptyIndustryExpertise.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.industry || ''}</div>
          ${item.domainArea ? `<div class="location-line">Domain: ${item.domainArea}</div>` : ''}
          ${item.experienceDuration ? `<div class="location-line">Experience: ${item.experienceDuration}</div>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyTeachingExperience.length > 0 ? `
      <div class="section-header" data-section="teachingExperience"><span>Teaching Experience</span></div>
      ${nonEmptyTeachingExperience.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.subjectCourseTaught || item.title || ''}</div>
          <div class="location-line">${item.institution || ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyMentorshipExperience.length > 0 ? `
      <div class="section-header" data-section="mentorshipExperience"><span>Mentorship Experience</span></div>
      ${nonEmptyMentorshipExperience.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.mentorshipArea || ''}</div>
          <div class="location-line">${item.organizationPlatform || ''}${item.menteeLevel ? ` - ${item.menteeLevel}` : ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.duration || formatDateRange(item.startDate, item.endDate) || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyResearchGrants.length > 0 ? `
      <div class="section-header" data-section="researchGrants"><span>Research Grants</span></div>
      ${nonEmptyResearchGrants.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.title || ''}</div>
          <div class="location-line">${item.agency || ''}${item.amount ? ` | Amount: ${item.amount}` : ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.year || ''}</span>
          </div>
          ${item.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.description}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyTestScores.length > 0 ? `
      <div class="section-header" data-section="testScores"><span>Test Scores</span></div>
      ${nonEmptyTestScores.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.testName || ''}</div>
          <div class="location-line">Score: ${item.score || ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.year || ''}</span>
          </div>
          ${item.percentileRank ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">Percentile: ${item.percentileRank}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyPublications.length > 0 ? `
      <div class="section-header" data-section="publications"><span>Publications</span></div>
      ${nonEmptyPublications.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.title || ''}</div>
          <div class="location-line">${item.journalPublisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.year || ''}</span>
          </div>
          ${item.urlDoi ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};"><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyPatents.length > 0 ? `
      <div class="section-header" data-section="patents"><span>Patents</span></div>
      ${nonEmptyPatents.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.title || ''}</div>
          <div class="location-line">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}${item.issuingAuthority ? ` | ${item.issuingAuthority}` : ''}</div>
          <div class="job-title-row">
            <span></span>
            <span>${item.year || ''}</span>
          </div>
          ${item.status ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">Status: ${item.status}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptyReferences.length > 0 ? `
      <div class="section-header" data-section="references"><span>References</span></div>
      ${nonEmptyReferences.map((item, idx) => `
        <div class="exp-item" data-index="${idx}">
          <div class="company-name">${item.name || ''}</div>
          <div class="location-line">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</div>
          ${item.contactInformation ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${item.contactInformation}</p>` : ''}
        </div>
      `).join('')}
      ` : ''}

      ${nonEmptySocialProfiles.length > 0 ? `
      <div class="section-header" data-section="socialProfiles"><span>Social Profiles</span></div>
      <ul class="bullet-list">
        ${nonEmptySocialProfiles.map((item, idx) => `
          <li data-index="${idx}">${item.platform || 'Profile'}: <a href="${item.url || ''}" target="_blank">${item.url || ''}</a></li>
        `).join('')}
      </ul>
      ` : ''}

      ${nonEmptyHobbies.length > 0 ? `
      <div class="section-header" data-section="hobbies"><span>Hobbies</span></div>
      <ul class="bullet-list">
        ${nonEmptyHobbies.map((hobby, idx) => `<li data-index="${idx}">${typeof hobby === "string" ? hobby.trim() : hobby}</li>`).join('')}
      </ul>
      ` : ''}

      ${nonEmptyEducation.length > 0 ? `
      <div class="section-header" data-section="education"><span>Education</span></div>
      ${nonEmptyEducation.map((edu, idx) => {
        const dateParts = [];
        if (edu.startDate && edu.startDate.trim())
            dateParts.push(edu.startDate.trim());
        if (edu.graduationDate && edu.graduationDate.trim())
            dateParts.push(edu.graduationDate.trim());
        else if (edu.endDate && edu.endDate.trim())
            dateParts.push(edu.endDate.trim());
        const dateRange = dateParts.length > 0 ? dateParts.join(" - ") : "";
        const schoolParts = [];
        if (edu.school && edu.school.trim())
            schoolParts.push(edu.school.trim());
        if (edu.location && edu.location.trim())
            schoolParts.push(edu.location.trim());
        const schoolLine = schoolParts.length > 0 ? schoolParts.join(", ") : "";
        return `
        <div class="edu-item" style="margin-bottom: 10px;" data-index="${idx}">
          <div class="edu-row">
            <span>${(edu.degree || '').toUpperCase()}${edu.field ? ` IN ${edu.field.toUpperCase()}` : ''}</span>
            <span>${dateRange || edu.graduationDate || edu.endDate || ''}</span>
          </div>
          ${schoolLine ? `<div class="edu-sub">${schoolLine}</div>` : ''}
          ${edu.grade ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};"><strong>${edu.grade}</strong></p>` : ''}
          ${edu.description ? `<p style="font-size: ${normalTextFontSize}px; color: ${currentTheme.textLight};">${edu.description}</p>` : ''}
        </div>
      `;
    }).join('')}
      ` : ''}
    </body>
    </html>
  `;
}
