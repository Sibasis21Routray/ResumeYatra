"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEeveeTemplate = buildEeveeTemplate;
function buildEeveeTemplate(data, theme) {
    const defaultTheme = {
        primary: '#000000',
        secondary: '#444444',
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
      color: #000000;
      line-height: 1.6;
      background: #ffffff;
      font-size: ${baseFontSize}px;
    }
    
    .container {
      max-width: 850px;
      margin: 0 auto;
      padding: 40px 50px;
      background: #ffffff;
    }

    /* --- HEADER STYLES --- */
    .header {
      margin-bottom: 35px;
    }

    .name {
      font-family: 'Times New Roman', serif; /* Matching the serif look in image */
      font-size: ${Math.round(headingFontSize * 1.2)}px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: ${currentTheme.primary};
      margin-bottom: 5px;
      line-height: 1.1;
    }

    .header-divider {
      width: 100%;
      height: 2px;
      background-color: ${currentTheme.primary};
      margin-bottom: 12px;
    }

    .contact-info {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      line-height: 1.4;
    }

    .contact-info span {
      display: flex;
      align-items: center;
    }

    .contact-info span:not(:last-child)::after {
      content: "|";
      margin-left: 15px;
      color: ${currentTheme.primary};
      font-weight: 400;
    }

    .contact-info a {
      color: inherit;
      text-decoration: none;
    }

    /* --- SECTION STYLES --- */
    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-family: ${userFontFamily}; /* Sans-serif for section titles per image */
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 800;
      text-transform: uppercase;
      color: ${currentTheme.primary};
      margin-bottom: 15px;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 5px;
    }

    /* --- GRID LAYOUT (Left Date, Right Content) --- */
    .entry-grid {
      display: grid;
      grid-template-columns: 140px 1fr; /* Fixed date column, flexible content */
      gap: 20px;
      margin-bottom: 20px;
    }

    .entry-date-col {
      font-weight: 700;
      font-size: ${baseFontSize}px;
      color: ${currentTheme.primary};
      text-align: left;
      line-height: 1.4;
    }

    .entry-content-col {
      display: flex;
      flex-direction: column;
    }

    .entry-title {
      font-weight: 700;
      font-size: ${subheadingFontSize}px;
      color: ${currentTheme.primary};
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .entry-subtitle {
      font-weight: 600;
      font-style: italic;
      color: ${currentTheme.secondary};
      font-size: ${baseFontSize}px;
      margin-bottom: 6px;
    }

    .entry-description {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
      line-height: 1.5;
    }

    .entry-description ul {
      margin: 5px 0 5px 18px;
      padding: 0;
      list-style-type: square; /* Matching square bullets */
    }

    .entry-description li {
      margin-bottom: 3px;
      padding-left: 5px;
    }

    /* --- SKILLS & LANGUAGES --- */
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .skill-item {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
    }
    
    .skill-item:not(:last-child)::after {
      content: ",";
      margin-right: 5px;
    }

    /* --- SUMMARY --- */
    .summary-text {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
      line-height: 1.6;
    }

    /* Enhanced Education Styles */
    .education-field {
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 4px;
      font-size: ${Math.round(baseFontSize * 0.95)}px;
    }

    .education-school {
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 4px;
      font-size: ${baseFontSize}px;
    }

    .education-location {
      color: ${currentTheme.secondary};
      font-style: italic;
      margin-bottom: 6px;
      font-size: ${Math.round(baseFontSize * 0.9)}px;
    }

    .education-description {
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      color: ${currentTheme.secondary};
      line-height: 1.5;
      margin-top: 6px;
      padding: 8px;
      background: #f8f8f8;
      border-left: 3px solid ${currentTheme.primary};
    }

    .education-description ul {
      margin: 5px 0 5px 18px;
      padding: 0;
      list-style-type: square;
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
      border-top: 1px solid #e5e5e5;
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
      content: "◊";
      color: ${currentTheme.primary};
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; }
      .container { padding: 40px 50px; width: 100%; max-width: none; box-shadow: none; margin: 0; }
      .header-divider { background-color: #000 !important; }
    }
  </style>
</head>
<body>
<div class="container">

  <div class="header" data-section="personal">
    <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'YOUR NAME'}</div>
    ${data.personal?.role ? `<div style="font-size: 16px; margin-bottom: 5px; font-weight: 600;" data-section="personal">${data.personal.role}</div>` : ''}
    <div class="header-divider" data-section="personal"></div>
    <div class="contact-info" data-section="personal">
      ${data.personal?.phone ? `<span data-section="personal">${data.personal.phone}</span>` : ''}
      ${data.personal?.alternatePhone ? `<span data-section="personal">${data.personal.alternatePhone}</span>` : ''}
      ${data.personal?.email ? `<span data-section="personal">${data.personal.email}</span>` : ''}
      ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<span data-section="personal">${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</span>` : ''}
      ${data.personal?.linkedinUrl ? `<span data-section="personal"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></span>` : ''}
      ${data.personal?.githubUrl ? `<span data-section="personal"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></span>` : ''}
      ${data.personal?.portfolioUrl ? `<span data-section="personal"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></span>` : ''}
      ${data.personal?.website ? `<span data-section="personal"><a href="${data.personal.website}" target="_blank">Website</a></span>` : ''}
    </div>
  </div>

    ${(data.personal?.fathersName || data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus) ? `<div class="section" data-section="personal">
      <div class="section-title" data-section="personal">Personal Details</div>
      <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${baseFontSize}px; color: ${currentTheme.secondary};">
        ${data.personal?.fathersName ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ''}
        ${data.personal?.dob ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>` : ''}
        ${data.personal?.gender ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>` : ''}
        ${data.personal?.maritalStatus ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ''}
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.summary !== false && data.summary) ? `<div class="section" data-section="summary">
      <div class="section-title" data-section="summary">Professional Summary</div>
      <p class="summary-text" data-section="summary">${data.summary}</p>
    </div>` : ''}

    ${(data.sectionVisibility?.experience !== false && data.experience && data.experience.length > 0) ? `<div class="section" data-section="experience">
      <div class="section-title" data-section="experience">Work Experience</div>
      ${(data.experience || []).map((exp, index) => `
        <div class="entry-grid" data-section="experience" data-index="${index}">
          <div class="entry-date-col" data-section="experience" data-index="${index}">
            ${exp.startDate || ''} - <br/>${exp.endDate || 'Present'}
          </div>
          <div class="entry-content-col" data-section="experience" data-index="${index}">
            <div class="entry-title" data-section="experience" data-index="${index}">${exp.title || ''}</div>
            <div class="entry-subtitle" data-section="experience" data-index="${index}">${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</div>
            <div class="entry-description" data-section="experience" data-index="${index}">${exp.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) ? `<div class="section" data-section="projects">
      <div class="section-title" data-section="projects">Projects</div>
      ${(data.projects || []).map((project, index) => `
        <div class="entry-grid" data-section="projects" data-index="${index}">
          <div class="entry-date-col" data-section="projects" data-index="${index}">
             ${project.startDate || ''} ${project.endDate ? `- ${project.endDate}` : ''}
          </div>
          <div class="entry-content-col" data-section="projects" data-index="${index}">
            <div class="entry-title" data-section="projects" data-index="${index}">${project.name || ''}</div>
            <div class="entry-subtitle" data-section="projects" data-index="${index}">${project.technologies || ''}</div>
            <div class="entry-description" data-section="projects" data-index="${index}">${project.description || ''}</div>
            ${project.url ? `<div class="entry-description" data-section="projects" data-index="${index}" style="margin-top: 5px;"><a href="${project.url}" target="_blank" style="text-decoration: underline; color: ${currentTheme.primary};">${project.urlText || 'View Project'}</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.sectionVisibility?.education !== false && data.education && data.education.length > 0) ? `<div class="section" data-section="education">
      <div class="section-title" data-section="education">Education</div>
      ${(data.education || []).map((edu, index) => `
        <div class="entry-grid" data-section="education" data-index="${index}">
          <div class="entry-date-col" data-section="education" data-index="${index}">
            ${edu.graduationDate || ''}
          </div>
          <div class="entry-content-col" data-section="education" data-index="${index}">
            <div class="entry-title" data-section="education" data-index="${index}">
              ${edu.degree || ''}${edu.qualification ? ` (${edu.qualification})` : ''}
            </div>
            
            ${edu.field ? `<div class="education-field" data-section="education" data-index="${index}">${edu.field}</div>` : ''}
            ${edu.school ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}</div>` : ''}
            ${edu.location ? `<div class="education-location" data-section="education" data-index="${index}">${edu.location}</div>` : ''}
            
            ${edu.description ? `
              <div class="education-description" data-section="education" data-index="${index}">
                ${edu.description.includes('<ul>') || edu.description.includes('<li>')
        ? edu.description
        : `<p>${edu.description}</p>`}
              </div>
            ` : ''}
            
            ${edu.achievements && edu.achievements.length > 0 ? `
              <div class="education-achievements" data-section="education" data-index="${index}">
                <h4>Academic Distinction</h4>
                <ul>
                  ${edu.achievements.filter((achievement) => achievement.trim()).map((achievement, achIndex) => `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.sectionVisibility?.skills !== false && data.skills) ? `<div class="section" data-section="skills">
      <div class="section-title" data-section="skills">Skills</div>
      <div class="entry-grid" data-section="skills">
        <div class="entry-date-col" data-section="skills"></div>
        <div class="entry-content-col" data-section="skills">
           <div class="skills-grid" data-section="skills">
             ${(Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',')).map((skill, index) => `
               <span class="skill-item" data-section="skills" data-index="${index}">${typeof skill === 'string' ? skill.trim() : skill}</span>
             `).join('')}
           </div>
        </div>
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `<div class="section" data-section="languages">
      <div class="section-title" data-section="languages">Languages</div>
      <div class="entry-grid" data-section="languages">
        <div class="entry-date-col" data-section="languages"></div>
        <div class="entry-content-col" data-section="languages">
           <div class="skills-grid" data-section="languages">
             ${(data.languages || []).map((lang, index) => `
               <span class="skill-item" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}</span>
             `).join('')}
           </div>
        </div>
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.hobbies !== false && data.hobbies && data.hobbies.length > 0) ? `<div class="section" data-section="hobbies">
      <div class="section-title" data-section="hobbies">Hobbies</div>
      <div class="entry-grid" data-section="hobbies">
        <div class="entry-date-col" data-section="hobbies"></div>
        <div class="entry-content-col" data-section="hobbies">
           <div class="skills-grid" data-section="hobbies">
             ${(data.hobbies || []).map((hobby, index) => `
               <span class="skill-item" data-section="hobbies" data-index="${index}">${hobby}</span>
             `).join('')}
           </div>
        </div>
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `<div class="section" data-section="socialLinks">
      <div class="section-title" data-section="socialLinks">Social Links</div>
      <div class="entry-grid" data-section="socialLinks">
        <div class="entry-date-col" data-section="socialLinks"></div>
        <div class="entry-content-col" data-section="socialLinks">
           <div style="display: flex; flex-wrap: wrap; gap: 15px;" data-section="socialLinks">
             ${data.socialLinks.map((link, index) => `
               <a href="${link.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none; font-size: ${baseFontSize}px;" data-section="socialLinks" data-index="${index}">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
             `).join('')}
           </div>
        </div>
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `<div class="section" data-section="certifications">
      <div class="section-title" data-section="certifications">Certifications</div>
      ${(data.certifications || []).map((cert, index) => `
        <div class="entry-grid" data-section="certifications" data-index="${index}">
          <div class="entry-date-col" data-section="certifications" data-index="${index}">${cert.date || ''}</div>
          <div class="entry-content-col" data-section="certifications" data-index="${index}">
            <div class="entry-title" data-section="certifications" data-index="${index}">${cert.name || ''}</div>
            <div class="entry-subtitle" data-section="certifications" data-index="${index}">${cert.issuer || ''}</div>
            ${cert.url ? `<div class="entry-description" data-section="certifications" data-index="${index}" style="margin-top: 5px;"><a href="${cert.url}" target="_blank" style="text-decoration: underline; color: ${currentTheme.primary};">View Certificate</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    ${data.keyAchievements && data.keyAchievements.length > 0 ? `<div class="section" data-section="keyAchievements">
      <div class="section-title" data-section="keyAchievements">Key Achievements</div>
      <div class="entry-grid" data-section="keyAchievements">
        <div class="entry-date-col" data-section="keyAchievements"></div>
        <div class="entry-content-col" data-section="keyAchievements">
          <div class="entry-description" data-section="keyAchievements">
            <ul data-section="keyAchievements">
              ${(data.keyAchievements || []).map((achievement, index) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>` : ''}


    ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).length > 0 ? `<div class="section" data-section="responsibilities">
      <div class="section-title" data-section="responsibilities">Key Responsibilities</div>
      <div class="entry-grid" data-section="responsibilities">
        <div class="entry-date-col" data-section="responsibilities"></div>
        <div class="entry-content-col" data-section="responsibilities">
          <div class="entry-description" data-section="responsibilities">
            <ul data-section="responsibilities">
              ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).map((line, index) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>` : ''}

    ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line) => line.trim()).length > 0 ? `<div class="section" data-section="tools">
      <div class="section-title" data-section="tools">Tools & Technologies</div>
      <div class="entry-grid" data-section="tools">
        <div class="entry-date-col" data-section="tools"></div>
        <div class="entry-content-col" data-section="tools">
          <div class="entry-description" data-section="tools">
            <ul data-section="tools">
              ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line) => line.trim()).map((line, index) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>` : ''}


    ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section) => section.isVisible).map((section) => `
    <div class="section" data-section="customSections">
      <div class="section-title" data-section="customSections">${section.heading || 'Custom Section'}</div>
      ${section.entries && section.entries.length > 0 ? section.entries.filter((entry) => entry.isVisible).map((entry, entryIndex) => `
        <div class="entry-grid" data-section="customSections" data-index="${entryIndex}">
          <div class="entry-date-col" data-section="customSections" data-index="${entryIndex}">${entry.date || ''}</div>
          <div class="entry-content-col" data-section="customSections" data-index="${entryIndex}">
            <div class="entry-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
            ${entry.description ? `<div class="entry-description" data-section="customSections" data-index="${entryIndex}">${entry.description}</div>` : ''}
          </div>
        </div>
      `).join('') : '<div style="color: #666666; font-style: italic;">No entries in this section</div>'}
    </div>
    `).join('') : ''}

  </div>
</body>
</html>`;
}
