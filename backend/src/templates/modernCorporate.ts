
export function buildModernCorporateTemplate(data: any, theme?: any): string {
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
    primary: "#000000",
    text: "#111111",
    textLight: "#333333",
    background: "#ffffff",
  };
  const currentTheme = { ...defaultTheme, ...(theme || {}) };
  const baseFontSize = data?.formatting?.bodyFontSize || data?.fontSize || 10;
  const userFontFamily = data?.formatting?.fontFamily || data?.fontFamily || "'Times New Roman', 'Georgia', serif";
  const nameFontSize = Math.round(baseFontSize * 2.4);
  const sectionTitleSize = Math.round(baseFontSize * 1.05);

  // Helper functions
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
    return parts.join(" - ");
  };

  const renderBullets = (description: string): string => {
    if (!description) return "";
    if (description.includes('<ul>') || description.includes('<li>') || description.includes('<div>')) {
      return `<div class="description-html">${description}</div>`;
    }
    const lines = description.split("\n").filter(line => line.trim());
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
  const github = socialProfiles.find((p: any) => p.platform?.toLowerCase().includes("github"))?.url || "";

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
  const nonEmptyAwards = getNonEmptyItems(awards);
  const nonEmptyPublications = getNonEmptyItems(publications);
  const nonEmptyPatents = getNonEmptyItems(patents);
  const nonEmptyVolunteering = getNonEmptyItems(volunteering);
  const nonEmptyMethodologies = getNonEmptyItems(methodologies);
  const nonEmptyIndustryExpertise = getNonEmptyItems(industryExpertise);
  const nonEmptyReferences = getNonEmptyItems(references);
  const nonEmptyTeachingExperience = getNonEmptyItems(teachingExperience);
  const nonEmptyMentorshipExperience = getNonEmptyItems(mentorshipExperience);
  const nonEmptyResearchGrants = getNonEmptyItems(researchGrants);
  const nonEmptyTestScores = getNonEmptyItems(testScores);
  const nonEmptyToolsTechnologies = getNonEmptyItems(toolsTechnologies);
  const nonEmptyHobbies = getNonEmptyItems(hobbies);
  const nonEmptySpeakingEngagements = getNonEmptyItems(speakingEngagements);
  const nonEmptyMemberships = getNonEmptyItems(memberships);
  const nonEmptyWorkshops = getNonEmptyItems(workshops);
  const nonEmptyScholarships = getNonEmptyItems(scholarships);
  const nonEmptyMilitaryService = getNonEmptyItems(militaryService);
  const nonEmptyClientProjects = getNonEmptyItems(clientProjects);
  const nonEmptyPortfolio = getNonEmptyItems(portfolio);

  const summaryText = summary || careerObjective;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: ${userFontFamily};
          font-size: ${baseFontSize}px;
          color: #111111;
          background: #ffffff;
          line-height: 1.5;
          padding: 36px 44px;
        }

        /* ── HEADER ── */
        .header {
          text-align: center;
          margin-bottom: 18px;
        }
        .name {
          font-size: ${nameFontSize}px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 8px;
          color: #000;
        }
        .contact-line {
          font-size: ${baseFontSize * 0.95}px;
          color: #333;
          margin-bottom: 3px;
        }
        .contact-line a {
          color: #333;
          text-decoration: none;
        }
        .contact-separator {
          margin: 0 8px;
          color: #aaa;
        }

        /* ── SUMMARY (full width) ── */
        .summary-section {
          text-align: center;
          margin-bottom: 22px;
        }
        .summary-section .section-title {
          text-align: center;
          margin-bottom: 8px;
          border-bottom: none;
        }
        .summary-text {
          font-size: ${baseFontSize}px;
          color: #333;
          line-height: 1.6;
          max-width: 95%;
          margin: 0 auto;
          text-align: center;
        }

        /* ── SECTION TITLE ── */
        .section-title {
          font-size: ${sectionTitleSize}px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #000;
          border-bottom: 1.5px solid #000;
          padding-bottom: 4px;
          margin-bottom: 12px;
        }

        /* ── TWO-COLUMN LAYOUT ── */
        .main-content {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 0;
          align-items: start;
          border-top: 1.5px solid #000;
        }

        /* ── SIDEBAR (left) ── */
        .left-col {
          border-right: 1.5px solid #000;
          padding-top: 16px;
          padding-right: 20px;
        }
        .left-col .section {
          margin-bottom: 20px;
        }

        /* ── RIGHT COLUMN ── */
        .right-col {
          padding-top: 16px;
          padding-left: 24px;
        }

        /* Education */
        .edu-item {
          margin-bottom: 12px;
        }
        .edu-degree {
          font-weight: 700;
          font-size: ${baseFontSize}px;
          color: #000;
          display: block;
          line-height: 1.3;
        }
        .edu-school {
          font-size: ${baseFontSize * 0.92}px;
          color: #444;
          display: block;
          margin-top: 1px;
        }
        .edu-year {
          font-size: ${baseFontSize * 0.88}px;
          color: #666;
          display: block;
          margin-top: 1px;
        }

        /* Skills list */
        .skill-list {
          list-style: none;
          padding: 0;
        }

        .section[data-section="skills"] ul {
  margin-left: 5px !important;
}

        .skill-list li {
          list-style: none;
          font-size: ${baseFontSize * 0.95}px;
          color: #333;
          padding: 2px 0 2px 12px;
          position: relative;
          line-height: 1.4;
        }
        .skill-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #555;
        }

        /* Generic sidebar list */
        .sidebar-list {
          list-style: none;
          padding: 0;
        }
        .sidebar-list li {
          font-size: ${baseFontSize * 0.95}px;
          color: #333;
          margin-bottom: 5px;
          line-height: 1.4;
        }
        .sidebar-item-name {
          font-weight: 600;
          display: block;
          color: #111;
        }
        .sidebar-item-sub {
          font-size: ${baseFontSize * 0.88}px;
          color: #555;
        }

        .right-col .section {
          margin-bottom: 20px;
        }

        /* Experience / Project items */
        .exp-item {
          margin-bottom: 16px;
        }
        .exp-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 4px;
        }
        .company-name {
          font-weight: 700;
          font-size: ${baseFontSize}px;
          text-transform: uppercase;
          color: #000;
          letter-spacing: 0.5px;
        }
        .date-text {
          font-size: ${baseFontSize * 0.9}px;
          color: #555;
          white-space: nowrap;
          font-style: italic;
        }
        .job-title {
          display: block;
          font-size: ${baseFontSize * 0.92}px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: #222;
          margin-top: 1px;
          margin-bottom: 5px;
        }

        /* Bullet lists */
        .bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .bullet-list li {
          position: relative;
          padding-left: 13px;
          margin-bottom: 4px;
          font-size: ${baseFontSize * 0.95}px;
          color: #333;
          line-height: 1.5;
          text-align: justify;
        }
        .bullet-list li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #333;
        }

        .description-html ul,
        .description-html ol {
          list-style: none;
          padding-left: 0;
          margin: 5px 0;
        }
        .description-html li {
          position: relative;
          padding-left: 13px;
          margin-bottom: 4px;
          font-size: ${baseFontSize * 0.95}px;
          color: #333;
          line-height: 1.5;
          text-align: justify;
        }
        .description-html li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #333;
        }

        .info-text {
          font-size: ${baseFontSize * 0.92}px;
          color: #444;
          margin-top: 3px;
        }

        @media print {
          body { padding: 0; }
          * { -webkit-print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <!-- HEADER -->
      <div class="header" data-section="personal">
        <h1 class="name">${personal.name || "YOUR NAME"}</h1>

        <div class="contact-line">
          ${[
            personal.phone ? `Phone: ${personal.phone}` : "",
            personal.email ? `Email: ${personal.email}` : "",
            personal.location ? `Address: ${personal.location}` : "",
          ]
            .filter(Boolean)
            .join('<span class="contact-separator">|</span>')}
        </div>

        ${
          personal.dob || personal.gender
            ? `
        <div class="contact-line">
          ${[
            personal.dob ? `DOB: ${personal.dob}` : "",
            personal.gender ? `Gender: ${personal.gender}` : "",
          ]
            .filter(Boolean)
            .join('<span class="contact-separator">|</span>')}
        </div>
        `
            : ""
        }

        ${linkedIn ? `<div class="contact-line"><strong>LinkedIn:</strong> <a href="${linkedIn}">${linkedIn}</a></div>` : ""}
        ${github ? `<div class="contact-line"><strong>GitHub:</strong> <a href="${github}">${github}</a></div>` : ""}
      </div>

      <!-- SUMMARY (full width) -->
      ${
        summaryText
          ? `
      <div class="summary-section" data-section="summary">
        <div class="section-title">Summary</div>
        <p class="summary-text">${summaryText}</p>
      </div>
      `
          : ""
      }

      <!-- TWO COLUMN -->
      <div class="main-content">

        <!-- LEFT SIDEBAR -->
        <div class="left-col">

          ${
            availabilityWorkAuth && hasObjectValues(availabilityWorkAuth)
              ? `
          <div class="section" data-section="availabilityWorkAuth">
            <div class="section-title">Work Authorization</div>
            <ul class="sidebar-list">
              ${availabilityWorkAuth.workAuthorizationStatus ? `<li>${availabilityWorkAuth.workAuthorizationStatus}</li>` : ""}
              ${availabilityWorkAuth.availabilityNoticePeriod ? `<li>Notice: ${availabilityWorkAuth.availabilityNoticePeriod}</li>` : ""}
            </ul>
          </div>
          `
              : ""
          }

          ${
            nonEmptyEducation.length > 0
              ? `
          <div class="section" data-section="education">
            <div class="section-title">Education</div>
            ${nonEmptyEducation
              .map(
                (edu: any, idx: number) => `
              <div class="edu-item" data-index="${idx}">
                <span class="edu-degree">${edu.degree || edu.course || ""}${edu.field ? ` — ${edu.field}` : ""}</span>
                <span class="edu-school">${edu.school || edu.university || ""}${edu.location ? ` | ${edu.location}` : ""}</span>
                <span class="edu-year">${formatDateRange(edu.startDate, edu.endDate || edu.graduationDate)}${edu.grade ? ` | ${edu.grade}` : ""}</span>
                ${edu.description ? `<div style="margin-top:4px;">${renderBullets(edu.description)}</div>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

         <div class="section" data-section="skills">
  <div class="section-title">Skills</div>
  <div class="description-html">
    ${skillArray.join("")}
  </div>
</div>

<div class="section" data-section="coreCompetencies">
  <div class="section-title">Competencies</div>
  <div class="description-html">
    ${coreCompArray.join("")}
  </div>
</div>
          


          ${
            nonEmptyToolsTechnologies.length > 0
              ? `
          <div class="section" data-section="toolsTechnologies">
            <div class="section-title">Tools & Technologies</div>
            <ul class="skill-list" style="margin-left: 20px;  padding-left: 20px;">
              ${nonEmptyToolsTechnologies.map((item: any, idx: number) => `<li data-index="${idx}">${item.name || item}${item.proficiency ? ` (${item.proficiency})` : ""}</li>`).join("")}
            </ul>
          </div>
          `
              : ""
          }

          ${
            nonEmptyCertifications.length > 0
              ? `
          <div class="section" data-section="certifications">
            <div class="section-title">Certifications</div>
            <ul class="sidebar-list">
              ${nonEmptyCertifications
                .map(
                  (cert: any, idx: number) => `
                <li data-index="${idx}">
                  <span class="sidebar-item-name">${cert.name || ""}</span>
                  ${cert.issuer ? `<span class="sidebar-item-sub">${cert.issuer}${cert.year ? `, ${cert.year}` : ""}</span>` : ""}
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
          `
              : ""
          }

          ${
            nonEmptyLanguages.length > 0
              ? `
          <div class="section" data-section="languages">
            <div class="section-title">Languages</div>
            <ul class="skill-list">
              ${nonEmptyLanguages.map((lang: any, idx: number) => `<li data-index="${idx}">${lang.language || lang}${lang.proficiency ? ` (${lang.proficiency})` : ""}</li>`).join("")}
            </ul>
          </div>
          `
              : ""
          }

          ${
            nonEmptyHobbies.length > 0
              ? `
          <div class="section" data-section="hobbies">
            <div class="section-title">Hobbies</div>
            <ul class="skill-list">
              ${nonEmptyHobbies.map((h: any, idx: number) => `<li data-index="${idx}">${typeof h === "string" ? h : h.name || ""}</li>`).join("")}
            </ul>
          </div>
          `
              : ""
          }

          ${
            nonEmptyScholarships.length > 0
              ? `
          <div class="section" data-section="scholarships">
            <div class="section-title">Scholarships</div>
            <ul class="sidebar-list">
              ${nonEmptyScholarships
                .map(
                  (item: any, idx: number) => `
                <li data-index="${idx}">
                  <span class="sidebar-item-name">${item.title || item.name || ""}</span>
                  ${item.organization ? `<span class="sidebar-item-sub">${item.organization}</span>` : ""}
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
          `
              : ""
          }

          ${
            nonEmptyMemberships.length > 0
              ? `
          <div class="section" data-section="memberships">
            <div class="section-title">Memberships</div>
            <ul class="sidebar-list">
              ${nonEmptyMemberships
                .map(
                  (item: any, idx: number) => `
                <li data-index="${idx}">
                  <span class="sidebar-item-name">${item.organization || ""}</span>
                  ${item.role ? `<span class="sidebar-item-sub">${item.role}</span>` : ""}
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
          `
              : ""
          }

          ${
            nonEmptyTestScores.length > 0
              ? `
          <div class="section" data-section="testScores">
            <div class="section-title">Test Scores</div>
            <ul class="sidebar-list">
              ${nonEmptyTestScores
                .map(
                  (item: any, idx: number) => `
                <li data-index="${idx}">
                  <span class="sidebar-item-name">${item.testName || ""}</span>
                  <span class="sidebar-item-sub">Score: ${item.score || ""}${item.year ? ` (${item.year})` : ""}</span>
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
          `
              : ""
          }

        </div>

        <!-- RIGHT MAIN COLUMN -->
        <div class="right-col">

          ${
            nonEmptyExperience.length > 0
              ? `
          <div class="section" data-section="experience">
            <div class="section-title">Professional Experience</div>
            ${nonEmptyExperience
              .map(
                (exp: any, idx: number) => `
              <div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${exp.company || ""}</span>
                  <span class="date-text">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                </div>
                <span class="job-title">${exp.title || ""}${exp.location ? ` | ${exp.location}` : ""}</span>
                ${exp.description ? renderBullets(exp.description) : ""}
                ${exp.achievements ? `<p class="info-text"><strong>Achievements:</strong> ${exp.achievements}</p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyInternships.length > 0
              ? `
          <div class="section" data-section="internships">
            <div class="section-title">Internships</div>
            ${nonEmptyInternships
              .map(
                (item: any, idx: number) => `
              <div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${item.company || ""}</span>
                  <span class="date-text">${item.duration || formatDateRange(item.startDate, item.endDate)}</span>
                </div>
                <span class="job-title">${item.title || ""}</span>
                ${item.description ? renderBullets(item.description) : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyProjects.length > 0
              ? `
          <div class="section" data-section="projects">
            <div class="section-title">Projects</div>
            ${nonEmptyProjects
              .map(
                (project: any, idx: number) => `
              <div class="exp-item" data-index="${idx}">
                <div class="exp-header">
                  <span class="company-name">${project.name || project.title || ""}</span>
                  ${project.duration ? `<span class="date-text">${project.duration}</span>` : ""}
                </div>
                ${project.role ? `<span class="job-title">${project.role}</span>` : ""}
                ${project.description ? renderBullets(project.description) : ""}
                ${project.technologies ? `<p class="info-text"><strong>Technologies:</strong> ${project.technologies}</p>` : ""}
                ${project.link ? `<p class="info-text"><a href="${project.link}" style="color:#333;">${project.link}</a></p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyAcademicProjects.length > 0
              ? `
          <div class="section">
            <div class="section-title">Academic Projects</div>
            ${nonEmptyAcademicProjects
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.name || item.title || ""}</span>
                  ${item.duration ? `<span class="date-text">${item.duration}</span>` : ""}
                </div>
                ${item.institution ? `<span class="job-title">${item.institution}</span>` : ""}
                ${item.description ? renderBullets(item.description) : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyTrainingPrograms.length > 0
              ? `
          <div class="section">
            <div class="section-title">Training</div>
            ${nonEmptyTrainingPrograms
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.name || ""}</span>
                  ${item.completionDate ? `<span class="date-text">${item.completionDate}</span>` : ""}
                </div>
                ${item.provider || item.organization ? `<span class="job-title">${item.provider || item.organization || ""}</span>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyLeadershipPositions.length > 0
              ? `
          <div class="section">
            <div class="section-title">Leadership</div>
            ${nonEmptyLeadershipPositions
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.organization || ""}</span>
                  <span class="date-text">${formatDateRange(item.startDate, item.endDate)}</span>
                </div>
                <span class="job-title">${item.position || item.title || ""}</span>
                ${item.description ? renderBullets(item.description) : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyCoCurricular.length > 0 ||
            nonEmptyExtracurricular.length > 0
              ? `
          <div class="section">
            <div class="section-title">Activities</div>
            ${[...nonEmptyCoCurricular, ...nonEmptyExtracurricular]
              .map(
                (item: any) => `
              <div class="exp-item">
                <span class="company-name">${item.activity || ""}</span>
                ${item.role ? `<span class="job-title">${item.role}</span>` : ""}
                ${item.description ? renderBullets(item.description) : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyAwards.length > 0
              ? `
          <div class="section">
            <div class="section-title">Awards & Honors</div>
            ${nonEmptyAwards
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.title || ""}</span>
                  ${item.year ? `<span class="date-text">${item.year}</span>` : ""}
                </div>
                ${item.organization ? `<span class="job-title">${item.organization}</span>` : ""}
                ${item.description ? `<p class="info-text">${item.description}</p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyPublications.length > 0
              ? `
          <div class="section">
            <div class="section-title">Publications</div>
            ${nonEmptyPublications
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.title || ""}</span>
                  ${item.year ? `<span class="date-text">${item.year}</span>` : ""}
                </div>
                ${item.journalPublisher ? `<span class="job-title">${item.journalPublisher}</span>` : ""}
                ${item.authors ? `<p class="info-text">${item.authors}</p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyPatents.length > 0
              ? `
          <div class="section">
            <div class="section-title">Patents</div>
            ${nonEmptyPatents
              .map(
                (item: any) => `
              <div class="exp-item">
                <span class="company-name">${item.title || ""}</span>
                ${item.patentNumber ? `<span class="job-title">Patent #${item.patentNumber}</span>` : ""}
                ${item.description ? `<p class="info-text">${item.description}</p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyVolunteering.length > 0
              ? `
          <div class="section">
            <div class="section-title">Volunteering</div>
            ${nonEmptyVolunteering
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.organization || ""}</span>
                  <span class="date-text">${formatDateRange(item.startDate, item.endDate)}</span>
                </div>
                <span class="job-title">${item.role || ""}</span>
                ${item.description ? renderBullets(item.description) : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyTeachingExperience.length > 0
              ? `
          <div class="section">
            <div class="section-title">Teaching Experience</div>
            ${nonEmptyTeachingExperience
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.subjectCourseTaught || item.title || ""}</span>
                  <span class="date-text">${formatDateRange(item.startDate, item.endDate)}</span>
                </div>
                <span class="job-title">${item.institution || ""}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyMentorshipExperience.length > 0
              ? `
          <div class="section">
            <div class="section-title">Mentorship</div>
            ${nonEmptyMentorshipExperience
              .map(
                (item: any) => `
              <div class="exp-item">
                <span class="company-name">${item.mentorshipArea || ""}</span>
                <span class="job-title">${item.organizationPlatform || ""}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyResearchGrants.length > 0
              ? `
          <div class="section">
            <div class="section-title">Research Grants</div>
            ${nonEmptyResearchGrants
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.title || ""}</span>
                  ${item.amount ? `<span class="date-text">${item.amount}</span>` : ""}
                </div>
                <span class="job-title">${item.agency || ""}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyMethodologies.length > 0
              ? `
          <div class="section">
            <div class="section-title">Methodologies</div>
            ${nonEmptyMethodologies
              .map(
                (item: any) => `
              <div class="exp-item">
                <span class="company-name">${item.name || ""}</span>
                ${item.certification ? `<span class="job-title">Certified: ${item.certification}</span>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyIndustryExpertise.length > 0
              ? `
          <div class="section">
            <div class="section-title">Industry Expertise</div>
            ${nonEmptyIndustryExpertise
              .map(
                (item: any) => `
              <div class="exp-item">
                <span class="company-name">${item.industry || ""}</span>
                ${item.domainArea ? `<span class="job-title">${item.domainArea}</span>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptySpeakingEngagements.length > 0
              ? `
          <div class="section">
            <div class="section-title">Speaking Engagements</div>
            ${nonEmptySpeakingEngagements
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.title || item.topic || ""}</span>
                  ${item.date || item.year ? `<span class="date-text">${item.date || item.year}</span>` : ""}
                </div>
                <span class="job-title">${item.event || item.organization || ""}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyWorkshops.length > 0
              ? `
          <div class="section">
            <div class="section-title">Workshops</div>
            ${nonEmptyWorkshops
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.name || item.title || ""}</span>
                  ${item.date ? `<span class="date-text">${item.date}</span>` : ""}
                </div>
                <span class="job-title">${item.organizer || item.organization || ""}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyMilitaryService.length > 0
              ? `
          <div class="section">
            <div class="section-title">Military Service</div>
            ${nonEmptyMilitaryService
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.branch || ""}</span>
                  <span class="date-text">${formatDateRange(item.startDate, item.endDate)}</span>
                </div>
                <span class="job-title">${item.rank || ""}${item.role ? ` — ${item.role}` : ""}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyClientProjects.length > 0
              ? `
          <div class="section">
            <div class="section-title">Client Projects</div>
            ${nonEmptyClientProjects
              .map(
                (item: any) => `
              <div class="exp-item">
                <div class="exp-header">
                  <span class="company-name">${item.clientName || item.name || ""}</span>
                  ${item.duration ? `<span class="date-text">${item.duration}</span>` : ""}
                </div>
                ${item.projectName ? `<span class="job-title">${item.projectName}</span>` : ""}
                ${item.description ? renderBullets(item.description) : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyPortfolio.length > 0
              ? `
          <div class="section">
            <div class="section-title">Portfolio</div>
            ${nonEmptyPortfolio
              .map(
                (item: any) => `
              <div class="exp-item">
                <span class="company-name">${item.title || item.name || ""}</span>
                ${item.url ? `<p class="info-text"><a href="${item.url}" style="color:#333;">${item.url}</a></p>` : ""}
                ${item.description ? `<p class="info-text">${item.description}</p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

          ${
            nonEmptyReferences.length > 0
              ? `
          <div class="section">
            <div class="section-title">References</div>
            ${nonEmptyReferences
              .map(
                (item: any) => `
              <div class="exp-item">
                <span class="company-name">${item.name || ""}</span>
                <span class="job-title">${item.designationRelationship || ""}${item.organization ? ` at ${item.organization}` : ""}</span>
                ${item.email ? `<p class="info-text">${item.email}</p>` : ""}
                ${item.phone ? `<p class="info-text">${item.phone}</p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          `
              : ""
          }

        </div>
      </div>

    </body>
    </html>
  `;
}