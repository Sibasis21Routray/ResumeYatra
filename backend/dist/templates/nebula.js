"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNebulaTemplate = buildNebulaTemplate;
function buildNebulaTemplate(data, theme) {
    const defaultTheme = {
        primary: "#1a1a2e",
        secondary: "#4b5563",
        background: "#ffffff",
        accent: "#6366f1",
        headingFont: "Georgia, 'Times New Roman', serif",
        bodyFont: "'Georgia', 'Times New Roman', serif",
    };
    const currentTheme = { ...defaultTheme, ...theme };
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 11;
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || defaultTheme.bodyFont;
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 2.2);
    const subheadingFontSize = Math.round(userFontSize * 0.9);
    // Utility functions
    const formatDate = (dateStr) => {
        if (!dateStr)
            return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime()))
            return dateStr;
        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };
    const escapeHtml = (text) => {
        if (typeof text !== "string")
            return "";
        const map = {
            "&": "&amp;",
            "<": "<",
            ">": ">",
            '"': "",
            "'": "&#039;",
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    };
    const isEmpty = (value) => {
        if (Array.isArray(value))
            return value.length === 0;
        if (typeof value === "object")
            return value === null || Object.keys(value).length === 0;
        return !value || value === "undefined";
    };
    // Sort experience reverse chronological
    const sortedExperience = data.experience
        ? [...data.experience].sort((a, b) => new Date(b.startDate || "1900-01-01").getTime() -
            new Date(a.startDate || "1900-01-01").getTime())
        : [];
    // Process skills
    const processSkills = () => {
        if (!data.skills)
            return [];
        if (Array.isArray(data.skills)) {
            return data.skills
                .slice(0, 15)
                .map((s) => typeof s === "string"
                ? { name: s.trim(), level: undefined }
                : { name: s.name || "", level: s.level });
        }
        return data.skills
            .split(",")
            .slice(0, 15)
            .map((s) => ({ name: s.trim() }));
    };
    // Process certifications
    const processCertifications = () => {
        if (!data.certifications || !Array.isArray(data.certifications))
            return [];
        return data.certifications
            .filter((c) => c && c.name)
            .map((c) => ({
            name: c.name,
            issuer: c.issuer || "",
            date: formatDate(c.date || c.issueDate),
            url: c.url || "",
            description: c.description || "",
        }));
    };
    const certifications = processCertifications();
    const skills = processSkills();
    // Helper arrays for additional sections
    const internships = data.internships || [];
    const academicProjects = data.academicProjects || [];
    const leadershipPositions = data.leadershipPositions || [];
    const trainingPrograms = data.trainingPrograms || [];
    const scholarships = data.scholarships || [];
    const coCurricular = data.coCurricular || [];
    const extracurricular = data.extracurricular || [];
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.personal?.name || "Resume")}</title>
  <meta name="description" content="Professional resume for ${escapeHtml(data.personal?.name || "Operations Support")}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --primary: ${currentTheme.primary};
      --secondary: ${currentTheme.secondary};
      --background: ${currentTheme.background};
      --accent: ${currentTheme.accent};
      --text: #111827;
      --text-light: #4b5563;
      --divider: #e5e7eb;
      --base-font-size: ${baseFontSize}px;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text);
      line-height: 1.6;
      background: ${currentTheme.background || "#fff"};
      font-size: var(--base-font-size);
      padding: 40px 50px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    /* Header Styling */
    header {
      text-align: center;
      margin-top: 20px;
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 2px solid var(--divider);
    }

    .name {
      font-size: ${headingFontSize}px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
      color: ${currentTheme.primary};
      line-height: 1.2;
    }

    .title {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      color: var(--text-light);
      margin-bottom: 12px;
      font-weight: 400;
    }

    .contact-info {
      font-size: ${subheadingFontSize}px;
      color: var(--text-light);
      display: flex;
      justify-content: center;
      gap: 8px 15px;
      flex-wrap: wrap;
      line-height: 1.6;
    }

    .contact-info span:not(:last-child):after {
      content: "•";
      margin-left: 15px;
      color: var(--divider);
    }

    .contact-info a {
      text-decoration: none;
      color: inherit;
      transition: color 0.2s ease;
    }

    .contact-info a:hover {
      color: var(--accent);
    }

    /* Section Styling */
    .section {
      margin-top: 18px;
      margin-bottom: 18px;
      page-break-inside: avoid;
    }

    .section-header {
      display: flex;
      align-items: center;
      text-align: center;
      margin-bottom: 14px;
    }

    .section-header:before, .section-header:after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--divider);
    }

    .section-title {
      padding: 0 18px;
      font-size: ${subheadingFontSize}px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: ${currentTheme.primary};
      white-space: nowrap;
    }

    .entry {
      margin-bottom: 14px;
      padding-bottom: 14px;
      border-bottom: 1px solid #f3f4f6;
    }

    .entry:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-weight: 700;
      margin-bottom: 4px;
      flex-wrap: wrap;
      gap: 4px;
    }

    .entry-title {
      font-size: ${Math.round(baseFontSize * 1.05)}px;
      color: var(--text);
    }

    .entry-date {
      font-size: ${subheadingFontSize}px;
      color: var(--accent);
      font-weight: 600;
      white-space: nowrap;
    }

    .entry-subtitle {
      display: flex;
      justify-content: space-between;
      font-style: italic;
      color: var(--text-light);
      margin-bottom: 6px;
      font-size: ${subheadingFontSize}px;
      flex-wrap: wrap;
      gap: 4px;
    }

    .entry-company {
      color: var(--accent);
      font-weight: 500;
    }

    .entry-location {
      color: var(--text-light);
    }

    .entry-content {
      text-align: justify;
      font-size: ${baseFontSize}px;
      color: #444;
      line-height: 1.6;
    }

    .entry-content ul {
      margin-left: 20px;
      margin-top: 6px;
    }

    .entry-content li {
      margin-bottom: 4px;
      line-height: 1.5;
    }

    /* Skills Section */
    .skills-container {
      text-align: center;
      line-height: 1.8;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px 8px;
    }

    .skill-item {
      display: inline-block;
      padding: 3px 8px;
      background: #f9fafb;
      border-radius: 4px;
      font-size: ${baseFontSize}px;
      color: var(--text);
    }

    .skill-item:not(:last-child):after {
      content: "•";
      margin-left: 12px;
      color: var(--divider);
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
      margin-top: 12px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 6px;
    }

    .metric-item {
      text-align: center;
      padding: 8px;
    }

    .metric-value {
      font-size: ${Math.round(baseFontSize * 1.4)}px;
      font-weight: 700;
      color: var(--accent);
      line-height: 1.2;
    }

    .metric-label {
      font-size: ${Math.round(baseFontSize * 0.8)}px;
      color: var(--text-light);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 4px;
    }

    /* Social Links */
    .social-links {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 8px;
    }

    .social-link {
      font-size: ${subheadingFontSize}px;
      color: var(--text-light);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .social-link:hover {
      color: var(--accent);
    }

    /* Print Styles */
    @media print {
      body {
        padding: 30px 30px 20px 30px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .container {
        width: 100%;
        max-width: none;
      }
      
      .section {
        page-break-inside: avoid;
      }
      
      .entry {
        page-break-inside: avoid;
      }
      
      header {
        border-bottom-width: 1px;
      }
    }

    /* Responsive */
    @media screen and (max-width: 600px) {
      body {
        padding: 20px;
      }
      
      .entry-header {
        flex-direction: column;
      }
      
      .entry-subtitle {
        flex-direction: column;
      }
      
      .contact-info {
        flex-direction: column;
        align-items: center;
      }
      
      .contact-info span:not(:last-child):after {
        content: "";
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header data-section="personal">
      <h1 class="name">${escapeHtml(data.personal?.name || "Your Name")}</h1>
      ${data.personal?.title
        ? `<div class="title">${escapeHtml(data.personal.title)}</div>`
        : ""}
      <div class="contact-info" data-section="contact">
        ${data.personal?.location ||
        data.personal?.city ||
        data.personal?.country ||
        data.personal?.pinCode ||
        data.personal?.fullAddress
        ? `<span data-section="contact">${[
            data.personal?.location,
            data.personal?.city,
            data.personal?.country,
            data.personal?.pinCode,
            data.personal?.fullAddress,
        ]
            .filter(Boolean)
            .join(", ")}</span>`
        : ""}
        ${data.personal?.phone
        ? `<span data-section="contact">${escapeHtml(data.personal.phone)}</span>`
        : ""}
        ${data.personal?.alternatePhone
        ? `<span data-section="contact">${escapeHtml(data.personal.alternatePhone)}</span>`
        : ""}
        ${data.personal?.email
        ? `<span data-section="contact"><a href="mailto:${escapeHtml(data.personal.email)}">${escapeHtml(data.personal.email)}</a></span>`
        : ""}
        ${data.personal?.linkedinUrl
        ? `<span data-section="contact"><a href="${escapeHtml(data.personal.linkedinUrl)}" target="_blank">LinkedIn</a></span>`
        : ""}
        ${data.personal?.githubUrl
        ? `<span data-section="contact"><a href="${escapeHtml(data.personal.githubUrl)}" target="_blank">GitHub</a></span>`
        : ""}
        ${data.personal?.portfolioUrl
        ? `<span data-section="contact"><a href="${escapeHtml(data.personal.portfolioUrl)}" target="_blank">Portfolio</a></span>`
        : ""}
        ${data.personal?.personalInfoDisplay === "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dateOfBirth ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality)
        ? `
        ${data.personal?.fathersName
            ? `<span data-section="contact">Father: ${escapeHtml(data.personal.fathersName)}</span>`
            : ""}
        ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<span data-section="contact">DOB: ${escapeHtml(data.personal?.dateOfBirth || data.personal?.dob)}</span>`
            : ""}
        ${data.personal?.gender
            ? `<span data-section="contact">Gender: ${escapeHtml(data.personal.gender)}</span>`
            : ""}
        ${data.personal?.maritalStatus
            ? `<span data-section="contact">Marital: ${escapeHtml(data.personal.maritalStatus)}</span>`
            : ""}
        ${data.personal?.nationality
            ? `<span data-section="contact">Nationality: ${escapeHtml(data.personal.nationality)}</span>`
            : ""}
        `
        : ""}
      </div>
    </header>

    ${data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dateOfBirth ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality ||
            data.personal?.passportNo)
        ? `
    <div class="section" data-section="personal">
      <div class="section-header"><div class="section-title">Personal Details</div></div>
      <div class="skills-container">
        ${data.personal?.fathersName
            ? `<span class="skill-item">Father: ${escapeHtml(data.personal.fathersName)}</span>`
            : ""}
        ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<span class="skill-item">DOB: ${escapeHtml(data.personal?.dateOfBirth || data.personal?.dob)}</span>`
            : ""}
        ${data.personal?.gender
            ? `<span class="skill-item">Gender: ${escapeHtml(data.personal.gender)}</span>`
            : ""}
        ${data.personal?.maritalStatus
            ? `<span class="skill-item">Marital: ${escapeHtml(data.personal.maritalStatus)}</span>`
            : ""}
        ${data.personal?.nationality
            ? `<span class="skill-item">Nationality: ${escapeHtml(data.personal.nationality)}</span>`
            : ""}
        ${data.personal?.passportNo
            ? `<span class="skill-item">Passport: ${escapeHtml(data.personal.passportNo)}</span>`
            : ""}
      </div>
    </div>`
        : ""}

    ${data.sectionVisibility?.summary !== false && data.summary
        ? `
    <div class="section" data-section="summary">
      <div class="section-header"><div class="section-title">Summary</div></div>
      <div class="entry-content">${data.summary}</div>
    </div>`
        : ""}

    ${typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
        ? `
    <div class="section" data-section="careerObjective">
      <div class="section-header"><div class="section-title">Career Objective</div></div>
      <div class="entry-content">${data.careerObjective}</div>
    </div>`
        : ""}

    ${data.sectionVisibility?.experience !== false &&
        sortedExperience.length > 0
        ? `
    <div class="section" data-section="experience">
      <div class="section-header"><div class="section-title">Work Experience</div></div>
      ${sortedExperience
            .map((exp, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(exp.title || "")}</span>
            <span class="entry-date">${formatDate(exp.startDate || "")} — ${exp.endDate ? formatDate(exp.endDate) : "Present"}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(exp.company || "")}${exp.domain ? ` | ${escapeHtml(exp.domain)}` : ""}</span>
            <span class="entry-location">${escapeHtml(exp.location || "")}</span>
          </div>
          ${exp.description
            ? `<div class="entry-content"><ul>${exp.description
                .split("\n")
                .filter((line) => line.trim())
                .map((line) => `<li>${escapeHtml(line.trim())}</li>`)
                .join("")}</ul></div>`
            : ""}
          ${exp.achievements
            ? `<div class="entry-content"><strong>Key Achievements:</strong> ${escapeHtml(exp.achievements)}</div>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${internships && internships.length > 0
        ? `
    <div class="section" data-section="internships">
      <div class="section-header"><div class="section-title">Internships</div></div>
      ${internships
            .map((item, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.title || "")}</span>
            <span class="entry-date">${formatDate(item.startDate || "")} — ${item.endDate ? formatDate(item.endDate) : ""}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.company || "")}</span>
            <span class="entry-location">${escapeHtml(item.location || "")}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${data.sectionVisibility?.education !== false && data.education?.length > 0
        ? `
    <div class="section" data-section="education">
      <div class="section-header"><div class="section-title">Education</div></div>
      ${data.education
            .map((edu, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(edu.school || "")}</span>
            <span class="entry-date">${formatDate(edu.graduationDate || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span>${escapeHtml(edu.degree || "")}${edu.field ? `, ${escapeHtml(edu.field)}` : ""}${edu.qualification ? ` (${escapeHtml(edu.qualification)})` : ""}</span>
            <span class="entry-location">${escapeHtml(edu.location || "")}</span>
          </div>
          ${edu.cgpa || edu.gpa
            ? `<div class="entry-content">CGPA: ${escapeHtml(edu.cgpa || edu.gpa)}</div>`
            : ""}
          ${edu.description
            ? `<div class="entry-content">${escapeHtml(edu.description)}</div>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${skills.length > 0
        ? `
    <div class="section" data-section="skills">
      <div class="section-header"><div class="section-title">Skills</div></div>
      <div class="skills-container">
        ${skills
            .map((skill, index) => `
          <span class="skill-item" data-index="${index}">${escapeHtml(skill.name)}</span>
        `)
            .join("")}
      </div>
    </div>`
        : ""}

    ${data.sectionVisibility?.certifications !== false &&
        certifications.length > 0
        ? `
    <div class="section" data-section="certifications">
      <div class="section-header"><div class="section-title">Certifications</div></div>
      ${certifications
            .map((cert, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(cert.name)}</span>
            <span class="entry-date">${cert.date}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(cert.issuer)}</span>
          </div>
          ${cert.url
            ? `<div class="entry-content"><a href="${escapeHtml(cert.url)}" target="_blank" style="color: var(--accent);">View Certificate</a></div>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${data.sectionVisibility?.projects !== false && data.projects?.length > 0
        ? `
    <div class="section" data-section="projects">
      <div class="section-header"><div class="section-title">Projects</div></div>
      ${data.projects
            .map((project, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(project.name || "")}</span>
            <span class="entry-date">${formatDate(project.startDate || "")} ${project.endDate ? `— ${formatDate(project.endDate)}` : ""}</span>
          </div>
          <div class="entry-subtitle">
            <span>${escapeHtml(project.technologies || "")}</span>
          </div>
          ${project.description
            ? `<div class="entry-content">${escapeHtml(project.description)}</div>`
            : ""}
          ${project.url
            ? `<div class="entry-content"><a href="${escapeHtml(project.url)}" target="_blank" style="color: var(--accent);">${project.urlText || "View Project"}</a></div>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${data.sectionVisibility?.awards !== false && data.awards?.length > 0
        ? `
    <div class="section" data-section="awards">
      <div class="section-header"><div class="section-title">Awards</div></div>
      ${data.awards
            .map((award, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(award.title || "")}</span>
            <span class="entry-date">${escapeHtml(award.issueYear || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(award.organization || "")}</span>
          </div>
          ${award.description
            ? `<div class="entry-content">${escapeHtml(award.description)}</div>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${academicProjects && academicProjects.length > 0
        ? `
    <div class="section" data-section="academicProjects">
      <div class="section-header"><div class="section-title">Academic Projects</div></div>
      ${academicProjects
            .map((item, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.name || item.title || "")}</span>
            <span class="entry-date">${escapeHtml(item.duration || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.institution || "")}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
          ${item.technologies
            ? `<div class="entry-content"><strong>Technologies:</strong> ${escapeHtml(item.technologies)}</div>`
            : ""}
          ${item.url
            ? `<div class="entry-content"><a href="${escapeHtml(item.url)}" target="_blank" style="color: var(--accent);">View Project</a></div>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${leadershipPositions && leadershipPositions.length > 0
        ? `
    <div class="section" data-section="leadershipPositions">
      <div class="section-header"><div class="section-title">Leadership & Positions</div></div>
      ${leadershipPositions
            .map((item, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.position || item.title || "")}</span>
            <span class="entry-date">${formatDate(item.startDate || "")} — ${item.endDate ? formatDate(item.endDate) : ""}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.organization || "")}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${trainingPrograms && trainingPrograms.length > 0
        ? `
    <div class="section" data-section="trainingPrograms">
      <div class="section-header"><div class="section-title">Training Programs</div></div>
      ${trainingPrograms
            .map((item, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.name || "")}</span>
            <span class="entry-date">${formatDate(item.completionDate || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.provider || item.organization || "")}</span>
            ${item.duration
            ? `<span class="entry-location">${escapeHtml(item.duration)}</span>`
            : ""}
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${scholarships && scholarships.length > 0
        ? `
    <div class="section" data-section="scholarships">
      <div class="section-header"><div class="section-title">Scholarships</div></div>
      ${scholarships
            .map((item, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.name || "")}</span>
            <span class="entry-date">${escapeHtml(item.year || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.provider || item.organization || "")}</span>
            ${item.amount
            ? `<span class="entry-location">${escapeHtml(item.amount)}</span>`
            : ""}
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${coCurricular && coCurricular.length > 0
        ? `
    <div class="section" data-section="coCurricular">
      <div class="section-header"><div class="section-title">Co-curricular Activities</div></div>
      ${coCurricular
            .map((item, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.activity || "")}</span>
            <span class="entry-date">${item.year ||
            (item.startDate ? `${formatDate(item.startDate)} — ${formatDate(item.endDate || "")}` : "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.organization || "")}</span>
            ${item.role
            ? `<span class="entry-location">${escapeHtml(item.role)}</span>`
            : ""}
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${extracurricular && extracurricular.length > 0
        ? `
    <div class="section" data-section="extracurricular">
      <div class="section-header"><div class="section-title">Extracurricular Activities</div></div>
      ${extracurricular
            .map((item, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.activity || "")}</span>
            <span class="entry-date">${item.year ||
            (item.startDate ? `${formatDate(item.startDate)} — ${formatDate(item.endDate || "")}` : "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.organization || "")}</span>
            ${item.role
            ? `<span class="entry-location">${escapeHtml(item.role)}</span>`
            : ""}
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${data.keyAchievements &&
        data.keyAchievements.filter((a) => a && a.trim()).length > 0
        ? `
    <div class="section" data-section="keyAchievements">
      <div class="section-header"><div class="section-title">Key Achievements</div></div>
      ${data.keyAchievements
            .map((achievement, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-content">• ${escapeHtml(achievement.trim())}</div>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${(Array.isArray(data.responsibilities)
        ? data.responsibilities
        : (data.responsibilities || "").split("\n")).filter((line) => line && line.trim()).length > 0
        ? `
    <div class="section" data-section="responsibilities">
      <div class="section-header"><div class="section-title">Key Responsibilities</div></div>
      ${(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n"))
            .filter((line) => line.trim())
            .map((line, index) => `
        <div class="entry" data-index="${index}">
          <div class="entry-content">• ${escapeHtml(line.trim())}</div>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    ${(Array.isArray(data.tools)
        ? data.tools
        : (data.tools || "").split(",")).filter((t) => t && (typeof t === "string" ? t.trim() : t)).length >
        0
        ? `
    <div class="section" data-section="tools">
      <div class="section-header"><div class="section-title">Tools & Technologies</div></div>
      <div class="skills-container">
        ${(Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split(","))
            .map((tool, index) => `
          <span class="skill-item" data-index="${index}">${typeof tool === "string"
            ? escapeHtml(tool.trim())
            : escapeHtml(String(tool))}</span>
        `)
            .join("")}
      </div>
    </div>`
        : ""}

    ${data.sectionVisibility?.languages !== false && data.languages?.length > 0
        ? `
    <div class="section" data-section="languages">
      <div class="section-header"><div class="section-title">Languages</div></div>
      <div class="skills-container">
        ${data.languages
            .map((lang, index) => `
          <span class="skill-item" data-index="${index}">${escapeHtml(lang.language || lang)}${lang.level ? ` (${escapeHtml(lang.level)})` : ""}${lang.capability ? ` - ${escapeHtml(lang.capability)}` : ""}</span>
        `)
            .join("")}
      </div>
    </div>`
        : ""}

    ${data.sectionVisibility?.hobbies !== false && data.hobbies?.length > 0
        ? `
    <div class="section" data-section="hobbies">
      <div class="section-header"><div class="section-title">Hobbies</div></div>
      <div class="skills-container">
        ${(Array.isArray(data.hobbies)
            ? data.hobbies
            : (data.hobbies || "").split(","))
            .map((hobby, index) => `
          <span class="skill-item" data-index="${index}">${typeof hobby === "string"
            ? escapeHtml(hobby.trim())
            : escapeHtml(String(hobby))}</span>
        `)
            .join("")}
      </div>
    </div>`
        : ""}

    ${data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks?.length > 0
        ? `
    <div class="section" data-section="socialLinks">
      <div class="section-header"><div class="section-title">Links</div></div>
      <div class="social-links">
        ${data.socialLinks
            .map((link, index) => `
          <a class="social-link" href="${escapeHtml(link.url)}" target="_blank" data-index="${index}">${escapeHtml(link.urlText || link.url.replace(/^https?:\/\//, ""))}</a>
        `)
            .join("")}
      </div>
    </div>`
        : ""}

    ${data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section) => section.isVisible)
            .map((section, sectionIndex) => {
            const heading = section.heading || "Custom Section";
            return `
    <div class="section" data-section="custom-${sectionIndex}">
      <div class="section-header"><div class="section-title">${escapeHtml(heading)}</div></div>
      ${section.entries
                .filter((entry) => entry.isVisible)
                .map((entry, entryIndex) => `
        <div class="entry" data-index="${entryIndex}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(entry.title || "")}</span>
            ${entry.date
                ? `<span class="entry-date">${escapeHtml(entry.date)}</span>`
                : ""}
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(entry.organization || "")}</span>
          </div>
          ${entry.description
                ? `<div class="entry-content">${escapeHtml(entry.description)}</div>`
                : ""}
        </div>
      `)
                .join("")}
    </div>
    `;
        })
            .join("")
        : ""}
  </div>
</body>
</html>`;
}
