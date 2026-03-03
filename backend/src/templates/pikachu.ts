export function buildPikachuTemplate(data: any, theme?: any): string {
  const defaultTheme = {
    primary: '#000000',
    secondary: '#000000',
    background: '#ffffff',
    headingFont: 'Times New Roman, serif',
    bodyFont: 'Times New Roman, serif'
  }
  const currentTheme = theme || defaultTheme

  // Font size and family from data (user settings)
  const userFontSize = data.formatting?.bodyFontSize || data.fontSize || 12 
  const userFontFamily = data.formatting?.fontFamily || data.fontFamily || 'Times New Roman, serif'

  // Calculate responsive font sizes based on user font size
  const baseFontSize = userFontSize

  // Helper function to check if an array has meaningful content
  const hasContent = (arr: any): boolean => {
    if (!arr || !Array.isArray(arr)) return false;
    if (arr.length === 0) return false;
    // Check if any item has non-empty content
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

  // Helper to safely get non-empty array
  const getNonEmptyArray = (arr: any): any[] => {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter((item: any) => {
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
  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --primary-color: ${currentTheme.primary};
    --secondary-color: ${currentTheme.secondary};
    --background-color: ${currentTheme.background};
  }

  body {
    font-family: ${userFontFamily};
    font-size: ${baseFontSize}px;
    color: #000000;
    background: #f3f4f6; /* Light gray background for preview mode */
    line-height: 1.4;
    padding: 20px;
  }

  /* OUTER BORDER (Double border effect from screenshot) */
  .outer-border {
    background: #ffffff;
    border: 1px solid #000000;
    padding: 4px;
    max-width: 850px;
    margin: 0 auto;
  }

  /* INNER CONTAINER */
  .container {
    border: 1px solid #000000;
    padding: 40px;
    min-height: 1000px;
    background: #ffffff;
  }

  /* ===== HEADER (Screenshot Style) ===== */
  .cv-title {
    text-align: center;
    font-size: ${baseFontSize + 2}px;
    margin-bottom: 25px;
    text-transform: none;
  }

  .header-flex {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .name {
    font-size: ${baseFontSize + 4}px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 5px;
    text-decoration: underline;
  }

  .contact-info {
    font-size: ${baseFontSize}px;
    color: #000000;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .contact-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .profile-photo {
    width: 120px;
    height: 140px;
    border: 1px solid #000;
    object-fit: cover;
    background: #eee;
  }

  .profile-photo-container {
    position: relative;
    width: 120px;
    height: 140px;
    flex-shrink: 0;
  }

  .photo-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    border: 1px solid #000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 12px;
    text-align: center;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* ===== SECTIONS (Screenshot Style) ===== */
  .section {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  .section-title {
    font-size: ${baseFontSize + 1}px;
    font-weight: bold;
    text-transform: uppercase;
    text-decoration: underline;
    display: block;
    margin-bottom: 4px;
  }

  .horizontal-line {
    border-top: 1.5px solid #000000;
    margin-bottom: 10px;
  }

  /* ===== CONTENT & BULLETS ===== */
  .entry {
    margin-bottom: 15px;
  }

  .entry-title-bold {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

  .label-underline {
    font-weight: bold;
    text-decoration: underline;
    margin: 10px 0 5px 0;
    display: block;
  }

  ul {
    list-style-type: none;
    padding-left: 20px;
  }

  li {
    position: relative;
    padding-left: 20px;
    margin-bottom: 4px;
  }

  /* Arrow bullet from screenshot */
  li::before {
    content: "➤";
    position: absolute;
    left: 0;
    font-size: 10px;
    top: 3px;
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
  }

  @media print {
    body { background: none; padding: 0; }
    .outer-border { border: 1px solid #000; max-width: 100%; margin: 0; }
    .container { border: 1px solid #000; }
  }
</style>
</head>
<body>
<div class="outer-border">
<div class="container">
  <div class="cv-title">Curriculum Vitae</div>

  <div class="header-flex" data-section="personal">
    <div class="personal-info">
      <div class="name" data-section="personal">${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : "DEBANJALI LENKA"}</div>
      ${data.personal?.role ? `<div style="font-size: 16px; color: #64748b; margin-bottom: 10px; font-weight: 600;">${data.personal.role}</div>` : ''}

      ${(data.personal?.email || data.personal?.phone || data.personal?.alternatePhone || data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.linkedinUrl || data.personal?.githubUrl || data.personal?.portfolioUrl || data.personal?.website || data.personal?.twitterUrl || data.personal?.facebookUrl || data.personal?.instagramUrl || data.personal?.behanceUrl || data.personal?.dribbbleUrl || data.personal?.stackoverflowUrl || data.personal?.mediumUrl) ? `
      <div class="contact-info">
        <!-- Address Line -->
        <div class="contact-row">
          ${data.personal?.location || data.personal?.country || data.personal?.pinCode || data.personal?.fullAddress ? `<div class="contact-item">${[data.personal?.location, data.personal?.country, data.personal?.pinCode, data.personal?.fullAddress].filter(Boolean).join(', ')}</div>` : ""}
        </div>

        <!-- Contact Line -->
        <div class="contact-row">
          ${data.personal?.email ? `<div class="contact-item">${data.personal.email}</div>` : ""}
          ${data.personal?.phone ? `<div class="contact-item">${data.personal.phone}</div>` : ""}
          ${data.personal?.alternatePhone ? `<div class="contact-item">${data.personal.alternatePhone}</div>` : ""}
        </div>

        <!-- URLs Line -->
        <div class="contact-row">
          ${data.personal?.linkedinUrl ? `<div class="contact-item"><a href="${data.personal.linkedinUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">LinkedIn</a></div>` : ""}
          ${data.personal?.githubUrl ? `<div class="contact-item"><a href="${data.personal.githubUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">GitHub</a></div>` : ""}
          ${data.personal?.portfolioUrl ? `<div class="contact-item"><a href="${data.personal.portfolioUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Portfolio</a></div>` : ""}
          ${data.personal?.website ? `<div class="contact-item"><a href="${data.personal.website}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Website</a></div>` : ""}
          ${data.personal?.twitterUrl ? `<div class="contact-item"><a href="${data.personal.twitterUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Twitter</a></div>` : ""}
          ${data.personal?.facebookUrl ? `<div class="contact-item"><a href="${data.personal.facebookUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Facebook</a></div>` : ""}
          ${data.personal?.instagramUrl ? `<div class="contact-item"><a href="${data.personal.instagramUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Instagram</a></div>` : ""}
          ${data.personal?.behanceUrl ? `<div class="contact-item"><a href="${data.personal.behanceUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Behance</a></div>` : ""}
          ${data.personal?.dribbbleUrl ? `<div class="contact-item"><a href="${data.personal.dribbbleUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Dribbble</a></div>` : ""}
          ${data.personal?.stackoverflowUrl ? `<div class="contact-item"><a href="${data.personal.stackoverflowUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Stack Overflow</a></div>` : ""}
          ${data.personal?.mediumUrl ? `<div class="contact-item"><a href="${data.personal.mediumUrl}" target="_blank" style="color: var(--primary-color); text-decoration: none;">Medium</a></div>` : ""}
        </div>

        <!-- Personal Details Row -->
        <div class="contact-row">
          ${data.personal?.fathersName ? `<div class="contact-item">Father's Name: ${data.personal.fathersName}</div>` : ""}
          ${data.personal?.dob ? `<div class="contact-item">DOB: ${data.personal.dob}</div>` : ""}
          ${data.personal?.gender ? `<div class="contact-item">Gender: ${data.personal.gender}</div>` : ""}
          ${data.personal?.maritalStatus ? `<div class="contact-item">Marital Status: ${data.personal.maritalStatus}</div>` : ""}
        </div>
      </div>
      ` : ''}
    </div>
    
    <div class="profile-photo-container">
      ${data.personal?.image ?
      `<img src="${data.personal.image}" alt="${data.personal?.name && data.personal?.name !== 'undefined' ? data.personal.name : 'Profile Photo'}" class="profile-photo" />` :
      `<div class="photo-placeholder">Profile Photo</div>`
    }
    </div>
  </div>

  <div class="content-wrapper">
      ${(data.sectionVisibility?.summary !== false && data.summary) ? `
      <div class="section" data-section="summary">
        <span class="section-title">CAREER OBJECTIVE</span>
        <div class="horizontal-line"></div>
        <p class="summary-text">${data.summary}</p>
        <div class="horizontal-line" style="margin-top:10px"></div>
      </div>` : ''}

      ${(typeof data.careerObjective === "string" && data.careerObjective.trim().length > 0) ? `
      <div class="section" data-section="careerObjective">
        <span class="section-title">CAREER OBJECTIVE</span>
        <div class="horizontal-line"></div>
        <p class="summary-text">${data.careerObjective}</p>
        <div class="horizontal-line" style="margin-top:10px"></div>
      </div>` : ''}

      ${(data.sectionVisibility?.experience !== false && data.experience && data.experience.length > 0) ? `
      <div class="section" data-section="experience">
        <span class="section-title">WORK EXPERIENCE</span>
        <div class="horizontal-line"></div>
        ${(data.experience || []).map((exp: any, index: number) => `
          <div class="entry" data-section="experience" data-index="${index}">
            <span class="entry-title-bold">${exp.company || ''} (${exp.startDate || ''} - ${exp.endDate || 'Present'})</span>
            <div style="margin-left: 10px;">
                <div>${exp.title || ''}${exp.location ? ` - ${exp.location}` : ''}</div>
                <span class="label-underline">Job Responsibilities:</span>
                <ul>
                  ${(exp.description || '').split('\\n').filter((l:string)=>l.trim()).map((line: string) => `<li>${line.replace(/^[•*-]\\s*/, '')}</li>`).join('')}
                </ul>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.internships && data.internships.length > 0) ? `
      <div class="section" data-section="internships">
        <span class="section-title">INTERNSHIPS</span>
        <div class="horizontal-line"></div>
        ${(data.internships || []).map((item: any, index: number) => `
          <div class="entry" data-section="internships" data-index="${index}">
            <span class="entry-title-bold">${item.company || ''} (${item.startDate || ''} - ${item.endDate || ''})</span>
            <div style="margin-left: 10px;">
                <div>${item.title || ''}${item.location ? ` - ${item.location}` : ''}</div>
                <ul>
                  ${(item.description || '').split('\\n').filter((l:string)=>l.trim()).map((line: string) => `<li>${line.replace(/^[•*-]\\s*/, '')}</li>`).join('')}
                </ul>
            </div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.education !== false && data.education && data.education.length > 0) ? `
      <div class="section" data-section="education">
        <span class="section-title">EDUCATION</span>
        <div class="horizontal-line"></div>
        ${(data.education || []).map((edu: any, index: number) => `
          <div class="entry" data-section="education" data-index="${index}">
            <span class="entry-title-bold">${edu.school || ''}</span>
            <div>${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''} (${edu.graduationDate || ''})</div>
            ${edu.description ? `<div style="font-style: italic; font-size: 0.9em; margin-top:5px;">${edu.description}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.academicProjects && data.academicProjects.length > 0) ? `
      <div class="section" data-section="academicProjects">
        <span class="section-title">ACADEMIC PROJECTS</span>
        <div class="horizontal-line"></div>
        ${(data.academicProjects || []).map((item: any, index: number) => `
          <div class="entry" data-section="academicProjects" data-index="${index}">
            <span class="entry-title-bold">${item.name || item.title || ''}</span>
            <div>${item.institution || ''}</div>
            ${item.duration ? `<div>${item.duration}</div>` : ''}
            <div>${item.description || ''}</div>
            ${item.technologies ? `<div><strong>Technologies:</strong> ${item.technologies}</div>` : ''}
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.skills !== false && data.skills) ? `
      <div class="section" data-section="skills">
        <span class="section-title">SKILLS & TOOLS</span>
        <div class="horizontal-line"></div>
        <div class="skills-grid">
          ${(Array.isArray(data.skills) ? data.skills : (data.skills || '').split(',')).map((skill: any) => `
            <li>${typeof skill === 'string' ? skill.trim() : skill}</li>
          `).join('')}
        </div>
      </div>` : ''}

      ${(data.sectionVisibility?.projects !== false && data.projects && data.projects.length > 0) ? `
      <div class="section" data-section="projects">
        <span class="section-title">PROJECTS</span>
        <div class="horizontal-line"></div>
        ${(data.projects || []).map((project: any, index: number) => `
          <div class="entry" data-index="${index}">
            <span class="entry-title-bold">${project.name || ''}</span>
            ${project.image ? `<img src="${project.image}" class="project-image" />` : ''}
            <p>${project.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.certifications !== false && data.certifications && data.certifications.length > 0) ? `
      <div class="section" data-section="certifications">
        <span class="section-title">CERTIFICATIONS</span>
        <div class="horizontal-line"></div>
        <ul>
          ${data.certifications.map((cert: any) => `<li>${cert.name} - ${cert.issuer}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${(data.leadershipPositions && data.leadershipPositions.length > 0) ? `
      <div class="section" data-section="leadershipPositions">
        <span class="section-title">LEADERSHIP & POSITIONS</span>
        <div class="horizontal-line"></div>
        ${(data.leadershipPositions || []).map((item: any, index: number) => `
          <div class="entry" data-section="leadershipPositions" data-index="${index}">
            <span class="entry-title-bold">${item.position || item.title || ''}</span>
            <div>${item.organization || ''} (${item.startDate || ''} - ${item.endDate || ''})</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.trainingPrograms && data.trainingPrograms.length > 0) ? `
      <div class="section" data-section="trainingPrograms">
        <span class="section-title">TRAINING PROGRAMS</span>
        <div class="horizontal-line"></div>
        ${(data.trainingPrograms || []).map((item: any, index: number) => `
          <div class="entry" data-section="trainingPrograms" data-index="${index}">
            <span class="entry-title-bold">${item.name || ''}</span>
            <div>${item.provider || item.organization || ''}${item.duration ? ` | ${item.duration}` : ''}</div>
            ${item.completionDate ? `<div>${item.completionDate}</div>` : ''}
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.scholarships && data.scholarships.length > 0) ? `
      <div class="section" data-section="scholarships">
        <span class="section-title">SCHOLARSHIPS</span>
        <div class="horizontal-line"></div>
        ${(data.scholarships || []).map((item: any, index: number) => `
          <div class="entry" data-section="scholarships" data-index="${index}">
            <span class="entry-title-bold">${item.name || ''}</span>
            <div>${item.provider || item.organization || ''}${item.amount ? ` | ${item.amount}` : ''}</div>
            ${item.year ? `<div>${item.year}</div>` : ''}
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.coCurricular && data.coCurricular.length > 0) ? `
      <div class="section" data-section="coCurricular">
        <span class="section-title">CO-CURRICULAR ACTIVITIES</span>
        <div class="horizontal-line"></div>
        ${(data.coCurricular || []).map((item: any, index: number) => `
          <div class="entry" data-section="coCurricular" data-index="${index}">
            <span class="entry-title-bold">${item.activity || ''}</span>
            <div>${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
            <div>${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.extracurricular && data.extracurricular.length > 0) ? `
      <div class="section" data-section="extracurricular">
        <span class="section-title">EXTRACURRICULAR ACTIVITIES</span>
        <div class="horizontal-line"></div>
        ${(data.extracurricular || []).map((item: any, index: number) => `
          <div class="entry" data-section="extracurricular" data-index="${index}">
            <span class="entry-title-bold">${item.activity || ''}</span>
            <div>${item.organization || ''}${item.role ? ` | ${item.role}` : ''}</div>
            <div>${item.year || (item.startDate ? `${item.startDate} - ${item.endDate || ''}` : '')}</div>
            <div>${item.description || ''}</div>
          </div>
        `).join('')}
      </div>` : ''}

      ${(data.sectionVisibility?.languages !== false && data.languages && data.languages.length > 0) ? `
      <div class="section" data-section="languages">
        <span class="section-title">LANGUAGES</span>
        <div class="horizontal-line"></div>
        <ul>
          ${data.languages.map((lang: any) => `<li>${lang.language || lang}${lang.level ? ` (${lang.level})` : ''}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${(data.sectionVisibility?.hobbies !== false && data.hobbies && data.hobbies.length > 0) ? `
      <div class="section" data-section="hobbies">
        <span class="section-title">HOBBIES & INTERESTS</span>
        <div class="horizontal-line"></div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
          ${data.hobbies.map((hobby: any) => `<div style="background: #f1f5f9; color: #475569; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 500;">${hobby}</div>`).join('')}
        </div>
      </div>` : ''}

      ${(data.sectionVisibility?.socialLinks !== false && data.socialLinks && data.socialLinks.length > 0) ? `
      <div class="section" data-section="socialLinks">
        <span class="section-title">SOCIAL LINKS</span>
        <div class="horizontal-line"></div>
        <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
          ${data.socialLinks.map((link: any) => `<a href="${link.url}" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: 500; font-size: ${baseFontSize}px;">${link.urlText || link.url.replace('https://', '').replace('http://', '')}</a>`).join('')}
        </div>
      </div>` : ''}

      ${data.keyAchievements && data.keyAchievements.length > 0 ? `
      <div class="section" data-section="keyAchievements">
        <span class="section-title">KEY ACHIEVEMENTS</span>
        <div class="horizontal-line"></div>
        <ul>
          ${data.keyAchievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${hasContent(data.responsibilities) ? `
      <div class="section" data-section="responsibilities">
        <span class="section-title">KEY RESPONSIBILITIES</span>
        <div class="horizontal-line"></div>
        <ul>
          ${getNonEmptyArray(Array.isArray(data.responsibilities) ? data.responsibilities : (data.responsibilities || '').split('\n')).map((line: string) => `<li>${line.trim()}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${hasContent(data.tools) ? `
      <div class="section" data-section="tools">
        <span class="section-title">TOOLS & TECHNOLOGIES</span>
        <div class="horizontal-line"></div>
        <ul>
          ${getNonEmptyArray(Array.isArray(data.tools) ? data.tools : (data.tools || '').split('\n')).map((line: string) => `<li>${line.trim()}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${data.customSections && data.customSections.length > 0 ? data.customSections.filter((section: any) => section.isVisible).map((section: any) => {
        const heading = section.heading || 'Custom Section';
        if (heading === 'Social Links') {
          return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div class="horizontal-line"></div>
          <div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 15px;">
            ${section.entries && section.entries.length > 0 ? section.entries.filter((entry: any) => entry.isVisible).map((entry: any, entryIndex: number) => `
              <div style="display: flex; align-items: center; gap: 8px;" data-section="socialLinks" data-index="${entryIndex}">
                <span style="font-weight: 600; color: var(--primary-color); font-size: ${baseFontSize}px;">${entry.title || 'Link'}:</span>
                <a href="${entry.organization || entry.description || '#'}" target="_blank" style="color: var(--primary-color); text-decoration: none; font-weight: 500; font-size: ${baseFontSize}px;">${(entry.organization || entry.description || '').replace('https://', '').replace('http://', '')}</a>
              </div>
            `).join('') : '<div style="color: #64748b; font-style: italic;">No social links added</div>'}
          </div>
        </div>
      `;
        } else if (heading === 'Languages') {
          return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div class="horizontal-line"></div>
          <div>
            ${section.entries && section.entries.length > 0 ? section.entries.filter((entry: any) => entry.isVisible).map((entry: any, entryIndex: number) => `
              <div style="margin-bottom: 8px; font-size: 13px; color: #475569;" data-section="customSections" data-index="${entryIndex}">
                <span style="font-weight: 600;">${entry.title || entry.organization || 'Language'}</span>
                ${entry.description ? `<span style="color: #64748b; margin-left: 8px;">(${entry.description})</span>` : ''}
              </div>
            `).join('') : '<div style="color: #64748b; font-style: italic;">No languages added</div>'}
          </div>
        </div>
      `;
        } else if (heading === 'Hobbies & Interests') {
          return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div class="horizontal-line"></div>
          <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
            ${section.entries && section.entries.length > 0 ? section.entries.filter((entry: any) => entry.isVisible).map((entry: any, entryIndex: number) => `
              <div style="background: #f1f5f9; color: #475569; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 500;" data-section="customSections" data-index="${entryIndex}">${entry.title || entry.organization || entry.description || 'Hobby'}</div>
            `).join('') : '<div style="color: #64748b; font-style: italic;">No hobbies added</div>'}
          </div>
        </div>
      `;
        } else if (heading === 'Key Achievements') {
          return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div class="horizontal-line"></div>
          <div class="entry-content">
            <ul>
              ${section.entries && section.entries.length > 0 ? section.entries.filter((entry: any) => entry.isVisible).map((entry: any, entryIndex: number) => `<li data-section="customSections" data-index="${entryIndex}">${entry.title || entry.organization || entry.description || 'Achievement'}</li>`).join('') : '<li style="color: #64748b; font-style: italic;">No achievements added</li>'}
            </ul>
          </div>
        </div>
      `;
        } else if (heading === 'Responsibilities') {
          return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div class="horizontal-line"></div>
          <div class="entry-content">
            <ul>
              ${section.entries && section.entries.length > 0 ? section.entries.filter((entry: any) => entry.isVisible).map((entry: any, entryIndex: number) => `<li data-section="customSections" data-index="${entryIndex}">${entry.title || entry.organization || entry.description || 'Responsibility'}</li>`).join('') : '<li style="color: #64748b; font-style: italic;">No responsibilities added</li>'}
            </ul>
          </div>
        </div>
      `;
        } else if (heading === 'Tools & Technologies') {
          return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div class="horizontal-line"></div>
          <div class="entry-content">
            <ul>
              ${section.entries && section.entries.length > 0 ? section.entries.filter((entry: any) => entry.isVisible).map((entry: any, entryIndex: number) => `<li data-section="customSections" data-index="${entryIndex}">${entry.title || entry.organization || entry.description || 'Tool'}</li>`).join('') : '<li style="color: #64748b; font-style: italic;">No tools added</li>'}
            </ul>
          </div>
        </div>
      `;
        } else {
          // Default custom section rendering
          return `
        <div class="section" data-section="customSections">
          <div class="section-title">${heading}</div>
          <div class="horizontal-line"></div>
          ${section.entries && section.entries.length > 0 ? section.entries.filter((entry: any) => entry.isVisible).map((entry: any, entryIndex: number) => `
            <div class="entry" data-index="${entryIndex}">
              <div class="entry-title">${entry.title || ''}${entry.title && entry.organization ? ' at ' : ''}${entry.organization || ''}</div>
              ${entry.date ? `<div class="entry-subtitle">${entry.date}</div>` : ''}
              ${entry.description ? `<div class="entry-content">${entry.description}</div>` : ''}
            </div>
          `).join('') : '<div style="color: #64748b; font-style: italic;">No entries in this section</div>'}
        </div>
      `;
        }
      }).join('') : ""}

    </div>
  </div>
</div>
</body>
</html>`
}

