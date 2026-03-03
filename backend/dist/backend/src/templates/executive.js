"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildExecutiveTemplate = buildExecutiveTemplate;
function buildExecutiveTemplate(data, theme) {
    const defaultTheme = {
        primary: "#3B82F6",
        secondary: "#666666",
        background: "#ffffff",
        headingFont: "Arial",
        bodyFont: "Arial",
    };
    const currentTheme = theme || defaultTheme;
    // Utility function to normalize array fields that may contain objects from DB
    // e.g., hobbies: [{ _id: '...', name: 'Reading' }] → ['Reading']
    const normalizeToStrings = (arr) => {
        if (!arr || !Array.isArray(arr))
            return [];
        return arr.map((item) => {
            if (typeof item === "string")
                return item;
            if (item && typeof item === "object" && "name" in item)
                return item.name;
            return String(item);
        });
    };
    // Utility function to normalize array fields for filtering
    const normalizeToArray = (arr) => {
        if (!arr || !Array.isArray(arr))
            return [];
        return arr;
    };
    // Font size and family from data (user settings)
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 15; // Default 15px
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || "Lato, sans-serif";
    // Calculate responsive font sizes based on user font size
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
    const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --background-color: ${currentTheme.background};
      --heading-font: ${currentTheme.headingFont || "Monospace"};
      --body-font: ${currentTheme.bodyFont || "Arial"};
    }

    body {
      font-family: ${userFontFamily};
      color: #1a1a1a;
      line-height: 1.6;
      background: #f5f5f5;
      font-size: ${baseFontSize}px;
      margin: 0;
      padding: 0;
    }
    
    .container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      min-height: 100vh;
    }
    
    /* Left Sidebar */
    .sidebar {
      width: 35%;
      background: #E8E8E8;
      padding: 40px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .profile-photo-container {
      width: 200px;
      height: 200px;
      margin-bottom: 30px;
      position: relative;
    }
    
    .profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }
    
    .profile-photo-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: ${Math.round(baseFontSize * 4)}px;
      font-weight: 700;
      font-family: var(--heading-font), sans-serif;
    }
    
    .sidebar-section {
      width: 100%;
      margin-bottom: 30px;
    }
    
    .sidebar-title {
      background: var(--primary-color);
      color: white;
      padding: 10px 15px;
      font-size: ${Math.round(baseFontSize * 0.933)}px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 15px;
      font-family: var(--heading-font), sans-serif;
    }
    
    .sidebar-content {
      padding: 0 15px;
      font-size: ${Math.round(baseFontSize * 0.867)}px;
      line-height: 1.6;
      color: #333;
    }
    
    .sidebar-content p {
      text-align: justify;
      margin-bottom: 10px;
    }
    
    .contact-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      word-break: break-word;
    }
    
    .contact-label {
      font-weight: 700;
      margin-right: 5px;
      white-space: nowrap;
    }
    
    .contact-value {
      color: #555;
    }
    
    .skills-list {
      list-style: none;
      padding: 0;
    }
    
    .skills-list li {
      padding: 5px 0;
      border-bottom: 1px solid #d0d0d0;
      font-size: ${Math.round(baseFontSize * 0.867)}px;
    }
    
    .skills-list li:last-child {
      border-bottom: none;
    }
    
    .hobbies-list {
      font-size: ${Math.round(baseFontSize * 0.867)}px;
      line-height: 1.8;
    }
    
    /* Main Content Area */
    .main-content {
      width: 65%;
      padding: 40px 50px;
    }
    
    .header {
      margin-bottom: 40px;
    }
    
    .name {
      font-family: var(--heading-font), serif;
      font-size: ${Math.round(baseFontSize * 3.667)}px;
      font-weight: 700;
      color: #000;
      margin-bottom: 3px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }
    
    .role {
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      color: #555;
      font-weight: 400;
      margin-bottom: 20px;
    }
    
    .section {
      margin-bottom: 35px;
    }
    
    .section-title {
      font-family: var(--heading-font), serif;
      font-size: ${Math.round(baseFontSize * 1.067)}px;
      font-weight: 700;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 2px solid #000;
    }
    
    .entry {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 8px;
      gap: 15px;
    }
    
    .entry-title {
      font-weight: 700;
      font-size: ${Math.round(baseFontSize * 1.067)}px;
      color: #000;
    }
    
    .entry-date {
      font-size: ${Math.round(baseFontSize * 0.867)}px;
      color: #666;
      white-space: nowrap;
      font-style: italic;
    }
    
    .entry-subtitle {
      color: #555;
      font-size: ${baseFontSize}px;
      margin-bottom: 8px;
      font-style: italic;
    }
    
    .entry-content {
      font-size: ${Math.round(baseFontSize * 0.933)}px;
      color: #333;
      line-height: 1.7;
      text-align: justify;
    }

    .entry-content ul {
      margin: 8px 0 8px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .entry-content li {
      margin: 4px 0;
      padding: 0;
      color: #333;
    }

    .entry-content b {
      font-weight: 700;
      color: #000;
    }
    
    .entry-content ol {
      margin: 8px 0 8px 20px;
      padding: 0;
    }
    
    .entry-content ol li {
      margin: 6px 0;
      padding-left: 5px;
    }
    
    /* Education Styles */
    .education-field {
      color: var(--primary-color);
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .education-location {
      color: #666;
      font-style: italic;
      margin-bottom: 8px;
      font-size: ${Math.round(baseFontSize * 0.933)}px;
    }
    
    .education-description {
      font-size: ${Math.round(baseFontSize * 0.933)}px;
      color: #333;
      line-height: 1.7;
      text-align: justify;
      margin-top: 10px;
    }

    .education-description ul {
      margin: 8px 0 8px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .education-description li {
      margin: 4px 0;
      padding: 0;
      color: #333;
    }

    .education-description b {
      font-weight: 700;
      color: #000;
    }
    
    .education-achievements {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.933)}px;
      font-weight: 700;
      color: #000;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .education-achievements ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }

    .education-achievements li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 5px;
      color: #333;
      font-size: ${Math.round(baseFontSize * 0.933)}px;
    }

    .education-achievements li:before {
      content: "▪";
      color: var(--primary-color);
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    
    @media print {
      body { background: white; }
      .container { margin: 0; box-shadow: none; }
    }
    
    @media screen and (max-width: 768px) {
      .container {
        flex-direction: column;
      }
      .sidebar, .main-content {
        width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Left Sidebar -->
    <div class="sidebar">
      <div class="profile-photo-container">
        ${data.personal?.photoUrl || data.personal?.image
        ? `
          <img src="${data.personal.photoUrl || data.personal.image}" alt="${data.personal?.name || "Profile"}" class="profile-photo" />
        `
        : `
          <div class="profile-photo-placeholder">
            ${data.personal?.name
            ? data.personal.name.charAt(0).toUpperCase()
            : "?"}
          </div>
        `}
      </div>
      
      ${data.sectionVisibility?.summary !== false &&
        data.summary &&
        data.summary.trim()
        ? `
        <div class="sidebar-section" data-section="summary">
          <div class="sidebar-title" data-section="summary">PROFILE</div>
          <div class="sidebar-content" data-section="summary">
            <p>${data.summary}</p>
          </div>
        </div>
      `
        : ""}
      
      ${data.objective && data.objective.trim()
        ? `
        <div class="sidebar-section" data-section="objective">
          <div class="sidebar-title" data-section="objective">OBJECTIVE</div>
          <div class="sidebar-content" data-section="objective">
            <p>${data.objective}</p>
          </div>
        </div>
      `
        : ""}
      
      ${data.personal
        ? `
        <div class="sidebar-section" data-section="personal">
          <div class="sidebar-title" data-section="personal">CONTACT</div>
          <div class="sidebar-content" data-section="personal">
            ${data.personal?.location ||
            data.personal?.country ||
            data.personal?.pinCode ||
            data.personal?.fullAddress
            ? `
              <div class="contact-item">
                <span class="contact-label">Address:</span>
                <span class="contact-value">${[
                data.personal?.location,
                data.personal?.country,
                data.personal?.pinCode,
                data.personal?.fullAddress,
            ]
                .filter(Boolean)
                .join(", ")}</span>
              </div>
            `
            : ""}
            ${data.personal?.phone
            ? `
              <div class="contact-item">
                <span class="contact-label">Mobile No:</span>
                <span class="contact-value">${data.personal.phone}</span>
              </div>
            `
            : ""}
            ${data.personal?.alternatePhone
            ? `
              <div class="contact-item">
                <span class="contact-label">Alt. Phone:</span>
                <span class="contact-value">${data.personal.alternatePhone}</span>
              </div>
            `
            : ""}
            ${data.personal?.email
            ? `
              <div class="contact-item">
                <span class="contact-label">EMAIL:</span>
                <span class="contact-value">${data.personal.email}</span>
              </div>
            `
            : ""}
            ${data.personal?.linkedinUrl
            ? `
              <div class="contact-item">
                <span class="contact-label">LinkedIn:</span>
                <span class="contact-value"><a href="${data.personal.linkedinUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.linkedinUrl
                .replace("https://", "")
                .replace("http://", "")}</a></span>
              </div>
            `
            : ""}
            ${data.personal?.githubUrl
            ? `
              <div class="contact-item">
                <span class="contact-label">GitHub:</span>
                <span class="contact-value"><a href="${data.personal.githubUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.githubUrl
                .replace("https://", "")
                .replace("http://", "")}</a></span>
              </div>
            `
            : ""}
            ${data.personal?.portfolioUrl
            ? `
              <div class="contact-item">
                <span class="contact-label">Portfolio:</span>
                <span class="contact-value"><a href="${data.personal.portfolioUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.portfolioUrl
                .replace("https://", "")
                .replace("http://", "")}</a></span>
              </div>
            `
            : ""}
            ${data.personal?.website
            ? `
              <div class="contact-item">
                <span class="contact-label">Website:</span>
                <span class="contact-value"><a href="${data.personal.website}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.website
                .replace("https://", "")
                .replace("http://", "")}</a></span>
              </div>
            `
            : ""}
            ${data.personal?.twitterUrl
            ? `
              <div class="contact-item">
                <span class="contact-label">Twitter:</span>
                <span class="contact-value"><a href="${data.personal.twitterUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.twitterUrl
                .replace("https://", "")
                .replace("http://", "")}</a></span>
              </div>
            `
            : ""}
            ${data.personal?.facebookUrl
            ? `
              <div class="contact-item">
                <span class="contact-label">Facebook:</span>
                <span class="contact-value"><a href="${data.personal.facebookUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.facebookUrl
                .replace("https://", "")
                .replace("http://", "")}</a></span>
              </div>
            `
            : ""}
            ${data.personal?.instagramUrl
            ? `
              <div class="contact-item">
                <span class="contact-label">Instagram:</span>
                <span class="contact-value"><a href="${data.personal.instagramUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.instagramUrl
                .replace("https://", "")
                .replace("http://", "")}</a></span>
              </div>
            `
            : ""}
            ${data.personal?.behanceUrl
            ? `
              <div class="contact-item">
                <span class="contact-label">Behance:</span>
                <span class="contact-value"><a href="${data.personal.behanceUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.behanceUrl
                .replace("https://", "")
                .replace("http://", "")}</a></span>
              </div>
            `
            : ""}
            ${data.personal?.dribbbleUrl
            ? `
              <div class="contact-item">
                <span class="contact-label">Dribbble:</span>
                <span class="contact-value"><a href="${data.personal.dribbbleUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.dribbbleUrl
                .replace("https://", "")
                .replace("http://", "")}</a></span>
              </div>
            `
            : ""}
            ${data.personal?.stackoverflowUrl
            ? `
              <div class="contact-item">
                <span class="contact-label">Stack Overflow:</span>
                <span class="contact-value"><a href="${data.personal.stackoverflowUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.stackoverflowUrl
                .replace("https://", "")
                .replace("http://", "")}</a></span>
              </div>
            `
            : ""}
            ${data.personal?.mediumUrl
            ? `
              <div class="contact-item">
                <span class="contact-label">Medium:</span>
                <span class="contact-value"><a href="${data.personal.mediumUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${data.personal.mediumUrl
                .replace("https://", "")
                .replace("http://", "")}</a></span>
              </div>
            `
            : ""}

            ${data.personal?.personalInfoDisplay === "inline"
            ? `
            ${data.personal?.fathersName
                ? `
              <div class="contact-item">
                <span class="contact-label">Father's Name:</span>
                <span class="contact-value">${data.personal.fathersName}</span>
              </div>
            `
                : ""}
            ${data.personal?.dob
                ? `
              <div class="contact-item">
                <span class="contact-label">DOB:</span>
                <span class="contact-value">${data.personal.dob}</span>
              </div>
            `
                : ""}
            ${data.personal?.gender
                ? `
              <div class="contact-item">
                <span class="contact-label">Gender:</span>
                <span class="contact-value">${data.personal.gender}</span>
              </div>
            `
                : ""}
            ${data.personal?.maritalStatus
                ? `
              <div class="contact-item">
                <span class="contact-label">Marital Status:</span>
                <span class="contact-value">${data.personal.maritalStatus}</span>
              </div>
            `
                : ""}
            ${data.personal?.nationality
                ? `
              <div class="contact-item">
                <span class="contact-label">Nationality:</span>
                <span class="contact-value">${data.personal.nationality}</span>
              </div>
            `
                : ""}
            `
            : ""}

          </div>
        </div>
      `
        : ""}
      
      ${data.sectionVisibility?.skills !== false &&
        data.skills &&
        (Array.isArray(data.skills)
            ? data.skills.filter((skill) => skill && (typeof skill === "string" ? skill.trim() : skill))
            : (data.skills || "")
                .split(",")
                .filter((skill) => skill.trim())).length > 0
        ? `
        <div class="sidebar-section" data-section="skills">
          <div class="sidebar-title" data-section="skills">TECHNICAL SKILLS</div>
          <div class="sidebar-content" data-section="skills">
            <ul class="skills-list">
              ${(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(","))
            .filter((skill) => skill && (typeof skill === "string" ? skill.trim() : skill))
            .map((skill, index) => `
                <li data-section="skills" data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</li>
              `)
            .join("")}
            </ul>
          </div>
        </div>
      `
        : ""}
      
      ${data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        normalizeToStrings(data.hobbies).length > 0
        ? `
        <div class="sidebar-section" data-section="hobbies">
          <div class="sidebar-title" data-section="hobbies">HOBBIES</div>
          <div class="sidebar-content hobbies-list" data-section="hobbies">
            ${normalizeToStrings(data.hobbies)
            .map((hobby) => `${hobby}`)
            .join(", ")}
          </div>
        </div>
      `
        : ""}
      
      ${data.sectionVisibility?.languages !== false &&
        data.languages &&
        normalizeToArray(data.languages).length > 0
        ? `
        <div class="sidebar-section" data-section="languages">
          <div class="sidebar-title" data-section="languages">LANGUAGES</div>
          <div class="sidebar-content" data-section="languages">
            <ul class="skills-list">
              ${normalizeToArray(data.languages)
            .map((lang, index) => `
                <li data-section="languages" data-index="${index}">${lang.language || lang.name || lang}${lang.level || lang.proficiency
            ? ` (${lang.level || lang.proficiency})`
            : ""}</li>
              `)
            .join("")}
            </ul>
          </div>
        </div>
      `
        : ""}
    </div>
    
    <!-- Main Content Area -->
    <div class="main-content">
      <div class="header" data-section="personal">
        <div class="name" data-section="personal">
          ${(() => {
        const name = data.personal?.name && data.personal?.name !== "undefined"
            ? data.personal.name
            : "Your Name";
        const parts = name.split(" ");
        const first = parts[0] || "";
        const middle = parts.slice(1, -1).join(" ") || "";
        const last = parts[parts.length - 1] || "";
        return `
              <div>${first}</div>
              ${middle ? `<div>${middle}</div>` : ""}
              <div style="color: var(--primary-color);">${last}</div>
            `;
    })()}
        </div>
      ${data.personal?.role
        ? `<div class="role" data-section="personal">${data.personal.role}</div>`
        : ""}
      </div>

      ${data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality ||
            data.personal?.passportNo)
        ? `
        <div class="section" data-section="personal">
          <div class="section-title" data-section="personal">PERSONAL DETAILS</div>
          ${data.personal?.fathersName
            ? `
            <div class="entry-content">
              <strong>Father's Name:</strong> ${data.personal.fathersName}
            </div>
          `
            : ""}
          ${data.personal?.dob
            ? `
            <div class="entry-content">
              <strong>Date of Birth:</strong> ${data.personal.dob}
            </div>
          `
            : ""}
          ${data.personal?.gender
            ? `
            <div class="entry-content">
              <strong>Gender:</strong> ${data.personal.gender}
            </div>
          `
            : ""}
          ${data.personal?.maritalStatus
            ? `
            <div class="entry-content">
              <strong>Marital Status:</strong> ${data.personal.maritalStatus}
            </div>
          `
            : ""}
          ${data.personal?.nationality
            ? `
            <div class="entry-content">
              <strong>Nationality:</strong> ${data.personal.nationality}
            </div>
          `
            : ""}
          ${data.personal?.passportNo
            ? `
            <div class="entry-content">
              <strong>Passport No:</strong> ${data.personal.passportNo}
            </div>
          `
            : ""}
        </div>
      `
        : ""}

      ${data.sectionVisibility?.experience !== false &&
        data.experience &&
        data.experience.length > 0
        ? `
        <div class="section" data-section="experience">
          <div class="section-title" data-section="experience">WORK EXPERIENCE</div>
          ${(data.experience || [])
            .filter((exp) => exp.title ||
            exp.company ||
            exp.description ||
            exp.startDate ||
            exp.endDate)
            .map((exp, index) => `
            <div class="entry" data-section="experience" data-index="${index}">
              <div class="entry-header" data-section="experience" data-index="${index}">
                <div class="entry-title" data-section="experience" data-index="${index}">${exp.title || ""}</div>
                <div class="entry-date" data-section="experience" data-index="${index}">${exp.startDate || ""} – ${exp.endDate || "Present"}</div>
              </div>
              <div class="entry-subtitle" data-section="experience" data-index="${index}">${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}</div>
              <div class="entry-content" data-section="experience" data-index="${index}">${exp.description || ""}</div>
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
        <div class="section" data-section="education">
          <div class="section-title" data-section="education">EDUCATION</div>
          ${(data.education || [])
            .filter((edu) => edu.degree ||
            edu.qualification ||
            edu.field ||
            edu.school ||
            edu.graduationDate ||
            edu.description)
            .map((edu, index) => `
            <div class="entry" data-section="education" data-index="${index}">
              <div class="entry-header" data-section="education" data-index="${index}">
                <div class="entry-title" data-section="education" data-index="${index}">
                  ${edu.degree || ""}${edu.qualification ? ` (${edu.qualification})` : ""}
                </div>
                <div class="entry-date" data-section="education" data-index="${index}">${edu.graduationDate || ""}</div>
              </div>
              
              ${edu.field
            ? `<div class="education-field" data-section="education" data-index="${index}">${edu.field}</div>`
            : ""}
              ${edu.school
            ? `<div class="entry-subtitle" data-section="education" data-index="${index}">${edu.school}</div>`
            : ""}
              ${edu.location
            ? `<div class="education-location" data-section="education" data-index="${index}">${edu.location}</div>`
            : ""}
              
              ${edu.description
            ? `
                <div class="education-description" data-section="education" data-index="${index}">
                  ${edu.description.includes("<ul>") ||
                edu.description.includes("<li>")
                ? edu.description
                : `<p>${edu.description}</p>`}
                </div>
              `
            : ""}
              
              ${edu.achievements && edu.achievements.length > 0
            ? `
                <div class="education-achievements" data-section="education" data-index="${index}">
                  <h4>Achievements & Honors</h4>
                  <ul>
                    ${edu.achievements
                .filter((achievement) => achievement.trim())
                .map((achievement, achIndex) => `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`)
                .join("")}
                  </ul>
                </div>
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
        <div class="section" data-section="projects">
          <div class="section-title" data-section="projects">KEY PROJECTS</div>
          ${(data.projects || [])
            .filter((project) => project.name ||
            project.technologies ||
            project.description ||
            project.startDate ||
            project.endDate)
            .map((project, index) => `
            <div class="entry" data-section="projects" data-index="${index}">
              <div class="entry-header" data-section="projects" data-index="${index}">
                <div class="entry-title" data-section="projects" data-index="${index}">${project.name || ""}</div>
                <div class="entry-date" data-section="projects" data-index="${index}">${project.startDate || ""} ${project.startDate && project.endDate
            ? `– ${project.endDate}`
            : project.endDate
                ? `– ${project.endDate}`
                : ""}</div>
              </div>
              <div class="entry-subtitle" data-section="projects" data-index="${index}">${project.technologies || ""}</div>
              <div class="entry-content" data-section="projects" data-index="${index}">${project.description || ""}</div>
              ${project.url
            ? `<div class="entry-content" style="margin-top: 8px;"><strong>Link:</strong> <a href="${project.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">${project.urlText || project.url}</a></div>`
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
        <div class="section" data-section="certifications">
          <div class="section-title" data-section="certifications">CERTIFICATIONS</div>
          ${(data.certifications || [])
            .filter((cert) => cert.name || cert.issuer || cert.date || cert.url)
            .map((cert, index) => `
            <div class="entry" data-section="certifications" data-index="${index}">
              <div class="entry-header" data-section="certifications" data-index="${index}">
                <div class="entry-title" data-section="certifications" data-index="${index}">${cert.name || ""}</div>
                <div class="entry-date" data-section="certifications" data-index="${index}">${cert.date || ""}</div>
              </div>
              <div class="entry-subtitle" data-section="certifications" data-index="${index}">${cert.issuer || ""}</div>
              ${cert.url
            ? `<div class="entry-content" style="margin-top: 8px;"><strong>Link:</strong> <a href="${cert.url}" target="_blank" style="color: var(--primary-color); text-decoration: underline;">View Certificate</a></div>`
            : ""}
            </div>
          `)
            .join("")}
        </div>
      `
        : ""}

      ${data.keyAchievements &&
        data.keyAchievements.filter((a) => a && a.trim()).length > 0
        ? `
        <div class="section" data-section="keyAchievements">
          <div class="section-title" data-section="keyAchievements">KEY ACHIEVEMENTS</div>
          <div class="entry-content">
            <ul>
              ${(data.keyAchievements || [])
            .filter((achievement) => achievement && achievement.trim())
            .map((achievement, index) => `<li data-section="keyAchievements" data-index="${index}" style="margin-bottom: 8px;">${achievement}</li>`)
            .join("")}
            </ul>
          </div>
        </div>
      `
        : ""}

      ${data.responsibilities &&
        (Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n")).filter((line) => line && line.trim()).length > 0
        ? `
        <div class="section" data-section="responsibilities">
          <div class="section-title" data-section="responsibilities">KEY RESPONSIBILITIES</div>
          <div class="entry-content">
            <ul>
              ${(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n"))
            .filter((line) => line && line.trim())
            .map((line, index) => `<li data-section="responsibilities" data-index="${index}" style="margin-bottom: 8px;">${line.trim()}</li>`)
            .join("")}
            </ul>
          </div>
        </div>
      `
        : ""}

      ${data.tools &&
        (Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split("\n")).filter((line) => line && line.trim()).length > 0
        ? `
        <div class="section" data-section="tools">
          <div class="section-title" data-section="tools">TOOLS & TECHNOLOGIES</div>
          <div class="entry-content">
            <ul>
              ${(Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split("\n"))
            .filter((line) => line && line.trim())
            .map((line, index) => `<li data-section="tools" data-index="${index}" style="margin-bottom: 8px;">${line.trim()}</li>`)
            .join("")}
            </ul>
          </div>
        </div>
      `
        : ""}

      ${data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks &&
        data.socialLinks.length > 0
        ? `
        <div class="section" data-section="socialLinks">
          <div class="section-title" data-section="socialLinks">SOCIAL LINKS</div>
          <div style="display: flex; flex-wrap: wrap; gap: 15px;" data-section="socialLinks">
            ${data.socialLinks
            .map((link, index) => `
              <a href="${link.url}" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: 500; font-size: ${Math.round(baseFontSize * 0.933)}px;" data-section="socialLinks" data-index="${index}">${link.urlText ||
            link.url.replace("https://", "").replace("http://", "")}</a>
            `)
            .join("")}
          </div>
        </div>
      `
        : ""}

      <!-- Custom Sections -->
      ${data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section) => section.isVisible &&
            section.entries &&
            section.entries.some((entry) => entry.isVisible &&
                (entry.title || entry.organization || entry.description)))
            .map((section) => `
        <div class="section" data-section="customSections">
          <div class="section-title" data-section="customSections">${section.heading || "Custom Section"}</div>
          ${section.entries && section.entries.length > 0
            ? section.entries
                .filter((entry) => entry.isVisible &&
                (entry.title || entry.organization || entry.description))
                .map((entry, entryIndex) => `
            <div class="entry" data-section="customSections" data-index="${entryIndex}">
              <div class="entry-header" data-section="customSections" data-index="${entryIndex}">
                <div class="entry-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ""}${entry.title && entry.organization ? " at " : ""}${entry.organization || ""}</div>
                ${entry.date
                ? `<div class="entry-date" data-section="customSections" data-index="${entryIndex}">${entry.date}</div>`
                : ""}
              </div>
              ${entry.description
                ? `<div class="entry-content" data-section="customSections" data-index="${entryIndex}">${entry.description}</div>`
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
  </div>
</body>
</html>`;
}
