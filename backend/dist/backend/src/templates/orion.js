"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOrionTemplate = buildOrionTemplate;
function buildOrionTemplate(data, theme) {
    const defaultTheme = {
        primary: "#7ca29e", // The sage/teal color from your image
        secondary: "#f4f7f6",
        background: "#ffffff",
        headingFont: "Inter",
        bodyFont: "Inter",
    };
    const currentTheme = theme || defaultTheme;
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 11;
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || "Inter, sans-serif";
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 2.8);
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
      --sidebar-bg: #fdfdfd;
      --border-color: #7ca29e;
      --text-dark: #333333;
      --text-light: #666666;
    }

    body {
      font-family: ${userFontFamily};
      color: var(--text-dark);
      line-height: 1.5;
      background: #e5e7eb;
      padding: 40px 0;
    }

    /* Main Frame from Image */
    .outer-container {
      max-width: 850px;
      margin: 0 auto;
      background: white;
      border: 8px solid var(--border-color);
      border-radius: 12px;
      display: flex;
      min-height: 1100px;
      position: relative;
    }

    /* Left Column (Sidebar) */
    .sidebar {
      width: 35%;
      padding: 40px 30px;
      border-right: 1px solid #eeeeee;
    }

    /* Right Column (Content) */
    .main-content {
      flex: 1;
      padding: 40px 40px;
    }

    /* Profile Image (Top Right overlap style) */
    .profile-container {
      position: absolute;
      top: 40px;
      right: 40px;
      width: 130px;
      height: 130px;
      z-index: 10;
    }

    .profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      border: 1px solid #ddd;
    }

    /* Header Styling */
    .header-section {
      margin-bottom: 40px;
      padding-right: 140px; /* Leave room for photo */
    }

    .name {
      font-size: ${headingFontSize}px;
      font-weight: 300;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #333;
      margin-bottom: 5px;
    }

    .header-divider {
      width: 100%;
      height: 1px;
      background: #ddd;
      margin: 15px 0;
    }

    /* Section Headings */
    .section-title {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 15px;
      color: #000;
    }

    .sidebar-title {
      font-size: ${Math.round(baseFontSize * 1.05)}px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    }

    /* Content Styling */
    .entry {
      margin-bottom: 25px;
    }

    .entry-header {
      font-weight: 700;
      font-size: ${baseFontSize}px;
      color: #333;
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }

    .entry-sub {
      color: var(--text-light);
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      margin-bottom: 8px;
    }

    .entry-desc {
      font-size: ${baseFontSize}px;
      color: var(--text-light);
      text-align: justify;
    }

    .contact-info {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      color: var(--text-light);
      list-style: none;
    }

    .contact-info li {
      margin-bottom: 10px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .skill-tag {
      display: inline-block;
      margin-bottom: 8px;
      color: var(--text-light);
      font-size: ${Math.round(baseFontSize * 0.95)}px;
    }
    
    .skill-dot {
      color: var(--primary);
      margin-right: 8px;
    }

    @media print {
      body { background: white; padding: 0; }
      .outer-container { border-radius: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="outer-container">
    ${data.personal?.photoUrl
        ? `
      <div class="profile-container">
        <img src="${data.personal.photoUrl}" class="profile-photo" alt="Profile">
      </div>
    `
        : ""}

    <aside class="sidebar">
      <div class="sidebar-section" data-section="contact">
        <h3 class="sidebar-title" data-section="contact">Contact</h3>
        <ul class="contact-info" data-section="contact">
          ${data.personal?.phone
        ? `<li data-section="contact">${data.personal.phone}</li>`
        : ""}
          ${data.personal?.alternatePhone
        ? `<li data-section="contact">Alt: ${data.personal.alternatePhone}</li>`
        : ""}
          ${data.personal?.email
        ? `<li data-section="contact">${data.personal.email}</li>`
        : ""}
          ${data.personal?.location ||
        data.personal?.city ||
        data.personal?.country ||
        data.personal?.pinCode ||
        data.personal?.fullAddress
        ? `<li data-section="contact">${[
            data.personal?.location,
            data.personal?.city,
            data.personal?.country,
            data.personal?.pinCode,
            data.personal?.fullAddress,
        ]
            .filter(Boolean)
            .join(", ")}</li>`
        : ""}
          ${data.personal?.linkedinUrl
        ? `<li data-section="contact"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></li>`
        : ""}
          ${data.personal?.githubUrl
        ? `<li data-section="contact"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></li>`
        : ""}
          ${data.personal?.portfolioUrl
        ? `<li data-section="contact"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></li>`
        : ""}
          ${data.personal?.website
        ? `<li data-section="contact"><a href="${data.personal.website}" target="_blank">Website</a></li>`
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
            ? `<li data-section="contact">Father: ${data.personal.fathersName}</li>`
            : ""}
              ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<li data-section="contact">DOB: ${data.personal?.dateOfBirth || data.personal?.dob}</li>`
            : ""}
              ${data.personal?.gender
            ? `<li data-section="contact">Gender: ${data.personal.gender}</li>`
            : ""}
              ${data.personal?.maritalStatus
            ? `<li data-section="contact">Marital Status: ${data.personal.maritalStatus}</li>`
            : ""}
              ${data.personal?.nationality
            ? `<li data-section="contact">Nationality: ${data.personal.nationality}</li>`
            : ""}
            `
        : ""}
        </ul>
      </div>

      ${(data.personal?.fathersName ||
        data.personal?.dateOfBirth ||
        data.personal?.dob ||
        data.personal?.gender ||
        data.personal?.maritalStatus ||
        data.personal?.nationality ||
        data.personal?.passportNo) &&
        data.personal?.personalInfoDisplay !== "inline"
        ? `
      <div class="sidebar-section" style="margin-top: 40px;" data-section="personal">
        <h3 class="sidebar-title" data-section="personal">Personal Details</h3>
        <ul class="contact-info" data-section="personal">
          ${data.personal?.fathersName
            ? `<li data-section="personal">Father: ${data.personal.fathersName}</li>`
            : ""}
          ${data.personal?.dateOfBirth || data.personal?.dob
            ? `<li data-section="personal">DOB: ${data.personal?.dateOfBirth || data.personal?.dob}</li>`
            : ""}
          ${data.personal?.gender
            ? `<li data-section="personal">Gender: ${data.personal.gender}</li>`
            : ""}
          ${data.personal?.maritalStatus
            ? `<li data-section="personal">Marital Status: ${data.personal.maritalStatus}</li>`
            : ""}
          ${data.personal?.nationality
            ? `<li data-section="personal">Nationality: ${data.personal.nationality}</li>`
            : ""}
          ${data.personal?.passportNo
            ? `<li data-section="personal">Passport: ${data.personal.passportNo}</li>`
            : ""}
        </ul>
      </div>`
        : ""}

      ${data.sectionVisibility?.skills !== false &&
        data.skills &&
        (Array.isArray(data.skills)
            ? data.skills.filter((s) => s && (typeof s === "string" ? s.trim() : s)).length > 0
            : (data.skills || "").split(",").filter((s) => s.trim())
                .length > 0)
        ? `
      <div class="sidebar-section" style="margin-top: 40px;" data-section="skills">
        <h3 class="sidebar-title">Skills</h3>
        <div>
          ${(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(","))
            .map((skill) => `
            <div class="skill-tag"><span class="skill-dot">•</span>${typeof skill === "string" ? skill.trim() : skill}</div><br>
          `)
            .join("")}
        </div>
      </div>`
        : ""}

      ${data.sectionVisibility?.languages !== false &&
        data.languages?.length > 0
        ? `
      <div class="sidebar-section" style="margin-top: 40px;" data-section="languages">
        <h3 class="sidebar-title">Languages</h3>
        <div class="contact-info">
          ${(data.languages || [])
            .map((lang) => `
            <div style="margin-bottom: 5px;">${lang.language || lang}${lang.level ? ` (${lang.level})` : ""}${lang.capability ? ` - ${lang.capability}` : ""}</div>
          `)
            .join("")}
        </div>
      </div>`
        : ""}
    </aside>

    <main class="main-content">
      <header class="header-section">
        <h1 class="name">${data.personal?.name || "Your Name"}</h1>
        <div class="header-divider"></div>
      </header>

      ${data.sectionVisibility?.summary !== false &&
        data.summary &&
        data.summary.trim()
        ? `
      <div class="entry" data-section="summary">
        <h3 class="section-title">Profile</h3>
        <div class="entry-desc">${data.summary}</div>
      </div>`
        : ""}

      ${data.sectionVisibility?.experience !== false &&
        data.experience?.length > 0
        ? `
      <div class="entry" data-section="experience">
        <h3 class="section-title">Work Experience</h3>
        ${(data.experience || [])
            .map((exp) => `
          <div class="entry">
            <div class="entry-header">
              <span>${exp.company || ""}</span>
              <span style="font-weight: 400; font-size: 0.9em;">${exp.startDate || ""} — ${exp.endDate || "Present"}</span>
            </div>
            <div class="entry-sub">${exp.title || ""}${exp.domain ? ` | ${exp.domain}` : ""}${exp.location ? ` | ${exp.location}` : ""}</div>
            <div class="entry-desc">${exp.description || ""}</div>
            ${exp.achievements
            ? `<div class="entry-desc" style="margin-top: 8px;"><strong style="color: var(--text-dark);">Key Achievements:</strong><br/>${exp.achievements}</div>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.sectionVisibility?.education !== false &&
        data.education?.length > 0
        ? `
      <div class="entry" data-section="education">
        <h3 class="section-title">Education</h3>
        ${(data.education || [])
            .map((edu) => `
          <div class="entry">
            <div class="entry-header">
              <span>${edu.school || ""}</span>
              <span style="font-weight: 400; font-size: 0.9em;">${edu.graduationDate || ""}</span>
            </div>
            <div class="entry-sub">${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}${edu.cgpa ? ` • CGPA: ${edu.cgpa}` : ""}</div>
            <div class="entry-desc">${edu.description || ""}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.sectionVisibility?.projects !== false && data.projects?.length > 0
        ? `
      <div class="entry" data-section="projects">
        <h3 class="section-title">Projects</h3>
        ${(data.projects || [])
            .map((project) => `
          <div class="entry">
            <div class="entry-header">
              <span>${project.name || ""}</span>
              <span style="font-weight: 400; font-size: 0.9em;">${project.startDate || ""} — ${project.endDate || ""}</span>
            </div>
            <div class="entry-sub">${project.technologies
            ? `Technologies: ${project.technologies}`
            : ""}</div>
            <div class="entry-desc">${project.description || ""}</div>
            ${project.url
            ? `<div class="entry-desc"><a href="${project.url}" target="_blank" style="color: var(--primary);">View Project</a></div>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.sectionVisibility?.certifications !== false &&
        data.certifications?.length > 0
        ? `
      <div class="entry" data-section="certifications">
        <h3 class="section-title">Certifications</h3>
        ${(data.certifications || [])
            .map((cert) => `
          <div class="entry">
            <div class="entry-header">
              <span>${cert.name || ""}</span>
              <span style="font-weight: 400; font-size: 0.9em;">${cert.date || ""}</span>
            </div>
            <div class="entry-sub">${cert.issuer || ""}</div>
            ${cert.description
            ? `<div class="entry-desc">${cert.description}</div>`
            : ""}
            ${cert.url
            ? `<div class="entry-desc"><a href="${cert.url}" target="_blank" style="color: var(--primary);">View Certificate</a></div>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.keyAchievements &&
        data.keyAchievements.filter((a) => a && a.trim()).length > 0
        ? `
      <div class="entry" data-section="keyAchievements">
        <h3 class="section-title">Key Achievements</h3>
        ${(data.keyAchievements || [])
            .map((achievement, index) => `
          <div class="entry" data-index="${index}">
            <div class="entry-desc">• ${achievement}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.awards && data.awards.length > 0
        ? `
      <div class="entry" data-section="awards">
        <h3 class="section-title">Awards</h3>
        ${(data.awards || [])
            .map((award, index) => `
          <div class="entry" data-index="${index}">
            <div class="entry-header">
              <span>${award.title || ""}</span>
              <span style="font-weight: 400; font-size: 0.9em;">${award.issueYear || ""}</span>
            </div>
            <div class="entry-sub">${award.organization || ""}</div>
            ${award.description
            ? `<div class="entry-desc">${award.description}</div>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${(Array.isArray(data.responsibilities)
        ? data.responsibilities
        : (data.responsibilities || "").split("\n")).filter((line) => line && line.trim()).length > 0
        ? `
      <div class="entry" data-section="responsibilities">
        <h3 class="section-title">Key Responsibilities</h3>
        ${(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n"))
            .filter((line) => line.trim())
            .map((line, index) => `
          <div class="entry" data-index="${index}">
            <div class="entry-desc">• ${line.trim()}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${(Array.isArray(data.tools)
        ? data.tools
        : (data.tools || "").split(",")).filter((t) => t && (typeof t === "string" ? t.trim() : t))
        .length > 0
        ? `
      <div class="entry" data-section="tools">
        <h3 class="section-title">Tools & Technologies</h3>
        <div>
          ${(Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split(","))
            .map((tool) => `
            <span class="skill-tag"><span class="skill-dot">•</span>${typeof tool === "string" ? tool.trim() : tool}</span>
          `)
            .join("")}
        </div>
      </div>`
        : ""}

      ${data.sectionVisibility?.hobbies !== false && data.hobbies?.length > 0
        ? `
      <div class="entry" data-section="hobbies">
        <h3 class="section-title">Hobbies</h3>
        <div>
          ${(Array.isArray(data.hobbies)
            ? data.hobbies
            : (data.hobbies || "").split(","))
            .map((hobby) => `
            <span class="skill-tag">${typeof hobby === "string" ? hobby.trim() : hobby}</span>
          `)
            .join("")}
        </div>
      </div>`
        : ""}

      ${data.socialLinks && data.socialLinks.length > 0
        ? `
      <div class="entry" data-section="socialLinks">
        <h3 class="section-title">Social Links</h3>
        ${(data.socialLinks || [])
            .map((link, index) => `
          <div class="entry" data-index="${index}">
            <div class="entry-desc"><a href="${link.url}" target="_blank">${link.urlText || link.url}</a></div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}

      ${data.references
        ? `
      <div class="entry" data-section="references">
        <h3 class="section-title">References</h3>
        <div class="entry-desc">${data.references}</div>
      </div>`
        : ""}

      ${data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section) => section.entries && section.entries.length > 0)
            .map((section, sectionIndex) => `
      <div class="entry" data-section="customSections">
        <h3 class="section-title">${section.heading || "Custom Section"}</h3>
        ${(section.entries || [])
            .map((entry, entryIndex) => `
        <div class="entry" data-index="${entryIndex}">
          <div class="entry-header">
            <span>${entry.title || ""}</span>
            <span style="font-weight: 400; font-size: 0.9em;">${entry.date || ""}</span>
          </div>
          <div class="entry-sub">${entry.organization || ""}</div>
          <div class="entry-desc">${entry.description || ""}</div>
        </div>
      `)
            .join("")}
      </div>
    `)
            .join("")
        : ""}
    </main>
  </div>
</body>
</html>`;
}
