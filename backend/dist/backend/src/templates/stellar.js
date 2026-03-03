"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStellarTemplate = buildStellarTemplate;
function buildStellarTemplate(data, theme) {
    const defaultTheme = {
        primary: "#333333", // Darker header as per image
        sidebar: "#68a9ffff", // Muted blue-grey sidebar
        background: "#ffffff",
        headingFont: "Serif",
        bodyFont: "Lato",
    };
    const currentTheme = theme || defaultTheme;
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 12;
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || "Lato, sans-serif";
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 3);
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
      --sidebar: ${currentTheme.sidebar || "#6993bdff"};
      --bg: ${currentTheme.background};
      --text: #333333;
      --text-light: #666666;
      --border: #d1d5db;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text);
      line-height: 1.4;
      background: #f3f4f6;
      padding: 40px 0;
      font-size: ${baseFontSize}px;
    }

    .container {
      max-width: 850px;
      margin: 0 auto;
      background: var(--bg);
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      min-height: 1100px;
    }

    /* Header matching the image style */
    .header {
      background: var(--primary);
      color: white;
      padding: 40px 50px;
      text-align: left;
    }

    .name {
      font-size: ${headingFontSize}px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-family: Georgia, serif;
    }

    /* Layout Split */
    .content {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: 900px;
    }

    /* Left Sidebar */
    .left-column {
      background: var(--sidebar);
      background-color: var(--sidebar);
      color: var(--text);
      padding: 40px 30px;
    }

    .left-section {
      margin-bottom: 35px;
    }

    .left-title {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
      border-bottom: 1px solid rgba(255,255,255,0.3);
      padding-bottom: 5px;
    }

    .contact-item {
      margin-bottom: 12px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .contact-item a { color: white; text-decoration: none; }

    .skill-list { list-style: none; }
    .skill-list li {
      padding: 5px 0;
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      opacity: 0.9;
    }

    /* Right Main Content */
    .right-column {
      padding: 40px 50px;
    }

    .section {
      margin-bottom: 30px;
    }

    .summary-text {
      font-style: italic;
      color: var(--text-light);
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border);
    }

    .section-title {
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 15px;
      color: var(--text);
      letter-spacing: 1px;
    }

    .entry {
      margin-bottom: 20px;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      font-weight: 700;
    }

    .entry-subtitle {
      font-weight: 600;
      color: var(--text-light);
      margin-bottom: 5px;
    }

    .entry-date {
      font-size: 0.9em;
      color: var(--text-light);
    }

    .entry-content {
      font-size: ${baseFontSize}px;
      color: #444;
      margin-top: 5px;
    }

    .entry-content ul {
      padding-left: 18px;
    }

    @media print {
      body { padding: 0; background: white; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" data-section="personal">
      <div class="name">${data.personal?.name || "Your Name"}</div>
    </div>

    <div class="content">
      <div class="left-column">
        
        <div class="left-section" data-section="contact">
          <div class="left-title">Contact Me</div>
          ${data.personal?.phone
        ? `<div class="contact-item" data-section="contact">📞 ${data.personal.phone}</div>`
        : ""}
          ${data.personal?.alternatePhone
        ? `<div class="contact-item" data-section="contact">📞 ${data.personal.alternatePhone}</div>`
        : ""}
          ${data.personal?.email
        ? `<div class="contact-item" data-section="contact">✉️ ${data.personal.email}</div>`
        : ""}
          ${data.personal?.location ||
        data.personal?.city ||
        data.personal?.country ||
        data.personal?.pinCode ||
        data.personal?.fullAddress
        ? `<div class="contact-item" data-section="contact">📍 ${[
            data.personal?.location,
            data.personal?.city,
            data.personal?.country,
            data.personal?.pinCode,
            data.personal?.fullAddress,
        ]
            .filter(Boolean)
            .join(", ")}</div>`
        : ""}
          ${data.personal?.linkedinUrl
        ? `<div class="contact-item" data-section="contact">🔗 <a href="${data.personal.linkedinUrl}">LinkedIn</a></div>`
        : ""}
          ${data.personal?.githubUrl
        ? `<div class="contact-item" data-section="contact">🐙 <a href="${data.personal.githubUrl}">GitHub</a></div>`
        : ""}
          ${data.personal?.portfolioUrl
        ? `<div class="contact-item" data-section="contact">💼 <a href="${data.personal.portfolioUrl}">Portfolio</a></div>`
        : ""}
          ${data.personal?.website
        ? `<div class="contact-item" data-section="contact">🌐 <a href="${data.personal.website}">Website</a></div>`
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
            ? `<div class="contact-item" data-section="contact">Father: ${data.personal.fathersName}</div>`
            : ""}
          ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<div class="contact-item" data-section="contact">DOB: ${data.personal?.dateOfBirth || data.personal?.dob}</div>`
            : ""}
          ${data.personal?.gender
            ? `<div class="contact-item" data-section="contact">Gender: ${data.personal.gender}</div>`
            : ""}
          ${data.personal?.maritalStatus
            ? `<div class="contact-item" data-section="contact">Marital: ${data.personal.maritalStatus}</div>`
            : ""}
          ${data.personal?.nationality
            ? `<div class="contact-item" data-section="contact">Nationality: ${data.personal.nationality}</div>`
            : ""}
          `
        : ""}
  
  
        </div>
        ${data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dateOfBirth ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality ||
            data.personal?.passportNo)
        ? `
        <div class="left-section" data-section="personal">
          <div class="left-title">Personal Details</div>
          ${data.personal?.fathersName
            ? `<div class="contact-item" data-section="personal">Father: ${data.personal.fathersName}</div>`
            : ""}
          ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<div class="contact-item" data-section="personal">DOB: ${data.personal?.dateOfBirth || data.personal?.dob}</div>`
            : ""}
          ${data.personal?.gender
            ? `<div class="contact-item" data-section="personal">Gender: ${data.personal.gender}</div>`
            : ""}
          ${data.personal?.maritalStatus
            ? `<div class="contact-item" data-section="personal">Marital: ${data.personal.maritalStatus}</div>`
            : ""}
          ${data.personal?.nationality
            ? `<div class="contact-item" data-section="personal">Nationality: ${data.personal.nationality}</div>`
            : ""}
          ${data.personal?.passportNo
            ? `<div class="contact-item" data-section="personal">Passport: ${data.personal.passportNo}</div>`
            : ""}
        </div>`
        : ""}

        ${data.sectionVisibility?.skills !== false && data.skills
        ? `
        <div class="left-section" data-section="skills">
          <div class="left-title">Skills</div>
          <ul class="skill-list">
            ${(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(","))
            .map((skill, index) => `
              <li data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</li>
            `)
            .join("")}
          </ul>
        </div>`
        : ""}

        ${data.sectionVisibility?.languages !== false &&
        data.languages?.length > 0
        ? `
        <div class="left-section" data-section="languages">
          <div class="left-title">Languages</div>
          <ul class="skill-list">
            ${data.languages
            .map((lang, index) => `
              <li data-index="${index}">${lang.language || lang} ${lang.level ? `(${lang.level})` : ""}${lang.capability ? ` - ${lang.capability}` : ""}</li>
            `)
            .join("")}
          </ul>
        </div>`
        : ""}

        ${data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks?.length > 0
        ? `
        <div class="left-section" data-section="socialLinks">
          <div class="left-title">Social Links</div>
          ${data.socialLinks
            .map((link, index) => `
            <div class="contact-item" data-index="${index}">
              <span>${link.urlText || "Link"}:</span>
              <a href="${link.url}" style="color: white;">${link.url}</a>
            </div>
          `)
            .join("")}
        </div>`
        : ""}
      </div>

      <div class="right-column">
        ${data.sectionVisibility?.summary !== false && data.summary
        ? `
        <div class="summary-text" data-section="summary">
          ${data.summary}
        </div>`
        : ""}

        ${data.sectionVisibility?.experience !== false &&
        data.experience?.length > 0
        ? `
        <div class="section" data-section="experience">
          <div class="section-title">Work Experience</div>
          ${data.experience
            .map((exp, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">
                <span>${exp.title || ""}</span>
                <span class="entry-date">${exp.startDate || ""} - ${exp.endDate || "Present"}</span>
              </div>
              <div class="entry-subtitle">${exp.company || ""}${exp.domain ? ` | ${exp.domain}` : ""}${exp.location ? `, ${exp.location}` : ""}</div>
              <div class="entry-content">${exp.description || ""}</div>
              ${exp.achievements
            ? `<div class="entry-content" style="margin-top: 8px;"><strong style="color: var(--text);">Key Achievements:</strong><br/>${exp.achievements}</div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.education !== false &&
        data.education?.length > 0
        ? `
        <div class="section" data-section="education">
          <div class="section-title">Education</div>
          ${data.education
            .map((edu, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">
                <span>${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}</span>
                <span class="entry-date">${edu.graduationDate || ""}</span>
              </div>
              <div class="entry-subtitle">${edu.school || ""}${edu.cgpa ? ` • CGPA: ${edu.cgpa}` : ""}</div>
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.projects !== false &&
        data.projects?.length > 0
        ? `
        <div class="section" data-section="projects">
          <div class="section-title">Projects</div>
          ${data.projects
            .map((project, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">
                <span>${project.name || ""}</span>
                <span class="entry-date">${project.startDate || ""} ${project.endDate ? `- ${project.endDate}` : ""}</span>
              </div>
              <div class="entry-subtitle">${project.technologies
            ? `Technologies: ${project.technologies}`
            : ""}</div>
              <div class="entry-content">${project.description || ""}</div>
              ${project.url
            ? `<div class="entry-content"><a href="${project.url}" style="color: var(--primary);">${project.urlText || "View Project"}</a></div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.certifications !== false &&
        data.certifications?.length > 0
        ? `
        <div class="section" data-section="certifications">
          <div class="section-title">Certifications</div>
          ${data.certifications
            .map((cert, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">
                <span>${cert.name || ""}</span>
                <span class="entry-date">${cert.date || ""}</span>
              </div>
              <div class="entry-subtitle">${cert.issuer || ""}</div>
              ${cert.description
            ? `<div class="entry-content">${cert.description}</div>`
            : ""}
              ${cert.url
            ? `<div class="entry-content"><a href="${cert.url}" style="color: var(--primary);">View Certificate</a></div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.sectionVisibility?.awards !== false && data.awards?.length > 0
        ? `
        <div class="section" data-section="awards">
          <div class="section-title">Awards</div>
          ${data.awards
            .map((award, index) => `
            <div class="entry" data-index="${index}">
              <div class="entry-header">
                <span>${award.title || ""}</span>
                <span class="entry-date">${award.issueYear || ""}</span>
              </div>
              <div class="entry-subtitle">${award.organization || ""}</div>
              ${award.description
            ? `<div class="entry-content">${award.description}</div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>`
        : ""}

        ${data.references
        ? `
        <div class="section" data-section="references">
          <div class="section-title">References</div>
          <div class="entry-content">${data.references}</div>
        </div>`
        : ""}
      </div>
    </div>
  </div>
</body>
</html>`;
}
