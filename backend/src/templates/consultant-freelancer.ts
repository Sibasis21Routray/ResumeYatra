export function buildConsultantFreelancerTemplate(data: any, theme?: any): string {
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

  const hasContent = (arr: any): boolean => {
    if (!arr || !Array.isArray(arr)) return arr && (typeof arr === 'string' ? arr.trim().length > 0 : false);
    if (arr.length === 0) return false;
    return arr.some((item: any) => {
      if (typeof item === 'string') return item.trim().length > 0;
      if (typeof item === 'object' && item !== null) {
        return Object.values(item).some((val: any) =>
          typeof val === 'string' && val.trim().length > 0
        );
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
    ${data.experience.map((exp: any, index: number) => `
      <div class="section-content" data-section="experience" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="experience" data-field="title" data-index="${index}">${exp.title || ''}</div>
          <div class="job-date" data-section="experience" data-field="startDate" data-index="${index}">${exp.startDate || ''} - ${exp.endDate || 'Present'}</div>
        </div>
        <div class="company-name" data-section="experience" data-field="company" data-index="${index}">${exp.company || ''}${exp.location ? ' | ' + exp.location : ''}</div>
        ${exp.description ? `<ul>${exp.description.split('\n').filter((line: string) => line.trim()).map((line: string, lineIndex: number) => `<li data-section="experience" data-field="description" data-index="${index}-${lineIndex}">${line.trim()}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.sectionVisibility?.skills !== false && hasContent(data.skills)) ? `<div class="section" data-section="skills">
    <div class="section-title" data-section="skills">Skills</div>
    <p data-section="skills">${Array.isArray(data.skills) ? data.skills.slice(0, 20).join(' • ') : data.skills}</p>
  </div>` : ''}

  ${(data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) ? `<div class="section" data-section="projects">
    <div class="section-title" data-section="projects">Project Experience</div>
    ${data.projects.map((project: any, index: number) => `
      <div class="section-content" data-section="projects" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="projects" data-field="name" data-index="${index}">${project.name || 'Client'} | ${project.technologies || 'Role'}</div>
          <div class="job-date" data-section="projects" data-field="startDate" data-index="${index}">${project.startDate || ''} - ${project.endDate || 'Present'}</div>
        </div>
        ${project.description ? `<ul>${project.description.split('\n').filter((line: string) => line.trim()).map((line: string, lineIndex: number) => `<li data-section="projects" data-field="description" data-index="${index}-${lineIndex}">${line.trim()}</li>`).join('')}</ul>` : ''}
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
    ${data.education.map((edu: any, index: number) => `
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
              : `<p>${edu.description}</p>`
            }
          </div>
        ` : ''}
        
        ${edu.achievements && edu.achievements.length > 0 ? `
          <div class="education-achievements" data-section="education" data-index="${index}">
            <h4>Academic Excellence</h4>
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

  ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `<div class="section" data-section="certifications">
    <div class="section-title" data-section="certifications">Certifications</div>
    ${data.certifications.map((cert: any, index: number) => `
      <div class="section-content" data-section="certifications" data-index="${index}">
        <div class="job-title" data-section="certifications" data-field="name" data-index="${index}">${cert.name || ''}</div>
        <div class="company-name" data-section="certifications" data-field="issuer" data-index="${index}">${cert.issuer || ''}${cert.date ? ` | ${cert.date}` : ''}</div>
        ${cert.url ? `<p data-section="certifications" data-field="url" data-index="${index}"><a href="${cert.url}" target="_blank">View Certificate</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(typeof data.careerObjective === 'string' && data.careerObjective.trim().length > 0) ? `<div class="section" data-section="careerObjective">
    <div class="section-title" data-section="careerObjective">Career Objective</div>
    <p data-section="careerObjective">${data.careerObjective}</p>
  </div>` : ''}

  ${(data.internships && data.internships.length > 0) ? `<div class="section" data-section="internships">
    <div class="section-title" data-section="internships">Internships</div>
    ${data.internships.map((item: any, index: number) => `
      <div class="section-content" data-section="internships" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="internships" data-field="title" data-index="${index}">${item.title || ''}</div>
          <div class="job-date" data-section="internships" data-field="startDate" data-index="${index}">${item.startDate || ''} - ${item.endDate || ''}</div>
        </div>
        <div class="company-name" data-section="internships" data-field="company" data-index="${index}">${item.company || ''}${item.location ? ' | ' + item.location : ''}</div>
        ${item.description ? `<ul>${item.description.split('\n').filter((line: string) => line.trim()).map((line: string, lineIndex: number) => `<li data-section="internships" data-field="description" data-index="${index}-${lineIndex}">${line.trim()}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.academicProjects && data.academicProjects.length > 0) ? `<div class="section" data-section="academicProjects">
    <div class="section-title" data-section="academicProjects">Academic Projects</div>
    ${data.academicProjects.map((item: any, index: number) => `
      <div class="section-content" data-section="academicProjects" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="academicProjects" data-field="name" data-index="${index}">${item.name || item.title || ''}</div>
          <div class="job-date" data-section="academicProjects" data-field="duration" data-index="${index}">${item.duration || ''}</div>
        </div>
        <div class="company-name" data-section="academicProjects" data-field="institution" data-index="${index}">${item.institution || ''}${item.course ? ' | ' + item.course : ''}</div>
        ${item.description ? `<p>${item.description}</p>` : ''}
        ${item.technologies && item.technologies.length > 0 ? `<p><strong>Technologies:</strong> ${Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies}</p>` : ''}
        ${item.url ? `<p><a href="${item.url}" target="_blank">${item.url}</a></p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.leadershipPositions && data.leadershipPositions.length > 0) ? `<div class="section" data-section="leadershipPositions">
    <div class="section-title" data-section="leadershipPositions">Leadership & Positions</div>
    ${data.leadershipPositions.map((item: any, index: number) => `
      <div class="section-content" data-section="leadershipPositions" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="leadershipPositions" data-field="position" data-index="${index}">${item.position || item.title || ''}</div>
          <div class="job-date" data-section="leadershipPositions" data-field="startDate" data-index="${index}">${item.startDate || ''} - ${item.endDate || ''}</div>
        </div>
        <div class="company-name" data-section="leadershipPositions" data-field="organization" data-index="${index}">${item.organization || ''}</div>
        ${item.description ? `<p>${item.description}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.trainingPrograms && data.trainingPrograms.length > 0) ? `<div class="section" data-section="trainingPrograms">
    <div class="section-title" data-section="trainingPrograms">Training Programs</div>
    ${data.trainingPrograms.map((item: any, index: number) => `
      <div class="section-content" data-section="trainingPrograms" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="trainingPrograms" data-field="name" data-index="${index}">${item.name || ''}</div>
          <div class="job-date" data-section="trainingPrograms" data-field="completionDate" data-index="${index}">${item.completionDate || ''}</div>
        </div>
        <div class="company-name" data-section="trainingPrograms" data-field="provider" data-index="${index}">${item.provider || item.organization || ''}${item.duration ? ' | ' + item.duration : ''}</div>
        ${item.description ? `<p>${item.description}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.scholarships && data.scholarships.length > 0) ? `<div class="section" data-section="scholarships">
    <div class="section-title" data-section="scholarships">Scholarships</div>
    ${data.scholarships.map((item: any, index: number) => `
      <div class="section-content" data-section="scholarships" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="scholarships" data-field="name" data-index="${index}">${item.name || ''}</div>
          <div class="job-date" data-section="scholarships" data-field="year" data-index="${index}">${item.year || ''}</div>
        </div>
        <div class="company-name" data-section="scholarships" data-field="provider" data-index="${index}">${item.provider || item.organization || ''}${item.amount ? ' | ' + item.amount : ''}</div>
        ${item.description ? `<p>${item.description}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.coCurricular && data.coCurricular.length > 0) ? `<div class="section" data-section="coCurricular">
    <div class="section-title" data-section="coCurricular">Co-curricular Activities</div>
    ${data.coCurricular.map((item: any, index: number) => `
      <div class="section-content" data-section="coCurricular" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="coCurricular" data-field="activity" data-index="${index}">${item.activity || ''}</div>
          <div class="job-date" data-section="coCurricular" data-field="year" data-index="${index}">${item.year || (item.startDate ? item.startDate + ' - ' + (item.endDate || '') : '')}</div>
        </div>
        <div class="company-name" data-section="coCurricular" data-field="organization" data-index="${index}">${item.organization || ''}${item.role ? ' | ' + item.role : ''}</div>
        ${item.description ? `<p>${item.description}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${(data.extracurricular && data.extracurricular.length > 0) ? `<div class="section" data-section="extracurricular">
    <div class="section-title" data-section="extracurricular">Extracurricular Activities</div>
    ${data.extracurricular.map((item: any, index: number) => `
      <div class="section-content" data-section="extracurricular" data-index="${index}">
        <div class="job-header">
          <div class="job-title" data-section="extracurricular" data-field="activity" data-index="${index}">${item.activity || ''}</div>
          <div class="job-date" data-section="extracurricular" data-field="year" data-index="${index}">${item.year || (item.startDate ? item.startDate + ' - ' + (item.endDate || '') : '')}</div>
        </div>
        <div class="company-name" data-section="extracurricular" data-field="organization" data-index="${index}">${item.organization || ''}${item.role ? ' | ' + item.role : ''}</div>
        ${item.description ? `<p>${item.description}</p>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${data.keyAchievements && data.keyAchievements.length > 0 ? `<div class="section" data-section="keyAchievements">
    <div class="section-title" data-section="keyAchievements">Key Achievements</div>
    <ul>
      ${data.keyAchievements.map((achievement: string, index: number) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
    </ul>
  </div>` : ''}

  ${hasContent(data.responsibilities) ? `<div class="section" data-section="responsibilities">
    <div class="section-title" data-section="responsibilities">Key Responsibilities</div>
    <ul>
      ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line: string) => line.trim()).map((line: string, index: number) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
    </ul>
  </div>` : ''}

  ${(data.hobbies && data.hobbies.length > 0) ? `<div class="section" data-section="hobbies">
    <div class="section-title" data-section="hobbies">Hobbies & Interests</div>
    <p data-section="hobbies">${data.hobbies.join(', ')}</p>
  </div>` : ''}

  ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `<div class="section" data-section="languages">
    <div class="section-title" data-section="languages">Languages</div>
    <p data-section="languages">${data.languages.map((lang: any) => `${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}`).join(', ')}</p>
  </div>` : ''}

  ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `<div class="section" data-section="socialLinks">
    <div class="section-title" data-section="socialLinks">Social Links</div>
    <p data-section="socialLinks">${data.socialLinks.map((link: any, index: number) => `<a href="${link.url}" target="_blank">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>`).join(', ')}</p>
  </div>` : ''}

  ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section: any) => section.isVisible).map((section: any, sectionIndex: number) => `
  <div class="section" data-section="customSections" data-index="${sectionIndex}">
    <div class="section-title" data-section="customSections" data-index="${sectionIndex}">${section.heading}</div>
    ${section.entries.filter((entry: any) => entry.isVisible).map((entry: any, entryIndex: number) => `
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

