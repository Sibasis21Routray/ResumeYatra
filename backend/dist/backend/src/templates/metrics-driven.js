"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMetricsDrivenTemplate = buildMetricsDrivenTemplate;
function buildMetricsDrivenTemplate(data, theme) {
    const defaultTheme = {
        primary: '#1a1a1a',
        secondary: '#555555',
        background: '#ffffff',
        accent: '#959a88', // Sidebar background
        lightAccent: '#e5e4db', // Header right background
        headingFont: 'Arial, sans-serif',
        bodyFont: 'Arial, sans-serif'
    };
    const currentTheme = theme || defaultTheme;
    const bodyFontSize = '9pt';
    const headingFontSize = '12pt';
    const nameFontSize = '32pt';
    const sortedExperience = data.experience ? [...data.experience].sort((a, b) => new Date(b.startDate || '1900-01-01').getTime() - new Date(a.startDate || '1900-01-01').getTime()) : [];
    // Helper function to check if a value is empty
    const isEmpty = (val) => {
        if (val === null || val === undefined)
            return true;
        if (typeof val === 'string')
            return val.trim().length === 0;
        if (Array.isArray(val))
            return val.length === 0;
        if (typeof val === 'object')
            return Object.keys(val).length === 0;
        return false;
    };
    // Helper function to check if a section has content
    const hasResponsibilitiesContent = (Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).length > 0;
    const hasToolsContent = (data.tools && (Array.isArray(data.tools) ? data.tools.length > 0 : (data.tools || '').trim().length > 0));
    const hasSkillsContent = (data.skills && (Array.isArray(data.skills) ? data.skills.length > 0 : (data.skills || '').trim().length > 0));
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --accent-color: ${currentTheme.accent};
      --light-accent: ${currentTheme.lightAccent};
    }

    body {
      font-family: ${currentTheme.bodyFont};
      color: var(--primary-color);
      line-height: 1.5;
      margin: 0; padding: 0;
      background: white;
    }

    .container {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    /* Dual Tone Header */
    .header {
      display: flex;
      width: 100%;
      height: 180px;
    }

    .header-left {
      width: 35%;
      background-color: var(--accent-color);
    }

    .header-right {
      width: 65%;
      background-color: var(--light-accent);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 40px;
    }

    .name {
      font-size: ${nameFontSize};
      font-weight: bold;
      margin: 0;
      color: var(--primary-color);
      letter-spacing: 1px;
    }

    .job-title {
      font-size: 14pt;
      text-transform: uppercase;
      color: var(--secondary-color);
      letter-spacing: 2px;
      margin-top: 5px;
    }

    /* Main Content Layout */
    .main-grid {
      display: flex;
      width: 100%;
    }

    /* Sidebar - Olive/Muted Side */
    .sidebar {
      width: 35%;
      background-color: var(--accent-color);
      color: black;
      padding: 20px 30px;
      min-height: calc(100vh - 180px);
    }

    .profile-img-container {
      width: 100%;
      aspect-ratio: 1/1.2;
      background: #ccc;
      margin-top: -100px;
      margin-bottom: 30px;
      border: 4px solid white;
      overflow: hidden;
    }

    .profile-img-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Right Main Content */
    .content {
      width: 65%;
      background-color: var(--light-accent);
      padding: 40px;
    }

    .section-title-sidebar {
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      border-bottom: 1px solid rgba(255,255,255,0.3);
      padding-bottom: 5px;
      margin-top: 30px;
      margin-bottom: 15px;
      color: var(--primary-color);
    }

    .section-title-main {
      font-size: ${headingFontSize};
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--primary-color);
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
      margin-bottom: 20px;
      margin-top: 10px;
    }

    /* Skill Indicator Styles */
    .skill-item {
      margin-bottom: 12px;
      font-size: 9pt;
    }

    /* Work Experience Entry */
    .exp-item {
      margin-bottom: 30px;
    }

    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      font-weight: bold;
      font-size: 10pt;
    }

    .exp-subhead {
      font-style: italic;
      color: var(--secondary-color);
      font-size: 9pt;
      margin-bottom: 8px;
    }

    /* Contact Footer Style */
    .footer-contact {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      gap: 10px;
      background-color: #e2e2d9;
      padding: 15px;
      font-size: 8pt;
      border-top: 1px solid #ccc;
    }

    p, li { font-size: ${bodyFontSize}; margin-bottom: 5px; }
    ul { padding-left: 15px; margin-top: 5px; }

    /* Enhanced Education Styles */
    .education-entry {
      margin-bottom: 25px;
      padding: 15px;
      background: rgba(255,255,255,0.7);
      border: 1px solid rgba(0,0,0,0.1);
      border-left: 4px solid var(--secondary-color);
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .education-degree {
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 5px;
      font-size: 10pt;
    }

    .education-field {
      font-weight: 600;
      color: var(--secondary-color);
      margin-bottom: 4px;
      font-size: 9pt;
    }

    .education-school {
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 4px;
      font-size: 10pt;
    }

    .education-location {
      color: var(--secondary-color);
      font-style: italic;
      margin-bottom: 6px;
      font-size: 9pt;
    }

    .education-date {
      font-size: 9pt;
      color: var(--secondary-color);
      font-weight: 600;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .education-description {
      font-size: 9pt;
      color: var(--secondary-color);
      line-height: 1.5;
      margin-top: 10px;
      padding: 10px;
      background: rgba(255,255,255,0.9);
      border-radius: 3px;
      border-left: 2px solid var(--secondary-color);
    }

    .education-description ul {
      margin: 4px 0 4px 15px;
      padding: 0;
      list-style-type: disc;
    }

    .education-description li {
      margin: 2px 0;
      color: var(--secondary-color);
    }

    .education-description b {
      font-weight: bold;
      color: var(--primary-color);
    }

    .education-achievements {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid rgba(0,0,0,0.1);
    }

    .education-achievements h4 {
      font-size: 9pt;
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .education-achievements ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }

    .education-achievements li {
      position: relative;
      padding-left: 14px;
      margin-bottom: 3px;
      color: var(--secondary-color);
      font-size: 9pt;
    }

    .education-achievements li:before {
      content: "📊";
      position: absolute;
      left: 0;
      font-size: 8pt;
    }
  </style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="header-left"></div>
    <div class="header-right" data-section="personal">
      <h1 class="name">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Your Name'}</h1>
      <div style="font-size: 8pt; margin-top: 10px; display: flex; flex-wrap: wrap; gap: 15px; color: var(--secondary-color);">
        ${data.personal?.email ? `<span>✉️ ${data.personal.email}</span>` : ''}
        ${data.personal?.phone ? `<span>📞 ${data.personal.phone}</span>` : ''}
        ${data.personal?.alternatePhone ? `<span>📱 ${data.personal.alternatePhone}</span>` : ''}
        ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<span>📍 ${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</span>` : ''}
        ${data.personal?.linkedinUrl ? `<span>🔗 <a href="${data.personal.linkedinUrl}" target="_blank" style="color: inherit;">LinkedIn</a></span>` : ''}
        ${data.personal?.githubUrl ? `<span>💻 <a href="${data.personal.githubUrl}" target="_blank" style="color: inherit;">GitHub</a></span>` : ''}
        ${data.personal?.portfolioUrl ? `<span>🌐 <a href="${data.personal.portfolioUrl}" target="_blank" style="color: inherit;">Portfolio</a></span>` : ''}
        ${data.personal?.website ? `<span>🌐 <a href="${data.personal.website}" target="_blank" style="color: inherit;">Website</a></span>` : ''}
      </div>
    </div>
  </div>

  <div class="main-grid">
    <div class="sidebar">
      <div class="profile-img-container">
        ${data.personal?.image ? `<img src="${data.personal.image}" alt="Profile">` : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">Photo</div>`}
      </div>

      ${(data.personal?.fathersName || data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus) ? `<div class="sidebar-section" data-section="personal">
        <div class="section-title-sidebar">PERSONAL DETAILS</div>
        <div style="font-size: 9pt; color: rgba(19, 20, 20, 0.9); display: flex; flex-direction: column; gap: 6px;">
          ${data.personal?.fathersName ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ''}
          ${data.personal?.dob ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>` : ''}
          ${data.personal?.gender ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>` : ''}
          ${data.personal?.maritalStatus ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ''}
        </div>
      </div>` : ''}

      ${!isEmpty(data.summary) ? `
      <div class="sidebar-section" data-section="summary">
        <div class="section-title-sidebar">PROFILE</div>
        <p style="color: rgba(19, 20, 20, 0.9);">${data.summary || ''}</p>
      </div>` : ''}

      ${hasSkillsContent ? `
      <div class="sidebar-section" data-section="skills">
        <div class="section-title-sidebar">SKILLS</div>
        ${Array.isArray(data.skills) ? data.skills.map((s, index) => `<div class="skill-item" data-section="skills" data-index="${index}">• ${s}</div>`).join('') : `<div class="skill-item" data-section="skills" data-index="0">${data.skills || ''}</div>`}
      </div>` : ''}

      ${(data.keyAchievements && data.keyAchievements.length > 0) ? `
      <div class="sidebar-section" data-section="keyAchievements">
        <div class="section-title-sidebar">AWARDS</div>
        ${data.keyAchievements.map((a, index) => `<div class="skill-item" data-section="keyAchievements" data-index="${index}">• ${a}</div>`).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `<div class="sidebar-section" data-section="languages">
        <div class="section-title-sidebar">LANGUAGES</div>
        <div style="font-size: 9pt; color: rgba(22, 21, 21, 0.9);">${data.languages.map((lang) => `${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}`).join(', ')}</div>
      </div>` : ''}

      ${(data.sectionVisibility?.hobbies !== false && data.hobbies && data.hobbies.length > 0) ? `<div class="sidebar-section" data-section="hobbies">
        <div class="section-title-sidebar">HOBBIES</div>
        <div style="font-size: 9pt; color: rgba(46, 44, 44, 0.9);">${data.hobbies.join(', ')}</div>
      </div>` : ''}

      ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `<div class="sidebar-section" data-section="socialLinks">
        <div class="section-title-sidebar">SOCIAL LINKS</div>
        <div style="font-size: 9pt; color: rgba(46, 44, 44, 0.9);">${data.socialLinks.map((link, index) => `<a href="${link.url}" target="_blank" style="color: inherit; text-decoration: none;">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>`).join(', ')}</div>
      </div>` : ''}

      ${hasResponsibilitiesContent ? `<div class="sidebar-section" data-section="responsibilities">
        <div class="section-title-sidebar">RESPONSIBILITIES</div>
        <ul style="color: rgba(31, 30, 30, 0.9);">
          ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).map((line, index) => `<li style="font-size: 9pt;" data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${hasToolsContent ? `<div class="sidebar-section" data-section="tools">
        <div class="section-title-sidebar">TOOLS</div>
        <div style="font-size: 9pt; color: rgba(32, 31, 31, 0.9);">${Array.isArray(data.tools) ? data.tools.join(', ') : data.tools}</div>
      </div>` : ''}
    </div>

    <div class="content">
      ${(sortedExperience && sortedExperience.length > 0) ? `
      <div class="main-section" data-section="experience">
        <div class="section-title-main">WORK EXPERIENCE</div>
        ${sortedExperience.map((exp, index) => `
          <div class="exp-item" data-section="experience" data-index="${index}">
            <div class="exp-header">
              <span>${exp.title || ''}</span>
            </div>
            <div class="exp-subhead">
              ${exp.company || ''} | ${exp.startDate || ''} - ${exp.endDate || 'Present'}
            </div>
            <ul>
              ${exp.description && typeof exp.description === 'string' ? exp.description.split('\n').filter((l) => l.trim()).map((l, lineIndex) => `<li data-section="experience" data-index="${index}" data-item-index="${lineIndex}">${l}</li>`).join('') : ''}
            </ul>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.education && data.education.length > 0) ? `
      <div class="main-section" data-section="education">
        <div class="section-title-main">EDUCATIONAL HISTORY</div>
        ${data.education?.map((edu, index) => `
          <div class="education-entry" data-section="education" data-index="${index}">
            <div class="education-degree" data-section="education" data-index="${index}">
              ${edu.degree || ''}${edu.qualification ? ` (${edu.qualification})` : ''}
            </div>
            
            ${edu.field ? `<div class="education-field" data-section="education" data-index="${index}">${edu.field}</div>` : ''}
            ${edu.school ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}</div>` : ''}
            ${edu.location ? `<div class="education-location" data-section="education" data-index="${index}">${edu.location}</div>` : ''}
            <div class="education-date" data-section="education" data-index="${index}">${edu.graduationDate || ''}</div>
            
            ${edu.description ? `
              <div class="education-description" data-section="education" data-index="${index}">
                ${edu.description.includes('<ul>') || edu.description.includes('<li>')
        ? edu.description
        : `<p>${edu.description}</p>`}
              </div>
            ` : ''}
            
            ${edu.achievements && edu.achievements.length > 0 ? `
              <div class="education-achievements" data-section="education" data-index="${index}">
                <h4>Academic Excellence</h4>
                <ul>
                  ${edu.achievements.filter((achievement) => achievement.trim()).map((achievement, achIndex) => `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) ? `<div class="main-section" data-section="projects">
        <div class="section-title-main">PROJECTS</div>
        ${data.projects.map((project, index) => `
          <div class="exp-item" data-section="projects" data-index="${index}">
            <div class="exp-header" data-section="projects" data-index="${index}">${project.name || ''}${project.technologies ? ` | ${project.technologies}` : ''}</div>
            <div class="exp-subhead" data-section="projects" data-index="${index}">${project.startDate || ''} - ${project.endDate || 'Present'}</div>
            <p data-section="projects" data-index="${index}">${project.description || ''}</p>
            ${project.url ? `<p style="font-size: 8pt;"><a href="${project.url}" target="_blank" data-section="projects" data-index="${index}">${project.urlText || 'View Project'}</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `<div class="main-section" data-section="certifications">
        <div class="section-title-main">CERTIFICATIONS</div>
        ${data.certifications.map((cert, index) => `
          <div class="exp-item" data-section="certifications" data-index="${index}">
            <div class="exp-header" data-section="certifications" data-index="${index}">${cert.name || ''}</div>
            <div class="exp-subhead" data-section="certifications" data-index="${index}">${cert.issuer || ''} | ${cert.date || ''}</div>
            ${cert.url ? `<p style="font-size: 8pt;"><a href="${cert.url}" target="_blank" data-section="certifications" data-index="${index}">View Certificate</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section) => section.isVisible && section.entries && section.entries.length > 0 && section.entries.some((entry) => entry.isVisible)).map((section, sectionIndex) => `
      <div class="main-section" data-section="customSections">
        <div class="section-title-main">${section.heading || 'Custom Section'}</div>
        ${section.entries.filter((entry) => entry.isVisible).map((entry, entryIndex) => `
          <div class="exp-item" data-section="customSections" data-index="${entryIndex}">
            <div class="exp-header" data-section="customSections" data-index="${entryIndex}">${entry.title || ''}${entry.organization ? ` | ${entry.organization}` : ''}${entry.date ? ` | ${entry.date}` : ''}</div>
            ${entry.description ? `<p data-section="customSections" data-index="${entryIndex}">${entry.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      `).join('') : ''}
    </div>
  </div>

  <div class="footer-contact" data-section="personal">
    ${data.personal?.phone ? `<span data-section="personal" data-index="0">📞 ${data.personal.phone}</span>` : ''}
    ${data.personal?.alternatePhone ? `<span data-section="personal" data-index="1">📞 ${data.personal.alternatePhone}</span>` : ''}
    ${data.personal?.email ? `<span data-section="personal" data-index="2">✉️ ${data.personal.email}</span>` : ''}
    ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<span data-section="personal" data-index="3">📍 ${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</span>` : ''}
    ${data.personal?.linkedinUrl ? `<span data-section="personal" data-index="6">🔗 <a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></span>` : ''}
    ${data.personal?.githubUrl ? `<span data-section="personal" data-index="7">💻 <a href="${data.personal.githubUrl}" target="_blank">GitHub</a></span>` : ''}
    ${data.personal?.portfolioUrl ? `<span data-section="personal" data-index="8">🌐 <a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></span>` : ''}
    ${data.personal?.website ? `<span data-section="personal" data-index="9">🌐 <a href="${data.personal.website}" target="_blank">Website</a></span>` : ''}
  </div>
</div>
</body>
</html>`;
}
