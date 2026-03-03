export function buildAzurillTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#1e40af',
    secondary: '#ffffff',
    background: '#ffffff',
    headingFont: 'Poppins',
    bodyFont: 'Poppins'
  }

  const currentTheme = theme || defaultTheme

  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 14
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Poppins, sans-serif'

  const headingFontSize = Math.round(userFontSize * 2.1)
  const subheadingFontSize = Math.round(userFontSize * 1.2)

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Resume</title>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: ${currentTheme.primary};
  --secondary-color: ${currentTheme.secondary};
  --background-color: ${currentTheme.background};
  --heading-font: ${currentTheme.headingFont || 'Poppins'};
  --body-font: ${currentTheme.bodyFont || 'Poppins'};
}

body {
  font-family: ${userFontFamily};
  font-size: ${userFontSize}px;
  background: #e5e5e5;
  color: #333;
  line-height: 1.6;
}

.resume {
  max-width: 900px;
  margin: 30px auto;
  background: #ffffff;
  display: flex;
}

/* LEFT SIDEBAR */
.sidebar {
  width: 32%;
  background: var(--secondary-color);
  padding: 30px 22px;
  color: #333;
}

.profile-pic {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #fff;
  margin-bottom: 20px;
}

.profile-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-section {
  margin-bottom: 26px;
}

.sidebar-title {
  font-weight: 700;
  font-size: ${Math.round(userFontSize * 0.95)}px;
  background: var(--primary-color);
  color: white;
  padding: 6px 10px;
  margin-bottom: 10px;
}

.sidebar p {
  margin-bottom: 6px;
}

.sidebar ul {
  margin-left: 18px;
}

.sidebar li {
  margin-bottom: 6px;
}

/* Enhanced Education Styles for Sidebar */
.education-item {
  margin-bottom: 20px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  border-left: 3px solid #fff;
}

.education-degree {
  font-weight: 700;
  font-size: ${Math.round(userFontSize * 1.0)}px;
  color: #333;
  margin-bottom: 4px;
}

.education-field {
  font-weight: 500;
  font-size: ${Math.round(userFontSize * 0.9)}px;
  color: #333;
  margin-bottom: 4px;
  font-style: italic;
}

.education-school {
  font-size: ${Math.round(userFontSize * 0.85)}px;
  color: #333;
  margin-bottom: 4px;
  font-weight: 500;
}

.education-location {
  font-size: ${Math.round(userFontSize * 0.8)}px;
  color: #333;
  margin-bottom: 6px;
  font-style: italic;
}

.education-date {
  font-size: ${Math.round(userFontSize * 0.8)}px;
  color: #333;
  font-weight: 500;
  margin-bottom: 6px;
}

