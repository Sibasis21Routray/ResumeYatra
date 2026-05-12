"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMewtwoTemplate = buildMewtwoTemplate;
function buildMewtwoTemplate(data, theme) {
    const defaultTheme = {
        primary: '#000000',
        secondary: '#333333',
        background: '#ffffff',
        headingFont: 'Arial',
        bodyFont: 'Arial'
    };
    const currentTheme = theme || defaultTheme;
    // Font size and family from data (user settings)
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 12; // Default 12px
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Arial, Helvetica, sans-serif';
    // Calculate responsive font sizes
    const baseFontSize = userFontSize;
    const nameFontSize = Math.round(userFontSize * 2.5);
    const sectionTitleFontSize = Math.round(userFontSize * 1.1);
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
      line-height: 1.5;
      background: #ffffff;
      font-size: ${baseFontSize}px;
    }
    .container {
      max-width: 850px;
      margin: 0 auto;
      padding: 40px 50px;
      background: #ffffff;
    }

    /* Header Styles matching image_ff6e34.png */
    .header {
      margin-bottom: 30px;
    }
    
    .name {
      font-size: ${nameFontSize}px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
      color: ${currentTheme.primary};
    }

    .header-divider {
      width: 100%;
      height: 1px;
      background-color: ${currentTheme.primary};
      margin-bottom: 8px;
    }

    .contact-info {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.primary};
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
    }

    .contact-info span {
      display: flex;
      align-items: center;
    }

    /* Pipe separator for contact info */
    .contact-info span:not(:last-child)::after {
      content: "|";
      margin-left: 15px;
      font-weight: normal;
      color: ${currentTheme.primary};
    }

    .contact-info a {
      color: ${currentTheme.primary};
      text-decoration: none;
    }

    /* Section Styles */
    .section {
      margin-bottom: 25px;
    }

    .section-title {
      font-size: ${sectionTitleFontSize}px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 15px;
      color: ${currentTheme.primary};
      letter-spacing: 0.5px;
    }

    /* Grid Layout for Entries (Date Left, Content Right) */
    .entry {
      display: grid;
      grid-template-columns: 140px 1fr; /* Fixed width for dates/labels */
      gap: 20px;
      margin-bottom: 15px;
    }

    .entry-left {
      font-weight: 700;
      font-size: ${baseFontSize}px;
      color: ${currentTheme.primary};
      text-align: left;
      line-height: 1.4;
    }

    .entry-right {
      display: flex;
      flex-direction: column;
    }

    .entry-title {
      font-weight: 700;
      font-size: ${baseFontSize}px;
      color: ${currentTheme.primary};
      margin-bottom: 2px;
    }

    .entry-subtitle {
      font-style: italic;
      color: ${currentTheme.secondary};
      margin-bottom: 5px;
      font-size: ${baseFontSize}px;
    }

    .entry-content {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
    }

    /* List Styling */
    .entry-content ul {
      margin: 5px 0 5px 18px;
      padding: 0;
      list-style-type: square; /* Square bullets per image */
    }

    .entry-content li {
      margin-bottom: 3px;
      padding-left: 5px;
    }

    /* Skills Layout */
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .skill-item:not(:last-child)::after {
      content: ",";
      margin-right: 5px;
    }

    /* Summary Text */
    .summary-text {
      line-height: 1.6;
      color: ${currentTheme.secondary};
    }

    /* Enhanced Education Styles */
    .education-field {
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 4px;
      font-size: ${baseFontSize}px;
    }

    .education-school {
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 4px;
    }

    .education-location {
      color: ${currentTheme.secondary};
      font-style: italic;
      margin-bottom: 6px;
    }

    .education-description {
      font-size: ${baseFontSize}px;
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
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid ${currentTheme.secondary};
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      font-weight: 700;
      color: ${currentTheme.primary};
      margin-bottom: 4px;
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
      font-size: ${baseFontSize}px;
    }

    .education-achievements li:before {
      content: "●";
      color: ${currentTheme.primary};
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    @media print {
      body { -webkit-print-color-adjust: exact; }
      .container { padding: 0; width: 100%; max-width: none; }
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
      ${data.personal?.fathersName ? `<span data-section="personal">Father's Name: ${data.personal.fathersName}</span>` : ''}
      ${data.personal?.dob ? `<span data-section="personal">DOB: ${data.personal.dob}</span>` : ''}
      ${data.personal?.gender ? `<span data-section="personal">Gender: ${data.personal.gender}</span>` : ''}
      ${data.personal?.maritalStatus ? `<span data-section="personal">Marital Status: ${data.personal.maritalStatus}</span>` : ''}
      ${data.personal?.website ? `<span data-section="personal"><a href="${data.personal.website}" target="_blank">Website</a></span>` : ''}
      ${data.personal?.linkedinUrl ? `<span data-section="personal"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></span>` : ''}
      ${data.personal?.githubUrl ? `<span data-section="personal"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></span>` : ''}
      ${data.personal?.portfolioUrl ? `<span data-section="personal"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></span>` : ''}
      ${data.personal?.twitterUrl ? `<span data-section="personal"><a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></span>` : ''}
      ${data.personal?.facebookUrl ? `<span data-section="personal"><a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></span>` : ''}
      ${data.personal?.instagramUrl ? `<span data-section="personal"><a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></span>` : ''}
      ${data.personal?.behanceUrl ? `<span data-section="personal"><a href="${data.personal.behanceUrl}" target="_blank">Behance</a></span>` : ''}
      ${data.personal?.dribbbleUrl ? `<span data-section="personal"><a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></span>` : ''}
      ${data.personal?.stackoverflowUrl ? `<span data-section="personal"><a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></span>` : ''}
      ${data.personal?.mediumUrl ? `<span data-section="personal"><a href="${data.personal.mediumUrl}" target="_blank">Medium</a></span>` : ''}
    </div>
  </div>

    ${(data.sectionVisibility?.summary !== false && data.summary) ? `<div class="section" data-section="summary">
      <div class="section-title" data-section="summary">Professional Summary</div>
      <div class="entry" data-section="summary">
        <div class="entry-left" data-section="summary"></div>
        <div class="entry-right" data-section="summary">
          <p class="summary-text" data-section="summary">${data.summary}</p>
        </div>
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.education !== false && data.education && data.education.length > 0) ? `<div class="section" data-section="education">
      <div class="section-title" data-section="education">Education</div>
      ${(data.education || []).map((edu, index) => `
        <div class="entry" data-section="education" data-index="${index}">
          <div class="entry-left" data-section="education" data-index="${index}">${edu.graduationDate || ''}</div>
          <div class="entry-right" data-section="education" data-index="${index}">
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
                <h4>Academic Achievements</h4>
                <ul>
                  ${edu.achievements.filter((achievement) => achievement.trim()).map((achievement, achIndex) => `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.sectionVisibility?.experience !== false && data.experience && data.experience.length > 0) ? `<div class="section" data-section="experience">
      <div class="section-title" data-section="experience">Work Experience</div>
      ${(data.experience || []).map((exp, index) => `
        <div class="entry" data-section="experience" data-index="${index}">
          <div class="entry-left" data-section="experience" data-index="${index}">
            ${exp.startDate || ''} - <br/>${exp.endDate || 'Present'}
          </div>
          <div class="entry-right" data-section="experience" data-index="${index}">
            <div class="entry-title" data-section="experience" data-index="${index}">${exp.title || ''}</div>
            <div class="entry-subtitle" data-section="experience" data-index="${index}">${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</div>
            <div class="entry-content" data-section="experience" data-index="${index}">${exp.description || ''}</div>
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) ? `<div class="section" data-section="projects">
      <div class="section-title" data-section="projects">Projects</div>
      ${(data.projects || []).map((project, index) => `
        <div class="entry" data-section="projects" data-index="${index}">
          <div class="entry-left" data-section="projects" data-index="${index}">
             ${project.startDate || ''} ${project.endDate ? `- ${project.endDate}` : ''}
          </div>
          <div class="entry-right" data-section="projects" data-index="${index}">
            <div class="entry-title" data-section="projects" data-index="${index}">${project.name || ''}</div>
            <div class="entry-subtitle" data-section="projects" data-index="${index}">${project.technologies || ''}</div>
            <div class="entry-content" data-section="projects" data-index="${index}">${project.description || ''}</div>
            ${project.url ? `<div class="entry-content" data-section="projects" data-index="${index}" style="margin-top: 5px;"><a href="${project.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">${project.urlText || 'View Project'}</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.sectionVisibility?.skills !== false && data.skills) ? `<div class="section" data-section="skills">
      <div class="section-title" data-section="skills">Skills</div>
      <div style="display: block;" data-section="skills">
         <div class="skills-list" data-section="skills">
           ${(Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',')).map((skill, index) => `
             <span class="skill-item" data-section="skills" data-index="${index}">${typeof skill === 'string' ? skill.trim() : skill}</span>
           `).join('')}
         </div>
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `<div class="section" data-section="languages">
      <div class="section-title" data-section="languages">Languages</div>
      <div class="entry" data-section="languages">
        <div class="entry-left" data-section="languages"></div>
        <div class="entry-right" data-section="languages">
          <div class="skills-list" data-section="languages">
            ${(data.languages || []).map((lang, index) => `
              <span class="skill-item" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}</span>
            `).join('')}
          </div>
        </div>
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.hobbies !== false && data.hobbies && data.hobbies.length > 0) ? `<div class="section" data-section="hobbies">
      <div class="section-title" data-section="hobbies">Hobbies</div>
      <div class="entry" data-section="hobbies">
        <div class="entry-left" data-section="hobbies"></div>
        <div class="entry-right" data-section="hobbies">
           <div class="skills-list" data-section="hobbies">
             ${(data.hobbies || []).map((hobby, index) => `
               <span class="skill-item" data-section="hobbies" data-index="${index}">${hobby}</span>
             `).join('')}
           </div>
        </div>
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `<div class="section" data-section="socialLinks">
      <div class="section-title" data-section="socialLinks">Social Links</div>
      <div class="entry" data-section="socialLinks">
        <div class="entry-left" data-section="socialLinks"></div>
        <div class="entry-right" data-section="socialLinks">
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px;" data-section="socialLinks">
            ${data.socialLinks.map((link, index) => `
              <a href="${link.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none; font-weight: 500; font-size: ${baseFontSize}px;" data-section="socialLinks" data-index="${index}">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `<div class="section" data-section="certifications">
      <div class="section-title" data-section="certifications">Certifications</div>
      ${(data.certifications || []).map((cert, index) => `
        <div class="entry" data-section="certifications" data-index="${index}">
          <div class="entry-left" data-section="certifications" data-index="${index}">${cert.date || ''}</div>
          <div class="entry-right" data-section="certifications" data-index="${index}">
            <div class="entry-title" data-section="certifications" data-index="${index}">${cert.name || ''}</div>
            <div class="entry-subtitle" data-section="certifications" data-index="${index}">${cert.issuer || ''}</div>
            ${cert.url ? `<div class="entry-content" data-section="certifications" data-index="${index}" style="margin-top: 5px;"><a href="${cert.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Certificate</a></div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>` : ''}

    ${data.keyAchievements && data.keyAchievements.length > 0 ? `<div class="section" data-section="keyAchievements">
      <div class="section-title" data-section="keyAchievements">Key Achievements</div>
      <div class="entry" data-section="keyAchievements">
        <div class="entry-left" data-section="keyAchievements"></div>
        <div class="entry-right" data-section="keyAchievements">
          <div class="entry-content" data-section="keyAchievements">
            <ul data-section="keyAchievements">
              ${(data.keyAchievements || []).map((achievement, index) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>` : ''}


    ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).length > 0 ? `<div class="section" data-section="responsibilities">
      <div class="section-title" data-section="responsibilities">Key Responsibilities</div>
      <div class="entry" data-section="responsibilities">
        <div class="entry-left" data-section="responsibilities"></div>
        <div class="entry-right" data-section="responsibilities">
          <div class="entry-content" data-section="responsibilities">
            <ul data-section="responsibilities">
              ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).map((line, index) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>` : ''}

    ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line) => line.trim()).length > 0 ? `<div class="section" data-section="tools">
      <div class="section-title" data-section="tools">Tools & Technologies</div>
      <div class="entry" data-section="tools">
        <div class="entry-left" data-section="tools"></div>
        <div class="entry-right" data-section="tools">
          <div class="entry-content" data-section="tools">
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
        <div class="entry" data-section="customSections" data-index="${entryIndex}">
          <div class="entry-left" data-section="customSections" data-index="${entryIndex}">${entry.date || ''}</div>
          <div class="entry-right" data-section="customSections" data-index="${entryIndex}">
            <div class="entry-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
            ${entry.description ? `<div class="entry-content" data-section="customSections" data-index="${entryIndex}">${entry.description}</div>` : ''}
          </div>
        </div>
      `).join('') : '<div style="color: #666666; font-style: italic;">No entries in this section</div>'}
    </div>
    `).join('') : ''}

  </div>
</body>
</html>`;
}
