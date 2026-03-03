"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOperationsSupportTemplate = buildOperationsSupportTemplate;
function buildOperationsSupportTemplate(data, theme) {
    const defaultTheme = {
        primary: "#1a1a2e",
        secondary: "#16213e",
        background: "#ffffff",
        accent: "#0891b2",
        accentLight: "#22d3ee",
        headingFont: "Arial, Helvetica, sans-serif",
        bodyFont: "Arial, Helvetica, sans-serif",
    };
    const currentTheme = { ...defaultTheme, ...theme };
    // Font sizes as per spec: body 11-12pt, headings 13-15pt
    const bodyFontSize = "11pt";
    const headingFontSize = "13pt";
    const subheadingFontSize = "11pt";
    const nameFontSize = "26pt";
    const sectionTitleFontSize = "12pt";
    // Utility functions
    const formatDate = (dateStr) => {
        if (!dateStr)
            return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime()))
            return dateStr;
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };
    const isEmpty = (value) => {
        if (Array.isArray(value))
            return value.length === 0;
        if (typeof value === "object")
            return value === null || Object.keys(value).length === 0;
        return !value || value === "undefined";
    };
    const escapeHtml = (text) => {
        if (typeof text !== "string")
            return "";
        return text.replace(/[&<>"']/g, (m) => {
            switch (m) {
                case "&": return "&amp;";
                case "<": return "<";
                case ">": return ">";
                case '"': return "";
                case "'": return "&#039;";
                default: return m;
            }
        });
    };
    // Sort experience reverse chronological
    const sortedExperience = data.experience
        ? [...data.experience].sort((a, b) => new Date(b.startDate || "1900-01-01").getTime() -
            new Date(a.startDate || "1900-01-01").getTime())
        : [];
    // Filter and process skills with proficiency
    const processSkills = () => {
        if (!data.skills)
            return [];
        if (Array.isArray(data.skills)) {
            return data.skills.slice(0, 12).map((s) => typeof s === "string" ? { name: s.trim() } : { name: s.name || "", level: s.level });
        }
        return data.skills.split(",").slice(0, 12).map((s) => ({ name: s.trim() }));
    };
    // Process certifications with proper validation
    const processCertifications = () => {
        if (!data.certifications || !Array.isArray(data.certifications))
            return [];
        return data.certifications
            .filter((c) => c && c.name)
            .map((c) => ({
            name: c.name,
            issuer: c.issuer || "",
            date: formatDate(c.date || c.issueDate),
            expiryDate: formatDate(c.expiryDate),
            url: c.url || "",
            description: c.description || ""
        }));
    };
    const certifications = processCertifications();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.personal?.name || "Resume")}</title>
  <meta name="description" content="Professional resume for ${escapeHtml(data.personal?.name || "Operations Support")}">
  <style>
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --background-color: ${currentTheme.background};
      --accent-color: ${currentTheme.accent};
      --accent-light: ${currentTheme.accentLight};
      --heading-font: ${currentTheme.headingFont};
      --body-font: ${currentTheme.bodyFont};
      --sidebar-width: 280px;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--body-font);
      color: var(--primary-color);
      line-height: 1.5;
      background: #f0f2f5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .resume-container {
      max-width: 850px;
      margin: 0 auto;
      display: flex;
      background: var(--background-color);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
      min-height: 100vh;
    }

    /* Left Sidebar */
    .sidebar {
      width: var(--sidebar-width);
      background: linear-gradient(180deg, var(--accent-color) 0%, #0e7490 100%);
      color: #ffffff;
      padding: 28px 20px;
      flex-shrink: 0;
    }

    .profile-photo {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      margin: 0 auto 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 4px solid rgba(255, 255, 255, 0.25);
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-photo-placeholder {
      width: 64px;
      height: 64px;
      opacity: 0.6;
    }

    .sidebar .section {
      margin-bottom: 24px;
    }

    .sidebar .section-title {
      font-size: ${sectionTitleFontSize};
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    }

    .sidebar p, .sidebar li {
      font-size: ${bodyFontSize};
      margin-bottom: 4px;
      opacity: 0.95;
    }

    .sidebar ul {
      list-style: none;
      padding: 0;
    }

    .sidebar li {
      padding-left: 0;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .sidebar a {
      color: #ffffff;
      text-decoration: none;
      transition: opacity 0.2s ease;
    }

    .sidebar a:hover {
      opacity: 0.8;
      text-decoration: underline;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      font-size: ${subheadingFontSize};
      line-height: 1.4;
    }

    .contact-icon {
      width: 18px;
      min-width: 18px;
      margin-right: 10px;
      flex-shrink: 0;
      opacity: 0.85;
    }

    .skill-item {
      margin-bottom: 12px;
    }

    .skill-name {
      font-size: ${bodyFontSize};
      font-weight: 500;
      margin-bottom: 4px;
    }

    .skill-bar {
      background: rgba(255, 255, 255, 0.2);
      height: 5px;
      border-radius: 3px;
      overflow: hidden;
    }

    .skill-bar-fill {
      background: #ffffff;
      height: 100%;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    /* Language proficiency */
    .language-item {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .language-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .language-name {
      font-size: ${bodyFontSize};
      font-weight: 600;
      margin-bottom: 3px;
    }

    .language-level {
      font-size: ${subheadingFontSize};
      opacity: 0.85;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      padding: 28px 32px;
    }

    .header {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 3px solid var(--accent-color);
    }

    .name {
      font-size: ${nameFontSize};
      font-weight: 700;
      color: var(--accent-color);
      margin-bottom: 6px;
      letter-spacing: -0.5px;
      line-height: 1.2;
    }

    .title {
      font-size: 14pt;
      color: #555;
      font-weight: 500;
      letter-spacing: 0.3px;
    }

    .main-content .section {
      margin-bottom: 22px;
      page-break-inside: avoid;
    }

    .main-content .section-title {
      font-size: ${headingFontSize};
      font-weight: 700;
      color: var(--accent-color);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-bottom: 14px;
      padding-bottom: 6px;
      border-bottom: 2px solid var(--accent-color);
    }

    .main-content p {
      font-size: ${bodyFontSize};
      line-height: 1.6;
      color: #444;
      margin-bottom: 8px;
    }

    .main-content ul {
      margin-left: 20px;
      padding: 0;
    }

    .main-content li {
      font-size: ${bodyFontSize};
      margin-bottom: 6px;
      color: #444;
      line-height: 1.5;
    }

    .experience-item, .education-item, .project-item, .certification-item {
      margin-bottom: 18px;
      padding-bottom: 18px;
      border-bottom: 1px solid #eee;
    }

    .experience-item:last-child, .education-item:last-child, .project-item:last-child, .certification-item:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
      flex-wrap: wrap;
      gap: 4px;
    }

    .item-title {
      font-weight: 700;
      font-size: 11.5pt;
      color: #222;
    }

    .item-subtitle {
      font-size: ${subheadingFontSize};
      color: #555;
      font-style: italic;
    }

    .item-date {
      font-size: ${subheadingFontSize};
      color: var(--accent-color);
      font-weight: 600;
      white-space: nowrap;
    }

    .item-company {
      font-size: ${bodyFontSize};
      color: var(--accent-color);
      font-weight: 600;
    }

    .item-description {
      font-size: ${bodyFontSize};
      color: #555;
      line-height: 1.5;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-top: 10px;
      padding: 12px;
      background: rgba(8, 145, 178, 0.05);
      border-radius: 6px;
      border-left: 3px solid var(--accent-color);
    }

    .metric-item {
      text-align: center;
    }

    .metric-value {
      font-size: 18pt;
      font-weight: 700;
      color: var(--accent-color);
      line-height: 1.2;
    }

    .metric-label {
      font-size: 9pt;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    /* Print Styles */
    @media print {
      body {
        background: white;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .resume-container {
        box-shadow: none;
        max-width: 100%;
        width: 100%;
      }

      .sidebar {
        width: var(--sidebar-width);
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .main-content .section {
        page-break-inside: avoid;
      }

      .experience-item, .education-item, .project-item, .certification-item {
        page-break-inside: avoid;
      }

      @page {
        margin: 0;
        size: auto;
      }
    }

    /* Responsive */
    @media screen and (max-width: 768px) {
      .resume-container {
        flex-direction: column;
      }

      .sidebar {
        width: 100%;
      }

      .item-header {
        flex-direction: column;
      }

      .item-date {
        white-space: normal;
      }
    }
  </style>
</head>
<body>
<div class="resume-container">
  <!-- Left Sidebar -->
  <div class="sidebar">
    <!-- Profile Photo -->
    <div class="profile-photo" data-section="photo">
      ${data.personal?.image
        ? `<img src="${data.personal.image}" alt="${data.personal?.name && data.personal?.name !== "undefined"
            ? data.personal.name
            : "Profile Photo"}" />`
        : `
      <svg class="profile-photo-placeholder" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>`}
    </div>

    <!-- Contact Information -->
    <div class="section" data-section="contact">
      <div class="section-title">Contact</div>
      ${data.personal?.phone
        ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
        <span>${data.personal.phone}${data.personal?.alternatePhone
            ? `<br/>${data.personal.alternatePhone}`
            : ""}</span>
      </div>`
        : ""}
      ${data.personal?.email
        ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        <span>${data.personal.email}</span>
      </div>`
        : ""}
      ${data.personal?.location ||
        data.personal?.country ||
        data.personal?.pinCode ||
        data.personal?.fullAddress
        ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span>${[
            data.personal?.location,
            data.personal?.country,
            data.personal?.pinCode,
            data.personal?.fullAddress,
        ]
            .filter(Boolean)
            .join(", ")}</span>
      </div>`
        : ""}
      ${data.personal?.linkedinUrl
        ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
        <a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a>
      </div>`
        : ""}
      ${data.personal?.githubUrl
        ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        <a href="${data.personal.githubUrl}" target="_blank">GitHub</a>
      </div>`
        : ""}
      ${data.personal?.portfolioUrl
        ? `<div class="contact-item">
        <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
        <a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a>
      </div>`
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
            ? `<div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span>Father: ${data.personal.fathersName}</span>
        </div>`
            : ""}
        ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
          <span>DOB: ${data.personal?.dateOfBirth || data.personal?.dob}</span>
        </div>`
            : ""}
        ${data.personal?.gender
            ? `<div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          <span>Gender: ${data.personal.gender}</span>
        </div>`
            : ""}
        ${data.personal?.maritalStatus
            ? `<div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>
          <span>Marital: ${data.personal.maritalStatus}</span>
        </div>`
            : ""}
        ${data.personal?.nationality
            ? `<div class="contact-item">
          <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          <span>Nationality: ${data.personal.nationality}</span>
        </div>`
            : ""}
      `
        : ""}
    </div>

    <!-- Skills in Sidebar -->
    ${data.sectionVisibility?.skills !== false && data.skills
        ? `<div class="section" data-section="skills">
      <div class="section-title">Skills</div>
      <ul>
        ${(Array.isArray(data.skills)
            ? data.skills.slice(0, 10)
            : data.skills.split(",").slice(0, 10))
            .map((skill) => `<li>${typeof skill === "string" ? skill.trim() : skill}</li>`)
            .join("")}
      </ul>
    </div>`
        : ""}

    <!-- Languages -->
    ${data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0
        ? `<div class="section" data-section="languages">
      <div class="section-title">Languages</div>
      ${data.languages
            .map((lang) => `
        <div class="language-item">
          <div class="language-name">${lang.language || lang}${lang.level ? ` - ${lang.level}` : ""}${lang.capability ? ` - ${lang.capability}` : ""}</div>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Hobbies -->
    ${data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
        ? `<div class="section" data-section="hobbies">
      <div class="section-title">Interests</div>
      <ul>
        ${data.hobbies.map((hobby) => `<li>${hobby}</li>`).join("")}
      </ul>
    </div>`
        : ""}

    <!-- Social Links -->
    ${data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks &&
        data.socialLinks.length > 0
        ? `<div class="section" data-section="socialLinks">
      <div class="section-title">Links</div>
      <ul>
        ${data.socialLinks
            .map((link, index) => `<li data-index="${index}"><a href="${link.url}" target="_blank">${link.urlText ||
            link.url.replace("https://", "").replace("http://", "")}</a></li>`)
            .join("")}
      </ul>
    </div>`
        : ""}
  </div>

  <!-- Main Content -->
  <div class="main-content">
    <!-- Header with Name -->
    <div class="header" data-section="personal">
      <div class="name">${data.personal?.name && data.personal?.name !== "undefined"
        ? data.personal.name
        : "Your Name"}</div>
      ${data.personal?.title
        ? `<div class="title">${data.personal.title}</div>`
        : ""}
    </div>

    <!-- Personal Details -->
    ${data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dateOfBirth ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality ||
            data.personal?.passportNo)
        ? `<div class="section" data-section="personal">
      <div class="section-title">Personal Details</div>
      <div style="font-size: ${bodyFontSize}; line-height: 1.6;">
        ${data.personal?.fathersName
            ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>`
            : ""}
        ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<div><strong>Date of Birth:</strong> ${data.personal?.dateOfBirth || data.personal?.dob}</div>`
            : ""}
        ${data.personal?.gender
            ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>`
            : ""}
        ${data.personal?.maritalStatus
            ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>`
            : ""}
        ${data.personal?.nationality
            ? `<div><strong>Nationality:</strong> ${data.personal.nationality}</div>`
            : ""}
        ${data.personal?.passportNo
            ? `<div><strong>Passport No:</strong> ${data.personal.passportNo}</div>`
            : ""}
      </div>
    </div>`
        : ""}

    <!-- Professional Summary -->
    ${data.sectionVisibility?.summary !== false && data.summary
        ? `<div class="section" data-section="summary">
      <div class="section-title">Professional Summary</div>
      <p>${data.summary}</p>
    </div>`
        : ""}

    <!-- Career Objective -->
    ${typeof data.careerObjective === "string" &&
        data.careerObjective.trim().length > 0
        ? `<div class="section" data-section="careerObjective">
      <div class="section-title">Career Objective</div>
      <p>${data.careerObjective}</p>
    </div>`
        : ""}

    <!-- Key Responsibilities -->
    ${(() => {
        const filtered = (Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n")).filter((line) => line.trim());
        return filtered.length > 0
            ? `<div class="section" data-section="responsibilities">
      <div class="section-title">Key Responsibilities</div>
      <ul>
        ${filtered
                .map((line, index) => `<li data-index="${index}">${line.trim()}</li>`)
                .join("")}
      </ul>
    </div>`
            : "";
    })()}

    <!-- Professional Experience -->
    ${sortedExperience.length > 0
        ? `<div class="section" data-section="experience">
      <div class="section-title">Professional Experience</div>
      ${sortedExperience
            .map((exp, index) => `
        <div class="experience-item" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${exp.title || ""}</div>
              <div class="item-company">${exp.company || ""}${exp.domain ? ` | ${exp.domain}` : ""}</div>
            </div>
            <div class="item-date">${exp.startDate || ""} - ${exp.endDate || "Present"}</div>
          </div>
          <div class="item-subtitle">${exp.location || ""}</div>
          ${exp.description
            ? `<ul>${exp.description
                .split("\n")
                .filter((line) => line.trim())
                .map((line) => `<li>${line.trim()}</li>`)
                .join("")}</ul>`
            : ""}
          ${exp.achievements
            ? `<div style="margin-top: 8px;"><strong style="color: var(--text);">Key Achievements:</strong><br/>${exp.achievements}</div>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Internships -->
    ${data.internships && data.internships.length > 0
        ? `<div class="section" data-section="internships">
      <div class="section-title">Internships</div>
      ${data.internships
            .map((item, index) => `
        <div class="experience-item" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${item.title || ""}</div>
              <div class="item-company">${item.company || ""}</div>
            </div>
            <div class="item-date">${item.startDate || ""} - ${item.endDate || ""}</div>
          </div>
          <div class="item-subtitle">${item.location || ""}</div>
          <p>${item.description || ""}</p>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Tools & Systems -->
    ${data.tools && typeof data.tools === "string" && data.tools.trim()
        ? `<div class="section" data-section="tools">
      <div class="section-title">Tools & Systems</div>
      <p>${data.tools}</p>
    </div>`
        : ""}

    <!-- Education -->
    ${data.sectionVisibility?.education !== false &&
        data.education &&
        data.education.length > 0
        ? `<div class="section" data-section="education">
      <div class="section-title">Education</div>
      ${data.education
            .map((edu, index) => `
        <div class="education-item" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${edu.degree || ""}${edu.qualification ? ` (${edu.qualification})` : ""}</div>
              ${edu.field ? `<div class="item-subtitle">${edu.field}</div>` : ""}
              <div class="item-company">${edu.school || ""}${edu.location ? `, ${edu.location}` : ""}${edu.cgpa ? ` • CGPA: ${edu.cgpa}` : ""}</div>
            </div>
            <div class="item-date">${edu.graduationDate || ""}</div>
          </div>
          ${edu.description ? `<p>${edu.description}</p>` : ""}
          ${edu.achievements && edu.achievements.length > 0
            ? `<ul>${edu.achievements
                .map((achievement, achIndex) => `<li data-item-index="${achIndex}">${achievement}</li>`)
                .join("")}</ul>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Certifications -->
    ${data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 0
        ? `<div class="section" data-section="certifications">
      <div class="section-title">Certifications</div>
      ${data.certifications
            .map((cert, index) => `
        <div class="certification-item" data-section="certifications" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${cert.name || ""}</div>
              <div class="item-company">${cert.issuer || ""}</div>
            </div>
            <div class="item-date">${cert.date || ""}</div>
          </div>
          ${cert.description ? `<p>${cert.description}</p>` : ""}
          ${cert.url
            ? `<p><a href="${cert.url}" target="_blank" style="color: var(--accent-color);">View Certificate</a></p>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Academic Projects -->
    ${data.academicProjects && data.academicProjects.length > 0
        ? `<div class="section" data-section="academicProjects">
      <div class="section-title">Academic Projects</div>
      ${data.academicProjects
            .map((item, index) => `
        <div class="project-item" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${item.name || item.title || ""}</div>
              ${item.institution
            ? `<div class="item-subtitle">${item.institution}</div>`
            : ""}
            </div>
            <div class="item-date">${item.duration || ""}</div>
          </div>
          <p>${item.description || ""}</p>
          ${item.technologies
            ? `<p><strong>Technologies:</strong> ${item.technologies}</p>`
            : ""}
          ${item.url
            ? `<p><a href="${item.url}" target="_blank" style="color: var(--accent-color);">View Project</a></p>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Leadership & Positions -->
    ${data.leadershipPositions && data.leadershipPositions.length > 0
        ? `<div class="section" data-section="leadershipPositions">
      <div class="section-title">Leadership & Positions</div>
      ${data.leadershipPositions
            .map((item, index) => `
        <div class="experience-item" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${item.position || item.title || ""}</div>
              <div class="item-company">${item.organization || ""}</div>
            </div>
            <div class="item-date">${item.startDate || ""} - ${item.endDate || ""}</div>
          </div>
          <p>${item.description || ""}</p>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Training Programs -->
    ${data.trainingPrograms && data.trainingPrograms.length > 0
        ? `<div class="section" data-section="trainingPrograms">
      <div class="section-title">Training Programs</div>
      ${data.trainingPrograms
            .map((item, index) => `
        <div class="experience-item" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${item.name || ""}</div>
              <div class="item-company">${item.provider || item.organization || ""}</div>
            </div>
            <div class="item-date">${item.completionDate || ""}</div>
          </div>
          ${item.duration
            ? `<div class="item-subtitle">Duration: ${item.duration}</div>`
            : ""}
          <p>${item.description || ""}</p>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Scholarships -->
    ${data.scholarships && data.scholarships.length > 0
        ? `<div class="section" data-section="scholarships">
      <div class="section-title">Scholarships</div>
      ${data.scholarships
            .map((item, index) => `
        <div class="experience-item" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${item.name || ""}</div>
              <div class="item-company">${item.provider || item.organization || ""}</div>
            </div>
            <div class="item-date">${item.year || ""}</div>
          </div>
          ${item.amount
            ? `<div class="item-subtitle">Amount: ${item.amount}</div>`
            : ""}
          <p>${item.description || ""}</p>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Co-curricular Activities -->
    ${data.coCurricular && data.coCurricular.length > 0
        ? `<div class="section" data-section="coCurricular">
      <div class="section-title">Co-curricular Activities</div>
      ${data.coCurricular
            .map((item, index) => `
        <div class="experience-item" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${item.activity || ""}</div>
              <div class="item-company">${item.organization || ""}</div>
            </div>
            <div class="item-date">${item.year ||
            (item.startDate ? `${item.startDate} - ${item.endDate || ""}` : "")}</div>
          </div>
          ${item.role
            ? `<div class="item-subtitle">Role: ${item.role}</div>`
            : ""}
          <p>${item.description || ""}</p>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Extracurricular Activities -->
    ${data.extracurricular && data.extracurricular.length > 0
        ? `<div class="section" data-section="extracurricular">
      <div class="section-title">Extracurricular Activities</div>
      ${data.extracurricular
            .map((item, index) => `
        <div class="experience-item" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${item.activity || ""}</div>
              <div class="item-company">${item.organization || ""}</div>
            </div>
            <div class="item-date">${item.year ||
            (item.startDate ? `${item.startDate} - ${item.endDate || ""}` : "")}</div>
          </div>
          ${item.role
            ? `<div class="item-subtitle">Role: ${item.role}</div>`
            : ""}
          <p>${item.description || ""}</p>
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Projects -->
    ${data.sectionVisibility?.projects !== false &&
        data.projects &&
        data.projects.length > 0
        ? `<div class="section" data-section="projects">
      <div class="section-title">Projects</div>
      ${data.projects
            .map((project, index) => `
        <div class="project-item" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${project.name || ""}</div>
              ${project.technologies
            ? `<div class="item-subtitle">${project.technologies}</div>`
            : ""}
            </div>
            <div class="item-date">${project.startDate || ""} - ${project.endDate || "Present"}</div>
          </div>
          <p>${project.description || ""}</p>
          ${project.url
            ? `<p><a href="${project.url}" target="_blank" style="color: var(--accent-color);">${project.urlText || "View Project"}</a></p>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Key Achievements -->
    ${data.keyAchievements && data.keyAchievements.length > 0
        ? `<div class="section" data-section="keyAchievements">
      <div class="section-title">Key Achievements</div>
      <ul>
        ${data.keyAchievements
            .map((achievement, index) => `<li data-index="${index}">${achievement}</li>`)
            .join("")}
      </ul>
    </div>`
        : ""}

    <!-- Awards -->
    ${data.awards && data.awards.length > 0
        ? `<div class="section" data-section="awards">
      <div class="section-title">Awards</div>
      ${data.awards
            .map((award, index) => `
        <div class="entry" data-index="${index}">
          <div class="item-header">
            <div>
              <div class="item-title">${award.title || ""}</div>
              <div class="item-company">${award.organization || ""}</div>
            </div>
            <div class="item-date">${award.issueYear || ""}</div>
          </div>
          ${award.description
            ? `<div class="entry-desc">${award.description}</div>`
            : ""}
        </div>
      `)
            .join("")}
    </div>`
        : ""}

    <!-- Custom Sections -->
    ${data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section) => section.isVisible)
            .map((section, sectionIndex) => {
            const heading = section.heading || "Custom Section";
            return `
    <div class="section" data-section="custom-${sectionIndex}">
      <div class="section-title">${heading}</div>
      ${section.entries
                .filter((entry) => entry.isVisible)
                .map((entry, entryIndex) => `
        <div class="project-item" data-index="${entryIndex}">
          <div class="item-header">
            <div>
              <div class="item-title">${entry.title || ""}</div>
              ${entry.organization
                ? `<div class="item-company">${entry.organization}</div>`
                : ""}
            </div>
            ${entry.date ? `<div class="item-date">${entry.date}</div>` : ""}
          </div>
          ${entry.description ? `<p>${entry.description}</p>` : ""}
        </div>
      `)
                .join("")}
    </div>
    `;
        })
            .join("")
        : ""}
  </div>
</div>
</body>
</html>`;
}
