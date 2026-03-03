"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLeadershipManagerialTemplate = buildLeadershipManagerialTemplate;
function buildLeadershipManagerialTemplate(data, theme) {
    const defaultTheme = {
        primary: '#000000',
        secondary: '#333333',
        background: '#ffffff',
        accent: '#1a73e8',
        headingFont: 'Arial, sans-serif',
        bodyFont: 'Arial, sans-serif'
    };
    const currentTheme = theme || defaultTheme;
    // Font sizes
    const bodyFontSize = '11pt';
    const headingFontSize = '12pt';
    const nameFontSize = '20pt';
    const titleFontSize = '14pt';
    // Sort experience reverse chronological
    const sortedExperience = data.experience ? [...data.experience].sort((a, b) => new Date(b.startDate || '1900-01-01').getTime() - new Date(a.startDate || '1900-01-01').getTime()) : [];
    // Helper function to check if a section has actual content
    const hasResponsibilitiesContent = (Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).length > 0;
    const hasToolsContent = (data.tools && (Array.isArray(data.tools) ? data.tools.length > 0 : (data.tools || '').trim().length > 0));
    const hasKeyAchievementsContent = (data.keyAchievements && data.keyAchievements.length > 0);
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
      --accent-color: ${currentTheme.accent || '#1a73e8'};
      --heading-font: ${currentTheme.headingFont};
      --body-font: ${currentTheme.bodyFont};
    }

    body {
      font-family: var(--body-font);
      color: var(--primary-color);
      line-height: 1.4;
      margin: 0;
      padding: 0;
      background: var(--background-color);
    }
    
    .resume-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    
    .header {
      margin-bottom: 30px;
      text-align: center;
    }
    
    .name {
      font-size: ${nameFontSize};
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    
    .title {
      font-size: ${titleFontSize};
      color: var(--accent-color);
      margin-bottom: 5px;
      font-weight: 600;
    }
    
    .contact-info {
      font-size: ${bodyFontSize};
      color: var(--secondary-color);
      margin-bottom: 20px;
    }
    
    .contact-item {
      display: inline-block;
      margin: 0 10px;
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: ${headingFontSize};
      font-weight: bold;
      color: var(--accent-color);
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 2px solid var(--accent-color);
      padding-bottom: 5px;
    }
    
    p, ul, li {
      font-size: ${bodyFontSize};
      margin: 0;
      padding: 0;
      color: var(--secondary-color);
    }
    
    ul {
      margin-left: 20px;
    }
    
    li {
      margin-bottom: 6px;
      line-height: 1.5;
    }
    
    .summary {
      margin-bottom: 25px;
    }
    
    .experience-item {
      margin-bottom: 20px;
    }
    
    .company-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
    }
    
    .company {
      font-weight: bold;
      font-size: ${bodyFontSize};
      color: var(--primary-color);
    }
    
    .job-title {
      color: var(--accent-color);
      font-weight: 600;
      margin-bottom: 3px;
    }
    
    .date {
      color: #666;
      font-size: ${bodyFontSize};
      font-weight: normal;
    }
    
    .skills-section {
      margin-bottom: 20px;
    }
    
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    
    .skill-item {
      background: #f5f5f5;
      padding: 5px 12px;
      border-radius: 4px;
      font-size: ${bodyFontSize};
    }
    
    .education-item {
      margin-bottom: 15px;
    }
    
    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
    }
    
    .degree {
      font-weight: 600;
      color: var(--primary-color);
    }
    
    .school {
      color: var(--secondary-color);
      margin-bottom: 2px;
    }
    
    .certification-item {
      margin-bottom: 10px;
    }
    
    .certification-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
    }
    
    .cert-name {
      font-weight: 600;
      color: var(--primary-color);
    }
    
    .issuer {
      color: var(--secondary-color);
    }
    
    a {
      color: var(--accent-color);
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }

    .profile-photo-container {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid var(--accent-color);
      margin: 0 auto 15px;
      background: #f5f5f5;
    }

    .profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .profile-photo-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      color: #999;
      font-size: 12px;
      text-align: center;
      padding: 8px;
    }

    .profile-photo-placeholder svg {
      width: 24px;
      height: 24px;
      margin-bottom: 8px;
      opacity: 0.6;
    }

    /* Enhanced Education Styles */
    .education-entry {
      margin-bottom: 18px;
      padding: 15px;
      background: rgba(26, 115, 232, 0.03);
      border: 1px solid rgba(26, 115, 232, 0.1);
      border-left: 4px solid var(--accent-color);
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .education-degree {
      font-weight: 700;
      color: var(--accent-color);
      margin-bottom: 5px;
      font-size: 12pt;
    }

    .education-field {
      font-weight: 600;
      color: var(--primary-color);
      margin-bottom: 4px;
      font-size: 11pt;
    }

    .education-school {
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 4px;
      font-size: 11pt;
    }

    .education-location {
      color: var(--secondary-color);
      font-style: italic;
      margin-bottom: 6px;
      font-size: 10pt;
    }

    .education-date {
      font-size: 10pt;
      color: #666;
      font-weight: 600;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .education-description {
      font-size: 11pt;
      color: var(--secondary-color);
      line-height: 1.5;
      margin-top: 10px;
      padding: 10px;
      background: rgba(255,255,255,0.9);
      border-radius: 4px;
      border-left: 2px solid var(--accent-color);
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
      font-weight: 700;
      color: var(--primary-color);
    }

    .education-achievements {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid rgba(26, 115, 232, 0.1);
    }

    .education-achievements h4 {
      font-size: 10pt;
      font-weight: 700;
      color: var(--accent-color);
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
      margin-bottom: 3px;
      color: var(--secondary-color);
      font-size: 11pt;
    }

    .education-achievements li:before {
      content: "👔";
      position: absolute;
      left: 0;
      font-size: 9pt;
    }
  </style>
</head>
<body>
<div class="resume-container">
  <!-- Header with Name and Title -->
  <div class="header" data-section="personal">
    ${data.personal?.image ? `
      <div class="profile-photo-container">
        <img src="${data.personal.image}" alt="${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Profile Photo'}" class="profile-photo" />
      </div>
    ` : `<div class="profile-photo-container">
      <div class="profile-photo-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Add Photo
      </div>
    </div>`}
    <div class="name">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Your Name'}</div>
    ${data.personal?.role ? `<div style="font-size: 14px; color: var(--secondary-color); margin-bottom: 5px; font-weight: 600;">${data.personal.role}</div>` : ''}
    <div class="contact-info">
      ${data.personal?.phone ? `<span class="contact-item">${data.personal.phone}</span>` : ''}
      ${data.personal?.alternatePhone ? `<span class="contact-item">${data.personal.alternatePhone}</span>` : ''}
      ${data.personal?.email ? `<span class="contact-item">${data.personal.email}</span>` : ''}
      ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<span class="contact-item">${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</span>` : ''}
      ${data.personal?.linkedinUrl ? `<span class="contact-item"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></span>` : ''}
      ${data.personal?.githubUrl ? `<span class="contact-item"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></span>` : ''}
      ${data.personal?.portfolioUrl ? `<span class="contact-item"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></span>` : ''}
      ${data.personal?.website ? `<span class="contact-item"><a href="${data.personal.website}" target="_blank">Website</a></span>` : ''}
    </div>
  </div>

  ${(data.personal?.fathersName || data.personal?.dob || data.personal?.gender || data.personal?.maritalStatus) ? `
  <div class="section" data-section="personal">
    <div class="section-title">Personal Details</div>
    <div style="display: flex; flex-direction: column; gap: 8px; font-size: ${bodyFontSize}; color: var(--secondary-color);">
      ${data.personal?.fathersName ? `<div><strong>Father's Name:</strong> ${data.personal.fathersName}</div>` : ''}
      ${data.personal?.dob ? `<div><strong>Date of Birth:</strong> ${data.personal.dob}</div>` : ''}
      ${data.personal?.gender ? `<div><strong>Gender:</strong> ${data.personal.gender}</div>` : ''}
      ${data.personal?.maritalStatus ? `<div><strong>Marital Status:</strong> ${data.personal.maritalStatus}</div>` : ''}
    </div>
  </div>` : ''}

  <!-- Summary Section -->
  ${(data.sectionVisibility?.summary !== false && data.summary) ? `
  <div class="section summary" data-section="summary">
    <div class="section-title">Summary</div>
    <p>${data.summary}</p>
  </div>` : ''}
  
  <!-- Professional Skills Section -->
  ${(data.sectionVisibility?.skills !== false && data.skills) ? `
  <div class="section skills-section" data-section="skills">
    <div class="section-title">Professional Skills</div>
    ${Array.isArray(data.skills) ? `
      <div class="skills-list">
        ${data.skills.slice(0, 15).map((skill, index) => `
          <div class="skill-item" data-section="skills" data-index="${index}">${skill}</div>
        `).join('')}
      </div>
    ` : `<p>${data.skills}</p>`}
  </div>` : ''}
  
  <!-- Work Experience Section -->
  ${sortedExperience.length > 0 ? `
  <div class="section" data-section="experience">
    <div class="section-title">Work Experience</div>
    ${sortedExperience.map((exp, index) => `
      <div class="experience-item" data-section="experience" data-index="${index}">
        <div class="company-title">
          <div class="company">${exp.company || ''}</div>
          <div class="date">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
        </div>
        <div class="job-title">${exp.title || ''}</div>
        ${exp.description ? `<ul>${exp.description.split('\n').filter((line) => line.trim()).map((line, lineIndex) => `<li>${line.trim()}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}
  
  <!-- Education Section -->
  ${(data.sectionVisibility?.education !== false && data.education && data.education.length > 0) ? `
  <div class="section" data-section="education">
    <div class="section-title">Education</div>
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
  
  <!-- Certifications Section -->
  ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `
  <div class="section" data-section="certifications">
    <div class="section-title">Certifications</div>
    ${data.certifications.map((cert, index) => `
      <div class="certification-item" data-section="certifications" data-index="${index}">
        <div class="certification-header">
          <div class="cert-name">${cert.name || ''}</div>
          <div class="date">${cert.date || ''}</div>
        </div>
        <div class="issuer">${cert.issuer || ''}</div>
        ${cert.url ? `<div style="margin-top: 8px;"><a href="${cert.url}" target="_blank" style="color: var(--accent-color); text-decoration: none;">View Certificate</a></div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Career Objective Section -->
  ${(typeof data.careerObjective === 'string' && data.careerObjective.trim().length > 0) ? `
  <div class="section" data-section="careerObjective">
    <div class="section-title">Career Objective</div>
    <p>${data.careerObjective}</p>
  </div>` : ''}

  <!-- Internships Section -->
  ${(data.internships && data.internships.length > 0) ? `
  <div class="section" data-section="internships">
    <div class="section-title">Internships</div>
    ${data.internships.map((item, index) => `
      <div class="experience-item" data-section="internships" data-index="${index}">
        <div class="company-title">
          <div class="company">${item.title || ''}</div>
          <div class="date">${item.startDate || ''} - ${item.endDate || ''}</div>
        </div>
        <div class="job-title">${item.company || ''}${item.location ? `, ${item.location}` : ''}</div>
        ${item.description ? `<ul>${item.description.split('\n').filter((line) => line.trim()).map((line, lineIndex) => `<li data-section="internships" data-index="${index}" data-item-index="${lineIndex}">${line.trim()}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Academic Projects Section -->
  ${(data.academicProjects && data.academicProjects.length > 0) ? `
  <div class="section" data-section="academicProjects">
    <div class="section-title">Academic Projects</div>
    ${data.academicProjects.map((item, index) => `
      <div class="experience-item" data-section="academicProjects" data-index="${index}">
        <div class="company-title">
          <div class="company">${item.name || item.title || ''}</div>
          <div class="date">${item.duration || ''}</div>
        </div>
        <div class="job-title">${item.institution || ''}${item.course ? ` | ${item.course}` : ''}</div>
        <p>${item.description || ''}</p>
        ${item.technologies && item.technologies.length > 0 ? `<p style="margin-top: 5px;"><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
        ${item.url ? `<p style="margin-top: 5px;"><strong>URL:</strong> <a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Leadership Positions Section -->
  ${(data.leadershipPositions && data.leadershipPositions.length > 0) ? `
  <div class="section" data-section="leadershipPositions">
    <div class="section-title">Leadership & Positions</div>
    ${data.leadershipPositions.map((item, index) => `
      <div class="experience-item" data-section="leadershipPositions" data-index="${index}">
        <div class="company-title">
          <div class="company">${item.position || item.title || ''}</div>
          <div class="date">${item.startDate || ''} - ${item.endDate || ''}</div>
        </div>
        <div class="job-title">${item.organization || ''}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Training Programs Section -->
  ${(data.trainingPrograms && data.trainingPrograms.length > 0) ? `
  <div class="section" data-section="trainingPrograms">
    <div class="section-title">Training Programs</div>
    ${data.trainingPrograms.map((item, index) => `
      <div class="experience-item" data-section="trainingPrograms" data-index="${index}">
        <div class="company-title">
          <div class="company">${item.name || ''}</div>
          <div class="date">${item.completionDate || ''}</div>
        </div>
        <div class="job-title">${item.provider || item.organization || ''}${item.duration ? ` | ${item.duration}` : ''}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Scholarships Section -->
  ${(data.scholarships && data.scholarships.length > 0) ? `
  <div class="section" data-section="scholarships">
    <div class="section-title">Scholarships</div>
    ${data.scholarships.map((item, index) => `
      <div class="experience-item" data-section="scholarships" data-index="${index}">
        <div class="company-title">
          <div class="company">${item.name || ''}</div>
          <div class="date">${item.year || ''}</div>
        </div>
        <div class="job-title">${item.provider || item.organization || ''}${item.amount ? ` | ${item.amount}` : ''}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Co-curricular Activities Section -->
  ${(data.coCurricular && data.coCurricular.length > 0) ? `
  <div class="section" data-section="coCurricular">
    <div class="section-title">Co-curricular Activities</div>
    ${data.coCurricular.map((item, index) => `
      <div class="experience-item" data-section="coCurricular" data-index="${index}">
        <div class="company-title">
          <div class="company">${item.activity || ''}</div>
          <div class="date">${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
        </div>
        <div class="job-title">${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Extracurricular Activities Section -->
  ${(data.extracurricular && data.extracurricular.length > 0) ? `
  <div class="section" data-section="extracurricular">
    <div class="section-title">Extracurricular Activities</div>
    ${data.extracurricular.map((item, index) => `
      <div class="experience-item" data-section="extracurricular" data-index="${index}">
        <div class="company-title">
          <div class="company">${item.activity || ''}</div>
          <div class="date">${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
        </div>
        <div class="job-title">${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
        <p>${item.description || ''}</p>
      </div>
    `).join('')}
  </div>` : ''}
  
  <!-- Projects Section (if exists) -->
  ${(data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) ? `
  <div class="section" data-section="projects">
    <div class="section-title">Projects</div>
    ${data.projects.slice(0, 3).map((project, index) => `
      <div class="experience-item" data-section="projects" data-index="${index}">
        <div class="company-title">
          <div class="company">${project.name || ''}</div>
          <div class="date">${project.startDate || ''} - ${project.endDate || 'Present'}</div>
        </div>
        ${project.technologies ? `<div class="job-title" style="color: var(--secondary-color); font-weight: normal; margin-bottom: 5px;">${project.technologies}</div>` : ''}
        <p>${project.description || ''}</p>
        ${project.url ? `<p style="margin-top: 8px;"><strong>Link:</strong> <a href="${project.url}" target="_blank" style="color: var(--accent-color); text-decoration: none;">${project.urlText || project.url}</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <!-- Key Achievements Section -->
  ${hasKeyAchievementsContent ? `
  <div class="section" data-section="keyAchievements">
    <div class="section-title">Key Achievements</div>
    <ul>
      ${data.keyAchievements.map((achievement, index) => `
        <li data-section="keyAchievements" data-index="${index}">${achievement}</li>
      `).join('')}
    </ul>
  </div>` : ''}

  <!-- Key Responsibilities Section -->
  ${hasResponsibilitiesContent ? `
  <div class="section" data-section="responsibilities">
    <div class="section-title">Key Responsibilities</div>
    <ul>
      ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line) => line.trim()).map((line, index) => `
        <li data-section="responsibilities" data-index="${index}">${line.trim()}</li>
      `).join('')}
    </ul>
  </div>` : ''}

  <!-- Tools & Technologies Section -->
  ${hasToolsContent ? `
  <div class="section" data-section="tools">
    <div class="section-title">Tools & Technologies</div>
    <ul>
      ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line) => line.trim()).map((line, index) => `
        <li data-section="tools" data-index="${index}">${line.trim()}</li>
      `).join('')}
    </ul>
  </div>` : ''}

  <!-- Additional Information -->
  ${(data.hobbies || data.languages) ? `
  <div class="section" data-section="additional">
    <div class="section-title">Additional Information</div>
    ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `
    <p><strong>Languages:</strong> ${data.languages.map((lang, index) => `${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}`).join(', ')}</p>
    ` : ''}
    ${(data.sectionVisibility?.hobbies !== false && data.hobbies && data.hobbies.length > 0) ? `
    <p><strong>Hobbies:</strong> ${data.hobbies.join(', ')}</p>
    ` : ''}
  </div>` : ''}

  ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `
  <div class="section" data-section="socialLinks">
    <div class="section-title">Social Links</div>
    <div class="skills-list">
      ${data.socialLinks.map((link, index) => `
        <div class="skill-item" data-section="socialLinks" data-index="${index}"><a href="${link.url}" target="_blank" style="color: var(--primary-color); text-decoration: none;">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a></div>
      `).join('')}
    </div>
  </div>` : ''}

  <!-- Custom Sections -->
  ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section) => section.isVisible).map((section) => `
    <div class="section" data-section="customSections">
      <div class="section-title">${section.heading || 'Custom Section'}</div>
      ${section.entries && section.entries.length > 0 ? section.entries.filter((entry) => entry.isVisible).map((entry, entryIndex) => `
        <div class="experience-item" data-section="customSections" data-index="${entryIndex}">
          <div class="company-title">
            <div class="company">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
            ${entry.date ? `<div class="date">${entry.date}</div>` : ''}
          </div>
          ${entry.description ? `<p>${entry.description}</p>` : ''}
        </div>
      `).join('') : '<p style="color: var(--secondary-color); font-style: italic;">No entries in this section</p>'}
    </div>
  `).join('') : ''}
</div>
</body>
</html>`;
}
