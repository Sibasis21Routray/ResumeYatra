export function buildSaanviPatelTemplate(data: any, theme?: any): string {
  const {
    personal = {},
    summary = "",
    careerObjective = "",
    experience = [],
    projects = [],
    education = [],
    skills = [],
    languages = [],
    hobbies = [],
    certifications = [],
    awards = [],
    speakingEngagements = [],
    memberships = [],
    workshops = [],
    socialLinks = [],
    customSections = [],
    
    // Additional sections from your data
    internships = [],
    trainingPrograms = [],
    academicProjects = [],
    leadershipPositions = [],
    coCurricular = [],
    extracurricular = [],
    scholarships = [],
    clientProjects = [],
    portfolio = [],
    volunteering = [],
    militaryService = [],
    toolTechnologies = [],
    methodologies = [],
    industryExpertise = [],
    references = [],
    socialProfiles = [],
    teachingExperience = [],
    mentorshipExperience = [],
    researchGrants = [],
    testScores = [],
    publications = [],
    patents = [],
    professionalContext = {},
    toolsTechnologies = []
  } = data;

  const primaryColor = theme?.primaryColor || theme?.primary || "#1a3a52";
  const accentColor = theme?.accentColor || theme?.secondary || "#8b9ca3";
  const textGray = "#4a5568";
  const darkGray = "#333333";

  const bodyFontSize = data.formatting?.bodyFontSize || 10.5;
  const fontFamily =
    data.formatting?.fontFamily ||
    "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif";

  // Helper function to format arrays and objects
  const formatValue = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  // Helper to check if section has data
  const hasData = (section: any): boolean => {
    if (!section) return false;
    if (Array.isArray(section)) return section.length > 0;
    if (typeof section === "object") return Object.keys(section).length > 0;
    return !!section;
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: ${fontFamily};
          background-color: white;
          color: ${darkGray};
          font-size: ${bodyFontSize}pt;
          line-height: 1.6;
          padding: 40px;
        }

        .page-border {
          border: 1px solid #e2e8f0;
          padding: 35px;
          min-height: 11in;
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }

        .top-accent {
          height: 40px;
          background-color: #d9e2ec;
          margin: -35px -35px 35px -35px;
          width: calc(100% + 70px);
        }

        .header { margin-bottom: 30px; }

        .name {
          font-size: 28pt;
          font-weight: 700;
          color: ${primaryColor};
          text-transform: uppercase;
          letter-spacing: 2px;
          line-height: 1.3;
          margin-bottom: 8px;
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        }

        .job-title {
          font-size: ${bodyFontSize + 3}pt;
          color: ${accentColor};
          margin-top: 5px;
          line-height: 1.4;
        }

        .section { 
          margin-bottom: 25px; 
          page-break-inside: avoid;
        }

        .section-title {
          font-size: ${bodyFontSize + 1}pt;
          font-weight: 700;
          color: ${primaryColor};
          text-transform: uppercase;
          border-bottom: 2px solid ${accentColor};
          padding-bottom: 6px;
          margin-bottom: 15px;
          display: block;
          line-height: 1.4;
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        }

        .section-subtitle {
          font-size: ${bodyFontSize}pt;
          font-weight: 600;
          color: ${primaryColor};
          margin: 10px 0 5px 0;
        }

        .entry { 
          margin-bottom: 18px; 
          page-break-inside: avoid;
        }

        .entry-row {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          color: ${darkGray};
          flex-wrap: wrap;
          gap: 5px;
          line-height: 1.4;
        }

        .entry-subrow {
          font-style: italic;
          color: ${textGray};
          font-size: ${bodyFontSize - 0.5}pt;
          margin-bottom: 6px;
          line-height: 1.5;
        }

        .entry-detail {
          color: ${textGray};
          font-size: ${bodyFontSize - 0.5}pt;
          line-height: 1.5;
        }

        .description {
          color: ${textGray};
          font-size: ${bodyFontSize - 0.5}pt;
          line-height: 1.7;
          margin-top: 8px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: ${bodyFontSize - 1}pt;
          color: ${textGray};
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .contact-item {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }

        .contact-item b {
          color: ${primaryColor};
          min-width: 70px;
          font-weight: 600;
        }

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
          grid-template-columns: 1fr 1fr;
          gap: 8px 30px;
        }

        .skills-list li {
          position: relative;
          padding-left: 18px;
          color: ${textGray};
          font-size: ${bodyFontSize - 0.5}pt;
          margin-bottom: 5px;
          line-height: 1.5;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .skills-list li::before {
          content: "-";
          position: absolute;
          left: 0;
          color: ${accentColor};
          font-weight: bold;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .badge {
          display: inline-block;
          background-color: ${accentColor}20;
          color: ${primaryColor};
          padding: 2px 8px;
          border-radius: 12px;
          font-size: ${bodyFontSize - 1}pt;
          margin-right: 5px;
          margin-bottom: 5px;
        }

        .professional-context {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .context-item {
          display: flex;
          margin-bottom: 5px;
        }

        .context-label {
          font-weight: 600;
          min-width: 150px;
          color: ${primaryColor};
        }

        .entry-row span:first-child {
          flex: 1;
          min-width: 50%;
        }

        .entry-row span:last-child {
          white-space: nowrap;
        }

        .section-header {
          font-size: ${bodyFontSize + 1}pt;
          font-weight: 700;
          color: ${primaryColor};
          text-transform: uppercase;
          border-bottom: 2px solid ${accentColor};
          padding-bottom: 6px;
          margin-bottom: 15px;
          display: block;
          line-height: 1.4;
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        }

        @media print {
          body { 
            padding: 0; 
            font-size: 10pt;
          }
          .page-border { 
            border: none; 
            padding: 20mm;
            min-height: auto;
          }
          .top-accent {
            margin: -20mm -20mm 20mm -20mm;
            width: calc(100% + 40mm);
          }
        }
      </style>
    </head>
    <body>
      <div class="page-border">
        <div class="top-accent"></div>

        <header class="header">
          <h1 class="name">${personal.name || "SAANVI PATEL"}</h1>
          ${personal.jobTitle ? `<div class="job-title">${personal.jobTitle}</div>` : ""}
        </header>

        <!-- Personal Information Section -->
        <div class="section" data-section="personal">
          <div class="contact-info">
            ${personal.location || personal.country || personal.pinCode || personal.fullAddress
              ? `<div class="contact-item"><b>Address:</b> ${[
                  personal.location,
                  personal.country,
                  personal.pinCode,
                  personal.fullAddress,
                ]
                  .filter(Boolean)
                  .join(", ")}</div>`
              : ""}
            ${personal.phone ? `<div class="contact-item"><b>Phone:</b> ${personal.phone}</div>` : ""}
            ${personal.email ? `<div class="contact-item"><b>Email:</b> ${personal.email}</div>` : ""}
            ${personal.fathersName ? `<div class="contact-item"><b>Father's Name:</b> ${personal.fathersName}</div>` : ""}
            ${personal.dob ? `<div class="contact-item"><b>Date of Birth:</b> ${personal.dob}</div>` : ""}
            ${personal.gender ? `<div class="contact-item"><b>Gender:</b> ${personal.gender}</div>` : ""}
            ${personal.maritalStatus ? `<div class="contact-item"><b>Marital Status:</b> ${personal.maritalStatus}</div>` : ""}
            ${personal.nationality ? `<div class="contact-item"><b>Nationality:</b> ${personal.nationality}</div>` : ""}
            ${personal.linkedinUrl ? `<div class="contact-item"><b>LinkedIn:</b> <a href="${personal.linkedinUrl}" target="_blank">${personal.linkedinUrl}</a></div>` : ""}
            ${personal.githubUrl ? `<div class="contact-item"><b>GitHub:</b> <a href="${personal.githubUrl}" target="_blank">${personal.githubUrl}</a></div>` : ""}
            ${personal.portfolioUrl ? `<div class="contact-item"><b>Portfolio:</b> <a href="${personal.portfolioUrl}" target="_blank">${personal.portfolioUrl}</a></div>` : ""}
          </div>
        </div>

        <!-- Professional Context Section -->
        ${hasData(professionalContext) ? `
          <div class="section" data-section="professionalContext">
            <h2 class="section-title" data-section="professionalContext">Professional Context</h2>
            <div class="professional-context">
              ${professionalContext.totalExperience ? `<div class="context-item"><span class="context-label">Total Experience:</span> ${professionalContext.totalExperience}</div>` : ""}
              ${professionalContext.teamSize ? `<div class="context-item"><span class="context-label">Team Size:</span> ${professionalContext.teamSize}</div>` : ""}
              ${professionalContext.industry ? `<div class="context-item"><span class="context-label">Industry:</span> ${professionalContext.industry}</div>` : ""}
              ${professionalContext.functionalDomain ? `<div class="context-item"><span class="context-label">Functional Domain:</span> ${professionalContext.functionalDomain}</div>` : ""}
              ${professionalContext.geographicScope ? `<div class="context-item"><span class="context-label">Geographic Scope:</span> ${professionalContext.geographicScope}</div>` : ""}
              ${professionalContext.revenueResponsibility ? `<div class="context-item"><span class="context-label">Revenue Responsibility:</span> ${professionalContext.revenueResponsibility}</div>` : ""}
            </div>
          </div>
        ` : ""}

        <!-- Career Objective -->
        ${careerObjective ? `
          <div class="section" data-section="careerObjective">
            <h2 class="section-title" data-section="careerObjective">Career Objective</h2>
            <div class="description">${careerObjective}</div>
          </div>
        ` : ""}

        <!-- Summary -->
        ${summary ? `
          <div class="section" data-section="summary">
            <h2 class="section-title" data-section="summary">Professional Summary</h2>
            <div class="description">${summary}</div>
          </div>
        ` : ""}

        <!-- Work Experience -->
        ${experience.length > 0 ? `
          <div class="section" data-section="experience">
            <h2 class="section-title" data-section="experience">Work Experience</h2>
            ${experience.map((exp: any, index: number) => `
              <div class="entry" data-section="experience" data-index="${index}">
                <div class="entry-row">
                  <span>${exp.title || ""}</span>
                  <span>${exp.startDate || ""} - ${exp.endDate || (exp.isCurrent ? "Present" : "")}</span>
                </div>
                <div class="entry-subrow">${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}</div>
                ${exp.description ? `<div class="description">${exp.description}</div>` : ""}
                ${exp.achievements ? `<div class="description">${exp.achievements}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Projects -->
        ${projects.length > 0 ? `
          <div class="section" data-section="projects">
            <h2 class="section-title" data-section="projects">Projects</h2>
            ${projects.map((project: any, index: number) => `
              <div class="entry" data-section="projects" data-index="${index}">
                <div class="entry-row">
                  <span>${project.name || ""}</span>
                </div>
                ${project.technologies ? `<div class="entry-detail"><b>Technologies:</b> ${project.technologies}</div>` : ""}
                ${project.url ? `<div class="entry-detail"><b>URL:</b> <a href="${project.url}" target="_blank">${project.url}</a></div>` : ""}
                ${project.description ? `<div class="description">${project.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Education -->
        ${education.length > 0 ? `
          <div class="section" data-section="education">
            <h2 class="section-title" data-section="education">Education</h2>
            ${education.map((edu: any, index: number) => `
              <div class="entry" data-section="education" data-index="${index}">
                <div class="entry-row">
                  <span>${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</span>
                  <span>${edu.graduationDate || ""}</span>
                </div>
                <div class="entry-subrow">${edu.school || ""}${edu.location ? `, ${edu.location}` : ""}${edu.cgpa ? ` • CGPA: ${edu.cgpa}` : ""}</div>
                ${edu.description ? `<div class="description">${edu.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Internships -->
        ${internships.length > 0 ? `
          <div class="section" data-section="internships">
            <h2 class="section-title" data-section="internships">Internships</h2>
            ${internships.map((item: any, index: number) => `
              <div class="entry" data-section="internships" data-index="${index}">
                <div class="entry-row">
                  <span>${item.title || ""}</span>
                  <span>${item.startDate || ""} - ${item.endDate || ""}</span>
                </div>
                <div class="entry-subrow">${item.company || ""}${item.location ? `, ${item.location}` : ""}</div>
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Academic Projects -->
        ${academicProjects.length > 0 ? `
          <div class="section" data-section="academicProjects">
            <h2 class="section-title" data-section="academicProjects">Academic Projects</h2>
            ${academicProjects.map((item: any, index: number) => `
              <div class="entry" data-section="academicProjects" data-index="${index}">
                <div class="entry-row">
                  <span>${item.name || item.title || ""}</span>
                  <span>${item.duration || ""}</span>
                </div>
                <div class="entry-subrow">${item.institution || ""}${item.course ? ` | ${item.course}` : ""}</div>
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
                ${item.technologies && item.technologies.length > 0 ? `
                  <div class="entry-detail"><b>Technologies:</b> ${
                    Array.isArray(item.technologies) ? item.technologies.join(", ") : item.technologies
                  }</div>
                ` : ""}
                ${item.url ? `<div class="entry-detail"><b>URL:</b> <a href="${item.url}" target="_blank">${item.url}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Leadership Positions -->
        ${leadershipPositions.length > 0 ? `
          <div class="section" data-section="leadershipPositions">
            <h2 class="section-title" data-section="leadershipPositions">Leadership & Positions</h2>
            ${leadershipPositions.map((item: any, index: number) => `
              <div class="entry" data-section="leadershipPositions" data-index="${index}">
                <div class="entry-row">
                  <span>${item.position || item.title || ""}</span>
                  <span>${item.startDate || ""} - ${item.endDate || ""}</span>
                </div>
                <div class="entry-subrow">${item.organization || ""}</div>
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Training Programs -->
        ${trainingPrograms.length > 0 ? `
          <div class="section" data-section="trainingPrograms">
            <h2 class="section-title" data-section="trainingPrograms">Training Programs</h2>
            ${trainingPrograms.map((item: any, index: number) => `
              <div class="entry" data-section="trainingPrograms" data-index="${index}">
                <div class="entry-row">
                  <span>${item.name || ""}</span>
                  <span>${item.completionDate || ""}</span>
                </div>
                <div class="entry-subrow">${item.provider || item.organization || ""}${item.duration ? ` | ${item.duration}` : ""}</div>
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Co-curricular Activities -->
        ${coCurricular.length > 0 ? `
          <div class="section" data-section="coCurricular">
            <h2 class="section-title" data-section="coCurricular">Co-curricular Activities</h2>
            ${coCurricular.map((item: any, index: number) => `
              <div class="entry" data-section="coCurricular" data-index="${index}">
                <div class="entry-row">
                  <span>${item.activity || ""}</span>
                  <span>${item.year || ""}</span>
                </div>
                ${item.role ? `<div class="entry-subrow">Role: ${item.role}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Extracurricular Activities -->
        ${extracurricular.length > 0 ? `
          <div class="section" data-section="extracurricular">
            <h2 class="section-title" data-section="extracurricular">Extracurricular Activities</h2>
            ${extracurricular.map((item: any, index: number) => `
              <div class="entry" data-section="extracurricular" data-index="${index}">
                <div class="entry-row">
                  <span>${item.activity || ""}</span>
                  <span>${item.year || ""}</span>
                </div>
                ${item.role ? `<div class="entry-subrow">Role: ${item.role}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Scholarships -->
        ${scholarships.length > 0 ? `
          <div class="section" data-section="scholarships">
            <h2 class="section-title" data-section="scholarships">Scholarships</h2>
            ${scholarships.map((item: any, index: number) => `
              <div class="entry" data-section="scholarships" data-index="${index}">
                <div class="entry-row">
                  <span>${item.name || ""}</span>
                  <span>${item.year || ""}</span>
                </div>
                <div class="entry-subrow">${item.provider || item.organization || ""}${item.amount ? ` | ${item.amount}` : ""}</div>
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Client Projects -->
        ${clientProjects.length > 0 ? `
          <div class="section" data-section="clientProjects">
            <h2 class="section-title" data-section="clientProjects">Client Projects</h2>
            ${clientProjects.map((item: any, index: number) => `
              <div class="entry" data-section="clientProjects" data-index="${index}">
                <div class="entry-row">
                  <span>${item.name || ""}</span>
                </div>
                ${item.role ? `<div class="entry-subrow">Role: ${item.role}</div>` : ""}
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Portfolio -->
        ${portfolio.length > 0 ? `
          <div class="section" data-section="portfolio">
            <h2 class="section-title" data-section="portfolio">Portfolio</h2>
            ${portfolio.map((item: any, index: number) => `
              <div class="entry" data-section="portfolio" data-index="${index}">
                <div class="entry-row">
                  <span>${item.name || ""}</span>
                </div>
                ${item.type ? `<div class="entry-detail"><b>Type:</b> ${item.type}</div>` : ""}
                ${item.platform ? `<div class="entry-detail"><b>Platform:</b> ${item.platform}</div>` : ""}
                ${item.url ? `<div class="entry-detail"><b>URL:</b> <a href="${item.url}" target="_blank">${item.url}</a></div>` : ""}
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Volunteering -->
        ${volunteering.length > 0 ? `
          <div class="section" data-section="volunteering">
            <h2 class="section-title" data-section="volunteering">Volunteering</h2>
            ${volunteering.map((item: any, index: number) => `
              <div class="entry" data-section="volunteering" data-index="${index}">
                <div class="entry-row">
                  <span>${item.organization || ""}</span>
                </div>
                ${item.role ? `<div class="entry-subrow">Role: ${item.role}</div>` : ""}
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Military Service -->
        ${militaryService.length > 0 ? `
          <div class="section" data-section="militaryService">
            <h2 class="section-title" data-section="militaryService">Military Service</h2>
            ${militaryService.map((item: any, index: number) => `
              <div class="entry" data-section="militaryService" data-index="${index}">
                <div class="entry-row">
                  <span>${item.branch || ""}</span>
                </div>
                ${item.rank ? `<div class="entry-subrow">Rank: ${item.rank}</div>` : ""}
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Teaching Experience -->
        ${teachingExperience.length > 0 ? `
          <div class="section" data-section="teachingExperience">
            <h2 class="section-title" data-section="teachingExperience">Teaching Experience</h2>
            ${teachingExperience.map((item: any, index: number) => `
              <div class="entry" data-section="teachingExperience" data-index="${index}">
                <div class="entry-row">
                  <span>${item.title || ""}</span>
                </div>
                <div class="entry-subrow">${item.institution || ""}</div>
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Mentorship Experience -->
        ${mentorshipExperience.length > 0 ? `
          <div class="section" data-section="mentorshipExperience">
            <h2 class="section-title" data-section="mentorshipExperience">Mentorship Experience</h2>
            ${mentorshipExperience.map((item: any, index: number) => `
              <div class="entry" data-section="mentorshipExperience" data-index="${index}">
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Research Grants -->
        ${researchGrants.length > 0 ? `
          <div class="section" data-section="researchGrants">
            <h2 class="section-title" data-section="researchGrants">Research Grants</h2>
            ${researchGrants.map((item: any, index: number) => `
              <div class="entry" data-section="researchGrants" data-index="${index}">
                <div class="entry-row">
                  <span>${item.title || ""}</span>
                </div>
                <div class="entry-subrow">${item.agency || ""}${item.amount ? ` | Amount: ${item.amount}` : ""}</div>
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Test Scores -->
        ${testScores.length > 0 ? `
          <div class="section" data-section="testScores">
            <h2 class="section-title" data-section="testScores">Test Scores</h2>
            ${testScores.map((item: any, index: number) => `
              <div class="entry" data-section="testScores" data-index="${index}">
                <div class="entry-row">
                  <span>${item.testName || ""}</span>
                  <span>${item.score || ""}</span>
                </div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Publications -->
        ${publications.length > 0 ? `
          <div class="section" data-section="publications">
            <h2 class="section-title" data-section="publications">Publications</h2>
            ${publications.map((item: any, index: number) => `
              <div class="entry" data-section="publications" data-index="${index}">
                <div class="entry-row">
                  <span>${item.title || ""}</span>
                </div>
                ${item.publisher ? `<div class="entry-subrow">${item.publisher}</div>` : ""}
                ${item.date ? `<div class="entry-detail">${item.date}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Patents -->
        ${patents.length > 0 ? `
          <div class="section" data-section="patents">
            <h2 class="section-title" data-section="patents">Patents</h2>
            ${patents.map((item: any, index: number) => `
              <div class="entry" data-section="patents" data-index="${index}">
                <div class="entry-row">
                  <span>${item.title || ""}</span>
                </div>
                <div class="entry-subrow">Patent #: ${item.patentNumber || ""} | Status: ${item.status || ""}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Skills -->
        ${(() => {
          if (typeof skills === "string" && skills.trim().length > 0) {
            return `
              <div class="section" data-section="skills">
                <h2 class="section-title" data-section="skills">Skills</h2>
                <div class="skills-list">${skills}</div>
              </div>
            `;
          } else if (skills && skills.length > 0) {
            return `
              <div class="section" data-section="skills">
                <h2 class="section-title" data-section="skills">Skills</h2>
                <ul class="skills-list">
                  ${skills.map((skill: string, index: number) => 
                    `<li data-section="skills" data-index="${index}">${skill}</li>`
                  ).join("")}
                </ul>
              </div>
            `;
          }
          return "";
        })()}

        <!-- Tools & Technologies -->
        ${toolsTechnologies && toolsTechnologies.length > 0 ? `
          <div class="section" data-section="toolsTechnologies">
            <h2 class="section-title" data-section="toolsTechnologies">Tools & Technologies</h2>
            <div class="grid-2">
              ${toolsTechnologies.map((item: any, index: number) => `
                <div class="entry" data-section="toolsTechnologies" data-index="${index}">
                  <div class="entry-row">
                    <span>${item.name || ""}</span>
                  </div>
                  ${item.category ? `<div class="entry-detail">Category: ${item.category}</div>` : ""}
                  ${item.proficiency ? `<div class="entry-detail">Proficiency: ${item.proficiency}</div>` : ""}
                  ${item.experienceDuration ? `<div class="entry-detail">Experience: ${item.experienceDuration}</div>` : ""}
                </div>
              `).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Methodologies -->
        ${methodologies.length > 0 ? `
          <div class="section" data-section="methodologies">
            <h2 class="section-title" data-section="methodologies">Methodologies</h2>
            <div class="skills-list">
              <ul>
                ${methodologies.map((item: any, index: number) => 
                  `<li data-section="methodologies" data-index="${index}">${item.name || item}</li>`
                ).join("")}
              </ul>
            </div>
          </div>
        ` : ""}

        <!-- Industry Expertise -->
        ${industryExpertise.length > 0 ? `
          <div class="section" data-section="industryExpertise">
            <h2 class="section-title" data-section="industryExpertise">Industry Expertise</h2>
            <div class="skills-list">
              <ul>
                ${industryExpertise.map((item: any, index: number) => 
                  `<li data-section="industryExpertise" data-index="${index}">${item.industry || item}</li>`
                ).join("")}
              </ul>
            </div>
          </div>
        ` : ""}

        <!-- Languages -->
        ${languages.length > 0 ? `
          <div class="section" data-section="languages">
            <h2 class="section-title" data-section="languages">Languages</h2>
            <div class="skills-list">
              <ul>
                ${languages.map((lang: any, index: number) => 
                  `<li data-section="languages" data-index="${index}">${
                    lang.language || lang
                  }${lang.level ? ` (${lang.level})` : ""}${lang.capability ? ` - ${lang.capability}` : ""}</li>`
                ).join("")}
              </ul>
            </div>
          </div>
        ` : ""}

        <!-- Hobbies -->
        ${hobbies.length > 0 ? `
          <div class="section" data-section="hobbies">
            <h2 class="section-title" data-section="hobbies">Hobbies & Interests</h2>
            <div class="skills-list">
              <ul>
                ${hobbies.map((hobby: any, index: number) => 
                  `<li data-section="hobbies" data-index="${index}">${hobby.hobby || hobby}</li>`
                ).join("")}
              </ul>
            </div>
          </div>
        ` : ""}

        <!-- Certifications -->
        ${certifications.length > 0 ? `
          <div class="section" data-section="certifications">
            <h2 class="section-title" data-section="certifications">Certifications</h2>
            ${certifications.map((cert: any, index: number) => `
              <div class="entry" style="margin-bottom: 8px;" data-section="certifications" data-index="${index}">
                <div class="entry-row">
                  <span>${cert.name || ""}</span>
                  <span>${cert.date || ""}</span>
                </div>
                <div class="entry-subrow">${cert.issuer || ""}</div>
                ${cert.url ? `<div class="entry-detail"><a href="${cert.url}" target="_blank">${cert.url}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Awards -->
        ${awards.length > 0 ? `
          <div class="section" data-section="awards">
            <h2 class="section-title" data-section="awards">Awards</h2>
            ${awards.map((award: any, index: number) => `
              <div class="entry" style="margin-bottom: 8px;" data-section="awards" data-index="${index}">
                <div class="entry-row">
                  <span>${award.title || ""}</span>
                  <span>${award.issueYear || award.year || ""}</span>
                </div>
                <div class="entry-subrow">${award.organization || award.issuer || ""}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Speaking Engagements -->
        ${speakingEngagements.length > 0 ? `
          <div class="section" data-section="speakingEngagements">
            <h2 class="section-title" data-section="speakingEngagements">Speaking Engagements</h2>
            ${speakingEngagements.map((item: any, index: number) => `
              <div class="entry" data-section="speakingEngagements" data-index="${index}">
                <div class="entry-row">
                  <span>${item.title || item.name || ""}</span>
                  <span>${item.date || item.year || ""}</span>
                </div>
                <div class="entry-subrow">${item.venue || item.organization || ""}</div>
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Memberships -->
        ${memberships.length > 0 ? `
          <div class="section" data-section="memberships">
            <h2 class="section-title" data-section="memberships">Memberships & Affiliations</h2>
            <div class="skills-list">
              <ul>
                ${memberships.map((item: any, index: number) => 
                  `<li data-section="memberships" data-index="${index}">${item.name || item}</li>`
                ).join("")}
              </ul>
            </div>
          </div>
        ` : ""}

        <!-- Workshops -->
        ${workshops.length > 0 ? `
          <div class="section" data-section="workshops">
            <h2 class="section-title" data-section="workshops">Workshops & Seminars</h2>
            ${workshops.map((item: any, index: number) => `
              <div class="entry" data-section="workshops" data-index="${index}">
                <div class="entry-row">
                  <span>${item.name || item.title || ""}</span>
                  <span>${item.date || item.year || ""}</span>
                </div>
                <div class="entry-subrow">${item.organizer || item.provider || ""}</div>
                ${item.description ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Social Links -->
        ${socialLinks.length > 0 ? `
          <div class="section" data-section="socialLinks">
            <h2 class="section-title" data-section="socialLinks">Social Links</h2>
            <div class="skills-list">
              <ul>
                ${socialLinks.map((item: any, index: number) => 
                  `<li data-section="socialLinks" data-index="${index}">${
                    item.urlText || item.platform || "Link"
                  }: <a href="${item.url || ""}" target="_blank">${item.url || ""}</a></li>`
                ).join("")}
              </ul>
            </div>
          </div>
        ` : ""}

        <!-- Social Profiles -->
        ${socialProfiles.length > 0 ? `
          <div class="section" data-section="socialProfiles">
            <h2 class="section-title" data-section="socialProfiles">Social Profiles</h2>
            <div class="skills-list">
              <ul>
                ${socialProfiles.map((item: any, index: number) => 
                  `<li data-section="socialProfiles" data-index="${index}">${
                    item.platform || "Profile"
                  }: <a href="${item.url || ""}" target="_blank">${item.url || ""}</a></li>`
                ).join("")}
              </ul>
            </div>
          </div>
        ` : ""}

        <!-- References -->
        ${references.length > 0 ? `
          <div class="section" data-section="references">
            <h2 class="section-title" data-section="references">References</h2>
            <div class="skills-list">
              <ul>
                ${references.map((item: any, index: number) => 
                  `<li data-section="references" data-index="${index}">${
                    item.name || item
                  }${item.relation ? ` - ${item.relation}` : ""}${item.contact ? ` (${item.contact})` : ""}</li>`
                ).join("")}
              </ul>
            </div>
          </div>
        ` : ""}

        <!-- Custom Sections -->
        ${customSections.length > 0 ? `
          <div class="section" data-section="customSections">
            <h2 class="section-title" data-section="customSections">Additional Information</h2>
            ${customSections.map((section: any, index: number) => `
              <div class="entry" data-section="customSections" data-index="${index}">
                <h3 class="section-subtitle">${section.heading || ""}</h3>
                ${section.entries && section.entries.map((entry: any, entryIndex: number) => `
                  <div class="entry" style="margin-left: 15px; margin-bottom: 12px;">
                    ${entry.title ? `<div class="entry-row"><span>${entry.title}</span></div>` : ""}
                    ${entry.organization ? `<div class="entry-subrow">${entry.organization}</div>` : ""}
                    ${entry.date ? `<div class="entry-detail">${entry.date}</div>` : ""}
                    ${entry.description ? `<div class="description">${entry.description}</div>` : ""}
                  </div>
                `).join("")}
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    </body>
    </html>
  `;
}