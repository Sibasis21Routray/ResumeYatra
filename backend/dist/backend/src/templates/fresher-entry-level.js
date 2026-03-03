"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFresherEntryLevelTemplate = buildFresherEntryLevelTemplate;
function buildFresherEntryLevelTemplate(data, theme) {
    const defaultTheme = {
        primary: '#111827',
        secondary: '#4b5563',
        background: '#ffffff',
        accent: '#e11d48', // Red/Pink accent for headers and lines
        headingFont: 'Inter, Arial, sans-serif',
        bodyFont: 'Inter, Arial, sans-serif'
    };
    const currentTheme = theme || defaultTheme;
    const bodyFontSize = '10pt';
    const headingFontSize = '11pt';
    const nameFontSize = '26pt';
    const sortedExperience = data.experience
        ? [...data.experience].sort((a, b) => new Date(b.startDate || '1900').getTime() -
            new Date(a.startDate || '1900').getTime())
        : [];
    // Logic to split name for the two-tone effect
    const nameParts = (data.personal?.name || 'Your Name').split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Resume</title>
<style>
:root {
  --primary: ${currentTheme.primary};
  --secondary: ${currentTheme.secondary};
  --accent: ${currentTheme.accent};
  --bg: ${currentTheme.background};
}

* { box-sizing: border-box; }

body {
  margin: 0;
  padding: 0;
  font-family: ${currentTheme.bodyFont};
  background: var(--bg);
  color: var(--primary);
  line-height: 1.4;
}

.resume-wrapper {
  max-width: 850px;
  margin: 0 auto;
  padding: 40px;
}

/* TOP DECORATIVE BAR */
.top-bar {
  height: 12px;
  background: repeating-linear-gradient(
    45deg,
    #334155,
    #334155 10px,
    #475569 10px,
    #475569 20px
  );
  margin-bottom: 30px;
}

/* HEADER - TWO TONE */
.header {
  text-align: center;
  margin-bottom: 25px;
}

.name {
  font-size: ${nameFontSize};
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.first-name { color: var(--accent); }
.last-name { color: #334155; }

.contact-info {
  font-size: 9pt;
  color: #4b5563;
  margin-top: 8px;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.contact-info a {
  color: #4b5563;
  text-decoration: none;
}

/* SECTION HEADERS */
.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: ${headingFontSize};
  font-weight: 700;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 5px;
  display: block;
}

.section-divider {
  height: 1px;
  background-color: #fecdd3; /* Light pink background line */
  border: none;
  margin-bottom: 12px;
}

/* CONTENT STYLING */
.item-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2px;
}

.company-name {
  font-weight: 700;
  font-size: 10.5pt;
}

.date-text {
  font-size: 9pt;
  color: #4b5563;
}

.job-title {
  font-weight: 600;
  font-style: italic;
  font-size: 10pt;
  color: #4b5563;
  margin-bottom: 5px;
}

ul {
  margin: 5px 0 15px 18px;
  padding: 0;
}

li {
  font-size: ${bodyFontSize};
  margin-bottom: 4px;
  color: var(--primary);
}

.skills-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.skill-item {
  font-size: ${bodyFontSize};
  display: flex;
  align-items: center;
}

.skill-item::before {
  content: "•";
  color: var(--accent);
  margin-right: 8px;
  font-weight: bold;
}

@media print {
  .resume-wrapper { padding: 20px; }
}
</style>
</head>

<body>
<div class="resume-wrapper">
  <div class="top-bar"></div>

  <header class="header" data-section="personal">
    <div class="name">
      <span class="first-name">${firstName}</span> <span class="last-name">${lastName}</span>
    </div>
    <div class="contact-info">
      ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<span>${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</span>` : ''}
      ${data.personal?.phone ? `<span>${data.personal.phone}</span>` : ''}
      ${data.personal?.alternatePhone ? `<span>${data.personal.alternatePhone}</span>` : ''}
      ${data.personal?.email ? `<span><a href="mailto:${data.personal.email}">${data.personal.email}</a></span>` : ''}
      ${data.personal?.linkedinUrl ? `<span><a href="${data.personal.linkedinUrl}">LinkedIn</a></span>` : ''}
      ${data.personal?.githubUrl ? `<span><a href="${data.personal.githubUrl}">GitHub</a></span>` : ''}
      ${data.personal?.portfolioUrl ? `<span><a href="${data.personal.portfolioUrl}">Portfolio</a></span>` : ''}
      ${data.personal?.website ? `<span><a href="${data.personal.website}">Website</a></span>` : ''}
    </div>
  </header>

  ${(data.personal?.fathersName || data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus) ? `
  <div class="section" data-section="personal">
    <div class="section-title">Personal Details</div>
    <hr class="section-divider">
    <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${bodyFontSize}; color: var(--secondary);">
      ${data.personal?.fathersName ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ''}
      ${data.personal?.dob ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>` : ''}
      ${data.personal?.gender ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>` : ''}
      ${data.personal?.maritalStatus ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ''}
    </div>
  </div>` : ''}

  ${(data.sectionVisibility?.summary !== false && data.summary && data.summary.trim()) ? `
  <div class="section" data-section="summary">
    <div class="section-title">Summary</div>
    <hr class="section-divider">
    <div style="font-size: ${bodyFontSize}; text-align: justify;">
      ${data.summary}
    </div>
  </div>` : ''}

  ${sortedExperience.length > 0 ? `
  <div class="section" data-section="experience">
    <div class="section-title">Experience</div>
    <hr class="section-divider">
    ${sortedExperience.map((exp, index) => `
      <div class="experience-item" data-index="${index}">
        <div class="item-row">
          <span class="company-name" data-field="company">${exp.company || ''}</span>
          <span class="date-text">${exp.startDate || ''} – ${exp.endDate || 'Present'}</span>
        </div>
        <div class="job-title" data-field="title">${exp.title || ''}</div>
        ${exp.description ? `<ul><li>${exp.description.split('\n').join('</li><li>')}</li></ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',')).filter((s) => s && (typeof s === 'string' ? s.trim() : s)).length > 0 ? `
  <div class="section" data-section="skills">
    <div class="section-title">Skills</div>
    <hr class="section-divider">
    <div class="skills-grid">
      ${(Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',')).map((skill) => `
        <div class="skill-item">${typeof skill === 'string' ? skill.trim() : skill}</div>
      `).join('')}
    </div>
  </div>` : ''}

  ${(data.education && data.education.length > 0) ? `
  <div class="section" data-section="education">
    <div class="section-title">Education</div>
    <hr class="section-divider">
    ${data.education.map((edu, index) => `
      <div class="education-item" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${edu.school || ''}</span>
          <span class="date-text">${edu.graduationDate || ''}</span>
        </div>
        <div class="job-title">${edu.degree || ''} ${edu.field ? `| ${edu.field}` : ''}</div>
        ${edu.description ? `<div style="font-size: 9pt; margin-bottom: 10px;">${edu.description}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.projects && data.projects.length > 0) ? `
  <div class="section" data-section="projects">
    <div class="section-title">Projects</div>
    <hr class="section-divider">
    ${data.projects.map((project, index) => `
      <div class="experience-item" data-index="${index}">
        <div class="item-row">
          <span class="company-name">${project.name || ''}</span>
          <span class="date-text">${project.startDate || ''} ${project.endDate ? `– ${project.endDate}` : ''}</span>
        </div>
        ${project.technologies ? `<div class="job-title">${project.technologies}</div>` : ''}
        ${project.description ? `<ul><li>${project.description.split('\n').join('</li><li>')}</li></ul>` : ''}
        ${project.url ? `<div style="font-size: 9pt; margin-bottom: 10px;"><a href="${project.url}" target="_blank" style="color: var(--accent);">View Project</a></div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.certifications && data.certifications.length > 0) ? `
  <div class="section" data-section="certifications">
    <div class="section-title">Certifications</div>
    <hr class="section-divider">
    <div style="font-size: ${bodyFontSize};">
      ${data.certifications.map((cert) => `
        <div style="margin-bottom: 8px;">
          <strong>${cert.name || ''}</strong>${cert.date ? ` | ${cert.date}` : ''}
          ${cert.issuer ? `<br><span style="color: #4b5563;">${cert.issuer}</span>` : ''}
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  ${data.keyAchievements && data.keyAchievements.filter((a) => a && a.trim()).length > 0 ? `
  <div class="section" data-section="keyAchievements">
    <div class="section-title">Key Achievements</div>
    <hr class="section-divider">
    <div style="font-size: ${bodyFontSize};">
      <ul>
        ${data.keyAchievements.map((achievement) => `
          <li>${achievement}</li>
        `).join('')}
      </ul>
    </div>
  </div>` : ''}

  ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line && line.trim()).length > 0 ? `
  <div class="section" data-section="responsibilities">
    <div class="section-title">Key Responsibilities</div>
    <hr class="section-divider">
    <div style="font-size: ${bodyFontSize};">
      <ul>
        ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).map((line) => `
          <li>${line.trim()}</li>
        `).join('')}
      </ul>
    </div>
  </div>` : ''}

  ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split(',')).filter((t) => t && (typeof t === 'string' ? t.trim() : t)).length > 0 ? `
  <div class="section" data-section="tools">
    <div class="section-title">Tools & Technologies</div>
    <hr class="section-divider">
    <div class="skills-grid">
      ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split(',')).map((tool) => `
        <div class="skill-item">${typeof tool === 'string' ? tool.trim() : tool}</div>
      `).join('')}
    </div>
  </div>` : ''}

  ${(data.languages && data.languages.length > 0) ? `
  <div class="section" data-section="languages">
    <div class="section-title">Languages</div>
    <hr class="section-divider">
    <div style="font-size: ${bodyFontSize};">
      ${data.languages.map((lang) => `
        <div class="skill-item">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}</div>
      `).join('')}
    </div>
  </div>` : ''}

  ${(data.hobbies && data.hobbies.length > 0) ? `
  <div class="section" data-section="hobbies">
    <div class="section-title">Interests</div>
    <hr class="section-divider">
    <div style="font-size: ${bodyFontSize};">
      ${(Array.isArray(data.hobbies) ? data.hobbies : [data.hobbies]).map((hobby) => `
        <div class="skill-item">${typeof hobby === 'string' ? hobby.trim() : hobby}</div>
      `).join('')}
    </div>
  </div>` : ''}

  ${(data.customSections && data.customSections.length > 0) ? `
    ${data.customSections.map((section) => `
      ${(section.visible !== false) && section.entries && section.entries.length > 0 ? `
      <div class="section" data-section="customSections" data-custom-section-id="${section.id}">
        <div class="section-title">${section.title || ''}</div>
        <hr class="section-divider">
        ${section.entries.map((entry) => `
          <div style="margin-bottom: 10px;">
            <div class="item-row">
              <span class="company-name">${entry.title || ''}</span>
              <span class="date-text">${entry.subtitle || ''}</span>
            </div>
            ${entry.description ? `<div style="font-size: ${bodyFontSize}; margin-top: 5px;">${entry.description}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
    `).join('')}
  ` : ''}

</div>
</body>
</html>`;
}
