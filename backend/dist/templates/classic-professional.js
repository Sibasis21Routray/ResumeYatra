"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildClassicProfessionalTemplate = buildClassicProfessionalTemplate;
function buildClassicProfessionalTemplate(data, theme) {
    const defaultTheme = {
        primary: '#000000',
        secondary: '#333333',
        background: '#ffffff',
        sidebarGray: '#f1f1f1',
        sidebarDarkerGray: '#e0e0e0',
        headingFont: 'Arial, sans-serif',
        bodyFont: 'Arial, sans-serif'
    };
    const currentTheme = theme || defaultTheme;
    const bodyFontSize = '10pt';
    const headingFontSize = '12pt';
    const nameFontSize = '24pt';
    const sortedExperience = data.experience ? [...data.experience].sort((a, b) => new Date(b.startDate || '1900-01-01').getTime() - new Date(a.startDate || '1900-01-01').getTime()) : [];
    // Helper function to check if a section has content
    const hasResponsibilitiesContent = (Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).length > 0;
    const hasToolsContent = (data.tools && (Array.isArray(data.tools) ? data.tools.length > 0 : (data.tools || '').trim().length > 0));
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --bg-gray: ${currentTheme.sidebarGray};
      --bg-darker: ${currentTheme.sidebarDarkerGray};
      --body-font: ${currentTheme.bodyFont};
    }

    body {
      font-family: var(--body-font);
      color: var(--primary-color);
      line-height: 1.4;
      margin: 0; padding: 0;
      background: #fff;
    }

    .resume-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

    /* Top Header */
    .header {
      text-align: center;
      padding: 40px 0 20px 0;
    }
    .name {
      font-size: ${nameFontSize};
      font-weight: bold;
      text-transform: uppercase;
      margin: 0;
      letter-spacing: 1px;
    }
    .title {
      font-size: 14pt;
      margin-top: 5px;
    }
    .divider {
      border-top: 1px solid #ddd;
      margin: 20px 40px;
    }

    /* Layout Structure */
    .main-body {
      display: flex;
      flex-direction: column;
      padding: 0 20px;
    }

    /* Sidebar - Left Column */
    .sidebar {
      width: 100%;
    }
    .sidebar-section {
      padding: 15px;
      margin-bottom: 0px;
    }
    .sidebar-light { background-color: #f3f3f3; }
    .sidebar-mid { background-color: #E3E3E3; }
    .sidebar-expertise { background-color: #D5D5D5; }
    .sidebar-plain { padding: 15px; }

    /* Main Content - Right Column */
    .content {
      width: 100%;
      padding-left: 0;
    }

    .section-title {
      font-size: ${headingFontSize};
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    /* Skill/Expertise Bars */
    .skill-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9pt;
      margin-bottom: 8px;
    }
    .skill-bar {
      width: 40px;
      height: 3px;
      background: #ccc;
      position: relative;
    }
    .skill-bar::after {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 70%;
      background: #666;
    }

    /* Enhanced Education Styles */
    .education-entry {
      margin-bottom: 12px;
      padding: 8px;
      background: rgba(255,255,255,0.6);
      border-left: 3px solid var(--primary-color);
    }

    .education-degree {
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 3px;
      font-size: 9pt;
    }

    .education-field {
      font-weight: 600;
      color: var(--secondary-color);
      margin-bottom: 3px;
      font-size: 8.5pt;
    }

    .education-school {
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 3px;
      font-size: 9pt;
    }

    .education-location {
      color: var(--secondary-color);
      font-style: italic;
      margin-bottom: 5px;
      font-size: 8pt;
    }

    .education-date {
      font-size: 8pt;
      color: var(--secondary-color);
      margin-bottom: 5px;
    }

    .education-description {
      font-size: 8pt;
      color: var(--secondary-color);
      line-height: 1.4;
      margin-top: 6px;
      padding: 6px;
      background: rgba(255,255,255,0.8);
      border-radius: 3px;
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
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid #d0d0d0;
    }

    .education-achievements h4 {
      font-size: 8pt;
      font-weight: bold;
      color: var(--primary-color);
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
      padding-left: 12px;
      margin-bottom: 2px;
      color: var(--secondary-color);
      font-size: 8pt;
    }

    .education-achievements li:before {
      content: "📚";
      position: absolute;
      left: 0;
      font-size: 7pt;
    }

    /* Work Experience Formatting */
    .exp-item { margin-bottom: 20px; }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 10pt;
    }
    .exp-line {
      flex-grow: 1;
      height: 1px;
      background: #ccc;
      margin: 0 10px;
    }
    .exp-subhead {
      font-size: 9pt;
      margin-bottom: 8px;
    }

    .contact-item {
      font-size: 9pt;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }

    p, li { font-size: ${bodyFontSize}; margin: 0 0 5px 0; }
    ul { padding-left: 15px; margin: 5px 0; }

    /* Responsive design */
    @media (min-width: 768px) {
      .main-body {
        flex-direction: row;
        padding: 0 40px;
      }
      .sidebar {
        width: 30%;
      }
      .content {
        width: 70%;
        padding-left: 30px;
      }
    }
   </style>
</head>
<body>
<div class="resume-container">
  <div class="header" data-section="personal">
    <div class="name">${data.personal?.name || 'YOUR NAME'}</div>
    <div class="divider"></div>
  </div>

  <div class="main-body">
    <div class="sidebar">
      ${(data.personal?.fathersName || data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus) ? `<div class="sidebar-section sidebar-light" data-section="personal">
        <div class="section-title">PERSONAL DETAILS</div>
        <div style="font-size: 9pt; color: var(--secondary-color); display: flex; flex-direction: column; gap: 6px;">
          ${data.personal?.fathersName ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ''}
          ${data.personal?.dob ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>` : ''}
          ${data.personal?.gender ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>` : ''}
          ${data.personal?.maritalStatus ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ''}
        </div>
      </div>` : ''}

      ${(data.sectionVisibility?.education !== false && data.education && data.education.length > 0) ? `
      <div class="sidebar-section sidebar-light" data-section="education">
        <div class="section-title">EDUCATION</div>
        ${data.education.map((edu, index) => `
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

      <div class="sidebar-section sidebar-mid" data-section="skills">
        <div class="section-title">SKILLS</div>
        ${Array.isArray(data.skills) ? data.skills.slice(0, 5).map((skill, index) => `
          <div class="skill-row" data-section="skills" data-index="${index}"><span>• ${skill}</span><div class="skill-bar"></div></div>
        `).join('') : ''}
      </div>

      ${data.keyAchievements && data.keyAchievements.length > 0 ? `<div class="sidebar-section sidebar-expertise" style="border-top: 1px solid #ccc;" data-section="expertise">
        <div class="section-title">EXPERTISE</div>
        ${data.keyAchievements.slice(0, 4).map((item, index) => `
           <div class="skill-row" data-section="keyAchievements" data-index="${index}"><span>• ${item}</span><div class="skill-bar"></div></div>
        `).join('')}
      </div>` : ''}

      <div class="sidebar-plain" data-section="contact">
        <div class="section-title">CONTACT</div>
        <div class="contact-item" data-section="personal" data-index="0">📞 ${data.personal?.phone || ''}</div>
        ${data.personal?.alternatePhone ? `<div class="contact-item" data-section="personal" data-index="1">📞 ${data.personal.alternatePhone}</div>` : ''}
        ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<div class="contact-item" data-section="personal" data-index="2">📍 ${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</div>` : ''}
        <div class="contact-item" data-section="personal" data-index="5">✉️ ${data.personal?.email || ''}</div>
        ${data.personal?.linkedinUrl ? `<div class="contact-item" data-section="personal" data-index="6">🔗 <a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>` : ''}
        ${data.personal?.githubUrl ? `<div class="contact-item" data-section="personal" data-index="7">💻 <a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>` : ''}
        ${data.personal?.portfolioUrl ? `<div class="contact-item" data-section="personal" data-index="8">🌐 <a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>` : ''}
        ${data.personal?.website ? `<div class="contact-item" data-section="personal" data-index="9">🌐 <a href="${data.personal.website}" target="_blank">Website</a></div>` : ''}
      </div>

      ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `
      <div class="sidebar-plain" data-section="socialLinks">
        <div class="section-title">SOCIAL LINKS</div>
        ${data.socialLinks.map((link, index) => `
          <div class="contact-item" data-section="socialLinks" data-index="${index}">🔗 <a href="${link.url}" target="_blank">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a></div>
        `).join('')}
      </div>` : ''}
    </div>

    <div class="content">
<div class="main-section" style="margin-bottom: 30px;" data-section="summary">
        <div class="section-title">ABOUT ME</div>
        <p>${data.summary || ''}</p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px;"></div>
      </div>

      ${(typeof data.careerObjective === "string" && data.careerObjective.trim().length > 0) ? `
      <div class="main-section" style="margin-bottom: 30px;" data-section="careerObjective">
        <div class="section-title">CAREER OBJECTIVE</div>
        <p>${data.careerObjective}</p>
        <div style="border-top: 1px solid #ddd; margin-top: 20px;"></div>
      </div>` : ''}

      <div class="main-section" data-section="experience">
        <div class="section-title">WORK EXPERIENCE</div>
        ${sortedExperience.map((exp, index) => `
          <div class="exp-item" data-section="experience" data-index="${index}">
            <div class="exp-header">
              <span>${exp.company || ''}</span>
              <div class="exp-line"></div>
              <span>${exp.startDate || ''}-${exp.endDate || 'NOW'}</span>
            </div>
            <div class="exp-subhead">${exp.title || ''}</div>
            <p>${exp.description?.split('\n')[0] || ''}</p>
            <ul>
              ${exp.description?.split('\n').slice(1).filter((l) => l.trim()).map((line, lineIndex) => `<li data-section="experience" data-index="${index}" data-item-index="${lineIndex}">${line.trim()}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      ${(data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) ? `<div class="main-section" data-section="projects">
        <div class="section-title">PROJECTS</div>
        ${data.projects.map((project, index) => `
          <div style="margin-bottom: 15px;" data-section="projects" data-index="${index}">
            <div style="font-weight: bold; font-size: 10pt;">${project.name || ''}${project.technologies ? ` | ${project.technologies}` : ''} | ${project.startDate || ''} - ${project.endDate || 'Present'}</div>
            <p style="font-size: 9pt;">${project.description || ''}</p>
            ${project.url ? `<p style="font-size: 8pt;"><a href="${project.url}" target="_blank">${project.urlText || 'View Project'}</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `<div class="main-section" data-section="certifications">
        <div class="section-title">CERTIFICATIONS</div>
        ${data.certifications.map((cert, index) => `
          <div style="margin-bottom: 10px;" data-section="certifications" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${cert.name || ''}</div>
            <div style="font-size: 8pt;">${cert.issuer || ''} ${cert.date ? `| ${cert.date}` : ''}</div>
            ${cert.url ? `<p style="font-size: 8pt;"><a href="${cert.url}" target="_blank">View Certificate</a></p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${data.internships && data.internships.length > 0 ? `<div class="main-section" data-section="internships">
        <div class="section-title">INTERNSHIPS</div>
        ${data.internships.map((item, index) => `
          <div style="margin-bottom: 10px;" data-section="internships" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${item.title || ''}</div>
            <div style="font-size: 8pt;">${item.company || ''}${item.location ? `, ${item.location}` : ''} | ${item.startDate || ''} - ${item.endDate || ''}</div>
            <p style="font-size: 9pt;">${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      ${data.academicProjects && data.academicProjects.length > 0 ? `<div class="main-section" data-section="academicProjects">
        <div class="section-title">ACADEMIC PROJECTS</div>
        ${data.academicProjects.map((item, index) => `
          <div style="margin-bottom: 10px;" data-section="academicProjects" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${item.name || item.title || ''}</div>
            <div style="font-size: 8pt;">${item.institution || ''}${item.duration ? ` | ${item.duration}` : ''}</div>
            <p style="font-size: 9pt;">${item.description || ''}</p>
            ${item.technologies ? `<p style="font-size: 8pt;"><strong>Technologies:</strong> ${item.technologies}</p>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${data.leadershipPositions && data.leadershipPositions.length > 0 ? `<div class="main-section" data-section="leadershipPositions">
        <div class="section-title">LEADERSHIP & POSITIONS</div>
        ${data.leadershipPositions.map((item, index) => `
          <div style="margin-bottom: 10px;" data-section="leadershipPositions" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${item.position || item.title || ''}</div>
            <div style="font-size: 8pt;">${item.organization || ''} | ${item.startDate || ''} - ${item.endDate || ''}</div>
            <p style="font-size: 9pt;">${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      ${data.trainingPrograms && data.trainingPrograms.length > 0 ? `<div class="main-section" data-section="trainingPrograms">
        <div class="section-title">TRAINING PROGRAMS</div>
        ${data.trainingPrograms.map((item, index) => `
          <div style="margin-bottom: 10px;" data-section="trainingPrograms" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${item.name || ''}</div>
            <div style="font-size: 8pt;">${item.provider || item.organization || ''}${item.duration ? ` | ${item.duration}` : ''}${item.completionDate ? ` | ${item.completionDate}` : ''}</div>
            <p style="font-size: 9pt;">${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      ${data.scholarships && data.scholarships.length > 0 ? `<div class="main-section" data-section="scholarships">
        <div class="section-title">SCHOLARSHIPS</div>
        ${data.scholarships.map((item, index) => `
          <div style="margin-bottom: 10px;" data-section="scholarships" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${item.name || ''}</div>
            <div style="font-size: 8pt;">${item.provider || item.organization || ''}${item.amount ? ` | ${item.amount}` : ''} | ${item.year || ''}</div>
            <p style="font-size: 9pt;">${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      ${data.coCurricular && data.coCurricular.length > 0 ? `<div class="main-section" data-section="coCurricular">
        <div class="section-title">CO-CURRICULAR ACTIVITIES</div>
        ${data.coCurricular.map((item, index) => `
          <div style="margin-bottom: 10px;" data-section="coCurricular" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${item.activity || ''}</div>
            <div style="font-size: 8pt;">${item.organization || ''}${item.role ? ` | ${item.role}` : ''} | ${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
            <p style="font-size: 9pt;">${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      ${data.extracurricular && data.extracurricular.length > 0 ? `<div class="main-section" data-section="extracurricular">
        <div class="section-title">EXTRACURRICULAR ACTIVITIES</div>
        ${data.extracurricular.map((item, index) => `
          <div style="margin-bottom: 10px;" data-section="extracurricular" data-index="${index}">
            <div style="font-weight: bold; font-size: 9pt;">${item.activity || ''}</div>
            <div style="font-size: 8pt;">${item.organization || ''}${item.role ? ` | ${item.role}` : ''} | ${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
            <p style="font-size: 9pt;">${item.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `<div class="main-section" data-section="languages">
        <div class="section-title">LANGUAGES</div>
        <p style="font-size: 9pt;">${data.languages.map((lang) => `${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}`).join(', ')}</p>
      </div>` : ''}

      ${(data.sectionVisibility?.hobbies !== false && data.hobbies && data.hobbies.length > 0) ? `<div class="main-section" data-section="hobbies">
        <div class="section-title">HOBBIES & INTERESTS</div>
        <p style="font-size: 9pt;">${data.hobbies.join(', ')}</p>
      </div>` : ''}

      ${data.keyAchievements && data.keyAchievements.length > 0 ? `<div class="main-section" data-section="keyAchievements">
        <div class="section-title">KEY ACHIEVEMENTS</div>
        <ul>
          ${data.keyAchievements.map((achievement, index) => `<li style="font-size: 9pt;" data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${hasResponsibilitiesContent ? `<div class="main-section" data-section="responsibilities">
        <div class="section-title">KEY RESPONSIBILITIES</div>
        <ul>
          ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).map((line, index) => `<li style="font-size: 9pt;" data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${hasToolsContent ? `<div class="main-section" data-section="tools">
        <div class="section-title">TOOLS & TECHNOLOGIES</div>
        <p style="font-size: 9pt;">${Array.isArray(data.tools) ? data.tools.join(', ') : data.tools}</p>
      </div>` : ''}

      ${data.references ? `
      <div class="main-section" style="border-top: 1px solid #ddd; padding-top: 15px;" data-section="references">
        <div class="section-title">REFERENCE</div>
        <div style="display: flex; justify-content: space-between; font-size: 8pt;">
           ${data.references}
        </div>
      </div>` : ''}

      ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section) => section.isVisible && section.entries && section.entries.length > 0 && section.entries.some((entry) => entry.isVisible)).map((section, sectionIndex) => `
      <div class="main-section" data-section="customSections">
        <div class="section-title">${section.heading || 'Custom Section'}</div>
        ${section.entries.filter((entry) => entry.isVisible).map((entry, entryIndex) => `
          <div style="margin-bottom: 10px;" data-section="customSections" data-index="${entryIndex}">
            <div style="font-weight: bold; font-size: 10pt;">${entry.title || ''}${entry.organization ? ` | ${entry.organization}` : ''}${entry.date ? ` | ${entry.date}` : ''}</div>
            ${entry.description ? `<p style="font-size: 9pt;">${entry.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      `).join('') : ''}
    </div>
  </div>
</div>
</body>
</html>`;
}
