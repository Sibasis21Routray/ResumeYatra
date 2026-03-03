"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildModernTemplate = buildModernTemplate;
function buildModernTemplate(data, theme) {
    const defaultTheme = {
        primary: "#2c3e50",
        secondary: "#7f8c8d",
        accent: "#34495e",
        background: "#ffffff",
        headingFont: "Inter",
        bodyFont: "Inter",
    };
    const currentTheme = theme || defaultTheme;
    const typography = theme?.typography || {
        fontSize: "medium",
        alignment: "left",
        fontWeight: "normal",
    };
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 11;
    const userFontFamily = data.formatting?.fontFamily ||
        data.fontFamily ||
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const fontSizeMap = {
        small: { base: "10px", heading: "22px", subheading: "12px" },
        medium: { base: "11px", heading: "24px", subheading: "13px" },
        large: { base: "12px", heading: "26px", subheading: "14px" },
    };
    const alignmentMap = { left: "left", center: "center", justify: "justify" };
    const fontWeightMap = { normal: "400", bold: "700" };
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 2);
    const subheadingFontSize = Math.round(userFontSize * 1.1);
    const currentAlignment = alignmentMap[typography.alignment] || "left";
    const currentFontWeight = fontWeightMap[typography.fontWeight] || "400";
    const hasContent = (arr) => {
        if (!arr || !Array.isArray(arr))
            return false;
        if (arr.length === 0)
            return false;
        return arr.some((item) => {
            if (typeof item === "string")
                return item.trim().length > 0;
            if (typeof item === "object" && item !== null) {
                return Object.values(item).some((val) => typeof val === "string" && val.trim().length > 0);
            }
            return false;
        });
    };
    const getNonEmptyArray = (arr) => {
        if (!arr || !Array.isArray(arr))
            return [];
        return arr.filter((item) => {
            if (typeof item === "string")
                return item.trim().length > 0;
            if (typeof item === "object" && item !== null) {
                return Object.values(item).some((val) => typeof val === "string" && val.trim().length > 0);
            }
            return false;
        });
    };
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --primary: ${currentTheme.primary};
      --secondary: ${currentTheme.secondary};
      --accent: ${currentTheme.accent};
      --bg: ${currentTheme.background};
      --text: #000000;
      --text-light: #444444;
      --border: #e0e0e0;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text);
      line-height: 1.5;
      background: var(--bg);
      font-size: ${baseFontSize}px;
    }

    .container {
      max-width: 850px;
      margin: 0 auto;
      background: var(--bg);
      padding: 40px 50px;
    }

    .header {
      margin-bottom: 8px;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 10px;
    }

    .header-name {
      font-size: ${Math.round(baseFontSize * 1.6)}px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--primary);
      margin-bottom: 2px;
    }

    .header-role {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: var(--primary);
      font-weight: 400;
      line-height: 1.4;
    }

    .contact-header {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 15px;
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: var(--text);
      margin-top: 8px;
      margin-bottom: 15px;
    }

    .contact-header-item {
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .contact-header-item a {
      color: var(--text);
      text-decoration: none;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: ${Math.round(baseFontSize * 1)}px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      margin-top: 5px;
    }

    .summary-text {
      font-size: ${baseFontSize}px;
      color: var(--text);
      line-height: 1.6;
      text-align: ${currentAlignment};
      margin-bottom: 10px;
    }

    .competencies-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4px 15px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      margin-bottom: 10px;
    }

    .competency-item {
      position: relative;
      padding-left: 10px;
    }

    .competency-item:before {
      content: "|";
      position: absolute;
      left: 0;
      color: var(--text);
      font-weight: bold;
    }

    .item {
      margin-bottom: 15px;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
      gap: 10px;
    }

    .item-title-line {
      flex: 1;
    }

    .item-title {
      font-size: ${Math.round(baseFontSize * 1)}px;
      font-weight: 700;
      color: var(--primary);
      display: inline;
    }

    .item-subtitle {
      font-size: ${Math.round(baseFontSize * 1)}px;
      color: var(--text-light);
      font-weight: 400;
      display: inline;
    }

    .item-date {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: var(--text-light);
      font-weight: 400;
      white-space: nowrap;
    }

    .item-description {
      font-size: ${baseFontSize}px;
      color: var(--text);
      line-height: 1.6;
      margin-top: 5px;
    }

    .item-description ul {
      margin: 5px 0 5px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .item-description li {
      margin: 3px 0;
      color: var(--text);
      line-height: 1.5;
    }

    .item-description b,
    .item-description strong {
      font-weight: 600;
    }

    .bullet-list {
      list-style: none;
      padding: 0;
      margin: 5px 0;
    }

    .bullet-list li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 3px;
      color: var(--text);
      font-size: ${baseFontSize}px;
      line-height: 1.5;
    }

    .bullet-list li:before {
      content: "•";
      position: absolute;
      left: 0;
      font-weight: bold;
    }

    .skills-inline {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      line-height: 1.6;
    }

    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
    }

    .contact-item {
      display: flex;
      gap: 5px;
    }

    .contact-label {
      font-weight: 600;
      min-width: 80px;
    }

    .contact-value a {
      color: var(--text);
      text-decoration: none;
    }

    .contact-value a:hover {
      text-decoration: underline;
    }

    .two-column-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px 30px;
      margin-bottom: 10px;
    }

    .language-item {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
    }

    .language-name {
      font-weight: 600;
    }

    .language-level {
      color: var(--text-light);
      font-style: italic;
    }

    .cert-item {
      margin-bottom: 10px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
    }

    .cert-name {
      font-weight: 600;
      margin-bottom: 2px;
    }

    .cert-issuer {
      color: var(--text-light);
      margin-bottom: 2px;
    }

    .cert-date {
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: var(--text-light);
    }

    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      font-size: ${Math.round(baseFontSize * 0.85)}px;
    }

    .tag {
      padding: 2px 8px;
      border: 1px solid var(--border);
      border-radius: 3px;
      background: #f5f5f5;
    }

    a {
      color: var(--text);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .container {
        padding: 25px;
      }

      .competencies-grid {
        grid-template-columns: 1fr;
      }

      .two-column-grid {
        grid-template-columns: 1fr;
      }

      .contact-header {
        flex-direction: column;
        gap: 3px;
      }
    }

    @media print {
      body { background: white; }
      .container { padding: 30px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" data-section="personal">
      <div class="header-name" data-section="personal">${data.personal?.name && data.personal?.name !== "undefined"
        ? data.personal.name
        : "Debanjali Lenka"}</div>
      ${data.personal?.role
        ? `<div class="header-role" data-section="personal">${data.personal.role}</div>`
        : ""}
    </div>

    ${data.personal?.location ||
        data.personal?.phone ||
        data.personal?.email ||
        data.personal?.linkedinUrl ||
        data.personal?.website ||
        data.personal?.fullAddress
        ? `
    <div class="contact-header">
      ${data.personal?.location
            ? `<div class="contact-header-item"><span>📍</span> <span>${data.personal.location}${data.personal?.pinCode ? ", " + data.personal.pinCode : ""}${data.personal?.country ? ", " + data.personal.country : ""}</span></div>`
            : ""}
      ${data.personal?.fullAddress
            ? `<div class="contact-header-item"><span>📍</span> <span>${data.personal.fullAddress}</span></div>`
            : ""}
      ${data.personal?.phone
            ? `<div class="contact-header-item"><span>📞</span> <span>${data.personal.phone}</span></div>`
            : ""}
      ${data.personal?.alternatePhone
            ? `<div class="contact-header-item"><span>📞</span> <span>${data.personal.alternatePhone} (Alt)</span></div>`
            : ""}
      ${data.personal?.email
            ? `<div class="contact-header-item"><span>✉</span> <span><a href="mailto:${data.personal.email}">${data.personal.email}</a></span></div>`
            : ""}
      ${data.personal?.linkedinUrl
            ? `<div class="contact-header-item"><span>🔗</span> <span><a href="${data.personal.linkedinUrl}" target="_blank">${data.personal.linkedinUrl
                .replace("https://", "")
                .replace("http://", "")}</a></span></div>`
            : ""}
      ${data.personal?.website || data.personal?.portfolioUrl
            ? `<div class="contact-header-item"><span>🌐</span> <span><a href="${data.personal.website || data.personal.portfolioUrl}" target="_blank">${(data.personal.website || data.personal.portfolioUrl)
                .replace("https://", "")
                .replace("http://", "")}</a></span></div>`
            : ""}
    </div>
    `
        : ""}

    ${data.personal?.personalInfoDisplay === "inline"
        ? `
    ${data.personal?.fathersName ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality
            ? `
    <div class="contact-header" style="margin-bottom: 15px; border-top: 1px solid #e0e0e0; padding-top: 10px;">
      ${data.personal?.fathersName
                ? `<div class="contact-header-item"><span>👨</span> <span>Father: ${data.personal.fathersName}</span></div>`
                : ""}
      ${data.personal?.dob
                ? `<div class="contact-header-item"><span>📅</span> <span>DOB: ${data.personal.dob}</span></div>`
                : ""}
      ${data.personal?.gender
                ? `<div class="contact-header-item"><span>⚥</span> <span>${data.personal.gender}</span></div>`
                : ""}
      ${data.personal?.maritalStatus
                ? `<div class="contact-header-item"><span>💍</span> <span>${data.personal.maritalStatus}</span></div>`
                : ""}
      ${data.personal?.nationality
                ? `<div class="contact-header-item"><span>🌍</span> <span>${data.personal.nationality}</span></div>`
                : ""}
    </div>
    `
            : ""}
    `
        : data.personal?.fathersName ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality
            ? `
    <div class="section">
      <div class="section-title">Personal Details</div>
      <div class="contact-list">
        ${data.personal?.fathersName
                ? `<div class="contact-item"><span class="contact-label">Father's Name:</span> <span class="contact-value">${data.personal.fathersName}</span></div>`
                : ""}
        ${data.personal?.dob
                ? `<div class="contact-item"><span class="contact-label">Date of Birth:</span> <span class="contact-value">${data.personal.dob}</span></div>`
                : ""}
        ${data.personal?.gender
                ? `<div class="contact-item"><span class="contact-label">Gender:</span> <span class="contact-value">${data.personal.gender}</span></div>`
                : ""}
        ${data.personal?.maritalStatus
                ? `<div class="contact-item"><span class="contact-label">Marital Status:</span> <span class="contact-value">${data.personal.maritalStatus}</span></div>`
                : ""}
        ${data.personal?.nationality
                ? `<div class="contact-item"><span class="contact-label">Nationality:</span> <span class="contact-value">${data.personal.nationality}</span></div>`
                : ""}
      </div>
    </div>
    `
            : ""}

    ${data.sectionVisibility?.summary !== false && data.summary
        ? `
    <div class="section">
      <div class="section-title">Professional Summary</div>
      <p class="summary-text" data-section="summary">${data.summary}</p>
    </div>
    `
        : ""}

    ${data.sectionVisibility?.skills !== false &&
        data.skills &&
        (Array.isArray(data.skills)
            ? data.skills.length > 0
            : (data.skills || "").trim().length > 0)
        ? `
    <div class="section">
      <div class="section-title">Core Competencies</div>
      <div class="competencies-grid">
        ${(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(","))
            .filter((skill) => skill && (typeof skill === "string" ? skill.trim() : skill))
            .map((skill, index) => `
          <div class="competency-item" data-section="skills" data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</div>
        `)
            .join("")}
      </div>
    </div>
    `
        : ""}

    ${data.sectionVisibility?.experience !== false &&
        data.experience &&
        data.experience.length > 0
        ? `
    <div class="section">
      <div class="section-title">Professional Experience</div>
      ${(data.experience || [])
            .map((exp, index) => `
        <div class="item" data-section="experience" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="experience">${exp.title || ""}</span>
              ${exp.company
            ? ` <span class="item-subtitle" data-section="experience">— ${exp.company}</span>`
            : ""}
              ${exp.domain
            ? ` <span class="item-subtitle" data-section="experience">| ${exp.domain}</span>`
            : ""}
              ${exp.location
            ? ` <span class="item-subtitle" data-section="experience">| ${exp.location}</span>`
            : ""}
            </div>
            <div class="item-date" data-section="experience">(${exp.startDate || ""} - ${exp.endDate || "Present"})</div>
          </div>
          <div class="item-description" data-section="experience">${exp.description || ""}</div>
          ${exp.achievements
            ? `<div class="item-description" data-section="experience" style="margin-top: 8px;"><strong>Key Achievements:</strong><br/>${exp.achievements}</div>`
            : ""}
        </div>
      `)
            .join("")}
    </div>
    `
        : ""}

    ${data.sectionVisibility?.education !== false &&
        data.education &&
        data.education.length > 0
        ? `
    <div class="section">
      <div class="section-title">Education</div>
      ${(data.education || [])
            .map((edu, index) => `
        <div class="item" data-section="education" data-index="${index}">
          <div class="item-header">
            <div class="item-title-line">
              <span class="item-title" data-section="education">${edu.degree || ""}${edu.qualification ? ` (${edu.qualification})` : ""}</span>
              ${edu.school
            ? ` <span class="item-subtitle" data-section="education">— ${edu.school}</span>`
            : ""}
            </div>
            ${edu.graduationDate
            ? `<div class="item-date" data-section="education">${edu.graduationDate}</div>`
            : ""}
          </div>
          ${edu.description
            ? `<div class="item-description" data-section="education">${edu.description.includes("<ul>") ||
                edu.description.includes("<li>")
                ? edu.description
                : `<p>${edu.description}</p>`}</div>`
            : ""}
          ${edu.achievements && edu.achievements.length > 0
            ? `
            <ul class="bullet-list">
              ${edu.achievements
                .filter((a) => a.trim())
                .map((achievement, achIndex) => `<li data-section="education" data-index="${achIndex}">${achievement}</li>`)
                .join("")}
            </ul>
          `
            : ""}
        </div>
      `)
            .join("")}
    </div>
    `
        : ""}

    ${data.sectionVisibility?.projects !== false &&
        data.projects &&
        data.projects.length > 0
        ? `
    <div class="section">
      <div class="section-title">Projects</div>
      ${(data.projects || [])
            .map((project, index) => `
        <div class="item" data-section="projects" data-index="${index}">
          <div class="item-title" data-section="projects">${project.name || ""}</div>
          ${project.technologies
            ? `<div style="font-size: ${Math.round(baseFontSize * 0.85)}px; color: var(--text-light); margin-bottom: 3px;" data-section="projects">${project.technologies}</div>`
            : ""}
          <div class="item-description" data-section="projects">${project.description || ""}</div>
          ${project.url
            ? `<div style="margin-top: 5px;"><a href="${project.url}" target="_blank" style="font-size: ${Math.round(baseFontSize * 0.85)}px;">${project.urlText || project.url}</a></div>`
            : ""}
        </div>
      `)
            .join("")}
    </div>
    `
        : ""}

    ${data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 0
        ? `
    <div class="section">
      <div class="section-title">Certifications</div>
      ${(data.certifications || [])
            .map((cert, index) => `
        <div class="cert-item" data-section="certifications" data-index="${index}">
          <div class="cert-name">${cert.name || ""}</div>
          <div class="cert-issuer">${cert.issuer || ""}</div>
          <div class="cert-date">${cert.date || ""}</div>
          ${cert.url
            ? `<div style="margin-top: 3px;"><a href="${cert.url}" target="_blank" style="font-size: ${Math.round(baseFontSize * 0.8)}px;">View Certificate</a></div>`
            : ""}
        </div>
      `)
            .join("")}
    </div>
    `
        : ""}

    ${data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0
        ? `
    <div class="section">
      <div class="section-title">Languages</div>
      <div class="two-column-grid">
        ${(data.languages || [])
            .map((lang, index) => `
          <div class="language-item">
            <span class="language-name">${lang.language || lang}</span>
            ${lang.level
            ? `<span class="language-level">${lang.level}</span>`
            : ""}
          </div>
        `)
            .join("")}
      </div>
    </div>
    `
        : ""}

    ${hasContent(data.keyAchievements)
        ? `
    <div class="section">
      <div class="section-title">Key Achievements</div>
      <ul class="bullet-list">
        ${getNonEmptyArray(data.keyAchievements)
            .map((achievement, index) => `
          <li data-section="keyAchievements" data-index="${index}">${achievement}</li>
        `)
            .join("")}
      </ul>
    </div>
    `
        : ""}

    ${hasContent(data.responsibilities)
        ? `
    <div class="section">
      <div class="section-title">Key Responsibilities</div>
      <ul class="bullet-list">
        ${getNonEmptyArray(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n"))
            .map((line, index) => `
          <li data-section="responsibilities" data-index="${index}">${line.trim()}</li>
        `)
            .join("")}
      </ul>
    </div>
    `
        : ""}

    ${hasContent(data.tools)
        ? `
    <div class="section">
      <div class="section-title">Tools & Technologies</div>
      <ul class="bullet-list">
        ${getNonEmptyArray(Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split("\n"))
            .map((line, index) => `
          <li data-section="tools" data-index="${index}">${line.trim()}</li>
        `)
            .join("")}
      </ul>
    </div>
    `
        : ""}

    ${data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
        ? `
    <div class="section">
      <div class="section-title">Hobbies & Interests</div>
      <div class="tags-container">
        ${(data.hobbies || [])
            .map((hobby, index) => `
          <span class="tag" data-section="hobbies" data-index="${index}">${hobby}</span>
        `)
            .join("")}
      </div>
    </div>
    `
        : ""}

    ${data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks &&
        data.socialLinks.length > 0
        ? `
    <div class="section">
      <div class="section-title">Social Links</div>
      <div class="contact-list">
        ${data.socialLinks
            .map((link, index) => `
          <div data-section="socialLinks" data-index="${index}">
            <a href="${link.url}" target="_blank">${link.urlText ||
            link.url.replace("https://", "").replace("http://", "")}</a>
          </div>
        `)
            .join("")}
      </div>
    </div>
    `
        : ""}

    ${data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section) => section.isVisible)
            .map((section) => `
      <div class="section">
        <div class="section-title">${section.heading || "Custom Section"}</div>
        ${section.entries && section.entries.length > 0
            ? section.entries
                .filter((entry) => entry.isVisible)
                .map((entry, entryIndex) => `
          <div class="item">
            <div class="item-header">
              <div class="item-title-line">
                <span class="item-title">${entry.title || ""}</span>
                ${entry.organization
                ? ` <span class="item-subtitle">— ${entry.organization}</span>`
                : ""}
              </div>
              ${entry.date ? `<div class="item-date">${entry.date}</div>` : ""}
            </div>
            ${entry.description
                ? `<div class="item-description">${entry.description}</div>`
                : ""}
          </div>
        `)
                .join("")
            : ""}
      </div>
    `)
            .join("")
        : ""}
  </div>
</body>
</html>`;
}
