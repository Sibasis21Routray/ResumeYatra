export function buildDragoniteTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#000000',
    secondary: '#444444',
    background: '#ffffff',
    headingFont: 'Arial',
    bodyFont: 'Arial'
  }
  
  // --- PRESERVED CODE BLOCK ---
  const currentTheme = theme || defaultTheme
  
  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14 // Default 14px
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Source Sans Pro, sans-serif'
  
  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize
  const headingFontSize = Math.round(userFontSize * 2.25) // 2.25x base size
  const subheadingFontSize = Math.round(userFontSize * 1.125) // 1.125x base size
  // ---------------------------

  // Helper function to check if a section has content
  const hasResponsibilitiesContent = (Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line: string) => line.trim()).length > 0;
  const hasToolsContent = (Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line: string) => line.trim()).length > 0;

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
      background: #ffffff;
      padding: 40px;
    }
    
    /* Header Styles */
    .header {
      margin-bottom: 30px;
    }
    .name {
      font-size: ${Math.round(headingFontSize * 1.2)}px;
      font-weight: 800;
      color: ${currentTheme.primary};
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 5px;
      line-height: 1;
    }
    .header-divider {
      width: 100%;
      height: 2px;
      background-color: ${currentTheme.primary};
      margin-bottom: 10px;
    }
    .contact {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      color: #333;
    }
    .contact span {
      display: flex;
      align-items: center;
    }
    .contact a {
      color: inherit;
      text-decoration: none;
    }
    /* Separator for contact items */
    .contact span:not(:last-child)::after {
      content: "|";
      margin-left: 15px;
      color: #999;
    }

    /* Section Styles */
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: ${Math.round(baseFontSize * 1.1)}px;
      font-weight: 800;
      color: ${currentTheme.primary};
      text-transform: uppercase;
      margin-bottom: 15px;
      letter-spacing: 0.5px;
    }
    
    /* Entry Styles */
    .entry {
      margin-bottom: 15px;
    }
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .entry-title {
      font-weight: 800;
      font-size: ${subheadingFontSize}px;
      text-transform: uppercase;
    }
    .entry-date {
      font-size: ${baseFontSize}px;
      font-weight: 600;
      text-align: right;
      white-space: nowrap;
    }
    .entry-subtitle {
      font-weight: 700;
      font-style: italic;
      margin-bottom: 5px;
    }
    
    /* Content & List Styles */
    .entry-content {
      font-size: ${baseFontSize}px;
    }
    .entry-content ul {
      margin: 5px 0 5px 20px;
      padding: 0;
      list-style-type: square; /* Matching the square bullets in image */
    }
    .entry-content li {
      margin-bottom: 3px;
      padding-left: 5px;
    }

    /* Skills Grid Layout */
    .skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 40px;
    }
    .skill-item {
      display: flex;
      align-items: baseline;
    }
    .skill-bullet {
      width: 6px;
      height: 6px;
      background-color: ${currentTheme.primary};
      margin-right: 10px;
      display: inline-block;
    }

    /* Enhanced Education Styles */
    .education-field {
      font-weight: 800;
      color: ${currentTheme.primary};
      margin-bottom: 6px;
      font-size: ${Math.round(baseFontSize * 0.95)}px;
      text-transform: uppercase;
    }

    .education-school {
      font-weight: 800;
      color: ${currentTheme.primary};
      margin-bottom: 6px;
      text-transform: uppercase;
    }

    .education-location {
      color: ${currentTheme.secondary};
      font-style: italic;
      margin-bottom: 8px;
    }

    .education-description {
      font-size: ${baseFontSize}px;
      color: #000000;
      line-height: 1.5;
      margin-top: 8px;
      padding: 8px;
      background: #f8f8f8;
      border-left: 3px solid ${currentTheme.primary};
    }

    .education-description ul {
      margin: 6px 0 6px 20px;
      padding: 0;
      list-style-type: square;
    }

    .education-description li {
      margin: 3px 0;
      color: #000000;
    }

    .education-description b {
      font-weight: 800;
      color: ${currentTheme.primary};
    }

    .education-achievements {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid ${currentTheme.secondary};
    }

    .education-achievements h4 {
      font-size: ${Math.round(baseFontSize * 0.9)}px;
      font-weight: 800;
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
      padding-left: 16px;
      margin-bottom: 4px;
      color: #000000;
      font-size: ${baseFontSize}px;
    }

    .education-achievements li:before {
      content: "■";
      color: ${currentTheme.primary};
      font-weight: bold;
      position: absolute;
      left: 0;
    }

    @media print {
      body { margin: 0; padding: 0; }
      .container { width: 100%; max-width: none; padding: 30px 40px; }
    }
  </style>
