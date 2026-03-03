"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTechItTemplate = buildTechItTemplate;
function buildTechItTemplate(data, theme) {
    const defaultTheme = {
        primary: '#1a1a1a',
        secondary: '#444444',
        background: '#ffffff',
        accent: '#000000',
        headingFont: 'serif', // Matches the screenshot's classic style
        bodyFont: 'Arial, sans-serif'
    };
    const currentTheme = theme || defaultTheme;
    // Font sizes for the classic look
    const bodyFontSize = '10pt';
    const headingFontSize = '11pt';
    const nameFontSize = '24pt';
    // Sort experience reverse chronological
    const sortedExperience = data.experience ? [...data.experience].sort((a, b) => new Date(b.startDate || '1900-01-01').getTime() - new Date(a.startDate || '1900-01-01').getTime()) : [];
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
      --accent-color: ${currentTheme.accent};
      --heading-font: ${currentTheme.headingFont};
      --body-font: ${currentTheme.bodyFont};
    }

    body {
      font-family: var(--body-font);
      color: var(--primary-color);
      line-height: 1.5;
      margin: 0;
      padding: 40px;
      background: var(--background-color);
    }
    
    .resume-container {
      max-width: 800px;
      margin: 0 auto;
    }

    /* Header Styling */
    .header {
      text-align: center;
      margin-bottom: 40px;
    }

    .initial-circle {
      width: 50px;
      height: 50px;
      border: 1px solid var(--primary-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 15px;
      font-family: var(--heading-font);
      font-size: 18pt;
      text-transform: uppercase;
    }

    .name {
      font-family: var(--heading-font);
      font-size: ${nameFontSize};
      font-weight: normal;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .contact-line {
      font-size: 8pt;
      color: var(--secondary-color);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .contact-line span:not(:last-child):after {
      content: " • ";
      margin: 0 8px;
    }

    /* Section Styling */
    .main-section {
      margin-bottom: 30px;
    }

    .section-title {
      font-family: var(--heading-font);
      font-size: ${headingFontSize};
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #ddd;
      margin-bottom: 12px;
      padding-bottom: 3px;
    }

    .summary-text {
      font-size: ${bodyFontSize};
      text-align: justify;
      color: var(--secondary-color);
    }

    /* Experience & Projects */
    .item-row {
      display: flex;
      margin-bottom: 20px;
    }

    .item-left {
      width: 30%;
      font-size: 9pt;
      color: var(--secondary-color);
      padding-right: 20px;
    }

    .item-right {
      width: 70%;
    }

    .item-title {
      font-weight: bold;
      font-size: 10pt;
      text-transform: uppercase;
    }

    .item-subtitle {
      font-style: italic;
      margin-bottom: 8px;
      font-size: 10pt;
    }

    ul {
      margin: 5px 0 0 18px;
      padding: 0;
    }

    li {
      font-size: 9pt;
      margin-bottom: 4px;
      color: var(--secondary-color);
    }

    /* Two-column Skills Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 40px;
    }

    .skill-item {
      font-size: 9pt;
      display: flex;
      align-items: center;
    }

    .skill-item:before {
      content: "•";
      margin-right: 8px;
    }

    /* Certifications */
    .cert-item {
      margin-bottom: 10px;
      font-size: 9pt;
    }

    .cert-name {
      font-weight: bold;
      margin-bottom: 2px;
    }

    .cert-issuer {
      color: var(--secondary-color);
      margin-bottom: 2px;
    }

    .cert-date {
      font-size: 8pt;
      color: var(--secondary-color);
    }

    /* Languages */
    .language-item {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
      font-size: 9pt;
    }

    .language-name {
      font-weight: bold;
    }

    .language-level {
      color: var(--secondary-color);
      font-style: italic;
    }

    /* Tags for Hobbies */
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      font-size: 9pt;
    }

    .tag {
      padding: 2px 8px;
      border: 1px solid #ddd;
      border-radius: 3px;
      background: #f5f5f5;
    }

    /* Social Links */
    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-size: 9pt;
    }

    .contact-item {
      display: flex;
      gap: 5px;
    }

    .contact-label {
      font-weight: 600;
      min-width: 80px;
    }

    .contact-value a {
      color: var(--secondary-color);
      text-decoration: none;
    }

    .contact-value a:hover {
      text-decoration: underline;
    }

    @media print {
      body { padding: 0; }
      .resume-container { max-width: 100%; }
    }
  </style>
</head>
<body>
<div class="resume-container">
  <div class="header" data-section="personal">
    <div class="initial-circle" data-section="personal">
      ${data.personal?.name ? data.personal.name.charAt(0) : 'R'}
    </div>
    <div class="name" data-section="personal">${data.personal?.name || 'Your Name'}</div>
    <div class="contact-line" data-section="personal">
      ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<span>${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</span>` : ''}
      ${data.personal?.phone ? `<span>${data.personal.phone}</span>` : ''}
      ${data.personal?.alternatePhone ? `<span>${data.personal.alternatePhone}</span>` : ''}
      ${data.personal?.email ? `<span>${data.personal.email}</span>` : ''}
      ${data.personal?.linkedinUrl ? `<span><a href="${data.personal.linkedinUrl}" target="_blank">${data.personal.linkedinUrl.replace('https://', '').replace('http://', '')}</a></span>` : ''}
      ${data.personal?.portfolioUrl ? `<span><a href="${data.personal.portfolioUrl}" target="_blank">${data.personal.portfolioUrl.replace('https://', '').replace('http://', '')}</a></span>` : ''}
      ${data.personal?.website ? `<span><a href="${data.personal.website}" target="_blank">${data.personal.website.replace('https://', '').replace('http://', '')}</a></span>` : ''}
    </div>
  </div>

  ${(data.personal?.fathersName || data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus) ? `
  <div class="main-section" data-section="personal">
    <div class="section-title">Personal Details</div>
    <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${bodyFontSize}; color: var(--secondary-color);">
      ${data.personal?.fathersName ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ''}
      ${data.personal?.dob ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>` : ''}
      ${data.personal?.gender ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>` : ''}
      ${data.personal?.maritalStatus ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ''}
    </div>
  </div>` : ''}

  ${(data.sectionVisibility?.summary !== false && data.summary) ? `
  <div class="main-section" data-section="summary">
    <div class="section-title">Summary</div>
    <p class="summary-text">${data.summary}</p>
  </div>` : ''}
  
  ${sortedExperience.length > 0 ? `
  <div class="main-section" data-section="experience">
    <div class="section-title">Experience</div>
    ${sortedExperience.map((exp, index) => `
      <div class="item-row" data-section="experience" data-index="${index}">
        <div class="item-left">
          <div>${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
          <div>${exp.location || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${exp.title || ''}</div>
          <div class="item-subtitle">${exp.company || ''}</div>
          ${exp.description ? `<ul>${exp.description.split('\n').filter((l) => l.trim()).map((line) => `<li>${line.trim()}</li>`).join('')}</ul>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}
  
  ${(data.sectionVisibility?.skills !== false && data.skills) ? `
  <div class="main-section" data-section="skills">
    <div class="section-title">Skills</div>
    <div class="skills-grid">
      ${Array.isArray(data.skills) ? data.skills.map((skill, index) => `
        <div class="skill-item" data-section="skills" data-index="${index}">${skill}</div>
      `).join('') : `<div class="skill-item">${data.skills}</div>`}
    </div>
  </div>` : ''}

  ${(data.sectionVisibility?.education !== false && data.education && data.education.length > 0) ? `
  <div class="main-section" data-section="education">
    <div class="section-title">Education</div>
    ${data.education.map((edu, index) => `
      <div class="item-row" data-section="education" data-index="${index}">
        <div class="item-left">${edu.graduationDate || ''}</div>
        <div class="item-right">
          <div class="item-title">${edu.degree || ''}</div>
          <div class="item-subtitle">${edu.school || ''} ${edu.field ? `— ${edu.field}` : ''}</div>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) ? `
  <div class="main-section" data-section="projects">
    <div class="section-title">Projects</div>
    ${data.projects.map((project, index) => `
      <div class="item-row" data-section="projects" data-index="${index}">
        <div class="item-left"></div>
        <div class="item-right">
          <div class="item-title">${project.name || ''}</div>
          ${project.technologies ? `<div style="font-size: 9pt; color: var(--secondary-color); margin-bottom: 8px;">${project.technologies}</div>` : ''}
          ${project.description ? `<p style="font-size: 9pt; color: var(--secondary-color);">${project.description}</p>` : ''}
          ${project.url ? `<div style="margin-top: 5px;"><a href="${project.url}" target="_blank" style="font-size: 9pt; color: var(--secondary-color);">${project.urlText || project.url}</a></div>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `
  <div class="main-section" data-section="certifications">
    <div class="section-title">Certifications</div>
    ${data.certifications.map((cert, index) => `
      <div class="cert-item" data-section="certifications" data-index="${index}">
        <div class="cert-name">${cert.name || ''}</div>
        <div class="cert-issuer">${cert.issuer || ''}</div>
        <div class="cert-date">${cert.date || ''}</div>
        ${cert.url ? `<div style="margin-top: 3px;"><a href="${cert.url}" target="_blank" style="font-size: 8pt;">View Certificate</a></div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(typeof data.careerObjective === 'string' && data.careerObjective.trim().length > 0) ? `
  <div class="main-section" data-section="careerObjective">
    <div class="section-title">Career Objective</div>
    <p class="summary-text">${data.careerObjective}</p>
  </div>` : ''}

  ${(data.internships && data.internships.length > 0) ? `
  <div class="main-section" data-section="internships">
    <div class="section-title">Internships</div>
    ${data.internships.map((item, index) => `
      <div class="item-row" data-section="internships" data-index="${index}">
        <div class="item-left">
          <div>${item.startDate || ''} - ${item.endDate || ''}</div>
          <div>${item.location || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.title || ''}</div>
          <div class="item-subtitle">${item.company || ''}</div>
          ${item.description ? `<ul>${item.description.split('\n').filter((l) => l.trim()).map((line, lineIndex) => `<li data-section="internships" data-index="${index}" data-item-index="${lineIndex}">${line.trim()}</li>`).join('')}</ul>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.academicProjects && data.academicProjects.length > 0) ? `
  <div class="main-section" data-section="academicProjects">
    <div class="section-title">Academic Projects</div>
    ${data.academicProjects.map((item, index) => `
      <div class="item-row" data-section="academicProjects" data-index="${index}">
        <div class="item-left">
          <div>${item.duration || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.name || item.title || ''}</div>
          <div class="item-subtitle">${item.institution || ''}${item.course ? ` | ${item.course}` : ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
          ${item.technologies && item.technologies.length > 0 ? `<p style="font-size: 9pt; margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
          ${item.url ? `<div style="margin-top: 5px;"><a href="${item.url}" target="_blank" style="font-size: 9pt; color: var(--secondary-color);">${item.url}</a></div>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.leadershipPositions && data.leadershipPositions.length > 0) ? `
  <div class="main-section" data-section="leadershipPositions">
    <div class="section-title">Leadership & Positions</div>
    ${data.leadershipPositions.map((item, index) => `
      <div class="item-row" data-section="leadershipPositions" data-index="${index}">
        <div class="item-left">
          <div>${item.startDate || ''} - ${item.endDate || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.position || item.title || ''}</div>
          <div class="item-subtitle">${item.organization || ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.trainingPrograms && data.trainingPrograms.length > 0) ? `
  <div class="main-section" data-section="trainingPrograms">
    <div class="section-title">Training Programs</div>
    ${data.trainingPrograms.map((item, index) => `
      <div class="item-row" data-section="trainingPrograms" data-index="${index}">
        <div class="item-left">
          <div>${item.completionDate || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.name || ''}</div>
          <div class="item-subtitle">${item.provider || item.organization || ''}${item.duration ? ` | ${item.duration}` : ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.scholarships && data.scholarships.length > 0) ? `
  <div class="main-section" data-section="scholarships">
    <div class="section-title">Scholarships</div>
    ${data.scholarships.map((item, index) => `
      <div class="item-row" data-section="scholarships" data-index="${index}">
        <div class="item-left">
          <div>${item.year || ''}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.name || ''}</div>
          <div class="item-subtitle">${item.provider || item.organization || ''}${item.amount ? ` | ${item.amount}` : ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.coCurricular && data.coCurricular.length > 0) ? `
  <div class="main-section" data-section="coCurricular">
    <div class="section-title">Co-curricular Activities</div>
    ${data.coCurricular.map((item, index) => `
      <div class="item-row" data-section="coCurricular" data-index="${index}">
        <div class="item-left">
          <div>${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.activity || ''}</div>
          <div class="item-subtitle">${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.extracurricular && data.extracurricular.length > 0) ? `
  <div class="main-section" data-section="extracurricular">
    <div class="section-title">Extracurricular Activities</div>
    ${data.extracurricular.map((item, index) => `
      <div class="item-row" data-section="extracurricular" data-index="${index}">
        <div class="item-left">
          <div>${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
        </div>
        <div class="item-right">
          <div class="item-title">${item.activity || ''}</div>
          <div class="item-subtitle">${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
          <p style="font-size: 9pt; color: var(--secondary-color);">${item.description || ''}</p>
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `
  <div class="main-section" data-section="languages">
    <div class="section-title">Languages</div>
    <div class="skills-grid">
      ${data.languages.map((lang, index) => `
        <div class="language-item" data-section="languages" data-index="${index}">
          <span class="language-name">${lang.language || lang}</span>
          ${lang.level ? `<span class="language-level">${lang.level}</span>` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  ${(data.sectionVisibility?.keyAchievements !== false && hasContent(data.keyAchievements)) ? `
  <div class="main-section" data-section="keyAchievements">
    <div class="section-title">Key Achievements</div>
    <ul>
      ${data.keyAchievements.filter((a) => a.trim()).map((achievement, index) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
    </ul>
  </div>` : ''}

  ${(data.sectionVisibility?.responsibilities !== false && hasContent(data.responsibilities)) ? `
  <div class="main-section" data-section="responsibilities">
    <div class="section-title">Key Responsibilities</div>
    <ul>
      ${Array.isArray(data.responsibilities) ? data.responsibilities.filter((r) => r.trim()).map((resp, index) => `<li data-section="responsibilities" data-index="${index}">${resp}</li>`).join('') : (data.responsibilities || '').split('\n').filter((l) => l.trim()).map((line, index) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
    </ul>
  </div>` : ''}

  ${(data.sectionVisibility?.tools !== false && hasContent(data.tools)) ? `
  <div class="main-section" data-section="tools">
    <div class="section-title">Tools & Technologies</div>
    <ul>
      ${Array.isArray(data.tools) ? data.tools.filter((t) => t.trim()).map((tool, index) => `<li data-section="tools" data-index="${index}">${tool}</li>`).join('') : (data.tools || '').split('\n').filter((l) => l.trim()).map((line, index) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
    </ul>
  </div>` : ''}

  ${(data.sectionVisibility?.hobbies !== false && data.hobbies && data.hobbies.length > 0) ? `
  <div class="main-section" data-section="hobbies">
    <div class="section-title">Hobbies & Interests</div>
    <div class="tags-container">
      ${data.hobbies.map((hobby, index) => `
        <span class="tag" data-section="hobbies" data-index="${index}">${hobby}</span>
      `).join('')}
    </div>
  </div>` : ''}

  ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `
  <div class="main-section" data-section="socialLinks">
    <div class="section-title">Social Links</div>
    <div class="contact-list">
      ${data.socialLinks.map((link, index) => `
        <div data-section="socialLinks" data-index="${index}">
          <a href="${link.url}" target="_blank">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((s) => s.isVisible).map((section) => `
    <div class="main-section">
      <div class="section-title">${section.heading || 'Additional'}</div>
      ${section.entries && section.entries.length > 0 ? section.entries.filter((e) => e.isVisible).map((entry) => `
        <div class="item-row">
          <div class="item-left">${entry.date || ''}</div>
          <div class="item-right">
            <div class="item-title">${entry.title || ''}</div>
            <p style="font-size: 9pt; color: var(--secondary-color);">${entry.description || ''}</p>
          </div>
        </div>
      `).join('') : ''}
    </div>
  `).join('') : ''}
</div>
</body>
</html>`;
}
