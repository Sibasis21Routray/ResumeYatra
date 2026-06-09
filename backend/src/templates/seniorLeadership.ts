export function buildSeniorLeadershipTemplate(data: any, theme?: any): string {
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

  const defaultTheme = {
    headerBg: "#000000",
    headerText: "#ffffff",
    sidebarBg: "#f3f4f6",
    underline: "#000000",
    dateBg: "#f3f4f6",
    dateText: "#9ca3af",
    textMain: "#1f2937",
    textLight: "#4b5563"
  };

  const currentTheme = { ...defaultTheme, ...(theme || {}) };
  const primaryColor = currentTheme.primary || currentTheme.headerBg || "#000000";
  const baseFontSize = data?.formatting?.bodyFontSize || data?.fontSize || 10;
  const userFontFamily = data?.formatting?.fontFamily || data?.fontFamily || "'Inter', 'Helvetica', 'Arial', sans-serif";
  const nameFontSize = Math.round(baseFontSize * 2.6);
  const sectionTitleSize = Math.round(baseFontSize * 1.1);

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
    if (description.includes('<ul>') || description.includes('<li>') || description.includes('<div>')) {
      return `<div class="description-html">${description}</div>`;
    }
    const lines = description.split("\n").filter(line => line.trim());
    if (lines.length === 0) return "";
    return `<ul class="bullet-list">${lines.map((l: any) => `<li>${l.trim()}</li>`).join("")}</ul>`;
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
          color: ${currentTheme.textMain};
          line-height: 1.4;
          background: white;
          font-size: ${baseFontSize}px;
        }

        /* Black Header Block */
        .header-container {
          background: ${primaryColor};
          color: #ffffff;
          text-align: center;
          padding: 35px 20px;
        }
        .name { 
          font-size: ${nameFontSize}px; 
          font-weight: 800; 
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 15px;
          color: #ffffff;
        }
        .contact-info {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          font-size: ${baseFontSize}px;
          margin-bottom: 12px;
        }
        .contact-info span { font-weight: 400; color: #ffffff; }
        .contact-info b { color: #ffffff; margin-right: 4px; }
        .linkedin-link { 
          color: #ffffff; 
          text-decoration: none; 
          font-weight: 500;
          opacity: 0.9;
        }

        /* Layout Grid - Full height sidebar */
        .resume-body {
          display: grid;
          grid-template-columns: 32% 1fr;
          gap: 0;
          min-height: calc(100vh - 180px);
        }

        /* Left Column - Full sidebar background coverage */
        .left-col {
          background: #f3f4f6;
          padding: 30px 25px;
          height: 100%;
        }

        /* Right Column */
        .right-col {
          padding: 30px 40px;
          background: white;
        }

        /* Section Styling - NO square box, just black underline */
        .section { margin-bottom: 28px; }
        .section-header {
          border-bottom: 2px solid ${primaryColor};
          padding-bottom: 8px;
          margin-bottom: 15px;
        }
        .section-title {
          font-size: ${sectionTitleSize}px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${primaryColor};
        }

        /* Sidebar Content (Left) */
        .summary-text { 
          text-align: justify; 
          color: #1f2937; 
          line-height: 1.6;
          font-size: ${baseFontSize}px;
        }
        .side-list { 
          list-style: none; 
          padding-left: 0;
        }
        .side-list li { 
          display: flex; 
          align-items: flex-start; 
          margin-bottom: 8px; 
          font-weight: 500;
          color: #1f2937;
          font-size: ${baseFontSize}px;
        }
        .side-list li::before {
          content: "•";
          margin-right: 10px;
          font-weight: 900;
          color: ${primaryColor};
        }

        /* Experience Content (Right) */
        .exp-item { margin-bottom: 22px; }
        .exp-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 4px; 
          flex-wrap: wrap; 
          gap: 8px; 
        }
        .company-name { 
          font-weight: 800; 
          font-size: ${baseFontSize + 1}px; 
          color: ${primaryColor}; 
        }
        .date-pill {
          background: #f3f4f6;
          padding: 3px 12px;
          border-radius: 4px;
          font-size: ${baseFontSize - 1}px;
          color: #6b7280;
          font-weight: 600;
        }
        .job-title { 
          font-style: italic; 
          color: #6b7280; 
          margin-bottom: 8px; 
          display: block; 
          font-weight: 500;
          font-size: ${baseFontSize}px;
        }
        
        .bullet-list { 
          list-style: none; 
          padding-left: 0; 
          margin-top: 6px;
        }
        .bullet-list li { 
          position: relative; 
          padding-left: 15px; 
          margin-bottom: 5px; 
          color: #4b5563; 
          text-align: justify;
          line-height: 1.5;
          font-size: ${baseFontSize}px;
        }
        .bullet-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #9ca3af;
        }
        
        .description-html ul, .description-html ol {
          list-style: none;
          padding-left: 0;
          margin: 5px 0;
        }
        .description-html li {
          position: relative;
          padding-left: 15px;
          margin-bottom: 5px;
          color: #4b5563;
          font-size: ${baseFontSize}px;
          list-style: none;
        }
        .description-html li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #9ca3af;
        }

        /* Education Details */
        .edu-item { margin-bottom: 14px; }
        .edu-name { 
          font-weight: 700; 
          display: block; 
          margin-bottom: 3px; 
          color: ${primaryColor};
          font-size: ${baseFontSize}px;
        }
        .edu-meta { 
          color: #6b7280; 
          font-size: ${baseFontSize - 1}px; 
          padding-left: 0;
          line-height: 1.4;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          margin-bottom: 10px;
          font-size: ${baseFontSize}px;
          color: #1f2937;
        }
        .contact-item {
  width: 100%;
  word-break: break-all;
  overflow-wrap: break-word;
  white-space: normal;
}
          .skill-list {
            margin-left: 20px;
          }

        @media print {
          .header-container { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: #000000 !important; }
          .left-col { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: #f3f4f6 !important; }
          .date-pill { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: #f3f4f6 !important; }
          .section-header { border-bottom: 2px solid #000000 !important; }
        }
      </style>
    </head>
    <body>
      <div class="header-container" data-section="personal">
        <h1 class="name">${personal.name || 'YOUR NAME'}</h1>
        <div class="contact-info">
          ${personal.phone ? `<span><b>Ph.</b> ${personal.phone}</span>` : ''}
          ${personal.alternatePhone ? `<span><b>Alt Phone</b> ${personal.alternatePhone}</span>` : ''}
          ${personal.email ? `<span><b>Email</b> ${personal.email}</span>` : ''}
          ${personal.location ? `<span><b>Location</b> ${personal.location}</span>` : ''}
          ${personal.dob ? `<span><b>DOB</b> ${personal.dob}</span>` : ''}
          ${personal.gender ? `<span><b>Gender</b> ${personal.gender}</span>` : ''}
        </div>
        ${linkedIn ? `<div><a class="linkedin-link" href="${linkedIn}"><b>LinkedIn:</b> ${linkedIn.replace(/^https?:\/\//, '')}</a></div>` : ''}
      </div>

      <div class="resume-body">
        <div class="left-col">
          ${(personal.phone || personal.email || personal.location || personal.dob || personal.gender) ? `
          <section class="section" data-section="personal">
            <div class="section-header">
              <h2 class="section-title">Contact</h2>
            </div>
            <div>
              ${personal.phone ? `<div class="contact-item">${personal.phone}</div>` : ''}
              ${personal.alternatePhone ? `<div class="contact-item">${personal.alternatePhone} (Alt)</div>` : ''}
              ${personal.email ? `<div class="contact-item">${personal.email}</div>` : ''}
              ${personal.location ? `<div class="contact-item">${personal.location}</div>` : ''}
              ${personal.dob ? `<div class="contact-item">${personal.dob}</div>` : ''}
              ${personal.gender ? `<div class="contact-item">${personal.gender}</div>` : ''}
            </div>
          </section>
          ` : ''}

          ${summary || careerObjective ? `
          <section class="section" data-section="summary">
            <div class="section-header">
              <h2 class="section-title">Profile Summary</h2>
            </div>
            <p class="summary-text">${summary || careerObjective}</p>
          </section>
          ` : ''}

          ${skillArray.length > 0 ? `
          <section class="section" data-section="skills">
            <div class="section-header">
              <h2 class="section-title">Skills</h2>
            </div>
              <div class="skill-list  ">
                ${skillArray.map((skill: any, idx: number) => `<li data-index="${idx}">${skill}</li>`).join('')}
              </div>
           
          </section>
          ` : ''}

          <!-- Core Competencies Section -->
${coreCompArray.length > 0 ? `
<section class="section" data-section="coreCompetencies">
  <div class="section-header">
    <h2 class="section-title">Core Competencies</h2>
  </div>
  <ul class="skill-list">
    ${coreCompArray.map((comp: any, idx: number) => `<li data-index="${idx}">${comp}</li>`).join('')}
  </ul>
</section>
` : ''}

          ${nonEmptyToolsTechnologies.length > 0 ? `
          <section class="section" data-section="toolsTechnologies">
            <div class="section-header">
              <h2 class="section-title">Tools & Technologies</h2>
            </div>
            <ul class="side-list">
              ${nonEmptyToolsTechnologies.map((item: any, idx: number) => `<li data-index="${idx}">${item.name || ''}${item.proficiency ? ` (${item.proficiency})` : ''}</li>`).join('')}
            </ul>
          </section>
          ` : ''}

          ${nonEmptyCertifications.length > 0 ? `
          <section class="section" data-section="certifications">
            <div class="section-header">
              <h2 class="section-title">Certifications</h2>
            </div>
            <ul class="side-list">
              ${nonEmptyCertifications.map((cert: any, idx: number) => `<li data-index="${idx}">${cert.name || ''}${cert.issuer ? ` - ${cert.issuer}` : ''}</li>`).join('')}
            </ul>
          </section>
          ` : ''}

          ${nonEmptyEducation.length > 0 ? `
          <section class="section" data-section="education">
            <div class="section-header">
              <h2 class="section-title">Education</h2>
            </div>
            ${nonEmptyEducation.map((edu: any, idx: number) => `<div class="edu-item" data-index="${idx}">
                <div class="edu-name">${edu.degree || edu.course || ''}${edu.field ? ` in ${edu.field}` : ''}</div>
                <div class="edu-meta">
                  ${edu.school || edu.university || ''}
                  ${edu.graduationDate || edu.endDate ? ` | ${edu.graduationDate || edu.endDate}` : ''}
                  ${edu.grade ? ` | ${edu.grade}` : ''}
                </div>
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyLanguages.length > 0 ? `
          <section class="section" data-section="languages">
            <div class="section-header">
              <h2 class="section-title">Languages</h2>
            </div>
            <ul class="side-list">
              ${nonEmptyLanguages.map((lang: any, idx: number) => `<li data-index="${idx}">${lang.language || lang}${lang.proficiency ? ` - ${lang.proficiency}` : ''}</li>`).join('')}
            </ul>
          </section>
          ` : ''}

          ${nonEmptyHobbies.length > 0 ? `
          <section class="section" data-section="hobbies">
            <div class="section-header">
              <h2 class="section-title">Hobbies</h2>
            </div>
            <ul class="side-list">
              ${nonEmptyHobbies.map((hobby: any, idx: number) => `<li data-index="${idx}">${typeof hobby === "string" ? hobby : hobby}</li>`).join('')}
            </ul>
          </section>
          ` : ''}

          ${nonEmptySocialProfiles.length > 0 ? `
          <section class="section" data-section="socialProfiles">
            <div class="section-header">
              <h2 class="section-title">Social Profiles</h2>
            </div>
            <ul class="side-list">
              ${nonEmptySocialProfiles.map((item: any, idx: number) => `<li data-index="${idx}"><a href="${item.url}" style="color: #000; text-decoration: none;">${item.platform || 'Profile'}</a></li>`).join('')}
            </ul>
          </section>
          ` : ''}
        </div>

        <div class="right-col">
          ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
          <section class="section" data-section="availabilityWorkAuth">
            <div class="section-header">
              <h2 class="section-title">Availability & Work Authorization</h2>
            </div>
            <div class="info-text">
              ${availabilityWorkAuth.availabilityNoticePeriod ? `<p><strong>Notice Period:</strong> ${availabilityWorkAuth.availabilityNoticePeriod}</p>` : ''}
              ${availabilityWorkAuth.workAuthorizationStatus ? `<p><strong>Work Authorization:</strong> ${availabilityWorkAuth.workAuthorizationStatus}</p>` : ''}
              ${availabilityWorkAuth.preferredLocation ? `<p><strong>Preferred Location:</strong> ${availabilityWorkAuth.preferredLocation}</p>` : ''}
            </div>
          </section>
          ` : ''}

          ${nonEmptyExperience.length > 0 ? `
          <section class="section" data-section="experience">
            <div class="section-header">
              <h2 class="section-title">Work Experience</h2>
            </div>
            ${nonEmptyExperience.map((exp: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${exp.company || ''}</span>
                  <span class="date-pill">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                </div>
                <span class="job-title">${exp.title || ''}${exp.location ? ` | ${exp.location}` : ''}</span>
                ${exp.description ? renderBullets(exp.description) : ''}
                ${exp.achievements ? `<p class="info-text"><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyProjects.length > 0 ? `
          <section class="section" data-section="projects">
            <div class="section-header">
              <h2 class="section-title">Projects</h2>
            </div>
            ${nonEmptyProjects.map((project: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${project.name || project.title || ''}</span>
                </div>
                <span class="job-title">${project.role ? `Role: ${project.role}` : ''}${project.duration ? ` | ${project.duration}` : ''}</span>
                ${project.description ? renderBullets(project.description) : ''}
                ${project.technologies ? `<p class="info-text"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyInternships.length > 0 ? `
          <section class="section" data-section="internships">
            <div class="section-header">
              <h2 class="section-title">Internships</h2>
            </div>
            ${nonEmptyInternships.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.company || ''}</span>
                  <span class="date-pill">${item.duration || formatDateRange(item.startDate, item.endDate)}</span>
                </div>
                <span class="job-title">${item.title || ''}</span>
                ${item.description ? renderBullets(item.description) : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyAcademicProjects.length > 0 ? `
          <section class="section" data-section="academicProjects">
            <div class="section-header">
              <h2 class="section-title">Academic Projects</h2>
            </div>
            ${nonEmptyAcademicProjects.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.name || item.title || ''}</span>
                </div>
                <span class="job-title">${item.institution || ''}${item.duration ? ` | ${item.duration}` : ''}</span>
                ${item.description ? renderBullets(item.description) : ''}
                ${item.technologies ? `<p class="info-text"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyTrainingPrograms.length > 0 ? `
          <section class="section" data-section="trainingPrograms">
            <div class="section-header">
              <h2 class="section-title">Training Programs</h2>
            </div>
            ${nonEmptyTrainingPrograms.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.name || ''}</span>
                  <span class="date-pill">${item.completionDate || ''}</span>
                </div>
                <span class="job-title">${item.provider || item.organization || ''}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyLeadershipPositions.length > 0 ? `
          <section class="section" data-section="leadershipPositions">
            <div class="section-header">
              <h2 class="section-title">Leadership Positions</h2>
            </div>
            ${nonEmptyLeadershipPositions.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.position || item.title || ''}</span>
                </div>
                <span class="job-title">${item.organization || ''}${formatDateRange(item.startDate, item.endDate) ? ` | ${formatDateRange(item.startDate, item.endDate)}` : ''}</span>
                ${item.description ? renderBullets(item.description) : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyCoCurricular.length > 0 ? `
          <section class="section" data-section="coCurricular">
            <div class="section-header">
              <h2 class="section-title">Co-curricular Activities</h2>
            </div>
            ${nonEmptyCoCurricular.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.activity || ''}</span>
                </div>
                <span class="job-title">${item.role ? `Role: ${item.role}` : ''}${item.year ? ` | ${item.year}` : ''}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyExtracurricular.length > 0 ? `
          <section class="section" data-section="extracurricular">
            <div class="section-header">
              <h2 class="section-title">Extracurricular Activities</h2>
            </div>
            ${nonEmptyExtracurricular.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.activity || ''}</span>
                </div>
                <span class="job-title">${item.role ? `Role: ${item.role}` : ''}${item.year ? ` | ${item.year}` : ''}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyScholarships.length > 0 ? `
          <section class="section" data-section="scholarships">
            <div class="section-header">
              <h2 class="section-title">Scholarships</h2>
            </div>
            ${nonEmptyScholarships.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.name || ''}</span>
                  <span class="date-pill">${item.year || ''}</span>
                </div>
                <span class="job-title">${item.provider || item.organization || ''}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyAwards.length > 0 ? `
          <section class="section" data-section="awards">
            <div class="section-header">
              <h2 class="section-title">Awards</h2>
            </div>
            ${nonEmptyAwards.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.title || ''}</span>
                  <span class="date-pill">${item.year || item.issueYear || ''}</span>
                </div>
                <span class="job-title">${item.organization || ''}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptySpeakingEngagements.length > 0 ? `
          <section class="section" data-section="speakingEngagements">
            <div class="section-header">
              <h2 class="section-title">Speaking Engagements</h2>
            </div>
            ${nonEmptySpeakingEngagements.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.topic || ''}</span>
                  <span class="date-pill">${item.date || ''}</span>
                </div>
                <span class="job-title">${item.eventName || ''}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyMemberships.length > 0 ? `
          <section class="section" data-section="memberships">
            <div class="section-header">
              <h2 class="section-title">Memberships</h2>
            </div>
            ${nonEmptyMemberships.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.membershipName || ''}</span>
                </div>
                <span class="job-title">${item.organizationName || item.organization || ''}${item.year ? ` | ${item.year}` : ''}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyWorkshops.length > 0 ? `
          <section class="section" data-section="workshops">
            <div class="section-header">
              <h2 class="section-title">Workshops</h2>
            </div>
            ${nonEmptyWorkshops.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.programTitle || item.title || ''}</span>
                </div>
                <span class="job-title">${item.conductedBy || ''}${item.year ? ` | ${item.year}` : ''}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyClientProjects.length > 0 ? `
          <section class="section" data-section="clientProjects">
            <div class="section-header">
              <h2 class="section-title">Client Projects</h2>
            </div>
            ${nonEmptyClientProjects.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.name || ''}</span>
                </div>
                <span class="job-title">${item.clientOrganization || ''}${item.role ? ` - ${item.role}` : ''}</span>
                ${item.description ? renderBullets(item.description) : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyPortfolio.length > 0 ? `
          <section class="section" data-section="portfolio">
            <div class="section-header">
              <h2 class="section-title">Portfolio</h2>
            </div>
            ${nonEmptyPortfolio.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.name || ''}</span>
                </div>
                <span class="job-title">${item.type || ''}${item.platform ? ` on ${item.platform}` : ''}</span>
                ${item.url ? `<p><a href="${item.url}" style="color: #000;">${item.url}</a></p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyVolunteering.length > 0 ? `
          <section class="section" data-section="volunteering">
            <div class="section-header">
              <h2 class="section-title">Volunteering</h2>
            </div>
            ${nonEmptyVolunteering.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.role || ''}</span>
                </div>
                <span class="job-title">${item.organization || ''}${item.duration ? ` | ${item.duration}` : ''}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyMilitaryService.length > 0 ? `
          <section class="section" data-section="militaryService">
            <div class="section-header">
              <h2 class="section-title">Military Service</h2>
            </div>
            ${nonEmptyMilitaryService.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.branch || ''}${item.rank ? ` - ${item.rank}` : ''}</span>
                </div>
                <span class="job-title">${item.duration || formatDateRange(item.startDate, item.endDate)}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyMethodologies.length > 0 ? `
          <section class="section" data-section="methodologies">
            <div class="section-header">
              <h2 class="section-title">Methodologies</h2>
            </div>
            ${nonEmptyMethodologies.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.name || ''}</span>
                </div>
                <span class="job-title">${item.certification ? `Certified: ${item.certification}` : ''}</span>
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyIndustryExpertise.length > 0 ? `
          <section class="section" data-section="industryExpertise">
            <div class="section-header">
              <h2 class="section-title">Industry Expertise</h2>
            </div>
            ${nonEmptyIndustryExpertise.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.industry || ''}</span>
                </div>
                <span class="job-title">${item.domainArea || ''}</span>
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyTeachingExperience.length > 0 ? `
          <section class="section" data-section="teachingExperience">
            <div class="section-header">
              <h2 class="section-title">Teaching Experience</h2>
            </div>
            ${nonEmptyTeachingExperience.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.subjectCourseTaught || item.title || ''}</span>
                </div>
                <span class="job-title">${item.institution || ''}${item.duration ? ` | ${item.duration}` : ''}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyMentorshipExperience.length > 0 ? `
          <section class="section" data-section="mentorshipExperience">
            <div class="section-header">
              <h2 class="section-title">Mentorship Experience</h2>
            </div>
            ${nonEmptyMentorshipExperience.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.mentorshipArea || ''}</span>
                </div>
                <span class="job-title">${item.organizationPlatform || ''}${item.duration ? ` | ${item.duration}` : ''}</span>
                ${item.description ? `<p class="summary-text">${item.description}</p>` : ''}
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyResearchGrants.length > 0 ? `
          <section class="section" data-section="researchGrants">
            <div class="section-header">
              <h2 class="section-title">Research Grants</h2>
            </div>
            ${nonEmptyResearchGrants.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.title || ''}</span>
                  <span class="date-pill">${item.year || ''}</span>
                </div>
                <span class="job-title">${item.agency || ''}${item.amount ? ` | ${item.amount}` : ''}</span>
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyTestScores.length > 0 ? `
          <section class="section" data-section="testScores">
            <div class="section-header">
              <h2 class="section-title">Test Scores</h2>
            </div>
            ${nonEmptyTestScores.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.testName || ''}</span>
                  <span class="date-pill">${item.year || ''}</span>
                </div>
                <span class="job-title">Score: ${item.score || ''}${item.percentileRank ? ` | Percentile: ${item.percentileRank}` : ''}</span>
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyPublications.length > 0 ? `
          <section class="section" data-section="publications">
            <div class="section-header">
              <h2 class="section-title">Publications</h2>
            </div>
            ${nonEmptyPublications.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.title || ''}</span>
                  <span class="date-pill">${item.year || ''}</span>
                </div>
                <span class="job-title">${item.journalPublisher || ''}${item.publicationType ? ` (${item.publicationType})` : ''}</span>
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyPatents.length > 0 ? `
          <section class="section" data-section="patents">
            <div class="section-header">
              <h2 class="section-title">Patents</h2>
            </div>
            ${nonEmptyPatents.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.title || ''}</span>
                  <span class="date-pill">${item.year || ''}</span>
                </div>
                <span class="job-title">${item.patentNumber ? `Patent #: ${item.patentNumber}` : ''}</span>
              </div>
            `).join('')}
          </section>
          ` : ''}

          ${nonEmptyReferences.length > 0 ? `
          <section class="section" data-section="references">
            <div class="section-header">
              <h2 class="section-title">References</h2>
            </div>
            ${nonEmptyReferences.map((item: any, idx: number) => `<div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.name || ''}</span>
                </div>
                <span class="job-title">${item.designationRelationship || ''}${item.organization ? ` at ${item.organization}` : ''}</span>
              </div>
            `).join('')}
          </section>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
}