"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildConsultantFreelancerTemplate = buildConsultantFreelancerTemplate;
function buildConsultantFreelancerTemplate(data, theme) {
    const defaultTheme = {
        primary: '#333333',
        secondary: '#666666',
        background: '#ffffff',
        headingFont: 'Georgia, serif',
        bodyFont: 'Georgia, serif',
        borderColor: '#cccccc'
    };
    const currentTheme = theme || defaultTheme;
    // Font sizes matching the screenshot
    const bodyFontSize = '10pt';
    const headingFontSize = '11pt';
    const nameFontSize = '16pt';
    const contactFontSize = '9pt';
    const hasContent = (arr) => {
        if (!arr || !Array.isArray(arr))
            return arr && (typeof arr === 'string' ? arr.trim().length > 0 : false);
        if (arr.length === 0)
            return false;
        return arr.some((item) => {
            if (typeof item === 'string')
                return item.trim().length > 0;
            if (typeof item === 'object' && item !== null) {
                return Object.values(item).some((val) => typeof val === 'string' && val.trim().length > 0);
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
  <style>
    :root {
      --primary-color: ${currentTheme.primary};
      --secondary-color: ${currentTheme.secondary};
      --background-color: ${currentTheme.background};
      --heading-font: ${currentTheme.headingFont};
      --body-font: ${currentTheme.bodyFont};
    }

    body {
      font-family: var(--body-font);
      color: var(--primary-color);
      line-height: 1.5;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
    }
    .container {
      max-width: 650px;
      margin: 40px auto;
      padding: 50px 60px;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-size: ${headingFontSize};
      font-weight: bold;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 3px;
      text-align: center;
    }
    .name {
      font-size: ${nameFontSize};
      font-weight: bold;
      margin-bottom: 8px;
      color: #000;
    }
    .contact {
      font-size: ${contactFontSize};
      color: var(--secondary-color);
      margin-bottom: 0;
      line-height: 1.4;
    }
    .contact a {
      color: var(--primary-color);
      text-decoration: none;
    }
    .contact a:hover {
      text-decoration: underline;
    }
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }
    .job-title {
      font-weight: bold;
      font-size: ${bodyFontSize};
    }
    .job-date {
      font-size: ${contactFontSize};
      color: var(--secondary-color);
      font-style: italic;
    }
    .company-name {
      font-size: ${contactFontSize};
      color: var(--secondary-color);
      margin-bottom: 5px;
    }
    p, ul, li {
      font-size: ${bodyFontSize};
      margin: 0;
      padding: 0;
    }
    p {
      margin-bottom: 8px;
    }
    ul {
      margin-left: 20px;
      margin-top: 5px;
    }
    li {
      margin-bottom: 4px;
      line-height: 1.6;
    }
    .section-content {
      margin-bottom: 12px;
    }

    /* Enhanced Education Styles */
    .education-entry {
      margin-bottom: 16px;
      padding: 12px;
      background: rgba(248, 250, 252, 0.8);
      border: 1px solid #e2e8f0;
      border-left: 3px solid #333;
      border-radius: 4px;
    }

    .education-degree {
      font-weight: bold;
      color: #000;
      margin-bottom: 4px;
      font-size: 11pt;
    }

    .education-field {
      font-weight: 600;
      color: #666;
      margin-bottom: 3px;
      font-size: 10pt;
    }

    .education-school {
      font-weight: bold;
      color: #000;
      margin-bottom: 3px;
      font-size: 11pt;
    }

    .education-location {
      color: #666;
      font-style: italic;
      margin-bottom: 5px;
      font-size: 9pt;
    }

    .education-date {
      font-size: 9pt;
      color: #666;
      font-style: italic;
      margin-bottom: 6px;
    }

    .education-description {
      font-size: 10pt;
      color: #666;
      line-height: 1.5;
      margin-top: 8px;
      padding: 8px;
      background: rgba(255,255,255,0.9);
      border-radius: 3px;
      border: 1px solid #e2e8f0;
    }

    .education-description ul {
      margin: 4px 0 4px 15px;
      padding: 0;
      list-style-type: disc;
    }

    .education-description li {
      margin: 2px 0;
      color: #666;
    }

    .education-description b {
      font-weight: bold;
      color: #000;
    }

    .education-achievements {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
    }

    .education-achievements h4 {
      font-size: 9pt;
      font-weight: bold;
      color: #333;
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
      margin-bottom: 2px;
      color: #666;
      font-size: 10pt;
    }

    .education-achievements li:before {
      content: "💼";
      position: absolute;
      left: 0;
      font-size: 8pt;
    }
  </style>
</head>
<body>
<div class="container">
  <div class="header" data-section="personal">
    <div class="name" data-section="personal" data-field="name">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Your Name'}</div>
    <div class="contact" data-section="personal">
      ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? ' | ' + [data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ') : ''}
      ${data.personal?.phone ? ' | ' + data.personal.phone : ''}
      ${data.personal?.alternatePhone ? ' | ' + data.personal.alternatePhone : ''}
      ${data.personal?.email ? ' | ' + data.personal.email : ''}
      ${data.personal?.linkedinUrl ? ' | <a href="' + data.personal.linkedinUrl + '" target="_blank">LinkedIn</a>' : ''}
      ${data.personal?.githubUrl ? ' | <a href="' + data.personal.githubUrl + '" target="_blank">GitHub</a>' : ''}
      ${data.personal?.portfolioUrl ? ' | <a href="' + data.personal.portfolioUrl + '" target="_blank">Portfolio</a>' : ''}
      ${data.personal?.website ? ' | <a href="' + data.personal.website + '" target="_blank">Website</a>' : ''}
    </div>
  </div>

  ${(data.personal?.fathersName || data.personal?.dateOfBirth || data.personal?.gender || data.personal?.maritalStatus) ? `<div class="section" data-section="personal">
    <div class="section-title" data-section="personal">Personal Details</div>
    <div style="font-size: ${bodyFontSize}; line-height: 1.6;">
      ${data.personal?.fathersName ? `<div data-section="personal"><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ''}
${(data.personal?.dateOfBirth || data.personal?.dob) ? `<div data-section="personal"><strong>Date of Birth:</strong> ${data.personal?.dateOfBirth || data.personal?.dob}</div>` : ''}
      ${data.personal?.gender ? `<div data-section="personal"><strong>Gender:</strong> ${data.personal.gender}</div>` : ''}
      ${data.personal?.maritalStatus ? `<div data-section="personal"><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ''}
    </div>
  </div>` : ''}

  ${(data.sectionVisibility?.summary !== false && data.summary) ? `<div class="section" data-section="summary">
    <div class="section-title" data-section="summary">Summary</div>
    <p data-section="summary">${data.summary}</p>
  </div>` : ''}

  ${(data.sectionVisibility?.experience !== false && data.experience && data.experience.length > 0) ? `<div class="section" data-section="experience">
    <div class="section-title" data-section="experience">Experience</div>
    ${data.experience.map((exp, index) => `
      <div class="section-content" data-section="experience" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="experience" data-field="title" data-index="${index}">${exp.title || ''}</div>
          <div class="job-date" data-section="experience" data-field="startDate" data-index="${index}">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
        </div>
        <div class="company-name" data-section="experience" data-field="company" data-index="${index}">${exp.company || ''}${exp.location ? ' | ' + exp.location : ''}</div>
        ${exp.description ? `<ul>${exp.description.split('\n').filter((line) => line.trim()).map((line, lineIndex) => `<li data-section="experience" data-field="description" data-index="${index}-${lineIndex}">${line.trim()}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.sectionVisibility?.skills !== false && hasContent(data.skills)) ? `<div class="section" data-section="skills">
    <div class="section-title" data-section="skills">Skills</div>
    <p data-section="skills">${Array.isArray(data.skills) ? data.skills.slice(0, 20).join(' • ') : data.skills}</p>
  </div>` : ''}

  ${(data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) ? `<div class="section" data-section="projects">
    <div class="section-title" data-section="projects">Project Experience</div>
    ${data.projects.map((project, index) => `
      <div class="section-content" data-section="projects" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="projects" data-field="name" data-index="${index}">${project.name || 'Client'} | ${project.technologies || 'Role'}</div>
          <div class="job-date" data-section="projects" data-field="startDate" data-index="${index}">${project.startDate || ''} - ${project.endDate || 'Present'}</div>
        </div>
        ${project.description ? `<ul>${project.description.split('\n').filter((line) => line.trim()).map((line, lineIndex) => `<li data-section="projects" data-field="description" data-index="${index}-${lineIndex}">${line.trim()}</li>`).join('')}</ul>` : ''}
        ${project.url ? `<p data-section="projects" data-field="url" data-index="${index}"><a href="${project.url}" target="_blank">View Project</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${hasContent(data.tools) ? `<div class="section" data-section="tools">
    <div class="section-title" data-section="tools">Tools & Technologies</div>
    <p data-section="tools">${data.tools}</p>
  </div>` : ''}

  ${(data.sectionVisibility?.education !== false && data.education && data.education.length > 0) ? `<div class="section" data-section="education">
    <div class="section-title" data-section="education">Education</div>
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

  ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `<div class="section" data-section="certifications">
    <div class="section-title" data-section="certifications">Certifications</div>
    ${data.certifications.map((cert, index) => `
      <div class="section-content" data-section="certifications" data-index="${index}">
        <div class="job-title" data-section="certifications" data-field="name" data-index="${index}">${cert.name || ''}</div>
        <div class="company-name" data-section="certifications" data-field="issuer" data-index="${index}">${cert.issuer || ''}${cert.date ? ` | ${cert.date}` : ''}</div>
        ${cert.url ? `<p data-section="certifications" data-field="url" data-index="${index}"><a href="${cert.url}" target="_blank">View Certificate</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${data.keyAchievements && data.keyAchievements.length > 0 ? `<div class="section" data-section="keyAchievements">
    <div class="section-title" data-section="keyAchievements">Key Achievements</div>
    <ul>
      ${data.keyAchievements.map((achievement, index) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
    </ul>
  </div>` : ''}

  ${hasContent(data.responsibilities) ? `<div class="section" data-section="responsibilities">
    <div class="section-title" data-section="responsibilities">Key Responsibilities</div>
    <ul>
      ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).map((line, index) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
    </ul>
  </div>` : ''}

  ${(data.hobbies && data.hobbies.length > 0) ? `<div class="section" data-section="hobbies">
    <div class="section-title" data-section="hobbies">Hobbies & Interests</div>
    <p data-section="hobbies">${data.hobbies.join(', ')}</p>
  </div>` : ''}

  ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `<div class="section" data-section="languages">
    <div class="section-title" data-section="languages">Languages</div>
    <p data-section="languages">${data.languages.map((lang) => `${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}`).join(', ')}</p>
  </div>` : ''}

  ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `<div class="section" data-section="socialLinks">
    <div class="section-title" data-section="socialLinks">Social Links</div>
    <p data-section="socialLinks">${data.socialLinks.map((link, index) => `<a href="${link.url}" target="_blank">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>`).join(', ')}</p>
  </div>` : ''}

  ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section) => section.isVisible).map((section, sectionIndex) => `
  <div class="section" data-section="customSections" data-index="${sectionIndex}">
    <div class="section-title" data-section="customSections" data-index="${sectionIndex}">${section.heading}</div>
    ${section.entries.filter((entry) => entry.isVisible).map((entry, entryIndex) => `
      <div class="section-content" data-section="customSections" data-index="${sectionIndex}-${entryIndex}">
        <div class="job-header">
          <div class="job-title" data-section="customSections" data-field="title" data-index="${sectionIndex}-${entryIndex}">${entry.title || ''}${entry.organization ? ` | ${entry.organization}` : ''}</div>
          ${entry.date ? `<div class="job-date" data-section="customSections" data-field="date" data-index="${sectionIndex}-${entryIndex}">${entry.date}</div>` : ''}
        </div>
        ${entry.description ? `<p data-section="customSections" data-field="description" data-index="${sectionIndex}-${entryIndex}">${entry.description}</p>` : ''}
      </div>
    `).join('')}
  </div>
  `).join('') : ''}
</div>
</body>
</html>`;
}
