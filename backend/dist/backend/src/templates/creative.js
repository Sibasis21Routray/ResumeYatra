"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCreativeTemplate = buildCreativeTemplate;
function buildCreativeTemplate(data, theme) {
    const defaultTheme = {
        primary: "#2c3e50",
        secondary: "#64748b",
        background: "#ffffff",
        headingFont: "Playfair Display",
        bodyFont: "Inter",
    };
    const currentTheme = theme || defaultTheme;
    // Font size and family from data (user settings)
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 13; // Default 13px
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || "Inter, sans-serif";
    // Calculate responsive font sizes based on user font size
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
    const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size
    // Helper function to check if an array has meaningful content
    const hasContent = (arr) => {
        if (!arr || !Array.isArray(arr))
            return false;
        if (arr.length === 0)
            return false;
        // Check if any item has non-empty content
        return arr.some((item) => {
            if (typeof item === "string")
                return item.trim().length > 0;
            if (typeof item === "object" && item !== null) {
                return Object.values(item).some((val) => typeof val === "string" && val.trim().length > 0);
            }
            return false;
        });
    };
    // Helper to safely get non-empty array
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
  <!-- Google Fonts disabled for PDF compatibility -->
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --background-color: ${currentTheme.background};
      --heading-font: ${currentTheme.headingFont || "Playfair Display"};
      --body-font: ${currentTheme.bodyFont || "Inter"};
    }

    body {
      font-family: ${userFontFamily};
      color: #1e293b;
      line-height: 1.6;
      background: #fafaf8;
      font-size: ${baseFontSize}px;
    }
    .container {
      max-width: 820px;
      margin: 40px auto;
      background: var(--background-color);
      border-radius: 2px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
      position: relative;
    }
    
    /* Left Sidebar */
    .sidebar {
      width: 260px;
      background: var(--primary-color);
      color: white;
      padding: 40px 30px;
      float: left;
      height: 100%;
      min-height: 1000px;
    }
    
    /* Main Content */
    .main-content {
      margin-left: 260px;
      padding: 40px 45px;
    }
    
    /* Name */
    .name {
      font-family: var(--heading-font), serif;
      font-size: ${Math.round(baseFontSize * 2.4615)}px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 5px;
      letter-spacing: 0.5px;
    }

    /* Role */
    .role {
      font-size: ${Math.round(baseFontSize * 1.2308)}px;
      color: #ecf0f1;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Title */
    .title {
      font-size: ${Math.round(baseFontSize * 1.0769)}px;
      color: #ecf0f1;
      margin-bottom: 30px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Profile Image */
    .profile-image {
      position: absolute;
      top: 40px;
      right: 30px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px solid #3498db;
      overflow: hidden;
      z-index: 2;
    }
    .profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    /* Sidebar Sections */
    .sidebar-section {
      margin-bottom: 35px;
    }
    
    .sidebar-title {
      font-family: var(--heading-font), serif;
      font-size: ${Math.round(baseFontSize * 1.3846)}px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding-bottom: 8px;
      border-bottom: 2px solid #3498db;
    }
    
    /* Contact Info in Education Section */
    .education-contact {
      background: #34495e;
      padding: 15px;
      border-radius: 4px;
      margin-top: 10px;
    }
    
    .contact-item {
      margin-bottom: 8px;
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #ecf0f1;
    }
    
    /* Skills List */
    .skills-list {
      list-style: none;
      padding-left: 0;
    }
    
    .skill-item {
      margin-bottom: 10px;
      padding-left: 15px;
      position: relative;
      color: #ecf0f1;
      font-size: ${baseFontSize}px;
    }
    
    .skill-item:before {
      content: "•";
      color: #3498db;
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    
    /* Main Content Sections */
    .section {
      margin-bottom: 35px;
    }
    
    .section-title {
      font-family: var(--heading-font), serif;
      font-size: ${Math.round(baseFontSize * 1.5385)}px;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding-bottom: 8px;
      border-bottom: 2px solid #3498db;
      position: relative;
    }
    
    /* Experience Items */
    .experience-item {
      margin-bottom: 25px;
      padding-bottom: 20px;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .experience-item:last-child {
      border-bottom: none;
    }
    
    .experience-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    
    .experience-title {
      font-size: ${Math.round(baseFontSize * 1.1538)}px;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 4px;
    }
    
    .experience-company {
      font-size: ${baseFontSize}px;
      color: #3498db;
      font-weight: 500;
    }
    
    .experience-date {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #7f8c8d;
      font-weight: 500;
    }
    
    .experience-description {
      font-size: ${baseFontSize}px;
      color: #34495e;
      line-height: 1.6;
      margin-top: 10px;
    }

    .experience-description ul {
      margin: 8px 0 8px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .experience-description li {
      margin: 4px 0;
      padding: 0;
      color: #34495e;
    }

    .experience-description b {
      font-weight: 700;
      color: var(--primary-color);
    }
    
    /* Summary Box */
    .summary-box {
      background: #f8f9fa;
      padding: 20px;
      border-left: 4px solid #3498db;
      border-radius: 4px;
      margin-top: 10px;
    }
    
    .summary-text {
      font-size: ${baseFontSize}px;
      line-height: 1.7;
      color: #34495e;
    }
    
    /* Education Items */
    .education-item {
      margin-bottom: 25px;
      padding-bottom: 18px;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .education-item:last-child {
      border-bottom: none;
    }
    
    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
      flex-wrap: wrap;
    }
    
    .education-degree {
      font-size: ${Math.round(baseFontSize * 1.0769)}px;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 5px;
    }
    
    .education-school {
      font-size: ${baseFontSize}px;
      color: #7f8c8d;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .education-field {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #3498db;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .education-location {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #95a5a6;
      margin-bottom: 6px;
    }
    
    .education-date {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #7f8c8d;
      font-weight: 500;
    }
    
    .education-description {
      font-size: ${baseFontSize}px;
      color: #34495e;
      line-height: 1.6;
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
      color: #34495e;
    }

    .education-description b {
      font-weight: 700;
      color: var(--primary-color);
    }
    
    .education-achievements {
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid #bdc3c7;
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      font-weight: 600;
      color: #3498db;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .education-achievements ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }

    .education-achievements li {
      position: relative;
      padding-left: 15px;
      margin-bottom: 4px;
      color: #34495e;
      font-size: ${baseFontSize}px;
    }

    .education-achievements li:before {
      content: "•";
      color: #3498db;
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    
    /* Projects */
    .project-item {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #ecf0f1;
    }
    
    .project-item:last-child {
      border-bottom: none;
    }
    
    .project-name {
      font-size: ${Math.round(baseFontSize * 1.0769)}px;
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 5px;
    }
    
    .project-tech {
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      color: #3498db;
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .project-description {
      font-size: ${baseFontSize}px;
      color: #34495e;
      line-height: 1.6;
    }

    .project-description ul {
      margin: 8px 0 8px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .project-description li {
      margin: 4px 0;
      padding: 0;
      color: #34495e;
    }

    .project-description b {
      font-weight: 700;
      color: var(--primary-color);
    }
    
    /* Languages */
    .language-item {
      margin-bottom: 10px;
      font-size: ${baseFontSize}px;
      color: #34495e;
    }
    
    .language-name {
      font-weight: 600;
    }
    
    .language-level {
      color: #7f8c8d;
      margin-left: 8px;
    }
    
    /* Hobbies */
    .hobby-item {
      display: inline-block;
      background: #ecf0f1;
      color: var(--primary-color);
      padding: 6px 12px;
      border-radius: 3px;
      font-size: ${Math.round(baseFontSize * 0.9231)}px;
      font-weight: 500;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    
    /* Clearfix */
    .clearfix:after {
      content: "";
      display: table;
      clear: both;
    }
    
    /* Responsive */
    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        float: none;
        min-height: auto;
      }
      
      .main-content {
        margin-left: 0;
        padding: 30px;
      }
      
      .container {
        margin: 20px;
      }
    }
    
    @media print {
      body { background: white; }
      .container { margin: 0; box-shadow: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="container clearfix">
    <!-- Left Sidebar -->
    <div class="sidebar">

      <!-- Name -->
      <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== "undefined"
        ? data.personal.name
        : "Debanjali Lenka"}</div>
      ${data.personal?.role
        ? `<div class="title" data-section="personal">${data.personal.role}</div>`
        : ""}
      
      <!-- Contact Section -->
      ${hasContent([
        data.personal?.location,
        data.personal?.country,
        data.personal?.pinCode,
        data.personal?.phone,
        data.personal?.alternatePhone,
        data.personal?.email,
        data.personal?.linkedinUrl,
        data.personal?.githubUrl,
        data.personal?.portfolioUrl,
        data.personal?.website,
        data.personal?.twitterUrl,
        data.personal?.facebookUrl,
        data.personal?.instagramUrl,
        data.personal?.behanceUrl,
        data.personal?.dribbbleUrl,
        data.personal?.stackoverflowUrl,
        data.personal?.mediumUrl,
    ])
        ? `
      <div class="sidebar-section">
        <div class="sidebar-title">CONTACT</div>
        <!-- Contact Info -->

        <div class="education-contact" data-section="contact">
          ${data.personal?.location ||
            data.personal?.country ||
            data.personal?.pinCode ||
            data.personal?.fullAddress
            ? `<div class="contact-item" data-section="contact">${[
                data.personal?.location,
                data.personal?.country,
                data.personal?.pinCode,
                data.personal?.fullAddress,
            ]
                .filter(Boolean)
                .join(", ")}</div>`
            : ""}
          ${data.personal?.phone
            ? `<div class="contact-item" data-section="contact">${data.personal.phone}</div>`
            : ""}
          ${data.personal?.alternatePhone
            ? `<div class="contact-item" data-section="contact">${data.personal.alternatePhone}</div>`
            : ""}
          ${data.personal?.email
            ? `<div class="contact-item" data-section="contact">${data.personal.email}</div>`
            : ""}
          ${data.personal?.personalInfoDisplay === "inline"
            ? `
          ${data.personal?.fathersName
                ? `<div class="contact-item" data-section="contact">Father's Name: ${data.personal.fathersName}</div>`
                : ""}
          ${data.personal?.dob
                ? `<div class="contact-item" data-section="contact">DOB: ${data.personal.dob}</div>`
                : ""}
          ${data.personal?.gender
                ? `<div class="contact-item" data-section="contact">Gender: ${data.personal.gender}</div>`
                : ""}
          ${data.personal?.maritalStatus
                ? `<div class="contact-item" data-section="contact">Marital Status: ${data.personal.maritalStatus}</div>`
                : ""}
          ${data.personal?.nationality
                ? `<div class="contact-item" data-section="contact">Nationality: ${data.personal.nationality}</div>`
                : ""}
          `
            : ""}
          ${data.personal?.linkedinUrl
            ? `<div class="contact-item" data-section="contact"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>`
            : ""}
          ${data.personal?.githubUrl
            ? `<div class="contact-item" data-section="contact"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>`
            : ""}
          ${data.personal?.portfolioUrl
            ? `<div class="contact-item" data-section="contact"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>`
            : ""}
          ${data.personal?.website
            ? `<div class="contact-item" data-section="contact"><a href="${data.personal.website}" target="_blank">Website</a></div>`
            : ""}
          ${data.personal?.twitterUrl
            ? `<div class="contact-item" data-section="contact"><a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></div>`
            : ""}
          ${data.personal?.facebookUrl
            ? `<div class="contact-item" data-section="contact"><a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></div>`
            : ""}
          ${data.personal?.instagramUrl
            ? `<div class="contact-item" data-section="contact"><a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></div>`
            : ""}
          ${data.personal?.behanceUrl
            ? `<div class="contact-item" data-section="contact"><a href="${data.personal.behanceUrl}" target="_blank">Behance</a></div>`
            : ""}
          ${data.personal?.dribbbleUrl
            ? `<div class="contact-item" data-section="contact"><a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></div>`
            : ""}
          ${data.personal?.stackoverflowUrl
            ? `<div class="contact-item" data-section="contact"><a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></div>`
            : ""}
          ${data.personal?.mediumUrl
            ? `<div class="contact-item" data-section="contact"><a href="${data.personal.mediumUrl}" target="_blank">Medium</a></div>`
            : ""}
        </div>
      </div>
      `
        : ""}
      
      <!-- Skills Section -->
      ${data.sectionVisibility?.skills !== false &&
        getNonEmptyArray(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(",")).length > 0
        ? `<div class="sidebar-section">
        <div class="sidebar-title">SKILLS</div>


        <ul class="skills-list" data-section="skills">
          ${getNonEmptyArray(Array.isArray(data.skills)
            ? data.skills
            : (data.skills || "").split(","))
            .map((skill, index) => `
            <li class="skill-item" data-section="skills" data-index="${index}">${typeof skill === "string" ? skill.trim() : skill}</li>
          `)
            .join("")}
        </ul>
      </div>`
        : ""}
    </div>
    
    <!-- Main Content -->
    <div class="main-content">


      <!-- Summary Section -->
      ${data.sectionVisibility?.summary !== false && data.summary
        ? `<div class="section" data-section="summary">
        <div class="section-title" data-section="summary">SUMMARY</div>
        <div class="summary-box" data-section="summary">
          <p class="summary-text" data-section="summary">${data.summary}</p>
        </div>
      </div>`
        : ""}

      ${data.personal?.personalInfoDisplay !== "inline" &&
        (data.personal?.fathersName ||
            data.personal?.dob ||
            data.personal?.gender ||
            data.personal?.maritalStatus ||
            data.personal?.nationality ||
            data.personal?.passportNo)
        ? `<div class="section" data-section="personal">
        <div class="section-title" data-section="personal">PERSONAL DETAILS</div>
        <ul data-section="personal">
          ${data.personal?.fathersName
            ? `<li data-section="personal"><strong>Father's Name:</strong> ${data.personal.fathersName}</li>`
            : ""}
          ${data.personal?.dob
            ? `<li data-section="personal"><strong>Date of Birth:</strong> ${data.personal.dob}</li>`
            : ""}
          ${data.personal?.gender
            ? `<li data-section="personal"><strong>Gender:</strong> ${data.personal.gender}</li>`
            : ""}
          ${data.personal?.maritalStatus
            ? `<li data-section="personal"><strong>Marital Status:</strong> ${data.personal.maritalStatus}</li>`
            : ""}
          ${data.personal?.nationality
            ? `<li data-section="personal"><strong>Nationality:</strong> ${data.personal.nationality}</li>`
            : ""}
          ${data.personal?.passportNo
            ? `<li data-section="personal"><strong>Passport No:</strong> ${data.personal.passportNo}</li>`
            : ""}
        </ul>
      </div>`
        : ""}
      
      <!-- Experience Section -->

      ${data.sectionVisibility?.experience !== false &&
        data.experience &&
        data.experience.length > 0
        ? `<div class="section" data-section="experience">
        <div class="section-title" data-section="experience">EXPERIENCE</div>
        ${(data.experience || [])
            .map((exp, index) => `
          <div class="experience-item" data-section="experience" data-index="${index}">
            <div class="experience-header" data-section="experience" data-index="${index}">
              <div>
                <div class="experience-title" data-section="experience" data-index="${index}">${exp.title || ""}</div>
                <div class="experience-company" data-section="experience" data-index="${index}">${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}</div>
              </div>
              <div class="experience-date" data-section="experience" data-index="${index}">${exp.startDate || ""} - ${exp.endDate || "Present"}</div>
            </div>
            <div class="experience-description" data-section="experience" data-index="${index}">${exp.description || ""}</div>
          </div>
        `)
            .join("")}
      </div>`
        : ""}
      
      <!-- Education Section -->
      ${data.sectionVisibility?.education !== false &&
        data.education &&
        data.education.length > 0
        ? `<div class="section" data-section="education">
        <div class="section-title" data-section="education">EDUCATION</div>
        ${(data.education || [])
            .map((edu, index) => `
          <div class="education-item" data-section="education" data-index="${index}">
            <div class="education-header" data-section="education" data-index="${index}">
              <div class="education-degree" data-section="education" data-index="${index}">
                ${edu.degree || ""}${edu.qualification ? ` (${edu.qualification})` : ""}
              </div>
              <div class="education-date" data-section="education" data-index="${index}">${edu.graduationDate || ""}</div>
            </div>
            ${edu.school
            ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}</div>`
            : ""}
            ${edu.field
            ? `<div class="education-field" data-section="education" data-index="${index}">${edu.field}</div>`
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
                <h4>Achievements & Highlights</h4>
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
      </div>`
        : ""}
      
      <!-- Projects Section -->

      ${data.sectionVisibility?.projects !== false &&
        data.projects &&
        data.projects.length > 0
        ? `<div class="section">
        <div class="section-title">PROJECTS</div>
        ${(data.projects || [])
            .map((project, index) => `

          <div class="project-item" data-section="projects" data-index="${index}">
            <div class="project-name" data-section="projects" data-index="${index}">${project.name || ""}</div>
            ${project.startDate || project.endDate
            ? `<div class="project-tech" data-section="projects" data-index="${index}" style="margin-bottom: 5px;">${project.startDate || ""} ${project.startDate && project.endDate
                ? `- ${project.endDate}`
                : project.endDate
                    ? `- ${project.endDate}`
                    : ""}</div>`
            : ""}
            ${project.technologies
            ? `<div class="project-tech" data-section="projects" data-index="${index}">${project.technologies}</div>`
            : ""}
            <div class="project-description" data-section="projects" data-index="${index}">${project.description || ""}</div>
            ${project.url
            ? `<div style="margin-top: 8px;">
              <a href="${project.url}" target="_blank" style="font-size: ${Math.round(baseFontSize * 0.9231)}px; color: #3498db; font-weight: 500; text-decoration: none;">${project.urlText || "View Project"}</a>
            </div>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}



      ${data.sectionVisibility?.languages !== false &&
        data.languages &&
        data.languages.length > 0
        ? `<div class="section">
        <div class="section-title">LANGUAGES</div>
        <div class="languages-list" data-section="languages">
          ${(data.languages || [])
            .map((lang, index) => `
            <div class="language-item" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ""}</div>
          `)
            .join("")}
        </div>
      </div>`
        : ""}



      ${data.sectionVisibility?.hobbies !== false &&
        data.hobbies &&
        data.hobbies.length > 0
        ? `<div class="section">
        <div class="section-title">HOBBIES & INTERESTS</div>
        <div class="hobbies-list" data-section="hobbies">
          ${(data.hobbies || [])
            .map((hobby, index) => `
            <div class="hobby-item" data-section="hobbies" data-index="${index}">${hobby}</div>
          `)
            .join("")}
        </div>
      </div>`
        : ""}



      ${data.sectionVisibility?.socialLinks !== false &&
        data.socialLinks &&
        data.socialLinks.length > 0
        ? `<div class="section">
        <div class="section-title">SOCIAL LINKS</div>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px;" data-section="socialLinks">
          ${data.socialLinks
            .map((link, index) => `
            <a href="${link.url}" target="_blank" style="color: #3498db; text-decoration: none; font-weight: 500; font-size: ${baseFontSize}px;" data-section="socialLinks" data-index="${index}">${link.urlText ||
            link.url.replace("https://", "").replace("http://", "")}</a>
          `)
            .join("")}
        </div>
      </div>`
        : ""}



      ${data.sectionVisibility?.certifications !== false &&
        data.certifications &&
        data.certifications.length > 0
        ? `<div class="section">
        <div class="section-title">CERTIFICATIONS</div>
        ${(data.certifications || [])
            .map((cert, index) => `
          <div class="certification-item" data-section="certifications" data-index="${index}">
            <div class="certification-header" data-section="certifications" data-index="${index}">
              <div class="certification-name" data-section="certifications" data-index="${index}">${cert.name || ""}</div>
              <div class="certification-date" data-section="certifications" data-index="${index}">${cert.date || ""}</div>
            </div>
            <div class="certification-issuer" data-section="certifications" data-index="${index}">${cert.issuer || ""}</div>
            ${cert.url
            ? `<div style="margin-top: 8px;">
              <a href="${cert.url}" target="_blank" style="font-size: ${Math.round(baseFontSize * 0.9231)}px; color: #3498db; font-weight: 500; text-decoration: none;">View Certificate</a>
            </div>`
            : ""}
          </div>
        `)
            .join("")}
      </div>`
        : ""}





      ${data.keyAchievements && data.keyAchievements.length > 0
        ? `<div class="section" data-section="keyAchievements">
        <div class="section-title" data-section="keyAchievements">KEY ACHIEVEMENTS</div>
        <ul data-section="keyAchievements">
          ${(data.keyAchievements || [])
            .map((achievement, index) => `<li data-section="keyAchievements" data-index="${index}" style="margin-bottom: 8px; color: #34495e;">${achievement}</li>`)
            .join("")}
        </ul>
      </div>`
        : ""}






      ${getNonEmptyArray(Array.isArray(data.responsibilities)
        ? data.responsibilities
        : (data.responsibilities || "").split("\n")).length > 0
        ? `<div class="section" data-section="responsibilities">
        <div class="section-title" data-section="responsibilities">KEY RESPONSIBILITIES</div>
        <ul data-section="responsibilities">
          ${getNonEmptyArray(Array.isArray(data.responsibilities)
            ? data.responsibilities
            : (data.responsibilities || "").split("\n"))
            .map((line, index) => `<li data-section="responsibilities" data-index="${index}" style="margin-bottom: 8px; color: #34495e;">${line.trim()}</li>`)
            .join("")}
        </ul>
      </div>`
        : ""}






      ${hasContent(data.tools)
        ? `<div class="section" data-section="tools">
        <div class="section-title" data-section="tools">TOOLS & TECHNOLOGIES</div>
        <ul data-section="tools">
          ${getNonEmptyArray(Array.isArray(data.tools)
            ? data.tools
            : (data.tools || "").split("\n"))
            .map((line, index) => `<li data-section="tools" data-index="${index}" style="margin-bottom: 8px; color: #34495e;">${line.trim()}</li>`)
            .join("")}
        </ul>
      </div>`
        : ""}


      <!-- Custom Sections -->
      ${data.customSections && data.customSections.length > 0
        ? data.customSections
            .filter((section) => section.isVisible)
            .map((section) => `
        <div class="section" data-section="customSections">
          <div class="section-title" data-section="customSections">${section.heading || "Custom Section"}</div>
          ${section.entries && section.entries.length > 0
            ? section.entries
                .filter((entry) => entry.isVisible)
                .map((entry, entryIndex) => `
            <div class="experience-item" data-section="customSections" data-index="${entryIndex}">
              <div class="experience-header" data-section="customSections" data-index="${entryIndex}">
                <div>

                  ${entry.title || entry.organization
                ? `<div class="experience-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ""}${entry.title && entry.organization ? " at " : ""}${entry.organization || ""}</div>`
                : ""}
                </div>
                ${entry.date
                ? `<div class="experience-date" data-section="customSections" data-index="${entryIndex}">${entry.date}</div>`
                : ""}
              </div>
              ${entry.description
                ? `<div class="experience-description" data-section="customSections" data-index="${entryIndex}">${entry.description}</div>`
                : ""}
            </div>
          `)
                .join("")
            : '<div style="color: #7f8c8d; font-style: italic;">No entries in this section</div>'}
        </div>
      `)
            .join("")
        : ""}
    </div>
  </div>
</body>
</html>`;
}
