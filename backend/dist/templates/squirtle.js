"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSquirtleTemplate = buildSquirtleTemplate;
function buildSquirtleTemplate(data, theme) {
    const defaultTheme = {
        primary: '#373737', // Dark charcoal for sidebar
        secondary: '#ffffff', // White text for sidebar
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
    // SVG Icons for sidebar (White color)
    const icons = {
        email: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
        phone: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
        location: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
        link: `<svg xmlns="http://www.w3.org/2000/svg" width="${baseFontSize}" height="${baseFontSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`
    };
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
      color: #333333;
      line-height: 1.5;
      background: #555; /* Dark background for the whole page context */
      font-size: ${baseFontSize}px;
    }
    
    .container {
      max-width: 850px;
      min-height: 1000px; /* Ensure full page height simulation */
      margin: 0 auto;
      background: #ffffff;
      display: flex;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
      padding: 40px 50px;
    }

    /* --- SIDEBAR STYLES --- */
    .sidebar {
      width: 40%;
      background-color: ${currentTheme.primary};
      color: #ffffff;
      padding: 40px 25px;
      display: flex;
      flex-direction: column;
    }

    .name-header {
      font-family: 'Times New Roman', serif; /* Matching the serif look in image */
      font-size: ${Math.round(headingFontSize)}px;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 1.1;
      margin-bottom: 40px;
      letter-spacing: 1px;
      color: #ffffff;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding-bottom: 20px;
      // word-wrap: break-word;
      // overflow-wrap: break-word;
    }

    .sidebar-section {
      margin-bottom: 30px;
    }

    .sidebar-title {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 15px;
      letter-spacing: 1px;
      color: #ffffff;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding-bottom: 5px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      font-size: ${baseFontSize}px;
      color: #ffffff;
      word-break: break-all;
    }

    .contact-icon {
      margin-right: 10px;
      display: flex;
      align-items: center;
      min-width: 20px;
    }

    .contact-item a {
      color: #ffffff;
      text-decoration: none;
    }

    .sidebar-list {
      list-style: none;
      padding: 0;
    }

    .sidebar-list-item {
      margin-bottom: 8px;
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
      border-bottom: 1px solid rgba(255,255,255,0.1);
      padding-bottom: 4px;
    }
    
    .sidebar-list-item:last-child {
        border-bottom: none;
    }

    /* --- MAIN CONTENT STYLES --- */
    .main-content {
      width: 65%;
      background-color: #ffffff;
      padding: 40px 30px;
    }

    .main-section {
      margin-bottom: 30px;
    }

    .main-section-title {
      font-size: ${Math.round(baseFontSize * 1.2)}px;
      font-weight: 700;
      text-transform: uppercase;
      color: ${currentTheme.primary};
      margin-bottom: 15px;
      border-bottom: 2px solid ${currentTheme.primary};
      padding-bottom: 5px;
      letter-spacing: 0.5px;
    }

    .entry {
      margin-bottom: 20px;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 5px;
    }

    .entry-title {
      font-weight: 700;
      font-size: ${subheadingFontSize}px;
      color: ${currentTheme.primary};
      text-transform: uppercase;
    }

    .entry-date {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      font-style: italic;
      color: ${currentTheme.secondary};
      white-space: nowrap;
    }

    .entry-subtitle {
      font-weight: 600;
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
      margin-bottom: 8px;
    }

    .entry-description {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
      line-height: 1.6;
    }

    .entry-description ul {
      margin: 5px 0 5px 20px;
      padding: 0;
      list-style-type: disc;
    }
    
    .entry-description li {
      margin-bottom: 3px;
    }

    .summary-text {
      font-size: ${baseFontSize}px;
      line-height: 1.6;
      color: ${currentTheme.secondary};
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
    }

    .education-location {
      color: ${currentTheme.secondary};
      font-style: italic;
      margin-bottom: 6px;
    }

    .education-description {
      font-size: ${baseFontSize}px;
      color: ${currentTheme.secondary};
      line-height: 1.6;
      margin-top: 6px;
      padding: 10px;
      background: rgba(255,255,255,0.1);
      border-left: 3px solid ${currentTheme.secondary};
      border-radius: 2px;
    }

    .education-description ul {
      margin: 5px 0 5px 20px;
      padding: 0;
      list-style-type: disc;
    }

    .education-description li {
      margin: 3px 0;
      color: ${currentTheme.secondary};
    }

    .education-description b {
      font-weight: 700;
      color: ${currentTheme.secondary};
    }

    .education-achievements {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid rgba(255,255,255,0.2);
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      font-weight: 700;
      color: ${currentTheme.secondary};
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
      padding-left: 16px;
      margin-bottom: 4px;
      color: ${currentTheme.secondary};
      font-size: ${baseFontSize}px;
    }

    .education-achievements li:before {
      content: "◆";
      color: ${currentTheme.secondary};
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    @media print {
      body { background: none; -webkit-print-color-adjust: exact; }
      .container { width: 100%; max-width: none; box-shadow: none; margin: 0; height: auto; min-height: 0; }
      .sidebar { background-color: #373737 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; height: 100%; }
      .main-content { height: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar" data-section="personal">
      <div class="name-header" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Your Name'}</div>
      ${data.personal?.role ? `<div style="font-size: 16px; margin-bottom: 20px; font-weight: 600; color: #ffffff;" data-section="personal">${data.personal.role}</div>` : ''}

      <div class="sidebar-section" data-section="personal">
        <div class="sidebar-title" data-section="personal">Contact</div>
        ${data.personal?.phone ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.phone}</span>${data.personal.phone}</div>` : ''}
        ${data.personal?.alternatePhone ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.phone}</span>${data.personal.alternatePhone}</div>` : ''}
        ${data.personal?.email ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.email}</span>${data.personal.email}</div>` : ''}
        ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</div>` : ''}
        ${data.personal?.fathersName ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>Father: ${data.personal.fathersName}</div>` : ''}
        ${data.personal?.dob ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>DOB: ${data.personal.dob}</div>` : ''}
        ${data.personal?.maritalStatus ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>Marital Status: ${data.personal.maritalStatus}</div>` : ''}
        ${data.personal?.gender ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.location}</span>Gender: ${data.personal.gender}</div>` : ''}
        ${data.personal?.linkedinUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></div>` : ''}
        ${data.personal?.githubUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></div>` : ''}
        ${data.personal?.portfolioUrl ? `<div class="contact-item" data-section="personal"><span class="contact-icon">${icons.link}</span><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></div>` : ''}
      </div>

      ${(data.sectionVisibility?.skills !== false && data.skills && (Array.isArray(data.skills) ? data.skills.filter((skill) => skill && (typeof skill === 'string' ? skill.trim() : skill)) : (data.skills || '').split(',').filter((skill) => skill.trim())).length > 0) ? `<div class="sidebar-section" data-section="skills">
        <div class="sidebar-title" data-section="skills">Skills</div>
        <ul class="sidebar-list skills" data-section="skills">
          ${(Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',')).filter((skill) => skill && (typeof skill === 'string' ? skill.trim() : skill)).map((skill, index) => `
            <li class="sidebar-list-item" data-section="skills" data-index="${index}">${typeof skill === 'string' ? skill.trim() : skill}</li>
          `).join('')}
        </ul>
      </div>` : ''}

      ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `<div class="sidebar-section" data-section="languages">
        <div class="sidebar-title" data-section="languages">Languages</div>
        <ul class="sidebar-list languages" data-section="languages">
          ${(data.languages || []).map((lang, index) => `
            <li class="sidebar-list-item" data-section="languages" data-index="${index}">${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}</li>
          `).join('')}
        </ul>
      </div>` : ''}

      ${(data.sectionVisibility?.hobbies !== false && data.hobbies && data.hobbies.length > 0) ? `<div class="sidebar-section" data-section="hobbies">
        <div class="sidebar-title" data-section="hobbies">Hobbies</div>
        <ul class="sidebar-list hobbies" data-section="hobbies">
          ${(data.hobbies || []).map((hobby, index) => `
            <li class="sidebar-list-item" data-section="hobbies" data-index="${index}">${hobby}</li>
          `).join('')}
        </ul>
      </div>` : ''}

      ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `<div class="sidebar-section" data-section="socialLinks">
        <div class="sidebar-title" data-section="socialLinks">Social Links</div>
        <div style="display: flex; flex-direction: column; gap: 8px;" data-section="socialLinks">
          ${data.socialLinks.map((link, index) => `
            <a href="${link.url}" target="_blank" style="color: ${currentTheme.secondary}; text-decoration: none; font-size: ${baseFontSize}px;" data-section="socialLinks" data-index="${index}">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
          `).join('')}
        </div>
      </div>` : ''}
    </div>

    <div class="main-content">

      ${(data.sectionVisibility?.summary !== false && data.summary && data.summary.trim()) ? `<div class="main-section" data-section="summary">
        <div class="main-section-title" data-section="summary">Profile</div>
        <div class="summary-text" data-section="summary">${data.summary}</div>
      </div>` : ''}

      ${(typeof data.careerObjective === "string" && data.careerObjective.trim().length > 0) ? `<div class="main-section" data-section="careerObjective">
        <div class="main-section-title" data-section="careerObjective">Career Objective</div>
        <div class="summary-text" data-section="careerObjective">${data.careerObjective}</div>
      </div>` : ''}

      ${(data.internships && data.internships.length > 0) ? `<div class="main-section" data-section="internships">
        <div class="main-section-title" data-section="internships">Internships</div>
        ${(data.internships || []).filter((item) => item.title || item.company || item.description || item.startDate || item.endDate).map((item, index) => `
          <div class="entry" data-section="internships" data-index="${index}">
            <div class="entry-header" data-section="internships" data-index="${index}">
              <div class="entry-title" data-section="internships" data-index="${index}">${item.title || ''}</div>
              <div class="entry-date" data-section="internships" data-index="${index}">${item.startDate || ''} - ${item.endDate || ''}</div>
            </div>
            <div class="entry-subtitle" data-section="internships" data-index="${index}">${item.company || ''}${item.location ? `, ${item.location}` : ''}</div>
            <div class="entry-description" data-section="internships" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.experience !== false && data.experience && data.experience.length > 0) ? `<div class="main-section" data-section="experience">
        <div class="main-section-title" data-section="experience">Work Experience</div>
        ${(data.experience || []).filter((exp) => exp.title || exp.company || exp.description || exp.startDate || exp.endDate).map((exp, index) => `
          <div class="entry" data-section="experience" data-index="${index}">
            <div class="entry-header" data-section="experience" data-index="${index}">
              <div class="entry-title" data-section="experience" data-index="${index}">${exp.title || ''}</div>
              <div class="entry-date" data-section="experience" data-index="${index}">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
            </div>
            <div class="entry-subtitle" data-section="experience" data-index="${index}">${exp.company || ''}${exp.location ? `, ${exp.location}` : ''}</div>
            <div class="entry-description" data-section="experience" data-index="${index}">${exp.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.education !== false && data.education && data.education.length > 0) ? `<div class="main-section" data-section="education">
        <div class="main-section-title" data-section="education">Education</div>
        ${(data.education || []).filter((edu) => edu.degree || edu.qualification || edu.field || edu.school || edu.graduationDate || edu.description).map((edu, index) => `
          <div class="entry" data-section="education" data-index="${index}">
            <div class="entry-header" data-section="education" data-index="${index}">
              <div class="entry-title" data-section="education" data-index="${index}">
                ${edu.degree || ''}${edu.qualification ? ` (${edu.qualification})` : ''}
              </div>
              <div class="entry-date" data-section="education" data-index="${index}">${edu.graduationDate || ''}</div>
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
                <h4>Academic Recognition</h4>
                <ul>
                  ${edu.achievements.filter((achievement) => achievement.trim()).map((achievement, achIndex) => `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) ? `<div class="main-section" data-section="projects">
        <div class="main-section-title" data-section="projects">Projects</div>
        ${(data.projects || []).filter((project) => project.name || project.technologies || project.description || project.startDate || project.endDate).map((project, index) => `
          <div class="entry" data-section="projects" data-index="${index}">
            <div class="entry-header" data-section="projects" data-index="${index}">
              <div class="entry-title" data-section="projects" data-index="${index}">${project.name || ''}</div>
              <div class="entry-date" data-section="projects" data-index="${index}">${project.startDate || ''} ${project.endDate ? `- ${project.endDate}` : ''}</div>
            </div>
            <div class="entry-subtitle" data-section="projects" data-index="${index}">${project.technologies || ''}</div>
            <div class="entry-description" data-section="projects" data-index="${index}">${project.description || ''}</div>
            ${project.url ? `<div class="entry-description" data-section="projects" data-index="${index}" style="margin-top:5px;"><a href="${project.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">${project.urlText || 'View Project'}</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `<div class="main-section" data-section="certifications">
        <div class="main-section-title" data-section="certifications">Certifications</div>
        ${(data.certifications || []).filter((cert) => cert.name || cert.issuer || cert.date || cert.url).map((cert, index) => `
          <div class="entry" data-section="certifications" data-index="${index}">
            <div class="entry-header" data-section="certifications" data-index="${index}">
              <div class="entry-title" data-section="certifications" data-index="${index}">${cert.name || ''}</div>
              <div class="entry-date" data-section="certifications" data-index="${index}">${cert.date || ''}</div>
            </div>
            <div class="entry-subtitle" data-section="certifications" data-index="${index}">${cert.issuer || ''}</div>
            ${cert.url ? `<div class="entry-description" data-section="certifications" data-index="${index}" style="margin-top:5px;"><a href="${cert.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: underline;">View Certificate</a></div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.academicProjects && data.academicProjects.length > 0) ? `<div class="main-section" data-section="academicProjects">
        <div class="main-section-title" data-section="academicProjects">Academic Projects</div>
        ${(data.academicProjects || []).filter((item) => item.name || item.title || item.institution || item.description || item.duration).map((item, index) => `
          <div class="entry" data-section="academicProjects" data-index="${index}">
            <div class="entry-header" data-section="academicProjects" data-index="${index}">
              <div class="entry-title" data-section="academicProjects" data-index="${index}">${item.name || item.title || ''}</div>
              <div class="entry-date" data-section="academicProjects" data-index="${index}">${item.duration || ''}</div>
            </div>
            <div class="entry-subtitle" data-section="academicProjects" data-index="${index}">${item.institution || ''}</div>
            <div class="entry-description" data-section="academicProjects" data-index="${index}">${item.description || ''}</div>
            ${item.technologies ? `<div class="entry-description" data-section="academicProjects" data-index="${index}" style="margin-top:5px;"><strong>Technologies:</strong> ${item.technologies}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.leadershipPositions && data.leadershipPositions.length > 0) ? `<div class="main-section" data-section="leadershipPositions">
        <div class="main-section-title" data-section="leadershipPositions">Leadership & Positions</div>
        ${(data.leadershipPositions || []).filter((item) => item.position || item.title || item.organization || item.description || item.startDate || item.endDate).map((item, index) => `
          <div class="entry" data-section="leadershipPositions" data-index="${index}">
            <div class="entry-header" data-section="leadershipPositions" data-index="${index}">
              <div class="entry-title" data-section="leadershipPositions" data-index="${index}">${item.position || item.title || ''}</div>
              <div class="entry-date" data-section="leadershipPositions" data-index="${index}">${item.startDate || ''} - ${item.endDate || ''}</div>
            </div>
            <div class="entry-subtitle" data-section="leadershipPositions" data-index="${index}">${item.organization || ''}</div>
            <div class="entry-description" data-section="leadershipPositions" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.trainingPrograms && data.trainingPrograms.length > 0) ? `<div class="main-section" data-section="trainingPrograms">
        <div class="main-section-title" data-section="trainingPrograms">Training Programs</div>
        ${(data.trainingPrograms || []).filter((item) => item.name || item.provider || item.organization || item.description || item.completionDate || item.duration).map((item, index) => `
          <div class="entry" data-section="trainingPrograms" data-index="${index}">
            <div class="entry-header" data-section="trainingPrograms" data-index="${index}">
              <div class="entry-title" data-section="trainingPrograms" data-index="${index}">${item.name || ''}</div>
              <div class="entry-date" data-section="trainingPrograms" data-index="${index}">${item.completionDate || ''}</div>
            </div>
            <div class="entry-subtitle" data-section="trainingPrograms" data-index="${index}">${item.provider || item.organization || ''}${item.duration ? ` | ${item.duration}` : ''}</div>
            <div class="entry-description" data-section="trainingPrograms" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.scholarships && data.scholarships.length > 0) ? `<div class="main-section" data-section="scholarships">
        <div class="main-section-title" data-section="scholarships">Scholarships</div>
        ${(data.scholarships || []).filter((item) => item.name || item.provider || item.organization || item.description || item.year || item.amount).map((item, index) => `
          <div class="entry" data-section="scholarships" data-index="${index}">
            <div class="entry-header" data-section="scholarships" data-index="${index}">
              <div class="entry-title" data-section="scholarships" data-index="${index}">${item.name || ''}</div>
              <div class="entry-date" data-section="scholarships" data-index="${index}">${item.year || ''}</div>
            </div>
            <div class="entry-subtitle" data-section="scholarships" data-index="${index}">${item.provider || item.organization || ''}${item.amount ? ` | ${item.amount}` : ''}</div>
            <div class="entry-description" data-section="scholarships" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.coCurricular && data.coCurricular.length > 0) ? `<div class="main-section" data-section="coCurricular">
        <div class="main-section-title" data-section="coCurricular">Co-curricular Activities</div>
        ${(data.coCurricular || []).filter((item) => item.activity || item.organization || item.description || item.year || item.startDate || item.endDate).map((item, index) => `
          <div class="entry" data-section="coCurricular" data-index="${index}">
            <div class="entry-header" data-section="coCurricular" data-index="${index}">
              <div class="entry-title" data-section="coCurricular" data-index="${index}">${item.activity || ''}</div>
              <div class="entry-date" data-section="coCurricular" data-index="${index}">${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
            </div>
            <div class="entry-subtitle" data-section="coCurricular" data-index="${index}">${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
            <div class="entry-description" data-section="coCurricular" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.extracurricular && data.extracurricular.length > 0) ? `<div class="main-section" data-section="extracurricular">
        <div class="main-section-title" data-section="extracurricular">Extracurricular Activities</div>
        ${(data.extracurricular || []).filter((item) => item.activity || item.organization || item.description || item.year || item.startDate || item.endDate).map((item, index) => `
          <div class="entry" data-section="extracurricular" data-index="${index}">
            <div class="entry-header" data-section="extracurricular" data-index="${index}">
              <div class="entry-title" data-section="extracurricular" data-index="${index}">${item.activity || ''}</div>
              <div class="entry-date" data-section="extracurricular" data-index="${index}">${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
            </div>
            <div class="entry-subtitle" data-section="extracurricular" data-index="${index}">${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
            <div class="entry-description" data-section="extracurricular" data-index="${index}">${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${data.keyAchievements && data.keyAchievements.filter((a) => a && a.trim()).length > 0 ? `<div class="main-section" data-section="keyAchievements">
        <div class="main-section-title" data-section="keyAchievements">Key Achievements</div>
        <div class="entry-description" data-section="keyAchievements">
          <ul data-section="keyAchievements">
            ${(data.keyAchievements || []).filter((achievement) => achievement && achievement.trim()).map((achievement, index) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
          </ul>
        </div>
      </div>` : ''}


      ${data.responsibilities && (Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line && line.trim()).length > 0 ? `<div class="main-section" data-section="responsibilities">
        <div class="main-section-title" data-section="responsibilities">Key Responsibilities</div>
        <div class="entry-description" data-section="responsibilities">
          <ul data-section="responsibilities">
            ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line && line.trim()).map((line, index) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
          </ul>
        </div>
      </div>` : ''}

      ${data.tools && (Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line) => line && line.trim()).length > 0 ? `<div class="main-section" data-section="tools">
        <div class="main-section-title" data-section="tools">Tools & Technologies</div>
        <div class="entry-description" data-section="tools">
          <ul data-section="tools">
            ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line) => line && line.trim()).map((line, index) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
          </ul>
        </div>
      </div>` : ''}


      ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section) => section.isVisible && section.entries && section.entries.some((entry) => entry.isVisible && (entry.title || entry.organization || entry.description))).map((section) => `
      <div class="main-section" data-section="customSections">
        <div class="main-section-title" data-section="customSections">${section.heading || 'Custom Section'}</div>
        ${section.entries && section.entries.length > 0 ? section.entries.filter((entry) => entry.isVisible && (entry.title || entry.organization || entry.description)).map((entry, entryIndex) => `
          <div class="entry" data-section="customSections" data-index="${entryIndex}">
            <div class="entry-header" data-section="customSections" data-index="${entryIndex}">
              <div class="entry-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
              ${entry.date ? `<div class="entry-date" data-section="customSections" data-index="${entryIndex}">${entry.date}</div>` : ''}
            </div>
            ${entry.description ? `<div class="entry-description" data-section="customSections" data-index="${entryIndex}">${entry.description}</div>` : ''}
          </div>
        `).join('') : ''}
      </div>
      `).join('') : ''}

    </div>
  </div>
</body>
</html>`;
}
