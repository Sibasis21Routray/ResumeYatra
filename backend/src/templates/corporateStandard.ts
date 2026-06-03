export function buildCorporateStandardTemplate(data: any, theme?: any): string {
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

  const defaultTheme = {
    primary: "#000000",
    textMain: "#111111",
    textLight: "#4b5563",
    background: "#ffffff",
    headerBg: "#000000",
    headerText: "#ffffff"
  };
  const currentTheme = { ...defaultTheme, ...(theme || {}) };
  const baseFontSize = data?.formatting?.bodyFontSize || data?.fontSize || 10;
  const userFontFamily = data?.formatting?.fontFamily || data?.fontFamily || "'Times New Roman', 'Georgia', serif";
  const nameFontSize = Math.round(baseFontSize * 2.8);
  const sectionTitleSize = Math.round(baseFontSize * 1.3);
  const primaryColor = currentTheme.primary || currentTheme.headerBg || "#000000";

  const subTextSize = Math.round(baseFontSize * 0.9);

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

  const hasObjectValues = (obj: any): boolean => {
    if (!obj || typeof obj !== "object") return false;
    return Object.values(obj).some(val => 
      val !== null && val !== undefined && val !== ""
    );
  };

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean): string => {
    const parts = [];
    if (startDate?.trim()) parts.push(startDate.trim());
    if (isCurrent) parts.push("Present");
    else if (endDate?.trim()) parts.push(endDate.trim());
    return parts.join(" – ");
  };

  const renderBullets = (description: string): string => {
    if (!description) return "";
    
    // Remove any existing bullet characters that could cause encoding issues
    let cleanDescription = description.replace(/[•·●○]/g, "");
    
    // If HTML content already exists, use it as-is
    if (cleanDescription.includes('<ul>') || cleanDescription.includes('<li>') || cleanDescription.includes('<div>')) {
      return `<div class="description-html">${cleanDescription}</div>`;
    }
    
    // Split into lines and create native <ul>/<li>
    const lines = cleanDescription.split("\n").filter(line => line.trim());
    if (lines.length === 0) return "";
    
    return `<ul class="bullet-list">${lines.map(l => `<li>${l.trim()}</li>`).join("")}</ul>`;
  };

  const skillArray = typeof skills === "string" 
    ? skills.split(",").map(s => s.trim()).filter(s => s) 
    : Array.isArray(skills) ? skills : [];

    const coreCompArray = typeof coreCompetencies === "string" 
  ? coreCompetencies.split(",").map(s => s.trim()).filter(s => s) 
  : Array.isArray(coreCompetencies) ? coreCompetencies : [];

  const linkedIn = socialProfiles.find((p: any) => p.platform?.toLowerCase().includes("linkedin"))?.url || "";
  
  // Filter arrays
  const nonEmptyExperience = getNonEmptyItems(experience);
  const nonEmptyEducation = getNonEmptyItems(education);
  const nonEmptyProjects = getNonEmptyItems(projects);
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
  const nonEmptyHobbies = getNonEmptyItems(hobbies);
  const nonEmptySocialProfiles = getNonEmptyItems(socialProfiles);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: ${userFontFamily};
          color: ${currentTheme.textMain || '#111827'};
          line-height: 1.5;
          padding: 40px;
          background: #ffffff;
          font-size: ${baseFontSize}px;
        }

        /* Header Section */
        .header { text-align: center; margin-bottom: 30px; }
        .name { 
          font-size: ${nameFontSize}px; 
          text-transform: uppercase; 
          font-weight: bold; 
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        .contact-info { 
          font-size: ${subTextSize}px; 
          margin-bottom: 5px;
          color: #000;
        }
        .contact-info span { margin: 0 8px; font-weight: 500; }
        .linkedin-link { font-size: ${subTextSize}px; color: #000; text-decoration: none; border-bottom: 1px solid #ccc; }

        /* Section Headings with Full Grey Light Underline */
        .section { margin-bottom: 25px; }
        .section-header { 
          display: flex; 
          align-items: center; 
          margin-bottom: 15px; 
          padding-bottom: 10px;
          border-bottom: 2px solid #d0d0d0;
          width: 100%;
        }
        .section-dot {
          color: ${primaryColor};
  font-size: 12px;
  margin-right: 10px;
        }
        .section-title {
          font-size: ${sectionTitleSize}px;
          font-weight: bold;
          text-transform: uppercase;
          color: ${primaryColor};
          letter-spacing: 0.5px;
        }

        /* Professional Experience */
        .exp-item { margin-bottom: 18px; }
        .company-name { font-weight: bold; color: #000; font-size: ${baseFontSize}px; }
        .job-meta { font-style: italic; color: ${currentTheme.textLight}; margin-bottom: 4px; font-size: ${subTextSize}px; }
        
        /* NATIVE BULLETS - NO ::before, NO list-style: none */
        .bullet-list,
        .grid-list,
        .simple-list,
        .description-html ul {
          list-style-type: disc;
          padding-left: 20px;
          margin-top: 5px;
        }

        .bullet-list li,
        .grid-list li,
        .simple-list li,
        .description-html li {
          margin-bottom: 4px;
          color: ${currentTheme.textLight};
          font-size: ${subTextSize}px;
        }

        /* Grid layout for skills - keeps native bullets */
        .grid-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 6px 30px;
        }

        /* HTML content styling */
        .description-html p {
          margin-bottom: 8px;
          color: ${currentTheme.textLight};
          font-size: ${subTextSize}px;
        }

        /* Summary - No bullets at all */
        .summary-text {
          color: ${currentTheme.textLight};
          text-align: justify;
          line-height: 1.6;
        }

        /* Education Table Style */
        .edu-table { width: 100%; border-collapse: collapse; margin-top: 5px; }
        .edu-table th { 
          background: ${primaryColor}; 
          color: #fff; 
          text-align: left; 
          padding: 8px; 
          font-size: ${subTextSize}px;
          text-transform: uppercase;
          font-weight: 600;
        }
        .edu-table td { 
          border: 1px solid #eee; 
          padding: 8px; 
          color: ${currentTheme.textLight};
          font-size: ${subTextSize}px;
        }

        .info-text {
          color: ${currentTheme.textLight};
          font-size: ${subTextSize}px;
          line-height: 1.6;
        }

        .social-list {
          list-style: none;
          padding-left: 0;
          margin-top: 5px;
        }
        .social-list li {
          margin-bottom: 8px;
        }
        .social-list a {
          color: #000;
          text-decoration: none;
          border-bottom: 1px solid #ccc;
        }
        .social-list a:hover {
          border-bottom-color: #000;
        }

        @media print {
          body { padding: 20px; }
          .section-dot, .edu-table th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .section-header { border-bottom: 2px solid #d0d0d0 !important; }
        }
      </style>
    </head>
    <body>
      <header class="header" data-section="personal">
        <h1 class="name">${personal.name || 'Your Name'}</h1>
        <div class="contact-info">
          ${personal.phone ? `<span><strong>Ph.</strong> ${personal.phone}</span>` : ''}
          ${personal.alternatePhone ? `<span><strong>Alt Phone</strong> ${personal.alternatePhone}</span>` : ''}
          ${personal.email ? `<span><strong>Email</strong> ${personal.email}</span>` : ''}
          ${personal.location ? `<span><strong>Location</strong> ${personal.location}</span>` : ''}
          ${personal.dob ? `<span><strong>DOB</strong> ${personal.dob}</span>` : ''}
          ${personal.gender ? `<span><strong>Gender</strong> ${personal.gender}</span>` : ''}
        </div>
        ${linkedIn ? `<div style="margin-top: 5px;"><strong>LinkedIn:</strong> <a class="linkedin-link" href="${linkedIn}">${linkedIn.replace(/^https?:\/\//, '')}</a></div>` : ''}
      </header>

      ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
      <section class="section" data-section="availabilityWorkAuth">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Availability & Work Authorization</h2>
        </div>
        <div class="info-text">
          ${availabilityWorkAuth.availabilityNoticePeriod ? `<p><strong>Notice Period:</strong> ${availabilityWorkAuth.availabilityNoticePeriod}</p>` : ''}
          ${availabilityWorkAuth.workAuthorizationStatus ? `<p><strong>Work Authorization:</strong> ${availabilityWorkAuth.workAuthorizationStatus}</p>` : ''}
          ${availabilityWorkAuth.preferredLocation ? `<p><strong>Preferred Location:</strong> ${availabilityWorkAuth.preferredLocation}</p>` : ''}
        </div>
      </section>` : ''}

      ${careerObjective && careerObjective.trim() && (!summary || !summary.trim()) ? `
      <section class="section" data-section="summary">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Career Objective</h2>
        </div>
        <p class="summary-text">${careerObjective}</p>
      </section>` : ''}

      ${summary && summary.trim() ? `
      <section class="section" data-section="summary">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Professional Summary</h2>
        </div>
        <p class="summary-text">${summary}</p>
      </section>` : ''}

      ${nonEmptyExperience.length > 0 ? `
      <section class="section" data-section="experience">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Professional Experience</h2>
        </div>
        ${nonEmptyExperience.map((exp: any, idx: number) => `
          <div class="exp-item" data-index="${idx}">
            <div class="company-name">${exp.company || ''}</div>
            <div class="job-meta">${exp.title || ''} | ${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}${exp.location ? ` | ${exp.location}` : ''}</div>
            ${exp.description ? renderBullets(exp.description) : ''}
            ${exp.achievements ? `<p class="info-text"><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
          </div>
        `).join('')}
      </section>` : ''}

      ${nonEmptyProjects.length > 0 ? `
      <section class="section" data-section="projects">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Projects</h2>
        </div>
        ${nonEmptyProjects.map((project: any, idx: number) => `
          <div class="exp-item" data-index="${idx}">
            <div class="company-name">${project.name || project.title || ''}</div>
            <div class="job-meta">${project.role ? `Role: ${project.role}` : ''}${project.duration ? ` | ${project.duration}` : ''}</div>
            ${project.description ? renderBullets(project.description) : ''}
            ${project.technologies ? `<p class="info-text"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
          </div>
        `).join('')}
      </section>` : ''}

      ${nonEmptyInternships.length > 0 ? `
      <section class="section" data-section="internships">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Internships</h2>
        </div>
        ${nonEmptyInternships.map((item: any, idx: number) => `
          <div class="exp-item" data-index="${idx}">
            <div class="company-name">${item.title || ''}</div>
            <div class="job-meta">${item.company || ''}${item.duration ? ` | ${item.duration}` : formatDateRange(item.startDate, item.endDate) ? ` | ${formatDateRange(item.startDate, item.endDate)}` : ''}</div>
            ${item.description ? renderBullets(item.description) : ''}
          </div>
        `).join('')}
      </section>` : ''}

      ${nonEmptyTrainingPrograms.length > 0 ? `
      <section class="section" data-section="trainingPrograms">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Training Programs</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyTrainingPrograms.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.name || ''}</strong>${item.provider ? ` - ${item.provider}` : ''}${item.completionDate ? ` (${item.completionDate})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyAcademicProjects.length > 0 ? `
      <section class="section" data-section="academicProjects">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Academic Projects</h2>
        </div>
        ${nonEmptyAcademicProjects.map((item: any, idx: number) => `
          <div class="exp-item" data-index="${idx}">
            <div class="company-name">${item.name || item.title || ''}</div>
            <div class="job-meta">${item.institution || ''}${item.duration ? ` | ${item.duration}` : ''}</div>
            ${item.description ? renderBullets(item.description) : ''}
            ${item.technologies ? `<p class="info-text"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
          </div>
        `).join('')}
      </section>` : ''}

      ${nonEmptyLeadershipPositions.length > 0 ? `
      <section class="section" data-section="leadershipPositions">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Leadership Positions</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyLeadershipPositions.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.position || item.title || ''}</strong>${item.organization ? ` at ${item.organization}` : ''}${formatDateRange(item.startDate, item.endDate) ? ` (${formatDateRange(item.startDate, item.endDate)})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyCoCurricular.length > 0 ? `
      <section class="section" data-section="coCurricular">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Co-curricular Activities</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyCoCurricular.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.activity || ''}</strong>${item.role ? ` - ${item.role}` : ''}${item.year ? ` (${item.year})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyExtracurricular.length > 0 ? `
      <section class="section" data-section="extracurricular">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Extracurricular Activities</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyExtracurricular.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.activity || ''}</strong>${item.role ? ` - ${item.role}` : ''}${item.year ? ` (${item.year})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyEducation.length > 0 ? `
      <section class="section" data-section="education">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Education</h2>
        </div>
        <table class="edu-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>University/Board</th>
              <th>Year</th>
              <th>%/Grade</th>
            </tr>
          </thead>
          <tbody>
            ${nonEmptyEducation.map((edu: any, idx: number) => `
              <tr data-index="${idx}">
                <td>
                  <strong>${edu.degree || edu.course || ''}${edu.field ? ` in ${edu.field}` : ''}</strong>
                  ${edu.description ? `<br>${renderBullets(edu.description)}` : ''}
                </td>
                <td>${edu.school || edu.university || ''}${edu.location ? `<br><small>${edu.location}</small>` : ''}</td>
                <td>${formatDateRange(edu.startDate, edu.graduationDate || edu.endDate, edu.isCurrent)}</td>
                <td>${edu.grade || edu.percentage || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </section>` : ''}

      ${skillArray.length > 0 ? `
      <section class="section" data-section="skills">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Skills</h2>
        </div>
        <ul class="grid-list">
          ${skillArray.map((skill: string, idx: number) => `<li data-index="${idx}">${skill}</li>`).join('')}
        </ul>
      </section>` : ''}


      <!-- Core Competencies Section -->
${coreCompArray.length > 0 ? `
<section class="section" data-section="coreCompetencies">
  <div class="section-header">
    <span class="section-dot">●</span>
    <h2 class="section-title">Core Competencies</h2>
  </div>
  <ul class="grid-list">
    ${coreCompArray.map((comp: string, idx: number) => `<li data-index="${idx}">${comp}</li>`).join('')}
  </ul>
</section>` : ''}

      ${nonEmptyToolsTechnologies.length > 0 ? `
      <section class="section" data-section="toolsTechnologies">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Tools & Technologies</h2>
        </div>
        <ul class="grid-list">
          ${nonEmptyToolsTechnologies.map((item: any, idx: number) => `<li data-index="${idx}">${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyMethodologies.length > 0 ? `
      <section class="section" data-section="methodologies">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Methodologies</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyMethodologies.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.name || ''}</strong>${item.certification ? ` - ${item.certification}` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyIndustryExpertise.length > 0 ? `
      <section class="section" data-section="industryExpertise">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Industry Expertise</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyIndustryExpertise.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.industry || ''}</strong>${item.domainArea ? ` (${item.domainArea})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyCertifications.length > 0 ? `
      <section class="section" data-section="certifications">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Certifications</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyCertifications.map((cert: any, idx: number) => `<li data-index="${idx}"><strong>${cert.name || ''}</strong>${cert.issuer ? ` - ${cert.issuer}` : ''}${cert.date ? ` (${cert.date})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyLanguages.length > 0 ? `
      <section class="section" data-section="languages">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Languages</h2>
        </div>
        <ul class="grid-list">
          ${nonEmptyLanguages.map((lang: any, idx: number) => `<li data-index="${idx}">${lang.language || lang}${lang.proficiency ? ` - ${lang.proficiency}` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyHobbies.length > 0 ? `
      <section class="section" data-section="hobbies">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Hobbies</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyHobbies.map((hobby: any, idx: number) => `<li data-index="${idx}">${typeof hobby === "string" ? hobby.trim() : hobby}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyScholarships.length > 0 ? `
      <section class="section" data-section="scholarships">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Scholarships</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyScholarships.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.name || ''}</strong>${item.provider ? ` - ${item.provider}` : ''}${item.year ? ` (${item.year})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyAwards.length > 0 ? `
      <section class="section" data-section="awards">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Awards</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyAwards.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.title || ''}</strong>${item.organization ? ` - ${item.organization}` : ''}${item.year ? ` (${item.year})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptySpeakingEngagements.length > 0 ? `
      <section class="section" data-section="speakingEngagements">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Speaking Engagements</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptySpeakingEngagements.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.topic || ''}</strong>${item.eventName ? ` at ${item.eventName}` : ''}${item.date ? ` (${item.date})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyMemberships.length > 0 ? `
      <section class="section" data-section="memberships">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Memberships</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyMemberships.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.membershipName || ''}</strong>${item.organizationName ? ` - ${item.organizationName}` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyWorkshops.length > 0 ? `
      <section class="section" data-section="workshops">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Workshops</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyWorkshops.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.programTitle || item.title || ''}</strong>${item.conductedBy ? ` by ${item.conductedBy}` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyClientProjects.length > 0 ? `
      <section class="section" data-section="clientProjects">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Client Projects</h2>
        </div>
        ${nonEmptyClientProjects.map((item: any, idx: number) => `
          <div class="exp-item" data-index="${idx}">
            <div class="company-name">${item.name || ''}</div>
            <div class="job-meta">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</div>
            ${item.description ? renderBullets(item.description) : ''}
          </div>
        `).join('')}
      </section>` : ''}

      ${nonEmptyPortfolio.length > 0 ? `
      <section class="section" data-section="portfolio">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Portfolio</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyPortfolio.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.name || ''}</strong>${item.url ? ` - <a href="${item.url}" style="color: #000;">${item.url}</a>` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyVolunteering.length > 0 ? `
      <section class="section" data-section="volunteering">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Volunteering</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyVolunteering.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.role || ''}</strong>${item.organization ? ` at ${item.organization}` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyMilitaryService.length > 0 ? `
      <section class="section" data-section="militaryService">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Military Service</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyMilitaryService.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.branch || ''}</strong>${item.rank ? ` - ${item.rank}` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyTeachingExperience.length > 0 ? `
      <section class="section" data-section="teachingExperience">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Teaching Experience</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyTeachingExperience.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.subjectCourseTaught || item.title || ''}</strong>${item.institution ? ` at ${item.institution}` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyMentorshipExperience.length > 0 ? `
      <section class="section" data-section="mentorshipExperience">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Mentorship Experience</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyMentorshipExperience.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.mentorshipArea || ''}</strong>${item.organizationPlatform ? ` at ${item.organizationPlatform}` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyResearchGrants.length > 0 ? `
      <section class="section" data-section="researchGrants">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Research Grants</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyResearchGrants.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.title || ''}</strong>${item.agency ? ` - ${item.agency}` : ''}${item.year ? ` (${item.year})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyTestScores.length > 0 ? `
      <section class="section" data-section="testScores">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Test Scores</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyTestScores.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.testName || ''}</strong> - Score: ${item.score || ''}${item.year ? ` (${item.year})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyPublications.length > 0 ? `
      <section class="section" data-section="publications">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Publications</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyPublications.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.title || ''}</strong>${item.journalPublisher ? ` - ${item.journalPublisher}` : ''}${item.year ? ` (${item.year})` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyPatents.length > 0 ? `
      <section class="section" data-section="patents">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Patents</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyPatents.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.title || ''}</strong>${item.patentNumber ? ` - ${item.patentNumber}` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptyReferences.length > 0 ? `
      <section class="section" data-section="references">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">References</h2>
        </div>
        <ul class="simple-list">
          ${nonEmptyReferences.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.name || ''}</strong>${item.designationRelationship ? ` - ${item.designationRelationship}` : ''}</li>`).join('')}
        </ul>
      </section>` : ''}

      ${nonEmptySocialProfiles.length > 0 ? `
      <section class="section" data-section="socialProfiles">
        <div class="section-header">
          <span class="section-dot">●</span>
          <h2 class="section-title">Social Profiles</h2>
        </div>
        <ul class="social-list">
          ${nonEmptySocialProfiles.map((item: any, idx: number) => `<li data-index="${idx}"><strong>${item.platform || 'Profile'}:</strong> <a href="${item.url || ''}" target="_blank">${item.url || ''}</a></li>`).join('')}
        </ul>
      </section>` : ''}
    </body>
    </html>
  `;
}