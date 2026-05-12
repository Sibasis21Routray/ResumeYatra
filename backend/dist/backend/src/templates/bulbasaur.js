"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildBulbasaurTemplate = buildBulbasaurTemplate;
function buildBulbasaurTemplate(data, theme) {
    const defaultTheme = {
        primary: '#2d3748', // Dark Grey/Black for text
        secondary: '#4a5568', // Lighter grey
        background: '#ffffff',
        headingFont: 'Libre Baskerville',
        bodyFont: 'Source Sans Pro'
    };
    // --- PRESERVED LOGIC START ---
    const currentTheme = theme || defaultTheme;
    // Font size and family from data (user settings)
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 12; // Default 12px
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Inter, sans-serif';
    // Calculate responsive font sizes based on user font size
    const baseFontSize = userFontSize;
    const headingFontSize = Math.round(userFontSize * 2.25); // 2.25x base size
    const subheadingFontSize = Math.round(userFontSize * 1.125); // 1.125x base size
    // --- PRESERVED LOGIC END ---
    const headerBg = currentTheme.secondary; // Light grey for header top
    const contactBg = currentTheme.primary; // Dark grey for contact bar
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: ${userFontFamily};
      color: #1a202c;
      line-height: 1.6;
      background: #ffffff;
      font-size: ${baseFontSize}px;
    }
    .container {
      max-width: 850px;
      margin: 0 auto;
      background: #ffffff;
      min-height: 100vh;
    }

    /* --- HEADER STYLES --- */
    .header-top {
      background-color: ${headerBg};
      padding: 30px 40px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .logo-box {
      width: 60px;
      height: 60px;
      background-color: ${currentTheme.primary};
      color: ${currentTheme.secondary};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      font-family: 'Times New Roman', serif;
      border-radius: 2px;
      overflow: hidden;
    }

    .logo-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .name {
      font-family: 'Times New Roman', serif;
      font-size: ${Math.round(baseFontSize * 2.5)}px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #1a202c;
    }

    .role {
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      color: #1a202c;
      margin-top: 5px;
      font-weight: 600;
    }

    .contact-bar {
      background-color: ${contactBg};
      color: #ffffff;
      padding: 10px 40px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      align-items: center;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .contact-item a {
      color: ${currentTheme.secondary};
      text-decoration: none;
    }

    .contact-separator {
      color: #cbd5e0;
    }

    /* --- LAYOUT GRID --- */
    .content-grid {
      display: flex;
      padding: 40px;
      gap: 40px;
    }

    .left-column {
      width: 35%;
      flex-shrink: 0;
    }

    .right-column {
      flex-grow: 1;
    }

    /* --- SECTION STYLES --- */
    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-family: 'Times New Roman', serif;
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 700;
      text-transform: uppercase;
      color: ${currentTheme.primary};
      margin-bottom: 15px;
      border-bottom: 1px solid #cbd5e0;
      padding-bottom: 5px;
      letter-spacing: 0.5px;
    }

    /* --- TEXT STYLES --- */
    p {
      margin-bottom: 10px;
      text-align: justify;
    }

    ul {
      margin: 0;
      padding-left: 18px;
    }

    li {
      margin-bottom: 5px;
    }

    /* --- ENTRY STYLES (Right Column) --- */
    .entry {
      margin-bottom: 25px;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
      flex-wrap: wrap;
    }

    .entry-title {
      font-weight: 700;
      font-size: ${subheadingFontSize}px;
      color: ${currentTheme.primary};
    }

    .entry-date {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: ${currentTheme.secondary};
      font-style: italic;
    }

    .entry-subtitle {
      font-size: ${baseFontSize}px;
      font-weight: 600;
      color: ${currentTheme.secondary};
      margin-bottom: 8px;
    }

    /* --- EDUCATION & SKILLS (Left Column) --- */
    .edu-entry {
      margin-bottom: 15px;
    }
    
    .edu-degree {
      font-weight: 700;
      font-size: ${baseFontSize}px;
      color: ${currentTheme.primary};
    }

    .edu-school {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      color: ${currentTheme.secondary};
    }
    
    .edu-date {
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      color: ${currentTheme.secondary};
      font-style: italic;
    }

    /* Enhanced Education Styles */
    .education-field {
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 4px;
      font-size: ${baseFontSize}px;
    }

    .education-school-enhanced {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      color: ${currentTheme.secondary};
      margin-bottom: 4px;
    }

    .education-location {
      color: ${currentTheme.secondary};
      font-style: italic;
      margin-bottom: 6px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
    }

    .education-description {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      color: ${currentTheme.secondary};
      line-height: 1.6;
      margin-top: 6px;
      padding: 8px;
      background: #f7fafc;
      border-left: 3px solid ${currentTheme.primary};
      border-radius: 2px;
    }

    .education-description ul {
      margin: 5px 0 5px 18px;
      padding: 0;
      list-style-type: disc;
    }

    .education-description li {
      margin: 3px 0;
      color: ${currentTheme.secondary};
    }

    .education-description b {
      font-weight: 700;
      color: ${currentTheme.primary};
    }

    .education-achievements {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #cbd5e0;
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.85)}px;
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 6px;
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
      padding-left: 14px;
      margin-bottom: 3px;
      color: ${currentTheme.secondary};
      font-size: ${Math.round(baseFontSize * 0.9)}px;
    }

    .education-achievements li:before {
      content: "▲";
      color: ${currentTheme.primary};
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    .skill-item {
      display: block;
      margin-bottom: 6px;
      font-size: ${baseFontSize}px;
    }

    /* Helper to get initials */
    .initials {
       text-transform: uppercase;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; }
      .container { width: 100%; max-width: none; margin: 0; padding: 0; }
      .header-top { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .contact-bar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .logo-box { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
<div class="container">

  <div class="header-top" data-section="personal">
    <div class="logo-box" data-section="personal">
      ${data.personal?.image ? `<img src="${data.personal.image}" alt="Profile">` : `<span class="initials">${(data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'VN').split(' ').map((n) => n[0]).join('').substring(0, 2)}</span>`}
    </div>
    <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'YOUR NAME'}</div>
    ${data.personal?.role ? `<div class="role" data-section="personal">${data.personal.role}</div>` : ''}
  </div>

  <div class="contact-bar" data-section="personal">
    ${data.personal?.email ? `<div class="contact-item" data-section="personal"><span>${data.personal.email}</span></div>` : ''}
    ${data.personal?.phone ? `<div class="contact-item" data-section="personal"><span class="contact-separator">•</span><span>${data.personal.phone}</span></div>` : ''}
    ${data.personal?.alternatePhone ? `<div class="contact-item" data-section="personal"><span class="contact-separator">•</span><span>${data.personal.alternatePhone}</span></div>` : ''}
    ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<div class="contact-item" data-section="personal"><span class="contact-separator">•</span><span>${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</span></div>` : ''}
    ${data.personal?.linkedinUrl ? `<div class="contact-item" data-section="personal"><span class="contact-separator">•</span><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>` : ''}
    ${data.personal?.githubUrl ? `<div class="contact-item" data-section="personal"><span class="contact-separator">•</span><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>` : ''}
    ${data.personal?.portfolioUrl ? `<div class="contact-item" data-section="personal"><span class="contact-separator">•</span><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>` : ''}
    ${data.personal?.website ? `<div class="contact-item" data-section="personal"><span class="contact-separator">•</span><a href="${data.personal.website}" target="_blank">Website</a></div>` : ''}
  </div>

    <div class="content-grid">

      <div class="left-column">

        ${(data.personal?.fathersName || data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus) ? `<div class="section" data-section="personal">
          <div class="section-title" data-section="personal">Personal Details</div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${baseFontSize}px; color: ${currentTheme.secondary};">
            ${data.personal?.fathersName ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ''}
            ${data.personal?.dob ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>` : ''}
            ${data.personal?.gender ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>` : ''}
            ${data.personal?.maritalStatus ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ''}
          </div>
        </div>` : ''}

        ${(data.sectionVisibility?.summary !== false && data.summary && data.summary.trim()) ? `<div class="section" data-section="summary">
          <div class="section-title" data-section="summary">Summary of Qualifications</div>
          <p data-section="summary">${data.summary}</p>
        </div>` : ''}

        ${(data.sectionVisibility?.education !== false && data.education && data.education.length > 0) ? `<div class="section" data-section="education">
          <div class="section-title" data-section="education">Education</div>
          ${(data.education || []).filter((edu) => edu.degree || edu.qualification || edu.field || edu.school || edu.graduationDate || edu.description).map((edu, index) => `
            <div class="edu-entry" data-section="education" data-index="${index}">
              <div class="edu-degree" data-section="education" data-index="${index}">
                ${edu.degree || ''}${edu.qualification ? ` (${edu.qualification})` : ''}
              </div>
              
              ${edu.field ? `<div class="education-field" data-section="education" data-index="${index}">${edu.field}</div>` : ''}
              ${edu.school ? `<div class="education-school-enhanced" data-section="education" data-index="${index}">${edu.school}</div>` : ''}
              ${edu.location ? `<div class="education-location" data-section="education" data-index="${index}">${edu.location}</div>` : ''}
              <div class="edu-date" data-section="education" data-index="${index}">${edu.graduationDate || ''}</div>
              
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

        ${(data.sectionVisibility?.skills !== false && data.skills && (Array.isArray(data.skills) ? data.skills.filter((skill) => skill && (typeof skill === 'string' ? skill.trim() : skill)) : (data.skills || '').split(',').filter((skill) => skill.trim())).length > 0) ? `<div class="section" data-section="skills">
          <div class="section-title" data-section="skills">Areas of Expertise</div>
          <ul data-section="skills">
            ${(Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',')).filter((skill) => skill && (typeof skill === 'string' ? skill.trim() : skill)).map((skill, index) => `
              <li data-section="skills" data-index="${index}">${typeof skill === 'string' ? skill.trim() : skill}</li>
            `).join('')}
          </ul>
        </div>` : ''}

        ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `<div class="section" data-section="languages">
          <div class="section-title" data-section="languages">Languages</div>
          <ul data-section="languages">
            ${(data.languages || []).map((lang, index) => `
              <li data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}</li>
            `).join('')}
          </ul>
        </div>` : ''}

        ${(data.sectionVisibility?.hobbies !== false && data.hobbies && data.hobbies.length > 0) ? `<div class="section" data-section="hobbies">
          <div class="section-title" data-section="hobbies">Hobbies</div>
          <ul data-section="hobbies">
            ${(data.hobbies || []).map((hobby, index) => `
              <li data-section="hobbies" data-index="${index}">${hobby}</li>
            `).join('')}
          </ul>
        </div>` : ''}

        ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `<div class="section" data-section="socialLinks">
          <div class="section-title" data-section="socialLinks">Social Links</div>
          <ul data-section="socialLinks">
            ${data.socialLinks.map((link, index) => `
              <li data-section="socialLinks" data-index="${index}"><a href="${link.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none;">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a></li>
            `).join('')}
          </ul>
        </div>` : ''}

      </div>

      <div class="right-column">

        ${(data.sectionVisibility?.experience !== false && data.experience && data.experience.length > 0) ? `<div class="section" data-section="experience">
          <div class="section-title" data-section="experience">Professional Experience</div>
          ${(data.experience || []).filter((exp) => exp.title || exp.company || exp.description || exp.startDate || exp.endDate).map((exp, index) => `
            <div class="entry" data-section="experience" data-index="${index}">
              <div class="entry-header" data-section="experience" data-index="${index}">
                <div class="entry-title" data-section="experience" data-index="${index}">${exp.title || ''}</div>
                <div class="entry-date" data-section="experience" data-index="${index}">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
              </div>
              <div class="entry-subtitle" data-section="experience" data-index="${index}">${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</div>
              <div class="entry-content" data-section="experience" data-index="${index}">${exp.description || ''}</div>
            </div>
          `).join('')}
        </div>` : ''}

        ${(data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) ? `<div class="section" data-section="projects">
          <div class="section-title" data-section="projects">Projects</div>
          ${(data.projects || []).filter((project) => project.name || project.technologies || project.description || project.startDate || project.endDate).map((project, index) => `
            <div class="entry" data-section="projects" data-index="${index}">
              <div class="entry-header" data-section="projects" data-index="${index}">
                <div class="entry-title" data-section="projects" data-index="${index}">${project.name || ''}</div>
                <div class="entry-date" data-section="projects" data-index="${index}">${project.startDate || ''} ${project.endDate ? `- ${project.endDate}` : ''}</div>
              </div>
              <div class="entry-subtitle" data-section="projects" data-index="${index}">${project.technologies || ''}</div>
              <div class="entry-content" data-section="projects" data-index="${index}">${project.description || ''}</div>
              ${project.url ? `<div style="margin-top:5px; font-size: ${Math.round(baseFontSize * 0.9)}px;" data-section="projects" data-index="${index}"><a href="${project.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">${project.urlText || 'View Project'}</a></div>` : ''}
            </div>
          `).join('')}
        </div>` : ''}

        ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `<div class="section" data-section="certifications">
          <div class="section-title" data-section="certifications">Certifications</div>
          ${(data.certifications || []).filter((cert) => cert.name || cert.issuer || cert.date || cert.url).map((cert, index) => `
            <div class="entry" data-section="certifications" data-index="${index}">
              <div class="entry-header" data-section="certifications" data-index="${index}">
                <div class="entry-title" data-section="certifications" data-index="${index}">${cert.name || ''}</div>
                <div class="entry-date" data-section="certifications" data-index="${index}">${cert.date || ''}</div>
              </div>
              <div class="entry-subtitle" data-section="certifications" data-index="${index}">${cert.issuer || ''}</div>
              ${cert.url ? `<div style="margin-top:5px; font-size: ${Math.round(baseFontSize * 0.9)}px;" data-section="certifications" data-index="${index}"><a href="${cert.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Certificate</a></div>` : ''}
            </div>
          `).join('')}
        </div>` : ''}

        ${data.keyAchievements && data.keyAchievements.filter((a) => a && a.trim()).length > 0 ? `<div class="section" data-section="keyAchievements">
          <div class="section-title" data-section="keyAchievements">Key Achievements</div>
          <ul data-section="keyAchievements">
            ${(data.keyAchievements || []).filter((achievement) => achievement && achievement.trim()).map((achievement, index) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
          </ul>
        </div>` : ''}


        ${data.responsibilities && (Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line && line.trim()).length > 0 ? `<div class="section" data-section="responsibilities">
          <div class="section-title" data-section="responsibilities">Key Responsibilities</div>
          <ul data-section="responsibilities">
            ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line && line.trim()).map((line, index) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
          </ul>
        </div>` : ''}

        ${data.tools && (Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line) => line && line.trim()).length > 0 ? `<div class="section" data-section="tools">
          <div class="section-title" data-section="tools">Tools & Technologies</div>
          <ul data-section="tools">
            ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line) => line && line.trim()).map((line, index) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
          </ul>
        </div>` : ''}


        ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section) => section.isVisible && section.entries && section.entries.some((entry) => entry.isVisible && (entry.title || entry.organization || entry.description))).map((section) => `
        <div class="section" data-section="customSections">
          <div class="section-title" data-section="customSections">${section.heading || 'Custom Section'}</div>
          ${section.entries && section.entries.length > 0 ? section.entries.filter((entry) => entry.isVisible && (entry.title || entry.organization || entry.description)).map((entry, entryIndex) => `
            <div class="entry" data-section="customSections" data-index="${entryIndex}">
              <div class="entry-header" data-section="customSections" data-index="${entryIndex}">
                <div class="entry-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
                ${entry.date ? `<div class="entry-date" data-section="customSections" data-index="${entryIndex}">${entry.date}</div>` : ''}
              </div>
              ${entry.description ? `<div class="entry-content" data-section="customSections" data-index="${entryIndex}">${entry.description}</div>` : ''}
            </div>
          `).join('') : ''}
        </div>
        `).join('') : ''}

      </div>

    </div>
  </div>
</body>
</html>`;
}
