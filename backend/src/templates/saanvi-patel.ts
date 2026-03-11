export function buildSaanviPatelTemplate(data: any, theme?: any): string {
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

  const primaryColor = theme?.primaryColor || theme?.primary || "#1a3a52";
  const accentColor = theme?.accentColor || theme?.secondary || "#8b9ca3";
  const textGray = "#4a5568";
  const darkGray = "#333333";

  const bodyFontSize = data.fontSize || 16;
  const fontFamily = data.fontFamily || "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif";

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

  // Parse skills (handles HTML string)
  const parseSkills = (skills: any): string => {
    if (!skills) return "";
    if (typeof skills === "string") {
      if (skills.includes('<ul>') || skills.includes('<li>')) {
        return skills;
      }
      return `<ul>${skills.split(',').map(s => `<li>${s.trim()}</li>`).filter(s => s).join('')}</ul>`;
    }
    return "";
  };

  const skillsHtml = parseSkills(skills);

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
          font-size: ${bodyFontSize}px;
          line-height: 1.5;
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

        .header { 
          margin-bottom: 30px; 
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .header-left {
          flex: 1;
        }

        .header-right {
          text-align: right;
        }

        .name {
          font-size: 32px;
          font-weight: 700;
          color: ${primaryColor};
          text-transform: uppercase;
          letter-spacing: 2px;
          line-height: 1.3;
          margin-bottom: 8px;
          font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
        }

        .job-title {
          font-size: ${bodyFontSize + 4}px;
          color: ${accentColor};
          margin-top: 5px;
          line-height: 1.4;
        }

        .section { 
          margin-bottom: 25px; 
          page-break-inside: avoid;
        }

        .section-title {
          font-size: ${bodyFontSize + 2}px;
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
          font-size: ${bodyFontSize}px;
          font-weight: 600;
          color: ${primaryColor};
          margin: 10px 0 5px 0;
        }

        .entry { 
          margin-bottom: 18px; 
          page-break-inside: avoid;
        }

        .entry-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 4px;
        }

        .entry-title {
          font-weight: 700;
          color: ${darkGray};
          font-size: ${bodyFontSize + 1}px;
        }

        .entry-date {
          color: ${textGray};
          font-size: ${bodyFontSize - 1}px;
          font-style: italic;
        }

        .entry-subtitle {
          font-weight: 500;
          color: ${primaryColor};
          font-size: ${bodyFontSize}px;
          margin-bottom: 4px;
        }

        .entry-location {
          color: ${textGray};
          font-size: ${bodyFontSize - 2}px;
          margin-bottom: 4px;
        }

        .entry-detail {
          color: ${textGray};
          font-size: ${bodyFontSize - 1}px;
          margin: 4px 0;
          line-height: 1.5;
        }

        .entry-detail strong {
          color: ${primaryColor};
          font-weight: 600;
        }

        .description {
          color: ${textGray};
          font-size: ${bodyFontSize - 1}px;
          line-height: 1.6;
          margin-top: 6px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: ${bodyFontSize - 1}px;
          color: ${textGray};
          margin-bottom: 25px;
          line-height: 1.5;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 10px;
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
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 8px 30px;
        }

        .skills-list li {
          position: relative;
          padding-left: 18px;
          color: ${textGray};
          font-size: ${bodyFontSize - 1}px;
          margin-bottom: 5px;
          line-height: 1.5;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .skills-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: ${accentColor};
          font-weight: bold;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .badge {
          display: inline-block;
          background-color: ${accentColor}20;
          color: ${primaryColor};
          padding: 2px 8px;
          border-radius: 12px;
          font-size: ${bodyFontSize - 2}px;
          margin-right: 5px;
          margin-bottom: 5px;
        }

        .professional-context {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 10px;
        }

        .context-item {
          display: flex;
          flex-direction: column;
        }

        .context-label {
          font-weight: 600;
          color: ${primaryColor};
          font-size: ${bodyFontSize - 1}px;
        }

        .context-value {
          color: ${textGray};
        }

        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 5px;
        }

        .tech-tag {
          background-color: ${accentColor}15;
          color: ${primaryColor};
          padding: 2px 8px;
          border-radius: 4px;
          font-size: ${bodyFontSize - 2}px;
        }

        @media print {
          body { 
            padding: 0; 
            font-size: 11pt;
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

        <!-- Header with Personal Info -->
        <header class="header">
          <div class="header-left">
            <h1 class="name">${(personal.name || "SAMANANDA MOHAN RAO").toUpperCase()}${personal.middleName ? ` ${personal.middleName}` : ""}</h1>
            ${personal.jobTitle ? `<div class="job-title">${personal.jobTitle}</div>` : ""}
            ${personal.role ? `<div class="job-title">${personal.role}</div>` : ""}
          </div>
          <div class="header-right">
            ${personal.email ? `<div>${personal.email}</div>` : ""}
            ${personal.phone ? `<div>${personal.phone}</div>` : ""}
          </div>
        </header>

        <!-- Personal Information Details -->
        ${(() => {
          const personalDetails = [
            personal.fullAddress || personal.location || personal.country || personal.pinCode ? 'address' : null,
            personal.phone ? 'phone' : null,
            personal.alternatePhone ? 'altPhone' : null,
            personal.email ? 'email' : null,
            personal.dob ? 'dob' : null,
            personal.gender ? 'gender' : null,
            personal.maritalStatus ? 'maritalStatus' : null
          ].filter(Boolean);
          
          return personalDetails.length > 0 ? `
          <div class="section" data-section="personal">
            <div class="contact-info">
              <div class="contact-grid">
                ${(() => {
                  const addressParts = [
                    personal.fullAddress,
                    personal.location,
                    personal.country,
                    personal.pinCode
                  ].filter(Boolean);
                  return addressParts.length > 0 ? `
                  <div class="contact-item">
                    <b>Address:</b> 
                    <span>${addressParts.join(", ")}</span>
                  </div>
                ` : "";
                })()}
                ${personal.phone ? `<div class="contact-item"><b>Phone:</b> ${personal.phone}</div>` : ""}
                ${personal.alternatePhone ? `<div class="contact-item"><b>Alt Phone:</b> ${personal.alternatePhone}</div>` : ""}
                ${personal.email ? `<div class="contact-item"><b>Email:</b> ${personal.email}</div>` : ""}
                ${personal.dob ? `<div class="contact-item"><b>DOB:</b> ${personal.dob}</div>` : ""}
                ${personal.gender ? `<div class="contact-item"><b>Gender:</b> ${personal.gender}</div>` : ""}
                ${personal.maritalStatus ? `<div class="contact-item"><b>Marital Status:</b> ${personal.maritalStatus}</div>` : ""}
              </div>
            </div>
          </div>
          ` : "";
        })()}

        <!-- Professional Context -->
        ${professionalContext && hasObjectValues(professionalContext) ? `
          <div class="section" data-section="professionalContext">
            <h2 class="section-title">Professional Context</h2>
            <div class="professional-context">
              ${professionalContext.totalExperience ? `
                <div class="context-item">
                  <span class="context-label">Total Experience:</span>
                  <span class="context-value">${professionalContext.totalExperience}</span>
                </div>
              ` : ""}
              ${professionalContext.teamSize ? `
                <div class="context-item">
                  <span class="context-label">Team Size:</span>
                  <span class="context-value">${professionalContext.teamSize}</span>
                </div>
              ` : ""}
              ${professionalContext.industry ? `
                <div class="context-item">
                  <span class="context-label">Industry:</span>
                  <span class="context-value">${professionalContext.industry}</span>
                </div>
              ` : ""}
              ${professionalContext.functionalDomain ? `
                <div class="context-item">
                  <span class="context-label">Functional Domain:</span>
                  <span class="context-value">${professionalContext.functionalDomain}</span>
                </div>
              ` : ""}
              ${professionalContext.geographicScope ? `
                <div class="context-item">
                  <span class="context-label">Geographic Scope:</span>
                  <span class="context-value">${professionalContext.geographicScope}</span>
                </div>
              ` : ""}
              ${professionalContext.revenueResponsibility ? `
                <div class="context-item">
                  <span class="context-label">Revenue Responsibility:</span>
                  <span class="context-value">${professionalContext.revenueResponsibility}</span>
                </div>
              ` : ""}
            </div>
          </div>
        ` : ""}

        <!-- Availability & Work Auth -->
        ${availabilityWorkAuth && hasObjectValues(availabilityWorkAuth) ? `
          <div class="section" data-section="availabilityWorkAuth">
            <h2 class="section-title">Availability & Work Authorization</h2>
            <div class="professional-context">
              ${availabilityWorkAuth.availabilityNoticePeriod ? `
                <div class="context-item">
                  <span class="context-label">Notice Period:</span>
                  <span class="context-value">${availabilityWorkAuth.availabilityNoticePeriod}</span>
                </div>
              ` : ""}
              ${availabilityWorkAuth.workAuthorizationStatus ? `
                <div class="context-item">
                  <span class="context-label">Work Auth:</span>
                  <span class="context-value">${availabilityWorkAuth.workAuthorizationStatus}</span>
                </div>
              ` : ""}
              ${availabilityWorkAuth.preferredLocation ? `
                <div class="context-item">
                  <span class="context-label">Preferred Location:</span>
                  <span class="context-value">${availabilityWorkAuth.preferredLocation}</span>
                </div>
              ` : ""}
            </div>
          </div>
        ` : ""}

        <!-- Career Objective -->
        ${careerObjective && careerObjective.trim() ? `
          <div class="section" data-section="careerObjective">
            <h2 class="section-title">Career Objective</h2>
            <div class="description">${careerObjective}</div>
          </div>
        ` : ""}

        <!-- Summary -->
        ${summary && summary.trim() ? `
          <div class="section" data-section="summary">
            <h2 class="section-title">Professional Summary</h2>
            <div class="description">${summary}</div>
          </div>
        ` : ""}

        <!-- Work Experience -->
        ${nonEmptyExperience.length > 0 ? `
          <div class="section" data-section="experience">
            <h2 class="section-title">Work Experience</h2>
            ${nonEmptyExperience.map((exp: any, index: number) => `
              <div class="entry" data-section="experience" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${exp.title || ""}</span>
                  <span class="entry-date">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                </div>
                <div class="entry-subtitle">
                  ${exp.company ? exp.company : ""}${exp.location ? `, ${exp.location}` : ""}
                </div>
                ${exp.description && exp.description.trim() ? `<div class="description">${exp.description}</div>` : ""}
                ${exp.achievements && exp.achievements.trim() ? `<div class="description"><strong>Achievements:</strong> ${exp.achievements}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Education -->
        ${nonEmptyEducation.length > 0 ? `
          <div class="section" data-section="education">
            <h2 class="section-title">Education</h2>
            ${nonEmptyEducation.map((edu: any, index: number) => `
              <div class="entry" data-section="education" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</span>
                  <span class="entry-date">${edu.graduationDate || ""}</span>
                </div>
                <div class="entry-subtitle">
                  ${edu.school || ""}${edu.location ? `, ${edu.location}` : ""}
                </div>
                ${edu.grade && edu.grade.trim() ? `<div class="entry-detail"><strong>Grade:</strong> ${edu.grade}</div>` : ""}
                ${edu.description && edu.description.trim() ? `<div class="description">${edu.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Internships -->
        ${nonEmptyInternships.length > 0 ? `
          <div class="section" data-section="internships">
            <h2 class="section-title">Internships</h2>
            ${nonEmptyInternships.map((item: any, index: number) => `
              <div class="entry" data-section="internships" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.title || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-subtitle">${item.company ? item.company : ""}</div>
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Training Programs -->
        ${nonEmptyTrainingPrograms.length > 0 ? `
          <div class="section" data-section="trainingPrograms">
            <h2 class="section-title">Training Programs</h2>
            ${nonEmptyTrainingPrograms.map((item: any, index: number) => `
              <div class="entry" data-section="trainingPrograms" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.name || ""}</span>
                  <span class="entry-date">${item.completionDate || ""}</span>
                </div>
                <div class="entry-subtitle">
                  ${item.provider || item.organization || ""}${item.duration ? ` | ${item.duration}` : ""}
                </div>
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Academic Projects -->
        ${nonEmptyAcademicProjects.length > 0 ? `
          <div class="section" data-section="academicProjects">
            <h2 class="section-title">Academic Projects</h2>
            ${nonEmptyAcademicProjects.map((item: any, index: number) => `
              <div class="entry" data-section="academicProjects" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.name || item.title || ""}</span>
                  <span class="entry-date">${item.duration || ""}</span>
                </div>
                <div class="entry-subtitle">
                  ${item.institution ? item.institution : ""}${item.course ? ` | ${item.course}` : ""}
                </div>
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
                ${item.technologies && item.technologies.length > 0 ? `
                  <div class="tech-stack">
                    ${(Array.isArray(item.technologies) ? item.technologies : [item.technologies]).filter((tech: string) => tech && tech.trim()).map((tech: string) => 
                      `<span class="tech-tag">${tech.trim()}</span>`
                    ).join("")}
                  </div>
                ` : ""}
                ${item.url ? `<div class="entry-detail"><strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Leadership Positions -->
        ${nonEmptyLeadershipPositions.length > 0 ? `
          <div class="section" data-section="leadershipPositions">
            <h2 class="section-title">Leadership Positions</h2>
            ${nonEmptyLeadershipPositions.map((item: any, index: number) => `
              <div class="entry" data-section="leadershipPositions" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.position || item.title || ""}</span>
                  <span class="entry-date">${formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-subtitle">${item.organization || ""}</div>
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Co-curricular Activities -->
        ${nonEmptyCoCurricular.length > 0 ? `
          <div class="section" data-section="coCurricular">
            <h2 class="section-title">Co-curricular Activities</h2>
            ${nonEmptyCoCurricular.map((item: any, index: number) => `
              <div class="entry" data-section="coCurricular" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.activity || ""}</span>
                  <span class="entry-date">${item.year || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                ${item.role ? `<div class="entry-detail"><strong>Role:</strong> ${item.role}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Extracurricular Activities -->
        ${nonEmptyExtracurricular.length > 0 ? `
          <div class="section" data-section="extracurricular">
            <h2 class="section-title">Extracurricular Activities</h2>
            ${nonEmptyExtracurricular.map((item: any, index: number) => `
              <div class="entry" data-section="extracurricular" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.activity || ""}</span>
                  <span class="entry-date">${item.year || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                ${item.role ? `<div class="entry-detail"><strong>Role:</strong> ${item.role}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Skills -->
        ${skillsHtml ? `
          <div class="section" data-section="skills">
            <h2 class="section-title">Skills</h2>
            <div class="skills-list">${skillsHtml}</div>
          </div>
        ` : ""}

        <!-- Languages -->
        ${nonEmptyLanguages.length > 0 ? `
          <div class="section" data-section="languages">
            <h2 class="section-title">Languages</h2>
            <div class="skills-list">
              <ul>
                ${nonEmptyLanguages.map((lang: any, index: number) => `
                  <li data-section="languages" data-index="${index}">
                    ${lang.language || lang}
                    ${lang.proficiency ? ` (${lang.proficiency})` : ""}
                    ${lang.capability ? ` - ${lang.capability}` : ""}
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>
        ` : ""}

        <!-- Hobbies -->
        ${nonEmptyHobbies.length > 0 ? `
          <div class="section" data-section="hobbies">
            <h2 class="section-title">Hobbies</h2>
            <div class="skills-list">
              <ul>
                ${nonEmptyHobbies.map((hobby: any, index: number) => `
                  <li data-section="hobbies" data-index="${index}">${typeof hobby === "string" ? hobby.trim() : hobby}</li>
                `).join("")}
              </ul>
            </div>
          </div>
        ` : ""}

        <!-- Certifications -->
        ${nonEmptyCertifications.length > 0 ? `
          <div class="section" data-section="certifications">
            <h2 class="section-title">Certifications</h2>
            ${nonEmptyCertifications.map((cert: any, index: number) => `
              <div class="entry" data-section="certifications" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${cert.name || ""}</span>
                  <span class="entry-date">${cert.date || ""}</span>
                </div>
                <div class="entry-subtitle">${cert.issuer || ""}</div>
                ${cert.description && cert.description.trim() ? `<div class="description">${cert.description}</div>` : ""}
                ${cert.url ? `<div class="entry-detail"><a href="${cert.url}" target="_blank">${cert.url}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Scholarships -->
        ${nonEmptyScholarships.length > 0 ? `
          <div class="section" data-section="scholarships">
            <h2 class="section-title">Scholarships</h2>
            ${nonEmptyScholarships.map((item: any, index: number) => `
              <div class="entry" data-section="scholarships" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.name || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-subtitle">${item.provider || item.organization || ""}</div>
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Awards -->
        ${nonEmptyAwards.length > 0 ? `
          <div class="section" data-section="awards">
            <h2 class="section-title">Awards</h2>
            ${nonEmptyAwards.map((award: any, index: number) => `
              <div class="entry" data-section="awards" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${award.title || ""}</span>
                  <span class="entry-date">${award.issueYear || award.year || ""}</span>
                </div>
                <div class="entry-subtitle">${award.organization || ""}</div>
                ${award.description && award.description.trim() ? `<div class="description">${award.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Speaking Engagements -->
        ${nonEmptySpeakingEngagements.length > 0 ? `
          <div class="section" data-section="speakingEngagements">
            <h2 class="section-title">Speaking Engagements</h2>
            ${nonEmptySpeakingEngagements.map((item: any, index: number) => `
              <div class="entry" data-section="speakingEngagements" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.topic || ""}</span>
                  <span class="entry-date">${item.date || ""}</span>
                </div>
                <div class="entry-subtitle">${item.eventName || ""}</div>
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Memberships -->
        ${nonEmptyMemberships.length > 0 ? `
          <div class="section" data-section="memberships">
            <h2 class="section-title">Memberships</h2>
            ${nonEmptyMemberships.map((item: any, index: number) => `
              <div class="entry" data-section="memberships" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.membershipName || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-subtitle">${item.organizationName || ""}</div>
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Workshops -->
        ${nonEmptyWorkshops.length > 0 ? `
          <div class="section" data-section="workshops">
            <h2 class="section-title">Workshops</h2>
            ${nonEmptyWorkshops.map((item: any, index: number) => `
              <div class="entry" data-section="workshops" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.programTitle || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-subtitle">${item.conductedBy || ""}</div>
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Portfolio -->
        ${nonEmptyPortfolio.length > 0 ? `
          <div class="section" data-section="portfolio">
            <h2 class="section-title">Portfolio</h2>
            ${nonEmptyPortfolio.map((item: any, index: number) => `
              <div class="entry" data-section="portfolio" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.name || ""}</span>
                </div>
                <div class="entry-subtitle">
                  ${item.type ? item.type : ""}${item.platform ? ` on ${item.platform}` : ""}
                </div>
                ${item.url ? `<div class="entry-detail"><a href="${item.url}" target="_blank">${item.url}</a></div>` : ""}
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Client Projects -->
        ${nonEmptyClientProjects.length > 0 ? `
          <div class="section" data-section="clientProjects">
            <h2 class="section-title">Client Projects</h2>
            ${nonEmptyClientProjects.map((item: any, index: number) => `
              <div class="entry" data-section="clientProjects" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.name || ""}</span>
                </div>
                <div class="entry-subtitle">
                  ${item.clientOrganization ? item.clientOrganization : ""}${item.role ? ` - ${item.role}` : ""}
                </div>
                ${item.duration ? `<div class="entry-detail"><strong>Duration:</strong> ${item.duration}</div>` : ""}
                ${item.toolsTechnologies ? `<div class="entry-detail"><strong>Tools:</strong> ${item.toolsTechnologies}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
                ${item.projectUrl ? `<div class="entry-detail"><a href="${item.projectUrl}" target="_blank">${item.projectUrl}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Volunteering -->
        ${nonEmptyVolunteering.length > 0 ? `
          <div class="section" data-section="volunteering">
            <h2 class="section-title">Volunteering</h2>
            ${nonEmptyVolunteering.map((item: any, index: number) => `
              <div class="entry" data-section="volunteering" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.role || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-subtitle">${item.organization || ""}</div>
                ${item.causeArea ? `<div class="entry-detail"><strong>Cause:</strong> ${item.causeArea}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Military Service -->
        ${nonEmptyMilitaryService.length > 0 ? `
          <div class="section" data-section="militaryService">
            <h2 class="section-title">Military Service</h2>
            ${nonEmptyMilitaryService.map((item: any, index: number) => `
              <div class="entry" data-section="militaryService" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.branch ? item.branch : ""}${item.rank ? ` - ${item.rank}` : ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                ${item.specialization ? `<div class="entry-subtitle">${item.specialization}</div>` : ""}
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Tools & Technologies -->
        ${nonEmptyToolsTechnologies.length > 0 ? `
          <div class="section" data-section="toolsTechnologies">
            <h2 class="section-title">Tools & Technologies</h2>
            <div class="grid-2">
              ${nonEmptyToolsTechnologies.map((item: any, index: number) => `
                <div class="entry" data-section="toolsTechnologies" data-index="${index}">
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
            <h2 class="section-title">Methodologies</h2>
            <div class="grid-2">
              ${nonEmptyMethodologies.map((item: any, index: number) => `
                <div class="entry" data-section="methodologies" data-index="${index}">
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
            <h2 class="section-title">Industry Expertise</h2>
            <div class="grid-2">
              ${nonEmptyIndustryExpertise.map((item: any, index: number) => `
                <div class="entry" data-section="industryExpertise" data-index="${index}">
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
            <h2 class="section-title">Teaching Experience</h2>
            ${nonEmptyTeachingExperience.map((item: any, index: number) => `
              <div class="entry" data-section="teachingExperience" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.subjectCourseTaught || item.title || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-subtitle">${item.institution ? item.institution : ""}${item.title && !item.subjectCourseTaught ? ` - ${item.title}` : ""}</div>
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Mentorship Experience -->
        ${nonEmptyMentorshipExperience.length > 0 ? `
          <div class="section" data-section="mentorshipExperience">
            <h2 class="section-title">Mentorship Experience</h2>
            ${nonEmptyMentorshipExperience.map((item: any, index: number) => `
              <div class="entry" data-section="mentorshipExperience" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.mentorshipArea || ""}</span>
                  <span class="entry-date">${item.duration || formatDateRange(item.startDate, item.endDate) || ""}</span>
                </div>
                <div class="entry-subtitle">${item.organizationPlatform ? item.organizationPlatform : ""}${item.menteeLevel ? ` - ${item.menteeLevel}` : ""}</div>
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Research Grants -->
        ${nonEmptyResearchGrants.length > 0 ? `
          <div class="section" data-section="researchGrants">
            <h2 class="section-title">Research Grants</h2>
            ${nonEmptyResearchGrants.map((item: any, index: number) => `
              <div class="entry" data-section="researchGrants" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.title || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-subtitle">${item.agency ? item.agency : ""}${item.amount ? ` | Amount: ${item.amount}` : ""}</div>
                ${item.description && item.description.trim() ? `<div class="description">${item.description}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Test Scores -->
        ${nonEmptyTestScores.length > 0 ? `
          <div class="section" data-section="testScores">
            <h2 class="section-title">Test Scores</h2>
            <div class="grid-2">
              ${nonEmptyTestScores.map((item: any, index: number) => `
                <div class="entry" data-section="testScores" data-index="${index}">
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
            <h2 class="section-title">Publications</h2>
            ${nonEmptyPublications.map((item: any, index: number) => `
              <div class="entry" data-section="publications" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.title || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-subtitle">${item.journalPublisher ? item.journalPublisher : ""}${item.publicationType ? ` (${item.publicationType})` : ""}</div>
                ${item.urlDoi ? `<div class="entry-detail"><a href="${item.urlDoi}" target="_blank">${item.urlDoi}</a></div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Patents -->
        ${nonEmptyPatents.length > 0 ? `
          <div class="section" data-section="patents">
            <h2 class="section-title">Patents</h2>
            ${nonEmptyPatents.map((item: any, index: number) => `
              <div class="entry" data-section="patents" data-index="${index}">
                <div class="entry-header">
                  <span class="entry-title">${item.title || ""}</span>
                  <span class="entry-date">${item.year || ""}</span>
                </div>
                <div class="entry-subtitle">
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
            <h2 class="section-title">References</h2>
            ${nonEmptyReferences.map((item: any, index: number) => `
              <div class="entry" data-section="references" data-index="${index}">
                <div class="entry-title">${item.name || ""}</div>
                <div class="entry-subtitle">${item.designationRelationship ? item.designationRelationship : ""}${item.organization ? ` at ${item.organization}` : ""}</div>
                ${item.contactInformation ? `<div class="entry-detail"><strong>Contact:</strong> ${item.contactInformation}</div>` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <!-- Social Profiles -->
        ${nonEmptySocialProfiles.length > 0 ? `
          <div class="section" data-section="socialProfiles">
            <h2 class="section-title">Social Profiles</h2>
            <div class="skills-list">
              <ul>
                ${nonEmptySocialProfiles.map((item: any, index: number) => `
                  <li data-section="socialProfiles" data-index="${index}">
                    ${item.platform || "Profile"}: <a href="${item.url || ""}" target="_blank">${item.url || ""}</a>
                  </li>
                `).join("")}
              </ul>
            </div>
          </div>
        ` : ""}
      </div>
    </body>
    </html>
  `;
}