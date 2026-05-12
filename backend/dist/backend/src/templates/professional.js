"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildProfessionalTemplate = buildProfessionalTemplate;
function buildProfessionalTemplate(data, theme) {
    const defaultTheme = {
        primary: "#5B9BD5",
        secondary: "#2c3e50",
        background: "#ffffff",
        sidebarBg: "#5B9BD5",
        sidebarText: "#ffffff",
        headingFont: "Arial",
        bodyFont: "Arial",
    };
    const currentTheme = theme || defaultTheme;
    // Font size and family from data (user settings)
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 11;
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || "Arial, sans-serif";
    // Calculate responsive font sizes based on user font size
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 2.5);
    const subheadingFontSize = Math.round(userFontSize * 1.2);
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --sidebar-bg: ${currentTheme.primary || "#5B9BD5"};
      --sidebar-text: ${currentTheme.sidebarText || "#ffffff"};
      --primary-color: ${currentTheme.primary || "#5B9BD5"};
      --background-color: ${currentTheme.background || "#ffffff"};
    }

    body {
      font-family: ${userFontFamily};
      color: #000000;
      line-height: 1.6;
      background: #f5f5f5;
      font-size: ${baseFontSize}px;
    }
    
    .container {
      max-width: 850px;
      margin: 0 auto;
      background: var(--background-color);
      display: grid;
      grid-template-columns: 250px 1fr;
      min-height: 100vh;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    /* Sidebar */
    .sidebar {
      background: var(--sidebar-bg);
      color: var(--sidebar-text);
      padding: 30px 20px;
    }
    
    .profile-photo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: #ffffff;
      margin: 0 auto 20px;
      overflow: hidden;
      border: 3px solid rgba(255,255,255,0.3);
    }
    
    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .photo-placeholder {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 100%);
      border: 3px solid rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255,255,255,0.9);
      font-size: ${Math.round(baseFontSize * 0.7)}px;
      text-align: center;
      padding: 10px;
      font-weight: 500;
    }
    
    .sidebar-section {
      margin-bottom: 25px;
    }
    
    .sidebar-title {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid rgba(255,255,255,0.3);
    }
    
    .contact-item {
      margin-bottom: 10px;
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      line-height: 1.5;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    
    .contact-icon {
      width: 14px;
      height: 14px;
      flex-shrink: 0;
      margin-top: 2px;
    }
    
    .contact-item a {
      color: var(--sidebar-text);
      text-decoration: none;
      word-break: break-word;
    }
    
    .sidebar-list {
      list-style: none;
      padding: 0;
    }
    
    .sidebar-list li {
      margin-bottom: 8px;
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      padding-left: 12px;
      position: relative;
    }
    
    .sidebar-list li:before {
      content: "▪";
      position: absolute;
      left: 0;
      font-weight: bold;
    }
    
    .language-item {
      margin-bottom: 10px;
      font-size: ${Math.round(baseFontSize * 0.85)}px;
    }
    
    .language-name {
      font-weight: 600;
      display: block;
    }
    
    .language-level {
      font-size: ${Math.round(baseFontSize * 0.75)}px;
      opacity: 0.9;
      font-style: italic;
    }
    
    .hobby-item {
      display: inline-block;
      margin: 4px 4px 4px 0;
      padding: 3px 8px;
      background: rgba(255,255,255,0.2);
      border-radius: 3px;
      font-size: ${Math.round(baseFontSize * 0.8)}px;
    }
    
    /* Main Content */
    .main-content {
      padding: 40px 35px;
    }
    
    .header-section {
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 3px solid var(--sidebar-bg);
    }
    
    .name-header {
      font-size: ${Math.round(baseFontSize * 2.8)}px;
      font-weight: 700;
      color: #111;
      margin-bottom: 5px;
      text-transform: none;
      letter-spacing: 0;
      line-height: 1.1;
    }
    
    .name-header .surname {
      color: var(--primary-color);
      display: block;
    }
    
    .role-subtitle {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      color: #7f8c8d;
      font-weight: 400;
      text-transform: none;
      letter-spacing: 0;
    }
    
    .content-section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 700;
      color: var(--primary-color);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
      padding-bottom: 6px;
      border-bottom: 2px solid var(--sidebar-bg);
    }
    
    .summary-text {
      font-size: ${baseFontSize}px;
      line-height: 1.7;
      color: #555;
      text-align: justify;
    }
    
    /* Experience & Education Items */
    .item {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .item:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .item-title {
      font-size: ${Math.round(baseFontSize * 1.05)}px;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 4px;
    }
    
    .item-subtitle {
      font-size: ${baseFontSize}px;
      color: #7f8c8d;
      font-weight: 600;
      margin-bottom: 3px;
    }
    
    .item-date {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: #95a5a6;
      font-style: italic;
      margin-bottom: 8px;
    }
    
    .item-description {
      font-size: ${baseFontSize}px;
      color: #555;
      line-height: 1.7;
    }
    
    .item-description ul {
      margin: 10px 0 10px 20px;
      padding: 0;
    }
    
    .item-description li {
      margin: 5px 0;
    }
    
    .item-description b {
      font-weight: 700;
      color: var(--primary-color);
    }
    
    /* Projects */
    .project-name {
      font-size: ${Math.round(baseFontSize * 1.05)}px;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 3px;
    }
    
    .project-tech {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: #7f8c8d;
      font-weight: 600;
      margin-bottom: 6px;
    }
    
    /* Certifications */
    .cert-item {
      margin-bottom: 15px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .cert-item:last-child {
      border-bottom: none;
    }
    
    .cert-name {
      font-weight: 700;
      color: var(--primary-color);
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      margin-bottom: 3px;
    }
    
    .cert-issuer {
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: #7f8c8d;
      margin-bottom: 2px;
    }
    
    .cert-date {
      font-size: ${Math.round(baseFontSize * 0.8)}px;
      color: #95a5a6;
      font-style: italic;
    }
    
    /* Lists */
    .achievement-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .achievement-list li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 8px;
      font-size: ${baseFontSize}px;
      color: #555;
      line-height: 1.6;
    }
    
    .achievement-list li:before {
      content: "▸";
      position: absolute;
      left: 0;
      color: var(--sidebar-bg);
      font-weight: bold;
    }
    
    /* Links */
    a {
      color: var(--sidebar-bg);
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .container {
        grid-template-columns: 1fr;
      }
      
      .sidebar {
        padding: 25px 20px;
      }
      
      .main-content {
        padding: 30px 25px;
      }
    }
    
    @media print {
      body { background: white; }
      .container { 
        box-shadow: none;
        max-width: 100%;
      }
      .sidebar {
        background: var(--sidebar-bg) !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Profile Photo -->
      <div class="profile-photo">
        ${data.personal?.photoUrl || data.personal?.image
        ? `<img src="${data.personal.photoUrl || data.personal.image}" alt="${data.personal?.name && data.personal?.name !== "undefined"
            ? data.personal.name
            : "Profile Photo"}" />`
        : `<div class="photo-placeholder">Profile Photo</div>`}
      </div>
      
      <!-- Contact Section -->
      <div class="sidebar-section">
        <div class="sidebar-title">CONTACT</div>
        ${data.personal?.phone
        ? `
        <div class="contact-item" data-field="phone" data-index="0">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
          <span>${data.personal.phone}</span>
        </div>`
        : ""}
        
        ${data.personal?.email
        ? `
        <div class="contact-item" data-field="email" data-index="1">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
          <span>${data.personal.email}</span>
        </div>`
        : ""}
        
        ${data.personal?.location
        ? `
        <div class="contact-item" data-field="location" data-index="2">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
          <span>${data.personal.location}${data.personal?.pinCode ? `, ${data.personal.pinCode}` : ""}${data.personal.country ? `, ${data.personal.country}` : ""}${data.personal.fullAddress
            ? `, ${data.personal.fullAddress}`
            : ""}</span>
        </div>`
        : ""}
        
        ${data.personal?.linkedinUrl
        ? `
        <div class="contact-item" data-field="linkedinUrl" data-index="3">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/></svg>
          <a href="${data.personal.linkedinUrl}" target="_blank">${data.personal.linkedinUrl
            .replace("https://", "")
            .replace("http://", "")
            .substring(0, 20)}...</a>
        </div>`
        : ""}
        
        ${data.personal?.website
        ? `
        <div class="contact-item" data-field="website" data-index="4">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"/></svg>
          <a href="${data.personal.website}" target="_blank">${data.personal.website
            .replace("https://", "")
            .replace("http://", "")
            .substring(0, 20)}...</a>
        </div>`
        : ""}

        ${data.personal?.alternatePhone
        ? `
        <div class="contact-item" data-field="alternatePhone" data-index="5">
          <svg class="contact-icon" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
          <span>${data.personal.alternatePhone} (Alt)</span>
        </div>`
        : ""}

        ${data.personal?.personalInfoDisplay === "inline"
        ? `
        ${data.personal?.fathersName
            ? `
        <div class="contact-item" data-field="fathersName" data-index="6">
          <span>Father's Name: ${data.personal.fathersName}</span>
        </div>`
            : ""}

        ${data.personal?.dob
            ? `
        <div class="contact-item" data-field="dob" data-index="8">
          <span>DOB: ${data.personal.dob}</span>
        </div>`
            : ""}

        ${data.personal?.gender
            ? `
        <div class="contact-item" data-field="gender" data-index="9">
          <span>Gender: ${data.personal.gender}</span>
        </div>`
            : ""}

        ${data.personal?.maritalStatus
            ? `
        <div class="contact-item" data-field="maritalStatus" data-index="10">
          <span>Marital Status: ${data.personal.maritalStatus}</span>
        </div>`
            : ""}

        ${data.personal?.nationality
            ? `
        <div class="contact-item" data-field="nationality" data-index="11">
          <span>Nationality: ${data.personal.nationality}</span>
        </div>`
            : ""}
        `
        : ""}
      </div>
      
      <!-- Skills Section -->
      ${data.sectionVisibility?.skills !== false && data.skills
        ? `
      <div class="sidebar-section" data-section="skills">
        <div class="sidebar-title">SKILLS</div>
        <ul class="sidebar-list">
          ${(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(","))
            .map((skill, index) => `
            <li data-section="skills" data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</li>
          `)
            .join("")}
        </ul>
      </div>`
        : ""}
      
      <!-- Languages Section -->
      ${data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0
        ? `
      <div class="sidebar-section" data-section="languages">
        <div class="sidebar-title">LANGUAGES</div>
        ${(data.languages || [])
            .map((lang, index) => `
          <div class="language-item" data-section="languages" data-index="${index}">
            <span class="language-name">${lang.language || lang}</span>
            ${lang.level
            ? `<span class="language-level">${lang.level}</span>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}
      
      <!-- Hobbies Section -->
      ${data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
        ? `
      <div class="sidebar-section" data-section="hobbies">
        <div class="sidebar-title">HOBBIES</div>
        <div>
          ${(data.hobbies || [])
            .map((hobby, index) => `
            <span class="hobby-item" data-section="hobbies" data-index="${index}">${hobby}</span>
          `)
            .join("")}
        </div>
      </div>`
        : ""}
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <div class="header-section" data-section="personal">
        <div class="name-header" data-section="personal">
          ${(() => {
        const fullName = data.personal?.name && data.personal?.name !== "undefined"
            ? data.personal.name
            : "Your Name";
        const nameParts = fullName.trim().split(" ");
        if (nameParts.length > 1) {
            const surname = nameParts[nameParts.length - 1];
            const firstAndMiddle = nameParts.slice(0, -1).join(" ");
            return `${firstAndMiddle}<span class="surname">${surname}</span>`;
        }
        return fullName;
    })()}
        </div>
        ${data.personal?.role
        ? `<div class="role-subtitle" data-section="personal">${data.personal.role}</div>`
        : ""}
      </div>
      
      <!-- Summary -->
      ${data.sectionVisibility?.summary !== false && data.summary
        ? `
      <div class="content-section">
        <div class="section-title">PROFILE</div>
        <p class="summary-text" data-section="summary">${data.summary}</p>
      </div>`
        : ""}

      ${data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality ||
            data.personal?.passportNo)
        ? `
      <div class="content-section" data-section="personal">
        <div class="section-title">PERSONAL DETAILS</div>
        <ul class="achievement-list">
          ${data.personal?.fathersName
            ? `<li><strong>Father's Name:</strong> ${data.personal.fathersName}</li>`
            : ""}
          ${data.personal?.dob
            ? `<li><strong>Date of Birth:</strong> ${data.personal.dob}</li>`
            : ""}
          ${data.personal?.gender
            ? `<li><strong>Gender:</strong> ${data.personal.gender}</li>`
            : ""}
          ${data.personal?.maritalStatus
            ? `<li><strong>Marital Status:</strong> ${data.personal.maritalStatus}</li>`
            : ""}
          ${data.personal?.nationality
            ? `<li><strong>Nationality:</strong> ${data.personal.nationality}</li>`
            : ""}
          ${data.personal?.passportNo
            ? `<li><strong>Passport No:</strong> ${data.personal.passportNo}</li>`
            : ""}
        </ul>
      </div>`
        : ""}
      
      <!-- Experience -->
      ${data.sectionVisibility?.experience !== false &&
        data.experience &&
        data.experience.length > 0
        ? `
      <div class="content-section" data-section="experience">
        <div class="section-title">EXPERIENCE</div>
        ${(data.experience || [])
            .map((exp, index) => `
          <div class="item" data-section="experience" data-index="${index}">
            <div class="item-title" data-section="experience">${exp.title || ""}</div>
            <div class="item-subtitle" data-section="experience">${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}</div>
            <div class="item-date" data-section="experience">${exp.startDate || ""} - ${exp.endDate || "Present"}</div>
            <div class="item-description" data-section="experience">${exp.description || ""}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}
      
      <!-- Education -->
      ${data.sectionVisibility?.education !== false &&
        data.education &&
        data.education.length > 0
        ? `
      <div class="content-section" data-section="education">
        <div class="section-title">EDUCATION</div>
        ${(data.education || [])
            .map((edu, index) => `
          <div class="item" data-section="education" data-index="${index}">
            <div class="item-title" data-section="education">${edu.degree || ""}${edu.qualification ? ` (${edu.qualification})` : ""}</div>
            <div class="item-subtitle" data-section="education">${edu.school || ""}</div>
            <div class="item-date" data-section="education">${edu.graduationDate || ""}</div>
            ${edu.description
            ? `<div class="item-description" data-section="education">${edu.description.includes("<ul>") ||
                edu.description.includes("<li>")
                ? edu.description
                : `<p>${edu.description}</p>`}</div>`
            : ""}
            ${edu.achievements && edu.achievements.length > 0
            ? `
              <ul class="achievement-list" style="margin-top: 10px;">
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
      </div>`
        : ""}
      
      <!-- Projects -->
      ${data.sectionVisibility?.projects !== false &&
        data.projects &&
        data.projects.length > 0
        ? `
      <div class="content-section" data-section="projects">
        <div class="section-title">PROJECTS</div>
        ${(data.projects || [])
            .map((project, index) => `
          <div class="item" data-section="projects" data-index="${index}">
            <div class="project-name" data-section="projects">${project.name || ""}</div>
            ${project.technologies
            ? `<div class="project-tech" data-section="projects">${project.technologies}</div>`
            : ""}
            <div class="item-description" data-section="projects">${project.description || ""}</div>
            ${project.url
            ? `<div style="margin-top: 6px;"><a href="${project.url}" target="_blank">${project.urlText || project.url}</a></div>`
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
        ? `
      <div class="content-section" data-section="certifications">
        <div class="section-title">CERTIFICATIONS</div>
        ${(data.certifications || [])
            .map((cert, index) => `
          <div class="cert-item" data-section="certifications" data-index="${index}">
            <div class="cert-name">${cert.name || ""}</div>
            <div class="cert-issuer">${cert.issuer || ""}</div>
            <div class="cert-date">${cert.date || ""}</div>
            ${cert.url
            ? `<div style="margin-top: 5px;"><a href="${cert.url}" target="_blank">View Certificate</a></div>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}
      
      <!-- Key Achievements -->
      ${data.keyAchievements && data.keyAchievements.length > 0
        ? `
      <div class="content-section" data-section="keyAchievements">
        <div class="section-title">KEY ACHIEVEMENTS</div>
        <ul class="achievement-list">
          ${(data.keyAchievements || [])
            .map((achievement, index) => `
            <li data-section="keyAchievements" data-index="${index}">${achievement}</li>
          `)
            .join("")}
        </ul>
      </div>`
        : ""}
      
      <!-- Key Responsibilities -->
      ${data.responsibilities && data.responsibilities.length > 0
        ? `
      <div class="content-section" data-section="responsibilities">
        <div class="section-title">KEY RESPONSIBILITIES</div>
        <ul class="achievement-list">
          ${(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n"))
            .filter((line) => line.trim())
            .map((line, index) => `
            <li data-section="responsibilities" data-index="${index}">${line.trim()}</li>
          `)
            .join("")}
        </ul>
      </div>`
        : ""}
      
      <!-- Tools & Technologies -->
      ${data.tools && data.tools.length > 0
        ? `
      <div class="content-section" data-section="tools">
        <div class="section-title">TOOLS & TECHNOLOGIES</div>
        <ul class="achievement-list">
          ${(Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split("\n"))
            .filter((line) => line.trim())
            .map((line, index) => `
            <li data-section="tools" data-index="${index}">${line.trim()}</li>
          `)
            .join("")}
        </ul>
      </div>`
        : ""}
      
      <!-- Custom Sections -->
      ${data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section) => section.isVisible)
            .map((section) => `
        <div class="content-section">
          <div class="section-title">${section.heading || "Custom Section"}</div>
          ${section.entries && section.entries.length > 0
            ? section.entries
                .filter((entry) => entry.isVisible)
                .map((entry, entryIndex) => `
            <div class="item">
              <div class="item-title">${entry.title || ""}${entry.title && entry.organization ? " at " : ""}${entry.organization || ""}</div>
              ${entry.date ? `<div class="item-date">${entry.date}</div>` : ""}
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
  </div>
</body>
</html>`;
}