.education-description {
  font-size: ${Math.round(userFontSize * 0.8)}px;
  color: #333;
  line-height: 1.4;
  margin-top: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.education-description ul {
  margin: 6px 0 6px 16px;
  padding: 0;
  list-style-type: disc;
}

.education-description li {
  margin: 3px 0;
  color: #333;
}

.education-description b {
  font-weight: 600;
  color: #333;
}

.education-achievements {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.education-achievements h4 {
  font-size: ${Math.round(userFontSize * 0.75)}px;
  font-weight: 600;
  color: #333;
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
  padding-left: 12px;
  margin-bottom: 4px;
  color: #333;
  font-size: ${Math.round(userFontSize * 0.8)}px;
}

.education-achievements li:before {
  content: "▪";
  color: #333;
  font-weight: bold;
  position: absolute;
  left: 0;
}

/* RIGHT CONTENT */
.main {
  width: 68%;
  padding: 30px 36px;
}

.header-bar {
  background: var(--primary-color);
  color: #ffffff;
  padding: 18px 24px;
  margin-bottom: 28px;
}

.name {
  font-size: ${headingFontSize}px;
  font-weight: 700;
}

.role {
  font-size: ${subheadingFontSize}px;
  margin-top: 6px;
}

.section {
  margin-bottom: 28px;
}

.section-title {
  font-weight: 700;
  font-size: ${Math.round(userFontSize * 1.05)}px;
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 6px;
  margin-bottom: 12px;
}

.entry {
  margin-bottom: 18px;
}

.entry-title {
  font-weight: 600;
}

.entry-subtitle {
  font-size: ${Math.round(userFontSize * 0.95)}px;
  color: #555;
}

.entry-date {
  font-size: ${Math.round(userFontSize * 0.9)}px;
  color: #777;
}

@media print {
  body {
    background: #fff;
  }
}
</style>
</head>

<body>
<div class="resume">

  <!-- SIDEBAR -->
  <aside class="sidebar">

    ${data.personal?.image ? `
      <div class="profile-pic">
        <img src="${data.personal.image}" alt="Profile" />
      </div>
    ` : ''}


    <div class="sidebar-section">
      <div class="sidebar-title">Contact Details</div>
      ${data.personal?.phone ? `<p data-section="personal">${data.personal.phone}</p>` : ''}
      ${data.personal?.alternatePhone ? `<p data-section="personal">${data.personal.alternatePhone}</p>` : ''}
      ${data.personal?.email ? `<p data-section="personal">${data.personal.email}</p>` : ''}
      ${(data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress) ? `<p data-section="personal">${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</p>` : ''}
      ${data.personal?.linkedinUrl ? `<p data-section="personal"><a href="${data.personal.linkedinUrl}" target="_blank" style="color: #222; text-decoration: none;">LinkedIn</a></p>` : ''}
      ${data.personal?.githubUrl ? `<p data-section="personal"><a href="${data.personal.githubUrl}" target="_blank" style="color: #222; text-decoration: none;">GitHub</a></p>` : ''}
      ${data.personal?.portfolioUrl ? `<p data-section="personal"><a href="${data.personal.portfolioUrl}" target="_blank" style="color: #222; text-decoration: none;">Portfolio</a></p>` : ''}
      ${data.personal?.website ? `<p data-section="personal"><a href="${data.personal.website}" target="_blank" style="color: #222; text-decoration: none;">Website</a></p>` : ''}
      ${data.personal?.twitterUrl ? `<p data-section="personal"><a href="${data.personal.twitterUrl}" target="_blank" style="color: #222; text-decoration: none;">Twitter</a></p>` : ''}
      ${data.personal?.facebookUrl ? `<p data-section="personal"><a href="${data.personal.facebookUrl}" target="_blank" style="color: #222; text-decoration: none;">Facebook</a></p>` : ''}
      ${data.personal?.instagramUrl ? `<p data-section="personal"><a href="${data.personal.instagramUrl}" target="_blank" style="color: #222; text-decoration: none;">Instagram</a></p>` : ''}
      ${data.personal?.behanceUrl ? `<p data-section="personal"><a href="${data.personal.behanceUrl}" target="_blank" style="color: #222; text-decoration: none;">Behance</a></p>` : ''}
      ${data.personal?.dribbbleUrl ? `<p data-section="personal"><a href="${data.personal.dribbbleUrl}" target="_blank" style="color: #222; text-decoration: none;">Dribbble</a></p>` : ''}
      ${data.personal?.stackoverflowUrl ? `<p data-section="personal"><a href="${data.personal.stackoverflowUrl}" target="_blank" style="color: #222; text-decoration: none;">Stack Overflow</a></p>` : ''}
      ${data.personal?.mediumUrl ? `<p data-section="personal"><a href="${data.personal.mediumUrl}" target="_blank" style="color: #222; text-decoration: none;">Medium</a></p>` : ''}
      ${data.personal?.fathersName ? `<p data-section="personal">Father's Name: ${data.personal.fathersName}</p>` : ''}
      ${data.personal?.dob ? `<p data-section="personal">DOB: ${data.personal.dob}</p>` : ''}
      ${data.personal?.gender ? `<p data-section="personal">Gender: ${data.personal.gender}</p>` : ''}
      ${data.personal?.maritalStatus ? `<p data-section="personal">Marital Status: ${data.personal.maritalStatus}</p>` : ''}
    </div>


    ${(Array.isArray(data.skills) ? data.skills : (data.skills || '').split('\n')).filter((s: string) => s.trim()).length > 0 ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Competencies</div>
      <ul data-section="skills">
        ${(Array.isArray(data.skills) ? data.skills : (data.skills || '').split('\n')).filter((s: string) => s.trim()).map((s: any, index: number) => `<li data-section="skills" data-index="${index}">${typeof s === 'string' ? s : s}</li>`).join('')}
      </ul>
    </div>` : ''}



    ${data.education?.length ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Education</div>
      ${data.education.map((edu: any, index: number) => `
        <div class="education-item" data-section="education" data-index="${index}">
          <div class="education-degree" data-section="education" data-index="${index}">
            ${edu.degree || ''}${edu.qualification ? ` (${edu.qualification})` : ''}
          </div>
          ${edu.field ? `<div class="education-field" data-section="education" data-index="${index}">${edu.field}</div>` : ''}
          ${edu.school ? `<div class="education-school" data-section="education" data-index="${index}">${edu.school}</div>` : ''}
          ${edu.location ? `<div class="education-location" data-section="education" data-index="${index}">${edu.location}</div>` : ''}
          ${edu.graduationDate ? `<div class="education-date" data-section="education" data-index="${index}">${edu.graduationDate}</div>` : ''}
          
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
              <h4>Achievements</h4>
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


    ${data.languages?.length ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Languages</div>
      ${data.languages.map((lang: any, index: number) => `
        <p data-section="languages" data-index="${index}">
          <b data-section="languages" data-index="${index}">${lang.language || ''}</b> - ${lang.proficiency || ''}
        </p>
      `).join('')}
    </div>` : ''}


    ${data.certifications?.length ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Certifications</div>
      ${data.certifications.map((cert: any, index: number) => `
        <p data-section="certifications" data-index="${index}">
          <b data-section="certifications" data-index="${index}">${cert.name || ''}</b><br/>
          <span data-section="certifications" data-index="${index}">${cert.issuer || ''}</span><br/>
          <span data-section="certifications" data-index="${index}">${cert.date || ''}</span>
        </p>
      `).join('')}
    </div>` : ''}


    ${data.hobbies?.length ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Hobbies & Interests</div>
      <ul data-section="hobbies">
        ${data.hobbies.map((hobby: any, index: number) => `<li data-section="hobbies" data-index="${index}">${hobby}</li>`).join('')}
      </ul>
    </div>` : ''}

    ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `
    <div class="sidebar-section">
      <div class="sidebar-title">Social Links</div>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;" data-section="socialLinks">
        ${data.socialLinks.map((link: any, index: number) => `
          <a href="${link.url}" target="_blank" style="color: #222; text-decoration: none; font-size: ${Math.round(userFontSize * 0.8)}px;" data-section="socialLinks" data-index="${index}">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>
        `).join('')}
      </div>
    </div>` : ''}

  </aside>

  <!-- MAIN CONTENT -->
  <main class="main">


    <div class="header-bar" data-section="personal">
      <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : ''}</div>
      <div class="role" data-section="personal">${data.personal?.role || ''}</div>
    </div>


    ${(data.sectionVisibility?.summary !== false && data.summary) ? `
    <div class="section" data-section="summary">
      <div class="section-title" data-section="summary">Career Overview</div>
      <p data-section="summary">${data.summary}</p>
    </div>` : ''}


    ${typeof data.careerObjective === 'string' && data.careerObjective.trim().length > 0 ? `
    <div class="section" data-section="careerObjective">
      <div class="section-title" data-section="careerObjective">Career Objective</div>
      <p data-section="careerObjective">${data.careerObjective}</p>
    </div>` : ''}






    ${data.experience?.length ? `
    <div class="section" data-section="experience">
      <div class="section-title" data-section="experience">Work Experience</div>
      ${data.experience.map((exp: any, index: number) => `
        <div class="entry" data-section="experience" data-index="${index}">
          <div class="entry-title" data-section="experience" data-index="${index}">${exp.title || ''}</div>
          <div class="entry-subtitle" data-section="experience" data-index="${index}">${exp.company || ''}</div>
          <div class="entry-date" data-section="experience" data-index="${index}">${exp.startDate || ''} – ${exp.endDate || 'Present'}</div>
          <p data-section="experience" data-index="${index}">${exp.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}


    ${data.internships?.length ? `
    <div class="section" data-section="internships">
      <div class="section-title" data-section="internships">Internships</div>
      ${data.internships.map((item: any, index: number) => `
        <div class="entry" data-section="internships" data-index="${index}">
          <div class="entry-title" data-section="internships" data-index="${index}">${item.title || ''}</div>
          <div class="entry-subtitle" data-section="internships" data-index="${index}">${item.company || ''}${item.location ? `, ${item.location}` : ''}</div>
          <div class="entry-date" data-section="internships" data-index="${index}">${item.startDate || ''} – ${item.endDate || ''}</div>
          <p data-section="internships" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}





    ${data.projects?.length ? `
    <div class="section" data-section="projects">
      <div class="section-title" data-section="projects">Projects</div>
      ${data.projects.map((project: any, index: number) => `
        <div class="entry" data-section="projects" data-index="${index}">
          <div class="entry-title" data-section="projects" data-index="${index}">${project.name || ''}</div>
          <div class="entry-subtitle" data-section="projects" data-index="${index}">${project.technologies || ''}</div>
          <p data-section="projects" data-index="${index}">${project.description || ''}</p>
          ${project.url ? `<p data-section="projects" data-index="${index}"><a href="${project.url}" target="_blank" style="color: var(--primary-color);">View Project</a></p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}


    ${data.academicProjects?.length ? `
    <div class="section" data-section="academicProjects">
      <div class="section-title" data-section="academicProjects">Academic Projects</div>
      ${data.academicProjects.map((item: any, index: number) => `
        <div class="entry" data-section="academicProjects" data-index="${index}">
          <div class="entry-title" data-section="academicProjects" data-index="${index}">${item.name || item.title || ''}</div>
          <div class="entry-subtitle" data-section="academicProjects" data-index="${index}">${item.institution || ''}</div>
          <div class="entry-date" data-section="academicProjects" data-index="${index}">${item.duration || ''}</div>
          <p data-section="academicProjects" data-index="${index}">${item.description || ''}</p>
          ${item.technologies ? `<p data-section="academicProjects" data-index="${index}"><strong>Technologies:</strong> ${item.technologies}</p>` : ''}
          ${item.url ? `<p data-section="academicProjects" data-index="${index}"><a href="${item.url}" target="_blank" style="color: var(--primary-color);">${item.url}</a></p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}


    ${data.leadershipPositions?.length ? `
    <div class="section" data-section="leadershipPositions">
      <div class="section-title" data-section="leadershipPositions">Leadership & Positions</div>
      ${data.leadershipPositions.map((item: any, index: number) => `
        <div class="entry" data-section="leadershipPositions" data-index="${index}">
          <div class="entry-title" data-section="leadershipPositions" data-index="${index}">${item.position || item.title || ''}</div>
          <div class="entry-subtitle" data-section="leadershipPositions" data-index="${index}">${item.organization || ''}</div>
          <div class="entry-date" data-section="leadershipPositions" data-index="${index}">${item.startDate || ''} – ${item.endDate || ''}</div>
          <p data-section="leadershipPositions" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}


    ${data.trainingPrograms?.length ? `
    <div class="section" data-section="trainingPrograms">
      <div class="section-title" data-section="trainingPrograms">Training Programs</div>
      ${data.trainingPrograms.map((item: any, index: number) => `
        <div class="entry" data-section="trainingPrograms" data-index="${index}">
          <div class="entry-title" data-section="trainingPrograms" data-index="${index}">${item.name || ''}</div>
          <div class="entry-subtitle" data-section="trainingPrograms" data-index="${index}">${item.provider || item.organization || ''}${item.duration ? ` | ${item.duration}` : ''}</div>
          <div class="entry-date" data-section="trainingPrograms" data-index="${index}">${item.completionDate || ''}</div>
          <p data-section="trainingPrograms" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}


    ${data.scholarships?.length ? `
    <div class="section" data-section="scholarships">
      <div class="section-title" data-section="scholarships">Scholarships</div>
      ${data.scholarships.map((item: any, index: number) => `
        <div class="entry" data-section="scholarships" data-index="${index}">
          <div class="entry-title" data-section="scholarships" data-index="${index}">${item.name || ''}</div>
          <div class="entry-subtitle" data-section="scholarships" data-index="${index}">${item.provider || item.organization || ''}${item.amount ? ` | ${item.amount}` : ''}</div>
          <div class="entry-date" data-section="scholarships" data-index="${index}">${item.year || ''}</div>
          <p data-section="scholarships" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}


    ${data.coCurricular?.length ? `
    <div class="section" data-section="coCurricular">
      <div class="section-title" data-section="coCurricular">Co-curricular Activities</div>
      ${data.coCurricular.map((item: any, index: number) => `
        <div class="entry" data-section="coCurricular" data-index="${index}">
          <div class="entry-title" data-section="coCurricular" data-index="${index}">${item.activity || ''}</div>
          <div class="entry-subtitle" data-section="coCurricular" data-index="${index}">${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
          <div class="entry-date" data-section="coCurricular" data-index="${index}">${item.year || (item.startDate ? `${item.startDate} – ${item.endDate || ''}` : '')}</div>
          <p data-section="coCurricular" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}


    ${data.extracurricular?.length ? `
    <div class="section" data-section="extracurricular">
      <div class="section-title" data-section="extracurricular">Extracurricular Activities</div>
      ${data.extracurricular.map((item: any, index: number) => `
        <div class="entry" data-section="extracurricular" data-index="${index}">
          <div class="entry-title" data-section="extracurricular" data-index="${index}">${item.activity || ''}</div>
          <div class="entry-subtitle" data-section="extracurricular" data-index="${index}">${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
          <div class="entry-date" data-section="extracurricular" data-index="${index}">${item.year || (item.startDate ? `${item.startDate} – ${item.endDate || ''}` : '')}</div>
          <p data-section="extracurricular" data-index="${index}">${item.description || ''}</p>
        </div>
      `).join('')}
    </div>` : ''}





    ${data.keyAchievements?.length ? `
    <div class="section" data-section="keyAchievements">
      <div class="section-title" data-section="keyAchievements">Key Achievements</div>
      <ul data-section="keyAchievements">
        ${data.keyAchievements.map((achievement: any, index: number) => `<li data-section="keyAchievements" data-index="${index}">${achievement}</li>`).join('')}
      </ul>
    </div>` : ''}



    ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line: string) => line.trim()).length > 0 ? `
    <div class="section" data-section="responsibilities">
      <div class="section-title" data-section="responsibilities">Key Responsibilities</div>
      <ul data-section="responsibilities">
        ${(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).filter((line: string) => line.trim()).map((line: string, index: number) => `<li data-section="responsibilities" data-index="${index}">${line.trim()}</li>`).join('')}
      </ul>
    </div>` : ''}



    ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line: string) => line.trim()).length > 0 ? `
    <div class="section" data-section="tools">
      <div class="section-title" data-section="tools">Tools & Technologies</div>
      <ul data-section="tools">
        ${(Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).filter((line: string) => line.trim()).map((line: string, index: number) => `<li data-section="tools" data-index="${index}">${line.trim()}</li>`).join('')}
      </ul>
    </div>` : ''}


    ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section: any) => section.isVisible).map((section: any) => `
    <div class="section" data-section="customSections">
      <div class="section-title" data-section="customSections">${section.heading || 'Custom Section'}</div>
      ${section.entries && section.entries.length > 0 ? section.entries.filter((entry: any) => entry.isVisible).map((entry: any, entryIndex: number) => `
        <div class="entry" data-section="customSections" data-index="${entryIndex}">
          <div class="entry-title" data-section="customSections" data-index="${entryIndex}">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
          ${entry.date ? `<div class="entry-date" data-section="customSections" data-index="${entryIndex}">${entry.date}</div>` : ''}
          ${entry.description ? `<p data-section="customSections" data-index="${entryIndex}">${entry.description}</p>` : ''}
        </div>
      `).join('') : '<p style="color: #777; font-style: italic;">No entries in this section</p>'}
    </div>
    `).join('') : ''}

</div>
</body>
</html>`
}
