"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAlakazamTemplate = buildAlakazamTemplate;
function buildAlakazamTemplate(data, theme) {
    const defaultTheme = {
        primary: '#004369', // Dark Blue from image
        secondary: '#ffffff',
        background: '#ffffff',
        headingFont: 'Arial, sans-serif',
        bodyFont: 'Arial, sans-serif'
    };
    const currentTheme = theme || defaultTheme;
    const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 12;
    const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Arial, sans-serif';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Resume</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${userFontFamily};
      background-color: #f0f0f0;
      display: flex;
      justify-content: center;
      padding: 20px;
    }

    .resume-container {
      width: 210mm; /* A4 Width */
      min-height: 297mm;
      background: white;
      display: flex;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }

    /* LEFT SIDEBAR */
    .sidebar {
      width: 35%;
      background-color: ${currentTheme.primary};
      color: white;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
    }

    .photo-container {
      width: 100%;
      aspect-ratio: 1/1;
      background: #eee;
      margin-bottom: 20px;
      overflow: hidden;
    }

    .photo-container img {
      width: 100%;
      height: 100%;
      object-cover: cover;
    }

    .name-heading {
       font-size: ${userFontSize + 20}px;
       font-weight: bold;
       line-height: 1.1;
       margin-bottom: 5px;
       word-wrap: break-word;
     }

     .job-title {
       font-size: ${userFontSize + 4}px;
       color: rgba(255,255,255,0.7);
       margin-bottom: 30px;
     }

     .sidebar-section { margin-bottom: 25px; }

     .sidebar-title {
       font-size: ${userFontSize + 6}px;
       font-weight: bold;
       text-transform: uppercase;
       border-bottom: 1px solid rgba(255,255,255,0.3);
       padding-bottom: 5px;
       margin-bottom: 15px;
     }

    .contact-item {
      margin-bottom: 15px;
      font-size: ${userFontSize}px;
    }

    .contact-label {
      font-weight: bold;
      display: block;
      margin-bottom: 2px;
    }

    .skill-list {
      list-style: none;
      padding-left: 0;
    }

    .skill-list li {
      margin-bottom: 8px;
      font-size: ${userFontSize}px;
      display: flex;
      align-items: flex-start;
    }

    .skill-list li::before {
      content: "•";
      margin-right: 8px;
    }

    /* RIGHT MAIN CONTENT */
    .main-content {
      width: 65%;
      padding: 40px 30px;
      color: #333;
    }

    .main-section { margin-bottom: 30px; }

    .main-section-title {
      font-size: ${userFontSize + 8}px;
      font-weight: bold;
      color: ${currentTheme.primary};
      border-bottom: 2px solid #eee;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }

    .entry {
      display: flex;
      margin-bottom: 20px;
      gap: 20px;
    }

    .entry-date {
      width: 100px;
      font-size: ${userFontSize - 1}px;
      color: #666;
      flex-shrink: 0;
    }

    .entry-details { flex: 1; }

    .entry-header {
      font-weight: bold;
      font-size: ${userFontSize + 2}px;
      margin-bottom: 4px;
    }

    .entry-sub {
      font-size: ${userFontSize}px;
      color: #555;
      margin-bottom: 8px;
    }

    .entry-desc {
      font-size: ${userFontSize}px;
      line-height: 1.5;
    }

    .entry-desc ul {
      margin-top: 5px;
      padding-left: 18px;
    }

    .entry-desc li { margin-bottom: 4px; }

    @media print {
      body { padding: 0; background: white; }
      .resume-container { box-shadow: none; width: 100%; height: 100%; }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <div class="sidebar">
      <div class="photo-container" data-section="personal">
        ${data.personal?.image ? `<img src="${data.personal.image}" alt="Profile">` : `<div style="display:flex; align-items:center; justify-content:center; height:100%; color:#ccc;">Photo</div>`}
      </div>
      
      <h1 class="name-heading">${data.personal?.name || 'Your Name'}</h1>
      <p class="job-title">${data.personal?.role || ''}</p>

      <div class="sidebar-section" data-section="personal">
        <h2 class="sidebar-title">Contact</h2>
        <div class="contact-item">
          <span class="contact-label">Address</span>
          ${[data.personal?.location, data.personal?.country, data.personal?.pinCode].filter(Boolean).join(', ')}
        </div>
        <div class="contact-item">
          <span class="contact-label">Phone</span>
          ${data.personal?.phone || ''}
        </div>
        <div class="contact-item">
          <span class="contact-label">E-mail</span>
          ${data.personal?.email || ''}
        </div>
        ${data.personal?.alternatePhone ? `<div class="contact-item">
          <span class="contact-label">Alternate Phone</span>
          ${data.personal.alternatePhone}
        </div>` : ''}
        ${data.personal?.fathersName ? `<div class="contact-item">
          <span class="contact-label">Father's Name</span>
          ${data.personal.fathersName}
        </div>` : ''}
        ${data.personal?.dob ? `<div class="contact-item">
          <span class="contact-label">Date of Birth</span>
          ${data.personal.dob}
        </div>` : ''}
        ${data.personal?.gender ? `<div class="contact-item">
          <span class="contact-label">Gender</span>
          ${data.personal.gender}
        </div>` : ''}
        ${data.personal?.maritalStatus ? `<div class="contact-item">
          <span class="contact-label">Marital Status</span>
          ${data.personal.maritalStatus}
        </div>` : ''}
        ${data.personal?.linkedinUrl ? `<div class="contact-item">
          <span class="contact-label">LinkedIn</span>
          <a href="${data.personal.linkedinUrl}" target="_blank">${data.personal.linkedinUrl}</a>
        </div>` : ''}
        ${data.personal?.githubUrl ? `<div class="contact-item">
          <span class="contact-label">GitHub</span>
          <a href="${data.personal.githubUrl}" target="_blank">${data.personal.githubUrl}</a>
        </div>` : ''}
        ${data.personal?.portfolioUrl ? `<div class="contact-item">
          <span class="contact-label">Portfolio</span>
          <a href="${data.personal.portfolioUrl}" target="_blank">${data.personal.portfolioUrl}</a>
        </div>` : ''}
        ${data.personal?.website ? `<div class="contact-item">
          <span class="contact-label">Website</span>
          <a href="${data.personal.website}" target="_blank">${data.personal.website}</a>
        </div>` : ''}
      </div>

      ${data.skills ? `
      <div class="sidebar-section" data-section="skills">
        <h2 class="sidebar-title">Skills</h2>
        <ul class="skill-list">
          ${(Array.isArray(data.skills) ? data.skills : data.skills.split(',')).map((s, index) => `<li data-section="skills" data-index="${index}">${typeof s === 'string' ? s.trim() : s}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${data.languages && data.languages.length > 0 ? `
      <div class="sidebar-section" data-section="languages">
        <h2 class="sidebar-title">Languages</h2>
        <ul class="skill-list">
          ${data.languages.map((lang, index) => `<li data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${data.hobbies && data.hobbies.length > 0 ? `
      <div class="sidebar-section" data-section="hobbies">
        <h2 class="sidebar-title">Hobbies & Interests</h2>
        <ul class="skill-list">
          ${data.hobbies.map((hobby, index) => `<li data-section="hobbies" data-index="${index}">${hobby}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${data.socialLinks && data.socialLinks.length > 0 ? `
      <div class="sidebar-section" data-section="socialLinks">
        <h2 class="sidebar-title">Social Links</h2>
        ${data.socialLinks.map((link, index) => `
          <div class="contact-item" data-section="socialLinks" data-index="${index}">
            <span class="contact-label">${link.urlText || 'Link'}</span>
            <a href="${link.url}" target="_blank">${link.url}</a>
          </div>
        `).join('')}
      </div>` : ''}
    </div>

    <div class="main-content">

      ${data.summary ? `
      <div class="main-section" data-section="summary">
        <h2 class="main-section-title">Professional Summary</h2>
        <p style="font-size: ${userFontSize}px; line-height: 1.5;">${data.summary}</p>
      </div>` : ''}

      ${data.education?.length ? `
      <div class="main-section" data-section="education">
        <h2 class="main-section-title">Education</h2>
        ${data.education.map((edu, index) => `
          <div class="entry" data-section="education" data-index="${index}">
            <div class="entry-date">${edu.graduationDate || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${edu.degree || ''}</div>
              <div class="entry-sub">${edu.school || ''}, ${edu.location || ''}</div>
              <div class="entry-desc">${edu.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      ${data.experience?.length ? `
      <div class="main-section" data-section="experience">
        <h2 class="main-section-title">Work History</h2>
        ${data.experience.map((exp, index) => `
          <div class="entry" data-section="experience" data-index="${index}">
            <div class="entry-date">${exp.startDate || ''} - <br>${exp.endDate || 'Current'}</div>
            <div class="entry-details">
              <div class="entry-header">${exp.title || ''}</div>
              <div class="entry-sub">${exp.company || ''}, ${exp.location || ''}</div>
              <div class="entry-desc">${exp.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      ${data.projects && data.projects.length > 0 ? `
      <div class="main-section" data-section="projects">
        <h2 class="main-section-title">Projects</h2>
        ${data.projects.map((project, index) => `
          <div class="entry" data-section="projects" data-index="${index}">
            <div class="entry-details" style="flex: 1;">
              <div class="entry-header">${project.name || ''}${project.technologies ? ` | ${project.technologies}` : ''}</div>
              <div class="entry-sub">${project.description || ''}</div>
              ${project.url ? `<div class="entry-desc"><a href="${project.url}" target="_blank">${project.urlText || 'View Project'}</a></div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      ${data.certifications && data.certifications.length > 0 ? `
      <div class="main-section" data-section="certifications">
        <h2 class="main-section-title">Certifications</h2>
        ${data.certifications.map((cert, index) => `
          <div class="entry" data-section="certifications" data-index="${index}">
            <div class="entry-date">${cert.date || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${cert.name || ''}</div>
              <div class="entry-sub">${cert.issuer || ''}</div>
              ${cert.url ? `<div class="entry-desc"><a href="${cert.url}" target="_blank">View Certificate</a></div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      ${data.keyAchievements && data.keyAchievements.length > 0 ? `
      <div class="main-section" data-section="keyAchievements">
        <h2 class="main-section-title">Key Achievements</h2>
        <ul style="font-size: ${userFontSize}px; line-height: 1.5; padding-left: 18px;">
          ${data.keyAchievements.map((achievement, index) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).length > 0 ? `
      <div class="main-section" data-section="responsibilities">
        <h2 class="main-section-title">Key Responsibilities</h2>
        <ul style="font-size: ${userFontSize}px; line-height: 1.5; padding-left: 18px;">
          ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).map((line, index) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${data.tools && (Array.isArray(data.tools) ? data.tools.length > 0 : (data.tools || '').trim().length > 0) ? `
      <div class="main-section" data-section="tools">
        <h2 class="main-section-title">Tools & Technologies</h2>
        <ul style="font-size: ${userFontSize}px; line-height: 1.5; padding-left: 18px;">
          ${Array.isArray(data.tools) ? data.tools.map((tool, index) => `<li data-section="tools" data-index="${index}">${tool}</li>`).join('') : data.tools.split(',').map((tool, index) => `<li data-section="tools" data-index="${index}">${tool.trim()}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${data.references ? `
      <div class="main-section" data-section="references">
        <h2 class="main-section-title">References</h2>
        <p style="font-size: ${userFontSize}px; line-height: 1.5;">${data.references}</p>
      </div>` : ''}

      ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section) => section.entries && section.entries.length > 0).map((section, sectionIndex) => `
      <div class="main-section" data-section="customSections">
        <h2 class="main-section-title">${section.heading || 'Custom Section'}</h2>
        ${section.entries.map((entry, entryIndex) => `
          <div class="entry" data-section="customSections" data-index="${entryIndex}">
            <div class="entry-date">${entry.date || ''}</div>
            <div class="entry-details">
              <div class="entry-header">${entry.title || ''}</div>
              <div class="entry-sub">${entry.organization || ''}</div>
              <div class="entry-desc">${entry.description || ''}</div>
            </div>
          </div>
        `).join('')}
      </div>
      `).join('') : ''}

    </div>
  </div>
</body>
</html>`;
}