</head>
<body>
<div class="container">
  <div class="header" data-section="personal">
    <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Your Name'}</div>
    ${data.personal?.role ? `<div style="font-size: 16px; margin-bottom: 5px; font-weight: 600;" data-section="personal">${data.personal.role}</div>` : ''}
    <div class="header-divider" data-section="personal"></div>
    <div class="contact" data-section="personal">
      ${data.personal?.email ? `<span data-section="personal">${data.personal.email}</span>` : ''}
      ${data.personal?.phone ? `<span data-section="personal">${data.personal.phone}</span>` : ''}
      ${data.personal?.alternatePhone ? `<span data-section="personal">${data.personal.alternatePhone}</span>` : ''}
      ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<span data-section="personal">${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</span>` : ''}
      ${data.personal?.linkedinUrl ? `<span data-section="personal"><a href="${data.personal.linkedinUrl}" target="_blank">LinkedIn</a></span>` : ''}
      ${data.personal?.githubUrl ? `<span data-section="personal"><a href="${data.personal.githubUrl}" target="_blank">GitHub</a></span>` : ''}
      ${data.personal?.portfolioUrl ? `<span data-section="personal"><a href="${data.personal.portfolioUrl}" target="_blank">Portfolio</a></span>` : ''}
      ${data.personal?.website ? `<span data-section="personal"><a href="${data.personal.website}" target="_blank">Website</a></span>` : ''}
      ${data.personal?.twitterUrl ? `<span data-section="personal"><a href="${data.personal.twitterUrl}" target="_blank">Twitter</a></span>` : ''}
      ${data.personal?.facebookUrl ? `<span data-section="personal"><a href="${data.personal.facebookUrl}" target="_blank">Facebook</a></span>` : ''}
      ${data.personal?.instagramUrl ? `<span data-section="personal"><a href="${data.personal.instagramUrl}" target="_blank">Instagram</a></span>` : ''}
      ${data.personal?.behanceUrl ? `<span data-section="personal"><a href="${data.personal.behanceUrl}" target="_blank">Behance</a></span>` : ''}
      ${data.personal?.dribbbleUrl ? `<span data-section="personal"><a href="${data.personal.dribbbleUrl}" target="_blank">Dribbble</a></span>` : ''}
      ${data.personal?.stackoverflowUrl ? `<span data-section="personal"><a href="${data.personal.stackoverflowUrl}" target="_blank">Stack Overflow</a></span>` : ''}
      ${data.personal?.mediumUrl ? `<span data-section="personal"><a href="${data.personal.mediumUrl}" target="_blank">Medium</a></span>` : ''}
      ${data.personal?.fathersName ? `<span data-section="personal">Father's Name: ${data.personal.fathersName}</span>` : ''}
      ${data.personal?.dob ? `<span data-section="personal">DOB: ${data.personal.dob}</span>` : ''}
      ${data.personal?.gender ? `<span data-section="personal">Gender: ${data.personal.gender}</span>` : ''}
      ${data.personal?.maritalStatus ? `<span data-section="personal">Marital Status: ${data.personal.maritalStatus}</span>` : ''}
    </div>
  </div>

    ${(data.sectionVisibility?.experience !== false && data.experience && data.experience.length > 0) ? `<div class="section" data-section="experience">
      <div class="section-title" data-section="experience">Experience</div>
      ${(data.experience || []).map((exp: any, index: number) => `
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
      ${(data.projects || []).map((project: any, index: number) => `
        <div class="entry" data-section="projects" data-index="${index}">
          <div class="entry-header" data-section="projects" data-index="${index}">
             <div class="entry-title" data-section="projects" data-index="${index}">${project.name || ''}</div>
             ${project.startDate || project.endDate ? `<div class="entry-date" data-section="projects" data-index="${index}">${project.startDate || ''} ${project.startDate && project.endDate ? '-' : ''} ${project.endDate || ''}</div>` : ''}
          </div>
          <div class="entry-subtitle" data-section="projects" data-index="${index}">${project.technologies || ''}</div>
          <div class="entry-content" data-section="projects" data-index="${index}">${project.description || ''}</div>
          ${project.url ? `<div class="entry-content" data-section="projects" data-index="${index}" style="margin-top: 2px; font-size: 0.9em;"><a href="${project.url}" target="_blank" style="text-decoration: underline; color: ${currentTheme.primary};">${project.urlText || 'Link to Project'}</a></div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.sectionVisibility?.education !== false && data.education && data.education.length > 0) ? `<div class="section" data-section="education">
      <div class="section-title" data-section="education">Education</div>
      ${(data.education || []).map((edu: any, index: number) => `
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
                : `<p>${edu.description}</p>`
              }
            </div>
          ` : ''}
          
          ${edu.achievements && edu.achievements.length > 0 ? `
            <div class="education-achievements" data-section="education" data-index="${index}">
              <h4>Academic Honors</h4>
              <ul>
                ${edu.achievements.filter((achievement: string) => achievement.trim()).map((achievement: string, achIndex: number) => 
                  `<li data-section="education" data-index="${index}" data-item-index="${achIndex}">${achievement}</li>`
                ).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.sectionVisibility?.skills !== false && data.skills) ? `<div class="section" data-section="skills">
      <div class="section-title" data-section="skills">Skills</div>
      <div class="skills-grid" data-section="skills">
        ${(Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',')).map((skill: any, index: number) => `
          <div class="skill-item" data-section="skills" data-index="${index}">
            <span class="skill-bullet"></span>
            <span>${typeof skill === 'string' ? skill.trim() : skill}</span>
          </div>
        `).join('')}
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `<div class="section" data-section="languages">
      <div class="section-title" data-section="languages">Languages</div>
      <div class="skills-grid" data-section="languages">
        ${(data.languages || []).map((lang: any, index: number) => `
          <div class="skill-item" data-section="languages" data-index="${index}">
             <span class="skill-bullet"></span>
             <span>${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}</span>
          </div>
        `).join('')}
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.hobbies !== false && data.hobbies && data.hobbies.length > 0) ? `<div class="section" data-section="hobbies">
      <div class="section-title" data-section="hobbies">Hobbies & Interests</div>
      <div class="entry-content" data-section="hobbies">
        <ul data-section="hobbies">
          ${(data.hobbies || []).map((hobby: any, index: number) => `
            <li data-section="hobbies" data-index="${index}">${hobby}</li>
          `).join('')}
        </ul>
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `<div class="section" data-section="socialLinks">
      <div class="section-title" data-section="socialLinks">Social Links</div>
      <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px;" data-section="socialLinks">
        ${data.socialLinks.map((link: any, index: number) => `
          <a href="${link.url}" target="_blank" style="color: ${currentTheme.primary}; text-decoration: none; font-weight: 500; font-size: ${baseFontSize}px;" data-section="socialLinks" data-index="${index}">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
        `).join('')}
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `<div class="section" data-section="certifications">
      <div class="section-title" data-section="certifications">Certifications</div>
      ${(data.certifications || []).map((cert: any, index: number) => `
        <div class="entry" data-section="certifications" data-index="${index}">
          <div class="entry-header" data-section="certifications" data-index="${index}">
            <div class="entry-title" data-section="certifications" data-index="${index}">${cert.name || ''}</div>
            <div class="entry-date" data-section="certifications" data-index="${index}">${cert.date || ''}</div>
          </div>
          <div class="entry-subtitle" data-section="certifications" data-index="${index}">${cert.issuer || ''}</div>
          ${cert.url ? `<div class="entry-content" data-section="certifications" data-index="${index}" style="margin-top: 2px; font-size: 0.9em;"><a href="${cert.url}" target="_blank" style="text-decoration: underline; color: ${currentTheme.primary};">View Certificate</a></div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    ${data.keyAchievements && data.keyAchievements.length > 0 ? `<div class="section" data-section="keyAchievements">
      <div class="section-title" data-section="keyAchievements">Key Achievements</div>
      <div class="entry-content" data-section="keyAchievements">
        <ul data-section="keyAchievements">
          ${(data.keyAchievements || []).map((achievement: string, index: number) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
        </ul>
      </div>
    </div>` : ''}


    ${hasResponsibilitiesContent ? `<div class="section" data-section="responsibilities">
      <div class="section-title" data-section="responsibilities">Key Responsibilities</div>
      <div class="entry-content" data-section="responsibilities">
        <ul data-section="responsibilities">
          ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line: string) => line.trim()).map((line: string, index: number) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
        </ul>
      </div>
    </div>` : ''}

    ${hasToolsContent ? `<div class="section" data-section="tools">
      <div class="section-title" data-section="tools">Tools & Technologies</div>
      <div class="entry-content" data-section="tools">
        <ul data-section="tools">
          ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line: string) => line.trim()).map((line: string, index: number) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
        </ul>
      </div>
    </div>` : ''}

    ${(data.sectionVisibility?.summary !== false && data.summary) ? `<div class="section" data-section="summary">
      <div class="section-title" data-section="summary">Summary</div>
      <p class="entry-content" data-section="summary">${data.summary}</p>
    </div>` : ''}

    ${(typeof data.careerObjective === "string" && data.careerObjective.trim().length > 0) ? `<div class="section" data-section="careerObjective">
      <div class="section-title" data-section="careerObjective">Career Objective</div>
      <p class="entry-content" data-section="careerObjective">${data.careerObjective}</p>
    </div>` : ''}

    ${(data.internships && data.internships.length > 0) ? `<div class="section" data-section="internships">
      <div class="section-title" data-section="internships">Internships</div>
      ${(data.internships || []).map((item: any, index: number) => `
        <div class="entry" data-section="internships" data-index="${index}">
          <div class="entry-header" data-section="internships" data-index="${index}">
            <div class="entry-title" data-section="internships" data-index="${index}">${item.title || ''}</div>
            <div class="entry-date" data-section="internships" data-index="${index}">${item.startDate || ''} - ${item.endDate || ''}</div>
          </div>
          <div class="entry-subtitle" data-section="internships" data-index="${index}">${item.company || ''}${item.location ? `, ${item.location}` : ''}</div>
          <div class="entry-content" data-section="internships" data-index="${index}">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.academicProjects && data.academicProjects.length > 0) ? `<div class="section" data-section="academicProjects">
      <div class="section-title" data-section="academicProjects">Academic Projects</div>
      ${(data.academicProjects || []).map((item: any, index: number) => `
        <div class="entry" data-section="academicProjects" data-index="${index}">
          <div class="entry-header" data-section="academicProjects" data-index="${index}">
            <div class="entry-title" data-section="academicProjects" data-index="${index}">${item.name || item.title || ''}</div>
            <div class="entry-date" data-section="academicProjects" data-index="${index}">${item.duration || ''}</div>
          </div>
          <div class="entry-subtitle" data-section="academicProjects" data-index="${index}">${item.institution || ''}</div>
          <div class="entry-content" data-section="academicProjects" data-index="${index}">${item.description || ''}</div>
          ${item.technologies ? `<div class="entry-content" data-section="academicProjects" data-index="${index}" style="margin-top: 5px;"><strong>Technologies:</strong> ${item.technologies}</div>` : ''}
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.leadershipPositions && data.leadershipPositions.length > 0) ? `<div class="section" data-section="leadershipPositions">
      <div class="section-title" data-section="leadershipPositions">Leadership & Positions</div>
      ${(data.leadershipPositions || []).map((item: any, index: number) => `
        <div class="entry" data-section="leadershipPositions" data-index="${index}">
          <div class="entry-header" data-section="leadershipPositions" data-index="${index}">
            <div class="entry-title" data-section="leadershipPositions" data-index="${index}">${item.position || item.title || ''}</div>
            <div class="entry-date" data-section="leadershipPositions" data-index="${index}">${item.startDate || ''} - ${item.endDate || ''}</div>
          </div>
          <div class="entry-subtitle" data-section="leadershipPositions" data-index="${index}">${item.organization || ''}</div>
          <div class="entry-content" data-section="leadershipPositions" data-index="${index}">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.trainingPrograms && data.trainingPrograms.length > 0) ? `<div class="section" data-section="trainingPrograms">
      <div class="section-title" data-section="trainingPrograms">Training Programs</div>
      ${(data.trainingPrograms || []).map((item: any, index: number) => `
        <div class="entry" data-section="trainingPrograms" data-index="${index}">
          <div class="entry-header" data-section="trainingPrograms" data-index="${index}">
            <div class="entry-title" data-section="trainingPrograms" data-index="${index}">${item.name || ''}</div>
            <div class="entry-date" data-section="trainingPrograms" data-index="${index}">${item.completionDate || ''}</div>
          </div>
          <div class="entry-subtitle" data-section="trainingPrograms" data-index="${index}">${item.provider || item.organization || ''}${item.duration ? ` | ${item.duration}` : ''}</div>
          <div class="entry-content" data-section="trainingPrograms" data-index="${index}">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.scholarships && data.scholarships.length > 0) ? `<div class="section" data-section="scholarships">
      <div class="section-title" data-section="scholarships">Scholarships</div>
      ${(data.scholarships || []).map((item: any, index: number) => `
        <div class="entry" data-section="scholarships" data-index="${index}">
          <div class="entry-header" data-section="scholarships" data-index="${index}">
            <div class="entry-title" data-section="scholarships" data-index="${index}">${item.name || ''}</div>
            <div class="entry-date" data-section="scholarships" data-index="${index}">${item.year || ''}</div>
          </div>
          <div class="entry-subtitle" data-section="scholarships" data-index="${index}">${item.provider || item.organization || ''}${item.amount ? ` | ${item.amount}` : ''}</div>
          <div class="entry-content" data-section="scholarships" data-index="${index}">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.coCurricular && data.coCurricular.length > 0) ? `<div class="section" data-section="coCurricular">
      <div class="section-title" data-section="coCurricular">Co-curricular Activities</div>
      ${(data.coCurricular || []).map((item: any, index: number) => `
        <div class="entry" data-section="coCurricular" data-index="${index}">
          <div class="entry-header" data-section="coCurricular" data-index="${index}">
            <div class="entry-title" data-section="coCurricular" data-index="${index}">${item.activity || ''}</div>
            <div class="entry-date" data-section="coCurricular" data-index="${index}">${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
          </div>
          <div class="entry-subtitle" data-section="coCurricular" data-index="${index}">${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
          <div class="entry-content" data-section="coCurricular" data-index="${index}">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    ${(data.extracurricular && data.extracurricular.length > 0) ? `<div class="section" data-section="extracurricular">
      <div class="section-title" data-section="extracurricular">Extracurricular Activities</div>
      ${(data.extracurricular || []).map((item: any, index: number) => `
        <div class="entry" data-section="extracurricular" data-index="${index}">
          <div class="entry-header" data-section="extracurricular" data-index="${index}">
            <div class="entry-title" data-section="extracurricular" data-index="${index}">${item.activity || ''}</div>
            <div class="entry-date" data-section="extracurricular" data-index="${index}">${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
          </div>
          <div class="entry-subtitle" data-section="extracurricular" data-index="${index}">${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
          <div class="entry-content" data-section="extracurricular" data-index="${index}">${item.description || ''}</div>
        </div>
      `).join('')}
    </div>` : ''}

    ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section: any) => section.isVisible && section.entries && section.entries.length > 0 && section.entries.some((entry: any) => entry.isVisible)).map((section: any) => `

    <div class="section" data-section="customSections">
      <div class="section-title" data-section="customSections">${section.heading || 'Custom Section'}</div>
      ${section.entries && section.entries.length > 0 ? section.entries.filter((entry: any) => entry.isVisible).map((entry: any, entryIndex: number) => `
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
</body>
</html>`
}

