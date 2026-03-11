export function buildNebulaTemplate(data: any, theme?: any): string {
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
  const userFontFamily =
    data.formatting?.fontFamily || data.fontFamily || defaultTheme.bodyFont;

  const baseFontSize = userFontSize;
  const headingFontSize = Math.round(userFontSize * 2.2);
  const subheadingFontSize = Math.round(userFontSize * 0.9);

  // Utility functions
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const escapeHtml = (text: string): string => {
    if (typeof text !== "string") return "";
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "<",
      ">": ">",
      '"': "",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  };

  const isEmpty = (value: any): boolean => {
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object")
      return value === null || Object.keys(value).length === 0;
    return !value || value === "undefined";
  };

  // Sort experience reverse chronological
  const sortedExperience = data.experience
    ? [...data.experience].sort(
        (a: any, b: any) =>
          new Date(b.startDate || "1900-01-01").getTime() -
          new Date(a.startDate || "1900-01-01").getTime()
      )
    : [];

  // Process skills
  const processSkills = (): any[] => {
    if (!data.skills) return [];
    if (Array.isArray(data.skills)) {
      return data.skills
        .slice(0, 15)
        .map((s: any) =>
          typeof s === "string"
            ? { name: s.trim(), level: undefined }
            : { name: s.name || "", level: s.level }
        );
    }
    if (typeof data.skills === "string" && data.skills.includes("<ul>")) {
      const matches = data.skills.match(/<li>(.*?)<\/li>/g);
      if (matches) {
        return matches.map(m => ({ name: m.replace(/<\/?li>/g, '').trim() }));
      }
    }
    return data.skills
      .split(",")
      .slice(0, 15)
      .map((s: string) => ({ name: s.trim() }));
  };

  // Process certifications
  const processCertifications = (): any[] => {
    if (!data.certifications || !Array.isArray(data.certifications)) return [];
    return data.certifications
      .filter((c: any) => c && c.name)
      .map((c: any) => ({
        name: c.name,
        issuer: c.issuer || "",
        date: formatDate(c.date || c.issueDate),
        url: c.url || "",
        description: c.description || "",
      }));
  };

  const certifications = processCertifications();
  const skills = processSkills();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.personal?.name || "Resume")}</title>
  <meta name="description" content="Professional resume for ${escapeHtml(
    data.personal?.name || "Operations Support"
  )}">
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
      flex-wrap: wrap;
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

    /* Two Column Grid */
    .two-column-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 10px;
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
      
      .two-column-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header data-section="personal">
      <h1 class="name">${escapeHtml(data.personal?.name || "Your Name")}${data.personal?.middleName ? ` ${escapeHtml(data.personal.middleName)}` : ""}</h1>
      ${
        data.personal?.title
          ? `<div class="title">${escapeHtml(data.personal.title)}</div>`
          : ""
      }
      <div class="contact-info" data-section="contact">
        ${
          data.personal?.location ||
          data.personal?.city ||
          data.personal?.country ||
          data.personal?.pinCode ||
          data.personal?.fullAddress
            ? `<span data-section="contact">📍 ${[
                data.personal?.location,
                data.personal?.city,
                data.personal?.country,
                data.personal?.pinCode,
                data.personal?.fullAddress,
              ]
                .filter(Boolean)
                .join(", ")}</span>`
            : ""
        }
        ${
          data.personal?.phone
            ? `<span data-section="contact">📞 ${escapeHtml(
                data.personal.phone
              )}</span>`
            : ""
        }
        ${
          data.personal?.alternatePhone
            ? `<span data-section="contact">📞 ${escapeHtml(
                data.personal.alternatePhone
              )}</span>`
            : ""
        }
        ${
          data.personal?.email
            ? `<span data-section="contact">✉️ <a href="mailto:${escapeHtml(
                data.personal.email
              )}">${escapeHtml(data.personal.email)}</a></span>`
            : ""
        }
        ${
          data.personal?.linkedinUrl
            ? `<span data-section="contact"><a href="${escapeHtml(
                data.personal.linkedinUrl
              )}" target="_blank">LinkedIn</a></span>`
            : ""
        }
        ${
          data.personal?.githubUrl
            ? `<span data-section="contact"><a href="${escapeHtml(
                data.personal.githubUrl
              )}" target="_blank">GitHub</a></span>`
            : ""
        }
        ${
          data.personal?.portfolioUrl
            ? `<span data-section="contact"><a href="${escapeHtml(
                data.personal.portfolioUrl
              )}" target="_blank">Portfolio</a></span>`
            : ""
        }
      </div>
    </header>

    <!-- Professional Context -->
    ${
      data.professionalContext && Object.values(data.professionalContext).some(v => v)
        ? `
    <div class="section" data-section="professionalContext">
      <div class="metrics-grid">
        ${data.professionalContext.totalExperience ? `
        <div class="metric-item">
          <div class="metric-value">${escapeHtml(data.professionalContext.totalExperience)}</div>
          <div class="metric-label">Total Experience</div>
        </div>` : ''}
        ${data.professionalContext.teamSize ? `
        <div class="metric-item">
          <div class="metric-value">${escapeHtml(data.professionalContext.teamSize)}</div>
          <div class="metric-label">Team Size</div>
        </div>` : ''}
        ${data.professionalContext.industry ? `
        <div class="metric-item">
          <div class="metric-value">${escapeHtml(data.professionalContext.industry)}</div>
          <div class="metric-label">Industry</div>
        </div>` : ''}
        ${data.professionalContext.functionalDomain ? `
        <div class="metric-item">
          <div class="metric-value">${escapeHtml(data.professionalContext.functionalDomain)}</div>
          <div class="metric-label">Domain</div>
        </div>` : ''}
      </div>
    </div>`
        : ""
    }

    <!-- Personal Details (if not inline) -->
    ${
      data.personal?.personalInfoDisplay !== "inline" &&
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
        ${
          data.personal?.fathersName
            ? `<span class="skill-item">Father: ${escapeHtml(
                data.personal.fathersName
              )}</span>`
            : ""
        }
        ${
          data.personal?.dateOfBirth || data.personal?.dob
            ? `<span class="skill-item">DOB: ${escapeHtml(
                data.personal?.dateOfBirth || data.personal?.dob
              )}</span>`
            : ""
        }
        ${
          data.personal?.gender
            ? `<span class="skill-item">Gender: ${escapeHtml(
                data.personal.gender
              )}</span>`
            : ""
        }
        ${
          data.personal?.maritalStatus
            ? `<span class="skill-item">Marital: ${escapeHtml(
                data.personal.maritalStatus
              )}</span>`
            : ""
        }
        ${
          data.personal?.nationality
            ? `<span class="skill-item">Nationality: ${escapeHtml(
                data.personal.nationality
              )}</span>`
            : ""
        }
        ${
          data.personal?.passportNo
            ? `<span class="skill-item">Passport: ${escapeHtml(
                data.personal.passportNo
              )}</span>`
            : ""
        }
      </div>
    </div>`
        : ""
    }

    <!-- Summary -->
    ${
      data.sectionVisibility?.summary !== false && data.summary
        ? `
    <div class="section" data-section="summary">
      <div class="section-header"><div class="section-title">Summary</div></div>
      <div class="entry-content">${data.summary}</div>
    </div>`
        : ""
    }

    <!-- Career Objective -->
    ${
      typeof data.careerObjective === "string" &&
      data.careerObjective.trim().length > 0
        ? `
    <div class="section" data-section="careerObjective">
      <div class="section-header"><div class="section-title">Career Objective</div></div>
      <div class="entry-content">${data.careerObjective}</div>
    </div>`
        : ""
    }

    <!-- Work Experience -->
    ${
      data.sectionVisibility?.experience !== false &&
      sortedExperience.length > 0
        ? `
    <div class="section" data-section="experience">
      <div class="section-header"><div class="section-title">Work Experience</div></div>
      ${sortedExperience
        .map(
          (exp: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(exp.title || "")}</span>
            <span class="entry-date">${formatDate(exp.startDate || "")} — ${
            exp.endDate ? formatDate(exp.endDate) : "Present"
          }</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(exp.company || "")}${
            exp.location ? ` | ${escapeHtml(exp.location)}` : ""
          }</span>
          </div>
          ${
            exp.description
              ? `<div class="entry-content">${exp.description}</div>`
              : ""
          }
          ${
            exp.achievements
              ? `<div class="entry-content"><strong>Key Achievements:</strong> ${escapeHtml(
                  exp.achievements
                )}</div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Internships -->
    ${
      data.internships && data.internships.length > 0
        ? `
    <div class="section" data-section="internships">
      <div class="section-header"><div class="section-title">Internships</div></div>
      ${data.internships
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.title || "")}</span>
            <span class="entry-date">${escapeHtml(item.duration || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.company || "")}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Training Programs -->
    ${
      data.trainingPrograms && data.trainingPrograms.length > 0
        ? `
    <div class="section" data-section="trainingPrograms">
      <div class="section-header"><div class="section-title">Training Programs</div></div>
      ${data.trainingPrograms
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.name || "")}</span>
            <span class="entry-date">${formatDate(item.completionDate || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.provider || item.organization || "")}</span>
            ${item.duration ? `<span class="entry-location">${escapeHtml(item.duration)}</span>` : ""}
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Education -->
    ${
      data.sectionVisibility?.education !== false && data.education?.length > 0
        ? `
    <div class="section" data-section="education">
      <div class="section-header"><div class="section-title">Education</div></div>
      ${data.education
        .map(
          (edu: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(edu.degree || "")}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}</span>
            <span class="entry-date">${edu.graduationDate || ""}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(edu.school || "")}${edu.location ? `, ${escapeHtml(edu.location)}` : ""}</span>
          </div>
          ${edu.grade ? `<div class="entry-content">Grade: ${escapeHtml(edu.grade)}</div>` : ""}
          ${edu.description ? `<div class="entry-content">${escapeHtml(edu.description)}</div>` : ""}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Academic Projects -->
    ${
      data.academicProjects && data.academicProjects.length > 0
        ? `
    <div class="section" data-section="academicProjects">
      <div class="section-header"><div class="section-title">Academic Projects</div></div>
      ${data.academicProjects
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.name || item.title || "")}</span>
            <span class="entry-date">${escapeHtml(item.duration || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.institution || "")}${item.course ? ` | Course: ${escapeHtml(item.course)}` : ""}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
          ${
            item.technologies && item.technologies.length > 0
              ? `<div class="entry-content"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.map((t: string) => escapeHtml(t)).join(', ') : escapeHtml(item.technologies)}</div>`
              : ""
          }
          ${
            item.url
              ? `<div class="entry-content"><a href="${escapeHtml(item.url)}" target="_blank" style="color: var(--accent);">View Project</a></div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Client Projects -->
    ${
      data.clientProjects && data.clientProjects.length > 0
        ? `
    <div class="section" data-section="clientProjects">
      <div class="section-header"><div class="section-title">Client Projects</div></div>
      ${data.clientProjects
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.name || "")}</span>
            <span class="entry-date">${escapeHtml(item.duration || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.clientOrganization || "")}${item.role ? ` | Role: ${escapeHtml(item.role)}` : ""}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
          ${
            item.toolsTechnologies
              ? `<div class="entry-content"><strong>Tools:</strong> ${escapeHtml(item.toolsTechnologies)}</div>`
              : ""
          }
          ${
            item.projectUrl
              ? `<div class="entry-content"><a href="${escapeHtml(item.projectUrl)}" target="_blank" style="color: var(--accent);">View Project</a></div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Portfolio -->
    ${
      data.portfolio && data.portfolio.length > 0
        ? `
    <div class="section" data-section="portfolio">
      <div class="section-header"><div class="section-title">Portfolio</div></div>
      ${data.portfolio
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.name || "")}</span>
            <span class="entry-date">${escapeHtml(item.type || "")}${item.platform ? ` | ${escapeHtml(item.platform)}` : ""}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
          ${
            item.url
              ? `<div class="entry-content"><a href="${escapeHtml(item.url)}" target="_blank" style="color: var(--accent);">View Portfolio</a></div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Leadership Positions -->
    ${
      data.leadershipPositions && data.leadershipPositions.length > 0
        ? `
    <div class="section" data-section="leadershipPositions">
      <div class="section-header"><div class="section-title">Leadership & Positions</div></div>
      ${data.leadershipPositions
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.position || item.title || "")}</span>
            <span class="entry-date">${formatDate(item.startDate || "")} — ${
            item.endDate ? formatDate(item.endDate) : ""
          }</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.organization || "")}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Volunteering -->
    ${
      data.volunteering && data.volunteering.length > 0
        ? `
    <div class="section" data-section="volunteering">
      <div class="section-header"><div class="section-title">Volunteering</div></div>
      ${data.volunteering
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.role || "")}</span>
            <span class="entry-date">${escapeHtml(item.duration || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.organization || "")}${item.causeArea ? ` | ${escapeHtml(item.causeArea)}` : ""}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Military Service -->
    ${
      data.militaryService && data.militaryService.length > 0
        ? `
    <div class="section" data-section="militaryService">
      <div class="section-header"><div class="section-title">Military Service</div></div>
      ${data.militaryService
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.rank || "")} - ${escapeHtml(item.branch || "")}</span>
            <span class="entry-date">${escapeHtml(item.duration || "")}</span>
          </div>
          ${item.specialization ? `<div class="entry-subtitle">${escapeHtml(item.specialization)}</div>` : ""}
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Teaching Experience -->
    ${
      data.teachingExperience && data.teachingExperience.length > 0
        ? `
    <div class="section" data-section="teachingExperience">
      <div class="section-header"><div class="section-title">Teaching Experience</div></div>
      ${data.teachingExperience
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.title || "")}</span>
            <span class="entry-date">${escapeHtml(item.duration || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.institution || "")}${item.subjectCourseTaught ? ` | ${escapeHtml(item.subjectCourseTaught)}` : ""}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Mentorship Experience -->
    ${
      data.mentorshipExperience && data.mentorshipExperience.length > 0
        ? `
    <div class="section" data-section="mentorshipExperience">
      <div class="section-header"><div class="section-title">Mentorship Experience</div></div>
      ${data.mentorshipExperience
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.mentorshipArea || "")}</span>
            <span class="entry-date">${escapeHtml(item.duration || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.organizationPlatform || "")}${item.menteeLevel ? ` | Mentee Level: ${escapeHtml(item.menteeLevel)}` : ""}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Research Grants -->
    ${
      data.researchGrants && data.researchGrants.length > 0
        ? `
    <div class="section" data-section="researchGrants">
      <div class="section-header"><div class="section-title">Research Grants</div></div>
      ${data.researchGrants
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.title || "")}</span>
            <span class="entry-date">${escapeHtml(item.year || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.agency || "")}${item.amount ? ` | Amount: ${escapeHtml(item.amount)}` : ""}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Publications -->
    ${
      data.publications && data.publications.length > 0
        ? `
    <div class="section" data-section="publications">
      <div class="section-header"><div class="section-title">Publications</div></div>
      ${data.publications
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.title || "")}</span>
            <span class="entry-date">${escapeHtml(item.year || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.journalPublisher || "")}${item.publicationType ? ` | ${escapeHtml(item.publicationType)}` : ""}</span>
          </div>
          ${item.authors ? `<div class="entry-content"><strong>Authors:</strong> ${escapeHtml(item.authors)}</div>` : ""}
          ${
            item.urlDoi
              ? `<div class="entry-content"><a href="${escapeHtml(item.urlDoi)}" target="_blank" style="color: var(--accent);">View Publication</a></div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Patents -->
    ${
      data.patents && data.patents.length > 0
        ? `
    <div class="section" data-section="patents">
      <div class="section-header"><div class="section-title">Patents</div></div>
      ${data.patents
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.title || "")}</span>
            <span class="entry-date">${escapeHtml(item.year || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.patentNumber || "")}${item.issuingAuthority ? ` | ${escapeHtml(item.issuingAuthority)}` : ""}</span>
          </div>
          <div class="entry-content"><strong>Status:</strong> ${escapeHtml(item.status || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Test Scores -->
    ${
      data.testScores && data.testScores.length > 0
        ? `
    <div class="section" data-section="testScores">
      <div class="section-header"><div class="section-title">Test Scores</div></div>
      ${data.testScores
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.testName || "")}</span>
            <span class="entry-date">${escapeHtml(item.year || "")}</span>
          </div>
          <div class="entry-content">
            <strong>Score:</strong> ${escapeHtml(item.score || "")}${item.percentileRank ? ` (${escapeHtml(item.percentileRank)} percentile)` : ""}
          </div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Skills -->
    ${
      skills.length > 0
        ? `
    <div class="section" data-section="skills">
      <div class="section-header"><div class="section-title">Skills</div></div>
      <div class="skills-container">
        ${skills
          .map(
            (skill: any, index: number) => `
          <span class="skill-item" data-index="${index}">${escapeHtml(
              skill.name
            )}${skill.level ? ` (${escapeHtml(skill.level)})` : ""}</span>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Tools & Technologies -->
    ${
      data.toolsTechnologies && data.toolsTechnologies.length > 0
        ? `
    <div class="section" data-section="toolsTechnologies">
      <div class="section-header"><div class="section-title">Tools & Technologies</div></div>
      <div class="skills-container">
        ${data.toolsTechnologies
          .map(
            (item: any, index: number) => `
          <span class="skill-item" data-index="${index}">${escapeHtml(item.name || "")}${item.proficiency ? ` (${escapeHtml(item.proficiency)})` : ""}${item.experienceDuration ? ` - ${escapeHtml(item.experienceDuration)}` : ""}</span>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Methodologies -->
    ${
      data.methodologies && data.methodologies.length > 0
        ? `
    <div class="section" data-section="methodologies">
      <div class="section-header"><div class="section-title">Methodologies</div></div>
      <div class="skills-container">
        ${data.methodologies
          .map(
            (item: any, index: number) => `
          <span class="skill-item" data-index="${index}">${escapeHtml(item.name || "")}${item.certification ? ` (${escapeHtml(item.certification)})` : ""}${item.experienceDuration ? ` - ${escapeHtml(item.experienceDuration)} years` : ""}</span>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Industry Expertise -->
    ${
      data.industryExpertise && data.industryExpertise.length > 0
        ? `
    <div class="section" data-section="industryExpertise">
      <div class="section-header"><div class="section-title">Industry Expertise</div></div>
      <div class="skills-container">
        ${data.industryExpertise
          .map(
            (item: any, index: number) => `
          <span class="skill-item" data-index="${index}">${escapeHtml(item.industry || "")}${item.domainArea ? ` - ${escapeHtml(item.domainArea)}` : ""}${item.experienceDuration ? ` (${escapeHtml(item.experienceDuration)} years)` : ""}</span>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Certifications -->
    ${
      data.sectionVisibility?.certifications !== false &&
      certifications.length > 0
        ? `
    <div class="section" data-section="certifications">
      <div class="section-header"><div class="section-title">Certifications</div></div>
      ${certifications
        .map(
          (cert: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(cert.name)}</span>
            <span class="entry-date">${cert.date}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(cert.issuer)}</span>
          </div>
          ${
            cert.url
              ? `<div class="entry-content"><a href="${escapeHtml(
                  cert.url
                )}" target="_blank" style="color: var(--accent);">View Certificate</a></div>`
              : ""
          }
          ${cert.description ? `<div class="entry-content">${escapeHtml(cert.description)}</div>` : ""}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Languages -->
    ${
      data.sectionVisibility?.languages !== false && data.languages?.length > 0
        ? `
    <div class="section" data-section="languages">
      <div class="section-header"><div class="section-title">Languages</div></div>
      <div class="skills-container">
        ${data.languages
          .map(
            (lang: any, index: number) => `
          <span class="skill-item" data-index="${index}">${escapeHtml(
              lang.language || lang
            )}${lang.level ? ` (${escapeHtml(lang.level)})` : ""}${
              lang.capability ? ` - ${escapeHtml(lang.capability)}` : ""
            }</span>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Scholarships -->
    ${
      data.scholarships && data.scholarships.length > 0
        ? `
    <div class="section" data-section="scholarships">
      <div class="section-header"><div class="section-title">Scholarships</div></div>
      ${data.scholarships
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.name || "")}</span>
            <span class="entry-date">${escapeHtml(item.year || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.provider || item.organization || "")}</span>
            ${item.amount ? `<span class="entry-location">${escapeHtml(item.amount)}</span>` : ""}
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Awards -->
    ${
      data.sectionVisibility?.awards !== false && data.awards?.length > 0
        ? `
    <div class="section" data-section="awards">
      <div class="section-header"><div class="section-title">Awards</div></div>
      ${data.awards
        .map(
          (award: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(award.title || "")}</span>
            <span class="entry-date">${escapeHtml(award.issueYear || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(award.organization || "")}</span>
          </div>
          ${
            award.description
              ? `<div class="entry-content">${escapeHtml(award.description)}</div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Speaking Engagements -->
    ${
      data.speakingEngagements && data.speakingEngagements.length > 0
        ? `
    <div class="section" data-section="speakingEngagements">
      <div class="section-header"><div class="section-title">Speaking Engagements</div></div>
      ${data.speakingEngagements
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.topic || "")}</span>
            <span class="entry-date">${escapeHtml(item.date || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.eventName || "")}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Memberships -->
    ${
      data.memberships && data.memberships.length > 0
        ? `
    <div class="section" data-section="memberships">
      <div class="section-header"><div class="section-title">Memberships</div></div>
      ${data.memberships
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.membershipName || "")}</span>
            <span class="entry-date">${escapeHtml(item.year || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.organizationName || "")}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Workshops -->
    ${
      data.workshops && data.workshops.length > 0
        ? `
    <div class="section" data-section="workshops">
      <div class="section-header"><div class="section-title">Workshops</div></div>
      ${data.workshops
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.programTitle || "")}</span>
            <span class="entry-date">${escapeHtml(item.year || "")}</span>
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(item.conductedBy || "")}</span>
          </div>
          <div class="entry-content">${escapeHtml(item.description || "")}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Co-curricular Activities -->
    ${
      data.coCurricular && data.coCurricular.length > 0
        ? `
    <div class="section" data-section="coCurricular">
      <div class="section-header"><div class="section-title">Co-curricular Activities</div></div>
      ${data.coCurricular
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.activity || "")}</span>
            <span class="entry-date">${escapeHtml(item.year || "")}</span>
          </div>
          ${item.role ? `<div class="entry-subtitle">Role: ${escapeHtml(item.role)}</div>` : ""}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Extracurricular Activities -->
    ${
      data.extracurricular && data.extracurricular.length > 0
        ? `
    <div class="section" data-section="extracurricular">
      <div class="section-header"><div class="section-title">Extracurricular Activities</div></div>
      ${data.extracurricular
        .map(
          (item: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(item.activity || "")}</span>
            <span class="entry-date">${escapeHtml(item.year || "")}</span>
          </div>
          ${item.role ? `<div class="entry-subtitle">Role: ${escapeHtml(item.role)}</div>` : ""}
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Key Achievements -->
    ${
      data.keyAchievements &&
      data.keyAchievements.filter((a: string) => a && a.trim()).length > 0
        ? `
    <div class="section" data-section="keyAchievements">
      <div class="section-header"><div class="section-title">Key Achievements</div></div>
      ${data.keyAchievements
        .map(
          (achievement: string, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-content">• ${escapeHtml(achievement.trim())}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Key Responsibilities -->
    ${
      (Array.isArray(data.responsibilities)
        ? data.responsibilities
        : (data.responsibilities || "").split("\n")
      ).filter((line: string) => line && line.trim()).length > 0
        ? `
    <div class="section" data-section="responsibilities">
      <div class="section-header"><div class="section-title">Key Responsibilities</div></div>
      ${(Array.isArray(data.responsibilities)
        ? data.responsibilities
        : (data.responsibilities || "").split("\n")
      )
        .filter((line: string) => line.trim())
        .map(
          (line: string, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-content">• ${escapeHtml(line.trim())}</div>
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Projects (General) -->
    ${
      data.sectionVisibility?.projects !== false && data.projects?.length > 0
        ? `
    <div class="section" data-section="projects">
      <div class="section-header"><div class="section-title">Projects</div></div>
      ${data.projects
        .map(
          (project: any, index: number) => `
        <div class="entry" data-index="${index}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(project.name || "")}</span>
            <span class="entry-date">${formatDate(project.startDate || "")} ${
            project.endDate ? `— ${formatDate(project.endDate)}` : ""
          }</span>
          </div>
          <div class="entry-subtitle">
            <span>${escapeHtml(project.technologies || "")}</span>
          </div>
          ${
            project.description
              ? `<div class="entry-content">${escapeHtml(
                  project.description
                )}</div>`
              : ""
          }
          ${
            project.url
              ? `<div class="entry-content"><a href="${escapeHtml(
                  project.url
                )}" target="_blank" style="color: var(--accent);">${
                  project.urlText || "View Project"
                }</a></div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>`
        : ""
    }

    <!-- Tools (Simple List) -->
    ${
      (Array.isArray(data.tools)
        ? data.tools
        : (data.tools || "").split(",")
      ).filter((t: any) => t && (typeof t === "string" ? t.trim() : t)).length >
      0
        ? `
    <div class="section" data-section="tools">
      <div class="section-header"><div class="section-title">Tools</div></div>
      <div class="skills-container">
        ${(Array.isArray(data.tools)
          ? data.tools
          : (data.tools || "").split(",")
        )
          .map(
            (tool: any, index: number) => `
          <span class="skill-item" data-index="${index}">${
              typeof tool === "string"
                ? escapeHtml(tool.trim())
                : escapeHtml(String(tool))
            }</span>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Hobbies -->
    ${
      data.sectionVisibility?.hobbies !== false && data.hobbies?.length > 0
        ? `
    <div class="section" data-section="hobbies">
      <div class="section-header"><div class="section-title">Hobbies</div></div>
      <div class="skills-container">
        ${(Array.isArray(data.hobbies)
          ? data.hobbies
          : (data.hobbies || "").split(",")
        )
          .map(
            (hobby: any, index: number) => `
          <span class="skill-item" data-index="${index}">${
              typeof hobby === "string"
                ? escapeHtml(hobby.trim())
                : escapeHtml(String(hobby))
            }</span>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Availability & Work Authorization -->
    ${
      data.availabilityWorkAuth && Object.values(data.availabilityWorkAuth).some(v => v)
        ? `
    <div class="section" data-section="availabilityWorkAuth">
      <div class="section-header"><div class="section-title">Availability</div></div>
      <div class="skills-container">
        ${data.availabilityWorkAuth.availabilityNoticePeriod ? `<span class="skill-item">Notice: ${escapeHtml(data.availabilityWorkAuth.availabilityNoticePeriod)}</span>` : ''}
        ${data.availabilityWorkAuth.workAuthorizationStatus ? `<span class="skill-item">Work Auth: ${escapeHtml(data.availabilityWorkAuth.workAuthorizationStatus)}</span>` : ''}
        ${data.availabilityWorkAuth.preferredLocation ? `<span class="skill-item">Preferred: ${escapeHtml(data.availabilityWorkAuth.preferredLocation)}</span>` : ''}
      </div>
    </div>`
        : ""
    }

    <!-- Social Profiles -->
    ${
      data.socialProfiles && data.socialProfiles.length > 0
        ? `
    <div class="section" data-section="socialProfiles">
      <div class="section-header"><div class="section-title">Social Profiles</div></div>
      <div class="social-links">
        ${data.socialProfiles
          .map(
            (profile: any, index: number) => `
          <a class="social-link" href="${escapeHtml(
            profile.url
          )}" target="_blank" data-index="${index}">${escapeHtml(
              profile.platform || "Profile"
            )}</a>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Social Links -->
    ${
      data.sectionVisibility?.socialLinks !== false &&
      data.socialLinks?.length > 0
        ? `
    <div class="section" data-section="socialLinks">
      <div class="section-header"><div class="section-title">Links</div></div>
      <div class="social-links">
        ${data.socialLinks
          .map(
            (link: any, index: number) => `
          <a class="social-link" href="${escapeHtml(
            link.url
          )}" target="_blank" data-index="${index}">${escapeHtml(
              link.urlText || link.url.replace(/^https?:\/\//, "")
            )}</a>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- References -->
    ${
      data.references && data.references.length > 0
        ? `
    <div class="section" data-section="references">
      <div class="section-header"><div class="section-title">References</div></div>
      <div class="two-column-grid">
        ${data.references
          .map(
            (ref: any, index: number) => `
          <div class="entry" data-index="${index}">
            <div class="entry-title">${escapeHtml(ref.name || "")}</div>
            <div class="entry-subtitle">${escapeHtml(ref.designationRelationship || "")}</div>
            <div class="entry-subtitle">${escapeHtml(ref.organization || "")}</div>
            <div class="entry-content">${escapeHtml(ref.contactInformation || "")}</div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>`
        : ""
    }

    <!-- Custom Sections -->
    ${
      data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section: any) => section.isVisible)
            .map((section: any, sectionIndex: number) => {
              const heading = section.heading || "Custom Section";
              return `
    <div class="section" data-section="custom-${sectionIndex}">
      <div class="section-header"><div class="section-title">${escapeHtml(
        heading
      )}</div></div>
      ${section.entries
        .filter((entry: any) => entry.isVisible)
        .map(
          (entry: any, entryIndex: number) => `
        <div class="entry" data-index="${entryIndex}">
          <div class="entry-header">
            <span class="entry-title">${escapeHtml(entry.title || "")}</span>
            ${
              entry.date
                ? `<span class="entry-date">${escapeHtml(entry.date)}</span>`
                : ""
            }
          </div>
          <div class="entry-subtitle">
            <span class="entry-company">${escapeHtml(
              entry.organization || ""
            )}</span>
          </div>
          ${
            entry.description
              ? `<div class="entry-content">${escapeHtml(
                  entry.description
                )}</div>`
              : ""
          }
        </div>
      `
        )
        .join("")}
    </div>
    `;
            })
            .join("")
        : ""
    }
  </div>
</body>
</html>`;
}